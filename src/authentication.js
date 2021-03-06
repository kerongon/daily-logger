const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');

const oauth2 = require('feathers-authentication-oauth2');
const GoogleStrategy = require('passport-google-oauth20');
const GithubStrategy = require('passport-github');

module.exports = function initAuthentication() {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());

  app.configure(
    oauth2(
      Object.assign(
        {
          name: 'google',
          Strategy: GoogleStrategy,
        },
        config.google,
      ),
    ),
  );

  app.configure(
    oauth2(
      Object.assign(
        {
          name: 'github',
          Strategy: GithubStrategy,
        },
        config.github,
      ),
    ),
  );

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [authentication.hooks.authenticate(config.strategies)],
      remove: [authentication.hooks.authenticate('jwt')],
    },
  });
};
