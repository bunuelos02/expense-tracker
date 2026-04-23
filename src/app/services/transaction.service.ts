import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private firestore: Firestore) {}

  async addTransaction(transaction: any) {
    const ref = collection(this.firestore, 'transactions');
    return await addDoc(ref, transaction);
  }

  async getTransactions(): Promise<any[]> {
    const ref = collection(this.firestore, 'transactions');
    const snapshot = await getDocs(ref);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteTransaction(id: string) {
    const ref = doc(this.firestore, `transactions/${id}`);
    return await deleteDoc(ref);
  }

  async updateTransaction(id: string, data: any) {
    const ref = doc(this.firestore, `transactions/${id}`);
    return await updateDoc(ref, data);
  }
}