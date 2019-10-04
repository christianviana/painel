var paginaDeDados = "lerDados";
var pagLigaLed = "ligarLed";


// carrega primeira vez e configura página para recarregar automaticamente a cada 20s
$(document).ready(function () {
	limpaECarregaTabela();
	setInterval(function () { limpaECarregaTabela(); }, 20000);
});


function limpaECarregaTabela() {
	$.ajax({
		url: paginaDeDados, success: function (result) {
			$("#interruptoresRow").html("");
			$("#temperaturaRow").html("");
			$("#umidadeRow").html("");
			insereLinhas(result);
		}, cache: false
	});
}


function insereLinhas(result) {

	var pagina = JSON.parse(result);
	var qtd = pagina.Dispo.length;

	for (var numLinha = 0; numLinha < qtd; numLinha++) {
		if (pagina.Dispo[numLinha].LED != '-')
			$("#interruptoresRow").append(criaInterruptor(pagina.Dispo[numLinha]));
		if (pagina.Dispo[numLinha].ADC1 != '-')
			$("#temperaturaRow").append(criaInfoTemperatura(pagina.Dispo[numLinha]));
		if (pagina.Dispo[numLinha].ADC2 != '-')
			$("#umidadeRow").append(criaInfoUmidade(pagina.Dispo[numLinha]));
	}
}

function criaInterruptor(dispo) {

	return 	`<user-card user-id=${dispo.SEQ+1}></user-card>`;

}

function criaInfoTemperatura(dispo) {
	var txtInfoTemperatura = '';
		txtInfoTemperatura += `<user-card user-id=${dispo.SEQ+1}></user-card>`;	
		return txtInfoTemperatura;
}

function criaInfoUmidade(dispo) {
	return 	`<user-card user-id=${dispo.SEQ+1}></user-card>`;
}


// Usa AJAX pra só recarregar o botão que mudou, e recarrega a página novamente em alguns segundos
function muda(response, sequencia) {
		
	//$(`#EspButton_${sequencia}`).toggleClass('ledPiscando');
	$(`#EspButton_${sequencia}`).toggleClass('imgPiscando');

	var urlParaMudar = pagLigaLed + "?" + sequencia;
	$.ajax({
		url: urlParaMudar, success: function (result) {
			// Aqui é onde devem ser feitas as mudanças via Ajax para refletir a mudança de estado do LED no componente Web que o representar		
			// Exemplo:
			//$(`#tdLocal_${sequencia}`).html(`Quarto ${sequencia}`);
		}
	});

	// Para melhor performance o ideal seria que o resultado da urlParaMudar trouxesse o novo estado do dispositivo que pediu para alterar

	// Após ajustar o estado do LED, setta a página para recarregar em 0,5s, 
	// para buscar novamente o estado do botão LED do servidor
	// Este tempo pode ser necessário para que o estado se modifique no dispositivo remoto
	setTimeout(function () { limpaECarregaTabela(); }, 2000);
}