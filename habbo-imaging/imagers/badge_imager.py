from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import Response, HTMLResponse

from guild_badge import *
import io

class GuildBadgeImager():

    def __init__(self, app:Starlette):
        self.__guild_badge_data = GuildBadgeDataLoader()
        self.__help_html = ""

        self.__guild_badge_data.load_from_csv()
        self.__load_help()

        @app.route('/habbo-imaging/badge/')
        async def handle(request: Request):
            badge = request.query_params['b']

            if badge is not None:
                badge_image = from_string(badge, self.__guild_badge_data)
                with io.BytesIO() as buffer:
                    badge_image.generate().save(buffer, format='PNG')
                    out = buffer.getvalue()
                return Response(content=out, media_type="image/png")
            return Response(content=None, media_type="image/png")

        @app.route('/habbo-imaging/badge/help')
        async def handle(request: Request):
            return HTMLResponse(self.__help_html)

    def __load_help(self):

        with open('./resources/pages/imaging_badge_help.html', 'r') as help_file:
            self.__help_html = help_file.read()
