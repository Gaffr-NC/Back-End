const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./graphql/typedefs');
const { resolvers } = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
