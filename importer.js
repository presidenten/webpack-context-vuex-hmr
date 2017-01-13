const modules = {};
const getModulesContext = () => require.context('.', false, /override-me-in-webpack$/);
const getFileName = string => string.match(/[^\\|/]*(?=[.][a-zA-Z]+$)/)[0];
let contextId;

export default {
  /**
   * Returns an object with loaded modules
   */
  getModules() {
    const context = getModulesContext();
    contextId = context.id;
    context.keys().forEach((key) => {
      const fileName = getFileName(key);
      modules[fileName] = context(key).default;
    });

    return modules;
  },

  /**
   * Returns an object with loaded modules
   *
   * @param {Object} store - The vuex store
   */
  setupHMR(store) {
    if (module.hot) {
      // Accept last context as input
      module.hot.accept(contextId, () => {
        // require the updated modules
        const reloadedContext = getModulesContext();
        const changedModules = reloadedContext.keys()
          .map(key => ({ name: getFileName(key), object: reloadedContext(key).default }))
          .filter(reloadedModule => modules[reloadedModule.name] !== reloadedModule.object);

        // Update changed modules
        changedModules.forEach((module) => {
          modules[module.name] = module.object;
          // eslint-disable-next-line
          console.info('HMR - [' + module.name + '] is updated');
        });

        // Swap in the new modules
        store.hotUpdate({ modules });
      });
    }
  },
};
