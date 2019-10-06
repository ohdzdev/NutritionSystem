import app from 'firebase/app';
import 'firebase/analytics';
import 'firebase/performance';
// import 'firebase/storage';

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MSG_SEND_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASURE_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyA0x17OnTFISXMYUYIk2Mj60A1ougZtYaQ",
  authDomain: "zoo-nutrition.firebaseapp.com",
  databaseURL: "https://zoo-nutrition.firebaseio.com",
  projectId: "zoo-nutrition",
  storageBucket: "",
  messagingSenderId: "867899608518",
  appId: "1:867899608518:web:aa7930afdfea9bdd2bf6c7",
  measurementId: "G-6P60DRKLBT"
};


const startFirebase = () => {
  console.log(firebaseConfig);
  try {
    app.app()
  } catch (error) {
    app.initializeApp(firebaseConfig);
  }
  return {
    app,
    analytics: app.analytics,
    performance: app.performance,
  }
}

export default startFirebase;
