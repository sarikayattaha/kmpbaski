"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { supabase, type Profile } from "@/lib/supabase";
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, MapPin, User, Phone, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const WA_NUMBER = "905541630031";

function buildMessage(
  items: ReturnType<typeof useCart>["items"],
  customer: { fullName: string; phone: string; address: string }
): string {
  const productLines = items
    .map((item) => {
      const priceInfo = item.product.is_price_on_request
        ? "Fiyat alabilir miyim?"
        : item.product.price
        ? `${item.product.price} x ${item.quantity}`
        : "—";
      const firstFeature = (item.product.features ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)[0];
      return `• ${item.product.name} - ${item.quantity} adet - ${priceInfo}${firstFeature ? ` (${firstFeature})` : ""}`;
    })
    .join("\n");

  // Toplam hesapla
  const hasPriceOnRequest = items.some((i) => i.product.is_price_on_request);
  let totalText = "";
  if (hasPriceOnRequest) {
    totalText = "Fiyat teklifi gerekmektedir";
  } else {
    let total = 0;
    let canSum = true;
    for (const item of items) {
      const raw = (item.product.price ?? "").replace(/[^0-9,]/g, "").replace(",", ".");
      const num = parseFloat(raw);
      if (isNaN(num)) { canSum = false; break; }
      total += num * item.quantity;
    }
    totalText = canSum ? `${total.toLocaleString("tr-TR")} TL` : "Fiyat bilgisi için iletişime geçiniz";
  }

  return `👤 *Müşteri Bilgileri:*
- Ad Soyad: ${customer.fullName}
- Telefon: ${customer.phone}
- Adres: ${customer.address}

🛒 *Sipariş İçeriği:*
${productLines}

💰 *Toplam Tutar:* ${totalText}
----------------------------------
_Bu mesaj kmpbaski.com üzerinden otomatik oluşturulmuştur._`;
}

export default function SepetPage() {
  const { items, removeItem, updateQty, clearCart } = useCart();

  const [profile, setProfile]         = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [addressErr, setAddressErr] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();
        if (prof) {
          const p = prof as Profile;
          setProfile(p);
          setFullName(p.full_name ?? "");
          setPhone(p.phone ?? "");
          setAddress(p.address ?? "");
        }
      }
      setAuthLoading(false);
    });
  }, []);

  const handleOrder = () => {
    if (!address.trim()) {
      setAddressErr(true);
      return;
    }
    setAddressErr(false);

    const msg = buildMessage(items, {
      fullName: fullName || "Belirtilmedi",
      phone: phone || "Belirtilmedi",
      address: address.trim(),
    });

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-20 text-center">
          <div className="text-7xl opacity-20">🛒</div>
          <h1 className="text-2xl font-black text-[#07446c]">Sepetiniz Boş</h1>
          <p className="text-gray-400 text-sm max-w-xs">
            Ürün sayfalarından &ldquo;Sepete Ekle&rdquo; butonuna tıklayarak ürün ekleyebilirsiniz.
          </p>
          <Link
            href="/tum-urunler"
            className="inline-flex items-center gap-2 bg-[#0f75bc] hover:bg-[#07446c] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors"
          >
            <ShoppingCart size={16} /> Ürünleri İncele
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Başlık */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/tum-urunler" className="p-2 rounded-xl bg-white border border-blue-100 text-[#07446c] hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#07446c]">Sepetim</h1>
              <p className="text-sm text-gray-400">{items.length} farklı ürün</p>
            </div>
          </div>

          {/* Fiyat teyit uyarısı */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              Lütfen WhatsApp üzerinden fiyat teklifi alarak fiyatı teyit ediniz.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">

            {/* ── Ürün Listesi ── */}
            <div className="lg:col-span-3 space-y-3">
              {items.map(({ product: p, quantity }) => (
                <div key={p.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd]">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} fill sizes="80px" className="object-contain p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl opacity-10">🖨️</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#25aae1] font-bold uppercase tracking-wider">{p.category}</p>
                    <p className="text-sm font-bold text-[#07446c] truncate">{p.name}</p>
                    <p className="text-sm font-black mt-0.5">
                      {p.is_price_on_request ? (
                        <span className="text-orange-500">Fiyat Alınız</span>
                      ) : (
                        <span className="text-[#07446c]">{p.price || "—"}</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQty(p.id, quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#07446c]">{quantity}</span>
                    <button
                      onClick={() => updateQty(p.id, quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => removeItem(p.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors font-semibold mt-1"
              >
                Sepeti Temizle
              </button>
            </div>

            {/* ── Sipariş Özeti & Form ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Müşteri Bilgileri */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-[#07446c] uppercase tracking-wide">
                    Müşteri Bilgileri
                  </h2>
                  {profile && (
                    <Link href="/profile" className="text-xs text-[#0f75bc] hover:underline font-semibold">
                      Düzenle
                    </Link>
                  )}
                </div>

                {authLoading ? (
                  <div className="flex justify-center py-4 text-gray-300">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                ) : !profile ? (
                  <div className="bg-[#e0f2fe] rounded-xl px-4 py-3 mb-4">
                    <p className="text-xs text-[#07446c]">
                      <Link href="/login" className="font-bold underline">Giriş yaparsanız</Link> bilgileriniz otomatik doldurulur.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full border border-blue-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefon No"
                      className="w-full border border-blue-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setAddressErr(false); }}
                      placeholder="Teslimat adresi *"
                      className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f75bc] transition-all resize-none ${
                        addressErr ? "border-red-400 bg-red-50" : "border-blue-100"
                      }`}
                    />
                    {addressErr && (
                      <p className="text-xs text-red-500 mt-1">Teslimat adresi zorunludur.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sipariş Tamamla */}
              <button
                onClick={handleOrder}
                className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1da851] text-white font-black py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-green-400/20 text-base"
              >
                <MessageCircle size={20} />
                Siparişi WhatsApp&apos;tan Tamamla
              </button>

              <p className="text-xs text-center text-gray-400 leading-relaxed px-2">
                Butona tıkladığınızda sipariş detaylarınız WhatsApp üzerinden tarafımıza iletilecektir. Ödeme sipariş onayından sonra alınır.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
