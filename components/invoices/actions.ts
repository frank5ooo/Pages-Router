import { actionClient } from "@/pages/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { createInvoiceDb } from "../../lib/db-logic";

const FormSchema = zfd.formData({
    customerId: zfd.text(),
    status: zfd.text().transform((val) => z.enum(["pending", "paid"]).parse(val)),
    productIds: zfd.text().transform((val) => val.split(",")),
});

export const createInvoiceAction = actionClient
    .schema(FormSchema) // Valida el FormData automáticamente
    .action(async ({ parsedInput }) => {

        console.log("parsedInput:", parsedInput);
        const invoice = await createInvoiceDb(parsedInput);
        return invoice;
    });