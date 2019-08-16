//var ip  = "http://192.168.0.12";
var ip = "/painelInterno";



var paginaDeDados = ip + "/lerDados"
var pagLigaLed = ip + "/ligarLed";

	
// carrega primeira vez e configura página para recarregar automaticamente a cada 20s
$(document).ready(function(){
	limpaECarregaTabela(); 
	setInterval(function(){ limpaECarregaTabela(); }, 20000);	
});	


function limpaECarregaTabela(){
	$.ajax({url: paginaDeDados , success: function(result){
		$("#tabela").html("");
		insereLinhas(result);
	}, cache: false});
}


function insereLinhas(result){
	var pagina = JSON.parse(result);
	var qtd = pagina.Dispo.length; 
	for(var numLinha=0; numLinha<qtd; numLinha++){
		
		var txtLinha  = '<tr>';

			txtLinha += `<td id=tdLocal_${numLinha}>` + pagina.Dispo[numLinha].LOCAL + '</td>'; 			// Local
			txtLinha += `<td id=tdModelo_${numLinha}>` + pagina.Dispo[numLinha].ESP_MOD + '</td>';			// Modelo
			txtLinha += `<td id=tdEstado_${numLinha}>` + pagina.Dispo[numLinha].ESTADO + '</td>'; 			// Estado
						
			// LED
			txtLinha += `<td id=tdBotao_${numLinha}>`;
			txtLinha += '<label class=switch>';
			txtLinha += `<input id=bt_${numLinha} `;
			if(pagina.Dispo[numLinha].LED == '1') 
				txtLinha += 'checked=true ';
	        txtLinha += `onclick="muda(this.id,${pagina.Dispo[numLinha].SEQ})"`; 
	        txtLinha += 'type=checkbox>';
			txtLinha += '<span class="slider"></span>';
			txtLinha += '</label>';
			txtLinha += '</td>';

			txtLinha += `<td id=tdTemperatura_${numLinha}>` + pagina.Dispo[numLinha].ADC1 + '</td>'; 		// Temperatura 
			txtLinha += `<td id=tdPressao_${numLinha}>` + pagina.Dispo[numLinha].ADC2 + '</td>'; 			// 	Pressão
			txtLinha += `<td id=tdSequencial_${numLinha}>` + pagina.Dispo[numLinha].SEQ + '</td>'; 			// Sequencial
			
			txtLinha += '</tr>';
			
		$("#tabela").append(txtLinha);
	
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