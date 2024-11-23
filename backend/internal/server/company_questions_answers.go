package server

import (
	"net/http"

	"github.com/KonferCA/NoKap/db"
	mw "github.com/KonferCA/NoKap/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (s *Server) handleCreateQuestion(c echo.Context) error {
	var req *CreateQuestionRequest
	req, ok := c.Get(mw.REQUEST_BODY_KEY).(*CreateQuestionRequest)
	if !ok {
		return echo.NewHTTPError(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)
	question, err := queries.CreateQuestion(ctx, req.QuestionText)
	if err != nil {
		return handleDBError(err, "create", "question")
	}

	return c.JSON(http.StatusCreated, question)
}

func (s *Server) handleGetQuestion(c echo.Context) error {
	questionID, err := validateUUID(c.Param("id"), "question")
	if err != nil {
		return err
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)
	question, err := queries.GetQuestion(ctx, questionID)
	if err != nil {
		return handleDBError(err, "fetch", "question")
	}

	return c.JSON(http.StatusOK, question)
}

func (s *Server) handleListQuestions(c echo.Context) error {
	ctx := c.Request().Context()
	queries := db.New(s.DBPool)
	questions, err := queries.ListQuestions(ctx)
	if err != nil {
		return handleDBError(err, "fetch", "questions")
	}

	return c.JSON(http.StatusOK, questions)
}

func (s *Server) handleCreateCompanyAnswer(c echo.Context) error {
	companyID, err := validateUUID(c.Param("id"), "company")
	if err != nil {
		return err
	}

	var req *CreateCompanyAnswerRequest
	req, ok := c.Get(mw.REQUEST_BODY_KEY).(*CreateCompanyAnswerRequest)
	if !ok {
		return echo.NewHTTPError(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	}

	questionID, err := validateUUID(req.QuestionID, "question")
	if err != nil {
		return err
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)

	_, err = queries.GetCompanyByID(ctx, companyID)
	if err != nil {
		return handleDBError(err, "verify", "company")
	}

	_, err = queries.GetQuestion(ctx, questionID)
	if err != nil {
		return handleDBError(err, "verify", "question")
	}

	params := db.CreateCompanyAnswerParams{
		CompanyID:  companyID,
		QuestionID: questionID,
		AnswerText: req.AnswerText,
	}

	answer, err := queries.CreateCompanyAnswer(ctx, params)
	if err != nil {
		return handleDBError(err, "create", "company answer")
	}

	return c.JSON(http.StatusCreated, answer)
}

func (s *Server) handleGetCompanyAnswer(c echo.Context) error {
	companyID, err := validateUUID(c.Param("company_id"), "company")
	if err != nil {
		return err
	}

	questionID, err := validateUUID(c.Param("question_id"), "question")
	if err != nil {
		return err
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)

	params := db.GetCompanyAnswerParams{
		CompanyID:  companyID,
		QuestionID: questionID,
	}

	answer, err := queries.GetCompanyAnswer(ctx, params)
	if err != nil {
		return handleDBError(err, "fetch", "company answer")
	}

	return c.JSON(http.StatusOK, answer)
}

func (s *Server) handleListCompanyAnswers(c echo.Context) error {
	companyID, err := validateUUID(c.Param("id"), "company")
	if err != nil {
		return err
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)

	answers, err := queries.ListCompanyAnswers(ctx, companyID)
	if err != nil {
		return handleDBError(err, "fetch", "company answers")
	}

	return c.JSON(http.StatusOK, answers)
}

func (s *Server) handleUpdateCompanyAnswer(c echo.Context) error {
	companyID, err := validateUUID(c.Param("company_id"), "company")
	if err != nil {
		return err
	}

	questionID, err := validateUUID(c.Param("question_id"), "question")
	if err != nil {
		return err
	}

	var req *UpdateCompanyAnswerRequest
	req, ok := c.Get(mw.REQUEST_BODY_KEY).(*UpdateCompanyAnswerRequest)
	if !ok {
		return echo.NewHTTPError(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)

	_, err = queries.GetCompanyAnswer(ctx, db.GetCompanyAnswerParams{
		CompanyID:  companyID,
		QuestionID: questionID,
	})
	if err != nil {
		return handleDBError(err, "verify", "company answer")
	}

	params := db.UpdateCompanyAnswerParams{
		CompanyID:  companyID,
		QuestionID: questionID,
		AnswerText: req.AnswerText,
	}

	answer, err := queries.UpdateCompanyAnswer(ctx, params)
	if err != nil {
		return handleDBError(err, "update", "company answer")
	}

	return c.JSON(http.StatusOK, answer)
}

func (s *Server) handleDeleteCompanyAnswer(c echo.Context) error {
	companyID, err := validateUUID(c.Param("company_id"), "company")
	if err != nil {
		return err
	}

	questionID, err := validateUUID(c.Param("question_id"), "question")
	if err != nil {
		return err
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)

	_, err = queries.GetCompanyAnswer(ctx, db.GetCompanyAnswerParams{
		CompanyID:  companyID,
		QuestionID: questionID,
	})
	if err != nil {
		return handleDBError(err, "verify", "company answer")
	}

	params := db.SoftDeleteCompanyAnswerParams{
		CompanyID:  companyID,
		QuestionID: questionID,
	}

	err = queries.SoftDeleteCompanyAnswer(ctx, params)
	if err != nil {
		return handleDBError(err, "delete", "company answer")
	}

	return c.NoContent(http.StatusNoContent)
}

func (s *Server) handleDeleteQuestion(c echo.Context) error {
	questionID, err := validateUUID(c.Param("id"), "question")
	if err != nil {
		return err
	}

	ctx := c.Request().Context()
	queries := db.New(s.DBPool)
	err = queries.SoftDeleteQuestion(ctx, questionID)
	if err != nil {
		return handleDBError(err, "delete", "question")
	}

	return c.NoContent(http.StatusNoContent)
}