package v1_auth

import "KonferCA/SPUR/internal/interfaces"

/*
Main Handler struct for V1 auth routes.
*/
type Handler struct {
	server interfaces.CoreServer
}

/*
Response body for route /auth/ami-verified
*/
type EmailVerifiedStatusResponse struct {
	Verified bool `json:"verified"`
}
