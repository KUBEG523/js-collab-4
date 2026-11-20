import { lockoutimport } from "./lockout.js";


export async function pobierzdane() {
  const http_response = await fetch("./HTTP_JSON.json", { cache: "no-store" });

  if (!http_response.ok) {
    throw new Error("blad pobierania JSON");
  }
  return http_response.json();
}

export function JsonCheck(dane)
 {
  if (!Array.isArray(dane)) 
    {
    throw new Error("JSON ma bledny format.");
  }

  const idstatus = new Set();
  const tytuly = new Set();

  return dane.map((rekord, i) => 
    {

    const zgloszenie = `zgloszenie nr ${i + 1}`;

    if (rekord === null || typeof rekord !== "object" || Array.isArray(rekord)) 
      {
      throw new Error(`${zgloszenie} nie jest obiektem`);
    }

    const { id, tytul, opis, priorytet, status } = rekord;

    if (!Number.isInteger(id) || id < 1 || idstatus.has(id)) 
    {
      throw new Error(`${zgloszenie} - blad ID -> zla wartosc lub juz takie jest`);
    }

    const tytultrim = typeof tytul === "string" ? tytul.trim() : "";

    if (tytultrim.length < 10 || tytultrim.length > 100) {
      throw new Error(`${zgloszenie} - tytul ma za duzo znakow`);
    }

    if (tytuly.has(tytultrim)) {
      throw new Error(`${zgloszenie} - sa 2 zgloszenia z tym samym tytulem.`);
    }

    const opistrim = typeof opis === "string" ? opis.trim() : "";

    if (typeof opis !== "string" || opis.length > 255) {
      throw new Error(`${zgloszenie} - albo brak opisu albo za dlugi opis`);
    }

    if (!["low", "medium", "high"].includes(priorytet)) {
      throw new Error(`${zgloszenie} - bledny priorytet`);
    }

    if (!["new", "doing", "done"].includes(status)) {
      throw new Error(`${zgloszenie} - bledny status`);
    }

    idstatus.add(id);
    tytuly.add(tytultrim);

    return { id, tytul: tytultrim, opis: opistrim, priorytet, status };
  });
}

// zasadniczo przekopiowane z main.js

function importhttp(zgloszenie) 
{
  const element = document.createElement("li");
  element.className = "list-element-li";
  element.dataset.id = zgloszenie.id;

  const tekst = document.createElement("span");
  tekst.className = "list-text";
  tekst.textContent =`Tytuł: ${zgloszenie.tytul}. Opis: ${zgloszenie.opis} | Priorytet: ${zgloszenie.priorytet}`;

  const status = document.createElement("select");
  status.setAttribute("aria-label", "Status zgłoszenia " + zgloszenie.id);

  statusOpcje.forEach((opcja) => {
    status.add(new Option(opcja.tekst, opcja.value));
  });

  status.value = zgloszenie.status;
  status.addEventListener("change", zmianaStatusu);

  const usun = document.createElement("button");
  usun.type = "button";
  usun.textContent = "Usuń";
  usun.addEventListener("click", usunZgloszenie);

  const przyciski = document.createElement("div");
  przyciski.className = "list-inputs";
  przyciski.append(status, usun);

  element.append(tekst, przyciski);
  return element;
}

function zastapListehttp(noweZgloszenia) {
  const nowalista = document.createDocumentFragment();
  let najwiekszeID = 0;

  noweZgloszenia.forEach((zgloszenie) => {
    nowalista.appendChild(importhttp(zgloszenie));
    najwiekszeID = Math.max(najwiekszeID, zgloszenie.id);
  });


  lista.replaceChildren(nowalista);
  zgloszenia = noweZgloszenia;
  tablicaID = najwiekszeID + 1;
  liczbaZgloszen();
}
// zasadniczo najwazniejsze czyli import :3

export function importFrom(wczytaj) {
  return lockoutimport(async () => {
    if (!window.confirm("czy zastapic liste :3")) {
      return;
    }

    try {
      const dane = await wczytaj();
      const noweZgloszenia = JsonCheck(dane);
      zastapListehttp(noweZgloszenia);
    } catch (blad) {
      const powod = blad instanceof SyntaxError ? "Odebrane dane nie są poprawnym JSON-em.": blad.message;

      alert("Błąd importu. " + powod);
    }
  });
}

document.getElementById("import_btn-HTTP").addEventListener("click", () => {
  importFrom(pobierzdane);
});

// eskport 

export async function exporthttp() 
{
  const dane = JsonCheck(zgloszenia);
  const tekst = JSON.stringify(dane, null, 2);

  const plik = await window.showSaveFilePicker({
    suggestedName: "HTTP_JSON.json",
    types: [
      {
        description: "Plik JSON",
        accept: { "application/json": [".json"] }
      }
    ]
  });

  const zapis = await plik.createWritable();
  await zapis.write(tekst);
  await zapis.close();
}

document.getElementById("export_btn-HTTP").addEventListener("click", () => {
  lockoutimport(async () => {
    try {
      await exporthttp();
      alert("zapisano JSON :3");
    } catch (blad) {
      if (blad.name === "AbortError") {
        return;
      }

      alert("Błąd eksportu. " + blad.message);
    }
  });
});