import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  Clock,
  Home,
  UserRound,
  FileText,
  Settings,
  Plus,
  UserPlus,
  RotateCcw,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Layers,
  ChevronRight,
  Menu,
} from "lucide-react";

const API_URL = "https://ubiquitous-spoon-r4q44q5v4w56fpq94-3001.app.github.dev";

export default function Dashboard({ usuario, onLogout }) {
  const [active, setActive] = useState("Dashboard");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [historico, setHistorico] = useState(["Sistema iniciado"]);
  const [search, setSearch] = useState("");

  const [bookForm, setBookForm] = useState({
    codigo: "",
    titulo: "",
    autor: "",
    ano: "",
    quantidade: "",
  });

  const [userForm, setUserForm] = useState({
    nome: "",
    email: "",
  });

  const [loanForm, setLoanForm] = useState({
    codigo: "",
    usuarioId: "",
  });

  const [returnId, setReturnId] = useState("");

  async function carregarDados() {
    try {
      const [livrosRes, usuariosRes, emprestimosRes] = await Promise.all([
        fetch(`${API_URL}/livros`),
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/emprestimos`),
      ]);

      const livros = await livrosRes.json();
      const usuarios = await usuariosRes.json();
      const emprestimos = await emprestimosRes.json();

      setBooks(livros);
      setUsers(usuarios);
      setLoans(emprestimos);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((b) =>
      `${b.codigo} ${b.titulo} ${b.autor}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [books, search]);

  function addHistory(text) {
    setHistorico((prev) => [text, ...prev]);
  }

  async function cadastrarLivro(e) {
    e.preventDefault();

    if (!bookForm.codigo || !bookForm.titulo || !bookForm.autor) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/livros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo: bookForm.codigo,
          titulo: bookForm.titulo,
          autor: bookForm.autor,
          ano: Number(bookForm.ano),
          quantidade: Number(bookForm.quantidade),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao cadastrar livro.");
        return;
      }

      addHistory(`Livro cadastrado: ${bookForm.titulo}`);

      setBookForm({
        codigo: "",
        titulo: "",
        autor: "",
        ano: "",
        quantidade: "",
      });

      carregarDados();
    } catch (error) {
      console.log(error);
      alert("Erro ao conectar com a API.");
    }
  }

  async function removerLivro(codigo) {
    if (!confirm("Deseja remover este livro?")) return;

    try {
      const response = await fetch(`${API_URL}/livros/${codigo}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao remover livro.");
        return;
      }

      addHistory(`Livro removido: ${codigo}`);
      carregarDados();
    } catch (error) {
      console.log(error);
      alert("Erro ao conectar com a API.");
    }
  }

  async function cadastrarUsuario(e) {
    e.preventDefault();

    if (!userForm.nome) {
      alert("Informe o nome do usuário.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao cadastrar usuário.");
        return;
      }

      addHistory(`Usuário cadastrado: ${userForm.nome}`);

      setUserForm({
        nome: "",
        email: "",
      });

      carregarDados();
    } catch (error) {
      console.log(error);
      alert("Erro ao conectar com a API.");
    }
  }

  async function emprestarLivro(e) {
    e.preventDefault();

    if (!loanForm.codigo || !loanForm.usuarioId) {
      alert("Informe o livro e o usuário.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/emprestimos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo_livro: loanForm.codigo,
          id_usuario: Number(loanForm.usuarioId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao realizar empréstimo.");

        const livro = books.find((b) => String(b.codigo) === String(loanForm.codigo));
        const user = users.find((u) => String(u.id) === String(loanForm.usuarioId));

        if (livro && user && data.message === "Livro sem estoque") {
          setReservas((prev) => [
            ...prev,
            {
              codigo: livro.codigo,
              usuario: user.nome,
            },
          ]);

          addHistory(`Reserva adicionada: ${livro.titulo} para ${user.nome}`);
        }

        return;
      }

      addHistory("Livro emprestado");

      setLoanForm({
        codigo: "",
        usuarioId: "",
      });

      carregarDados();
    } catch (error) {
      console.log(error);
      alert("Erro ao conectar com a API.");
    }
  }

  async function devolverLivro(e) {
    e.preventDefault();

    if (!returnId) {
      alert("Selecione um empréstimo.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/emprestimos/${returnId}/devolver`, {
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao devolver livro.");
        return;
      }

      addHistory("Livro devolvido");
      setReturnId("");
      carregarDados();
    } catch (error) {
      console.log(error);
      alert("Erro ao conectar com a API.");
    }
  }

  const stats = [
    {
      label: "Livros cadastrados",
      value: books.length,
      icon: BookOpen,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Usuários ativos",
      value: users.length,
      icon: Users,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Empréstimos ativos",
      value: loans.filter((l) => l.status === "ATIVO").length,
      icon: ArrowLeftRight,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Reservas na fila",
      value: reservas.length,
      icon: Clock,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  const menu = [
    { name: "Dashboard", icon: Home },
    { name: "Livros", icon: BookOpen },
    { name: "Usuários", icon: UserRound },
    { name: "Empréstimos", icon: ArrowLeftRight },
    { name: "Devoluções", icon: RotateCcw },
    { name: "Reservas", icon: Clock },
    { name: "Histórico", icon: FileText },
    { name: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col justify-between bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-5 text-white lg:flex">
        <div>
          <div className="mb-12 flex items-center gap-4 px-2 pt-4">
            <BookOpen size={46} className="fill-white" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
              <p className="text-sm text-slate-300">Sistema de Gestão</p>
            </div>
          </div>

          <nav className="space-y-3">
            {menu.map((item) => {
              const Icon = item.icon;
              const selected = active === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-base transition ${
                    selected
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={25} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-2xl bg-white/10 p-6 text-center shadow-2xl backdrop-blur">
          <Layers className="mx-auto mb-4" size={38} />
          <p className="text-lg font-medium leading-relaxed">
            “Livros são portas para novos mundos.”
          </p>
          <p className="mt-3 text-sm text-slate-300">– Anônimo</p>
        </div>
      </aside>

      <main className="lg:ml-72">
        <header className="flex items-center justify-between px-6 py-7 lg:px-10">
          <div>
            <button className="mb-4 rounded-xl border bg-white p-2 shadow-sm lg:hidden">
              <Menu />
            </button>

            <h2 className="text-2xl font-bold md:text-3xl">
              Bem-vindo de volta, {usuario?.nome}!
            </h2>

            <p className="mt-2 text-slate-600">
              Aqui está o resumo da sua biblioteca.
            </p>
          </div>

          <div className="hidden items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm md:flex">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-600">
              <UserRound />
            </div>

            <div>
              <p className="font-semibold">{usuario?.nome}</p>
              <p className="text-sm text-slate-500">Administrador</p>

              <button
                onClick={onLogout}
                className="mt-1 text-sm font-medium text-red-500 hover:text-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-7 px-6 pb-10 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`grid h-16 w-16 place-items-center rounded-full ${card.bg} ${card.text}`}
                    >
                      <Icon size={34} />
                    </div>

                    <div className="flex-1">
                      <p className="text-3xl font-bold">{card.value}</p>
                      <p className="text-slate-700">{card.label}</p>

                      <button className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600">
                        Ver todos <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-600" size={28} />
                <h3 className="text-2xl font-bold">Livros recentes</h3>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                <Search size={18} className="text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar livro..."
                  className="bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full min-w-[780px] border-collapse bg-white text-left">
                <thead className="bg-slate-50 text-sm uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Código</th>
                    <th className="px-5 py-4">Título</th>
                    <th className="px-5 py-4">Autor</th>
                    <th className="px-5 py-4">Ano</th>
                    <th className="px-5 py-4">Quantidade</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.codigo} className="border-t border-slate-100">
                      <td className="px-5 py-4">{book.codigo}</td>
                      <td className="px-5 py-4 font-medium">{book.titulo}</td>
                      <td className="px-5 py-4">{book.autor}</td>
                      <td className="px-5 py-4">{book.ano}</td>
                      <td className="px-5 py-4">{book.quantidade}</td>

                      <td className="px-5 py-4">
                        {book.quantidade > 0 ? (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                            <CheckCircle size={16} /> Disponível
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1 font-medium text-red-700">
                            <XCircle size={16} /> Indisponível
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => removerLivro(book.codigo)}
                          className="rounded-xl p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredBooks.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-8 text-center text-slate-500"
                      >
                        Nenhum livro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-4">
            <FormCard
              title="Cadastrar livro"
              icon={Plus}
              color="blue"
              onSubmit={cadastrarLivro}
            >
              <Input
                placeholder="Código"
                value={bookForm.codigo}
                onChange={(v) => setBookForm({ ...bookForm, codigo: v })}
              />

              <Input
                placeholder="Título"
                value={bookForm.titulo}
                onChange={(v) => setBookForm({ ...bookForm, titulo: v })}
              />

              <Input
                placeholder="Autor"
                value={bookForm.autor}
                onChange={(v) => setBookForm({ ...bookForm, autor: v })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Ano"
                  value={bookForm.ano}
                  onChange={(v) => setBookForm({ ...bookForm, ano: v })}
                />

                <Input
                  placeholder="Qtd"
                  value={bookForm.quantidade}
                  onChange={(v) => setBookForm({ ...bookForm, quantidade: v })}
                />
              </div>
            </FormCard>

            <FormCard
              title="Cadastrar usuário"
              icon={UserPlus}
              color="emerald"
              onSubmit={cadastrarUsuario}
            >
              <Input
                placeholder="Nome"
                value={userForm.nome}
                onChange={(v) => setUserForm({ ...userForm, nome: v })}
              />

              <Input
                placeholder="E-mail"
                value={userForm.email}
                onChange={(v) => setUserForm({ ...userForm, email: v })}
              />
            </FormCard>

            <FormCard
              title="Emprestar livro"
              icon={ArrowLeftRight}
              color="amber"
              onSubmit={emprestarLivro}
            >
              <Input
                placeholder="Código do livro"
                value={loanForm.codigo}
                onChange={(v) => setLoanForm({ ...loanForm, codigo: v })}
              />

              <select
                value={loanForm.usuarioId}
                onChange={(e) =>
                  setLoanForm({ ...loanForm, usuarioId: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400"
              >
                <option value="">Selecione o usuário</option>

                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </FormCard>

            <FormCard
              title="Devolver livro"
              icon={RotateCcw}
              color="purple"
              onSubmit={devolverLivro}
            >
              <select
                value={returnId}
                onChange={(e) => setReturnId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400"
              >
                <option value="">Selecione empréstimo</option>

                {loans
                  .filter((l) => l.status === "ATIVO")
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      #{l.id} - {l.titulo} / {l.usuario}
                    </option>
                  ))}
              </select>
            </FormCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="Usuários" icon={Users}>
              {users.length === 0 ? (
                <Empty text="Nenhum usuário cadastrado." />
              ) : (
                users.map((u) => (
                  <div key={u.id} className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold">{u.nome}</p>
                    <p className="text-sm text-slate-500">{u.email}</p>
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Reservas" icon={Clock}>
              {reservas.length === 0 ? (
                <Empty text="Nenhuma reserva na fila." />
              ) : (
                reservas.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-purple-50 p-4 text-purple-900"
                  >
                    <p className="font-semibold">Livro: {r.codigo}</p>
                    <p className="text-sm">Usuário: {r.usuario}</p>
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Histórico" icon={FileText}>
              {historico.map((h, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
                >
                  {h}
                </div>
              ))}
            </Panel>
          </div>
        </section>
      </main>
    </div>
  );
}

function Input({ placeholder, value, onChange }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400"
    />
  );
}

function FormCard({ title, icon: Icon, color, onSubmit, children }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`grid h-12 w-12 place-items-center rounded-full ${colors[color]}`}
        >
          <Icon />
        </div>

        <h4 className="text-lg font-bold">{title}</h4>
      </div>

      <div className="space-y-3">{children}</div>

      <button className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">
        Salvar
      </button>
    </form>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <Icon className="text-blue-600" />
        <h4 className="text-xl font-bold">{title}</h4>
      </div>

      <div className="max-h-72 space-y-3 overflow-auto pr-1">{children}</div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
      {text}
    </p>
  );
}