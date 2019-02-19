const { ApolloError, ValidationError, gql } = require('apollo-server');

const {
  getUsers,
  getMatchesByLandlord,
  getMatchesByTenant,
  getUserById,
  addUser,
  addMatch,
  updateUserContact,
  deleteUserById,
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
  input contactInput {
    name: String
    phone: String
    email: String
  }
  type Mutation {
    createTenant(input: TenantInput, id: String): Tenant
    createLandlord(input: LandlordInput, id: String): Landlord
    createMatch(input: MatchInput): Match
    updateTenantContact(input: contactInput, id: String): String
    deleteTenant(input: String): String
    deleteLandlord(input: String): String
  }
`;

const resolvers = {
  Query: {
    async tenants() {
      try {
        const tenants = await getUsers('tenants');
        return tenants;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async landlords() {
      try {
        const landlords = await getUsers('landlords');
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
        const tenant = await getUserById(id, 'tenants');
        return tenant || new ValidationError('Not found.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async landlord(_, { id }) {
      try {
        const landlord = await getUserById(id, 'landlords');
        return landlord || new ValidationError('Not found.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
  Mutation: {
    async createTenant(_, { input, id }) {
      try {
        const tenantJSON = JSON.parse(JSON.stringify(input));
        addUser(id, tenantJSON, 'tenants');
        return tenantJSON || new ValidationError('Tenant not added.');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async createLandlord(_, { input, id }) {
      try {
        const landlordJSON = JSON.parse(JSON.stringify(input));
        addUser(id, landlordJSON, 'landlords');
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
    async updateTenantContact(_, { id, input }) {
      try {
        const contactJSON = JSON.parse(JSON.stringify(input));
        const updatedUser = await updateUserContact(id, contactJSON, 'tenants');
        return updatedUser || new ValidationError('User not updated');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async deleteTenant(_, { input }) {
      try {
        deleteUserById(input, 'tenants');
        return `deleted user with id ${input}`;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
