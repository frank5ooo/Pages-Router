import Form from "@/components/products/create-form";
import Breadcrumbs from "@/components/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/products"},
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
  );
}
