import Pagination from "@/components/pagination";
import Search from "@/components/search";
import Table from "@/components/invoices/table";
import { CreateInvoice } from "@/components/invoices/buttons/buttons";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/components/skeletons";
import { fetchInvoicesPages } from "@/components/data/pagination/fetch-invoice-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const status = searchParams?.status || "";
  
  const totalPages = await fetchInvoicesPages({
    data: { query, status },
    pagination: { page: currentPage },
  });

  console.log("totalPages.data", status);
  if (!totalPages.data) return null;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table
          query={query}
          currentPage={currentPage}
          status={searchParams?.status}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages.data} currentPage={currentPage} />
      </div>
    </div>
  );
}
