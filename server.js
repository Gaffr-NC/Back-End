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
  return matches.docs.map(match => match.data());
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

const tenant = {
  email: 'hello@email.com',
  name: 'mr house man',
  phone: '07916005655',
  preferences: {
    bedrooms: 1,
    city: 'london',
    maxPrice: 400,
    minPrice: 0,
    petsAllowed: true
  }
};

const landlord = {
  email: 'lucy@lord.net',
  name: 'lucy Land',
  phone: '0161726676786',
  property: {
    images: [
      'https://urbangauge.com/wp-content/uploads/2018/06/flat.jpg',
      'https://www.rightmove.co.uk/news/wp-content/uploads/2018/03/61682_3995232_IMG_01_0000.jpg'
    ],
    description: 'a flat',
    preferences: {
      bedrooms: 1,
      city: 'london',
      petsAllowed: true,
      price: 400,
      propertyType: 'flat'
    }
  }
};

// blockMatch('13JfwO1SNvwMLeGg1Wph');

// deleteLandlord('ujKvwwT8ylEiHwItDMbI');

// addLandlord(landlord);

deleteTenant('1');
