# Phaser.io CE 2.12.0, Howler.js 2.1.2, TypeScript and Webpack 4.3, play nice together.
#### A bootstrap project to create games with Phaser.io, Howler.js, TypeScript and Webpack.

## Features
- Uses the latest Phaser CE 
- Uses Howler (an awesome audio library) - can be easily removed if one does not use it
- TypeScript linter that checks TypeScript code for readability, maintainability, and functionality errors
- Webpack 4 ready
- Built-in commands to easily deploy code your code (minify, uglify, comments removal, etc)
- Other awesome stuff!

# Setup
To use this bootstrap you’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/numbofathma/phaser-typescript-webpack.git```

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies:

Navigate to the cloned repo’s directory.

Run:

```npm install``` 

## 4. Run the development server:

Run:

```npm run start```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:8000 into the address bar.

As you change your code, Webpack will watch for changes and the browser will refresh.


## 5. Build for deployment:

Run:

```npm run build```

This will optimize and minimize the compiled bundle. Your code will be minified and uglyfied for reverse engineering protection.
The vendor library will only be minified because uglify will add extra MBs to your game.


## 6. Extra feature (fix your TS code)
I've also added a command that auto-fixes your TS code according to the rules in the tslint.json file.

Run:

``` npm run lint:fix```

## Credits
Big thanks to this great repos:

https://github.com/lean/phaser-es6-webpack/tree/typescript<br />
https://github.com/eduardonunesp/phaser-typescript-webpack-boilerplate<br />
https://github.com/heathkit/phaser-typescript-webpack-starter/tree/master/src/sprites

Special thanks to:
<a href="https://github.com/dimorphic/" target="_blank" title="dimorphic's Profile">dimorphic</a>

<br />
Made with <3 in Romania 