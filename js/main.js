// Estrutura de Dados das Perguntas
const perguntas = [
    {
        id: 'tamanho',
        pergunta: 'Escolha o tamanho do seu bolo:',
        imagem: 'assets/batizado.jpg',
        tipo: 'radio',
        opcoes: [
            { label: 'Pequeno (P) - 8-10 fatias/1kg', valor: 'P', preco: 100 },
            { label: 'Médio (M) - 12-15 fatias/2kg', valor: 'M', preco: 140 },
            { label: 'Grande (G) - 22-25 fatias/3kg', valor: 'G', preco: 190 }
        ]
    },
    {
        id: 'massa',
        pergunta: 'Qual o sabor da massa?',
        imagem: 'assets/boloazulbranco.jpg',
        tipo: 'radio',
        opcoes: [
            { label: 'Baunilha', valor: 'baunilha' },
            { label: 'Chocolate', valor: 'chocolate' }
        ]
    },
    {
        id: 'recheio',
        pergunta: 'Escolha o recheio principal:',
        imagem: 'assets/chaves.jpg',
        tipo: 'radio',
        opcoes: [
            { label: 'Chocolate', valor: 'chocolate' },
            { label: 'Brigadeiro', valor: 'brigadeiro' },
            { label: 'Beijinho', valor: 'beijinho' },
            { label: 'Prestigio', valor: 'prestigio' },
            { label: 'Bem casado', valor: 'bem-casado' },
            { label: 'Doce de leite', valor: 'doce-leite' },
            { label: 'Brigadeiro branco', valor: 'brigadeiro-branco' },
            { label: 'Paçoca', valor: 'paçoca' },
            { label: 'Morango (Valor adicional)', valor: 'morango', possuiAdicional: true }
        ]
    },
    {
        id: 'cobertura',
        pergunta: 'Escolha a cobertura:',
        imagem: 'assets/roblox.jpg',
        tipo: 'radio',
        opcoes: [
            { label: 'Chocolate', valor: 'chocolate' },
            { label: 'Chantilly', valor: 'chantilly' },
        ]
    },
    {
        id: 'docesExtras',
        pergunta: 'Quantos doces extras na cobertura? (R$ 1,00 cada)',
        imagem: 'assets/boloazul.jpg',
        tipo: 'number',
        min: 0,
        max: 25
    },
    {
        id: 'personalizacao',
        pergunta: 'Escolher topo de bolo:',
        imagem: 'assets/boloflorido.jpg',
        tipo: 'radio',
        opcoes: [
            { label: 'Sem topo', valor: 'sem-topo' },
            { label: 'Com topo simples em papel fotografico', valor: 'topo-simples' },
            { label: 'Com topo personalizado(nomes, frases, efeitos, flores)', valor: 'topo-personalizado' },
        ]
    }
];

// Estado do Pedido
let estado = {
    etapaAtual: 0,
    pedido: {
        tamanho: null,
        massa: null,
        recheio: null,
        cobertura: null,
        docesExtras: 0,
        personalizacao: null,
        total: 0
    }
};

// Elementos do DOM
const appContainer = document.getElementById('app');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Função para inicializar o app
function init() {
    renderizarEtapa();
    atualizarBotoes();
}

// Função para renderizar a etapa atual
function renderizarEtapa() {
    if (estado.etapaAtual >= perguntas.length) {
        renderizarResumo();
        return;
    }

    const pergunta = perguntas[estado.etapaAtual];
    const selecaoAnterior = estado.pedido[pergunta.id];

    let html = `
        <div class="image-wrapper">
            <img src="${pergunta.imagem}" alt="Imagem do Bolo" class="centered-image">
        </div>
        <section class="content">
            <p class="question-text">${pergunta.pergunta}</p>
            <div class="options">
    `;

    if (pergunta.tipo === 'radio') {
        pergunta.opcoes.forEach(opcao => {
            const isSelected = selecaoAnterior && selecaoAnterior.valor === opcao.valor;
            html += `
                <button class="option-btn ${isSelected ? 'active' : ''}" 
                        onclick="selecionarOpcao('${pergunta.id}', '${opcao.valor}')">
                    ${opcao.label} ${opcao.preco ? `- R$ ${opcao.preco}` : ''}
                </button>
            `;
        });
    } else if (pergunta.tipo === 'number') {
        html += `
            <input type="number" id="inputNumber" class="number-input" 
                   value="${selecaoAnterior || 0}" min="${pergunta.min}" max="${pergunta.max}"
                   onchange="atualizarQuantidade('${pergunta.id}', this.value)">
        `;
    }

    html += `
            </div>
        </section>
    `;

    appContainer.innerHTML = html;
    atualizarProgresso();
}

// Função para selecionar uma opção (radio)
window.selecionarOpcao = function(id, valor) {
    const pergunta = perguntas[estado.etapaAtual];
    const opcao = pergunta.opcoes.find(o => o.valor === valor);
    
    estado.pedido[id] = {
        label: opcao.label,
        valor: opcao.valor,
        preco: opcao.preco || 0,
        possuiAdicional: opcao.possuiAdicional || false
    };

    renderizarEtapa();
};

// Função para atualizar quantidade (number)
window.atualizarQuantidade = function(id, valor) {
    estado.pedido[id] = parseInt(valor) || 0;
};

// Navegação
prevBtn.onclick = () => {
    if (estado.etapaAtual > 0) {
        estado.etapaAtual--;
        renderizarEtapa();
        atualizarBotoes();
    }
};

nextBtn.onclick = () => {
    const perguntaAtual = perguntas[estado.etapaAtual];
    if (perguntaAtual && !estado.pedido[perguntaAtual.id] && perguntaAtual.tipo !== 'number') {
        alert('Por favor, selecione uma opção antes de continuar.');
        return;
    }

    if (estado.etapaAtual < perguntas.length) {
        estado.etapaAtual++;
        renderizarEtapa();
        atualizarBotoes();
    } else if (estado.etapaAtual === perguntas.length) {
        finalizarPedido();
    }
};

function atualizarBotoes() {
    prevBtn.style.visibility = estado.etapaAtual === 0 ? 'hidden' : 'visible';
    
    if (estado.etapaAtual >= perguntas.length) {
        nextBtn.innerText = 'Finalizar Pedido';
    } else {
        nextBtn.innerText = 'Próximo';
        nextBtn.disabled = false;
    }
}

function atualizarProgresso() {
    const porcentagem = ((estado.etapaAtual) / perguntas.length) * 100;
    progressBar.style.width = `${porcentagem}%`;
}

function calcularTotal() {
    let total = 0;
    
    // Preço Base (Tamanho)
    if (estado.pedido.tamanho) {
        total += estado.pedido.tamanho.preco;
    }

    // Adicional de Morango
    if (estado.pedido.recheio && estado.pedido.recheio.possuiAdicional) {
        const tamanho = estado.pedido.tamanho.valor;
        if (tamanho === 'P') total += 10;
        else if (tamanho === 'M') total += 18;
        else if (tamanho === 'G') total += 25;
    }

    // Doces Extras
    total += (estado.pedido.docesExtras || 0) * 1;

    estado.pedido.total = total;
    return total;
}

function renderizarResumo() {
    const total = calcularTotal();
    const p = estado.pedido;

    let html = `
        <section class="content resumen">
            <h2 class="question-text">Resumo do seu Pedido</h2>
            <div class="summary-details">
                <p><strong>Tamanho:</strong> ${p.tamanho.label}</p>
                <p><strong>Massa:</strong> ${p.massa.label}</p>
                <p><strong>Recheio:</strong> ${p.recheio.label}</p>
                <p><strong>Cobertura:</strong> ${p.cobertura.label}</p>
                <p><strong>Doces Extras:</strong> ${p.docesExtras}</p>
                <p><strong>Personalização:</strong> ${p.personalizacao.label}</p>
                <hr>
                <p class="total-price">Total: R$ ${total.toFixed(2)}</p>
    `;
    if (p.personalizacao.valor !== 'sem-topo') {
        html += `<p><em>Observação: O valor do topo não está incluso e será negociado durante o pedido no whatsapp</em></p>`;
    }
    html += `
            </div>
            
            <div class="confirmation-box">
                <label class="checkbox-container">
                    <input type="checkbox" id="confirmTopo">
                    <span class="checkmark"></span>
                    <p class="termos-texto">Entendo que os valores podem variar dependendo da negociação do topo.</p>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" id="confirmCartao">
                    <span class="checkmark"></span>
                    <p class="termos-texto">Entendo que o pagamento por cartão gera juros.</p>
                </label>
            </div>
        </section>
    `;

    appContainer.innerHTML = html;
    atualizarProgresso();
    atualizarBotoes();

    // Lógica para desativar/ativar o botão com base nas checkboxes
    const checkTopo = document.getElementById('confirmTopo');
    const checkCartao = document.getElementById('confirmCartao');

    if (checkTopo && checkCartao) {
        const validar = () => {
            nextBtn.disabled = !(checkTopo.checked && checkCartao.checked);
        };
        checkTopo.addEventListener('change', validar);
        checkCartao.addEventListener('change', validar);
        validar();
    }
}

function finalizarPedido() {
    const p = estado.pedido;
    const mensagem = `Olá! Gostaria de encomendar um bolo:
- Tamanho: ${p.tamanho.label}
- Massa: ${p.massa.label}
- Recheio: ${p.recheio.label}
- Cobertura: ${p.cobertura.label}
- Doces Extras: ${p.docesExtras}
- Personalização: ${p.personalizacao.label}
- Total: R$ ${p.total.toFixed(2)}`;

    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Iniciar o App
init();
