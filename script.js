const display = document.getElementById("display");
const historicoContainer = document.getElementById("historico");
const toggleHistoryBtn = document.getElementById("toggleHistory");
const clearHistoryBtn = document.getElementById("clearHistory");
let currentInput = "";
let previousResult = "";
let historico = JSON.parse(localStorage.getItem("historicoCalculadora")) || [];

function atualizarDisplay() {
  display.textContent = currentInput || "0";
}

function salvarHistorico(expr, res) {
  historico.push({ expressao: expr, resultado: res });
  if (historico.length > 10) historico.shift();
  localStorage.setItem("historicoCalculadora", JSON.stringify(historico));
  atualizarHistorico();
}

function atualizarHistorico() {
  historicoContainer.innerHTML = "";
  historico
    .slice()
    .reverse()
    .forEach((item) => {
      const div = document.createElement("div");
      div.textContent = `${item.expressao} = ${item.resultado}`;
      div.classList.add("itemHistorico");
      div.addEventListener("click", () => {
        currentInput = item.resultado.toString();
        atualizarDisplay();
        esconderHistorico();
      });
      historicoContainer.appendChild(div);
    });
}

function limparHistorico() {
  historico = [];
  localStorage.removeItem("historicoCalculadora");
  atualizarHistorico();
}

function mostrarHistorico() {
  historicoContainer.classList.remove("oculto");
  clearHistoryBtn.classList.remove("oculto");
  toggleHistoryBtn.textContent = "Ocultar Histórico";
}

function esconderHistorico() {
  historicoContainer.classList.add("oculto");
  clearHistoryBtn.classList.add("oculto");
  toggleHistoryBtn.textContent = "Mostrar Histórico";
}

toggleHistoryBtn.addEventListener("click", () => {
  if (historicoContainer.classList.contains("oculto")) {
    mostrarHistorico();
  } else {
    esconderHistorico();
  }
});

clearHistoryBtn.addEventListener("click", limparHistorico);

function adicionarNumero(num) {
  if (num === "." && currentInput.includes(".")) return;
  currentInput += num;
  atualizarDisplay();
}

function adicionarOperador(op) {
  if (op === "%") {
    // Cálculo de porcentagem: transforma valor em decimal
    if (currentInput && !/[+\-*/.%]$/.test(currentInput)) {
      currentInput = `${currentInput}/100`;
      calcular(true);
      return;
    }
    return;
  }
  if (currentInput === "" && op === "√") {
    currentInput = "√";
    atualizarDisplay();
    return;
  }
  if (currentInput === "") {
    if (previousResult !== "") {
      currentInput = previousResult;
    } else {
      return;
    }
  }
  if (/[+\-*/.]$/.test(currentInput) && op !== "√") {
    currentInput = currentInput.slice(0, -1);
  }
  if (op === "√") {
    try {
      let valor = currentInput ? eval(currentInput) : Number(previousResult);
      if (valor < 0) {
        display.textContent = "Erro";
        currentInput = "";
        return;
      }
      let resultado = Math.sqrt(valor);
      salvarHistorico(`√(${valor})`, resultado);
      display.textContent = resultado;
      previousResult = resultado.toString();
      currentInput = "";
    } catch {
      display.textContent = "Erro";
      currentInput = "";
    }
    return;
  }
  currentInput += op;
  atualizarDisplay();
}

function calcular(ignoreSalvar = false) {
  try {
    let resultado = eval(currentInput);
    if (resultado === undefined) return;
    resultado =
      Math.round((resultado + Number.EPSILON) * 100000000) / 100000000;
    if (!ignoreSalvar) salvarHistorico(currentInput, resultado);
    display.textContent = resultado;
    previousResult = resultado.toString();
    currentInput = "";
  } catch {
    display.textContent = "Erro";
    currentInput = "";
  }
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  atualizarDisplay();
}

function limpar() {
  currentInput = "";
  previousResult = "";
  atualizarDisplay();
}

// Botões
document.querySelectorAll("button[data-num]").forEach((button) => {
  button.addEventListener("click", () =>
    adicionarNumero(button.getAttribute("data-num"))
  );
});

document.querySelectorAll("button.operador").forEach((button) => {
  if (button.id !== "equals" && button.id !== "sqrt") {
    button.addEventListener("click", () =>
      adicionarOperador(button.getAttribute("data-op"))
    );
  }
});

document.getElementById("equals").addEventListener("click", () => calcular());
document.getElementById("clear").addEventListener("click", limpar);
document.getElementById("backspace").addEventListener("click", backspace);
document
  .getElementById("sqrt")
  .addEventListener("click", () => adicionarOperador("√"));

window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    adicionarNumero(e.key);
  } else if (["+", "-", "*", "/", "%"].includes(e.key)) {
    adicionarOperador(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calcular();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key.toLowerCase() === "c") {
    limpar();
  }
});

atualizarDisplay();
atualizarHistorico();
document.getElementById("btnTabuada").addEventListener("click", function () {
  // Abra a página da tabuada no mesmo projeto
  window.location.href = "tabuada.html";
});
