let preguntas = [];
let indice = 0;
let puntos = 0;
let idiomaSeleccionado = "es";

window.onload = function () {
  cargarXML();
};

function cargarXML() {
  fetch("preguntas.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      preguntas = Array.from(xmlDoc.getElementsByTagName("question"));
      filtrarPreguntas();
      mostrarPregunta();
    })
    .catch(err => {
      console.error("Error al cargar el XML:", err);
    });
}

function filtrarPreguntas() {
  preguntas = preguntas.filter(q => q.getAttribute("lang") === idiomaSeleccionado);
  indice = 0;
  puntos = 0;
  document.getElementById("puntuacion").innerText = `Puntuación: ${puntos}`;
}

function mostrarPregunta() {
  if (indice >= preguntas.length) {
    document.getElementById("pregunta").innerText = idiomaSeleccionado === "es" ? "Test finalizado" : "Test finished";
    document.getElementById("respuestas").innerHTML = "";
    document.getElementById("btnSiguiente").disabled = true;
    return;
  }

  let q = preguntas[indice];
  let wording = q.getElementsByTagName("wording")[0].textContent;
  let choices = q.getElementsByTagName("choice");

  document.getElementById("pregunta").innerText = wording;

  let html = "";
  for (let i = 0; i < choices.length; i++) {
    let texto = choices[i].textContent;
    let correcto = choices[i].getAttribute("correct") === "yes";
    html += `<button onclick="verificarRespuesta(${correcto}, this)">${texto}</button><br><br>`;
  }
  document.getElementById("respuestas").innerHTML = html;
  document.getElementById("btnSiguiente").disabled = true;
}

function verificarRespuesta(correcto, boton) {
  const botones = document.querySelectorAll("#respuestas button");
  botones.forEach(b => b.disabled = true);

  if (correcto) {
    puntos++;
    boton.style.backgroundColor = "#27ae60"; // verde
  } else {
    boton.style.backgroundColor = "#c0392b"; // rojo
  }

  document.getElementById("puntuacion").innerText = `${idiomaSeleccionado === "es" ? "Puntuación" : "Score"}: ${puntos}`;
  document.getElementById("btnSiguiente").disabled = false;
}

function siguientePregunta() {
  indice++;
  mostrarPregunta();
}

function cambiarIdioma() {
  const select = document.getElementById("idioma");
  idiomaSeleccionado = select.value;
  cargarXML();
}
