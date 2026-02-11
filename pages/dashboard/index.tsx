import Layout from '@/components/layout';
import CardWrapper from '@/components/dashboard/cards';
import { fetchCardData, fetchRevenue, fetchLatestInvoices } from '@/components/dashboard/dataDashborad';

export async function getServerSideProps() {
  // Aquí es el ÚNICO lugar donde Prisma puede correr
  const [cardData, latestInvoices] = await Promise.all([
    fetchCardData(),
    // fetchRevenue(),
    fetchLatestInvoices(),
  ]);

  console.log("cardCAda" + cardData);

  return {

    props: {
      cardData,
      latestInvoices,
    },
  };
}

export default function DashboardPage({ cardData, latestInvoices }) {
  return (
    <Layout>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pasamos los datos directamente a los componentes */}
        <CardWrapper data={cardData} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Aquí irían RevenueChart y LatestInvoices usando sus props */}
      </div>
    </Layout>
  );
}