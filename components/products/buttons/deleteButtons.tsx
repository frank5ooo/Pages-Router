import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
type DeleteButtonProps = {
  id: string;
  invoice_id: string | null;
};

export function DeleteProduct({ id, invoice_id }: DeleteButtonProps) {

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await fetch("/api/deleteProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (result.ok) {
        console.log("Producto borrado correctamente");
        router.replace(router.asPath); 
      } else {
        const errorData = await result.json();
        console.error("Error al borrar:", errorData.error);
      }

      if (!invoice_id) return null;

      const cantVehicules = await fetch("/api/productsById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: invoice_id }),
      });

      const cantVehiculesData = await cantVehicules.json();

      if (cantVehiculesData?.length === 0) {
        const resultInvoice = await fetch("/api/deleteInvoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: invoice_id }),
        });
        if (!resultInvoice.ok) {
          console.error("Failed to delete invoice");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
