const search = document.getElementById("search");
const gameGrid = document.getElementById("gameGrid");

function construirTags(jogo) {
    const tags = [];

    if (jogo.idioma) tags.push(`🇧🇷 ${jogo.idioma}`);
    if (jogo.linux) tags.push("🐧 Linux");
    if (jogo.steamDeck) tags.push("🎮 Steam Deck");
    if (jogo.formato) tags.push(`📦 ${jogo.formato}`);
    if (jogo.status) tags.push(`✅ ${jogo.status}`);

    return tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");
}

function criarCard(jogo) {
    const card = document.createElement("article");
    card.className = "game-card";
    card.dataset.name = (jogo.nome || "").toLowerCase();

    const capa = jogo.capa || "img/jogos/cover-placeholder.svg";
    const linkDownload = jogo.download || "#";

    card.innerHTML = `
        <img
            class="game-cover"
            src="${capa}"
            alt="Capa de ${jogo.nome || "jogo"}"
            onerror="this.onerror=null;this.src='img/jogos/cover-placeholder.svg';"
        >

        <div class="game-content">
            <p class="game-label">${jogo.idioma || "Português-Brasil"}</p>
            <h3>${jogo.nome || "Jogo sem nome"}</h3>
            <p class="game-description">${jogo.descricao || "Descrição em breve."}</p>

            <div class="meta-list">
                <span class="meta-item">Versão: ${jogo.versao || "1.0.0"}</span>
                <span class="meta-item">Tamanho: ${jogo.tamanho || "N/D"}</span>
                <span class="meta-item">Formato: ${jogo.formato || "AppImage"}</span>
            </div>

            <div class="tag-list">${construirTags(jogo)}</div>

            <a
                class="download"
                href="${linkDownload}"
                target="_blank"
                rel="noopener noreferrer"
            >
                ⬇ Baixar tradução
            </a>
        </div>
    `;

    return card;
}

async function carregarJogos() {
    if (!gameGrid) return;

    try {
        const response = await fetch("./dados/jogos.json");

        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const jogos = await response.json();

        if (!Array.isArray(jogos) || jogos.length === 0) {
            gameGrid.innerHTML = "<p class='empty-state'>Nenhum jogo disponível no momento.</p>";
            return;
        }

        gameGrid.innerHTML = "";
        jogos.forEach((jogo) => gameGrid.appendChild(criarCard(jogo)));
    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        gameGrid.innerHTML = "<p class='empty-state'>Não foi possível carregar os jogos no momento. Tente novamente mais tarde.</p>";
    }
}

if (search) {
    search.addEventListener("input", function () {
        const texto = search.value.toLowerCase();
        const cards = document.querySelectorAll(".game-card");

        cards.forEach(function (card) {
            const nome = card.dataset.name || "";
            const corresponde = nome.includes(texto);
            card.style.display = corresponde ? "" : "none";
        });
    });
}

carregarJogos();
