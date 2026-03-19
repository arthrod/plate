const DOCX_TOKEN_PATTERN_STRING = '\\[\\[DOCX_(INS|DEL|CMT)_(START|END):([\\s\\S]+?)\\]\\]';
const DOCX_TOKEN_REGEX = new RegExp(DOCX_TOKEN_PATTERN_STRING, 'g');
const text = "[[DOCX_CMT_START:%7B%22id%22%3A%221%22%7D]]hello[[DOCX_CMT_END:1]]";
console.log(text.match(DOCX_TOKEN_REGEX));
