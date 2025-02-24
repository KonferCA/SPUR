-- name: CreateTeamMember :one
INSERT INTO team_members (
    company_id, first_name, last_name, 
    title, linkedin_url, is_account_owner,
    personal_website, commitment_type, introduction,
    industry_experience, detailed_biography, previous_work,
    resume_external_url, resume_internal_url,
    founders_agreement_external_url, founders_agreement_internal_url,
    facebook_url, instagram_url, x_url, bluesky_url, discord_url
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12, $13, $14, $15, $16,
    $17, $18, $19, $20, $21
)
RETURNING *; 

-- name: UpdateTeamMemberDocuments :exec
UPDATE team_members
SET
    resume_internal_url = $1,
    founders_agreement_internal_url = $2
WHERE id = $3 AND company_id = $4;

-- name: ListTeamMembers :many
SELECT * FROM team_members 
WHERE company_id = $1 
ORDER BY created_at DESC; 

-- name: GetTeamMember :one
SELECT * FROM team_members 
WHERE id = $1 AND company_id = $2 
LIMIT 1; 

-- name: UpdateTeamMember :one
UPDATE team_members 
SET 
    first_name = COALESCE(NULLIF(@first_name::text, ''), first_name),
    last_name = COALESCE(NULLIF(@last_name::text, ''), last_name),
    title = COALESCE(NULLIF(@title::text, ''), title),
    detailed_biography = COALESCE(NULLIF(@detailed_biography::text, ''), detailed_biography),
    linkedin_url = COALESCE(NULLIF(@linkedin_url::text, ''), linkedin_url),
    facebook_url = NULLIF(@facebook_url::text, ''),
    instagram_url = NULLIF(@instagram_url::text, ''),
    x_url = NULLIF(@x_url::text, ''),
    bluesky_url = NULLIF(@bluesky_url::text, ''),
    discord_url = NULLIF(@discord_url::text, ''),
    personal_website = NULLIF(@personal_website::text, ''),
    commitment_type = COALESCE(NULLIF(@commitment_type::text, ''), commitment_type),
    introduction = COALESCE(NULLIF(@introduction::text, ''), introduction),
    industry_experience = COALESCE(NULLIF(@industry_experience::text, ''), industry_experience),
    previous_work = NULLIF(@previous_work::text, ''),
    resume_external_url = NULLIF(@resume_external_url::text, ''),
    resume_internal_url = NULLIF(@resume_internal_url::text, ''),
    founders_agreement_external_url = NULLIF(@founders_agreement_external_url::text, ''),
    founders_agreement_internal_url = NULLIF(@founders_agreement_internal_url::text, ''),
    updated_at = extract(epoch from now())
WHERE id = @id AND company_id = @company_id
RETURNING *;

-- name: DeleteTeamMember :exec
DELETE FROM team_members 
WHERE id = $1 AND company_id = $2; 
