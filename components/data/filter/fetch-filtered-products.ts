import { prisma } from "@/components/prisma";
import { z } from "zod";

const ITEMS_PER_PAGE = 6;

const FormSchema = z.object({
  currentPage: z.number(),
  query: z.string(),
  status: z.string().optional(),
});

export async function fetchFilteredProducts(query, currentPage, status) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const maybePrice = Number(query) * 100;
    const isNumber = !isNaN(maybePrice);

    try {
      const products = await prisma.product.findMany({
        take: ITEMS_PER_PAGE,
        skip: offset,
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
        orderBy: {
          invoice_id: "asc",
        },
      });

      return products;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch products.");
    }
  }
