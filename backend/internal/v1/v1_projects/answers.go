package v1_projects

import (
	"KonferCA/SPUR/db"
	"KonferCA/SPUR/internal/middleware"
	"KonferCA/SPUR/internal/v1/v1_common"
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

/*
 * package v1_projects implements project answer management endpoints.
 * this file handles saving, updating, and validating project answers.
 */

/*
 * handleSaveProjectDraft updates a batch of answers for a project.
 * these answers must be of type string or array of string.
 *
 * parameters:
 * - project id from url param
 * - draft request body with array of answers
 *
 * security:
 * - verifies project belongs to user's company
 *
 * returns:
 * - 200 ok on success
 * - appropriate error responses for invalid requests
 */
func (h *Handler) handleSaveProjectDraft(c echo.Context) error {
	logger := middleware.GetLogger(c)

	projectID := c.Param("id")
	if projectID == "" {
		return v1_common.Fail(c, http.StatusBadRequest, "Project ID is required", nil)
	}

	var req SaveProjectDraftRequest
	if err := v1_common.BindandValidate(c, &req); err != nil {
		return v1_common.Fail(c, http.StatusBadRequest, "Invalid request body", err)
	}

	q := h.server.GetQueries()

	var params []db.UpdateProjectDraftParams
	for _, item := range req.Draft {
		var answer string
		var choices []string

		switch v := item.Answer.(type) {
		case string:
			answer = v
		case []interface{}:
			for _, choice := range v {
				if str, ok := choice.(string); ok {
					choices = append(choices, str)
				}
			}
		default:
			logger.Warn(fmt.Sprintf("Skipping saving answer for question (%s) as it has unsupported type.", item.QuestionID))
			continue
		}

		params = append(params, db.UpdateProjectDraftParams{
			ProjectID:  projectID,
			QuestionID: item.QuestionID,
			Answer:     answer,
			Choices:    choices,
		})
	}
	batch := q.UpdateProjectDraft(c.Request().Context(), params)
	defer batch.Close()
	batch.Exec(func(i int, err error) {
		if err != nil {
			v1_common.Fail(c, http.StatusInternalServerError, "Failed to save draft", err)
		}
	})

	if !c.Response().Committed {
		return v1_common.Success(c, http.StatusOK, "Draft saved")
	}
	return nil
}

/*
 * handlePatchProjectAnswer updates an answer for a project question.
 *
 * parameters:
 * - project id from url param
 * - request body with answer id and content
 *
 * validation:
 * - validates answer content against question rules
 * - returns validation errors if content invalid
 *
 * security:
 * - verifies project belongs to user's company
 *
 * returns:
 * - 200 ok with success message on successful update
 * - appropriate error responses for validation failures
 */
func (h *Handler) handlePatchProjectAnswer(c echo.Context) error {
	// Validate static parameters first
	projectID := c.Param("id")
	if projectID == "" {
		return v1_common.Fail(c, http.StatusBadRequest, "Project ID is required", nil)
	}

	// Parse and validate request body
	var req PatchAnswerRequest
	if err := c.Bind(&req); err != nil {
		return v1_common.Fail(c, 400, "Invalid request body", err)
	}

	// Get authenticated user
	user, err := getUserFromContext(c)
	if err != nil {
		return v1_common.Fail(c, http.StatusUnauthorized, "Unauthorized", err)
	}

	q := h.server.GetQueries()

	// Check company
	company, err := q.GetCompanyByOwnerID(c.Request().Context(), user.ID)
	if err != nil {
		return v1_common.Fail(c, http.StatusNotFound, "Company not found", err)
	}

	// Verify project belongs to user's company
	project, err := q.GetProjectByID(c.Request().Context(), projectID)
	if err != nil {
		return v1_common.Fail(c, http.StatusNotFound, "Project not found", err)
	}

	if project.CompanyID != company.ID {
		return v1_common.Fail(c, http.StatusForbidden, "Project does not belong to your company", nil)
	}

	// Update the answer
	logger := middleware.GetLogger(c)

	result, err := q.UpdateProjectAnswer(c.Request().Context(), db.UpdateProjectAnswerParams{
		Answer:    req.Content,
		ID:        req.AnswerID,
		ProjectID: projectID,
	})

	if err != nil {
		if err == sql.ErrNoRows {
			return v1_common.Fail(c, 404, "Answer not found", err)
		}
		return v1_common.Fail(c, 500, "Failed to update answer", err)
	}

	return c.JSON(200, map[string]string{
		"message": "Answer updated successfully",
	})
}

/*
 * handleGetProjectAnswers returns all answers for a project.
 *
 * parameters:
 * - project id from url param
 *
 * security:
 * - verifies user has access to project
 *
 * returns:
 * - array of project answers with question details
 * - empty array if no answers found
 */
func (h *Handler) handleGetProjectAnswers(c echo.Context) error {
	user, err := getUserFromContext(c)
	if err != nil {
		return v1_common.Fail(c, http.StatusUnauthorized, "Unauthorized", err)
	}

	// Get company owned by user
	company, err := h.server.GetQueries().GetCompanyByUserID(c.Request().Context(), user.ID)
	if err != nil {
		return v1_common.Fail(c, 404, "Company not found", err)
	}

	// Get project ID from URL
	projectID := c.Param("id")
	if projectID == "" {
		return v1_common.Fail(c, 400, "Project ID is required", nil)
	}

	// Get project answers
	answers, err := h.server.GetQueries().GetProjectAnswers(c.Request().Context(), projectID)
	if err != nil {
		return v1_common.Fail(c, 500, "Failed to get project answers", err)
	}

	// Verify project belongs to company
	_, err = h.server.GetQueries().GetProjectByID(c.Request().Context(), db.GetProjectByIDParams{
		ID:        projectID,
		CompanyID: company.ID,
	})
	if err != nil {
		return v1_common.Fail(c, 404, "Project not found", err)
	}

	// Convert to response format
	response := make([]ProjectAnswerResponse, len(answers))
	for i, a := range answers {
		response[i] = ProjectAnswerResponse{
			ID:         a.AnswerID,
			QuestionID: a.QuestionID,
			Question:   a.Question,
			Answer:     a.Answer,
			Section:    a.Section,
		}
	}

	return c.JSON(200, map[string]interface{}{
		"answers": response,
	})
}

/*
 * handleCreateAnswer creates a new answer for a project question.
 *
 * parameters:
 * - project id from url param
 * - request body with question id and answer content
 *
 * validation:
 * - checks if question exists
 * - validates answer against question rules
 *
 * returns:
 * - 200 ok with new answer data on success
 * - validation errors if answer doesn't meet requirements
 */
func (h *Handler) handleCreateAnswer(c echo.Context) error {
	var req CreateAnswerRequest

	if err := v1_common.BindandValidate(c, &req); err != nil {
		if strings.Contains(err.Error(), "required") {
			return v1_common.Fail(c, http.StatusBadRequest, "Question ID is required", err)
		}
		return v1_common.Fail(c, http.StatusNotFound, "Question not found", err)
	}

	// Get project ID from URL
	projectID := c.Param("id")
	if projectID == "" {
		return v1_common.Fail(c, http.StatusBadRequest, "Project ID is required", nil)
	}

	// Verify question exists and validate answer
	question, err := h.server.GetQueries().GetProjectQuestion(c.Request().Context(), req.QuestionID)
	if err != nil {
		return v1_common.Fail(c, http.StatusNotFound, "Question not found", err)
	}

	if question.Validations != nil {
		if !isValidAnswer(req.Content, question.Validations) {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"validation_errors": []ValidationError{
					{
						Question: question.Question,
						Message:  getValidationMessage(question.Validations),
					},
				},
			})
		}
	}

	// Create the answer
	answer, err := h.server.GetQueries().CreateProjectAnswer(c.Request().Context(), db.CreateProjectAnswerParams{
		ProjectID:  projectID,
		QuestionID: req.QuestionID,
		Answer:     req.Content,
	})
	if err != nil {
		return v1_common.Fail(c, http.StatusInternalServerError, "Failed to create answer", err)
	}

	return c.JSON(http.StatusOK, answer)
}
