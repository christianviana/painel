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


function insereInterruptor(dispo){
	
	var txtInterruptor = '<div class="col-xs-">';
	// LED
	txtInterruptor += '<row>';
	txtInterruptor += `<label id=ESP_${dispo.SEQ} class="rocker rocker-small">`;
	txtInterruptor += '<input type="checkbox"';
  	if(dispo.LED == '1') 
  		txtInterruptor += ' checked=true ';
  	txtInterruptor += `onclick="muda(this.id,${dispo.SEQ})"`; 
  	txtInterruptor += '><span class="switch-left">I</span>';
  	txtInterruptor += '<span class="switch-right">O</span>';
  	txtInterruptor += '</label>';
  	txtInterruptor += '</row>';  	
  	// Local
  	txtInterruptor += '<row>';
  	txtInterruptor += `<p class="text-center small" id=pLocal_${dispo.SEQ}>` + dispo.LOCAL + '</p>'; 
  	txtInterruptor += '</row>';
  	txtInterruptor += '</div>';
	return txtInterruptor;
	
}

function insereInfoTemperatura(dispo){
	var txtInfoTemperatura  = '<div class="col-xs-">';
	txtInfoTemperatura += '<row>';
	txtInfoTemperatura += `<label id=ESP_${dispo.SEQ}>`;
	txtInfoTemperatura += `${dispo.ADC1}`;
	txtInfoTemperatura += '</label>';
	txtInfoTemperatura += '</row>';
	// Local
	txtInfoTemperatura += '<row>';
  	txtInfoTemperatura += `<p class="text-center small" id=pLocal_${dispo.SEQ}>` + dispo.LOCAL + '</p>'; 
  	txtInfoTemperatura += '</row>';
  	txtInfoTemperatura += '</div>';
	return txtInfoTemperatura;	
}

function insereInfoPressao(dispo){
	var txtInfoPressao  = '<div class="col-xs-">';
	txtInfoPressao += '<row>';
	txtInfoPressao += `<label id=ESP_${dispo.SEQ}>`;
	txtInfoPressao += `${dispo.ADC2}`;
	txtInfoPressao += '</label>';
	txtInfoPressao += '</row>';	
	// Local
	txtInfoPressao += '<row>';
	txtInfoPressao += `<p class="text-center small" id=pLocal_${dispo.SEQ}>` + dispo.LOCAL + '</p>';
	txtInfoPressao += '</row>';
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