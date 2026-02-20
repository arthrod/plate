// Lines 11251-11254 in old_implementation.js
function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}
