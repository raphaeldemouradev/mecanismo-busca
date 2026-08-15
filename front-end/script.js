import { bancoDeDados } from "../back-end/banco.js";

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
// Teste inicial para verificar se o arquivo script.js foi carregado no navegador
console.log("Script carregado com sucesso!");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  console.log("Termo digitado:", query)
  if (!query) return;

  await executarBusca(query);
});

async function executarBusca(query) {
  const termoNormalizado = normalizarTexto(query);
  const inicio = performance.now();

  // Exibe mensagem visual de carregamento enquanto faz a requisição
  resultsList.innerHTML = `<p style="color: #5f6368;">Buscando na Wikipedia...</p>`;
  try {

    // Chamamos o bancoDeDados passando o termo e aguardando o retorno da Wikipedia
    console.log("Iniciando requisição para o banco.js...");
    const resultados = await bancoDeDados(query);
    console.log("Resultados retornados do banco.js:", resultados);

    const fim = performance.now();
    const tempoExecucao = (fim - inicio).toFixed(2);

    renderizarResultados(resultados, query, tempoExecucao);
  } catch (error) {
    console.error("Erro capturado durante a busca:", erro);
    resultsList.innerHTML = `<p style="color: #d93025;">Ocorreu um erro ao buscar os dados.</p>`;
  }
/* // LOCAL BUSCA //
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
*/
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