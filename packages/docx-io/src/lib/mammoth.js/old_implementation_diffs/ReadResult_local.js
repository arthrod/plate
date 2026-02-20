// lib/docx/body-reader.ts:805
function ReadResult(element, extra, messages) {
  this.value = element || [];
  this.extra = extra || [];
  this._result = new Result(
    {
      element: this.value,
      extra,
    },
    messages
  );
  this.messages = this._result.messages;
}
