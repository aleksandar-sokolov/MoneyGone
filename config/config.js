const config = {
    PORT : 5007,
    DB_CONNECTION: 'mongodb://localhost/exprenseSokolov',
    SECRET: 'tokensecret',
    COOKIE_NAME: 'USER-SESSION',
    SALT_ROUNDS: 7
};

module.exports = config;
