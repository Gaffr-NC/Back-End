const admin = require('firebase-admin');

const getUsers = async (table) => {
  const users = await admin
    .firestore()
    .collection(table)
    .get();
  return users.docs.map(user => Object.assign({}, user.data(), { id: user.id }));
};
const getUserById = async (id, table) => {
  const user = await admin
    .firestore()
    .doc(`${table}/${id}`)
    .get();
  return user.data();
};
const getMatchesByLandlord = async (landlordId) => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('landlordId', '==', landlordId)
    .get();
  return matches.docs.map(match => Object.assign({}, match.data(), { id: match.id }));
};
const getMatchesByTenant = async (tenantId) => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('tenantId', '==', tenantId)
    .get();
  return matches.docs.map(match => Object.assign({}, match.data(), { id: match.id }));
};
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

export {
  getUsers,
  getUserById,
  getMatchesByLandlord,
  getMatchesByTenant,
  addUser,
  addMatch,
  updateUserContact,
  updateProperty,
  updatePreferences,
  blockMatch,
  deleteUserById,
};
