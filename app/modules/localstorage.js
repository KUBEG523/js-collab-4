import { walidujJSON } from "./import/walidacja.js";

let kopia = null;
let ostatniZapis = null;

const Storage = {
  pobierz() {
    if (kopia === null) {
      try {
        ostatniZapis = localStorage.getItem("zgloszenia");

        const dane = ostatniZapis === null ? [] : JSON.parse(ostatniZapis);
        walidujJSON(dane);
        kopia = JSON.stringify(dane);
      } catch {
        kopia = "[]";
        alert("Nie udało się odczytać zgłoszeń. Otwieram pustą listę.");
      }
    }

    return JSON.parse(kopia);
  },

  async zapisz(zgloszenia, nastepneID) {
    const tekst = JSON.stringify(zgloszenia);
    kopia = tekst;

    const wykonajZapis = () => {
      if (localStorage.getItem("zgloszenia") !== ostatniZapis) {
        throw new Error("Inna karta zmieniła listę.");
      }

      if (nastepneID !== undefined) this.zapiszID(nastepneID);

      localStorage.setItem("zgloszenia", tekst);
      ostatniZapis = tekst;
    };

    try {
      if (navigator.locks) {
        await navigator.locks.request("helpdesk-zapis", wykonajZapis);
      } else {
        wykonajZapis();
      }

      return true;
    } catch (blad) {
      alert(
        "Nie zapisano zmian. " + blad.message +
        " Możesz wyeksportować aktualną listę przed odświeżeniem."
      );
      return false;
    }
  },

  dodaj(zgloszenie) {
    const zgloszenia = this.pobierz();
    zgloszenia.push(zgloszenie);

    return this.zapisz(zgloszenia, zgloszenie.id + 1);
  },

  usun(id) {
    const zgloszenia = this.pobierz()
      .filter(z => z.id !== id);

    return this.zapisz(zgloszenia);
  },

  zmienStatus(id, status) {
    const zgloszenia = this.pobierz();

    const zgloszenie = zgloszenia.find(z => z.id === id);

    if (zgloszenie) {
      zgloszenie.status = status;
      return this.zapisz(zgloszenia);
    }
  },

  pobierzID() {
    try {
      const id = Number(localStorage.getItem("tablica"));
      return Number.isSafeInteger(id) && id > 0 ? id : 1;
    } catch {
      return 1;
    }
  },

  zapiszID(id) {
    localStorage.setItem("tablica", id);
  }
};

export default Storage;