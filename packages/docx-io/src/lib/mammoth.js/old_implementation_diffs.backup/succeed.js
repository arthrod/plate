// Lines 12108-12110 in old_implementation.js
function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}