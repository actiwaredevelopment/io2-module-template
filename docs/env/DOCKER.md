# Docker Settings
 
## Supported Environments
| Environment Variable | Description                                                  | Default Value                   |
| -------------------- | ------------------------------------------------------------ | ------------------------------- |
| PROJECT_SERVICE      | The project service that will be used to manage the modules. | http://io-project-service:30002 |
| UPLOAD_TOKEN         | The master token that is required for uploading modules.     | demo                            |

## Docker Compose Example
The Docker image for development can be included in the docker-compose.yml file as follows:

```yml
  io-module-iotemplate:
    image: ghcr.io/actiwaredevelopment/io2-module-iotemplate/io2-module-iotemplate:developer
    restart: always
    environment:
       PROJECT_SERVICE: <ADDRESS-TO-PROJECT-SERVICE>
       UPLOAD_TOKEN: <MASTER-TOKEN>    
    ports:
      - 30100:30100
```