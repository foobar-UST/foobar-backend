/**
 * Generate an unique code for each order,
 * should be unique if not too many users placing order at the same time.
 * @param length code length
 * @returns string result code
 */
const generateIdentifier = length => {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.random() * chars.length);
  }

  return result;
};

module.exports = generateIdentifier;