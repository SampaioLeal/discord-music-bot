# NodeTS

A NodeJS Typescript templat for building beautiful applications

## Installation

Simply install all packages using `npm` or `yarn`:

```
npm install
```

or

```
yarn install
```

## Features

- Typescript support
- Nodemon with ts-node for Typescript compiling and watch
- ESLint with Typescript plugins for code linting
- Prettier with their ESLint plugin for code beautifying
- package.json scripts for build, start development build and watch files, lint and fix, run prettier formatter...
- tsconfig.json with some initial configs
- Nodemon default configs
- Prettier default configs

Note: Feel free to search for new configs and set standards for your project, this is just a default setup that you can fork and customize.

## Main NodeJS File

In order to use a main script that isn't called index.ts and index.js (production build), you have to change some commands at `nodemon.json` and `package.json`:

**nodemon.json**

```
{
  "exec": "ts-node ./src/{YOUR_MAIN_SCRIPT}.ts"
}
```

**package.json**

```
"scripts": {
  "start": "npm run build && node build/{YOUR_MAIN_SCRIPT}.js",
}
```
