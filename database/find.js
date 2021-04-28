const Name = require('./user');

module.exports = async function f1(query) {
  if (query === '') {
    return [];
  }
  const test = await Name.find({ name: { $regex: `^${query}` } }).select('-_id -__v');
  const arrayOfStrings = test.map((entry) => entry.name);
  return arrayOfStrings;
};
