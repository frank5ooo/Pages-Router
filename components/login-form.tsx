import { signIn } from 'next-auth/react';
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Capturamos los datos directamente del formulario
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    const result = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false, // Importante para manejar el error nosotros mismos
    });

    if (result?.error) {
      alert("Credenciales incorrectas. Revisa tu email o contraseña.");
    } else {
      // Redirigimos al dashboard tras el éxito
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-bold">Iniciar Sesión - LemboCorp</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  )
}