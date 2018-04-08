tiles = function(){ /*Insert your own tiles here*/

	// TILE GROUP 1 - HOME
	tileTitleText(0,0,0,3,1,'#900','external:http://login.gestoolsasp.com/reservas/','Welcome','Bem-vindo ao Website de Reservas de Serviços da [insert-name]. Made by Bruno Henriques for Expedita.<br><br>Click me to go to GesToolsASP Reservas Page.</p>',['','',''],'');
	tileTitleText(0,0,1,2,1,'#444','#&services','Services','Criar uma nova reserva...',['','',''],'');
	tileTitleText(0,2,1,1,1,'#444','consulta','Listar','Listar as Reservas efectuadas.',['','',''],'');
	
	// TILE GROUP 2 - SERVICES
	var i=0, j=0;
	$($step1).find('resource').each(function(){
		var ref = $(this).attr('reference');
		var desc = $(this).text();
		tileService(1,i,j,2,1,'#900','#&products&'+encodeURI(ref),'img/bg/madeira.jpg',1,"<p>"+desc+"</p>",0.35,[ref,'#800','top']);
		i+=2; if (i>2){ i=0; j++; }
	});
	$page.content += ("<!--SPLITHERE-->")
	
	// TILE GROUP 3 - PRODUCTS
	//loadProducts(); // + Through tha mouse event
}
		
	var iHash = location.href.split('&');
	var HASH = location.href;
	window.onhashchange = hashChanged;
	function hashChanged(){
		iHash = location.href.split('&');
		
		if (iHash[1]=="services") $("#arrowRight").hide();
		else $("#arrowRight").show();
			
		if (iHash[1]=="products") $("#txtDate").fadeIn();
		else $("#txtDate").hide();
		
		if (HASH==location.href) return false;
		HASH = location.href;

		if (iHash[1]=="services") // Reload Page if XML didn't load.
			setTimeout(function(){ if ($(".group1").length==0){ if (iHash[1]=="services") location.reload(); }},2000);

		if (iHash[1]=="products"){
			setTimeout(function(){ if ($(".group2").length==0){ if (iHash[1]=="products") { $("#msgLog").html('Não foram encontrados produtos para '+decodeURI(iHash[2])); $("#txtDate").hide(); } }},1000);
			if (iHash[2]){
				updateProducts();
			}
			else
				setTimeout(function(){ location.href = "#&services"; },60);
		}
		else
			$("#msgLog").html("");
	}
	
function loadProducts(){
	if (iHash[2]!=undefined){
		var d = $("#txtDate").datepicker("getDate");
		var DATE = (d.getDate()+"-"+d.getMonth()+1+"-"+d.getFullYear());
	
		$($step2).find('date').each(function(){ // Create product tiles unrepeated.
			var day = $(this).find('day').text();
			var res = $(this).find('resource').text();
			if (day==DATE){
				var x=0, y=0;
				var Products = new Array();
				var dateInfo = this;
				$(this).find('availability').each(function(){
					var prod = $(this).find('product').text();				
					var res = $(this).find('resource').text();
					var time = $(this).find('starttime').text();
					if (Products.indexOf(prod)==-1){ // new product
						Products.push(prod);
						if (res==decodeURI(iHash[2])){
							var url = "tarifas"+"&"+iHash[2]+"&"+prod;
							var img = "img/bg/caminhada.jpg";
							tileProduct(2,x,y,1,1,"#900",url,img,1,1,[prod,'#900','bottom',dateInfo,true]);
							x++; if (x>4){ x=0; y++; }
						}
					}
				});
			}
		});
		
		$show.homePage();
		
		// txtDate according to productTiles (NEEDS TIMEOUT DELAY)
		//var pos = $(".iProduct:last").offset();
		//$("#txtDate").offset({ top:(pos.top)-28, left:(pos.left)+42 });
		
		setTimeout(function(){ $(".titleGroup2").removeAttr("href").css("cursor","default"); $(".titleGroup2 h3").html(decodeURI(iHash[2])); },50);
	}
}
function updateProducts(){
	$page.content = ($page.content).substring(0,$page.content.indexOf("<!--SPLITHERE-->")+16);
	$show.homePage();
	loadProducts();
}

/*Tile Templates */

tileService = function(group,x,y,width,height,bg,linkPage,img,imgsize,text,slideDistance,labelSettings){
	if(labelSettings!='' && labelSettings[0] != ''){
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		if(labelposition=='top'){
			var labelText ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div></div>";
		}else{
			var labelText ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div></div>";
		}
	}else{
		labelText='';
	}
	tileWidth = width*$tile.scalespacing-$tile.spacing
	tileHeight = height*$tile.scalespacing-$tile.spacing
	$page.content += ("<a "+makeLink(linkPage)+" class='tile group"+group+" iService tileImageSlider' id='"+slideDistance+" ' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px;margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+tileWidth+"px; height:"+tileHeight+"px; \
	background:"+bg+"; text-align:center;'>\
	<div class='tileImageSliderWrapper' style='position:absolute;'>\
	<div style='width: "+tileWidth+"px; height:"+tileHeight+"px;'>\
	<img src='"+img+"' height="+tileHeight*imgsize+" style='margin-top: "+((tileHeight-tileHeight*imgsize)*0.5)+"px'/>\
	</div>\
	<div text='tileImageSliderText'>"+text+"</div>\
	"+labelText+"\
	</div>\
	</a>");
	
	$(document).on("mouseover",'.tileImageSlider',function(){
		$(this).find(".tileImageSliderWrapper").stop(true,false).animate({"margin-top":-$(this).height()*$(this).attr("id")},250,"linear");
	}).on("mouseleave",'.tileImageSlider',function(){
		$(this).find(".tileImageSliderWrapper").stop(true,false).animate({'margin-top':0},300,"linear");
	});
}
tileProduct = function(group,x,y,width,height,bg,linkPage,img,imgSizeWidth,imgSizeHeight,labelSettings){
	if(labelSettings!='' && labelSettings[0] != ''){
		var id= "tileimg_"+(group+''+x+''+y).replace(/\./g,'_')
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		var dateInfo = labelSettings[3];
		var desc='';
		$(dateInfo).find('availability').each(function(){
			var prod = $(this).find('product').text();
			var time = $(this).find('starttime').text();
			if (prod==label)
				desc += time+'<br>';
		});
		desc = desc.substring(0,desc.length-4);
		var showDescOnHover=labelSettings[4];		
		var displayLabel = (showDescOnHover) ? " showOnHover": ""; 
		var labelDescText = (desc!='') ? "<div class='tileLabelDesc "+displayLabel+"'>"+desc+"</div>" : '';	
		
		if(labelposition=='top'){
			var totalLabel ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div>"+labelDescText+"</div>";
		}else{
			
			var totalLabel ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div>"+labelDescText+"</div>";
		}		
		$(function(){
			$.plugin($afterTilesAppend,{
				tileImg:function(){
					var id2 = id;
					if(labelposition=='top'){
						$("."+id2).bind("mouseenter",function(){$(this).find("div.showOnHover").show(200);});
						$("."+id2).bind("mouseleave",function(){$(this).find("div.showOnHover").stop().hide(200);});
					}else{
						$("."+id2).bind("mouseenter",function(){$(this).find("div.showOnHover").css("bottom",0).slideDown(200);});
						$("."+id2).bind("mouseleave",function(){$(this).find("div.showOnHover").css("top",0).stop().slideUp(200);});	
					}
				}
			});
		});
	}else{
		var id="";
		var totalLabel = "";
	}
	var drawHeight = (imgSizeWidth*$tile.scalespacing-$tile.spacing)
	var drawWidth = (imgSizeHeight*$tile.scalespacing-$tile.spacing)
	var tileHeight = (height*$tile.scalespacing-$tile.spacing)
	var tileWidth = (width*$tile.scalespacing-$tile.spacing)
	$page.content += ("<a "+makeLink(linkPage)+" class='tile tileImg group"+group+" "+id+" iProduct' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px ;margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+tileWidth+"px; height:"+tileHeight+"px; \
	background:"+bg+";'>\
	<img src='"+img+"' width="+drawWidth+" height="+drawHeight+" \
	style='margin-left: "+((tileWidth-drawWidth)*0.5)+"px; \
	margin-top: "+((tileHeight-drawHeight)*0.5)+"px'/>\
	"+totalLabel+"\
	</a>");
}

tileTitleText = function(group,x,y,width,height,bg,linkPage,title,text,labelSettings,optClass){
	if(labelSettings!='' && labelSettings[0] != ''){
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		if(labelposition=='top'){
			var labelText ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div></div>";
		}else{
			var labelText ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div></div>";
		}
	}else{
		labelText='';
	}
	$page.content += (
	"<a "+makeLink(linkPage)+" class='tile group"+group+" "+optClass+"' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px; margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+(width*$tile.scalespacing-$tile.spacing)+"px; height:"+(height*$tile.scalespacing-$tile.spacing)+"px; \
	background:"+bg+";'>\
	<div class='tileTitle'>"+title+"</div>\
	<div class='tileDesc'>"+text+"</div>\
	"+labelText+"\
	</a>");
}
tileImg = function(group,x,y,width,height,bg,linkPage,img,imgSizeWidth,imgSizeHeight,labelSettings,optClass){
	if(labelSettings!='' && labelSettings[0] != ''){
		var id= "tileimg_"+(group+''+x+''+y).replace(/\./g,'_')
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		var desc=labelSettings[3];
		var showDescOnHover=labelSettings[4];		
		var displayLabel = (showDescOnHover) ? " showOnHover": ""; 
		var labelDescText = (desc!='') ? "<div class='tileLabelDesc "+displayLabel+"'>"+desc+"</div>" : '';	
		if(labelposition=='top'){
			var totalLabel ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div>"+labelDescText+"</div>";
		}else{
			
			var totalLabel ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div>"+labelDescText+"</div>";
		}		
		$(function(){
			$.plugin($afterTilesAppend,{
				tileImg:function(){
					var id2 = id;
					if(labelposition=='top'){
						$("."+id2).bind("mouseenter",function(){$(this).find("div.showOnHover").show(200);});
						$("."+id2).bind("mouseleave",function(){$(this).find("div.showOnHover").stop().hide(200);});
					}else{
						$("."+id2).bind("mouseenter",function(){$(this).find("div.showOnHover").css("bottom",0).slideDown(200);});
						$("."+id2).bind("mouseleave",function(){$(this).find("div.showOnHover").css("top",0).stop().slideUp(200);});	
					}
				}
			});
		});
	}else{
		var id="";
		var totalLabel = "";
	}
	var drawHeight = (imgSizeWidth*$tile.scalespacing-$tile.spacing)
	var drawWidth = (imgSizeHeight*$tile.scalespacing-$tile.spacing)
	var tileHeight = (height*$tile.scalespacing-$tile.spacing)
	var tileWidth = (width*$tile.scalespacing-$tile.spacing)
	$page.content += ("<a "+makeLink(linkPage)+" class='tile tileImg group"+group+" "+id+" "+optClass+"' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px ;margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+tileWidth+"px; height:"+tileHeight+"px; \
	background:"+bg+";'>\
	<img src='"+img+"' width="+drawWidth+" height="+drawHeight+" \
	style='margin-left: "+((tileWidth-drawWidth)*0.5)+"px; \
	margin-top: "+((tileHeight-drawHeight)*0.5)+"px'/>\
	"+totalLabel+"\
	</a>");
}
tileTitleTextImage = function(group,x,y,width,height,bg,linkPage,title,text,img,imgSize,imgToTop,imgToLeft,labelSettings,optClass){ 
	if(labelSettings!='' && labelSettings[0] != ''){
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		if(labelposition=='top'){
			var labelText ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div></div>";
		}else{
			var labelText ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div></div>";
		}
	}else{
		labelText='';
	}
	$page.content += (
	"<a "+makeLink(linkPage)+" class='tile group"+group+" "+optClass+"' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px;margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+(width*$tile.scalespacing-$tile.spacing)+"px; height:"+(height*$tile.scalespacing-$tile.spacing)+"px; \
	background:"+bg+";'>\
	<img style='float:left; margin-top:"+imgToTop+"px;margin-left:"+imgToLeft+"px;' src='"+img+"' height="+imgSize+" width="+imgSize+"/> \
	<div class='tileTitle' style='margin-left:"+(imgSize+5+imgToLeft)+"px;'>"+title+"</div>\
	<div class='tileDesc' style='margin-left:"+(imgSize+6+imgToLeft)+"px;'>"+text+"</div>\
	"+labelText+"\
	</a>");
}
tileLive = function(group,x,y,width,height,bg,linkPage,title,img,imgSize,imgToTop,imgToLeft,speed,textArray,labelSettings,optClass){
	if(labelSettings!='' && labelSettings[0] != ''){
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		if(labelposition=='top'){
			var labelText ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div></div>";
		}else{
			var labelText ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div></div>";
		}
	}else{
		labelText='';
	}
	var id= "livetile_"+(group+''+x+''+y).replace(/\./g,'_')
	if(img!=''){
		imgInsert = "<img style='float:left; margin-top:"+imgToTop+"px;margin-left:"+imgToLeft+"px;' src='"+img+"' height="+imgSize+" width="+imgSize+"/>"
	}else{
		imgInsert = '';
		imgSize = 0;
		imgToLeft = 0;
	}
	$page.content += (
	"<a "+makeLink(linkPage)+" class='tile group"+group+" "+optClass+"' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px; margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+(width*$tile.scalespacing-$tile.spacing)+"px; height:"+(height*$tile.scalespacing-$tile.spacing)+"px; \
	background:"+bg+";'>\
	"+imgInsert+"\
	<div class='tileTitle' style='margin-left:"+(imgSize+5+imgToLeft)+"px;'>"+title+"</div>\
	<div class='livetile' style='margin-left:"+(imgSize+10+imgToLeft)+"px;' id='"+id+"' >"+textArray[0]+"</div>\
	"+labelText+"\
	</a>");
	setTimeout(function(){newLiveTile(id,group,textArray,speed,0)},speed); // init this tile
}
tileImageSlider = function(group,x,y,width,height,bg,linkPage,img,imgsize, text,slideDistance,labelSettings,optClass){
	if(labelSettings!='' && labelSettings[0] != ''){
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		if(labelposition=='top'){
			var labelText ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div></div>";
		}else{
			var labelText ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div></div>";
		}
	}else{
		labelText='';
	}
	tileWidth = width*$tile.scalespacing-$tile.spacing
	tileHeight = height*$tile.scalespacing-$tile.spacing
	$page.content += ("<a "+makeLink(linkPage)+" class='tile group"+group+" "+optClass+" tileImageSlider' id='"+slideDistance+" ' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px;margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+tileWidth+"px; height:"+tileHeight+"px; \
	background:"+bg+"; text-align:center;'>\
	<div class='tileImageSliderWrapper' style='position:absolute;'>\
	<div style='width: "+tileWidth+"px; height:"+tileHeight+"px;'>\
	<img src='"+img+"' height="+tileHeight*imgsize+" style='margin-top: "+((tileHeight-tileHeight*imgsize)*0.5)+"px'/>\
	</div>\
	<div text='tileImageSliderText'>"+text+"</div>\
	"+labelText+"\
	</div>\
	</a>");
	$(document).on("mouseover",'.tileImageSlider',function(){
		$(this).find(".tileImageSliderWrapper").stop(true,false).animate({"margin-top":-$(this).height()*$(this).attr("id")},250,"linear");
	}).on("mouseleave",'.tileImageSlider',function(){
		$(this).find(".tileImageSliderWrapper").stop(true,false).animate({'margin-top':0},300,"linear");
	});
	
}
tileCustom = function(group,x,y,width,height,bg,linkPage,content,labelSettings,optClass){
	if(labelSettings!='' && labelSettings[0] != ''){
		var label=labelSettings[0];
		var labelcolor=labelSettings[1];
		var labelposition=labelSettings[2];
		if(labelposition=='top'){
			var labelText ="<div class='tileLabelWrapper top' style='border-top-color:"+labelcolor+";'><div class='tileLabel top' >"+label+"</div></div>";
		}else{
			var labelText ="<div class='tileLabelWrapper bottom'><div class='tileLabel bottom' style='border-bottom-color:"+labelcolor+";'>"+label+"</div></div>";
		}
	}else{
		labelText='';
	}
	$page.content += (
	"<a "+makeLink(linkPage)+" class='tile group"+group+" "+optClass+"' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px;margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+(width*$tile.scalespacing-$tile.spacing)+"px; height:"+(height*$tile.scalespacing-$tile.spacing)+"px; \
	background:"+bg+";'>\
	"+content+"\
	"+labelText+"\
	</a>");
}