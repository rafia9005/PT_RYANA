import { addProduct } from '@/lib/serviceAddProduct';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  status: boolean;
  statusCode: number;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== 'POST') {
      console.error('Invalid HTTP method:', req.method);
      throw new Error('Metode HTTP tidak didukung');
    }

    const { id, name, price, desc, linkImage, chatText } = req.body;

    console.log('Received POST request with data:', { id, name, price, desc, linkImage, chatText });

    const newProduct = await addProduct(id, name, price, desc, linkImage, chatText);

    console.log('Product added successfully:', newProduct);

    res.status(201).json({ status: true, statusCode: 201, data: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ status: false, statusCode: 500, data: 'Gagal menambahkan produk baru' });
  }
}
