import dotenv from 'dotenv';
dotenv.config();

export const baseUrls = {
  api: process.env.API_BASE_URL,            // https://api.p-stageenv.xyz
  locations: process.env.LOCATIONS_BASE_URL // https://locations.p-stageenv.xyz
};

export const driverLoginHeaders = {
  // 'city_id': process.env.DRIVER_CITY_ID || 1,    // e.g., 1
  'Android-OS': process.env.DRIVER_ANDROID_OS || 15, // e.g., 15
  'App-Agent': process.env.DRIVER_APP_AGENT ||"driver/android/274"   // e.g., driver/android/278
};

export const userAuth = {
  token: process.env.USER_TOKEN             // user bearer token
};

export const driverAuthh = {
  clientId: process.env.DRIVER_CLIENT_ID || "60b700b76c44ef656f21ebffb07205c1",
  username: process.env.DRIVER_USERNAME || "01913437142",
  password: process.env.DRIVER_PASSWORD || "123456"
};

export const driverAuth = () => ({
  clientId: process.env.DRIVER_CLIENT_ID || "60b700b76c44ef656f21ebffb07205c1",
  username: process.env.DRIVER_USERNAME || "01913437142",
  password: process.env.DRIVER_PASSWORD || "123456"
});
