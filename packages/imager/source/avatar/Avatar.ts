import Size from './utils/size';
import Sizes from './utils/sizes';
import Gestures from './utils/gestures';
import Action from './utils/action';
import Actions from './utils/actions';
import PartType from './utils/partType';
import PartTypes from './utils/partTypes';
import SetPart from './utils/setPart';
import BodyLocation from './utils/bodyLocation';
import AvatarDataLoader from './utils/AvatarDataLoader';
import SetType from './utils/setType';
import ISet from './utils/set';

import fs from 'fs';

export default class Avatar {

	private figure: String;
	private size: Size;
	private direction: number;
	private headDirection: number;
	private headOnly: boolean;
	private actions: Action[];
	private gesture: Gestures;
	private frame: number;
	private carryData: number;

	private bodyMirrored: boolean = false;
	private headMirrored: boolean = false;

	private validated: boolean = false;
	private image: any;

	constructor(figure: String, size: Size = Sizes.NORMAL, direction: number = 2, headDirection: number = 2, headOnly: boolean = false, 
		actions: Action[] = [Actions.STAND], gesture: Gestures = Gestures.STANDARD, frame: number = 0, carryData: number = 0){

		this.figure = figure;
		this.size = size;
		this.direction = direction;
		this.headDirection = headDirection;
		this.headOnly = headOnly;
		this.actions = actions;
		this.gesture = gesture;
		this.frame = frame;
		this.carryData = carryData;

		this.validate();
	}

	private validate(): void {

		if(!this.validated)
			this.validated = true;

		if(this.direction >= 4 && this.direction <= 6 && this.direction == this.headDirection){
			this.direction -= 6;
			this.headDirection = this.direction;
			this.bodyMirrored = true;
			this.headMirrored = true;
		}

		if(this.headOnly || this.headDirection >= 4 && this.headDirection <= 6){
			this.headDirection = 6 - this.headDirection;
			this.headMirrored = true;
			this.direction = this.headDirection;
		}

		/* SKIP: 
		 	# Ignore illegal action combinations
        	# Example:
			#   - LAY and WAVE
			
			verified_actions = []
			for action in self.__actions:
				illegal: bool = False
				if len(verified_actions) != 0:
					for a in verified_actions:
						illegal = action.illegal_combination(a)
						if illegal: break

				if not illegal:
					verified_actions.append(action)

			# Make sure that there is always one of either WALK, STAND or LAY. If not apply STAND.
			if Actions.WALK.value not in self.__actions and Actions.STAND.value not in self.__actions 
		*/
	}

	public generate(avatarDataLoader: AvatarDataLoader): void {

		if(this.image !== undefined) return;

		var size: [number, number] = this.size.getSize();
		if(this.headOnly) {

			if(this.size == Sizes.SMALL) 
				size = [30, 27];
			else size = [62, 52];
		}

		var colors: Map<PartType, number> = new Map();
		var secondaryColors: Map<PartType, number> = new Map();
		var partList: SetPart[] = [];
		var hiddenLayers: PartType[] = [];

		for(var part of this.figure.split('.')) {

			const definition = part.split('-');
			console.log(definition);

			const partType: PartType = PartTypes.fromKey(definition[0]);
			console.log(partType.getKey());

			if(partType == undefined){
				console.error('Error parttype => ' + definition[0]); return;
			}

			if(this.headOnly && partType.getBodyLocation() != BodyLocation.HEAD)
				continue;

			// Check if there is a secondary color available
			if(definition.length >= 3)
				colors.set(partType, Number(definition[2]));

			// Check if there is a secondary color available
			if(definition.length >= 4)
				secondaryColors.set(partType, Number(definition[3]));

			//console.log(avatarDataLoader.getFigureData());

			const setType: SetType = avatarDataLoader.getFigureData().get(partType);
			if(setType === undefined) return;
			
			const set: ISet = setType.getSets().get(Number(definition[1]));
			
			/* if set:
                    # Get the specific clothing set
                    set: Set = set.sets[int(definition[1])]

				set: Set = set*/
				
			if(set){
				
				set.getParts().forEach((setParts, type) => {

					for(var part of setParts){

						const rotOffsetDir: any = part.getType().getBodyLocation() == BodyLocation.BODY ? this.direction : this.headDirection;

						if(part.getType().getRotationOffset().includes(rotOffsetDir)){

							var clone: SetPart = Object.assign({}, part);
							clone.setOrder(clone.getOrder() + part.getType().getRotationOffset()[rotOffsetDir]);
							partList.push(clone);
						} else {
							partList.push(part);
						}
					}

					// #? : hidden_layers.extend(t for t in set.hidden_layers if t not in hidden_layers)
					hiddenLayers = Array.from(new Set([...hiddenLayers, ...set.getHiddenLayers()]));
				})

				if(this.carryData != 0 && (this.actions.includes(Actions.CARRY) || this.actions.includes(Actions.DRINK))){
					partList.push(new SetPart(this.carryData, PartTypes.RIGHT_HAND_ITEM, false, 0, 0));
				}
			}
		}
			
		// #?: part_list.sort(key=lambda x:  x.order)
		partList = partList.sort((a, b) => a.getOrder() - b.getOrder());
		partList.forEach(k => console.log("After: " + k.getId() + " " + k.getType().getKey() + " " + k.getOrder()));

		for(var p of partList){

			if(hiddenLayers.includes(p.getType()))
				continue;
				
			if(this.headOnly && p.getType().getBodyLocation() != BodyLocation.HEAD)
			continue;

			if(p.getType() == PartTypes.HAIR && this.headDirection - 8 % 8 <= 0)
				continue;

			const direction: number = (p.getType().getBodyLocation() == BodyLocation.BODY) ? this.direction : this.headDirection;
			const name: String = this.size.getPrefix() + '_%gesture%_' + p.getType().getKey() + '_' + p.getId() + '_' + direction + '_' + this.frame;
			var data = undefined;

			//console.log("Part: " + p.getId() + " " + p.getType().getKey() + " " + p.getOrder())

			if(this.gesture != Gestures.STANDARD){

				const partName: String = name.replace('%gesture%', this.gesture);
				if(avatarDataLoader.geOffsetMap().has(partName))
					data = avatarDataLoader.geOffsetMap().get(partName);
			}

			if(data == undefined){
				for(var action of this.actions){

					if(action == Actions.CARRY && (p.getType() == PartTypes.LEFT_ARM_LARGE || p.getType() == PartTypes.LEFT_ARM_SMALL))
						continue;

					const partName: String = name.replace('%gesture%', action.getKey());
						
					if(avatarDataLoader.geOffsetMap().has(partName))
						data = avatarDataLoader.geOffsetMap().get(partName);
					else console.log("Offset map key undefined: " + partName);

					if(data) break;
				}
			}

			if(data == undefined){

				const partName: String = name.replace('%gesture%', Actions.STAND.getKey());

				if(avatarDataLoader.geOffsetMap().has(partName))
					data = avatarDataLoader.geOffsetMap().get(partName);
			}

				/*
				if data is not None:
                    part_image: np.ndarray = data[0]
                    if p.type != PartTypes.EYE.value:
                        if (p.type == PartTypes.FACIAL_CONTOURS.value or p.colorable) and (((p.type.coloring_from in colors and p.color_index == 1) or (p.type.coloring_from in secondary_colors and p.color_index == 2)) if p.type.coloring_from is not None else False):
                            contains: bool = colors[p.type.coloring_from] in data_loader.color_map

                            if contains:
                                part_image = (part_image * data_loader.color_map[(colors if p.color_index == 1 else  secondary_colors)[p.type.coloring_from]]).astype(np.uint8)

                    draw_x = data[1][0]
                    draw_y = data[1][1]
                    canvas_height = np.shape(self.__image)[0]
                    canvas_width = np.shape(self.__image)[1]
                    height = part_image.shape[0]
                    width = part_image.shape[1]
                    if (self.__body_mirrored and p.type.body_location == BodyLocation.BODY) or (self.__head_mirrored and p.type.body_location == BodyLocation.HEAD):
                        part_image = np.fliplr(part_image)
                        x_offset = -(2 if self.__size == Sizes.SMALL.value else 12) if self.__head_only else 0
                        y_offset = -(25 if self.__size == Sizes.SMALL.value else 46) if self.__head_only else 0
                        draw_x = canvas_width - width - abs(draw_x)
                        draw_y = canvas_height - height - abs(draw_y)
                    else:
                        draw_x = abs(-draw_x) - ((2 if self.__size == Sizes.SMALL.value else 12) if self.__head_only else 0)
                        draw_y = canvas_height - draw_y - 10 + ((25 if self.__size == Sizes.SMALL.value else 44) if self.__head_only else 0)

                    p_img = Image.fromarray(part_image)
                    self.__image.alpha_composite(p_img, (draw_x, draw_y))*/
				
				

			if(data != undefined){
				console.log(name);
			} else {

				const jsonText = JSON.stringify(Array.from(avatarDataLoader.geOffsetMap().entries()));
				fs.writeFile("logs/offsetMap.json", jsonText, (err) => {
					if(err) console.log(err);
				});

				console.log("error"); break;
			}
		}
	}
}