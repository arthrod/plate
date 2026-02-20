// Lines 1-50 in old_implementation.js
// Module: @xmldom/xmldom@0.8.11
// License: MIT
//
// Module: base64-js@1.5.1
// License: MIT
//
// Module: bluebird@3.4.7
// License: MIT
//
// Module: buffer@4.9.2
// License: MIT
//
// Module: dingbat-to-unicode@1.0.1
// License: BSD-2-Clause
//
// Module: ieee754@1.2.1
// License: BSD-3-Clause
//
// Module: isarray@1.0.0
// License: MIT
//
// Module: jszip@3.10.1
// License: (MIT OR GPL-3.0-or-later)
//
// Module: lop@0.4.2
// License: BSD-2-Clause
//
// Module: mammoth@1.11.0
// License: BSD-2-Clause
//
// Module: option@0.2.4
// License: BSD-2-Clause
//
// Module: process@0.11.10
// License: MIT
//
// Module: timers-browserify@1.4.2
// License: MIT
//
// Module: underscore@1.13.7
// License: MIT
//
// Module: xmlbuilder@10.1.1
// License: MIT
//
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mammoth = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var promises = require('../../lib/promises');

exports.Files = Files;
