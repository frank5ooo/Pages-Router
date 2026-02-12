import { prisma } from "@/components/prisma";

export async function createInvoiceDb(parsedInput: any) {
    try {
        await prisma.invoice.create({
            data: {
                customer_id: parsedInput.customerId,
                status: parsedInput.status,
                date: new Date(),
                products: {
                    connect: parsedInput.productIds.map((id: string) => ({ id })),
                },
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Error Prisma:", error);
        throw new Error("Failed to create invoice.");
    }
}

export async function createProductDb(parsedInput: any) {

    const { name, price } = parsedInput.data;

    const priceInCents = Math.round(price * 100);
    try {
        await prisma.product.create({
            data: {
                invoice_id: null,
                name: name,
                price: priceInCents,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Error Prisma:", error);
        throw new Error("Failed to create invoice.");

    }
}
