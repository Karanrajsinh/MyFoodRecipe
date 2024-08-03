import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
export  const firebaseConfig = {
  apiKey: "AIzaSyAG7FSUUIv0vwqnTgbKJB4vVDiQkgSgL-g",
  authDomain: "food-recipe-app-36580.firebaseapp.com",
  projectId: "food-recipe-app-36580",
  storageBucket: "food-recipe-app-36580.appspot.com",
  messagingSenderId: "1097286909978",
  appId: "1:1097286909978:web:be741007414239be40d1a3",
  measurementId: "G-4J7XGVFBDT"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); 

export {app,db};