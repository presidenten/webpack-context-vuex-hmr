# webpack-context-vuex-hmr

## tl;dr
This module makes it easy to setup dynamic imports of javascript modules using `require.context` and removes the need for the extra boilerplate that is needed to make HMR work with them.
To see this plugin in action, clone, download and run: [webpack-context-vuex-hmr-demo](https://github.com/presidenten/webpack-context-vuex-hmr-demo)

## Introduction
A nice way to organize Vuex code is to structure into getters, actions and mutations into a single module file. However, depending on the size of the project it might be a pain to import them all into `main.js`.
Vue works very well with HMR using the vue-cli tempalte. But to make Vuex work with HMR, there is need for code duplication and some boring boilerplate to get the modules to be properly hot module replaced instead of live reloaded. This can be quite tedious for a large project.

This package uses Webpack's `require.context` to dynamically load all [Vuex modules](https://vuex.vuejs.org/en/modules.html) using a preconfigured regexp and takes care of the necessary boilerplate to make HMR work with the dynamic context.

A more general version that will probably work frameworks other than Vuex can be found here: [Webpack-context-hmr](https://github.com/presidenten/webpack-context-hmr).

### Nested Vuex modules:
When working with nested vuex modules/submodules/substores, this loader in needed: [hmr-auto-accept-loader](https://github.com/presidenten/hmr-auto-accept-loader)

## Usage
`Require.context` cannot handle runtime input. It can however be configured by using the `ContextReplacementPlugin`.
Configure the importer by adding the plugin to the webpack configuration:
```javascript
plugins: [
  new (require('webpack/lib/ContextReplacementPlugin'))(
    /webpack-context-vuex-hmr$/,           // [leave me] this file
    path.resolve(process.cwd(), './src'),  // [edit me]  context root path
    true,                                  // [edit me]  recursive search
    /-store.js|-substore.js$/              // [edit me]  regexp to find modules
  ),
],
```

In this example the importer will look in `<project-path>/src` using recursive search through folders, looking for files ending with `-store.js` and `-substore.js`. This should be edited to match the projects naming conventions.


Then in `main.js`:
```javascript
// Import plugin
import contextHmr from 'webpack-context-hmr';
// Normal imports
import Vue from 'vue';
import Vuex from 'vuex';
import app from './app.vue';

// Get new importer instance
const importer = contextHmr.getNewInstance();

// Import all modules and get `module.default` from each module
// Edit moduleKey value as necessary, this example imports from modules using:
// `export default { state, getters, actions, mutations };`
const modules = importer.getModules();

// Framework setup using the modules
const store = new Vuex.Store({ modules });

// Setup HMR with a callback
importer.setupHMR(updatedModules => store.hotUpdate({ modules: updatedModules }));

// Create new vue instance like normal
new Vue({
  el: '#app',
  store,
  render: h => h(app),
});
```

# Read more
- [Webpack require context](https://webpack.github.io/docs/context.html)
- [Dynamic context HMR example](https://github.com/AlexLeung/webpack-hot-module-reload-with-context-example)
- [Vuex HMR](https://vuex.vuejs.org/en/hot-reload.html)

# License
MIT
