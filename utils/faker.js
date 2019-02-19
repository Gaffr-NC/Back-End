const faker = require('faker');
const axios = require('axios');
const { addTenant, addLandlord } = require('./index');
const { APP_ACCESS_KEY } = require('../apiconfig');

const cities = ['manchester', 'london', 'leeds', 'birmingham'];
const randomSelector = arr => arr[Math.floor(Math.random() * arr.length)];

const fakeTenant = () => {
  const randBool = Math.round(Math.random());
  const maxPrice = Math.ceil(Math.random() * 1800) + 200;
  const tenant = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    preferences: {
      bedrooms: Math.ceil(Math.random() * 5),
      city: randomSelector(cities),
      maxPrice,
      minPrice: maxPrice - 200,
      smokingAllowed: !!randBool,
      petsAllowed: !randBool,
    },
  };
  return tenant;
};
addTenant(fakeTenant());
const fakeLandlord = async () => {
  const BASE_URL = 'https://api.unsplash.com/search/photos/';
  const properties = ['house', 'flat', 'apartment', 'bungalow', 'mansion'];
  const property = randomSelector(properties);
  let imageUrl = '';
  await axios.get(`${BASE_URL}?query=${property}&client_id=${APP_ACCESS_KEY}`).then((res) => {
    imageUrl = res.data.results[0].urls.regular;
  });
  const adjectives = ['nice', 'big', 'vibrant', 'cosy', 'hip', 'trendy', 'spacious', 'convenient'];
  const randBool = Math.round(Math.random());
  const price = Math.ceil(Math.random() * 1500) + 200;
  const landlord = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    property: {
      bedrooms: Math.ceil(Math.random() * 5),
      description: `A ${randomSelector(adjectives)} ${property} in a ${randomSelector(
        adjectives,
      )} neighbourhood.`,
      images: [imageUrl, faker.image.nightlife()],
      price,
      propertyType: property,
      city: randomSelector(cities),
      petsAllowed: !!randBool,
      smokingAllowed: !randBool,
    },
  };
  return landlord;
};

for (i = 0; i < 10; i++) {
  addTenant(fakeTenant());
  fakeTenant();
}

module.exports = { fakeTenant, fakeLandlord };
