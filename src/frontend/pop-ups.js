const modalInserir = document.getElementById("pop-up");
const modalEditar = document.getElementById("editar-popup");

document.getElementById("abrir-pop-up").onclick = function() {
    transacaoSelecionadaId = null;
    modalInserir.classList.add("show");
};

document.getElementById("cancelar-transacao").onclick = function() {
    modalInserir.classList.remove("show");
};

document.getElementById("cancelar-edicao").onclick = function() {
    modalEditar.classList.remove("show");
};

document.querySelector(".fechar-pop-up").onclick = () => modalInserir.classList.remove("show");
document.querySelector(".fechar-edicao").onclick = () => modalEditar.classList.remove("show");

window.onclick = function(event) {
    if (event.target == modalInserir) modalInserir.classList.remove("show");
    if (event.target == modalEditar) modalEditar.classList.remove("show");
};