# dashboard

[![Circle CI](https://circleci.com/gh/qoriolabs/dashboard.png?style=svg)](https://circleci.com/gh/qoriolabs/dashboard)

### Requirements

Use Node.js 22.12 or newer and a local Chrome installation for tests.

### Install and run

1. Run `npm ci` and `npm run bower:install`.
2. Run the fixture API with `node server/index.js` when needed.
3. Run `npm start` and open http://localhost:3000.

### Build

Run `npm run build` and serve the generated `dist` directory.
Use `npx gulp` to clean previous output before building.

### Testing

Run `npm test` for one ChromeHeadless run or `npm run test:watch` while developing.
The local Karma plugins are installed by `npm ci`; no global packages are needed.
After building, run `npm run test:build` to verify that jQuery loads before
AngularJS, preserving the full selector API used by the sidebar directives.

The existing suite currently reports 147 passing tests and 10 failures in the
unfinished auth/permissions services. The same failures reproduce from the
unchanged repository sources with the updated runner. These tests remain enabled.
Run `npm run test:e2e` after building for the production Chrome regression. It
checks login, sidebar navigation, domain listing, templates and local assets with the fixture API.

### Dependency update scope

The npm graph now audits with zero reported vulnerabilities, including development
tools. Gulp 5, Dart Sass, patched Angular annotation and HTML minification replace
the retired tools. The unused Protractor scaffold is replaced with a production
Chrome regression. Source maps from the obsolete vulnerable plugin are disabled.
AngularJS and Bower application dependencies remain a separate modernization task.

### Deploy to the `gh-pages` branch

Run `npm run build` and review `dist` before deploying.
`npx gulp deploy` pushes the generated site to the remote `gh-pages` branch. The legacy CircleCI config
expects its deployment credential in `GH_TOKEN` rather than in the repository.

## Project 1 - Improve on this app template

We want to add some features.

+ Use a live authentication service  (we provide REST api) - store an auth token from server (a JWT token -- see [http://jwt.io/] ) in a browser cache
+ Add some example code to include the token as HTTPS header when calling a backend service.
+ Implement timer based on the token's expiration and logout the user.
+ Make the Sing app template capability-driven:  the auth token from the auth service contains different permission strings.  Add support for this at the app/ framework level so that the dashboard will render only components permitted according.
  + Map permission strings (e.g. 'update_account') to Angular controls (e.g. EditAccountWizard) - 1 to many relationship
  + Render components based on the user's permissions
+ Make the view/dashboard.html data driven -- instead of layout of widgets in static html, call a server to load a JSON (your design) that will driven the generation of the contents of the dashboard html.  What components will finally render will be controlled by this user's permissions.
+ Make some of the dashboard example widgets driven by websocket.  We would like to have live data feeds to the dashboard instead of having the UI poll the server.  Please come up with a basic framework and example for doing this.

## Project 2 - A user/ account management dashboard

Building on the framework of Project 1

+ Given a REST backend for authentication and account management, build 3-4 screens / modules for
  + creating new account
  + updating new account (via wizard)
  + listing all accounts (dynamic table)
+ Rendering of the UI components will be permission-based as described in Project 1.
+ We will iterate on the forms.  Please provide UX/ UI advice for best interaction and visual design.


## Network structure

For reference:

private cloud -> availability zone -> subnets -> security group -> hosts -> services -> containers
