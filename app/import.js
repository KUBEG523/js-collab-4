const ukrytyInputPliku = document.createElement("input");
ukrytyInputPliku.type = "file";
ukrytyInputPliku.accept = ".json,application/json";
ukrytyInputPliku.style.display = "none";
document.body.appendChild(ukrytyInputPliku);
document.getElementById("import_btn-JS").addEventListener("click", () => {
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

  const reader = new FileReader();

  reader.onload = (e) => {
    try{
        const dane = JSON.parse(e.target.result);
        console.log("Sparsowane dane:", dane);
        if (!Array.isArray(dane)) {
            throw new Error("Plik JSON musi zawierać tablicę zgłoszeń.");
        }
    } catch(err){
        console.error("Błąd parsowania JSON: " + blad.message);
    }finally{
        ukrytyInputPliku.value = ""
  } 

  }
    reader.readAsText(plik, "UTF-8");
})

console.log("import js");