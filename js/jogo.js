const gamePage = document.getElementById("gamePage");
const placeholderCapa = "../img/jogos/cover-placeholder.svg";

function valorTexto(valor, fallback = "Não informado") {
    return valor || fallback;
}

function criarInformacao(label, valor) {
    return `
        <div class="detail-item">
            <dt>${label}</dt>
            <dd>${valorTexto(valor)}</dd>
        </div>
    `;
}

function renderizarErro(mensagem) {
    gamePage.innerHTML = `
        <section class="message-panel">
            <h1>${mensagem}</h1>
            <p>Confira o endereço ou escolha outra tradução no catálogo.</p>
            <a class="back-link" href="../index.html">← Voltar para traduções</a>
        </section>
    `;
}

function renderizarJogo(jogo) {
    const capa = jogo.capa ? `../${jogo.capa}` : placeholderCapa;
    const download = jogo.download || "#";
    const compatibilidadeLinux = jogo.linux ? "Compatível" : "Não informado";
    const compatibilidadeSteamDeck = jogo.steamDeck ? "Compatível" : "Não informado";

    gamePage.innerHTML = `
        <a class="back-link" href="../index.html#jogos">← Voltar para traduções</a>

        <article class="game-detail">
            <img
                class="game-detail-cover"
                src="${capa}"
                alt="Capa de ${valorTexto(jogo.nome, "jogo")}" 
                onerror="this.onerror=null;this.src='${placeholderCapa}';"
            >

            <div class="game-detail-content">
                <p class="game-label">${valorTexto(jogo.idioma, "Português-Brasil")}</p>
                <h1>${valorTexto(jogo.nome, "Jogo sem nome")}</h1>
                <p class="game-description">${valorTexto(jogo.descricao, "Descrição em breve.")}</p>

                <dl class="details-list">
                    ${criarInformacao("Idioma", jogo.idioma)}
                    ${criarInformacao("Versão", jogo.versao)}
                    ${criarInformacao("Tamanho", jogo.tamanho)}
                    ${criarInformacao("Formato", jogo.formato)}
                    ${criarInformacao("Linux", compatibilidadeLinux)}
                    ${criarInformacao("Steam Deck", compatibilidadeSteamDeck)}
                    ${criarInformacao("Atualização", jogo.dataAtualizacao)}
                    ${criarInformacao("Status", jogo.status)}
                </dl>

                <section class="translation-info">
                    <h2>Informações da tradução</h2>
                    <p>${valorTexto(jogo.informacoes, "Informações em breve.")}</p>
                </section>

                <a
                    class="download detail-download"
                    href="${download}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Baixar AppImage
                </a>
            </div>
        </article>
    `;

    document.title = `${valorTexto(jogo.nome, "Tradução")} | Linux Traduções`;
}

async function carregarJogo() {
    const slug = new URLSearchParams(window.location.search).get("slug");

    if (!slug) {
        renderizarErro("Tradução não encontrada");
        return;
    }

    try {
        const response = await fetch("../dados/jogos.json");

        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const jogos = await response.json();
        const jogo = jogos.find((item) => item.slug === slug);

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