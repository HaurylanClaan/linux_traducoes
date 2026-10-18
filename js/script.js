const search = document.getElementById("search");
const gameGrid = document.getElementById("gameGrid");
const placeholderCapa = "img/jogos/cover-placeholder.svg";

function texto(valor, fallback = "") {
    return typeof valor === "string" && valor.trim() ? valor : fallback;
}

function capaSegura(capa) {
    if (!capa) return placeholderCapa;

    try {
        const url = new URL(capa, window.location.href);

        return url.origin === window.location.origin &&
            /^\/(?:[^/]+\/)?img\/jogos\/[\w.-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)
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
    if (jogo.linux === true) tags.push("🐧 Linux");
    if (jogo.steamDeck === true) tags.push("🎮 Steam Deck");
    if (texto(jogo.formato)) tags.push(`📦 ${jogo.formato}`);
    if (texto(jogo.status)) tags.push(`✅ ${jogo.status}`);

    return tags;
}

function criarCard(jogo) {
    const card = document.createElement("article");
    card.className = "game-card";

    const nome = texto(jogo.nome, "Jogo sem nome");
    card.dataset.name = nome.toLocaleLowerCase("pt-BR");

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

if (search) {
    search.addEventListener("input", () => {
        const consulta = search.value.toLocaleLowerCase("pt-BR");

        document.querySelectorAll(".game-card").forEach((card) => {
            card.hidden = !card.dataset.name.includes(consulta);
        });
    });
}

carregarJogos();