const lista = document.getElementById("list-zgloszenia");

// tablica dla zgloszen
let zgloszenia = JSON.parse(localStorage.getItem("zgloszenia")) || [];

// id tablicy
let tablicaID = Number(localStorage.getItem("tablica")) || 1;

// zmienna do aktywnch zgloszen :3
let aktywneLiczba = 0;

let statusFiltra = "all";
let priorytetFiltra = "all";

// obiektówka do utworzenia droplisty Status
let statusOpcje = [
  { value: "new", tekst: "Nowe" },
  { value: "doing", tekst: "W trakcie" },
  { value: "done", tekst: "Zrobione" },
];

//sprawdzenie liczby zgłoszeń
function liczbaZgloszen() {
  let liczba = zgloszenia.length;
  aktywneLiczba = 0;

  zgloszenia.forEach((zgloszenie) => {
    if (zgloszenie.status == "new" || zgloszenie.status == "doing") {
      aktywneLiczba++;
    }
  });

  document.getElementById("all_ctr-zgloszenia-js").textContent = liczba;
  document.getElementById("active_ctr-zgloszenia-js").textContent =
    aktywneLiczba;

  const pustalista = document.getElementById("pusta-lista");
  if (pustalista) {
    pustalista.remove();
  }

  if (liczba == 0) {
    const tekst = document.createElement("li");
    tekst.id = "pusta-lista";
    tekst.textContent = "Pusta lista";
    lista.appendChild(tekst);
  }

  filtrujZgloszenia();
}

// usunięcie zgłoszenia
function usunZgloszenie(event) {
  let usuniecie = JSON.parse(localStorage.getItem("zgloszenia")) || [];
  const element = event.currentTarget.closest("li");
  if (element) {
    let index = zgloszenia.findIndex(
      (zgloszenie) => zgloszenie.id == Number(element.dataset.id)
    );

    if (index != -1) {
      zgloszenia.splice(index, 1);
    }

    element.remove();
  }
  liczbaZgloszen();
}

function zmianaStatusu(event) {
  const element = event.target.closest("li");

  zgloszenia.forEach((zgloszenie) => {
    if (zgloszenie.id == Number(element.dataset.id)) {
      zgloszenie.status = event.target.value;
    }
  });

  liczbaZgloszen();
  localStorage.setItem("zgloszenia", JSON.stringify(zgloszenia));
  return aktywneLiczba;
}


// dodawanie zgłoszenia
document
  .getElementById("form-zgloszenia-JS")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let zgloszenie = {
      id: tablicaID,
      tytul: document.getElementById("form-title").value.trim(),
      opis: document.getElementById("form-description").value.trim(),
      priorytet: document.getElementById("form-priority").value,
      status: "new",
    };

    // warunek czy sa takie same tytuly i czy tablica nie przekroczyla rozmiaru
    if (
      !zgloszenia.some(
        (istniejaceZgloszenie) =>
          document.getElementById("form-title").value ===
          istniejaceZgloszenie.tytul,
      )
    ) {
      //dodawanie kontenera dla zgloszenia
      const noweZgloszenie = document.createElement("li");
      noweZgloszenie.dataset.id = zgloszenie.id;
      noweZgloszenie.classList.add("list-element-li");

      //dodanie tekstu dla zgloszenia
      const tekstzgloszenia = document.createElement("span");
      tekstzgloszenia.className = "list-text";

      tekstzgloszenia.textContent =
        "Tytuł: " +
        zgloszenie.tytul +
        ". Opis: " +
        zgloszenie.opis +
        " | Priorytet: " +
        zgloszenie.priorytet +
        " ";

      //przyciski dla zgloszen

      const status = document.createElement("select");
      status.setAttribute("aria-label", "Status zgłoszenia " + zgloszenie.id);
      status.addEventListener("change", zmianaStatusu);
      statusOpcje.forEach((opcja) => {
        const opcje = document.createElement("option");
        opcje.value = opcja.value;
        opcje.text = opcja.tekst;

        status.appendChild(opcje);
      });

      const btnDelete = document.createElement("button");
      btnDelete.type = "button";
      btnDelete.textContent = "Usuń";
      btnDelete.addEventListener("click", usunZgloszenie);
      
      // kontener na inputy
      const inputkontener = document.createElement("div");

      inputkontener.className = "list-inputs";
      inputkontener.append(status, btnDelete);

      noweZgloszenie.append(tekstzgloszenia, inputkontener);
      lista.appendChild(noweZgloszenie);

      // zwiekszenie id tablicy dla wpisaywania w tablice
      tablicaID++;
      localStorage.setItem("tablica", tablicaID);
      zgloszenia.push(zgloszenie);
      liczbaZgloszen();
      document.getElementById("form-title").value = "";
      document.getElementById("form-description").value = "";
    } else {
      alert("nie moga byc dwa takie same zgłoszenia");
      return;
    }
  });

// filtorwanie
function filtrujZgloszenia() {
  let widoczne = 0;

  const komunikatbrakfiltru = document.getElementById("brak-wynikow");
  if (komunikatbrakfiltru) {
    komunikatbrakfiltru.remove();
  }

  zgloszenia.forEach((zgloszenie) => {
    const element = lista.querySelector(`li[data-id="${zgloszenie.id}"]`);

    const filtrstatus =
      statusFiltra == "all" || zgloszenie.status == statusFiltra;
    const filtrpriorytet =
      priorytetFiltra == "all" || zgloszenie.priorytet == priorytetFiltra;

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
    tekst.textContent = "Brak pasujących zgłoszen";
    lista.appendChild(tekst);
  }
}

document
  .getElementById("filter-zgloszenia")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    statusFiltra = document.getElementById("filter-status").value;
    priorytetFiltra = document.getElementById("filter-priority").value;

    filtrujZgloszenia();
  });

liczbaZgloszen();