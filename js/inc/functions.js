/* METRO UI TEMPLATE 
/* Copyright 2012 Thomas Verelst, http://metro-webdesign.info

/* Init some handy vars */
$group.count = $group.titles.length;
$tile.scalespacing = $tile.scale+$tile.spacing;
$group.current = -1;
$group.widestpx = 300;
mostDown = 0;

$page.current = '';
$hashed.current = '';
$hashed.part = ''; // part after & in hash;
$arrows.rightArray = new Array();

prevScroll=0; // no scrollbars now
scrolling = false; // did we just scroll?
mobile=false;

/*Replace spaces by hyphens. ( - )  for TEXT to URL*/
String.prototype.stripSpaces = function(){ return this.replace(/\s/g,"_")}
/*Replace hyphens by spaces, for URL to TEXT */
String.prototype.addSpaces = function(){ return this.replace(/_/g," ")}
/*Case insensitive array search and returns the index of that search in the array */
inArray = function(array,index){var i=array.length;while (i--){if(array[i].toLowerCase()==index.toLowerCase()){return i;}}return -1;}
/* Returns the case sensitive index after a case insensitive index search */
realArrayIndex = function(array,index){for(var i in array){if(i.toLowerCase() == index.toLowerCase()){return i;}}return -1;}

/* Init the navigation arrows */
$(document).on("mouseover","#arrowLeft,#arrowRight",function(){
	$(this).stop(false,true).fadeTo(300,1);
}).on("mouseleave","#arrowLeft,#arrowRight",function(){
	$(this).stop(false,true).fadeTo(300,0.5);
}).on("click","#arrowLeft",function(){
	$group.goLeft();
}).on("click","#arrowRight",function(){
	$group.goRight();
})

/* Place the arrows on the right place*/
$.extend($arrows,{
	place:function(speed){
		$("#arrowLeft,#arrowRight","#content").hide();
		if($group.current!=0){
			$("#arrowLeft","#content").css('margin-left',$group.current*$group.spacing-40).fadeTo(speed,0.5);
		}
		if($group.current!=($group.count-1)){		
			$("#arrowRight","#content").css('margin-left',$arrows.rightArray[$group.current]+12).fadeTo(speed,0.5);
		}
	}
});

/* Init the tile-pages move functions */
$.extend($group, {
	scrollFinished: function(){
		document.title = siteTitle+" | "+$group.titles[$group.current];
		scrolling = false;
		$arrows.place(300);	
	},
	goTo: function(n){
		scrolling = true;
		if(n<0){n=0};
		$("#arrowLeft,#arrowRight","#content").hide();
		$group.current = n;	
		if(browser<10){ // IE 7 8 and 9 cannot use CSS3 animations
			$('#content').stop().animate({"margin-left": -$group.spacing*n}, 500, function(){
				$group.scrollFinished();
			});
		}else{
			setTimeout(function(){
				$group.scrollFinished();
			},500);
			$('#content').css("margin-left",-$group.spacing*n);
		}
		if($group.inactive.opacity==1){ // makes the inactive tilegroups transparent
			$(".group"+n+",.titleGroup"+n ,"#content").stop(true,true).fadeIn(500);
		}else{
			$(".tile,.groupTitle","#content").stop(true,true).fadeTo(500,$group.inactive.opacity);
			$(".group"+n+",.titleGroup"+n,"#content").stop(true,true).fadeTo(500,1);
			if(!$group.inactive.clickable){ // if this function is activatd, clicking on an inactive tilegroup will go to that tilegroup
				$(".tile","#content").unbind("click.inactiveTile");
				for(i=0;i<$group.count;i++){ 
					if(i!=n){
						$(function(){
							var name = $group.titles[i];
							$(".group"+i,"#content").bind("click.inactiveTile",function(){
								window.location.href="#&"+name;
								return false;
							});
						});
					}
				}
				$(".tile","#content").addClass("inactiveTile");
				$(".group"+n,"#content").removeClass("inactiveTile");
			}
		}
		$mainNav.setCurrent();	
	},
	goLeft: function(){
		if($group.current>0){
			 window.location.hash = "&"+$group.titles[$group.current-1].toLowerCase().stripSpaces();
		}else{
			$group.bounce(-1);
		}
	},
	goRight: function(){
		if($group.current+1 < $group.count){
			 window.location.hash = "&"+$group.titles[$group.current+1].toLowerCase().stripSpaces();
		}else{
			$group.bounce(1);
		}
	},
	bounce: function(s){ //gives a bounce effect when there are no pages anymore, s = side: -1 = left, 1 = right
		scrolling = true;
		$('#contentWrapper').stop().animate({'margin-left': "-="+50*s}, 300,'linear')
						    		.animate({'margin-left':  "+="+50*s}, 300,'linear',function(){	
			scrolling = false	
		});	
	}
});
/*For responsize webdesign, content fits the screen*/
$(window).resize(function(){
	if($(window).width()<$group.spacing){ /* Show vertical scrollbars when the window is too small */
			$("html").css("overflow-x","auto");
			$(".tile","#content").not(".group"+$group.current).stop().hide();
			$(".groupTitle","#content").not(".titleGroup"+$group.current).stop().hide();
			prevScroll=1;
	}else{
		if(prevScroll==1){
			prevScroll=0
			$("html").css("overflow-x","hidden");
			$(".tile","#content").not(".group"+$group.current).stop().fadeTo(0,$group.inactive.opacity);
			$(".groupTitle","#content").show();
		}
		$("#subNav").find("a").removeClass("smallSubNav");
	}
	if(parseInt($("#subNav").height())>50){ // when the subNav items dont fit the screen, make their font smaller
		$("#subNav").find("a").addClass("smallSubNav");
	}
	if(parseInt($("#header").height())>100){
		$("#nav").css("float","left");
	}else{
		$("#nav").css("float","right");
	}
	if($(window).height()<Math.max(($(document).height()-4),document.documentElement.clientHeight) || $page.current != 'home' ){	/*Scrolling on pages and home */
		$(document).unbind("mousewheel");	
	}else{
		$(document).bind("mousewheel", function(event, delta) { /* Mouse scroll to move tilepages */		
			if(!scrolling){
				 if(delta>0){
					 $group.goLeft();
				 }else{
					 $group.goRight();
				 }
			}
			event.preventDefault();
		});
	}
	$events.onWindowResize();
});
$subNav={
	make: function(){/* Generates the subnav- menu, makes sub-Navigation items */
		var items = '';
		for(var i in menuLink){
			var l = makeLink(menuLink[i]);
			items += "<a style='background-color:"+menuColor[i]+";' id='subNavI"+menuLink[i].toLowerCase().replace("&","A9M8").stripSpaces()+"' "+l+">"+i+"</a>";
		}
		$("#subNav").html(items);
		$subNav.setCurrent();
	},
	/* highlights current sub-navigation-item */
	setCurrent: function(){
		$("#subNavI"+$hashed.current.toLowerCase().replace("&","A9M8").stripSpaces()).addClass("subNavItemActive");
	}
}
$mainNav={
	setCurrent: function(){
		$(".navItem","#nav").removeClass("navActive");
		if($hashed.part==""){
			$('a[href="#&home"]').addClass("navActive");
		}
		$(".navItem","#nav").each(function(){ /*highlights on the tiles page, we have to do it this way for case-insensitivity*/
			$this = $(this)
			if($this.attr("href").toLowerCase().replace(" ","_")=="#&"+$hashed.part.toLowerCase()){
				$this.addClass("navActive");
			};
		});
	},
	set:function(w){/* Used to manually select the highlighted menu */
		$(".navItem","#nav").removeClass("navActive");
		$("#"+w,"#nav").addClass("navActive");
	}
}
makeLink = function(lp){/* To make valid links */
	var t = '';
	if(lp.substr(0,9) == 'external:'){
		t="target='_blank' ";
		lp = lp.substr(9);
	}
	if(lp.substr(0,9) == 'gotolink:'){
		return t+"href='"+lp.substr(9)+"'";
	}
	if(lp==""){
		return '';
	}
	if(lp.substr(0,7) == "http://" ||
	   lp.substr(0,8) == "https://" ||
	   lp.substr(0,1) == "/" ||
	   lp.substr(0,1) == "#" ||
	   lp[lp.length-1] == "/")
	{
		return t+"href='"+lp+"'";
	}
	return t+"href='#!/"+lp.stripSpaces()+"'";	
}
/*Fired when clicked on any link*/
$(document).on("click","a",function(){
	if(this.href==window.location.href){ // if we're already on the page the user wants to go
		$(window).hashchange(); // just refresh page
	};
});
/* Let the subpage menu work in IE */
if(browser <10){
	$(document).on("mouseenter","#subNav a",function(){
		$(this).stop(true,false).animate({height:28},150);
	}).on("mouseout","#subNav a",function(){
		$(this).animate({height:20},150);
	});
}