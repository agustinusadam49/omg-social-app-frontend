const setToLocalStorageWhenSuccess = (tokenForStorage, usernameForStorage, userIdForStorage) => {
    localStorage.setItem("user_token", tokenForStorage);
    localStorage.setItem("user_name", usernameForStorage);
    localStorage.setItem("user_id", userIdForStorage);
}

module.exports = {
    setToLocalStorageWhenSuccess
}