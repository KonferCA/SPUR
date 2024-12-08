-- name: CreateVerifyEmailToken :one
INSERT INTO verify_email_tokens (
    email,
    expires_at
) VALUES (
    $1, $2
) RETURNING *;

-- name: GetVerifyEmailTokenByID :one
SELECT * FROM verify_email_tokens
WHERE id = $1 LIMIT 1;

-- name: DeleteVerifyEmailTokenByID :exec
DELETE FROM verify_email_tokens
WHERE id = $1;

-- name: DeleteVerifyEmailTokenByEmail :exec
DELETE FROM verify_email_tokens
WHERE email = $1;
