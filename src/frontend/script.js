document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.querySelector('.formulario');

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (event) => {
            event.preventDefault();

            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem! Tente novamente.");
                return;
            }

            const dadosCadastro = {
                nome_completo: document.getElementById('nome').value,
                nome_usuario: document.getElementById('usuario').value,
                email: document.getElementById('email').value,
                documento: document.getElementById('cpf').value,
                data_nascimento: document.getElementById('data').value,
                ocupacao: document.getElementById('ocupacao').value,
                senha: senha,
                tipo_perfil: 'Pessoa Física'
            };

            try {
                const resposta = await fetch('http://localhost:3000/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosCadastro)
                });

                const resultado = await resposta.json();

                if (resposta.status === 201) {
                    alert("Cadastro realizado com sucesso! Bem-vindo ao Finan+.");
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Erro ao cadastrar: " + resultado.mensagem);
                }

            } catch (erro) {
                console.error("Erro na comunicação com a API:", erro);
                alert("Erro ao conectar com o servidor. Verifique se o back-end está rodando.");
            }
        });
    }

    const btnAtualizarAcesso = document.getElementById('atualizar-acesso');
    if (btnAtualizarAcesso) {
        btnAtualizarAcesso.addEventListener('click', async () => {
            const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

            if (!idUsuarioLogado) {
                alert("Você precisa estar logado!");
                window.location.href = 'index.html';
                return;
            }

            const dadosAtualizados = {
                nome_usuario: document.getElementById('usuario').value,
                senha_hash: document.getElementById('novaSenha').value
            };

            try {
                const resposta = await fetch(`http://localhost:3000/api/usuarios/${idUsuarioLogado}/acesso`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosAtualizados)
                });

                const resultado = await resposta.json();

                if (resposta.status === 200) {
                    alert("Dados atualizados com sucesso!");
                } else {
                    alert("Erro ao atualizar: " + resultado.mensagem);
                }

            } catch (erro) {
                console.error("Erro na comunicação:", erro);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    const btnAtualizarPerfil = document.getElementById('atualizar-perfil');
    if (btnAtualizarPerfil) {
        btnAtualizarPerfil.addEventListener('click', async () => {
            const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

            if (!idUsuarioLogado) {
                alert("Você precisa estar logado!");
                window.location.href = 'index.html';
                return;
            }

            const dadosAtualizados = {
                nome_completo: document.getElementById('nome').value,
                ocupacao: document.getElementById('ocupacao').value,
                data_nascimento: document.getElementById('dataNascimento').value,
                documento: document.getElementById('cpf').value
            };

            try {
                const resposta = await fetch(`http://localhost:3000/api/usuarios/${idUsuarioLogado}/perfil`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosAtualizados)
                });

                const resultado = await resposta.json();

                if (resposta.status === 200) {
                    alert("Dados atualizados com sucesso!");
                } else {
                    alert("Erro ao atualizar: " + resultado.mensagem);
                }

            } catch (erro) {
                console.error("Erro na comunicação:", erro);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    const btnExcluir = document.getElementById('excluir-usuario');
    if (btnExcluir) {
        btnExcluir.addEventListener('click', async () => {
            const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

            if (!idUsuarioLogado) {
                alert("Você precisa estar logado!");
                window.location.href = 'index.html';
                return;
            }

            try {
                const resposta = await fetch(`http://localhost:3000/api/usuarios/${idUsuarioLogado}/delete`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const resultado = await resposta.json();

                if (resposta.status === 200) {
                    alert("Usuário excluído com sucesso!");
                    localStorage.removeItem('idUsuarioLogado');
                    window.location.href = 'index.html';
                } else {
                    alert("Erro ao excluir: " + resultado.mensagem);
                }

            } catch (erro) {
                console.error("Erro na comunicação:", erro);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    const btnEntrar = document.getElementById('login');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', async (event) => {
            event.preventDefault();

            const nome_usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;

            if (!nome_usuario || !senha) {
                alert("Por favor, preencha o usuário e a senha.");
                return;
            }

            try {
                const resposta = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        nome_usuario: nome_usuario,
                        senha: senha
                    })
                });

                const resultado = await resposta.json();

                if (resposta.status === 200) {
                    alert("Bem-vindo de volta ao Finan+!");
                    localStorage.setItem('idUsuarioLogado', resultado.usuarioId);
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Erro: " + resultado.mensagem);
                }

            } catch (erro) {
                console.error("Erro na comunicação:", erro);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    const campoNome = document.getElementById('nome');
    if (campoNome && !document.querySelector('.formulario')) {
        carregarDadosPerfil();
    }
});

async function carregarDadosPerfil() {
    const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

    if (!idUsuarioLogado) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/usuarios/${idUsuarioLogado}`);
        const dados = await resposta.json();

        if (resposta.status === 200) {
            if (document.getElementById('usuario')) document.getElementById('usuario').value = dados.nome_usuario || '';
            if (document.getElementById('nome')) document.getElementById('nome').value = dados.nome_completo || '';
            if (document.getElementById('ocupacao')) document.getElementById('ocupacao').value = dados.ocupacao || '';
            if (document.getElementById('cpf')) document.getElementById('cpf').value = dados.documento || '';

            if (dados.data_nascimento && document.getElementById('dataNascimento')) {
                const dataFormatada = dados.data_nascimento.split('T')[0];
                document.getElementById('dataNascimento').value = dataFormatada;
            }
        } else {
            console.error("Erro ao carregar perfil:", dados.mensagem);
        }
    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}