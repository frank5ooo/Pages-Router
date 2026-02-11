import { prisma } from "@/components/prisma";

export async function getInvoicesPagesCount({ query, status, perPage = 6 }: { query: string, status: string, perPage?: number }) {
  const maybePrice = Number(query) * 100;
  const isNumber = !isNaN(maybePrice);

  const filters = {
    ...(status
      ? { status: { equals: status, mode: "insensitive" as const } }
      : {}),
    AND: [
      {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" as const } } },
          { customer: { email: { contains: query, mode: "insensitive" as const } } },
          { status: { contains: query, mode: "insensitive" as const } },
          ...(isNumber ? [{ products: { some: { price: { equals: maybePrice } } } }] : []),
        ],
      },
    ],
  };

  const totalItems = await prisma.invoice.count({ where: filters });
  return Math.ceil(totalItems / perPage);
}

// lib/data-invoices.ts
export async function getFilteredInvoices({ query, currentPage, status }: { query: string, currentPage: number, status: string }) {
  const itemsPerPage = 6;
  const offset = (currentPage - 1) * itemsPerPage;

  // 1. Definimos las variables de apoyo para el precio
  const maybePrice = Number(query) * 100;
  const isNumber = !isNaN(maybePrice) && query !== "";

  return await prisma.invoice.findMany({
    where: {
      // Filtro por estado (si existe)
      ...(status && status !== ""
        ? { status: { equals: status, mode: "insensitive" as const } }
        : {}),
      // Filtro por búsqueda global (query)
      ...(query && query !== ""
        ? {
          OR: [
            { customer: { name: { contains: query, mode: "insensitive" as const } } },
            { customer: { email: { contains: query, mode: "insensitive" as const } } },
            { status: { contains: query, mode: "insensitive" as const } },
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
    },
    include: {
      customer: true,
    },
    orderBy: { date: 'desc' },
    take: itemsPerPage,
    skip: offset,
  });
}

export async function getProductsByInvoiceId(id: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        invoice_id: id,
      },
      select: {
        name: true,
        price: true,
      },
    });
    return products;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch products.");
  }
}

export async function getFetchCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function createInvoice(parsedInput: any) {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        customer_id: parsedInput.customerId,
        status: parsedInput.status,
        date: new Date(),
        products: {
          connect: parsedInput.productIds.map((id: string) => ({ id })),
        },
      },
    });
    return { invoice };
  } catch (error) {
    console.error("Error Prisma:", error);
    throw new Error("Failed to create invoice.");
  }
}