import Layout from '@/components/layout';
import CardWrapper from '@/components/dashboard/cards'; 
import { fetchCardData, fetchLatestInvoices } from '@/components/dashboard/dataDashborad';
import LatestInvoices from '@/components/dashboard/latest-invoices';
export interface LatestInvoice {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: number;
  price: string;
}

export interface CardData {
  numberOfInvoices: number;
  numberOfCustomers: number;
  totalPaidInvoices: string;
  totalPendingInvoices: string;
}

export async function getServerSideProps() {
  const [cardData, latestInvoices] = await Promise.all([
    fetchCardData(),
    fetchLatestInvoices(),
  ]);

  const serializedProps = JSON.parse(
    JSON.stringify({ cardData, latestInvoices },
      (key, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
  return {
    props: {
      cardData: serializedProps.cardData,
      latestInvoices: serializedProps.latestInvoices
    },
  };
}

export default function DashboardPage({ cardData, latestInvoices }: { cardData: CardData, latestInvoices: LatestInvoice }) {

  console.log(cardData);
  console.log(latestInvoices);

  return (
    <Layout>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardWrapper data={cardData} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <LatestInvoices latestInvoices={latestInvoices}/>
      </div>
    </Layout>
  );
}