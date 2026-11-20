const Storage = {
  pobierz() {
    return JSON.parse(localStorage.getItem("zgloszenia")) || [];
  },

  zapisz(zgloszenia) {
    localStorage.setItem("zgloszenia", JSON.stringify(zgloszenia));
  },

  dodaj(zgloszenie) {
    const zgloszenia = this.pobierz();
    zgloszenia.push(zgloszenie);
    this.zapisz(zgloszenia);
  },

  usun(id) {
    const zgloszenia = this.pobierz()
      .filter(z => z.id !== id);

    this.zapisz(zgloszenia);
  },

  zmienStatus(id, status) {
    const zgloszenia = this.pobierz();

    const zgloszenie = zgloszenia.find(z => z.id === id);

    if (zgloszenie) {
      zgloszenie.status = status;
      this.zapisz(zgloszenia);
    }
  },

  pobierzID() {
    return Number(localStorage.getItem("tablica")) || 1;
  },

  zapiszID(id) {
    localStorage.setItem("tablica", id);
  }
};

export default Storage;