import { prisma } from "@/components/prisma";
import { z } from "zod/v4";
import { payloadSchema } from "../../definitions";

const FormSchema = payloadSchema(
  z.object({
    query: z.string(),
    status: z.string(),
  })
);

export async function fetchProductPages(query, status, perPage)  {

    const maybePrice = Number(query) * 100;
    const isNumber = !isNaN(maybePrice);

    try {
      const total = await prisma.product.count({
        where: {
          ...(status && status == "Sell"
            ? { invoice_id: { not: null } }
            : {}),

          ...(status && status == "OnStock"
            ? { invoice_id: { equals: null } }
            : {}),

          ...(query && query !== ""
            ? {
                OR: [
                  {
                    name: { contains: query, mode: "insensitive" },
                  },
                  ...(isNumber
                    ? [
                        {
                          price: {
                            equals: maybePrice,
                          },
                        },
                      ]
                    : []),
                ],
              }
            : {}),
        },
      });

      const totalPages = Math.ceil(total / perPage);
      // console.log("totalPages fetch", totalPages);
      return totalPages;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch total number of invoices.");
    }
  }
