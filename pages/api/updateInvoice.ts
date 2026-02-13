import { z } from "zod";
import { prisma } from "@/components/prisma";
import { zfd } from "zod-form-data";
import type { NextApiRequest, NextApiResponse } from 'next';

const FormSchema = zfd.formData({
  invoiceId: zfd.text(),
  customerId: zfd.text(),
  status: zfd.text().transform((val) => z.enum(["pending", "paid"]).parse(val)),
  productIds: zfd.text().transform((val) => val.split(",").filter(Boolean)),
});

export default async function updateInvoice(req: NextApiRequest, res: NextApiResponse) {
  const parsedInput = FormSchema.parse(req.body);

  const selectedIds = parsedInput.productIds;

  console.log("selectedIds", selectedIds);

  const currentProducts = await prisma.product.findMany({
    where: {
      invoice_id: parsedInput.invoiceId,
    },
    select: {
      id: true,
    },
  });

  const currentIds = currentProducts.map((p) => p.id);

  // console.log("currentIds", currentIds);

  const toAdd = selectedIds.filter(
    (productId) => !currentIds.includes(productId)
  );

  // console.log("toadd", toAdd);

  const toRemove = currentIds.filter(
    (productId) => !selectedIds.includes(productId)
  );

  try {

    const result = await prisma.$transaction([
      ...toAdd.map((productId) =>
        prisma.product.update({
          where: { id: productId },
          data: { invoice_id: parsedInput.invoiceId },
        })
      ),
      ...toRemove.map((productId) =>
        prisma.product.update({
          where: { id: productId },
          data: { invoice_id: null },
        })
      ),
      prisma.invoice.update({
        where: { id: parsedInput.invoiceId },
        data: {
          customer_id: parsedInput.customerId,
          status: parsedInput.status,
        },
      }),
    ]);
    res.status(200).json({ message: "Invoice updated successfully", data: result });
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }
}
