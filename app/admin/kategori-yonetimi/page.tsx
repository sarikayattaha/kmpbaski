"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase, type Category } from "@/lib/supabase";
import {
  Plus, Trash2, LogOut, Loader2, CheckCircle,
  AlertCircle, Pencil, Tag,
} from "lucide-react";
import AdminGuard from "@/app/admin/_components/AdminGuard";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

const inputCls = "w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all";

const emptyForm = () => ({ name: "", show_in_navbar: false, navbar_order: 0 });

export default function KategoriYonetimi() {
  return <AdminGuard><KategoriYonetimiInner /></AdminGuard>;
}

function KategoriYonetimiInner() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(false);
  const [form, setForm]             = useState(emptyForm());
  const [editId, setEditId]         = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => { sessionStorage.removeItem("kmp_admin"); window.location.href = "/admin/login"; };

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("navbar_order", { ascending: true });
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => { setForm(emptyForm()); setEditId(null); };

  const startEdit = (c: Category) => {
    setEditId(c.id);
    setForm({ name: c.name, show_in_navbar: c.show_in_navbar, navbar_order: c.navbar_order });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Kategori adı zorunludur.", "error");
    setSaving(true);
    const payload = { name: form.name.trim(), show_in_navbar: form.show_in_navbar, navbar_order: form.navbar_order };
    const { error } = editId
      ? await supabase.from("categories").update(payload).eq("id", editId)
      : await supabase.from("categories").insert(payload);
    setSaving(false);
    if (error) return showToast("Hata: " + error.message, "error");
    showToast(editId ? "Kategori güncellendi!" : "Kategori eklendi!", "success");
    resetForm();
    fetchCategories();
  };

  const handleDelete = async (c: Category) => {
    if (!confirm(`"${c.name}" silinsin mi?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) return showToast("Silme hatası: " + error.message, "error");
    showToast("Kategori silindi.", "success");
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="bg-[#07446c] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-black text-lg">KMP<span className="text-[#25aae1]">BASKI</span> — Kategori Yönetimi</h1>
          <p className="text-blue-200 text-xs mt-0.5">Navbar kategorilerini yönet</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/urun-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Ürün Yönetimi →</a>
          <a href="/admin/banner-yonetimi" className="text-xs text-blue-300 hover:text-white transition-colors">Banner Yönetimi →</a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <LogOut size={15} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* Mevcut kategoriler */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              <Tag size={18} className="text-[#0f75bc]" /> Kategoriler
            </h2>
            {!loading && (
              <span className="text-xs bg-[#0f75bc]/10 text-[#0f75bc] px-2 py-0.5 rounded-full font-bold">
                {categories.length} kategori
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-300">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center py-8 text-sm text-gray-400">Henüz kategori eklenmemiş.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-50">
                  {["Kategori Adı", "Navbar'da Göster", "Sıralama", ""].map((h, i) => (
                    <th key={i} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-blue-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#07446c]">{c.name}</td>
                    <td className="py-3 pr-4">
                      {c.show_in_navbar
                        ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Evet</span>
                        : <span className="text-xs text-gray-300">Hayır</span>}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{c.navbar_order}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(c)}
                          className="p-2 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-[#0f75bc] transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(c)}
                          className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black text-[#07446c] flex items-center gap-2">
              {editId ? <Pencil size={18} className="text-[#0f75bc]" /> : <Plus size={18} className="text-[#0f75bc]" />}
              {editId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            </h2>
            {editId && (
              <button onClick={resetForm} className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors">
                ✕ İptal
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Kategori Adı *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ör: Kartvizitler" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#07446c] uppercase tracking-wide mb-1.5">Sıralama</label>
                <input type="number" min={0} value={form.navbar_order}
                  onChange={e => setForm(f => ({ ...f, navbar_order: Number(e.target.value) }))}
                  className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Küçük sayı önce gelir</p>
              </div>
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input type="checkbox" checked={form.show_in_navbar}
                    onChange={e => setForm(f => ({ ...f, show_in_navbar: e.target.checked }))}
                    className="w-5 h-5 rounded accent-[#0f75bc]" />
                  <span className="text-sm font-semibold text-[#07446c]">Navbar'da Gösterilsin</span>
                </label>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="mt-6 flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md">
            {saving ? <Loader2 size={16} className="animate-spin" /> : editId ? <Pencil size={16} /> : <Plus size={16} />}
            {saving ? "Kaydediliyor…" : editId ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
