Build:

✅ /client/ needs to be bundled into client.min.js => /web-build/dist/client.min.js
✅ /web/ needs to be bundled into web.min.js => /web-build/dist/web.min.js
✅ /web/themes/{theme}/structure.page needs to be compiled => /web-build/dist/structure.html
✅ source/** => dist/** (exclude /source/client and /source/web)
✅ Run all 4 process together with 1 command

Dev Build:

Build + Live Reload (Watch for Client / Webpack Dev Server for Web)
source/** => dist/** (exclude /source/client and /source/web) & executed with readline


[] Fix Folder Namespaces
[] Fix Index/Main file
[] Fix live reloading

Client:

✅ Add room
[] Fix player body
[] Better camera centering

Web:

[] Fix page routes
