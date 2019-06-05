<?php
define('RESOURCE_CACHE', false);

$inputFigure		= strtolower($_GET["figure"]);
$inputAction		= isset($_GET["action"]) ? strtolower($_GET["action"]) : 'std';
$inputDirection		= isset($_GET["direction"]) ? (int)$_GET["direction"] : 4;
$inputHeadDirection	= isset($_GET["head_direction"]) ? (int)$_GET["head_direction"] : $inputDirection;
$inputGesture		= isset($_GET["gesture"]) ? strtolower($_GET["gesture"]) : 'std';
$inputSize			= isset($_GET["size"]) ? strtolower($_GET["size"]) : 'n';
$inputFormat		= isset($_GET["img_format"]) ? strtolower($_GET["img_format"]) : 'png';
$inputFrame			= isset($_GET["frame"]) ? strtolower($_GET["frame"]) : '0';
$inputHeadOnly		= isset($_GET["headonly"]) ? (bool)$_GET["headonly"] : false;

$inputAction		= explode(",", $inputAction);
$inputFormat		= $inputFormat == "gif" ? "gif" : "png";
$inputFrame			= explode(",", $inputFrame);

$expandedstyle = $inputFigure.".s-".(($inputSize == "s" || $inputSize == "l") ? "n" : $inputSize).($inputHeadOnly ? "h" : "").".g-".$inputGesture.".d-".$inputDirection.".h-".$inputHeadDirection.".a-".implode("-",str_replace("=","",$inputAction)).".f-".implode("-",str_replace("=","",$inputFrame));
$hash = md5($expandedstyle);

$cacheName = dirname(__FILE__)."/resource/cache/avatar_".$hash.".".$inputFormat;

if(RESOURCE_CACHE && file_exists($cacheName)){
	header("Content-Type: image/".$inputFormat."\n\n");
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT\n\n");
	header("Cache-Control: no-cache, must-revalidate\n\n");
	header("Etag: \"".md5_file($cacheName)."\"\n\n");
	echo file_get_contents($cacheName);
	exit;
}else{
	require_once(dirname(__FILE__).'/class.avatarimage.php');
	
	$avatarImage = new AvatarImage($inputFigure, $inputDirection, $inputHeadDirection, $inputAction, $inputGesture, $inputFrame, $inputHeadOnly, $inputSize);
	$image = $avatarImage->Generate($inputFormat);
	
	if($image !== false)
	{
		header('Process-Time: '.$avatarImage->processTime);
		header('Error-Message: '.$avatarImage->error);
		header('Debug-Message: '.$avatarImage->debug);
		header('Generator-Version: '.$avatarImage->version);
		header('Content-Type: image/'.$inputFormat);
		echo $image;
		
		if(RESOURCE_CACHE){
			$fp = fopen($cacheName, "w");
			fwrite($fp, $image);
			fclose($fp);
		}
	}
	exit;
}

?>