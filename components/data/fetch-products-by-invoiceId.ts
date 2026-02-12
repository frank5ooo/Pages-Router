import { z } from "zod";
import { getProductsByInvoiceId } from "../../lib/data-invoices";

const FormSchema = z.object({
  id: z.string(),
});

export async function fetchProductsByInvoiceId(parsedInput: any) {
  return await getProductsByInvoiceId(parsedInput.id);
}