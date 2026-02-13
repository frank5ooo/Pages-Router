import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router"; 

export function DeleteInvoice({ id }: { id: string }) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/deleteInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        console.log("Eliminado con éxito");
        router.replace(router.asPath);
      } else {
        console.error("Error en el servidor");
      }
    } catch (error) {
      console.error("Error de red", error);
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