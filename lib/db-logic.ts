// lib/db-logic.ts
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
// ... (mueve aquí también getFilteredInvoices, getInvoicesPagesCount, etc.)

