import { prisma } from "@/components/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "ID faltante" });

        const result = await prisma.product.findMany({
            where: {
                invoice_id: id
            },
            select: {
                name: true,
                price: true,
            },
        });

        const data = JSON.parse(
            JSON.stringify(result, (_, v) => (typeof v === "bigint" ? v.toString() : v))
        );

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno' });
    }
}