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

## Developing the module in Dotnet

If the module is developed in Dotnet, it should be ensured that Dotnet 6 is used, because the respective workflows for Dotnet are set to the 6.0.x version.

The following sections explain the other individual adjustments to be made.

### Adjustments to the Dotnet projects

The project files (*.csproj) must be renamed. Here the term **iotemplate** must be replaced with **io\<modulename\>** and the namespace **Module.IOTemplate** must be replaced with **Module.\<ModuleName\>** as well.

> Note that when renaming the project files, the module name is written in **lower-case** and when renaming the namespaces, it is written in **camel-case**.

### Adjustments to the Advanced Installer project

For deploying the module to Windows, the repository includes the setup-module-dotnet.aip project file. This is used to generate the Windows setups during the Github action and make them available on S3 for our QA. In order for the setups to be generated correctly some changes need to be made beforehand.

The following changes need to be made:

* Adjustment of the ProductCode for the identification of the product below the Windows-Setups.
* Adaptation of the UpgradeCode for the identification of the product in order to update it with newer versions.
* Replacing the Template name with the name of the new module.
