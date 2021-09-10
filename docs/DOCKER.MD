# Quick reference
* Maintained by: ACTIWARE Development GmbH
* Where to get manuals: [Installation and Configuration](https://actiware-development.atlassian.net/wiki/spaces/AWIO/pages/1523449891/Beispielkonfiguration+f+r+Docker#Forms-Service) 

# API Documentation
The service automatically generates API documentation that can be accessed at the following address:
http://localhost:?????/docs/api

# Docker Settings
## Supported Environments
Environment Variable | Description | Default Value
---|---|---
LOG_FILE | If a local report file is to be created for the service, this parameter specifies where and with what name it should be saved. | service-.log

## Docker Compose Example
```yml
    io-module-template:
        image: docker.pkg.github.com/actiwaredevelopment/io2-module-template/io2-module-template:developer
        environment:
            LOG_FILE: "/logs/service-.log"
        volumes:
            - ./logs:/logs
        ports:
            - ?????:?????
```
