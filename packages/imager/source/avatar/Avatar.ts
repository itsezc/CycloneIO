import Size from "./utils/size";
import Sizes from './utils/sizes';
import Gestures from "./utils/gestures";
import Action from './utils/action';
import Actions from './utils/actions';
import PartType from './utils/partType';
import PartTypes from './utils/partTypes';
import SetPart from './utils/setPart';
import BodyLocation from "./utils/bodyLocation";

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

	public generate(): void {

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

		for(var part of this.figure.split(".")) {

			const definition = part.split("-");
			const partType: PartType = PartTypes.fromKey(definition[0]);

			if(partType == undefined){
				console.error("Error parttype => " + definition[0]); return;
			}

			if(this.headOnly && partType.getBodyLocation() != BodyLocation.HEAD)
				continue;

			// Check if there is a secondary color available
			if(definition.length >= 3)
				colors.set(partType, Number(definition[2]));

			// Check if there is a secondary color available
			if(definition.length >= 4)
				secondaryColors.set(partType, Number(definition[3]));


			console.log(definition + " => " + partType.getKey());
		}
	}
}