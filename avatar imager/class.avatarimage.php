<?php
//	
//	Habbo standalone avatar image generator
//	version 1.2.8 / May.10 2015
//	
//	Use example: http://labs.habox.org/generator-avatar
//	
//	This program is free software; you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation; either version 2 of the License, or
//	(at your option) any later version.
//	
//	Copyright 2015 T-Racing Development / coded by Tsuka
//	http://www.t-racing.org
//	

ini_set("display_errors", 0);

define("LITE_RECOLOR_FUNCTION", false);
// Use function fast processing at color subtraction.
// processing speed improves, but there is little difference from the real color.

define("PATH_RESOURCE",	dirname(__FILE__)."/resource/");

class AvatarImage
{
	var $version				= "1.2.8 / May.10 2015";
	var $error					= null;
	var $debug					= null;
	var $settings				= null;
	
	var $format					= "png";
	var $figure					= array();
	var $direction				= 0;
	var $headDirection			= 0;
	var $action					= array("std");	//std, sit, lay, wlk, wav, sit-wav, swm
	var $gesture				= "std";		//std, agr, sml, sad, srp, spk, eyb
	var $frame					= array(0);
	var $isLarge				= false;
	var $isSmall				= false;
	var $isHeadOnly				= false;
	var $rectWidth				= 64;
	var $rectHeight				= 110;
	
	var $handItem				= false;
	var $drawAction				= array(
									"body"		=> "std",
									"wlk"		=> false,
									"sit"		=> false,
									"gesture"	=> false,
									"eye"		=> false,
									"speak"		=> false,
									"itemRight"	=> false,
									"handRight"	=> false,
									"handLeft"	=> false,
									"swm"		=> false
								);
	var $drawOrder				= "std";
	
	function errorHandler($errno, $errstr, $errfile, $errline)
	{
		if(!(error_reporting() & $errno)) return;
		
		$errorType = array (
               E_ERROR				=> 'ERROR',
               E_WARNING			=> 'WARNING',
               E_PARSE				=> 'PARSING ERROR',
               E_NOTICE				=> 'NOTICE',
               E_CORE_ERROR			=> 'CORE ERROR',
               E_CORE_WARNING		=> 'CORE WARNING',
               E_COMPILE_ERROR		=> 'COMPILE ERROR',
               E_COMPILE_WARNING	=> 'COMPILE WARNING',
               E_USER_ERROR			=> 'USER ERROR',
               E_USER_WARNING		=> 'USER WARNING',
               E_USER_NOTICE		=> 'USER NOTICE',
               E_STRICT				=> 'STRICT NOTICE',
               E_RECOVERABLE_ERROR	=> 'RECOVERABLE ERROR'
		);
		
		switch($errno)
		{
			case E_ERROR:
			case E_WARNING:
				$this->error .= $errorType[$errno].": ".$errstr." / Fatal error on line ".$errline." in file ".$errfile."\n";
				break;
			
			default:
				break;
		}
		
		return true;
	}
	
	function AvatarImage($figure, $direction, $headDirection, $action, $gesture, $frame, $isHeadOnly, $scale)
	{
		set_error_handler(array($this, "errorHandler"));
		
		$time_start = microtime(true);
		
		$this->settings	= array(
							"map"			=> $this->getJSON(PATH_RESOURCE."map.json"),
							"figuredata"	=> $this->getJSON(PATH_RESOURCE."figuredata.json"),
							"partsets"		=> $this->getJSON(PATH_RESOURCE."partsets.json"),
							"draworder"		=> $this->getJSON(PATH_RESOURCE."draworder.json"),
							//"animation"		=> $this->getJSON(PATH_RESOURCE."animation.json"),
							//"action"		=> $this->getJSON(PATH_RESOURCE."action.json"),
							//"geometry"		=> $this->getJSON(PATH_RESOURCE."geometry.json"),
							"offset"		=> array()
						);
		
		$this->direction = $this->validateDirection($direction) ? $direction : 0;
		$this->headDirection = $this->validateDirection($headDirection) ? $headDirection : 0;
		
		switch($scale)
		{
			case "l":
				$this->isLarge = true;
				break;
			case "s":
				$this->isSmall = true;
				$this->rectWidth = 32;
				$this->rectHeight = 55;
				break;
			case "n":
			default:
				break;
		}
		if($isHeadOnly)
		{
			$this->isHeadOnly = true;
		}
		
		if(!empty($figure))
		{
			$parts = explode('.', $figure);
			if(count($parts) == 0)
			{
				$time_end = microtime(true);
				$this->processTime = $time_end - $time_start;
				return false;
			}
			
			foreach($parts as $value){
				$data = explode("-", $value);
				array_push($this->figure, array("type"=>$data[0], "id"=>$data[1], "color"=>array((int)$data[2], (int)$data[3])));
			}
			
			$frame = is_array($frame) ? $frame : array($frame);
			foreach($frame as $value){
				$_frame = explode("=", $value);
				$_action = $_frame[0] != "" ? $_frame[0] : "def";
				@$this->frame[$_action] = (int)$_frame[1];
			}
			
			$this->gesture = $gesture;
			switch($this->gesture)
			{
				case "spk":
					$this->drawAction['speak']		= $this->gesture;
					break;
				case "eyb":
					$this->drawAction['eye']		= $this->gesture;
					break;
				case "":
					$this->drawAction['gesture']	= "std";
					break;
				default:
					$this->drawAction['gesture']	= $this->gesture;
					break;
			}
			$this->action = is_array($action) ? $action : array($action);
			foreach($this->action as $value){
				$_action = explode("=", $value);
				switch($_action[0])
				{
					case "wlk":
					case "sit":
						$this->drawAction[$_action[0]]	= $_action[0];
						break;
					case "lay":
						$this->drawAction['body']		= $_action[0];
						$this->drawAction['eye']		= $_action[0];
						list($this->rectWidth, $this->rectHeight) = array($this->rectHeight, $this->rectWidth);
						switch($this->gesture)
						{
							case "spk":
								$this->drawAction['speak']	= "lsp";
								$this->frame[lsp]			= $this->frame[$this->gesture];
								break;
							case "eyb":
								$this->drawAction['eye']		= "ley";
								break;
							case "std":
								$this->drawAction['gesture']	= $_action[0];
								break;
							default:
								$this->drawAction['gesture']	= "l".substr($this->gesture, 0, 2);
								break;
						}
						break;
					case "wav":
						$this->drawAction['handLeft']	= $_action[0];
						break;
					case "crr":
					case "drk":
						$this->drawAction['handRight']	= $_action[0];
						$this->drawAction['itemRight']	= $_action[0];
						$this->handItem					= (int)$_action[1];
						break;
					case "swm":
						$this->drawAction[$_action[0]]	= $_action[0];
						if($this->gesture == "spk")
						{
							$this->drawAction['speak']	= "sws";
						}
						break;
					case "":
						$this->drawAction['body']		= "std";
						break;
					default:
						$this->drawAction['body']		= $_action[0];
						break;
				}
			}
			if($this->drawAction['sit'] == "sit")
			{
				if($this->direction >= 2 && $this->direction <= 4)
				{
					$this->drawOrder = "sit";
					if($this->drawAction['handRight'] == "drk"  && $this->direction >= 2 && $this->direction <= 3)
					{
						$this->drawOrder .= ".rh-up";
					}
					elseif($this->drawAction['handLeft'] && $this->direction == 4)
					{
						$this->drawOrder .= ".lh-up";
					}
				}
			}
			elseif($this->drawAction['body'] == "lay")
			{
				$this->drawOrder = "lay";
			}
			elseif($this->drawAction['handRight'] == "drk"  && $this->direction >= 0 && $this->direction <= 3)
			{
				$this->drawOrder = "rh-up";
			}
			elseif($this->drawAction['handLeft'] && $this->direction >= 4 && $this->direction <= 6)
			{
				$this->drawOrder = "lh-up";
			}
		}
		else
		{
			$this->action = $action;
		}
		
		$time_end = microtime(true);
		$this->processTime = $time_end - $time_start;
		
		return true;
	}
	
	function getJSON($filename)
	{
		return json_decode(file_get_contents($filename), true);
	}
	function HEX2RGB($hex)
	{
		$rgb = array();
		for ($x=0;$x<3;$x++){
			$rgb[$x] = hexdec(substr($hex,(2*$x),2));
		}
		return $rgb;
	}
	function validateDirection($direction)
	{
		return (is_numeric($direction) && $direction >= 0 && $direction <= 7);
	}
	
	function Generate($format = "png")
	{
		$time_start = microtime(true);
		
		$avatarImage = imageCreateTrueColor($this->rectWidth, $this->rectHeight);
		imageAlphaBlending($avatarImage, false);
		imageSaveAlpha($avatarImage, true);
		$rectMask = imageColorAllocateAlpha($avatarImage, 255, 0, 255, 127);
		imageFill($avatarImage, 0, 0, $rectMask);
		
		$activeParts['rect']		= $this->getActivePartSet($this->isHeadOnly ? "head" : "figure", true);
		$activeParts['head']		= $this->getActivePartSet("head");
		$activeParts['eye']			= $this->getActivePartSet("eye");
		$activeParts['gesture']		= $this->getActivePartSet("gesture");
		$activeParts['speak']		= $this->getActivePartSet("speak");
		$activeParts['walk']		= $this->getActivePartSet("walk");
		$activeParts['sit']			= $this->getActivePartSet("sit");
		$activeParts['itemRight']	= $this->getActivePartSet("itemRight");
		$activeParts['handRight']	= $this->getActivePartSet("handRight");
		$activeParts['handLeft']	= $this->getActivePartSet("handLeft");
		$activeParts['swim']		= $this->getActivePartSet("swim");
		
		$drawParts = $this->getDrawOrder($this->drawOrder, $this->direction);
		if($drawParts === false)
		{
			$drawParts = $this->getDrawOrder("std", $this->direction);
		}
		
		$setParts = array();
		foreach($this->figure as $partSet){
			$setParts = array_merge($setParts, $this->getPartColor($partSet['type'], $partSet['id'], $partSet['color']));
		}
		if($this->handItem !== false)
		{
			$setParts["ri"][0] = array("id" => $this->handItem);
		}
		
		imageAlphaBlending($avatarImage, true);
		
		$drawCount = 0;
		foreach($drawParts as $id => $type)
		{
			if(isset($setParts[$type]))
				$drawPartArr = $setParts[$type];
			else
				continue;
			
			foreach($drawPartArr as $drawPart)
			{
				if(isset($setParts['hidden'][$type]))
				{
					continue;
				}
				if(!is_array($drawPart))
				{
					continue;
				}
				if($this->getPartUniqueName($type, $drawPart['id']) == '')
				{
					continue;
				}
				if($this->isHeadOnly && !$activeParts['rect'][$type]['active'])
				{
					continue;
				}
				
				$drawDirection		= $this->direction;
				$drawAction			= false;
				if($activeParts['rect'][$type]['active'])
				{
					$drawAction		= $this->drawAction['body'];
				}
				if($activeParts['head'][$type]['active'])
				{
					$drawDirection	= $this->headDirection;
				}
				if($activeParts['speak'][$type]['active'] && $this->drawAction['speak'])
				{
					$drawAction		= $this->drawAction[speak];
				}
				if($activeParts['gesture'][$type]['active'] && $this->drawAction['gesture'])
				{
					$drawAction		= $this->drawAction['gesture'];
				}
				if($activeParts['eye'][$type]['active'])
				{
					$drawPart['colorable'] = false;
					if($this->drawAction['eye'])
					{
						$drawAction	= $this->drawAction['eye'];
					}
				}
				if($activeParts['walk'][$type]['active'] && $this->drawAction['wlk'])
				{
					$drawAction		= $this->drawAction['wlk'];
				}
				if($activeParts['sit'][$type]['active'] && $this->drawAction['sit'])
				{
					$drawAction		= $this->drawAction['sit'];
				}
				if($activeParts['handRight'][$type]['active'] && $this->drawAction['handRight'])
				{
					$drawAction		= $this->drawAction['handRight'];
				}
				if($activeParts['itemRight'][$type]['active'] && $this->drawAction['itemRight'])
				{
					$drawAction		= $this->drawAction['itemRight'];
				}
				if($activeParts['handLeft'][$type]['active'] && $this->drawAction['handLeft'])
				{
					$drawAction		= $this->drawAction['handLeft'];
				}
				if($activeParts['swim'][$type]['active'] && $this->drawAction['swm'])
				{
					$drawAction		= $this->drawAction['swm'];
				}
				
				if(!$drawAction)
				{
					continue;
				}
				
				$uniqueName = $this->getPartUniqueName($type, $drawPart['id']);
				
				$drawPartRect = $this->getPartResource(
									$uniqueName,
									$drawAction,
									$type,
									$drawPart['id'],
									$drawDirection
								);
				
				$drawCount++;
				
				if($drawPartRect === false)
				{
					$this->debug .= "PART[".$drawAction."][".$type."][".$drawPart['id']."][".$drawDirection."][".$this->getFrameNumber($type, $drawAction, @(int)$this->frame[$drawAction])."]/";
					continue;
				}
				else
				{
					$this->debug .= $drawPartRect['lib'].":".$drawPartRect['name']."(".$drawPartRect['width']."x".$drawPartRect['height'].":".$drawPartRect['offset']['x'].",".$drawPartRect['offset']['y'].")/";
				}
				
				$drawPartRectTransparentColor = imageColorTransparent($drawPartRect['resource']);
				if($drawPart['colorable'])
				{
					$this->setPartColor($drawPartRect['resource'], $drawPart['color']);
				}
				
				$_posX = -$drawPartRect['offset']['x'] + ($this->drawAction['body'] == "lay" ? ($this->rectWidth / 2) : 0);
				$_posY = ($this->rectHeight / 2) - $drawPartRect['offset']['y'] + ($this->drawAction['body'] == "lay" ? ($this->rectHeight / 3.5) : ($this->rectHeight / 2.5));
				if($drawPartRect['isFlip']) $_posX = -($_posX + $drawPartRect['width'] - ($this->rectWidth + 1));
				imageCopy($avatarImage, $drawPartRect['resource'], $_posX, $_posY, 0, 0, $drawPartRect['width'], $drawPartRect['height']);
				
				imageDestroy($drawPartRect['resource']);
			}
		}
		$this->debug .= "DRAWCOUNT: ".$drawCount;
		
		if($this->isLarge)
		{
			$temp = imageCreateTrueColor($this->rectWidth*2, $this->rectHeight*2);
			imageAlphaBlending($temp, false);
			$rectMask = imageColorAllocateAlpha($temp, 255, 0, 255, 127);
			imageSaveAlpha($temp, true);
			$x = ImageCopyResized($temp, $avatarImage, 0, 0, 0, 0, $this->rectWidth*2, $this->rectHeight*2, $this->rectWidth, $this->rectHeight);
			if($x) {
				$avatarImage = $temp;
			}
		}
		
		ob_start();
		if($format == "gif")
		{
			$this->format = "gif";
			$rectMask = imageColorAllocateAlpha($avatarImage, 255, 0, 255, 127);
			imageColorTransparent($avatarImage, $rectMask);
			imageGIF($avatarImage);
		}
		elseif($format == "png")
		{
			$this->format = "png";
			imagePNG($avatarImage);
		}
		else
		{
			ob_end_clean();
			exit;
		}
		$resource = ob_get_contents();
		ob_end_clean();
		imageDestroy($avatarImage);
		
		$time_end = microtime(true);
		$this->processTime += $time_end - $time_start;
		
		return $resource;
	}
	function GeneratePart($partType, $partID, $partColor, $format = "png")
	{
		$time_start = microtime(true);
		
		$this->isHeadOnly = ($partType == "hd");
		
		$avatarImage = imageCreateTrueColor($this->rectWidth, $this->rectHeight);
		imageAlphaBlending($avatarImage, false);
		imageSaveAlpha($avatarImage, true);
		$rectMask = imageColorAllocateAlpha($avatarImage, 255, 0, 255, 127);
		imageFill($avatarImage, 0, 0, $rectMask);
		
		$drawParts = $this->getDrawOrder("std", $this->direction);
		
		$activeParts['rect']	= $this->getActivePartSet($this->isHeadOnly ? "head" : "figure", true);
		$activeParts['eye']		= $this->getActivePartSet("eye");
		
		if($partType == 'ri' || $partType == 'li') {
			$setParts[$partType][0] = array(
					'id'		=> $partID,
					'colorable'	=> false
				);
		}
		else
		{
			$setParts = $this->getPartColor($partType, $partID, $partColor);
		}
		
		imageAlphaBlending($avatarImage, true);
		
		$drawCount = 0;
		foreach($drawParts as $id => $type)
		{
			if(isset($setParts[$type]))
				$drawPartArr = $setParts[$type];
			else
				continue;
			
			foreach($drawPartArr as $drawPart)
			{
				if(!is_array($drawPart))
				{
					continue;
				}
				if($this->getPartUniqueName($type, $drawPart['id']) == '')
				{
					continue;
				}
				if($this->isHeadOnly && !$activeParts['rect'][$type]['active'])
				{
					continue;
				}
				if($activeParts['eye'][$type]['active'])
				{
					$drawPart['colorable'] = false;
				}
				
				$uniqueName = $this->getPartUniqueName($type, $drawPart['id']);
				$drawPartRect = $this->getPartResource(
									$uniqueName,
									$this->action,
									$type,
									$drawPart['id'],
									$this->direction
								);
				
				$drawCount++;
				
				if($drawPartRect === false)
				{
					$this->debug .= "PART[".$this->action."][".$type."][".$drawPart['id']."][".$this->direction."][0]/";
					continue;
				}
				else
				{
					$this->debug .= $drawPartRect['lib'].":".$drawPartRect['name']."(".$drawPartRect['width']."x".$drawPartRect['height'].":".$drawPartRect['offset']['x'].",".$drawPartRect['offset']['y'].")/";
				}
				
				$drawPartRectTransparentColor = imageColorTransparent($drawPartRect['resource']);
				if($drawPart['colorable'])
				{
					$this->setPartColor($drawPartRect['resource'], $drawPart['color']);
				}
				
				$_posX = -$drawPartRect['offset']['x'];
				$_posY = ($this->rectHeight / 2) - $drawPartRect['offset']['y'] + ($this->rectHeight / 2.5);
				if($drawPartRect['isFlip']) $_posX = -($_posX + $drawPartRect['width'] - ($this->rectWidth + 1));
				imageCopy($avatarImage, $drawPartRect['resource'], $_posX, $_posY, 0, 0, $drawPartRect['width'], $drawPartRect['height']);
				
				imageDestroy($drawPartRect['resource']);
			}
		}
		$this->debug .= "DRAWCOUNT: ".$drawCount;
		
		ob_start();
		if($format == "gif")
		{
			$rectMask = imageColorAllocateAlpha($avatarImage, 255, 0, 255, 127);
			imageColorTransparent($avatarImage, $rectMask);
			imageGIF($avatarImage);
		}
		elseif($format == "png")
		{
			imagePNG($avatarImage);
		}
		else
		{
			ob_end_clean();
			exit;
		}
		$resource = ob_get_contents();
		ob_end_clean();
		imageDestroy($avatarImage);
		
		$time_end = microtime(true);
		$this->processTime += $time_end - $time_start;
		
		return $resource;
	}
	function setPartColor(&$resource, $color)
	{
		$replaceColor = $this->HEX2RGB($color);
		if(LITE_RECOLOR_FUNCTION)
		{
			imageFilter($resource, IMG_FILTER_COLORIZE, $replaceColor[0]-255, $replaceColor[1]-255, $replaceColor[2]-255);
		}
		else
		{
			$width		= imageSX($resource);
			$height		= imageSY($resource);
			for($y = 0; $y < $height; $y++)
			{
				for($x = 0; $x < $width; $x++)
				{
					$rgb = imageColorsForIndex($resource, imageColorAt($resource, $x, $y));
					$nr = max(round($rgb['red']		* $replaceColor[0] / 255), 0);
					$ng = max(round($rgb['green']	* $replaceColor[1] / 255), 0);
					$nb = max(round($rgb['blue']	* $replaceColor[2] / 255), 0);
					imageSetPixel($resource, $x, $y, imageColorAllocateAlpha($resource, $nr, $ng, $nb, $rgb['alpha']));
				}
			}
		}
		return true;
	}
	function getColorByPaletteID($paletteID, $colorID)
	{
		$ret = $this->settings['figuredata']['palette'][$paletteID][$colorID]['color'];
		return empty($ret) ? reset($this->settings['figuredata']['palette'][$paletteID])['color'] : $ret;
	}
	function getPartColor($type, $partID, $colorID)
	{
		$ret = array();
		
		$partSet = $this->settings['figuredata']['settype'][$type];
		$cnt = array();
		foreach((array)$partSet['set'][$partID]['part'] as $part)
		{
			$ret[$part['type']][$part['index']] = array(
					'id'		=> $part['id'],
					'colorable'	=> $part['colorable'],
					'color'		=> $this->getColorByPaletteID($partSet['paletteid'], (int)$colorID[(int)$part['colorindex'] -1])
				);
			
			//r63
			if($part['type'] == "ch") {
				$ret["cp"][$part['index']] = $ret[$part['type']][$part['index']];
				$cnt["cp"]++;
				$ret["cc"][$part['index']] = $ret[$part['type']][$part['index']];
				$cnt["cc"]++;
			}
			if($part['type'] == "ls") {
				$ret["lc"][$part['index']] = $ret[$part['type']][$part['index']];
				$cnt["lc"]++;
			}
			if($part['type'] == "rs") {
				$ret["rc"][$part['index']] = $ret[$part['type']][$part['index']];
				$cnt["rc"]++;
			}
		}
		if(is_array($partSet['set'][$partID]['hidden'])) {
			foreach($partSet['set'][$partID]['hidden'] as $key => $parttype){
				$ret['hidden'][$parttype] = true;
			}
		}
		return $ret;
	}
	function getActivePartSet($partSet, $addAttr = false)
	{
		$ret = array();
		
		$activeParts = $this->settings['partsets']['activePartSet'][$partSet]['activePart'];
		if(count($activeParts) == 0) return false;
		$partSetData = $this->settings['partsets']['partSet'];
		foreach($activeParts as $key => $type){
			$ret[$type]['active'] = true;
			if($addAttr)
			{
				$partData = $partSetData[$type];
				$ret[$setType]['remove'] = $partData['remove-set-type'];
				$ret[$setType]['flip'] = $partData['flipped-set-type'];
				$ret[$setType]['swim'] = $partData['swim'];
			}
		}
		return $ret;
	}
	function getDrawOrder($action, $direction)
	{
		$drawOrder = $this->settings['draworder'][$action][$direction];
		if(count($drawOrder) == 0) return false;
		return $drawOrder;
	}
	function getFrameNumber($type, $action, $frame)
	{
		//TODO
		/*
		$frameSet = $this->settings['animation']['action'];
		if($this->getKeyByAttr($frameSet, "id", $action) == -1) return 0;
		$frameSet = $frameSet[$this->getKeyByAttr($frameSet, "id", $action)];
		if(count($frameSet) == 0) return 0;
		$frameSet = $frameSet['part'][$this->getKeyByAttr($frameSet['part'], "set-type", $type)];
		if(count($frameSet) == 0) return 0;
		$data = $this->getAttr($frameSet['frame'][$frame], "number");
		return $data !== false ? $data : 0;
		*/
		return 0;
	}
	function getPartUniqueName($type, $partId)
	{
		$uniqueName = $this->settings['map'][$type][$partId];
		if(empty($uniqueName) && $type == "hrb") $uniqueName = $this->settings['map']["hr"][$partId];
		if(empty($uniqueName)) $uniqueName = $this->settings['map'][$type][1];
		if(empty($uniqueName)) $uniqueName = $this->settings['map'][$type][0];
		$uniqueName = str_replace("_50_", "_", $uniqueName);
		if($this->isSmall && strstr($uniqueName, "hh_human_")) $uniqueName = str_replace("hh_human_", "hh_human_50_", $uniqueName);
		return $uniqueName;
	}
	function getPartResourcePosition($uniqueName, $resourceName, $width = 0)
	{
		if(!isset($this->settings['offset'][$uniqueName]))
			$this->settings['offset'][$uniqueName] = $this->getJSON(PATH_RESOURCE.$uniqueName."/offset.json");
		$ret = array();
		if(isset($this->settings['offset'][$uniqueName][$resourceName]))
			$ret = $this->settings['offset'][$uniqueName][$resourceName];
		else {
			$direction = 6 - (int)substr($resourceName, -3, 1);
			$ret = $this->settings['offset'][$uniqueName][substr_replace($resourceName, $direction, -3, 1)];
			$ret['x'] = 0-($this->rectWidth + $ret['x']) + $width;
		}
		return $ret;
	}
	function buildResourceName($action, $type, $partId, $direction, $frame, $uniqueName = false)
	{
		$resourceName = "";
		
		if($uniqueName) {
			$resourceName .= PATH_RESOURCE.$uniqueName."/".$uniqueName;
			$resourceName .= "_";
		}
		
		$resourceName .= $this->isSmall ? "sh" : "h";
		$resourceName .= "_";
		$resourceName .= $action;
		$resourceName .= "_";
		$resourceName .= $type;
		$resourceName .= "_";
		$resourceName .= $partId;
		$resourceName .= "_";
		$resourceName .= $direction;
		$resourceName .= "_";
		$resourceName .= $frame;
		
		if($uniqueName) {
			$resourceName .= ".png";
		}
		
		return $resourceName;
	}
	function getPartResource($uniqueName, $action, $type, $partId, $direction)
	{
		$frame = $this->getFrameNumber($type, $action, @(int)$this->frame[$action]);
		$isFlip = false;
		
		$resDirection = $direction;
		
		//r63 self alias
		if($type == "hd" && $this->isSmall) $partId = 1;
		if($type == "ey" && $action == "std" && $partId == 1 && $direction == 3) $action = "sml";
		if($type == "fa" && $action == "std" && $partId == 2 && ($direction == 2 || $direction == 4)) $resDirection = 1;
		if($type == "he" && $action == "std" && $partId == 1) {
			if($direction == 2) {
				$resDirection = 0;
			}
			if($direction >= 4 && $direction <= 6) {
				return false;
			}
		}
		if($type == "he" && $action == "std" && $partId == 8) $resDirection = $direction % 2 == 0 ? 1 : $resDirection;
		if($type == "he" && $action == "std" && ($partId == 2131 || $partId == 2132) && ($direction >= 2 && $direction <= 6)) $resDirection = 1;
		if($type == "ha" && $action == "std" && $partId == 2518) $resDirection = $direction % 2 == 0 ? 2 : 1;
		if($type == "ha" && $action == "std" && $partId == 2519) $resDirection = $direction % 2 == 0 ? 2 : 3;
		if($type == "ha" && $action == "std" && $partId == 2588) $resDirection = 7;
		if($type == "ha" && $action == "std" && $partId == 2589) $resDirection = 3;
		if($uniqueName == "acc_chest_U_backpack") $uniqueName = "acc_chest_U_backpack1";
		
		$resourceName  = PATH_RESOURCE.$uniqueName."/".$uniqueName;
		$resourceName .= "_";
		$resourceName .= $this->buildResourceName($action, $type, $partId, $resDirection, $frame);
		$resourceName .= ".png";
		
		if(!file_exists($resourceName) && $action == "std")
			$resourceName = $this->buildResourceName("spk", $type, $partId, $resDirection, $frame, $uniqueName);
		
		/*
		if(!file_exists($resourceName))
		{
			$isFlip = true;
			$direction = 6 - $direction;
			$resourceName = $this->buildResourceName($action, $type, $partId, $direction, $frame, $uniqueName);
		}
		*/
		
		if(!file_exists($resourceName))
		{
			if($direction > 3 && $direction < 7)
			{
				$isFlip = false;
				$flippedType = $this->settings['partsets']['partSet'][$type]['flipped-set-type'];
				if($flippedType != "")
					$resourceName = $this->buildResourceName($action, $flippedType, $partId, $resDirection, $frame, $uniqueName);
				
				if(!file_exists($resourceName) && $action == "std")
					$resourceName = $this->buildResourceName("spk", $flippedType, $partId, $resDirection, $frame, $uniqueName);
				
				if(!file_exists($resourceName))
				{
					$isFlip = true;
					$direction = 6 - $direction;
					$resourceName = $this->buildResourceName($action, $type, $partId, $direction, $frame, $uniqueName);
				}
				
				if(!file_exists($resourceName))
					$resourceName = $this->buildResourceName($action, $flippedType, $partId, $direction, $frame, $uniqueName);
				
				if(!file_exists($resourceName) && $action == "std")
					$resourceName = $this->buildResourceName("spk", $type, $partId, $direction, $frame, $uniqueName);
				
				if(!file_exists($resourceName)) return false;
			}
			else return false;
		}
		
		$resource = imageCreateFromPNG($resourceName);
		imageAlphaBlending($resource, false);
		$rectMask = imageColorAllocateAlpha($resource, 255, 0, 255, 127);
		imageSaveAlpha($resource, true);
		
		$this->setResample($resource, $isFlip);
		
		$resourceBaseName = $this->buildResourceName($action, $type, $partId, $direction, $frame);
		$data = array(
			"resource"	=> $resource,
			"lib"		=> $uniqueName,
			"name"		=> $resourceBaseName,
			"filename"	=> $resourceName,
			"isFlip"	=> $isFlip,
			"width"		=> imageSX($resource),
			"height"	=> imageSY($resource),
			"offset"	=> $this->getPartResourcePosition($uniqueName, $resourceBaseName, imageSX($resource))
		);
		
		return $data;
	}
	function setResample(&$resource, $isFlip)
	{
		$width	= imagesx($resource);
		$height	= imagesy($resource);
		$temp = imageCreateTrueColor($width, $height);
		imageAlphaBlending($temp, false);
		$rectMask = imageColorAllocateAlpha($temp, 255, 0, 255, 127);
		imageSaveAlpha($temp, true);
		$x = imageCopyResampled($temp, $resource, 0, 0, ($isFlip?($width-1):0), 0, $width, $height, ($isFlip?(0-$width):$width), $height);
		if($x)
		{
			$resource = $temp;
		}
		return true;
	}
}

?>