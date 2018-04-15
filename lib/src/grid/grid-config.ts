export type GridConfig = {
  cacheKey: string;
};

let gridConfiguration = {
  cacheKey: 'GLOBAL_GRID_KEY'
};

/**
 * Override grid configuration
 * @param {GridConfig} config
 */
export function setGridConfiguration(config: GridConfig) {
  gridConfiguration = { ...gridConfiguration, ...config };
}

/**
 * Get current grid configuration
 * @return {{cacheKey: string}}
 */
export function getGridConfiguration() {
  return { ...gridConfiguration };
}

const StorageKey = 'GRID_STORE';
export type GridModel = {
  filter: any;
  sort: any;
};

function getGridConfigFromStorage() {
  let currentStorage = localStorage.getItem(StorageKey);
  return currentStorage ? JSON.parse(currentStorage) : {};
}

/**
 * Save the grid model
 * @param {string} gridName
 * @param {GridModel} model
 */
export function setGridModel(gridName: string, model: GridModel) {
  if (!gridName) {
    throw new Error('gridName required.');
  }

  let currModel = getGridModel(gridName);
  const newModel = { ...currModel, ...model };

  const gridConf = getGridConfiguration();

  let currentStorage = getGridConfigFromStorage();
  currentStorage[gridConf.cacheKey] = currentStorage[gridConf.cacheKey] || {};
  currentStorage[gridConf.cacheKey][gridName] = newModel;

  localStorage.setItem(StorageKey, JSON.stringify(currentStorage));
}

/**
 * Return the saved grid model
 * @param {string} gridName
 * @return {GridModel}
 */
export function getGridModel(gridName: string): GridModel {
  if (!gridName) {
    throw new Error('gridName required.');
  }

  let gridModel = getGridConfigFromStorage();
  const gridConf = getGridConfiguration();

  if (gridConf.cacheKey && gridModel) {
    gridModel = gridModel[gridConf.cacheKey];
    return (gridModel && gridModel[gridName]) || {};
  }

  return {
    filter: null,
    sort: null
  };
}
