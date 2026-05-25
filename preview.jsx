import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  CreditCard,
  Download,
  Printer,
  Trash2,
  Shirt,
  ClipboardList,
  CheckCircle2,
  UserSquare2,
} from "lucide-react";

const logoPudu = "/logo-pudu.png";
const bajuJurulatih = "/baju-jurulatih.png";
const bajuBadminton = "/baju-badminton.png";
const bajuChess = "/baju-chess.png";

const categories = ["Jurulatih", "Badminton", "Chess"];
const shirtTypes = ["Polo", "Muslimah", "Roundneck"];
const sleeveTypes = ["Pendek", "Panjang"];
const sizes = [
  "11/12 Tahun",
  "3XS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
];
const kidsSizes = ["11/12 Tahun", "3XS"];

const payment = {
  bank: "Maybank",
  account: "512400558770",
  name: "Mohd Afiq Haziq",
};

const emptyForm = {
  name: "",
  school: "",
  category: "",
  jenisBaju: "",
  lengan: "",
  saiz: "",
  receiptName: "",
};

const formatRM = (amount) => `RM${amount.toFixed(2)}`;

const getPrice = ({ jenisBaju, lengan, saiz }) => {
  if (!jenisBaju || !lengan || !saiz) return "";

  const isKids = kidsSizes.includes(saiz);
  const isLongSleeve = lengan === "Panjang";

  if (jenisBaju === "Muslimah") {
    return formatRM(isKids ? 23 : 32);
  }

  if (jenisBaju === "Roundneck") {
    if (isKids) {
      return formatRM(isLongSleeve ? 27 : 25);
    }
    return formatRM(isLongSleeve ? 29 : 27);
  }

  if (jenisBaju === "Polo") {
    return formatRM(isLongSleeve ? 30 : 28);
  }

  return "";
};

const getCategoryLabel = (category) => {
  if (category === "Jurulatih") return "Baju Hitam - Jurulatih";
  if (category === "Badminton") return "Baju Merah - Badminton";
  if (category === "Chess") return "Baju Putih - Chess";
  return "";
};

const getCategoryImage = (category) => {
  if (category === "Jurulatih") return bajuJurulatih;
  if (category === "Badminton") return bajuBadminton;
  if (category === "Chess") return bajuChess;
  return "";
};

function App() {
  const [form, setForm] = useState(emptyForm);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tempahan-baju-pudu-3kategori");
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tempahan-baju-pudu-3kategori", JSON.stringify(orders));
  }, [orders]);

  const currentPrice = getPrice(form);

  const totalJurulatih = orders.filter((o) => o.category === "Jurulatih").length;
  const totalBadminton = orders.filter((o) => o.category === "Badminton").length;
  const totalChess = orders.filter((o) => o.category === "Chess").length;

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
  };

  const reset = () => {
    setForm(emptyForm);
    setMessage("");
    const receipt = document.getElementById("receipt");
    if (receipt) receipt.value = "";
  };

  const submit = (e) => {
    e.preventDefault();

    const required = [
      "name",
      "school",
      "category",
      "jenisBaju",
      "lengan",
      "saiz",
      "receiptName",
    ];

    const missing = required.some((item) => !form[item]);

    if (missing) {
      setMessage("Sila lengkapkan semua maklumat termasuk upload resit.");
      return;
    }

    if (!currentPrice) {
      setMessage("Sila pilih jenis baju, jenis lengan dan saiz untuk bayaran automatik.");
      return;
    }

    const order = {
      id: crypto?.randomUUID?.() || String(Date.now()),
      tarikh: new Date().toLocaleString("ms-MY"),
      ...form,
      jenisKategori: getCategoryLabel(form.category),
      jumlahBayaran: currentPrice,
      akaunBayaran: `${payment.bank} ${payment.account} - ${payment.name}`,
    };

    setOrders((prev) => [order, ...prev]);
    setMessage("Tempahan berjaya disimpan.");
    reset();
  };

  const exportCsv = () => {
    if (!orders.length) {
      setMessage("Belum ada tempahan untuk dieksport.");
      return;
    }

    const headers = [
      "Tarikh",
      "Nama",
      "Nama Sekolah",
      "Kategori",
      "Jenis Kategori",
      "Jenis Baju",
      "Jenis Lengan",
      "Saiz",
      "Jumlah Bayaran",
      "Akaun Bayaran",
      "Resit",
    ];

    const rows = orders.map((o) => [
      o.tarikh,
      o.name,
      o.school,
      o.category,
      o.jenisKategori,
      o.jenisBaju,
      o.lengan,
      o.saiz,
      o.jumlahBayaran,
      o.akaunBayaran,
      o.receiptName,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tempahan-baju-kontinjen-pudu.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl shadow-red-950/40 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr_320px] lg:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white p-3 shadow-xl">
              <img
                src={logoPudu}
                alt="Logo Pudu"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">
                KSK 2026
              </p>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
                Borang Tempahan Baju Kontinjen Pudu
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
                Tempahan bebas untuk 3 kategori baju: Jurulatih, Badminton dan
                Chess. Harga dikira secara automatik mengikut jenis baju,
                jenis lengan dan saiz.
              </p>
            </div>

            <div className="rounded-3xl border border-red-400/40 bg-red-950/70 p-5 text-center">
              <CreditCard className="mx-auto mb-2 h-8 w-8 text-red-200" />
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-200">
                Bayaran
              </p>
              <p className="mt-2 text-5xl font-black text-white">
                {currentPrice || "AUTO"}
              </p>
              <p className="mt-2 text-lg font-black text-red-100">
                {payment.bank} {payment.account}
              </p>
              <p className="text-sm font-bold text-zinc-200">{payment.name}</p>
            </div>
          </div>
        </header>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={ClipboardList}
            label="Tempahan Disimpan"
            value={orders.length}
          />
          <Stat
            icon={UserSquare2}
            label="Jurulatih / Hitam"
            value={totalJurulatih}
            color="dark"
          />
          <Stat
            icon={Shirt}
            label="Badminton / Merah"
            value={totalBadminton}
            color="red"
          />
          <Stat
            icon={Shirt}
            label="Chess / Putih"
            value={totalChess}
            color="white"
          />
        </section>

        {/* FORM + SIDE */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          {/* FORM */}
          <form
            onSubmit={submit}
            className="rounded-[2rem] bg-white p-5 text-zinc-950 shadow-2xl lg:p-6"
          >
            <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                  Tempahan Bebas
                </p>
                <h2 className="text-2xl font-black">Maklumat Tempahan</h2>
              </div>
              <div className="rounded-2xl bg-red-700 px-5 py-3 text-center text-xl font-black text-white">
                {currentPrice || "AUTO"}
              </div>
            </div>

            {/* INPUTS */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label="Nama"
                value={form.name}
                onChange={(v) => update("name", v)}
              />
              <Input
                label="Nama Sekolah"
                value={form.school}
                onChange={(v) => update("school", v)}
              />
              <Select
                label="Kategori"
                value={form.category}
                onChange={(v) => update("category", v)}
                options={categories}
              />
              <Select
                label="Jenis Baju"
                value={form.jenisBaju}
                onChange={(v) => update("jenisBaju", v)}
                options={shirtTypes}
              />
              <Select
                label="Jenis Lengan"
                value={form.lengan}
                onChange={(v) => update("lengan", v)}
                options={sleeveTypes}
              />
              <Select
                label="Saiz"
                value={form.saiz}
                onChange={(v) => update("saiz", v)}
                options={sizes}
              />
            </div>

            {/* AUTO PRICE */}
            <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                Jumlah Bayaran Automatik
              </p>
              <p className="mt-2 text-4xl font-black text-red-800">
                {currentPrice || "Pilih jenis baju, lengan & saiz"}
              </p>
              <p className="mt-2 text-xs font-bold text-zinc-600">
                KIDS = 11/12 Tahun, 3XS | ADULT = XS hingga 5XL
              </p>
            </div>

            {/* PREVIEW */}
            <div className="mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <p className="mb-3 text-sm font-black text-zinc-700">
                Preview Baju Mengikut Kategori
              </p>

              {form.category ? (
                <img
                  src={getCategoryImage(form.category)}
                  alt={form.category}
                  className="mx-auto max-h-[420px] rounded-2xl bg-white p-3 object-contain"
                />
              ) : (
                <div className="rounded-2xl bg-white p-8 text-sm font-semibold text-zinc-500">
                  Pilih kategori untuk paparan baju.
                </div>
              )}
            </div>

            {/* RECEIPT */}
            <div className="mt-5 rounded-3xl border-2 border-dashed border-red-200 bg-red-50 p-5 text-center">
              <label className="cursor-pointer">
                <UploadCloud className="mx-auto mb-2 h-9 w-9 text-red-700" />
                <p className="text-sm font-black">
                  Upload Resit Bayaran {currentPrice || "AUTO"}
                </p>
                <p className="text-xs font-bold text-zinc-500">
                  PNG, JPG atau PDF
                </p>
                <input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) =>
                    update("receiptName", e.target.files?.[0]?.name || "")
                  }
                />
              </label>

              {form.receiptName && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  {form.receiptName}
                </p>
              )}
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm font-black ${
                  message.toLowerCase().includes("berjaya")
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {message}
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="flex-1 rounded-2xl bg-red-700 px-5 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-red-800">
                Simpan Tempahan
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-black uppercase tracking-wide hover:bg-zinc-100"
              >
                Reset
              </button>
            </div>
          </form>

          {/* SIDE PANEL */}
          <aside className="space-y-6">
            <ShirtCard
              title="Baju Hitam"
              subtitle="Jurulatih"
              image={bajuJurulatih}
              color="dark"
            />
            <ShirtCard
              title="Baju Merah"
              subtitle="Badminton"
              image={bajuBadminton}
              color="red"
            />
            <ShirtCard
              title="Baju Putih"
              subtitle="Chess"
              image={bajuChess}
              color="white"
            />

            <div className="rounded-[2rem] border border-red-400/20 bg-zinc-900 p-5">
              <h3 className="text-xl font-black">Maklumat Bayaran</h3>
              <div className="mt-4 rounded-3xl bg-red-700 p-5 text-center">
                <p className="text-4xl font-black">AUTO</p>
                <p className="mt-2 text-sm font-bold">
                  Bayaran ikut pilihan baju
                </p>
              </div>

              <div className="mt-4 space-y-1 text-sm font-bold text-zinc-300">
                <p>Roundneck kids : RM25.00</p>
                <p>Roundneck kids lengan panjang : RM27.00</p>
                <p>Roundneck adult pendek : RM27.00</p>
                <p>Collar/Polo adult pendek : RM28.00</p>
                <p>Roundneck adult panjang : RM29.00</p>
                <p>Collar/Polo adult panjang : RM30.00</p>
                <p>Muslimah kids : RM23.00</p>
                <p>Muslimah adult : RM32.00</p>
              </div>

              <p className="mt-4 text-sm font-bold text-zinc-300">
                Akaun: {payment.bank} {payment.account}
              </p>
              <p className="text-sm font-bold text-zinc-300">
                Nama: {payment.name}
              </p>
            </div>
          </aside>
        </section>

        {/* TABLE */}
        <section className="mt-6 rounded-[2rem] bg-white p-5 text-zinc-950 shadow-2xl lg:p-6">
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                Rekod
              </p>
              <h2 className="text-2xl font-black">Senarai Tempahan</h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-4 py-2 text-sm font-black text-white"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-2 text-sm font-black text-white"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-950 text-white">
                <tr>
                  {[
                    "Tarikh",
                    "Nama",
                    "Sekolah",
                    "Kategori",
                    "Jenis Baju",
                    "Lengan",
                    "Saiz",
                    "Bayaran",
                    "Resit",
                    "Tindakan",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-black uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-semibold">{o.tarikh}</td>
                    <td className="px-4 py-3 font-black">{o.name}</td>
                    <td className="px-4 py-3 font-semibold">{o.school}</td>
                    <td className="px-4 py-3 font-semibold">{o.category}</td>
                    <td className="px-4 py-3 font-semibold">{o.jenisBaju}</td>
                    <td className="px-4 py-3 font-semibold">{o.lengan}</td>
                    <td className="px-4 py-3 font-black">{o.saiz}</td>
                    <td className="px-4 py-3 font-black text-red-700">
                      {o.jumlahBayaran}
                    </td>
                    <td className="px-4 py-3 font-semibold">{o.receiptName}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setOrders((prev) => prev.filter((x) => x.id !== o.id))
                        }
                        className="rounded-xl bg-red-100 px-3 py-1.5 text-xs font-black text-red-700"
                      >
                        <Trash2 className="inline h-3.5 w-3.5" /> Padam
                      </button>
                    </td>
                  </tr>
                ))}

                {!orders.length && (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-4 py-10 text-center font-bold text-zinc-500"
                    >
                      Belum ada tempahan disimpan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  let style = "bg-zinc-900 text-white";

  if (color === "red") style = "bg-red-700 text-white";
  if (color === "white") style = "bg-white text-zinc-950";
  if (color === "dark") style = "bg-black text-white";

  return (
    <div className={`${style} rounded-3xl p-5 shadow-xl`}>
      <Icon className="mb-3 h-7 w-7 opacity-80" />
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold opacity-80">{label}</p>
    </div>
  );
}

function ShirtCard({ title, subtitle, image, color }) {
  const style =
    color === "red"
      ? "bg-gradient-to-br from-red-700 via-red-600 to-red-950 text-white"
      : color === "dark"
      ? "bg-gradient-to-br from-zinc-950 via-black to-zinc-800 text-white"
      : "bg-gradient-to-br from-white to-zinc-200 text-zinc-950";

  return (
    <div className={`${style} rounded-[2rem] p-5 shadow-xl`}>
      <p className="text-xs font-black uppercase tracking-[0.25em] opacity-70">
        {subtitle}
      </p>
      <h3 className="mt-1 text-2xl font-black">{title}</h3>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white p-3">
        <img
          src={image}
          alt={title}
          className="w-full rounded-xl object-contain"
        />
      </div>

      <p className="mt-3 text-sm font-bold opacity-80">
        Harga dikira automatik
      </p>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-zinc-800">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-zinc-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
      >
        <option value="">Pilih</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default App;