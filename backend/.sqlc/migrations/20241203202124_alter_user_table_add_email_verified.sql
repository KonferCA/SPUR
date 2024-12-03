-- +goose Up
-- +goose StatementBegin

-- by default, goose run all migrations in a transaction so no need to begin a new transaction.
ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT false;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE users DROP COLUMN email_verified;

-- +goose StatementEnd
