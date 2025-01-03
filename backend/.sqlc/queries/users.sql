-- name: GetUserByID :one
SELECT id, email, role, email_verified, token_salt
FROM users 
WHERE id = $1;

-- name: GetUserEmailVerifiedStatusByEmail :one
SELECT email_verified FROM users WHERE email = $1;

-- name: UserExistsByEmail :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);

-- name: NewUser :one
INSERT INTO users
(email, password, role)
VALUES
($1, $2, $3) RETURNING id, email, email_verified, role, token_salt;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1; 

-- name: UpdateUserEmailVerifiedStatus :exec
UPDATE users SET email_verified = $1 WHERE id = $2;