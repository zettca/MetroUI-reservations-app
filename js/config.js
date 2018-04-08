/* METRO UI TEMPLATE
/* Copyright 2012 Thomas Verelst, http://metro-webdesign.info

/*GENERAL SETTINGS VARS */
$tile.scale = 150;
$tile.spacing = 10;

$group.spacing = 1600; //Space between the first elements of groups of tiles on the homepage.
$group.titles = new Array("Home","Services","Products");
$group.inactive.opacity = 0;//opacity of inactive tiles (0->1)
$group.inactive.clickable  = false; // can users click tiles that are not in the current tileGroup?
$group.showEffect = 1; // 0= each tile one after one, cool effect || 1 = fade in together || 2 = increase size

$page.showSpeed = 400;// how fast the content is fade in
$page.hideSpeed = 300;//how fast should the content fade out when switching pages

jQuery.fx.interval= 30; // Smoothness of effects, higher = less smooth & less CPU utilization. Too low can be choppy! default 25

/*PAGES information: EVERY page on your site that must be opened with the framework must be included here, see tutorial for more information */
pageLink= new Array(); /* the index of pageLink MUST be the pagename (like it will be shown in the titlebar)*/
pageLink['goToCoolMenu'] = 'stuff.php';