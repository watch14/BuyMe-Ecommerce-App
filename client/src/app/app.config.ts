import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

const firebaseConfig = {

  apiKey: "AIzaSyCOO7afbVou_EoGIzMAZ0mMGftUfEz4WpY",

  authDomain: "byme-picture.firebaseapp.com",

  projectId: "byme-picture",

  storageBucket: "byme-picture.appspot.com",

  messagingSenderId: "1035349061763",

  appId: "1:1035349061763:web:92bdd1af0f3b2fdeaa2bb6"

};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
