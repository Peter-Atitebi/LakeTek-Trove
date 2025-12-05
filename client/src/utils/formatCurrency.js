// utils/formatCurrency.js

export const formatCurrency = (amount, currency = "NGN") => {
  if (amount === null || amount === undefined) return "N/A";

  const currencySymbols = {
    // Africa
    NGN: "₦", // Nigerian Naira
    ZAR: "R", // South African Rand
    EGP: "E£", // Egyptian Pound
    KES: "KSh", // Kenyan Shilling
    GHS: "₵", // Ghanaian Cedi
    TZS: "TSh", // Tanzanian Shilling
    UGX: "USh", // Ugandan Shilling
    MAD: "DH", // Moroccan Dirham
    ETB: "Br", // Ethiopian Birr
    XOF: "CFA", // West African CFA Franc
    XAF: "FCFA", // Central African CFA Franc

    // Americas
    USD: "$", // US Dollar
    CAD: "C$", // Canadian Dollar
    MXN: "$", // Mexican Peso
    BRL: "R$", // Brazilian Real
    ARS: "$", // Argentine Peso
    CLP: "$", // Chilean Peso
    COP: "$", // Colombian Peso
    PEN: "S/", // Peruvian Sol

    // Europe
    EUR: "€", // Euro
    GBP: "£", // British Pound
    CHF: "Fr", // Swiss Franc
    SEK: "kr", // Swedish Krona
    NOK: "kr", // Norwegian Krone
    DKK: "kr", // Danish Krone
    PLN: "zł", // Polish Zloty
    CZK: "Kč", // Czech Koruna
    HUF: "Ft", // Hungarian Forint
    RON: "lei", // Romanian Leu
    RUB: "₽", // Russian Ruble
    UAH: "₴", // Ukrainian Hryvnia
    TRY: "₺", // Turkish Lira

    // Asia
    CNY: "¥", // Chinese Yuan
    JPY: "¥", // Japanese Yen
    KRW: "₩", // South Korean Won
    INR: "₹", // Indian Rupee
    PKR: "₨", // Pakistani Rupee
    BDT: "৳", // Bangladeshi Taka
    IDR: "Rp", // Indonesian Rupiah
    MYR: "RM", // Malaysian Ringgit
    PHP: "₱", // Philippine Peso
    THB: "฿", // Thai Baht
    VND: "₫", // Vietnamese Dong
    SGD: "S$", // Singapore Dollar
    HKD: "HK$", // Hong Kong Dollar
    TWD: "NT$", // Taiwan Dollar
    AED: "د.إ", // UAE Dirham
    SAR: "﷼", // Saudi Riyal
    ILS: "₪", // Israeli Shekel

    // Oceania
    AUD: "A$", // Australian Dollar
    NZD: "NZ$", // New Zealand Dollar

    // Cryptocurrencies (bonus)
    BTC: "₿", // Bitcoin
    ETH: "Ξ", // Ethereum
  };

  return `${currencySymbols[currency] || ""}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
