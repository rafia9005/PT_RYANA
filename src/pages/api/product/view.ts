import { retrieveData } from '@/lib/serviceViewProduct';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: boolean,
  statusCode: number,
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query: { id } } = req;

  const allData = await retrieveData();
  const selectedData = allData.find(item => item.id === id);

  if (!selectedData) {
    return res.status(404).json({ status: false, statusCode: 404, data: null });
  }

  res.status(200).json({ status: true, statusCode: 200, data: selectedData });
}
