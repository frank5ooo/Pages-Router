import Pagination from "@/components/pagination";
import Search from "@/components/search";
import Table from "@/components/invoices/table";
import { CreateInvoice } from "@/components/invoices/buttons/buttons";
import { GetServerSideProps } from "next";
import Layout from '@/components/layout';
import { getInvoicesPagesCount, getFilteredInvoices } from "@/lib/data-invoices";


export default function Page({ invoices, currentPage, totalPages }) {

  console.log("Total Pages:" + totalPages);

  return (
    <Layout>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Invoices</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search invoices..." />
          <CreateInvoice />
        </div>
        <Table
          invoices={invoices}
        />
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

  const [totalPages, rawInvoices] = await Promise.all([
    getInvoicesPagesCount({ query, status, perPage: 6 }),
    getFilteredInvoices({ query, currentPage, status })
  ]);

  return {
    props: {
      currentPage,
      totalPages: totalPages ?? 1,
      invoices: JSON.parse(
        JSON.stringify(rawInvoices, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
    },
  };
};