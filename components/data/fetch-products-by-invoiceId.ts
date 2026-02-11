import { prisma } from "../prisma";
import { actionClient } from "pages/safe-action";
import { z } from "zod";
import { getProductsByInvoiceId } from "../../lib/data-invoices";


const FormSchema = z.object({
  id: z.string(),
});

export const fetchProductsByInvoiceId = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    return await getProductsByInvoiceId(parsedInput.id);
  }); 