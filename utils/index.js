const admin = require('firebase-admin');

const serviceAccount = require('../service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const getTenants = async () => {
  const tenants = await admin
    .firestore()
    .collection('tenants')
    .get();
  return tenants.docs.map(tenant => ({ ...tenant.data(), id: tenant.id }));
};

const getTenantById = async id => {
  const tenant = await admin
    .firestore()
    .doc(`tenants/${id}`)
    .get();
  return tenant.data();
};

const getLandLords = async () => {
  const landlords = await admin
    .firestore()
    .collection('landlords')
    .get();
  return landlords.docs.map(landlord => ({
    ...landlord.data(),
    id: landlord.id
  }));
};

const getMatchesByLandlord = async landlordId => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('landlordId', '==', landlordId)
    .get();
  return matches.docs.map(match => match.data());
};

const getMatchesByTenant = async tenantId => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('tenantId', '==', tenantId)
    .get();
  return matches.docs.map(match => ({ ...match.data(), id: match.id }));
};

const addTenant = async tenant => {
  await admin
    .firestore()
    .collection('tenants')
    .add(tenant)
    .then(ref => {
      console.log('added document with ID: ', ref.id);
    });
};

const addLandlord = async landlord => {
  await admin
    .firestore()
    .collection('landlords')
    .add(landlord)
    .then(ref => {
      console.log('added document with ID: ', ref.id);
    });
};

const addMatch = async (landlordId, tenantId) => {
  await admin
    .firestore()
    .collection('matches')
    .add({
      landlordId,
      tenantId,
      chatHistory: [],
      blocked: false
    })
    .then(ref => {
      console.log('match made, id: ', ref.id);
    });
};

const blockMatch = async matchId => {
  admin
    .firestore()
    .collection('matches')
    .doc(matchId)
    .update({ blocked: false });
};

const deleteLandlord = async landlordId => {
  admin
    .firestore()
    .collection('landlords')
    .doc(landlordId)
    .delete();
};

const deleteTenant = async tenantId => {
  admin
    .firestore()
    .collection('tenants')
    .doc(tenantId)
    .delete();
};

module.exports = {
  deleteLandlord,
  deleteTenant,
  blockMatch,
  addMatch,
  addLandlord,
  addTenant,
  getLandLords,
  getTenants,
  getMatchesByLandlord,
  getMatchesByTenant,
  getTenantById
};

// getTenantById('3oFdQ2X3q0IeTKRo3L2I');
