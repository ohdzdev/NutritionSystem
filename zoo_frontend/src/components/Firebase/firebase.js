import app from 'firebase/app';
import 'firebase/analytics';
import 'firebase/performance';
// import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STOR_BUCKET,
  messagingSenderId: process.env.FB_MSG_SEND_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASURE_ID,
};


const startFirebase = () => {
  console.log(firebaseConfig);
  try {
    app.app()
  } catch (error) {
    app.initializeApp(firebaseConfig);
    app.performance();
    
  }
  return {
    app,
    analytics: app.analytics,
    performance: app.performance,
  }
}

export default startFirebase;
