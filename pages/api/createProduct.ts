import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from 'next';
import { createProductDb } from "@/lib/db-logic"; // Tu lógica de Prisma

const FormSchemaProduct = z.object({
  name: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
});

export default async function createProducthandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newProduct = await createProductDb(FormSchemaProduct.safeParse(req.body));

    return res.status(200).json(newProduct);
  }
  catch (error) {
    console.error("Error Prisma:", error);
  }
}
