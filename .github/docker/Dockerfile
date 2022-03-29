# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates

RUN update-ca-certificates

ENV DEFAULT_PORT 30100

WORKDIR /app

COPY ./out /app
COPY ./src/configuration /app/ClientApp
COPY ./atlassian.zip /app
COPY ./module-definition/info.json /app
COPY ./module-definition/languages /app/languages

EXPOSE 30100

ENTRYPOINT ["dotnet", "/app/io2-module-iotemplate-service.dll"]