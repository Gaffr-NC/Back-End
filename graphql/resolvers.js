const { ApolloError, ValidationError } = require('apollo-server');

const {
  getUsers,
  getMatchesByLandlord,
  getMatchesByTenant,
  getUserById,
  addUser,
  addMatch,
  updateUserContact,
  updateProperty,
  updatePreferences,
  deleteUserById,
} = require('../utils');

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
        addUser(id, input, 'tenants');
        return input;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async createLandlord(_, { input, id }) {
      try {
        addUser(id, input, 'landlords');
        return input;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async createMatch(_, { input }) {
      try {
        const { landlordId, tenantId } = input;
        addMatch(landlordId, tenantId);
        return input;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async updateTenantContact(_, { id, input }) {
      try {
        const updatedUser = await updateUserContact(id, input, 'tenants');
        return updatedUser || new ValidationError('Tenant not updated');
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    async updateLandlordContact(_, { id, input }) {
      try {
        const updatedUser = await updateUserContact(id, input, 'landlords');
        return updatedUser || new ValidationError('Landlord not updated');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async updateLandlordProperty(_, { id, input }) {
      try {
        const updatedProperty = await updateProperty(id, input);
        return updatedProperty || new ValidationError('Property not updated');
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async updateTenantPreferences(_, { id, input }) {
      try {
        const updatedPreferences = await updatePreferences(id, input);
        return updatedPreferences || new ValidationError('Preferences not updated');
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

module.exports = { resolvers };
