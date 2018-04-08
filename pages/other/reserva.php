<style type="text/css">	
p.title { font-size:20px; color:#800; }
td.rowClickable { cursor:pointer; font-weight:bold; padding-right:20px; }

#tableProducts td { font-size:18px; }
#tableTarifa td { text-align:center; }
#tableReserva td { text-align:right; }

#tableTarifa, #tableReserva { min-width:300px; }
#tableReserva #trHead { text-align:center; background-color:fuchsia; }
#tableTarifa, #tableTarifa td, #tableReserva, #tableReserva td { border-collapse:collapse; border: 1px solid; }

.goColor { color:#800; }
.lBtn { width:20px; background-color:#CAD7E0; cursor:pointer; font-weight:bold; }
.ui-datepicker{ font-size:14px; }
</style>

<!-- CONTENT GOES HERE :) -->
<h2><a id="refName" class="iLink" href="#&reservas" title="Click to choose another Reference">REFERENCE_NAME</a></h2>
<hr class="light"/>

<div id="divDate">
	<p class="title">Selecione a Data:</p>
	<input type="text" id="datepicker">
</div>
<br>
<div id="divProduct">
	<p class="title">Selecione o Produto: </p>
	<table id="tableProducts"></table>
</div>
<br>
<div id="divTarifa">
	<p class="title" id="selectTarifa"></p>
	<table id="tableTarifa"></table>
	<br>
	<table id="tableReserva">
	<tr><td id="trHead" colspan="5"></td></tr>
	</table>
</div>
<!-- CONTENT ENDS HERE :) -->

<script type="text/javascript">
$(document).ready(function() {
	$mainNav.set("reservas");
	$("#datepicker").datepicker( { showOtherMonths:true, selectOtherMonths:true } );
	$("#datepicker").datepicker("setDate", new Date());
	$("#datepicker").datepicker("option", "dateFormat", "dd/mm/yy" );
	$("#divTarifa").hide();
	var iHash = ($hashed.part).split('?');
	$("#refName").html(doSpaces(iHash[0]));
	$("#refName").tooltip();
	
    $.ajax({
		url: "data/step2.xml",
		dataType: "xml",
		success: function(data)
		{
			var found = false;
			$(data).find('availability').each(function()
			{
				var res = $(this).find('resource').text(); // while (res.search(" ") != -1) res = res.replace(" ","_");
				if (res==doSpaces(iHash[0]))
				{
					found = true;
					var prod = $(this).find('product').text();
					var time = $(this).find('starttime').text();
					jQuery('<tr/>', {
						html: '<td class="rowClickable">'+prod+'</td><td>'+time+'</td>'
					}).appendTo('#tableProducts');
				}
			}); // end Search
			
			if (!found) alert('Não existem produtos para a reserva escolhida.');            
			
			$('.rowClickable').bind('click', function() {
				$('.rowClickable').removeClass('goColor');
				$(this).addClass('goColor');
				displayTarifas($(this).text());
			});
		}
	});
	if (iHash[1]!=undefined) displayTarifas(iHash[1]);
});
	
function displayTarifas(x) // Chosen Table Object
{
    $("#tableReserva").fadeOut();
	$("#tableTarifa tr").remove();
	$("#divTarifa").fadeIn();
    $("#selectTarifa").html('Selecione a Tarifa para '+x+':');
    $.ajax({
		url: "data/step4.xml",
		dataType: "xml",
		success: function(data)
		{
			var found = false;
			$(data).find('tarifa').each(function(){
				var prodType = $(this).find('tipoproduto').text();
				if (prodType==x)
				{
					found = true;
					var type = $(this).find('tipotarifa').text();
					var price = $(this).find('valor').text();
					var idtar = $(this).find('idtarifa').text();
					var tar_txt = "txt" + idtar;
			
					jQuery('<tr/>', {
						class: 'trThing',
						html: '<td>'+type+'</td><td class="lBtn" onclick="btnSub('+idtar+')">-</td><td width="20px"><input id="'+tar_txt+'" type="text" size="1" value="0" onkeyup="iValidate('+tar_txt+')"></td><td class="lBtn" onclick="btnSum('+idtar+')">+</td><td>'+price+' &euro;</td>'
					}).appendTo('#tableTarifa');
					
		  
				}
			});
			if (!found) alert('O produto escolhido não se encontra disponível');
		}
	});
}
	
function doSpaces(str)
{
	while (str.search("_") != -1)
		str = str.replace("_"," ");
	return str;
}

function btnSub(obj)
{
	var x = document.getElementById("txt"+obj);
	if (x.value>0)
		x.value--;
	buildReservaTable();
}

function btnSum(obj)
{
	var x = document.getElementById("txt"+obj);
	x.value++;
	buildReservaTable();
}

function iValidate(x)
{
	var num = parseInt(x.value, 10);
	if (isNaN(num))
		$(x).val(0);
	else
		$(x).val(num);
	buildReservaTable();    
}

function buildReservaTable()
{
	$("#tableReserva tr.trReserva").remove();
	$("#tableReserva").fadeIn();
	$.ajax({
		url: "data/step4.xml",
		dataType: "xml",
		success: function(data)
		{
			var total = 0;
			$(data).find('tarifa').each(function(){
				var prodType = $(this).find('tipoproduto').text();
				var time = $(this).find('HoraInicio').text();
				x = $('.goColor').first().html();
				if (prodType==x)
				{
					$("#trHead").html(x+' '+ $("#datepicker").val() +' às '+time);
					var type = $(this).find('tipotarifa').text();
					var price = $(this).find('valor').text();
					var idtar = $(this).find('idtarifa').text();
					var ammount = document.getElementById("txt"+idtar).value;
					total += price*ammount;
					if (ammount>0)
						jQuery('<tr/>', {
							class: 'trReserva',
							html: '<td>'+ammount+'</td><td>'+type+'</td><td>'+ammount*price+'&euro;</td><td>('+ammount+' x '+price+'&euro;)</td>'
						}).appendTo('#tableReserva');
				}
			});
			if (total>0)
				jQuery('<tr/>', {
					class: 'trReserva',
					html: '<td colspan="5">TOTAL A PAGAR: '+total+' &euro;</td>'
				}).appendTo('#tableReserva');
			else
				jQuery('<tr/>', {
					class: 'trReserva',
					html: '<td colspan="5">POR FAVOR SELECIONE ALGUMA TARIFA</td>'
				}).appendTo('#tableReserva');
		}
	});
}

</script>