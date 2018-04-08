<?php
/*SEO OPTIMIZATION */
if(isset($_GET['_escaped_fragment_'])){ /* If Google is crawling our pages */
    $bot = true; /* The bot is here! */
	$js = ''; // Mr. Google doesnt like Javascript
    $pages = explode("&",$_GET['_escaped_fragment_']);
	$page = str_replace("_"," ",$pages[0]);
	$page= str_replace("..","",$page);
	$page= str_replace("/","",$page); /* Get the page he wants from the url */
	
	/*Fake our menu for crawling*/
	$links = "<a class='subNavItem' style='background-color:#C33;' href='#!'>Home</a>";
	foreach($pageLink as $i => $name){
		$links .= "<a class='subNavItem' style='background-color:#C33;' href=#!/".str_replace(" ","_",$i).">".$i."</a>";
	}
	$links .=  "<a class='subNavItem' style='background-color:#C33;' href='http://metro-webdesign.info'>Metro UI website template</a>";
	
	$reqUrl = '';
	if($page == "" || $page == "home"){	
		$siteTitle = $siteTitle." | ".$siteTitleHome;		
	}else{
		$f=false;
		foreach($pageLink as $pageTitle=>$url){
			if(strtolower($pageTitle) == strtolower($page)){
				$reqUrl = $url;
				$siteTitle = $pageTitle." | ".$siteTitle;
				$f=true;
				break;
			}
		}
		if(!$f){
			if(file_exists("pages/".strtolower($page).".php")){
				$reqUrl = strtolower($page).".php";
				$siteTitle = $page." | ".$siteTitle;
			}
		}
	}	
}else{$bot = false;}
?>