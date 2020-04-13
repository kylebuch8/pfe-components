# PatternFly Elements with Lit Element

This repository serves as a proof-of-concept for moving PatternFly Elements
to using [Lit Element](https://lit-element.polymer-project.org/) as a base
class. The goal is to review the impact of changing to LitElement. Things to
consider are

- Payload size
- Developer convenience
- Maintainability
- ...

## Getting started

```
npm install
```

## Run a demo server

```
npm start
```

This uses [Browsersync](https://www.browsersync.io/) as the dev server and
[watch](https://github.com/mikeal/watch) to do a build anytime a file is changed
in the `src` directory of a package.

## Run a build

```
npm run build
```

## ToDo

- Create UMD distributable for each package
- Inject Scss into each component
