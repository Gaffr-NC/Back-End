const admin = require('firebase-admin');

const serviceAccount = require('./service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const getTenants = async () => {
  const tenants = await admin
    .firestore()
    .collection('tenants')
    .get();
  return tenants.docs.map(tenant => tenant.data());
};

const getLandLords = async () => {
  const landlords = await admin
    .firestore()
    .collection('landlords')
    .get();
  return landlords.docs.map(landlord => landlord.data());
};

const getMatchesByLandlord = async (landlordId) => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('landlordId', '==', landlordId)
    .get();
  return matches.docs.map(match => match.data());
};
const getMatchesByTenant = async (tenantId) => {
  const matches = await admin
    .firestore()
    .collection('matches')
    .where('tenantId', '==', tenantId)
    .get();
  return matches.docs.map(match => match.data());
};
