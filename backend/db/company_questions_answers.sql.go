// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: company_questions_answers.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createCompanyAnswer = `-- name: CreateCompanyAnswer :one
INSERT INTO company_question_answers (
    company_id,
    question_id,
    answer_text
) VALUES (
    $1, $2, $3
)
RETURNING id, company_id, question_id, answer_text, created_at, updated_at, deleted_at
`

type CreateCompanyAnswerParams struct {
	CompanyID  string
	QuestionID string
	AnswerText string
}

func (q *Queries) CreateCompanyAnswer(ctx context.Context, arg CreateCompanyAnswerParams) (CompanyQuestionAnswer, error) {
	row := q.db.QueryRow(ctx, createCompanyAnswer, arg.CompanyID, arg.QuestionID, arg.AnswerText)
	var i CompanyQuestionAnswer
	err := row.Scan(
		&i.ID,
		&i.CompanyID,
		&i.QuestionID,
		&i.AnswerText,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const createQuestion = `-- name: CreateQuestion :one
INSERT INTO questions (
    question_text
) VALUES (
    $1
)
RETURNING id, question_text, created_at, updated_at, deleted_at
`

func (q *Queries) CreateQuestion(ctx context.Context, questionText string) (Question, error) {
	row := q.db.QueryRow(ctx, createQuestion, questionText)
	var i Question
	err := row.Scan(
		&i.ID,
		&i.QuestionText,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const getCompanyAnswer = `-- name: GetCompanyAnswer :one
SELECT 
    cqa.id, cqa.company_id, cqa.question_id, cqa.answer_text, cqa.created_at, cqa.updated_at, cqa.deleted_at,
    q.question_text
FROM company_question_answers cqa
JOIN questions q ON q.id = cqa.question_id
WHERE cqa.company_id = $1 AND cqa.question_id = $2 AND cqa.deleted_at IS NULL AND q.deleted_at IS NULL
LIMIT 1
`

type GetCompanyAnswerParams struct {
	CompanyID  string
	QuestionID string
}

type GetCompanyAnswerRow struct {
	ID           string
	CompanyID    string
	QuestionID   string
	AnswerText   string
	CreatedAt    pgtype.Timestamp
	UpdatedAt    pgtype.Timestamp
	DeletedAt    pgtype.Timestamp
	QuestionText string
}

func (q *Queries) GetCompanyAnswer(ctx context.Context, arg GetCompanyAnswerParams) (GetCompanyAnswerRow, error) {
	row := q.db.QueryRow(ctx, getCompanyAnswer, arg.CompanyID, arg.QuestionID)
	var i GetCompanyAnswerRow
	err := row.Scan(
		&i.ID,
		&i.CompanyID,
		&i.QuestionID,
		&i.AnswerText,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
		&i.QuestionText,
	)
	return i, err
}

const getQuestion = `-- name: GetQuestion :one
SELECT id, question_text, created_at, updated_at, deleted_at FROM questions
WHERE id = $1 AND deleted_at IS NULL
LIMIT 1
`

func (q *Queries) GetQuestion(ctx context.Context, id string) (Question, error) {
	row := q.db.QueryRow(ctx, getQuestion, id)
	var i Question
	err := row.Scan(
		&i.ID,
		&i.QuestionText,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const listCompanyAnswers = `-- name: ListCompanyAnswers :many
SELECT 
    cqa.id, cqa.company_id, cqa.question_id, cqa.answer_text, cqa.created_at, cqa.updated_at, cqa.deleted_at,
    q.question_text
FROM company_question_answers cqa
JOIN questions q ON q.id = cqa.question_id
WHERE cqa.company_id = $1 AND cqa.deleted_at IS NULL AND q.deleted_at IS NULL
ORDER BY cqa.created_at DESC
`

type ListCompanyAnswersRow struct {
	ID           string
	CompanyID    string
	QuestionID   string
	AnswerText   string
	CreatedAt    pgtype.Timestamp
	UpdatedAt    pgtype.Timestamp
	DeletedAt    pgtype.Timestamp
	QuestionText string
}

func (q *Queries) ListCompanyAnswers(ctx context.Context, companyID string) ([]ListCompanyAnswersRow, error) {
	rows, err := q.db.Query(ctx, listCompanyAnswers, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ListCompanyAnswersRow
	for rows.Next() {
		var i ListCompanyAnswersRow
		if err := rows.Scan(
			&i.ID,
			&i.CompanyID,
			&i.QuestionID,
			&i.AnswerText,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.DeletedAt,
			&i.QuestionText,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listQuestions = `-- name: ListQuestions :many
SELECT id, question_text, created_at, updated_at, deleted_at FROM questions
WHERE deleted_at IS NULL
ORDER BY created_at DESC
`

func (q *Queries) ListQuestions(ctx context.Context) ([]Question, error) {
	rows, err := q.db.Query(ctx, listQuestions)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Question
	for rows.Next() {
		var i Question
		if err := rows.Scan(
			&i.ID,
			&i.QuestionText,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.DeletedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const softDeleteCompanyAnswer = `-- name: SoftDeleteCompanyAnswer :exec
UPDATE company_question_answers
SET deleted_at = NOW()
WHERE company_id = $1 AND question_id = $2
`

type SoftDeleteCompanyAnswerParams struct {
	CompanyID  string
	QuestionID string
}

func (q *Queries) SoftDeleteCompanyAnswer(ctx context.Context, arg SoftDeleteCompanyAnswerParams) error {
	_, err := q.db.Exec(ctx, softDeleteCompanyAnswer, arg.CompanyID, arg.QuestionID)
	return err
}

const softDeleteQuestion = `-- name: SoftDeleteQuestion :exec
UPDATE questions
SET deleted_at = NOW()
WHERE id = $1
`

func (q *Queries) SoftDeleteQuestion(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, softDeleteQuestion, id)
	return err
}

const updateCompanyAnswer = `-- name: UpdateCompanyAnswer :one
UPDATE company_question_answers
SET 
    answer_text = $3,
    updated_at = NOW()
WHERE company_id = $1 AND question_id = $2 AND deleted_at IS NULL
RETURNING id, company_id, question_id, answer_text, created_at, updated_at, deleted_at
`

type UpdateCompanyAnswerParams struct {
	CompanyID  string
	QuestionID string
	AnswerText string
}

func (q *Queries) UpdateCompanyAnswer(ctx context.Context, arg UpdateCompanyAnswerParams) (CompanyQuestionAnswer, error) {
	row := q.db.QueryRow(ctx, updateCompanyAnswer, arg.CompanyID, arg.QuestionID, arg.AnswerText)
	var i CompanyQuestionAnswer
	err := row.Scan(
		&i.ID,
		&i.CompanyID,
		&i.QuestionID,
		&i.AnswerText,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}