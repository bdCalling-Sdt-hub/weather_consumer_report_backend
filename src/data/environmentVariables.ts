import dotenv from 'dotenv';
dotenv.config();

export const databaseUrlOfWeatherConsumerReport = `mongodb+srv://ar7:12345@cluster0.1g8wuka.mongodb.net/weather_consumer_report?retryWrites=true&w=majority`;
export const jwtSecretKey = 'weather_consumer_report_tag_hash';
export const adminChangingPasswordJwtSecretKey =
  'weather_consumer_report_admin_changing_password_jwt_key';
export const frontendAddress = 'http://localhost:3000';
export const myPort = 5000;
export const stripePublishableKey =
  'pk_test_51Qk1iMFxqeIeIgIv4jauq9SUOcKvo995GZSoOmQL0lKi5dDTlF7eeBvNSCuQR3XOUcsQ8DnEq9ZxiV4z4mKCwfZ600p5lxsKQd';
export const stripeSecretKey =
  'sk_test_51Qk1iMFxqeIeIgIvD07l65DZLJewZBAcDLgYrE5K4twe8Ji51rnXZBKBvMBIzWuZC4AAx3HeW1WRsCKNoRCP8Zq100RvHQ6Nkg';
export const ownerEmail = 'apurboroy7077@gmail.com';
export const googleMapApiKey = process.env.GOOGLE_MAP_API_KEY;
