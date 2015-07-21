# dashboard

### Run
1. Install node and bower dependencies: `npm install`
2. Run the application: `gulp serve`
3. go to [http://localhost:3000](http://localhost:3000)

### Build
1. Install node and bower dependencies: `npm install`
2. Run the application: `gulp build`
3. Upload `dist` content to the server

### Deploy to the `gh-pages` branch
1. Install node and bower dependencies: `npm install`
2. Run the application: `gulp build`
3. Run the application `gulp deploy`
4. Sync local gh-pages branch with remote origin

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
