/* eslint-disable camelcase */
const admin = require('firebase-admin');

const SERVICE_ACCOUNT = process.env.NODE_ENV !== 'production' ? require('../service-account.json') : '';

if (process.env.NODE_ENV === 'production') {
  const {
    type,
    project_id,
    private_key_id,
    private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
  } = process.env;
  admin.initializeApp({
    credential: admin.credential.cert({
      type,
      project_id,
      private_key_id,
      private_key: private_key.replace(/\\n/g, '\n'),
      client_email,
      client_id,
      auth_uri,
      token_uri,
      auth_provider_x509_cert_url,
      client_x509_cert_url,
    }),
  });
} else {
  admin.initializeApp({ credential: admin.credential.cert(SERVICE_ACCOUNT) });
}

const getUsers = async (table) => {
  const users = await admin
    .firestore()
    .collection(table)
    .get();
  return users.docs.map(user => ({ ...user.data(), id: user.id }));
};

const getUserById = async (id, table) => {
  const user = await admin
    .firestore()
    .doc(`${table}/${id}`)
    .get();
  return user.data();
};

// ! Not finished
// TODO: THIS
const getSuitableLandlords = async (preferences) => {
  console.log(preferences);
  const {
    smokingAllowed,
    petsAllowed,
    minPrice,
    maxPrice,
    city,
    bedrooms,
    propertyType,
  } = preferences;

  let landlords = await admin.firestore().collection('landlords');
  if (smokingAllowed) {
    landlords = landlords.where('property.smokingAllowed', '==', true);
  }
  if (petsAllowed) {
    landlords = landlords.where('property.petsAllowed', '==', true);
  }
  if (minPrice || maxPrice) {
    landlords = landlords
      .where('property.price', '>=', minPrice || 0)
      .where('property.price', '<=', maxPrice || Infinity);
  }
  if (bedrooms) {
    landlords = landlords.where('property.bedrooms', '>=', bedrooms);
  }
  if (city) {
    landlords = landlords.where('property.city', '==', city);
  }
  if (propertyType) {
    landlords = landlords.where('property.propertyType', '==', propertyType);
  }
  landlords = await landlords.get();
  return landlords.docs.map(landlord => ({ ...landlord.data(), id: landlord.id }));
};

const getMatchesByLandlord = async (landlordId) => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('landlordId', '==', landlordId)
    .get();
  return matches.docs.map(match => ({ ...match.data(), id: match.id }));
};

const getMatchesByTenant = async (tenantId) => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('tenantId', '==', tenantId)
    .get();
  return matches.docs.map(match => ({ ...match.data(), id: match.id }));
};

// ID comes from auth as UID
const addUser = async (id, user, table) => {
  const userRef = await admin
    .firestore()
    .collection(table)
    .doc(id)
    .set(user);
  console.log(`added user to ${table} with id: ${id}`);
  return userRef;
};

const addMatch = async (landlordId, tenantId) => {
  await admin
    .firestore()
    .collection('matches')
    .add({
      landlordId,
      tenantId,
      chatHistory: [],
      blocked: false,
    })
    .then((ref) => {
      console.log('match made, id: ', ref.id);
    });
};

const updateUserContact = async (id, user, table) => {
  const userRef = await admin
    .firestore()
    .collection(table)
    .doc(id);
  await userRef.update(user);
  return userRef.id;
};
const updateProperty = async (id, property) => {
  const keys = Object.keys(property).map(key => `property.${key}`);
  const values = Object.values(property);
  const updatedObj = {};
  keys.forEach((key, index) => {
    updatedObj[key] = values[index];
  });
  const landlordRef = await admin
    .firestore()
    .collection('landlords')
    .doc(id);
  await landlordRef.update(updatedObj);
  return landlordRef.id;
};
const updatePreferences = async (id, preferences) => {
  const keys = Object.keys(preferences).map(key => `preferences.${key}`);
  const values = Object.values(preferences);
  const updatedObj = {};
  keys.forEach((key, index) => {
    updatedObj[key] = values[index];
  });
  const tenantRef = await admin
    .firestore()
    .collection('tenants')
    .doc(id);
  await tenantRef.update(updatedObj);
  return tenantRef.id;
};
const blockMatch = async (matchId) => {
  admin
    .firestore()
    .collection('matches')
    .doc(matchId)
    .update({ blocked: false });
};

const deleteUserById = async (id, table) => {
  const value = await admin
    .firestore()
    .collection(table)
    .doc(id)
    .delete();
  console.log(value);
};

module.exports = {
  deleteUserById,
  blockMatch,
  addMatch,
  addUser,
  getUsers,
  getMatchesByLandlord,
  getMatchesByTenant,
  getUserById,
  getSuitableLandlords,
  updateUserContact,
  updateProperty,
  updatePreferences,
};
