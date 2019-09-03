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
	
			var txtLinha  = '<div class="col-xs-">';
			
			// LED
		  	txtLinha += `<label id=tdBotao_${numLinha} class="rocker rocker-small">`;
		  	txtLinha += '<input type="checkbox"';
		  	
		  	if(pagina.Dispo[numLinha].LED == '1') 
				txtLinha += ' checked=true ';
	        txtLinha += `onclick="muda(this.id,${pagina.Dispo[numLinha].SEQ})"`; 
		  			  	
		  	txtLinha += '><span class="switch-left">I</span>';
		  	txtLinha += '<span class="switch-right">O</span>';
		  	txtLinha += '</label>';

		  	// Local
			txtLinha += `<div class="text-center small" id=pLocal_${numLinha}>` + pagina.Dispo[numLinha].LOCAL + '</div>'; 
		  	
			txtLinha += '</div>';

			
			if (pagina.Dispo[numLinha].LED != '-') 
				$("#interruptoresRow").append(txtLinha);
			if (pagina.Dispo[numLinha].ADC1 != '-')
				 $("#temperaturaRow").append(txtLinha);
			if (pagina.Dispo[numLinha].ADC2 != '-')
				$("#pressaoRow").append(txtLinha);
			
	
  }
	
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