package utils

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/actiwaredevelopment/go-framework/log"
)

func SendResponse(response http.ResponseWriter, status int, languageCode string, message string, isFatalError bool, arguments ...string) {
	// Set default header
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(status)

	if isFatalError {
		log.Error.Printf("[%d][%s]: %s", status, languageCode, message)
	} else {
		log.Message.Printf("[%d][%s]: %s", status, languageCode, message)
	}

	// response.Write(result)
	json.NewEncoder(response).Encode(message)
}

// Creates a new file upload http request with optional extra params
func NewFileUploadRequest(uri string, paramName, path string) (*multipart.Writer, *http.Request, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, nil, err
	}
	fileContents, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, nil, err
	}
	fi, err := file.Stat()
	if err != nil {
		return nil, nil, err
	}
	file.Close()

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile(paramName, fi.Name())
	if err != nil {
		return nil, nil, err
	}
	part.Write(fileContents)

	err = writer.Close()
	if err != nil {
		return nil, nil, err
	}

	req, err := http.NewRequest("PUT", uri, body)

	return writer, req, err
}
