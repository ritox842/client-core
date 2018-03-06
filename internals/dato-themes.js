const postcss = require('postcss');
const fs = require('fs');
const hexToRgba = require('hex-to-rgba');
const THEMIFY = 'themify';

let pallete;

/**
 *
 * @param propertyValue
 * @returns {string}
 */
function getThemifyValue( propertyValue, css, selector, property, classPrefix, darkRule ) {
  /** Regex to get the value inside the themify parenthesis */
  const regExp = /themify\(([^)]+)\)/gi;

  /** Remove the start and end ticks **/
  const value = propertyValue.replace(/'/g, '');

  /*  The value can be:
   *  themify({"light": ["primary-0", 0.5], "dark": "primary-700"})
   *  themify({"light": "primary-0", "dark": "primary-700"})
   *  linear-gradient(themify({"color": "primary-200", "opacity": "1"}), themify({"color": "primary-300", "opacity": "1"}))
   *  themify({"light": ["primary-100", "1"], "dark": ["primary-100", "1"]})
   *  1px solid themify({"light": ["primary-200", "1"], "dark": ["primary-200", "1"]})
   */

  function normalize( value ) {
    const parsed = JSON.parse(value);

    if( !parsed.dark || !parsed.light ) {
      throw new Error(`${parsed} has one variation, please replace it with themify(${parsed.dark || parsed.light})`);
    }

    if( !Array.isArray(parsed.light) ) {
      parsed.light = [parsed.light, 1];
    }

    if( !Array.isArray(parsed.dark) ) {
      parsed.dark = [parsed.dark, 1];
    }
    return parsed;
  }

  const themified = value.replace(regExp, ( occurrence, value ) => {
    const parsed = normalize(value);
    return `rgba(var(--${parsed.light[0]}), ${parsed.light[1]})`;
  });

  const darkVariation = value.replace(regExp, ( occurrence, value ) => {
    const parsed = normalize(value);
    return `rgba(var(--${parsed.dark[0]}), ${parsed.dark[1]})`;
  });

  darkRule.append(postcss.decl({ prop: property, value: darkVariation }));
  css.append(darkRule);

  return {
    newValue: themified
  }

};

module.exports = postcss.plugin('datoThemes', ( options = {} ) => {

  /** Generate the variables file */
  if( options.createVarsFile && !pallete ) {
    pallete = options.pallete;
    generateVariablesFile(pallete, options.varsPath, options.classPrefix);
  }

  return css => {
    css.walkRules(rule => {
      const darkRule = rule.clone();
      darkRule.removeAll();
      darkRule.selector = '.dark ' + darkRule.selector;

      rule.walkDecls(( decl, i ) => {
        const propertyValue = decl.value;

        const hasThemify = propertyValue.indexOf(THEMIFY) > -1;

        if( hasThemify ) {
          const finalValue = getThemifyValue(propertyValue, css, rule.selector, decl.prop, options.classPrefix || '', darkRule);
          decl.value = finalValue.newValue;
        }
      });
    });
  }
});

/**
 * This function responsible for creating the vars.css file.
 *
 *  The output should look like the following:
 *
 *  .light {
       --primary-700: 255, 255, 255;
       --primary-600: 248, 248, 249;
       --primary-500: 242, 242, 244;
 *   }
 *
 *  .dark {
       --primary-700: 255, 255, 255;
       --primary-600: 248, 248, 249;
       --primary-500: 242, 242, 244;
 *   }
 *
 */
function generateVariablesFile( pallete, path, prefix ) {
  let cssVars = '';
  prefix = prefix || '';
  Object.keys(pallete).forEach(themeName => {
    const output = `${themeName === 'light' ? ':root' : '.' + prefix + themeName} {
     ${Object.keys(pallete[themeName]).map(varName => {
      return `--${varName}: ${getRgbaNumbers(pallete[themeName][varName])};`
    }).join(' ')}
  }`
    cssVars = `${cssVars} ${output}`
  });

  fs.writeFileSync(path, cssVars);
}

/**
 * Get the rgba as 88, 88, 33 instead rgba(88, 88, 33, 1)
 * @param value
 * @returns {void|string|*}
 */
function getRgbaNumbers( value ) {
  return hexToRgba(value).replace('rgba(', '').replace(', 1)', '')
}
