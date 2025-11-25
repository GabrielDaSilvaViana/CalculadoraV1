document
  .getElementById("formTabuada")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const valor = document.getElementById("multiplicador").value;
    const multiplicador = parseInt(valor);
    const tabuadaContainer = document.getElementById("resultado-tabuada");
    let tabuadaHtml = `<strong>Tabuada do ${multiplicador}:</strong><br>`;
    for (let i = 1; i <= 10; i++) {
      tabuadaHtml += `${multiplicador} × ${i} = ${multiplicador * i}<br>`;
    }
    tabuadaContainer.innerHTML = tabuadaHtml;
  });
