// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// }import { Suspense } from 'react';
// import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
// import CardWrapper from '@/app/ui/dashboard/cards';


import Layout from '@/components/layout';

export default function DashboardPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Panel de Control</h1>
      <p>Bienvenido a tu dashboard, Franco.</p>
      {/* Aquí va el resto de tus componentes como las Cards o el Chart */}
    </Layout>
  );
}