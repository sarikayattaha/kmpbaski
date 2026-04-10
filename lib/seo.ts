const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kmpbaski.com";
export const SITE_NAME  = "KMP Baskı";
export const SITE_PHONE = "+905541630031";

export function currentMonthYear(): string {
  const d = new Date();
  return `${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Baklava Kutusu Fiyatları - Nisan 2026 | KMP Baskı" */
export function pageTitle(base: string): string {
  return `${base} - ${currentMonthYear()} | ${SITE_NAME}`;
}

// ── Şehirler (81 il) ──────────────────────────────────────────────────────────

export type City = {
  slug: string;
  name: string;
  /** Türkçe bulunma hali: "İstanbul'da", "Ankara'da" vb. */
  locative: string;
};

export const CITIES: City[] = [
  { slug: "adana",           name: "Adana",           locative: "Adana'da"           },
  { slug: "adiyaman",        name: "Adıyaman",        locative: "Adıyaman'da"        },
  { slug: "afyonkarahisar",  name: "Afyonkarahisar",  locative: "Afyonkarahisar'da"  },
  { slug: "agri",            name: "Ağrı",            locative: "Ağrı'da"            },
  { slug: "amasya",          name: "Amasya",          locative: "Amasya'da"          },
  { slug: "ankara",          name: "Ankara",          locative: "Ankara'da"          },
  { slug: "antalya",         name: "Antalya",         locative: "Antalya'da"         },
  { slug: "artvin",          name: "Artvin",          locative: "Artvin'de"          },
  { slug: "aydin",           name: "Aydın",           locative: "Aydın'da"           },
  { slug: "balikesir",       name: "Balıkesir",       locative: "Balıkesir'de"       },
  { slug: "bilecik",         name: "Bilecik",         locative: "Bilecik'te"         },
  { slug: "bingol",          name: "Bingöl",          locative: "Bingöl'de"          },
  { slug: "bitlis",          name: "Bitlis",          locative: "Bitlis'te"          },
  { slug: "bolu",            name: "Bolu",            locative: "Bolu'da"            },
  { slug: "burdur",          name: "Burdur",          locative: "Burdur'da"          },
  { slug: "bursa",           name: "Bursa",           locative: "Bursa'da"           },
  { slug: "canakkale",       name: "Çanakkale",       locative: "Çanakkale'de"       },
  { slug: "cankiri",         name: "Çankırı",         locative: "Çankırı'da"         },
  { slug: "corum",           name: "Çorum",           locative: "Çorum'da"           },
  { slug: "denizli",         name: "Denizli",         locative: "Denizli'de"         },
  { slug: "diyarbakir",      name: "Diyarbakır",      locative: "Diyarbakır'da"      },
  { slug: "edirne",          name: "Edirne",          locative: "Edirne'de"          },
  { slug: "elazig",          name: "Elazığ",          locative: "Elazığ'da"          },
  { slug: "erzincan",        name: "Erzincan",        locative: "Erzincan'da"        },
  { slug: "erzurum",         name: "Erzurum",         locative: "Erzurum'da"         },
  { slug: "eskisehir",       name: "Eskişehir",       locative: "Eskişehir'de"       },
  { slug: "gaziantep",       name: "Gaziantep",       locative: "Gaziantep'te"       },
  { slug: "giresun",         name: "Giresun",         locative: "Giresun'da"         },
  { slug: "gumushane",       name: "Gümüşhane",       locative: "Gümüşhane'de"       },
  { slug: "hakkari",         name: "Hakkari",         locative: "Hakkari'de"         },
  { slug: "hatay",           name: "Hatay",           locative: "Hatay'da"           },
  { slug: "isparta",         name: "Isparta",         locative: "Isparta'da"         },
  { slug: "mersin",          name: "Mersin",          locative: "Mersin'de"          },
  { slug: "istanbul",        name: "İstanbul",        locative: "İstanbul'da"        },
  { slug: "izmir",           name: "İzmir",           locative: "İzmir'de"           },
  { slug: "kars",            name: "Kars",            locative: "Kars'ta"            },
  { slug: "kastamonu",       name: "Kastamonu",       locative: "Kastamonu'da"       },
  { slug: "kayseri",         name: "Kayseri",         locative: "Kayseri'de"         },
  { slug: "kirklareli",      name: "Kırklareli",      locative: "Kırklareli'nde"     },
  { slug: "kirsehir",        name: "Kırşehir",        locative: "Kırşehir'de"        },
  { slug: "kocaeli",         name: "Kocaeli",         locative: "Kocaeli'nde"        },
  { slug: "konya",           name: "Konya",           locative: "Konya'da"           },
  { slug: "kutahya",         name: "Kütahya",         locative: "Kütahya'da"         },
  { slug: "malatya",         name: "Malatya",         locative: "Malatya'da"         },
  { slug: "manisa",          name: "Manisa",          locative: "Manisa'da"          },
  { slug: "kahramanmaras",   name: "Kahramanmaraş",   locative: "Kahramanmaraş'ta"   },
  { slug: "mardin",          name: "Mardin",          locative: "Mardin'de"          },
  { slug: "mugla",           name: "Muğla",           locative: "Muğla'da"           },
  { slug: "mus",             name: "Muş",             locative: "Muş'ta"             },
  { slug: "nevsehir",        name: "Nevşehir",        locative: "Nevşehir'de"        },
  { slug: "nigde",           name: "Niğde",           locative: "Niğde'de"           },
  { slug: "ordu",            name: "Ordu",            locative: "Ordu'da"            },
  { slug: "rize",            name: "Rize",            locative: "Rize'de"            },
  { slug: "sakarya",         name: "Sakarya",         locative: "Sakarya'da"         },
  { slug: "samsun",          name: "Samsun",          locative: "Samsun'da"          },
  { slug: "siirt",           name: "Siirt",           locative: "Siirt'te"           },
  { slug: "sinop",           name: "Sinop",           locative: "Sinop'ta"           },
  { slug: "sivas",           name: "Sivas",           locative: "Sivas'ta"           },
  { slug: "tekirdag",        name: "Tekirdağ",        locative: "Tekirdağ'da"        },
  { slug: "tokat",           name: "Tokat",           locative: "Tokat'ta"           },
  { slug: "trabzon",         name: "Trabzon",         locative: "Trabzon'da"         },
  { slug: "tunceli",         name: "Tunceli",         locative: "Tunceli'de"         },
  { slug: "sanliurfa",       name: "Şanlıurfa",       locative: "Şanlıurfa'da"       },
  { slug: "usak",            name: "Uşak",            locative: "Uşak'ta"            },
  { slug: "van",             name: "Van",             locative: "Van'da"             },
  { slug: "yozgat",          name: "Yozgat",          locative: "Yozgat'ta"          },
  { slug: "zonguldak",       name: "Zonguldak",       locative: "Zonguldak'ta"       },
  { slug: "aksaray",         name: "Aksaray",         locative: "Aksaray'da"         },
  { slug: "bayburt",         name: "Bayburt",         locative: "Bayburt'ta"         },
  { slug: "karaman",         name: "Karaman",         locative: "Karaman'da"         },
  { slug: "kirikkale",       name: "Kırıkkale",       locative: "Kırıkkale'de"       },
  { slug: "batman",          name: "Batman",          locative: "Batman'da"          },
  { slug: "sirnak",          name: "Şırnak",          locative: "Şırnak'ta"          },
  { slug: "bartin",          name: "Bartın",          locative: "Bartın'da"          },
  { slug: "ardahan",         name: "Ardahan",         locative: "Ardahan'da"         },
  { slug: "igdir",           name: "Iğdır",           locative: "Iğdır'da"           },
  { slug: "yalova",          name: "Yalova",          locative: "Yalova'da"          },
  { slug: "karabuk",         name: "Karabük",         locative: "Karabük'te"         },
  { slug: "kilis",           name: "Kilis",           locative: "Kilis'te"           },
  { slug: "osmaniye",        name: "Osmaniye",        locative: "Osmaniye'de"        },
  { slug: "duzce",           name: "Düzce",           locative: "Düzce'de"           },
];

export function getCityBySlug(slug: string): City | null {
  return CITIES.find(c => c.slug === slug) ?? null;
}
