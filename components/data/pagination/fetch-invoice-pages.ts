import { actionClient } from "pages/safe-action";
import { z } from "zod/v4";
import { payloadSchema } from "../../definitions";
import { getInvoicesPagesCount } from "@/lib/data-invoices";

const FormSchema = payloadSchema(
  z.object({
    query: z.string(),
    status: z.string(),
  })
);

export const fetchInvoicesPages = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    // Extraemos lo que necesitamos del input validado por Zod
    const { data, pagination } = parsedInput;
    return await getInvoicesPagesCount({ 
        query: data.query, 
        status: data.status, 
        perPage: pagination.perPage 
    });
  });