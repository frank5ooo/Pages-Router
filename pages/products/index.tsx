import Pagination from "@/components/pagination";
import Search from "@/components/search";
import Table from "@/components/products/table";
import { CreateProduct } from "@/components/products/buttons/buttons";
import { InvoicesTableSkeleton } from "@/components/skeletons";
import { fetchProductPages } from "@/components/data/pagination/fetch-products-pages";
import { GetServerSideProps } from "next";
import { fetchFilteredProducts } from "@/components/data/filter/fetch-filtered-products";
import Layout from "@/components/layout";

export default function Page({ products, currentPage, totalPages }: any) {

  return (
    <Layout>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Products</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search products..." />
          <CreateProduct />
        </div>

        <Table products={products} />

        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = (context.query.query as string) || "";
  const currentPage = Number(context.query.page) || 1;
  const status = (context.query.status as string) || "";

  const [products, totalPages] = await Promise.all([
    fetchFilteredProducts({query, currentPage, status}), 
    fetchProductPages(query, status, currentPage)
  ]);

  return {
    props: {
      products: JSON.parse(
        JSON.stringify(products ?? [], (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
      totalPages: totalPages ?? 1,
      currentPage,
    },
  };
};