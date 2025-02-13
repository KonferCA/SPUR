// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: users.sql

package db

import (
	"context"
)

const countUsers = `-- name: CountUsers :one
SELECT COUNT(*)
FROM users
WHERE 
    ($1::text IS NULL OR NULLIF($1, '')::int IS NULL OR permissions = NULLIF($1, '')::int) AND
    ($2::text IS NULL OR 
        (LOWER(email) LIKE '%' || LOWER($2) || '%' OR
         LOWER(COALESCE(first_name, '')) LIKE '%' || LOWER($2) || '%' OR
         LOWER(COALESCE(last_name, '')) LIKE '%' || LOWER($2) || '%'))
`

type CountUsersParams struct {
	Column1 string `json:"column_1"`
	Column2 string `json:"column_2"`
}

func (q *Queries) CountUsers(ctx context.Context, arg CountUsersParams) (int64, error) {
	row := q.db.QueryRow(ctx, countUsers, arg.Column1, arg.Column2)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, first_name, last_name, bio, title, linkedin, email, password, permissions, email_verified, created_at, updated_at, token_salt FROM users WHERE email = $1 LIMIT 1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Bio,
		&i.Title,
		&i.Linkedin,
		&i.Email,
		&i.Password,
		&i.Permissions,
		&i.EmailVerified,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.TokenSalt,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, first_name, last_name, bio, title, linkedin, email, password, permissions, email_verified, created_at, updated_at, token_salt
FROM users 
WHERE id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, id string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Bio,
		&i.Title,
		&i.Linkedin,
		&i.Email,
		&i.Password,
		&i.Permissions,
		&i.EmailVerified,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.TokenSalt,
	)
	return i, err
}

const getUserDetails = `-- name: GetUserDetails :one
SELECT 
    id,
    COALESCE(first_name, '') as first_name,
    COALESCE(last_name, '') as last_name,
    COALESCE(title, '') as title,
    COALESCE(bio, '') as bio,
    COALESCE(linkedin, '') as linkedin,
    COALESCE(created_at, EXTRACT(EPOCH FROM NOW())::bigint) as created_at,
    NULLIF(updated_at, 0)::bigint as updated_at
FROM users
WHERE id = $1
`

type GetUserDetailsRow struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Title     string `json:"title"`
	Bio       string `json:"bio"`
	Linkedin  string `json:"linkedin"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

func (q *Queries) GetUserDetails(ctx context.Context, id string) (GetUserDetailsRow, error) {
	row := q.db.QueryRow(ctx, getUserDetails, id)
	var i GetUserDetailsRow
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Title,
		&i.Bio,
		&i.Linkedin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserEmailVerifiedStatusByEmail = `-- name: GetUserEmailVerifiedStatusByEmail :one
SELECT email_verified FROM users WHERE email = $1
`

func (q *Queries) GetUserEmailVerifiedStatusByEmail(ctx context.Context, email string) (bool, error) {
	row := q.db.QueryRow(ctx, getUserEmailVerifiedStatusByEmail, email)
	var email_verified bool
	err := row.Scan(&email_verified)
	return email_verified, err
}

const listUsers = `-- name: ListUsers :many
SELECT 
    id,
    COALESCE(first_name, '') as first_name,
    COALESCE(last_name, '') as last_name,
    email,
    permissions,
    email_verified,
    created_at,
    updated_at
FROM users
WHERE 
    ($1::text IS NULL OR NULLIF($1, '')::int IS NULL OR permissions = NULLIF($1, '')::int) AND
    ($2::text IS NULL OR 
        (LOWER(email) LIKE '%' || LOWER($2) || '%' OR
         LOWER(COALESCE(first_name, '')) LIKE '%' || LOWER($2) || '%' OR
         LOWER(COALESCE(last_name, '')) LIKE '%' || LOWER($2) || '%'))
ORDER BY 
    CASE WHEN $3 = 'asc' THEN created_at END ASC,
    CASE WHEN $3 = 'desc' OR $3 IS NULL THEN created_at END DESC
LIMIT $4 OFFSET $5
`

type ListUsersParams struct {
	Column1 string      `json:"column_1"`
	Column2 string      `json:"column_2"`
	Column3 interface{} `json:"column_3"`
	Limit   int32       `json:"limit"`
	Offset  int32       `json:"offset"`
}

type ListUsersRow struct {
	ID            string `json:"id"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	Email         string `json:"email"`
	Permissions   int32  `json:"permissions"`
	EmailVerified bool   `json:"email_verified"`
	CreatedAt     int64  `json:"created_at"`
	UpdatedAt     int64  `json:"updated_at"`
}

func (q *Queries) ListUsers(ctx context.Context, arg ListUsersParams) ([]ListUsersRow, error) {
	rows, err := q.db.Query(ctx, listUsers,
		arg.Column1,
		arg.Column2,
		arg.Column3,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ListUsersRow
	for rows.Next() {
		var i ListUsersRow
		if err := rows.Scan(
			&i.ID,
			&i.FirstName,
			&i.LastName,
			&i.Email,
			&i.Permissions,
			&i.EmailVerified,
			&i.CreatedAt,
			&i.UpdatedAt,
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

const newUser = `-- name: NewUser :one
INSERT INTO users
(email, password, permissions)
VALUES
($1, $2, $3) RETURNING id, email, email_verified, permissions, token_salt
`

type NewUserParams struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	Permissions int32  `json:"permissions"`
}

type NewUserRow struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Permissions   int32  `json:"permissions"`
	TokenSalt     []byte `json:"token_salt"`
}

func (q *Queries) NewUser(ctx context.Context, arg NewUserParams) (NewUserRow, error) {
	row := q.db.QueryRow(ctx, newUser, arg.Email, arg.Password, arg.Permissions)
	var i NewUserRow
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.EmailVerified,
		&i.Permissions,
		&i.TokenSalt,
	)
	return i, err
}

const updateUserDetails = `-- name: UpdateUserDetails :exec
UPDATE users
SET first_name = $1, last_name = $2, title = $3, bio = $4, linkedin = $5
WHERE id = $6
`

type UpdateUserDetailsParams struct {
	FirstName *string `json:"first_name"`
	LastName  *string `json:"last_name"`
	Title     *string `json:"title"`
	Bio       *string `json:"bio"`
	Linkedin  *string `json:"linkedin"`
	ID        string  `json:"id"`
}

func (q *Queries) UpdateUserDetails(ctx context.Context, arg UpdateUserDetailsParams) error {
	_, err := q.db.Exec(ctx, updateUserDetails,
		arg.FirstName,
		arg.LastName,
		arg.Title,
		arg.Bio,
		arg.Linkedin,
		arg.ID,
	)
	return err
}

const updateUserEmailVerifiedStatus = `-- name: UpdateUserEmailVerifiedStatus :exec
UPDATE users SET email_verified = $1 WHERE id = $2
`

type UpdateUserEmailVerifiedStatusParams struct {
	EmailVerified bool   `json:"email_verified"`
	ID            string `json:"id"`
}

func (q *Queries) UpdateUserEmailVerifiedStatus(ctx context.Context, arg UpdateUserEmailVerifiedStatusParams) error {
	_, err := q.db.Exec(ctx, updateUserEmailVerifiedStatus, arg.EmailVerified, arg.ID)
	return err
}

const updateUserRole = `-- name: UpdateUserRole :exec
UPDATE users
SET permissions = $2
WHERE id = $1
`

type UpdateUserRoleParams struct {
	ID          string `json:"id"`
	Permissions int32  `json:"permissions"`
}

func (q *Queries) UpdateUserRole(ctx context.Context, arg UpdateUserRoleParams) error {
	_, err := q.db.Exec(ctx, updateUserRole, arg.ID, arg.Permissions)
	return err
}

const updateUsersRole = `-- name: UpdateUsersRole :exec
UPDATE users
SET permissions = $2
WHERE id = ANY($1::uuid[])
`

type UpdateUsersRoleParams struct {
	Column1     []string `json:"column_1"`
	Permissions int32    `json:"permissions"`
}

func (q *Queries) UpdateUsersRole(ctx context.Context, arg UpdateUsersRoleParams) error {
	_, err := q.db.Exec(ctx, updateUsersRole, arg.Column1, arg.Permissions)
	return err
}

const userExistsByEmail = `-- name: UserExistsByEmail :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)
`

func (q *Queries) UserExistsByEmail(ctx context.Context, email string) (bool, error) {
	row := q.db.QueryRow(ctx, userExistsByEmail, email)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}
