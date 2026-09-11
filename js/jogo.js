const gamePage = document.getElementById("gamePage");
const placeholderCapa = "../img/jogos/cover-placeholder.svg";

function texto(valor, fallback = "Não informado") {
    return typeof valor === "string" && valor.trim() ? valor : fallback;
}

function capaSegura(capa) {
    if (!capa) return placeholderCapa;

    try {
        const url = new URL(`../${capa}`, window.location.href);

        return url.origin === window.location.origin &&
            /^\/(?:[^/]+\/)?img\/jogos\/[\w.-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)
            ? url.href
            : placeholderCapa;
    } catch {
        return placeholderCapa;
    }
}

function downloadSeguro(download) {
    try {
        const url = new URL(download);

        return url.protocol === "https:" && url.hostname === "github.com"
            ? url.href
            : "#";
    } catch {
        return "#";
    }
}

function adicionarTexto(pai, tag, valor, classe) {
    const elemento = document.createElement(tag);

    if (classe) elemento.className = classe;

    elemento.textContent = valor;
    pai.appendChild(elemento);

    return elemento;
}

function adicionarInformacao(lista, label, valor) {
    const item = document.createElement("div");
    item.className = "detail-item";

    adicionarTexto(item, "dt", label);
    adicionarTexto(item, "dd", texto(valor));

    lista.appendChild(item);
}

function renderizarErro(mensagem) {
    gamePage.replaceChildren();

    const secao = document.createElement("section");
    secao.className = "message-panel";

    adicionarTexto(secao, "h1", mensagem);
    adicionarTexto(secao, "p", "Confira o endereço ou escolha outra tradução no catálogo.");

    const voltar = document.createElement("a");
    voltar.className = "back-link";
    voltar.href = "../index.html";
    voltar.textContent = "← Voltar para traduções";

    secao.appendChild(voltar);
    gamePage.appendChild(secao);
}

function renderizarJogo(jogo) {
    gamePage.replaceChildren();

    const nome = texto(jogo.nome, "Jogo sem nome");

    const voltar = document.createElement("a");
    voltar.className = "back-link";
    voltar.href = "../index.html#jogos";
    voltar.textContent = "← Voltar para traduções";

    gamePage.appendChild(voltar);

    const artigo = document.createElement("article");
    artigo.className = "game-detail";

    const imagem = document.createElement("img");
    imagem.className = "game-detail-cover";
    imagem.src = capaSegura(texto(jogo.capa, ""));
    imagem.alt = `Capa de ${nome}`;
    imagem.addEventListener("error", () => {
        imagem.src = placeholderCapa;
    }, { once: true });

    artigo.appendChild(imagem);

    const conteudo = document.createElement("div");
    conteudo.className = "game-detail-content";

    adicionarTexto(conteudo, "p", texto(jogo.idioma, "Português-Brasil"), "game-label");
    adicionarTexto(conteudo, "h1", nome);
    adicionarTexto(conteudo, "p", texto(jogo.descricao, "Descrição em breve."), "game-description");

    const detalhes = document.createElement("dl");
    detalhes.className = "details-list";

    [
        ["Idioma", jogo.idioma],
        ["Versão", jogo.versao],
        ["Tamanho", jogo.tamanho],
        ["Formato", jogo.formato],
        ["Linux", jogo.linux === true ? "Compatível" : "Não informado"],
        ["Steam Deck", jogo.steamDeck === true ? "Compatível" : "Não informado"],
        ["Atualização", jogo.dataAtualizacao],
        ["Status", jogo.status]
    ].forEach(([label, valor]) => {
        adicionarInformacao(detalhes, label, valor);
    });

    conteudo.appendChild(detalhes);

    const info = document.createElement("section");
    info.className = "translation-info";

    adicionarTexto(info, "h2", "Informações da tradução");
    adicionarTexto(info, "p", texto(jogo.informacoes, "Informações em breve."));

    conteudo.appendChild(info);

    const download = document.createElement("a");
    download.className = "download detail-download";
    download.href = downloadSeguro(texto(jogo.download, ""));
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.textContent = "Baixar AppImage";

    if (download.href.endsWith("#")) {
        download.setAttribute("aria-disabled", "true");
    }

    conteudo.appendChild(download);
    artigo.appendChild(conteudo);
    gamePage.appendChild(artigo);

    document.title = `${nome} | Linux Traduções`;
}

async function carregarJogo() {
    const slug = new URLSearchParams(window.location.search).get("slug");

    if (!slug) {
        renderizarErro("Tradução não encontrada");
        return;
    }

    try {
        const response = await fetch("../dados/jogos.json", {
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const jogos = await response.json();
        const jogo = Array.isArray(jogos) &&
            jogos.find((item) => item && item.slug === slug);

        if (!jogo) {
            renderizarErro("Tradução não encontrada");
            return;
        }

        renderizarJogo(jogo);
    } catch (error) {
        console.error("Erro ao carregar a tradução:", error);
        renderizarErro("Não foi possível carregar a tradução");
    }
}

carregarJogo();