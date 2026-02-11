import { prisma } from "@/components/prisma";
import { actionClient } from "@/pages/safe-action";
import z from "zod";
import { useRouter } from "next/router";
const FormSchema = z.object({
  id: z.string().uuid(),
});

export const deleteProduct = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {

    await prisma.product.delete({
      where: {
        id: parsedInput.id,
      },
    });

    const router = useRouter();

    router.push("/products");
  });
