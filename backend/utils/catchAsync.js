module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Whenever there is an error in an async function, it will run the catch block
  };
};
