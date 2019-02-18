const { ApolloServer, gql } = require('apollo-server');
const {
  getTenants, getLandLords, getMatchesByLandlord, getMatchesByTenant,
} = require('./utils');

const typeDefs = gql`
  type Preferences {
    bedrooms: Int!
    city: String
    maxPrice: Int
    minPrice: Int
    smokingAllowed: Boolean
    petsAllowed: Boolean
  }
  #tenant
  type Tenant {
    id: String
    name: String
    email: String
    phone: String
    preferences: Preferences
  }
  #landlord
  type Property {
    bedrooms: Int
    description: String
    images: [String]
  }
  type Landlord {
    id: String
    name: String
    email: String
    phone: String
    property: Property
  }
  #match
  type ChatMessage {
    speaker: String
    message: String
  }
  type Match {
    tenantId: String
    landlordId: String
    chatHistory: [ChatMessage]
  }

  type Query {
    matchesByTenant(tenantId: String!): [Match]
    matchesByLandlord(landlordId: String!): [Match]
    tenants: [Tenant]
    landlords: [Landlord]
    tenant(id: String!): Tenant
    landlord(id: String!): Landlord
  }
`;

const resolvers = {
  Query: {
    async tenants() {
      const tenants = await getTenants();
      return tenants;
    },
    async landlords() {
      const landlords = await getLandLords();
      return landlords;
    },
    async matchesByTenant(_, { tenantId }) {
      const matches = await getMatchesByTenant(tenantId);
      return matches;
    },
    async matchesByLandlord(_, { landlordId }) {
      const matches = await getMatchesByLandlord(landlordId);
      return matches;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
