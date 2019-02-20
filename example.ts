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
