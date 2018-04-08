/* METRO UI TEMPLATE
/* Copyright 2012 Thomas Verelst, http://metro-webdesign.info*/
$show = {
	homePagePrepare: function(){ /* Prepare for showing the homepage */
		$("#contentWrapper").fadeOut($page.hideSpeed,function(){
			$page.current = "home";
			$show.homePage();
		}); 
	},
	homePage: function(){
		$("#subNav").hide(); // be sure it's gone
		$("html").css("overflow-x","hidden");		
		$(document).mousedown(function(e){if(e.button==1)return false}); // do not enable middlemouse scroll cause it's uglyyy		
		if(($group.current = inArray($group.titles,$hashed.part.addSpaces())) == -1){
			$group.current = 0;
		}
		document.title = siteTitle+' | '+siteTitleHome;
		
		$("#content").css('margin-left',-$group.spacing*$group.current).html($page.content);// place our new content and be sure it will be shown
		$("#contentWrapper").removeClass("pageContent").fadeIn(300);	
				
		if($group.inactive.opacity==1){ /* Code for effects */
			if($group.showEffect==0){
				$(".tile","#content").each(function(index) {
					var $this = $(this)
					if($this.hasClass("group0")){
						$this.delay(50*index).show(300);
					}else{
						$this.delay(50*index).fadeIn(300);
					}		
				});
			}else if(showEffect==1){
				$(".tile","#content").fadeIn(700);
			}else if(showEffect==2){
				$(".tile","#content").show(700);
			}
		}else{
			$(".tile","#content").not(".group"+$group.current).stop().fadeTo(700,$group.inactive.opacity);
			$(".group"+$group.current,"#content").stop().fadeTo(700,1);
			$(".groupTitle","#content").stop().fadeTo(500,$group.inactive.opacity);
			$(".titleGroup"+$group.current,"#content").stop().fadeTo(500,1);
			if(!$group.inactive.clickable){
				$(".tile","div#content").unbind("click.inactiveTile");
				for(i=0;i<$group.count;i++){ 
					if(i!=$group.current){
						$(function(){
							var name = $group.titles[i];
							$(".group"+i,"#content").bind("click.inactiveTile",function(){
								window.location.href="#&"+name;
								return false;
							});
						});
					}
				}
				$(".tile","#content").not(".group"+$group.current,"#content").addClass("inactiveTile");
			}
		}
		$events.afterTilesAppend();
		$(window).resize();
		setTimeout(function(){; /*wait with the arrows till the tiles are shown */
			/* Some things for responsive webdesign */
			if(mostDown==0){
				for(i=0;i<$group.count;i++){
					var mostRight = -999;
					$(".group"+i,"#content").each(function(){
						var $tile = $(this);
						thisRight = parseInt($tile.css('margin-left'))+$tile.width();
						if(thisRight > mostRight){
							mostRight = thisRight
						}
						var margint= parseInt($tile.css("margin-top"))+$tile.height();
						if(margint>mostDown){
							mostDown=margint;
						}	
					})
					$arrows.rightArray[i]=mostRight;
					if(mostRight-i*$group.spacing+100>$group.widestpx){
						$group.widestpx=mostRight-i*$group.spacing+100;
					}
				}
				$("html, div#contentWrapper").css("min-width",$group.widestpx);			
				$("div#contentWrapper").css("height",mostDown-30);	
			}
			$arrows.place(400); // must ALWAYS happen after ALL tiles are showed! (in this case, tiles after 700ms, arrows after 350+800 ms
		 	$(window).resize(); // check the scrollbars now, same as ^
			$events.afterTilesShow();		
		},701);
		$mainNav.setCurrent();
		$(document).keyup(function (e) { /* Keyboard press to move tilepages */
			switch(e.keyCode) {
				case 37:$group.goLeft();e.preventDefault();break;
				case 39:$group.goRight();e.preventDefault();break;
		  	}
		}).keydown(function(e){ // prevent that the page moves weird when doing longpress
			switch(e.keyCode) {
				case 37:case 39:e.preventDefault();break;
		  	}
		});
	},
	page : function(){/*Will be called when NOT the homepage will be shown */
		$("html").css("overflow-x","auto"); /*show scrollbars */
		$("#contentWrapper").addClass("pageContent").fadeIn(500);
		$content = $("#content").css('margin-left',0).html("<img src='themes/"+theme+"/img/loader.gif' height='24' width='24'/>").fadeIn(700)
		var page, hashReq = $hashed.current.addSpaces()
		if((page = realArrayIndex(pageLink,hashReq)) != -1){//if the page is in the pagelink array
			url = pageLink[page];//get the url
		}else{//else not found
			page=hashReq
			url = hashReq.toLowerCase()+".php";//a try
		}
		menuLink = new Array(); 
		menuColor = new Array();
		$.ajax("pages/"+url).success(function(newContent,textStatus){
			
			$content.stop().fadeOut(50,function(){
				$content.html(newContent);					
				if(window.location.hash.indexOf("&show_all") == -1){
					$("div.sliderContent").hide();	   
				}else{
					$("div.sliderContent").show();
					$("img.sliderImage")
					.attr("src","img/arrows/arrowRight.png")
					.css("transform","rotate(90deg)")
		    		.css("-moz-transform","rotate(90deg)")
				   	.css("-webkit-transform","rotate(90deg)")
				   	.css("-o-transform","rotate(90deg)")
					.css("-ms-transform","rotate(90deg)")
				}
				$content.show($page.showSpeed);
				$subNav.make();
				$("#subNav").stop().fadeIn($page.showSpeed);
				document.title = page+" | "+siteTitle;
				$(window).resize();
				$events.afterSubPageLoad();
				
			});
		}).error(function(){
			page = "Page not Found";
			document.title = page+" | "+siteTitle;
			$content.html("<h2 style='margin-top:0px;'>We're sorry :(</h2>the page you're looking for is not found.").show(400);
			$subNav.make();
		})
		
		document.title = page+" | "+siteTitle;
		$(window).resize();
		$(document).unbind("keydown").unbind("keyup").unbind("mousedown"); // we may scroll with the mouse here // let the keyboard work normal
	}
}
	/*If the window hash changes, we must call another page */
$(window).hashchange(function(){
	$hashed.current =  window.location.hash.replace("!","").replace("#","").replace("/","");
	var hashedParts = $hashed.current.split("&"); 
	$hashed.current = hashedParts[0] //get the hash for the page
	if(hashedParts.length>1){
		$hashed.part = hashedParts[1];
	}else{
		$hashed.part = '';
	}
	if($hashed.current == '' && typeof hashedParts[1] != 'undefined' &&  $page.current != '' &&  $page.current == 'home'){ //was it just a tilegroup switching?
		requestedGroup = inArray($group.titles,hashedParts[1].addSpaces()); // which tilegroup do you want to go?
		if(requestedGroup != $group.current){
			$group.goTo(requestedGroup);
		}else{ // ohw, we are already on that tilegroup, but we'll reload it to not confuse the visitor
			$show.homePagePrepare()		
		}
	}else{		
		if($hashed.current == "home" || $hashed.current == ""){ // if user wants to go home		
			$show.homePagePrepare()
		}else{
			$("#content").fadeOut($page.hideSpeed,function(){
				$show.page($page.current = $hashed.current);	
			});
		}
	}
	$events.onHashChange();
});

/* LOAD THE XML ONTO VARIABLES */
	$.ajax({ url: "data/step1.xml", dataType: "xml", async: false, success: function(data){ $step1 = data; } });
	$.ajax({ url: "data/step2.xml",	dataType: "xml", async: false, success: function(data){ $step2 = data; } });
	$.ajax({ url: "data/step3.xml",	dataType: "xml", async: false, success: function(data){ $step3 = data; } });
	
/*Everything's done, Start the layouting! */
$(document).ready(function(){
	$events.beforeSiteLoad();
	if(enableMobile){ checkMobile(); }

	/*Create the tile content */ 
	$reservas = "";
	$page.content = "<img id='arrowLeft' src='themes/"+theme+"/img/arrows/arrowLeft.png'/><img id='arrowRight' src='themes/"+theme+"/img/arrows/arrowRight.png'/>";	
	for(i=0;i<$group.count;i++){
		var name = $group.titles[i];
		$page.content += "<a class='titleGroup"+i+" groupTitle' style='margin-left:"+(i*$group.spacing)+"px;' href='#&"+name+"'><h3>"+name+"</h3></a>"; /* Add the group title of tileGroups */
	}
	tiles(); // get our tiles into the content
	
	/*Load the requested page */
	$(window).hashchange();
	
	$events.onSiteLoad();
});

function getCookie(c_name){var i,x,y,ARRcookies=document.cookie.split(";");for (i=0;i<ARRcookies.length;i++){x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);x=x.replace(/^\s+|\s+$/g,"");if (x==c_name){return unescape(y);}}}

checkMobile = function(){
	var desktop =  getCookie('desktop'); // check if a cookie with a config is set, if the value = 1, the user wants to force the page to stay at the desktop version			
	var userAgent = navigator.userAgent.toLowerCase();
	var mobile = (/iphone|ipod|android|blackberry|mini|iemobile|windows\sce|palm/i.test(userAgent));
	if (mobile) { // GOT A MOBILE DEVICE    
		 if(desktop=='1'){
			$("body").append("<a href='mobile.php' id='goToMobile'>Mobile Version</a>");	
		}else if ((userAgent.search("android") > -1) && (!(userAgent.search("mobile") > -1)&&!(userAgent.search("opera mobi") > -1)&&!(userAgent.search("mini") > -1))){// TABLET
			mobile=false;
		}else{ // PHONE
			window.location.href="mobile.php"
			$("#content").html("You will be redirected to the mobile site, please wait.");	
		}
	}
}