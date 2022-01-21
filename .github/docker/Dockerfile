# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim

ENV DEFAULT_PORT 30100

COPY ./out .
COPY ./src/configuration ./ClientApp
COPY ./iotemplate.zip .
COPY ./module-definition/info.json .

EXPOSE 30100

ENTRYPOINT ["dotnet", "io2-module-iotemplate-service.dll"]