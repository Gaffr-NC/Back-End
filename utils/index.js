const admin = require('firebase-admin');

const serviceAccount = require('../service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

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
  updateUserContact,
};
