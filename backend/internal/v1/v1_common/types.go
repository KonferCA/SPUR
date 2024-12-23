package v1_common

/*
Use this for any json response that just needs a simple message field.
*/
type BasicResponse struct {
	Message string `json:"message"`
}

type SuccessType string
type ErrorType string

/*
Use this for any API response that needs a message.
*/
type APISuccess struct {
	Type    SuccessType `json:"type"`
	Message string      `json:"message"`
	Code    int         `json:"-"`
}

/*
Use this for any API response that needs a message and a request_id.
*/
type APIError struct {
	Type      ErrorType `json:"type"`
	Message   string    `json:"message"`
	Details   string    `json:"details,omitempty"`
	RequestID string    `json:"request_id,omitempty"`
	Code      int       `json:"code"`
}
