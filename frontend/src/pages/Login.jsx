import { useState } from "react";
import { BookOpen } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function fazerLogin(e) {
    e.preventDefault();

    const response = await fetch("https://ubiquitous-spoon-r4q44q5v4w56fpq94-3001.app.github.dev/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErro(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    onLogin(data.usuario);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-white">
            <BookOpen size={36} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Biblioteca
          </h1>

          <p className="mt-2 text-slate-500">
            Acesse sua conta para continuar
          </p>
        </div>

        <form onSubmit={fazerLogin} className="space-y-5">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          {erro && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {erro}
            </div>
          )}

          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}