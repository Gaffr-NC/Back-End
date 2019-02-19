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

const addUser = async (user, table) => {
  const userRef = await admin
    .firestore()
    .collection(table)
    .add(user);
  console.log(`added user to ${table} with id: ${userRef.id}`);
  return userRef.id;
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

const blockMatch = async (matchId) => {
  admin
    .firestore()
    .collection('matches')
    .doc(matchId)
    .update({ blocked: false });
};

const deleteUserById = async (id, table) => {
  admin
    .firestore()
    .collection(table)
    .doc(id)
    .delete();
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
};
