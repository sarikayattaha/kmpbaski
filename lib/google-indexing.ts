/**
 * Google Indexing API servisi
 *
 * Kurulum:
 *  1. Google Cloud Console → IAM & Admin → Service Accounts → Yeni hesap oluştur
 *  2. "Sahip" veya "Indexing API" rolü ver
 *  3. Anahtar oluştur (JSON) → indir
 *  4. .env.local dosyasına ekle:
 *       GOOGLE_CLIENT_EMAIL=xxx@project.iam.gserviceaccount.com
 *       GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *  5. Google Search Console → Ayarlar → Kullanıcılar → Service Account emailini ekle
 *
 * NOT: Google Indexing API resmi olarak yalnızca Job Posting ve Livestream içerikler için
 * belgelenmiştir. Normal sayfalar için de sinyal gönderir; Google'ın nasıl işleyeceği
 * içerik türüne göre değişir.
 */

const INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SCOPE         = "https://www.googleapis.com/auth/indexing";

// ── JWT (RS256) ────────────────────────────────────────────────────────────

function b64url(buf: ArrayBuffer | Uint8Array): string {
  return Buffer.from(buf instanceof ArrayBuffer ? buf : buf.buffer)
    .toString("base64url");
}

async function signedJWT(email: string, pemKey: string): Promise<string> {
  const header  = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const now     = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ iss: email, sub: email, aud: TOKEN_ENDPOINT, iat: now, exp: now + 3600, scope: SCOPE })
  ).toString("base64url");

  const signingInput = `${header}.${payload}`;

  // PEM → DER
  const b64 = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const der = Buffer.from(b64, "base64");

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${b64url(sig)}`;
}

// ── Access Token ───────────────────────────────────────────────────────────

async function getAccessToken(email: string, pemKey: string): Promise<string> {
  const jwt = await signedJWT(email, pemKey);
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token isteği başarısız: ${res.status} — ${body}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

// ── Dışa açık fonksiyon ────────────────────────────────────────────────────

export type IndexingType = "URL_UPDATED" | "URL_DELETED";

/**
 * Bir URL'nin eklendiğini/güncellendiğini Google'a bildir.
 *
 * @example
 * await notifyGoogle("https://kmpbaski.com/ambalaj/istanbul/baklava-kutusu");
 */
export async function notifyGoogle(
  url: string,
  type: IndexingType = "URL_UPDATED"
): Promise<{ success: boolean; message: string }> {
  const email      = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    const msg = "[Google Indexing] GOOGLE_CLIENT_EMAIL veya GOOGLE_PRIVATE_KEY eksik.";
    console.warn(msg);
    return { success: false, message: msg };
  }

  try {
    const token = await getAccessToken(email, privateKey);

    const res = await fetch(INDEXING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Indexing API hatası: ${res.status} — ${body}`);
    }

    const data = await res.json();
    console.log(`[Google Indexing] ✓ ${type}: ${url}`, data);
    return { success: true, message: `Bildirim gönderildi: ${url}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Google Indexing] Hata:", message);
    return { success: false, message };
  }
}

/**
 * Birden fazla URL'yi toplu bildir.
 * Rate limit: saniyede maks 200 istek (Google kısıtı).
 */
export async function notifyGoogleBatch(
  urls: string[],
  type: IndexingType = "URL_UPDATED"
): Promise<void> {
  for (const url of urls) {
    await notifyGoogle(url, type);
    // Hafif bekleme — rate limit önlemi
    await new Promise(r => setTimeout(r, 200));
  }
}
