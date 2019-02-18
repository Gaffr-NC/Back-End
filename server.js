const { ApolloServer, gql } = require('apollo-server');
const admin = require('firebase-admin');

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
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
    matches: [Match]
    tenants: [Tenant]
    landlords: [Landlord]
    tenant(id: String!): Tenant
    landlord(id: String!): Landlord
  }
`;

const resolvers = {
  Query: {
    async tenants() {
      const tenants = await admin
        .firestore()
        .collection('tenants')
        .get();
      return tenants.docs.map(tenant => tenant.data());
    },
    async landlords() {
      const landlords = await admin
        .firestore()
        .collection('landlords')
        .get();
      return landlords.docs.map(landlord => landlord.data());
    },
    async matches() {
      const matches = await admin
        .firestore()
        .collection('matches')
        .get();
      return matches.docs.map(match => match.data());
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
