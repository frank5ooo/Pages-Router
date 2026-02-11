import { prisma } from "../prisma";
import { actionClient } from "@/pages/safe-action";
import z from "zod";
import { useRouter } from "next/navigation";
const FormSchema = z.object({
  id: z.string().uuid(),
});

export const deleteInvoice = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    await prisma.invoice.delete({
      where: {
        id: parsedInput.id,
      },
    });


    const router = useRouter();

    router.push("/invoices");
  });
