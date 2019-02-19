const {
  ApolloServer, gql, ApolloError, ValidationError,
} = require('apollo-server');
const {
  getTenants,
  getLandLords,
  getMatchesByLandlord,
  getMatchesByTenant,
  getTenantById,
  getLandLordById,
  addTenant,
  addLandlord,
  addMatch,
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
  input TenantPreferences {
    bedrooms: Int!
    city: String
    maxPrice: Int
    minPrice: Int
    smokingAllowed: Boolean
    petsAllowed: Boolean
  }
  input LandlordProperty {
    bedrooms: Int
    description: String
    images: [String]
    price: Int
    petsAllowed: Boolean
    smokingAllowed: Boolean
    propertyType: String
    city: String
  }
  input TenantInput {
    name: String
    email: String
    phone: String
    preferences: TenantPreferences
  }
  input LandlordInput {
    name: String
    email: String
    phone: String
    property: LandlordProperty
  }
  input MatchInput {
    landlordId: String
    tenantId: String
  }
  type Mutation {
    createTenant(input: TenantInput): Tenant
    createLandlord(input: LandlordInput): Landlord
    createMatch(input: MatchInput): Match
  }
`;

const resolvers = {
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
        throw new ApolloError(error);
      }
    },
    async tenant(_, { id }) {
      try {
        const tenant = await getTenantById(id);
        return tenant || new ValidationError('Not found.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async landlord(_, { id }) {
      try {
        const landlord = await getLandLordById(id);
        return landlord || new ValidationError('Not found.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
  Mutation: {
    async createTenant(_, { input }) {
      try {
        const tenantJSON = JSON.parse(JSON.stringify(input));
        addTenant(tenantJSON);
        return tenantJSON || new ValidationError('Tenant not added.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async createLandlord(_, { input }) {
      try {
        const landlordJSON = JSON.parse(JSON.stringify(input));
        addLandlord(landlordJSON);
        return landlordJSON || new ValidationError('landlord not added.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async createMatch(_, { input }) {
      try {
        const matchJSON = JSON.parse(JSON.stringify(input));
        const { landlordId, tenantId } = matchJSON;
        addMatch(landlordId, tenantId);
        return matchJSON;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
  // TODO:  make a match
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
