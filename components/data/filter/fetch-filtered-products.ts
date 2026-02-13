import { prisma } from "@/components/prisma";
import { z } from "zod";    

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredProducts(parsedInput: any) {
  const { query, currentPage, status } = parsedInput;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const parsedNumber = parseFloat(query);
  const isNumber = !isNaN(parsedNumber) && query.trim() !== "";

  const maybePrice = isNumber ? BigInt(Math.round(parsedNumber * 100)) : null;

  try {
    const products = await prisma.product.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      where: {
        ...(status === "Sell" ? { invoice_id: { not: null } } : {}),
        ...(status === "OnStock" ? { invoice_id: { equals: null } } : {}),
        ...(query && query !== ""
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                ...(isNumber && maybePrice !== null
                  ? [{ price: { equals: maybePrice } }]
                  : []),
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        price: true,
        invoice_id: true,
      },
    });
    return JSON.parse(
      JSON.stringify(products, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products.");
  }
}