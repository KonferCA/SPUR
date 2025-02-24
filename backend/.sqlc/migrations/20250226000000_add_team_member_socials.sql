-- +goose Up
-- +goose StatementBegin
ALTER TABLE team_members
ADD COLUMN facebook_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN x_url TEXT,
ADD COLUMN bluesky_url TEXT,
ADD COLUMN discord_url TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE team_members
DROP COLUMN facebook_url,
DROP COLUMN instagram_url,
DROP COLUMN x_url,
DROP COLUMN bluesky_url,
DROP COLUMN discord_url;
-- +goose StatementEnd 