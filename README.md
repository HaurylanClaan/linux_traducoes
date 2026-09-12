# Linux Traduções

> Porte e adaptação de traduções de jogos de PC para Linux.

O **Linux Traduções** é um projeto criado para facilitar o uso de traduções de jogos no ambiente Linux. A proposta é organizar informações, créditos e pacotes de tradução em um catálogo simples.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-69d38a?style=flat-square)
![Plataforma](https://img.shields.io/badge/plataforma-Linux-69d38a?style=flat-square)

## Sobre o projeto

Muitas traduções de jogos foram originalmente desenvolvidas para outras plataformas ou dependem de procedimentos específicos para funcionar no Linux. Este projeto busca tornar esse processo mais claro, organizado e acessível para a comunidade.

O site é estático e apresenta as traduções disponíveis, seus requisitos, versões, compatibilidade, créditos e instruções relacionadas ao porte.

## O que este projeto faz

- Organiza informações sobre traduções de jogos de PC.
- Realiza o porte e a adaptação de traduções existentes do windons para o Linux.
- Facilita a consulta de versões, compatibilidade e instruções.
- Pode disponibilizar pacotes em formatos adequados ao Linux, como AppImage, quando aplicável.

As traduções originais são feitas por seus respectivos tradutores, autores e equipes. A Linux Traduções realiza apenas o porte/adaptação para Linux e não reivindica autoria sobre essas traduções.

## Créditos

Os créditos das traduções originais pertencem integralmente aos seus respectivos tradutores, autores e equipes.

A Linux Traduções realiza apenas o porte/adaptação para Linux e não reivindica autoria sobre as traduções originais.

## Aviso sobre os jogos

- Este projeto **não distribui jogos completos**.
- Os jogos pertencem aos seus respectivos proprietários e detentores de direitos.
- O projeto trata apenas de arquivos relacionados às traduções e ao porte para Linux, conforme permitido.
- Nenhum conteúdo de terceiros deve ser redistribuído sem autorização, licença ou permissão adequada.

## Estrutura do projeto

```text
linux_traducoes/
├── index.html          # Página inicial e catálogo
├── css/                # Folhas de estilo
├── js/                 # Scripts do catálogo e das páginas de jogos
├── dados/              # Dados das traduções em JSON
├── img/                # Logo, capas e outros recursos visuais
├── jogos/              # Página dinâmica de detalhes dos jogos
├── README.md
└── LICENSE
```

As informações dos jogos ficam em `dados/jogos.json`. A página inicial e `jogos/jogo.html` leem esse arquivo para evitar duplicação de dados.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- JSON
- GitHub Pages
- GitHub Releases para pacotes

Não há backend, banco de dados ou frameworks externos. A estrutura foi pensada para ser simples, rápida e fácil de manter. <!-- sou pobre -->

## Contribuição

Contribuições são bem-vindas, especialmente para:

- testes em diferentes distribuições Linux;
- testes no Steam Deck;
- correções de compatibilidade;
- melhorias na documentação;
- revisão de informações sobre traduções;
- confirmação de créditos, licenças e permissões.

<!-- me ajudaaa so quero facilitar os jogos para o linux -->
 
Ao contribuir, preserve os créditos dos autores originais e não envie jogos completos ou arquivos proprietários sem autorização.

## Licença

O código deste projeto é distribuído sob a licença definida em [LICENSE](LICENSE).

Essa licença se aplica ao projeto Linux Traduções e não transfere direitos sobre jogos, traduções de terceiros ou qualquer outro conteúdo que pertença a seus respectivos autores e proprietários.

## Créditos e agradecimentos

Agradecimentos aos tradutores, autores e equipes que criaram as traduções originais e tornaram possível o trabalho de porte para Linux.

Os créditos específicos de cada tradução devem ser consultados na respectiva página e documentação. Todo reconhecimento pela tradução original pertence aos seus criadores.
