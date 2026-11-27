/* =====================================================
   PARTE 1 - MENU DO CELULAR
   ===================================================== */

// Pega os elementos do HTML pelo "id" de cada um
var menuToggle = document.getElementById('menuToggle');   // botão ☰
var mainNav = document.getElementById('mainNav');         // menu com os links

// Função que ABRE o menu
function abrirMenu() {
  mainNav.classList.add('open');                          // a classe "open" faz o menu aparecer (veja o CSS)
  menuToggle.setAttribute('aria-expanded', 'true');       // avisa leitores de tela que o menu está aberto
  menuToggle.setAttribute('aria-label', 'Fechar menu');
  menuToggle.textContent = '×';                           // troca o ☰ por ×
}

// Função que FECHA o menu
function fecharMenu() {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menuToggle.textContent = '☰';
}

// Ao clicar no botão: se o menu está aberto, fecha; se está fechado, abre
function clicouNoBotaoMenu() {
  if (mainNav.classList.contains('open')) {
    fecharMenu();
  } else {
    abrirMenu();
  }
}

menuToggle.addEventListener('click', clicouNoBotaoMenu);


// Fecha o menu quando a pessoa clica em um dos links (útil no celular)
var linksDoMenu = mainNav.querySelectorAll('a');   // lista com todos os links do menu

for (var i = 0; i < linksDoMenu.length; i++) {
  linksDoMenu[i].addEventListener('click', fecharMenu);
}


/* =====================================================
   PARTE 2 - PESQUISA DAS NOTÍCIAS
   ===================================================== */

// Pega os elementos do HTML
var searchToggle = document.getElementById('searchToggle');   // botão da lupa
var searchBox = document.getElementById('searchBox');         // caixa de pesquisa
var searchInput = document.getElementById('searchInput');     // campo onde se digita
var closeSearch = document.getElementById('closeSearch');     // botão ×
var newsCards = document.querySelectorAll('.news-card');      // lista com os 6 cards de notícia
var noResults = document.getElementById('noResults');         // mensagem "nenhuma notícia encontrada"


// Clicou na lupa: se a pesquisa está escondida, mostra; se está aparecendo, esconde
function clicouNaLupa() {
  if (searchBox.hidden === true) {
    searchBox.hidden = false;                           // mostra a caixa
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();                                // já deixa o cursor no campo
  } else {
    searchBox.hidden = true;                            // esconde a caixa
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';                             // limpa o campo
    filtrarNoticias('');                                // mostra todas as notícias de novo
  }
}

// Clicou no ×: esconde a pesquisa, limpa o campo e mostra todas as notícias de novo
function clicouEmFechar() {
  searchBox.hidden = true;
  searchToggle.setAttribute('aria-expanded', 'false');
  searchInput.value = '';
  filtrarNoticias('');
}

// Digitou algo no campo: filtra as notícias com o texto digitado
function digitouNoCampo() {
  // Se uma matéria estiver aberta, volta para a lista de notícias para mostrar o resultado
  if (artigoView.hidden === false) {
    window.location.hash = '#ultimas';
  }
  filtrarNoticias(searchInput.value);
}

searchToggle.addEventListener('click', clicouNaLupa);
closeSearch.addEventListener('click', clicouEmFechar);
searchInput.addEventListener('input', digitouNoCampo);


// Função que mostra só as notícias que combinam com o texto pesquisado
function filtrarNoticias(textoPesquisado) {
  // trim() tira espaços do começo e do fim; toLowerCase() deixa tudo em letras minúsculas
  var termo = textoPesquisado.trim().toLowerCase();
  var quantidadeVisivel = 0;   // conta quantas notícias aparecem

  // Passa por cada notícia, uma de cada vez
  for (var i = 0; i < newsCards.length; i++) {
    var card = newsCards[i];

    // Junta o texto que aparece no card com as palavras extras do atributo data-search do HTML
    var textoDoCard = card.innerText + ' ' + card.dataset.search;
    textoDoCard = textoDoCard.toLowerCase();

    // includes() verifica se o texto do card contém o que foi digitado
    if (textoDoCard.includes(termo)) {
      card.hidden = false;           // combina: mostra o card
      quantidadeVisivel = quantidadeVisivel + 1;
    } else {
      card.hidden = true;            // não combina: esconde o card
    }
  }

  // Se nenhuma notícia apareceu, mostra a mensagem "nenhuma notícia encontrada"
  if (quantidadeVisivel === 0) {
    noResults.hidden = false;
  } else {
    noResults.hidden = true;
  }
}


/* =====================================================
   PARTE 3 - LEITURA DAS MATÉRIAS
   ===================================================== */

// Pega os elementos do HTML
var paginaInicial = document.getElementById('paginaInicial');   // banner, destaques e últimas notícias
var artigoView = document.getElementById('artigoView');         // área de leitura
var artigoCategoria = document.getElementById('artigoCategoria');
var artigoTitulo = document.getElementById('artigoTitulo');
var artigoSubtitulo = document.getElementById('artigoSubtitulo');
var artigoData = document.getElementById('artigoData');
var artigoImagem = document.getElementById('artigoImagem');
var artigoCorpo = document.getElementById('artigoCorpo');

var tituloDaPagina = document.title;   // guarda o título original da aba
var posicaoSalva = 0;                  // guarda até onde a página inicial estava rolada


// Mostra uma matéria na tela. O parâmetro "id" é o nome da matéria no noticias.js
function mostrarArtigo(id) {
  var noticia = noticias[id];

  // Se estiver saindo da página inicial, lembra a posição da rolagem para voltar no mesmo lugar
  if (paginaInicial.hidden === false) {
    posicaoSalva = window.scrollY;
  }

  // Preenche os campos com os dados da matéria
  artigoCategoria.textContent = noticia.categoria;
  artigoTitulo.textContent = noticia.titulo;
  artigoSubtitulo.textContent = noticia.subtitulo;
  artigoData.textContent = noticia.dataTexto;
  artigoData.setAttribute('datetime', noticia.data);
  artigoImagem.src = noticia.imagem;
  artigoImagem.alt = noticia.imagemAlt;

  // Monta o corpo do texto: limpa o que havia antes e cria um elemento para cada item da lista
  artigoCorpo.textContent = '';
  for (var i = 0; i < noticia.conteudo.length; i++) {
    var texto = noticia.conteudo[i];
    var elemento;

    if (texto.indexOf('## ') === 0) {
      // Texto que começa com "## " vira subtítulo
      elemento = document.createElement('h2');
      elemento.textContent = texto.substring(3);
    } else {
      // Os outros textos viram parágrafos
      elemento = document.createElement('p');
      elemento.textContent = texto;
    }

    artigoCorpo.appendChild(elemento);
  }

  // Esconde a página inicial e mostra a matéria
  paginaInicial.hidden = true;
  artigoView.hidden = false;
  document.title = noticia.titulo + ' | HeroVerse';

  // Vai para o topo da matéria ("instant" = sem a rolagem suave)
  window.scrollTo({ top: 0, behavior: 'instant' });
  artigoTitulo.focus({ preventScroll: true });   // ajuda leitores de tela a começar pelo título
}


// Mostra a página inicial. O parâmetro "hash" é o endereço atual (ex.: #ultimas)
function mostrarPaginaInicial(hash) {
  var estavaLendo = (artigoView.hidden === false);

  artigoView.hidden = true;
  paginaInicial.hidden = false;
  document.title = tituloDaPagina;

  // Só precisa ajustar a rolagem se o usuário estava lendo uma matéria
  if (estavaLendo) {
    var alvo = null;
    if (hash.length > 1) {
      alvo = document.getElementById(hash.substring(1));   // tira o # do começo
    }

    if (alvo) {
      alvo.scrollIntoView({ behavior: 'instant' });                  // vai até a seção do link (ex.: Notícias)
    } else {
      window.scrollTo({ top: posicaoSalva, behavior: 'instant' });   // volta para onde estava
    }
  }
}


// Decide o que mostrar de acordo com o endereço (hash) da página
function atualizarPagina() {
  var hash = window.location.hash;

  // "#noticia/".length é 9: o resto do endereço é o id da matéria
  if (hash.indexOf('#noticia/') === 0) {
    var id = hash.substring(9);

    if (noticias.hasOwnProperty(id)) {   // confere se existe uma matéria com esse id
      mostrarArtigo(id);
      return;
    }
  }

  // Qualquer outro endereço (ou matéria inexistente) mostra a página inicial
  mostrarPaginaInicial(hash);
}

window.addEventListener('hashchange', atualizarPagina);

// Executa uma vez ao abrir o site (para funcionar se alguém abrir o link de uma matéria direto)
atualizarPagina();


/* =====================================================
   PARTE 4 - FILTRO DE LANÇAMENTOS DO CINEMA
   ===================================================== */

var filtrosCinema = document.querySelectorAll('.cinema-filter');
var cardsDeFilmes = document.querySelectorAll('.movie-card');

// Mostra todos os filmes ou somente os do universo escolhido.
function filtrarCinema(universoEscolhido) {
  for (var i = 0; i < cardsDeFilmes.length; i++) {
    var universoDoCard = cardsDeFilmes[i].getAttribute('data-universo');

    if (universoEscolhido === 'todos' || universoDoCard === universoEscolhido) {
      cardsDeFilmes[i].hidden = false;
    } else {
      cardsDeFilmes[i].hidden = true;
    }
  }
}

for (var i = 0; i < filtrosCinema.length; i++) {
  filtrosCinema[i].addEventListener('click', function () {
    var universoEscolhido = this.getAttribute('data-universo');
    filtrarCinema(universoEscolhido);

    // Destaca o filtro que está selecionado.
    for (var j = 0; j < filtrosCinema.length; j++) {
      filtrosCinema[j].classList.remove('active');
    }
    this.classList.add('active');
  });
}


/* =====================================================
   PARTE 5 - QUIZ MARVEL E DC
   O quiz tem cinco perguntas e quatro alternativas.
   ===================================================== */

var quizPerguntas = [
  {
    pergunta: 'Qual é a identidade secreta do Superman?',
    alternativas: ['Bruce Wayne', 'Clark Kent', 'Barry Allen', 'Hal Jordan'],
    correta: 1,
    explicacao: 'Clark Kent é a identidade que Superman usa para viver entre os humanos.'
  },
  {
    pergunta: 'Qual cidade é protegida pelo Batman?',
    alternativas: ['Metrópolis', 'Central City', 'Gotham City', 'Star City'],
    correta: 2,
    explicacao: 'Gotham City é a cidade associada ao Batman e à maior parte de suas histórias.'
  },
  {
    pergunta: 'De qual material é feito o escudo mais conhecido do Capitão América?',
    alternativas: ['Adamantium', 'Vibranium', 'Kryptonita', 'Uru'],
    correta: 1,
    explicacao: 'O escudo clássico de Steve Rogers é feito de vibranium, um metal fictício de Wakanda.'
  },
  {
    pergunta: 'Qual destes personagens é conhecido como o Pantera Negra?',
    alternativas: ['T’Challa', 'Scott Lang', 'Stephen Strange', 'Sam Wilson'],
    correta: 0,
    explicacao: 'T’Challa é o rei de Wakanda e um dos personagens que assume o manto do Pantera Negra.'
  },
  {
    pergunta: 'Qual equipe reúne Superman, Batman e Mulher-Maravilha?',
    alternativas: ['Vingadores', 'Guardiões da Galáxia', 'Liga da Justiça', 'Quarteto Fantástico'],
    correta: 2,
    explicacao: 'Superman, Batman e Mulher-Maravilha são alguns dos integrantes mais conhecidos da Liga da Justiça.'
  }
];

var quizModal = document.getElementById('quizModal');
var quizOverlay = document.getElementById('quizOverlay');
var abrirQuiz = document.getElementById('abrirQuiz');
var abrirQuizMenu = document.getElementById('abrirQuizMenu');
var fecharQuizBotao = document.getElementById('fecharQuiz');
var quizPergunta = document.getElementById('quizPergunta');
var quizAlternativas = document.getElementById('quizAlternativas');
var quizProgressoTexto = document.getElementById('quizProgressoTexto');
var quizBarraProgresso = document.getElementById('quizBarraProgresso');
var quizFeedback = document.getElementById('quizFeedback');
var confirmarResposta = document.getElementById('confirmarResposta');
var proximaPergunta = document.getElementById('proximaPergunta');
var jogarNovamente = document.getElementById('jogarNovamente');

var perguntaAtual = 0;
var pontuacao = 0;
var respostaSelecionada = -1;
var respostaJaConferida = false;
var elementoQueAbriuQuiz = null;

// Prepara uma nova rodada e mostra a primeira pergunta.
function iniciarQuiz() {
  perguntaAtual = 0;
  pontuacao = 0;
  respostaSelecionada = -1;
  respostaJaConferida = false;
  mostrarPergunta();
}

// Mostra a pergunta atual e cria os quatro botões de alternativa.
function mostrarPergunta() {
  var dados = quizPerguntas[perguntaAtual];
  quizPergunta.textContent = dados.pergunta;
  quizProgressoTexto.textContent = 'Questão ' + (perguntaAtual + 1) + ' de ' + quizPerguntas.length;
  quizBarraProgresso.style.width = ((perguntaAtual + 1) / quizPerguntas.length * 100) + '%';

  quizAlternativas.textContent = '';
  quizFeedback.hidden = true;
  confirmarResposta.hidden = false;
  confirmarResposta.disabled = true;
  proximaPergunta.hidden = true;
  jogarNovamente.hidden = true;
  respostaSelecionada = -1;
  respostaJaConferida = false;

  for (var i = 0; i < dados.alternativas.length; i++) {
    var alternativa = document.createElement('button');
    alternativa.type = 'button';
    alternativa.className = 'quiz-option';
    alternativa.setAttribute('data-resposta', i);

    var letra = document.createElement('span');
    letra.className = 'quiz-option-letter';
    letra.textContent = String.fromCharCode(65 + i);

    var texto = document.createElement('span');
    texto.textContent = dados.alternativas[i];

    alternativa.appendChild(letra);
    alternativa.appendChild(texto);

    alternativa.addEventListener('click', selecionarAlternativa);
    quizAlternativas.appendChild(alternativa);
  }
}

// Guarda a alternativa escolhida e mostra o destaque visual.
function selecionarAlternativa() {
  if (respostaJaConferida) {
    return;
  }

  var alternativasNaTela = quizAlternativas.querySelectorAll('.quiz-option');
  respostaSelecionada = Number(this.getAttribute('data-resposta'));

  for (var i = 0; i < alternativasNaTela.length; i++) {
    alternativasNaTela[i].classList.remove('selected');
  }

  this.classList.add('selected');
  confirmarResposta.disabled = false;
}

// Confere a resposta e mostra uma explicação.
function conferirResposta() {
  if (respostaSelecionada === -1 || respostaJaConferida) {
    return;
  }

  var dados = quizPerguntas[perguntaAtual];
  var alternativasNaTela = quizAlternativas.querySelectorAll('.quiz-option');
  var acertou = (respostaSelecionada === dados.correta);

  if (acertou) {
    pontuacao = pontuacao + 1;
    quizFeedback.textContent = 'Correto! ' + dados.explicacao;
  } else {
    quizFeedback.textContent = 'Não foi dessa vez. ' + dados.explicacao;
  }

  quizFeedback.hidden = false;

  // Mostra a resposta certa e, se necessário, destaca a escolha errada.
  for (var i = 0; i < alternativasNaTela.length; i++) {
    alternativasNaTela[i].disabled = true;

    if (i === dados.correta) {
      alternativasNaTela[i].classList.add('correct');
    }

    if (i === respostaSelecionada && !acertou) {
      alternativasNaTela[i].classList.add('incorrect');
    }
  }

  respostaJaConferida = true;
  confirmarResposta.hidden = true;
  proximaPergunta.hidden = false;
  confirmarResposta.disabled = true;

  if (perguntaAtual === quizPerguntas.length - 1) {
    proximaPergunta.textContent = 'Ver resultado';
  } else {
    proximaPergunta.textContent = 'Próxima pergunta';
  }
}

// Mostra o resultado depois da quinta pergunta.
function mostrarResultadoQuiz() {
  quizProgressoTexto.textContent = 'Resultado final';
  quizBarraProgresso.style.width = '100%';
  quizPergunta.textContent = 'Você acertou ' + pontuacao + ' de ' + quizPerguntas.length + ' perguntas!';
  quizAlternativas.textContent = '';
  quizFeedback.hidden = false;

  if (pontuacao <= 1) {
    quizFeedback.textContent = 'Recruta em treinamento! Continue explorando os universos e tente novamente.';
  } else if (pontuacao <= 3) {
    quizFeedback.textContent = 'Herói em ascensão! Você conhece bastante coisa, mas ainda há histórias para descobrir.';
  } else if (pontuacao === 4) {
    quizFeedback.textContent = 'Super-herói de elite! Quase gabaritou o desafio.';
  } else {
    quizFeedback.textContent = 'Lenda dos universos! Você conhece Marvel e DC como poucos.';
  }

  confirmarResposta.hidden = true;
  proximaPergunta.hidden = true;
  jogarNovamente.hidden = false;
}

// Avança para a próxima pergunta ou abre o resultado final.
function avancarQuiz() {
  if (perguntaAtual === quizPerguntas.length - 1) {
    mostrarResultadoQuiz();
  } else {
    perguntaAtual = perguntaAtual + 1;
    mostrarPergunta();
  }
}

// Abre o modal e impede a interação com o conteúdo que fica atrás dele.
function abrirJanelaQuiz() {
  elementoQueAbriuQuiz = document.activeElement;
  quizModal.hidden = false;
  document.body.style.overflow = 'hidden';

  document.querySelector('.site-header').inert = true;
  document.querySelector('main').inert = true;
  document.querySelector('.site-footer').inert = true;

  fecharMenu();
  iniciarQuiz();
  fecharQuizBotao.focus();
}

// Fecha o modal e devolve o foco ao botão que abriu o quiz.
function fecharJanelaQuiz() {
  quizModal.hidden = true;
  document.body.style.overflow = '';

  document.querySelector('.site-header').inert = false;
  document.querySelector('main').inert = false;
  document.querySelector('.site-footer').inert = false;

  if (elementoQueAbriuQuiz) {
    elementoQueAbriuQuiz.focus();
  }
}

abrirQuiz.addEventListener('click', abrirJanelaQuiz);
abrirQuizMenu.addEventListener('click', abrirJanelaQuiz);
fecharQuizBotao.addEventListener('click', fecharJanelaQuiz);
quizOverlay.addEventListener('click', fecharJanelaQuiz);
confirmarResposta.addEventListener('click', conferirResposta);
proximaPergunta.addEventListener('click', avancarQuiz);
jogarNovamente.addEventListener('click', iniciarQuiz);

// A tecla ESC também fecha o quiz.
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && quizModal.hidden === false) {
    fecharJanelaQuiz();
  }
});


/* =====================================================
   PARTE 6 - ANIMAÇÕES AO ROLAR A PÁGINA
   ===================================================== */

// Observa os blocos e revela cada um quando aparece na tela.
var elementosParaAnimar = document.querySelectorAll(
  '.hero-content, .featured, .latest, .feature-card, .news-card, .cinema-section, .movie-card, .cinema-info-card, .quiz-callout, .site-footer'
);

if ('IntersectionObserver' in window) {
  var observadorDeEntrada = new IntersectionObserver(function (entradas, observador) {
    for (var i = 0; i < entradas.length; i++) {
      if (entradas[i].isIntersecting) {
        entradas[i].target.classList.add('visible');
        observador.unobserve(entradas[i].target);
      }
    }
  }, { threshold: 0.12 });

  for (var i = 0; i < elementosParaAnimar.length; i++) {
    elementosParaAnimar[i].classList.add('reveal-item');
    observadorDeEntrada.observe(elementosParaAnimar[i]);
  }
} else {
  // Navegadores antigos mostram o conteúdo sem animação de rolagem.
  for (var i = 0; i < elementosParaAnimar.length; i++) {
    elementosParaAnimar[i].classList.add('visible');
  }
}
