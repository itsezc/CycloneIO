from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import Response, HTMLResponse

from avatar import *
from PIL import Image
import io

class Avatar(object):

    def __init__(self, figure: str, size : Size = Sizes.NORMAL, direction: int = 2, head_direction: int = 2, head_only: bool = False, actions:[Action]= [Actions.STAND], gesture:Gestures=Gestures.STANDARD, frame:int = 0, carry_data: int = 0):
        self.__figure: str = figure
        self.__size: Sizes = size
        self.__direction: int = direction
        self.__head_direction: int = head_direction
        self.__head_only: bool = head_only
        self.__actions: [Action] = actions
        self.__gesture: Gestures = gesture
        self.__frame: int = frame
        self.__carry_data: int = carry_data
        self.__body_mirrored = False
        self.__head_mirrored = False
        self.__validated = False
        self.__image = None
        self.validate()

    def validate(self):
        """
        Validate if all settings are correct and adjust if needed when illegal combinations exist.

        Check can only be done once and repeated calls will be ignored.
        """
        if not self.__validated:
            self.__validated = True

        if self.__direction >= 4 and self.__direction <= 6 and self.__direction == self.__head_direction:
            self.__direction = 6 - self.__direction
            self.__head_direction = self.__direction
            self.__body_mirrored = True
            self.__head_mirrored = True

        if self.__head_only or self.__head_direction >= 4 and self.__head_direction <= 6:
            self.__headDirection = 6 - self.__head_direction
            self.__headMirrored = True
            self.__direction = self.__head_direction

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
        if Actions.WALK.value not in self.__actions and Actions.STAND.value not in self.__actions and Actions.LAY not in self.__actions:
            self.__actions.append(Actions.STAND)

    def generate(self, data_loader: AvatarDataLoader):
        # Check if the image has not been generated yet. Generate only once.
        if self.__image is None:

            # Generate a blank transparent canvas
            size = (self.__size.size[0], self.__size.size[1])
            if self.__head_only:
                if self.__size == Sizes.SMALL:
                    size = (30, 27)
                else:
                    size = (62, 52)

            self.__image = Image.new("RGBA", size) #np.zeros(size)[:,:,:-1]=255

            # The figure string will be parsed into the following dictionaries and arrays to store the data for quick access:
            # colors holds all clothing part to color combinations.
            colors: dict = {}
            # colors holds all secondary clothing part to color combinations. (Habbo Club has two toned clothes)
            secondary_colors = dict = {}

            # part_list holds all parts that are used.
            part_list: [SetPart] = []

            # hidden_layers holds all layers that must not be rendered
            hidden_layers: [PartType] = []

            # Split the figure string on '.'. The resulting `part` holds the body part, clothing part id and the colors
            for part in self.__figure.split("."):
                definition = part.split("-")
                part_type = PartTypes.from_key(definition[0])

                # Skip BODY parts when only interested in the head.
                if self.__head_only and part_type.body_location != BodyLocation.HEAD:
                    continue

                # Check if there is a color available.
                if len(definition) >= 3:
                    colors[part_type] = int(definition[2])

                # Check if there is a secondary color available
                if len(definition) >= 4:
                    secondary_colors[part_type] = int(definition[3])

                # Get all clothes for the given body part.
                set: SetType = data_loader.figure_data[part_type]
                if set:
                    # Get the specific clothing set
                    set: Set = set.sets[int(definition[1])]

                set: Set = set
                if set:
                    for k, v in set.parts.items():
                        p : SetPart # Type hinting
                        for p in v:
                            rot_offset_dir = self.__direction if p.type.body_location == BodyLocation.BODY else self.__head_direction
                            if rot_offset_dir in p.type.rotation_offset:
                                clone = p.copy()
                                clone.order += p.type.rotation_offset[rot_offset_dir]
                                part_list.append(clone)
                            else:
                                part_list.append(p)

                        hidden_layers.extend(t for t in set.hidden_layers if t not in hidden_layers)

                if self.__carry_data != 0 and (Actions.CARRY in self.__actions or Actions.DRINK in self.__actions):
                    part_list.append(SetPart(self.__carry_data, PartTypes.RIGHT_HAND_ITEM.value, False, 0, 0))

            part_list.sort(key=lambda x:  x.order)

            p: SetPart
            for p in part_list:
                if p.type in hidden_layers:
                    continue

                if self.__head_only and p.type.body_location != BodyLocation.HEAD:
                    continue

                direction = self.__direction if p.type.body_location == BodyLocation.BODY else self.__head_direction

                name: str = self.__size.prefix +  "_%gesture%_" + str(p.type.key) + "_" + str(p.id) + "_" +  str(direction) + "_" + str(self.__frame)
                data = None

                if p.type == PartTypes.HAIR.value and self.__head_direction - 8 % 8 <= 0:
                    continue

                if self.__gesture != Gestures.STANDARD:
                    part_name = name.replace("%gesture%", self.__gesture.value)
                    if part_name in data_loader.asset_offset_map:
                        data = data_loader.asset_offset_map[part_name]

                if data is None:
                    action: Action = None
                    for action in self.__actions:
                        if action == Actions.CARRY.value and (p.type == PartTypes.LEFT_ARM_LARGE or p.type == PartTypes.LEFT_ARM_SMALL):
                            continue

                        part_name = name.replace("%gesture%", action.value.key)
                        if part_name in data_loader.asset_offset_map:
                            data = data_loader.asset_offset_map[part_name]

                        if data:
                            break

                if data is None:
                    part_name = name.replace("%gesture%", Actions.STAND.value.key)
                    if part_name in data_loader.asset_offset_map:
                        data = data_loader.asset_offset_map[part_name]

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
                    self.__image.alpha_composite(p_img, (draw_x, draw_y))


    def save(self, file_name : str):
        self.__image.save(file_name, "PNG")

    @property
    def image(self):
        return self.__image

from hashlib import sha256
class AvatarImager():

    def __init__(self, app:Starlette):
        self.__avatar_data = AvatarDataLoader()
        self.__help_html = ""

        self.__avatar_data.load()
        self.__load_help()

        @app.route('/habbo-imaging/avatar')
        async def handle(request: Request):
            # Check if there is a figure
            file_name = './cache/' + sha256(request.url.query.encode('utf-8')).hexdigest() + ".png"

            image = None

            if os.path.exists(file_name):
                image = Image.open(file_name).load()

            figure = request.query_params['figure']
            if figure is not None:
                size = Sizes.from_key(request.query_params['size']) if 'size' in request.query_params else Sizes.NORMAL.value
                direction = int(request.query_params['direction']) if 'direction' in request.query_params else 2
                head_direction = int(request.query_params['head_direction']) if 'head_direction' in request.query_params else direction
                head_only = request.query_params['head_direction'] == "1" if 'head_only' in request.query_params else False
                actions: [Action] = []
                carry_item = 0
                if 'action' in request.query_params:
                    param_actions = request.query_params['action'].split(",")

                    for action_key in param_actions:
                        data = action_key.split("=")
                        action: Action = Actions.from_key(data[0])
                        if action is not None and action not in actions:
                            actions.append(action)

                            if action == Actions.CARRY:
                                carry_item = int(data[1])

                gesture = Gestures.STANDARD
                frame = 0

                avatar = Avatar(figure, size, direction, head_direction, head_only, actions, gesture, frame, carry_item)
                avatar.generate(self.__avatar_data)
                avatar.save(file_name)
                image = avatar.image

            with io.BytesIO() as buffer:
                image.save(buffer, format='PNG')
                out = buffer.getvalue()

            return Response(content=out, media_type="image/png")

        @app.route('/habbo-imaging/avatar/help')
        async def handle(request: Request):
            return HTMLResponse(self.__help_html)

    def __load_help(self):

        with open('./resources/pages/imaging_avatar_help.html', 'r') as help_file:
            self.__help_html = help_file.read()

        table = ''
        for action in Actions:
            if isinstance(action.value, Action):  # Skip Anything but Action
                table += "<tr><td>" + action.value.key + "</td><td>" + action.value.description + "</td></tr>\n"

        self.__help_html = self.__help_html.replace("%build_actions%", table)

        table = ''
        for gesture in Gestures:
            table += "<tr><td>" + gesture.value + "</td><td>" + str(gesture) + "</td></tr>\n"
        self.__help_html = self.__help_html.replace("%build_gestures%", table)
