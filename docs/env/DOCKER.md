# Docker Settings
 
## Supported Environments
| Environment Variable | Description                                                  | Default Value                   |
| -------------------- | ------------------------------------------------------------ | ------------------------------- |
| PROJECT_SERVICE      | The project service that will be used to manage the modules. | http://io-project-service:30002 |
| UPLOAD_TOKEN         | The master token that is required for uploading modules.     | demo                            |

## Docker Compose Example
The Docker image for development can be included in the docker-compose.yml file as follows:

### Developer 

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

### Nightly 

```yml
  io-module-iotemplate:
    image: actiwareio/io-module-iotemplate:2-nightly
    restart: always
    environment:
       PROJECT_SERVICE: <ADDRESS-TO-PROJECT-SERVICE>
       UPLOAD_TOKEN: <MASTER-TOKEN>    
    ports:
      - 30100:30100
```

### Pre-Release 

```yml
  io-module-iotemplate:
    image: actiwareio/io-module-iotemplate:prerelease-X.X.X
    restart: always
    environment:
       PROJECT_SERVICE: <ADDRESS-TO-PROJECT-SERVICE>
       UPLOAD_TOKEN: <MASTER-TOKEN>    
    ports:
      - 30100:30100
```

### Release 

```yml
  io-module-iotemplate:
    image: actiwareio/io-module-iotemplate:2-latest
    restart: always
    environment:
       PROJECT_SERVICE: <ADDRESS-TO-PROJECT-SERVICE>
       UPLOAD_TOKEN: <MASTER-TOKEN>    
    ports:
      - 30100:30100
```

or

```yml
  io-module-iotemplate:
    image: actiwareio/io-module-iotemplate:release-X.X.X
    restart: always
    environment:
       PROJECT_SERVICE: <ADDRESS-TO-PROJECT-SERVICE>
       UPLOAD_TOKEN: <MASTER-TOKEN>    
    ports:
      - 30100:30100
```