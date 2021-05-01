const delay = async ms => {
  await new Promise(resolve => setTimeout(resolve, ms));
};

const loop = x => f => {
  if (x > 0) {
    f()
    loop (x - 1) (f)
  }
};

module.exports = {
  delay,
  loop
};