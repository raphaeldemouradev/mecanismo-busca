// Banco de dados nativo (Simulação dos documentos)
const bancoDeDados = [
  { id: 1, titulo: "Introdução à Inteligência Artificial", conteudo: "A inteligência artificial transforma a forma como criamos sistemas de busca e processamos dados." },
  { id: 2, titulo: "Como funciona um Mecanismo de Busca", conteudo: "Um mecanismo de busca utiliza rastreamento, índice invertido e algoritmos de ranking para entregar resultados." },
  { id: 3, titulo: "Desenvolvimento Front-end com CSS", conteudo: "O CSS é fundamental para estilizar páginas e criar interfaces de usuário modernas e responsivas." }
];

// Pipeline de Normalização (Passo 1 do nosso motor)
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s]/gi, "");     // Remove pontuações
}

// Manipulação do DOM
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsList = document.getElementById("results-list");
const resultsMeta = document.getElementById("results-meta");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  executarBusca(query);
});

function executarBusca(query) {
  const termoNormalizado = normalizarTexto(query);
  const inicio = performance.now();

  // Busca simples por correspondência de termos no banco nativo
  // Requisição
  const resultados = bancoDeDados.filter(doc => {
    const tituloNorm = normalizarTexto(doc.titulo);
    const conteudoNorm = normalizarTexto(doc.conteudo);
    return tituloNorm.includes(termoNormalizado) || conteudoNorm.includes(termoNormalizado);
  });

  const fim = performance.now();
  const tempoExecucao = (fim - inicio).toFixed(2);

  renderizarResultados(resultados, query, tempoExecucao);
}

function renderizarResultados(resultados, query, tempo) {
  resultsList.innerHTML = "";
  resultsMeta.textContent = `Aproximadamente ${resultados.length} resultado(s) (${tempo} ms) para "${query}"`;

  if (resultados.length === 0) {
    resultsList.innerHTML = `<p style="color: #5f6368;">Nenhum resultado encontrado.</p>`;
    return;
  }

  resultados.forEach(doc => {
    const item = document.createElement("article");
    item.className = "result-item";
    item.innerHTML = `
      <a href="#" class="result-title">${doc.titulo}</a>
      <p class="result-snippet">${doc.conteudo}</p>
      <span class="result-score">Doc ID: ${doc.id}</span>
    `;
    resultsList.appendChild(item);
  });
}