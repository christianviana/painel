var paginaDeDados = "lerDados"
var pagLigaLed = "ligarLed";

	
// carrega primeira vez e configura página para recarregar automaticamente a cada 20s
$(document).ready(function(){
	limpaECarregaTabela(); 
	setInterval(function(){ limpaECarregaTabela(); }, 20000);	
});	


function limpaECarregaTabela(){
	$.ajax({url: paginaDeDados , success: function(result){
		$("#interruptoresRow").html("");
		$("#temperaturaRow").html("");
		$("#pressaoRow").html("");
		insereLinhas(result);
	}, cache: false});
}


function insereLinhas(result){
	
	var pagina = JSON.parse(result);
	var qtd = pagina.Dispo.length; 
	
	for(var numLinha=0; numLinha<qtd; numLinha++){
			if (pagina.Dispo[numLinha].LED != '-') 
				$("#interruptoresRow").append(insereInterruptor(pagina.Dispo[numLinha]));
			if (pagina.Dispo[numLinha].ADC1 != '-')
				 $("#temperaturaRow").append(insereInfoTemperatura(pagina.Dispo[numLinha]));
			if (pagina.Dispo[numLinha].ADC2 != '-')
				$("#pressaoRow").append(insereInfoPressao(pagina.Dispo[numLinha]));
  }
}


function insereInterruptor(dados){
	
	var txtInterruptor = '<div class="col-xs-">';
	// LED
	txtInterruptor += `<label id=tdBotao_${dados.SEQ} class="rocker rocker-small">`;
	txtInterruptor += '<input type="checkbox"';
  	if(dados.LED == '1') 
  		txtInterruptor += ' checked=true ';
  	txtInterruptor += `onclick="muda(this.id,${dados.SEQ})"`; 
  	txtInterruptor += '><span class="switch-left">I</span>';
  	txtInterruptor += '<span class="switch-right">O</span>';
  	txtInterruptor += '</label>';
  	// Local
  	txtInterruptor += `<div class="text-center small" id=pLocal_${dados.SEQ}>` + dados.LOCAL + '</div>'; 
  	txtInterruptor += '</div>';
	return txtInterruptor;
	
}

function insereInfoTemperatura(dados){
	var txtInfoTemperatura  = '<div class="col-xs-">';
	txtInfoTemperatura += `<label id=tdBotao_${dados.SEQ} class="rocker rocker-small">`;
	txtInfoTemperatura += '<input type="checkbox"';
  	txtInfoTemperatura += `onclick="muda(this.id,${dados.SEQ})"`; 
  	txtInfoTemperatura += '><span class="switch-left">I</span>';
  	txtInfoTemperatura += '<span class="switch-right">O</span>';
  	txtInfoTemperatura += '</label>';
  	// Local
  	txtInfoTemperatura += `<div class="text-center small" id=pLocal_${dados.SEQ}>` + dados.LOCAL + '</div>'; 
  	txtInfoTemperatura += '</div>';
	return txtInfoTemperatura;	
}

function insereInfoPressao(dados){
	var txtInfoPressao  = '<div class="col-xs-">';
	txtInfoPressao += `<label id=tdBotao_${dados.SEQ} class="rocker rocker-small">`;
	txtInfoPressao += '<input type="checkbox"';
  	txtInfoPressao += `onclick="muda(this.id,${dados.SEQ})"`; 
  	txtInfoPressao += '><span class="switch-left">I</span>';
  	txtInfoPressao += '<span class="switch-right">O</span>';
  	txtInfoPressao += '</label>';
  	// Local
  	txtInfoPressao += `<div class="text-center small" id=pLocal_${dados.SEQ}>` + dados.LOCAL + '</div>'; 
  	txtInfoPressao += '</div>';
	return txtInfoPressao;
}

// Usa AJAX pra só recarregar o botão que mudou, e recarrega a página novamente em alguns segundos
function muda(response,sequencia){
	
	var urlParaMudar = pagLigaLed + "?" + sequencia;	
	$.ajax({url: urlParaMudar, success: function(result){
		// Aqui é onde devem ser feitas as mudanças via Ajax para refletir a mudança de estado do LED no componente Web que o representar		
		// Exemplo:
		//$(`#tdLocal_${sequencia}`).html(`Quarto ${sequencia}`);
	}});
	
	// Para melhor performance o ideal seria que o resultado da urlParaMudar trouxesse o novo estado do dispositivo que pediu para alterar
	
	// Após ajustar o estado do LED, setta a página para recarregar em 1,5s, 
	// para buscar novamente o estado do botão LED do servidor
	// Este tempo pode ser necessário para que o estado se modifique no dispositivo remoto
	setTimeout(function(){limpaECarregaTabela();}, 1500);
		
}