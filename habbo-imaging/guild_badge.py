import numpy as np
from enum import Enum
from PIL import Image

color_convert = lambda n : [int(i) for i in n.to_bytes(4, byteorder='big', signed=True)]

class BadgePartTypes(Enum):
    BASE = "b"
    SYMBOL = "s"

class BadgePart():
    def __init__(self, id: int, type: BadgePartTypes, image_data: np.ndarray, image_data_2: np.ndarray = None):
        self.__id: int = id
        self.__type: BadgePartTypes = type
        self.__image_data: np.ndarray = image_data
        self.__image_data_2: np.ndarray = image_data_2

    @property
    def id(self) -> int:
        return self.__id

    @property
    def type(self):
        return self.__type

    @property
    def image_data(self) -> np.ndarray:
        return self.__image_data

    @property
    def image_data_2(self) -> np.ndarray:
        return self.__image_data_2

    @property
    def two_parts(self) -> bool:
        return self.__image_data_2 is not None

class GuildBadge():

    def __init__(self):
        self.__base: BadgePart = None
        self.__symbols: [BadgePart] = []
        self.__colors: [int] = []
        self.__points: [int] = []

    @property
    def base(self) -> BadgePart:
        return self.__base

    def set_base(self, base: BadgePart, color: int, point:int) -> None:
        self.__base = base
        self.__colors.insert(0, color)
        self.__points.insert(0, point)

    def add_symbol(self, symbol: BadgePart, color: int, point: int) -> None:
        if self.__base is None:
            raise RuntimeError("Base has not been assigned yet!")

        self.__symbols.append(symbol)
        self.__colors.append(color)
        self.__points.append(point)


    @staticmethod
    def calculate_drawing_point(canvas_size, symbol_size, position: int):
        out = [0, 0]

        if position == 1:
            out[0] = (canvas_size[0] - symbol_size[1]) / 2
            out[1] = 0
            
        if position == 2:
            out[0] = canvas_size[0] - symbol_size[1]
            out[1] = 0

        if position == 3:
                    
            out[0] =  0
            out[1] =  (canvas_size[1] / 2) - (symbol_size[0] / 2)

        if position == 4:

            out[0] =  (canvas_size[0] / 2) - (symbol_size[1] / 2)
            out[1] =  (canvas_size[1] / 2) - (symbol_size[0] / 2)

        if position == 5:

            out[0] =  canvas_size[0] - symbol_size[1]
            out[1] =  (canvas_size[1] / 2) - (symbol_size[0] / 2)

        if position == 6:

            out[0] =  0
            out[1] =  canvas_size[1] - symbol_size[0]

        if position == 7:

            out[0] =  ((canvas_size[0] - symbol_size[1]) / 2)
            out[1] =  canvas_size[1] - symbol_size[0]

        if position == 8:

            out[0] =  canvas_size[0] - symbol_size[1]
            out[1] =  canvas_size[1] - symbol_size[0]

        return out

    def generate(self) -> Image:
        badge = Image.new("RGBA", (39, 39))
        loc = GuildBadge.calculate_drawing_point(badge.size, self.__base.image_data.shape, self.__points[0])
        badge.alpha_composite(Image.fromarray((self.__base.image_data * self.__colors[0]).astype(np.uint8)), (int(loc[0]), int(loc[1])))
        for i in range(len(self.__symbols)):
            loc = GuildBadge.calculate_drawing_point(badge.size, self.__symbols[i].image_data.shape, self.__points[i+1])
            badge.alpha_composite(Image.fromarray((self.__symbols[i].image_data * self.__colors[i+1]).astype(np.uint8)), (int(loc[0]), int(loc[1])))
            if self.__symbols[i].two_parts:
                badge.alpha_composite(Image.fromarray(self.__symbols[i].image_data_2), (int(loc[0]), int(loc[1])))
        return badge


def y8_2_rgba(img):
    normalized = (img  /img.max() * 255)
    alpha = np.zeros_like(normalized)
    alpha[normalized != np.amax(normalized)] = 255
    normalized[normalized == 255] = 0
    return np.dstack((normalized, normalized, normalized, alpha)).astype(np.uint8)

import csv
class GuildBadgeDataLoader():

    def __init__(self):
        self.__bases: dict = {} # id -> BadgePart
        self.__symbols: dict = {} # id -> BadgePart
        self.__base_colors: dict = {} # id -> color[R,G,B,A=1]
        self.__symbol_colors: dict = {} # id -> color[R,G,B,A=1]

    def load_from_csv(self):
        with open('./resources/csv/badge_parts.csv', newline='') as csvfile:
            data = list(csv.reader(csvfile))
            line: [str] = None
            for line in data:
                line[1] = line[1].replace('.gif', '')
                line[2] = line[2].replace('.gif', '')

                if line[3] == "base_color":
                    self.__base_colors[int(line[0])] = np.append(np.asarray(color_convert(int(line[1], 16))[1:5]) / 255, 1)

                if line[3] == "symbol_color":
                    self.__symbol_colors[int(line[0])] = np.append(np.asarray(color_convert(int(line[1], 16))[1:5]) / 255, 1)

                if line[3] == "base":
                    base = BadgePart(int(line[0]), BadgePartTypes.BASE, (np.asarray(Image.open('./resources/badge/badgepart_' + line[1] + '.png'))) if line[1] is not '' else None, (np.asarray(Image.open('./resources/badge/badgepart_' + line[2] + '.png'))) if line[2] is not '' else None)
                    self.__bases[base.id] = base

                if line[3] == "symbol":
                    symbol = BadgePart(int(line[0]), BadgePartTypes.SYMBOL, (np.asarray(Image.open(('./resources/badge/badgepart_' + line[1] + '.png')).convert("RGBA"))) if line[1] is not '' else None, (np.asarray(Image.open(('./resources/badge/badgepart_' + line[2] + '.png')).convert("RGBA"))) if line[2] is not '' else None)
                    self.__symbols[symbol.id] = symbol


    def get_base(self, id:int) -> BadgePart:
        for k, v in self.__bases.items():
            if k == id:
                return v

    def get_symbol(self, id:int) -> BadgePart:
        return self.__symbols.get(id, None)

    def get_base_color(self, id:int) -> int:
        return self.__base_colors.get(id, None)

    def get_symbol_color(self, id:int) -> int:
        return self.__symbol_colors.get(id, None)


def from_string(badge_string:str, data_loader:GuildBadgeDataLoader):
    badge: GuildBadge = None
    if badge_string is not None:
        badge = GuildBadge()

        while len(badge_string) >= 7:
            part = badge_string[:7]
            badge_string = badge_string[7:]
            type = part[0]
            id = int(part[1:4].lstrip("0"))
            color = int(part[4:6])
            pos = int(part[6])

            if type == BadgePartTypes.BASE.value:
                badge.set_base(data_loader.get_base(id), data_loader.get_base_color(color), pos)
            elif type == BadgePartTypes.SYMBOL.value:
                badge.add_symbol(data_loader.get_symbol(id), data_loader.get_symbol_color(color), pos)

    return badge