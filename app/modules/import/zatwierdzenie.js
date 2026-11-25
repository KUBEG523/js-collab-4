import { walidujJSON } from "./walidacja.js";

export const zatwierdzImport = (dane) => {

  walidujJSON(dane);

  const potwierdzenie = confirm(
    `Znaleziono ${dane.length} zgłoszeń.\n\n` +
    "Czy na pewno chcesz zastąpić aktualną listę?"
  );

  if (!potwierdzenie) {
    return false;
  }

 return window.ustawZgloszenia(dane);
};