import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';

import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private firestore: Firestore,
    private auth: Auth // ✅ ADD THIS
  ) {}

  // ✅ helper to get user-specific collection
  private getCollection() {
  const uid = this.auth.currentUser?.uid;

  if (!uid) {
    // return empty safe collection instead of crashing
    return collection(this.firestore, `temp/guest/transactions`);
  }

  return collection(this.firestore, `users/${uid}/transactions`);
}

  async addTransaction(transaction: any) {
    return await addDoc(this.getCollection(), transaction);
  }

  async getTransactions(): Promise<any[]> {
    const snapshot = await getDocs(this.getCollection());

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteTransaction(id: string) {
    const uid = this.auth.currentUser?.uid;
    return await deleteDoc(
      doc(this.firestore, `users/${uid}/transactions/${id}`)
    );
  }

  async updateTransaction(id: string, data: any) {
    const uid = this.auth.currentUser?.uid;
    return await updateDoc(
      doc(this.firestore, `users/${uid}/transactions/${id}`),
      data
    );
  }
}