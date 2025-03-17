type environmentModeType = 'DEVELOPMENT' | 'PRODUCTION';

let environmentMode = 'PRODUCTION' as environmentModeType;

import dotenv from 'dotenv';
dotenv.config();
const onlineDatabase1 = `mongodb+srv://ar7:12345@cluster0.1g8wuka.mongodb.net/weather_consumer_report?retryWrites=true&w=majority`;
const onlineDatabase2 = 'mongodb://localhost:27017/Weather';

export const databaseUrlOfWeatherConsumerReport = onlineDatabase2;
export const jwtSecretKey = 'weather_consumer_report_tag_hash';
export const adminChangingPasswordJwtSecretKey =
  'weather_consumer_report_admin_changing_password_jwt_key';
export const frontendAddress =
  environmentMode === 'DEVELOPMENT'
    ? 'http://localhost:3000'
    : 'https://accountabilityworld.org';
console.log(frontendAddress);
export const myPort = 5000;
export const stripePublishableKey =
  'pk_test_51Qk1iMFxqeIeIgIv4jauq9SUOcKvo995GZSoOmQL0lKi5dDTlF7eeBvNSCuQR3XOUcsQ8DnEq9ZxiV4z4mKCwfZ600p5lxsKQd';
export const stripeSecretKey =
  'sk_test_51Qk1iMFxqeIeIgIvD07l65DZLJewZBAcDLgYrE5K4twe8Ji51rnXZBKBvMBIzWuZC4AAx3HeW1WRsCKNoRCP8Zq100RvHQ6Nkg';
export const ownerEmail = 'apurboroy7077@gmail.com';
export const googleMapApiKey = 'AIzaSyDMku_9jbmSK-DCRPDUI5HtwIIqPH4vkO4';
export const CONTACT_EMAIL_1 = 'cweathers@accountabilityworld.net';
export const CONTACT_EMAIL_2 = 'info@accountabilityworld.net';
