import Form from "@/components/invoices/create-form";
import Breadcrumbs from "@/components/breadcrumbs";
import { fetchCustomers } from "@/components/data/fetch-customer";
import { fetchProductsWithNoId } from "@/components/data/fetch-products-with-no-id";
import { GetServerSideProps } from "next";

export default function Page({ customers, options }: any) {
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/invoices" },
          {
            label: "Create Invoice",
            href: "/invoices/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} products={options} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [customersData, productsData] = await Promise.all([
    fetchCustomers(),
    fetchProductsWithNoId(),
  ]);

  const options = productsData.map((product: any) => ({
    id: product.id.toString(),
    name: product.name,
  }));

  return {
    props: {
      customers: JSON.parse(JSON.stringify(customersData)),
      options: JSON.parse(JSON.stringify(options)),
    },
  };
};