// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// }import { Suspense } from 'react';
// import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
// import CardWrapper from '@/app/ui/dashboard/cards';


export default function Home() {
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboaaaaard
      </h1>

      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>

        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div> */}
    </main>
  );
}
