function validarCredenciais() {
    let usuario = document.getElementById('usuario').value;
    if (usuario.trim === null || usuario.trim() === "") {
        alert("Preencha o seu usuário!");
    }
    let senha = document.getElementById('senha').value;
    if(senha.trim === null || senha.trim() === "") {
        alert("Preencha a sua senha!")
    }
}