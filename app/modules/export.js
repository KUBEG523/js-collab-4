
export const eksportujJSON = () => {
  const daneJSON = JSON.stringify(window.zgloszenia, null, 2);

  const plik = new Blob([daneJSON], {
    type: "application/json"
  });

  const url = URL.createObjectURL(plik);

  const link = document.createElement("a");
  link.href = url;
  link.download = "zgloszenia.json";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

document.getElementById("export_btn-JS").addEventListener("click", () => {
  eksportujJSON();
});