import type { NextApiRequest, NextApiResponse } from 'next';
import { createInvoiceDb } from "@/lib/db-logic"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await createInvoiceDb(req.body); 
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
}