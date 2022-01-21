package apiv2

import (
	"github.com/gorilla/mux"

	infoservice "github.com/actiwaredevelopment/io2-module-iotemplate/api/v2/info/service"
)

// Register the api router for api version 1.0
func Register(router *mux.Router) {
	router.StrictSlash(true)
	subRouter := router.PathPrefix("/v2").Subrouter()

	// Info routes
	infoservice.Register(subRouter)
}
