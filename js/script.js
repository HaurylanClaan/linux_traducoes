const search = document.getElementById("search");
const gameGrid = document.getElementById("gameGrid");
const noResults = document.getElementById("noResults");
const pagination = document.getElementById("pagination");
const placeholderCapa = "img/jogos/cover-placeholder.svg";
const jogosPorPagina = 10;
let paginaAtual = 1;

function normalizarBusca(valor) {
    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR");
}

function texto(valor, fallback = "") {
    return typeof valor === "string" && valor.trim() ? valor : fallback;
}

function capaSegura(capa) {
    if (!capa) return placeholderCapa;

    try {
        const caminhoNormalizado = String(capa).trim().replace(/^\/+/, "");
        const url = new URL(caminhoNormalizado, window.location.href);

        return url.origin === window.location.origin &&
            /^\/(?:[^/]+\/)?img\/jogos\/[^/]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)
            ? url.href
            : placeholderCapa;
    } catch {
        return placeholderCapa;
    }
}

function adicionarTexto(pai, tag, valor, classe) {
    const elemento = document.createElement(tag);

    if (classe) elemento.className = classe;

    elemento.textContent = valor;
    pai.appendChild(elemento);

    return elemento;
}

function construirTags(jogo) {
    const tags = [];

    if (texto(jogo.idioma)) tags.push(`🇧🇷 ${jogo.idioma}`);
    if (jogo.steamDeck === true) tags.push("🎮 Steam Deck");
    if (texto(jogo.status)) tags.push(`✅ ${jogo.status}`);

    return tags;
}

function criarCard(jogo) {
    const card = document.createElement("article");
    card.className = "game-card";

    const nome = texto(jogo.nome, "Jogo sem nome");
    card.dataset.search = normalizarBusca([
        nome,
        texto(jogo.descricao),
        texto(jogo.idioma),
        texto(jogo.versao),
        texto(jogo.formato),
        texto(jogo.tamanho),
        texto(jogo.status),
        ...(Array.isArray(jogo.tags) ? jogo.tags.filter((tag) => typeof tag === "string") : [])
    ].join(" "));

    const imagem = document.createElement("img");
    imagem.className = "game-cover";
    imagem.src = capaSegura(texto(jogo.capa));
    imagem.alt = `Capa de ${nome}`;
    imagem.addEventListener("error", () => {
        imagem.src = placeholderCapa;
    }, { once: true });

    card.appendChild(imagem);

    const conteudo = document.createElement("div");
    conteudo.className = "game-content";

    adicionarTexto(conteudo, "p", texto(jogo.idioma, "Português-Brasil"), "game-label");
    adicionarTexto(conteudo, "h3", nome);
    adicionarTexto(conteudo, "p", texto(jogo.descricao, "Descrição em breve."), "game-description");

    const meta = document.createElement("div");
    meta.className = "meta-list";

    [
        `Versão: ${texto(jogo.versao, "1.0.0")}`,
        `Tamanho: ${texto(jogo.tamanho, "N/D")}`,
        `Formato: ${texto(jogo.formato, "AppImage")}`
    ].forEach((item) => adicionarTexto(meta, "span", item, "meta-item"));

    conteudo.appendChild(meta);

    const listaTags = document.createElement("div");
    listaTags.className = "tag-list";

    construirTags(jogo).forEach((tag) => {
        adicionarTexto(listaTags, "span", tag, "tag");
    });

    conteudo.appendChild(listaTags);

    const link = document.createElement("a");
    link.className = "download";
    link.href = `jogos/jogo.html?slug=${encodeURIComponent(texto(jogo.slug))}`;
    link.textContent = "Ver tradução";

    conteudo.appendChild(link);
    card.appendChild(conteudo);

    return card;
}

async function carregarJogos() {
    if (!gameGrid) return;

    try {
        const response = await fetch("./dados/jogos.json", {
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const jogos = await response.json();

        gameGrid.replaceChildren();

        if (!Array.isArray(jogos) || jogos.length === 0) {
            adicionarTexto(gameGrid, "p", "Nenhum jogo disponível no momento.", "empty-state");
            return;
        }

        jogos.forEach((jogo) => {
            if (jogo && typeof jogo === "object") {
                gameGrid.appendChild(criarCard(jogo));
            }
        });

        aplicarBusca();
    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        gameGrid.replaceChildren();

        adicionarTexto(
            gameGrid,
            "p",
            "Não foi possível carregar os jogos no momento. Tente novamente mais tarde.",
            "empty-state"
        );
    }
}

function aplicarBusca() {
    if (!search || !gameGrid) return;

    const consulta = normalizarBusca(search.value.trim());
    const cards = [...gameGrid.querySelectorAll(".game-card")];
    const filtrados = cards.filter((card) => card.dataset.search.includes(consulta));
    const totalPaginas = Math.ceil(filtrados.length / jogosPorPagina);

    if (totalPaginas > 0 && paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * jogosPorPagina;
    const visiveis = new Set(filtrados.slice(inicio, inicio + jogosPorPagina));

    cards.forEach((card) => {
        card.hidden = !visiveis.has(card);
    });

    if (noResults) noResults.hidden = filtrados.length > 0;
    renderizarPaginacao(totalPaginas);
}

function renderizarPaginacao(totalPaginas) {
    if (!pagination) return;

    pagination.replaceChildren();
    pagination.hidden = totalPaginas <= 1;

    for (let numero = 1; numero <= totalPaginas; numero += 1) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "page-button";
        botao.textContent = String(numero);
        botao.setAttribute("aria-label", `Página ${numero}`);

        if (numero === paginaAtual) {
            botao.classList.add("active");
            botao.setAttribute("aria-current", "page");
        }

        botao.addEventListener("click", () => {
            paginaAtual = numero;
            aplicarBusca();
        });

        pagination.appendChild(botao);
    }
}

if (search) {
    search.addEventListener("input", () => {
        paginaAtual = 1;
        aplicarBusca();
    });
}

carregarJogos();