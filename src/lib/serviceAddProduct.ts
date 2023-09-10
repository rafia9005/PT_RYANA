import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from './firebase';

const firestore = getFirestore(app);

export async function addProduct(id: string, name: string, price: number, decs: string, linkImage: string, chatText: string) {
  try {
    const productData = {
      id,
      name,
      price,
      decs,
      linkImage
    };

    await addDoc(collection(firestore, 'products'), productData);

    return productData;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Gagal menambahkan produk baru');
  }
}
