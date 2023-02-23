package main

import (
	"compress/flate"
	"context"
	"flag"
	"fmt"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/gorilla/mux"

	"github.com/actiwaredevelopment/go-framework/log"
	"github.com/actiwaredevelopment/io2-module-iotemplate/internal/config"
	"github.com/actiwaredevelopment/io2-module-iotemplate/internal/utils"
	"github.com/actiwaredevelopment/io2-module-iotemplate/models"

	apiv2 "github.com/actiwaredevelopment/io2-module-iotemplate/api/v2"
)

func main() {
	// Add json to mime types
	mime.AddExtensionType(".json", "application/json")

	log.Message.Println("initializing service")

	// load config
	configService := config.NewService()
	config, err := configService.Config()
	fatal(err)

	// Start HTTP server
	srv := startHTTPServer(config)

	// Upload module file
	uploadModuleFile(config)

	// Wait for an OS signal to shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)

	<-sigChan

	log.Message.Println("Shutting down http server...")

	// now close the server gracefully ("shutdown")
	// timeout could be given instead of nil as a https://golang.org/pkg/context/
	if err := srv.Shutdown(context.TODO()); err != nil {
		log.Error.Printf("Error shuting down http server: %s", err) // failure/timeout shutting down the server gracefully
	}
}

func startHTTPServer(config *models.Config) *http.Server {
	log.Message.Println("Starting HTTP server...")

	var dir string

	flag.StringVar(&dir, "dir", "../../../configuration/build", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()

	// // setup cors middleware
	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"},
		AllowedHeaders:   []string{"X-CLIENT-SYSTEM-ID", "X-Requested-With", "Authorization", "Origin", "Accept", "Content-Type", "X-READ-TOKEN"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	router := mux.NewRouter()
	router.Use(cors.Handler)

	// Enable compression support
	compressor := middleware.NewCompressor(flate.DefaultCompression)
	router.Use(compressor.Handler)

	// Register the middleware
	apiv2.Register(router.PathPrefix("/api").Subrouter())

	log.Message.Printf(dir)

	// Serve frontend static files
	router.PathPrefix("/api/v2/function/name/config").Handler(http.StripPrefix("/api/v2/function/name/config", http.FileServer(http.Dir(dir))))

	srv := &http.Server{Addr: fmt.Sprintf(":%d", config.Port), Handler: router}

	go func() {
		log.Message.Printf("Service listens to the port: %d", config.Port)

		if err := srv.ListenAndServe(); err != nil {
			if err != http.ErrServerClosed {
				log.Error.Fatal("Serving error: " + err.Error())
			}
		}
	}()

	return srv
}

func uploadModuleFile(config *models.Config) {
	projectService := os.Getenv("PROJECT_SERVICE")
	uploadToken := os.Getenv("UPLOAD_TOKEN")

	if len(projectService) <= 0 {
		projectService = config.ProjectService
	}

	if len(uploadToken) <= 0 {
		uploadToken = config.UploadToken
	}

	if len(projectService) <= 0 && len(uploadToken) <= 0 {
		log.Warning.Println("The module definition file is not provided because no project service was specified.")
		return
	}

	request, err := utils.NewFileUploadRequest(fmt.Sprintf("%s/api/v1/module", projectService), "file", "iotemplate.zip")

	if err != nil {
		log.Error.Println(err.Error())
	} else {
		request.Header.Add("Authorization", fmt.Sprintf("Bearer %s", uploadToken))

		log.Message.Printf("Try to upload the module definition file: iotemplate.zip to the project service: %s/api/v1/module", projectService)

		client := &http.Client{}
		resp, err := client.Do(request)

		if err != nil {
			log.Error.Println(err.Error())
		} else {
			if resp.StatusCode != 200 {
				log.Error.Printf("The service has returned the following status code: %s", resp.Status)
				log.Warning.Println("The module could not be provided, please upload the module manually. You can also download the current module via the route /api/v1/info/module/download.")
				var bodyContent []byte
				resp.Body.Read(bodyContent)
				resp.Body.Close()
				log.Error.Println(bodyContent)

			} else {
				log.Message.Println("Upload was successfully")
			}
		}
	}
}

func fatal(err error) {
	if err != nil {
		log.Error.Fatalf("%+v\n", err)
	}
}
