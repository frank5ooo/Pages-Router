import Form from "@/components/products/edit-form";
import Breadcrumbs from "@/components/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/components/data/fetch-products-by-id";
import { GetServerSideProps } from "next";

export default function Page({ product }: { product: any }) {
  if (!product) return null;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/products" },
          {
            label: "Edit Invoice",
            href: `/products/${product.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form products={product ? [product] : []} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const id = context.params?.id as string;

  const [product] = await Promise.all([fetchProductById({ id })]);
  if (!product) {
    notFound();
  }
  return {
    props: {
      product: JSON.parse(
        JSON.stringify(product, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
    },
  };
}
