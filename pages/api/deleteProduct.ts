// pages/api/deleteProduct.ts
import { prisma } from "@/components/prisma";
import z from "zod";
import { NextApiRequest, NextApiResponse } from "next";

const FormSchema = z.object({
  id: z.string().uuid(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const validation = FormSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: req.body.id },
    });

    const responseData = JSON.parse(
      JSON.stringify(deletedProduct, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ error: "No se pudo eliminar el producto" });
  }
}