/*SLIDESHOW TILE*/
$.plugin($init,{
	nextSlideshow : function(id,dir){
		clearTimeout(timers[id]);
		var $id = $("#"+id);		
		var group=$id.data("group")	
		var speed=$id.data("speed")
		if($page.current=="home" &&   scrolling==false &&((group==$group.current ||group == $group.current+1)||mobile)){//if we're home
			if(!dir)dir=1;
			var lastClick=$id.data("lastClick")
			var slide=$id.data("slide")		
			var speed=$id.data("speed")
			var images=$id.data("images")
			slide = ((slide+2)>images.length) ? 0 : slide+1;			
			switch($id.data("effect")){
				case "fade":
				$("#"+id+"_back").attr("src",$id.attr("src"))
							.stop(true,true).show()
							.fadeOut(500);
				$id.stop(true,true).hide().attr("src",images[slide])
						  .fadeIn(500)
				break;
				case "slide":
				$("#"+id+"_back").attr("src",$("#"+id).attr("src")).css("left",0).stop(true,true).animate({left:dir*$("#"+id).width()},500);
				$($id).attr("src",images[slide]).stop(true,true).css("left",-dir*$("#"+id).width()).animate({left:0},500);
				break;
				case "fadeslide":
				$("#"+id+"_back").attr("src",$("#"+id).attr("src")).css("left",0).stop(true,true).animate({left:dir*$("#"+id).width()},500);
				$($id).hide().attr("src",images[slide]).stop(true,true).fadeIn(600);
				break;
				case "flipvertical":
				$id_back = $("#"+id+"_back");
				var margin =$id.parent().height()/2;
				var height=$id.parent().height();
				var width=$id.parent().width();
				$id_back.css({height:'0px',width:''+width+'px',marginTop:''+margin+'px',opacity:'0.5'});
				$id.stop(true,false).animate({height:'0px',width:''+width+'px',marginTop:''+margin+'px',opacity:'0.5'},400,function(){			
					$id_back.attr("src",$("#"+id).attr("src")).animate({height:''+height+'px',width:''+width+'px',marginTop:'0px',opacity:'1'},400);
				});				
				$id_back.stop(true,false).animate({height:'0px'},400,function(){
					$id.attr("src",images[slide]).animate({height:''+height+'px',width:''+width+'px',marginTop:'0px',opacity:'1'},400);
				});
				break;
				case "fliphorizontal":
				$id_back = $("#"+id+"_back");
				var margin = $id.parent().width()/2;
				var width = $id.parent().width();
				var height=$id.parent().height();
				$id_back.css({width:'0px',height:''+height+'px',marginLeft:''+margin+'px',opacity:'0.5'});
				$id.stop(true,false).animate({width:'0px',height:''+height+'px',marginLeft:''+margin+'px',opacity:'0.5'},400,function(){
					$($id_back).attr("src",$("#"+id).attr("src")).animate({width:''+width+'px',height:''+height+'px',marginLeft:'0px',opacity:'1'},400);
				});
				$id_back.stop(true,false).animate({width:'0px',height:''+height+'px',marginLeft:''+margin+'px',opacity:'0.5'},400,function(){
					$($id).attr("src",images[slide]).animate({width:''+width+'px',height:''+height+'px',marginLeft:'0px',opacity:'1'},400);
				});	
				break;
			}		
			$id.data("slide",slide);
		}
		if(speed!=0){
			timers[id] = window.setTimeout(function(){$init.nextSlideshow(id)},speed);
		}
	}
});
$.plugin($onSiteLoad,{	
	slideShowArrowInit:function(){
		$(document).on("hover","#sl_arrowLeft, #sl_arrowRight",function(){
			$(this).stop().fadeTo(200,1);
		}).on("mouseout","#sl_arrowLeft, #sl_arrowRight",function(){
			$(this).stop().fadeTo(200,0.4);
		}).on("click","#sl_arrowLeft",function(){
			$img = $(this).parent("a").find(".tileSlideshowImage");
			var slide = $img.data("slide");		
			if((slide-1)<0){
				slide=$img.data("images").length-2;
			}else{
				slide-=2;
			}
			$img.data("slide",slide).data("lastClick",new Date().getTime());
			$init.nextSlideshow($img.attr("id"),-1);
		}).on("click","#sl_arrowRight",function(){	
			$img = $(this).parent("a").find(".tileSlideshowImage");
			var slide = $img.data("slide");
			if((slide+1)>$img.data("images").length){
				slide=0;
			}				
			$img.data("slide",slide).data("lastClick",new Date().getTime());
			$init.nextSlideshow($img.attr("id"),1);
		});
	}
});

tileSlideshow = function(group,x,y,width,height,bg,linkPage,speed,arrows,effect,images,labelSettings,optClass){
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
	var sid="slideshow_"+(group+''+x+''+y).replace(/\./g,'_')	
	if(arrows){
		var arrow = '<img id="sl_arrowRight" src="img/arrows/simpleArrowRight.png"><img id="sl_arrowLeft" src="img/arrows/simpleArrowLeft.png">';
	}else{
		var arrow = '';
	}
	$page.content += (
	"<a "+makeLink(linkPage)+" class='tileSlideshow tile group"+group+" "+optClass+"' style=' \
	margin-top:"+((y*$tile.scalespacing)+45)+"px; margin-left:"+(x*$tile.scalespacing+group*$group.spacing)+"px; \
	width: "+(width*($tile.scalespacing)-$tile.spacing)+"px; height:"+(height*($tile.scalespacing)-$tile.spacing)+"px; \
	background:"+bg+";'>\
	<img class='tileSlideshowImageBack' id='"+sid+"_back' src='"+images[0]+"'>\
	<img class='tileSlideshowImage' id='"+sid+"' src='"+images[0]+"' >\
	"+arrow+"\
	"+labelText+"\
	</a>");
	$.plugin($afterTilesAppend,{
		run:function(){
			$("#"+sid).data("slide",0).data("images",images).data("group",group).data("speed",speed).data("effect",effect);	
			$.each(images, function (i, val) {$('<img/>').attr('src', val)})//start prechaching images;	
		}
	});
	timers[sid] = setTimeout(function(){$init.nextSlideshow(sid)},speed); // init this tile	
}