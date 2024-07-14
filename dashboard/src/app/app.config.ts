import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOO7afbVou_EoGIzMAZ0mMGftUfEz4WpY",
  authDomain: "byme-picture.firebaseapp.com",
  projectId: "byme-picture",
  storageBucket: "byme-picture.appspot.com",
  messagingSenderId: "1035349061763",
  appId: "1:1035349061763:web:92bdd1af0f3b2fdeaa2bb6"
};

// Your web app's Firebase configuration
const firebaseConfig2 = {
  apiKey: "AIzaSyBMHPbLIt-ePXEnSEHfhzSgEl0flz7zt0k",
  authDomain: "buyme-3fd57.firebaseapp.com",
  projectId: "buyme-3fd57",
  storageBucket: "buyme-3fd57.appspot.com",
  messagingSenderId: "98610282041",
  appId: "1:98610282041:web:4c8463b67f77982afed7e8"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),
  ]
};
