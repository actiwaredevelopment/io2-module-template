# ACTIWARE: IO 2 - Module: IOTemplate

## Status
### Build Status
* ![Build Status Release](https://github.com/actiwaredevelopment/io2-module-iotemplate/actions/workflows/release.yml/badge.svg)
* ![Build Status Nightly](https://github.com/actiwaredevelopment/io2-module-iotemplate/actions/workflows/nightly.yml/badge.svg)
* ![Build Status Linux](https://github.com/actiwaredevelopment/io2-module-iotemplate/actions/workflows/linux.yml/badge.svg)
* ![Build Status Windows](https://github.com/actiwaredevelopment/io2-module-iotemplate/actions/workflows/windows.yml/badge.svg)

## Quick reference
* Maintained by: ACTIWARE Development GmbH
* Markdown: [Used Markdown Reference](https://docs.microsoft.com/de-de/contribute/markdown-reference)
* Docker Settings: [Docker Quick Reference](./docs/env/DOCKER.md) 
* Documentation: [Module Documentation](./docs/module/index.md) 
* Globale Documentation: [Global Documentation Examples](./docs/global_doc/index.md) 

## Visual Studio Code Extensions
* [Docs Authoring Pack](https://marketplace.visualstudio.com/items?itemName=docsmsft.docs-authoring-pack)

## Language files
The module automatically detects the browser language in the configuration and changes the display language for the configuration accordingly. If the configuration is loaded into another application, the language may have to be indicated as query parameter lng=en|en|.... must be given.

To edit existing languages, the [Excel-File](https://actiware.sharepoint.com/:f:/s/Development/EuUTOkc3HapLlV1CW4nj_CIBWOO4uCJ1erLzQ0L-ymuQFg?e=rlDIX9) provides the current values for the translations. It is also mandatory to keep this file up to date, since the language files should always be generated from the [Excel-File](https://actiware.sharepoint.com/:f:/s/Development/EuUTOkc3HapLlV1CW4nj_CIBWOO4uCJ1erLzQ0L-ymuQFg?e=rlDIX9).

To update the languages in this project, the generated language files must be placed in the directory ./module-definition/languages. When building the application, the language files are then additionally transferred to the output directory for the configuration.

## Module Definition
The ZIP file for the modules is automatically generated in the build process and deployed in the Docker image. When the Docker image is configured with the respective environment variables, the module tries to deploy the module definition file on every startup.
