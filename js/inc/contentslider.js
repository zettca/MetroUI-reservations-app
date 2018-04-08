 /* Copyright 2012 Thomas Verelst, http://metro-webdesign.info */
$(".sliderWrapper").each(function(){
	$this = $(this);		
	$this.find(".sliderHead").click(function(){
		$this = $(this).parent();
		$content = $this.find(".sliderContent")
		$img = $this.find(".sliderImage");
		if($this.attr("id")=='closeOther'){
			$(".sliderContent").slideUp(500);
			if(browser<9){$(".sliderImage").attr("src","img/arrows/arrowRight.png")};
			$slider.turn(".sliderImage",0);
		}
		if($content.css("display")=='none'){
			$content.slideDown(500,function(){  
                $("html, body").animate({scrollTop:$this.offset().top},200);
            });
			r=0;
			$slider.turnImageDown();
		}else{
			$content.slideUp(500);
			r=90;
			$slider.turnImageRight();
		}
	});
});
$slider={
	turnImageDown:function(){
  		if(browser<9){$($img).attr("src","img/arrows/arrowBottom.png")};
	    r+=9;
		$slider.turn($img,r);
	    if(r<90){setTimeout('$slider.turnImageDown()',40);}else{setTimeout("$slider.turn($img,90)",40)}
	},
	turnImageRight: function(){
	    r-=9;
		if(browser<9){$($img).attr("src","img/arrows/arrowRight.png")};
	    $slider.turn($img,r);
	    if(r>0){setTimeout('$slider.turnImageRight()',40);}else{setTimeout("$slider.turn($img,0)",40)}
	},
	turn:function(img,r){
	    $(img).css("transform","rotate("+r+"deg)")
	    	.css("-moz-transform","rotate("+r+"deg)")
	    	.css("-webkit-transform","rotate("+r+"deg)")
	    	.css("-o-transform","rotate("+r+"deg)")
			.css("-ms-transform","rotate("+r+"deg)")
	}
}

