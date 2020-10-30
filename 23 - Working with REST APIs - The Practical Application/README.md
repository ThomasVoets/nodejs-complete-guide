# Module Summary

## From "Classic" to REST API

- Most of the server-side code does not change, only request + response data is affected
- More Http methods are available
- The REST API server does nog care about the client, requests are handled in isolation => No sessions

## Authentication

- Due to no sessions being used, authentication works differently
- Each request needs to be able to send some data that proves that the request is authenticated
- JSON Web Tokens ("JWT") are a common way of storing authentication information on the client and proving authentication status
- JWTs are signed by the server and can only be validated by the server

## Useful Resources & Links

- [jwt.io](https://www.jwt.io/)
