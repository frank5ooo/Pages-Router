import { z } from "zod/v4";
import { payloadSchema } from "../../definitions";
import { getInvoicesPagesCount } from "@/lib/data-invoices";

const FormSchema = payloadSchema(
  z.object({
    query: z.string(),
    status: z.string(),
  })
);

export async function fetchInvoicesPages(parsedInput: any) {

  const { data, pagination } = parsedInput;

  const validated = FormSchema.safeParse({ query: data.query, status: data.status });

  if (!validated.success) {
    console.error("Parámetros de búsqueda inválidos:", validated.error.flatten());
    return 0; 
  }
  
  return await getInvoicesPagesCount({
    query: data.query,
    status: data.status,
    perPage: pagination.perPage
  });
}