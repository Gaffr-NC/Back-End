const admin = require('firebase-admin');

const SERVICE_ACCOUNT = process.env.NODE_ENV !== 'production' ? require('./service-account.json') : '';

interface Property {
  bedrooms: Number;
  city: String;
  images: String[];
  price: Number;
  petsAllowed: Boolean;
  propertyType: String;
  smokingAllowed: Boolean;
}

interface Preferences {
  bedrooms: Number;
  city: String;
  images: String[];
  petsAllowed: Boolean;
  maxPrice: Number;
  minPrice: Number;
  propertyType: String;
  smokingAllowed: Boolean;
}

interface User {
  id?: String;
  email: String;
  name: String;
  phone: String;
  property?: Property;
  preferences?: Preferences;
}

const getUsers = async (table: String) => {
  const users: any = await admin
    .firestore()
    .collection(table)
    .get();
  return users.docs.map((user: any) => ({ ...user.data(), id: user.id })) as User[];
};

const getUserById = async (id: String, table: String) => {
  const user: any = await admin
    .firestore()
    .doc(`${table}/${id}`)
    .get();
  return user.data();
};

interface Match {
  landlordId: String;
  tenantId: String;
  chatHistory?: [];
}

const getMatchesByLandlord = async (landlordId: String) => {
  const matches: any = await admin
    .firestore()
    .collection('matches')
    .where('landlordId', '==', landlordId)
    .get();
  return matches.docs.map((match: any) => ({ ...match.data(), id: match.id })) as Match[];
};

const getMatchesByTenant = async (tenantId: String) => {
  const matches: any = await admin
    .firestore()
    .collection('matches')
    .where('tenantId', '==', tenantId)
    .get();
  return matches.docs.map((match: any) => ({ ...match.data(), id: match.id })) as Match[];
};

const addUser = async (id: String, user: String, table: String) => {
  const userRef: any = await admin
    .firestore()
    .collection(table)
    .doc(id)
    .set(user);
  console.log(`added user to ${table} with id: ${id}`);
  return userRef;
};

const addMatch = async (landlordId: String, tenantId: String) => {
  await admin
    .firestore()
    .collection('matches')
    .add({
      landlordId,
      tenantId,
      chatHistory: [],
      blocked: false,
    })
    .then((ref: any) => {
      console.log('match made, id: ', ref.id);
    });
};

const updateUserContact = async (id: String, user: String, table: String) => {
  const userRef: any = await admin
    .firestore()
    .collection(table)
    .doc(id);
  await userRef.update(user);
  return userRef.id;
};

interface UpdateProperty extends Property {
  [key: string]: any;
  values: Number;
}

const updateProperty = async (id: String, property: UpdateProperty) => {
  const keys: any[] = Object.keys(property).map((key: String) => `property.${key}`);
  const values: any[] = Object.values(property);
  const updatedObj: any = {};
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

interface UpdatePreferences extends Preferences {
  [key: string]: any;
  values: Number;
}

const updatePreferences = async (id: String, preferences: UpdatePreferences) => {
  const keys: any[] = Object.keys(preferences).map(key => `preferences.${key}`);
  const values: any[] = Object.values(preferences);
  const updatedObj: any = {};
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

const blockMatch = async (matchId: String) => {
  admin
    .firestore()
    .collection('matches')
    .doc(matchId)
    .update({ blocked: false });
};

const deleteUserById = async (id: String, table: String) => {
  const value: any = await admin
    .firestore()
    .collection(table)
    .doc(id)
    .delete();
  console.log(value);
};
