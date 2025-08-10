const participantes = [];

function mezclarFisherYates(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function agregarParticipante() {
  const nombreInput = document.getElementById("nombre");
  const nombre = (nombreInput.value || "").trim();

  if (nombre === "") {
    alert("Escribe un nombre.");
    return;
  }

  const existe = participantes.some(p => p.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    alert("Ese participante ya está en la lista.");
    nombreInput.value = "";
    nombreInput.focus();
    return;
  }

  participantes.push(nombre);
  nombreInput.value = "";
  nombreInput.focus();
  actualizarLista();
  limpiarResultado();
}

function eliminarParticipante(index) {
  participantes.splice(index, 1);
  actualizarLista();
  limpiarResultado();
}

function actualizarLista() {
  const lista = document.getElementById("listaParticipantes");
  lista.innerHTML = "";

  participantes.forEach((nombre, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "item-nombre";
    span.textContent = nombre;

    const btn = document.createElement("button");
    btn.className = "btn btn-eliminar";
    btn.textContent = "Eliminar";
    btn.addEventListener("click", () => eliminarParticipante(index));

    li.appendChild(span);
    li.appendChild(btn);
    lista.appendChild(li);
  });
}

function sortearAmigoSecreto() {
  if (participantes.length < 2) {
    alert("Necesitas al menos 2 participantes.");
    return;
  }

  const receptores = [...participantes];
  mezclarFisherYates(receptores);

  for (let i = 0; i < participantes.length; i++) {
    if (participantes[i] === receptores[i]) {
      const j = (i + 1) % participantes.length;
      [receptores[i], receptores[j]] = [receptores[j], receptores[i]];
    }
  }

  const conflicto = participantes.some((p, i) => p === receptores[i]);
  if (conflicto) {
    mezclarFisherYates(receptores);
    for (let i = 0; i < participantes.length; i++) {
      if (participantes[i] === receptores[i]) {
        const j = (i + 1) % participantes.length;
        [receptores[i], receptores[j]] = [receptores[j], receptores[i]];
      }
    }
  }

  const emparejamientos = {};
  participantes.forEach((p, i) => (emparejamientos[p] = receptores[i]));
  mostrarResultado(emparejamientos);
}

function mostrarResultado(parejas) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "<h3>Resultados:</h3>";

  Object.entries(parejas).forEach(([dador, receptor]) => {
    const fila = document.createElement("div");
    fila.textContent = `${dador} → 🎁 ${receptor}`;
    resultadoDiv.appendChild(fila);
  });
}

function limpiarResultado() {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombre");
  const btnAgregar = document.getElementById("btnAgregar");
  const btnSortear = document.getElementById("btnSortear");

  btnAgregar.addEventListener("click", agregarParticipante);
  btnSortear.addEventListener("click", sortearAmigoSecreto);

  nombreInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") agregarParticipante();
  });
});
