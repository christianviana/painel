var paginaDeDados = "lerDados";
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
				$("#interruptoresRow").append(criaInterruptor(pagina.Dispo[numLinha]));
			if (pagina.Dispo[numLinha].ADC1 != '-')
				 $("#temperaturaRow").append(criaInfoTemperatura(pagina.Dispo[numLinha]));
			if (pagina.Dispo[numLinha].ADC2 != '-')
				$("#pressaoRow").append(criaInfoPressao(pagina.Dispo[numLinha]));
  }
}

function criaInterruptor(dispo){
	
	var txtInterruptor = '<div class="col-xs- text-center">';
	// LED
	
	txtInterruptor += `<label id=ESP_${dispo.SEQ} class="rocker rocker-small">`;
	txtInterruptor += '<input type="checkbox"';
  	if(dispo.LED == '1') 
  		txtInterruptor += ' checked=true ';
  	txtInterruptor += `onclick="muda(this.id,${dispo.SEQ})"`; 
  	txtInterruptor += '><span class="switch-left">I</span>';
  	txtInterruptor += '<span class="switch-right">O</span>';
  	txtInterruptor += '</label>';
  		
  	// Local
  	
  	txtInterruptor += '<br>';
  	txtInterruptor += `<span class="text-center small" id=pLocal_${dispo.SEQ}>` + dispo.LOCAL + '</span>'; 
  	
  	txtInterruptor += '</div>';
	return txtInterruptor;
	
}

function criaInfoTemperatura(dispo){
	var txtInfoTemperatura  = '<div class="col-xs- text-center">';
	
	
	txtInfoTemperatura += '<i class="fas fa-thermometer-full fa-2x"></i>';
	txtInfoTemperatura += `<label id=ESP_${dispo.SEQ}>`;
	txtInfoTemperatura += `${dispo.ADC1}`;
	txtInfoTemperatura += '</label>';
	
	
	// Local
	txtInfoTemperatura += '<br>';
  	txtInfoTemperatura += `<span class="text-center small" id=pLocal_${dispo.SEQ}>` + dispo.LOCAL + ' </span>'; 
  	
  	txtInfoTemperatura += '</div>';
	return txtInfoTemperatura;	
}

function criaInfoPressao(dispo){
	var txtInfoPressao  = '<div class="col-xs- text-center">';
	
	txtInfoPressao += '<i class="fas fa-tachometer-alt fa-2x"></i>';;
	txtInfoPressao += `<label id=ESP_${dispo.SEQ}>`;
	txtInfoPressao += `${dispo.ADC2}`;
	txtInfoPressao += '  	';
	txtInfoPressao += '</label>';
	
	// Local
	txtInfoPressao += '<br>';
	txtInfoPressao += `<span class="text-center small" id=pLocal_${dispo.SEQ}>` + dispo.LOCAL + ' </span>';
	
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