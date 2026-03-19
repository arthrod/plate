import { DOMParser } from '@xmldom/xmldom';
const html = '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>';
const doc = new DOMParser().parseFromString(html, 'text/html');
console.log(doc.body);
console.log(doc.documentElement.getElementsByTagName('body')[0]);
