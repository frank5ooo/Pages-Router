import Form from "@/components/invoices/edit-form";
import Breadcrumbs from "@/components/breadcrumbs";
import { fetchInvoiceById } from "@/components/data/fetch-invoice-by-id";
import { notFound } from "next/navigation";
import { fetchProductsWithNoId } from "@/components/data/fetch-products-with-no-id";
import { fetchCustomers } from "@/components/data/fetch-customer";
import { GetServerSideProps } from "next";

export default function Page({ invoice, customers, products }: any) {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/invoices" },
          {
            label: "Edit Invoice",
            href: `/invoices/${invoice.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} products={products} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const id = context.params?.id as string;
  const [invoice, customers, products] = await Promise.all([
    fetchInvoiceById({id}),
    fetchCustomers(),
    fetchProductsWithNoId(),
  ]);

  if (!invoice) {
    notFound();
  }

  return {
    props: {
      invoice: JSON.parse(
        JSON.stringify(invoice, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
      customers,
      products,
    },
  };
}
