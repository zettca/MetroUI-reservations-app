<style type="text/css">	
p.title { font-size:26px; color:#900; }
p { font-size:16px; color:#300; }
a { color:#300; }
a:hover { color:#900; }

.tableReserva { min-width:300px; margin-bottom:10px; }
.tableReserva .trHead { text-align:center; background-color:#900; color:#FFF; border-color:#000; }
.tableReserva, .tableReserva td { border-collapse:collapse; border:1px solid; text-align:right; }

#totals { font-size:16px; margin-top:30px; }
.tdRemove { text-align:center !important; cursor:pointer; }
</style>

<!-- CONTENT GOES HERE :) -->
<p class="title">RESERVAS:</p>
<br>
<div id="tables">RESERVATIONS</div>
<div id="totals">TOTAL A PAGAR: <span id="price"></span></div>
<!-- CONTENT ENDS HERE :) -->

<script>
$mainNav.set('reservas');
$(document).ready(function(){
	getReservas();
});

function getReservas(){
	if ($reservas)
		parseTables();
	else{
		$("#tables").html("<p><a href='#&services' title='make a reservation'>There are no reservations yet. Please make one first!</a></p>");
		$("#totals").hide();
	}
}

function parseTables(){
	$("#totals").show();
	$("#tables").html($reservas);
	
	$('#tables').find('.tableReserva').each(function(){
		$(this).removeAttr('title');
	});
	
	$('.tdRemove').on('click', function(){ // Remove Tarifa
		tn = $(this).parent().parent().parent();
		$(this).parent().css('display','none');
		$(this).parent().children('.amm').html('0');
		$(this).parent().children('.ammt').html('0&euro;');
		
		if ($(tn).find('tr:visible').length<=1)	$(tn).fadeOut('fast', function(){ $(tn).remove(); });
		var pageContent = String($("#tables").html());
		
		if (pageContent.substring(0,6)=="<table")
			$reservas = pageContent;
		setTimeout(function(){ writeTotal(); },200);
	});
	
	writeTotal(); // or somnewutgser
}

function writeTotal(){
	var total=0;
	var ammt = $("#tables").find(".ammt");
	if (ammt.length>0)
		for (var i=0;i<ammt.length;i++){
			var val = ammt[i].innerHTML;
			val = val.substring(0,val.length-1);
			total += Number(val);
		}
	$("#price").html(total+"&euro;");
}
</script>