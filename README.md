# Lowdefy Plugins Example

A plugin needs to be a npm package. The package is installed into the server using npm or yarn, so any of the supported protocols like `file:` or `git:` should work. We copy the `plugins` folder in your config into the server, so you can use relative paths there in the package specifier if you place your plugins in the `plugins` folder.

You can have a look at the official Lowdefy plugins here:
https://github.com/lowdefy/lowdefy/tree/main/packages/plugins
The official plugins are built using swc, but is not really necessary, as the Lowdefy server is built with webpack, so it is simpler not to include a build step.

To import the plugin into your app, you can add the following to the root of your lowdefy config (replacing the `types` array):

```yaml
plugins:
  - name: 'local-plugin'
    version: 'file:./plugins/local-plugin'
  - name: 'npm-plugin'
    version: 1.0.0
```

You can then use all of the types declared by the plugin as normal types.

The plugin `package,json` file should look like this:
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

You can change your folder structure in your package, but then you need to change the `exports` config to match your file structure.

You should have a `types.js` file, which exports all the types declared by the package. This is used so that the build knows which types can be used from that plugin. The type names exported in the `types.js` are the type names you can use in your Lowdefy config.

The `types.js` file should look like

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
    client: ['_build_operator', '_shared_operator'],
    client: ['_client_operator', '_shared_operator'],
    server: ['_server_operator', '_shared_operator'],
  },
};
```

The plugin should also have a file that exports all the types as named exports. So for example, you should have a `blocks.js`:

```js
export { default as Block } from './blocks/Block/Block.js';
```

The block file also needs to change slightly, an example block is

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
