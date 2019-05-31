from starlette.applications import Starlette
from starlette.responses import JSONResponse, HTMLResponse
import uvicorn
from imagers.avatar_imager import AvatarImager
from imagers.badge_imager import GuildBadgeImager
import os
app = Starlette(debug=True)

@app.route('/')
async def homepage(request):
    return JSONResponse({'hello': 'world'})

@app.exception_handler(404)
async def not_found(request, exc):
    return HTMLResponse(content="Not Found", status_code=exc.status_code)

@app.exception_handler(500)
async def server_error(request, exc):
    return HTMLResponse(content="Uh Oh, thats not supposed to happen...", status_code=exc.status_code)

if __name__ == '__main__':
    if not os.path.exists('cache/'):
        os.mkdir("cache/")
    print("Habbo Imaging Server")
    print("Created by The General")
    print("This software is free to use and modify. Please make changes publicly available.")
    print("Join the Arcturus discord to get in touch with others: http://discord.gg/eDr7FKQ")
    print("")
    print("Thanks, ")
    print("\t- The General")
    print("Discord: TheGeneral#0063")
    print("")
    print("Loading Avatar Imager")
    avatar_imager = AvatarImager(app)
    print("Loading Badge Imager")
    guild_badge_imager = GuildBadgeImager(app)
    uvicorn.run(app, host='0.0.0.0', port=8000)
    print("Done! Running on 0.0.0.0:8000")
