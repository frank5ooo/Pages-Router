import { z } from "zod";
import { prisma } from "@/components/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

const FormSchemaProduct = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.coerce
    .bigint()
    .gt(BigInt(0), { message: "Please enter an amount greater than $0." }),
});

export default async function updateProduct(req: NextApiRequest, res: NextApiResponse) {
  
  try {
    const { id, name, price } = req.body;

    const result = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: BigInt(price),
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo actualizar el producto" });
  }
}