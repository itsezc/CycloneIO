from enum import Enum

class Action():

    def __init__(self, key: str, description: str):
        self.__key: str = key
        self.__description: str = description

    @property
    def key(self) -> str:
        return self.__key

    @property
    def description(self) -> str:
        return self.__description

    def illegal_combination(self, action_two):
        return Actions.illegal_combination(self, action_two)

class Actions(Enum):

    CARRY = Action("crr", "Carry an item")
    DRINK = Action("drk", "Drink an item")
    STAND = Action("std", "Stand, default")
    SIT = Action("sit", "Sit on the floor")
    LAY = Action("lay", "Lay on the floor")
    WALK = Action("wlk", "Taking a step")
    WAVE = Action("wav", "Waving")

    ILLEGAL_MAPPING = {}
    ILLEGAL_MAPPING[STAND] = [SIT, LAY, WALK]
    ILLEGAL_MAPPING[SIT] = [STAND, LAY, WALK]
    ILLEGAL_MAPPING[LAY] = [STAND, SIT, WALK, WAVE]
    ILLEGAL_MAPPING[WALK] = [STAND, SIT, LAY]
    ILLEGAL_MAPPING[WAVE] = [LAY]

    @staticmethod
    def illegal_combination(action_one, action_two) -> bool:
        if action_one in Actions.ILLEGAL_MAPPING.value:
            illegals = Actions.ILLEGAL_MAPPING.value[action_one]
            if action_two in illegals:
                return True

        return False

    @staticmethod
    def from_key(key: str) -> Action:
        for action in Actions:
            if isinstance(action.value, Action) and action.value.key == key:
                return action
        return None

class Gestures(Enum):
    STANDARD = "std"
    SMILE = "sml"
    SAD = "sad"
    ANGRY = "agr"
    SURPRISED = "srp"
    EYEBLINK = "eyb"
    SPEAK = "spk"

    @staticmethod
    def from_key(key: str):
        for gesture in Gestures:
            if gesture.value == key:
                return gesture
        return None

import copy
class Size():

    def __init__(self, key: str, prefix: str, resize_factor: int, size: [int]):
        self.__key: str = key
        self.__prefix: str = prefix
        self.__resize_factor: int = resize_factor
        self.__size: [int] = size

    @property
    def key(self) -> str:
        return self.__key

    @property
    def prefix(self) -> str:
        return self.__prefix

    @property
    def resize_factor(self) -> int:
        return self.__resize_factor

    @property
    def size(self) -> [int]:
        return self.__size

    def copy(self):
        return copy.copy(self)

class Sizes(Enum):
    SMALL = Size("s", "sh", 1, (33, 56))
    NORMAL = Size("m", "h", 1, (64, 110))
    LARGE = Size("l", "h", 2, (64, 110))
    XLARGE = Size("xl", "h", 3, (64, 110))

    @staticmethod
    def from_key(key: str) -> Size:
        for size in Sizes:
            if isinstance(size.value, Size) and size.value.key == key:
                return size

        return Sizes.NORMAL

class BodyLocation(Enum):

    BODY = "body"
    HEAD = "head"

class PartType:

    def __init__(self, key: str, body_location: BodyLocation, order: int, coloring_from):
        self.__key: str = key
        self.__order: int = order
        self.__body_location: BodyLocation = body_location
        self.__coloring_from = coloring_from
        self.rotation_offset: dict = {}

    @property
    def key(self) -> str:
        return self.__key

    @property
    def order(self) -> int:
        return self.__order

    @property
    def body_location(self) -> BodyLocation:
        return self.__body_location

    @property
    def coloring_from(self):
        if self.__coloring_from is not None:
            return self.__coloring_from

        return self

class SetPart:

    def __init__(self, id: int, type: PartType, colorable: bool, index: int, color_index: int):
        self.__id: int = id
        self.__type: PartType = type
        self.__colorable: bool = colorable
        self.__index: int = index
        self.__color_index: int = color_index
        self.__order: int = self.__type.order

    @property
    def id(self) -> int:
        return self.__id

    @property
    def type(self) -> PartType:
        return self.__type

    @property
    def colorable(self) -> bool:
        return self.__colorable

    @property
    def index(self) -> int:
        return self.__index

    @property
    def color_index(self) -> int:
        return self.__color_index

    @property
    def order(self) -> int:
        return self.__order

    @order.setter
    def order(self, order) -> None:
        self.__order = order

    def copy(self):
        return copy.copy(self)

class PartTypes(Enum):

    SHOES = PartType("sh", BodyLocation.BODY, 5, None)
    LEGS = PartType("lg", BodyLocation.BODY, 6, None)
    CHEST = PartType("ch", BodyLocation.BODY, 7, None)
    WAIST = PartType("wa", BodyLocation.BODY, 8, None)
    CHEST_ACCESSORY = PartType("ca", BodyLocation.BODY, 9, None)
    FACE_ACCESSORY = PartType("fa", BodyLocation.HEAD, 27, None)
    EYE_ACCESSORY = PartType("ea", BodyLocation.HEAD, 28, None)
    HEAD_ACCESSORY = PartType("ha", BodyLocation.HEAD, 29, None)
    HEAD_EXTRA = PartType("he", BodyLocation.HEAD, 20, None)
    CHEST_COVER = PartType("cc", BodyLocation.BODY, 21, None)
    CHEST_PIECE = PartType("cp", BodyLocation.BODY, 6, None)
    HEAD = PartType("hd", BodyLocation.HEAD, 22, None)
    BODY = PartType("bd", BodyLocation.BODY, 1, HEAD)
    FACIAL_CONTOURS = PartType("fc", BodyLocation.HEAD, 23, HEAD)
    HAIR = PartType("hr", BodyLocation.HEAD, 24, None)
    LEFT_ARM_LARGE = PartType("lh", BodyLocation.BODY, 5, HEAD)
    LEFT_ARM_SMALL = PartType("ls", BodyLocation.BODY, 6, CHEST)
    RIGHT_ARM_LARGE = PartType("rh", BodyLocation.BODY, 10, HEAD)
    RIGHT_ARM_SMALL = PartType("rs", BodyLocation.BODY, 11, CHEST)
    EYE = PartType("ey", BodyLocation.HEAD, 24, None)
    LEFT_HAND_ITEM = PartType("li", BodyLocation.BODY, 0, None)
    HAIR_BACK = PartType("hrb", BodyLocation.HEAD, 26, HAIR)
    RIGHT_HAND_ITEM = PartType("ri", BodyLocation.BODY, 26, None)
    LEFT_ARM_CARRY = PartType("lc", BodyLocation.BODY, 23, HEAD)
    RIGHT_ARM_CARRY = PartType("rc", BodyLocation.BODY, 24, HEAD)
    EFFECT = PartType("fx", BodyLocation.BODY, 100, None)

    LEFT_ARM_SMALL.rotation_offset[3] = 1

    @staticmethod
    def from_key(key: str) -> PartType:
        for set_type in PartTypes:
            if isinstance(set_type.value, PartType) and set_type.value.key == key:
                return set_type.value
        return None


class SetType:

    def __init__(self, type: PartType, palette_id: int):
        self.__type: PartType = type
        self.__palette_id: int = palette_id
        self.sets = {}

    @property
    def type(self) -> PartType:
        return self.__type

    @property
    def palette_id(self) -> int:
        return self.__palette_id

class Set:

    def __init__(self, id: int, name: str, gender: str, club: int, colorable: bool, selectable: bool, preselectable: bool):
        self.__id: int = id;
        self.__name: str = name
        self.__gender: str = gender
        self.__club: int = club
        self.__colorable: bool = colorable
        self.__selectable: bool = selectable
        self.__preselectable: bool = preselectable
        self.__parts = dict()
        self.__hidden_layers = []

    def add_part(self, part: SetPart):
        if not part.type in self.__parts:
            self.__parts[part.type] = []

        self.__parts[part.type].append(part)

    @property
    def id(self) -> int:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name

    @property
    def gender(self) -> str:
        return self.__gender

    @property
    def club(self) -> int:
        return self.__club

    @property
    def colorable(self) -> bool:
        return self.__colorable

    @property
    def selectable(self) -> bool:
        return self.__selectable

    @property
    def preselectable(self) -> bool:
        return self.__preselectable

    @property
    def parts(self) -> dict:
        return self.__parts

    @property
    def hidden_layers(self) -> []:
        return self.__hidden_layers

    def add_hidden_layer(self, layer:PartType):
        self.__hidden_layers.append(layer)

import os
XML_FOLDER = "resources/xml/"
AVATAR_FOLDER = "resources/avatar/"
ASSET_FOLDER = os.path.join(XML_FOLDER, "assets")
FIGURE_DATA = "figuredata.xml"
FIGURE_MAP = "figuremap.xml"

import xml.etree.ElementTree
from xml.etree.ElementTree import Element, ElementTree
from matplotlib.image import imread
import numpy as np
from PIL import Image

color_convert = lambda n : [int(i) for i in n.to_bytes(4, byteorder='big', signed=True)]

class AvatarDataLoader():

    def __init__(self):
        self.__figure_data = dict() #Map < Type, SetType >
        self.__figure_map = dict() #Map < Integer, String >
        self.__asset_offset_map = dict() # Map < String, Pair < BufferedImage, Point >>
        self.__color_map = dict() # Map < Integer, Color >

    def get_part_name(self, id: int):
        if id in self.__figure_map:
            return self.__figure_map[id]

        return ""

    def load(self):

        def __load_figure_map():
            print("Loading Figure Map")
            figure_map_xml = xml.etree.ElementTree.parse(XML_FOLDER + FIGURE_MAP).getroot()
            for lib in figure_map_xml.findall('lib'):
                id: str = lib.get('id')

                if id.startswith('hh_'):
                    continue

                for part in lib.findall('part'):
                    part_id = int(part.get('id'))
                    self.__figure_map[part_id] = id

        def __load_figure_data():
            print("Loading Figure Data")
            figure_data_xml = xml.etree.ElementTree.parse(XML_FOLDER + FIGURE_DATA).getroot()
            for palette in figure_data_xml.findall('colors/palette'):
                id: int = int(palette.get('id'))

                for color in palette.findall('color'):
                    self.__color_map[int(color.get('id'))] = np.append(np.asarray(color_convert(int(color.text, 16))[1:4]) / 255, 1)

            for st in figure_data_xml.findall('sets/settype'):
                set_type = SetType(PartTypes.from_key(st.get('type')), int(st.get('paletteid')))

                for s in st.findall('set'):
                    set = Set(int(s.get('id')),
                              self.get_part_name(s.get('id')),
                              s.get('gender'),
                              int(s.get('club')),
                              s.get('colorable', '0') == '1',
                              s.get('selectable', '0') == '1',
                              s.get('preselectable', '0') == '1')

                    set_type.sets[set.id] = set

                    for p in s.findall('part'):
                        part = SetPart(
                            int(p.get('id')),
                            PartTypes.from_key(p.get('type')),
                            p.get('colorable', '0') == '1',
                            int(p.get('index')),
                            int(p.get('colorindex')))

                        set.add_part(part)

                    for h in s.findall('hiddenlayers/layer'):
                        set.add_hidden_layer(PartTypes.from_key(h.get('parttype')))
                self.__figure_data[set_type.type] = set_type

        def __load_asset_offset_map() -> None:
            print("Loading Asset Data")
            for f in os.listdir("./" + ASSET_FOLDER):
                path = os.path.join("./" + ASSET_FOLDER, f)
                if os.path.isfile(path) and f.endswith(".bin"):
                    clothing_offset_xml = xml.etree.ElementTree.parse(path).getroot()

                    for a in clothing_offset_xml.findall("library/assets/asset"):
                        if (a.get('mimeType') == "image/png"):
                            name: str = a.get('name')
                            param = a.find('param')
                            if param is None:
                                continue

                            value: [str] = param.get('value').split(',')
                            if len(value) == 2:
                                try:
                                    self.__asset_offset_map[name] = (np.asarray(Image.open((AVATAR_FOLDER + name + '.png'))).astype(np.ubyte), (int(value[0]), int(value[1])))
                                except:
                                    continue

        __load_figure_map()
        __load_figure_data()
        __load_asset_offset_map()

        print("Finished Loading Avatar Data")

    @property
    def figure_data(self):
        return self.__figure_data

    @property
    def figure_map(self):
        return self.__figure_map

    @property
    def asset_offset_map(self):
        return self.__asset_offset_map

    @property
    def color_map(self):
        return self.__color_map