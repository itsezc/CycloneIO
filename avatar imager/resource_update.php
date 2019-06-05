<?php
//	
//	Habbo SWF figure resource dump Tool
//	version 1.0.3 / May.11 2015
//	
//	This program is free software; you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation; either version 2 of the License, or
//	(at your option) any later version.
//	
//	Copyright 2015 T-Racing Development / coded by Tsuka
//	http://www.t-racing.org
//	

ini_set("display_errors", 1);
set_time_limit(500);

define('OUTPUT_DIRECTORY', dirname(__FILE__).'/resource/');
define('OFFICIAL_RES_URL', "https://www.habbo.com/");
define('FLASH_CLIENT_URL', "https://habboo-a.akamaihd.net/gordon/RELEASE63-201505081320-481389274/");

?>
<!DOCTYPE html>
<html>
<head>
	<style>
	body {
		background-color:#000;
		color:#fff;
		font-family:monospace;
		font-size:12px;
	}
	ul {
		padding:0;
		margin:0;
		display:block;
	}
	ul li {
		display:block;
		height:1em;
		line-height:1em;
		margin:0;
		position:relative;
	}
	ul li.remove-previous-line {
		margin-top:-1em;
	}
	ul li.ta {
		height:auto;
	}
	ul li.ta textarea {
		width:100em;
		height:10em;
	}
	ul li p {
		padding:0;
		margin:0;
		width:100%;
		height:1em;
	}
	ul li p span {
		color:#f88;
	}
	ul li p:last-child {
		background-color:#000;
	}
	</style>
	<script>
		var complete = false;
		var flushingData = function()
		{
			if(document.body) {
				window.scrollTo(0, document.body.scrollHeight);
				removePreviousLine();
			}
			
			if(complete) return;
			
			if(requestAnimationFrame)
				requestAnimationFrame(flushingData);
		};
		flushingData();
		
		var removePreviousLine = function()
		{
			var lines = document.getElementById('console-lines').children;
			for (var i = 0; i < lines.length; i++) {
				if(lines[i].nextSibling != null && lines[i].className == 'remove-previous-line' && lines[i].nextSibling.className == 'remove-previous-line'){
					lines[i].remove();
				}
			}
		};
		window.onload = removePreviousLine;
	</script>
</head>
<body>
<ul id="console-lines">
<?php
ob_end_flush();
ob_start('mb_output_handler');

function consoleLog($message, $prevRemove = false)
{
	$sp = '';
	if($prevRemove) $sp = ' class="remove-previous-line"';
	$message = str_replace("\r", '</p><p>', $message);
	$message = str_replace(" ", '&nbsp;', $message);
	echo '<li'.$sp.'><p>'.$message.'</p></li>';
	ob_flush();
	flush();
}
function consoleLogBlank()
{
	echo '<li class="blank"></li>';
	ob_flush();
	flush();
}
function consoleLogProgressBar($current, $size, $unit = "kb")
{
	$length = (int)(($current/$size)*100);
	$str = sprintf("\r[%-100s] %3d%% (%2d/%2d%s)", str_repeat("=", $length).($length==100?"":">"), $length, ($current/($unit=="kb"?1024:1)), $size/($unit=="kb"?1024:1), " ".$unit);
	consoleLog($str, true);
}
function checkDIR($path)
{
	if(!is_dir($path)) mkdir($path, 0777);
}

function file_get_contents_with_console($filename)
{
	consoleLog("Download: ".$filename);
	
	$ctx = stream_context_create();
	stream_context_set_params($ctx, array("notification" => "stream_notification_callback"));
	
	$data = @file_get_contents($filename, false, $ctx);
	
	if($data !== false) {
		$size = strlen($data);
		consoleLogProgressBar($size, $size);
		consoleLogBlank();
		consoleLogBlank();
		return $data;
	}
	
	$err = error_get_last();
	consoleLog("<span>Error:</span> ".$err["message"]);
	consoleLogBlank();
	return false;
}
function stream_notification_callback($notification_code, $severity, $message, $message_code, $bytes_transferred, $bytes_max) {
	static $filesize = null;
	
	switch($notification_code) {
	case STREAM_NOTIFY_RESOLVE:
	case STREAM_NOTIFY_COMPLETED:
	case STREAM_NOTIFY_AUTH_REQUIRED:
	case STREAM_NOTIFY_FAILURE:
	case STREAM_NOTIFY_AUTH_RESULT:
		break;
	
	case STREAM_NOTIFY_REDIRECTED:
		consoleLog("Being redirected to: ".$message);
		break;
	
	case STREAM_NOTIFY_CONNECT:
		//consoleLog("Connected...");
		break;
	
	case STREAM_NOTIFY_FILE_SIZE_IS:
		$filesize = $bytes_max;
		//consoleLog("Filesize: ".$filesize);
		break;
	
	case STREAM_NOTIFY_MIME_TYPE_IS:
		//consoleLog("Mime-type: ".$message);
		break;
	
	case STREAM_NOTIFY_PROGRESS:
		if ($bytes_transferred > 0) {
			if ($filesize==0) {
				$str = sprintf("\rUnknown filesize.. %2d kb done..", $bytes_transferred/1024);
				consoleLog($str, true);
			} else {
				consoleLogProgressBar($bytes_transferred, $filesize);
			}
		}
		break;
	
	}
}

function ConvertLegacyDrawOrder($filename)
{
	consoleLog("<b>Convert Legacy DrawOrder</b>");
	consoleLogBlank();
	
	$ret = array();
	$xml = simplexml_load_string(file_get_contents_with_console($filename));
	foreach($xml->action as $action)
	{
		$id = (string)$action->attributes()->id;
		$ret[$id] = array();
		foreach($action->direction as $direction)
		{
			$id_c = (int)$direction->attributes()->id;
			$ret[$id][$id_c] = array();
			foreach($direction->partList->part as $part)
			{
				$type = (string)$part->attributes()->{'set-type'};
				$ret[$id][$id_c][] = $type;
				
				//add r63
				if($type == "ls") {
					$ret[$id][$id_c][] = "lc";
				} elseif($type == "ch") {
					$ret[$id][$id_c][] = "cc";
					$ret[$id][$id_c][] = "cp";
				} elseif($type == "rs") {
					$ret[$id][$id_c][] = "rc";
				}
			}
		}
	}
	$json = json_encode($ret);
	file_put_contents(OUTPUT_DIRECTORY."draworder.json", $json);
}
$isLegacyLIB = array();
function ExtractMap($filename)
{
	global $isLegacyLIB;
	consoleLog("<b>Extract FigureMap</b>");
	consoleLogBlank();
	
	$isLegacyLIB = array();
	$map = array();
	$xmlfile = file_get_contents_with_console($filename);
	
	if($xmlfile === false) return false;
	
	$xml = simplexml_load_string($xmlfile);
	foreach($xml->lib as $lib)
	{
		$id = (string)$lib->attributes()->id;
		$swf = FLASH_CLIENT_URL.$id.".swf";
		ExtractSWF($swf);
		
		foreach($lib->part as $part)
		{
			$attr = $part->attributes();
			$map[(string)$attr->type][(string)$attr->id] = $id;
			if(substr($id, 0, 9) == "hh_human_") $isLegacyLIB[(string)$attr->type][(string)$attr->id] = true;
		}
	}
	$json = json_encode($map);
	file_put_contents(OUTPUT_DIRECTORY."map.json", $json);
}
function ExtractCastOffset($xml)
{
	$ret = array();
	foreach($xml->library->assets->asset as $asset)
	{
		$name = (string)$asset->attributes()->name;
		foreach($asset->param as $param)
		{
			if($param->attributes()->key == 'offset')
			{
				$offset = explode(",", (string)$param->attributes()->value);
				$ret[$name] = array('x' => $offset[0], 'y' => $offset[1]);
				break;
			}
		}
	}
	$json = json_encode($ret);
	
	$name = (string)$xml->library->attributes()->name;
	
	$path = OUTPUT_DIRECTORY.$name;
	checkDIR($path);
	file_put_contents($path."/offset.json", $json);
}
function ExtractAvatarAnimation($xml)
{
	$ret = array();
	foreach($xml->action as $action)
	{
		$id = (string)$action->attributes()->id;
		$ret[$id] = array(
				'part'		=> array(),
				'offset'	=> array()
			);
		foreach($action->part as $part)
		{
			$type = (string)$part->attributes()->{'set-type'};
			$ret[$id]['part'][$type] = array();
			foreach($part->frame as $frame)
			{
				$attr = $frame->attributes();
				$ret[$id]['part'][$type][] = array(
						'number'	=> (int)$attr->number,
						'part'		=> (string)$attr->assetpartdefinition,
						'repeat'	=> (int)$attr->repeats
					);
			}
		}
		if(count($action->offsets->frame) > 0)
		{
			foreach($action->offsets->frame as $frame)
			{
				$id_frame = (int)$frame->attributes()->id;
				$ret[$id]['offset'][$id_frame] = array();
				foreach($frame->directions->direction as $direction)
				{
					$id_direction = (int)$direction->attributes()->id;
					$ret[$id]['offset'][$id_frame][$id_direction] = array();
					foreach($direction->bodypart as $bodypart)
					{
						$attr = $bodypart->attributes();
						$ret[$id]['offset'][$id_frame][$id_direction][(string)$attr->id] = array('x' => (int)$attr['dx'], 'y' => (int)$attr['dy']);
					}
				}
			}
		}
	}
	$json = json_encode($ret);
	file_put_contents(OUTPUT_DIRECTORY."animation.json", $json);
}
function ExtractAvatarGeometry($xml)
{
	$ret = array(
			'camera'	=> array(),
			'canvas'	=> array(),
			'avatarset'	=> array(),
			'geometry'	=> array()
		);
	$value_camera = $xml->camera[0];
	$ret['camera'] = array(
			'x'	=> (int)$value_camera->x,
			'y'	=> (int)$value_camera->y,
			'z'	=> (int)$value_camera->z
		);
	foreach($xml->canvas as $canvas)
	{
		$scale = (string)$canvas->attributes()->scale;
		$ret['canvas'][$scale] = array();
		foreach($canvas->geometry as $geometry)
		{
			$attr = $geometry->attributes();
			$ret['canvas'][$scale][(string)$attr->id] = array(
					'width'		=> (int)$attr->width,
					'height'	=> (int)$attr->height,
					'dx'		=> (int)$attr->dx,
					'dy'		=> (int)$attr->dy
				);
		}
	}
	foreach($xml->avatarset[0]->avatarset as $avatarset)
	{
		$id = (string)$avatarset->attributes()->id;
		$ret['avatarset'][$id] = array();
		foreach($avatarset->bodypart as $bodypart)
		{
			$ret['avatarset'][$id][] = (string)$bodypart->attributes()->id;
		}
	}
	foreach($xml->type as $type)
	{
		$id = (string)$type->attributes()->id;
		$ret['geometry'][$id] = array();
		foreach($type->bodypart as $bodypart)
		{
			$attr = $bodypart->attributes();
			$id_c = (string)$attr->id;
			$ret['geometry'][$id][$id_c] = array(
					'x'			=> (int)$attr->x,
					'y'			=> (int)$attr->y,
					'z'			=> (int)$attr->z,
					'radius'	=> (int)$attr->radius
				);
			if(count($bodypart->item) > 0)
			{
				$ret['geometry'][$id][$id_c]['item'] = array();
				foreach($bodypart->item as $item)
				{
					$attr_c = $item->attributes();
					$ret['geometry'][$id][$id_c][(string)$attr_c->id] = array(
							'x'			=> (int)$attr->x,
							'y'			=> (int)$attr->y,
							'z'			=> (int)$attr->z,
							'radius'	=> (int)$attr->radius,
							'nx'		=> (int)$attr->nx,
							'ny'		=> (int)$attr->ny,
							'nz'		=> (int)$attr->nz,
							'double'	=> (int)$attr->double
						);
				}
			}
		}
	}
	$json = json_encode($ret);
	file_put_contents(OUTPUT_DIRECTORY."geometry.json", $json);
}
function ExtractAvatarPartSets($xml)
{
	$ret = array(
			'partSet'		=> array(),
			'activePartSet'	=> array()
		);
	foreach($xml->partSet->part as $part)
	{
		$attr = $part->attributes();
		$ret['partSet'][(string)$attr->{'set-type'}] = array(
				'flipped-set-type'	=> (string)$attr->{'flipped-set-type'},
				'remove-set-type'	=> (string)$attr->{'remove-set-type'},
				'swim'				=> !isset($attr->swim)
			);
	}
	foreach($xml->activePartSet as $activePartSet)
	{
		$id = (string)$activePartSet->attributes()->id;
		$ret['activePartSet'][$id] = array(
				'activePart'	=> array()
			);
		foreach($activePartSet->activePart as $activePart)
		{
			$ret['activePartSet'][$id]['activePart'][] = (string)$activePart->attributes()->{'set-type'};
		}
	}
	$json = json_encode($ret);
	file_put_contents(OUTPUT_DIRECTORY."partsets.json", $json);
}
function ExtractAvatarActions($xml)
{
	$ret = array();
	foreach($xml->action as $action)
	{
		$attr = $action->attributes();
		$id = (string)$attr->id;
		$ret[$id] = array(
				'state'					=> (string)$attr->state,
				'precedence'			=> (int)$attr->precedence,
				'main'					=> (bool)$attr->main,
				'geometrytype'			=> (string)$attr->geometrytype,
				'activepartset'			=> (string)$attr->activepartset,
				'assetpartdefinition'	=> (string)$attr->assetpartdefinition,
				'prevents'				=> explode(',', (string)$attr->prevents),
				'startfromframezero'	=> ((string)$attr_c->startfromframezero == "true"),
				'preventheadturn'		=> ((string)$attr_c->preventheadturn == "true"),
				'animation'				=> (bool)$attr->animation,
				'lay'					=> (string)$attr->lay,
				'isdefault'				=> (bool)$attr->isdefault
			);
		if(count($action->type) > 0)
		{
			$ret[$id]['type'] = array();
			foreach($action->type as $type)
			{
				$attr_c = $type->attributes();
				$ret[$id]['type'][(int)$attr_c->id] = array(
						'animated'			=> ((string)$attr_c->animated != "false"),
						'prevents'			=> explode(',', (string)$attr_c->prevents),
						'preventheadturn'	=> ((string)$attr_c->preventheadturn == "true")
					);
			}
		}
		if(count($action->param) > 0)
		{
			$ret[$id]['param'] = array();
			foreach($action->param as $param)
			{
				$attr_c = $param->attributes();
				$ret[$id]['param'][(string)$attr_c->id] = (int)$attr_c->value;
			}
		}
	}
	$json = json_encode($ret);
	file_put_contents(OUTPUT_DIRECTORY."action.json", $json);
}
function ExtractFigureData($filename, $putname = null)
{
	global $isLegacyLIB;
	
	consoleLog("<b>Extract FigureData</b>");
	consoleLogBlank();
	
	$ret = array(
			'palette'	=> array(),
			'settype'	=> array()
		);
	$xml = file_get_contents_with_console($filename);
	$xml = simplexml_load_string($xml);
	foreach($xml->colors->palette as $palette)
	{
		$id = (int)$palette->attributes()->id;
		$ret['palette'][$id] = array();
		foreach($palette->color as $color)
		{
			$attr = $color->attributes();
			$ret['palette'][$id][(int)$attr->id] = array(
					'index'			=> (int)$attr->index,
					'club'			=> (int)$attr->club,
					'selectable'	=> ((int)$attr->selectable == 1),
					'color'			=> (string)$color
				);
		}
	}
	foreach($xml->sets->settype as $settype)
	{
		$attr = $settype->attributes();
		$type = (string)$attr->type;
		$ret['settype'][$type] = array(
				'paletteid'	=> (int)$attr->paletteid,
				'mand_m_0'	=> ((int)$attr->mand_m_0 == 1),
				'mand_m_1'	=> ((int)$attr->mand_m_1 == 1),
				'mand_f_0'	=> ((int)$attr->mand_f_0 == 1),
				'mand_f_1'	=> ((int)$attr->mand_f_1 == 1),
				'set'		=> array()
			);
		foreach($settype->set as $set)
		{
			$attr_c = $set->attributes();
			$id = (int)$attr_c->id;
			$ret['settype'][$type]['set'][$id] = array(
					'gender'		=> (string)$attr_c->gender,
					'club'			=> (int)$attr_c->club,
					'colorable'		=> ((int)$attr_c->colorable == 1),
					'selectable'	=> ((int)$attr_c->selectable == 1),
					'preselectable'	=> ((int)$attr_c->preselectable == 1),
					'sellable'		=> ((int)$attr_c->sellable == 1),
					'legacy'		=> false,
					'part'			=> array()
				);
			foreach($set->part as $part)
			{
				$attr_c_c = $part->attributes();
				$ret['settype'][$type]['set'][$id]['part'][] = array(
						'type'			=> (string)$attr_c_c->type,
						'id'			=> (int)$attr_c_c->id,
						'colorable'		=> ((int)$attr_c_c->colorable == 1),
						'index'			=> (int)$attr_c_c->index,
						'colorindex'	=> (int)$attr_c_c->colorindex
					);
				if(!empty($isLegacyLIB[(string)$attr_c_c->type][(int)$attr_c_c->id]))
				{
					$ret['settype'][$type]['set'][$id]['legacy'] = true;
				}
			}
			foreach((object)$set->hiddenlayers->layer as $layer)
			{
				$ret['settype'][$type]['set'][$id]['hidden'][] = (string)$layer['parttype'];
			}
		}
	}
	$json = json_encode($ret);
	file_put_contents(OUTPUT_DIRECTORY.(isset($putname)?$putname:"figuredata.json"), $json);
}
$itemSet = array();
function pushItemSet($name)
{
	global $itemSet;
	
	$param = explode('_', $name);
	$type	= $param[4];
	$id		= $param[6];
	
	if(!is_array($itemSet[$type])) $itemSet[$type] = array();
	if(array_search($id, $itemSet[$type]) === false) $itemSet[$type][] = $id;
}
function ExtractItemSet()
{
	global $itemSet;
	
	foreach($itemSet as $type => $parts)
	{
		array_multisort($parts);
		$itemSet[$type] = $parts;
	}
	
	$json = json_encode($itemSet);
	file_put_contents(OUTPUT_DIRECTORY."itemset.json", $json);
}
function ExtractSWF($filename)
{
	$swfID = basename($filename, ".swf");
	consoleLog("<b>Extract SWF: ".$swfID.".swf</b>");
	consoleLogBlank();

	checkDIR(OUTPUT_DIRECTORY.$swfID);
	
	$raw = file_get_contents_with_console($filename);
	
	if($raw === false) return false;
	
	if (substr($raw, 0, 3) == 'CWS') {
		$raw = 'F' . substr($raw, 1, 7) . gzuncompress(substr($raw, 8));
	}
	list(, $file_length) = unpack('V', substr($raw, 4, 4));
	
	$header_length = 8 + 1 + ceil(((ord($raw[8]) >> 3) * 4 - 3) / 8) + 4;
	
	$symbols = [];
	$pngs = [];
	$xmls = [];
	
	consoleLog("Analyzing SWF...");
	for ($cursor = $header_length; $cursor < $file_length; )
	{
		consoleLogProgressBar($cursor, $file_length);
		
		list(, $tag_header) = unpack('v', substr($raw, $cursor, 2));
		$cursor += 2;
		
		list($tag_code, $tag_length) = [$tag_header >> 6, $tag_header & 0x3f];
		
		if ($tag_length == 0x3f) {
			list(, $tag_length) = unpack('V', substr($raw, $cursor, 4));
			$cursor+= 4;
		}
		
		switch ($tag_code) {
			case 36:
				if($swfID != "Habbo")
				{
					$tag = SWFREAD_PNG(substr($raw, $cursor, $tag_length));
					$pngs[$tag['symbol_id']] = $tag['im'];
				}
				break;
			
			case 76:
				$symbols = SWFREAD_SYM(substr($raw, $cursor, $tag_length));
				break;
			
			case 87:
				$tag = SWFREAD_BIN(substr($raw, $cursor, $tag_length));
				$xmls[$tag['symbol_id']] = $tag['data'];
				break;
		}
		
		$cursor+= $tag_length;
	}
	consoleLogProgressBar($file_length, $file_length);
	consoleLogBlank();
	
	consoleLogBlank();
	consoleLog("Analyzing XML...");
	
	$cnt = 0;
	$xmls_length = count($xmls);
	foreach ($xmls as $symbol_id => $xml) {
		$cnt++;
		consoleLogProgressBar($cnt, $xmls_length, "items");
		
		$name = isset($symbols[$symbol_id]) ? $symbols[$symbol_id] : 'symbol_' . $symbol_id;
		
		$_xml = @simplexml_load_string($xml);
		if($_xml !== false) {
			$_name = $_xml->getName();
			if(($_name == "animationSet" || $_name == "geometry" || $_name == "partSets" || $_name == "actions"/* || $_name == "figuredata" || $_name == "offsets"*/) && $swfID == "Habbo") {
				switch($_name)
				{
					case "animationSet":
						$name = "HabboAvatarAnimation";
						ExtractAvatarAnimation($_xml);
						break;
					case "geometry":
						$name = "HabboAvatarGeometry";
						ExtractAvatarGeometry($_xml);
						break;
					case "partSets":
						$name = "HabboAvatarPartSets";
						ExtractAvatarPartSets($_xml);
						break;
					case "actions":
						$name = "HabboAvatarActions";
						ExtractAvatarActions($_xml);
						break;
					case "figuredata":
						$name = "HabboAvatarFigure_".$symbol_id;
						ExtractFigureData($_xml, $name.".json");
				}
			} elseif($_name == "manifest" && $swfID != "Habbo") {
				ExtractCastOffset($_xml);
			}
			//file_put_contents(OUTPUT_DIRECTORY.$swfID.'/'.$name.'.xml', $xml);
		} else {
			//file_put_contents(OUTPUT_DIRECTORY.$swfID.'/'.$name.'.dat', $xml);
		}
	}
	consoleLogBlank();
	
	consoleLogBlank();
	consoleLog("Extracting image cast files...");
	
	$cnt = 0;
	$pngs_length = count($pngs);
	foreach ($pngs as $symbol_id => $png) {
		$cnt++;
		consoleLogProgressBar($cnt, $pngs_length, "images");
		
		$name = isset($symbols[$symbol_id]) ? $symbols[$symbol_id] : 'symbol_' . $symbol_id;
		
		ob_start();
		imagepng($png);
		$image_data = ob_get_contents();
		ob_end_clean();
		file_put_contents(OUTPUT_DIRECTORY.$swfID.'/'.$name.'.png', $image_data);
		
		if(strpos($name, 'hh_human_item_h_') === 0) pushItemSet($name);
		
		//consoleLog('<img src="data:image/png;base64,'.base64_encode($image_data).'"> ');
	}
	consoleLogBlank();
	consoleLogBlank();
}
function SWFREAD_SYM($raw)
{
	list(, $number_of_symbols) = unpack('v', substr($raw, 0, 2));
	$raw = substr($raw, 2);
	for ($symbols = []; strlen($raw); ) {
		extract(unpack('vsymbol_id/Z*symbol_value', $raw));
		$symbols[$symbol_id] = $symbol_value;
		$raw = substr($raw, 2 + strlen($symbol_value) + 1);
	}
	return $symbols;
}
function SWFREAD_BIN($raw)
{
	$length = strlen($raw) - 6;
	return unpack('vsymbol_id/V/Z' . $length . 'data', $raw);
}
function SWFREAD_PNG($raw)
{
	$tag = unpack('vsymbol_id/Cformat/vwidth/vheight', $raw);
	$data = gzuncompress(substr($raw, 7));
	
	if ($tag['format'] != 5) return [];
	
	$im = imageCreateTrueColor($tag['width'], $tag['height']);
	$rectMask = imageColorAllocateAlpha($im, 255, 0, 255, 127);
	imageFill($im, 0, 0, $rectMask);
	for ($y = 0; $y < $tag['height']; $y++) {
		for ($x = 0; $x < $tag['width']; $x++) {
			$alpha = ord($data[$i++]);
			$alpha = 127 - $alpha / 2;
			$red   = ord($data[$i++]);
			$green = ord($data[$i++]);
			$blue  = ord($data[$i++]);
			$color = imageColorAllocateAlpha($im, $red, $green, $blue, $alpha);
			imageSetPixel($im, $x, $y, $color);
		}
	}
	imageSaveAlpha($im, true);
	$tag['im'] = $im;
	return $tag;
}

consoleLog("<b>Habbo SWF figure resource dump Tool</b>");
consoleLogBlank();
consoleLog("OFFICIAL RESOURCE URL : ".OFFICIAL_RES_URL);
consoleLog("FLASH CLIENT URL      : ".FLASH_CLIENT_URL);
consoleLog("OUTPUT PATH           : ".OUTPUT_DIRECTORY);
consoleLogBlank();

ExtractSWF(FLASH_CLIENT_URL."Habbo.swf");
ExtractMap(FLASH_CLIENT_URL."figuremap.xml");
ExtractFigureData(OFFICIAL_RES_URL."gamedata/figuredata/0");
ExtractItemSet();
ConvertLegacyDrawOrder(OUTPUT_DIRECTORY."draworder.xml");

consoleLog("update complete.");

?>
</ul>
<script> complete = true; removePreviousLine(); </script>
</body>
</html>