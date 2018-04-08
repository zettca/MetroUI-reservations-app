<?php
/* PLUGIN SYSTEM */
$jsPluginsArray = array("js/inc/plugins.js");
$cssPluginsArray = array();
$plHeader = '';
$plBody = '';
$plContentWrapper = '';
$plSubNavWrapper ='';
$plNav = '';

$folders = glob("plugins/" . "*");
foreach($folders as $folder){
	if(is_dir($folder)){
		if(file_exists($folder."/plugin.js")){
			$jsPluginsArray[] = $folder."/plugin.js";		
		}
		if(file_exists($folder."/plugin.css")){
			$cssPluginsArray[] = $folder."/plugin.css";		
		}
		if(file_exists($folder."/plugin.php")){
			include($folder."/plugin.php");
		}
	}
}

$cssFiles = array_merge($cssFiles,$cssPluginsArray);
$jsFiles = array_merge($jsPluginsArray,$jsFiles);

$css = "";
$js = "";
	foreach($cssFiles as $cssFile){
		$css .= '<link rel="stylesheet" type="text/css" href="'.$cssFile.'" />';
	}
	foreach($jsFiles as $jsFile){
		$js .= '<script type="text/javascript" src="'.$jsFile.'" /></script>';
	}
?>