// 150 => 50
// 50 => 0
// fg-200 => primary-0
// fg-100 => primary-600
/**
 *
 * @param lightVar
 * @returns {string}
 */
module.exports.getInverse = function(lightVar) {
  switch (lightVar) {
    case 'primary-700':
      return 'primary-0';
    case 'primary-600':
      return 'primary-50';
    case 'primary-500':
      return 'primary-100';
    case 'primary-400':
      return 'primary-200';
    case 'primary-300':
      return 'primary-300';
    case 'primary-200':
      return 'primary-400';
    case 'primary-100':
      return 'primary-500';
    case 'primary-50':
      return 'primary-600';
    case 'primary-0':
      return 'primary-700';
    case 'accent-800':
      return 'accent 100'
    case 'accent-700':
      return 'accent-200';
    case 'accent-600':
      return 'accent-300';
    case 'accent-500':
      return 'accent-350';
    case 'accent-400':
      return 'accent-400';
    case 'accent-300':
      return 'accent-600';
    case 'accent-200':
      return 'accent-700';
    case 'accent-100':
      return 'accent-800';
    case 'fg-100':
      return 'fg-200';
    case 'fg-200':
      return 'fg-100';
  }
}
