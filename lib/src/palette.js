/** DON'T USE ES2015 IN THIS FILE */

const symbolics = {
  red: ['#FBEDED', '#F6D1D2', '#EEA5A5', '#E67878', '#DE4B4C', '#B83E3F', '#923132', '#6B2424', '#551C1D'],
  green: ['#E7F8EF', '#C2EDD8', '#86DBB1', '#49C98A', '#0DB864', '#0A9853', '#087941', '#065930', '#044626'],
  yellow: ['#FFF8E7', '#FFF2CF', '#FFE6A0', '#FFDA71', '#FFCE42', '#D4AB36', '#A8872B', '#7C6420' , '#624F19'],
  orange: ['#FFF4E6', '#FFE5BF', '#FFCB80', '#FFB141', '#FF9802', '#FF8601', '#FF7301', '#994500', '#402100']
}

const normalizeSymbolic = Object.keys(symbolics).reduce((acc, key) => {
    let start = 0;
    const colors = symbolics[key];
    colors.forEach((color, index) => {
      const num = index === 0 ? 50 : start+=100;
      acc[`${key}-${num}`] = color;
    });

    return acc;
}, {});


module.exports = {
  light: Object.assign({
    'primary-700': '#2E2F30',
    'primary-600': '#37383A',
    'primary-500': '#4F5053',
    'primary-400': '#67696F',
    'primary-300': '#9EA0A5',
    'primary-200': '#CCCED3',
    'primary-100': '#F1F2F5',
    'primary-50': '#F7F8FA',
    'primary-0': '#ffffff',
    'accent-800': '#072A60',
    'accent-700': '#0D47A1',
    'accent-600': '#1C61D7',
    'accent-500': '#317EEB',
    'accent-400': '#09A0FF',
    'accent-350': '#40B2FE',
    'accent-300': '#77C5FD',
    'accent-200': '#BBDEFB',
    'accent-100': '#E3F2FD',
    'fg-100': '#37383A',
    'fg-200': '#ffffff'
  }, normalizeSymbolic),
  dark: {
    'primary-700': '#ffffff',
    'primary-600': '#F7F8FA',
    'primary-500': '#F1F2F5',
    'primary-400': '#CCCED3',
    'primary-300': '#9EA0A5',
    'primary-200': '#67696F',
    'primary-100': '#4F5053',
    'primary-50': '#37383A',
    'primary-0': '#2E2F30',
    'accent-800': '#E3F2FD',
    'accent-700': '#BBDEFB',
    'accent-600': '#77C5FD',
    'accent-500': '#40B2FE',
    'accent-400': '#09A0FF',
    'accent-350': '#317EEB',
    'accent-300': '#1C61D7',
    'accent-200': '#0D47A1',
    'accent-100': '#072A60',
    'fg-100': '#ffffff',
    'fg-200': '#37383A'
  }
};
