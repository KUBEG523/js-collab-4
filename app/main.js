
import Storage from "./modules/localStorage.js";

const lista = document.getElementById("list-zgloszenia");

let zgloszenia = Storage.pobierz();
let tablicaID = Storage.pobierzID();

// zabezpieczenie przed powtórzeniem ID
if (zgloszenia.length > 0) {
  const maxID = Math.max(...zgloszenia.map(z => z.id));
  if (tablicaID <= maxID) {
    tablicaID = maxID + 1;
  }
}

let aktywneLiczba = 0;

let statusFiltra = "all";
let priorytetFiltra = "all";

const statusOpcje = [
  { value: "new", tekst: "Nowe" },
  { value: "doing", tekst: "W trakcie" },
  { value: "done", tekst: "Zrobione" }
];

// tworzenie elementu zgłoszenia
function utworzElement(zgloszenie) {
  const noweZgloszenie = document.createElement("li");

  noweZgloszenie.dataset.id = zgloszenie.id;
  noweZgloszenie.classList.add("list-element-li");

  noweZgloszenie.textContent =
    "Tytuł: " + zgloszenie.tytul +
    ". Opis: " + zgloszenie.opis +
    " | Priorytet: " + zgloszenie.priorytet + " ";

  // select statusu
  const status = document.createElement("select");

  status.setAttribute(
    "aria-label",
    "Status zgłoszenia " + zgloszenie.id
  );

  status.value = zgloszenie.status;

  status.addEventListener("change", function () {
    zgloszenie.status = status.value;

    Storage.zmienStatus(zgloszenie.id, status.value);
    liczbaZgloszen();
  });

  statusOpcje.forEach(opcja => {
    const opt = document.createElement("option");

    opt.value = opcja.value;
    opt.textContent = opcja.tekst;

    status.appendChild(opt);
  });

  // ustawienie aktualnego statusu
  status.value = zgloszenie.status;

  // przycisk usuwania
  const btnDelete = document.createElement("button");

  btnDelete.type = "button";
  btnDelete.textContent = "Usuń";

  btnDelete.addEventListener("click", function () {
    zgloszenia = zgloszenia.filter(
      z => z.id !== zgloszenie.id
    );

    Storage.usun(zgloszenie.id);

    renderujZgloszenia();
    liczbaZgloszen();
  });

  noweZgloszenie.appendChild(status);
  noweZgloszenie.appendChild(btnDelete);

  return noweZgloszenie;
}

// wyświetlanie wszystkich zgłoszeń
function renderujZgloszenia() {
  lista.innerHTML = "";

  zgloszenia.forEach(zgloszenie => {
    const element = utworzElement(zgloszenie);
    lista.appendChild(element);
  });

  filtrujZgloszenia();
}

// liczba zgłoszeń
function liczbaZgloszen() {
  const liczba = zgloszenia.length;
  aktywneLiczba = 0;

  zgloszenia.forEach(zgloszenie => {
    if (
      zgloszenie.status == "new" ||
      zgloszenie.status == "doing"
    ) {
      aktywneLiczba++;
    }
  });

  document.getElementById("all_ctr-zgloszenia-js")
    .textContent = liczba;

  document.getElementById("active_ctr-zgloszenia-js")
    .textContent = aktywneLiczba;

  renderujZgloszenia();
}

// filtrowanie
function filtrujZgloszenia() {
  let widoczne = 0;

  const komunikat = document.getElementById("brak-wynikow");

  if (komunikat) {
    komunikat.remove();
  }

  zgloszenia.forEach(zgloszenie => {
    const element = lista.querySelector(
      `li[data-id="${zgloszenie.id}"]`
    );

    if (!element) return;

    const filtrstatus =
      statusFiltra == "all" ||
      zgloszenie.status == statusFiltra;

    const filtrpriorytet =
      priorytetFiltra == "all" ||
      zgloszenie.priorytet == priorytetFiltra;

    if (filtrstatus && filtrpriorytet) {
      element.style.display = "";
      widoczne++;
    } else {
      element.style.display = "none";
    }
  });

  if (widoczne == 0 && zgloszenia.length > 0) {
    const tekst = document.createElement("li");

    tekst.id = "brak-wynikow";
    tekst.textContent = "Brak pasujących zgłoszeń";

    lista.appendChild(tekst);
  }

  if (zgloszenia.length == 0) {
    const tekst = document.createElement("li");

    tekst.id = "pusta-lista";
    tekst.textContent = "Pusta lista";

    lista.appendChild(tekst);
  }
}

// dodawanie zgłoszenia
document
  .getElementById("form-zgloszenia-JS")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const tytul = document.getElementById("form-title")
      .value.trim();

    const zgloszenie = {
      id: tablicaID,
      tytul: tytul,
      opis: document.getElementById("form-description")
        .value.trim(),
      priorytet: document.getElementById("form-priority")
        .value,
      status: "new"
    };

    // sprawdzanie czy tytuł już istnieje
    if (zgloszenia.some(z => z.tytul === tytul)) {
      alert("Nie mogą być dwa takie same zgłoszenia");
      return;
    }

    // dodanie do tablicy
    zgloszenia.push(zgloszenie);

    // zapis do LocalStorage
    Storage.dodaj(zgloszenie);

    // zwiększenie ID
    tablicaID++;
    Storage.zapiszID(tablicaID);

    // odświeżenie listy
    renderujZgloszenia();
    liczbaZgloszen();

    // czyszczenie formularza
    document.getElementById("form-title").value = "";
    document.getElementById("form-description").value = "";
  });

// filtrowanie formularzem
document
  .getElementById("filter-zgloszenia")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    statusFiltra = document.getElementById("filter-status").value;
    priorytetFiltra = document.getElementById("filter-priority").value;

    filtrujZgloszenia();
  });

// uruchomienie po wejściu na stronę
renderujZgloszenia();
liczbaZgloszen();
