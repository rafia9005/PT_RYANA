import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from './firebase';

const firestore = getFirestore(app);

// Fungsi untuk mengambil data produk berdasarkan ID
export async function retrieveDataById(id: string) {
  try {
    const productRef = doc(firestore, 'products', id); // ID seharusnya sudah dalam bentuk string
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      return productSnapshot.data();
    } else {
      return null; // Produk tidak ditemukan
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Gagal mengambil data');
  }
}
