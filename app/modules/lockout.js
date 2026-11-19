
export async function lockoutimport(operacja)
 {
  const main = document.querySelector("main");

  if (main.inert) return;

  main.inert = true;

  try {
    await operacja();
  } finally {
    main.inert = false;
  }
}