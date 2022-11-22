# Lowdefy Plugins Example

A plugin needs to be a npm package. The package is installed into the server using preferable pnpm, but npm or yarn can also be used when not setup as a monorepo. Any of the supported protocols like `file:` or `git:` should work, including `workspace:*` in monorepo setups, like this example.

You can have a look at the official Lowdefy plugins here:
https://github.com/lowdefy/lowdefy/tree/main/packages/plugins (TODO)
The official plugins are built using swc, but is not necessary, as the Lowdefy server is built with webpack, so it is simpler not to include a build step.

To import the plugin into your app, you can add the following to the root of your lowdefy config (replacing the `types` array):

```yaml
plugins:
  - name: 'local-plugin'
    version: 'workspace:*' # for local plugins in pnpm monorepo
  - name: 'npm-plugin'
    version: 1.0.0 # for plugins installed remotely from npm
```

In Lowdefy v4, you can have plugins for Actions, Blocks, Operators (both build, client and server), Connectors and Requests, as well as the auth plugins, Callbacks, Provider and Events. Your plugin package can export any one of these types and does not need to include all types. Consider the following simple examples.

Plugins needs at least the following:
- A `package.json` which declares the package and exports the plugin types.
- A `types.js` file which exports the plugin names.
- A file that exports all the types as named exports.
- And the actual plugin code to be exported.

You can then use all of the types declared by the plugin as normal types in your lowdefy app. You can change your folder structure in your package, but then you need to change the `exports` config to match your file structure.

> NOTE: You should have a `types.js` file, which exports all the types declared by the package - the declared names in this file must be the same as the named exported in your package. This is used so that the build knows which types can be used from that plugin. The type names exported in the `types.js` are the type names you can use in your Lowdefy config.


## To run this example

1. Install pnpm see: https://pnpm.io/installation, it is advise to update to node v16.17 or greater and running `corepack enable`.
2. Run `pnpm i`.
3. Navigate / cd to app folder, and run `pnpm lowdefy dev`.

## A simple client operator plugin

Your plugin `package.json` needs to export the operator type:
```json
{
  "name": "plugin-times-eleven-operator",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "./operators/client": "./operatorsClient.js",
    "./types": "./types.js"
  },
  "files": [
    "*"
  ],
  "dependencies": {}
}
```

The `types.js` file should export the plugin name:
```js
export default {
  operators: {
    client: ['_times_eleven'],
  },
};
```

The `operatorsClient.js` file:
```js
export { default as _times_eleven } from './_times_eleven.js';
```

And the `_times_eleven` code:
```js
function _times_eleven({ params }) {
  return params.number * 11;
}

export default _times_eleven;
```

## Multiple types in one plugin

All plugin exports in `package.json` file that you can apply, only include the ones used:
```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "./auth/callbacks": "./auth/callbacks.js",
    "./auth/events": "./auth/events.js",
    "./auth/providers": "./auth/providers.js",
    "./blocks": "./blocks.js",
    "./connections": "./connections.js",
    "./operators/build": "./operatorsBuild.js",
    "./operators/client": "./operatorsClient.js",
    "./operators/server": "./operatorsServer.js",
    "./types": "./types.js"
  },
  "files": [
    "*"
  ],
  "dependencies": {}
}
```

The export schema for the `types.js` file should look like, use the same type names here as in the named exports:
```js
export default {
  actions: ['Action'],
  auth: {
    callbacks: ['Callback'],
    events: ['Event'],
    provider: ['Provider']
  },
  blocks: ['Block'],
  connections: ['Connection'],
  requests: ['Request'],
  operators: {
    build: ['_build_operator', '_shared_operator'],
    client: ['_client_operator', '_shared_operator'],
    server: ['_server_operator', '_shared_operator'],
  },
};
```

Export the types as named exports. So for example, you should have a `blocks.js`:
```js
export { default as Block } from './blocks/Block/Block.js';
```

The block file also needs to change slightly, an example block is:
```js
import React from 'react';
import { blockDefaultProps } from '@lowdefy/block-utils';

const Box = ({ blockId, content, events, methods, properties }) => (
  <div
    id={blockId}
    data-testid={blockId}
    onClick={() => methods.triggerEvent({ name: 'onClick' })}
    className={methods.makeCssClass([
      { outline: 'none', cursor: events.onClick && 'pointer' },
      properties.style,
    ])}
  >
    {properties.content || (content.content && content.content())}
  </div>
);

Box.defaultProps = blockDefaultProps;
Box.meta = {
  category: 'container', // one of 'container', 'display', 'input' or 'list'
  icons: [],
  styles: [],
};

export default Block;
```
