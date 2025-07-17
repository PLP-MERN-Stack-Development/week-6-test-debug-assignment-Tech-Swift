// Example validator (expand as needed)
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

module.exports = {
  isEmail: validateEmail,
  validateEmail
};
