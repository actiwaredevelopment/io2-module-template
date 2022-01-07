package config

import (
	"encoding/json"
	"os"
	"strconv"

	"github.com/actiwaredevelopment/go-framework/errors"
	"github.com/actiwaredevelopment/go-framework/log"
	"github.com/actiwaredevelopment/io2-module-template/models"
)

// Service represents the interface for the config service
type Service interface {
	Config() (*models.Config, error)
}

type service struct {
	config *models.Config
}

// NewService creates a new config service.
func NewService() Service {
	return &service{}
}

// load loads the services config file.
// The config file should be in a folder called "config" relative to the services executable.
func (service *service) load() (*models.Config, error) {
	config := &models.Config{}

	if _, err := os.Stat("./config/service.json"); os.IsNotExist(err) {
		lookupEnv(config)

		return config, nil
	}

	file, err := os.Open("./config/service.json")

	if err != nil {

		if os.IsNotExist(err) {
			return config, nil
		}

		return nil, errors.Wrap(err, "could not load config", errors.GenCode("ECM", 182)) // EX: 182
	}

	defer file.Close()

	decoder := json.NewDecoder(file)
	err = decoder.Decode(config)

	if err != nil {
		return nil, errors.Wrap(err, "an error occured while deserializing config", errors.GenCode("ECM", 183)) // EX: 183
	}

	return config, nil
}

func lookupEnv(config *models.Config) {
	port, err := strconv.ParseUint(os.Getenv("DEFAULT_PORT"), 10, 16)

	if err == nil {
		config.Port = uint16(port)
	} else {
		config.Port = 30100
	}

	projectService := os.Getenv("PROJECT_SERVICE")
	uploadToken := os.Getenv("UPLOAD_TOKEN")

	if len(projectService) > 0 {
		config.ProjectService = projectService
	}

	if len(uploadToken) > 0 {
		config.UploadToken = uploadToken
	}

	if len(projectService) <= 0 && len(uploadToken) <= 0 {
		log.Warning.Println("The module definition file is not provided because no project service was specified.")
		return
	}
}

// Config returns the services configuration.
// If the configuration has already been loaded it will be returned from cache.
// Otherwise the service will try to load the configuration file.
// Currently there is no way to invalidate the configuration cache.
func (service *service) Config() (*models.Config, error) {
	if service.config != nil {
		return service.config, nil
	}

	config, err := service.load()
	if err != nil {
		return nil, err
	}

	service.config = config
	return config, nil
}
