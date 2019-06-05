<?php
define('RESOURCE_CACHE', true);

$inputPartType		= strtolower($_GET["type"]);
$inputPartID		= (int)$_GET["id"];
$inputPartColor		= array((int)$_GET["color_1"], (int)$_GET["color_2"], (int)$_GET["color_3"]);
$inputDirection		= isset($_GET["direction"]) ? (int)$_GET["direction"] : 4;
$inputPartAction	= isset($_GET["action"]) ? strtolower($_GET["action"]) : 'std';
$inputSize			= isset($_GET["size"]) ? strtolower($_GET["size"]) : 'n';
$inputFormat		= isset($_GET["img_format"]) ? strtolower($_GET["img_format"]) : 'png';

$inputFormat		= $inputFormat == "gif" ? "gif" : "png";

$cacheName = dirname(__FILE__)."/resource/cache/part_".$inputSize."_".$inputPartAction."_".$inputPartType."_".$inputPartID."_".implode("-", $inputPartColor)."_".$inputDirection.".".$inputFormat;

if(RESOURCE_CACHE && file_exists($cacheName)){
	header("Content-Type: image/".$inputFormat."\n\n");
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT\n\n");
	header("Cache-Control: no-cache, must-revalidate\n\n");
	header("Etag: \"".md5_file($cacheName)."\"\n\n");
	echo file_get_contents($cacheName);
	exit;
}else{
	require_once(dirname(__FILE__).'/class.avatarimage.php');

	$avatarImage = new AvatarImage("", $inputDirection, $inputDirection, $inputPartAction, "", 0, false, $inputSize);
	$image = $avatarImage->GeneratePart($inputPartType, $inputPartID, $inputPartColor, $inputFormat);
	
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