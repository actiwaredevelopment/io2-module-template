package models

import (
	"github.com/actiwaredevelopment/go-framework/log"
)

// Config represents the service settings
type Config struct {
	Port           uint16     `json:"port"`
	Log            log.Config `json:"log"`
	AuthService    string     `json:"auth_service"`
	ProjectService string     `json:"project_service"`
	UploadToken    string     `json:"upload_token"`
}
