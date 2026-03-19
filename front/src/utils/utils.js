import { CARD_CONFIG, CardName } from "../types/type";

export const getImageUrl = (path) => {
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};


export const getCardType = (number, config) => {
  const cleanNumber = number.replace(/\s+/g, "");

  if (!cleanNumber) return null;

  for (const card of config) {
    const re =
      typeof card.regex === "string" ? new RegExp(card.regex) : card.regex;

    if (re instanceof RegExp && re.test(cleanNumber)) {
      return card.name;
    }
  }

  return null;
};

export const formatCVC = (value) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue.slice(0, 4);
};

export const formatCreditCardNumber = (value) => {
  const cleanValue = value.replace(/\D/g, ""); 
  const parts = [];

  for (let i = 0; i < cleanValue.length; i += 4) {
    parts.push(cleanValue.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ").slice(0, 19); 
  }

  return cleanValue;
};


export const formatExpirationDate = (value) => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length >= 3) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
  }
  return cleanValue.slice(0, 5);
};



