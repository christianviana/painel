var paginaDeDados = "lerDados";
var pagLigaLed = "ligarLed";


// carrega primeira vez e configura página para recarregar automaticamente a cada 20s
$(document).ready(function () {
	limpaECarregaTabela();
	setInterval(function () { limpaECarregaTabela(); }, 20000);
});


function limpaECarregaTabela() {
	console.log(dataFormatada() + 'carregando dados...');
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

	var txtInterruptor = `<div id=Botao_${dispo.SEQ} class="col-xs- icone">`;
	// LED
	if (dispo.LED == '1')
		txtInterruptor += `<div class="bolaComum bolaFundoVerde" id=EspButton_${dispo.SEQ} >`;
	else
		txtInterruptor += `<div class="bolaComum bolaFundoVermelha" id=EspButton_${dispo.SEQ} >`;

	txtInterruptor += '</div>';
	txtInterruptor += '<div>';
	txtInterruptor += '<label class="rocker rocker-small">';
	txtInterruptor += '<input type="checkbox"';

	if (dispo.LED == '1')
		txtInterruptor += ' checked=true ';

	txtInterruptor += `onclick="muda(${dispo.SEQ})">`;
	txtInterruptor += '<span class="switch-left">I</span>';
	txtInterruptor += '<span class="switch-right">O</span>';
	txtInterruptor += '</label>	';
	// Local
	txtInterruptor += '<p class="rotulo">';
	txtInterruptor += ` ${dispo.LOCAL}`;
	txtInterruptor += ' </p>';
	txtInterruptor += '</div>';
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


// Usa AJAX pra só recarregar o botão que mudou
function muda(sequencia) {
	var urlParaMudar = pagLigaLed + "?" + sequencia;
	console.log(dataFormatada() + 'clicou no botão de sequência ' + sequencia);
	$.ajax({
		url: urlParaMudar, success: function (result) {
			$(`#EspButton_${sequencia}`).toggleClass('imgPiscando');
			// Aqui é onde devem ser feitas as mudanças via Ajax para refletir a mudança de estado do LED no componente Web que o representar
			console.log(dataFormatada() + 'resposta do clique no botão de sequência ' + sequencia + ': ' + result);
			var pagina = JSON.parse(result);
			var qtd = pagina.Dispo.length;
			// Por segurança, só altera se o resultado tem apenas um dispositivo, e com o mesmo sequencial que foi enviado
			if (qtd === 1 && sequencia === pagina.Dispo[0].SEQ) {
				$(`#Botao_${sequencia}`).replaceWith(criaInterruptor(pagina.Dispo[0]));
			}
		}
	});
}

function dataFormatada() {
	var d = new Date();
	var retorno = completaZerosEsquerda(d1.getHours()) + ':';
	retorno += completaZerosEsquerda(d1.getMinutes()) + ':';
	retorno += completaZerosEsquerda(d1.getSeconds()) + '.';
	retorno += d1.getMilliseconds();
	retorno += ' -> ';
	return retorno;
}

function completaZerosEsquerda(numero) {
	return numero < 10 ? '0'+ numero : numero;
}
