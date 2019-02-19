const { gql } = require('apollo-server');

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
    updateTenantPreferences(input: TenantPreferences, id: String): String
    updateLandlordContact(input: contactInput, id: String): String
    updateLandlordProperty(input: LandlordProperty, id: String): String
    deleteTenant(input: String): String
    deleteLandlord(input: String): String
  }
`;

module.exports = { typeDefs };
