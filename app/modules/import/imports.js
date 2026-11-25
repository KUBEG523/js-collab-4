import { blokujInterfejs } from "./blokada.js";
import { zatwierdzImport } from "./zatwierdzenie.js";

export const inicjalizujImport = () => {

  const ukrytyInputPliku = document.createElement("input");

  ukrytyInputPliku.type = "file";
  ukrytyInputPliku.accept = ".json,application/json";
  ukrytyInputPliku.style.display = "none";

  document.body.appendChild(ukrytyInputPliku);

  let czyImportowanie = false;

  document.getElementById("import_btn-JS").addEventListener("click", () => {

    if (czyImportowanie) return;

    ukrytyInputPliku.click();

  });

  ukrytyInputPliku.addEventListener("change", (event) => {

    const plik = event.target.files[0];

    if (!plik) return;

    if (!plik.name.toLowerCase().endsWith(".json")) {
      alert("Błąd: Wybierz plik z rozszerzeniem .json.");
      ukrytyInputPliku.value = "";
      return;
    }

    if (czyImportowanie) return;

    czyImportowanie = true;
    blokujInterfejs(true);

    const reader = new FileReader();

    reader.onload = async (e) => {

      try {

        const dane = JSON.parse(e.target.result);

       const wynik = await zatwierdzImport(dane);

        if (wynik) {
          alert("Import JSON zakończony pomyślnie!");
        }

      } catch (err) {

        console.error("Błąd importu JSON:", err);
        alert("Błąd importu JSON: " + err.message);

      } finally {

        ukrytyInputPliku.value = "";
        czyImportowanie = false;
        blokujInterfejs(false);

      }

    };

    reader.onerror = () => {

      alert("Nie udało się odczytać pliku.");

      ukrytyInputPliku.value = "";
      czyImportowanie = false;
      blokujInterfejs(false);

    };

    reader.readAsText(plik, "UTF-8");

  });

};

inicjalizujImport();