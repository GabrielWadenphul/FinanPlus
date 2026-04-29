const btnAdicionarTransacao = document.getElementById('adicionar-transacao');

if (btnAdicionarTransacao) {
    btnAdicionarTransacao.addEventListener('click', async () => {
        const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

        if (!idUsuarioLogado) {
            alert("Você precisa estar logado!");
            window.location.href = 'index.html';
            return;
        }

        const dadosInsert = {
            perfil_id: parseInt(localStorage.getItem('idPerfilAtivo')),
            data_transacao: document.getElementById('dataTransacao').value,
            tipo: document.getElementById('tipoTransacao').value,
            categoria_id: parseInt(document.getElementById('categoriaTransacao').value),
            valor: parseFloat(document.getElementById('valorTransacao').value),
            descricao: document.getElementById('descricaoTransacao').value,
            num_parcelas: parseInt(document.getElementById('numParcelas').value) || 1
        };

        if (isNaN(dadosInsert.perfil_id)) return alert("Erro: Perfil não encontrado.");
        if (isNaN(dadosInsert.valor)) return alert("Por favor, insira um valor válido.");
        if (!dadosInsert.data_transacao) return alert("Por favor, insira uma data.");

        const url = transacaoSelecionadaId
            ? `http://localhost:3000/api/transacoes/${transacaoSelecionadaId}`
            : `http://localhost:3000/api/transacoes`;

        const metodo = transacaoSelecionadaId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosInsert)
            });

            const resultado = await res.json();

            if (res.ok) {
                alert(transacaoSelecionadaId ? "Transação atualizada!" : "Transação cadastrada!");
                location.reload();
            } else {
                alert("Erro: " + (resultado.mensagem || "Erro ao processar transação."));
            }
        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

async function carregarCategorias() {
    const selectsIds = ['categoriaTransacao', 'editarCategoria', 'categoria'];

    try {
        const resposta = await fetch('http://localhost:3000/api/categorias');
        const categorias = await resposta.json();

        if (resposta.ok) {
            selectsIds.forEach(id => {
                const selectEl = document.getElementById(id);
                if (selectEl) {
                    selectEl.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';

                    categorias.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat.id;
                        option.textContent = cat.nome;
                        selectEl.appendChild(option);
                    });
                }
            });
        }
    } catch (erro) {
        console.error("Erro ao buscar categorias:", erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarTransacoes();
});

async function FiltrarCategorias() {
    const selectCategoria = document.getElementById('categoria');

    if (!selectCategoria) return;

    try {
        const resposta = await fetch('http://localhost:3000/api/categorias');
        const categorias = await resposta.json();

        if (resposta.ok) {
            selectCategoria.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                selectCategoria.appendChild(option);
            });
        } else {
            selectCategoria.innerHTML = '<option value="" disabled>Erro ao carregar</option>';
        }
    } catch (erro) {
        console.error("Erro ao buscar categorias:", erro);
        selectCategoria.innerHTML = '<option value="" disabled>Erro de conexão</option>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    FiltrarCategorias();
});

let transacaoSelecionadaId = null;

async function carregarTransacoes() {
    const idPerfil = localStorage.getItem('idPerfilAtivo');
    const tbody = document.querySelector('.Tabela tbody');

    if (!idPerfil || idPerfil === "undefined" || idPerfil === "null") {
        console.warn("Aguardando ID do perfil para carregar transações...");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/transacoes?perfil_id=${idPerfil}`);
        const transacoes = await resposta.json();

        if (resposta.ok) {
            tbody.innerHTML = '';
            transacaoSelecionadaId = null;

            if (transacoes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma transação encontrada.</td></tr>';
                return;
            }

            transacoes.forEach((transacao, index) => {
                const tr = document.createElement('tr');

                tr.dataset.id = transacao.id;

                const data = new Date(transacao.data_transacao);
                const dataFormatada = data.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});

                const valorFormatado = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(transacao.valor);

                const corValor = transacao.tipo === 'receita' ? 'color: green;' : 'color: red;';

                tr.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${dataFormatada}</td>
                    <td>${transacao.descricao}</td>
                    <td>${transacao.categoria_nome || 'Sem categoria'}</td>
                    <td>${transacao.tipo || 'Sem Tipo'}</td>
                    <td style="font-weight: bold; ${corValor}">${valorFormatado}</td>
                `;

                tr.addEventListener('click', function () {

                    document.querySelectorAll('.Tabela tbody tr').forEach(linha => {
                        linha.classList.remove('selecionada');
                    });

                    this.classList.add('selecionada');

                    transacaoSelecionadaId = this.dataset.id;
                    console.log("Transação selecionada ID:", transacaoSelecionadaId);
                });

                tbody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar transações:", erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarTransacoes();
    if (typeof carregarCategorias === 'function') carregarCategorias();
});

async function prepararEdicao(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/api/transacoes/${id}`);
        const transacao = await resposta.json();

        const selectEditar = document.getElementById('editarCategoria');

        selectEditar.value = String(transacao.categoria_id);

        document.getElementById('editar-popup').classList.add('show');

        if (resposta.ok) {
            document.getElementById('editarData').value = transacao.data_transacao.split('T')[0];
            document.getElementById('editarTipo').value = transacao.tipo;
            document.getElementById('editarCategoria').value = transacao.categoria_id;
            document.getElementById('editarValor').value = transacao.valor;
            document.getElementById('editarDescricao').value = transacao.descricao;
            document.getElementById('editarParcelas').value = transacao.num_parcelas || 1;
            document.getElementById('editar-popup').classList.add('show');
        }
    } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        alert("Erro ao buscar dados da transação.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirEdicao = document.getElementById('editar-pop-up');

    if (btnAbrirEdicao) {
        btnAbrirEdicao.addEventListener('click', () => {
            if (!transacaoSelecionadaId) {
                alert("Por favor, selecione uma transação na tabela primeiro.");
                return;
            }
            prepararEdicao(transacaoSelecionadaId);
        });
    }
})

const btnConfirmarEdicao = document.getElementById('editar-transacao');

if (btnConfirmarEdicao) {
    btnConfirmarEdicao.addEventListener('click', async () => {
        const dadosEditados = {
            data_transacao: document.getElementById('editarData').value,
            tipo: document.getElementById('editarTipo').value,
            categoria_id: parseInt(document.getElementById('editarCategoria').value), // Captura o ID novo
            valor: parseFloat(document.getElementById('editarValor').value),
            descricao: document.getElementById('editarDescricao').value
        };

        try {
            const res = await fetch(`http://localhost:3000/api/transacoes/${transacaoSelecionadaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosEditados)
            });

            if (res.ok) {
                alert("Transação atualizada com sucesso!");
                location.reload();
            }
        } catch (error) {
            console.error("Erro ao salvar edição:", error);
        }
    });
}

const btnExcluir = document.getElementById('excluir');

if (btnExcluir) {
    btnExcluir.addEventListener('click', async () => {
        if (!transacaoSelecionadaId) {
            alert("Por favor, selecione uma transação na tabela para excluir.");
            return;
        }

        const confirmar = confirm("Tem certeza que deseja excluir esta transação?");
        if (!confirmar) return;

        try {
            const resposta = await fetch(`http://localhost:3000/api/transacoes/${transacaoSelecionadaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (resposta.ok) {
                alert("Transação excluída com sucesso!")
                location.reload();
            } else {
                const resultado = await resposta.json();
                alert("Erro ao excluir: " + (resultado.mensagem || "Erro desconhecido"));
            }

        } catch (erro) {
            console.error("Erro na comunicação:", erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
}