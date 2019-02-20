const admin = require('firebase-admin');
const SERVICE_ACCOUNT = process.env.NODE_ENV !== 'production' ? require('./service-account.json') : '';

admin.initializeApp({ credential: admin.credential.cert(SERVICE_ACCOUNT) });
const getUsers = async (table) => {
  const users = await admin
    .firestore()
    .collection(table)
    .get();
  return users.docs.map(user => Object.assign({}, user.data(), { id: user.id }));
};

module.exports = { getUsers };
