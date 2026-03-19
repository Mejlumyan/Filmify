export const CardName = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  AMERICAN_EXPRESS: "American Express",
  UNKNOWN: "Card",
}

export const INPUT_CONFIG = [
  {
    id: "card-holder",
    name: "name",
    placeholder: "Card Holder",
    type: "text",
    maxLength: 30,
  },
  {
    id: "card-number",
    name: "number",
    placeholder: "Card Number",
    type: "text",
    pattern: "d*",
    maxLength: 22,
  },
  {
    id: "card-expiry",
    name: "expiry",
    placeholder: "MM/YY",
    type: "text",
    pattern: "d*",
    maxLength: 5,
  },
  {
    id: "card-cvc",
    name: "cvc",
    placeholder: "CVC",
    type: "text",
    pattern: "d*",
    maxLength: 4,
  },
];

export const CARD_CONFIG = [
  {
    name: CardName.VISA,
    regex: "^4",
    pattern: "#### #### #### ####",
    card_length: 16,
    cvc_length: 3,
  },
  {
    name: CardName.MASTERCARD,
    regex: "^(5[1-5]|2[2-7])",
    pattern: "#### #### #### ####",
    card_length: 16,
    cvc_length: 3,
  },
  {
    name: CardName.AMERICAN_EXPRESS,
    regex: "^3[47]",
    pattern: "#### ###### #####",
    card_length: 15,
    cvc_length: 4,
  },
];
