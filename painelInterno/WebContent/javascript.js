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

	var txtInterruptor = '<div class="col-xs- icone">';
	txtInterruptor += '<label>';
	txtInterruptor += '<button class="btn btn-dark btn-circle botao ';
	
	// LED
	if (dispo.LED == '1')
		txtInterruptor += ' ledLigado ';
	
	txtInterruptor += `" id=EspButton_${dispo.SEQ} onclick="muda(this.id,${dispo.SEQ})">`;
	txtInterruptor += '<i class="fas fa-lightbulb"></i>';
	txtInterruptor += '</button>';
	txtInterruptor += '</label>';
	// Local
	txtInterruptor += '<p class="rotulo">'; 
	txtInterruptor += ` ${dispo.LOCAL}`;			
	txtInterruptor += ' </p>';
	txtInterruptor += '</div>';
	return txtInterruptor;

}

function criaInfoTemperatura(dispo) {
	var txtInfoTemperatura = '<div class="col-xs- icone">';
	txtInfoTemperatura += '<i class="fas fa-thermometer-full fa-2x"></i>';
	txtInfoTemperatura += '<span>';
	txtInfoTemperatura += ` ${dispo.ADC1}&#176;`;
	txtInfoTemperatura += '</span>';
	// Local
	txtInfoTemperatura += '<p class="rotulo">'; 
	txtInfoTemperatura += ` ${dispo.LOCAL}`;			
	txtInfoTemperatura += ' </p>';
	txtInfoTemperatura += '</div>';
	return txtInfoTemperatura;
}

function criaInfoUmidade(dispo) {
	var txtInfoUmidade = '<div class="col-xs- icone">';
	txtInfoUmidade += '<i class="fas fa-tint fa-2x"></i>';
	txtInfoUmidade += '<span>';
	txtInfoUmidade += ` ${dispo.ADC2}%`;
	txtInfoUmidade += '</span>';
	// Local
	txtInfoUmidade += '<p class="rotulo">'; 
	txtInfoUmidade += ` ${dispo.LOCAL}`;	
	txtInfoUmidade += ' </p>';	
	txtInfoUmidade += '</div>';
	return txtInfoUmidade;
}


// Usa AJAX pra só recarregar o botão que mudou, e recarrega a página novamente em alguns segundos
function muda(response, sequencia) {
	
	$(`#EspButton_${sequencia}`).toggleClass('ledLigado');
	
	var urlParaMudar = pagLigaLed + "?" + sequencia;
	$.ajax({
		url: urlParaMudar, success: function (result) {
			// Aqui é onde devem ser feitas as mudanças via Ajax para refletir a mudança de estado do LED no componente Web que o representar		
			// Exemplo:
			//$(`#tdLocal_${sequencia}`).html(`Quarto ${sequencia}`);
		}
	});

	// Para melhor performance o ideal seria que o resultado da urlParaMudar trouxesse o novo estado do dispositivo que pediu para alterar

	// Após ajustar o estado do LED, setta a página para recarregar em 1,5s, 
	// para buscar novamente o estado do botão LED do servidor
	// Este tempo pode ser necessário para que o estado se modifique no dispositivo remoto
	setTimeout(function () { limpaECarregaTabela(); }, 1500);
}