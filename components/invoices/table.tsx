import Image from "next/image";
import { UpdateInvoice } from "@/components/invoices/buttons/buttons";
import InvoiceStatus from "@/components/invoices/status";
import { formatDateToLocal, formatCurrency } from "@/components/utils/utils";
import MarkdownEditor from "./MarkdownEditor";
import { DeleteInvoice } from "./buttons/deletebutton";
import OrderStatus from "./orderStatusInvoices";

interface Invoice {
  id: string;
  customer_id: string;
  status: string;
  date: string;
  price: number;
  customer: {
    name: string;
    email: string;
    image_url: string;
  };
}
export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {

  console.log("Invoices recibidas en el componente:", invoices);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="relative">
                    <OrderStatus ></OrderStatus>
                  </div>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Products
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.customer.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.customer.name}'s profile picture`}
                      />
                      <p>{invoice.customer.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.customer.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{formatCurrency(invoice.price)}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date.toString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <MarkdownEditor id={invoice.id} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
