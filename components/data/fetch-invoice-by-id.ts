import { prisma } from "../prisma";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
});

export async function fetchInvoiceById(parsedInput: any) {

  const validated = FormSchema.safeParse({ id: parsedInput.id });

  if (!validated.success) {
    console.error("Parámetros de búsqueda inválidos:", validated.error);
    return 0;
  }
  try {
    const data = await prisma.invoice.findUnique({
      where: { id: parsedInput.id },
      select: {
        id: true,
        customer_id: true,
        status: true,
        date: true,
        products: true,
      },
    });

    if (!data) return null;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}
