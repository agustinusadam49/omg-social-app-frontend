const accessToken = () => localStorage.getItem("user_token");

module.exports = {
  accessToken,
};
