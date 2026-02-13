import { prisma } from "../../components/prisma";
import z from "zod";
import { NextApiRequest, NextApiResponse } from "next";

const FormSchema = z.object({
  id: z.string().uuid(),
});

export default async function deleteInvoice(req: NextApiRequest, res: NextApiResponse) {
  const result = FormSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const deleteado = await prisma.invoice.delete({
    where: {
      id: req.body.id,
    },
  });

  return res.status(200).json(deleteado);

}
