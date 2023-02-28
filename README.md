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

# A project setup example

If your projects uses local plugins (plugins not installed from npm), then it is useful to setup a pnpm workspace or monorepo. pnpm is the only package manager that will be supported for local plugin development with lowdefy apps in the same monorepo. This example repo can be used as a example of how the workspace should be setup.

This is an example of the proposed project structure:

```
project
  /app
  |  ...[app files and folders]
  |  lowdefy.yaml
  |  package.json
  /plugins
  |  /...[all plugins]
  |  /plugin-name
  |    /src
  |      type.js
  |    package.json
  package.json
  pnpm-workspace.yaml
```

In the minimum setup there is 4 important files.

1. The project root `package.json`:

```json
{
  "name": "lowdefy-example-plugins-repo",
  "version": "1.0.0",
  "packageManager": "pnpm@7.12.2",
  "dependencies": {
    "lowdefy": "4.0.0-rc.5"
  },
  "scripts": {},
  "devDependencies": {}
}
```

2. The project root `pnpm-workspace.yaml`

```yaml
packages:
  - 'app/*'
  - 'plugins/*'
  - 'app/.lowdefy/*'
  - '*'
```

3. Each plugin needs the following files:

A `package.json`, only include the relevant exports:

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "./auth/callbacks": "./src/auth/callbacks.js",
    "./auth/events": "./src/auth/events.js",
    "./auth/providers": "./src/auth/providers.js",
    "./blocks": "./src/blocks.js",
    "./connections": "./src/connections.js",
    "./operators/build": "./src/operators/build.js",
    "./operators/client": "./src/operators/client.js",
    "./operators/server": "./src/operators/server.js",
    "./types": "./src/types.js"
  },
  "files": ["src/*"],
  "dependencies": {}
}
```

A `types.js` file, defining all type names (only include the names of your custom types):

```js
export default {
  actions: ['Action'],
  auth: {
    callbacks: ['Callback'],
    events: ['Event'],
    provider: ['Provider'],
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

And the type exports files for the various custom types, for example `project/plugins/plugin-name/src/actions.js` exports the types code for all the new action types:

```js
export { default as FooAction } from './FooAction.js';
```

The type names in the `types.js` file and in the exports in plugin export files must match.`

4. The lowdefy app `package.json`:

```yaml
{
  'name': 'lowdefy-example-plugins',
  'version': '1.0.0',
  'type': 'module',
  'scripts': { 'lowdefy': 'lowdefy' },
  'dependencies': { 'lowdefy': '4.0.0-rc.5' },
}
```

5. And the app's `lowdefy.yaml` linking to the plugins, your project can also contain multiple Lowdefy apps:

```yaml
lowdefy: 4.0.0-rc.5 # Please check for latest Lowdefy version.
plugins:
  - name: 'plugin-name'
    version: 'workspace:*'

pages: ...
```

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
  "files": ["*"],
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
  "files": ["*"],
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
    provider: ['Provider'],
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
