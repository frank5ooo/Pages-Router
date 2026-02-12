import Form from "@/components/products/create-form";
import Breadcrumbs from "@/components/breadcrumbs";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout";

export default function Page() {
  return (
    <Layout>
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: "Products", href: "/products" },
            {
              label: "Create Product",
              href: "/products/create",
              active: true,
            },
          ]}
        />
        <Form
          product={{
            name: "",
            price: "",
          }}
        />
      </main>
    </Layout>
  );
}
