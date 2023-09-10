import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from './firebase';

const firestore = getFirestore(app);

export async function retrieveData() {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'products'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Gagal mengambil data');
  }
}
