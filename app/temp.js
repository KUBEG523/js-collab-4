
const lista = document.getElementById("list-zgloszenia");

// ==========================================
// ZMIENNE
// ==========================================

let czyImportowanie = false;

// Ukryty input do wyboru pliku
const ukrytyInputPliku = document.createElement("input");

ukrytyInputPliku.type = "file";
ukrytyInputPliku.accept = ".json,application/json";
ukrytyInputPliku.style.display = "none";

document.body.appendChild(ukrytyInputPliku);


// ==========================================
// BLOKOWANIE INTERFEJSU
// ==========================================

function blokujInterfejs(blokada) {

  czyImportowanie = blokada;

  // Formularz dodawania zgłoszeń
  document.querySelectorAll(
    "#form-zgloszenia-JS input, " +
    "#form-zgloszenia-JS textarea, " +
    "#form-zgloszenia-JS select, " +
    "#form-submit_btn"
  ).forEach(element => {
    element.disabled = blokada;
  });

  // Przyciski importu
  document.getElementById("import_btn-JS").disabled = blokada;

  const lokalnyImport = document.getElementById("import_btn-local-JS");

  if (lokalnyImport) {
    lokalnyImport.disabled = blokada;
  }

  // Przyciski i statusy zgłoszeń
  lista.querySelectorAll("button, select").forEach(element => {
    element.disabled = blokada;
  });

}


// ==========================================
// WALIDACJA JSON
// ==========================================

function walidujJSON(dane) {

  // Sprawdzenie tablicy
  if (!Array.isArray(dane)) {
    throw new Error("JSON musi zawierać tablicę zgłoszeń.");
  }

  const identyfikatory = new Set();
  const tytuly = new Set();

  dane.forEach((zgloszenie, index) => {

    // Sprawdzenie obiektu
    if (
      typeof zgloszenie !== "object" ||
      zgloszenie === null ||
      Array.isArray(zgloszenie)
    ) {
      throw new Error(`Zgłoszenie ${index + 1} nie jest obiektem.`);
    }

    // Sprawdzenie ID
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

    // Sprawdzenie tytułu
    if (
      typeof zgloszenie.tytul !== "string" ||
      zgloszenie.tytul.trim().length < 10 ||
      zgloszenie.tytul.trim().length > 100
    ) {
      throw new Error(`Niepoprawny tytuł zgłoszenia ${zgloszenie.id}.`);
    }

    // Sprawdzenie powtarzających się tytułów
    const tytul = zgloszenie.tytul.trim().toLowerCase();

    if (tytuly.has(tytul)) {
      throw new Error(`Powtórzony tytuł: ${zgloszenie.tytul}.`);
    }

    tytuly.add(tytul);

    // Sprawdzenie opisu
    if (
      typeof zgloszenie.opis !== "string" ||
      zgloszenie.opis.length > 255
    ) {
      throw new Error(`Niepoprawny opis zgłoszenia ${zgloszenie.id}.`);
    }

    // Sprawdzenie priorytetu
    if (!["low", "medium", "high"].includes(zgloszenie.priorytet)) {
      throw new Error(`Niepoprawny priorytet zgłoszenia ${zgloszenie.id}.`);
    }

    // Sprawdzenie statusu
    if (!["new", "doing", "done"].includes(zgloszenie.status)) {
      throw new Error(`Niepoprawny status zgłoszenia ${zgloszenie.id}.`);
    }

  });

  return true;
}


// ==========================================
// ZATWIERDZANIE IMPORTU
// ==========================================

function zatwierdzImport(dane) {

  // Walidacja przed zastąpieniem listy
  walidujJSON(dane);

  // Potwierdzenie użytkownika
  const potwierdzenie = confirm(
    `Znaleziono ${dane.length} zgłoszeń.\n\n` +
    "Czy na pewno chcesz zastąpić aktualną listę?"
  );

  if (!potwierdzenie) {
    return false;
  }

  // Zastąpienie aktualnej listy
  window.ustawZgloszenia(dane);

  return true;
}


// ==========================================
// IMPORT JSON Z PLIKU UŻYTKOWNIKA
// ==========================================

// Przycisk importu
document.getElementById("import_btn-JS").addEventListener("click", () => {

  if (czyImportowanie) return;

  ukrytyInputPliku.click();

});


// Wybór pliku przez użytkownika
ukrytyInputPliku.addEventListener("change", (event) => {

  const plik = event.target.files[0];

  if (!plik) return;

  if (!plik.name.toLowerCase().endsWith(".json")) {
    alert("Błąd: Wybierz plik z rozszerzeniem .json.");
    ukrytyInputPliku.value = "";
    return;
  }

  if (czyImportowanie) return;

  blokujInterfejs(true);

  const reader = new FileReader();

  reader.onload = (e) => {

    try {

      // Parsowanie JSON
      const dane = JSON.parse(e.target.result);

      console.log("Sparsowane dane:", dane);

      // Walidacja i potwierdzenie
      const wynik = zatwierdzImport(dane);

      if (wynik) {
        alert("Import JSON zakończony pomyślnie!");
      }

    } catch (err) {

      console.error("Błąd importu JSON:", err.message);

      alert("Błąd importu:\n" + err.message);

    } finally {

      // Zawsze odblokowanie interfejsu
      ukrytyInputPliku.value = "";

      blokujInterfejs(false);

    }

  };


  // Obsługa błędu odczytu pliku
  reader.onerror = () => {

    alert("Nie udało się odczytać pliku.");

    ukrytyInputPliku.value = "";

    blokujInterfejs(false);

  };


  reader.readAsText(plik, "UTF-8");

});


// ==========================================
// IMPORT LOKALNEGO JSON PRZEZ FETCH
// ==========================================

document
  .getElementById("import_btn-local-JS")
  .addEventListener("click", async () => {

    if (czyImportowanie) return;

    blokujInterfejs(true);

    try {

      // Pobieranie lokalnego JSON
      const odpowiedz = await fetch("./data/zgloszenia.json");

      if (!odpowiedz.ok) {
        throw new Error(
          "Błąd pobierania pliku. HTTP: " + odpowiedz.status
        );
      }

      // Odczyt JSON
      const dane = await odpowiedz.json();

      console.log("Pobrane dane:", dane);

      // Walidacja i potwierdzenie
      const wynik = zatwierdzImport(dane);

      if (wynik) {
        alert("Import lokalnego JSON zakończony pomyślnie!");
      }

    } catch (err) {

      console.error("Błąd importu lokalnego JSON:", err.message);

      alert("Błąd importu:\n" + err.message);

    } finally {

      blokujInterfejs(false);

    }

  });


console.log("Import JSON uruchomiony.");
