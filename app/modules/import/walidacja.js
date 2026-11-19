export const walidujJSON = (dane) => {

  if (!Array.isArray(dane)) {
    throw new Error("JSON musi zawierać tablicę zgłoszeń.");
  }

  const identyfikatory = new Set();
  const tytuly = new Set();

  dane.forEach((zgloszenie, index) => {

    if (
      typeof zgloszenie !== "object" ||
      zgloszenie === null ||
      Array.isArray(zgloszenie)
    ) {
      throw new Error(`Zgłoszenie ${index + 1} nie jest obiektem.`);
    }

    if (
      !Number.isSafeInteger(zgloszenie.id) ||
      zgloszenie.id <= 0
    ) {
      throw new Error(`Niepoprawne ID zgłoszenia ${index + 1}.`);
    }

    if (identyfikatory.has(zgloszenie.id)) {
      throw new Error(`Powtórzone ID: ${zgloszenie.id}.`);
    }

    identyfikatory.add(zgloszenie.id);

    if (
      typeof zgloszenie.tytul !== "string" ||
      zgloszenie.tytul.trim().length < 10 ||
      zgloszenie.tytul.trim().length > 100
    ) {
      throw new Error(`Niepoprawny tytuł zgłoszenia ${zgloszenie.id}.`);
    }

    const tytul = zgloszenie.tytul.trim().toLowerCase();

    if (tytuly.has(tytul)) {
      throw new Error(`Powtórzony tytuł: ${zgloszenie.tytul}.`);
    }

    tytuly.add(tytul);

    if (
      typeof zgloszenie.opis !== "string" ||
      zgloszenie.opis.length > 255
    ) {
      throw new Error(`Niepoprawny opis zgłoszenia ${zgloszenie.id}.`);
    }

    if (!["low", "medium", "high"].includes(zgloszenie.priorytet)) {
      throw new Error(`Niepoprawny priorytet zgłoszenia ${zgloszenie.id}.`);
    }

    if (!["new", "doing", "done"].includes(zgloszenie.status)) {
      throw new Error(`Niepoprawny status zgłoszenia ${zgloszenie.id}.`);
    }

  });

  return true;
};