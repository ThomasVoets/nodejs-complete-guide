# Module Summary

## GraphQL Core Concepts

- Stateless, client-independent API
- Higher flexibility than REST APIs offer due to custom query language that is exposed to the client
- Queries (GET), Mutation (POST, PUT, PATCH, DELETE) and Subscriptions can be used to exchange and manage data
- ALL GraphQL requests are directed to ONE endpoint (POST /graphql)
- The server parses the incoming query expression (typically done by third-party packages) and calls the appropriate resolvers
- GraphQL is NOT limited to React.js applications!

## GraphQL vs REST

- REST APIs are great for static data requirements (e.g. file upload, scenarios where you need the same data all the time)
- GraphQL gives you higher flexibility by exposing a full query language to the client
- Both REST and GraphQL APIs can be implemented by ANY framework and actually even with ANY server-side language

## Useful Resources & Links

- [Detailed Guide on GraphQL](https://graphql.org)
