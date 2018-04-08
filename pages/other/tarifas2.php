<style type="text/css">	
p.title { font-size:20px; color:#800; }
#refImg { position:relative; left:-60px; opacity:0.5; float:left; }
#refImg:hover { opacity:0.9; }
#infos { float:right; }

h2 { display:inline; }

#divTarifa { float:left; padding:0px 70px 10px 20px; }
#divReserva { float:left; padding:0px 10px 0px 20px; }

#tableTarifa td { text-align:center; }
.tableReserva td { text-align:right; }

#tableTarifa, .tableReserva { min-width:300px; }
.tableReserva .trHead { text-align:center; background-color:#800; color:#FFF; border-color:#000; }
#tableTarifa, #tableTarifa td { border-collapse:collapse; border: 1px solid; }
.tableReserva, .tableReserva td { border-collapse:collapse; border: 1px solid; }

.lBtn { width:20px; background-color:#CAD7E0; cursor:pointer; font-weight:bold;  -webkit-user-select:none; -moz-user-select:none; user-select:none; }
.ui-datepicker { font-size:12px; }
</style>

<!-- CONTENT GOES HERE :) -->
<h2>
<a id="refImg" href="#&products"><img src="img\arrows\arrowLeft.png"></a>
<span id="refName">PRODUCT</span>
</h2>
<div id="infos">
<input disabled type="text" id="datepicker" size="8" onchange="dateChanged()"> às
<select id="ddlTime"><option value="time10">10:00</option><option value="time14">14:00</option></select>
</div>
<hr class="light"/>

<div id="divTarifa">
	<p class="title" id="selectTarifa"></p>
	<table id="tableTarifa"></table>
</div>
<div id="divReserva">
	<p class="title" id="selectReserva">Reservas:</p>
</div>
<!-- CONTENT ENDS HERE :) -->

<script type="text/javascript">

	var iHash = location.href.split('&'); // ENCODED
	var prod = decodeURIComponent(iHash[2]);
	var time = $("#ddlTime option:selected").text();
	var date;

$(document).ready(function() {
	
	$("#datepicker").datepicker( { showOtherMonths:true, selectOtherMonths:true } );
	$("#datepicker").datepicker("option", "dateFormat", "dd-mm-yy" );
	$("#datepicker").datepicker("setDate", "22-01-2013"); // iHash[1]
	
	date = $("#datepicker").val();
	
	$("#refName").html(prod);
	
	$(".hasDatepicker").on("blur", function(e) { $(this).datepicker("hide"); });
	buildTarifaTable();
});

function dateChanged(){
	buildTarifaTable(); // <-
}

function btnSum(obj){
	var x = document.getElementById("txt"+obj);
	x.value++;
	buildReservaTable();
}
function btnSub(obj){
	var x = document.getElementById("txt"+obj);
	if (x.value>0) x.value--;
	buildReservaTable();
}

function validNum(x){
	var num = parseInt(x.value, 10);
	if (isNaN(num))
		$(x).val(0);
	else
		$(x).val(num);
	buildReservaTable();
}

function buildTarifaTable(){
$("#tableTarifa tr").remove();
    $("#selectTarifa").html('Tarifas para '+prod+':');
    $.ajax({
		url: "data/step4.xml",
		dataType: "xml",
		success: function(data)
		{
			var found = false;
			$(data).find('tarifa').each(function(){
				var prodType = $(this).find('tipoproduto').text();
				if (prodType==prod)
				{
					found = true;
					var type = $(this).find('tipotarifa').text();
					var price = $(this).find('valor').text();
					var idtar = $(this).find('idtarifa').text();
					var tar_txt = "txt" + idtar;
			
					jQuery('<tr/>', {
						class: 'trThing',
						html: '<td>'+type+'</td><td class="lBtn" onclick="btnSub('+idtar+')">-</td><td width="20px"><input id="'+tar_txt+'" type="text" size="2" value="0" onkeyup="validNum('+tar_txt+')"></td><td class="lBtn" onclick="btnSum('+idtar+')">+</td><td>'+price+' &euro;</td>'
					}).appendTo('#tableTarifa');
				}
			});

			if (!found){
				location.href = "#&products";
				alert('O produto escolhido não se encontra disponível.\rPor favor escolha outro produto da lista!');
			}
		}
	});

}

function buildReservaTable(){
	var tn = document.getElementById("tableReserva"+prod);
	if (tn==null){ // Create new Table
		jQuery('<table/>', {
			id: 'tableReserva'+prod,
			class: 'tableReserva',
			html: '<tr><td class="trHead" colspan="5">'+prod+' '+date+' às '+time+'</td></tr>'
		}).appendTo('#divReserva');
		tn = document.getElementById("tableReserva"+prod);
	}
	$(".trReserva"+prod).remove();

	$.ajax({
		url: "data/step4.xml",
		dataType: "xml",
		success: function(data)
		{
			var total = 0;
			$(data).find('tarifa').each(function(){
				if ($(this).find('produto').text()==prod){			
					var idtar = $(this).find('idtarifa').text();
					var type = $(this).find('tipotarifa').text();
					var price = $(this).find('valor').text();
					var ammount = document.getElementById("txt"+idtar).value;
					total += price*ammount;
					
					if (ammount>0)
						jQuery('<tr/>', {
							class: 'trReserva'+prod,
							html: '<td>'+ammount+'</td><td>'+type+'</td><td>'+ammount*price+'&euro;</td><td>('+ammount+' x '+price+'&euro;)</td>'
						}).appendTo(tn);
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