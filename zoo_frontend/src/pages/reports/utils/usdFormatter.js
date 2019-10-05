
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
/**
 * formats a number into $USD
 * @param {Number} rawNumber number to be formatted to USD currency standards
 */
const usdFormatter = (rawNumber) => {
  return formatter.format(rawNumber);
}

export default usdFormatter;
