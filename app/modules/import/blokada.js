export const blokujInterfejs = (blokada) => {

  document.querySelectorAll(
    "#form-zgloszenia-JS input, " +
    "#form-zgloszenia-JS textarea, " +
    "#form-zgloszenia-JS select, " +
    "#form-submit_btn"
  ).forEach(element => {
    element.disabled = blokada;
  });

  document.getElementById("import_btn-JS").disabled = blokada;
  document.getElementById("export_btn-JS").disabled = blokada;

  const lokalnyImport = document.getElementById("import_btn-local-JS");

  if (lokalnyImport) {
    lokalnyImport.disabled = blokada;
  }

  const lista = document.getElementById("list-zgloszenia");

  lista.querySelectorAll("button, select").forEach(element => {
    element.disabled = blokada;
  });

};