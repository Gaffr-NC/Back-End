const {
  ApolloServer, gql, ApolloError, ValidationError,
} = require('apollo-server');
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
    price: Int
    petsAllowed: Boolean
    smokingAllowed: Boolean
    propertyType: String
    city: String
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
  // TODO: single tenant/landlord queries
  Query: {
    async tenants() {
      try {
        const tenants = await getTenants();
        return tenants;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async landlords() {
      try {
        const landlords = await getLandLords();
        return landlords;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async matchesByTenant(_, { tenantId }) {
      try {
        const matches = await getMatchesByTenant(tenantId);
        return matches.length ? matches : new ValidationError('No matches for that tenant.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async matchesByLandlord(_, { landlordId }) {
      try {
        const matches = await getMatchesByLandlord(landlordId);
        return matches.length ? matches : new ValidationError('No matches for that landlord.');
      } catch (error) {
        throw new ApolloError();
      }
    },
  },
  // TODO: Add new tenant, add new landlord, make a match
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
