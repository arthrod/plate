// Lines 15708-15711 in old_implementation.js
function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}
