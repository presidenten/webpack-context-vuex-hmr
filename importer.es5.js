'use strict';

var modules = {};
var getModulesContext = function getModulesContext() {
  return require.context('.', false, /override-me-in-webpack$/);
};
var getFileName = function getFileName(string) {
  return string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
};
var contextId = void 0;

module.exports = {
  getModules: function getModules() {
    var context = getModulesContext();
    contextId = context.id;
    context.keys().forEach(function (key) {
      var fileName = getFileName(key);
      modules[fileName] = context(key).default;
    });

    return modules;
  },
  setupHMR: function setupHMR(store) {
    if (module.hot) {
      module.hot.accept(contextId, function () {
        var reloadedContext = getModulesContext();
        var changedModules = reloadedContext.keys().map(function (key) {
          return { name: getFileName(key), object: reloadedContext(key).default };
        }).filter(function (reloadedModule) {
          return modules[reloadedModule.name] !== reloadedModule.object;
        });

        changedModules.forEach(function (module) {
          modules[module.name] = module.object;

          console.info('HMR - [' + module.name + '] is updated');
        });

        store.hotUpdate({ modules: modules });
      });
    }
  }
};


