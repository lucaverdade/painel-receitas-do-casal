let categorias = JSON.parse(localStorage.getItem('categorias')) || ["Massas", "Doces", "Café da manhã"];
let receitas = JSON.parse(localStorage.getItem('receitas')) || [];

const container = document.getElementById("receitas");
const buscaInput = document.getElementById("busca");
const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");
const modalIngredientes = document.getElementById("modalIngredientes");
const modalPreparo = document.getElementById("modalPreparo");
const modalImagem = document.getElementById("modalImagem");
const categoriaSelect = document.getElementById("categoria");
const filtrosCategorias = document.getElementById("filtrosCategorias");

buscaInput.addEventListener("input", () => renderizarReceitas());

function mostrarFormulario() {
  document.getElementById("form").classList.toggle("hidden");
}

function abrirModal(r) {
  modalImagem.src = r.imagem;
  modalTitulo.textContent = r.nome;
  modalIngredientes.innerHTML = r.ingredientes.map(item => `<li>${item}</li>`).join("");
  modalPreparo.textContent = r.preparo;
  modal.classList.remove("hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
}

function renderizarCategorias() {
  categoriaSelect.innerHTML = categorias.map(cat => `<option>${cat}</option>`).join("");
  filtrosCategorias.innerHTML = '<button onclick="filtrarCategoria(\'Todas\')">Todas</button>' +
    categorias.map(cat => `<button onclick="filtrarCategoria('${cat}')">${cat}</button>`).join("");
}

function renderizarReceitas(filtroCategoria = "Todas") {
  const termo = buscaInput.value.toLowerCase();
  container.innerHTML = "";
  receitas.filter(r => {
    return (filtroCategoria === "Todas" || r.categoria === filtroCategoria) && r.nome.toLowerCase().includes(termo);
  }).forEach((r) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${r.imagem}" alt="${r.nome}">
      <div class="p-2">
        <h2>${r.nome}</h2>
        <p>${r.categoria}</p>
      </div>`;
    card.onclick = () => abrirModal(r);
    container.appendChild(card);
  });
}

function filtrarCategoria(cat) {
  renderizarReceitas(cat);
}

function adicionarReceita(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const categoria = categoriaSelect.value;
  const ingredientes = document.getElementById("ingredientes").value.split("\n");
  const preparo = document.getElementById("preparo").value;
  const imagemInput = document.getElementById("imagemInput");

  const leitor = new FileReader();
  leitor.onload = function (e) {
    const novaReceita = { nome, categoria, ingredientes, preparo, imagem: e.target.result };
    receitas.push(novaReceita);
    localStorage.setItem('receitas', JSON.stringify(receitas));
    renderizarReceitas();
    document.getElementById("form").reset();
    document.getElementById("form").classList.add("hidden");
  };
  leitor.readAsDataURL(imagemInput.files[0]);
}

function adicionarCategoria() {
  const novaCat = document.getElementById("novaCategoria").value.trim();
  if (novaCat && !categorias.includes(novaCat)) {
    categorias.push(novaCat);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    renderizarCategorias();
    document.getElementById("novaCategoria").value = "";
  }
}

renderizarCategorias();
renderizarReceitas();
