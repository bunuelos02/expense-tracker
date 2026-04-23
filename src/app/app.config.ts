import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXGI-Th5CEDP5TbRyDY-ovoodm5DvQeM8",
  authDomain: "expense-tracker-e5852.firebaseapp.com",
  projectId: "expense-tracker-e5852",
  storageBucket: "expense-tracker-e5852.firebasestorage.app",
  messagingSenderId: "406213234553",
  appId: "1:406213234553:web:cf9b4902e3114de37ee9a8",
  measurementId: "G-XY48K5GVBP"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};