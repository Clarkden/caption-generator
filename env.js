// import Constants from "expo-constants";

// function getOthers() {
//   const REWARDED_INTERSTITIAL =
//     Constants.expoConfig.extra.REWARDED_INTERSTITIAL;
//   const BANNER = Constants.expoConfig.extra.BANNER;
//   const ENVIRONMENT = Constants.expoConfig.extra.ENVIRONMENT;
//   const GENERATION_LINK = Constants.expoConfig.extra.GENERATION_LINK;

//   if (!REWARDED_INTERSTITIAL) {
//     throw new Error("REWARDED_INTERSTITIAL is missing.");
//   }
//   if (!BANNER) {
//     throw new Error("BANNER is missing.");
//   }
//   if (!ENVIRONMENT) {
//     throw new Error("ENVIRONMENT is missing.");
//   }
//   if (!GENERATION_LINK) {
//     throw new Error("GENERATION_LINK is missing.");
//   }

//   return {
//     REWARDED_INTERSTITIAL,
//     BANNER,
//     ENVIRONMENT,
//     GENERATION_LINK,
//   };
// }
// function getFirebaseData() {
//   const FIREBASE_API_KEY = Constants.expoConfig.extra.FIREBASE_API_KEY;
//   const FIREBASE_AUTH_DOMAIN = Constants.expoConfig.extra.FIREBASE_AUTH_DOMAIN;
//   const FIREBASE_PROJECT_ID = Constants.expoConfig.extra.FIREBASE_PROJECT_ID;
//   const FIREBASE_STORAGE_BUCKET =
//     Constants.expoConfig.extra.FIREBASE_STORAGE_BUCKET;
//   const FIREBASE_MESSAGING_SENDER_ID =
//     Constants.expoConfig.extra.FIREBASE_MESSAGING_SENDER_ID;
//   const FIREBASE_APP_ID = Constants.expoConfig.extra.FIREBASE_APP_ID;
//   const FIREBASE_MEASUREMENT_ID =
//     Constants.expoConfig.extra.FIREBASE_MEASUREMENT_ID;

//   if (!FIREBASE_API_KEY) {
//     throw new Error("FIREBASE_API_KEY is missing.");
//   }
//   if (!FIREBASE_AUTH_DOMAIN) {
//     throw new Error("FIREBASE_AUTH_DOMAIN is missing.");
//   }
//   if (!FIREBASE_PROJECT_ID) {
//     throw new Error("FIREBASE_PROJECT_ID is missing.");
//   }
//   if (!FIREBASE_STORAGE_BUCKET) {
//     throw new Error("FIREBASE_STORAGE_BUCKET is missing.");
//   }
//   if (!FIREBASE_MESSAGING_SENDER_ID) {
//     throw new Error("FIREBASE_MESSAGING_SENDER_ID is missing.");
//   }
//   if (!FIREBASE_APP_ID) {
//     throw new Error("FIREBASE_APP_ID is missing.");
//   }
//   if (!FIREBASE_MEASUREMENT_ID) {
//     throw new Error("FIREBASE_MEASUREMENT_ID is missing.");
//   }

//   return {
//     FIREBASE_API_KEY,
//     FIREBASE_AUTH_DOMAIN,
//     FIREBASE_PROJECT_ID,
//     FIREBASE_STORAGE_BUCKET,
//     FIREBASE_MESSAGING_SENDER_ID,
//     FIREBASE_APP_ID,
//     FIREBASE_MEASUREMENT_ID,
//   };
// }

// export const ENV = {
//   FIREBASE_API_KEY: getFirebaseData().FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN: getFirebaseData().FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID: getFirebaseData().FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET: getFirebaseData().FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID: getFirebaseData().FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID: getFirebaseData().FIREBASE_APP_ID,
//   FIREBASE_MEASUREMENT_ID: getFirebaseData().FIREBASE_MEASUREMENT_ID,
//   REWARDED_INTERSTITIAL: getOthers().REWARDED_INTERSTITIAL,
//   BANNER: getOthers().BANNER,
//   ENVIRONMENT: getOthers().ENVIRONMENT,
//   GENERATION_LINK: getOthers().GENERATION_LINK,
// };
