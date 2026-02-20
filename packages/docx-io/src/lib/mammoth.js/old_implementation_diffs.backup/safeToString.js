// Lines 15609-15616 in old_implementation.js
function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}
