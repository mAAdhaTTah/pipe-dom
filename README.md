# Welcome to pipe-dom 👋

![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Twitter: JamesDiGioia](https://img.shields.io/twitter/follow/JamesDiGioia.svg?style=social)](https://twitter.com/JamesDiGioia) [![Build Status](https://travis-ci.org/mAAdhaTTah/pipe-dom.svg?branch=master)](https://travis-ci.org/mAAdhaTTah/pipe-dom)

> DOM manipulation with the F#-style pipeline operator

## Install

pipe-dom is intended to be used with the F#-style pipeline operator.

```sh
npm install --save pipe-dom @babel/core @babel/plugin-proposal-pipeline-operator
```

Configure your `.babelrc`:

```json
{
  "plugins": [["@babel/proposal-pipeline-operator", { "proposal": "fsharp" }]]
}
```

## Philosophy

- **Experimental**: This library is intended to be used in combination with the pipeline operator, a Stage 1 proposal. Because that proposal is experimental & in flux, this library will be too, as we want to be able to adjust the API of the library to align with pipeline best practices. This library will follow semver in doing so, but breaking changes are possible, if not likely. This will change if the pipeline operator is accepted.
- **Modern Browsers**: While we aim to normalize API differences across modern browsers, we are not going to support old browsers (_cough_ IE11 _cough_). We will use modern DOM API methods internally. If your target browsers do not support those methods, they should be polyfilled by the consumer, but because of the experimental nature of the library, we don't foresee this being a problem. This also could change if the pipeline operator is accepted.
- **Expansive**: While the initial release has a small API surface, any useful methods are welcome to be added. Because it exports functions, the library is tree-shakeable, which means extra methods have little to no impact on consumer bundle size.
- **Arrays Everywhere**: `queryAll` returns an array rather than a NodeList, and the `map` implementation will returns an array. This is a cleanest primitive to target and work with. `NodeList`s are to be avoided.
- **Impure**: This is not inteded to be a functional library, but a fluent one a la jQuery. Because we're dealing with the DOM, Nodes will be mutated. This can produce some weird behavior, like this:

  ```js
  queryAll('.some-class') |> map(append(someNode));
  ```

  This will result in `someNode` attached to the last element in the list, as the reference to `someNode` remains the same across all iterations. Appending each time will move `someNode` to the next element in the list. If you want to create a new node on every iteration, try this:

  ```js
  queryAll('.some-class') |> map(append(el => el |> append(createNode())));
  ```

## API

### `query`

```ts
function query(selector: string): Node;
```

Query for a single element by the given selector.

#### Example

```js
query('.my-class');
```

### `queryAll`

```ts
function queryAll(selector: string): Node[];
```

Query for an array of elements by the given selector.

#### Example

```js
queryAll('.my-class');
```

### `map`

```ts
function map<T, V>(callback: (element: T) => V): (target: T[]) => V[];
```

A curried `map` function to use with an array of Nodes.

#### Example

```js
queryAll('.my-class')
  |> map(x => {
    console.log(x);
    return x;
  });
```

### `append`

```ts
function append(...element: Node[]): (target: Node) => target;
```

Append Nodes as the last children to the given Node.

#### Example

```js
query('ul') |> append(document.createElement('li'));
```

### `prepend`

```ts
function prepend(...element: Node): (target: Node) => target;
```

Append Nodes as the first child to the given Node.

#### Example

```js
query('ul') |> prepend(document.createElement('li'));
```

### `insertBefore`

```ts
function insertBefore(
  relative: Node,
  ...inserting: Node[]
): (target: Node) => target;
```

Insert Nodes before relative child of target Node.

#### Example

```js
query('ul') |> insertBefore(query('li.first'), document.createElement('li'));
```

### `insertAfter`

```ts
function insertAfter(
  relative: Node,
  ...inserting: Node[]
): (target: Node) => target;
```

Insert Nodes after relative child of target Node.

#### Example

```js
query('ul') |> insertAfter(query('li.first'), document.createElement('li'));
```

### `replace`

```ts
function replace(oldChild: Node, newChild: Node): (target: Node) => target;
```

Replace an existing child Node with a new child Node for the target Node.

#### Example

```js
query('ul') |> replace(query('li.first'), document.createElement('li'));
```

### `remove`

```ts
function remove(child: Node): (target: Node) => target;
```

Remove a child Node from a given Node.

#### Example

```js
query('ul') |> remove(query('li.first'));
```

### `contains`

```ts
function container(contained: Node): (target: Node) => boolean;
```

Determines whether one Node is contained in another Node.

#### Example

```js
query('ul') |> contains(query('li.first'));
```

### `setAttribute`

```ts
function setAttribute(name: string, value: string): (target: Node) => target;
```

Sets the attribute to a given value on the target Node.

#### Example

```js
query('input') |> setAttribute('name', 'username');
```

### `getAttribute`

```ts
function getAttribute(name: string): (target: Node) => string;
```

Get an attribute from the target Node.

#### Example

```js
query('input') |> getAttribute('value');
```

### `addClass`

```ts
function addClass(className: string): (target: Node) => target;
```

Adds a class to a target Node.

#### Example

```js
query('input') |> addClass('error');
```

### `removeClass`

```ts
function removeClass(className: string): (target: Node) => target;
```

Removes a class from a target Node.

#### Example

```js
query('.my-class') |> removeClass('my-class');
```

### `toggleClass`

```ts
function toggleClass(
  className: string,
  toggle?: boolean
): (target: Node) => target;
```

Toggles a class on a target Node. If toggle is provided, class will be in provided state (on for `true`, off for `false`). If toggle not provided, class state will be swapped from current (added if missing, removed if present).

#### Example

```js
query('.my-class') |> toggleClass('my-class', false);
query('.my-class') |> toggleClass('my-class', true);
query('.my-class') |> toggleClass('my-class');
```

### `on`

```ts
interface Options {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

function on(
  event: string,
  handler: (e: Event) => void,
  options?: Options | boolean
): (target: Node) => target;
```

Adds an event listener to the target Node.

#### Example

```js
query('button') |> on('click', e => console.log(e));
```

### `off`

```ts
interface Options {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

function off(
  event: string,
  handler: (e: Event) => void,
  options?: Options | boolean
): (target: Node) => target;
```

Removes an event listener from the target Node.

#### Example

```js
const handler = e => console.log(e);
query('button') |> off('click', handler);
```

## Author

👤 **James DiGioia <jamesorodig@gmail.com> (http://jamesdigioia.com)**

- Twitter: [@JamesDiGioia](https://twitter.com/JamesDiGioia)
- Github: [@mAAdhaTTah](https://github.com/mAAdhaTTah)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mAAdhaTTah/pipe-dom/issues).

### Run tests

```sh
npm test
```

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [James DiGioia <jamesorodig@gmail.com> (http://jamesdigioia.com)](https://github.com/mAAdhaTTah).<br />
This project is [MIT](https://opensource.org/licenses/MIT) licensed.
