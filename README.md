# electron-react-wl-boilerplate

Slightly trimmed down version of [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) with added Wolfram Language integrations making use of [LocalDeploy](https://github.com/ToneAr/LocalDeploy).

## Development & Building

During development, the application can be tested using `npm start`. This runs the project in the development environment.

Packaging the application for distribution can be done by running `npm run package`.

## Wolfram Language

Inside the `./wl/` are all the files used for the definitions and deployment of the wolfram language socket. These come as 2 files:

1. dispatcher.wl

    This file contains the definition of a Wolfram Language `URLDispatcher` which contains all endpoints and their definitions as outlined in in the WL documentation [here](http://reference.wolfram.com/language/ref/URLDispatcher.html).

2. deploy.wls

    This script file will install and initialize the LocalDeploy and then deploy the dispatcher defined inside `dispatcher.wl` on a local TCP socket on the port specified by command line argument `[ --port 1234 | -p 1234 ]`. The default port chosen was 4848 which can be changed inside `./src/main/main.ts` in the WL Socket section.

## Linting

ESLint and Prettier are both enabled which are linters that flag errors, improper syntax, suspicious constructs and stylistic errors.
