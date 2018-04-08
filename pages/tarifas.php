<style type="text/css">	
a:hover { color:#900; }

#refImg { position:relative; left:-60px; opacity:0.5; float:left; }
#refImg:hover { opacity:1; }

#divDateTime { padding:10px 20px 50px; display:block; }
#divTarifa,#divReserva { float:left; min-width:350px; margin:1px;}
#divTarifa { padding:0px 50px 10px 20px; text-align:center; }
#divReserva { padding:0px 10px 0px 20px; text-align:right; }

#txtDate2 { float:left; }
#divTimes { float:left; text-align:center; font-size:15px; margin-left:30px; }
.divTime { float:left; background-color:#CCC; padding:1px 20px; margin:3px 10px; border:1px solid #689; cursor:pointer; }

#tableTarifa, .tableReserva { min-width:300px; }
.tableReserva { margin-bottom:5px; }
.tableReserva .trHead { text-align:center; background-color:#900; color:#FFF; border-color:#000; }
#tableTarifa, #tableTarifa td, .tableReserva, .tableReserva td { border-collapse:collapse; border:1px solid; }

.title { font-size:20px; color:#900; text-align:left; }
.goDeep { font-weight:bold; background-color:#FFF; }
.tdOption { width:20px; background-color:#CDE; cursor:pointer; font-weight:bold; }
.tdRemove { cursor:pointer; }
.tableBorder { background-color:#D30 !important; }
.ui-datepicker{ font-size:12px; }
</style>

<!-- CONTENT GOES HERE :) -->

<a id="refImg" href=""><img src="img/arrows/arrowLeft.png"></a>
<h3 id="prodTitle">PRODUCT</h3>
<hr class="light"/>

<div id="divDateTime">
<input type="text" id="txtDate2" size="22" readonly />
<div id="divTimes"></div>
</div>
<div id="divTarifa">
	<p class="title" id="selectTarifa"></p>
	<table id="tableTarifa" title="0"></table>
</div>
<div id="divReserva">
	<p class="title" id="selectReserva">Lista de Reservas:</p>
	<div id="ReservaTables"></div>
</div>

<!-- CONTENT ENDS HERE :) -->

<script type="text/javascript">
	var iHash = location.href.split('&'); // ENCODED
	var DATE, TIME;
	var productDates=new Array();

$(document).ready(function(){
	var PROD = decodeURI(iHash[2]);
	$("#content").css("min-height","600px");
	$("#refImg").attr("href","#&products&"+iHash[1]);
	$("#prodTitle").html("<a href='#&services'>"+decodeURI(iHash[1])+"</a> > "+"<a href='#&products&"+iHash[1]+"'>"+PROD+"</a>");
	$("#selectTarifa").html('Selecione as tarifas para '+PROD+':');
	tablesReload();
	
	$($step2).find('date').each(function(){ // Fill productDates
		var day = $(this).find('day').text();
		$(this).find('availability').each(function(){
			var iProd = $(this).find('product').text();
			if (iProd == PROD)
				productDates.push(day);
		});
	});			

	$("#txtDate2").datepicker({ // Create DatePicker
		showOtherMonths:true,
		selectOtherMonths:true,
		dateFormat: 'DD, dd MM yy',
		beforeShowDay: getDates,
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
		dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		onSelect: updateDate
	});
	if ($("#txtDate").val()){
	$("#txtDate2").datepicker("setDate", $("#txtDate").datepicker("getDate"));
	var d = $("#txtDate2").datepicker("getDate");
	DATE = (d.getDate()+"-"+d.getMonth()+1+"-"+d.getFullYear());
	}
	else
		console.log('datepicker had nothing');
		
	$(".hasDatepicker").on("blur", function(e) { $(this).datepicker("hide"); });

	$(window).resize(function(){
		if ($(window).width()<1040)
			$("#refImg").css("left","-10px");
		else
			$("#refImg").css("left","-60px");
	});
	
	buildTimeTable();
	updateValues();
});

function tablesReload(){
	$("#ReservaTables").sortable({delay:100, distance:30});
	$("#ReservaTables").html("");
	$("#ReservaTables").html($reservas);
	
	$('.tdRemove').on('click', function(){ // Remove Tarifa
		tn = $(this).parent().parent().parent();
		$(this).parent().css('display','none');
		$(this).parent().children('.amm').html('0');
		if ($(tn).find('tr:visible').length<=1) $(tn).fadeOut('fast', function(){ $(this).remove(); });
		updateValues();
		
		var pageContent = String($("#ReservaTables").html());
		if (pageContent.substring(0,6)=="<table")
			$reservas = pageContent;
	});
}

function getDates(d){
	var day = d.getDate(); if (day<10) day = "0"+day;
	var month = (d.getMonth())+1; if (month<10) month = "0"+month;
	dmy = day + "-" + month + "-" + d.getFullYear();
	if ($.inArray(dmy, productDates) != -1)
		return [true,"","Available!"];
	else
		return [false,"","unAvailable."];
}
function updateDate(){
	var d = $("#txtDate2").datepicker("getDate");
	DATE = (d.getDate()+"-"+d.getMonth()+1+"-"+d.getFullYear());
	$("#txtDate").datepicker("setDate", $("#txtDate2").datepicker("getDate"));
	buildTimeTable();
	updateValues();
}
function updateValues(){ // Saves Reserva AMMOUNT on hfValue
	setTimeout(function(){
		$("*").removeClass("tableBorder");
		var x = $("#tableTarifa").attr("title");
		$("#"+x).addClass("tableBorder");
		var ammRes = $("#tableReserva"+x).find(".amm");
		var ammTar = $(".hfValue");
		if (ammRes.length>0)
			for (var i=0;i<ammTar.length;i++)
				ammTar[i].value = ammRes[i].innerHTML;
	},50);
}

function btnSub(obj){
	var hf = document.getElementById("hf"+obj);
	var txt = document.getElementById("txt"+obj);
	if (txt.value>1)
		if (txt.value<=hf.value)
			hf.value = 0;
		else
			hf.value = Number(hf.value) - Number(txt.value);
	else
		if (hf.value>0)
			hf.value--;
	txt.value=1;
	buildReservaTable();
}
function btnSum(obj){
	var hf = document.getElementById("hf"+obj);
	var txt = document.getElementById("txt"+obj);
	if (txt.value>1)
		hf.value = Number(hf.value)+Number(txt.value);
	else
		hf.value++;
	txt.value=1;
	buildReservaTable();
}
function iValidate(x){
	var num = parseInt(x.value, 10);
	if (isNaN(num))
		$(x).val(1);
	else
		$(x).val(num);
}

function buildTimeTable(){
	$(".divTime").remove();

	$($step2).find('date').each(function(){
		var fDay = $(this).find('day').text();
		if (fDay==DATE){
			$(this).find('availability').each(function(){
				var fProd = $(this).find('product').text();
				var fTime = $(this).find('starttime').text();
				if (fProd==decodeURI(iHash[2])){
					jQuery('<div/>', {
						class: 'divTime',
						html: fTime
					}).appendTo('#divTimes');
				}
			});
		}
	});
	
	$('.divTime').first().addClass('goDeep');
	TIME = $('.goDeep:first').html();
	$('.divTime').bind('click', function() {
		$('.divTime').removeClass('goDeep');
		$(this).addClass('goDeep');
		TIME = $(this).html();
		buildTarifaTable();
		updateValues();
	});

	setTimeout(function(){ buildTarifaTable(); },50);	
}
function buildTarifaTable(){
	var PROD = decodeURI(iHash[2]);
	var trID = (PROD+"_"+DATE+"_"+TIME).replace(':','');
	$("#tableTarifa").attr("title",trID);
	$(".trThing").remove();
	
	var found = false;
	$($step3).find('tarifa').each(function(){
		var fProd = $(this).find('tipoproduto').text();
		var fTime = $(this).find('HoraInicio').text();
		if (PROD==fProd && TIME==fTime){
			found = true;
			var fType = $(this).find('tipotarifa').text();
			var fPrice = $(this).find('valor').text();
			var idtar = $(this).find('idtarifa').text();
			var tar_txt = "txt" + idtar;
			var tar_hf = "hf" + idtar;

			jQuery('<tr/>', {
				class: 'trThing',
				html: '<td>'+fType+'</td><td class="tdOption" onclick="btnSub('+idtar+')">-</td><td width="20px"><input class="txtQT" id="'+tar_txt+'" type="text" size="2" value="1" onkeyup="iValidate('+tar_txt+')"><input type="hidden" id="'+tar_hf+'" class="hfValue" value="0"></td><td class="tdOption" onclick="btnSum('+idtar+')">+</td><td>'+fPrice+' &euro;</td>'
			}).appendTo('#tableTarifa');
		}
	});
	if (!found)
		jQuery('<tr/>', {
				class: 'trThing',
				style: 'color:#F00',
				html: '<td>Não existem tarifas para esta data/hora..</td>'
		}).appendTo('#tableTarifa');
}	
function buildReservaTable(){
	var PROD = decodeURI(iHash[2]);
	var trID = (PROD+"_"+DATE+"_"+TIME).replace(':','');
	var tn = document.getElementById("tableReserva"+trID);
	
	var valid = false;
	$($step2).find('date').each(function(){ // Check if VALID DAY
		var fDay = $(this).find('day').text();
		if (fDay==DATE){
			$(this).find('availability').each(function(){	
				if (PROD==$(this).find('product').text())
					valid=true;
			});
		}
	});

	if (valid){
		$('*').removeClass('tableBorder');
		if (tn==null){ // Create new Table
			jQuery('<table/>', {
				id: 'tableReserva'+trID,
				title: trID,
				class: 'tableReserva',
				html: '<tr><td id="'+trID+'" class="trHead" colspan="5">'+PROD+' '+DATE+' às '+TIME+'</td></tr>'
			}).appendTo('#ReservaTables');
			tn = document.getElementById("tableReserva"+trID);
		}
		$(".trReserva"+trID).remove();

		var total = 0;
		$($step3).find('tarifa').each(function(){
			var fProd = $(this).find('produto').text();
			var fTime = $(this).find('HoraInicio').text();
			if (fProd==PROD && fTime==TIME){
				var idtar = $(this).find('idtarifa').text();
				var type = $(this).find('tipotarifa').text();
				var price = $(this).find('valor').text();
				var qt = document.getElementById("hf"+idtar).value;
				total += price*qt;
					if (qt>0)
					jQuery('<tr/>', {
						class: 'trReserva'+trID,
						html: '<td class="amm">'+qt+'</td><td>'+type+'</td><td class="ammt">'+qt*price+'&euro;</td><td>('+qt+' x '+price+'&euro;)</td><td align="center" class="tdRemove">X</td>'
					}).appendTo(tn);
				else
					jQuery('<tr/>', {
						style: 'display:none;',
						class: 'trReserva'+trID,
						html: '<td class="amm">'+qt+'</td><td>'+type+'</td><td class="ammt">'+qt*price+'&euro;</td><td>('+qt+' x '+price+'&euro;)</td><td align="center" class="tdRemove">X</td>'
					}).appendTo(tn);
			}
		});
		if ($(tn).find('tr:visible').length<=1) $(tn).fadeOut('fast', function() { $(tn).remove(); } );
		$('.tdRemove').on('click', function(){ // Remove Tarifa
			$(this).parent().css('display','none');
			$(this).parent().children('.amm').html('0');
			if ($(tn).find('tr:visible').length<=1) $(tn).fadeOut('fast', function(){ $(tn).remove(); });
			updateValues();
		});

		$('#'+trID).addClass('tableBorder');
	}
	else
		alert("The are no available products!!");
	
	var pageContent = String($("#ReservaTables").html());
	if (pageContent.substring(0,6)=="<table")
		$reservas = pageContent;
}
</script>