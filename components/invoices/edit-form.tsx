import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/button";
import { useEffect, useMemo } from "react";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";
import { Customer, Prisma, Product } from "@prisma/client";
import { useRouter } from "next/navigation";

type SelectOption = {
  id: string;
  name: string;
};

type InvoiceWithProducts = Prisma.InvoiceGetPayload<{
  include: { products: true };
}>;

export default function EditInvoiceForm({
  invoice,
  customers,
  products,
}: {
  invoice: InvoiceWithProducts;
  customers: Pick<Customer, "id" | "name">[];
  products: Pick<Product, "id" | "name">[];
}) {
  const availableProducts = useMemo(() => {
    const currentProducts = Array.isArray(invoice?.products) ? invoice.products : [];
    const extraProducts = Array.isArray(products) ? products : [];

    return [...currentProducts, ...extraProducts];
  }, [invoice.products, products]);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Detenemos el envío tradicional

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // El MultiSelect de PrimeReact pone los IDs en un string separado por comas
    // en el input oculto "productIds". Esto está perfecto para tu Zod Schema.

    try {
      const result = await fetch("/api/updateInvoice", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (result.ok) {
        router.push("/invoices");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>([]);

  useEffect(() => {
    const selected = availableProducts.filter((product) =>
      invoice.products.some((p) => p.id === product.id)
    );
    setSelectedProducts(selected);
  }, [invoice.products, availableProducts]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="invoiceId" value={invoice.id} />

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customer_id}
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Product */}
        <div className="mb-4">
          <label htmlFor="product" className="mb-2 block text-sm font-medium">
            Choose product
          </label>
        </div>
        <div className="relative">
          <MultiSelect
            value={selectedProducts}
            onChange={(e) => setSelectedProducts(e.value)}
            options={availableProducts}
            optionLabel="name"
            placeholder="Select products"
            className="w-full md:w-20rem ms-6"
          />
          <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        <input
          type="hidden"
          name="productIds"
          value={selectedProducts?.map((p) => p.id).join(",")}
        />

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={invoice.status === "pending"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={invoice.status === "paid"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}
