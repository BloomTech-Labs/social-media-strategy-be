[![Maintainability](https://api.codeclimate.com/v1/badges/6a2268d17d0fcae99c56/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/social-media-strategy-be/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/6a2268d17d0fcae99c56/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/social-media-strategy-be/test_coverage)

# API Documentation

Backend deployed to Heroku

## Getting Started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm server** to start the local server
- **npm test** to start server using testing environment

## Technologies Used

- Express
- Knex
- Postgres

## API Endpoints

### Auth
Valid JWT required for `/api/auth` routes

| Method | URL                          | Description                                                                                           |
| ------ | ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| GET    | /api/auth/twitter/authorize  | Returns a redirect URL with an OAuth request token in order to authorize the user's Twitter account   |
| POST   | /api/auth/twitter/callback   | Receives the user's OAuth token and verifier to obtain and securely store their Twitter access token. |
| GET    | /api/auth/twitter/disconnect | Deletes user's Twitter information and access token from Okta.                                        |

### Lists
Valid JWT required for `/api/lists` routes

| Method | URL                  | Description                                                                                 |
| ------ | -------------------- | ------------------------------------------------------------------------------------------- |
| GET    | /api/lists/          | Returns an array of all lists belonging to logged in user.                                  |
| GET    | /api/lists/:id       | Returns list by id belonging to logged in user.                                             |
| GET    | /api/lists/:id/posts | Returns posts by list id belonging to logged in user.                                       |
| POST   | /api/lists           | Creates a new list belonging logged in user. Returns the new list.                          |
| POST   | /api/lists/:id/posts | Creates a new post for the list with :id belonging to logged in user. Returns the new post. |
| PUT    | /api/lists/:id       | Updates list with :id belonging to logged in user. Returns the updated list.                |
| PATCH  | /api/lists/:id       | Updates list with :id belonging to logged in user. Returns the updated list.                |
| DELETE | /api/lists/:id       | Deletes list with :id belonging to logged in user. Returns deleted count.                   |

### Posts
Valid JWT required for `/api/posts` routes

| Method | URL                    | Description                                                |
| ------ | ---------------------- | ---------------------------------------------------------- |
| GET    | /api/posts             | Returns an array of all posts belonging to logged in user. |
| GET    | /api/posts/:id         | Returns post with :id belonging to logged in user.         |
| PUT    | /api/posts/:id/postnow | Tweets the post with :id belonging to logged in user.      |
| PUT    | /api/posts/:id         | Updates the post with :id belonging to logged in user.     |
| PATCH  | /api/posts/:id         | Updates the post with :id belonging to logged in user.     |
| DELETE | /api/posts/:id         | Deletes the post with :id belonging to logged in user.     |


## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/social-media-strategy-fe/blob/master/README.md) for details on the frontend of our project.
