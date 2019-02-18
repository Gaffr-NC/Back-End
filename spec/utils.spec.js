const { expect } = require('chai');
const { fakeTenant, fakeLandlord } = require('../utils/faker');

describe('faker util functions', () => {
  describe('fake tenant', () => {
    it('should return a tenant object with required properties', () => {
      const tenant = fakeTenant();
      expect(tenant).to.have.property('name');
      expect(tenant).to.have.property('email');
      expect(tenant).to.have.property('phone');
      expect(tenant).to.have.property('preferences');
      expect(tenant.preferences).to.have.property('bedrooms');
      expect(tenant.preferences).to.have.property('city');
      expect(tenant.preferences).to.have.property('maxPrice');
      expect(tenant.preferences).to.have.property('minPrice');
      expect(tenant.preferences).to.have.property('smokingAllowed');
      expect(tenant.preferences).to.have.property('petsAllowed');
      expect(tenant.preferences.maxPrice).to.be.a('number');
      expect(tenant.preferences.city).to.be.a('string');
      expect(tenant.preferences.smokingAllowed).to.be.a('boolean');
    });
  });
  describe('fake landlord', () => {
    it('should return a landlord object with required properties', async () => {
      const landlord = await fakeLandlord();
      expect(landlord).to.have.property('name');
      expect(landlord).to.have.property('email');
      expect(landlord).to.have.property('phone');
      expect(landlord).to.have.property('property');
      expect(landlord.property).to.have.property('bedrooms');
      expect(landlord.property).to.have.property('city');
      expect(landlord.property).to.have.property('price');
      expect(landlord.property).to.have.property('smokingAllowed');
      expect(landlord.property).to.have.property('petsAllowed');
      expect(landlord.property.price).to.be.a('number');
      expect(landlord.property.city).to.be.a('string');
      expect(landlord.property.smokingAllowed).to.be.a('boolean');
    });
  });
});
