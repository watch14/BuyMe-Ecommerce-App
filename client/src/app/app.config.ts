import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp} from '@angular/fire/app'
import { provideStorage, getStorage } from '@angular/fire/storage'

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

// Your web app's Firebase configuration

const firebaseConfig = {

//firebase info

appId: "0"

};

// Your web app's Firebase configuration

const firebaseConfig2 = {

//firebase info

  appId: "0"

};



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
     importProvidersFrom(provideFirebaseApp(() => initializeApp(firebaseConfig))), importProvidersFrom(provideStorage(() => getStorage())), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()]
};
