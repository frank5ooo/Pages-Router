import { z } from "zod";
import { getProductsByInvoiceId } from "../../lib/data-invoices";

const FormSchema = z.object({
  id: z.string(),
});

export async function fetchProductsByInvoiceId(parsedInput: any) {

  const validated = FormSchema.safeParse({ id: parsedInput.id });

  if (!validated.success) {
    console.error("Parámetros de búsqueda inválidos:", validated.error);
    return 0;
  }

  return await getProductsByInvoiceId(parsedInput.id);
}