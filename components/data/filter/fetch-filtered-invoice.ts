import { prisma } from "@/components/prisma";
import { z } from "zod";

const ITEMS_PER_PAGE = 6;

const FormSchema = z.object({
  query: z.string(),
  currentPage: z.number(),
  status: z.string().optional(),
});

export async function fetchFilteredInvoice(parsedInput: any) {

  const validated = FormSchema.safeParse({ querry: parsedInput.query, currentPage: parsedInput.currentPage, status: parsedInput.status });

  if (!validated.success) {
    console.error("Parámetros de búsqueda inválidos:", validated.error);
    return 0;
  }
  
  const offset = (parsedInput.currentPage - 1) * ITEMS_PER_PAGE;
  const maybePrice = Number(parsedInput.query) * 100;
  const isNumber = !isNaN(maybePrice);

  const filters: any = {
    ...(parsedInput.status && parsedInput.status !== ""
      ? { status: { equals: parsedInput.status, mode: "insensitive" } }
      : {}),
    ...(parsedInput.query && parsedInput.query !== ""
      ? {
        OR: [
          { customer: { name: { contains: parsedInput.query, mode: "insensitive" } } },
          { customer: { email: { contains: parsedInput.query, mode: "insensitive" } } },
          { status: { contains: parsedInput.query, mode: "insensitive" } },
          ...(isNumber
            ? [
              {
                products: {
                  some: { price: { equals: maybePrice } },
                },
              },
            ]
            : []),
        ],
      }
      : {}),
  };

  try {
    const invoices = await prisma.invoice.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      select: {
        customer: true,
        date: true,
        status: true,
        id: true,
        products: {
          select: { price: true },
        },
      },
      where: filters,
      orderBy: { date: "desc" },
    });


    return invoices.map(({ products, ...invoice }) => {
      const price = products.reduce(
        (sum, prod) => sum + Number(prod.price),
        0
      );
      return {
        ...invoice,
        price,
      };
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}
