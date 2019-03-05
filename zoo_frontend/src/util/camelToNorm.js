/**
 * helper function that takes camelCase word and converts to => "Camel Case"
 * sourced from: https://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
 * @param {String} s camelCase word to be converted
 * @returns {String} Proper Case
 */
const camelToNorm = (s) => s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
export default camelToNorm;
