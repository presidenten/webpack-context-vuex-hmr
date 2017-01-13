# webpack-context-vuex-hmr

## tl;dr
This module makes it easy to setup dynamic imports of Vuex modules using 
`require.context` and removes the boilerplate needed to update vuex using HMR when the modules are changed.

## Introduction
A nice way to organize Vuex code is to structure into getters, actions and mutions into a single module file. However, depending on the size of the project it might be a pain to import them all into `main.js`. 
Vue works very well with HMR using the vue-cli tempalte. But to make Vuex work with HMR, there is need for code duplication and some boring boilerplate to get the modules to be properly hot module replaced instead of live reloaded. This can be quite tedious for a large project.

This package uses Webpack's `require.context` to dynamically load all Vuex modules using a preconfigured regexp and takes care of the necessary boilerplate to make HMR work with the dynamic context.  

A more general version that will probably work frameworks other than Vuex can be found here: [Webpack-context-hmr](https://github.com/presidenten/webpack-context-hmr).

## Usage
Require.context cannot handle runtime input. It can however be configured by using the ContextReplacementPlugin.
Configure the importer by adding the plugin to the webpack configuration:
```javascript
plugins: [
  new (require('webpack/lib/ContextReplacementPlugin'))(
    /webpack-context-vuex-hmr$/,           // [leave me] this file
    path.resolve(process.cwd(), './src'),  // [edit me]  context root path
    true,                                  // [edit me]  recursive search
    /-store.js$/                           // [edit me]  regexp to find modules
    ),
],
```
In this example the importer will look in `<project-path>/src` using recursive search through folders, looking for files ending with `-store.js`. This should be edited to match the projects naming conventions. 


Then in `main.js`:
```javascript
// Setup Vue with Vuex like normal
import Vue from 'vue';
import Vuex from 'vuex';
import app from './app.vue';
Vue.use(Vuex);

// Get new importer instance
const importer = require('webpack-context-vuex-hmr');
// Import all Vuex modules
const modules = importer.getModules();
// Create the Vuex store
const store = new Vuex.Store({ modules });
// Setup HMR on all the Vuex store modules
importer.setupHMR(store);

// Finally create a new Vue instance like usual
/* eslint-disable no-new */
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


