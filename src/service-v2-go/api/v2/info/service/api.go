package infoservice

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/actiwaredevelopment/go-framework/log"
	"github.com/actiwaredevelopment/io2-module-template/internal/utils"
	"github.com/actiwaredevelopment/io2-module-template/models"
	"github.com/gorilla/mux"
)

// Register registers the routes for the execute sql processor
func Register(router *mux.Router) {
	router.HandleFunc("/info", getServiceInfo).Methods("GET")
	router.HandleFunc("/info/module", getModuleDefinition).Methods("GET")
	router.HandleFunc("/info/module/download", downloadModule).Methods("GET")
}

func getServiceInfo(response http.ResponseWriter, request *http.Request) {
	serviceData := models.ServiceStats{
		Product:        "ACTIWARE: IO",
		ProductName:    "Module: Template",
		ProductVersion: "2.0.0.0000",
		FileVersion:    "2.0.0",
		Status:         true,
	}

	if _, err := os.Stat("version.txt"); err == nil {
		// Open json configuration file
		versionFile, err := os.Open("version.txt")

		if err != nil {
			log.Error.Printf("%s", err.Error())

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusNoContent)

			return
		}

		// Defer the closing of our json file so that we can parse it later on
		defer versionFile.Close()

		// Read opened json file as a byte array
		byteValue, _ := ioutil.ReadAll(versionFile)

		serviceData.ProductVersion = string(byteValue)
	} else {
		log.Error.Println(err.Error())
	}

	result, err := json.Marshal(serviceData)

	if err == nil {
		response.Header().Set("Content-Type", "application/json")
		response.WriteHeader(http.StatusOK)

		response.Write(result)
	} else {
		utils.SendResponse(response, http.StatusInternalServerError, "ERR_CONVERT_TO_JSON", fmt.Sprintf("Error converting step into JSON format: %s", err.Error()), false, err.Error())
	}
}

func getModuleDefinition(response http.ResponseWriter, request *http.Request) {
	if _, err := os.Stat("info.json"); err == nil {
		// Open json configuration file
		jsonFile, err := os.Open("info.json")

		if err != nil {
			log.Error.Printf("%s", err.Error())

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusNoContent)

			return
		}

		// Defer the closing of our json file so that we can parse it later on
		defer jsonFile.Close()

		// Read opened json file as a byte array
		byteValue, _ := ioutil.ReadAll(jsonFile)

		response.Header().Set("Content-Type", "application/json")
		response.WriteHeader(http.StatusOK)

		response.Write(byteValue)
	} else {
		log.Error.Println(err.Error())
	}

	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(http.StatusNoContent)
}

func downloadModule(response http.ResponseWriter, request *http.Request) {
	if _, err := os.Stat("template.zip"); err == nil {
		fileBytes, err := ioutil.ReadFile("template.zip")

		if err != nil {
			log.Error.Printf("%s", err.Error())

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusNoContent)

			return
		}

		// response.Header().Add("Content-Length", fmt.Sprintf("%d", moduleFile.Length))
		response.Header().Add("Content-Type", "application/octet-stream")
		response.Header().Add("Content-Disposition", `attachment; filename="template.zip"`)

		response.WriteHeader(http.StatusOK)

		response.Write(fileBytes)
	} else {
		log.Error.Println(err.Error())
	}

	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(http.StatusNoContent)
}
