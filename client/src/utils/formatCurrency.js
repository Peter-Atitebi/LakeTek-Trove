// utils/formatCurrency.js

export const formatCurrency = (amount, country = "NG") => {
  if (amount === null || amount === undefined) return "N/A";

  // Map countries to their currencies
  const countryCurrencyMap = {
    // Africa
    NG: "NGN", // Nigeria
    ZA: "ZAR", // South Africa
    EG: "EGP", // Egypt
    KE: "KES", // Kenya
    GH: "GHS", // Ghana
    TZ: "TZS", // Tanzania
    UG: "UGX", // Uganda
    MA: "MAD", // Morocco
    ET: "ETB", // Ethiopia

    // Americas
    US: "USD", // United States
    CA: "CAD", // Canada
    MX: "MXN", // Mexico
    BR: "BRL", // Brazil
    AR: "ARS", // Argentina
    CL: "CLP", // Chile
    CO: "COP", // Colombia
    PE: "PEN", // Peru

    // Europe
    GB: "GBP", // United Kingdom
    CH: "CHF", // Switzerland
    SE: "SEK", // Sweden
    NO: "NOK", // Norway
    DK: "DKK", // Denmark
    PL: "PLN", // Poland
    CZ: "CZK", // Czech Republic
    HU: "HUF", // Hungary
    RO: "RON", // Romania
    RU: "RUB", // Russia
    UA: "UAH", // Ukraine
    TR: "TRY", // Turkey

    // Euro countries
    DE: "EUR",
    FR: "EUR",
    IT: "EUR",
    ES: "EUR",
    NL: "EUR",
    BE: "EUR",
    AT: "EUR",
    PT: "EUR",
    IE: "EUR",
    GR: "EUR",
    FI: "EUR",

    // Asia
    CN: "CNY", // China
    JP: "JPY", // Japan
    KR: "KRW", // South Korea
    IN: "INR", // India
    PK: "PKR", // Pakistan
    BD: "BDT", // Bangladesh
    ID: "IDR", // Indonesia
    MY: "MYR", // Malaysia
    PH: "PHP", // Philippines
    TH: "THB", // Thailand
    VN: "VND", // Vietnam
    SG: "SGD", // Singapore
    HK: "HKD", // Hong Kong
    TW: "TWD", // Taiwan
    AE: "AED", // UAE
    SA: "SAR", // Saudi Arabia
    IL: "ILS", // Israel

    // Oceania
    AU: "AUD", // Australia
    NZ: "NZD", // New Zealand
  };

  const currencySymbols = {
    // Africa
    NGN: "₦",
    ZAR: "R",
    EGP: "E£",
    KES: "KSh",
    GHS: "₵",
    TZS: "TSh",
    UGX: "USh",
    MAD: "DH",
    ETB: "Br",
    XOF: "CFA",
    XAF: "FCFA",

    // Americas
    USD: "$",
    CAD: "C$",
    MXN: "$",
    BRL: "R$",
    ARS: "$",
    CLP: "$",
    COP: "$",
    PEN: "S/",

    // Europe
    EUR: "€",
    GBP: "£",
    CHF: "Fr",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    CZK: "Kč",
    HUF: "Ft",
    RON: "lei",
    RUB: "₽",
    UAH: "₴",
    TRY: "₺",

    // Asia
    CNY: "¥",
    JPY: "¥",
    KRW: "₩",
    INR: "₹",
    PKR: "₨",
    BDT: "৳",
    IDR: "Rp",
    MYR: "RM",
    PHP: "₱",
    THB: "฿",
    VND: "₫",
    SGD: "S$",
    HKD: "HK$",
    TWD: "NT$",
    AED: "د.إ",
    SAR: "﷼",
    ILS: "₪",

    // Oceania
    AUD: "A$",
    NZD: "NZ$",

    // Cryptocurrencies
    BTC: "₿",
    ETH: "Ξ",
  };

  const currency = countryCurrencyMap[country] || "NGN";
  const symbol = currencySymbols[currency] || "";

  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
