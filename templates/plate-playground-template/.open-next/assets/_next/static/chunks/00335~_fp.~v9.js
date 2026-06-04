(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,742033,e=>{"use strict";let t,i,a;var r=e.i(271645),n=Object.create,s=Object.defineProperty,o=Object.getOwnPropertyDescriptor,l=Object.getOwnPropertyNames,d=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty,c=function(e,t){return function(){return e&&(t=e(e=0)),t}},h=function(e,t){return function(){return t||e((t={exports:{}}).exports,t),t.exports}},m=function(e,t,i,a){if(t&&"object"==typeof t||"function"==typeof t)for(var r,n=l(t),d=0,c=n.length;d<c;d++)r=n[d],u.call(e,r)||r===i||s(e,r,{get:(function(e){return t[e]}).bind(null,r),enumerable:!(a=o(t,r))||a.enumerable});return e},v=function(e,t,i){return i=null!=e?n(d(e)):{},m(!t&&e&&e.__esModule?i:s(i,"default",{value:e,enumerable:!0}),e)},b=h(function(t,i){i.exports="u">typeof window?window:e.g});function g(e,t){return null!=t&&"u">typeof Symbol&&t[Symbol.hasInstance]?!!t[Symbol.hasInstance](e):g(e,t)}var f=c(function(){f()});function E(e){return e&&"u">typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}var y=c(function(){}),_=h(function(e,t){var i=Array.prototype.slice;t.exports=function(e,t){for(("length"in e)||(e=[e]),e=i.call(e);e.length;){var a=e.shift(),r=t(a);if(r)return r;a.childNodes&&a.childNodes.length&&(e=i.call(a.childNodes).concat(e))}}}),T=h(function(e,t){function i(e,t){if(!g(this,i))return new i(e,t);this.data=e,this.nodeValue=e,this.length=e.length,this.ownerDocument=t||null}f(),t.exports=i,i.prototype.nodeType=8,i.prototype.nodeName="#comment",i.prototype.toString=function(){return"[object Comment]"}}),A=h(function(e,t){function i(e,t){if(!g(this,i))return new i(e);this.data=e||"",this.length=this.data.length,this.ownerDocument=t||null}f(),t.exports=i,i.prototype.type="DOMTextNode",i.prototype.nodeType=3,i.prototype.nodeName="#text",i.prototype.toString=function(){return this.data},i.prototype.replaceData=function(e,t,i){var a=this.data,r=a.substring(0,e),n=a.substring(e+t,a.length);this.data=r+i+n,this.length=this.data.length}}),k=h(function(e,t){t.exports=function(e){var t=this,i=e.type;e.target||(e.target=t),t.listeners||(t.listeners={});var a=t.listeners[i];if(a)return a.forEach(function(i){e.currentTarget=t,"function"==typeof i?i(e):i.handleEvent(e)});t.parentNode&&t.parentNode.dispatchEvent(e)}}),w=h(function(e,t){t.exports=function(e,t){this.listeners||(this.listeners={}),this.listeners[e]||(this.listeners[e]=[]),-1===this.listeners[e].indexOf(t)&&this.listeners[e].push(t)}}),S=h(function(e,t){t.exports=function(e,t){if(this.listeners&&this.listeners[e]){var i=this.listeners[e],a=i.indexOf(t);-1!==a&&i.splice(a,1)}}}),I=h(function(e,t){y(),t.exports=function e(t){switch(t.nodeType){case 3:return r(t.data);case 8:return"<!--"+t.data+"-->";default:var n,s,o;return s=[],o=(n=t).tagName,"http://www.w3.org/1999/xhtml"===n.namespaceURI&&(o=o.toLowerCase()),s.push("<"+o+function(e){var t=[];for(var i in e)(function(e,t){var i=E(e[t]);return"style"===t&&Object.keys(e.style).length>0||e.hasOwnProperty(t)&&("string"===i||"boolean"===i||"number"===i)&&"nodeName"!==t&&"className"!==t&&"tagName"!==t&&"textContent"!==t&&"innerText"!==t&&"namespaceURI"!==t&&"innerHTML"!==t})(e,i)&&t.push({name:i,value:e[i]});for(var r in e._attributes)for(var n in e._attributes[r]){var s=e._attributes[r][n],o=(s.prefix?s.prefix+":":"")+n;t.push({name:o,value:s.value})}return e.className&&t.push({name:"class",value:e.className}),t.length?a(t):""}(n)+function(e){var t=e.dataset,i=[];for(var r in t)i.push({name:"data-"+r,value:t[r]});return i.length?a(i):""}(n)),i.indexOf(o)>-1?s.push(" />"):(s.push(">"),n.childNodes.length?s.push.apply(s,n.childNodes.map(e)):n.textContent||n.innerText?s.push(r(n.textContent||n.innerText)):n.innerHTML&&s.push(n.innerHTML),s.push("</"+o+">")),s.join("")}};var i=["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];function a(e){var t=[];return e.forEach(function(e){var i=e.name,a=e.value;"style"===i&&(a=function(e){if("string"==typeof e)return e;var t="";return Object.keys(e).forEach(function(i){var a=e[i];i=i.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()}),t+=i+":"+a+";"}),t}(a)),t.push(i+'="'+r(a).replace(/"/g,"&quot;")+'"')}),t.length?" "+t.join(" "):""}function r(e){var t="";return"string"==typeof e?t=e:e&&(t=e.toString()),t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}}),C=h(function(e,t){f();var i=_(),a=k(),r=w(),n=S(),s=I(),o="http://www.w3.org/1999/xhtml";function l(e,t,i){if(!g(this,l))return new l(e);var a=void 0===i?o:i||null;this.tagName=a===o?String(e).toUpperCase():e,this.nodeName=this.tagName,this.className="",this.dataset={},this.childNodes=[],this.parentNode=null,this.style={},this.ownerDocument=t||null,this.namespaceURI=a,this._attributes={},"INPUT"===this.tagName&&(this.type="text")}t.exports=l,l.prototype.type="DOMElement",l.prototype.nodeType=1,l.prototype.appendChild=function(e){return e.parentNode&&e.parentNode.removeChild(e),this.childNodes.push(e),e.parentNode=this,e},l.prototype.replaceChild=function(e,t){e.parentNode&&e.parentNode.removeChild(e);var i=this.childNodes.indexOf(t);return t.parentNode=null,this.childNodes[i]=e,e.parentNode=this,t},l.prototype.removeChild=function(e){var t=this.childNodes.indexOf(e);return this.childNodes.splice(t,1),e.parentNode=null,e},l.prototype.insertBefore=function(e,t){e.parentNode&&e.parentNode.removeChild(e);var i=null==t?-1:this.childNodes.indexOf(t);return i>-1?this.childNodes.splice(i,0,e):this.childNodes.push(e),e.parentNode=this,e},l.prototype.setAttributeNS=function(e,t,i){var a=null,r=t,n=t.indexOf(":");(n>-1&&(a=t.substr(0,n),r=t.substr(n+1)),"INPUT"===this.tagName&&"type"===t)?this.type=i:(this._attributes[e]||(this._attributes[e]={}))[r]={value:i,prefix:a}},l.prototype.getAttributeNS=function(e,t){var i=this._attributes[e],a=i&&i[t]&&i[t].value;return"INPUT"===this.tagName&&"type"===t?this.type:"string"!=typeof a?null:a},l.prototype.removeAttributeNS=function(e,t){var i=this._attributes[e];i&&delete i[t]},l.prototype.hasAttributeNS=function(e,t){var i=this._attributes[e];return!!i&&t in i},l.prototype.setAttribute=function(e,t){return this.setAttributeNS(null,e,t)},l.prototype.getAttribute=function(e){return this.getAttributeNS(null,e)},l.prototype.removeAttribute=function(e){return this.removeAttributeNS(null,e)},l.prototype.hasAttribute=function(e){return this.hasAttributeNS(null,e)},l.prototype.removeEventListener=n,l.prototype.addEventListener=r,l.prototype.dispatchEvent=a,l.prototype.focus=function(){},l.prototype.toString=function(){return s(this)},l.prototype.getElementsByClassName=function(e){var t=e.split(" "),a=[];return i(this,function(e){if(1===e.nodeType){var i=(e.className||"").split(" ");t.every(function(e){return -1!==i.indexOf(e)})&&a.push(e)}}),a},l.prototype.getElementsByTagName=function(e){e=e.toLowerCase();var t=[];return i(this.childNodes,function(i){1===i.nodeType&&("*"===e||i.tagName.toLowerCase()===e)&&t.push(i)}),t},l.prototype.contains=function(e){return i(this,function(t){return e===t})||!1}}),R=h(function(e,t){f();var i=C();function a(e){if(!g(this,a))return new a;this.childNodes=[],this.parentNode=null,this.ownerDocument=e||null}t.exports=a,a.prototype.type="DocumentFragment",a.prototype.nodeType=11,a.prototype.nodeName="#document-fragment",a.prototype.appendChild=i.prototype.appendChild,a.prototype.replaceChild=i.prototype.replaceChild,a.prototype.removeChild=i.prototype.removeChild,a.prototype.toString=function(){return this.childNodes.map(function(e){return String(e)}).join("")}}),L=h(function(e,t){function i(e){}t.exports=i,i.prototype.initEvent=function(e,t,i){this.type=e,this.bubbles=t,this.cancelable=i},i.prototype.preventDefault=function(){}}),M=h(function(e,t){f();var i=_(),a=T(),r=A(),n=C(),s=R(),o=L(),l=k(),d=w(),u=S();function c(){if(!g(this,c))return new c;this.head=this.createElement("head"),this.body=this.createElement("body"),this.documentElement=this.createElement("html"),this.documentElement.appendChild(this.head),this.documentElement.appendChild(this.body),this.childNodes=[this.documentElement],this.nodeType=9}t.exports=c;var h=c.prototype;h.createTextNode=function(e){return new r(e,this)},h.createElementNS=function(e,t){return new n(t,this,null===e?null:String(e))},h.createElement=function(e){return new n(e,this)},h.createDocumentFragment=function(){return new s(this)},h.createEvent=function(e){return new o(e)},h.createComment=function(e){return new a(e,this)},h.getElementById=function(e){return e=String(e),i(this.childNodes,function(t){if(String(t.id)===e)return t})||null},h.getElementsByClassName=n.prototype.getElementsByClassName,h.getElementsByTagName=n.prototype.getElementsByTagName,h.contains=n.prototype.contains,h.removeEventListener=u,h.addEventListener=d,h.dispatchEvent=l}),x=h(function(e,t){t.exports=new(M())}),D=h(function(t,i){var a,r=e.g,n=x();"u">typeof document?a=document:(a=r["__GLOBAL_DOCUMENT_CACHE@4"])||(a=r["__GLOBAL_DOCUMENT_CACHE@4"]=n),i.exports=a});function P(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,a=Array(t);i<t;i++)a[i]=e[i];return a}function O(e,t){if(e){if("string"==typeof e)return P(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);if("Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i)return Array.from(i);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return P(e,t)}}function N(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var a,r,n=[],s=!0,o=!1;try{for(i=i.call(e);!(s=(a=i.next()).done)&&(n.push(a.value),!(t&&n.length===t));s=!0);}catch(e){o=!0,r=e}finally{try{s||null==i.return||i.return()}finally{if(o)throw r}}return n}}(e,t)||O(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var U=v(b()),H=v(b()),B=v(b()),W=function(){var e=B.default.performance,t=e&&e.timing,i=t&&t.navigationStart;return Math.round("number"==typeof i&&"function"==typeof e.now?i+e.now():Date.now())},$=function(){if("function"==typeof(null==(e=H.default.crypto)?void 0:e.getRandomValues)){i=new Uint8Array(32),H.default.crypto.getRandomValues(i);for(var e,t,i,a=0;a<32;a++)i[a]=i[a]%16}else{i=[];for(var r=0;r<32;r++)i[r]=16*Math.random()|0}var n=0;t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t="x"===e?i[n]:3&i[n]|8;return n++,t.toString(16)});var s=W(),o=null==s?void 0:s.toString(16).substring(3);return o?t.substring(0,28)+o:t},q=function(){return("000000"+(0x81bf1000*Math.random()|0).toString(36)).slice(-6)},V=function(e){var t;if(e&&void 0!==e.nodeName)return e.muxId||(e.muxId=q()),e.muxId;try{t=document.querySelector(e)}catch(e){}return t&&!t.muxId&&(t.muxId=e),(null==t?void 0:t.muxId)||e},F=function(e){e&&void 0!==e.nodeName?e=V(t=e):t=document.querySelector(e);var t,i=t&&t.nodeName?t.nodeName.toLowerCase():"";return[t,e,i]};function K(e){return function(e){if(Array.isArray(e))return P(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||O(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var j=function(e){var t,i,a,r,n,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,o=e?[console,e]:[console],l=(t=console.trace).bind.apply(t,K(o)),d=(i=console.info).bind.apply(i,K(o)),u=(a=console.debug).bind.apply(a,K(o)),c=(r=console.warn).bind.apply(r,K(o)),h=(n=console.error).bind.apply(n,K(o)),m=s;return{trace:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];if(!(m>0))return l.apply(void 0,K(t))},debug:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];if(!(m>1))return u.apply(void 0,K(t))},info:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];if(!(m>2))return d.apply(void 0,K(t))},warn:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];if(!(m>3))return c.apply(void 0,K(t))},error:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];if(!(m>4))return h.apply(void 0,K(t))},get level(){return m},set level(p){p!==this.level&&(m=null!=p?p:s)}}}("[mux]"),Y=v(b());function G(){return"1"===(Y.default.doNotTrack||Y.default.navigator&&Y.default.navigator.doNotTrack)}function Q(e){if(void 0===e)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function z(e,t){if(!g(e,t))throw TypeError("Cannot call a class as a function")}function Z(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function X(e,t,i){return t&&Z(e.prototype,t),i&&Z(e,i),e}function J(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function ee(e){return(ee=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function et(e,t,i){return(et="u">typeof Reflect&&Reflect.get?Reflect.get:function(e,t,i){var a=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=ee(e)););return e}(e,t);if(a){var r=Object.getOwnPropertyDescriptor(a,t);return r.get?r.get.call(i||e):r.value}})(e,t,i||e)}function ei(e,t){return(ei=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}f(),y();var ea=function(e){return er(e)[0]},er=function(e){if("string"!=typeof e||""===e)return["localhost"];var t,i=(e.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/)||[])[4];return i&&(t=(i.match(/[^\.]+\.[^\.]+$/)||[])[0]),[i,t]},en=v(b()),es=function(){var e=en.default.performance;return void 0!==(e&&e.timing)},eo=function(){var e=en.default.performance,t=e&&e.timing;return t&&t.domContentLoadedEventEnd},el=function(){var e=en.default.performance,t=e&&e.timing;return t&&t.navigationStart};function ed(e,t,i){i=void 0===i?1:i,e[t]=e[t]||0,e[t]+=i}function eu(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{},a=Object.keys(i);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(i).filter(function(e){return Object.getOwnPropertyDescriptor(i,e).enumerable}))),a.forEach(function(t){J(e,t,i[t])})}return e}function ec(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):(function(e){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t.push.apply(t,i)}return t})(Object(t)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(t,i))}),e}var eh=["x-request-id","cf-ray","x-amz-cf-id","x-akamai-request-id"],em=["x-cdn","content-type"].concat(eh);function ep(e){var t={};return(e=e||"").trim().split(/[\r\n]+/).forEach(function(e){if(e){var i=e.split(": "),a=i.shift();a&&(em.indexOf(a.toLowerCase())>=0||0===a.toLowerCase().indexOf("x-litix-"))&&(t[a]=i.join(": "))}}),t}function ev(e){if(e){var t=eh.find(function(t){return void 0!==e[t]});return t?e[t]:void 0}}var eb=function(e){var t={};for(var i in e){var a=e[i];-1!==a["DATA-ID"].search("io.litix.data.")&&(t[a["DATA-ID"].replace("io.litix.data.","")]=a.VALUE)}return t},eg=function(e){if(!e)return{};var t=el(),i=e.loading,a=i?i.start:e.trequest,r=i?i.first:e.tfirst,n=i?i.end:e.tload;return{bytesLoaded:e.total,requestStart:Math.round(t+a),responseStart:Math.round(t+r),responseEnd:Math.round(t+n)}},ef=function(e){if(!(!e||"function"!=typeof e.getAllResponseHeaders))return ep(e.getAllResponseHeaders())},eE=function(e,t,i){arguments.length>3&&void 0!==arguments[3]&&arguments[3];var a=arguments.length>4?arguments[4]:void 0,r=e.log,n=e.utils.secondsToMs,s=function(e){var t,i=parseInt(a.version);return 1===i&&null!==e.programDateTime&&(t=e.programDateTime),0===i&&null!==e.pdt&&(t=e.pdt),t};if(!es())return void r.warn("performance timing not supported. Not tracking HLS.js.");var o=function(i,a){return e.emit(t,i,a)},l=function(e,t){var i=t.levels,a=t.audioTracks,r=t.url,n=t.stats,s=t.networkDetails,l=t.sessionData,d={},u={};i.forEach(function(e,t){d[t]={width:e.width,height:e.height,bitrate:e.bitrate,attrs:e.attrs}}),a.forEach(function(e,t){u[t]={name:e.name,language:e.lang,bitrate:e.bitrate}});var c=eg(n),h=c.bytesLoaded,m=c.requestStart,v=c.responseStart,b=c.responseEnd;o("requestcompleted",ec(eu({},eb(l)),{request_event_type:e,request_bytes_loaded:h,request_start:m,request_response_start:v,request_response_end:b,request_type:"manifest",request_hostname:ea(r),request_response_headers:ef(s),request_rendition_lists:{media:d,audio:u,video:{}}}))};i.on(a.Events.MANIFEST_LOADED,l);var d=function(e,t){var i=t.details,a=t.level,r=t.networkDetails,l=eg(t.stats),d=l.bytesLoaded,u=l.requestStart,c=l.responseStart,h=l.responseEnd,m=i.fragments[i.fragments.length-1],v=s(m)+n(m.duration);o("requestcompleted",{request_event_type:e,request_bytes_loaded:d,request_start:u,request_response_start:c,request_response_end:h,request_current_level:a,request_type:"manifest",request_hostname:ea(i.url),request_response_headers:ef(r),video_holdback:i.holdBack&&n(i.holdBack),video_part_holdback:i.partHoldBack&&n(i.partHoldBack),video_part_target_duration:i.partTarget&&n(i.partTarget),video_target_duration:i.targetduration&&n(i.targetduration),video_source_is_live:i.live,player_manifest_newest_program_time:isNaN(v)?void 0:v})};i.on(a.Events.LEVEL_LOADED,d);var u=function(e,t){var i=t.details,a=t.networkDetails,r=eg(t.stats);o("requestcompleted",{request_event_type:e,request_bytes_loaded:r.bytesLoaded,request_start:r.requestStart,request_response_start:r.responseStart,request_response_end:r.responseEnd,request_type:"manifest",request_hostname:ea(i.url),request_response_headers:ef(a)})};i.on(a.Events.AUDIO_TRACK_LOADED,u);var c=function(e,t){var a=t.stats,r=t.networkDetails,n=t.frag,s=eg(a=a||n.stats),l=s.bytesLoaded,d=s.requestStart,u=s.responseStart,c=s.responseEnd,h=r?ef(r):void 0,m={request_event_type:e,request_bytes_loaded:l,request_start:d,request_response_start:u,request_response_end:c,request_hostname:r?ea(r.responseURL):void 0,request_id:h?ev(h):void 0,request_response_headers:h,request_media_duration:n.duration,request_url:null==r?void 0:r.responseURL};"main"===n.type?(m.request_type="media",m.request_current_level=n.level,m.request_video_width=(i.levels[n.level]||{}).width,m.request_video_height=(i.levels[n.level]||{}).height,m.request_labeled_bitrate=(i.levels[n.level]||{}).bitrate):m.request_type=n.type,o("requestcompleted",m)};i.on(a.Events.FRAG_LOADED,c);var h=function(e,t){var i=t.frag,a=i.start;o("fragmentchange",{currentFragmentPDT:s(i),currentFragmentStart:n(a)})};i.on(a.Events.FRAG_CHANGED,h);var m=function(e,t){var i,r=t.type,n=t.details,s=t.response,l=t.fatal,d=t.frag,u=t.networkDetails,c=(null==d?void 0:d.url)||t.url||"",h=u?ef(u):void 0;(n===a.ErrorDetails.MANIFEST_LOAD_ERROR||n===a.ErrorDetails.MANIFEST_LOAD_TIMEOUT||n===a.ErrorDetails.FRAG_LOAD_ERROR||n===a.ErrorDetails.FRAG_LOAD_TIMEOUT||n===a.ErrorDetails.LEVEL_LOAD_ERROR||n===a.ErrorDetails.LEVEL_LOAD_TIMEOUT||n===a.ErrorDetails.AUDIO_TRACK_LOAD_ERROR||n===a.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT||n===a.ErrorDetails.SUBTITLE_LOAD_ERROR||n===a.ErrorDetails.SUBTITLE_LOAD_TIMEOUT||n===a.ErrorDetails.KEY_LOAD_ERROR||n===a.ErrorDetails.KEY_LOAD_TIMEOUT)&&o("requestfailed",{request_error:n,request_url:c,request_hostname:ea(c),request_id:h?ev(h):void 0,request_type:n===a.ErrorDetails.FRAG_LOAD_ERROR||n===a.ErrorDetails.FRAG_LOAD_TIMEOUT?"media":n===a.ErrorDetails.AUDIO_TRACK_LOAD_ERROR||n===a.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT?"audio":n===a.ErrorDetails.SUBTITLE_LOAD_ERROR||n===a.ErrorDetails.SUBTITLE_LOAD_TIMEOUT?"subtitle":n===a.ErrorDetails.KEY_LOAD_ERROR||n===a.ErrorDetails.KEY_LOAD_TIMEOUT?"encryption":"manifest",request_error_code:null==s?void 0:s.code,request_error_text:null==s?void 0:s.text}),l&&o("error",{player_error_code:r,player_error_message:n,player_error_context:"".concat(c?"url: ".concat(c,"\n"):"")+"".concat(s&&(s.code||s.text)?"response: ".concat(s.code,", ").concat(s.text,"\n"):"")+"".concat(t.reason?"failure reason: ".concat(t.reason,"\n"):"")+"".concat(t.level?"level: ".concat(t.level,"\n"):"")+"".concat(t.parent?"parent stream controller: ".concat(t.parent,"\n"):"")+"".concat(t.buffer?"buffer length: ".concat(t.buffer,"\n"):"")+"".concat(t.error?"error: ".concat(t.error,"\n"):"")+"".concat(t.event?"event: ".concat(t.event,"\n"):"")+"".concat(t.err?"error message: ".concat(null==(i=t.err)?void 0:i.message,"\n"):"")})};i.on(a.Events.ERROR,m);var v=function(e,t){var i=t.frag,a=i&&i._url||"";o("requestcanceled",{request_event_type:e,request_url:a,request_type:"media",request_hostname:ea(a)})};i.on(a.Events.FRAG_LOAD_EMERGENCY_ABORTED,v);var b=function(e,t){var a=t.level,n=i.levels[a];if(n&&n.attrs&&n.attrs.BANDWIDTH){var s,l=n.attrs.BANDWIDTH,d=parseFloat(n.attrs["FRAME-RATE"]);isNaN(d)||(s=d),l?o("renditionchange",{video_source_fps:s,video_source_bitrate:l,video_source_width:n.width,video_source_height:n.height,video_source_rendition_name:n.name,video_source_codec:null==n?void 0:n.videoCodec}):r.warn("missing BANDWIDTH from HLS manifest parsed by HLS.js")}};i.on(a.Events.LEVEL_SWITCHED,b),i._stopMuxMonitor=function(){i.off(a.Events.MANIFEST_LOADED,l),i.off(a.Events.LEVEL_LOADED,d),i.off(a.Events.AUDIO_TRACK_LOADED,u),i.off(a.Events.FRAG_LOADED,c),i.off(a.Events.FRAG_CHANGED,h),i.off(a.Events.ERROR,m),i.off(a.Events.FRAG_LOAD_EMERGENCY_ABORTED,v),i.off(a.Events.LEVEL_SWITCHED,b),i.off(a.Events.DESTROYING,i._stopMuxMonitor),delete i._stopMuxMonitor},i.on(a.Events.DESTROYING,i._stopMuxMonitor)},ey=function(e){e&&"function"==typeof e._stopMuxMonitor&&e._stopMuxMonitor()},e_=function(e,t){if(!e||!e.requestEndDate)return{};var i,a=ea(e.url),r=e.url,n=e.bytesLoaded,s=new Date(e.requestStartDate).getTime(),o=new Date(e.firstByteDate).getTime(),l=new Date(e.requestEndDate).getTime(),d=isNaN(e.duration)?0:e.duration,u="function"==typeof t.getMetricsFor?t.getMetricsFor(e.mediaType).HttpList:t.getDashMetrics().getHttpRequests(e.mediaType);u.length>0&&(i=ep(u[u.length-1]._responseHeaders||""));var c=i?ev(i):void 0;return{requestStart:s,requestResponseStart:o,requestResponseEnd:l,requestBytesLoaded:n,requestResponseHeaders:i,requestMediaDuration:d,requestHostname:a,requestUrl:r,requestId:c}},eT=function(e,t){if("function"==typeof t.getCurrentRepresentationForType){var i=t.getCurrentRepresentationForType(e);return i?{currentLevel:i.absoluteIndex,renditionWidth:i.width||null,renditionHeight:i.height||null,renditionBitrate:i.bandwidth}:{}}var a=t.getQualityFor(e),r=t.getCurrentTrackFor(e).bitrateList;return r?{currentLevel:a,renditionWidth:r[a].width||null,renditionHeight:r[a].height||null,renditionBitrate:r[a].bandwidth}:{}},eA=function(e){var t;return null==(t=e.match(/.*codecs\*?="(.*)"/))?void 0:t[1]},ek=function(e){try{var t,i;return null==(i=e.getVersion)||null==(t=i.call(e))?void 0:t.split(".").map(function(e){return parseInt(e)})[0]}catch(e){return!1}},ew=function(e,t,i){arguments.length>3&&void 0!==arguments[3]&&arguments[3];var a=e.log;if(!i||!i.on)return void a.warn("Invalid dash.js player reference. Monitoring blocked.");var r=ek(i),n=function(i,a){return e.emit(t,i,a)},s=function(e){var t=e.type,i=(e.data||{}).url;n("requestcompleted",{request_event_type:t,request_start:0,request_response_start:0,request_response_end:0,request_bytes_loaded:-1,request_type:"manifest",request_hostname:ea(i),request_url:i})};i.on("manifestLoaded",s);var o={},l=function(e){if("function"!=typeof e.getRequests)return null;var t=e.getRequests({state:"executed"});return 0===t.length?null:t[t.length-1]},d=function(e){var t=e.type,a=e.chunk,r=e.request,s=(a||{}).mediaInfo||{},l=s.type,d=s.bitrateList,u={};(d=d||[]).forEach(function(e,t){u[t]={},u[t].width=e.width,u[t].height=e.height,u[t].bitrate=e.bandwidth,u[t].attrs={}}),"video"===l?o.video=u:"audio"===l?o.audio=u:o.media=u;var c=e_(r,i),h=c.requestStart,m=c.requestResponseStart,v=c.requestResponseEnd,b=c.requestResponseHeaders,g=c.requestMediaDuration,f=c.requestHostname,E=c.requestUrl;n("requestcompleted",{request_event_type:t,request_start:h,request_response_start:m,request_response_end:v,request_bytes_loaded:-1,request_type:l+"_init",request_response_headers:b,request_hostname:f,request_id:c.requestId,request_url:E,request_media_duration:g,request_rendition_lists:o})};r>=4?i.on("initFragmentLoaded",d):i.on("initFragmentLoaded",function(e){var t=e.type,i=e.fragmentModel,a=e.chunk;d({type:t,request:l(i),chunk:a})});var u=function(e){var t=e.type,a=e.chunk,r=e.request,s=a||{},o=s.mediaInfo,l=s.start,d=(o||{}).type,u=e_(r,i),c=u.requestStart,h=u.requestResponseStart,m=u.requestResponseEnd,v=u.requestBytesLoaded,b=u.requestResponseHeaders,g=u.requestMediaDuration,f=u.requestHostname,E=u.requestUrl,y=u.requestId,_=eT(d,i),T=_.currentLevel,A=_.renditionWidth,k=_.renditionHeight;n("requestcompleted",{request_event_type:t,request_start:c,request_response_start:h,request_response_end:m,request_bytes_loaded:v,request_type:d,request_response_headers:b,request_hostname:f,request_id:y,request_url:E,request_media_start_time:l,request_media_duration:g,request_current_level:T,request_labeled_bitrate:_.renditionBitrate,request_video_width:A,request_video_height:k})};r>=4?i.on("mediaFragmentLoaded",u):i.on("mediaFragmentLoaded",function(e){var t=e.type,i=e.fragmentModel,a=e.chunk;u({type:t,request:l(i),chunk:a})});var c={video:void 0,audio:void 0,totalBitrate:void 0},h=function(){if(c.video&&"number"==typeof c.video.bitrate){if(!(c.video.width&&c.video.height))return void a.warn("have bitrate info for video but missing width/height");var e=c.video.bitrate;if(c.audio&&"number"==typeof c.audio.bitrate&&(e+=c.audio.bitrate),e!==c.totalBitrate)return c.totalBitrate=e,{video_source_bitrate:e,video_source_height:c.video.height,video_source_width:c.video.width,video_source_codec:eA(c.video.codec)}}},m=function(e,t,r){var s=e.mediaType;if("audio"===s||"video"===s){if("function"==typeof i.getRepresentationsByType)if(e.newRepresentation)o={bitrate:e.newRepresentation.bandwidth,width:e.newRepresentation.width,height:e.newRepresentation.height,qualityIndex:e.newRepresentation.absoluteIndex};else{var o,l=i.getRepresentationsByType(s);if(l&&"number"==typeof e.newQuality){var d=l.find(function(t){return t.absoluteIndex===e.newQuality||t.index===e.newQuality});d&&(o={bitrate:d.bandwidth,width:d.width,height:d.height,qualityIndex:e.newQuality})}}else{if("number"!=typeof e.newQuality)return void a.warn("missing evt.newQuality in qualityChangeRendered event",e);o=i.getBitrateInfoListFor(s).find(function(t){return t.qualityIndex===e.newQuality})}if(!(o&&"number"==typeof o.bitrate))return void a.warn("missing bitrate info for ".concat(s));c[s]=ec(eu({},o),{codec:i.getCurrentTrackFor(s).codec});var u=h();u&&n("renditionchange",u)}};i.on("qualityChangeRendered",m);var v=function(e){var t=e.request,i=e.mediaType;n("requestcanceled",{request_event_type:(t=t||{}).type+"_"+t.action,request_url:t.url,request_type:i,request_hostname:ea(t.url)})};i.on("fragmentLoadingAbandoned",v);var b=function(e){var t,i,a=e.error,r=(null==a||null==(t=a.data)?void 0:t.request)||{},s=(null==a||null==(i=a.data)?void 0:i.response)||{};(null==a?void 0:a.code)===27&&n("requestfailed",{request_error:r.type+"_"+r.action,request_url:r.url,request_hostname:ea(r.url),request_type:r.mediaType,request_error_code:s.status,request_error_text:s.statusText});var o="".concat(null!=r&&r.url?"url: ".concat(r.url,"\n"):"")+"".concat(null!=s&&s.status||null!=s&&s.statusText?"response: ".concat(null==s?void 0:s.status,", ").concat(null==s?void 0:s.statusText,"\n"):"");n("error",{player_error_code:null==a?void 0:a.code,player_error_message:null==a?void 0:a.message,player_error_context:o})};i.on("error",b),i._stopMuxMonitor=function(){i.off("manifestLoaded",s),i.off("initFragmentLoaded",d),i.off("mediaFragmentLoaded",u),i.off("qualityChangeRendered",m),i.off("error",b),i.off("fragmentLoadingAbandoned",v),delete i._stopMuxMonitor}},eS=function(e){e&&"function"==typeof e._stopMuxMonitor&&e._stopMuxMonitor()},eI=0,eC=function(){function e(){z(this,e),J(this,"_listeners",void 0)}return X(e,[{key:"on",value:function(e,t,i){return t._eventEmitterGuid=t._eventEmitterGuid||++eI,this._listeners=this._listeners||{},this._listeners[e]=this._listeners[e]||[],i&&(t=t.bind(i)),this._listeners[e].push(t),t}},{key:"off",value:function(e,t){var i=this._listeners&&this._listeners[e];i&&i.forEach(function(e,a){e._eventEmitterGuid===t._eventEmitterGuid&&i.splice(a,1)})}},{key:"one",value:function(e,t,i){var a=this;t._eventEmitterGuid=t._eventEmitterGuid||++eI;var r=function(){a.off(e,r),t.apply(i||this,arguments)};r._eventEmitterGuid=t._eventEmitterGuid,this.on(e,r)}},{key:"emit",value:function(e,t){var i=this;if(this._listeners){t=t||{};var a=this._listeners["before"+e]||[],r=this._listeners["before*"]||[],n=this._listeners[e]||[],s=this._listeners["after"+e]||[],o=function(t,a){(t=t.slice()).forEach(function(t){t.call(i,{type:e},a)})};o(a,t),o(r,t),o(n,t),o(s,t)}}}]),e}(),eR=v(b()),eL=function(){function e(t){var i=this;z(this,e),J(this,"_playbackHeartbeatInterval",void 0),J(this,"_playheadShouldBeProgressing",void 0),J(this,"pm",void 0),this.pm=t,this._playbackHeartbeatInterval=null,this._playheadShouldBeProgressing=!1,t.on("playing",function(){i._playheadShouldBeProgressing=!0}),t.on("play",this._startPlaybackHeartbeatInterval.bind(this)),t.on("playing",this._startPlaybackHeartbeatInterval.bind(this)),t.on("adbreakstart",this._startPlaybackHeartbeatInterval.bind(this)),t.on("adplay",this._startPlaybackHeartbeatInterval.bind(this)),t.on("adplaying",this._startPlaybackHeartbeatInterval.bind(this)),t.on("devicewake",this._startPlaybackHeartbeatInterval.bind(this)),t.on("viewstart",this._startPlaybackHeartbeatInterval.bind(this)),t.on("rebufferstart",this._startPlaybackHeartbeatInterval.bind(this)),t.on("pause",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("ended",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("viewend",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("error",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("aderror",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("adpause",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("adended",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("adbreakend",this._stopPlaybackHeartbeatInterval.bind(this)),t.on("seeked",function(){t.data.player_is_paused?i._stopPlaybackHeartbeatInterval():i._startPlaybackHeartbeatInterval()}),t.on("timeupdate",function(){null!==i._playbackHeartbeatInterval&&t.emit("playbackheartbeat")}),t.on("devicesleep",function(e,a){null!==i._playbackHeartbeatInterval&&(eR.default.clearInterval(i._playbackHeartbeatInterval),t.emit("playbackheartbeatend",{viewer_time:a.viewer_time}),i._playbackHeartbeatInterval=null)})}return X(e,[{key:"_startPlaybackHeartbeatInterval",value:function(){var e=this;null===this._playbackHeartbeatInterval&&(this.pm.emit("playbackheartbeat"),this._playbackHeartbeatInterval=eR.default.setInterval(function(){e.pm.emit("playbackheartbeat")},this.pm.playbackHeartbeatTime))}},{key:"_stopPlaybackHeartbeatInterval",value:function(){this._playheadShouldBeProgressing=!1,null!==this._playbackHeartbeatInterval&&(eR.default.clearInterval(this._playbackHeartbeatInterval),this.pm.emit("playbackheartbeatend"),this._playbackHeartbeatInterval=null)}}]),e}(),eM=function e(t){var i=this;z(this,e),J(this,"viewErrored",void 0),t.on("viewinit",function(){i.viewErrored=!1}),t.on("error",function(e,a){try{var r=t.errorTranslator({player_error_code:a.player_error_code,player_error_message:a.player_error_message,player_error_context:a.player_error_context,player_error_severity:a.player_error_severity,player_error_business_exception:a.player_error_business_exception});r&&(t.data.player_error_code=r.player_error_code||a.player_error_code,t.data.player_error_message=r.player_error_message||a.player_error_message,t.data.player_error_context=r.player_error_context||a.player_error_context,t.data.player_error_severity=r.player_error_severity||a.player_error_severity,t.data.player_error_business_exception=r.player_error_business_exception||a.player_error_business_exception,i.viewErrored=!0)}catch(e){t.mux.log.warn("Exception in error translator callback.",e),i.viewErrored=!0}}),t.on("aftererror",function(){var e,i,a,r,n;null==(e=t.data)||delete e.player_error_code,null==(i=t.data)||delete i.player_error_message,null==(a=t.data)||delete a.player_error_context,null==(r=t.data)||delete r.player_error_severity,null==(n=t.data)||delete n.player_error_business_exception})},ex=function(){function e(t){z(this,e),J(this,"_watchTimeTrackerLastCheckedTime",void 0),J(this,"pm",void 0),this.pm=t,this._watchTimeTrackerLastCheckedTime=null,t.on("playbackheartbeat",this._updateWatchTime.bind(this)),t.on("playbackheartbeatend",this._clearWatchTimeState.bind(this))}return X(e,[{key:"_updateWatchTime",value:function(e,t){var i=t.viewer_time;null===this._watchTimeTrackerLastCheckedTime&&(this._watchTimeTrackerLastCheckedTime=i),ed(this.pm.data,"view_watch_time",i-this._watchTimeTrackerLastCheckedTime),this._watchTimeTrackerLastCheckedTime=i}},{key:"_clearWatchTimeState",value:function(e,t){this._updateWatchTime(e,t),this._watchTimeTrackerLastCheckedTime=null}}]),e}(),eD=function(){function e(t){var i=this;z(this,e),J(this,"_playbackTimeTrackerLastPlayheadPosition",void 0),J(this,"_lastTime",void 0),J(this,"_isAdPlaying",void 0),J(this,"_callbackUpdatePlaybackTime",void 0),J(this,"pm",void 0),this.pm=t,this._playbackTimeTrackerLastPlayheadPosition=-1,this._lastTime=W(),this._isAdPlaying=!1,this._callbackUpdatePlaybackTime=null,t.on("viewinit",function(){i.pm.data.view_playing_time_ms_cumulative=0});var a=this._startPlaybackTimeTracking.bind(this);t.on("playing",a),t.on("adplaying",a);var r=function(){i.pm.data.player_is_paused||a()};t.on("seeked",r),t.on("rebufferend",r);var n=this._stopPlaybackTimeTracking.bind(this);t.on("playbackheartbeatend",n),t.on("seeking",n),t.on("rebufferstart",n),t.on("adplaying",function(){i._isAdPlaying=!0}),t.on("adended",function(){i._isAdPlaying=!1}),t.on("adpause",function(){i._isAdPlaying=!1}),t.on("adbreakstart",function(){i._isAdPlaying=!1}),t.on("adbreakend",function(){i._isAdPlaying=!1}),t.on("adplay",function(){i._isAdPlaying=!1}),t.on("viewinit",function(){i._playbackTimeTrackerLastPlayheadPosition=-1,i._lastTime=W(),i._isAdPlaying=!1,i._callbackUpdatePlaybackTime=null})}return X(e,[{key:"_startPlaybackTimeTracking",value:function(){null===this._callbackUpdatePlaybackTime&&(this._callbackUpdatePlaybackTime=this._updatePlaybackTime.bind(this),this._playbackTimeTrackerLastPlayheadPosition=this.pm.data.player_playhead_time,this._lastTime=W(),this.pm.on("playbackheartbeat",this._callbackUpdatePlaybackTime))}},{key:"_stopPlaybackTimeTracking",value:function(){this._callbackUpdatePlaybackTime&&(this._updatePlaybackTime(),this.pm.off("playbackheartbeat",this._callbackUpdatePlaybackTime),this._callbackUpdatePlaybackTime=null,this._playbackTimeTrackerLastPlayheadPosition=-1)}},{key:"_updatePlaybackTime",value:function(){var e=this.pm.data.player_playhead_time||0,t=W(),i=t-this._lastTime,a=-1;this._playbackTimeTrackerLastPlayheadPosition>=0&&e>this._playbackTimeTrackerLastPlayheadPosition?a=e-this._playbackTimeTrackerLastPlayheadPosition:this._isAdPlaying&&(a=i),a>0&&a<=1e3&&ed(this.pm.data,"view_content_playback_time",a),null!==this._callbackUpdatePlaybackTime&&i>0&&i<=1e3&&(this._isAdPlaying&&ed(this.pm.data,"ad_playing_time_ms_cumulative",i),ed(this.pm.data,"view_playing_time_ms_cumulative",i)),this._playbackTimeTrackerLastPlayheadPosition=e,this._lastTime=t}}]),e}(),eP=function(){function e(t){z(this,e),J(this,"pm",void 0),this.pm=t;var i=this._updatePlayheadTime.bind(this);t.on("playbackheartbeat",i),t.on("playbackheartbeatend",i),t.on("timeupdate",i),t.on("destroy",function(){t.off("timeupdate",i)})}return X(e,[{key:"_updateMaxPlayheadPosition",value:function(){this.pm.data.view_max_playhead_position=void 0===this.pm.data.view_max_playhead_position?this.pm.data.player_playhead_time:Math.max(this.pm.data.view_max_playhead_position,this.pm.data.player_playhead_time)}},{key:"_updatePlayheadTime",value:function(e,t){var i=this,a=function(){i.pm.currentFragmentPDT&&i.pm.currentFragmentStart&&(i.pm.data.player_program_time=i.pm.currentFragmentPDT+i.pm.data.player_playhead_time-i.pm.currentFragmentStart)};if(t&&t.player_playhead_time)this.pm.data.player_playhead_time=t.player_playhead_time,a(),this._updateMaxPlayheadPosition();else if(this.pm.getPlayheadTime){var r=this.pm.getPlayheadTime();void 0!==r&&(this.pm.data.player_playhead_time=r,a(),this._updateMaxPlayheadPosition())}}}]),e}(),eO=function e(t){if(z(this,e),!t.disableRebufferTracking){var i,a=function(e,t){r(t),i=void 0},r=function(e){if(i){var a=e.viewer_time-i;ed(t.data,"view_rebuffer_duration",a),i=e.viewer_time,t.data.view_rebuffer_duration>3e5&&(t.emit("viewend"),t.send("viewend"),t.mux.log.warn("Ending view after rebuffering for longer than ".concat(3e5,"ms, future events will be ignored unless a programchange or videochange occurs.")))}t.data.view_watch_time>=0&&t.data.view_rebuffer_count>0&&(t.data.view_rebuffer_frequency=t.data.view_rebuffer_count/t.data.view_watch_time,t.data.view_rebuffer_percentage=t.data.view_rebuffer_duration/t.data.view_watch_time)};t.on("playbackheartbeat",function(e,t){return r(t)}),t.on("rebufferstart",function(e,r){i||(ed(t.data,"view_rebuffer_count",1),i=r.viewer_time,t.one("rebufferend",a))}),t.on("viewinit",function(){i=void 0,t.off("rebufferend",a)})}},eN=function(){function e(t){var i=this;z(this,e),J(this,"_lastCheckedTime",void 0),J(this,"_lastPlayheadTime",void 0),J(this,"_lastPlayheadTimeUpdatedTime",void 0),J(this,"_rebuffering",void 0),J(this,"pm",void 0),this.pm=t,t.disableRebufferTracking||t.disablePlayheadRebufferTracking||(this._lastCheckedTime=null,this._lastPlayheadTime=null,this._lastPlayheadTimeUpdatedTime=null,t.on("playbackheartbeat",this._checkIfRebuffering.bind(this)),t.on("playbackheartbeatend",this._cleanupRebufferTracker.bind(this)),t.on("seeking",function(){i._cleanupRebufferTracker(null,{viewer_time:W()})}))}return X(e,[{key:"_checkIfRebuffering",value:function(e,t){if(this.pm.seekingTracker.isSeeking||this.pm.adTracker.isAdBreak||!this.pm.playbackHeartbeat._playheadShouldBeProgressing)return void this._cleanupRebufferTracker(e,t);if(null===this._lastCheckedTime)return void this._prepareRebufferTrackerState(t.viewer_time);if(this._lastPlayheadTime!==this.pm.data.player_playhead_time)return void this._cleanupRebufferTracker(e,t,!0);var i=t.viewer_time-this._lastPlayheadTimeUpdatedTime;"number"==typeof this.pm.sustainedRebufferThreshold&&i>=this.pm.sustainedRebufferThreshold&&(this._rebuffering||(this._rebuffering=!0,this.pm.emit("rebufferstart",{viewer_time:this._lastPlayheadTimeUpdatedTime}))),this._lastCheckedTime=t.viewer_time}},{key:"_clearRebufferTrackerState",value:function(){this._lastCheckedTime=null,this._lastPlayheadTime=null,this._lastPlayheadTimeUpdatedTime=null}},{key:"_prepareRebufferTrackerState",value:function(e){this._lastCheckedTime=e,this._lastPlayheadTime=this.pm.data.player_playhead_time,this._lastPlayheadTimeUpdatedTime=e}},{key:"_cleanupRebufferTracker",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(this._rebuffering)this._rebuffering=!1,this.pm.emit("rebufferend",{viewer_time:t.viewer_time});else{if(null===this._lastCheckedTime)return;var a=this.pm.data.player_playhead_time-this._lastPlayheadTime,r=t.viewer_time-this._lastPlayheadTimeUpdatedTime;"number"==typeof this.pm.minimumRebufferDuration&&a>0&&r-a>this.pm.minimumRebufferDuration&&(this._lastCheckedTime=null,this.pm.emit("rebufferstart",{viewer_time:this._lastPlayheadTimeUpdatedTime}),this.pm.emit("rebufferend",{viewer_time:this._lastPlayheadTimeUpdatedTime+r-a}))}i?this._prepareRebufferTrackerState(t.viewer_time):this._clearRebufferTrackerState()}}]),e}(),eU=function(){function e(t){var i=this;z(this,e),J(this,"pm",void 0),this.pm=t,t.on("viewinit",function(){var e=t.data,a=e.view_id;if(!e.view_program_changed){var r=function(e,r){var n=r.viewer_time;"playing"===e.type&&void 0===t.data.view_time_to_first_frame?i.calculateTimeToFirstFrame(n||W(),a):"adplaying"===e.type&&(void 0===t.data.view_time_to_first_frame||i._inPrerollPosition())&&i.calculateTimeToFirstFrame(n||W(),a)};t.one("playing",r),t.one("adplaying",r),t.one("viewend",function(){t.off("playing",r),t.off("adplaying",r)})}})}return X(e,[{key:"_inPrerollPosition",value:function(){return void 0===this.pm.data.view_content_playback_time||this.pm.data.view_content_playback_time<=1e3}},{key:"calculateTimeToFirstFrame",value:function(e,t){t===this.pm.data.view_id&&(this.pm.watchTimeTracker._updateWatchTime(null,{viewer_time:e}),this.pm.data.view_time_to_first_frame=this.pm.data.view_watch_time,(this.pm.data.player_autoplay_on||this.pm.data.video_is_autoplay)&&this.pm.pageLoadInitTime&&(this.pm.data.view_aggregate_startup_time=this.pm.data.view_start+this.pm.data.view_watch_time-this.pm.pageLoadInitTime))}}]),e}(),eH=function e(t){var i=this;z(this,e),J(this,"_lastPlayerHeight",void 0),J(this,"_lastPlayerWidth",void 0),J(this,"_lastPlayheadPosition",void 0),J(this,"_lastSourceHeight",void 0),J(this,"_lastSourceWidth",void 0),t.on("viewinit",function(){i._lastPlayheadPosition=-1}),["pause","rebufferstart","seeking","error","adbreakstart","hb","renditionchange","orientationchange","viewend","playbackmodechange"].forEach(function(e){t.on(e,function(){if(i._lastPlayheadPosition>=0&&t.data.player_playhead_time>=0&&i._lastPlayerWidth>=0&&i._lastSourceWidth>0&&i._lastPlayerHeight>=0&&i._lastSourceHeight>0){var e=t.data.player_playhead_time-i._lastPlayheadPosition;if(e<0){i._lastPlayheadPosition=-1;return}var a=Math.min(i._lastPlayerWidth/i._lastSourceWidth,i._lastPlayerHeight/i._lastSourceHeight),r=Math.max(0,a-1),n=Math.max(0,1-a);t.data.view_max_upscale_percentage=Math.max(t.data.view_max_upscale_percentage||0,r),t.data.view_max_downscale_percentage=Math.max(t.data.view_max_downscale_percentage||0,n),ed(t.data,"view_total_content_playback_time",e),ed(t.data,"view_total_upscaling",r*e),ed(t.data,"view_total_downscaling",n*e)}i._lastPlayheadPosition=-1})}),["playing","hb","renditionchange","orientationchange","playbackmodechange"].forEach(function(e){t.on(e,function(){i._lastPlayheadPosition=t.data.player_playhead_time,i._lastPlayerWidth=t.data.player_width,i._lastPlayerHeight=t.data.player_height,i._lastSourceWidth=t.data.video_source_width,i._lastSourceHeight=t.data.video_source_height})})},eB=function e(t){var i=this;z(this,e),J(this,"isSeeking",void 0),this.isSeeking=!1;var a=-1,r=function(){var e=W(),r=(t.data.viewer_time||e)-(a||e);ed(t.data,"view_seek_duration",r),t.data.view_max_seek_time=Math.max(t.data.view_max_seek_time||0,r),i.isSeeking=!1,a=-1};t.on("seeking",function(e,n){if(Object.assign(t.data,n),i.isSeeking&&n.viewer_time-a<=2e3){a=n.viewer_time;return}i.isSeeking&&r(),i.isSeeking=!0,a=n.viewer_time,ed(t.data,"view_seek_count",1),t.send("seeking")}),t.on("seeked",function(){r()}),t.on("viewend",function(){i.isSeeking&&(r(),t.send("seeked")),i.isSeeking=!1,a=-1})},eW=function(e,t){e.push(t),e.sort(function(e,t){return e.viewer_time-t.viewer_time})},e$=["adbreakstart","adrequest","adresponse","adplay","adplaying","adpause","adended","adbreakend","aderror","adclicked","adskipped"],eq=function(){function e(t){var i=this;z(this,e),J(this,"_adHasPlayed",void 0),J(this,"_adRequests",void 0),J(this,"_adResponses",void 0),J(this,"_currentAdRequestNumber",void 0),J(this,"_currentAdResponseNumber",void 0),J(this,"_prerollPlayTime",void 0),J(this,"_wouldBeNewAdPlay",void 0),J(this,"isAdBreak",void 0),J(this,"pm",void 0),this.pm=t,t.on("viewinit",function(){i.isAdBreak=!1,i._currentAdRequestNumber=0,i._currentAdResponseNumber=0,i._adRequests=[],i._adResponses=[],i._adHasPlayed=!1,i._wouldBeNewAdPlay=!0,i._prerollPlayTime=void 0}),e$.forEach(function(e){return t.on(e,i._updateAdData.bind(i))});var a=function(){i.isAdBreak=!1};t.on("adbreakstart",function(){i.isAdBreak=!0}),t.on("play",a),t.on("playing",a),t.on("viewend",a),t.on("adrequest",function(e,a){a=Object.assign({ad_request_id:"generatedAdRequestId"+i._currentAdRequestNumber++},a),eW(i._adRequests,a),ed(t.data,"view_ad_request_count"),i.inPrerollPosition()&&(t.data.view_preroll_requested=!0,i._adHasPlayed||ed(t.data,"view_preroll_request_count"))}),t.on("adresponse",function(e,a){a=Object.assign({ad_request_id:"generatedAdRequestId"+i._currentAdResponseNumber++},a),eW(i._adResponses,a);var r=i.findAdRequest(a.ad_request_id);r&&ed(t.data,"view_ad_request_time",Math.max(0,a.viewer_time-r.viewer_time))}),t.on("adplay",function(e,a){i._adHasPlayed=!0,i._wouldBeNewAdPlay&&(i._wouldBeNewAdPlay=!1,ed(t.data,"view_ad_played_count")),i.inPrerollPosition()&&!t.data.view_preroll_played&&(t.data.view_preroll_played=!0,i._adRequests.length>0&&(t.data.view_preroll_request_time=Math.max(0,a.viewer_time-i._adRequests[0].viewer_time)),t.data.view_start&&(t.data.view_startup_preroll_request_time=Math.max(0,a.viewer_time-t.data.view_start)),i._prerollPlayTime=a.viewer_time)}),t.on("adplaying",function(e,a){i.inPrerollPosition()&&void 0===t.data.view_preroll_load_time&&void 0!==i._prerollPlayTime&&(t.data.view_preroll_load_time=a.viewer_time-i._prerollPlayTime,t.data.view_startup_preroll_load_time=a.viewer_time-i._prerollPlayTime)}),t.on("adclicked",function(e,a){i._wouldBeNewAdPlay||ed(t.data,"view_ad_clicked_count")}),t.on("adskipped",function(e,a){i._wouldBeNewAdPlay||ed(t.data,"view_ad_skipped_count")}),t.on("adended",function(){i._wouldBeNewAdPlay=!0}),t.on("aderror",function(){i._wouldBeNewAdPlay=!0})}return X(e,[{key:"inPrerollPosition",value:function(){return void 0===this.pm.data.view_content_playback_time||this.pm.data.view_content_playback_time<=1e3}},{key:"findAdRequest",value:function(e){for(var t=0;t<this._adRequests.length;t++)if(this._adRequests[t].ad_request_id===e)return this._adRequests[t]}},{key:"_updateAdData",value:function(e,t){if(this.inPrerollPosition()){if(!this.pm.data.view_preroll_ad_tag_hostname&&t.ad_tag_url){var i=N(er(t.ad_tag_url),2),a=i[0],r=i[1];this.pm.data.view_preroll_ad_tag_domain=r,this.pm.data.view_preroll_ad_tag_hostname=a}if(!this.pm.data.view_preroll_ad_asset_hostname&&t.ad_asset_url){var n=N(er(t.ad_asset_url),2),s=n[0],o=n[1];this.pm.data.view_preroll_ad_asset_domain=o,this.pm.data.view_preroll_ad_asset_hostname=s}this.pm.data.ad_type="preroll"}this.pm.data.ad_asset_url=null==t?void 0:t.ad_asset_url,this.pm.data.ad_tag_url=null==t?void 0:t.ad_tag_url,this.pm.data.ad_creative_id=null==t?void 0:t.ad_creative_id,this.pm.data.ad_id=null==t?void 0:t.ad_id,this.pm.data.ad_universal_id=null==t?void 0:t.ad_universal_id,null!=t&&t.ad_type&&(this.pm.data.ad_type=null==t?void 0:t.ad_type)}}]),e}(),eV=function e(t){var i=this;z(this,e),J(this,"lastWallClockTime",void 0);var a=function(){i.lastWallClockTime=W(),t.on("before*",r)},r=function(e){var a=W(),r=i.lastWallClockTime;i.lastWallClockTime=a,a-r>3e4&&(t.emit("devicesleep",{viewer_time:r}),Object.assign(t.data,{viewer_time:r}),t.send("devicesleep"),t.emit("devicewake",{viewer_time:a}),Object.assign(t.data,{viewer_time:a}),t.send("devicewake"))};t.one("playbackheartbeat",a),t.on("playbackheartbeatend",function(){t.off("before*",r),t.one("playbackheartbeat",a)})},eF=v(b()),eK=(tf=function(){for(var e=0,t={};e<arguments.length;e++){var i=arguments[e];for(var a in i)t[a]=i[a]}return t},function e(t){function i(e,a,r){var n;if("u">typeof document){if(arguments.length>1){if("number"==typeof(r=tf({path:"/"},i.defaults,r)).expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*r.expires),r.expires=s}try{n=JSON.stringify(a),/^[\{\[]/.test(n)&&(a=n)}catch(e){}return a=t.write?t.write(a,e):encodeURIComponent(String(a)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape),document.cookie=e+"="+a+(r.expires?"; expires="+r.expires.toUTCString():"")+(r.path?"; path="+r.path:"")+(r.domain?"; domain="+r.domain:"")+(r.secure?"; secure":"")}e||(n={});for(var o=document.cookie?document.cookie.split("; "):[],l=/(%[0-9A-Z]{2})+/g,d=0;d<o.length;d++){var u=o[d].split("="),c=u.slice(1).join("=");'"'===c.charAt(0)&&(c=c.slice(1,-1));try{var h=u[0].replace(l,decodeURIComponent);if(c=t.read?t.read(c,h):t(c,h)||c.replace(l,decodeURIComponent),this.json)try{c=JSON.parse(c)}catch(e){}if(e===h){n=c;break}e||(n[h]=c)}catch(e){}}return n}}return i.set=i,i.get=function(e){return i.call(i,e)},i.getJSON=function(){return i.apply({json:!0},[].slice.call(arguments))},i.defaults={},i.remove=function(e,t){i(e,"",tf(t,{expires:-1}))},i.withConverter=e,i}(function(){})),ej="muxData",eY=function(){var e;try{e=(eK.get(ej)||"").split("&").reduce(function(e,t){var i=N(t.split("="),2),a=i[0],r=i[1],n=+r;return e[a]=r&&n==r?n:r,e},{})}catch(t){e={}}return e},eG=function(e){try{eK.set(ej,Object.entries(e).map(function(e){var t=N(e,2),i=t[0],a=t[1];return"".concat(i,"=").concat(a)}).join("&"),{expires:365})}catch(e){}},eQ=function(){var e=eY();return e.mux_viewer_id=e.mux_viewer_id||$(),e.msn=e.msn||Math.random(),eG(e),{mux_viewer_id:e.mux_viewer_id,mux_sample_number:e.msn}},ez=function(){var e=eY(),t=W();return e.session_start&&(e.sst=e.session_start,delete e.session_start),e.session_id&&(e.sid=e.session_id,delete e.session_id),e.session_expires&&(e.sex=e.session_expires,delete e.session_expires),(!e.sex||e.sex<t)&&(e.sid=$(),e.sst=t),e.sex=t+15e5,eG(e),{session_id:e.sid,session_start:e.sst,session_expires:e.sex}},eZ=v(b()),eX=function(){var e;switch(eJ()){case"cellular":e="cellular";break;case"ethernet":e="wired";break;case"wifi":e="wifi";break;case void 0:break;default:e="other"}return e},eJ=function(){var e=eZ.default.navigator,t=e&&(e.connection||e.mozConnection||e.webkitConnection);return t&&t.type};eX.getConnectionFromAPI=eJ;var e0=e2({a:"env",b:"beacon",c:"custom",d:"ad",e:"event",f:"experiment",i:"internal",m:"mux",n:"response",p:"player",q:"request",r:"retry",s:"session",t:"timestamp",u:"viewer",v:"video",w:"page",x:"view",y:"sub"}),e1=e2({ad:"ad",af:"affiliate",ag:"aggregate",ap:"api",al:"application",ao:"audio",ar:"architecture",as:"asset",au:"autoplay",av:"average",bi:"bitrate",bn:"brand",br:"break",bw:"browser",by:"bytes",bz:"business",ca:"cached",cb:"cancel",cc:"codec",cd:"code",cg:"category",ch:"changed",ci:"client",ck:"clicked",cl:"canceled",cm:"cmcd",cn:"config",co:"count",ce:"counter",cp:"complete",cq:"creator",cr:"creative",cs:"captions",ct:"content",cu:"current",cv:"cumulative",cx:"connection",cz:"context",da:"data",dg:"downscaling",dm:"domain",dn:"cdn",do:"downscale",dr:"drm",dp:"dropped",du:"duration",dv:"device",dy:"dynamic",eb:"enabled",ec:"encoding",ed:"edge",en:"end",eg:"engine",em:"embed",er:"error",ep:"experiments",es:"errorcode",et:"errortext",ee:"event",ev:"events",ex:"expires",ez:"exception",fa:"failed",fi:"first",fm:"family",ft:"format",fp:"fps",fq:"frequency",fr:"frame",fs:"fullscreen",ha:"has",hb:"holdback",he:"headers",ho:"host",hn:"hostname",ht:"height",id:"id",ii:"init",in:"instance",ip:"ip",is:"is",ke:"key",la:"language",lb:"labeled",le:"level",li:"live",ld:"loaded",lo:"load",ls:"lists",lt:"latency",ma:"max",md:"media",me:"message",mf:"manifest",mi:"mime",ml:"midroll",mm:"min",mn:"manufacturer",mo:"model",mp:"mode",ms:"ms",mx:"mux",ne:"newest",nm:"name",no:"number",on:"on",or:"origin",os:"os",pa:"paused",pb:"playback",pd:"producer",pe:"percentage",pf:"played",pg:"program",ph:"playhead",pi:"plugin",pl:"preroll",pn:"playing",po:"poster",pp:"pip",pr:"preload",ps:"position",pt:"part",pv:"previous",py:"property",px:"pop",pz:"plan",ra:"rate",rd:"requested",re:"rebuffer",rf:"rendition",rg:"range",rm:"remote",ro:"ratio",rp:"response",rq:"request",rs:"requests",sa:"sample",sd:"skipped",se:"session",sh:"shift",sk:"seek",sm:"stream",so:"source",sq:"sequence",sr:"series",ss:"status",st:"start",su:"startup",sv:"server",sw:"software",sy:"severity",ta:"tag",tc:"tech",te:"text",tg:"target",th:"throughput",ti:"time",tl:"total",to:"to",tt:"title",ty:"type",ug:"upscaling",un:"universal",up:"upscale",ur:"url",us:"user",va:"variant",vd:"viewed",vi:"video",ve:"version",vw:"view",vr:"viewer",wd:"width",wa:"watch",wt:"waiting"});function e2(e){var t={};for(var i in e)e.hasOwnProperty(i)&&(t[e[i]]=i);return t}function e3(e){var t={},i={};return Object.keys(e).forEach(function(a){var r=!1;if(e.hasOwnProperty(a)&&void 0!==e[a]){var n=a.split("_"),s=n[0],o=e0[s];o||(j.info("Data key word `"+n[0]+"` not expected in "+a),o=s+"_"),n.splice(1).forEach(function(e){"url"===e&&(r=!0),e1[e]?o+=e1[e]:Number.isInteger(Number(e))?o+=e:(j.info("Data key word `"+e+"` not expected in "+a),o+="_"+e+"_")}),r?i[o]=e[a]:t[o]=e[a]}}),Object.assign(t,i)}var e4=v(b()),e5=v(D()),e9={maxBeaconSize:300,maxQueueLength:3600,baseTimeBetweenBeacons:1e4,maxPayloadKBSize:500},e8=["hb","requestcompleted","requestfailed","requestcanceled"],e6=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this._beaconUrl=e||"https://img.litix.io",this._eventQueue=[],this._postInFlight=!1,this._resendAfterPost=!1,this._failureCount=0,this._sendTimeout=!1,this._options=Object.assign({},e9,t)};e6.prototype.queueEvent=function(e,t){var i=Object.assign({},t);return(this._eventQueue.length<=this._options.maxQueueLength||"eventrateexceeded"===e)&&(this._eventQueue.push(i),this._sendTimeout||this._startBeaconSending(),this._eventQueue.length<=this._options.maxQueueLength)},e6.prototype.flushEvents=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e&&1===this._eventQueue.length?this._eventQueue.pop():(this._eventQueue.length&&this._sendBeaconQueue(),this._startBeaconSending())},e6.prototype.destroy=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.destroyed=!0,e?this._clearBeaconQueue():this.flushEvents(),e4.default.clearTimeout(this._sendTimeout)},e6.prototype._clearBeaconQueue=function(){var e=this._eventQueue.length>this._options.maxBeaconSize?this._eventQueue.length-this._options.maxBeaconSize:0,t=this._eventQueue.slice(e);e>0&&Object.assign(t[t.length-1],e3({mux_view_message:"event queue truncated"}));var i=this._createPayload(t);te(this._beaconUrl,i,!0,function(){})},e6.prototype._sendBeaconQueue=function(){var e=this;if(this._postInFlight){this._resendAfterPost=!0;return}var t=this._eventQueue.slice(0,this._options.maxBeaconSize);this._eventQueue=this._eventQueue.slice(this._options.maxBeaconSize),this._postInFlight=!0;var i=this._createPayload(t),a=W();te(this._beaconUrl,i,!1,function(i,r){r?(e._eventQueue=t.concat(e._eventQueue),e._failureCount+=1,j.info("Error sending beacon: "+r)):e._failureCount=0,e._roundTripTime=W()-a,e._postInFlight=!1,e._resendAfterPost&&(e._resendAfterPost=!1,e._eventQueue.length>0&&e._sendBeaconQueue())})},e6.prototype._getNextBeaconTime=function(){if(!this._failureCount)return this._options.baseTimeBetweenBeacons;var e=Math.pow(2,this._failureCount-1);return(1+(e*=Math.random()))*this._options.baseTimeBetweenBeacons},e6.prototype._startBeaconSending=function(){var e=this;e4.default.clearTimeout(this._sendTimeout),this.destroyed||(this._sendTimeout=e4.default.setTimeout(function(){e._eventQueue.length&&e._sendBeaconQueue(),e._startBeaconSending()},this._getNextBeaconTime()))},e6.prototype._createPayload=function(e){var t=this,i={transmission_timestamp:Math.round(W())};this._roundTripTime&&(i.rtt_ms=Math.round(this._roundTripTime));var a,r,n,s=function(){n=(a=JSON.stringify({metadata:i,events:r||e})).length/1024},o=function(){return n<=t._options.maxPayloadKBSize};return s(),o()||(j.info("Payload size is too big ("+n+" kb). Removing unnecessary events."),r=e.filter(function(e){return -1===e8.indexOf(e.e)}),s()),o()||(j.info("Payload size still too big ("+n+" kb). Cropping fields.."),r.forEach(function(e){for(var t in e){var i=e[t];"string"==typeof i&&i.length>51200&&(e[t]=i.substring(0,51200))}}),s()),a};var e7="function"==typeof e5.default.exitPictureInPicture?function(e){return e.length<=57344}:function(e){return!1},te=function(e,t,i,a){if(i&&navigator&&navigator.sendBeacon&&navigator.sendBeacon(e,t))return void a();if(e4.default.fetch)return void e4.default.fetch(e,{method:"POST",body:t,headers:{"Content-Type":"text/plain"},keepalive:e7(t)}).then(function(e){return a(null,e.ok?null:"Error")}).catch(function(e){return a(null,e)});if(e4.default.XMLHttpRequest){var r=new e4.default.XMLHttpRequest;r.onreadystatechange=function(){if(4===r.readyState)return a(null,200!==r.status?"error":void 0)},r.open("POST",e),r.setRequestHeader("Content-Type","text/plain"),r.send(t);return}a()},tt=["env_key","view_id","view_sequence_number","player_sequence_number","beacon_domain","player_playhead_time","viewer_time","mux_api_version","event","video_id","player_instance_id","player_error_code","player_error_message","player_error_context","player_error_severity","player_error_business_exception","view_playing_time_ms_cumulative","ad_playing_time_ms_cumulative"],ti=["adplay","adplaying","adpause","adfirstquartile","admidpoint","adthirdquartile","adended","adresponse","adrequest"],ta=["ad_id","ad_creative_id","ad_universal_id"],tr=["viewstart","error","ended","viewend"],tn=function(){function e(t,i){var a,r,n,s,o,l,d,u,c,h,m,v,b,g,f,E,y,_,T,A=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};z(this,e),J(this,"mux",void 0),J(this,"envKey",void 0),J(this,"options",void 0),J(this,"eventQueue",void 0),J(this,"sampleRate",void 0),J(this,"disableCookies",void 0),J(this,"respectDoNotTrack",void 0),J(this,"previousBeaconData",void 0),J(this,"lastEventTime",void 0),J(this,"rateLimited",void 0),J(this,"pageLevelData",void 0),J(this,"viewerData",void 0),this.mux=t,this.envKey=i,this.options=A,this.previousBeaconData=null,this.lastEventTime=0,this.rateLimited=!1,this.eventQueue=new e6((a=this.envKey,n=(r=this.options).beaconCollectionDomain,s=r.beaconDomain,n?"https://"+n:(a=a||"inferred").match(/^[a-z0-9]+$/)?"https://"+a+"."+(s||"litix.io"):"https://img.litix.io/a.gif")),this.sampleRate=null!=(y=this.options.sampleRate)?y:1,this.disableCookies=null!=(_=this.options.disableCookies)&&_,this.respectDoNotTrack=null!=(T=this.options.respectDoNotTrack)&&T,this.previousBeaconData=null,this.lastEventTime=0,this.rateLimited=!1,this.pageLevelData={mux_api_version:this.mux.API_VERSION,mux_embed:this.mux.NAME,mux_embed_version:this.mux.VERSION,viewer_application_name:null==(o=this.options.platform)?void 0:o.name,viewer_application_version:null==(l=this.options.platform)?void 0:l.version,viewer_application_engine:null==(d=this.options.platform)?void 0:d.layout,viewer_device_name:null==(u=this.options.platform)?void 0:u.product,viewer_device_category:"",viewer_device_manufacturer:null==(c=this.options.platform)?void 0:c.manufacturer,viewer_os_family:null==(m=this.options.platform)||null==(h=m.os)?void 0:h.family,viewer_os_architecture:null==(b=this.options.platform)||null==(v=b.os)?void 0:v.architecture,viewer_os_version:null==(f=this.options.platform)||null==(g=f.os)?void 0:g.version,viewer_connection_type:eX(),page_url:null===eF.default||void 0===eF.default||null==(E=eF.default.location)?void 0:E.href},this.viewerData=this.disableCookies?{}:eQ()}return X(e,[{key:"send",value:function(e,t){if(!(!e||!(null!=t&&t.view_id))){if(this.respectDoNotTrack&&G())return j.info("Not sending `"+e+"` because Do Not Track is enabled");if(!t||"object"!=typeof t)return j.error("A data object was expected in send() but was not provided");var i=this.disableCookies?{}:ez(),a=ec(eu({},this.pageLevelData,t,i,this.viewerData),{event:e,env_key:this.envKey});a.user_id&&(a.viewer_user_id=a.user_id,delete a.user_id);var r,n=(null!=(r=a.mux_sample_number)?r:0)>=this.sampleRate,s=e3(this._deduplicateBeaconData(e,a));if(this.lastEventTime=this.mux.utils.now(),n)return j.info("Not sending event due to sample rate restriction",e,a,s);if(this.envKey||j.info("Missing environment key (envKey) - beacons will be dropped if the video source is not a valid mux video URL",e,a,s),!this.rateLimited)if(j.info("Sending event",e,a,s),this.rateLimited=!this.eventQueue.queueEvent(e,s),this.mux.WINDOW_UNLOADING&&"viewend"===e)this.eventQueue.destroy(!0);else{if(this.mux.WINDOW_HIDDEN&&"hb"===e)this.eventQueue.flushEvents(!0);else if(tr.indexOf(e)>=0){if("error"===e&&"warning"===t.player_error_severity)return;this.eventQueue.flushEvents()}if(this.rateLimited)return a.event="eventrateexceeded",s=e3(a),this.eventQueue.queueEvent(a.event,s),j.error("Beaconing disabled due to rate limit.")}}}},{key:"destroy",value:function(){this.eventQueue.destroy(!1)}},{key:"_deduplicateBeaconData",value:function(e,t){var i=this,a={},r=t.view_id;if("-1"===r||"viewstart"===e||"viewend"===e||!this.previousBeaconData||this.mux.utils.now()-this.lastEventTime>=6e5)a=eu({},t),r&&(this.previousBeaconData=a),r&&"viewend"===e&&(this.previousBeaconData=null);else{var n=0===e.indexOf("request");Object.entries(t).forEach(function(t){var r=N(t,2),s=r[0],o=r[1];i.previousBeaconData&&(o!==i.previousBeaconData[s]||tt.indexOf(s)>-1||i.objectHasChanged(n,s,o,i.previousBeaconData[s])||i.eventRequiresKey(e,s))&&(a[s]=o,i.previousBeaconData[s]=o)})}return a}},{key:"objectHasChanged",value:function(e,t,i,a){return!!e&&0===t.indexOf("request_")&&("request_response_headers"===t||"object"!=typeof i||"object"!=typeof a||Object.keys(i||{}).length!==Object.keys(a||{}).length)}},{key:"eventRequiresKey",value:function(e,t){return!!("renditionchange"===e&&0===t.indexOf("video_source_")||ta.includes(t)&&ti.includes(e)||"playbackmodechange"===e&&0===t.indexOf("player_playback_mode"))}}]),e}(),ts=function e(t){z(this,e);var i=0,a=0,r=0,n=0,s=0,o=0,l=0;t.on("requestcompleted",function(e,o){var l,d,u=o.request_start,c=o.request_response_start,h=o.request_response_end,m=o.request_bytes_loaded;if(n++,c?(l=c-(null!=u?u:0),d=(null!=h?h:0)-c):d=(null!=h?h:0)-(null!=u?u:0),d>0&&m&&m>0){var v=m/d*8e3;s++,a+=m,r+=d,t.data.view_min_request_throughput=Math.min(t.data.view_min_request_throughput||1/0,v),t.data.view_average_request_throughput=a/r*8e3,t.data.view_request_count=n,l>0&&(i+=l,t.data.view_max_request_latency=Math.max(t.data.view_max_request_latency||0,l),t.data.view_average_request_latency=i/s)}}),t.on("requestfailed",function(e,i){n++,o++,t.data.view_request_count=n,t.data.view_request_failed_count=o}),t.on("requestcanceled",function(e,i){n++,l++,t.data.view_request_count=n,t.data.view_request_canceled_count=l})},to=function e(t){var i=this;z(this,e),J(this,"_lastEventTime",void 0),t.on("before*",function(e,a){var r=a.viewer_time,n=W(),s=i._lastEventTime;if(i._lastEventTime=n,s&&n-s>36e5){var o=Object.keys(t.data).reduce(function(e,i){return 0===i.indexOf("video_")?Object.assign(e,J({},i,t.data[i])):e},{});t.mux.log.info("Received event after at least an hour inactivity, creating a new view");var l=t.playbackHeartbeat._playheadShouldBeProgressing;t._resetView(Object.assign({viewer_time:r},o)),t.playbackHeartbeat._playheadShouldBeProgressing=l,t.playbackHeartbeat._playheadShouldBeProgressing&&"play"!==e.type&&"adbreakstart"!==e.type&&(t.emit("play",{viewer_time:r}),"playing"!==e.type&&t.emit("playing",{viewer_time:r}))}})};function tl(e,t){return(null==e?void 0:e.toLowerCase())===(null==t?void 0:t.toLowerCase())}var td=function e(t){z(this,e);var i=function(e){var i,a,r,o=null!=(i=e)&&i.request_type&&("media"===i.request_type||"video"===i.request_type)&&null!=(a=i.request_response_headers)&&a["x-cdn"]?i.request_response_headers["x-cdn"]:null!=i&&i.video_cdn?i.video_cdn:null,l=null!=(r=e)&&r.request_start?r.request_start:null!=r&&r.viewer_time?r.viewer_time:Date.now();null!=o&&!tl(o,n)&&s<=l&&(n=o,s=l,t.emit("cdnchange",{video_cdn:o}))},a=null,r=null,n=null,s=0;t.on("viewinit",function(){a=null,r=null,n=null,s=0}),t.on("beforecdnchange",function(e,t){var i=null==t?void 0:t.video_cdn;i&&(void 0===t.video_previous_cdn||null===t.video_previous_cdn)&&(tl(i,r)?t.video_previous_cdn=null!=a?a:void 0:(t.video_previous_cdn=null!=r?r:void 0,a=r,r=i))}),t.on("requestcompleted",function(e,t){i(t)})},tu=function(e){try{return JSON.parse(e),!0}catch(e){return!1}},tc=function e(t){var i=this;z(this,e),J(this,"_emittingAutomaticEvent",!1),J(this,"_hasInitialized",!1),J(this,"_currentMode","standard"),t.on("viewstart",function(){i._hasInitialized||(i._hasInitialized=!0,i._currentMode=t.data.player_playback_mode||"standard",i._emittingAutomaticEvent=!0,t.emit("playbackmodechange",{player_playback_mode:i._currentMode,player_playback_mode_data:"{}"}),i._emittingAutomaticEvent=!1)}),t.on("viewend",function(){i._hasInitialized=!1}),t.on("playbackmodechange",function(e,a){i._emittingAutomaticEvent||(a.player_playback_mode_data?tu(a.player_playback_mode_data)||(t.mux.log.warn("Invalid JSON string for player_playback_mode_data"),a.player_playback_mode_data="{}"):a.player_playback_mode_data="{}",t.data.player_playback_mode_data=a.player_playback_mode_data,t.data.player_playback_mode=a.player_playback_mode,i._currentMode=a.player_playback_mode)})},th=function(){function e(t){z(this,e),J(this,"pm",void 0),J(this,"_currentRangeStart",void 0),J(this,"_lastPlayheadTime",void 0),this.pm=t,this._currentRangeStart=null,this._lastPlayheadTime=null,t.on("playbackheartbeat",this._updatePlaybackRange.bind(this)),t.on("playbackheartbeatend",this._endPlaybackRange.bind(this))}return X(e,[{key:"_updateLastRangeEnd",value:function(){var e=this.pm.data.video_playback_ranges;if(e&&e.length>0){var t=this.pm.data.player_playhead_time||0;e[e.length-1][1]=t}}},{key:"_updatePlaybackRange",value:function(){var e,t=this.pm.data.player_playhead_time||0;if(!(!this.pm.disableAdPlaybackRangeFiltering&&null!=(e=this.pm.adTracker)&&e.isAdBreak&&null!==this._lastPlayheadTime&&t<this._lastPlayheadTime)){if(null!==this._lastPlayheadTime&&null!==this._currentRangeStart&&Math.abs(t-this._lastPlayheadTime)>1e3){var i=this.pm.data.video_playback_ranges;i&&i.length>0&&(i[i.length-1][1]=this._lastPlayheadTime),this._currentRangeStart=null}if(null===this._currentRangeStart){var a=this.pm.data.video_playback_ranges||[];a.length>0&&a[a.length-1][1]===t?this._currentRangeStart=a[a.length-1][0]:(this._currentRangeStart=t,a.push([t,t])),this.pm.data.video_playback_ranges=a}else this._updateLastRangeEnd();this._lastPlayheadTime=t}}},{key:"_endPlaybackRange",value:function(){null!==this._currentRangeStart&&(this._updateLastRangeEnd(),this._currentRangeStart=null,this._lastPlayheadTime=null)}}]),e}(),tm=["viewstart","ended","loadstart","pause","play","playing","ratechange","waiting","adplay","adpause","adended","aderror","adplaying","adrequest","adresponse","adbreakstart","adbreakend","adfirstquartile","admidpoint","adthirdquartile","rebufferstart","rebufferend","seeked","error","hb","requestcompleted","requestfailed","requestcanceled","renditionchange","cdnchange","playbackmodechange"],tp=new Set(["requestcompleted","requestfailed","requestcanceled"]),tv=function(e){if("function"!=typeof e&&null!==e)throw TypeError("Super expression must either be null or a function");a.prototype=Object.create(e&&e.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),e&&ei(a,e);var t,i=(t=function(){if("u"<typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}(),function(){var e,i=ee(a);return e=t?Reflect.construct(i,arguments,ee(this).constructor):i.apply(this,arguments),e&&("object"===E(e)||"function"==typeof e)?e:Q(this)});function a(e,t,r){z(this,a),J(Q(n=i.call(this)),"pageLoadEndTime",void 0),J(Q(n),"pageLoadInitTime",void 0),J(Q(n),"_destroyed",void 0),J(Q(n),"_heartBeatTimeout",void 0),J(Q(n),"adTracker",void 0),J(Q(n),"dashjs",void 0),J(Q(n),"data",void 0),J(Q(n),"disablePlayheadRebufferTracking",void 0),J(Q(n),"disableRebufferTracking",void 0),J(Q(n),"disableAdPlaybackRangeFiltering",void 0),J(Q(n),"errorTracker",void 0),J(Q(n),"errorTranslator",void 0),J(Q(n),"emitTranslator",void 0),J(Q(n),"getAdData",void 0),J(Q(n),"getPlayheadTime",void 0),J(Q(n),"getStateData",void 0),J(Q(n),"stateDataTranslator",void 0),J(Q(n),"hlsjs",void 0),J(Q(n),"id",void 0),J(Q(n),"longResumeTracker",void 0),J(Q(n),"minimumRebufferDuration",void 0),J(Q(n),"mux",void 0),J(Q(n),"playbackEventDispatcher",void 0),J(Q(n),"playbackHeartbeat",void 0),J(Q(n),"playbackHeartbeatTime",void 0),J(Q(n),"playheadTime",void 0),J(Q(n),"seekingTracker",void 0),J(Q(n),"sustainedRebufferThreshold",void 0),J(Q(n),"watchTimeTracker",void 0),J(Q(n),"currentFragmentPDT",void 0),J(Q(n),"currentFragmentStart",void 0),n.pageLoadInitTime=el(),n.pageLoadEndTime=eo(),n.mux=e,n.id=t,null!=r&&r.beaconDomain&&n.mux.log.warn("The `beaconDomain` setting has been deprecated in favor of `beaconCollectionDomain`. Please change your integration to use `beaconCollectionDomain` instead of `beaconDomain`."),(r=Object.assign({debug:!1,minimumRebufferDuration:250,sustainedRebufferThreshold:1e3,playbackHeartbeatTime:25,beaconDomain:"litix.io",sampleRate:1,disableCookies:!1,respectDoNotTrack:!1,disableRebufferTracking:!1,disablePlayheadRebufferTracking:!1,disableAdPlaybackRangeFiltering:!1,errorTranslator:function(e){return e},emitTranslator:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];return t},stateDataTranslator:function(e){return e}},r)).data=r.data||{},r.data.property_key&&(r.data.env_key=r.data.property_key,delete r.data.property_key),j.level=r.debug?1:3,n.getPlayheadTime=r.getPlayheadTime,n.getStateData=r.getStateData||function(){return{}},n.getAdData=r.getAdData||function(){},n.minimumRebufferDuration=r.minimumRebufferDuration,n.sustainedRebufferThreshold=r.sustainedRebufferThreshold,n.playbackHeartbeatTime=r.playbackHeartbeatTime,n.disableRebufferTracking=r.disableRebufferTracking,n.disableRebufferTracking&&n.mux.log.warn("Disabling rebuffer tracking. This should only be used in specific circumstances as a last resort when your player is known to unreliably track rebuffering."),n.disablePlayheadRebufferTracking=r.disablePlayheadRebufferTracking,n.disableAdPlaybackRangeFiltering=r.disableAdPlaybackRangeFiltering,n.errorTranslator=r.errorTranslator,n.emitTranslator=r.emitTranslator,n.stateDataTranslator=r.stateDataTranslator,n.playbackEventDispatcher=new tn(e,r.data.env_key,r),n.data={player_instance_id:$(),mux_sample_rate:r.sampleRate,beacon_domain:r.beaconCollectionDomain||r.beaconDomain},n.data.view_sequence_number=1,n.data.player_sequence_number=1;var n,s=(function(){void 0===this.data.view_start&&(this.data.view_start=this.mux.utils.now(),this.emit("viewstart"),this.emit("renditionchange"))}).bind(Q(n));if(n.on("viewinit",function(e,t){this._resetVideoData(),this._resetViewData(),this._resetErrorData(),this._updateStateData(),Object.assign(this.data,t),this._initializeViewData(),this.one("play",s),this.one("adbreakstart",s)}),n.on("videochange",function(e,t){this._resetView(t)}),n.on("programchange",function(e,t){this.data.player_is_paused&&this.mux.log.warn("The `programchange` event is intended to be used when the content changes mid playback without the video source changing, however the video is not currently playing. If the video source is changing please use the videochange event otherwise you will lose startup time information."),this._resetView(Object.assign(t,{view_program_changed:!0})),s(),this.emit("play"),this.emit("playing")}),n.on("fragmentchange",function(e,t){this.currentFragmentPDT=t.currentFragmentPDT,this.currentFragmentStart=t.currentFragmentStart}),n.on("destroy",n.destroy),"u">typeof window&&"function"==typeof window.addEventListener&&"function"==typeof window.removeEventListener){var o=function(){var e=void 0!==n.data.view_start;n.mux.WINDOW_HIDDEN="hidden"===document.visibilityState,e&&n.mux.WINDOW_HIDDEN&&(n.data.player_is_paused||n.emit("hb"))};window.addEventListener("visibilitychange",o,!1);var l=function(e){e.persisted||n.destroy()};window.addEventListener("pagehide",l,!1),n.on("destroy",function(){window.removeEventListener("visibilitychange",o),window.removeEventListener("pagehide",l)})}return n.on("playerready",function(e,t){Object.assign(this.data,t)}),tm.forEach(function(e){n.on(e,function(t,i){0!==e.indexOf("ad")&&this._updateStateData(),Object.assign(this.data,i),this._sanitizeData()}),n.on("after"+e,function(){("error"!==e||this.errorTracker.viewErrored)&&this.send(e)})}),n.on("viewend",function(e,t){Object.assign(n.data,t)}),n.one("playerready",function(e){var t=this.mux.utils.now();this.data.player_init_time&&(this.data.player_startup_time=t-this.data.player_init_time),this.pageLoadInitTime=this.data.page_load_init_time||this.pageLoadInitTime,this.pageLoadEndTime=this.data.page_load_end_time||this.pageLoadEndTime,!this.mux.PLAYER_TRACKED&&this.pageLoadInitTime&&(this.mux.PLAYER_TRACKED=!0,(this.data.player_init_time||this.pageLoadEndTime)&&(this.data.page_load_time=Math.min(this.data.player_init_time||1/0,this.pageLoadEndTime||1/0)-this.pageLoadInitTime)),this.send("playerready"),delete this.data.player_startup_time,delete this.data.page_load_time}),n.longResumeTracker=new to(Q(n)),n.errorTracker=new eM(Q(n)),new eV(Q(n)),n.seekingTracker=new eB(Q(n)),n.playheadTime=new eP(Q(n)),n.playbackHeartbeat=new eL(Q(n)),new eH(Q(n)),n.watchTimeTracker=new ex(Q(n)),new eD(Q(n)),new th(Q(n)),n.adTracker=new eq(Q(n)),new eN(Q(n)),new eO(Q(n)),new eU(Q(n)),new ts(Q(n)),new td(Q(n)),new tc(Q(n)),r.hlsjs&&n.addHLSJS(r),r.dashjs&&n.addDashJS(r),n.emit("viewinit",r.data),n}return X(a,[{key:"emit",value:function(e,t){var i,r=Object.assign({viewer_time:this.mux.utils.now()},t),n=[e,r];if(this.emitTranslator)try{n=this.emitTranslator(e,r)}catch(e){this.mux.log.warn("Exception in emit translator callback.",e)}null!=n&&n.length&&(i=et(ee(a.prototype),"emit",this)).call.apply(i,[this].concat(K(n)))}},{key:"destroy",value:function(){this._destroyed||(this._destroyed=!0,void 0!==this.data.view_start&&(this.emit("viewend"),this.send("viewend")),this.playbackEventDispatcher.destroy(),this.removeHLSJS(),this.removeDashJS(),window.clearTimeout(this._heartBeatTimeout))}},{key:"send",value:function(e){if(this.data.view_id){var t=Object.assign({},this.data);if(void 0===t.video_source_is_live&&(t.player_source_duration===1/0||t.video_source_duration===1/0?t.video_source_is_live=!0:(t.player_source_duration>0||t.video_source_duration>0)&&(t.video_source_is_live=!1)),t.video_source_is_live||["player_program_time","player_manifest_newest_program_time","player_live_edge_program_time","player_program_time","video_holdback","video_part_holdback","video_target_duration","video_part_target_duration"].forEach(function(e){t[e]=void 0}),t.video_source_url=t.video_source_url||t.player_source_url,t.video_source_url){var i=N(er(t.video_source_url),2),a=i[0];t.video_source_domain=i[1],t.video_source_hostname=a}delete t.ad_request_id,t.video_playback_ranges&&(t.video_playback_range=JSON.stringify(t.video_playback_ranges.filter(function(e){return e[0]!==e[1]}).map(function(e){return"".concat(e[0],":").concat(e[1])})),delete t.video_playback_ranges),this.playbackEventDispatcher.send(e,t),this.data.view_sequence_number++,this.data.player_sequence_number++,tp.has(e)||this._restartHeartBeat(),"viewend"===e&&delete this.data.view_id}}},{key:"_resetView",value:function(e){this.emit("viewend"),this.send("viewend"),this.emit("viewinit",e)}},{key:"_updateStateData",value:function(){var e,t=this.getStateData();if("function"==typeof this.stateDataTranslator)try{t=this.stateDataTranslator(t)}catch(e){this.mux.log.warn("Exception in stateDataTranslator translator callback.",e)}null!=(e=this.data)&&e.video_cdn&&null!=t&&t.video_cdn&&(t.video_cdn,t=function(e,t){if(null==e)return{};var i,a,r=function(e,t){if(null==e)return{};var i,a,r={},n=Object.keys(e);for(a=0;a<n.length;a++)i=n[a],t.indexOf(i)>=0||(r[i]=e[i]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)i=n[a],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(r[i]=e[i])}return r}(t,["video_cdn"])),Object.assign(this.data,t),this.playheadTime._updatePlayheadTime(),this._sanitizeData()}},{key:"_sanitizeData",value:function(){var e=this;["player_width","player_height","video_source_width","video_source_height","player_playhead_time","video_source_bitrate"].forEach(function(t){var i=parseInt(e.data[t],10);e.data[t]=isNaN(i)?void 0:i}),["player_source_url","video_source_url"].forEach(function(t){if(e.data[t]){var i=e.data[t].toLowerCase();(0===i.indexOf("data:")||0===i.indexOf("blob:"))&&(e.data[t]="MSE style URL")}})}},{key:"_resetVideoData",value:function(){var e=this;Object.keys(this.data).forEach(function(t){0===t.indexOf("video_")&&delete e.data[t]})}},{key:"_resetViewData",value:function(){var e=this;Object.keys(this.data).forEach(function(t){0===t.indexOf("view_")&&delete e.data[t]}),this.data.view_sequence_number=1}},{key:"_resetErrorData",value:function(){delete this.data.player_error_code,delete this.data.player_error_message,delete this.data.player_error_context,delete this.data.player_error_severity,delete this.data.player_error_business_exception}},{key:"_initializeViewData",value:function(){var e=this,t=this.data.view_id=$(),i=function(){t===e.data.view_id&&ed(e.data,"player_view_count",1)};this.data.player_is_paused?this.one("play",i):i()}},{key:"_restartHeartBeat",value:function(){var e=this;window.clearTimeout(this._heartBeatTimeout),this._heartBeatTimeout=window.setTimeout(function(){e.data.player_is_paused||e.emit("hb")},1e4)}},{key:"addHLSJS",value:function(e){e.hlsjs?this.hlsjs?this.mux.log.warn("An instance of HLS.js is already being monitored for this player."):(this.hlsjs=e.hlsjs,eE(this.mux,this.id,e.hlsjs,{},e.Hls||window.Hls)):this.mux.log.warn("You must pass a valid hlsjs instance in order to track it.")}},{key:"removeHLSJS",value:function(){this.hlsjs&&(ey(this.hlsjs),this.hlsjs=void 0)}},{key:"addDashJS",value:function(e){e.dashjs?this.dashjs?this.mux.log.warn("An instance of Dash.js is already being monitored for this player."):(this.dashjs=e.dashjs,ew(this.mux,this.id,e.dashjs)):this.mux.log.warn("You must pass a valid dashjs instance in order to track it.")}},{key:"removeDashJS",value:function(){this.dashjs&&(eS(this.dashjs),this.dashjs=void 0)}}]),a}(eC),tb=v(D());function tg(){return tb.default&&!!(tb.default.fullscreenElement||tb.default.webkitFullscreenElement||tb.default.mozFullScreenElement||tb.default.msFullscreenElement)}var tf,tE,ty=["loadstart","pause","play","playing","seeking","seeked","timeupdate","ratechange","stalled","waiting","error","ended"],t_={1:"MEDIA_ERR_ABORTED",2:"MEDIA_ERR_NETWORK",3:"MEDIA_ERR_DECODE",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"},tT=v(b());tT.default&&tT.default.WeakMap&&(tE=new WeakMap);var tA=function(e){return this.buffer="",this.manifest={segments:[],serverControl:{},sessionData:{}},this.currentUri={},this.process(e),this.manifest};tA.prototype.process=function(e){var t;for(this.buffer+=e,t=this.buffer.indexOf("\n");t>-1;t=this.buffer.indexOf("\n"))this.processLine(this.buffer.substring(0,t)),this.buffer=this.buffer.substring(t+1)},tA.prototype.processLine=function(e){var t=e.indexOf(":"),i=tL(e,t),a=i[0],r=2===i.length?tS(i[1]):void 0;if("#"!==a[0])this.currentUri.uri=a,this.manifest.segments.push(this.currentUri),!this.manifest.targetDuration||"duration"in this.currentUri||(this.currentUri.duration=this.manifest.targetDuration),this.currentUri={};else switch(a){case"#EXT-X-TARGETDURATION":if(!isFinite(r)||r<0)return;this.manifest.targetDuration=r,this.setHoldBack();break;case"#EXT-X-PART-INF":tk(this.manifest,i),this.manifest.partInf.partTarget&&(this.manifest.partTargetDuration=this.manifest.partInf.partTarget),this.setHoldBack();break;case"#EXT-X-SERVER-CONTROL":tk(this.manifest,i),this.setHoldBack();break;case"#EXTINF":0===r?this.currentUri.duration=.01:r>0&&(this.currentUri.duration=r);break;case"#EXT-X-PROGRAM-DATE-TIME":var n=new Date(r);this.manifest.dateTimeString||(this.manifest.dateTimeString=r,this.manifest.dateTimeObject=n),this.currentUri.dateTimeString=r,this.currentUri.dateTimeObject=n;break;case"#EXT-X-VERSION":tk(this.manifest,i);break;case"#EXT-X-SESSION-DATA":var s=eb(tM(i[1]));Object.assign(this.manifest.sessionData,s)}},tA.prototype.setHoldBack=function(){var e=this.manifest,t=e.serverControl,i=e.targetDuration,a=e.partTargetDuration;if(t){var r="holdBack",n="partHoldBack",s=i&&3*i,o=a&&2*a;i&&!t.hasOwnProperty(r)&&(t[r]=s),s&&t[r]<s&&(t[r]=s),a&&!t.hasOwnProperty(n)&&(t[n]=3*a),a&&t[n]<o&&(t[n]=o)}};var tk=function(e,t){var i,a=tw(t[0].replace("#EXT-X-",""));tR(t[1])?(i={},i=Object.assign(tC(t[1]),i)):i=tS(t[1]),e[a]=i},tw=function(e){return e.toLowerCase().replace(/-(\w)/g,function(e){return e[1].toUpperCase()})},tS=function(e){if("yes"===e.toLowerCase()||"no"===e.toLowerCase())return"yes"===e.toLowerCase();var t=-1!==e.indexOf(":")?e:parseFloat(e);return isNaN(t)?e:t},tI=function(e){var t={},i=e.split("=");return i.length>1&&(t[tw(i[0])]=tS(i[1])),t},tC=function(e){for(var t=e.split(","),i={},a=0;t.length>a;a++)i=Object.assign(tI(t[a]),i);return i},tR=function(e){return e.indexOf("=")>-1},tL=function(e,t){return -1===t?[e]:[e.substring(0,t),e.substring(t+1)]},tM=function(e){var t={};if(e){var i=e.search(",");return[e.slice(0,i),e.slice(i+1)].forEach(function(e,i){for(var a=e.replace(/['"]+/g,"").split("="),r=0;r<a.length;r++)"DATA-ID"===a[r]&&(t["DATA-ID"]=a[1-r]),"VALUE"===a[r]&&(t.VALUE=a[1-r])}),{data:t}}},tx={safeCall:function(e,t,i,a){var r=a;if(e&&"function"==typeof e[t])try{r=e[t].apply(e,i)}catch(e){j.info("safeCall error",e)}return r},safeIncrement:ed,getComputedStyle:function(e,t){var i;return e&&t&&tT.default&&"function"==typeof tT.default.getComputedStyle?(tE&&tE.has(e)&&(i=tE.get(e)),i||(i=tT.default.getComputedStyle(e,null),tE&&tE.set(e,i)),i.getPropertyValue(t)):""},secondsToMs:function(e){return Math.floor(1e3*e)},assign:Object.assign,headersStringToObject:ep,cdnHeadersToRequestId:ev,extractHostnameAndDomain:er,extractHostname:ea,manifestParser:tA,generateShortID:q,generateUUID:$,now:W,findMediaElement:F},tD={},tP=function(e){var t=arguments;"string"==typeof e?tP.hasOwnProperty(e)?U.default.setTimeout(function(){t=Array.prototype.splice.call(t,1),tP[e].apply(null,t)},0):j.warn("`"+e+"` is an unknown task"):"function"==typeof e?U.default.setTimeout(function(){e(tP)},0):j.warn("`"+e+"` is invalid.")},tO={loaded:W(),NAME:"mux-embed",VERSION:"5.17.10",API_VERSION:"2.1",PLAYER_TRACKED:!1,monitor:function(e,t){return function(e,t,i){var a=N(F(t),3),r=a[0],n=a[1],s=a[2],o=e.log,l=e.utils.getComputedStyle,d=e.utils.secondsToMs;if(!r)return o.error("No element was found with the `"+n+"` query selector.");if("video"!==s&&"audio"!==s)return o.error("The element of `"+n+"` was not a media element.");r.mux&&(r.mux.destroy(),delete r.mux,o.warn("Already monitoring this video element, replacing existing event listeners")),(i=Object.assign({automaticErrorTracking:!0},i,{getPlayheadTime:function(){return d(r.currentTime)},getStateData:function(){var e,t,i=(null==(e=this.getPlayheadTime)?void 0:e.call(this))||d(r.currentTime),a=this.hlsjs&&this.hlsjs.url,n=this.dashjs&&"function"==typeof this.dashjs.getSource&&this.dashjs.getSource(),s={player_is_paused:r.paused,player_width:parseInt(l(r,"width")),player_height:parseInt(l(r,"height")),player_autoplay_on:r.autoplay,player_preload_on:r.preload,player_language_code:r.lang,player_is_fullscreen:tg(),video_poster_url:r.poster,video_source_url:a||n||r.currentSrc,video_source_duration:d(r.duration),video_source_height:r.videoHeight,video_source_width:r.videoWidth,view_dropped_frame_count:null==r||null==(t=r.getVideoPlaybackQuality)?void 0:t.call(r).droppedVideoFrames};if(r.getStartDate&&i>0){var o=r.getStartDate();if(o&&"function"==typeof o.getTime&&o.getTime()){var u=o.getTime();s.player_program_time=u+i,r.seekable.length>0&&(s.player_live_edge_program_time=u+r.seekable.end(r.seekable.length-1))}}return s}})).data=Object.assign({player_software:"HTML5 Video Element",player_mux_plugin_name:"VideoElementMonitor",player_mux_plugin_version:e.VERSION},i.data),r.mux=r.mux||{},r.mux.deleted=!1,r.mux.emit=function(t,i){e.emit(n,t,i)},r.mux.updateData=function(e){r.mux.emit("hb",e)};var u=function(){o.error("The monitor for this video element has already been destroyed.")};r.mux.destroy=function(){Object.keys(r.mux.listeners).forEach(function(e){r.removeEventListener(e,r.mux.listeners[e],!1)}),delete r.mux.listeners,r.mux.fullscreenChangeListener&&(document.removeEventListener("fullscreenchange",r.mux.fullscreenChangeListener,!1),delete r.mux.fullscreenChangeListener),r.mux.destroy=u,r.mux.swapElement=u,r.mux.emit=u,r.mux.addHLSJS=u,r.mux.addDashJS=u,r.mux.removeHLSJS=u,r.mux.removeDashJS=u,r.mux.updateData=u,r.mux.setEmitTranslator=u,r.mux.setStateDataTranslator=u,r.mux.setGetPlayheadTime=u,r.mux.deleted=!0,e.emit(n,"destroy")},r.mux.swapElement=function(t){var i=N(F(t),3),a=i[0],n=i[1],s=i[2];return a?"video"!==s&&"audio"!==s?e.log.error("The element of `"+n+"` was not a media element."):void(a.muxId=r.muxId,delete r.muxId,a.mux=a.mux||{},a.mux.listeners=Object.assign({},r.mux.listeners),delete r.mux.listeners,Object.keys(a.mux.listeners).forEach(function(e){r.removeEventListener(e,a.mux.listeners[e],!1),a.addEventListener(e,a.mux.listeners[e],!1)}),a.mux.fullscreenChangeListener=r.mux.fullscreenChangeListener,delete r.mux.fullscreenChangeListener,a.mux.swapElement=r.mux.swapElement,a.mux.destroy=r.mux.destroy,delete r.mux,r=a):e.log.error("No element was found with the `"+n+"` query selector.")},r.mux.addHLSJS=function(t){e.addHLSJS(n,t)},r.mux.addDashJS=function(t){e.addDashJS(n,t)},r.mux.removeHLSJS=function(){e.removeHLSJS(n)},r.mux.removeDashJS=function(){e.removeDashJS(n)},r.mux.setEmitTranslator=function(t){e.setEmitTranslator(n,t)},r.mux.setStateDataTranslator=function(t){e.setStateDataTranslator(n,t)},r.mux.setGetPlayheadTime=function(t){t||(t=i.getPlayheadTime),e.setGetPlayheadTime(n,t)},e.init(n,i),e.emit(n,"playerready"),r.paused||(e.emit(n,"play"),r.readyState>2&&e.emit(n,"playing")),r.mux.listeners={},ty.forEach(function(t){("error"!==t||i.automaticErrorTracking)&&(r.mux.listeners[t]=function(){var i={};if("error"===t){if(!r.error||1===r.error.code)return;i.player_error_code=r.error.code,i.player_error_message=t_[r.error.code]||r.error.message}e.emit(n,t,i)},r.addEventListener(t,r.mux.listeners[t],!1))}),r.mux.listeners.enterpictureinpicture=function(){e.emit(n,"playbackmodechange",{player_playback_mode:"pip",player_playback_mode_data:"{}"})},r.mux.listeners.leavepictureinpicture=function(){var t=tg()?"fullscreen":"standard";e.emit(n,"playbackmodechange",{player_playback_mode:t,player_playback_mode_data:"{}"})},r.addEventListener("enterpictureinpicture",r.mux.listeners.enterpictureinpicture,!1),r.addEventListener("leavepictureinpicture",r.mux.listeners.leavepictureinpicture,!1),r.mux.fullscreenChangeListener=function(){var t=tg(),i=document.fullscreenElement;if(t&&(i===r||null!=i&&i.contains(r)))e.emit(n,"playbackmodechange",{player_playback_mode:"fullscreen",player_playback_mode_data:"{}"});else if(!t){var a=document.pictureInPictureElement===r;e.emit(n,"playbackmodechange",{player_playback_mode:a?"pip":"standard",player_playback_mode_data:"{}"})}},document.addEventListener("fullscreenchange",r.mux.fullscreenChangeListener,!1)}(tP,e,t)},destroyMonitor:function(e){var t=N(F(e),1)[0];t&&t.mux&&"function"==typeof t.mux.destroy?t.mux.destroy():j.error("A video element monitor for `"+e+"` has not been initialized via `mux.monitor`.")},addHLSJS:function(e,t){var i=V(e);tD[i]?tD[i].addHLSJS(t):j.error("A monitor for `"+i+"` has not been initialized.")},addDashJS:function(e,t){var i=V(e);tD[i]?tD[i].addDashJS(t):j.error("A monitor for `"+i+"` has not been initialized.")},removeHLSJS:function(e){var t=V(e);tD[t]?tD[t].removeHLSJS():j.error("A monitor for `"+t+"` has not been initialized.")},removeDashJS:function(e){var t=V(e);tD[t]?tD[t].removeDashJS():j.error("A monitor for `"+t+"` has not been initialized.")},init:function(e,t){G()&&t&&t.respectDoNotTrack&&j.info("The browser's Do Not Track flag is enabled - Mux beaconing is disabled.");var i=V(e);tD[i]=new tv(tP,i,t)},emit:function(e,t,i){var a=V(e);tD[a]?(tD[a].emit(t,i),"destroy"===t&&delete tD[a]):j.error("A monitor for `"+a+"` has not been initialized.")},updateData:function(e,t){var i=V(e);tD[i]?tD[i].emit("hb",t):j.error("A monitor for `"+i+"` has not been initialized.")},setEmitTranslator:function(e,t){var i=V(e);tD[i]?tD[i].emitTranslator=t:j.error("A monitor for `"+i+"` has not been initialized.")},setStateDataTranslator:function(e,t){var i=V(e);tD[i]?tD[i].stateDataTranslator=t:j.error("A monitor for `"+i+"` has not been initialized.")},setGetPlayheadTime:function(e,t){var i=V(e);tD[i]?tD[i].getPlayheadTime=t:j.error("A monitor for `"+i+"` has not been initialized.")},checkDoNotTrack:G,log:j,utils:tx,events:{PLAYER_READY:"playerready",VIEW_INIT:"viewinit",VIDEO_CHANGE:"videochange",PLAY:"play",PAUSE:"pause",PLAYING:"playing",TIME_UPDATE:"timeupdate",SEEKING:"seeking",SEEKED:"seeked",REBUFFER_START:"rebufferstart",REBUFFER_END:"rebufferend",ERROR:"error",ENDED:"ended",RENDITION_CHANGE:"renditionchange",ORIENTATION_CHANGE:"orientationchange",PLAYBACK_MODE_CHANGE:"playbackmodechange",AD_REQUEST:"adrequest",AD_RESPONSE:"adresponse",AD_BREAK_START:"adbreakstart",AD_PLAY:"adplay",AD_PLAYING:"adplaying",AD_PAUSE:"adpause",AD_FIRST_QUARTILE:"adfirstquartile",AD_MID_POINT:"admidpoint",AD_THIRD_QUARTILE:"adthirdquartile",AD_ENDED:"adended",AD_BREAK_END:"adbreakend",AD_ERROR:"aderror",REQUEST_COMPLETED:"requestcompleted",REQUEST_FAILED:"requestfailed",REQUEST_CANCELLED:"requestcanceled",HEARTBEAT:"hb",DESTROY:"destroy"},WINDOW_HIDDEN:!1,WINDOW_UNLOADING:!1};Object.assign(tP,tO),void 0!==U.default&&"function"==typeof U.default.addEventListener&&U.default.addEventListener("pagehide",function(e){e.persisted||(tP.WINDOW_UNLOADING=!0)},!1);var tN=e.i(650471),tU=tN.default,tH="video",tB=e=>e===tH?"playback":e,tW=class e extends Error{constructor(t,i=e.MEDIA_ERR_CUSTOM,a,r){var n;super(t),this.name="MediaError",this.code=i,this.context=r,this.fatal=null!=a?a:i>=e.MEDIA_ERR_NETWORK&&i<=e.MEDIA_ERR_ENCRYPTED,this.message||(this.message=null!=(n=e.defaultMessages[this.code])?n:"")}};tW.MEDIA_ERR_ABORTED=1,tW.MEDIA_ERR_NETWORK=2,tW.MEDIA_ERR_DECODE=3,tW.MEDIA_ERR_SRC_NOT_SUPPORTED=4,tW.MEDIA_ERR_ENCRYPTED=5,tW.MEDIA_ERR_CUSTOM=100,tW.defaultMessages={1:"You aborted the media playback",2:"A network error caused the media download to fail.",3:"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.",4:"An unsupported error occurred. The server or network failed, or your browser does not support this format.",5:"The media is encrypted and there are no keys to decrypt it."};var t$=(e,t)=>null!=t&&e in t,tq={ANY:"any",MUTED:"muted"},tV="on-demand",tF="live",tK="unknown",tj="native",tY={HEADER:"header",QUERY:"query",NONE:"none"},tG=Object.values(tY),tQ={M3U8:"application/vnd.apple.mpegurl",MP4:"video/mp4"},tz={HLS:tQ.M3U8};Object.keys(tz),[...Object.values(tQ)];var tZ={code:"en"},tX=(e,t,i,a,r=e)=>{r.addEventListener(t,i,a),e.addEventListener("teardown",()=>{r.removeEventListener(t,i)},{once:!0})},tJ=e=>{let t=e.indexOf("?");return t<0?[e]:[e.slice(0,t),e.slice(t)]},t0=e=>{let{type:t}=e;if(t){let e=t.toUpperCase();return t$(e,tz)?tz[e]:t}return t3(e)},t1=e=>"VOD"===e?tV:tF,t2=e=>"EVENT"===e?1/0:"VOD"===e?NaN:0,t3=e=>{let{src:t}=e;if(!t)return"";let i="";try{i=new URL(t).pathname}catch{console.error("invalid url")}let a=i.lastIndexOf(".");if(a<0)return t5(e)?tQ.M3U8:"";let r=i.slice(a+1).toUpperCase();return t$(r,tQ)?tQ[r]:""},t4="mux.com",t5=({src:e,customDomain:t=t4})=>{let i;try{i=new URL(`${e}`)}catch{return!1}let a="https:"===i.protocol,r=i.hostname===`stream.${t}`.toLowerCase(),n=i.pathname.split("/"),s=2===n.length,o=!(null!=n&&n[1].includes("."));return a&&r&&s&&o},t9=e=>{let t=(null!=e?e:"").split(".")[1];if(t)try{let e=t.replace(/-/g,"+").replace(/_/g,"/"),i=decodeURIComponent(atob(e).split("").map(function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(i)}catch{return}};function t8(e,t=!0){var i;return new t6(t&&null!=(i=null==tZ?void 0:tZ[e])?i:e,t?tZ.code:"en")}var t6=class{constructor(e,t=(e=>null!=(e=tZ)?e:"en")()){this.message=e,this.locale=t}format(e){return this.message.replace(/\{(\w+)\}/g,(t,i)=>{var a;return null!=(a=e[i])?a:""})}toString(){return this.message}},t7=Object.values(tq),ie=e=>"boolean"==typeof e||"string"==typeof e&&t7.includes(e),it=(e,t)=>{if(!t)return;let i=e.muted,a=()=>e.muted=i;switch(t){case tq.ANY:e.play().catch(()=>{e.muted=!0,e.play().catch(a)});break;case tq.MUTED:e.muted=!0,e.play().catch(a);break;default:e.play().catch(()=>{})}},ii=e=>"time"in e?e.time:e.startTime;function ia(e,t,i,a,r,n){let s=document.createElement("track");return s.kind=t,s.label=i,a&&(s.srclang=a),r&&(s.id=r),n&&(s.default=!0),s.track.mode=["subtitles","captions"].includes(t)?"disabled":"hidden",s.setAttribute("data-removeondestroy",""),e.append(s),s.track}function ir(e,t,i){var a;return null==(a=Array.from(e.querySelectorAll("track")).find(e=>e.track.label===t&&e.track.kind===i))?void 0:a.track}async function is(e,t,i,a){let r=ir(e,i,a);return r||((r=ia(e,a,i)).mode="hidden",await new Promise(e=>setTimeout(()=>e(void 0),0))),"hidden"!==r.mode&&(r.mode="hidden"),[...t].sort((e,t)=>ii(t)-ii(e)).forEach(t=>{var i,n;let s=t.value,o=ii(t);if("endTime"in t&&null!=t.endTime)null==r||r.addCue(new VTTCue(o,t.endTime,"chapters"===a?s:JSON.stringify(null!=s?s:null)));else{let t=Array.prototype.findIndex.call(null==r?void 0:r.cues,e=>e.startTime>=o),l=null==(i=null==r?void 0:r.cues)?void 0:i[t],d=l?l.startTime:Number.isFinite(e.duration)?e.duration:Number.MAX_SAFE_INTEGER,u=null==(n=null==r?void 0:r.cues)?void 0:n[t-1];u&&(u.endTime=o),null==r||r.addCue(new VTTCue(o,d,"chapters"===a?s:JSON.stringify(null!=s?s:null)))}}),e.textTracks.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),r}var io="cuepoints",il=Object.freeze({label:io});async function id(e,t,i=il){return is(e,t,i.label,"metadata")}var iu=e=>({time:e.startTime,value:JSON.parse(e.text)});function ic(e,t={label:io}){var i,a;let r=ir(e,t.label,"metadata");if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;if(1===r.activeCues.length)return iu(r.activeCues[0]);let{currentTime:n}=e;return iu(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n)||r.activeCues[0])}async function ih(e,t=il){return new Promise(i=>{tX(e,"loadstart",async()=>{let a=await id(e,[],t);tX(e,"cuechange",()=>{let t=ic(e);if(t){let i=new CustomEvent("cuepointchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}var im="chapters",ip=Object.freeze({label:im}),iv=e=>({startTime:e.startTime,endTime:e.endTime,value:e.text});async function ib(e,t,i=ip){return is(e,t,i.label,"chapters")}function ig(e,t={label:im}){var i,a;let r=ir(e,t.label,"chapters");if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;if(1===r.activeCues.length)return iv(r.activeCues[0]);let{currentTime:n}=e;return iv(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n)||r.activeCues[0])}async function iE(e,t=ip){return new Promise(i=>{tX(e,"loadstart",async()=>{let a=await ib(e,[],t);tX(e,"cuechange",()=>{let t=ig(e);if(t){let i=new CustomEvent("chapterchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}var iy=(e,t,i,a,r=!1,n=!(e=>null==(e=globalThis.navigator)?void 0:e.onLine)())=>{var s,o,l,d;let u,c;if(n){let i=t8("Your device appears to be offline",r),a=tW.MEDIA_ERR_NETWORK,n=new tW(i,a,!1,void 0);return n.errorCategory=t,n.muxCode=2000002,n.data=e,n}let h="status"in e?e.status:e.code,m=Date.now(),v=tW.MEDIA_ERR_NETWORK;if(200===h)return;let b=tB(t),g=(u=tB(t),c=`${u}Token`,null!=(l=i.tokens)&&l[u]?null==(d=i.tokens)?void 0:d[u]:t$(c,i)?i[c]:void 0),f=t===tH?"v":"drm"===t?"d":void 0,[E]=tJ(null!=(s=i.playbackId)?s:"");if(!h||!E)return;let y=t9(g);if(g&&!y){let i=new tW(t8("The {tokenNamePrefix}-token provided is invalid or malformed.",r).format({tokenNamePrefix:b}),v,!0,t8("Compact JWT string: {token}",r).format({token:g}));return i.errorCategory=t,i.muxCode=2412202,i.data=e,i}if(h>=500){let e=new tW("",v,null==a||a);return e.errorCategory=t,e.muxCode=2e6,e}if(403===h)if(y){if((({exp:e},t=Date.now())=>!e||1e3*e<t)(y,m)){let i={timeStyle:"medium",dateStyle:"medium"},a=new tW(t8("The video’s secured {tokenNamePrefix}-token has expired.",r).format({tokenNamePrefix:b}),v,!0,t8("Expired at: {expiredDate}. Current time: {currentDate}.",r).format({expiredDate:new Intl.DateTimeFormat("en",i).format(null!=(o=y.exp)?o:0),currentDate:new Intl.DateTimeFormat("en",i).format(m)}));return a.errorCategory=t,a.muxCode=2403210,a.data=e,a}if((({sub:e},t)=>e!==t)(y,E)){let i=new tW(t8("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",r).format({tokenNamePrefix:b}),v,!0,t8("Specified playback ID: {playbackId} and the playback ID encoded in the {tokenNamePrefix}-token: {tokenPlaybackId}",r).format({tokenNamePrefix:b,playbackId:E,tokenPlaybackId:y.sub}));return i.errorCategory=t,i.muxCode=2403232,i.data=e,i}if((({aud:e},t)=>!e)(y,0)){let i=new tW(t8("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:b}),v,!0,t8("The {tokenNamePrefix}-token has no aud value. aud value should be {expectedAud}.",r).format({tokenNamePrefix:b,expectedAud:f}));return i.errorCategory=t,i.muxCode=2403221,i.data=e,i}if((({aud:e},t)=>e!==t)(y,f)){let i=new tW(t8("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:b}),v,!0,t8("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.",r).format({tokenNamePrefix:b,expectedAud:f,aud:y.aud}));return i.errorCategory=t,i.muxCode=2403222,i.data=e,i}}else{let i=new tW(t8("Authorization error trying to access this {category} URL. If this is a signed URL, you might need to provide a {tokenNamePrefix}-token.",r).format({tokenNamePrefix:b,category:t}),v,null==a||a,t8("Specified playback ID: {playbackId}",r).format({playbackId:E}));return i.errorCategory=t,i.muxCode=2403201,i.data=e,i}if(412===h){let n=new tW(t8("This playback-id may belong to a live stream that is not currently active or an asset that is not ready.",r),v,null==a||a,t8("Specified playback ID: {playbackId}",r).format({playbackId:E}));return n.errorCategory=t,n.muxCode=2412e3,n.streamType=i.streamType===tF?"live":i.streamType===tV?"on-demand":"unknown",n.data=e,n}if(404===h){let i=new tW(t8("This URL or playback-id does not exist. You may have used an Asset ID or an ID from a different resource.",r),v,null==a||a,t8("Specified playback ID: {playbackId}",r).format({playbackId:E}));return i.errorCategory=t,i.muxCode=2404e3,i.data=e,i}if(400===h){let i=new tW(t8("The URL or playback-id was invalid. You may have used an invalid value as a playback-id."),v,null==a||a,t8("Specified playback ID: {playbackId}",r).format({playbackId:E}));return i.errorCategory=t,i.muxCode=24e5,i.data=e,i}let _=new tW("",v,null==a||a);return _.errorCategory=t,_.muxCode=2e6,_.data=e,_},i_=tU.DefaultConfig.capLevelController,iT={"720p":921600,"1080p":2073600,"1440p":4194304,"2160p":8294400},iA=class e extends i_{constructor(e){super(e)}static setMaxAutoResolution(t,i){i?e.maxAutoResolution.set(t,i):e.maxAutoResolution.delete(t)}getMaxAutoResolution(){var t;let i=this.hls;return null!=(t=e.maxAutoResolution.get(i))?t:void 0}get levels(){var e;return null!=(e=this.hls.levels)?e:[]}getValidLevels(e){return this.levels.filter((t,i)=>this.isLevelAllowed(t)&&i<=e)}getMaxLevelCapped(e){let t=this.getValidLevels(e),i=this.getMaxAutoResolution();if(!i)return super.getMaxLevel(e);let a=iT[i.toLowerCase().trim()];if(!a)return super.getMaxLevel(e);let r=t.filter(e=>e.width*e.height<=a),n=r.findIndex(e=>e.width*e.height===a);if(-1!==n){let e=r[n];return t.findIndex(t=>t===e)}if(0===r.length)return 0;let s=r[r.length-1];return t.findIndex(e=>e===s)}getMaxLevel(t){if(void 0!==this.getMaxAutoResolution())return this.getMaxLevelCapped(t);let i=super.getMaxLevel(t),a=this.getValidLevels(t);if(!a[i])return i;let r=Math.min(a[i].width,a[i].height),n=e.minMaxResolution;return r>=n?i:i_.getMaxLevelByMediaSize(a,16/9*n,n)}};iA.minMaxResolution=720,iA.maxAutoResolution=new WeakMap;var ik,iw,iS,iI,iC,iR,iL=e=>new TextDecoder("utf-16le").decode(e).replace("skd://","").slice(1),iM="fairplay",ix=/([A-Z0-9-]+)="?(.*?)"?(?:,|$)/g,iD=async(e,t)=>{if(t===tQ.MP4)return{streamType:tV,targetLiveWindow:NaN,liveEdgeStartOffset:void 0,sessionData:void 0};if(t===tQ.M3U8){let t=await fetch(e);if(!t.ok)return Promise.reject(t);let i=await t.text(),a=await fetch(i.split(`
`).find((e,t,i)=>t&&i[t-1].startsWith("#EXT-X-STREAM-INF"))).then(e=>200!==e.status?Promise.reject(e):e.text());return{...(e=>{let t=e.split(`
`).filter(e=>e.startsWith("#EXT-X-SESSION-DATA"));if(!t.length)return{};let i={};for(let e of t){let t=Object.fromEntries([...e.matchAll(ix)].map(([,e,t])=>[e,t])),a=t["DATA-ID"];a&&(i[a]={...t})}return{sessionData:i}})(i),...(e=>{var t,i,a;let r=e.split(`
`),n=null==(i=(null!=(t=r.find(e=>e.startsWith("#EXT-X-PLAYLIST-TYPE")))?t:"").split(":")[1])?void 0:i.trim(),s=t1(n),o=t2(n),l;if(s===tF){let e=r.find(e=>e.startsWith("#EXT-X-PART-INF"));if(e)l=2*e.split(":")[1].split("=")[1];else{let e=r.find(e=>e.startsWith("#EXT-X-TARGETDURATION")),t=null==(a=null==e?void 0:e.split(":"))?void 0:a[1];l=(null!=t?t:6)*3}}return{streamType:s,targetLiveWindow:o,liveEdgeStartOffset:l}})(a)}}return console.error(`Media type ${t} is an unrecognized or unsupported type for src ${e}.`),{streamType:void 0,targetLiveWindow:void 0,liveEdgeStartOffset:void 0,sessionData:void 0}},iP=async(e,t,i=t0({src:e}))=>{var a,r,n,s;let{streamType:o,targetLiveWindow:l,liveEdgeStartOffset:d,sessionData:u}=await iD(e,i),c=null==u?void 0:u["com.apple.hls.chapters"];(null!=c&&c.URI||null!=c&&c.VALUE.toLocaleLowerCase().startsWith("http"))&&iO(null!=(a=c.URI)?a:c.VALUE,t),(null!=(r=iB.get(t))?r:{}).liveEdgeStartOffset=d,(null!=(n=iB.get(t))?n:{}).targetLiveWindow=l,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(s=iB.get(t))?s:{}).streamType=o,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},iO=async(e,t)=>{var i,a;try{let r=await fetch(e);if(!r.ok)throw Error(`Failed to fetch Mux metadata: ${r.status} ${r.statusText}`);let n=await r.json(),s={};if(!(null!=(i=null==n?void 0:n[0])&&i.metadata))return;for(let e of n[0].metadata)e.key&&e.value&&(s[e.key]=e.value);(null!=(a=iB.get(t))?a:{}).metadata=s;let o=new CustomEvent("muxmetadata");t.dispatchEvent(o)}catch(e){console.error(e)}},iN=null!=(iw=null==(ik=null==globalThis?void 0:globalThis.navigator)?void 0:ik.userAgent)?iw:"",iU=null!=(iC=null==(iI=null==(iS=null==globalThis?void 0:globalThis.navigator)?void 0:iS.userAgentData)?void 0:iI.platform)?iC:"",iH=iN.toLowerCase().includes("android")||["x11","android"].some(e=>iU.toLowerCase().includes(e)),iB=new WeakMap,iW="mux.com",i$=null==(iR=tU.isSupported)?void 0:iR.call(tU),iq=()=>{if("u">typeof window)return tP.utils.now()},iV=tP.utils.generateUUID,iF=({playbackId:e,customDomain:t=iW,maxResolution:i,minResolution:a,renditionOrder:r,programStartTime:n,programEndTime:s,assetStartTime:o,assetEndTime:l,playbackToken:d,tokens:{playback:u=d}={},extraSourceParams:c={}}={})=>{if(!e)return;let[h,m=""]=tJ(e),v=new URL(`https://stream.${t}/${h}.m3u8${m}`);return u||v.searchParams.has("token")?(v.searchParams.forEach((e,t)=>{"token"!=t&&v.searchParams.delete(t)}),u&&v.searchParams.set("token",u)):(i&&v.searchParams.set("max_resolution",i),a&&(v.searchParams.set("min_resolution",a),i&&+i.slice(0,-1)<+a.slice(0,-1)&&console.error("minResolution must be <= maxResolution","minResolution",a,"maxResolution",i)),r&&v.searchParams.set("rendition_order",r),n&&v.searchParams.set("program_start_time",`${n}`),s&&v.searchParams.set("program_end_time",`${s}`),o&&v.searchParams.set("asset_start_time",`${o}`),l&&v.searchParams.set("asset_end_time",`${l}`),Object.entries(c).forEach(([e,t])=>{null!=t&&v.searchParams.set(e,t)})),v.toString()},iK=e=>{if(!e)return;let[t]=e.split("?");return t||void 0},ij=e=>{if(!e||!e.startsWith("https://stream."))return;let[t]=new URL(e).pathname.slice(1).split(/\.m3u8|\//);return t||void 0},iY=e=>{var t;return null==(t=iB.get(e))?void 0:t.error},iG=e=>{var t,i;return null!=(i=null==(t=iB.get(e))?void 0:t.streamType)?i:tK},iQ=e=>{var t,i;return null!=(i=null==(t=iB.get(e))?void 0:t.seekable)?i:e.seekable},iz=.034,iZ=(e,t,i=iz)=>e>t||((e,t,i=iz)=>Math.abs(e-t)<=i)(e,t,i),iX=(e,t)=>{var i,a,r;if(!t||!e.buffered.length)return;if(e.readyState>2)return!1;let n=t.currentLevel>=0?null==(a=null==(i=t.levels)?void 0:i[t.currentLevel])?void 0:a.details:null==(r=t.levels.find(e=>!!e.details))?void 0:r.details;if(!n||n.live)return;let{fragments:s}=n;if(!(null!=s&&s.length))return;if(e.currentTime<e.duration-(n.targetduration+.5))return!1;let o=s[s.length-1];if(e.currentTime<=o.start)return!1;let l=o.start+o.duration/2,d=e.buffered.start(e.buffered.length-1),u=e.buffered.end(e.buffered.length-1);return l>d&&l<u},iJ=(e,t)=>e.ended||e.loop?e.ended:!!(t&&iX(e,t))||((e,t=iz)=>e.paused&&iZ(e.currentTime,e.duration,t))(e),i0=(e,t,i)=>{var a,r,n;i1(t,i,e);let{metadata:s={}}=e,{view_session_id:o=iV()}=s,l=null!=(a=null==e?void 0:e.metadata)&&a.video_id?e.metadata.video_id:ae(e)&&null!=(n=null!=(r=iK(e.playbackId))?r:ij(e.src))?n:e.src;s.view_session_id=o,s.video_id=l,e.metadata=s,e.drmTypeCb=e=>{var i;null==(i=t.mux)||i.emit("hb",{view_drm_type:e})},e.fallbackToWebkitFairplay=async()=>{var i;let a=!t.paused,r=t.currentTime;e.useWebkitFairplay=!0;let n=e.muxDataKeepSession;e.muxDataKeepSession=!0;let s=null==(i=iB.get(t))?void 0:i.coreReference;i0(e,t,s),e.muxDataKeepSession=n,e.useWebkitFairplay=!1,a&&await t.play().then(()=>{t.currentTime=r}).catch(()=>{}),t.currentTime=r},iB.set(t,{retryCount:0});let d=i3(e,t),u=(({preload:e,src:t},i,a)=>{let r=e=>{null!=e&&["","none","metadata","auto"].includes(e)?i.setAttribute("preload",e):i.removeAttribute("preload")};if(!a)return r(e),r;let n=!1,s=!1,o=a.config.maxBufferLength,l=a.config.maxBufferSize,d=e=>{r(e);let t=null!=e?e:i.preload;s||"none"===t||("metadata"===t?(a.config.maxBufferLength=1,a.config.maxBufferSize=1):(a.config.maxBufferLength=o,a.config.maxBufferSize=l),u())},u=()=>{!n&&t&&(n=!0,a.loadSource(t))};return tX(i,"play",()=>{s=!0,a.config.maxBufferLength=o,a.config.maxBufferSize=l,u()},{once:!0}),d(e),d})(e,t,d);null!=e&&e.muxDataKeepSession&&null!=t&&t.mux&&!t.mux.deleted?d&&t.mux.addHLSJS({hlsjs:d,Hls:d?tU:void 0}):ai(e,t,d),aa(e,t,d),ih(t),iE(t);let c=((e,t,i)=>{let{autoplay:a}=e,r=!1,n=!1,s=ie(a)?a:!!a,o=()=>{r||tX(t,"playing",()=>{r=!0},{once:!0})};if(o(),tX(t,"loadstart",()=>{r=!1,o(),it(t,s)},{once:!0}),tX(t,"loadstart",()=>{i||(n=e.streamType&&e.streamType!==tK?e.streamType===tF:!Number.isFinite(t.duration)),it(t,s)},{once:!0}),i&&i.once(tU.Events.LEVEL_LOADED,(t,i)=>{var a;n=e.streamType&&e.streamType!==tK?e.streamType===tF:null!=(a=i.details.live)&&a}),!s){let a=()=>{!n||Number.isFinite(e.startTime)||(null!=i&&i.liveSyncPosition?t.currentTime=i.liveSyncPosition:Number.isFinite(t.seekable.end(0))&&(t.currentTime=t.seekable.end(0)))};i&&tX(t,"play",()=>{"metadata"===t.preload?i.once(tU.Events.LEVEL_UPDATED,a):a()},{once:!0})}return e=>{r||it(t,s=ie(e)?e:!!e)}})(e,t,d),h={engine:d,setAutoplay:c,setPreload:u},m=iB.get(t);return m&&(m.coreReference=h),h},i1=(e,t,i)=>{let a=null==t?void 0:t.engine;null!=e&&e.mux&&!e.mux.deleted&&(null!=i&&i.muxDataKeepSession?a&&e.mux.removeHLSJS():(e.mux.destroy(),delete e.mux)),a&&(a.detachMedia(),a.destroy()),e&&(e.hasAttribute("src")&&(e.removeAttribute("src"),e.load()),e.removeEventListener("error",an),e.removeEventListener("error",ao),e.removeEventListener("durationchange",ar),iB.delete(e),e.dispatchEvent(new Event("teardown")))};function i2(e,t){var i;let a=t0(e);if(a!==tQ.M3U8)return!0;let r=!a||null==(i=t.canPlayType(a))||i,{preferPlayback:n}=e,s=i$&&("mse"===n||iH||!(/^((?!chrome|android).)*safari/i.test(iN)&&t.canPlayType("application/vnd.apple.mpegurl")));return r&&(n===tj||!s)}var i3=(e,t)=>{let{debug:i,streamType:a,startTime:r=-1,metadata:n,preferCmcd:s,_hlsConfig:o={},maxAutoResolution:l}=e,d=t0(e)===tQ.M3U8,u=i2(e,t);if(d&&!u&&i$){let d=i4(a),u=i5(e),c=[tY.QUERY,tY.HEADER].includes(s)?{useHeaders:s===tY.HEADER,sessionId:null==n?void 0:n.view_session_id,contentId:null==n?void 0:n.video_id}:void 0,h=at(e,o),m=new tU({debug:i,startPosition:r,cmcd:c,xhrSetup:(e,t)=>{var i,a;if(s&&s!==tY.QUERY)return;let r=new URL(t);if(!r.searchParams.has("CMCD"))return;let n=(null!=(a=null==(i=r.searchParams.get("CMCD"))?void 0:i.split(","))?a:[]).filter(e=>e.startsWith("sid")||e.startsWith("cid")).join(",");r.searchParams.set("CMCD",n),e.open("GET",r)},backBufferLength:30,renderTextTracksNatively:!1,liveDurationInfinity:!0,capLevelOnFPSDrop:!0,...h,...d,...u,...o});return h.capLevelController===iA&&void 0!==l&&iA.setMaxAutoResolution(m,l),m.on(tU.Events.MANIFEST_PARSED,async function(e,i){var a,r;let n=null==(a=i.sessionData)?void 0:a["com.apple.hls.chapters"];(null!=n&&n.URI||null!=n&&n.VALUE.toLocaleLowerCase().startsWith("http"))&&iO(null!=(r=null==n?void 0:n.URI)?r:null==n?void 0:n.VALUE,t)}),m}},i4=e=>e===tF?{backBufferLength:8}:{},i5=e=>{let{tokens:{drm:t}={},playbackId:i,drmTypeCb:a}=e,r=iK(i);return t&&r?{emeEnabled:!0,drmSystems:{"com.apple.fps":{licenseUrl:i6(e,"fairplay"),serverCertificateUrl:i7(e,"fairplay")},"com.widevine.alpha":{licenseUrl:i6(e,"widevine")},"com.microsoft.playready":{licenseUrl:i6(e,"playready")}},requestMediaKeySystemAccessFunc:(e,t)=>("com.widevine.alpha"===e&&(t=[...t.map(e=>{var t;let i=null==(t=e.videoCapabilities)?void 0:t.map(e=>({...e,robustness:"HW_SECURE_ALL"}));return{...e,videoCapabilities:i}}),...t]),navigator.requestMediaKeySystemAccess(e,t).then(t=>{let i=e.includes("fps")?iM:e.includes("playready")?"playready":e.includes("widevine")?"widevine":void 0;return null==a||a(i),t}))}:{}},i9=async e=>{let t=await fetch(e);return 200!==t.status?Promise.reject(t):await t.arrayBuffer()},i8=async(e,t)=>{let i=await fetch(t,{method:"POST",headers:{"Content-type":"application/octet-stream"},body:e});return 200!==i.status?Promise.reject(i):new Uint8Array(await i.arrayBuffer())},i6=({playbackId:e,tokens:{drm:t}={},customDomain:i=iW},a)=>{let r=iK(e);return`https://license.${i.toLocaleLowerCase().endsWith(iW)?i:iW}/license/${a}/${r}?token=${t}`},i7=({playbackId:e,tokens:{drm:t}={},customDomain:i=iW},a)=>{let r=iK(e);return`https://license.${i.toLocaleLowerCase().endsWith(iW)?i:iW}/appcert/${a}/${r}?token=${t}`},ae=({playbackId:e,src:t,customDomain:i})=>{if(e)return!0;if("string"!=typeof t)return!1;let a=new URL(t,null==window?void 0:window.location.href).hostname.toLocaleLowerCase();return a.includes(iW)||!!i&&a.includes(i.toLocaleLowerCase())},at=(e,t)=>{let i={};return i.capLevelToPlayerSize=e.capRenditionToPlayerSize,null==i.capLevelToPlayerSize?(i.capLevelController=iA,i.capLevelToPlayerSize=!0):i.capLevelController=tN.CapLevelController,i},ai=(e,t,i)=>{var a;let{envKey:r,disableTracking:n,muxDataSDK:s=tP,muxDataSDKOptions:o={}}=e,l=ae(e);if(!n&&(r||l)){let{playerInitTime:n,playerSoftwareName:l,playerSoftwareVersion:d,beaconCollectionDomain:u,debug:c,disableCookies:h}=e,m={...e.metadata,video_title:(null==(a=null==e?void 0:e.metadata)?void 0:a.video_title)||void 0};s.monitor(t,{debug:c,beaconCollectionDomain:u,hlsjs:i,Hls:i?tU:void 0,automaticErrorTracking:!1,errorTranslator:t=>"string"!=typeof t.player_error_code&&("function"==typeof e.errorTranslator?e.errorTranslator(t):t),disableCookies:h,...o,data:{...r?{env_key:r}:{},player_software_name:l,player_software:l,player_software_version:d,player_init_time:n,...m}})}},aa=(e,t,i)=>{var a,r;let n=i2(e,t),{src:s,customDomain:o=iW}=e,l=()=>{t.ended||e.disablePseudoEnded||!iJ(t,i)||(iX(t,i)?t.currentTime=t.buffered.end(t.buffered.length-1):t.dispatchEvent(new Event("ended")))},d,u,c=()=>{let e=iQ(t),i,a;e.length>0&&(i=e.start(0),a=e.end(0)),(u!==a||d!==i)&&t.dispatchEvent(new CustomEvent("seekablechange",{composed:!0})),d=i,u=a};if(tX(t,"durationchange",c),t&&n){let i=t0(e);if("string"==typeof s){if(s.endsWith(".mp4")&&s.includes(o)){let e=ij(s);iO(new URL(`https://stream.${o}/${e}/metadata.json`).toString(),t)}let n=()=>{if(iG(t)!==tF||Number.isFinite(t.duration))return;let e=setInterval(c,1e3);t.addEventListener("teardown",()=>{clearInterval(e)},{once:!0}),tX(t,"durationchange",()=>{Number.isFinite(t.duration)&&clearInterval(e)})},l=async()=>iP(s,t,i).then(n).catch(i=>{if(i instanceof Response){let a=iy(i,tH,e);if(a)return void as(t,a)}});if("none"===t.preload){let e=()=>{l(),t.removeEventListener("loadedmetadata",i)},i=()=>{l(),t.removeEventListener("play",e)};tX(t,"play",e,{once:!0}),tX(t,"loadedmetadata",i,{once:!0})}else l();null!=(a=e.tokens)&&a.drm?((e,t)=>{let i={mediaEl:t,getAppCertificate:()=>i9(i7(e,"fairplay")).catch(t=>{if(t instanceof Response){let i=iy(t,"drm",e);return console.error("mediaError",null==i?void 0:i.message,null==i?void 0:i.context),i?Promise.reject(i):Promise.reject(Error("Unexpected error in app cert request"))}return Promise.reject(t)}),getLicenseKey:t=>i8(t,i6(e,"fairplay")).catch(t=>{if(t instanceof Response){let i=iy(t,"drm",e);return console.error("mediaError",null==i?void 0:i.message,null==i?void 0:i.context),i?Promise.reject(i):Promise.reject(Error("Unexpected error in license key request"))}return Promise.reject(t)}),saveAndDispatchError:as,drmTypeCb:()=>{var t;null==(t=e.drmTypeCb)||t.call(e,iM)}};if(e.useWebkitFairplay)(({mediaEl:e,getAppCertificate:t,getLicenseKey:i,saveAndDispatchError:a,drmTypeCb:r})=>{if(!window.WebKitMediaKeys||!("onwebkitneedkey"in e)){console.error("No WebKitMediaKeys. FairPlay may not be supported");let t=new tW(t8("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),tW.MEDIA_ERR_ENCRYPTED,!0);return t.errorCategory="drm",t.muxCode=5000005,a(e,t),()=>{}}let n=t(),s=null,o=t=>{(async()=>{try{var i,r;let a,s,o,u,c,h,m,v;e.webkitKeys||l();let b=await n;if(null===t.initData||null==b)return;let g=(i=t.initData,r=b,a=function(e){let t=new ArrayBuffer(2*e.length),i=new DataView(t);for(let t=0;t<e.length;t++)i.setUint16(2*t,e.charCodeAt(t),!0);return t}(iL(i)),s=new Uint8Array(i),o=new Uint8Array(a),u=new Uint8Array(r),c=new Uint8Array(s.byteLength+4+u.byteLength+4+o.byteLength),h=0,m=e=>{c.set(e,h),h+=e.byteLength},v=e=>{let t=new DataView(c.buffer),i=e.byteLength;t.setUint32(h,i,!0),h+=4,m(e)},m(s),v(o),v(u),c);d(g)}catch(t){console.error("Could not start encrypted playback due to exception",t),a(e,t)}})()},l=()=>{try{let t=new WebKitMediaKeys("com.apple.fps.1_0");e.webkitSetMediaKeys(t),r()}catch{let e=new tW("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser.",tW.MEDIA_ERR_ENCRYPTED,!0);throw e.errorCategory="drm",e.muxCode=5000001,e}},d=t=>{let r=e.webkitKeys.createSession("application/vnd.apple.mpegurl",t),n=async t=>{try{let e=t.message,a=await i(e);r.update(a)}catch(t){console.error("Error on FairPlay session message",t),a(e,t)}},o=t=>{let i=t.target.error;if(!i)return;console.error(`Internal Webkit Key Session Error - sysCode: ${i.systemCode} code: ${i.code}`);let r=new tW(t8("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),tW.MEDIA_ERR_ENCRYPTED,!0);r.errorCategory="drm",r.muxCode=5000005,a(e,r)},l=()=>{r.removeEventListener("webkitkeymessage",n),r.removeEventListener("webkitkeyerror",o),e.removeEventListener("teardown",l),"webkitCurrentPlaybackTargetIsWireless"in e&&e.removeEventListener("webkitcurrentplaybacktargetiswirelesschanged",l),s=null;try{r.close()}catch{}};"webkitCurrentPlaybackTargetIsWireless"in e&&e.addEventListener("webkitcurrentplaybacktargetiswirelesschanged",l,{once:!0}),r.addEventListener("webkitkeymessage",n),r.addEventListener("webkitkeyerror",o),e.addEventListener("teardown",l),s=l},u=()=>{e.removeEventListener("webkitneedkey",o),e.removeEventListener("teardown",u),null==s||s();try{e.webkitSetMediaKeys(null)}catch{}};return e.addEventListener("webkitneedkey",o),e.addEventListener("teardown",u,{once:!0})})(i);else{let t=(({mediaEl:e,getAppCertificate:t,getLicenseKey:i,saveAndDispatchError:a,drmTypeCb:r,fallbackToWebkitFairplay:n})=>{let s=null,o=async t=>{try{let i=t.initDataType;if("skd"!==i)return void console.error(`Received unexpected initialization data type "${i}"`);e.mediaKeys||await l(i);let a=t.initData;if(null==a)return void console.error(`Could not start encrypted playback due to missing initData in ${t.type} event`);await d(i,a)}catch(t){a(e,t);return}},l=async i=>{let n=await navigator.requestMediaKeySystemAccess("com.apple.fps",[{initDataTypes:[i],videoCapabilities:[{contentType:"application/vnd.apple.mpegurl",robustness:""}],distinctiveIdentifier:"not-allowed",persistentState:"not-allowed",sessionTypes:["temporary"]}]).then(e=>(r(),e)).catch(()=>{let t=new tW(t8("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),tW.MEDIA_ERR_ENCRYPTED,!0);t.errorCategory="drm",t.muxCode=5000001,a(e,t)});if(!n)return;let s=await n.createMediaKeys();try{let e=await t();await s.setServerCertificate(e).catch(()=>{let e=t8("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),t=new tW(e,tW.MEDIA_ERR_ENCRYPTED,!0);return t.errorCategory="drm",t.muxCode=5000004,Promise.reject(t)})}catch(t){a(e,t);return}await e.setMediaKeys(s)},d=async(t,r)=>{let o=e.mediaKeys.createSession(),l=async t=>{let r=t.message,n=await i(r);try{await o.update(n)}catch{let t=new tW(t8("Failed to update DRM license. This may be an issue with the player or your protected content."),tW.MEDIA_ERR_ENCRYPTED,!0);t.errorCategory="drm",t.muxCode=5000003,a(e,t)}},d=()=>{o.keyStatuses.forEach(t=>{let i;"internal-error"===t?((i=new tW(t8("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),tW.MEDIA_ERR_ENCRYPTED,!0)).errorCategory="drm",i.muxCode=5000005):("output-restricted"===t||"output-downscaled"===t)&&((i=new tW(t8("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen."),tW.MEDIA_ERR_ENCRYPTED,!1)).errorCategory="drm",i.muxCode=5000006),i&&a(e,i)})};o.addEventListener("keystatuseschange",d),o.addEventListener("message",l);let u=async()=>{o.removeEventListener("keystatuseschange",d),o.removeEventListener("message",l),"webkitCurrentPlaybackTargetIsWireless"in e&&e.removeEventListener("webkitcurrentplaybacktargetiswirelesschanged",u),e.removeEventListener("teardown",u),await o.close().catch(e=>{console.warn("There was an error when closing EME session",e)}),s=null};"webkitCurrentPlaybackTargetIsWireless"in e&&e.addEventListener("webkitcurrentplaybacktargetiswirelesschanged",u,{once:!0}),e.addEventListener("teardown",u,{once:!0}),s=u,await o.generateRequest(t,r).catch(async t=>{if("NotSupportedError"===t.name&&"webkitCurrentPlaybackTargetIsWireless"in e&&e.webkitCurrentPlaybackTargetIsWireless)console.warn("Failed to generate a DRM license request. Attempting to fallback to Webkit DRM"),null==n||n();else{let e=new tW(t8("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),tW.MEDIA_ERR_ENCRYPTED,!0);return e.errorCategory="drm",e.muxCode=5000002,console.error("Failed to generate license request",t),Promise.reject(e)}})},u=async()=>{e.removeEventListener("encrypted",o),e.removeEventListener("teardown",u),s&&await s(),await e.setMediaKeys(null).catch(()=>{})};return e.addEventListener("encrypted",o),e.addEventListener("teardown",u,{once:!0}),u})({fallbackToWebkitFairplay:async()=>{var i;await t(),null==(i=e.fallbackToWebkitFairplay)||i.call(e)},...i})}})(e,t):tX(t,"encrypted",()=>{let e=new tW(t8("Attempting to play DRM-protected content without providing a DRM token."),tW.MEDIA_ERR_ENCRYPTED,!0);e.errorCategory="drm",e.muxCode=5000002,as(t,e)},{once:!0}),t.setAttribute("src",s),e.startTime&&((null!=(r=iB.get(t))?r:{}).startTime=e.startTime,t.addEventListener("durationchange",ar,{once:!0}))}else t.removeAttribute("src");t.addEventListener("error",an),t.addEventListener("error",ao),t.addEventListener("emptied",()=>{t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})},{once:!0}),tX(t,"pause",l),tX(t,"seeked",l),tX(t,"play",()=>{t.ended||iZ(t.currentTime,t.duration)&&(t.currentTime=t.seekable.length?t.seekable.start(0):0)})}else{let a,r;i&&s?(i.once(tU.Events.LEVEL_LOADED,(e,a)=>{((e,t,i)=>{var a,r,n,s,o,l,d,u,c;let h,m,v,b,g,{streamType:f,targetLiveWindow:E,liveEdgeStartOffset:y,lowLatency:_}=(m=t1(h=e.type),v=t2(h),g=!!(null!=(c=e.partList)&&c.length),m===tF&&(b=g?2*e.partTarget:3*e.targetduration),{streamType:m,targetLiveWindow:v,liveEdgeStartOffset:b,lowLatency:g});if(f===tF){_?(i.config.backBufferLength=null!=(a=i.userConfig.backBufferLength)?a:4,i.config.maxFragLookUpTolerance=null!=(r=i.userConfig.maxFragLookUpTolerance)?r:.001,i.config.abrBandWidthUpFactor=null!=(n=i.userConfig.abrBandWidthUpFactor)?n:i.config.abrBandWidthFactor):i.config.backBufferLength=null!=(s=i.userConfig.backBufferLength)?s:8;let e=Object.freeze({get length(){return t.seekable.length},start:e=>t.seekable.start(e),end(e){var a;return e>this.length||e<0||Number.isFinite(t.duration)?t.seekable.end(e):null!=(a=i.liveSyncPosition)?a:t.seekable.end(e)}});(null!=(o=iB.get(t))?o:{}).seekable=e}(null!=(l=iB.get(t))?l:{}).liveEdgeStartOffset=y,(null!=(d=iB.get(t))?d:{}).targetLiveWindow=E,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(u=iB.get(t))?u:{}).streamType=f,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))})(a.details,t,i),c(),iG(t)!==tF||Number.isFinite(t.duration)||(i.on(tU.Events.LEVEL_UPDATED,c),tX(t,"durationchange",()=>{Number.isFinite(t.duration)&&i.off(tU.Events.LEVELS_UPDATED,c)}))}),i.on(tU.Events.ERROR,(a,r)=>{var n,s;let o=al(r,e);if(2412e3===o.muxCode){let e=null!=(n=iB.get(t))?n:{},a=null!=(s=e.retryCount)?s:0;if(a<6){let n=0===a?5e3:6e4,s=new tW(`Retrying in ${n/1e3} seconds...`,o.code,o.fatal);Object.assign(s,o),as(t,s),setTimeout(()=>{e.retryCount=a+1,"manifestLoadError"===r.details&&r.url&&i.loadSource(r.url)},n);return}{e.retryCount=0;let i=new tW('Try again later or <a href="#" onclick="window.location.reload(); return false;" style="color: #4a90e2;">click here to retry</a>',o.code,o.fatal);Object.assign(i,o),as(t,i);return}}as(t,o)}),i.on(tU.Events.MANIFEST_LOADED,()=>{let e=iB.get(t);e&&e.error&&(e.error=null,e.retryCount=0,t.dispatchEvent(new Event("emptied")),t.dispatchEvent(new Event("loadstart")))}),t.addEventListener("error",ao),tX(t,"waiting",l),function(e,t){var i;if(!("videoTracks"in e))return;let a=new WeakMap;t.on(tU.Events.MANIFEST_PARSED,function(t,i){n();let r=e.addVideoTrack("main");for(let[e,t]of(r.selected=!0,i.levels.entries())){let i=r.addRendition(t.url[0],t.width,t.height,t.videoCodec,t.bitrate);a.set(t,`${e}`),i.id=`${e}`}}),t.on(tU.Events.AUDIO_TRACKS_UPDATED,function(t,i){for(let t of(r(),i.audioTracks)){let i=t.default?"main":"alternative",a=e.addAudioTrack(i,t.name,t.lang);a.id=`${t.id}`,t.default&&(a.enabled=!0)}}),e.audioTracks.addEventListener("change",()=>{var i;let a=+(null==(i=[...e.audioTracks].find(e=>e.enabled))?void 0:i.id),r=t.audioTracks.map(e=>e.id);a!=t.audioTrack&&r.includes(a)&&(t.audioTrack=a)}),t.on(tU.Events.LEVELS_UPDATED,function(t,i){var r;let n=e.videoTracks[null!=(r=e.videoTracks.selectedIndex)?r:0];if(!n)return;let s=i.levels.map(e=>a.get(e));for(let t of e.videoRenditions)t.id&&!s.includes(t.id)&&n.removeRendition(t)}),null==(i=e.videoRenditions)||i.addEventListener("change",e=>{let i=e.target.selectedIndex;i!=t.nextLevel&&(t.nextLevel=i)});let r=()=>{for(let t of e.audioTracks)e.removeAudioTrack(t)},n=()=>{(()=>{for(let t of e.videoTracks)e.removeVideoTrack(t)})(),r()};t.once(tU.Events.DESTROYING,n)}(e,i),i.on(tU.Events.NON_NATIVE_TEXT_TRACKS_FOUND,(e,{tracks:a})=>{a.forEach(e=>{var a,r;let n=null!=(a=e.subtitleTrack)?a:e.closedCaptions,s=i.subtitleTracks.findIndex(({lang:t,name:i,type:a})=>t==(null==n?void 0:n.lang)&&i===e.label&&a.toLowerCase()===e.kind),o=(null!=(r=e._id)?r:e.default)?"default":`${e.kind}${s}`;ia(t,e.kind,e.label,null==n?void 0:n.lang,o,e.default)})}),a=()=>{if(!i.subtitleTracks.length)return;let e=Array.from(t.textTracks).find(e=>e.id&&"showing"===e.mode&&["subtitles","captions"].includes(e.kind));if(!e)return;let a=i.subtitleTracks[i.subtitleTrack],r=a?a.default?"default":`${i.subtitleTracks[i.subtitleTrack].type.toLowerCase()}${i.subtitleTrack}`:void 0;if(i.subtitleTrack<0||(null==e?void 0:e.id)!==r){let t=i.subtitleTracks.findIndex(({lang:t,name:i,type:a,default:r})=>"default"===e.id&&r||t==e.language&&i===e.label&&a.toLowerCase()===e.kind);i.subtitleTrack=t}(null==e?void 0:e.id)===r&&e.cues&&Array.from(e.cues).forEach(t=>{e.addCue(t)})},t.textTracks.addEventListener("change",a),i.on(tU.Events.CUES_PARSED,(e,{track:i,cues:a})=>{let r=t.textTracks.getTrackById(i);if(!r)return;let n="disabled"===r.mode;n&&(r.mode="hidden"),a.forEach(e=>{var t;null!=(t=r.cues)&&t.getCueById(e.id)||r.addCue(e)}),n&&(r.mode="disabled")}),i.once(tU.Events.DESTROYING,()=>{t.textTracks.removeEventListener("change",a),t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})}),r=()=>{Array.from(t.textTracks).forEach(e=>{var i,a;if(!["subtitles","caption"].includes(e.kind)&&("thumbnails"===e.label||"chapters"===e.kind)){if(!(null!=(i=e.cues)&&i.length)){let i="track";e.kind&&(i+=`[kind="${e.kind}"]`),e.label&&(i+=`[label="${e.label}"]`);let r=t.querySelector(i),n=null!=(a=null==r?void 0:r.getAttribute("src"))?a:"";null==r||r.removeAttribute("src"),setTimeout(()=>{null==r||r.setAttribute("src",n)},0)}"hidden"!==e.mode&&(e.mode="hidden")}})},i.once(tU.Events.MANIFEST_LOADED,r),i.once(tU.Events.MEDIA_ATTACHED,r),i.attachMedia(t)):console.error("It looks like the video you're trying to play will not work on this system! If possible, try upgrading to the newest versions of your browser or software.")}};function ar(e){var t;let i=e.target,a=null==(t=iB.get(i))?void 0:t.startTime;if(a&&function(e,t,i){t&&i>t&&(i=t);for(let t=0;t<e.length;t++)if(e.start(t)<=i&&e.end(t)>=i)return!0;return!1}(i.seekable,i.duration,a)){let e="auto"===i.preload;e&&(i.preload="none"),i.currentTime=a,e&&(i.preload="auto")}}async function an(e){if(!e.isTrusted)return;e.stopImmediatePropagation();let t=e.target;if(!(null!=t&&t.error))return;let{message:i,code:a}=t.error,r=new tW(i,a);if(t.src&&a===tW.MEDIA_ERR_SRC_NOT_SUPPORTED&&t.readyState===HTMLMediaElement.HAVE_NOTHING)return void setTimeout(()=>{var e;let i=null!=(e=iY(t))?e:t.error;(null==i?void 0:i.code)===tW.MEDIA_ERR_SRC_NOT_SUPPORTED&&as(t,r)},500);if(t.src&&(a!==tW.MEDIA_ERR_DECODE||void 0!==a))try{let{status:e}=await fetch(t.src);r.data={response:{code:e}}}catch{}as(t,r)}function as(e,t){var i;t.fatal&&((null!=(i=iB.get(e))?i:{}).error=t,e.dispatchEvent(new CustomEvent("error",{detail:t})))}function ao(e){var t,i;if(!(e instanceof CustomEvent)||!(e.detail instanceof tW))return;let a=e.target,r=e.detail;r&&r.fatal&&((null!=(t=iB.get(a))?t:{}).error=r,null==(i=a.mux)||i.emit("error",{player_error_code:r.code,player_error_message:r.message,player_error_context:r.context}))}var al=(e,t)=>{var i,a,r;e.fatal?console.error("getErrorFromHlsErrorData()",e):t.debug&&console.warn("getErrorFromHlsErrorData() (non-fatal)",e);let n={[tU.ErrorTypes.NETWORK_ERROR]:tW.MEDIA_ERR_NETWORK,[tU.ErrorTypes.MEDIA_ERROR]:tW.MEDIA_ERR_DECODE,[tU.ErrorTypes.KEY_SYSTEM_ERROR]:tW.MEDIA_ERR_ENCRYPTED},s,o=[tU.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,tU.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED].includes(e.details)?tW.MEDIA_ERR_NETWORK:n[e.type];if(o===tW.MEDIA_ERR_NETWORK&&e.response){let r=null!=(i=e.type===tU.ErrorTypes.KEY_SYSTEM_ERROR?"drm":e.type===tU.ErrorTypes.NETWORK_ERROR?tH:void 0)?i:tH;s=null!=(a=iy(e.response,r,t,e.fatal))?a:new tW("",o,e.fatal)}else o===tW.MEDIA_ERR_ENCRYPTED?e.details===tU.ErrorDetails.KEY_SYSTEM_NO_CONFIGURED_LICENSE?((s=new tW(t8("Attempting to play DRM-protected content without providing a DRM token."),tW.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000002):e.details===tU.ErrorDetails.KEY_SYSTEM_NO_ACCESS?((s=new tW(t8("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),tW.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000001):e.details===tU.ErrorDetails.KEY_SYSTEM_NO_SESSION?((s=new tW(t8("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),tW.MEDIA_ERR_ENCRYPTED,!0)).errorCategory="drm",s.muxCode=5000002):e.details===tU.ErrorDetails.KEY_SYSTEM_SESSION_UPDATE_FAILED?((s=new tW(t8("Failed to update DRM license. This may be an issue with the player or your protected content."),tW.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000003):e.details===tU.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED?((s=new tW(t8("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),tW.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000004):e.details===tU.ErrorDetails.KEY_SYSTEM_STATUS_INTERNAL_ERROR?((s=new tW(t8("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),tW.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000005):e.details===tU.ErrorDetails.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED?((s=new tW(t8("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen."),tW.MEDIA_ERR_ENCRYPTED,!1)).errorCategory="drm",s.muxCode=5000006):((s=new tW(e.error.message,tW.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5e6):s=new tW("",o,e.fatal);return s.context||(s.context=`${e.url?`url: ${e.url}
`:""}${e.response&&(e.response.code||e.response.text)?`response: ${e.response.code}, ${e.response.text}
`:""}${e.reason?`failure reason: ${e.reason}
`:""}${e.level?`level: ${e.level}
`:""}${e.parent?`parent stream controller: ${e.parent}
`:""}${e.buffer?`buffer length: ${e.buffer}
`:""}${e.error?`error: ${e.error}
`:""}${e.event?`event: ${e.event}
`:""}${e.err?`error message: ${null==(r=e.err)?void 0:r.message}
`:""}`),s.data=e,s};let ad=["abort","canplay","canplaythrough","durationchange","emptied","encrypted","ended","error","loadeddata","loadedmetadata","loadstart","pause","play","playing","progress","ratechange","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","waitingforkey","resize","enterpictureinpicture","leavepictureinpicture","webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"],au=["autopictureinpicture","disablepictureinpicture","disableremoteplayback","autoplay","controls","controlslist","crossorigin","loop","muted","playsinline","poster","preload","src"];function ac(e){return`
    <style>
      :host {
        display: inline-flex;
        line-height: 0;
        flex-direction: column;
        justify-content: end;
      }

      audio {
        width: 100%;
      }
    </style>
    <slot name="media">
      <audio${ap(e)}></audio>
    </slot>
    <slot></slot>
  `}function ah(e){return`
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, 50% 50%);
      }

      video::-webkit-media-text-track-container {
        transform: var(--media-webkit-text-track-transform);
        transition: var(--media-webkit-text-track-transition);
      }
    </style>
    <slot name="media">
      <video${ap(e)}></video>
    </slot>
    <slot></slot>
  `}function am(e,{tag:t,is:i}){let a=globalThis.document?.createElement?.(t,{is:i}),r=a?function(e){let t=[];for(let i=Object.getPrototypeOf(e);i&&i!==HTMLElement.prototype;i=Object.getPrototypeOf(i)){let e=Object.getOwnPropertyNames(i);t.push(...e)}return t}(a):[];return class n extends e{static getTemplateHTML=t.endsWith("audio")?ac:ah;static shadowRootOptions={mode:"open"};static Events=ad;static #e=!1;static get observedAttributes(){return n.#t(),[...a?.constructor?.observedAttributes??[],...au]}static #t(){if(this.#e)return;this.#e=!0;let e=new Set(this.observedAttributes);for(let t of(e.delete("muted"),r))if(!(t in this.prototype))if("function"==typeof a[t])this.prototype[t]=function(...e){return this.#i(),(()=>{if(this.call)return this.call(t,...e);let i=this.nativeEl?.[t];return i?.apply(this.nativeEl,e)})()};else{let i={get(){this.#i();let i=t.toLowerCase();if(e.has(i)){let e=this.getAttribute(i);return null!==e&&(""===e||e)}return this.get?.(t)??this.nativeEl?.[t]}};t!==t.toUpperCase()&&(i.set=function(i){this.#i();let a=t.toLowerCase();e.has(a)?!0===i||!1===i||null==i?this.toggleAttribute(a,!!i):this.setAttribute(a,i):this.set?this.set(t,i):this.nativeEl&&(this.nativeEl[t]=i)}),Object.defineProperty(this.prototype,t,i)}}#a=!1;#r=null;#n=new Map;#s;get;set;call;get nativeEl(){return this.#i(),this.#r??this.querySelector(":scope > [slot=media]")??this.querySelector(t)??this.shadowRoot?.querySelector(t)??null}set nativeEl(e){this.#r=e}get defaultMuted(){return this.hasAttribute("muted")}set defaultMuted(e){this.toggleAttribute("muted",e)}get src(){return this.getAttribute("src")}set src(e){this.setAttribute("src",`${e}`)}get preload(){return this.getAttribute("preload")??this.nativeEl?.preload}set preload(e){this.setAttribute("preload",`${e}`)}#i(){this.#a||(this.#a=!0,this.init())}init(){if(!this.shadowRoot){this.attachShadow({mode:"open"});let e=function(e){let t={};for(let i of e)t[i.name]=i.value;return t}(this.attributes);i&&(e.is=i),t&&(e.part=t),this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}for(let e of(this.nativeEl.muted=this.hasAttribute("muted"),r))this.#o(e);for(let e of(this.#s=new MutationObserver(this.#l.bind(this)),this.shadowRoot.addEventListener("slotchange",()=>this.#d()),this.#d(),this.constructor.Events))this.shadowRoot.addEventListener(e,this,!0)}handleEvent(e){e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{detail:e.detail}))}#d(){let e=new Map(this.#n),t=this.shadowRoot?.querySelector("slot:not([name])");(t?.assignedElements({flatten:!0}).filter(e=>["track","source"].includes(e.localName))).forEach(t=>{e.delete(t);let i=this.#n.get(t);i||(i=t.cloneNode(),this.#n.set(t,i),this.#s?.observe(t,{attributes:!0})),this.nativeEl?.append(i),this.#u(i)}),e.forEach((e,t)=>{e.remove(),this.#n.delete(t)})}#l(e){for(let t of e)if("attributes"===t.type){let{target:e,attributeName:i}=t,a=this.#n.get(e);a&&i&&(a.setAttribute(i,e.getAttribute(i)??""),this.#u(a))}}#u(e){e&&"track"===e.localName&&e.default&&("chapters"===e.kind||"metadata"===e.kind)&&"disabled"===e.track.mode&&(e.track.mode="hidden")}#o(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}}attributeChangedCallback(e,t,i){this.#i(),this.#c(e,t,i)}#c(e,t,i){["id","class"].includes(e)||!n.observedAttributes.includes(e)&&this.constructor.observedAttributes.includes(e)||(null===i?this.nativeEl?.removeAttribute(e):this.nativeEl?.getAttribute(e)!==i&&this.nativeEl?.setAttribute(e,i))}connectedCallback(){this.#i()}}}function ap(e){let t="";for(let i in e){if(!au.includes(i))continue;let a=e[i];""===a?t+=` ${i}`:t+=` ${i}="${a}"`}return t}let av=am(globalThis.HTMLElement??class{},{tag:"video"});am(globalThis.HTMLElement??class{},{tag:"audio"});var ab,ag,af,aE,ay,a_,aT,aA,ak,aw,aS,aI,aC,aR=e=>{throw TypeError(e)},aL=(e,t,i)=>t.has(e)||aR("Cannot "+i),aM=(e,t,i)=>(aL(e,t,"read from private field"),i?i.call(e):t.get(e)),ax=(e,t,i)=>t.has(e)?aR("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),aD=(e,t,i,a)=>(aL(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aP=(e,t,i)=>(aL(e,t,"access private method"),i),aO=(()=>{try{return"0.30.3"}catch{}return"UNKNOWN"})(),aN=`
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" part="logo" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 1600 500"><g fill="#fff"><path d="M994.287 93.486c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m0-93.486c-34.509 0-62.484 27.976-62.484 62.486v187.511c0 68.943-56.09 125.033-125.032 125.033s-125.03-56.09-125.03-125.033V62.486C681.741 27.976 653.765 0 619.256 0s-62.484 27.976-62.484 62.486v187.511C556.772 387.85 668.921 500 806.771 500c137.851 0 250.001-112.15 250.001-250.003V62.486c0-34.51-27.976-62.486-62.485-62.486M1537.51 468.511c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m-275.883-218.509-143.33 143.329c-24.402 24.402-24.402 63.966 0 88.368 24.402 24.402 63.967 24.402 88.369 0l143.33-143.329 143.328 143.329c24.402 24.4 63.967 24.402 88.369 0 24.403-24.402 24.403-63.966.001-88.368l-143.33-143.329.001-.004 143.329-143.329c24.402-24.402 24.402-63.965 0-88.367s-63.967-24.402-88.369 0L1349.996 161.63 1206.667 18.302c-24.402-24.401-63.967-24.402-88.369 0s-24.402 63.965 0 88.367l143.329 143.329v.004ZM437.511 468.521c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31M461.426 4.759C438.078-4.913 411.2.432 393.33 18.303L249.999 161.632 106.669 18.303C88.798.432 61.922-4.913 38.573 4.759 15.224 14.43-.001 37.214-.001 62.488v375.026c0 34.51 27.977 62.486 62.487 62.486 34.51 0 62.486-27.976 62.486-62.486V213.341l80.843 80.844c24.404 24.402 63.965 24.402 88.369 0l80.843-80.844v224.173c0 34.51 27.976 62.486 62.486 62.486s62.486-27.976 62.486-62.486V62.488c0-25.274-15.224-48.058-38.573-57.729" style="fill-rule:nonzero"/></g></svg>`,aU={BEACON_COLLECTION_DOMAIN:"beacon-collection-domain",CUSTOM_DOMAIN:"custom-domain",DEBUG:"debug",DISABLE_TRACKING:"disable-tracking",DISABLE_COOKIES:"disable-cookies",DISABLE_PSEUDO_ENDED:"disable-pseudo-ended",DRM_TOKEN:"drm-token",PLAYBACK_TOKEN:"playback-token",ENV_KEY:"env-key",MAX_RESOLUTION:"max-resolution",MIN_RESOLUTION:"min-resolution",MAX_AUTO_RESOLUTION:"max-auto-resolution",RENDITION_ORDER:"rendition-order",PROGRAM_START_TIME:"program-start-time",PROGRAM_END_TIME:"program-end-time",ASSET_START_TIME:"asset-start-time",ASSET_END_TIME:"asset-end-time",METADATA_URL:"metadata-url",PLAYBACK_ID:"playback-id",PLAYER_SOFTWARE_NAME:"player-software-name",PLAYER_SOFTWARE_VERSION:"player-software-version",PLAYER_INIT_TIME:"player-init-time",PREFER_CMCD:"prefer-cmcd",PREFER_PLAYBACK:"prefer-playback",START_TIME:"start-time",STREAM_TYPE:"stream-type",TARGET_LIVE_WINDOW:"target-live-window",LIVE_EDGE_OFFSET:"live-edge-offset",TYPE:"type",LOGO:"logo",CAP_RENDITION_TO_PLAYER_SIZE:"cap-rendition-to-player-size"},aH=Object.values(aU),aB="mux-video",aW=class extends av{constructor(){super(),ax(this,aw),ax(this,ab),ax(this,ag),ax(this,af,{}),ax(this,aE,{}),ax(this,ay),ax(this,a_),ax(this,aT),ax(this,aA),ax(this,ak,""),ax(this,aI),aD(this,ag,iq()),this.nativeEl.addEventListener("muxmetadata",e=>{var t,i,a;let r=(i=this.nativeEl,null==(a=iB.get(i))?void 0:a.metadata),n=null!=(t=this.metadata)?t:{};this.metadata={...r,...n},(null==r?void 0:r["com.mux.video.branding"])==="mux-free-plan"&&(aD(this,ak,"default"),this.updateLogo())})}static get NAME(){return aB}static get VERSION(){return aO}static get observedAttributes(){var e;return[...aH,...null!=(e=av.observedAttributes)?e:[]]}static getLogoHTML(e){return e&&"false"!==e?"default"===e?aN:`<img part="logo" src="${e}" />`:""}static getTemplateHTML(e={}){var t;return`
      ${av.getTemplateHTML(e)}
      <style>
        :host {
          position: relative;
        }
        slot[name="logo"] {
          display: flex;
          justify-content: end;
          position: absolute;
          top: 1rem;
          right: 1rem;
          opacity: 0;
          transition: opacity 0.25s ease-in-out;
          z-index: 1;
        }
        slot[name="logo"]:has([part="logo"]) {
          opacity: 1;
        }
        slot[name="logo"] [part="logo"] {
          width: 5rem;
          pointer-events: none;
          user-select: none;
        }
      </style>
      <slot name="logo">
        ${this.getLogoHTML(null!=(t=e[aU.LOGO])?t:"")}
      </slot>
    `}get preferCmcd(){var e;return null!=(e=this.getAttribute(aU.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?tG.includes(e)?this.setAttribute(aU.PREFER_CMCD,e):console.warn(`Invalid value for preferCmcd. Must be one of ${tG.join()}`):this.removeAttribute(aU.PREFER_CMCD))}get playerInitTime(){return this.hasAttribute(aU.PLAYER_INIT_TIME)?+this.getAttribute(aU.PLAYER_INIT_TIME):aM(this,ag)}set playerInitTime(e){e!=this.playerInitTime&&(null==e?this.removeAttribute(aU.PLAYER_INIT_TIME):this.setAttribute(aU.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return null!=(e=aM(this,aT))?e:aB}set playerSoftwareName(e){aD(this,aT,e)}get playerSoftwareVersion(){var e;return null!=(e=aM(this,a_))?e:aO}set playerSoftwareVersion(e){aD(this,a_,e)}get _hls(){var e;return null==(e=aM(this,aw,aS))?void 0:e.engine}get mux(){var e;return null==(e=this.nativeEl)?void 0:e.mux}get error(){var e;return null!=(e=iY(this.nativeEl))?e:null}get errorTranslator(){return aM(this,aA)}set errorTranslator(e){aD(this,aA,e)}get src(){return this.getAttribute("src")}set src(e){e!==this.src&&(null==e?this.removeAttribute("src"):this.setAttribute("src",e))}get type(){var e;return null!=(e=this.getAttribute(aU.TYPE))?e:void 0}set type(e){e!==this.type&&(e?this.setAttribute(aU.TYPE,e):this.removeAttribute(aU.TYPE))}get preload(){let e=this.getAttribute("preload");return""===e?"auto":["none","metadata","auto"].includes(e)?e:super.preload}set preload(e){e!=this.getAttribute("preload")&&(["","none","metadata","auto"].includes(e)?this.setAttribute("preload",e):this.removeAttribute("preload"))}get debug(){return null!=this.getAttribute(aU.DEBUG)}set debug(e){e!==this.debug&&(e?this.setAttribute(aU.DEBUG,""):this.removeAttribute(aU.DEBUG))}get disableTracking(){return this.hasAttribute(aU.DISABLE_TRACKING)}set disableTracking(e){e!==this.disableTracking&&this.toggleAttribute(aU.DISABLE_TRACKING,!!e)}get disableCookies(){return this.hasAttribute(aU.DISABLE_COOKIES)}set disableCookies(e){e!==this.disableCookies&&(e?this.setAttribute(aU.DISABLE_COOKIES,""):this.removeAttribute(aU.DISABLE_COOKIES))}get disablePseudoEnded(){return this.hasAttribute(aU.DISABLE_PSEUDO_ENDED)}set disablePseudoEnded(e){e!==this.disablePseudoEnded&&(e?this.setAttribute(aU.DISABLE_PSEUDO_ENDED,""):this.removeAttribute(aU.DISABLE_PSEUDO_ENDED))}get startTime(){let e=this.getAttribute(aU.START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set startTime(e){e!==this.startTime&&(null==e?this.removeAttribute(aU.START_TIME):this.setAttribute(aU.START_TIME,`${e}`))}get playbackId(){var e;return this.hasAttribute(aU.PLAYBACK_ID)?this.getAttribute(aU.PLAYBACK_ID):null!=(e=ij(this.src))?e:void 0}set playbackId(e){e!==this.playbackId&&(e?this.setAttribute(aU.PLAYBACK_ID,e):this.removeAttribute(aU.PLAYBACK_ID))}get maxResolution(){var e;return null!=(e=this.getAttribute(aU.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(aU.MAX_RESOLUTION,e):this.removeAttribute(aU.MAX_RESOLUTION))}get minResolution(){var e;return null!=(e=this.getAttribute(aU.MIN_RESOLUTION))?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(aU.MIN_RESOLUTION,e):this.removeAttribute(aU.MIN_RESOLUTION))}get maxAutoResolution(){var e;return null!=(e=this.getAttribute(aU.MAX_AUTO_RESOLUTION))?e:void 0}set maxAutoResolution(e){null==e?this.removeAttribute(aU.MAX_AUTO_RESOLUTION):this.setAttribute(aU.MAX_AUTO_RESOLUTION,e)}get renditionOrder(){var e;return null!=(e=this.getAttribute(aU.RENDITION_ORDER))?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(aU.RENDITION_ORDER,e):this.removeAttribute(aU.RENDITION_ORDER))}get programStartTime(){let e=this.getAttribute(aU.PROGRAM_START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set programStartTime(e){null==e?this.removeAttribute(aU.PROGRAM_START_TIME):this.setAttribute(aU.PROGRAM_START_TIME,`${e}`)}get programEndTime(){let e=this.getAttribute(aU.PROGRAM_END_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set programEndTime(e){null==e?this.removeAttribute(aU.PROGRAM_END_TIME):this.setAttribute(aU.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){let e=this.getAttribute(aU.ASSET_START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set assetStartTime(e){null==e?this.removeAttribute(aU.ASSET_START_TIME):this.setAttribute(aU.ASSET_START_TIME,`${e}`)}get assetEndTime(){let e=this.getAttribute(aU.ASSET_END_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set assetEndTime(e){null==e?this.removeAttribute(aU.ASSET_END_TIME):this.setAttribute(aU.ASSET_END_TIME,`${e}`)}get customDomain(){var e;return null!=(e=this.getAttribute(aU.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(aU.CUSTOM_DOMAIN,e):this.removeAttribute(aU.CUSTOM_DOMAIN))}get capRenditionToPlayerSize(){var e;return(null==(e=this._hlsConfig)?void 0:e.capLevelToPlayerSize)!=null?this._hlsConfig.capLevelToPlayerSize:aM(this,aI)}set capRenditionToPlayerSize(e){aD(this,aI,e)}get drmToken(){var e;return null!=(e=this.getAttribute(aU.DRM_TOKEN))?e:void 0}set drmToken(e){e!==this.drmToken&&(e?this.setAttribute(aU.DRM_TOKEN,e):this.removeAttribute(aU.DRM_TOKEN))}get playbackToken(){var e,t,i,a;if(this.hasAttribute(aU.PLAYBACK_TOKEN))return null!=(e=this.getAttribute(aU.PLAYBACK_TOKEN))?e:void 0;if(this.hasAttribute(aU.PLAYBACK_ID)){let[,e]=tJ(null!=(t=this.playbackId)?t:"");return null!=(i=new URLSearchParams(e).get("token"))?i:void 0}if(this.src)return null!=(a=new URLSearchParams(this.src).get("token"))?a:void 0}set playbackToken(e){e!==this.playbackToken&&(e?this.setAttribute(aU.PLAYBACK_TOKEN,e):this.removeAttribute(aU.PLAYBACK_TOKEN))}get tokens(){let e=this.getAttribute(aU.PLAYBACK_TOKEN),t=this.getAttribute(aU.DRM_TOKEN);return{...aM(this,aE),...null!=e?{playback:e}:{},...null!=t?{drm:t}:{}}}set tokens(e){aD(this,aE,null!=e?e:{})}get ended(){return iJ(this.nativeEl,this._hls)}get envKey(){var e;return null!=(e=this.getAttribute(aU.ENV_KEY))?e:void 0}set envKey(e){e!==this.envKey&&(e?this.setAttribute(aU.ENV_KEY,e):this.removeAttribute(aU.ENV_KEY))}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(aU.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(aU.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(aU.BEACON_COLLECTION_DOMAIN))}get streamType(){var e;return null!=(e=this.getAttribute(aU.STREAM_TYPE))?e:iG(this.nativeEl)}set streamType(e){e!==this.streamType&&(e?this.setAttribute(aU.STREAM_TYPE,e):this.removeAttribute(aU.STREAM_TYPE))}get targetLiveWindow(){var e,t,i;return this.hasAttribute(aU.TARGET_LIVE_WINDOW)?+this.getAttribute(aU.TARGET_LIVE_WINDOW):(e=this.nativeEl,null!=(i=null==(t=iB.get(e))?void 0:t.targetLiveWindow)?i:NaN)}set targetLiveWindow(e){e!=this.targetLiveWindow&&(null==e?this.removeAttribute(aU.TARGET_LIVE_WINDOW):this.setAttribute(aU.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e,t;if(this.hasAttribute(aU.LIVE_EDGE_OFFSET)){let{liveEdgeOffset:i}=this,a=null!=(e=this.nativeEl.seekable.end(0))?e:0;return Math.max(null!=(t=this.nativeEl.seekable.start(0))?t:0,a-i)}return(e=>{var t;let i=null==(t=iB.get(e))?void 0:t.liveEdgeStartOffset;if("number"!=typeof i)return NaN;let a=iQ(e);return a.length?a.end(a.length-1)-i:NaN})(this.nativeEl)}get liveEdgeOffset(){if(this.hasAttribute(aU.LIVE_EDGE_OFFSET))return+this.getAttribute(aU.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){e!=this.liveEdgeOffset&&(null==e?this.removeAttribute(aU.LIVE_EDGE_OFFSET):this.setAttribute(aU.LIVE_EDGE_OFFSET,`${+e}`))}get seekable(){return iQ(this.nativeEl)}async addCuePoints(e){return id(this.nativeEl,e)}get activeCuePoint(){return ic(this.nativeEl)}get cuePoints(){return function(e,t={label:io}){let i=ir(e,t.label,"metadata");return null!=i&&i.cues?Array.from(i.cues,e=>iu(e)):[]}(this.nativeEl)}async addChapters(e){return ib(this.nativeEl,e)}get activeChapter(){return ig(this.nativeEl)}get chapters(){return function(e,t={label:im}){var i;let a=ir(e,t.label,"chapters");return null!=(i=null==a?void 0:a.cues)&&i.length?Array.from(a.cues,e=>iv(e)):[]}(this.nativeEl)}getStartDate(){return function(e,t){if(t){let i=t.playingDate;if(null!=i)return new Date(i.getTime()-1e3*e.currentTime)}return"function"==typeof e.getStartDate?e.getStartDate():new Date(NaN)}(this.nativeEl,this._hls)}get currentPdt(){var e,t;return e=this.nativeEl,(t=this._hls)&&t.playingDate?t.playingDate:new Date("function"==typeof e.getStartDate?e.getStartDate().getTime()+1e3*e.currentTime:NaN)}get preferPlayback(){let e=this.getAttribute(aU.PREFER_PLAYBACK);if("mse"===e||e===tj)return e}set preferPlayback(e){e!==this.preferPlayback&&("mse"===e||e===tj?this.setAttribute(aU.PREFER_PLAYBACK,e):this.removeAttribute(aU.PREFER_PLAYBACK))}get metadata(){return{...this.getAttributeNames().filter(e=>e.startsWith("metadata-")&&![aU.METADATA_URL].includes(e)).reduce((e,t)=>{let i=this.getAttribute(t);return null!=i&&(e[t.replace(/^metadata-/,"").replace(/-/g,"_")]=i),e},{}),...aM(this,af)}}set metadata(e){aD(this,af,null!=e?e:{}),this.mux&&this.mux.emit("hb",aM(this,af))}get _hlsConfig(){return aM(this,ay)}set _hlsConfig(e){aD(this,ay,e)}get logo(){var e;return null!=(e=this.getAttribute(aU.LOGO))?e:aM(this,ak)}set logo(e){e?this.setAttribute(aU.LOGO,e):this.removeAttribute(aU.LOGO)}load(){i0(this,this.nativeEl,aM(this,aw,aS))}unload(){i1(this.nativeEl,aM(this,aw,aS),this)}attributeChangedCallback(e,t,i){var a,r;switch(av.observedAttributes.includes(e)&&!["src","autoplay","preload"].includes(e)&&super.attributeChangedCallback(e,t,i),e){case aU.PLAYER_SOFTWARE_NAME:this.playerSoftwareName=null!=i?i:void 0;break;case aU.PLAYER_SOFTWARE_VERSION:this.playerSoftwareVersion=null!=i?i:void 0;break;case"src":{let e=!!t,a=!!i;!e&&a?aP(this,aw,aC).call(this):e&&!a?this.unload():e&&a&&(this.unload(),aP(this,aw,aC).call(this));break}case"autoplay":if(i===t)break;null==(a=aM(this,aw,aS))||a.setAutoplay(this.autoplay);break;case"preload":if(i===t)break;null==(r=aM(this,aw,aS))||r.setPreload(i);break;case aU.PLAYBACK_ID:this.src=iF(this);break;case aU.DEBUG:{let e=this.debug;this.mux&&console.info("Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."),this._hls&&(this._hls.config.debug=e);break}case aU.METADATA_URL:i&&fetch(i).then(e=>e.json()).then(e=>this.metadata=e).catch(()=>console.error(`Unable to load or parse metadata JSON from metadata-url ${i}!`));break;case aU.STREAM_TYPE:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}));break;case aU.TARGET_LIVE_WINDOW:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0,detail:this.targetLiveWindow}));break;case aU.LOGO:(null==i||i!==t)&&this.updateLogo();break;case aU.DISABLE_TRACKING:if(null==i||i!==t){let e=this.currentTime,t=this.paused;this.unload(),aP(this,aw,aC).call(this).then(()=>{this.currentTime=e,t||this.play()})}break;case aU.DISABLE_COOKIES:(null==i||i!==t)&&this.disableCookies&&document.cookie.split(";").forEach(e=>{e.trim().startsWith("muxData")&&(document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires="+new Date().toUTCString()+";path=/"))});break;case aU.CAP_RENDITION_TO_PLAYER_SIZE:(null==i||i!==t)&&(this.capRenditionToPlayerSize=null!=i||void 0)}}updateLogo(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector('slot[name="logo"]');e&&(e.innerHTML=this.constructor.getLogoHTML(aM(this,ak)||this.logo))}connectedCallback(){var e;null==(e=super.connectedCallback)||e.call(this),this.nativeEl&&this.src&&!aM(this,aw,aS)&&aP(this,aw,aC).call(this)}disconnectedCallback(){this.unload()}handleEvent(e){e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{composed:!0,detail:e.detail}))}};ab=new WeakMap,ag=new WeakMap,af=new WeakMap,aE=new WeakMap,ay=new WeakMap,a_=new WeakMap,aT=new WeakMap,aA=new WeakMap,ak=new WeakMap,aw=new WeakSet,aS=function(){var e,t;return e=this.nativeEl,null==(t=iB.get(e))?void 0:t.coreReference},aI=new WeakMap,aC=async function(){aM(this,ab)||(await aD(this,ab,Promise.resolve()),aD(this,ab,null),this.load())};let a$=new WeakMap;class aq extends Error{}class aV extends Error{}let aF=["application/x-mpegURL","application/vnd.apple.mpegurl","audio/mpegurl"];function aK(){return globalThis.cast?.framework?.CastContext.getInstance()}function aj(){return aK()?.getCurrentSession()}function aY(){return aj()?.getSessionObj().media[0]}function aG(e){return aK().setOptions({...aQ(),...e})}function aQ(){return{receiverApplicationId:"CC1AD845",autoJoinPolicy:"origin_scoped",androidReceiverCompatible:!1,language:"en-US",resumeSavedSession:!0}}async function az(e){try{let t=(await fetch(e,{method:"HEAD"})).headers.get("Content-Type");return aF.some(e=>t===e)}catch(e){return console.error("Error while trying to get the Content-Type of the manifest",e),!1}}async function aZ(e){try{let i=await (await fetch(e)).text(),a=i,r=function(e){let t=e.split("\n"),i=[];for(let e=0;e<t.length;e++)if(t[e].trim().startsWith("#EXT-X-STREAM-INF")){let a=t[e+1]?t[e+1].trim():"";a&&!a.startsWith("#")&&i.push(a)}return i}(i);if(r.length>0){let t=new URL(r[0],e).toString();a=await (await fetch(t)).text()}var t=a.split("\n").find(e=>!e.trim().startsWith("#")&&""!==e.trim());if(!t)return;let n=t.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);return n?n[1]:null}catch(e){console.error("Error while trying to parse the manifest playlist",e);return}}let aX=new(globalThis.WeakRef?class extends Set{add(e){super.add(new WeakRef(e))}forEach(e){super.forEach(t=>{let i=t.deref();i&&e(i)})}}:Set),aJ=new WeakSet;re=()=>{globalThis.chrome?.cast?.isAvailable?t||(t=cast.framework,aK().addEventListener(t.CastContextEventType.CAST_STATE_CHANGED,e=>{aX.forEach(t=>a$.get(t).onCastStateChanged?.(e))}),aK().addEventListener(t.CastContextEventType.SESSION_STATE_CHANGED,e=>{aX.forEach(t=>a$.get(t).onSessionStateChanged?.(e))}),aX.forEach(e=>a$.get(e).init?.())):console.debug("chrome.cast.isAvailable",globalThis.chrome?.cast?.isAvailable)},globalThis.chrome?.cast?.isAvailable?globalThis.cast?.framework?re():customElements.whenDefined("google-cast-button").then(re):globalThis.__onGCastApiAvailable=()=>{customElements.whenDefined("google-cast-button").then(re)};let a0=0;class a1 extends EventTarget{#h;#a;#m;#p;#v="disconnected";#b=!1;#g=new Set;#f=new WeakMap;constructor(e){super(),this.#h=e,aX.add(this),a$.set(this,{init:()=>this.#i(),onCastStateChanged:()=>this.#E(),onSessionStateChanged:()=>this.#y(),getCastPlayer:()=>this.#_}),this.#i()}get #_(){if(aJ.has(this.#h))return this.#m}get state(){return this.#v}async watchAvailability(e){if(this.#h.disableRemotePlayback)throw new aq("disableRemotePlayback attribute is present.");return this.#f.set(e,++a0),this.#g.add(e),queueMicrotask(()=>e(this.#T())),a0}async cancelWatchAvailability(e){if(this.#h.disableRemotePlayback)throw new aq("disableRemotePlayback attribute is present.");e?this.#g.delete(e):this.#g.clear()}async prompt(){if(this.#h.disableRemotePlayback)throw new aq("disableRemotePlayback attribute is present.");if(!globalThis.chrome?.cast?.isAvailable)throw new aV("The RemotePlayback API is disabled on this platform.");let e=aJ.has(this.#h);aJ.add(this.#h),aG(this.#h.castOptions),Object.entries(this.#p).forEach(([e,t])=>{this.#m.controller.addEventListener(e,t)});try{await aK().requestSession()}catch(t){if(e||aJ.delete(this.#h),"cancel"===t)return;throw Error(t)}a$.get(this.#h)?.loadOnPrompt?.()}#A(){aJ.has(this.#h)&&(Object.entries(this.#p).forEach(([e,t])=>{this.#m.controller.removeEventListener(e,t)}),aJ.delete(this.#h),this.#h.muted=this.#m.isMuted,this.#h.currentTime=this.#m.savedPlayerState.currentTime,!1===this.#m.savedPlayerState.isPaused&&this.#h.play())}#T(){let e=aK()?.getCastState();return e&&"NO_DEVICES_AVAILABLE"!==e}#E(){let e=aK().getCastState();if(aJ.has(this.#h)&&"CONNECTING"===e&&(this.#v="connecting",this.dispatchEvent(new Event("connecting"))),!this.#b&&e?.includes("CONNECT"))for(let e of(this.#b=!0,this.#g))e(!0);else if(this.#b&&(!e||"NO_DEVICES_AVAILABLE"===e))for(let e of(this.#b=!1,this.#g))e(!1)}async #y(){let{SESSION_RESUMED:e}=t.SessionState;if(aK().getSessionState()===e&&this.#h.castSrc===aY()?.media.contentId){aJ.add(this.#h),Object.entries(this.#p).forEach(([e,t])=>{this.#m.controller.addEventListener(e,t)});try{var i;await (i=new chrome.cast.media.GetStatusRequest,new Promise((e,t)=>{aY().getStatus(i,e,t)}))}catch(e){console.error(e)}this.#p[t.RemotePlayerEventType.IS_PAUSED_CHANGED](),this.#p[t.RemotePlayerEventType.PLAYER_STATE_CHANGED]()}}#i(){t&&!this.#a&&(this.#a=!0,aG(this.#h.castOptions),this.#h.textTracks.addEventListener("change",()=>this.#k()),this.#E(),this.#m=new t.RemotePlayer,new t.RemotePlayerController(this.#m),this.#p={[t.RemotePlayerEventType.IS_CONNECTED_CHANGED]:({value:e})=>{!0===e?(this.#v="connected",this.dispatchEvent(new Event("connect"))):(this.#A(),this.#v="disconnected",this.dispatchEvent(new Event("disconnect")))},[t.RemotePlayerEventType.DURATION_CHANGED]:()=>{this.#h.dispatchEvent(new Event("durationchange"))},[t.RemotePlayerEventType.VOLUME_LEVEL_CHANGED]:()=>{this.#h.dispatchEvent(new Event("volumechange"))},[t.RemotePlayerEventType.IS_MUTED_CHANGED]:()=>{this.#h.dispatchEvent(new Event("volumechange"))},[t.RemotePlayerEventType.CURRENT_TIME_CHANGED]:()=>{this.#_?.isMediaLoaded&&this.#h.dispatchEvent(new Event("timeupdate"))},[t.RemotePlayerEventType.VIDEO_INFO_CHANGED]:()=>{this.#h.dispatchEvent(new Event("resize"))},[t.RemotePlayerEventType.IS_PAUSED_CHANGED]:()=>{this.#h.dispatchEvent(new Event(this.paused?"pause":"play"))},[t.RemotePlayerEventType.PLAYER_STATE_CHANGED]:()=>{this.#_?.playerState!==chrome.cast.media.PlayerState.PAUSED&&this.#h.dispatchEvent(new Event({[chrome.cast.media.PlayerState.PLAYING]:"playing",[chrome.cast.media.PlayerState.BUFFERING]:"waiting",[chrome.cast.media.PlayerState.IDLE]:"emptied"}[this.#_?.playerState]))},[t.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED]:async()=>{this.#_?.isMediaLoaded&&(await Promise.resolve(),this.#w())}})}#w(){this.#k()}async #k(){let e;if(!this.#_)return;let t=(this.#m.mediaInfo?.tracks??[]).filter(({type:e})=>e===chrome.cast.media.TrackType.TEXT),i=[...this.#h.textTracks].filter(({kind:e})=>"subtitles"===e||"captions"===e),a=t.map(({language:e,name:t,trackId:a})=>{let{mode:r}=i.find(i=>i.language===e&&i.label===t)??{};return!!r&&{mode:r,trackId:a}}).filter(Boolean),r=a.filter(({mode:e})=>"showing"!==e).map(({trackId:e})=>e),n=a.find(({mode:e})=>"showing"===e),s=aj()?.getSessionObj().media[0]?.activeTrackIds??[],o=s;if(s.length&&(o=o.filter(e=>!r.includes(e))),n?.trackId&&(o=[...o,n.trackId]),e=o=[...new Set(o)],!(s.length===e.length&&s.every(t=>e.includes(t))))try{let e=new chrome.cast.media.EditTracksInfoRequest(o);await new Promise((t,i)=>{aY().editTracksInfo(e,t,i)})}catch(e){console.error(e)}}}let a2=e=>class extends e{static observedAttributes=[...e.observedAttributes??[],"cast-src","cast-content-type","cast-stream-type","cast-receiver"];#S={paused:!1};#I=aQ();#C;#R;get remote(){return this.#R?this.#R:globalThis.chrome?(this.disableRemotePlayback||function(){let e="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";if(globalThis.chrome?.cast||document.querySelector(`script[src="${e}"]`))return;let t=document.createElement("script");t.src=e,document.head.append(t)}(),a$.set(this,{loadOnPrompt:()=>this.#L()}),this.#R=new a1(this)):super.remote}get #_(){return a$.get(this.remote)?.getCastPlayer?.()}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),"cast-receiver"===e&&i){this.#I.receiverApplicationId=i;return}if(this.#_)switch(e){case"cast-stream-type":case"cast-src":this.load()}}async #L(){this.#S.paused=super.paused,super.pause(),this.muted=super.muted;try{await this.load()}catch(e){console.error(e)}}async load(){if(!this.#_)return super.load();let e=new chrome.cast.media.MediaInfo(this.castSrc,this.castContentType);e.customData=this.castCustomData;let t=[...this.querySelectorAll("track")].filter(({kind:e,src:t})=>t&&("subtitles"===e||"captions"===e)),i=[],a=0;if(t.length&&(e.tracks=t.map(e=>{let t=++a;0===i.length&&"showing"===e.track.mode&&i.push(t);let r=new chrome.cast.media.Track(t,chrome.cast.media.TrackType.TEXT);return r.trackContentId=e.src,r.trackContentType="text/vtt",r.subtype="captions"===e.kind?chrome.cast.media.TextTrackType.CAPTIONS:chrome.cast.media.TextTrackType.SUBTITLES,r.name=e.label,r.language=e.srclang,r})),"live"===this.castStreamType?e.streamType=chrome.cast.media.StreamType.LIVE:e.streamType=chrome.cast.media.StreamType.BUFFERED,e.metadata=new chrome.cast.media.GenericMediaMetadata,e.metadata.title=this.title,e.metadata.images=[{url:this.poster}],az(this.castSrc)){let t=await aZ(this.castSrc);t?.includes("m4s")||t?.includes("mp4")?(e.hlsSegmentFormat=chrome.cast.media.HlsSegmentFormat.FMP4,e.hlsVideoSegmentFormat=chrome.cast.media.HlsVideoSegmentFormat.FMP4):t?.includes("ts")&&(e.hlsSegmentFormat=chrome.cast.media.HlsSegmentFormat.TS,e.hlsVideoSegmentFormat=chrome.cast.media.HlsVideoSegmentFormat.TS)}let r=new chrome.cast.media.LoadRequest(e);r.currentTime=super.currentTime??0,r.autoplay=!this.#S.paused,r.activeTrackIds=i,await aj()?.loadMedia(r),this.dispatchEvent(new Event("volumechange"))}play(){if(this.#_){this.#_.isPaused&&this.#_.controller?.playOrPause();return}return super.play()}pause(){if(this.#_){this.#_.isPaused||this.#_.controller?.playOrPause();return}super.pause()}get castOptions(){return this.#I}get castReceiver(){return this.getAttribute("cast-receiver")??void 0}set castReceiver(e){this.castReceiver!=e&&this.setAttribute("cast-receiver",`${e}`)}get castSrc(){return this.getAttribute("cast-src")??this.querySelector("source")?.src??this.currentSrc}set castSrc(e){this.castSrc!=e&&this.setAttribute("cast-src",`${e}`)}get castContentType(){return this.getAttribute("cast-content-type")??void 0}set castContentType(e){this.setAttribute("cast-content-type",`${e}`)}get castStreamType(){return this.getAttribute("cast-stream-type")??this.streamType??void 0}set castStreamType(e){this.setAttribute("cast-stream-type",`${e}`)}get castCustomData(){return this.#C}set castCustomData(e){let t=typeof e;["object","undefined"].includes(t)?this.#C=e:console.error(`castCustomData must be nullish or an object but value was of type ${t}`)}get readyState(){if(this.#_)switch(this.#_.playerState){case chrome.cast.media.PlayerState.IDLE:return 0;case chrome.cast.media.PlayerState.BUFFERING:return 2;default:return 3}return super.readyState}get paused(){return this.#_?this.#_.isPaused:super.paused}get muted(){return this.#_?this.#_?.isMuted:super.muted}set muted(e){if(this.#_){(e&&!this.#_.isMuted||!e&&this.#_.isMuted)&&this.#_.controller?.muteOrUnmute();return}super.muted=e}get volume(){return this.#_?this.#_?.volumeLevel??1:super.volume}set volume(e){if(this.#_){this.#_.volumeLevel=+e,this.#_.controller?.setVolumeLevel();return}super.volume=e}get duration(){return this.#_&&this.#_?.isMediaLoaded?this.#_?.duration??NaN:super.duration}get currentTime(){return this.#_&&this.#_?.isMediaLoaded?this.#_?.currentTime??0:super.currentTime}set currentTime(e){if(this.#_){this.#_.currentTime=e,this.#_.controller?.seek();return}super.currentTime=e}};e.i(791205);var a3=e.i(7180),a4=e=>{throw TypeError(e)},a5=(e,t,i)=>t.has(e)||a4("Cannot "+i),a9=(e,t,i)=>(a5(e,t,"read from private field"),i?i.call(e):t.get(e)),a8=(e,t,i)=>t.has(e)?a4("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),a6=(e,t,i,a)=>(a5(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),a7=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends a7{});var re,rt,ri=class extends a7{},ra=class{constructor(e,t={}){a8(this,rt),a6(this,rt,null==t?void 0:t.detail)}get detail(){return a9(this,rt)}initCustomEvent(){}};rt=new WeakMap;var rr={document:{createElement:function(e,t){return new ri}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(ri)},CustomEvent:ra,EventTarget:a7,HTMLElement:ri,HTMLVideoElement:class extends a7{}},rn="u"<typeof window||void 0===globalThis.customElements,rs=rn?rr:globalThis;rn&&rr.document;var ro,rl=class extends a2((0,a3.MediaTracksMixin)(aW)){constructor(){super(...arguments),a8(this,ro)}get autoplay(){let e=this.getAttribute("autoplay");return null!==e&&(""===e||e)}set autoplay(e){e!==this.autoplay&&(e?this.setAttribute("autoplay","string"==typeof e?e:""):this.removeAttribute("autoplay"))}get muxCastCustomData(){return{mux:{playbackId:this.playbackId,minResolution:this.minResolution,maxResolution:this.maxResolution,renditionOrder:this.renditionOrder,customDomain:this.customDomain,tokens:{drm:this.drmToken},envKey:this.envKey,metadata:this.metadata,disableCookies:this.disableCookies,disableTracking:this.disableTracking,beaconCollectionDomain:this.beaconCollectionDomain,startTime:this.startTime,preferCmcd:this.preferCmcd}}}get castCustomData(){var e;return null!=(e=a9(this,ro))?e:this.muxCastCustomData}set castCustomData(e){a6(this,ro,e)}};ro=new WeakMap,rs.customElements.get("mux-video")||(rs.customElements.define("mux-video",rl),rs.MuxVideoElement=rl);let rd={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},ru={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},rc={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},rh=Object.entries(rc),rm=rh.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{}),rp=rh.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"}),rv=Object.entries(rp).reduce((e,[t,i])=>{let a=rm[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"}),rb=Object.entries(rm).reduce((e,[t,i])=>{let a=rp[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),rg={SUBTITLES:"subtitles",CAPTIONS:"captions",DESCRIPTIONS:"descriptions",CHAPTERS:"chapters",METADATA:"metadata"},rf={DISABLED:"disabled",HIDDEN:"hidden",SHOWING:"showing"},rE={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},ry={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},r_={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},rT={INLINE:"inline",FULLSCREEN:"fullscreen",PICTURE_IN_PICTURE:"picture-in-picture"};function rA(e){if(e){let{id:t,width:i,height:a}=e;return[t,i,a].filter(e=>null!=e).join(":")}}function rk(e){if(e){let[t,i,a]=e.split(":");return{id:t,width:+i,height:+a}}}function rw(e){if(e){let{id:t,kind:i,language:a,label:r}=e;return[t,i,a,r].filter(e=>null!=e).join(":")}}function rS(e){if(e){let[t,i,a,r]=e.split(":");return{id:t,kind:i,language:a,label:r}}}function rI(e){return"number"==typeof e&&!Number.isNaN(e)&&Number.isFinite(e)}function rC(e){return"string"==typeof e&&!isNaN(e)&&!isNaN(parseFloat(e))}e.s(["AttributeToStateChangeEventMap",0,rb,"AvailabilityStates",0,ry,"MediaStateChangeEvents",0,rp,"MediaStateReceiverAttributes",0,ru,"MediaUIAttributes",0,rm,"MediaUIEvents",0,rd,"MediaUIProps",0,rc,"PointerTypes",0,rE,"ReadyStates",0,{HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},"StateChangeEventToAttributeMap",0,rv,"StreamTypes",0,r_,"TextTrackKinds",0,rg,"TextTrackModes",0,rf,"VolumeLevels",0,{HIGH:"high",MEDIUM:"medium",LOW:"low",OFF:"off"},"WebkitPresentationModes",0,rT],992617),e.i(992617);let rR=e=>new Promise(t=>setTimeout(t,e)),rL=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],rM=e=>{if(!rI(e))return"";let t=Math.abs(e),i=t!==e,a=new Date(0,0,0,0,0,t,0),r=[a.getHours(),a.getMinutes(),a.getSeconds()].map((e,t)=>{let i;return e&&(i=1===e?rL[t].singular:rL[t].plural,`${e} ${i}`)}).filter(e=>e).join(", ");return`${r}${i?" remaining":""}`};function rx(e,t){let i=!1;e<0&&(i=!0,e=0-e);let a=Math.floor((e=e<0?0:e)%60),r=Math.floor(e/60%60),n=Math.floor(e/3600),s=Math.floor(t/60%60),o=Math.floor(t/3600);return(isNaN(e)||e===1/0)&&(n=r=a="0"),r=(((n=n>0||o>0?n+":":"")||s>=10)&&r<10?"0"+r:r)+":",(i?"-":"")+n+r+(a=a<10?"0"+a:a)}let rD=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});e.s(["emptyTimeRanges",0,rD,"formatAsTimePhrase",0,rM,"formatTime",0,rx,"serializeTimeRanges",0,function(e=rD){return Array.from(e).map((t,i)=>[Number(e.start(i).toFixed(3)),Number(e.end(i).toFixed(3))].join(":")).join(" ")}],538333),e.i(538333);let rP={en:{"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it."}},rO=(null==(uk=globalThis.navigator)?void 0:uk.language)||"en",rN=(e,t={})=>(e=>{var t,i,a;let[r]=rO.split("-");return(null==(t=rP[rO])?void 0:t[e])||(null==(i=rP[r])?void 0:i[e])||(null==(a=rP.en)?void 0:a[e])||e})(e).replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):`{${i}}`);class rU{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}class rH extends rU{}class rB extends rH{constructor(){super(...arguments),this.role=null}}let rW={createElement:function(){return new r$.HTMLElement},createElementNS:function(){return new r$.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent:e=>!1},r$={ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},document:rW,Node:rH,Element:rB,HTMLElement:class extends rB{constructor(){super(...arguments),this.innerHTML=""}get content(){return new r$.DocumentFragment}},DocumentFragment:class extends rU{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem:e=>null,setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia:e=>({matches:!1,media:e}),DOMParser:class{parseFromString(e,t){return{body:{textContent:e}}}}},rq="global"in globalThis&&(null==globalThis?void 0:globalThis.global)===globalThis||"u"<typeof window||void 0===window.customElements,rV=Object.keys(r$).every(e=>e in globalThis),rF=rq&&!rV?r$:globalThis,rK=rq&&!rV?rW:globalThis.document,rj=new WeakMap,rY=e=>{let t=rj.get(e);return t||rj.set(e,t=new Set),t},rG=new rF.ResizeObserver(e=>{for(let t of e)for(let e of rY(t.target))e(t)});function rQ(e,t){rY(e).add(t),rG.observe(e)}function rz(e,t){let i=rY(e);i.delete(t),i.size||rG.unobserve(e)}function rZ(e){let t={};for(let i of e)t[i.name]=i.value;return t}function rX(e){var t;return null!=(t=rJ(e))?t:r3(e,"media-controller")}function rJ(e){var t;let{MEDIA_CONTROLLER:i}=ru,a=e.getAttribute(i);if(a)return null==(t=r5(e))?void 0:t.getElementById(a)}let r0=(e,t,i=".value")=>{let a=e.querySelector(i);a&&(a.textContent=t)},r1=(e,t)=>{let i,a;return(i=`slot[name="${t}"]`,!(a=e.shadowRoot.querySelector(i))?[]:a.children)[0]},r2=(e,t)=>!!e&&!!t&&(null!=e&&!!e.contains(t)||r2(e,t.getRootNode().host)),r3=(e,t)=>{if(!e)return null;let i=e.closest(t);return i||r3(e.getRootNode().host,t)};function r4(e=document){var t;let i=null==e?void 0:e.activeElement;return i?null!=(t=r4(i.shadowRoot))?t:i:null}function r5(e){var t;let i=null==(t=null==e?void 0:e.getRootNode)?void 0:t.call(e);return i instanceof ShadowRoot||i instanceof Document?i:null}function r9(e,{depth:t=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(e.checkVisibility)return e.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=e;for(;r&&t>0;){let e=getComputedStyle(r);if(i&&"0"===e.opacity||a&&"hidden"===e.visibility||"none"===e.display)return!1;r=r.parentElement,t--}return!0}function r8(e,t){let i=function(e,t){var i,a;let r;for(r of null!=(i=e.querySelectorAll("style:not([media])"))?i:[]){let e;try{e=null==(a=r.sheet)?void 0:a.cssRules}catch{continue}for(let i of null!=e?e:[])if(t(i.selectorText))return i}}(e,e=>e===t);return i||r6(e,t)}function r6(e,t){var i,a;let r=null!=(i=e.querySelectorAll("style:not([media])"))?i:[],n=null==r?void 0:r[r.length-1];return(null==n?void 0:n.sheet)?(null==n||n.sheet.insertRule(`${t}{}`,n.sheet.cssRules.length),null==(a=n.sheet.cssRules)?void 0:a[n.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",e),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function r7(e,t,i=NaN){let a=e.getAttribute(t);return null!=a?+a:i}function ne(e,t,i){let a=+i;if(null==i||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}r7(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function nt(e,t){return e.hasAttribute(t)}function ni(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}nt(e,t)!=i&&e.toggleAttribute(t,i)}function na(e,t,i=null){var a;return null!=(a=e.getAttribute(t))?a:i}function nr(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;na(e,t,void 0)!==a&&e.setAttribute(t,a)}var nn=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ns=(e,t,i)=>(nn(e,t,"read from private field"),i?i.call(e):t.get(e)),no=(e,t,i,a)=>(nn(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class nl extends rF.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,uw,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[ru.MEDIA_CONTROLLER,rm.MEDIA_PAUSED]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===ru.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ns(this,uw))?void 0:a.unassociateElement)||r.call(a,this),no(this,uw,null)),i&&this.isConnected&&(no(this,uw,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=ns(this,uw))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i,a,r,n;let s;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),no(this,uw,(r=this,(s=r.getAttribute(ru.MEDIA_CONTROLLER))?null==(n=r.getRootNode())?void 0:n.getElementById(s):r3(r,"media-controller"))),this.getAttribute(ru.MEDIA_CONTROLLER)&&(null==(t=null==(e=ns(this,uw))?void 0:e.associateElement)||t.call(e,this)),null==(i=ns(this,uw))||i.addEventListener("pointerdown",this),null==(a=ns(this,uw))||a.addEventListener("click",this)}disconnectedCallback(){var e,t,i,a;this.getAttribute(ru.MEDIA_CONTROLLER)&&(null==(t=null==(e=ns(this,uw))?void 0:e.unassociateElement)||t.call(e,this)),null==(i=ns(this,uw))||i.removeEventListener("pointerdown",this),null==(a=ns(this,uw))||a.removeEventListener("click",this),no(this,uw,null)}handleEvent(e){var t;let i=null==(t=e.composedPath())?void 0:t[0];if(["video","media-controller"].includes(null==i?void 0:i.localName)){if("pointerdown"===e.type)this._pointerType=e.pointerType;else if("click"===e.type){let{clientX:t,clientY:i}=e,{left:a,top:r,width:n,height:s}=this.getBoundingClientRect(),o=t-a,l=i-r;if(o<0||l<0||o>n||l>s||0===n&&0===s)return;let d=this._pointerType||"mouse";if(this._pointerType=void 0,d===rE.TOUCH)return void this.handleTap(e);if(d===rE.MOUSE||d===rE.PEN)return void this.handleMouseClick(e)}}}get mediaPaused(){return nt(this,rm.MEDIA_PAUSED)}set mediaPaused(e){ni(this,rm.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let t=this.mediaPaused?rd.MEDIA_PLAY_REQUEST:rd.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new rF.CustomEvent(t,{composed:!0,bubbles:!0}))}}uw=new WeakMap,nl.shadowRootOptions={mode:"open"},nl.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `},rF.customElements.get("media-gesture-receiver")||rF.customElements.define("media-gesture-receiver",nl);var nd=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nu=(e,t,i)=>(nd(e,t,"read from private field"),i?i.call(e):t.get(e)),nc=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},nh=(e,t,i,a)=>(nd(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),nm=(e,t,i)=>(nd(e,t,"access private method"),i);let np="audio",nv="autohide",nb="breakpoints",ng="gesturesdisabled",nf="keyboardcontrol",nE="noautohide",ny="userinactive",n_="autohideovercontrols",nT=Object.values(rm);function nA(e,t){var i,a,r;if(!e.isConnected)return;let n=Object.fromEntries((null!=(i=e.getAttribute(nb))?i:"sm:384 md:576 lg:768 xl:960").split(/\s+/).map(e=>e.split(":"))),s=(a=n,r=t,Object.keys(a).filter(e=>r>=parseInt(a[e]))),o=!1;if(Object.keys(n).forEach(t=>{if(s.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,""),o=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),o=!0)}),o){let t=new CustomEvent(rp.BREAKPOINTS_CHANGE,{detail:s});e.dispatchEvent(t)}e.breakpointsComputed||(e.breakpointsComputed=!0,e.dispatchEvent(new CustomEvent(rp.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}class nk extends rF.HTMLElement{constructor(){if(super(),nc(this,uM),nc(this,uO),nc(this,uU),nc(this,uB),nc(this,u$),nc(this,uV),nc(this,uS,0),nc(this,uI,null),nc(this,uC,null),nc(this,uR,void 0),this.breakpointsComputed=!1,nc(this,uL,new MutationObserver(nm(this,uM,ux).bind(this))),nc(this,uD,!1),nc(this,uP,e=>{nu(this,uD)||(setTimeout(()=>{nA(e.target,e.contentRect.width),nh(this,uD,!1)},0),nh(this,uD,!0))}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}const e=this.querySelector(":scope > slot[slot=media]");e&&e.addEventListener("slotchange",()=>{if(!e.assignedElements({flatten:!0}).length){nu(this,uI)&&this.mediaUnsetCallback(nu(this,uI));return}this.handleMediaUpdated(this.media)})}static get observedAttributes(){return[nv,ng].concat(nT).filter(e=>![rm.MEDIA_RENDITION_LIST,rm.MEDIA_AUDIO_TRACK_LIST,rm.MEDIA_CHAPTERS_CUES,rm.MEDIA_WIDTH,rm.MEDIA_HEIGHT,rm.MEDIA_ERROR,rm.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,t,i){e.toLowerCase()==nv&&(this.autohide=i)}get media(){let e=this.querySelector(":scope > [slot=media]");return(null==e?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(nh(this,uI,e),e.localName.includes("-")&&await rF.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;nu(this,uL).observe(this,{childList:!0,subtree:!0}),rQ(this,nu(this,uP));let t=null!=this.getAttribute(np)?rN("audio player"):rN("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",t),this.handleMediaUpdated(this.media),this.setAttribute(ny,""),nA(this,this.getBoundingClientRect().width),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),null==(e=rF.window)||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;nu(this,uL).disconnect(),rz(this,nu(this,uP)),this.media&&this.mediaUnsetCallback(this.media),null==(e=rF.window)||e.removeEventListener("mouseup",this)}mediaSetCallback(e){}mediaUnsetCallback(e){nh(this,uI,null)}handleEvent(e){switch(e.type){case"pointerdown":nh(this,uS,e.timeStamp);break;case"pointermove":nm(this,uO,uN).call(this,e);break;case"pointerup":nm(this,uU,uH).call(this,e);break;case"mouseleave":nm(this,uB,uW).call(this);break;case"mouseup":this.removeAttribute(nf);break;case"keyup":nm(this,uV,uF).call(this),this.setAttribute(nf,"")}}set autohide(e){let t=Number(e);nh(this,uR,isNaN(t)?0:t)}get autohide(){return(void 0===nu(this,uR)?2:nu(this,uR)).toString()}get breakpoints(){return na(this,nb)}set breakpoints(e){nr(this,nb,e)}get audio(){return nt(this,np)}set audio(e){ni(this,np,e)}get gesturesDisabled(){return nt(this,ng)}set gesturesDisabled(e){ni(this,ng,e)}get keyboardControl(){return nt(this,nf)}set keyboardControl(e){ni(this,nf,e)}get noAutohide(){return nt(this,nE)}set noAutohide(e){ni(this,nE,e)}get autohideOverControls(){return nt(this,n_)}set autohideOverControls(e){ni(this,n_,e)}get userInteractive(){return nt(this,ny)}set userInteractive(e){ni(this,ny,e)}}uS=new WeakMap,uI=new WeakMap,uC=new WeakMap,uR=new WeakMap,uL=new WeakMap,uM=new WeakSet,ux=function(e){let t=this.media;for(let i of e)if("childList"===i.type){for(let e of i.removedNodes){if("media"!=e.slot||i.target!=this)continue;let a=i.previousSibling&&i.previousSibling.previousElementSibling;if(a&&t){let t="media"!==a.slot;for(;null!==(a=a.previousSibling);)"media"==a.slot&&(t=!1);t&&this.mediaUnsetCallback(e)}else this.mediaUnsetCallback(e)}if(t)for(let e of i.addedNodes)e===t&&this.handleMediaUpdated(t)}},uD=new WeakMap,uP=new WeakMap,uO=new WeakSet,uN=function(e){if("mouse"!==e.pointerType&&e.timeStamp-nu(this,uS)<250)return;nm(this,u$,uq).call(this),clearTimeout(nu(this,uC));let t=this.hasAttribute(n_);([this,this.media].includes(e.target)||t)&&nm(this,uV,uF).call(this)},uU=new WeakSet,uH=function(e){if("touch"===e.pointerType){let t=!this.hasAttribute(ny);[this,this.media].includes(e.target)&&t?nm(this,uB,uW).call(this):nm(this,uV,uF).call(this)}else e.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(null==e?void 0:e.localName))&&nm(this,uV,uF).call(this)},uB=new WeakSet,uW=function(){if(0>nu(this,uR)||this.hasAttribute(ny))return;this.setAttribute(ny,"");let e=new rF.CustomEvent(rp.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},u$=new WeakSet,uq=function(){if(!this.hasAttribute(ny))return;this.removeAttribute(ny);let e=new rF.CustomEvent(rp.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},uV=new WeakSet,uF=function(){nm(this,u$,uq).call(this),clearTimeout(nu(this,uC));let e=parseInt(this.autohide);e<0||nh(this,uC,setTimeout(()=>{nm(this,uB,uW).call(this)},1e3*e))},nk.shadowRootOptions={mode:"open"},nk.getTemplateHTML=function(e){return`
    <style>
      
      :host([${rm.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${np}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${np}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${np}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${np}])[${ng}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${np}])[${ng}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${np}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${np}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${np}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${np}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${nE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${ny}]:not([${rm.MEDIA_PAUSED}]):not([${rm.MEDIA_IS_AIRPLAYING}]):not([${rm.MEDIA_IS_CASTING}]):not([${np}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${nE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${ny}]:not([${nE}]):not([${rm.MEDIA_PAUSED}]):not([${rm.MEDIA_IS_CASTING}]):not([${np}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${ny}][${n_}]:not([${nE}]):not([${rm.MEDIA_PAUSED}]):not([${rm.MEDIA_IS_CASTING}]):not([${np}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${np}])[${rm.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${nl.shadowRootOptions.mode}">
          ${nl.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `},rF.customElements.get("media-container")||rF.customElements.define("media-container",nk);var nw=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nS=(e,t,i)=>(nw(e,t,"read from private field"),i?i.call(e):t.get(e)),nI=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},nC=(e,t,i,a)=>(nw(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class nR{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){nI(this,uQ),nI(this,uK,void 0),nI(this,uj,void 0),nI(this,uY,void 0),nI(this,uG,new Set),nC(this,uK,e),nC(this,uj,t),nC(this,uY,new Set(i))}[Symbol.iterator](){return nS(this,uQ,uz).values()}get length(){return nS(this,uQ,uz).size}get value(){var e;return null!=(e=[...nS(this,uQ,uz)].join(" "))?e:""}set value(e){var t;e!==this.value&&(nC(this,uG,new Set),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return[...nS(this,uQ,uz)][e]}values(){return nS(this,uQ,uz).values()}forEach(e,t){nS(this,uQ,uz).forEach(e,t)}add(...e){var t,i;e.forEach(e=>nS(this,uG).add(e)),(""!==this.value||(null==(t=nS(this,uK))?void 0:t.hasAttribute(`${nS(this,uj)}`)))&&(null==(i=nS(this,uK))||i.setAttribute(`${nS(this,uj)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>nS(this,uG).delete(e)),null==(t=nS(this,uK))||t.setAttribute(`${nS(this,uj)}`,`${this.value}`)}contains(e){return nS(this,uQ,uz).has(e)}toggle(e,t){if(void 0!==t)if(t)return this.add(e),!0;else return this.remove(e),!1;return this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}}uK=new WeakMap,uj=new WeakMap,uY=new WeakMap,uG=new WeakMap,uQ=new WeakSet,uz=function(){return nS(this,uG).size?nS(this,uG):nS(this,uY)};let nL=(e="")=>{let[t,i,a]=e.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:"cc"===t?rg.CAPTIONS:rg.SUBTITLES,language:i,label:r}},nM=(e="",t={})=>((e="")=>e.split(/\s+/))(e).map(e=>{let i=nL(e);return{...t,...i}}),nx=e=>e?Array.isArray(e)?e.map(e=>"string"==typeof e?nL(e):e):"string"==typeof e?nM(e):[e]:[],nD=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${"captions"===e?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,nP=(e=[])=>Array.prototype.map.call(e,nD).join(" "),nO=e=>{let t=Object.entries(e).map(([e,t])=>i=>i[e]===t);return e=>t.every(t=>t(e))},nN=(e,t=[],i=[])=>{let a=nx(i).map(nO);Array.from(t).filter(e=>a.some(t=>t(e))).forEach(t=>{t.mode=e})},nU=(e,t=()=>!0)=>{if(!(null==e?void 0:e.textTracks))return[];let i="function"==typeof t?t:nO(t);return Array.from(e.textTracks).filter(i)},nH=e=>{var t;return!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)||e.hasAttribute(rm.MEDIA_SUBTITLES_SHOWING)},nB="exitFullscreen"in rK?"exitFullscreen":"webkitExitFullscreen"in rK?"webkitExitFullscreen":"webkitCancelFullScreen"in rK?"webkitCancelFullScreen":void 0,nW="fullscreenElement"in rK?"fullscreenElement":"webkitFullscreenElement"in rK?"webkitFullscreenElement":void 0,n$="fullscreenEnabled"in rK?"fullscreenEnabled":"webkitFullscreenEnabled"in rK?"webkitFullscreenEnabled":void 0,nq=()=>{var e;return i||(i=null==(e=null==rK?void 0:rK.createElement)?void 0:e.call(rK,"video"))},nV=async(e=nq())=>{if(!e)return!1;let t=e.volume;e.volume=t/2+.1;let i=new AbortController,a=await Promise.race([nF(e,i.signal),nK(e,t)]);return i.abort(),a},nF=(e,t)=>new Promise(i=>{e.addEventListener("volumechange",()=>i(!0),{signal:t})}),nK=async(e,t)=>{for(let i=0;i<10;i++){if(e.volume===t)return!1;await rR(10)}return e.volume!==t},nj=/.*Version\/.*Safari\/.*/.test(rF.navigator.userAgent),nY=(e=nq())=>(!rF.matchMedia("(display-mode: standalone)").matches||!nj)&&"function"==typeof(null==e?void 0:e.requestPictureInPicture),nG=(e=nq())=>(e=>{let{documentElement:t,media:i}=e;return!!(null==t?void 0:t[n$])||i&&"webkitSupportsFullscreen"in i})({documentElement:rK,media:e}),nQ=nG(),nz=nY(),nZ=!!rF.WebKitPlaybackTargetAvailabilityEvent,nX=!!rF.chrome,nJ=e=>nU(e.media,e=>[rg.SUBTITLES,rg.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),n0=e=>nU(e.media,e=>e.mode===rf.SHOWING&&[rg.SUBTITLES,rg.CAPTIONS].includes(e.kind)),n1=(e,t)=>{let i=nJ(e),a=n0(e),r=!!a.length;if(i.length){if(!1===t||r&&!0!==t)nN(rf.DISABLED,i,a);else if(!0===t||!r&&!1!==t){let t=i[0],{options:r}=e;if(!(null==r?void 0:r.noSubtitlesLangPref)){let e=globalThis.localStorage.getItem("media-chrome-pref-subtitles-lang"),a=e?[e,...globalThis.navigator.languages]:globalThis.navigator.languages,r=i.filter(e=>a.some(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))).sort((e,t)=>a.findIndex(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))-a.findIndex(e=>t.language.toLowerCase().startsWith(e.split("-")[0])));r[0]&&(t=r[0])}let{language:n,label:s,kind:o}=t;nN(rf.DISABLED,i,a),nN(rf.SHOWING,i,[{language:n,label:s,kind:o}])}}},n2=(e,t)=>e===t||null!=e&&null!=t&&typeof e==typeof t&&(!!("number"==typeof e&&Number.isNaN(e)&&Number.isNaN(t))||"object"==typeof e&&(Array.isArray(e)?n3(e,t):Object.entries(e).every(([e,i])=>e in t&&n2(i,t[e])))),n3=(e,t)=>{let i=Array.isArray(e),a=Array.isArray(t);return i===a&&(!i&&!a||e.length===t.length&&e.every((e,i)=>n2(e,t[i])))},n4=Object.values(r_),n5=nV().then(e=>a=e),n9=async(...e)=>{await Promise.all(e.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof rF.HTMLElement))return;let t=e.localName;if(!t.includes("-"))return;let i=rF.customElements.get(t);i&&e instanceof i||(await rF.customElements.whenDefined(t),rF.customElements.upgrade(e))}))},n8=new rF.DOMParser,n6={mediaError:{get(e,t){let{media:i}=e;if((null==t?void 0:t.type)!=="playing")return null==i?void 0:i.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(e,t){var i;let{media:a}=e;if((null==t?void 0:t.type)!=="playing")return null==(i=null==a?void 0:a.error)?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(e,t){var i,a;let{media:r}=e;if((null==t?void 0:t.type)!=="playing")return null!=(a=null==(i=null==r?void 0:r.error)?void 0:i.message)?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoWidth)?t:0},mediaEvents:["resize"]},mediaHeight:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoHeight)?t:0},mediaEvents:["resize"]},mediaPaused:{get(e){var t;let{media:i}=e;return null==(t=null==i?void 0:i.paused)||t},set(e,t){var i;let{media:a}=t;a&&(e?a.pause():null==(i=a.play())||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(e,t){let{media:i}=e;return!!i&&(t?"playing"===t.type:!i.paused)},mediaEvents:["playing","emptied"]},mediaEnded:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.ended)&&t},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.playbackRate)?t:1},set(e,t){let{media:i}=t;!i||Number.isFinite(+e)&&(i.playbackRate=+e)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.muted)&&t},set(e,t){let{media:i,options:{noMutedPref:a}={}}=t;if(i){i.muted=e;try{let t=null!==rF.localStorage.getItem("media-chrome-pref-muted"),r=i.hasAttribute("muted");if(a){t&&rF.localStorage.removeItem("media-chrome-pref-muted");return}if(r&&!t)return;rF.localStorage.setItem("media-chrome-pref-muted",e?"true":"false")}catch(e){console.debug("Error setting muted pref",e)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noMutedPref:i}}=t,{media:a}=t;if(a&&!a.muted&&!i)try{let i="true"===rF.localStorage.getItem("media-chrome-pref-muted");n6.mediaMuted.set(i,t),e(i)}catch(e){console.debug("Error getting muted pref",e)}}]},mediaLoop:{get(e){let{media:t}=e;return null==t?void 0:t.loop},set(e,t){let{media:i}=t;i&&(i.loop=e)},mediaEvents:["medialooprequest"]},mediaVolume:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.volume)?t:1},set(e,t){let{media:i,options:{noVolumePref:a}={}}=t;if(i){try{null==e?rF.localStorage.removeItem("media-chrome-pref-volume"):i.hasAttribute("muted")||a||rF.localStorage.setItem("media-chrome-pref-volume",e.toString())}catch(e){console.debug("Error setting volume pref",e)}Number.isFinite(+e)&&(i.volume=+e)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noVolumePref:i}}=t;if(!i)try{let{media:i}=t;if(!i)return;let a=rF.localStorage.getItem("media-chrome-pref-volume");if(null==a)return;n6.mediaVolume.set(+a,t),e(+a)}catch(e){console.debug("Error getting volume pref",e)}}]},mediaVolumeLevel:{get(e){let{media:t}=e;return void 0===(null==t?void 0:t.volume)?"high":t.muted||0===t.volume?"off":t.volume<.5?"low":t.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.currentTime)?t:0},set(e,t){let{media:i}=t;i&&rI(e)&&(i.currentTime=e)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(e){let{media:t,options:{defaultDuration:i}={}}=e;return i&&(!t||!t.duration||Number.isNaN(t.duration)||!Number.isFinite(t.duration))?i:Number.isFinite(null==t?void 0:t.duration)?t.duration:NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(e){let{media:t}=e;return(null==t?void 0:t.readyState)<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(e){var t;let{media:i}=e;if(!(null==(t=null==i?void 0:i.seekable)?void 0:t.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(a||r)return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(e){var t;let{media:i}=e,a=null!=(t=null==i?void 0:i.buffered)?t:[];return Array.from(a).map((e,t)=>[Number(a.start(t).toFixed(3)),Number(a.end(t).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(e){let{media:t,options:{defaultStreamType:i}={}}=e,a=[r_.LIVE,r_.ON_DEMAND].includes(i)?i:void 0;if(!t)return a;let{streamType:r}=t;if(n4.includes(r))return r===r_.UNKNOWN?a:r;let n=t.duration;return n===1/0?r_.LIVE:Number.isFinite(n)?r_.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(e){let{media:t}=e;if(!t)return NaN;let{targetLiveWindow:i}=t,a=n6.mediaStreamType.get(e);return(null==i||Number.isNaN(i))&&a===r_.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(e){let{media:t,options:{liveEdgeOffset:i=10}={}}=e;if(!t)return!1;if("number"==typeof t.liveEdgeStart)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;if(n6.mediaStreamType.get(e)!==r_.LIVE)return!1;let a=t.seekable;if(!a)return!0;if(!a.length)return!1;let r=a.end(a.length-1)-i;return t.currentTime>=r},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get:e=>nJ(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get:e=>n0(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i,a;let{media:r,options:n}=t;if(!r)return;let s=e=>{var i;n.defaultSubtitles&&(e&&![rg.CAPTIONS,rg.SUBTITLES].includes(null==(i=null==e?void 0:e.track)?void 0:i.kind)||n1(t,!0))};return r.addEventListener("loadstart",s),null==(i=r.textTracks)||i.addEventListener("addtrack",s),null==(a=r.textTracks)||a.addEventListener("removetrack",s),()=>{var e,t;r.removeEventListener("loadstart",s),null==(e=r.textTracks)||e.removeEventListener("addtrack",s),null==(t=r.textTracks)||t.removeEventListener("removetrack",s)}}]},mediaChaptersCues:{get(e){var t;let{media:i}=e;if(!i)return[];let[a]=nU(i,{kind:rg.CHAPTERS});return Array.from(null!=(t=null==a?void 0:a.cues)?t:[]).map(({text:e,startTime:t,endTime:i})=>({text:e&&n8.parseFromString(e,"text/html").body.textContent||e,startTime:t,endTime:i}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),n=null==(i=a.shadowRoot)?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return null==r||r.addEventListener("load",e),null==n||n.addEventListener("load",e),()=>{null==r||r.removeEventListener("load",e),null==n||n.removeEventListener("load",e)}}]},mediaIsPip:{get(e){var t,i;let{media:a,documentElement:r}=e;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return!!(null==(t=a.localName)?void 0:t.includes("-"))&&r2(a,r.pictureInPictureElement);if(r.pictureInPictureElement.localName.includes("-")){let e=r.pictureInPictureElement.shadowRoot;for(;null==e?void 0:e.pictureInPictureElement;){if(e.pictureInPictureElement===a)return!0;e=null==(i=e.pictureInPictureElement)?void 0:i.shadowRoot}}return!1},set(e,t){let{media:i}=t;if(i)if(e){if(!rK.pictureInPictureEnabled)return void console.warn("MediaChrome: Picture-in-picture is not enabled");if(!i.requestPictureInPicture)return void console.warn("MediaChrome: The current media does not support picture-in-picture");let e=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(t=>{if(11===t.code){if(!i.src)return void console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");if(0===i.readyState&&"none"===i.preload){let t=()=>{i.removeEventListener("loadedmetadata",a),i.preload="none"},a=()=>{i.requestPictureInPicture().catch(e),t()};i.addEventListener("loadedmetadata",a),i.preload="metadata",setTimeout(()=>{0===i.readyState&&e(),t()},1e3)}else throw t}else throw t})}else rK.pictureInPictureElement&&rK.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.videoRenditions)?t:[]].map(e=>({...e}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(e){var t,i,a;let{media:r}=e;return null==(a=null==(i=null==r?void 0:r.videoRenditions)?void 0:i[null==(t=r.videoRenditions)?void 0:t.selectedIndex])?void 0:a.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.videoRenditions))return void console.warn("MediaController: Rendition selection not supported by this media.");let a=Array.prototype.findIndex.call(i.videoRenditions,t=>t.id==e);i.videoRenditions.selectedIndex!=a&&(i.videoRenditions.selectedIndex=a)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.audioTracks)?t:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(e){var t,i;let{media:a}=e;return null==(i=[...null!=(t=null==a?void 0:a.audioTracks)?t:[]].find(e=>e.enabled))?void 0:i.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.audioTracks))return void console.warn("MediaChrome: Audio track selection not supported by this media.");for(let t of i.audioTracks)t.enabled=e==t.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get:e=>(e=>{var t;let{media:i,documentElement:a,fullscreenElement:r=i}=e;if(!i||!a)return!1;let n=(e=>{let{documentElement:t,media:i}=e,a=null==t?void 0:t[nW];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===rT.FULLSCREEN?i:a})(e);if(!n)return!1;if(n===r||n===i)return!0;if(n.localName.includes("-")){let e=n.shadowRoot;if(!(nW in e))return r2(n,r);for(;null==e?void 0:e[nW];){if(e[nW]===r)return!0;e=null==(t=e[nW])?void 0:t.shadowRoot}}return!1})(e),set(e,t,i){var a;e?((e=>{var t;let{media:i,fullscreenElement:a}=e;try{let e=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(e){let i=null==(t=a[e])?void 0:t.call(a);if(i instanceof Promise)return i.catch(()=>{})}else(null==i?void 0:i.webkitEnterFullscreen)?i.webkitEnterFullscreen():(null==i?void 0:i.requestFullscreen)&&i.requestFullscreen()}catch(e){console.error(e)}})(t),i.detail&&(null==(a=t.media)||a.focus())):(e=>{var t;let{documentElement:i}=e;if(nB){let e=null==(t=null==i?void 0:i[nB])?void 0:t.call(i);if(e instanceof Promise)return e.catch(()=>{})}})(t)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(e){var t;let{media:i}=e;return!!(null==i?void 0:i.remote)&&(null==(t=i.remote)?void 0:t.state)!=="disconnected"&&!!i.remote.state},set(e,t){var i,a;let{media:r}=t;if(r&&(!e||(null==(i=r.remote)?void 0:i.state)==="disconnected")&&(e||(null==(a=r.remote)?void 0:a.state)==="connected")){if("function"!=typeof r.remote.prompt)return void console.warn("MediaChrome: Casting is not supported in this environment");r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get:()=>!1,set(e,t){let{media:i}=t;if(i){if(!(i.webkitShowPlaybackTargetPicker&&rF.WebKitPlaybackTargetAvailabilityEvent))return void console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(e){let{media:t}=e;if(!nQ||!nG(t))return ry.UNSUPPORTED}},mediaPipUnavailable:{get(e){let{media:t}=e;return nz&&nY(t)?(null==t?void 0:t.disablePictureInPicture)?ry.UNAVAILABLE:void 0:ry.UNSUPPORTED}},mediaVolumeUnavailable:{get(e){let{media:t}=e;if(!1===a||(null==t?void 0:t.volume)==void 0)return ry.UNSUPPORTED},stateOwnersUpdateHandlers:[e=>{null==a&&n5.then(t=>e(t?void 0:ry.UNSUPPORTED))}]},mediaCastUnavailable:{get(e,{availability:t="not-available"}={}){var i;let{media:a}=e;return nX&&(null==(i=null==a?void 0:a.remote)?void 0:i.state)?null!=t&&"available"!==t?ry.UNAVAILABLE:void 0:ry.UNSUPPORTED},stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaAirplayUnavailable:{get:(e,t)=>nZ?(null==t?void 0:t.availability)==="not-available"?ry.UNAVAILABLE:void 0:ry.UNSUPPORTED,mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaRenditionUnavailable:{get(e){var t;let{media:i}=e;return(null==i?void 0:i.videoRenditions)?(null==(t=i.videoRenditions)?void 0:t.length)?void 0:ry.UNAVAILABLE:ry.UNSUPPORTED},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(e){var t,i;let{media:a}=e;return(null==a?void 0:a.audioTracks)?(null!=(i=null==(t=a.audioTracks)?void 0:t.length)?i:0)<=1?ry.UNAVAILABLE:void 0:ry.UNSUPPORTED},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(e){let{options:{mediaLang:t}={}}=e;return null!=t?t:"en"}}},n7={[rd.MEDIA_PREVIEW_REQUEST](e,t,{detail:i}){var a,r,n;let s,o,{media:l}=t,d=null!=i?i:void 0;if(l&&null!=d){let[e]=nU(l,{kind:rg.METADATA,label:"thumbnails"}),t=Array.prototype.find.call(null!=(a=null==e?void 0:e.cues)?a:[],(e,t,i)=>0===t?e.endTime>d:t===i.length-1?e.startTime<=d:e.startTime<=d&&e.endTime>d);if(t){let e=/'^(?:[a-z]+:)?\/\//i.test(t.text)||null==(r=null==l?void 0:l.querySelector('track[label="thumbnails"]'))?void 0:r.src,i=new URL(t.text,e);o=new URLSearchParams(i.hash).get("#xywh").split(",").map(e=>+e),s=i.href}}let u=e.mediaDuration.get(t),c=null==(n=e.mediaChaptersCues.get(t).find((e,t,i)=>t===i.length-1&&u===e.endTime?e.startTime<=d&&e.endTime>=d:e.startTime<=d&&e.endTime>d))?void 0:n.text;return null!=i&&null==c&&(c=""),{mediaPreviewTime:d,mediaPreviewImage:s,mediaPreviewCoords:o,mediaPreviewChapter:c}},[rd.MEDIA_PAUSE_REQUEST](e,t){e.mediaPaused.set(!0,t)},[rd.MEDIA_PLAY_REQUEST](e,t){var i,a,r,n;let s=e.mediaStreamType.get(t)===r_.LIVE,o=!(null==(i=t.options)?void 0:i.noAutoSeekToLive),l=e.mediaTargetLiveWindow.get(t)>0;if(s&&o&&!l){let i=null==(a=e.mediaSeekable.get(t))?void 0:a[1];if(i){let a=null!=(n=null==(r=t.options)?void 0:r.seekToLiveOffset)?n:0;e.mediaCurrentTime.set(i-a,t)}}e.mediaPaused.set(!1,t)},[rd.MEDIA_PLAYBACK_RATE_REQUEST](e,t,{detail:i}){e.mediaPlaybackRate.set(i,t)},[rd.MEDIA_MUTE_REQUEST](e,t){e.mediaMuted.set(!0,t)},[rd.MEDIA_UNMUTE_REQUEST](e,t){e.mediaVolume.get(t)||e.mediaVolume.set(.25,t),e.mediaMuted.set(!1,t)},[rd.MEDIA_LOOP_REQUEST](e,t,{detail:i}){let a=!!i;return e.mediaLoop.set(a,t),{mediaLoop:a}},[rd.MEDIA_VOLUME_REQUEST](e,t,{detail:i}){i&&e.mediaMuted.get(t)&&e.mediaMuted.set(!1,t),e.mediaVolume.set(i,t)},[rd.MEDIA_SEEK_REQUEST](e,t,{detail:i}){e.mediaCurrentTime.set(i,t)},[rd.MEDIA_SEEK_TO_LIVE_REQUEST](e,t){var i,a,r;let n=null==(i=e.mediaSeekable.get(t))?void 0:i[1];if(Number.isNaN(Number(n)))return;let s=null!=(r=null==(a=t.options)?void 0:a.seekToLiveOffset)?r:0;e.mediaCurrentTime.set(n-s,t)},[rd.MEDIA_SHOW_SUBTITLES_REQUEST](e,t,{detail:i}){var a;let{options:r}=t,n=nJ(t),s=nx(i),o=null==(a=s[0])?void 0:a.language;o&&!r.noSubtitlesLangPref&&rF.localStorage.setItem("media-chrome-pref-subtitles-lang",o),nN(rf.SHOWING,n,s)},[rd.MEDIA_DISABLE_SUBTITLES_REQUEST](e,t,{detail:i}){let a=nJ(t);nN(rf.DISABLED,a,null!=i?i:[])},[rd.MEDIA_TOGGLE_SUBTITLES_REQUEST](e,t,{detail:i}){n1(t,i)},[rd.MEDIA_RENDITION_REQUEST](e,t,{detail:i}){e.mediaRenditionSelected.set(i,t)},[rd.MEDIA_AUDIO_TRACK_REQUEST](e,t,{detail:i}){e.mediaAudioTrackEnabled.set(i,t)},[rd.MEDIA_ENTER_PIP_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsPip.set(!0,t)},[rd.MEDIA_EXIT_PIP_REQUEST](e,t){e.mediaIsPip.set(!1,t)},[rd.MEDIA_ENTER_FULLSCREEN_REQUEST](e,t,i){e.mediaIsPip.get(t)&&e.mediaIsPip.set(!1,t),e.mediaIsFullscreen.set(!0,t,i)},[rd.MEDIA_EXIT_FULLSCREEN_REQUEST](e,t){e.mediaIsFullscreen.set(!1,t)},[rd.MEDIA_ENTER_CAST_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsCasting.set(!0,t)},[rd.MEDIA_EXIT_CAST_REQUEST](e,t){e.mediaIsCasting.set(!1,t)},[rd.MEDIA_AIRPLAY_REQUEST](e,t){e.mediaIsAirplaying.set(!0,t)}};var se=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},st=(e,t,i)=>(se(e,t,"read from private field"),i?i.call(e):t.get(e)),si=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sa=(e,t,i,a)=>(se(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sr=(e,t,i)=>(se(e,t,"access private method"),i);let sn=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],ss="defaultsubtitles",so="defaultstreamtype",sl="defaultduration",sd="fullscreenelement",su="hotkeys",sc="keyboardbackwardseekoffset",sh="keyboardforwardseekoffset",sm="keyboarddownvolumestep",sp="keyboardupvolumestep",sv="keysused",sb="lang",sg="loop",sf="liveedgeoffset",sE="noautoseektolive",sy="nodefaultstore",s_="nohotkeys",sT="nomutedpref",sA="nosubtitleslangpref",sk="novolumepref",sw="seektoliveoffset";class sS extends nk{constructor(){super(),si(this,u5),si(this,u8),si(this,u7),si(this,ct),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,si(this,uZ,new nR(this,su)),si(this,uX,void 0),si(this,uJ,void 0),si(this,u0,null),si(this,u1,void 0),si(this,u2,void 0),si(this,u3,e=>{var t;null==(t=st(this,uJ))||t.dispatch(e)}),si(this,u4,void 0),this.associateElement(this);let e={};sa(this,u1,t=>{Object.entries(t).forEach(([t,i])=>{if(t in e&&e[t]===i)return;this.propagateMediaState(t,i);let a=t.toLowerCase(),r=new rF.CustomEvent(rb[a],{composed:!0,detail:i});this.dispatchEvent(r)}),e=t}),this.hasAttribute(s_)?this.disableHotkeys():this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(s_,su,so,ss,sl,sT,sk,sb,sg)}get mediaStore(){return st(this,uJ)}set mediaStore(e){var t,i;(st(this,uJ)&&(null==(t=st(this,u2))||t.call(this),sa(this,u2,void 0)),sa(this,uJ,e),st(this,uJ)||this.hasAttribute(sy))?sa(this,u2,null==(i=st(this,uJ))?void 0:i.subscribe(st(this,u1))):sr(this,u5,u9).call(this)}get fullscreenElement(){var e;return null!=(e=st(this,uX))?e:this}set fullscreenElement(e){var t;this.hasAttribute(sd)&&this.removeAttribute(sd),sa(this,uX,e),null==(t=st(this,uJ))||t.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return nt(this,ss)}set defaultSubtitles(e){ni(this,ss,e)}get defaultStreamType(){return na(this,so)}set defaultStreamType(e){nr(this,so,e)}get defaultDuration(){return r7(this,sl)}set defaultDuration(e){ne(this,sl,e)}get noHotkeys(){return nt(this,s_)}set noHotkeys(e){ni(this,s_,e)}get keysUsed(){return na(this,sv)}set keysUsed(e){nr(this,sv,e)}get liveEdgeOffset(){return r7(this,sf)}set liveEdgeOffset(e){ne(this,sf,e)}get noAutoSeekToLive(){return nt(this,sE)}set noAutoSeekToLive(e){ni(this,sE,e)}get noVolumePref(){return nt(this,sk)}set noVolumePref(e){ni(this,sk,e)}get noMutedPref(){return nt(this,sT)}set noMutedPref(e){ni(this,sT,e)}get noSubtitlesLangPref(){return nt(this,sA)}set noSubtitlesLangPref(e){ni(this,sA,e)}get noDefaultStore(){return nt(this,sy)}set noDefaultStore(e){ni(this,sy,e)}attributeChangedCallback(e,t,i){var a,r,n,s,o,l,d,u,c,h,m,v;if(super.attributeChangedCallback(e,t,i),e===s_)i!==t&&""===i?(this.hasAttribute(su)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):i!==t&&null===i&&this.enableHotkeys();else if(e===su)st(this,uZ).value=i;else if(e===ss&&i!==t)null==(a=st(this,uJ))||a.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(ss)}});else if(e===so)null==(n=st(this,uJ))||n.dispatch({type:"optionschangerequest",detail:{defaultStreamType:null!=(r=this.getAttribute(so))?r:void 0}});else if(e===sf)null==(s=st(this,uJ))||s.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(sf)?+this.getAttribute(sf):void 0,seekToLiveOffset:this.hasAttribute(sw)?void 0:+this.getAttribute(sf)}});else if(e===sw)null==(o=st(this,uJ))||o.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(sw)?+this.getAttribute(sw):void 0}});else if(e===sE)null==(l=st(this,uJ))||l.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(sE)}});else if(e===sd){let e=i?null==(d=this.getRootNode())?void 0:d.getElementById(i):void 0;sa(this,uX,e),null==(u=st(this,uJ))||u.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===sb&&i!==t?(rO=i,null==(c=st(this,uJ))||c.dispatch({type:"optionschangerequest",detail:{mediaLang:i}})):e===sg&&i!==t?null==(h=st(this,uJ))||h.dispatch({type:rd.MEDIA_LOOP_REQUEST,detail:null!=i}):e===sk&&i!==t?null==(m=st(this,uJ))||m.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(sk)}}):e===sT&&i!==t&&(null==(v=st(this,uJ))||v.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(sT)}}))}connectedCallback(){var e,t;st(this,uJ)||this.hasAttribute(sy)||sr(this,u5,u9).call(this),null==(e=st(this,uJ))||e.dispatch({type:"documentelementchangerequest",detail:rK}),super.connectedCallback(),st(this,uJ)&&!st(this,u2)&&sa(this,u2,null==(t=st(this,uJ))?void 0:t.subscribe(st(this,u1))),void 0!==st(this,u4)&&st(this,uJ)&&this.media&&setTimeout(()=>{var e,t,i;(null==(t=null==(e=this.media)?void 0:e.textTracks)?void 0:t.length)&&(null==(i=st(this,uJ))||i.dispatch({type:rd.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:st(this,u4)}))},0),this.hasAttribute(s_)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,t,i,a,r;if(null==(e=super.disconnectedCallback)||e.call(this),st(this,uJ)){let e=st(this,uJ).getState();sa(this,u4,!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)),null==(i=st(this,uJ))||i.dispatch({type:"documentelementchangerequest",detail:void 0}),null==(a=st(this,uJ))||a.dispatch({type:rd.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}st(this,u2)&&(null==(r=st(this,u2))||r.call(this),sa(this,u2,void 0))}mediaSetCallback(e){var t;super.mediaSetCallback(e),null==(t=st(this,uJ))||t.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var t;super.mediaUnsetCallback(e),null==(t=st(this,uJ))||t.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,t){sO(this.mediaStateReceivers,e,t)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(t.has(e))return;let i=sN(e,this.registerMediaStateReceiver.bind(this),this.unregisterMediaStateReceiver.bind(this));Object.values(rd).forEach(t=>{e.addEventListener(t,st(this,u3))}),t.set(e,i)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;t.has(e)&&(t.get(e)(),t.delete(e),Object.values(rd).forEach(t=>{e.removeEventListener(t,st(this,u3))}))}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers;!(t.indexOf(e)>-1)&&(t.push(e),st(this,uJ)&&Object.entries(st(this,uJ).getState()).forEach(([t,i])=>{sO([e],t,i)}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,i=t.indexOf(e);i<0||t.splice(i,1)}enableHotkeys(){this.addEventListener("keydown",sr(this,u7,ce))}disableHotkeys(){this.removeEventListener("keydown",sr(this,u7,ce)),this.removeEventListener("keyup",sr(this,u8,u6))}get hotkeys(){return na(this,su)}set hotkeys(e){nr(this,su,e)}keyboardShortcutHandler(e){var t,i,a,r,n,s,o,l,d;let u,c,h,m=e.target;if(!((null!=(a=null!=(i=null==(t=m.getAttribute(sv))?void 0:t.split(" "))?i:null==m?void 0:m.keysUsed)?a:[]).map(e=>"Space"===e?" ":e).filter(Boolean).includes(e.key)||st(this,uZ).contains(`no${e.key.toLowerCase()}`)||" "===e.key&&st(this,uZ).contains("nospace"))&&!(e.shiftKey&&("/"===e.key||"?"===e.key)&&st(this,uZ).contains("noshift+/")))switch(e.key){case" ":case"k":u=st(this,uJ).getState().mediaPaused?rd.MEDIA_PLAY_REQUEST:rd.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new rF.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"m":u="off"===this.mediaStore.getState().mediaVolumeLevel?rd.MEDIA_UNMUTE_REQUEST:rd.MEDIA_MUTE_REQUEST,this.dispatchEvent(new rF.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"f":u=this.mediaStore.getState().mediaIsFullscreen?rd.MEDIA_EXIT_FULLSCREEN_REQUEST:rd.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new rF.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new rF.CustomEvent(rd.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{let e=this.hasAttribute(sc)?+this.getAttribute(sc):10;c=Math.max((null!=(r=this.mediaStore.getState().mediaCurrentTime)?r:0)-e,0),h=new rF.CustomEvent(rd.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:c}),this.dispatchEvent(h);break}case"ArrowRight":case"l":{let e=this.hasAttribute(sh)?+this.getAttribute(sh):10;c=Math.max((null!=(n=this.mediaStore.getState().mediaCurrentTime)?n:0)+e,0),h=new rF.CustomEvent(rd.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:c}),this.dispatchEvent(h);break}case"ArrowUp":{let e=this.hasAttribute(sp)?+this.getAttribute(sp):.025;c=Math.min((null!=(s=this.mediaStore.getState().mediaVolume)?s:1)+e,1),h=new rF.CustomEvent(rd.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:c}),this.dispatchEvent(h);break}case"ArrowDown":{let e=this.hasAttribute(sm)?+this.getAttribute(sm):.025;c=Math.max((null!=(o=this.mediaStore.getState().mediaVolume)?o:1)-e,0),h=new rF.CustomEvent(rd.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:c}),this.dispatchEvent(h);break}case"<":c=Math.max((null!=(l=this.mediaStore.getState().mediaPlaybackRate)?l:1)-.25,.25).toFixed(2),h=new rF.CustomEvent(rd.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:c}),this.dispatchEvent(h);break;case">":c=Math.min((null!=(d=this.mediaStore.getState().mediaPlaybackRate)?d:1)+.25,2).toFixed(2),h=new rF.CustomEvent(rd.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:c}),this.dispatchEvent(h);break;case"/":case"?":e.shiftKey&&sr(this,ct,ci).call(this);break;case"p":u=this.mediaStore.getState().mediaIsPip?rd.MEDIA_EXIT_PIP_REQUEST:rd.MEDIA_ENTER_PIP_REQUEST,h=new rF.CustomEvent(u,{composed:!0,bubbles:!0}),this.dispatchEvent(h)}}}uZ=new WeakMap,uX=new WeakMap,uJ=new WeakMap,u0=new WeakMap,u1=new WeakMap,u2=new WeakMap,u3=new WeakMap,u4=new WeakMap,u5=new WeakSet,u9=function(){var e;this.mediaStore=(({media:e,fullscreenElement:t,documentElement:i,stateMediator:a=n6,requestMap:r=n7,options:n={},monitorStateOwnersOnlyWithSubscriptions:s=!0})=>{let o,l=[],d={options:{...n}},u=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),c=e=>{void 0==e||n2(e,u)||(u=Object.freeze({...u,...e}),l.forEach(e=>e(u)))},h=()=>{c(Object.entries(a).reduce((e,[t,{get:i}])=>(e[t]=i(d),e),{}))},m={},v=async(e,t)=>{var i,r,n,u,v,b,g,f,E,y,_,T,A,k,w,S;let I=!!o;if(o={...d,...null!=o?o:{},...e},I)return;await n9(...Object.values(e));let C=l.length>0&&0===t&&s,R=d.media!==o.media,L=(null==(i=d.media)?void 0:i.textTracks)!==(null==(r=o.media)?void 0:r.textTracks),M=(null==(n=d.media)?void 0:n.videoRenditions)!==(null==(u=o.media)?void 0:u.videoRenditions),x=(null==(v=d.media)?void 0:v.audioTracks)!==(null==(b=o.media)?void 0:b.audioTracks),D=(null==(g=d.media)?void 0:g.remote)!==(null==(f=o.media)?void 0:f.remote),P=d.documentElement!==o.documentElement,O=!!d.media&&(R||C),N=!!(null==(E=d.media)?void 0:E.textTracks)&&(L||C),U=!!(null==(y=d.media)?void 0:y.videoRenditions)&&(M||C),H=!!(null==(_=d.media)?void 0:_.audioTracks)&&(x||C),B=!!(null==(T=d.media)?void 0:T.remote)&&(D||C),W=!!d.documentElement&&(P||C),$=O||N||U||H||B||W,q=0===l.length&&1===t&&s,V=!!o.media&&(R||q),F=!!(null==(A=o.media)?void 0:A.textTracks)&&(L||q),K=!!(null==(k=o.media)?void 0:k.videoRenditions)&&(M||q),j=!!(null==(w=o.media)?void 0:w.audioTracks)&&(x||q),Y=!!(null==(S=o.media)?void 0:S.remote)&&(D||q),G=!!o.documentElement&&(P||q),Q=V||F||K||j||Y||G;if(!($||Q)){Object.entries(o).forEach(([e,t])=>{d[e]=t}),h(),o=void 0;return}Object.entries(a).forEach(([e,{get:t,mediaEvents:i=[],textTracksEvents:a=[],videoRenditionsEvents:r=[],audioTracksEvents:n=[],remoteEvents:s=[],rootEvents:l=[],stateOwnersUpdateHandlers:u=[]}])=>{let h;m[e]||(m[e]={});let v=i=>{c({[e]:t(d,i)})};h=m[e].mediaEvents,i.forEach(t=>{h&&O&&(d.media.removeEventListener(t,h),m[e].mediaEvents=void 0),V&&(o.media.addEventListener(t,v),m[e].mediaEvents=v)}),h=m[e].textTracksEvents,a.forEach(t=>{var i,a;h&&N&&(null==(i=d.media.textTracks)||i.removeEventListener(t,h),m[e].textTracksEvents=void 0),F&&(null==(a=o.media.textTracks)||a.addEventListener(t,v),m[e].textTracksEvents=v)}),h=m[e].videoRenditionsEvents,r.forEach(t=>{var i,a;h&&U&&(null==(i=d.media.videoRenditions)||i.removeEventListener(t,h),m[e].videoRenditionsEvents=void 0),K&&(null==(a=o.media.videoRenditions)||a.addEventListener(t,v),m[e].videoRenditionsEvents=v)}),h=m[e].audioTracksEvents,n.forEach(t=>{var i,a;h&&H&&(null==(i=d.media.audioTracks)||i.removeEventListener(t,h),m[e].audioTracksEvents=void 0),j&&(null==(a=o.media.audioTracks)||a.addEventListener(t,v),m[e].audioTracksEvents=v)}),h=m[e].remoteEvents,s.forEach(t=>{var i,a;h&&B&&(null==(i=d.media.remote)||i.removeEventListener(t,h),m[e].remoteEvents=void 0),Y&&(null==(a=o.media.remote)||a.addEventListener(t,v),m[e].remoteEvents=v)}),h=m[e].rootEvents,l.forEach(t=>{h&&W&&(d.documentElement.removeEventListener(t,h),m[e].rootEvents=void 0),G&&(o.documentElement.addEventListener(t,v),m[e].rootEvents=v)});let b=m[e].stateOwnersUpdateHandlers;if(b&&$&&(Array.isArray(b)?b:[b]).forEach(e=>{"function"==typeof e&&e()}),Q){let t=u.map(e=>e(v,o)).filter(e=>"function"==typeof e);m[e].stateOwnersUpdateHandlers=1===t.length?t[0]:t}else $&&(m[e].stateOwnersUpdateHandlers=void 0)}),Object.entries(o).forEach(([e,t])=>{d[e]=t}),h(),o=void 0};return v({media:e,fullscreenElement:t,documentElement:i,options:n}),{dispatch(e){let{type:t,detail:i}=e;r[t]&&null==u.mediaErrorCode?c(r[t](a,d,e)):"mediaelementchangerequest"===t?v({media:i}):"fullscreenelementchangerequest"===t?v({fullscreenElement:i}):"documentelementchangerequest"===t?v({documentElement:i}):"optionschangerequest"===t&&(Object.entries(null!=i?i:{}).forEach(([e,t])=>{d.options[e]=t}),h())},getState:()=>u,subscribe:e=>(v({},l.length+1),l.push(e),e(u),()=>{let t=l.indexOf(e);t>=0&&(v({},l.length-1),l.splice(t,1))})}})({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(ss),defaultDuration:this.hasAttribute(sl)?+this.getAttribute(sl):void 0,defaultStreamType:null!=(e=this.getAttribute(so))?e:void 0,liveEdgeOffset:this.hasAttribute(sf)?+this.getAttribute(sf):void 0,seekToLiveOffset:this.hasAttribute(sw)?+this.getAttribute(sw):this.hasAttribute(sf)?+this.getAttribute(sf):void 0,noAutoSeekToLive:this.hasAttribute(sE),noVolumePref:this.hasAttribute(sk),noMutedPref:this.hasAttribute(sT),noSubtitlesLangPref:this.hasAttribute(sA)}})},u8=new WeakSet,u6=function(e){let{key:t,shiftKey:i}=e;i&&("/"===t||"?"===t)||sn.includes(t)?this.keyboardShortcutHandler(e):this.removeEventListener("keyup",sr(this,u8,u6))},u7=new WeakSet,ce=function(e){var t;let{metaKey:i,altKey:a,key:r,shiftKey:n}=e,s=n&&("/"===r||"?"===r);if(s&&(null==(t=st(this,u0))?void 0:t.open)||i||a||!s&&!sn.includes(r))return void this.removeEventListener("keyup",sr(this,u8,u6));let o=e.target,l=o instanceof HTMLElement&&("media-volume-range"===o.tagName.toLowerCase()||"media-time-range"===o.tagName.toLowerCase());![" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)||st(this,uZ).contains(`no${r.toLowerCase()}`)||" "===r&&st(this,uZ).contains("nospace")||l||e.preventDefault(),this.addEventListener("keyup",sr(this,u8,u6),{once:!0})},ct=new WeakSet,ci=function(){st(this,u0)||(sa(this,u0,rK.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(st(this,u0))),st(this,u0).open=!0};let sI=Object.values(rm),sC=Object.values(rc),sR=e=>{var t,i,a,r;let{observedAttributes:n}=e.constructor;!n&&(null==(t=e.nodeName)?void 0:t.includes("-"))&&(rF.customElements.upgrade(e),{observedAttributes:n}=e.constructor);let s=null==(r=null==(a=null==(i=null==e?void 0:e.getAttribute)?void 0:i.call(e,ru.MEDIA_CHROME_ATTRIBUTES))?void 0:a.split)?void 0:r.call(a,/\s+/);return Array.isArray(n||s)?(n||s).filter(e=>sI.includes(e)):[]},sL=e=>{var t,i;return(null==(t=e.nodeName)?void 0:t.includes("-"))&&rF.customElements.get(null==(i=e.nodeName)?void 0:i.toLowerCase())&&!(e instanceof rF.customElements.get(e.nodeName.toLowerCase()))&&rF.customElements.upgrade(e),sC.some(t=>t in e)||!!sR(e).length},sM=e=>{var t;return null==(t=null==e?void 0:e.join)?void 0:t.call(e,":")},sx={[rm.MEDIA_SUBTITLES_LIST]:nP,[rm.MEDIA_SUBTITLES_SHOWING]:nP,[rm.MEDIA_SEEKABLE]:sM,[rm.MEDIA_BUFFERED]:e=>null==e?void 0:e.map(sM).join(" "),[rm.MEDIA_PREVIEW_COORDS]:e=>null==e?void 0:e.join(" "),[rm.MEDIA_RENDITION_LIST]:function(e){return null==e?void 0:e.map(rA).join(" ")},[rm.MEDIA_AUDIO_TRACK_LIST]:function(e){return null==e?void 0:e.map(rw).join(" ")}},sD=async(e,t,i)=>{var a,r;if(e.isConnected||await rR(0),"boolean"==typeof i||null==i)return ni(e,t,i);if("number"==typeof i)return ne(e,t,i);if("string"==typeof i)return nr(e,t,i);if(Array.isArray(i)&&!i.length)return e.removeAttribute(t);let n=null!=(r=null==(a=sx[t])?void 0:a.call(sx,i))?r:i;return e.setAttribute(t,n)},sP=(e,t)=>{var i;if(null==(i=e.closest)?void 0:i.call(e,'*[slot="media"]'))return;let a=(e,t)=>{var i,a;sL(e)&&t(e);let{children:r=[]}=null!=e?e:{};[...r,...null!=(a=null==(i=null==e?void 0:e.shadowRoot)?void 0:i.children)?a:[]].forEach(e=>sP(e,t))},r=null==e?void 0:e.nodeName.toLowerCase();r.includes("-")&&!sL(e)?rF.customElements.whenDefined(r).then(()=>{a(e,t)}):a(e,t)},sO=(e,t,i)=>{e.forEach(e=>{if(t in e){e[t]=i;return}let a=sR(e),r=t.toLowerCase();a.includes(r)&&sD(e,r,i)})},sN=(e,t,i)=>{sP(e,t);let a=e=>{var i;t(null!=(i=null==e?void 0:e.composedPath()[0])?i:e.target)},r=e=>{var t;i(null!=(t=null==e?void 0:e.composedPath()[0])?t:e.target)};e.addEventListener(rd.REGISTER_MEDIA_STATE_RECEIVER,a),e.addEventListener(rd.UNREGISTER_MEDIA_STATE_RECEIVER,r);let n=[],s=e=>{let a=e.target;"media"!==a.name&&(n.forEach(e=>sP(e,i)),(n=[...a.assignedElements({flatten:!0})]).forEach(e=>sP(e,t)))};e.addEventListener("slotchange",s);let o=new MutationObserver(e=>{e.forEach(e=>{let{addedNodes:a=[],removedNodes:r=[],type:n,target:s,attributeName:o}=e;"childList"===n?(Array.prototype.forEach.call(a,e=>sP(e,t)),Array.prototype.forEach.call(r,e=>sP(e,i))):"attributes"===n&&o===ru.MEDIA_CHROME_ATTRIBUTES&&(sL(s)?t(s):i(s))})});return o.observe(e,{childList:!0,attributes:!0,subtree:!0}),()=>{sP(e,i),e.removeEventListener("slotchange",s),o.disconnect(),e.removeEventListener(rd.REGISTER_MEDIA_STATE_RECEIVER,a),e.removeEventListener(rd.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};rF.customElements.get("media-controller")||rF.customElements.define("media-controller",sS);let sU="placement",sH="bounds";class sB extends rF.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!r9(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let t=this.placement;if("left"===t||"right"===t)return void this.style.removeProperty("--media-tooltip-offset-x");let i=getComputedStyle(this),a=null!=(e=r3(this,"#"+this.bounds))?e:rX(this);if(!a)return;let{x:r,width:n}=a.getBoundingClientRect(),{x:s,width:o}=this.getBoundingClientRect(),l=i.getPropertyValue("--media-tooltip-offset-x"),d=l?parseFloat(l.replace("px","")):0,u=i.getPropertyValue("--media-tooltip-container-margin"),c=u?parseFloat(u.replace("px","")):0,h=s-r+d-c,m=s+o-(r+n)+d+c;h<0?this.style.setProperty("--media-tooltip-offset-x",`${h}px`):m>0?this.style.setProperty("--media-tooltip-offset-x",`${m}px`):this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){const e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[sU,sH]}get placement(){return na(this,sU)}set placement(e){nr(this,sU,e)}get bounds(){return na(this,sH)}set bounds(e){nr(this,sH,e)}}sB.shadowRootOptions={mode:"open"},sB.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `},rF.customElements.get("media-tooltip")||rF.customElements.define("media-tooltip",sB);var sW=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},s$=(e,t,i)=>(sW(e,t,"read from private field"),i?i.call(e):t.get(e)),sq=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sV=(e,t,i,a)=>(sW(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let sF="tooltipplacement",sK="disabled",sj="notooltip";class sY extends rF.HTMLElement{constructor(){if(super(),sq(this,cl),sq(this,ca,void 0),this.preventClick=!1,this.tooltipEl=null,sq(this,cr,e=>{this.preventClick||this.handleClick(e),setTimeout(s$(this,cn),0)}),sq(this,cn,()=>{var e,t;null==(t=null==(e=this.tooltipEl)?void 0:e.updateXOffset)||t.call(e)}),sq(this,cs,e=>{let{key:t}=e;this.keysUsed.includes(t)?this.preventClick||this.handleClick(e):this.removeEventListener("keyup",s$(this,cs))}),sq(this,co,e=>{let{metaKey:t,altKey:i,key:a}=e;t||i||!this.keysUsed.includes(a)?this.removeEventListener("keyup",s$(this,cs)):this.addEventListener("keyup",s$(this,cs),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",sF,ru.MEDIA_CONTROLLER,rm.MEDIA_LANG]}enable(){this.addEventListener("click",s$(this,cr)),this.addEventListener("keydown",s$(this,co)),this.tabIndex=0}disable(){this.removeEventListener("click",s$(this,cr)),this.removeEventListener("keydown",s$(this,co)),this.removeEventListener("keyup",s$(this,cs)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===ru.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=s$(this,ca))?void 0:a.unassociateElement)||r.call(a,this),sV(this,ca,null)),i&&this.isConnected&&(sV(this,ca,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=s$(this,ca))?void 0:s.associateElement)||o.call(s,this))):"disabled"===e&&i!==t?null==i?this.enable():this.disable():e===sF&&this.tooltipEl&&i!==t?this.tooltipEl.placement=i:e===rm.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),s$(this,cn).call(this)}connectedCallback(){var e,t,i;let{style:a}=r8(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let r=this.getAttribute(ru.MEDIA_CONTROLLER);r&&(sV(this,ca,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=s$(this,ca))?void 0:t.associateElement)||i.call(t,this)),rF.customElements.whenDefined("media-tooltip").then(()=>{var e,t;return(e=cl,t=cd,sW(this,e,"access private method"),t).call(this)})}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=s$(this,ca))?void 0:e.unassociateElement)||t.call(e,this),sV(this,ca,null),this.removeEventListener("mouseenter",s$(this,cn)),this.removeEventListener("focus",s$(this,cn)),this.removeEventListener("click",s$(this,cr))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return na(this,sF)}set tooltipPlacement(e){nr(this,sF,e)}get mediaController(){return na(this,ru.MEDIA_CONTROLLER)}set mediaController(e){nr(this,ru.MEDIA_CONTROLLER,e)}get disabled(){return nt(this,sK)}set disabled(e){ni(this,sK,e)}get noTooltip(){return nt(this,sj)}set noTooltip(e){ni(this,sj,e)}handleClick(e){}}ca=new WeakMap,cr=new WeakMap,cn=new WeakMap,cs=new WeakMap,co=new WeakMap,cl=new WeakSet,cd=function(){this.addEventListener("mouseenter",s$(this,cn)),this.addEventListener("focus",s$(this,cn)),this.addEventListener("click",s$(this,cr));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)},sY.shadowRootOptions={mode:"open"},sY.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${sB.shadowRootOptions.mode}">
          ${sB.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(e)}
        </slot>
      </media-tooltip>
    </slot>
  `},sY.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},sY.getTooltipContentHTML=function(){return""},rF.customElements.get("media-chrome-button")||rF.customElements.define("media-chrome-button",sY);let sG=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`,sQ=e=>{let t=e.mediaIsAirplaying?rN("stop airplay"):rN("start airplay");e.setAttribute("aria-label",t)};class sz extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_IS_AIRPLAYING,rm.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),sQ(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_IS_AIRPLAYING&&sQ(this)}get mediaIsAirplaying(){return nt(this,rm.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){ni(this,rm.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return na(this,rm.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){nr(this,rm.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new rF.CustomEvent(rd.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}sz.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${rm.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${rm.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${rm.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${rm.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${sG}</slot>
      <slot name="exit">${sG}</slot>
    </slot>
  `},sz.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${rN("start airplay")}</slot>
    <slot name="tooltip-exit">${rN("stop airplay")}</slot>
  `},rF.customElements.get("media-airplay-button")||rF.customElements.define("media-airplay-button",sz);let sZ=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,sX=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,sJ=e=>{e.setAttribute("aria-checked",nH(e).toString())};class s0 extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_SUBTITLES_LIST,rm.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",rN("closed captions")),sJ(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_SUBTITLES_SHOWING&&sJ(this)}get mediaSubtitlesList(){return s1(this,rm.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){s2(this,rm.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return s1(this,rm.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){s2(this,rm.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new rF.CustomEvent(rd.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}s0.getSlotTemplateHTML=function(e){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${sZ}</slot>
      <slot name="off">${sX}</slot>
    </slot>
  `},s0.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enable">${rN("Enable captions")}</slot>
    <slot name="tooltip-disable">${rN("Disable captions")}</slot>
  `};let s1=(e,t)=>{let i=e.getAttribute(t);return i?nM(i):[]},s2=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=nP(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};rF.customElements.get("media-captions-button")||rF.customElements.define("media-captions-button",s0);let s3=e=>{let t=e.mediaIsCasting?rN("stop casting"):rN("start casting");e.setAttribute("aria-label",t)};class s4 extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_IS_CASTING,rm.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),s3(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_IS_CASTING&&s3(this)}get mediaIsCasting(){return nt(this,rm.MEDIA_IS_CASTING)}set mediaIsCasting(e){ni(this,rm.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return na(this,rm.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){nr(this,rm.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?rd.MEDIA_EXIT_CAST_REQUEST:rd.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new rF.CustomEvent(e,{composed:!0,bubbles:!0}))}}s4.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${rm.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${rm.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${rm.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${rm.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg></slot>
      <slot name="exit"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg></slot>
    </slot>
  `},s4.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${rN("Start casting")}</slot>
    <slot name="tooltip-exit">${rN("Stop casting")}</slot>
  `},rF.customElements.get("media-cast-button")||rF.customElements.define("media-cast-button",s4);var s5=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},s9=(e,t,i)=>(s5(e,t,"read from private field"),i?i.call(e):t.get(e)),s8=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},s6=(e,t,i,a)=>(s5(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),s7=(e,t,i)=>(s5(e,t,"access private method"),i);let oe="open";class ot extends rF.HTMLElement{constructor(){super(),s8(this,cm),s8(this,cv),s8(this,cg),s8(this,cE),s8(this,c_),s8(this,cA),s8(this,cu,!1),s8(this,cc,null),s8(this,ch,null),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}static get observedAttributes(){return[oe,"anchor"]}get open(){return nt(this,oe)}set open(e){ni(this,oe,e)}handleEvent(e){switch(e.type){case"invoke":s7(this,cE,cy).call(this,e);break;case"focusout":s7(this,c_,cT).call(this,e);break;case"keydown":s7(this,cA,ck).call(this,e)}}connectedCallback(){s7(this,cm,cp).call(this),this.role||(this.role="dialog")}attributeChangedCallback(e,t,i){s7(this,cm,cp).call(this),e===oe&&i!==t&&(this.open?s7(this,cv,cb).call(this):s7(this,cg,cf).call(this))}focus(){s6(this,cc,r4());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),t=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||t)return;let i=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==i||i.focus()}get keysUsed(){return["Escape","Tab"]}}cu=new WeakMap,cc=new WeakMap,ch=new WeakMap,cm=new WeakSet,cp=function(){if(!s9(this,cu)&&(s6(this,cu,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e),queueMicrotask(()=>{let{style:e}=r8(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}},cv=new WeakSet,cb=function(){var e;null==(e=s9(this,ch))||e.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})},cg=new WeakSet,cf=function(){var e;null==(e=s9(this,ch))||e.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))},cE=new WeakSet,cy=function(e){s6(this,ch,e.relatedTarget),r2(this,e.relatedTarget)||(this.open=!this.open)},c_=new WeakSet,cT=function(e){var t;!r2(this,e.relatedTarget)&&(null==(t=s9(this,cc))||t.focus(),s9(this,ch)&&s9(this,ch)!==e.relatedTarget&&this.open&&(this.open=!1))},cA=new WeakSet,ck=function(e){var t,i,a,r,n;let{key:s,ctrlKey:o,altKey:l,metaKey:d}=e;o||l||d||this.keysUsed.includes(s)&&(e.preventDefault(),e.stopPropagation(),"Tab"===s?(e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()):"Escape"===s&&(null==(n=s9(this,cc))||n.focus(),this.open=!1))},ot.shadowRootOptions={mode:"open"},ot.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(e)}
  `},ot.getSlotTemplateHTML=function(e){return`
    <slot id="content"></slot>
  `},rF.customElements.get("media-chrome-dialog")||rF.customElements.define("media-chrome-dialog",ot);var oi=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oa=(e,t,i)=>(oi(e,t,"read from private field"),i?i.call(e):t.get(e)),or=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},on=(e,t,i,a)=>(oi(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),os=(e,t,i)=>(oi(e,t,"access private method"),i);class oo extends rF.HTMLElement{constructor(){if(super(),or(this,cP),or(this,cN),or(this,cH),or(this,cW),or(this,cq),or(this,cF),or(this,cj),or(this,cG),or(this,cw,void 0),or(this,cS,void 0),or(this,cI,void 0),or(this,cC,void 0),or(this,cR,{}),or(this,cL,[]),or(this,cM,()=>{if(this.range.matches(":focus-visible")){let{style:e}=r8(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),or(this,cx,()=>{let{style:e}=r8(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),or(this,cD,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.container=this.shadowRoot.querySelector("#container"),on(this,cI,this.shadowRoot.querySelector("#startpoint")),on(this,cC,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",ru.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===ru.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=oa(this,cw))?void 0:a.unassociateElement)||r.call(a,this),on(this,cw,null)),i&&this.isConnected&&(on(this,cw,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=oa(this,cw))?void 0:s.associateElement)||o.call(s,this))):("disabled"===e||"aria-disabled"===e&&t!==i)&&(null==i?(this.range.removeAttribute(e),os(this,cN,cU).call(this)):(this.range.setAttribute(e,i),os(this,cH,cB).call(this)))}connectedCallback(){var e,t,i;let{style:a}=r8(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),oa(this,cR).pointer=r8(this.shadowRoot,"#pointer"),oa(this,cR).progress=r8(this.shadowRoot,"#progress"),oa(this,cR).thumb=r8(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),oa(this,cR).activeSegment=r8(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let r=this.getAttribute(ru.MEDIA_CONTROLLER);r&&(on(this,cw,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=oa(this,cw))?void 0:t.associateElement)||i.call(t,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",oa(this,cM)),this.shadowRoot.addEventListener("focusout",oa(this,cx)),os(this,cN,cU).call(this),rQ(this.container,oa(this,cD))}disconnectedCallback(){var e,t;os(this,cH,cB).call(this),null==(t=null==(e=oa(this,cw))?void 0:e.unassociateElement)||t.call(e,this),on(this,cw,null),this.shadowRoot.removeEventListener("focusin",oa(this,cM)),this.shadowRoot.removeEventListener("focusout",oa(this,cx)),rz(this.container,oa(this,cD))}updatePointerBar(e){var t;null==(t=oa(this,cR).pointer)||t.style.setProperty("width",`${100*this.getPointerRatio(e)}%`)}updateBar(){var e,t;let i=100*this.range.valueAsNumber;null==(e=oa(this,cR).progress)||e.style.setProperty("width",`${i}%`),null==(t=oa(this,cR).thumb)||t.style.setProperty("left",`${i}%`)}updateSegments(e){let t=this.shadowRoot.querySelector("#segments-clipping");if(t.textContent="",this.container.classList.toggle("segments",!!(null==e?void 0:e.length)),!(null==e?void 0:e.length))return;let i=[...new Set([+this.range.min,...e.flatMap(e=>[e.start,e.end]),+this.range.max])];on(this,cL,[...i]);let a=i.pop();for(let[e,r]of i.entries()){let[n,s]=[0===e,e===i.length-1],o=n?"calc(var(--segments-gap) / -1)":`${100*r}%`,l=s?a:i[e+1],d=`calc(${(l-r)*100}%${n||s?"":" - var(--segments-gap)"})`,u=rK.createElementNS("http://www.w3.org/2000/svg","rect"),c=r6(this.shadowRoot,`#segments-clipping rect:nth-child(${e+1})`);c.style.setProperty("x",o),c.style.setProperty("width",d),t.append(u)}}getPointerRatio(e){var t,i,a,r;let n,s,o;return t=e.clientX,i=e.clientY,a=oa(this,cI).getBoundingClientRect(),n=(r=oa(this,cC).getBoundingClientRect()).x-a.x,0==(o=n*n+(s=r.y-a.y)*s)?0:Math.max(0,Math.min(1,((t-a.x)*n+(i-a.y)*s)/o))}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":os(this,cG,cQ).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":os(this,cq,cV).call(this,e);break;case"pointerdown":os(this,cW,c$).call(this,e);break;case"pointerup":os(this,cF,cK).call(this);break;case"pointerleave":os(this,cj,cY).call(this)}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}cw=new WeakMap,cS=new WeakMap,cI=new WeakMap,cC=new WeakMap,cR=new WeakMap,cL=new WeakMap,cM=new WeakMap,cx=new WeakMap,cD=new WeakMap,cP=new WeakSet,cO=function(e){let t=oa(this,cR).activeSegment;if(!t)return;let i=this.getPointerRatio(e),a=oa(this,cL).findIndex((e,t,a)=>{let r=a[t+1];return null!=r&&i>=e&&i<=r}),r=`#segments-clipping rect:nth-child(${a+1})`;t.selectorText==r&&t.style.transform||(t.selectorText=r,t.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))},cN=new WeakSet,cU=function(){this.hasAttribute("disabled")||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))},cH=new WeakSet,cB=function(){var e,t;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),null==(e=rF.window)||e.removeEventListener("pointerup",this),null==(t=rF.window)||t.removeEventListener("pointermove",this)},cW=new WeakSet,c$=function(e){var t;on(this,cS,e.composedPath().includes(this.range)),null==(t=rF.window)||t.addEventListener("pointerup",this)},cq=new WeakSet,cV=function(e){var t;"mouse"!==e.pointerType&&os(this,cW,c$).call(this,e),this.addEventListener("pointerleave",this),null==(t=rF.window)||t.addEventListener("pointermove",this)},cF=new WeakSet,cK=function(){var e;null==(e=rF.window)||e.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")},cj=new WeakSet,cY=function(){var e,t;this.removeEventListener("pointerleave",this),null==(e=rF.window)||e.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),null==(t=oa(this,cR).activeSegment)||t.style.removeProperty("transform")},cG=new WeakSet,cQ=function(e){("pen"!==e.pointerType||0!==e.buttons)&&(this.toggleAttribute("dragging",1===e.buttons||"mouse"!==e.pointerType),this.updatePointerBar(e),os(this,cP,cO).call(this,e),this.dragging&&("mouse"!==e.pointerType||!oa(this,cS))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(e),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))},oo.shadowRootOptions={mode:"open"},oo.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
      <input id="range" type="range" min="0" max="1" step="any" value="0">

      ${this.getContainerTemplateHTML(e)}
    </div>
    <div id="rightgap"></div>
  `},oo.getContainerTemplateHTML=function(e){return""},rF.customElements.get("media-chrome-range")||rF.customElements.define("media-chrome-range",oo);var ol=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},od=(e,t,i)=>(ol(e,t,"read from private field"),i?i.call(e):t.get(e)),ou=(e,t,i,a)=>(ol(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class oc extends rF.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,cz,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[ru.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===ru.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=od(this,cz))?void 0:a.unassociateElement)||r.call(a,this),ou(this,cz,null)),i&&this.isConnected&&(ou(this,cz,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=od(this,cz))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(ru.MEDIA_CONTROLLER);a&&(ou(this,cz,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=od(this,cz))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=od(this,cz))?void 0:e.unassociateElement)||t.call(e,this),ou(this,cz,null)}}cz=new WeakMap,oc.shadowRootOptions={mode:"open"},oc.getTemplateHTML=function(e){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `},rF.customElements.get("media-control-bar")||rF.customElements.define("media-control-bar",oc);var oh=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},om=(e,t,i)=>(oh(e,t,"read from private field"),i?i.call(e):t.get(e)),op=(e,t,i,a)=>(oh(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class ov extends rF.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,cZ,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[ru.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===ru.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=om(this,cZ))?void 0:a.unassociateElement)||r.call(a,this),op(this,cZ,null)),i&&this.isConnected&&(op(this,cZ,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=om(this,cZ))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let{style:a}=r8(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let r=this.getAttribute(ru.MEDIA_CONTROLLER);r&&(op(this,cZ,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=om(this,cZ))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=om(this,cZ))?void 0:e.unassociateElement)||t.call(e,this),op(this,cZ,null)}}cZ=new WeakMap,ov.shadowRootOptions={mode:"open"},ov.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}
  `},ov.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},rF.customElements.get("media-text-display")||rF.customElements.define("media-text-display",ov);var ob=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},og=(e,t,i)=>(ob(e,t,"read from private field"),i?i.call(e):t.get(e));class of extends ov{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,cX,void 0),((e,t,i,a)=>(ob(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,cX,this.shadowRoot.querySelector("slot")),og(this,cX).textContent=rx(null!=(e=this.mediaDuration)?e:0)}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_DURATION]}attributeChangedCallback(e,t,i){e===rm.MEDIA_DURATION&&(og(this,cX).textContent=rx(+i)),super.attributeChangedCallback(e,t,i)}get mediaDuration(){return r7(this,rm.MEDIA_DURATION)}set mediaDuration(e){ne(this,rm.MEDIA_DURATION,e)}}cX=new WeakMap,of.getSlotTemplateHTML=function(e,t){return`
    <slot>${rx(t.mediaDuration)}</slot>
  `},rF.customElements.get("media-duration-display")||rF.customElements.define("media-duration-display",of);let oE={2:rN("Network Error"),3:rN("Decode Error"),4:rN("Source Not Supported"),5:rN("Encryption Error")},oy={2:rN("A network error caused the media download to fail."),3:rN("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:rN("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:rN("The media is encrypted and there are no keys to decrypt it.")},o_=e=>{var t,i;return 1===e.code?null:{title:null!=(t=oE[e.code])?t:`Error ${e.code}`,message:null!=(i=oy[e.code])?i:e.message}};var oT=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};function oA(e){var t;let{title:i,message:a}=null!=(t=o_(e))?t:{},r="";return i&&(r+=`<slot name="error-${e.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${e.code}-message"><p>${a}</p></slot>`),r}let ok=[rm.MEDIA_ERROR_CODE,rm.MEDIA_ERROR_MESSAGE];class ow extends ot{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,cJ,null)}static get observedAttributes(){return[...super.observedAttributes,...ok]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,t,i){var a;if(super.attributeChangedCallback(e,t,i),!ok.includes(e))return;let r=null!=(a=this.mediaError)?a:{code:this.mediaErrorCode,message:this.mediaErrorMessage};this.open=r.code&&null!==o_(r),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(r))}get mediaError(){var e,t;return oT(this,e=cJ,"read from private field"),t?t.call(this):e.get(this)}set mediaError(e){var t,i;oT(this,t=cJ,"write to private field"),i?i.call(this,e):t.set(this,e)}get mediaErrorCode(){return r7(this,"mediaerrorcode")}set mediaErrorCode(e){ne(this,"mediaerrorcode",e)}get mediaErrorMessage(){return na(this,"mediaerrormessage")}set mediaErrorMessage(e){nr(this,"mediaerrormessage",e)}}cJ=new WeakMap,ow.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${e.mediaerrorcode}" id="content">
      ${oA({code:+e.mediaerrorcode,message:e.mediaerrormessage})}
    </slot>
  `},ow.formatErrorMessage=oA,rF.customElements.get("media-error-dialog")||rF.customElements.define("media-error-dialog",ow);var oS=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)},oI=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};class oC extends ot{constructor(){super(...arguments),oI(this,c0,e=>{var t;if(!this.open)return;let i=null==(t=this.shadowRoot)?void 0:t.querySelector("#content");if(!i)return;let a=e.composedPath(),r=a[0]===this||a.includes(this),n=a.includes(i);r&&!n&&(this.open=!1)}),oI(this,c1,e=>{if(!this.open)return;let t=e.shiftKey&&("/"===e.key||"?"===e.key);"Escape"!==e.key&&!t||e.ctrlKey||e.altKey||e.metaKey||(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",oS(this,c0)),document.addEventListener("keydown",oS(this,c1)))}disconnectedCallback(){this.removeEventListener("click",oS(this,c0)),document.removeEventListener("keydown",oS(this,c1))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),"open"===e&&(this.open?(this.addEventListener("click",oS(this,c0)),document.addEventListener("keydown",oS(this,c1))):(this.removeEventListener("click",oS(this,c0)),document.removeEventListener("keydown",oS(this,c1))))}}c0=new WeakMap,c1=new WeakMap,oC.getSlotTemplateHTML=function(e){let t;return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${t=[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["←","j"],description:"Seek back 10s"},{keys:["→","l"],description:"Seek forward 10s"},{keys:["↑"],description:"Turn volume up"},{keys:["↓"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:e,description:t})=>{let i=e.map((e,t)=>t>0?`<span class="key-separator">or</span><span class="key">${e}</span>`:`<span class="key">${e}</span>`).join("");return`
      <tr>
        <td>
          <div class="key-combo">${i}</div>
        </td>
        <td class="description">${t}</td>
      </tr>
    `}).join(""),`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${t}</table>
  `}
    </slot>
  `},rF.customElements.get("media-keyboard-shortcuts-dialog")||rF.customElements.define("media-keyboard-shortcuts-dialog",oC);var oR=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};let oL=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,oM=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`,ox=e=>{let t=e.mediaIsFullscreen?rN("exit fullscreen mode"):rN("enter fullscreen mode");e.setAttribute("aria-label",t)};class oD extends sY{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,c2,null)}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_IS_FULLSCREEN,rm.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),ox(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_IS_FULLSCREEN&&ox(this)}get mediaFullscreenUnavailable(){return na(this,rm.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){nr(this,rm.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return nt(this,rm.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){ni(this,rm.MEDIA_IS_FULLSCREEN,e)}handleClick(e){var t,i,a,r;oR(this,t=c2,"write to private field"),i?i.call(this,e):t.set(this,e);let n=(oR(this,a=c2,"read from private field"),(r?r.call(this):a.get(this))instanceof PointerEvent),s=this.mediaIsFullscreen?new rF.CustomEvent(rd.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new rF.CustomEvent(rd.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:n});this.dispatchEvent(s)}}c2=new WeakMap,oD.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${rm.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${rm.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${rm.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${rm.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${oL}</slot>
      <slot name="exit">${oM}</slot>
    </slot>
  `},oD.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${rN("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${rN("Exit fullscreen mode")}</slot>
  `},rF.customElements.get("media-fullscreen-button")||rF.customElements.define("media-fullscreen-button",oD);let{MEDIA_TIME_IS_LIVE:oP,MEDIA_PAUSED:oO}=rm,{MEDIA_SEEK_TO_LIVE_REQUEST:oN,MEDIA_PLAY_REQUEST:oU}=rd,oH=e=>{var t;let i=e.mediaPaused||!e.mediaTimeIsLive,a=i?rN("seek to live"):rN("playing live");e.setAttribute("aria-label",a);let r=null==(t=e.shadowRoot)?void 0:t.querySelector('slot[name="text"]');r&&(r.textContent=rN("live")),i?e.removeAttribute("aria-disabled"):e.setAttribute("aria-disabled","true")};class oB extends sY{static get observedAttributes(){return[...super.observedAttributes,oP,oO]}connectedCallback(){super.connectedCallback(),oH(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),oH(this)}get mediaPaused(){return nt(this,rm.MEDIA_PAUSED)}set mediaPaused(e){ni(this,rm.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return nt(this,rm.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){ni(this,rm.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new rF.CustomEvent(oN,{composed:!0,bubbles:!0})),this.hasAttribute(oO)&&this.dispatchEvent(new rF.CustomEvent(oU,{composed:!0,bubbles:!0})))}}oB.getSlotTemplateHTML=function(e){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${oP}]:not([${oO}])) slot[name=indicator] > *,
      :host([${oP}]:not([${oO}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${oP}]:not([${oO}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator"><svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg></slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${rN("live")}</slot>
  `},rF.customElements.get("media-live-button")||rF.customElements.define("media-live-button",oB);var oW=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},o$=(e,t,i)=>(oW(e,t,"read from private field"),i?i.call(e):t.get(e)),oq=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oV=(e,t,i,a)=>(oW(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let oF="loadingdelay",oK="noautohide",oj=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;class oY extends rF.HTMLElement{constructor(){if(super(),oq(this,c3,void 0),oq(this,c4,500),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[ru.MEDIA_CONTROLLER,rm.MEDIA_PAUSED,rm.MEDIA_LOADING,oF]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===oF&&t!==i?this.loadingDelay=Number(i):e===ru.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=o$(this,c3))?void 0:a.unassociateElement)||r.call(a,this),oV(this,c3,null)),i&&this.isConnected&&(oV(this,c3,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=o$(this,c3))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(ru.MEDIA_CONTROLLER);a&&(oV(this,c3,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=o$(this,c3))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=o$(this,c3))?void 0:e.unassociateElement)||t.call(e,this),oV(this,c3,null)}get loadingDelay(){return o$(this,c4)}set loadingDelay(e){oV(this,c4,e);let{style:t}=r8(this.shadowRoot,":host");t.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return nt(this,rm.MEDIA_PAUSED)}set mediaPaused(e){ni(this,rm.MEDIA_PAUSED,e)}get mediaLoading(){return nt(this,rm.MEDIA_LOADING)}set mediaLoading(e){ni(this,rm.MEDIA_LOADING,e)}get mediaController(){return na(this,ru.MEDIA_CONTROLLER)}set mediaController(e){nr(this,ru.MEDIA_CONTROLLER,e)}get noAutohide(){return nt(this,oK)}set noAutohide(e){ni(this,oK,e)}}c3=new WeakMap,c4=new WeakMap,oY.shadowRootOptions={mode:"open"},oY.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, 500ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${rm.MEDIA_LOADING}]:not([${rm.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${rm.MEDIA_LOADING}]:not([${rm.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${rm.MEDIA_LOADING}]:not([${rm.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${oj}</slot>
    <div id="status" role="status" aria-live="polite">${rN("media loading")}</div>
  `},rF.customElements.get("media-loading-indicator")||rF.customElements.define("media-loading-indicator",oY);let oG=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,oQ=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,oz=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`,oZ=e=>{let t="off"===e.mediaVolumeLevel?rN("unmute"):rN("mute");e.setAttribute("aria-label",t)};class oX extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),oZ(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_VOLUME_LEVEL&&oZ(this)}get mediaVolumeLevel(){return na(this,rm.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){nr(this,rm.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e="off"===this.mediaVolumeLevel?rd.MEDIA_UNMUTE_REQUEST:rd.MEDIA_MUTE_REQUEST;this.dispatchEvent(new rF.CustomEvent(e,{composed:!0,bubbles:!0}))}}oX.getSlotTemplateHTML=function(e){return`
    <style>
      :host(:not([${rm.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${rm.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${rm.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${rm.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${rm.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${rm.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${rm.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${oG}</slot>
      <slot name="low">${oQ}</slot>
      <slot name="medium">${oQ}</slot>
      <slot name="high">${oz}</slot>
    </slot>
  `},oX.getTooltipContentHTML=function(){return`
    <slot name="tooltip-mute">${rN("Mute")}</slot>
    <slot name="tooltip-unmute">${rN("Unmute")}</slot>
  `},rF.customElements.get("media-mute-button")||rF.customElements.define("media-mute-button",oX);let oJ=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`,o0=e=>{let t=e.mediaIsPip?rN("exit picture in picture mode"):rN("enter picture in picture mode");e.setAttribute("aria-label",t)};class o1 extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_IS_PIP,rm.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),o0(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_IS_PIP&&o0(this)}get mediaPipUnavailable(){return na(this,rm.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){nr(this,rm.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return nt(this,rm.MEDIA_IS_PIP)}set mediaIsPip(e){ni(this,rm.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?rd.MEDIA_EXIT_PIP_REQUEST:rd.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new rF.CustomEvent(e,{composed:!0,bubbles:!0}))}}o1.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${rm.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${rm.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${rm.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${rm.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${oJ}</slot>
      <slot name="exit">${oJ}</slot>
    </slot>
  `},o1.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${rN("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${rN("Exit picture in picture mode")}</slot>
  `},rF.customElements.get("media-pip-button")||rF.customElements.define("media-pip-button",o1);var o2=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)};let o3="rates",o4=[1,1.2,1.5,1.7,2];class o5 extends sY{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,c5,new nR(this,o3,{defaultValue:o4})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PLAYBACK_RATE,o3]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===o3&&(o2(this,c5).value=i),e===rm.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",rN("Playback rate {playbackRate}",{playbackRate:t}))}}get rates(){return o2(this,c5)}set rates(e){e?Array.isArray(e)?o2(this,c5).value=e.join(" "):"string"==typeof e&&(o2(this,c5).value=e):o2(this,c5).value=""}get mediaPlaybackRate(){return r7(this,rm.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ne(this,rm.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(o2(this,c5).values(),e=>+e).sort((e,t)=>e-t),a=null!=(t=null!=(e=i.find(e=>e>this.mediaPlaybackRate))?e:i[0])?t:1,r=new rF.CustomEvent(rd.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(r)}}c5=new WeakMap,o5.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},o5.getTooltipContentHTML=function(){return rN("Playback rate")},rF.customElements.get("media-playback-rate-button")||rF.customElements.define("media-playback-rate-button",o5);let o9=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,o8=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`,o6=e=>{let t=e.mediaPaused?rN("play"):rN("pause");e.setAttribute("aria-label",t)};class o7 extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PAUSED,rm.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),o6(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),(e===rm.MEDIA_PAUSED||e===rm.MEDIA_LANG)&&o6(this)}get mediaPaused(){return nt(this,rm.MEDIA_PAUSED)}set mediaPaused(e){ni(this,rm.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?rd.MEDIA_PLAY_REQUEST:rd.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new rF.CustomEvent(e,{composed:!0,bubbles:!0}))}}o7.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${rm.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${rm.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${rm.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${rm.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${o9}</slot>
      <slot name="pause">${o8}</slot>
    </slot>
  `},o7.getTooltipContentHTML=function(){return`
    <slot name="tooltip-play">${rN("Play")}</slot>
    <slot name="tooltip-pause">${rN("Pause")}</slot>
  `},rF.customElements.get("media-play-button")||rF.customElements.define("media-play-button",o7);let le="placeholdersrc";class lt extends rF.HTMLElement{static get observedAttributes(){return[le,"src"]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,t,i){if("src"===e&&(null==i?this.image.removeAttribute("src"):this.image.setAttribute("src",i)),e===le)if(null==i)this.image.style.removeProperty("background-image");else{var a;a=this.image,a.style["background-image"]=`url('${i}')`}}get placeholderSrc(){return na(this,le)}set placeholderSrc(e){nr(this,"src",e)}get src(){return na(this,"src")}set src(e){nr(this,"src",e)}}lt.shadowRootOptions={mode:"open"},lt.getTemplateHTML=function(e){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `},rF.customElements.get("media-poster-image")||rF.customElements.define("media-poster-image",lt);var li=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};c9=new WeakMap,rF.customElements.get("media-preview-chapter-display")||rF.customElements.define("media-preview-chapter-display",class extends ov{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,c9,void 0),((e,t,i,a)=>(li(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,c9,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PREVIEW_CHAPTER,rm.MEDIA_LANG]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),(e===rm.MEDIA_PREVIEW_CHAPTER||e===rm.MEDIA_LANG)&&i!==t&&null!=i){var a;if((li(this,c9,"read from private field"),a?a.call(this):c9.get(this)).textContent=i,""!==i){let e=rN("chapter: {chapterName}",{chapterName:i});this.setAttribute("aria-valuetext",e)}else this.removeAttribute("aria-valuetext")}}get mediaPreviewChapter(){return na(this,rm.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){nr(this,rm.MEDIA_PREVIEW_CHAPTER,e)}});var la=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lr=(e,t,i)=>(la(e,t,"read from private field"),i?i.call(e):t.get(e)),ln=(e,t,i,a)=>(la(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class ls extends rF.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,c8,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[ru.MEDIA_CONTROLLER,rm.MEDIA_PREVIEW_IMAGE,rm.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,t,i;let a=this.getAttribute(ru.MEDIA_CONTROLLER);a&&(ln(this,c8,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=lr(this,c8))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=lr(this,c8))?void 0:e.unassociateElement)||t.call(e,this),ln(this,c8,null)}attributeChangedCallback(e,t,i){var a,r,n,s,o;[rm.MEDIA_PREVIEW_IMAGE,rm.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===ru.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=lr(this,c8))?void 0:a.unassociateElement)||r.call(a,this),ln(this,c8,null)),i&&this.isConnected&&(ln(this,c8,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=lr(this,c8))?void 0:s.associateElement)||o.call(s,this)))}get mediaPreviewImage(){return na(this,rm.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){nr(this,rm.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(rm.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){e?this.setAttribute(rm.MEDIA_PREVIEW_COORDS,e.join(" ")):this.removeAttribute(rm.MEDIA_PREVIEW_COORDS)}update(){let e=this.mediaPreviewCoords,t=this.mediaPreviewImage;if(!(e&&t))return;let[i,a,r,n]=e,s=t.split("#")[0],{maxWidth:o,maxHeight:l,minWidth:d,minHeight:u}=getComputedStyle(this),c=Math.min(parseInt(o)/r,parseInt(l)/n),h=Math.max(parseInt(d)/r,parseInt(u)/n),m=c<1,v=m?c:h>1?h:1,{style:b}=r8(this.shadowRoot,":host"),g=r8(this.shadowRoot,"img").style,f=this.shadowRoot.querySelector("img"),E=m?"min":"max";b.setProperty(`${E}-width`,"initial","important"),b.setProperty(`${E}-height`,"initial","important"),b.width=`${r*v}px`,b.height=`${n*v}px`;let y=()=>{g.width=`${this.imgWidth*v}px`,g.height=`${this.imgHeight*v}px`,g.display="block"};f.src!==s&&(f.onload=()=>{this.imgWidth=f.naturalWidth,this.imgHeight=f.naturalHeight,y()},f.src=s,y()),y(),g.transform=`translate(-${i*v}px, -${a*v}px)`}}c8=new WeakMap,ls.shadowRootOptions={mode:"open"},ls.getTemplateHTML=function(e){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `},rF.customElements.get("media-preview-thumbnail")||rF.customElements.define("media-preview-thumbnail",ls);var lo=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ll=(e,t,i)=>(lo(e,t,"read from private field"),i?i.call(e):t.get(e));c6=new WeakMap,rF.customElements.get("media-preview-time-display")||rF.customElements.define("media-preview-time-display",class extends ov{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,c6,void 0),((e,t,i,a)=>(lo(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,c6,this.shadowRoot.querySelector("slot")),ll(this,c6).textContent=rx(0)}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_PREVIEW_TIME&&null!=i&&(ll(this,c6).textContent=rx(parseFloat(i)))}get mediaPreviewTime(){return r7(this,rm.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){ne(this,rm.MEDIA_PREVIEW_TIME,e)}});let ld="seekoffset";class lu extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_CURRENT_TIME,ld]}connectedCallback(){super.connectedCallback(),this.seekOffset=r7(this,ld,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ld&&(this.seekOffset=r7(this,ld,30))}get seekOffset(){return r7(this,ld,30)}set seekOffset(e){ne(this,ld,e),this.setAttribute("aria-label",rN("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),r0(r1(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return r7(this,rm.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){ne(this,rm.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),t=new rF.CustomEvent(rd.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}lu.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${i}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`}</slot>
  `},lu.getTooltipContentHTML=function(){return rN("Seek backward")},rF.customElements.get("media-seek-backward-button")||rF.customElements.define("media-seek-backward-button",lu);let lc="seekoffset";class lh extends sY{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_CURRENT_TIME,lc]}connectedCallback(){super.connectedCallback(),this.seekOffset=r7(this,lc,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===lc&&(this.seekOffset=r7(this,lc,30))}get seekOffset(){return r7(this,lc,30)}set seekOffset(e){ne(this,lc,e),this.setAttribute("aria-label",rN("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),r0(r1(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return r7(this,rm.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){ne(this,rm.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,t=new rF.CustomEvent(rd.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}lh.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${i}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`}</slot>
  `},lh.getTooltipContentHTML=function(){return rN("Seek forward")},rF.customElements.get("media-seek-forward-button")||rF.customElements.define("media-seek-forward-button",lh);var lm=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lp=(e,t,i)=>(lm(e,t,"read from private field"),i?i.call(e):t.get(e));let lv={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},lb=[...Object.values(lv),rm.MEDIA_CURRENT_TIME,rm.MEDIA_DURATION,rm.MEDIA_SEEKABLE],lg=["Enter"," "],lf="&nbsp;/&nbsp;",lE=(e,{timesSep:t=lf}={})=>{var i,a;let r=null!=(i=e.mediaCurrentTime)?i:0,[,n]=null!=(a=e.mediaSeekable)?a:[],s=0;Number.isFinite(e.mediaDuration)?s=e.mediaDuration:Number.isFinite(n)&&(s=n);let o=e.remaining?rx(0-(s-r)):rx(r);return e.showDuration?`${o}${t}${rx(s)}`:o};class ly extends ov{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,c7,void 0),((e,t,i,a)=>(lm(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,c7,this.shadowRoot.querySelector("slot")),lp(this,c7).innerHTML=`${lE(this)}`}static get observedAttributes(){return[...super.observedAttributes,...lb,"disabled"]}connectedCallback(){let{style:e}=r8(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",rN("playback time"));let t=e=>{let{key:i}=e;lg.includes(i)?this.toggleTimeDisplay():this.removeEventListener("keyup",t)};this.addEventListener("keydown",e=>{let{metaKey:i,altKey:a,key:r}=e;i||a||!lg.includes(r)?this.removeEventListener("keyup",t):this.addEventListener("keyup",t)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,t,i){lb.includes(e)?this.update():"disabled"===e&&i!==t&&(null==i?this.enable():this.disable()),super.attributeChangedCallback(e,t,i)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return nt(this,lv.REMAINING)}set remaining(e){ni(this,lv.REMAINING,e)}get showDuration(){return nt(this,lv.SHOW_DURATION)}set showDuration(e){ni(this,lv.SHOW_DURATION,e)}get noToggle(){return nt(this,lv.NO_TOGGLE)}set noToggle(e){ni(this,lv.NO_TOGGLE,e)}get mediaDuration(){return r7(this,rm.MEDIA_DURATION)}set mediaDuration(e){ne(this,rm.MEDIA_DURATION,e)}get mediaCurrentTime(){return r7(this,rm.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){ne(this,rm.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(rm.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){null==e?this.removeAttribute(rm.MEDIA_SEEKABLE):this.setAttribute(rm.MEDIA_SEEKABLE,e.join(":"))}update(){let e=lE(this);(e=>{var t;let i=e.mediaCurrentTime,[,a]=null!=(t=e.mediaSeekable)?t:[],r=null;if(Number.isFinite(e.mediaDuration)?r=e.mediaDuration:Number.isFinite(a)&&(r=a),null==i||null===r)return e.setAttribute("aria-valuetext","video not loaded, unknown time.");let n=e.remaining?rM(0-(r-i)):rM(i);if(!e.showDuration)return e.setAttribute("aria-valuetext",n);let s=rM(r),o=`${n} of ${s}`;e.setAttribute("aria-valuetext",o)})(this),e!==lp(this,c7).innerHTML&&(lp(this,c7).innerHTML=e)}}c7=new WeakMap,ly.getSlotTemplateHTML=function(e,t){return`
    <slot>${lE(t)}</slot>
  `},rF.customElements.get("media-time-display")||rF.customElements.define("media-time-display",ly);var l_=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lT=(e,t,i)=>(l_(e,t,"read from private field"),i?i.call(e):t.get(e)),lA=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},lk=(e,t,i,a)=>(l_(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class lw{constructor(e,t,i){lA(this,he,void 0),lA(this,ht,void 0),lA(this,hi,void 0),lA(this,ha,void 0),lA(this,hr,void 0),lA(this,hn,void 0),lA(this,hs,void 0),lA(this,ho,void 0),lA(this,hl,0),lA(this,hd,(e=performance.now())=>{lk(this,hl,requestAnimationFrame(lT(this,hd))),lk(this,ha,performance.now()-lT(this,hi));let t=1e3/this.fps;if(lT(this,ha)>t){let i,a,r,n;lk(this,hi,e-lT(this,ha)%t);let s=1e3/((e-lT(this,ht))/++(i=this,a=hr,{set _(value){lk(i,a,value,r)},get _(){return lT(i,a,n)}})._),o=(e-lT(this,hn))/1e3/this.duration,l=lT(this,hs)+o*this.playbackRate;l-lT(this,he).valueAsNumber>0?lk(this,ho,this.playbackRate/this.duration/s):(lk(this,ho,.995*lT(this,ho)),l=lT(this,he).valueAsNumber+lT(this,ho)),this.callback(l)}}),lk(this,he,e),this.callback=t,this.fps=i}start(){0===lT(this,hl)&&(lk(this,hi,performance.now()),lk(this,ht,lT(this,hi)),lk(this,hr,0),lT(this,hd).call(this))}stop(){0!==lT(this,hl)&&(cancelAnimationFrame(lT(this,hl)),lk(this,hl,0))}update({start:e,duration:t,playbackRate:i}){let a=e-lT(this,he).valueAsNumber,r=Math.abs(t-this.duration);(a>0||a<-.03||r>=.5)&&this.callback(e),lk(this,hs,e),lk(this,hn,performance.now()),this.duration=t,this.playbackRate=i}}he=new WeakMap,ht=new WeakMap,hi=new WeakMap,ha=new WeakMap,hr=new WeakMap,hn=new WeakMap,hs=new WeakMap,ho=new WeakMap,hl=new WeakMap,hd=new WeakMap;var lS=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lI=(e,t,i)=>(lS(e,t,"read from private field"),i?i.call(e):t.get(e)),lC=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},lR=(e,t,i,a)=>(lS(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),lL=(e,t,i)=>(lS(e,t,"access private method"),i);let lM=(e,t=e.mediaCurrentTime)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:Math.max(0,Math.min((t-i)/(a-i),1))},lx=(e,t=e.range.valueAsNumber)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:t*(a-i)+i};class lD extends oo{constructor(){super(),lC(this,hy),lC(this,hT),lC(this,hw),lC(this,hI),lC(this,hR),lC(this,hM),lC(this,hD),lC(this,hO),lC(this,hu,void 0),lC(this,hc,void 0),lC(this,hh,void 0),lC(this,hm,void 0),lC(this,hp,void 0),lC(this,hv,void 0),lC(this,hb,void 0),lC(this,hg,void 0),lC(this,hf,void 0),lC(this,hE,void 0),lC(this,hk,e=>{!this.dragging&&(rI(e)&&(this.range.valueAsNumber=e),lI(this,hE)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),lR(this,hh,this.shadowRoot.querySelectorAll('[part~="box"]')),lR(this,hp,this.shadowRoot.querySelector('[part~="preview-box"]')),lR(this,hv,this.shadowRoot.querySelector('[part~="current-box"]'));const e=getComputedStyle(this);lR(this,hb,parseInt(e.getPropertyValue("--media-box-padding-left"))),lR(this,hg,parseInt(e.getPropertyValue("--media-box-padding-right"))),lR(this,hc,new lw(this.range,lI(this,hk),60))}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PAUSED,rm.MEDIA_DURATION,rm.MEDIA_SEEKABLE,rm.MEDIA_CURRENT_TIME,rm.MEDIA_PREVIEW_IMAGE,rm.MEDIA_PREVIEW_TIME,rm.MEDIA_PREVIEW_CHAPTER,rm.MEDIA_BUFFERED,rm.MEDIA_PLAYBACK_RATE,rm.MEDIA_LOADING,rm.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",rN("seek")),lL(this,hy,h_).call(this),lR(this,hu,this.getRootNode()),null==(e=lI(this,hu))||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),lL(this,hy,h_).call(this),null==(e=lI(this,hu))||e.removeEventListener("transitionstart",this),lR(this,hu,null)}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),t!=i){if(e===rm.MEDIA_CURRENT_TIME||e===rm.MEDIA_PAUSED||e===rm.MEDIA_ENDED||e===rm.MEDIA_LOADING||e===rm.MEDIA_DURATION||e===rm.MEDIA_SEEKABLE){let e,t,i,a;lI(this,hc).update({start:lM(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),lL(this,hy,h_).call(this),e=this.range,t=rM(+lx(this)),i=rM(+this.mediaSeekableEnd),a=t&&i?`${t} of ${i}`:"video not loaded, unknown time.",e.setAttribute("aria-valuetext",a)}else e===rm.MEDIA_BUFFERED&&this.updateBufferedBar();(e===rm.MEDIA_DURATION||e===rm.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=lI(this,hf),this.updateBar())}}get mediaChaptersCues(){return lI(this,hf)}set mediaChaptersCues(e){var t;lR(this,hf,e),this.updateSegments(null==(t=lI(this,hf))?void 0:t.map(e=>({start:lM(this,e.startTime),end:lM(this,e.endTime)})))}get mediaPaused(){return nt(this,rm.MEDIA_PAUSED)}set mediaPaused(e){ni(this,rm.MEDIA_PAUSED,e)}get mediaLoading(){return nt(this,rm.MEDIA_LOADING)}set mediaLoading(e){ni(this,rm.MEDIA_LOADING,e)}get mediaDuration(){return r7(this,rm.MEDIA_DURATION)}set mediaDuration(e){ne(this,rm.MEDIA_DURATION,e)}get mediaCurrentTime(){return r7(this,rm.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){ne(this,rm.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return r7(this,rm.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ne(this,rm.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(rm.MEDIA_BUFFERED);return e?e.split(" ").map(e=>e.split(":").map(e=>+e)):[]}set mediaBuffered(e){if(!e)return void this.removeAttribute(rm.MEDIA_BUFFERED);let t=e.map(e=>e.join(":")).join(" ");this.setAttribute(rm.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(rm.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){null==e?this.removeAttribute(rm.MEDIA_SEEKABLE):this.setAttribute(rm.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,t=this.mediaDuration]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaSeekableStart(){var e;let[t=0]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaPreviewImage(){return na(this,rm.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){nr(this,rm.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return r7(this,rm.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){ne(this,rm.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return nt(this,rm.MEDIA_ENDED)}set mediaEnded(e){ni(this,rm.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let t,i=this.mediaBuffered;if(!i.length)return;if(this.mediaEnded)t=1;else{let a=this.mediaCurrentTime,[,r=this.mediaSeekableStart]=null!=(e=i.find(([e,t])=>e<=a&&a<=t))?e:[];t=lM(this,r)}let{style:a}=r8(this.shadowRoot,"#buffered");a.setProperty("width",`${100*t}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;let e=r8(this.shadowRoot,"#current-rail"),t=r8(this.shadowRoot,'[part~="current-box"]'),i=lL(this,hw,hS).call(this,lI(this,hv)),a=lL(this,hI,hC).call(this,i,this.range.valueAsNumber),r=lL(this,hR,hL).call(this,i,this.range.valueAsNumber);e.style.transform=`translateX(${a})`,e.style.setProperty("--_range-width",`${i.range.width}`),t.style.setProperty("--_box-shift",`${r}`),t.style.setProperty("--_box-width",`${i.box.width}px`),t.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":lL(this,hO,hN).call(this);break;case"pointermove":lL(this,hM,hx).call(this,e);break;case"pointerup":lI(this,hE)&&lR(this,hE,!1);break;case"pointerdown":lR(this,hE,!0);break;case"pointerleave":lL(this,hD,hP).call(this,null);break;case"transitionstart":r2(e.target,this)&&setTimeout(()=>lL(this,hy,h_).call(this),0)}}}hu=new WeakMap,hc=new WeakMap,hh=new WeakMap,hm=new WeakMap,hp=new WeakMap,hv=new WeakMap,hb=new WeakMap,hg=new WeakMap,hf=new WeakMap,hE=new WeakMap,hy=new WeakSet,h_=function(){lL(this,hT,hA).call(this)?lI(this,hc).start():lI(this,hc).stop()},hT=new WeakSet,hA=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&r9(this)},hk=new WeakMap,hw=new WeakSet,hS=function(e){var t;let i=(null!=(t=this.getAttribute("bounds")?r3(this,`#${this.getAttribute("bounds")}`):this.parentElement)?t:this).getBoundingClientRect(),a=this.range.getBoundingClientRect(),r=e.offsetWidth,n=-(a.left-i.left-r/2),s=i.right-a.left-r/2;return{box:{width:r,min:n,max:s},bounds:i,range:a}},hI=new WeakSet,hC=function(e,t){let i=`${100*t}%`,{width:a,min:r,max:n}=e.box;if(!a)return i;if(!Number.isNaN(r)){let e=`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`;i=`max(${e}, ${i})`}if(!Number.isNaN(n)){let e=`calc(1 / var(--_range-width) * 100 * ${n}% - var(--media-box-padding-right))`;i=`min(${i}, ${e})`}return i},hR=new WeakSet,hL=function(e,t){let{width:i,min:a,max:r}=e.box,n=t*e.range.width;if(n<a+lI(this,hb)){let t=e.range.left-e.bounds.left-lI(this,hb);return`${n-i/2+t}px`}if(n>r-lI(this,hg)){let t=e.bounds.right-e.range.right-lI(this,hg);return`${n+i/2-t-e.range.width}px`}return 0},hM=new WeakSet,hx=function(e){let t=[...lI(this,hh)].some(t=>e.composedPath().includes(t));if(!this.dragging&&(t||!e.composedPath().includes(this)))return void lL(this,hD,hP).call(this,null);let i=this.mediaSeekableEnd;if(!i)return;let a=r8(this.shadowRoot,"#preview-rail"),r=r8(this.shadowRoot,'[part~="preview-box"]'),n=lL(this,hw,hS).call(this,lI(this,hp)),s=(e.clientX-n.range.left)/n.range.width;s=Math.max(0,Math.min(1,s));let o=lL(this,hI,hC).call(this,n,s),l=lL(this,hR,hL).call(this,n,s);a.style.transform=`translateX(${o})`,a.style.setProperty("--_range-width",`${n.range.width}`),r.style.setProperty("--_box-shift",`${l}`),r.style.setProperty("--_box-width",`${n.box.width}px`),1>Math.abs(Math.round(lI(this,hm))-Math.round(s*i))&&s>.01&&s<.99||(lR(this,hm,s*i),lL(this,hD,hP).call(this,lI(this,hm)))},hD=new WeakSet,hP=function(e){this.dispatchEvent(new rF.CustomEvent(rd.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:e}))},hO=new WeakSet,hN=function(){lI(this,hc).stop();let e=lx(this);this.dispatchEvent(new rF.CustomEvent(rd.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e}))},lD.shadowRootOptions={mode:"open"},lD.getContainerTemplateHTML=function(e){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${rm.MEDIA_PREVIEW_IMAGE}], [${rm.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${rm.MEDIA_PREVIEW_IMAGE}], [${rm.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${rm.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${rm.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${rm.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${rm.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${rm.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${rm.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${rm.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${rm.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${rm.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${rm.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${rm.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${rm.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${ls.shadowRootOptions.mode}">
            ${ls.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `},rF.customElements.get("media-time-range")||rF.customElements.define("media-time-range",lD),rF.customElements.get("media-volume-range")||rF.customElements.define("media-volume-range",class extends oo{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_VOLUME,rm.MEDIA_MUTED,rm.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.addEventListener("input",()=>{let e=this.range.value,t=new rF.CustomEvent(rd.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)})}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",rN("volume"))}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===rm.MEDIA_VOLUME||e===rm.MEDIA_MUTED){let e;this.range.valueAsNumber=this.mediaMuted?0:this.mediaVolume,this.range.setAttribute("aria-valuetext",(e=this.range.valueAsNumber,`${Math.round(100*e)}%`)),this.updateBar()}}get mediaVolume(){return r7(this,rm.MEDIA_VOLUME,1)}set mediaVolume(e){ne(this,rm.MEDIA_VOLUME,e)}get mediaMuted(){return nt(this,rm.MEDIA_MUTED)}set mediaMuted(e){ni(this,rm.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return na(this,rm.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){nr(this,rm.MEDIA_VOLUME_UNAVAILABLE,e)}});class lP extends sY{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=(null==(e=this.shadowRoot)?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=rN("Loop"))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return nt(this,rm.MEDIA_LOOP)}set mediaLoop(e){ni(this,rm.MEDIA_LOOP,e)}handleClick(){let e=!this.mediaLoop,t=new rF.CustomEvent(rd.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}lP.getSlotTemplateHTML=function(e){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${rm.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `},lP.getTooltipContentHTML=function(){return rN("Loop")},rF.customElements.get("media-loop-button")||rF.customElements.define("media-loop-button",lP);var lO=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lN=(e,t,i)=>(lO(e,t,"read from private field"),i?i.call(e):t.get(e)),lU=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},lH=(e,t,i,a)=>(lO(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let lB={processCallback(e,t,i){if(i){for(let[e,a]of t)if(e in i){let t=i[e];"boolean"==typeof t&&a instanceof lY&&"boolean"==typeof a.element[a.attributeName]?a.booleanValue=t:"function"==typeof t&&a instanceof lY?a.element[a.attributeName]=t:a.value=t}}}};class lW extends rF.DocumentFragment{constructor(e,t,i=lB){var a;super(),lU(this,hU,void 0),lU(this,hH,void 0),this.append(e.content.cloneNode(!0)),lH(this,hU,l$(this)),lH(this,hH,i),null==(a=i.createCallback)||a.call(i,this,lN(this,hU),t),i.processCallback(this,lN(this,hU),t)}update(e){lN(this,hH).processCallback(this,lN(this,hU),e)}}hU=new WeakMap,hH=new WeakMap;let l$=(e,t=[])=>{let i,a;for(let r of e.attributes||[])if(r.value.includes("{{")){let n=new lj;for([i,a]of lV(r.value))if(i){let i=new lY(e,r.name,r.namespaceURI);n.append(i),t.push([a,i])}else n.append(a);r.value=n.toString()}for(let r of e.childNodes)if(1!==r.nodeType||r instanceof HTMLTemplateElement){let n=r.data;if(1===r.nodeType||n.includes("{{")){let s=[];if(n)for([i,a]of lV(n))if(i){let i=new lG(e);s.push(i),t.push([a,i])}else s.push(new Text(a));else if(r instanceof HTMLTemplateElement){let i=new lQ(e,r);s.push(i),t.push([i.expression,i])}r.replaceWith(...s.flatMap(e=>e.replacementNodes||[e]))}}else l$(r,t);return t},lq={},lV=e=>{let t="",i=0,a=lq[e],r=0,n;if(a)return a;for(a=[];n=e[r];r++)"{"===n&&"{"===e[r+1]&&"\\"!==e[r-1]&&e[r+2]&&1==++i?(t&&a.push([0,t]),t="",r++):"}"!==n||"}"!==e[r+1]||"\\"===e[r-1]||--i?t+=n||"":(a.push([1,t.trim()]),t="",r++);return t&&a.push([0,(i>0?"{{":"")+t]),lq[e]=a};class lF{get value(){return""}set value(e){}toString(){return this.value}}let lK=new WeakMap;class lj{constructor(){lU(this,hB,[])}[Symbol.iterator](){return lN(this,hB).values()}get length(){return lN(this,hB).length}item(e){return lN(this,hB)[e]}append(...e){for(let t of e)t instanceof lY&&lK.set(t,this),lN(this,hB).push(t)}toString(){return lN(this,hB).join("")}}hB=new WeakMap;class lY extends lF{constructor(e,t,i){super(),lU(this,hF),lU(this,hW,""),lU(this,h$,void 0),lU(this,hq,void 0),lU(this,hV,void 0),lH(this,h$,e),lH(this,hq,t),lH(this,hV,i)}get attributeName(){return lN(this,hq)}get attributeNamespace(){return lN(this,hV)}get element(){return lN(this,h$)}get value(){return lN(this,hW)}set value(e){lN(this,hW)!==e&&(lH(this,hW,e),lN(this,hF,hK)&&1!==lN(this,hF,hK).length?lN(this,h$).setAttributeNS(lN(this,hV),lN(this,hq),lN(this,hF,hK).toString()):null==e?lN(this,h$).removeAttributeNS(lN(this,hV),lN(this,hq)):lN(this,h$).setAttributeNS(lN(this,hV),lN(this,hq),e))}get booleanValue(){return lN(this,h$).hasAttributeNS(lN(this,hV),lN(this,hq))}set booleanValue(e){if(lN(this,hF,hK)&&1!==lN(this,hF,hK).length)throw new DOMException("Value is not fully templatized");this.value=e?"":null}}hW=new WeakMap,h$=new WeakMap,hq=new WeakMap,hV=new WeakMap,hF=new WeakSet,hK=function(){return lK.get(this)};class lG extends lF{constructor(e,t){super(),lU(this,hj,void 0),lU(this,hY,void 0),lH(this,hj,e),lH(this,hY,t?[...t]:[new Text])}get replacementNodes(){return lN(this,hY)}get parentNode(){return lN(this,hj)}get nextSibling(){return lN(this,hY)[lN(this,hY).length-1].nextSibling}get previousSibling(){return lN(this,hY)[0].previousSibling}get value(){return lN(this,hY).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){let t=e.flat().flatMap(e=>null==e?[new Text]:e.forEach?[...e]:11===e.nodeType?[...e.childNodes]:e.nodeType?[e]:[new Text(e)]);t.length||t.push(new Text),lH(this,hY,function(e,t,i,a=null){let r=0,n,s,o,l=i.length,d=t.length;for(;r<l&&r<d&&t[r]==i[r];)r++;for(;r<l&&r<d&&i[l-1]==t[d-1];)a=i[--d,--l];if(r==d)for(;r<l;)e.insertBefore(i[r++],a);if(r==l)for(;r<d;)e.removeChild(t[r++]);else{for(n=t[r];r<l;)o=i[r++],s=n?n.nextSibling:a,n==o?n=s:r<l&&i[r]==s?(e.replaceChild(o,n),n=s):e.insertBefore(o,n);for(;n!=a;)s=n.nextSibling,e.removeChild(n),n=s}return i}(lN(this,hY)[0].parentNode,lN(this,hY),t,this.nextSibling))}}hj=new WeakMap,hY=new WeakMap;class lQ extends lG{constructor(e,t){const i=t.getAttribute("directive")||t.getAttribute("type");let a=t.getAttribute("expression")||t.getAttribute(i)||"";a.startsWith("{{")&&(a=a.trim().slice(2,-2).trim()),super(e),this.expression=a,this.template=t,this.directive=i}}let lz={string:e=>String(e)};class lZ{constructor(e){this.template=e,this.state=void 0}}let lX=new WeakMap,lJ=new WeakMap,l0={partial:(e,t)=>{t[e.expression]=new lZ(e.template)},if:(e,t)=>{var i;if(l4(e.expression,t))if(lX.get(e)!==e.template){lX.set(e,e.template);let i=new lW(e.template,t,l2);e.replace(i),lJ.set(e,i)}else null==(i=lJ.get(e))||i.update(t);else e.replace(""),lX.delete(e),lJ.delete(e)}},l1=Object.keys(l0),l2={processCallback(e,t,i){var a,r;if(i)for(let[e,n]of t){if(n instanceof lQ){if(!n.directive){let e=l1.find(e=>n.template.hasAttribute(e));e&&(n.directive=e,n.expression=n.template.getAttribute(e))}null==(a=l0[n.directive])||a.call(l0,n,i);continue}let t=l4(e,i);if(t instanceof lZ){lX.get(n)!==t.template?(lX.set(n,t.template),n.value=t=new lW(t.template,t.state,l2),lJ.set(n,t)):null==(r=lJ.get(n))||r.update(t.state);continue}t?(n instanceof lY&&n.attributeName.startsWith("aria-")&&(t=String(t)),n instanceof lY?"boolean"==typeof t?n.booleanValue=t:"function"==typeof t?n.element[n.attributeName]=t:n.value=t:(n.value=t,lX.delete(n),lJ.delete(n))):n instanceof lY?n.value=void 0:(n.value=void 0,lX.delete(n),lJ.delete(n))}}},l3={"!":e=>!e,"!!":e=>!!e,"==":(e,t)=>e==t,"!=":(e,t)=>e!=t,">":(e,t)=>e>t,">=":(e,t)=>e>=t,"<":(e,t)=>e<t,"<=":(e,t)=>e<=t,"??":(e,t)=>null!=e?e:t,"|":(e,t)=>{var i;return null==(i=lz[t])?void 0:i.call(lz,e)}};function l4(e,t={}){var i,a,r,n,s,o,l;let d=(function(e,t){let i,a,r,n=[];for(;e;){for(let n in r=null,i=e.length,t)(a=t[n].exec(e))&&a.index<i&&(r={token:a[0],type:n,matches:a.slice(1)},i=a.index);i&&n.push({token:e.substr(0,i),type:void 0}),r&&n.push(r),e=e.substr(i+(r?r.token.length:0))}return n})(e,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>"ws"!==e);if(0===d.length||d.some(({type:e})=>!e))return l5(e);if((null==(i=d[0])?void 0:i.token)===">"){let i=t[null==(a=d[1])?void 0:a.token];if(!i)return l5(e);let o={...t};i.state=o;let l=d.slice(2);for(let e=0;e<l.length;e+=3){let i=null==(r=l[e])?void 0:r.token,a=null==(n=l[e+1])?void 0:n.token,d=null==(s=l[e+2])?void 0:s.token;i&&"="===a&&(o[i]=l8(d,t))}return i}if(1===d.length)return l9(d[0])?l8(d[0].token,t):l5(e);if(2===d.length){let i=l3[null==(o=d[0])?void 0:o.token];return i&&l9(d[1])?i(l8(d[1].token,t)):l5(e)}if(3===d.length){let i=null==(l=d[1])?void 0:l.token,a=l3[i];if(!a||!l9(d[0])||!l9(d[2]))return l5(e);let r=l8(d[0].token,t);return a(r,"|"===i?d[2].token:l8(d[2].token,t))}}function l5(e){return console.warn(`Warning: invalid expression \`${e}\``),!1}function l9({type:e}){return["number","boolean","string","param"].includes(e)}function l8(e,t){let i=e[0],a=e.slice(-1);return"true"===e||"false"===e?"true"===e:i===a&&["'",'"'].includes(i)?e.slice(1,-1):rC(e)?parseFloat(e):t[e]}var l6=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},l7=(e,t,i)=>(l6(e,t,"read from private field"),i?i.call(e):t.get(e)),de=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},dt=(e,t,i,a)=>(l6(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),di=(e,t,i)=>(l6(e,t,"access private method"),i);let da={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},dr=rK.createElement("template");dr.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-captions-button:not([mediasubtitleslist]),
    media-captions-menu:not([mediasubtitleslist]),
    media-captions-menu-button:not([mediasubtitleslist]),
    media-audio-track-menu[mediaaudiotrackunavailable],
    media-audio-track-menu-button[mediaaudiotrackunavailable],
    media-rendition-menu[mediarenditionunavailable],
    media-rendition-menu-button[mediarenditionunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;class dn extends rF.HTMLElement{constructor(){super(),de(this,hZ),de(this,hJ),de(this,hG,void 0),de(this,hQ,void 0),de(this,hz,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer());const e=new MutationObserver(e=>{var t;(!this.mediaController||(null==(t=this.mediaController)?void 0:t.breakpointsComputed))&&e.some(e=>{let t=e.target;return t===this||"media-controller"===t.localName&&!!(da[e.attributeName]||e.attributeName.startsWith("breakpoint"))})&&this.render()});e.observe(this,{attributes:!0}),e.observe(this.renderRoot,{attributes:!0,subtree:!0}),this.addEventListener(rp.BREAKPOINTS_COMPUTED,this.render),di(this,hZ,hX).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return null!=(e=l7(this,hG))?e:this.constructor.template}set template(e){null===e?this.removeAttribute("template"):"string"==typeof e?this.setAttribute("template",e):e instanceof HTMLTemplateElement&&(dt(this,hG,e),dt(this,hz,null),this.createRenderer())}get props(){var e,t,i;let a=[...Array.from(null!=(t=null==(e=this.mediaController)?void 0:e.attributes)?t:[]).filter(({name:e})=>da[e]||e.startsWith("breakpoint")),...Array.from(this.attributes)],r={};for(let e of a){let t=null!=(i=da[e.name])?i:e.name.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase()),{value:a}=e;null!=a?(rC(a)&&(a=parseFloat(a)),r[t]=""===a||a):r[t]=!1}return r}attributeChangedCallback(e,t,i){"template"===e&&t!=i&&di(this,hJ,h0).call(this)}connectedCallback(){di(this,hJ,h0).call(this)}createRenderer(){this.template instanceof HTMLTemplateElement&&this.template!==l7(this,hQ)&&(dt(this,hQ,this.template),this.renderer=new lW(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(dr.content.cloneNode(!0),this.renderer))}render(){var e;null==(e=this.renderer)||e.update(this.props)}}async function ds(e){let t=await fetch(e);if(200!==t.status)throw Error(`Failed to load resource: the server responded with a status of ${t.status}`);return t.text()}function dl(e){return e.split("-")[0]}hG=new WeakMap,hQ=new WeakMap,hz=new WeakMap,hZ=new WeakSet,hX=function(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}},hJ=new WeakSet,h0=function(){var e;let t=this.getAttribute("template");if(!t||t===l7(this,hz))return;let i=this.getRootNode(),a=null==(e=null==i?void 0:i.getElementById)?void 0:e.call(i,t);if(a){dt(this,hz,t),dt(this,hG,a),this.createRenderer();return}(function(e){if(!/^(\/|\.\/|https?:\/\/)/.test(e))return!1;let t=/^https?:\/\//.test(e)?void 0:location.origin;try{new URL(e,t)}catch(e){return!1}return!0})(t)&&(dt(this,hz,t),ds(t).then(e=>{let t=rK.createElement("template");t.innerHTML=e,dt(this,hG,t),this.createRenderer()}).catch(console.error))},dn.observedAttributes=["template"],dn.processor=l2,rF.customElements.get("media-theme")||rF.customElements.define("media-theme",dn);class dd extends Event{constructor({action:e="auto",relatedTarget:t,...i}){super("invoke",i),this.action=e,this.relatedTarget=t}}class du extends Event{constructor({newState:e,oldState:t,...i}){super("toggle",i),this.newState=e,this.oldState=t}}var dc=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},dh=(e,t,i)=>(dc(e,t,"read from private field"),i?i.call(e):t.get(e)),dm=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},dp=(e,t,i,a)=>(dc(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),dv=(e,t,i)=>(dc(e,t,"access private method"),i);function db({type:e,text:t,value:i,checked:a}){let r=rK.createElement("media-chrome-menu-item");r.type=null!=e?e:"",r.part.add("menu-item"),e&&r.part.add(e),r.value=i,r.checked=a;let n=rK.createElement("span");return n.textContent=t,r.append(n),r}function dg(e,t){let i=e.querySelector(`:scope > [slot="${t}"]`);if((null==i?void 0:i.nodeName)=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i.cloneNode(!0);let a=e.shadowRoot.querySelector(`[name="${t}"] > svg`);return a?a.cloneNode(!0):""}let df="style",dE="hidden",dy="disabled";class d_ extends rF.HTMLElement{constructor(){if(super(),dm(this,h6),dm(this,me),dm(this,ma),dm(this,mn),dm(this,mo),dm(this,md),dm(this,mm),dm(this,mv),dm(this,mg),dm(this,mE),dm(this,m_),dm(this,mA),dm(this,mw),dm(this,mI),dm(this,mR),dm(this,mM),dm(this,mD),dm(this,mO),dm(this,h1,null),dm(this,h2,null),dm(this,h3,null),dm(this,h4,new Set),dm(this,h5,void 0),dm(this,h9,!1),dm(this,h8,null),dm(this,mi,()=>{let e=dh(this,h4),t=new Set(this.items);for(let i of e)t.has(i)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:i}));for(let i of t)e.has(i)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:i}));dp(this,h4,t)}),dm(this,mc,()=>{dv(this,mm,mp).call(this),dv(this,mv,mb).call(this,!1)}),dm(this,mh,()=>{dv(this,mm,mp).call(this)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),this.shadowRoot.addEventListener("slotchange",this),dp(this,h5,new MutationObserver(dh(this,mi))),dh(this,h5).observe(this.defaultSlot,{childList:!0})}static get observedAttributes(){return[dy,dE,df,"anchor",ru.MEDIA_CONTROLLER]}static formatMenuItemText(e,t){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":dv(this,h6,h7).call(this,e);break;case"invoke":dv(this,mn,ms).call(this,e);break;case"click":dv(this,mg,mf).call(this,e);break;case"toggle":dv(this,m_,mT).call(this,e);break;case"focusout":dv(this,mw,mS).call(this,e);break;case"keydown":dv(this,mI,mC).call(this,e)}}connectedCallback(){var e,t;dp(this,h8,r6(this.shadowRoot,":host")),dv(this,ma,mr).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),dp(this,h1,rJ(this)),null==(t=null==(e=dh(this,h1))?void 0:e.associateElement)||t.call(e,this),this.hidden||(rQ(dA(this),dh(this,mc)),rQ(this,dh(this,mh))),dv(this,me,mt).call(this)}disconnectedCallback(){var e,t;rz(dA(this),dh(this,mc)),rz(this,dh(this,mh)),this.disable(),null==(t=null==(e=dh(this,h1))?void 0:e.unassociateElement)||t.call(e,this),dp(this,h1,null)}attributeChangedCallback(e,t,i){var a,r,n,s;e===dE&&i!==t?(dh(this,h9)||dp(this,h9,!0),this.hidden?dv(this,md,mu).call(this):dv(this,mo,ml).call(this),this.dispatchEvent(new du({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===ru.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=dh(this,h1))?void 0:a.unassociateElement)||r.call(a,this),dp(this,h1,null)),i&&this.isConnected&&(dp(this,h1,rJ(this)),null==(s=null==(n=dh(this,h1))?void 0:n.associateElement)||s.call(n,this))):e===dy&&i!==t?null==i?this.enable():this.disable():e===df&&i!==t&&dv(this,ma,mr).call(this)}formatMenuItemText(e,t){return this.constructor.formatMenuItemText(e,t)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?null==(e=r5(this))?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(dT)}get radioGroupItems(){return this.items.filter(e=>"menuitemradio"===e.role)}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,t;return null!=(t=null==(e=this.checkedItems[0])?void 0:e.value)?t:""}set value(e){let t=this.items.find(t=>t.value===e);t&&dv(this,mO,mN).call(this,t)}focus(){if(dp(this,h2,r4()),this.items.length){dv(this,mD,mP).call(this,this.items[0]),this.items[0].focus();return}let e=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==e||e.focus()}handleSelect(e){var t;let i=dv(this,mR,mL).call(this,e);i&&(dv(this,mO,mN).call(this,i,"checkbox"===i.type),dh(this,h3)&&!this.hidden&&(null==(t=dh(this,h2))||t.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var t,i;let{key:a}=e,r=this.items,n=null!=(i=null!=(t=dv(this,mR,mL).call(this,e))?t:dv(this,mM,mx).call(this))?i:r[0],s=Math.max(0,r.indexOf(n));"ArrowDown"===a?s++:"ArrowUp"===a?s--:"Home"===e.key?s=0:"End"===e.key&&(s=r.length-1),s<0&&(s=r.length-1),s>r.length-1&&(s=0),dv(this,mD,mP).call(this,r[s]),r[s].focus()}}function dT(e){return["menuitem","menuitemradio","menuitemcheckbox"].includes(null==e?void 0:e.role)}function dA(e){var t;return null!=(t=e.getAttribute("bounds")?r3(e,`#${e.getAttribute("bounds")}`):rX(e)||e.parentElement)?t:e}h1=new WeakMap,h2=new WeakMap,h3=new WeakMap,h4=new WeakMap,h5=new WeakMap,h9=new WeakMap,h8=new WeakMap,h6=new WeakSet,h7=function(e){let t=e.target;for(let e of t.assignedNodes({flatten:!0}))3===e.nodeType&&""===e.textContent.trim()&&e.remove();["header","title"].includes(t.name)&&dv(this,me,mt).call(this),t.name||dh(this,mi).call(this)},me=new WeakSet,mt=function(){let e=this.shadowRoot.querySelector('slot[name="header"]');e.hidden=0===this.shadowRoot.querySelector('slot[name="title"]').assignedNodes().length&&0===e.assignedNodes().length},mi=new WeakMap,ma=new WeakSet,mr=function(){var e;let t=this.shadowRoot.querySelector("#layout-row"),i=null==(e=getComputedStyle(this).getPropertyValue("--media-menu-layout"))?void 0:e.trim();t.setAttribute("media","row"===i?"":"width:0")},mn=new WeakSet,ms=function(e){dp(this,h3,e.relatedTarget),r2(this,e.relatedTarget)||(this.hidden=!this.hidden)},mo=new WeakSet,ml=function(){var e;null==(e=dh(this,h3))||e.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),rQ(dA(this),dh(this,mc)),rQ(this,dh(this,mh))},md=new WeakSet,mu=function(){var e;null==(e=dh(this,h3))||e.setAttribute("aria-expanded","false"),rz(dA(this),dh(this,mc)),rz(this,dh(this,mh))},mc=new WeakMap,mh=new WeakMap,mm=new WeakSet,mp=function(e){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;let{x:t,y:i}=function({anchor:e,floating:t,placement:i}){let{x:a,y:r}=function({anchor:e,floating:t},i){let a,r="x"==(["top","bottom"].includes(dl(i))?"y":"x")?"y":"x",n="y"===r?"height":"width",s=dl(i),o=e.x+e.width/2-t.width/2,l=e.y+e.height/2-t.height/2,d=e[n]/2-t[n]/2;switch(s){case"top":a={x:o,y:e.y-t.height};break;case"bottom":a={x:o,y:e.y+e.height};break;case"right":a={x:e.x+e.width,y:l};break;case"left":a={x:e.x-t.width,y:l};break;default:a={x:e.x,y:e.y}}switch(i.split("-")[1]){case"start":a[r]-=d;break;case"end":a[r]+=d}return a}(function({anchor:e,floating:t}){var i,a,r;let n,s;return{anchor:(i=e,a=t.offsetParent,n=i.getBoundingClientRect(),s=null!=(r=null==a?void 0:a.getBoundingClientRect())?r:{x:0,y:0},{x:n.x-s.x,y:n.y-s.y,width:n.width,height:n.height}),floating:{x:0,y:0,width:t.offsetWidth,height:t.offsetHeight}}}({anchor:e,floating:t}),i);return{x:a,y:r}}({anchor:this.anchorElement,floating:this,placement:"top-start"});null!=e||(e=this.offsetWidth);let a=dA(this).getBoundingClientRect(),r=a.width-t-e,n=a.height-i-this.offsetHeight,{style:s}=dh(this,h8);s.setProperty("position","absolute"),s.setProperty("right",`${Math.max(0,r)}px`),s.setProperty("--_menu-bottom",`${n}px`);let o=getComputedStyle(this),l=s.getPropertyValue("--_menu-bottom")===o.bottom?n:parseFloat(o.bottom),d=a.height-l-parseFloat(o.marginBottom);this.style.setProperty("--_menu-max-height",`${d}px`)},mv=new WeakSet,mb=function(e){let t=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=null==t?void 0:t.querySelector('[role="menu"]'),{style:a}=dh(this,h8);if(e||a.setProperty("--media-menu-transition-in","none"),i){let e=i.offsetHeight,a=Math.max(i.offsetWidth,t.offsetWidth);this.style.setProperty("min-width",`${a}px`),this.style.setProperty("min-height",`${e}px`),dv(this,mm,mp).call(this,a)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),dv(this,mm,mp).call(this);a.removeProperty("--media-menu-transition-in")},mg=new WeakSet,mf=function(e){var t;if(e.stopPropagation(),e.composedPath().includes(dh(this,mE,my))){null==(t=dh(this,h2))||t.focus(),this.hidden=!0;return}let i=dv(this,mR,mL).call(this,e);!i||i.hasAttribute("disabled")||(dv(this,mD,mP).call(this,i),this.handleSelect(e))},mE=new WeakSet,my=function(){var e;return null==(e=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))?void 0:e.find(e=>e.matches('button[part~="back"]'))},m_=new WeakSet,mT=function(e){if(e.target===this)return;dv(this,mA,mk).call(this);let t=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(let i of t)i.invokeTargetElement!=e.target&&("open"!=e.newState||"true"!=i.getAttribute("aria-expanded")||i.invokeTargetElement.hidden||i.invokeTargetElement.dispatchEvent(new dd({relatedTarget:i})));for(let e of t)e.setAttribute("aria-expanded",`${!e.submenuElement.hidden}`);dv(this,mv,mb).call(this,!0)},mA=new WeakSet,mk=function(){let e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)},mw=new WeakSet,mS=function(e){var t;r2(this,e.relatedTarget)||(dh(this,h9)&&(null==(t=dh(this,h2))||t.focus()),dh(this,h3)&&dh(this,h3)!==e.relatedTarget&&!this.hidden&&(this.hidden=!0))},mI=new WeakSet,mC=function(e){var t,i,a,r,n;let{key:s,ctrlKey:o,altKey:l,metaKey:d}=e;if(!o&&!l&&!d&&this.keysUsed.includes(s))if(e.preventDefault(),e.stopPropagation(),"Tab"===s){if(dh(this,h9)){this.hidden=!0;return}e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()}else"Escape"===s?(null==(n=dh(this,h2))||n.focus(),dh(this,h9)&&(this.hidden=!0)):"Enter"===s||" "===s?this.handleSelect(e):this.handleMove(e)},mR=new WeakSet,mL=function(e){return e.composedPath().find(e=>["menuitemradio","menuitemcheckbox"].includes(e.role))},mM=new WeakSet,mx=function(){return this.items.find(e=>0===e.tabIndex)},mD=new WeakSet,mP=function(e){for(let t of this.items)t.tabIndex=t===e?0:-1},mO=new WeakSet,mN=function(e,t){let i=[...this.checkedItems];"radio"===e.type&&this.radioGroupItems.forEach(e=>e.checked=!1),t?e.checked=!e.checked:e.checked=!0,this.checkedItems.some((e,t)=>e!=i[t])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))},d_.shadowRootOptions={mode:"open"},d_.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex) !important;
        
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container" part="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `},rF.customElements.get("media-chrome-menu")||rF.customElements.define("media-chrome-menu",d_);var dk=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},dw=(e,t,i)=>(dk(e,t,"read from private field"),i?i.call(e):t.get(e)),dS=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},dI=(e,t,i,a)=>(dk(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),dC=(e,t,i)=>(dk(e,t,"access private method"),i);let dR="type",dL="value",dM="checked",dx="disabled";class dD extends rF.HTMLElement{constructor(){if(super(),dS(this,mB),dS(this,m$),dS(this,mV),dS(this,mj),dS(this,mG),dS(this,mz),dS(this,mU,!1),dS(this,mH,void 0),dS(this,mK,()=>{var e,t;this.submenuElement.items&&this.setAttribute("submenusize",`${this.submenuElement.items.length}`);let i=this.shadowRoot.querySelector('slot[name="description"]'),a=null==(e=this.submenuElement.checkedItems)?void 0:e[0],r=null!=(t=null==a?void 0:a.dataset.description)?t:null==a?void 0:a.text,n=rK.createElement("span");n.textContent=null!=r?r:"",i.replaceChildren(n)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=rZ(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.shadowRoot.addEventListener("slotchange",this)}static get observedAttributes(){return[dR,dx,dM,dL]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),dP(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":dC(this,mB,mW).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":dC(this,mG,mQ).call(this,e);break;case"keyup":dC(this,mj,mY).call(this,e)}}attributeChangedCallback(e,t,i){e===dM&&dP(this)&&!dw(this,mU)?this.setAttribute("aria-checked",null!=i?"true":"false"):e===dR&&i!==t?this.role="menuitem"+i:e===dx&&i!==t&&(null==i?this.enable():this.disable())}connectedCallback(){this.hasAttribute(dx)||this.enable(),this.role="menuitem"+this.type,dI(this,mH,function e(t,i){if(!t)return null;let{host:a}=t.getRootNode();return!i&&a?e(t,a):(null==i?void 0:i.items)?i:e(i,null==i?void 0:i.parentNode)}(this,this.parentNode)),dC(this,mz,mZ).call(this),this.submenuElement&&dC(this,m$,mq).call(this)}disconnectedCallback(){this.disable(),dC(this,mz,mZ).call(this),dI(this,mH,null)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?null==(e=r5(this))?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return null!=(e=this.getAttribute(dR))?e:""}set type(e){this.setAttribute(dR,`${e}`)}get value(){var e;return null!=(e=this.getAttribute(dL))?e:this.text}set value(e){this.setAttribute(dL,e)}get text(){var e;return(null!=(e=this.textContent)?e:"").trim()}get checked(){if(dP(this))return"true"===this.getAttribute("aria-checked")}set checked(e){dP(this)&&(dI(this,mU,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){!dP(this)&&this.invokeTargetElement&&r2(this,e.target)&&this.invokeTargetElement.dispatchEvent(new dd({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}}function dP(e){return"radio"===e.type||"checkbox"===e.type}mU=new WeakMap,mH=new WeakMap,mB=new WeakSet,mW=function(e){let t=e.target;if(!(null==t?void 0:t.name))for(let e of t.assignedNodes({flatten:!0}))e instanceof Text&&""===e.textContent.trim()&&e.remove();"submenu"===t.name&&(this.submenuElement?dC(this,m$,mq).call(this):dC(this,mV,mF).call(this))},m$=new WeakSet,mq=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",dw(this,mK)),this.submenuElement.addEventListener("addmenuitem",dw(this,mK)),this.submenuElement.addEventListener("removemenuitem",dw(this,mK)),dw(this,mK).call(this)},mV=new WeakSet,mF=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",dw(this,mK)),this.submenuElement.removeEventListener("addmenuitem",dw(this,mK)),this.submenuElement.removeEventListener("removemenuitem",dw(this,mK)),dw(this,mK).call(this)},mK=new WeakMap,mj=new WeakSet,mY=function(e){let{key:t}=e;this.keysUsed.includes(t)?this.handleClick(e):this.removeEventListener("keyup",dC(this,mj,mY))},mG=new WeakSet,mQ=function(e){let{metaKey:t,altKey:i,key:a}=e;t||i||!this.keysUsed.includes(a)?this.removeEventListener("keyup",dC(this,mj,mY)):this.addEventListener("keyup",dC(this,mj,mY),{once:!0})},mz=new WeakSet,mZ=function(){var e;let t=null==(e=dw(this,mH))?void 0:e.radioGroupItems;if(!t)return;let i=t.filter(e=>"true"===e.getAttribute("aria-checked")).pop();for(let e of(i||(i=t[0]),t))e.setAttribute("aria-checked","false");null==i||i.setAttribute("aria-checked","true")},dD.shadowRootOptions={mode:"open"},dD.getTemplateHTML=function(e){return`
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(e)}
    </slot>
    <slot name="submenu"></slot>
  `},dD.getSuffixSlotInnerHTML=function(e){return""},rF.customElements.get("media-chrome-menu-item")||rF.customElements.define("media-chrome-menu-item",dD);class dO extends d_{get anchorElement(){return"auto"!==this.anchor?super.anchorElement:rX(this).querySelector("media-settings-menu-button")}}dO.getTemplateHTML=function(e){return`
    ${d_.getTemplateHTML(e)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([role="menu"]) {
        
        justify-content: end;
      }

      slot:not([name]) {
        justify-content: var(--media-settings-menu-justify-content);
        flex-direction: var(--media-settings-menu-flex-direction, column);
        overflow: visible;
      }

      #container.has-expanded {
        --media-settings-menu-item-opacity: 0;
      }
    </style>
  `},rF.customElements.get("media-settings-menu")||rF.customElements.define("media-settings-menu",dO);class dN extends dD{}dN.shadowRootOptions={mode:"open"},dN.getTemplateHTML=function(e){return`
    ${dD.getTemplateHTML.call(this,e)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `},dN.getSuffixSlotInnerHTML=function(e){return`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `},rF.customElements.get("media-settings-menu-item")||rF.customElements.define("media-settings-menu-item",dN);class dU extends sY{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?null==(e=r5(this))?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;null==(e=this.invokeTargetElement)||e.dispatchEvent(new dd({relatedTarget:this}))}}rF.customElements.get("media-chrome-menu-button")||rF.customElements.define("media-chrome-menu-button",dU);class dH extends dU{static get observedAttributes(){return[...super.observedAttributes,"target"]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",rN("settings"))}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:rX(this).querySelector("media-settings-menu")}}dH.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `},dH.getTooltipContentHTML=function(){return rN("Settings")},rF.customElements.get("media-settings-menu-button")||rF.customElements.define("media-settings-menu-button",dH);var dB=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},dW=(e,t,i)=>(dB(e,t,"read from private field"),i?i.call(e):t.get(e)),d$=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},dq=(e,t,i,a)=>(dB(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),dV=(e,t,i)=>(dB(e,t,"access private method"),i);mX=new WeakMap,mJ=new WeakMap,m0=new WeakSet,m1=function(){if(dW(this,mJ)===JSON.stringify(this.mediaAudioTrackList))return;dq(this,mJ,JSON.stringify(this.mediaAudioTrackList));let e=this.mediaAudioTrackList;for(let t of(this.defaultSlot.textContent="",e.sort((e,t)=>e.id.localeCompare(t.id,void 0,{numeric:!0})),e)){let e=db({type:"radio",text:this.formatMenuItemText(t.label,t),value:`${t.id}`,checked:t.enabled});e.prepend(dg(this,"checked-indicator")),this.defaultSlot.append(e)}},m2=new WeakSet,m3=function(){if(null==this.value)return;let e=new rF.CustomEvent(rd.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},rF.customElements.get("media-audio-track-menu")||rF.customElements.define("media-audio-track-menu",class extends d_{constructor(){super(...arguments),d$(this,m0),d$(this,m2),d$(this,mX,[]),d$(this,mJ,void 0)}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_AUDIO_TRACK_LIST,rm.MEDIA_AUDIO_TRACK_ENABLED,rm.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===rm.MEDIA_AUDIO_TRACK_ENABLED&&t!==i)this.value=i;else if(e===rm.MEDIA_AUDIO_TRACK_LIST&&t!==i){var a;dq(this,mX,null==(a=null!=i?i:"")?void 0:a.split(/\s+/).map(rS)),dV(this,m0,m1).call(this)}}connectedCallback(){super.connectedCallback(),this.addEventListener("change",dV(this,m2,m3))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",dV(this,m2,m3))}get anchorElement(){var e;return"auto"!==this.anchor?super.anchorElement:null==(e=rX(this))?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return dW(this,mX)}set mediaAudioTrackList(e){dq(this,mX,e),dV(this,m0,m1).call(this)}get mediaAudioTrackEnabled(){var e;return null!=(e=na(this,rm.MEDIA_AUDIO_TRACK_ENABLED))?e:""}set mediaAudioTrackEnabled(e){nr(this,rm.MEDIA_AUDIO_TRACK_ENABLED,e)}});let dF=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`,dK=e=>{let t=rN("Audio");e.setAttribute("aria-label",t)};class dj extends dU{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_AUDIO_TRACK_ENABLED,rm.MEDIA_AUDIO_TRACK_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),dK(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_LANG&&dK(this)}get invokeTargetElement(){var e;return void 0!=this.invokeTarget?super.invokeTargetElement:null==(e=rX(this))?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return null!=(e=na(this,rm.MEDIA_AUDIO_TRACK_ENABLED))?e:""}set mediaAudioTrackEnabled(e){nr(this,rm.MEDIA_AUDIO_TRACK_ENABLED,e)}}dj.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${dF}</slot>
  `},dj.getTooltipContentHTML=function(){return rN("Audio")},rF.customElements.get("media-audio-track-menu-button")||rF.customElements.define("media-audio-track-menu-button",dj);var dY=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},dG=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},dQ=(e,t,i)=>(dY(e,t,"access private method"),i);let dz=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`;class dZ extends d_{constructor(){super(...arguments),dG(this,m5),dG(this,m8),dG(this,m4,void 0)}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_SUBTITLES_LIST,rm.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_SUBTITLES_LIST&&t!==i?dQ(this,m5,m9).call(this):e===rm.MEDIA_SUBTITLES_SHOWING&&t!==i&&(this.value=i||"",dQ(this,m5,m9).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",dQ(this,m8,m6))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",dQ(this,m8,m6))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:rX(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return dX(this,rm.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){dJ(this,rm.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return dX(this,rm.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){dJ(this,rm.MEDIA_SUBTITLES_SHOWING,e)}}m4=new WeakMap,m5=new WeakSet,m9=function(){var e,t,i,a,r,n;let s=(dY(this,t=m4,"read from private field"),(i?i.call(this):t.get(this))!==JSON.stringify(this.mediaSubtitlesList)),o=this.value!==this.getAttribute(rm.MEDIA_SUBTITLES_SHOWING);if(!s&&!o)return;a=m4,r=JSON.stringify(this.mediaSubtitlesList),dY(this,a,"write to private field"),n?n.call(this,r):a.set(this,r),this.defaultSlot.textContent="";let l=!this.value,d=db({type:"radio",text:this.formatMenuItemText(rN("Off")),value:"off",checked:l});for(let t of(d.prepend(dg(this,"checked-indicator")),this.defaultSlot.append(d),this.mediaSubtitlesList)){let i=db({type:"radio",text:this.formatMenuItemText(t.label,t),value:nD(t),checked:this.value==nD(t)});i.prepend(dg(this,"checked-indicator")),"captions"===(null!=(e=t.kind)?e:"subs")&&i.append(dg(this,"captions-indicator")),this.defaultSlot.append(i)}},m8=new WeakSet,m6=function(){let e=this.mediaSubtitlesShowing,t=this.getAttribute(rm.MEDIA_SUBTITLES_SHOWING),i=this.value!==t;if((null==e?void 0:e.length)&&i&&this.dispatchEvent(new rF.CustomEvent(rd.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:e})),!this.value||!i)return;let a=new rF.CustomEvent(rd.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)},dZ.getTemplateHTML=function(e){return`
    ${d_.getTemplateHTML(e)}
    <slot name="captions-indicator" hidden>${dz}</slot>
  `};let dX=(e,t)=>{let i=e.getAttribute(t);return i?nM(i):[]},dJ=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=nP(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};rF.customElements.get("media-captions-menu")||rF.customElements.define("media-captions-menu",dZ);let d0=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,d1=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,d2=e=>{e.setAttribute("data-captions-enabled",nH(e).toString())},d3=e=>{e.setAttribute("aria-label",rN("closed captions"))};class d4 extends dU{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_SUBTITLES_LIST,rm.MEDIA_SUBTITLES_SHOWING,rm.MEDIA_LANG]}connectedCallback(){super.connectedCallback(),d3(this),d2(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_SUBTITLES_SHOWING?d2(this):e===rm.MEDIA_LANG&&d3(this)}get invokeTargetElement(){var e;return void 0!=this.invokeTarget?super.invokeTargetElement:null==(e=rX(this))?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return d5(this,rm.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){d9(this,rm.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return d5(this,rm.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){d9(this,rm.MEDIA_SUBTITLES_SHOWING,e)}}d4.getSlotTemplateHTML=function(){return`
    <style>
      :host([data-captions-enabled="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([data-captions-enabled="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${d0}</slot>
      <slot name="off">${d1}</slot>
    </slot>
  `},d4.getTooltipContentHTML=function(){return rN("Captions")};let d5=(e,t)=>{let i=e.getAttribute(t);return i?nM(i):[]},d9=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=nP(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};rF.customElements.get("media-captions-menu-button")||rF.customElements.define("media-captions-menu-button",d4);var d8=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},d6=(e,t,i)=>(d8(e,t,"read from private field"),i?i.call(e):t.get(e)),d7=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ue=(e,t,i)=>(d8(e,t,"access private method"),i);let ut="rates";m7=new WeakMap,pe=new WeakSet,pt=function(){this.defaultSlot.textContent="";let e=this.mediaPlaybackRate,t=new Set(Array.from(d6(this,m7)).map(e=>Number(e)));for(let i of(e>0&&!t.has(e)&&t.add(e),Array.from(t).sort((e,t)=>e-t))){let t=db({type:"radio",text:this.formatMenuItemText(`${i}x`,i),value:i.toString(),checked:e===i});t.prepend(dg(this,"checked-indicator")),this.defaultSlot.append(t)}},pi=new WeakSet,pa=function(){if(!this.value)return;let e=new rF.CustomEvent(rd.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},rF.customElements.get("media-playback-rate-menu")||rF.customElements.define("media-playback-rate-menu",class extends d_{constructor(){super(),d7(this,pe),d7(this,pi),d7(this,m7,new nR(this,ut,{defaultValue:o4})),ue(this,pe,pt).call(this)}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PLAYBACK_RATE,ut]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===rm.MEDIA_PLAYBACK_RATE&&t!=i?(this.value=i,ue(this,pe,pt).call(this)):e===ut&&t!=i&&(d6(this,m7).value=i,ue(this,pe,pt).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",ue(this,pi,pa))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",ue(this,pi,pa))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:rX(this).querySelector("media-playback-rate-menu-button")}get rates(){return d6(this,m7)}set rates(e){e?Array.isArray(e)?d6(this,m7).value=e.join(" "):"string"==typeof e&&(d6(this,m7).value=e):d6(this,m7).value="",ue(this,pe,pt).call(this)}get mediaPlaybackRate(){return r7(this,rm.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ne(this,rm.MEDIA_PLAYBACK_RATE,e)}});class ui extends dU{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_PLAYBACK_RATE]}constructor(){var e;super(),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===rm.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",rN("Playback rate {playbackRate}",{playbackRate:t}))}}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:rX(this).querySelector("media-playback-rate-menu")}get mediaPlaybackRate(){return r7(this,rm.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ne(this,rm.MEDIA_PLAYBACK_RATE,e)}}ui.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
      
      :host([aria-expanded="true"]) slot {
        display: block;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},ui.getTooltipContentHTML=function(){return rN("Playback rate")},rF.customElements.get("media-playback-rate-menu-button")||rF.customElements.define("media-playback-rate-menu-button",ui);var ua=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ur=(e,t,i)=>(ua(e,t,"read from private field"),i?i.call(e):t.get(e)),un=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},us=(e,t,i,a)=>(ua(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),uo=(e,t,i)=>(ua(e,t,"access private method"),i);pr=new WeakMap,pn=new WeakMap,ps=new WeakSet,po=function(){if(ur(this,pn).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&ur(this,pn).mediaHeight===this.mediaHeight)return;ur(this,pn).mediaRenditionList=JSON.stringify(this.mediaRenditionList),ur(this,pn).mediaHeight=this.mediaHeight;let e=this.mediaRenditionList.sort(this.compareRendition.bind(this)),t=e.find(e=>e.id===this.mediaRenditionSelected);for(let i of e)i.selected=i===t;this.defaultSlot.textContent="";let i=!this.mediaRenditionSelected;for(let t of e){let e=db({type:"radio",text:this.formatRendition(t,{showBitrate:this.showRenditionBitrate(t)}),value:`${t.id}`,checked:t.selected&&!i});e.prepend(dg(this,"checked-indicator")),this.defaultSlot.append(e)}let a=t&&this.showRenditionBitrate(t),r=i?t?this.formatMenuItemText(`${rN("Auto")} \u2022 ${this.formatRendition(t,{showBitrate:a})}`,t):this.formatMenuItemText(`${rN("Auto")} (${this.mediaHeight}p)`):this.formatMenuItemText(rN("Auto")),n=db({type:"radio",text:r,value:"auto",checked:i});n.dataset.description=r,n.prepend(dg(this,"checked-indicator")),this.defaultSlot.append(n)},pl=new WeakSet,pd=function(){if(null==this.value)return;let e=new rF.CustomEvent(rd.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},rF.customElements.get("media-rendition-menu")||rF.customElements.define("media-rendition-menu",class extends d_{constructor(){super(...arguments),un(this,ps),un(this,pl),un(this,pr,[]),un(this,pn,{})}static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_RENDITION_LIST,rm.MEDIA_RENDITION_SELECTED,rm.MEDIA_RENDITION_UNAVAILABLE,rm.MEDIA_HEIGHT]}static formatMenuItemText(e,t){return super.formatMenuItemText(e,t)}static formatRendition(e,{showBitrate:t=!1}={}){let i=`${Math.min(e.width,e.height)}p`;if(t&&e.bitrate){let t=e.bitrate/1e6,a=`${t.toFixed(+(t<1))} Mbps`;return`${i} (${a})`}return this.formatMenuItemText(i,e)}static compareRendition(e,t){var i,a;return t.height===e.height?(null!=(i=t.bitrate)?i:0)-(null!=(a=e.bitrate)?a:0):t.height-e.height}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===rm.MEDIA_RENDITION_SELECTED&&t!==i)this.value=null!=i?i:"auto",uo(this,ps,po).call(this);else if(e===rm.MEDIA_RENDITION_LIST&&t!==i)us(this,pr,null==i?void 0:i.split(/\s+/).map(rk)),uo(this,ps,po).call(this);else e===rm.MEDIA_HEIGHT&&t!==i&&uo(this,ps,po).call(this)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",uo(this,pl,pd))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",uo(this,pl,pd))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:rX(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return ur(this,pr)}set mediaRenditionList(e){us(this,pr,e),uo(this,ps,po).call(this)}get mediaRenditionSelected(){return na(this,rm.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){nr(this,rm.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return r7(this,rm.MEDIA_HEIGHT)}set mediaHeight(e){ne(this,rm.MEDIA_HEIGHT,e)}compareRendition(e,t){return this.constructor.compareRendition(e,t)}formatMenuItemText(e,t){return this.constructor.formatMenuItemText(e,t)}formatRendition(e,t){return this.constructor.formatRendition(e,t)}showRenditionBitrate(e){return this.mediaRenditionList.some(t=>t!==e&&t.height===e.height&&t.bitrate!==e.bitrate)}});let ul=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;class ud extends dU{static get observedAttributes(){return[...super.observedAttributes,rm.MEDIA_RENDITION_SELECTED,rm.MEDIA_RENDITION_UNAVAILABLE,rm.MEDIA_HEIGHT]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",rN("quality"))}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:rX(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return na(this,rm.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){nr(this,rm.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return r7(this,rm.MEDIA_HEIGHT)}set mediaHeight(e){ne(this,rm.MEDIA_HEIGHT,e)}}ud.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${ul}</slot>
  `},ud.getTooltipContentHTML=function(){return rN("Quality")},rF.customElements.get("media-rendition-menu-button")||rF.customElements.define("media-rendition-menu-button",ud);var uu=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},uc=(e,t,i)=>(uu(e,t,"read from private field"),i?i.call(e):t.get(e)),uh=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},um=(e,t,i,a)=>(uu(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),up=(e,t,i)=>(uu(e,t,"access private method"),i);class uv extends d_{constructor(){super(),uh(this,pc),uh(this,pm),uh(this,pv),uh(this,pg),uh(this,py),uh(this,pu,!1),uh(this,pE,e=>{let t=e.target,i=(null==t?void 0:t.nodeName)==="VIDEO",a=up(this,pg,pf).call(this,t);(i||a)&&(uc(this,pu)?up(this,pm,pp).call(this):up(this,py,p_).call(this,e))}),uh(this,pT,e=>{let t=e.target,i=this.contains(t),a=2===e.button,r=(null==t?void 0:t.nodeName)==="VIDEO",n=up(this,pg,pf).call(this,t);i||a&&(r||n)||up(this,pm,pp).call(this)}),uh(this,pA,e=>{"Escape"===e.key&&up(this,pm,pp).call(this)}),uh(this,pk,e=>{var t,i;let a=e.target;if(null==(t=a.matches)?void 0:t.call(a,'button[invoke="copy"]')){let e=null==(i=a.closest("media-context-menu-item"))?void 0:i.querySelector('input[slot="copy"]');e&&navigator.clipboard.writeText(e.value)}up(this,pm,pp).call(this)}),this.setAttribute("noautohide",""),up(this,pc,ph).call(this)}connectedCallback(){super.connectedCallback(),rX(this).addEventListener("contextmenu",uc(this,pE)),this.addEventListener("click",uc(this,pk))}disconnectedCallback(){super.disconnectedCallback(),rX(this).removeEventListener("contextmenu",uc(this,pE)),this.removeEventListener("click",uc(this,pk)),document.removeEventListener("mousedown",uc(this,pT)),document.removeEventListener("keydown",uc(this,pA))}}pu=new WeakMap,pc=new WeakSet,ph=function(){this.hidden=!uc(this,pu)},pm=new WeakSet,pp=function(){um(this,pu,!1),up(this,pc,ph).call(this)},pv=new WeakSet,pb=function(){document.querySelectorAll("media-context-menu").forEach(e=>{e!==this&&up(e,pm,pp).call(e)})},pg=new WeakSet,pf=function(e){return!!e&&(!!e.hasAttribute("slot")&&"media"===e.getAttribute("slot")||!!(e.nodeName.includes("-")&&e.tagName.includes("-"))&&(e.hasAttribute("src")||e.hasAttribute("poster")||e.hasAttribute("preload")||e.hasAttribute("playsinline")))},pE=new WeakMap,py=new WeakSet,p_=function(e){e.preventDefault(),up(this,pv,pb).call(this),um(this,pu,!0),this.style.position="fixed",this.style.left=`${e.clientX}px`,this.style.top=`${e.clientY}px`,up(this,pc,ph).call(this),document.addEventListener("mousedown",uc(this,pT),{once:!0}),document.addEventListener("keydown",uc(this,pA),{once:!0})},pT=new WeakMap,pA=new WeakMap,pk=new WeakMap,uv.getTemplateHTML=function(e){return`
      ${d_.getTemplateHTML(e)}
      <style>
        :host {
          --_menu-bg: rgb(20 20 30 / .8);
          background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
          min-width: var(--media-settings-menu-min-width, 170px);
          border-radius: 2px;
          overflow: hidden;
        }
      </style>
    `},rF.customElements.get("media-context-menu")||rF.customElements.define("media-context-menu",uv);class ub extends dD{}ub.shadowRootOptions={mode:"open"},ub.getTemplateHTML=function(e){return`
    ${dD.getTemplateHTML.call(this,e)}
    <style>
        ::slotted(*) {
            color: var(--media-text-color, white);
            text-decoration: none;
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
            min-height: var(--media-control-height, 24px);
        }
    </style>
  `},rF.customElements.get("media-context-menu-item")||rF.customElements.define("media-context-menu-item",ub);var ug=e=>{throw TypeError(e)},uf=(e,t,i)=>t.has(e)||ug("Cannot "+i),uE=(e,t,i)=>(uf(e,t,"read from private field"),i?i.call(e):t.get(e)),uy=(e,t,i)=>t.has(e)?ug("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),u_=(e,t,i,a)=>(uf(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),uT=(e,t,i)=>(uf(e,t,"access private method"),i),uA=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends uA{});var uk,uw,uS,uI,uC,uR,uL,uM,ux,uD,uP,uO,uN,uU,uH,uB,uW,u$,uq,uV,uF,uK,uj,uY,uG,uQ,uz,uZ,uX,uJ,u0,u1,u2,u3,u4,u5,u9,u8,u6,u7,ce,ct,ci,ca,cr,cn,cs,co,cl,cd,cu,cc,ch,cm,cp,cv,cb,cg,cf,cE,cy,c_,cT,cA,ck,cw,cS,cI,cC,cR,cL,cM,cx,cD,cP,cO,cN,cU,cH,cB,cW,c$,cq,cV,cF,cK,cj,cY,cG,cQ,cz,cZ,cX,cJ,c0,c1,c2,c3,c4,c5,c9,c8,c6,c7,he,ht,hi,ha,hr,hn,hs,ho,hl,hd,hu,hc,hh,hm,hp,hv,hb,hg,hf,hE,hy,h_,hT,hA,hk,hw,hS,hI,hC,hR,hL,hM,hx,hD,hP,hO,hN,hU,hH,hB,hW,h$,hq,hV,hF,hK,hj,hY,hG,hQ,hz,hZ,hX,hJ,h0,h1,h2,h3,h4,h5,h9,h8,h6,h7,me,mt,mi,ma,mr,mn,ms,mo,ml,md,mu,mc,mh,mm,mp,mv,mb,mg,mf,mE,my,m_,mT,mA,mk,mw,mS,mI,mC,mR,mL,mM,mx,mD,mP,mO,mN,mU,mH,mB,mW,m$,mq,mV,mF,mK,mj,mY,mG,mQ,mz,mZ,mX,mJ,m0,m1,m2,m3,m4,m5,m9,m8,m6,m7,pe,pt,pi,pa,pr,pn,ps,po,pl,pd,pu,pc,ph,pm,pp,pv,pb,pg,pf,pE,py,p_,pT,pA,pk,pw,pS=class extends uA{},pI=class{constructor(e,t={}){uy(this,pw),u_(this,pw,null==t?void 0:t.detail)}get detail(){return uE(this,pw)}initCustomEvent(){}};pw=new WeakMap;var pC={document:{createElement:function(e,t){return new pS}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(pS)},CustomEvent:pI,EventTarget:uA,HTMLElement:pS,HTMLVideoElement:class extends uA{}},pR="u"<typeof window||void 0===globalThis.customElements,pL=pR?pC:globalThis,pM=pR?pC.document:globalThis.document;function px(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function pD(e){return e.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase())}function pP(e){if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}function pO(e){let t=(function(e){let t={};for(let i in e)null!=e[i]&&(t[i]=e[i]);return new URLSearchParams(t)})(e).toString();return t?"?"+t:""}var pN,pU,pH,pB=(e,t)=>!!e&&!!t&&(!!e.contains(t)||pB(e,t.getRootNode().host)),pW="mux.com",p$=(()=>{try{return"3.11.5"}catch{}return"UNKNOWN"})(),pq=e=>{if(e){if([tF,tV].includes(e))return e;if(null!=e&&e.includes("live"))return tF}},pV={crossorigin:"crossOrigin",playsinline:"playsInline"},pF=class{constructor(e,t){uy(this,pN),uy(this,pU),uy(this,pH,[]),u_(this,pN,e),u_(this,pU,t)}[Symbol.iterator](){return uE(this,pH).values()}get length(){return uE(this,pH).length}get value(){var e;return null!=(e=uE(this,pH).join(" "))?e:""}set value(e){var t;e!==this.value&&(u_(this,pH,[]),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return uE(this,pH)[e]}values(){return uE(this,pH).values()}keys(){return uE(this,pH).keys()}forEach(e){uE(this,pH).forEach(e)}add(...e){var t,i;e.forEach(e=>{this.contains(e)||uE(this,pH).push(e)}),(""!==this.value||null!=(t=uE(this,pN))&&t.hasAttribute(`${uE(this,pU)}`))&&null!=(i=uE(this,pN))&&i.setAttribute(`${uE(this,pU)}`,`${this.value}`)}remove(...e){var t;e.forEach(e=>{uE(this,pH).splice(uE(this,pH).indexOf(e),1)}),null==(t=uE(this,pN))||t.setAttribute(`${uE(this,pU)}`,`${this.value}`)}contains(e){return uE(this,pH).includes(e)}toggle(e,t){return void 0!==t?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){this.remove(e),this.add(t)}};pN=new WeakMap,pU=new WeakMap,pH=new WeakMap;var pK=`[mux-player ${p$}]`;function pj(...e){console.warn(pK,...e)}function pY(...e){console.error(pK,...e)}function pG(e){var t;let i=null!=(t=e.message)?t:"";e.context&&(i+=` ${e.context}`),e.file&&(i+=` ${t8("Read more: ")}
https://github.com/muxinc/elements/blob/main/errors/${e.file}`),pj(i)}var pQ={AUTOPLAY:"autoplay",CROSSORIGIN:"crossorigin",LOOP:"loop",MUTED:"muted",PLAYSINLINE:"playsinline",PRELOAD:"preload"},pz={VOLUME:"volume",PLAYBACKRATE:"playbackrate",MUTED:"muted"},pZ=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}}),pX=[...Object.values(pQ).filter(e=>pQ.PLAYSINLINE!==e),...Object.values(pz)];function pJ(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}var p0=class extends pL.HTMLElement{static get observedAttributes(){return pX}constructor(){super()}attributeChangedCallback(e,t,i){var a,r;switch(e){case pz.MUTED:this.media&&(this.media.muted=null!=i,this.media.defaultMuted=null!=i);return;case pz.VOLUME:{let e=null!=(a=pP(i))?a:1;this.media&&(this.media.volume=e);return}case pz.PLAYBACKRATE:{let e=null!=(r=pP(i))?r:1;this.media&&(this.media.playbackRate=e,this.media.defaultPlaybackRate=e);return}}}play(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.play())?t:Promise.reject()}pause(){var e;null==(e=this.media)||e.pause()}load(){var e;null==(e=this.media)||e.load()}get media(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("mux-video")}get audioTracks(){return this.media.audioTracks}get videoTracks(){return this.media.videoTracks}get audioRenditions(){return this.media.audioRenditions}get videoRenditions(){return this.media.videoRenditions}get paused(){var e,t;return null==(t=null==(e=this.media)?void 0:e.paused)||t}get duration(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.duration)?t:NaN}get ended(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.ended)&&t}get buffered(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.buffered)?t:pZ}get seekable(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.seekable)?t:pZ}get readyState(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.readyState)?t:0}get videoWidth(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoWidth)?t:0}get videoHeight(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoHeight)?t:0}get currentSrc(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentSrc)?t:""}get currentTime(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentTime)?t:0}set currentTime(e){this.media&&(this.media.currentTime=Number(e))}get volume(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.volume)?t:1}set volume(e){this.media&&(this.media.volume=Number(e))}get playbackRate(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.playbackRate)?t:1}set playbackRate(e){this.media&&(this.media.playbackRate=Number(e))}get defaultPlaybackRate(){var e;return null!=(e=pP(this.getAttribute(pz.PLAYBACKRATE)))?e:1}set defaultPlaybackRate(e){null!=e?this.setAttribute(pz.PLAYBACKRATE,`${e}`):this.removeAttribute(pz.PLAYBACKRATE)}get crossOrigin(){return pJ(this,pQ.CROSSORIGIN)}set crossOrigin(e){this.setAttribute(pQ.CROSSORIGIN,`${e}`)}get autoplay(){return null!=pJ(this,pQ.AUTOPLAY)}set autoplay(e){e?this.setAttribute(pQ.AUTOPLAY,"string"==typeof e?e:""):this.removeAttribute(pQ.AUTOPLAY)}get loop(){return null!=pJ(this,pQ.LOOP)}set loop(e){e?this.setAttribute(pQ.LOOP,""):this.removeAttribute(pQ.LOOP)}get muted(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.muted)&&t}set muted(e){this.media&&(this.media.muted=!!e)}get defaultMuted(){return null!=pJ(this,pQ.MUTED)}set defaultMuted(e){e?this.setAttribute(pQ.MUTED,""):this.removeAttribute(pQ.MUTED)}get playsInline(){return null!=pJ(this,pQ.PLAYSINLINE)}set playsInline(e){pY("playsInline is set to true by default and is not currently supported as a setter.")}get preload(){return this.media?this.media.preload:this.getAttribute("preload")}set preload(e){["","none","metadata","auto"].includes(e)?this.setAttribute(pQ.PRELOAD,e):this.removeAttribute(pQ.PRELOAD)}},p1=`:host {
  --media-control-display: var(--controls);
  --media-loading-indicator-display: var(--loading-indicator);
  --media-dialog-display: var(--dialog);
  --media-play-button-display: var(--play-button);
  --media-live-button-display: var(--live-button);
  --media-seek-backward-button-display: var(--seek-backward-button);
  --media-seek-forward-button-display: var(--seek-forward-button);
  --media-mute-button-display: var(--mute-button);
  --media-captions-button-display: var(--captions-button);
  --media-captions-menu-button-display: var(--captions-menu-button, var(--media-captions-button-display));
  --media-rendition-menu-button-display: var(--rendition-menu-button);
  --media-audio-track-menu-button-display: var(--audio-track-menu-button);
  --media-airplay-button-display: var(--airplay-button);
  --media-pip-button-display: var(--pip-button);
  --media-fullscreen-button-display: var(--fullscreen-button);
  --media-cast-button-display: var(--cast-button, var(--_cast-button-drm-display));
  --media-playback-rate-button-display: var(--playback-rate-button);
  --media-playback-rate-menu-button-display: var(--playback-rate-menu-button);
  --media-volume-range-display: var(--volume-range);
  --media-time-range-display: var(--time-range);
  --media-time-display-display: var(--time-display);
  --media-duration-display-display: var(--duration-display);
  --media-title-display-display: var(--title-display);

  display: inline-block;
  line-height: 0;
  width: 100%;
}

a {
  color: #fff;
  font-size: 0.9em;
  text-decoration: underline;
}

media-theme {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
  direction: ltr;
}

media-poster-image {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
}

media-poster-image:not([src]):not([placeholdersrc]) {
  display: none;
}

::part(top),
[part~='top'] {
  --media-control-display: var(--controls, var(--top-controls));
  --media-play-button-display: var(--play-button, var(--top-play-button));
  --media-live-button-display: var(--live-button, var(--top-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--top-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--top-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--top-mute-button));
  --media-captions-button-display: var(--captions-button, var(--top-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--top-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--top-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--top-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--top-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--top-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--top-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--top-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--top-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --captions-menu-button,
    var(--media-playback-rate-button-display, var(--top-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--top-volume-range));
  --media-time-range-display: var(--time-range, var(--top-time-range));
  --media-time-display-display: var(--time-display, var(--top-time-display));
  --media-duration-display-display: var(--duration-display, var(--top-duration-display));
  --media-title-display-display: var(--title-display, var(--top-title-display));
}

::part(center),
[part~='center'] {
  --media-control-display: var(--controls, var(--center-controls));
  --media-play-button-display: var(--play-button, var(--center-play-button));
  --media-live-button-display: var(--live-button, var(--center-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--center-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--center-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--center-mute-button));
  --media-captions-button-display: var(--captions-button, var(--center-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--center-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--center-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--center-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--center-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--center-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--center-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--center-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--center-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--center-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--center-volume-range));
  --media-time-range-display: var(--time-range, var(--center-time-range));
  --media-time-display-display: var(--time-display, var(--center-time-display));
  --media-duration-display-display: var(--duration-display, var(--center-duration-display));
}

::part(bottom),
[part~='bottom'] {
  --media-control-display: var(--controls, var(--bottom-controls));
  --media-play-button-display: var(--play-button, var(--bottom-play-button));
  --media-live-button-display: var(--live-button, var(--bottom-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--bottom-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--bottom-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--bottom-mute-button));
  --media-captions-button-display: var(--captions-button, var(--bottom-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--bottom-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--bottom-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--bottom-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--bottom-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--bottom-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--bottom-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--bottom-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--bottom-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--bottom-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--bottom-volume-range));
  --media-time-range-display: var(--time-range, var(--bottom-time-range));
  --media-time-display-display: var(--time-display, var(--bottom-time-display));
  --media-duration-display-display: var(--duration-display, var(--bottom-duration-display));
  --media-title-display-display: var(--title-display, var(--bottom-title-display));
}

:host([no-tooltips]) {
  --media-tooltip-display: none;
}
`,p2=new WeakMap,p3=class e{constructor(e,t){this.element=e,this.type=t,this.element.addEventListener(this.type,this);let i=p2.get(this.element);i&&i.set(this.type,this)}set(e){if("function"==typeof e)this.handleEvent=e.bind(this.element);else if("object"==typeof e&&"function"==typeof e.handleEvent)this.handleEvent=e.handleEvent.bind(e);else{this.element.removeEventListener(this.type,this);let e=p2.get(this.element);e&&e.delete(this.type)}}static for(t){p2.has(t.element)||p2.set(t.element,new Map);let i=t.attributeName.slice(2),a=p2.get(t.element);return a&&a.has(i)?a.get(i):new e(t.element,i)}},p4=new Map,p5=new WeakMap,p9=new WeakMap,p8=class{constructor(e,t,i){this.strings=e,this.values=t,this.processor=i,this.stringsKey=this.strings.join("\x01")}get template(){if(p4.has(this.stringsKey))return p4.get(this.stringsKey);{let e=pM.createElement("template"),t=this.strings.length-1;return e.innerHTML=this.strings.reduce((e,i,a)=>e+i+(a<t?`{{ ${a} }}`:""),""),p4.set(this.stringsKey,e),e}}renderInto(e){var t;let i=this.template;if(p5.get(e)!==i){p5.set(e,i);let t=new lW(i,this.values,this.processor);p9.set(e,t),e instanceof lG?e.replace(...t.children):e.appendChild(t);return}let a=p9.get(e);null==(t=null==a?void 0:a.update)||t.call(a,this.values)}},p6={processCallback(e,t,i){var a;if(i)for(let[e,r]of t)e in i&&function(e,t){(function(e,t){if(e instanceof lY&&t instanceof Element){let i=e.element;return i[e.attributeName]!==t&&(e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),i[e.attributeName]=t),!0}return!1})(e,t)||function(e,t){if("boolean"==typeof t&&e instanceof lY){let i=e.attributeNamespace;return t!==e.element.hasAttributeNS(i,e.attributeName)&&(e.booleanValue=t),!0}return!1}(e,t)||e instanceof lY&&e.attributeName.startsWith("on")&&(p3.for(e).set(t),e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),1)||!1===t&&e instanceof lG&&(e.replace(""),1)||t instanceof p8&&e instanceof lG&&(t.renderInto(e),1)||t instanceof DocumentFragment&&e instanceof lG&&(t.childNodes.length&&e.replace(...t.childNodes),1)||function(e,t){if(e instanceof lY){let i=e.attributeNamespace,a=e.element.getAttributeNS(i,e.attributeName);return String(t)!==a&&(e.value=String(t))}e.value=String(t)}(e,t)}(r,null!=(a=i[e])?a:"")}};function p7(e,...t){return new p8(e,t,p6)}var ve=Object.values({TOP:"top",CENTER:"center",BOTTOM:"bottom",LAYER:"layer",MEDIA_LAYER:"media-layer",POSTER_LAYER:"poster-layer",VERTICAL_LAYER:"vertical-layer",CENTERED_LAYER:"centered-layer",GESTURE_LAYER:"gesture-layer",CONTROLLER_LAYER:"controller",BUTTON:"button",RANGE:"range",THUMB:"thumb",DISPLAY:"display",CONTROL_BAR:"control-bar",MENU_BUTTON:"menu-button",MENU:"menu",MENU_ITEM:"menu-item",OPTION:"option",POSTER:"poster",LIVE:"live",PLAY:"play",PRE_PLAY:"pre-play",SEEK_BACKWARD:"seek-backward",SEEK_FORWARD:"seek-forward",MUTE:"mute",CAPTIONS:"captions",AIRPLAY:"airplay",PIP:"pip",FULLSCREEN:"fullscreen",CAST:"cast",PLAYBACK_RATE:"playback-rate",VOLUME:"volume",TIME:"time",TITLE:"title",AUDIO_TRACK:"audio-track",RENDITION:"rendition"}).join(", "),vt=e=>e.charAt(0).toUpperCase()+e.slice(1),vi=(e,t)=>{let i=(e=>{if(e.muxCode){if(2403210===e.muxCode)return"403-expired-token.md";if(2412202===e.muxCode)return"403-malformatted-token.md";if([2403222,2403221].includes(e.muxCode))return"403-incorrect-aud-value.md";if(2403232===e.muxCode)return"403-playback-id-mismatch.md";if(2403201===e.muxCode)return"missing-signed-tokens.md";if(2404e3===e.muxCode)return"404-not-found.md";if(2412e3===e.muxCode)return"412-not-playable.md"}if(e.code){if(e.code===tW.MEDIA_ERR_NETWORK)return"";if(e.code===tW.MEDIA_ERR_DECODE)return"media-decode-error.md";if(e.code===tW.MEDIA_ERR_SRC_NOT_SUPPORTED)return"media-src-not-supported.md"}return""})(e);return{message:e.message,context:e.context,file:i}},va=`<template id="media-theme-gerwig">
  <style>
    @keyframes pre-play-hide {
      0% {
        transform: scale(1);
        opacity: 1;
      }

      30% {
        transform: scale(0.7);
      }

      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    :host {
      --_primary-color: var(--media-primary-color, #fff);
      --_secondary-color: var(--media-secondary-color, transparent);
      --_accent-color: var(--media-accent-color, #fa50b5);
      --_text-color: var(--media-text-color, #000);

      --media-icon-color: var(--_primary-color);
      --media-control-background: var(--_secondary-color);
      --media-control-hover-background: var(--_accent-color);
      --media-time-buffered-color: rgba(255, 255, 255, 0.4);
      --media-preview-time-text-shadow: none;
      --media-control-height: 14px;
      --media-control-padding: 6px;
      --media-tooltip-container-margin: 6px;
      --media-tooltip-distance: 18px;

      color: var(--_primary-color);
      display: inline-block;
      width: 100%;
      height: 100%;
    }

    :host([audio]) {
      --_secondary-color: var(--media-secondary-color, black);
      --media-preview-time-text-shadow: none;
    }

    :host([audio]) ::slotted([slot='media']) {
      height: 0px;
    }

    :host([audio]) media-loading-indicator {
      display: none;
    }

    :host([audio]) media-controller {
      background: transparent;
    }

    :host([audio]) media-controller::part(vertical-layer) {
      background: transparent;
    }

    :host([audio]) media-control-bar {
      width: 100%;
      background-color: var(--media-control-background);
    }

    /*
     * 0.433s is the transition duration for VTT Regions.
     * Borrowed here, so the captions don't move too fast.
     */
    media-controller {
      --media-webkit-text-track-transform: translateY(0) scale(0.98);
      --media-webkit-text-track-transition: transform 0.433s ease-out 0.3s;
    }
    media-controller:is([mediapaused], :not([userinactive])) {
      --media-webkit-text-track-transform: translateY(-50px) scale(0.98);
      --media-webkit-text-track-transition: transform 0.15s ease;
    }

    /*
     * CSS specific to iOS devices.
     * See: https://stackoverflow.com/questions/30102792/css-media-query-to-target-only-ios-devices/60220757#60220757
     */
    @supports (-webkit-touch-callout: none) {
      /* Disable subtitle adjusting for iOS Safari */
      media-controller[mediaisfullscreen] {
        --media-webkit-text-track-transform: unset;
        --media-webkit-text-track-transition: unset;
      }
    }

    media-time-range {
      --media-box-padding-left: 6px;
      --media-box-padding-right: 6px;
      --media-range-bar-color: var(--_accent-color);
      --media-time-range-buffered-color: var(--_primary-color);
      --media-range-track-color: transparent;
      --media-range-track-background: rgba(255, 255, 255, 0.4);
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_accent-color) 25%,
        var(--_accent-color)
      );
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-transform: scale(0);
      --media-range-thumb-transition: transform 0.3s;
      --media-range-thumb-opacity: 1;
      --media-preview-background: var(--_primary-color);
      --media-box-arrow-background: var(--_primary-color);
      --media-preview-thumbnail-border: 5px solid var(--_primary-color);
      --media-preview-border-radius: 5px;
      --media-text-color: var(--_text-color);
      --media-control-hover-background: transparent;
      --media-preview-chapter-text-shadow: none;
      color: var(--_accent-color);
      padding: 0 6px;
    }

    :host([audio]) media-time-range {
      --media-preview-time-padding: 1.5px 6px;
      --media-preview-box-margin: 0 0 -5px;
    }

    media-time-range:hover {
      --media-range-thumb-transform: scale(1);
    }

    media-preview-thumbnail {
      border-bottom-width: 0;
    }

    [part~='menu'] {
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      bottom: 50px;
      padding: 2.5px 10px;
    }

    [part~='menu']::part(indicator) {
      fill: var(--_accent-color);
    }

    [part~='menu']::part(menu-item) {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 6px 10px;
      min-height: 34px;
    }

    [part~='menu']::part(checked) {
      font-weight: 700;
    }

    media-captions-menu,
    media-rendition-menu,
    media-audio-track-menu,
    media-playback-rate-menu {
      position: absolute; /* ensure they don't take up space in DOM on load */
      --media-menu-background: var(--_primary-color);
      --media-menu-item-checked-background: transparent;
      --media-text-color: var(--_text-color);
      --media-menu-item-hover-background: transparent;
      --media-menu-item-hover-outline: var(--_accent-color) solid 1px;
    }

    media-rendition-menu {
      min-width: 140px;
    }

    /* The icon is a circle so make it 16px high instead of 14px for more balance. */
    media-audio-track-menu-button {
      --media-control-padding: 5px;
      --media-control-height: 16px;
    }

    media-playback-rate-menu-button {
      --media-control-padding: 6px 3px;
      min-width: 4.4ch;
    }

    media-playback-rate-menu {
      --media-menu-flex-direction: row;
      --media-menu-item-checked-background: var(--_accent-color);
      --media-menu-item-checked-indicator-display: none;
      margin-right: 6px;
      padding: 0;
      --media-menu-gap: 0.25em;
    }

    media-playback-rate-menu[part~='menu']::part(menu-item) {
      padding: 6px 6px 6px 8px;
    }

    media-playback-rate-menu[part~='menu']::part(checked) {
      color: #fff;
    }

    :host(:not([audio])) media-time-range {
      /* Adding px is required here for calc() */
      --media-range-padding: 0px;
      background: transparent;
      z-index: 10;
      height: 10px;
      bottom: -3px;
      width: 100%;
    }

    media-control-bar :is([role='button'], [role='switch'], button) {
      line-height: 0;
    }

    media-control-bar :is([part*='button'], [part*='range'], [part*='display']) {
      border-radius: 3px;
    }

    .spacer {
      flex-grow: 1;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }

    media-control-bar[slot~='top-chrome'] {
      min-height: 42px;
      pointer-events: none;
    }

    media-control-bar {
      --gradient-steps:
        hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.013) 8.1%, hsl(0 0% 0% / 0.049) 15.5%, hsl(0 0% 0% / 0.104) 22.5%,
        hsl(0 0% 0% / 0.175) 29%, hsl(0 0% 0% / 0.259) 35.3%, hsl(0 0% 0% / 0.352) 41.2%, hsl(0 0% 0% / 0.45) 47.1%,
        hsl(0 0% 0% / 0.55) 52.9%, hsl(0 0% 0% / 0.648) 58.8%, hsl(0 0% 0% / 0.741) 64.7%, hsl(0 0% 0% / 0.825) 71%,
        hsl(0 0% 0% / 0.896) 77.5%, hsl(0 0% 0% / 0.951) 84.5%, hsl(0 0% 0% / 0.987) 91.9%, hsl(0 0% 0%) 100%;
    }

    :host([title]) media-control-bar[slot='top-chrome']::before,
    :host([videotitle]) media-control-bar[slot='top-chrome']::before {
      content: '';
      position: absolute;
      width: 100%;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to top, var(--gradient-steps));
      opacity: 0.8;
      pointer-events: none;
    }

    :host(:not([audio])) media-control-bar[part~='bottom']::before {
      content: '';
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to bottom, var(--gradient-steps));
      opacity: 0.8;
      z-index: 1;
      pointer-events: none;
    }

    media-control-bar[part~='bottom'] > * {
      z-index: 20;
    }

    media-control-bar[part~='bottom'] {
      padding: 6px 6px;
    }

    media-control-bar[slot~='top-chrome'] > * {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      position: relative;
    }

    media-controller::part(vertical-layer) {
      transition: background-color 1s;
    }

    media-controller:is([mediapaused], :not([userinactive]))::part(vertical-layer) {
      background-color: var(--controls-backdrop-color, var(--controls, transparent));
      transition: background-color 0.25s;
    }

    .center-controls {
      --media-button-icon-width: 100%;
      --media-button-icon-height: auto;
      --media-tooltip-display: none;
      pointer-events: none;
      width: 100%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;
      paint-order: stroke;
      stroke: rgba(102, 102, 102, 1);
      stroke-width: 0.3px;
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    .center-controls media-play-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      --media-control-padding: 0;
      width: 40px;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    [breakpointsm] .center-controls media-play-button {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      transition: background 0.4s;
      padding: 24px;
      --media-control-background: #000;
      --media-control-hover-background: var(--_accent-color);
    }

    .center-controls media-seek-backward-button,
    .center-controls media-seek-forward-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      margin: 0 20px;
      width: max(33px, min(8%, 40px));
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback {
      display: grid;
      align-items: initial;
      justify-content: initial;
      height: 100%;
      overflow: hidden;
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback media-play-button {
      place-self: var(--_pre-playback-place, center);
      grid-area: 1 / 1;
      margin: 16px;
    }

    /* Show and hide controls or pre-playback state */

    [breakpointsm]:is([mediahasplayed], :not([mediapaused])):not([audio])
      .center-controls.pre-playback
      media-play-button {
      /* Using \`forwards\` would lead to a laggy UI after the animation got in the end state */
      animation: 0.3s linear pre-play-hide;
      opacity: 0;
      pointer-events: none;
    }

    .autoplay-unmute {
      --media-control-hover-background: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    .autoplay-unmute-btn {
      --media-control-height: 16px;
      border-radius: 8px;
      background: #000;
      color: var(--_primary-color);
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
    }

    .autoplay-unmute-btn:hover {
      background: var(--_accent-color);
    }

    [breakpointsm] .autoplay-unmute-btn {
      --media-control-height: 30px;
      padding: 14px 24px;
      font-size: 26px;
    }

    .autoplay-unmute-btn svg {
      margin: 0 6px 0 0;
    }

    [breakpointsm] .autoplay-unmute-btn svg {
      margin: 0 10px 0 0;
    }

    media-controller:not([audio]):not([mediahasplayed]) *:is(media-control-bar, media-time-range) {
      display: none;
    }

    media-error-dialog:not([mediaerrorcode]) {
      opacity: 0;
    }

    media-loading-indicator {
      --media-loading-icon-width: 100%;
      --media-button-icon-height: auto;
      display: var(--media-control-display, var(--media-loading-indicator-display, flex));
      pointer-events: none;
      position: absolute;
      width: min(15%, 150px);
      flex-flow: row;
      align-items: center;
      justify-content: center;
    }

    /* Intentionally don't target the div for transition but the children
     of the div. Prevents messing with media-chrome's autohide feature. */
    media-loading-indicator + div * {
      transition: opacity 0.15s;
      opacity: 1;
    }

    media-loading-indicator[medialoading]:not([mediapaused]) ~ div > * {
      opacity: 0;
      transition-delay: 400ms;
    }

    media-volume-range {
      width: min(100%, 100px);
      --media-range-padding-left: 10px;
      --media-range-padding-right: 10px;
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_primary-color) 25%,
        var(--_primary-color)
      );
      --media-control-hover-background: none;
    }

    media-time-display {
      white-space: nowrap;
    }

    /* Generic style for explicitly disabled controls */
    media-control-bar[part~='bottom'] [disabled],
    media-control-bar[part~='bottom'] [aria-disabled='true'] {
      opacity: 60%;
      cursor: not-allowed;
    }

    media-text-display {
      --media-font-size: 16px;
      --media-control-padding: 14px;
      font-weight: 500;
    }

    media-play-button.animated *:is(g, path) {
      transition: all 0.3s;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt1 {
      opacity: 0;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt2 {
      transform-origin: center center;
      transform: scaleY(0);
    }

    media-play-button.animated[mediapaused] .play-icon {
      clip-path: inset(0 0 0 0);
    }

    media-play-button.animated:not([mediapaused]) .play-icon {
      clip-path: inset(0 0 0 100%);
    }

    media-seek-forward-button,
    media-seek-backward-button {
      --media-font-weight: 400;
    }

    .mute-icon {
      display: inline-block;
    }

    .mute-icon :is(path, g) {
      transition: opacity 0.5s;
    }

    .muted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='low'] :is(.volume-medium, .volume-high),
    media-mute-button[mediavolumelevel='medium'] :is(.volume-high) {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .unmuted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .muted {
      opacity: 1;
    }

    /**
     * Our defaults for these buttons are to hide them at small sizes
     * users can override this with CSS
     */
    media-controller:not([breakpointsm]):not([audio]) {
      --bottom-play-button: none;
      --bottom-seek-backward-button: none;
      --bottom-seek-forward-button: none;
      --bottom-time-display: none;
      --bottom-playback-rate-menu-button: none;
      --bottom-pip-button: none;
    }

    [part='mux-badge'] {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 2;
      opacity: 0.6;
      transition:
        opacity 0.2s ease-in-out,
        bottom 0.2s ease-in-out;
    }

    [part='mux-badge']:hover {
      opacity: 1;
    }

    [part='mux-badge'] a {
      font-size: 14px;
      font-family: var(--_font-family);
      color: var(--_primary-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    [part='mux-badge'] .mux-badge-text {
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    }

    [part='mux-badge'] .mux-badge-logo {
      width: 40px;
      height: auto;
      display: inline-block;
    }

    [part='mux-badge'] .mux-badge-logo svg {
      width: 100%;
      height: 100%;
      fill: white;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'],
    media-controller:not([userinactive]) [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      transition: bottom 0.1s ease-in-out;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      transition: bottom 0.2s ease-in-out 0.62s;
    }

    media-controller:not([userinactive]) [part='mux-badge'] .mux-badge-text,
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] .mux-badge-text {
      opacity: 1;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] .mux-badge-text {
      opacity: 0;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive])[mediahasplayed] [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      bottom: calc(28px + var(--media-control-height, 0px) + var(--media-control-padding, 0px) * 2);
    }
  </style>

  <template partial="TitleDisplay">
    <template if="videotitle">
      <template if="videotitle != true">
        <media-text-display part="top title display" class="title-display">{{videotitle}}</media-text-display>
      </template>
    </template>
    <template if="!videotitle">
      <template if="title">
        <media-text-display part="top title display" class="title-display">{{title}}</media-text-display>
      </template>
    </template>
  </template>

  <template partial="PlayButton">
    <media-play-button
      part="{{section ?? 'bottom'}} play button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      class="animated"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon">
        <g class="play-icon">
          <path
            d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
          />
        </g>
        <g class="pause-icon">
          <path
            class="pause-icon-pt1"
            d="M5.90709 0H2.96889C2.46857 0 2.06299 0.405585 2.06299 0.9059V13.0941C2.06299 13.5944 2.46857 14 2.96889 14H5.90709C6.4074 14 6.81299 13.5944 6.81299 13.0941V0.9059C6.81299 0.405585 6.4074 0 5.90709 0Z"
          />
          <path
            class="pause-icon-pt2"
            d="M15.1571 0H12.2189C11.7186 0 11.313 0.405585 11.313 0.9059V13.0941C11.313 13.5944 11.7186 14 12.2189 14H15.1571C15.6574 14 16.063 13.5944 16.063 13.0941V0.9059C16.063 0.405585 15.6574 0 15.1571 0Z"
          />
        </g>
      </svg>
    </media-play-button>
  </template>

  <template partial="PrePlayButton">
    <media-play-button
      part="{{section ?? 'center'}} play button pre-play"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon" style="transform: translate(3px, 0)">
        <path
          d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
        />
      </svg>
    </media-play-button>
  </template>

  <template partial="SeekBackwardButton">
    <media-seek-backward-button
      seekoffset="{{backwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-backward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <path
          d="M3.65 2.07888L0.0864 6.7279C-0.0288 6.87812 -0.0288 7.12188 0.0864 7.2721L3.65 11.9211C3.7792 12.0896 4 11.9703 4 11.7321V2.26787C4 2.02968 3.7792 1.9104 3.65 2.07888Z"
        />
        <text transform="translate(6 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
          {{backwardseekoffset}}
        </text>
      </svg>
    </media-seek-backward-button>
  </template>

  <template partial="SeekForwardButton">
    <media-seek-forward-button
      seekoffset="{{forwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-forward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <g>
          <text transform="translate(-1 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
            {{forwardseekoffset}}
          </text>
          <path
            d="M18.35 11.9211L21.9136 7.2721C22.0288 7.12188 22.0288 6.87812 21.9136 6.7279L18.35 2.07888C18.2208 1.91041 18 2.02968 18 2.26787V11.7321C18 11.9703 18.2208 12.0896 18.35 11.9211Z"
          />
        </g>
      </svg>
    </media-seek-forward-button>
  </template>

  <template partial="MuteButton">
    <media-mute-button part="bottom mute button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" slot="icon" class="mute-icon" aria-hidden="true">
        <g class="unmuted">
          <path
            d="M6.76786 1.21233L3.98606 3.98924H1.19937C0.593146 3.98924 0.101743 4.51375 0.101743 5.1607V6.96412L0 6.99998L0.101743 7.03583V8.83926C0.101743 9.48633 0.593146 10.0108 1.19937 10.0108H3.98606L6.76773 12.7877C7.23561 13.2547 8 12.9007 8 12.2171V1.78301C8 1.09925 7.23574 0.745258 6.76786 1.21233Z"
          />
          <path
            class="volume-low"
            d="M10 3.54781C10.7452 4.55141 11.1393 5.74511 11.1393 6.99991C11.1393 8.25471 10.7453 9.44791 10 10.4515L10.7988 11.0496C11.6734 9.87201 12.1356 8.47161 12.1356 6.99991C12.1356 5.52821 11.6735 4.12731 10.7988 2.94971L10 3.54781Z"
          />
          <path
            class="volume-medium"
            d="M12.3778 2.40086C13.2709 3.76756 13.7428 5.35806 13.7428 7.00026C13.7428 8.64246 13.2709 10.233 12.3778 11.5992L13.2106 12.1484C14.2107 10.6185 14.739 8.83796 14.739 7.00016C14.739 5.16236 14.2107 3.38236 13.2106 1.85156L12.3778 2.40086Z"
          />
          <path
            class="volume-high"
            d="M15.5981 0.75L14.7478 1.2719C15.7937 2.9919 16.3468 4.9723 16.3468 7C16.3468 9.0277 15.7937 11.0082 14.7478 12.7281L15.5981 13.25C16.7398 11.3722 17.343 9.211 17.343 7C17.343 4.789 16.7398 2.6268 15.5981 0.75Z"
          />
        </g>
        <g class="muted">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.39976 4.98924H1.19937C1.19429 4.98924 1.17777 4.98961 1.15296 5.01609C1.1271 5.04369 1.10174 5.09245 1.10174 5.1607V8.83926C1.10174 8.90761 1.12714 8.95641 1.15299 8.984C1.17779 9.01047 1.1943 9.01084 1.19937 9.01084H4.39977L7 11.6066V2.39357L4.39976 4.98924ZM7.47434 1.92006C7.4743 1.9201 7.47439 1.92002 7.47434 1.92006V1.92006ZM6.76773 12.7877L3.98606 10.0108H1.19937C0.593146 10.0108 0.101743 9.48633 0.101743 8.83926V7.03583L0 6.99998L0.101743 6.96412V5.1607C0.101743 4.51375 0.593146 3.98924 1.19937 3.98924H3.98606L6.76786 1.21233C7.23574 0.745258 8 1.09925 8 1.78301V12.2171C8 12.9007 7.23561 13.2547 6.76773 12.7877Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.2677 9.30323C15.463 9.49849 15.7796 9.49849 15.9749 9.30323C16.1701 9.10796 16.1701 8.79138 15.9749 8.59612L14.2071 6.82841L15.9749 5.06066C16.1702 4.8654 16.1702 4.54882 15.9749 4.35355C15.7796 4.15829 15.4631 4.15829 15.2678 4.35355L13.5 6.1213L11.7322 4.35348C11.537 4.15822 11.2204 4.15822 11.0251 4.35348C10.8298 4.54874 10.8298 4.86532 11.0251 5.06058L12.7929 6.82841L11.0251 8.59619C10.8299 8.79146 10.8299 9.10804 11.0251 9.3033C11.2204 9.49856 11.537 9.49856 11.7323 9.3033L13.5 7.53552L15.2677 9.30323Z"
          />
        </g>
      </svg>
    </media-mute-button>
  </template>

  <template partial="PipButton">
    <media-pip-button part="bottom pip button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M15.9891 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.989C0 13.0996 0.9004 14 2.011 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0ZM17 11.9891C17 12.5465 16.5465 13 15.9891 13H2.011C1.4536 13 1.0001 12.5465 1.0001 11.9891V2.0109C1.0001 1.4535 1.4536 0.9999 2.011 0.9999H15.9891C16.5465 0.9999 17 1.4535 17 2.0109V11.9891Z"
        />
        <path
          d="M15.356 5.67822H8.19523C8.03253 5.67822 7.90063 5.81012 7.90063 5.97282V11.3836C7.90063 11.5463 8.03253 11.6782 8.19523 11.6782H15.356C15.5187 11.6782 15.6506 11.5463 15.6506 11.3836V5.97282C15.6506 5.81012 15.5187 5.67822 15.356 5.67822Z"
        />
      </svg>
    </media-pip-button>
  </template>

  <template partial="CaptionsMenu">
    <media-captions-menu-button part="bottom captions button">
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="on">
        <path
          d="M15.989 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9004 14 2.011 14H15.989C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.989 0ZM4.2292 8.7639C4.5954 9.1902 5.0935 9.4031 5.7233 9.4031C6.1852 9.4031 6.5544 9.301 6.8302 9.0969C7.1061 8.8933 7.2863 8.614 7.3702 8.26H8.4322C8.3062 8.884 8.0093 9.3733 7.5411 9.7273C7.0733 10.0813 6.4703 10.2581 5.732 10.2581C5.108 10.2581 4.5699 10.1219 4.1168 9.8489C3.6637 9.5759 3.3141 9.1946 3.0685 8.7058C2.8224 8.2165 2.6994 7.6511 2.6994 7.009C2.6994 6.3611 2.8224 5.7927 3.0685 5.3034C3.3141 4.8146 3.6637 4.4323 4.1168 4.1559C4.5699 3.88 5.108 3.7418 5.732 3.7418C6.4703 3.7418 7.0733 3.922 7.5411 4.2818C8.0094 4.6422 8.3062 5.1461 8.4322 5.794H7.3702C7.2862 5.4283 7.106 5.1368 6.8302 4.921C6.5544 4.7052 6.1852 4.5968 5.7233 4.5968C5.0934 4.5968 4.5954 4.8116 4.2292 5.2404C3.8635 5.6696 3.6804 6.259 3.6804 7.009C3.6804 7.7531 3.8635 8.3381 4.2292 8.7639ZM11.0974 8.7639C11.4636 9.1902 11.9617 9.4031 12.5915 9.4031C13.0534 9.4031 13.4226 9.301 13.6984 9.0969C13.9743 8.8933 14.1545 8.614 14.2384 8.26H15.3004C15.1744 8.884 14.8775 9.3733 14.4093 9.7273C13.9415 10.0813 13.3385 10.2581 12.6002 10.2581C11.9762 10.2581 11.4381 10.1219 10.985 9.8489C10.5319 9.5759 10.1823 9.1946 9.9367 8.7058C9.6906 8.2165 9.5676 7.6511 9.5676 7.009C9.5676 6.3611 9.6906 5.7927 9.9367 5.3034C10.1823 4.8146 10.5319 4.4323 10.985 4.1559C11.4381 3.88 11.9762 3.7418 12.6002 3.7418C13.3385 3.7418 13.9415 3.922 14.4093 4.2818C14.8776 4.6422 15.1744 5.1461 15.3004 5.794H14.2384C14.1544 5.4283 13.9742 5.1368 13.6984 4.921C13.4226 4.7052 13.0534 4.5968 12.5915 4.5968C11.9616 4.5968 11.4636 4.8116 11.0974 5.2404C10.7317 5.6696 10.5486 6.259 10.5486 7.009C10.5486 7.7531 10.7317 8.3381 11.0974 8.7639Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="off">
        <path
          d="M5.73219 10.258C5.10819 10.258 4.57009 10.1218 4.11699 9.8488C3.66389 9.5758 3.31429 9.1945 3.06869 8.7057C2.82259 8.2164 2.69958 7.651 2.69958 7.0089C2.69958 6.361 2.82259 5.7926 3.06869 5.3033C3.31429 4.8145 3.66389 4.4322 4.11699 4.1558C4.57009 3.8799 5.10819 3.7417 5.73219 3.7417C6.47049 3.7417 7.07348 3.9219 7.54128 4.2817C8.00958 4.6421 8.30638 5.146 8.43238 5.7939H7.37039C7.28639 5.4282 7.10618 5.1367 6.83039 4.9209C6.55459 4.7051 6.18538 4.5967 5.72348 4.5967C5.09358 4.5967 4.59559 4.8115 4.22939 5.2403C3.86369 5.6695 3.68058 6.2589 3.68058 7.0089C3.68058 7.753 3.86369 8.338 4.22939 8.7638C4.59559 9.1901 5.09368 9.403 5.72348 9.403C6.18538 9.403 6.55459 9.3009 6.83039 9.0968C7.10629 8.8932 7.28649 8.6139 7.37039 8.2599H8.43238C8.30638 8.8839 8.00948 9.3732 7.54128 9.7272C7.07348 10.0812 6.47049 10.258 5.73219 10.258Z"
        />
        <path
          d="M12.6003 10.258C11.9763 10.258 11.4382 10.1218 10.9851 9.8488C10.532 9.5758 10.1824 9.1945 9.93685 8.7057C9.69075 8.2164 9.56775 7.651 9.56775 7.0089C9.56775 6.361 9.69075 5.7926 9.93685 5.3033C10.1824 4.8145 10.532 4.4322 10.9851 4.1558C11.4382 3.8799 11.9763 3.7417 12.6003 3.7417C13.3386 3.7417 13.9416 3.9219 14.4094 4.2817C14.8777 4.6421 15.1745 5.146 15.3005 5.7939H14.2385C14.1545 5.4282 13.9743 5.1367 13.6985 4.9209C13.4227 4.7051 13.0535 4.5967 12.5916 4.5967C11.9617 4.5967 11.4637 4.8115 11.0975 5.2403C10.7318 5.6695 10.5487 6.2589 10.5487 7.0089C10.5487 7.753 10.7318 8.338 11.0975 8.7638C11.4637 9.1901 11.9618 9.403 12.5916 9.403C13.0535 9.403 13.4227 9.3009 13.6985 9.0968C13.9744 8.8932 14.1546 8.6139 14.2385 8.2599H15.3005C15.1745 8.8839 14.8776 9.3732 14.4094 9.7272C13.9416 10.0812 13.3386 10.258 12.6003 10.258Z"
        />
        <path
          d="M15.9891 1C16.5465 1 17 1.4535 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H2.0109C1.4535 13 1 12.5465 1 11.9891V2.0109C1 1.4535 1.4535 0.9999 2.0109 0.9999L15.9891 1ZM15.9891 0H2.0109C0.9003 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9003 14 2.0109 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0Z"
        />
      </svg>
    </media-captions-menu-button>
    <media-captions-menu
      hidden
      anchor="auto"
      part="bottom captions menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg></div
    ></media-captions-menu>
  </template>

  <template partial="AirplayButton">
    <media-airplay-button part="bottom airplay button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M16.1383 0H1.8618C0.8335 0 0 0.8335 0 1.8617V10.1382C0 11.1664 0.8335 12 1.8618 12H3.076C3.1204 11.9433 3.1503 11.8785 3.2012 11.826L4.004 11H1.8618C1.3866 11 1 10.6134 1 10.1382V1.8617C1 1.3865 1.3866 0.9999 1.8618 0.9999H16.1383C16.6135 0.9999 17.0001 1.3865 17.0001 1.8617V10.1382C17.0001 10.6134 16.6135 11 16.1383 11H13.9961L14.7989 11.826C14.8499 11.8785 14.8798 11.9432 14.9241 12H16.1383C17.1665 12 18.0001 11.1664 18.0001 10.1382V1.8617C18 0.8335 17.1665 0 16.1383 0Z"
        />
        <path
          d="M9.55061 8.21903C9.39981 8.06383 9.20001 7.98633 9.00011 7.98633C8.80021 7.98633 8.60031 8.06383 8.44951 8.21903L4.09771 12.697C3.62471 13.1838 3.96961 13.9998 4.64831 13.9998H13.3518C14.0304 13.9998 14.3754 13.1838 13.9023 12.697L9.55061 8.21903Z"
        />
      </svg>
    </media-airplay-button>
  </template>

  <template partial="FullscreenButton">
    <media-fullscreen-button part="bottom fullscreen button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M1.00745 4.39539L1.01445 1.98789C1.01605 1.43049 1.47085 0.978289 2.02835 0.979989L6.39375 0.992589L6.39665 -0.007411L2.03125 -0.020011C0.920646 -0.023211 0.0176463 0.874489 0.0144463 1.98509L0.00744629 4.39539H1.00745Z"
        />
        <path
          d="M17.0144 2.03431L17.0076 4.39541H18.0076L18.0144 2.03721C18.0176 0.926712 17.1199 0.0237125 16.0093 0.0205125L11.6439 0.0078125L11.641 1.00781L16.0064 1.02041C16.5638 1.02201 17.016 1.47681 17.0144 2.03431Z"
        />
        <path
          d="M16.9925 9.60498L16.9855 12.0124C16.9839 12.5698 16.5291 13.022 15.9717 13.0204L11.6063 13.0078L11.6034 14.0078L15.9688 14.0204C17.0794 14.0236 17.9823 13.1259 17.9855 12.0153L17.9925 9.60498H16.9925Z"
        />
        <path
          d="M0.985626 11.9661L0.992426 9.60498H-0.0074737L-0.0142737 11.9632C-0.0174737 13.0738 0.880226 13.9767 1.99083 13.98L6.35623 13.9926L6.35913 12.9926L1.99373 12.98C1.43633 12.9784 0.983926 12.5236 0.985626 11.9661Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M5.39655 -0.0200195L5.38955 2.38748C5.38795 2.94488 4.93315 3.39708 4.37565 3.39538L0.0103463 3.38278L0.00744629 4.38278L4.37285 4.39538C5.48345 4.39858 6.38635 3.50088 6.38965 2.39028L6.39665 -0.0200195H5.39655Z"
        />
        <path
          d="M12.6411 2.36891L12.6479 0.0078125H11.6479L11.6411 2.36601C11.6379 3.47651 12.5356 4.37951 13.6462 4.38271L18.0116 4.39531L18.0145 3.39531L13.6491 3.38271C13.0917 3.38111 12.6395 2.92641 12.6411 2.36891Z"
        />
        <path
          d="M12.6034 14.0204L12.6104 11.613C12.612 11.0556 13.0668 10.6034 13.6242 10.605L17.9896 10.6176L17.9925 9.61759L13.6271 9.60499C12.5165 9.60179 11.6136 10.4995 11.6104 11.6101L11.6034 14.0204H12.6034Z"
        />
        <path
          d="M5.359 11.6315L5.3522 13.9926H6.3522L6.359 11.6344C6.3622 10.5238 5.4645 9.62088 4.3539 9.61758L-0.0115043 9.60498L-0.0144043 10.605L4.351 10.6176C4.9084 10.6192 5.3607 11.074 5.359 11.6315Z"
        />
      </svg>
    </media-fullscreen-button>
  </template>

  <template partial="CastButton">
    <media-cast-button part="bottom cast button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M16.0072 0H2.0291C0.9185 0 0.0181 0.9003 0.0181 2.011V5.5009C0.357 5.5016 0.6895 5.5275 1.0181 5.5669V2.011C1.0181 1.4536 1.4716 1 2.029 1H16.0072C16.5646 1 17.0181 1.4536 17.0181 2.011V11.9891C17.0181 12.5465 16.5646 13 16.0072 13H8.4358C8.4746 13.3286 8.4999 13.6611 8.4999 13.9999H16.0071C17.1177 13.9999 18.018 13.0996 18.018 11.989V2.011C18.0181 0.9003 17.1178 0 16.0072 0ZM0 6.4999V7.4999C3.584 7.4999 6.5 10.4159 6.5 13.9999H7.5C7.5 9.8642 4.1357 6.4999 0 6.4999ZM0 8.7499V9.7499C2.3433 9.7499 4.25 11.6566 4.25 13.9999H5.25C5.25 11.1049 2.895 8.7499 0 8.7499ZM0.0181 11V14H3.0181C3.0181 12.3431 1.675 11 0.0181 11Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M15.9891 0H2.01103C0.900434 0 3.35947e-05 0.9003 3.35947e-05 2.011V5.5009C0.338934 5.5016 0.671434 5.5275 1.00003 5.5669V2.011C1.00003 1.4536 1.45353 1 2.01093 1H15.9891C16.5465 1 17 1.4536 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H8.41773C8.45653 13.3286 8.48183 13.6611 8.48183 13.9999H15.989C17.0996 13.9999 17.9999 13.0996 17.9999 11.989V2.011C18 0.9003 17.0997 0 15.9891 0ZM-0.0180664 6.4999V7.4999C3.56593 7.4999 6.48193 10.4159 6.48193 13.9999H7.48193C7.48193 9.8642 4.11763 6.4999 -0.0180664 6.4999ZM-0.0180664 8.7499V9.7499C2.32523 9.7499 4.23193 11.6566 4.23193 13.9999H5.23193C5.23193 11.1049 2.87693 8.7499 -0.0180664 8.7499ZM3.35947e-05 11V14H3.00003C3.00003 12.3431 1.65693 11 3.35947e-05 11Z"
        />
        <path d="M2.15002 5.634C5.18352 6.4207 7.57252 8.8151 8.35282 11.8499H15.8501V2.1499H2.15002V5.634Z" />
      </svg>
    </media-cast-button>
  </template>

  <template partial="LiveButton">
    <media-live-button part="{{section ?? 'top'}} live button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <span slot="text">Live</span>
    </media-live-button>
  </template>

  <template partial="PlaybackRateMenu">
    <media-playback-rate-menu-button part="bottom playback-rate button"></media-playback-rate-menu-button>
    <media-playback-rate-menu
      hidden
      anchor="auto"
      rates="{{playbackrates}}"
      exportparts="menu-item"
      part="bottom playback-rate menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-playback-rate-menu>
  </template>

  <template partial="VolumeRange">
    <media-volume-range
      part="bottom volume range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-volume-range>
  </template>

  <template partial="TimeDisplay">
    <media-time-display
      remaining="{{defaultshowremainingtime}}"
      showduration="{{!hideduration}}"
      part="bottom time display"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-time-display>
  </template>

  <template partial="TimeRange">
    <media-time-range part="bottom time range" disabled="{{disabled}}" aria-disabled="{{disabled}}" exportparts="thumb">
      <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
      <media-preview-chapter-display slot="preview"></media-preview-chapter-display>
      <media-preview-time-display slot="preview"></media-preview-time-display>
      <div slot="preview" part="arrow"></div>
    </media-time-range>
  </template>

  <template partial="AudioTrackMenu">
    <media-audio-track-menu-button part="bottom audio-track button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 16">
        <path d="M9 15A7 7 0 1 1 9 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 9 0a8 8 0 0 0 0 16Z" />
        <path
          d="M5.2 6.3a.5.5 0 0 1 .5.5v2.4a.5.5 0 1 1-1 0V6.8a.5.5 0 0 1 .5-.5Zm2.4-2.4a.5.5 0 0 1 .5.5v7.2a.5.5 0 0 1-1 0V4.4a.5.5 0 0 1 .5-.5ZM10 5.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.4-.8a.5.5 0 0 1 .5.5v5.6a.5.5 0 0 1-1 0V5.2a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </media-audio-track-menu-button>
    <media-audio-track-menu
      hidden
      anchor="auto"
      part="bottom audio-track menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-audio-track-menu>
  </template>

  <template partial="RenditionMenu">
    <media-rendition-menu-button part="bottom rendition button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 14">
        <path
          d="M2.25 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.75 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
      </svg>
    </media-rendition-menu-button>
    <media-rendition-menu
      hidden
      anchor="auto"
      part="bottom rendition menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            opacity: 0;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-rendition-menu>
  </template>

  <template partial="MuxBadge">
    <div part="mux-badge">
      <a href="https://www.mux.com/player" target="_blank">
        <span class="mux-badge-text">Powered by</span>
        <div class="mux-badge-logo">
          <svg
            viewBox="0 0 1600 500"
            style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
          >
            <g>
              <path
                d="M994.287,93.486c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m0,-93.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,68.943 -56.09,125.033 -125.032,125.033c-68.942,-0 -125.03,-56.09 -125.03,-125.033l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,137.853 112.149,250.003 249.999,250.003c137.851,-0 250.001,-112.15 250.001,-250.003l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M1537.51,468.511c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m-275.883,-218.509l-143.33,143.329c-24.402,24.402 -24.402,63.966 0,88.368c24.402,24.402 63.967,24.402 88.369,-0l143.33,-143.329l143.328,143.329c24.402,24.4 63.967,24.402 88.369,-0c24.403,-24.402 24.403,-63.966 0.001,-88.368l-143.33,-143.329l0.001,-0.004l143.329,-143.329c24.402,-24.402 24.402,-63.965 0,-88.367c-24.402,-24.402 -63.967,-24.402 -88.369,-0l-143.329,143.328l-143.329,-143.328c-24.402,-24.401 -63.967,-24.402 -88.369,-0c-24.402,24.402 -24.402,63.965 0,88.367l143.329,143.329l0,0.004Z"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M437.511,468.521c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m23.915,-463.762c-23.348,-9.672 -50.226,-4.327 -68.096,13.544l-143.331,143.329l-143.33,-143.329c-17.871,-17.871 -44.747,-23.216 -68.096,-13.544c-23.349,9.671 -38.574,32.455 -38.574,57.729l0,375.026c0,34.51 27.977,62.486 62.487,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-224.173l80.843,80.844c24.404,24.402 63.965,24.402 88.369,-0l80.843,-80.844l0,224.173c0,34.51 27.976,62.486 62.486,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-375.026c0,-25.274 -15.224,-48.058 -38.573,-57.729"
                style="fill-rule: nonzero"
              ></path>
            </g>
          </svg>
        </div>
      </a>
    </div>
  </template>

  <media-controller
    part="controller"
    defaultstreamtype="{{defaultstreamtype ?? 'on-demand'}}"
    breakpoints="sm:470"
    gesturesdisabled="{{disabled}}"
    hotkeys="{{hotkeys}}"
    nohotkeys="{{nohotkeys}}"
    novolumepref="{{novolumepref}}"
    audio="{{audio}}"
    noautoseektolive="{{noautoseektolive}}"
    defaultsubtitles="{{defaultsubtitles}}"
    defaultduration="{{defaultduration ?? false}}"
    keyboardforwardseekoffset="{{forwardseekoffset}}"
    keyboardbackwardseekoffset="{{backwardseekoffset}}"
    exportparts="layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer"
    style="--_pre-playback-place:{{preplaybackplace ?? 'center'}}"
  >
    <slot name="media" slot="media"></slot>
    <slot name="poster" slot="poster"></slot>

    <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

    <template if="!audio">
      <media-error-dialog slot="dialog" noautohide></media-error-dialog>
      <!-- Pre-playback UI -->
      <!-- same for both on-demand and live -->
      <div slot="centered-chrome" class="center-controls pre-playback">
        <template if="!breakpointsm">{{>PlayButton section="center"}}</template>
        <template if="breakpointsm">{{>PrePlayButton section="center"}}</template>
      </div>

      <!-- Mux Badge -->
      <template if="proudlydisplaymuxbadge"> {{>MuxBadge}} </template>

      <!-- Autoplay centered unmute button -->
      <!--
        todo: figure out how show this with available state variables
        needs to show when:
        - autoplay is enabled
        - playback has been successful
        - audio is muted
        - in place / instead of the pre-plaback play button
        - not to show again after user has interacted with this button
          - OR user has interacted with the mute button in the control bar
      -->
      <!--
        There should be a >MuteButton to the left of the "Unmute" text, but a templating bug
        makes it appear even if commented out in the markup, add it back when code is un-commented
      -->
      <!-- <div slot="centered-chrome" class="autoplay-unmute">
        <div role="button" class="autoplay-unmute-btn">Unmute</div>
      </div> -->

      <template if="streamtype == 'on-demand'">
        <template if="breakpointsm">
          <media-control-bar part="control-bar top" slot="top-chrome">{{>TitleDisplay}} </media-control-bar>
        </template>
        {{>TimeRange}}
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>SeekBackwardButton}} {{>SeekForwardButton}} {{>TimeDisplay}} {{>MuteButton}}
          {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>PlaybackRateMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}}
          {{>CastButton}} {{>PipButton}} {{>FullscreenButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <media-control-bar part="control-bar top" slot="top-chrome">
          {{>LiveButton}}
          <template if="breakpointsm"> {{>TitleDisplay}} </template>
        </media-control-bar>
        <template if="targetlivewindow > 0">{{>TimeRange}}</template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="targetlivewindow > 0">{{>SeekBackwardButton}} {{>SeekForwardButton}}</template>
          {{>MuteButton}} {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}} {{>CastButton}} {{>PipButton}}
          {{>FullscreenButton}}
        </media-control-bar>
      </template>
    </template>

    <template if="audio">
      <template if="streamtype == 'on-demand'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="breakpointsm"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          {{>MuteButton}}
          <template if="breakpointsm">{{>VolumeRange}}</template>
          {{>TimeDisplay}} {{>TimeRange}}
          <template if="breakpointsm">{{>PlaybackRateMenu}}</template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>LiveButton section="bottom"}} {{>MuteButton}}
          <template if="breakpointsm">
            {{>VolumeRange}}
            <template if="targetlivewindow > 0"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          </template>
          <template if="targetlivewindow > 0"> {{>TimeDisplay}} {{>TimeRange}} </template>
          <template if="!targetlivewindow"><div class="spacer"></div></template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>
    </template>

    <slot></slot>
  </media-controller>
</template>
`,vr=pM.createElement("template");"innerHTML"in vr&&(vr.innerHTML=va);var vn,vs,vo=class extends dn{};vo.template=null==(vs=null==(vn=vr.content)?void 0:vn.children)?void 0:vs[0],pL.customElements.get("media-theme-gerwig")||pL.customElements.define("media-theme-gerwig",vo);var vl={SRC:"src",POSTER:"poster"},vd={STYLE:"style",DEFAULT_HIDDEN_CAPTIONS:"default-hidden-captions",PRIMARY_COLOR:"primary-color",SECONDARY_COLOR:"secondary-color",ACCENT_COLOR:"accent-color",FORWARD_SEEK_OFFSET:"forward-seek-offset",BACKWARD_SEEK_OFFSET:"backward-seek-offset",PLAYBACK_TOKEN:"playback-token",THUMBNAIL_TOKEN:"thumbnail-token",STORYBOARD_TOKEN:"storyboard-token",FULLSCREEN_ELEMENT:"fullscreen-element",DRM_TOKEN:"drm-token",STORYBOARD_SRC:"storyboard-src",THUMBNAIL_TIME:"thumbnail-time",AUDIO:"audio",NOHOTKEYS:"nohotkeys",HOTKEYS:"hotkeys",PLAYBACK_RATES:"playbackrates",DEFAULT_SHOW_REMAINING_TIME:"default-show-remaining-time",DEFAULT_DURATION:"default-duration",TITLE:"title",VIDEO_TITLE:"video-title",PLACEHOLDER:"placeholder",THEME:"theme",DEFAULT_STREAM_TYPE:"default-stream-type",TARGET_LIVE_WINDOW:"target-live-window",EXTRA_SOURCE_PARAMS:"extra-source-params",NO_VOLUME_PREF:"no-volume-pref",NO_MUTED_PREF:"no-muted-pref",CAST_RECEIVER:"cast-receiver",NO_TOOLTIPS:"no-tooltips",PROUDLY_DISPLAY_MUX_BADGE:"proudly-display-mux-badge",DISABLE_PSEUDO_ENDED:"disable-pseudo-ended"},vu=["audio","backwardseekoffset","defaultduration","defaultshowremainingtime","defaultsubtitles","noautoseektolive","disabled","exportparts","forwardseekoffset","hideduration","hotkeys","nohotkeys","playbackrates","defaultstreamtype","streamtype","style","targetlivewindow","template","title","videotitle","novolumepref","nomutedpref","proudlydisplaymuxbadge"],vc=ow.formatErrorMessage;function vh(e){let t=e.videoTitle?{video_title:e.videoTitle}:{};return e.getAttributeNames().filter(e=>e.startsWith("metadata-")).reduce((t,i)=>{let a=e.getAttribute(i);return null!==a&&(t[i.replace(/^metadata-/,"").replace(/-/g,"_")]=a),t},t)}ow.formatErrorMessage=e=>{var t,i;if(e instanceof tW){let a=((e,t=!1)=>({title:((e,t=!1)=>{var i,a;if(e.muxCode){let r=vt(null!=(i=e.errorCategory)?i:"video"),n=tB(null!=(a=e.errorCategory)?a:tH);if(2000002===e.muxCode)return t8("Your device appears to be offline",t);if(2403210===e.muxCode)return t8("{category} URL has expired",t).format({category:r});if([2403232,2403222,2403221,2412202].includes(e.muxCode))return t8("{category} URL is formatted incorrectly",t).format({category:r});if(2403201===e.muxCode)return t8("Invalid {categoryName} URL",t).format({categoryName:n});if(2404e3===e.muxCode)return t8("{category} does not exist",t).format({category:r});if(2412e3===e.muxCode){let i="live"===e.streamType?"Live stream":"Video";return t8("{mediaType} is not currently available",t).format({mediaType:i})}}if(e.code){if(e.code===tW.MEDIA_ERR_NETWORK)return t8("Network Error",t);if(e.code===tW.MEDIA_ERR_DECODE)return t8("Media Error",t);if(e.code===tW.MEDIA_ERR_SRC_NOT_SUPPORTED)return t8("Source Not Supported",t)}return t8("Error",t)})(e,t).toString(),message:((e,t=!1)=>{var i,a;if(e.muxCode){let r=vt(null!=(i=e.errorCategory)?i:"video"),n=tB(null!=(a=e.errorCategory)?a:tH);return 2000002===e.muxCode?t8("Check your internet connection and try reloading this video.",t):2403210===e.muxCode?t8("The video’s secured {tokenNamePrefix}-token has expired.",t).format({tokenNamePrefix:n}):2403232===e.muxCode?t8("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",t).format({tokenNamePrefix:n}):2412202===e.muxCode?t8("{category} URL is formatted incorrectly",t).format({category:r}):[2403222,2403221].includes(e.muxCode)?t8("The {tokenNamePrefix}-token is formatted with incorrect information.",t).format({tokenNamePrefix:n}):[2403201,24e5].includes(e.muxCode)?t8("The video URL or {tokenNamePrefix}-token are formatted with incorrect or incomplete information.",t).format({tokenNamePrefix:n}):2404e3===e.muxCode?"":e.message}return e.code&&(e.code===tW.MEDIA_ERR_NETWORK||e.code===tW.MEDIA_ERR_DECODE||e.code===tW.MEDIA_ERR_SRC_NOT_SUPPORTED),e.message})(e,t).toString()}))(e,!1);return`
      ${null!=a&&a.title?`<h3>${a.title}</h3>`:""}
      ${null!=a&&a.message||null!=a&&a.linkUrl?`<p>
        ${null==a?void 0:a.message}
        ${null!=a&&a.linkUrl?`<a
              href="${a.linkUrl}"
              target="_blank"
              rel="external noopener"
              aria-label="${null!=(t=a.linkText)?t:""} ${t8("(opens in a new window)")}"
              >${null!=(i=a.linkText)?i:a.linkUrl}</a
            >`:""}
      </p>`:""}
    `}return vc(e)};var vm,vp,vv,vb,vg,vf,vE,vy,v_,vT,vA,vk,vw,vS,vI,vC=Object.values(aU),vR=Object.values(vl),vL=Object.values(vd),vM="mux-player",vx={isDialogOpen:!1},vD={redundant_streams:!0},vP=class extends p0{constructor(){super(),uy(this,vE),uy(this,vm),uy(this,vp,!1),uy(this,vv,{}),uy(this,vb,!0),uy(this,vg,new pF(this,"hotkeys")),uy(this,vf,{...vx,onCloseErrorDialog:e=>{var t;(null==(t=e.composedPath()[0])?void 0:t.localName)==="media-error-dialog"&&uT(this,vE,vT).call(this,{isDialogOpen:!1})},onFocusInErrorDialog:e=>{var t;(null==(t=e.composedPath()[0])?void 0:t.localName)==="media-error-dialog"&&(pB(this,pM.activeElement)||e.preventDefault())}}),u_(this,vm,iq()),this.attachShadow({mode:"open"}),uT(this,vE,v_).call(this),this.isConnected&&uT(this,vE,vy).call(this)}static get NAME(){return vM}static get VERSION(){return p$}static get observedAttributes(){var e;return[...null!=(e=p0.observedAttributes)?e:[],...vR,...vC,...vL]}get mediaTheme(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("media-theme")}get mediaController(){var e,t;return null==(t=null==(e=this.mediaTheme)?void 0:e.shadowRoot)?void 0:t.querySelector("media-controller")}connectedCallback(){let e=this.media;e&&(e.metadata=vh(this))}attributeChangedCallback(e,t,i){var a;switch(uT(this,vE,vy).call(this),super.attributeChangedCallback(e,t,i),e){case vd.HOTKEYS:uE(this,vg).value=i;break;case vd.THUMBNAIL_TIME:null!=i&&this.tokens.thumbnail&&pj(t8("Use of thumbnail-time with thumbnail-token is currently unsupported. Ignore thumbnail-time.").toString());break;case vd.THUMBNAIL_TOKEN:if(i){let e=t9(i);if(e){let{aud:t}=e;"t"!==t&&pj(t8("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:"t",tokenNamePrefix:"thumbnail"}))}}break;case vd.STORYBOARD_TOKEN:if(i){let e=t9(i);if(e){let{aud:t}=e;"s"!==t&&pj(t8("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:"s",tokenNamePrefix:"storyboard"}))}}break;case vd.DRM_TOKEN:if(i){let e=t9(i);if(e){let{aud:t}=e;"d"!==t&&pj(t8("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:"d",tokenNamePrefix:"drm"}))}}break;case aU.PLAYBACK_ID:null!=i&&i.includes("?token")&&pY(t8("The specificed playback ID {playbackId} contains a token which must be provided via the playback-token attribute.").format({playbackId:i}));break;case aU.STREAM_TYPE:i&&![tF,tV,tK].includes(i)?["ll-live","live:dvr","ll-live:dvr"].includes(this.streamType)?this.targetLiveWindow=i.includes("dvr")?1/0:0:pG({file:"invalid-stream-type.md",message:t8("Invalid stream-type value supplied: `{streamType}`. Please provide stream-type as either: `on-demand` or `live`").format({streamType:this.streamType})}):i===tF?null==this.getAttribute(vd.TARGET_LIVE_WINDOW)&&(this.targetLiveWindow=0):this.targetLiveWindow=NaN;break;case vd.FULLSCREEN_ELEMENT:if(null!=i||i!==t){let e=pM.getElementById(i),t=null==e?void 0:e.querySelector("mux-player");this.mediaController&&e&&t&&(this.mediaController.fullscreenElement=e)}break;case aU.CAP_RENDITION_TO_PLAYER_SIZE:(null==i||i!==t)&&(this.capRenditionToPlayerSize=null!=i||void 0)}[aU.PLAYBACK_ID,vl.SRC,vd.PLAYBACK_TOKEN].includes(e)&&t!==i&&u_(this,vf,{...uE(this,vf),...vx}),uT(this,vE,vA).call(this,{[null!=(a=pV[e])?a:pD(e)]:i})}async requestFullscreen(e){var t;if(!(!this.mediaController||this.mediaController.hasAttribute(rm.MEDIA_IS_FULLSCREEN)))return null==(t=this.mediaController)||t.dispatchEvent(new pL.CustomEvent(rd.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,t)=>{var i;null==(i=this.mediaController)||i.addEventListener(rp.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}async exitFullscreen(){var e;if(!(!this.mediaController||!this.mediaController.hasAttribute(rm.MEDIA_IS_FULLSCREEN)))return null==(e=this.mediaController)||e.dispatchEvent(new pL.CustomEvent(rd.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,t)=>{var i;null==(i=this.mediaController)||i.addEventListener(rp.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}get preferCmcd(){var e;return null!=(e=this.getAttribute(aU.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?tG.includes(e)?this.setAttribute(aU.PREFER_CMCD,e):pj(`Invalid value for preferCmcd. Must be one of ${tG.join()}`):this.removeAttribute(aU.PREFER_CMCD))}get hasPlayed(){var e,t;return null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute(rm.MEDIA_HAS_PLAYED))&&t}get inLiveWindow(){var e;return null==(e=this.mediaController)?void 0:e.hasAttribute(rm.MEDIA_TIME_IS_LIVE)}get _hls(){var e;return null==(e=this.media)?void 0:e._hls}get mux(){var e;return null==(e=this.media)?void 0:e.mux}get theme(){var e;return null!=(e=this.getAttribute(vd.THEME))?e:"gerwig"}set theme(e){this.setAttribute(vd.THEME,`${e}`)}get themeProps(){let e=this.mediaTheme;if(!e)return;let t={};for(let i of e.getAttributeNames()){if(vu.includes(i))continue;let a=e.getAttribute(i);t[pD(i)]=""===a||a}return t}set themeProps(e){var t,i;uT(this,vE,vy).call(this);let a={...this.themeProps,...e};for(let r in a){if(vu.includes(r))continue;let a=null==e?void 0:e[r];"boolean"==typeof a||null==a?null==(t=this.mediaTheme)||t.toggleAttribute(px(r),!!a):null==(i=this.mediaTheme)||i.setAttribute(px(r),a)}}get playbackId(){var e;return null!=(e=this.getAttribute(aU.PLAYBACK_ID))?e:void 0}set playbackId(e){e?this.setAttribute(aU.PLAYBACK_ID,e):this.removeAttribute(aU.PLAYBACK_ID)}get src(){var e,t;return this.playbackId?null!=(e=vO(this,vl.SRC))?e:void 0:null!=(t=this.getAttribute(vl.SRC))?t:void 0}set src(e){e?this.setAttribute(vl.SRC,e):this.removeAttribute(vl.SRC)}get poster(){var e;let t=this.getAttribute(vl.POSTER);if(null!=t)return t;let{tokens:i}=this;return i.playback&&!i.thumbnail?void pj("Missing expected thumbnail token. No poster image will be shown"):this.playbackId&&!this.audio?((e,{token:t,customDomain:i=pW,thumbnailTime:a,programTime:r}={})=>{var n;let s=null==t?a:void 0,{aud:o}=null!=(n=t9(t))?n:{};if(!(t&&"t"!==o))return`https://image.${i}/${e}/thumbnail.webp${pO({token:t,time:s,program_time:r})}`})(this.playbackId,{customDomain:this.customDomain,thumbnailTime:null!=(e=this.thumbnailTime)?e:this.startTime,programTime:this.programStartTime,token:i.thumbnail}):void 0}set poster(e){e||""===e?this.setAttribute(vl.POSTER,e):this.removeAttribute(vl.POSTER)}get storyboardSrc(){var e;return null!=(e=this.getAttribute(vd.STORYBOARD_SRC))?e:void 0}set storyboardSrc(e){e?this.setAttribute(vd.STORYBOARD_SRC,e):this.removeAttribute(vd.STORYBOARD_SRC)}get storyboard(){let{tokens:e}=this;return this.storyboardSrc&&!e.storyboard?this.storyboardSrc:this.audio||!this.playbackId||!this.streamType||[tF,tK].includes(this.streamType)||e.playback&&!e.storyboard?void 0:((e,{token:t,customDomain:i=pW,programStartTime:a,programEndTime:r}={})=>{var n;let{aud:s}=null!=(n=t9(t))?n:{};if(!(t&&"s"!==s))return`https://image.${i}/${e}/storyboard.vtt${pO({token:t,format:"webp",program_start_time:a,program_end_time:r})}`})(this.playbackId,{customDomain:this.customDomain,token:e.storyboard,programStartTime:this.programStartTime,programEndTime:this.programEndTime})}get audio(){return this.hasAttribute(vd.AUDIO)}set audio(e){e?this.setAttribute(vd.AUDIO,""):this.removeAttribute(vd.AUDIO)}get hotkeys(){return uE(this,vg)}get nohotkeys(){return this.hasAttribute(vd.NOHOTKEYS)}set nohotkeys(e){e?this.setAttribute(vd.NOHOTKEYS,""):this.removeAttribute(vd.NOHOTKEYS)}get thumbnailTime(){return pP(this.getAttribute(vd.THUMBNAIL_TIME))}set thumbnailTime(e){this.setAttribute(vd.THUMBNAIL_TIME,`${e}`)}get videoTitle(){var e,t;return null!=(t=null!=(e=this.getAttribute(vd.VIDEO_TITLE))?e:this.getAttribute(vd.TITLE))?t:""}set videoTitle(e){e!==this.videoTitle&&(e?this.setAttribute(vd.VIDEO_TITLE,e):this.removeAttribute(vd.VIDEO_TITLE))}get placeholder(){var e;return null!=(e=vO(this,vd.PLACEHOLDER))?e:""}set placeholder(e){this.setAttribute(vd.PLACEHOLDER,`${e}`)}get primaryColor(){var e,t;let i=this.getAttribute(vd.PRIMARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=pL.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_primary-color"))?void 0:t.trim()))return i}set primaryColor(e){this.setAttribute(vd.PRIMARY_COLOR,`${e}`)}get secondaryColor(){var e,t;let i=this.getAttribute(vd.SECONDARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=pL.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_secondary-color"))?void 0:t.trim()))return i}set secondaryColor(e){this.setAttribute(vd.SECONDARY_COLOR,`${e}`)}get accentColor(){var e,t;let i=this.getAttribute(vd.ACCENT_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=pL.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_accent-color"))?void 0:t.trim()))return i}set accentColor(e){this.setAttribute(vd.ACCENT_COLOR,`${e}`)}get defaultShowRemainingTime(){return this.hasAttribute(vd.DEFAULT_SHOW_REMAINING_TIME)}set defaultShowRemainingTime(e){e?this.setAttribute(vd.DEFAULT_SHOW_REMAINING_TIME,""):this.removeAttribute(vd.DEFAULT_SHOW_REMAINING_TIME)}get playbackRates(){if(this.hasAttribute(vd.PLAYBACK_RATES))return this.getAttribute(vd.PLAYBACK_RATES).trim().split(/\s*,?\s+/).map(e=>Number(e)).filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t)}set playbackRates(e){e?this.setAttribute(vd.PLAYBACK_RATES,e.join(" ")):this.removeAttribute(vd.PLAYBACK_RATES)}get forwardSeekOffset(){var e;return null!=(e=pP(this.getAttribute(vd.FORWARD_SEEK_OFFSET)))?e:10}set forwardSeekOffset(e){this.setAttribute(vd.FORWARD_SEEK_OFFSET,`${e}`)}get backwardSeekOffset(){var e;return null!=(e=pP(this.getAttribute(vd.BACKWARD_SEEK_OFFSET)))?e:10}set backwardSeekOffset(e){this.setAttribute(vd.BACKWARD_SEEK_OFFSET,`${e}`)}get defaultHiddenCaptions(){return this.hasAttribute(vd.DEFAULT_HIDDEN_CAPTIONS)}set defaultHiddenCaptions(e){e?this.setAttribute(vd.DEFAULT_HIDDEN_CAPTIONS,""):this.removeAttribute(vd.DEFAULT_HIDDEN_CAPTIONS)}get defaultDuration(){return pP(this.getAttribute(vd.DEFAULT_DURATION))}set defaultDuration(e){null==e?this.removeAttribute(vd.DEFAULT_DURATION):this.setAttribute(vd.DEFAULT_DURATION,`${e}`)}get playerInitTime(){return this.hasAttribute(aU.PLAYER_INIT_TIME)?pP(this.getAttribute(aU.PLAYER_INIT_TIME)):uE(this,vm)}set playerInitTime(e){e!=this.playerInitTime&&(null==e?this.removeAttribute(aU.PLAYER_INIT_TIME):this.setAttribute(aU.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return null!=(e=this.getAttribute(aU.PLAYER_SOFTWARE_NAME))?e:vM}get playerSoftwareVersion(){var e;return null!=(e=this.getAttribute(aU.PLAYER_SOFTWARE_VERSION))?e:p$}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(aU.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(aU.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(aU.BEACON_COLLECTION_DOMAIN))}get maxResolution(){var e;return null!=(e=this.getAttribute(aU.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(aU.MAX_RESOLUTION,e):this.removeAttribute(aU.MAX_RESOLUTION))}get minResolution(){var e;return null!=(e=this.getAttribute(aU.MIN_RESOLUTION))?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(aU.MIN_RESOLUTION,e):this.removeAttribute(aU.MIN_RESOLUTION))}get maxAutoResolution(){var e;return null!=(e=this.getAttribute(aU.MAX_AUTO_RESOLUTION))?e:void 0}set maxAutoResolution(e){null==e?this.removeAttribute(aU.MAX_AUTO_RESOLUTION):this.setAttribute(aU.MAX_AUTO_RESOLUTION,e)}get renditionOrder(){var e;return null!=(e=this.getAttribute(aU.RENDITION_ORDER))?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(aU.RENDITION_ORDER,e):this.removeAttribute(aU.RENDITION_ORDER))}get programStartTime(){return pP(this.getAttribute(aU.PROGRAM_START_TIME))}set programStartTime(e){null==e?this.removeAttribute(aU.PROGRAM_START_TIME):this.setAttribute(aU.PROGRAM_START_TIME,`${e}`)}get programEndTime(){return pP(this.getAttribute(aU.PROGRAM_END_TIME))}set programEndTime(e){null==e?this.removeAttribute(aU.PROGRAM_END_TIME):this.setAttribute(aU.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){return pP(this.getAttribute(aU.ASSET_START_TIME))}set assetStartTime(e){null==e?this.removeAttribute(aU.ASSET_START_TIME):this.setAttribute(aU.ASSET_START_TIME,`${e}`)}get assetEndTime(){return pP(this.getAttribute(aU.ASSET_END_TIME))}set assetEndTime(e){null==e?this.removeAttribute(aU.ASSET_END_TIME):this.setAttribute(aU.ASSET_END_TIME,`${e}`)}get extraSourceParams(){return this.hasAttribute(vd.EXTRA_SOURCE_PARAMS)?[...new URLSearchParams(this.getAttribute(vd.EXTRA_SOURCE_PARAMS)).entries()].reduce((e,[t,i])=>(e[t]=i,e),{}):vD}set extraSourceParams(e){null==e?this.removeAttribute(vd.EXTRA_SOURCE_PARAMS):this.setAttribute(vd.EXTRA_SOURCE_PARAMS,new URLSearchParams(e).toString())}get customDomain(){var e;return null!=(e=this.getAttribute(aU.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(aU.CUSTOM_DOMAIN,e):this.removeAttribute(aU.CUSTOM_DOMAIN))}get envKey(){var e;return null!=(e=vO(this,aU.ENV_KEY))?e:void 0}set envKey(e){this.setAttribute(aU.ENV_KEY,`${e}`)}get noVolumePref(){return this.hasAttribute(vd.NO_VOLUME_PREF)}set noVolumePref(e){e?this.setAttribute(vd.NO_VOLUME_PREF,""):this.removeAttribute(vd.NO_VOLUME_PREF)}get noMutedPref(){return this.hasAttribute(vd.NO_MUTED_PREF)}set noMutedPref(e){e?this.setAttribute(vd.NO_MUTED_PREF,""):this.removeAttribute(vd.NO_MUTED_PREF)}get debug(){return null!=vO(this,aU.DEBUG)}set debug(e){e?this.setAttribute(aU.DEBUG,""):this.removeAttribute(aU.DEBUG)}get disableTracking(){return null!=vO(this,aU.DISABLE_TRACKING)}set disableTracking(e){this.toggleAttribute(aU.DISABLE_TRACKING,!!e)}get disableCookies(){return null!=vO(this,aU.DISABLE_COOKIES)}set disableCookies(e){e?this.setAttribute(aU.DISABLE_COOKIES,""):this.removeAttribute(aU.DISABLE_COOKIES)}get streamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(aU.STREAM_TYPE))?t:null==(e=this.media)?void 0:e.streamType)?i:tK}set streamType(e){this.setAttribute(aU.STREAM_TYPE,`${e}`)}get defaultStreamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(vd.DEFAULT_STREAM_TYPE))?t:null==(e=this.mediaController)?void 0:e.getAttribute(vd.DEFAULT_STREAM_TYPE))?i:tV}set defaultStreamType(e){e?this.setAttribute(vd.DEFAULT_STREAM_TYPE,e):this.removeAttribute(vd.DEFAULT_STREAM_TYPE)}get targetLiveWindow(){var e,t;return this.hasAttribute(vd.TARGET_LIVE_WINDOW)?+this.getAttribute(vd.TARGET_LIVE_WINDOW):null!=(t=null==(e=this.media)?void 0:e.targetLiveWindow)?t:NaN}set targetLiveWindow(e){e==this.targetLiveWindow||Number.isNaN(e)&&Number.isNaN(this.targetLiveWindow)||(null==e?this.removeAttribute(vd.TARGET_LIVE_WINDOW):this.setAttribute(vd.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e;return null==(e=this.media)?void 0:e.liveEdgeStart}get startTime(){return pP(vO(this,aU.START_TIME))}set startTime(e){this.setAttribute(aU.START_TIME,`${e}`)}get preferPlayback(){let e=this.getAttribute(aU.PREFER_PLAYBACK);if("mse"===e||e===tj)return e}set preferPlayback(e){e!==this.preferPlayback&&("mse"===e||e===tj?this.setAttribute(aU.PREFER_PLAYBACK,e):this.removeAttribute(aU.PREFER_PLAYBACK))}get metadata(){var e;return null==(e=this.media)?void 0:e.metadata}set metadata(e){(uT(this,vE,vy).call(this),this.media)?this.media.metadata={...vh(this),...e}:pY("underlying media element missing when trying to set metadata. metadata will not be set.")}get _hlsConfig(){var e;return null==(e=this.media)?void 0:e._hlsConfig}set _hlsConfig(e){(uT(this,vE,vy).call(this),this.media)?this.media._hlsConfig=e:pY("underlying media element missing when trying to set _hlsConfig. _hlsConfig will not be set.")}async addCuePoints(e){var t;return(uT(this,vE,vy).call(this),this.media)?null==(t=this.media)?void 0:t.addCuePoints(e):void pY("underlying media element missing when trying to addCuePoints. cuePoints will not be added.")}get activeCuePoint(){var e;return null==(e=this.media)?void 0:e.activeCuePoint}get cuePoints(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.cuePoints)?t:[]}addChapters(e){var t;return(uT(this,vE,vy).call(this),this.media)?null==(t=this.media)?void 0:t.addChapters(e):void pY("underlying media element missing when trying to addChapters. chapters will not be added.")}get activeChapter(){var e;return null==(e=this.media)?void 0:e.activeChapter}get chapters(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.chapters)?t:[]}getStartDate(){var e;return null==(e=this.media)?void 0:e.getStartDate()}get currentPdt(){var e;return null==(e=this.media)?void 0:e.currentPdt}get tokens(){let e=this.getAttribute(vd.PLAYBACK_TOKEN),t=this.getAttribute(vd.DRM_TOKEN),i=this.getAttribute(vd.THUMBNAIL_TOKEN),a=this.getAttribute(vd.STORYBOARD_TOKEN);return{...uE(this,vv),...null!=e?{playback:e}:{},...null!=t?{drm:t}:{},...null!=i?{thumbnail:i}:{},...null!=a?{storyboard:a}:{}}}set tokens(e){u_(this,vv,null!=e?e:{})}get playbackToken(){var e;return null!=(e=this.getAttribute(vd.PLAYBACK_TOKEN))?e:void 0}set playbackToken(e){this.setAttribute(vd.PLAYBACK_TOKEN,`${e}`)}get drmToken(){var e;return null!=(e=this.getAttribute(vd.DRM_TOKEN))?e:void 0}set drmToken(e){this.setAttribute(vd.DRM_TOKEN,`${e}`)}get thumbnailToken(){var e;return null!=(e=this.getAttribute(vd.THUMBNAIL_TOKEN))?e:void 0}set thumbnailToken(e){this.setAttribute(vd.THUMBNAIL_TOKEN,`${e}`)}get storyboardToken(){var e;return null!=(e=this.getAttribute(vd.STORYBOARD_TOKEN))?e:void 0}set storyboardToken(e){this.setAttribute(vd.STORYBOARD_TOKEN,`${e}`)}addTextTrack(e,t,i,a){var r;let n=null==(r=this.media)?void 0:r.nativeEl;if(n)return ia(n,e,t,i,a)}removeTextTrack(e){var t;let i=null==(t=this.media)?void 0:t.nativeEl;if(i){let t;return void(null==(t=Array.prototype.find.call(i.querySelectorAll("track"),t=>t.track===e))||t.remove())}}get textTracks(){var e;return null==(e=this.media)?void 0:e.textTracks}get castReceiver(){var e;return null!=(e=this.getAttribute(vd.CAST_RECEIVER))?e:void 0}set castReceiver(e){e!==this.castReceiver&&(e?this.setAttribute(vd.CAST_RECEIVER,e):this.removeAttribute(vd.CAST_RECEIVER))}get castCustomData(){var e;return null==(e=this.media)?void 0:e.castCustomData}set castCustomData(e){this.media?this.media.castCustomData=e:pY("underlying media element missing when trying to set castCustomData. castCustomData will not be set.")}get noTooltips(){return this.hasAttribute(vd.NO_TOOLTIPS)}set noTooltips(e){e?this.setAttribute(vd.NO_TOOLTIPS,""):this.removeAttribute(vd.NO_TOOLTIPS)}get proudlyDisplayMuxBadge(){return this.hasAttribute(vd.PROUDLY_DISPLAY_MUX_BADGE)}set proudlyDisplayMuxBadge(e){e?this.setAttribute(vd.PROUDLY_DISPLAY_MUX_BADGE,""):this.removeAttribute(vd.PROUDLY_DISPLAY_MUX_BADGE)}get capRenditionToPlayerSize(){var e;return null==(e=this.media)?void 0:e.capRenditionToPlayerSize}set capRenditionToPlayerSize(e){this.media?this.media.capRenditionToPlayerSize=e:pY("underlying media element missing when trying to set capRenditionToPlayerSize")}};function vO(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}vm=new WeakMap,vp=new WeakMap,vv=new WeakMap,vb=new WeakMap,vg=new WeakMap,vf=new WeakMap,vE=new WeakSet,vy=function(){var e,t,i,a;if(!uE(this,vp)){u_(this,vp,!0),uT(this,vE,vA).call(this);try{if(customElements.upgrade(this.mediaTheme),!(this.mediaTheme instanceof pL.HTMLElement))throw""}catch{pY("<media-theme> failed to upgrade!")}try{customElements.upgrade(this.media)}catch{pY("underlying media element failed to upgrade!")}try{if(customElements.upgrade(this.mediaController),!(this.mediaController instanceof sS))throw""}catch{pY("<media-controller> failed to upgrade!")}uT(this,vE,vk).call(this),uT(this,vE,vw).call(this),uT(this,vE,vS).call(this),u_(this,vb,null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute(ny))||t),uT(this,vE,vI).call(this),null==(i=this.media)||i.addEventListener("streamtypechange",()=>uT(this,vE,vA).call(this)),null==(a=this.media)||a.addEventListener("loadstart",()=>uT(this,vE,vA).call(this))}},v_=function(){var e,t;try{null==(e=null==window?void 0:window.CSS)||e.registerProperty({name:"--media-primary-color",syntax:"<color>",inherits:!0}),null==(t=null==window?void 0:window.CSS)||t.registerProperty({name:"--media-secondary-color",syntax:"<color>",inherits:!0})}catch{}},vT=function(e){Object.assign(uE(this,vf),e),uT(this,vE,vA).call(this)},vA=function(e={}){var t,i,a,r,n,s,o,l,d,u,c,h,m,v,b,g,f,E,y,_,T,A,k,w,S,I,C,R,L,M,x,D,P,O,N,U,H,B,W,$,q,V,F,K,j,Y,G,Q;let z,Z,X,J;t={...uE(this,vf),...e},z={src:!this.playbackId&&this.src,playbackId:this.playbackId,hasSrc:!!this.playbackId||!!this.src||!!this.currentSrc,poster:this.poster,storyboard:(null==(i=this.media)?void 0:i.currentSrc)&&this.storyboard,storyboardSrc:this.getAttribute(vd.STORYBOARD_SRC),fullscreenElement:this.getAttribute(vd.FULLSCREEN_ELEMENT),placeholder:this.getAttribute("placeholder"),themeTemplate:function(e){var t,i;let a=e.theme;if(a){let r=null==(i=null==(t=e.getRootNode())?void 0:t.getElementById)?void 0:i.call(t,a);if(r&&r instanceof HTMLTemplateElement)return r;a.startsWith("media-theme-")||(a=`media-theme-${a}`);let n=pL.customElements.get(a);if(null!=n&&n.template)return n.template}}(this),thumbnailTime:!this.tokens.thumbnail&&this.thumbnailTime,autoplay:this.autoplay,crossOrigin:this.crossOrigin,loop:this.loop,noHotKeys:this.hasAttribute(vd.NOHOTKEYS),hotKeys:this.getAttribute(vd.HOTKEYS),muted:this.muted,paused:this.paused,preload:this.preload,envKey:this.envKey,preferCmcd:this.preferCmcd,debug:this.debug,disableTracking:this.disableTracking,disableCookies:this.disableCookies,tokens:this.tokens,beaconCollectionDomain:this.beaconCollectionDomain,maxResolution:this.maxResolution,minResolution:this.minResolution,maxAutoResolution:this.maxAutoResolution,programStartTime:this.programStartTime,programEndTime:this.programEndTime,assetStartTime:this.assetStartTime,assetEndTime:this.assetEndTime,renditionOrder:this.renditionOrder,metadata:this.metadata,playerInitTime:this.playerInitTime,playerSoftwareName:this.playerSoftwareName,playerSoftwareVersion:this.playerSoftwareVersion,startTime:this.startTime,preferPlayback:this.preferPlayback,audio:this.audio,defaultStreamType:this.defaultStreamType,targetLiveWindow:this.getAttribute(aU.TARGET_LIVE_WINDOW),streamType:pq(this.getAttribute(aU.STREAM_TYPE)),primaryColor:this.getAttribute(vd.PRIMARY_COLOR),secondaryColor:this.getAttribute(vd.SECONDARY_COLOR),accentColor:this.getAttribute(vd.ACCENT_COLOR),forwardSeekOffset:this.forwardSeekOffset,backwardSeekOffset:this.backwardSeekOffset,defaultHiddenCaptions:this.defaultHiddenCaptions,defaultDuration:this.defaultDuration,defaultShowRemainingTime:this.defaultShowRemainingTime,hideDuration:(Z=null==(n=this.mediaController)?void 0:n.querySelector("media-time-display"))&&"none"===getComputedStyle(Z).getPropertyValue("--media-duration-display-display").trim(),playbackRates:this.getAttribute(vd.PLAYBACK_RATES),customDomain:null!=(a=this.getAttribute(aU.CUSTOM_DOMAIN))?a:void 0,title:this.getAttribute(vd.TITLE),videoTitle:null!=(r=this.getAttribute(vd.VIDEO_TITLE))?r:this.getAttribute(vd.TITLE),novolumepref:this.hasAttribute(vd.NO_VOLUME_PREF),nomutedpref:this.hasAttribute(vd.NO_MUTED_PREF),proudlyDisplayMuxBadge:this.hasAttribute(vd.PROUDLY_DISPLAY_MUX_BADGE),castReceiver:this.castReceiver,disablePseudoEnded:this.hasAttribute(vd.DISABLE_PSEUDO_ENDED),capRenditionToPlayerSize:this.capRenditionToPlayerSize,...t,extraSourceParams:this.extraSourceParams},s=p7`
  <style>
    ${(e=>{let{tokens:t}=e;return t.drm?":host(:not([cast-receiver])) { --_cast-button-drm-display: none; }":""})(z)}
    ${p1}
  </style>
  ${l=z,p7`
  <media-theme
    template="${l.themeTemplate||!1}"
    defaultstreamtype="${null!=(d=l.defaultStreamType)&&d}"
    hotkeys="${X=l.hotKeys?`${l.hotKeys}`:"","live"===pq(l.streamType)&&(X+=" noarrowleft noarrowright"),X||!1}"
    nohotkeys="${l.noHotKeys||!l.hasSrc||!1}"
    noautoseektolive="${!!(null!=(u=l.streamType)&&u.includes(tF))&&0!==l.targetLiveWindow}"
    novolumepref="${l.novolumepref||!1}"
    nomutedpref="${l.nomutedpref||!1}"
    disabled="${!l.hasSrc||l.isDialogOpen}"
    audio="${null!=(c=l.audio)&&c}"
    style="${null!=(Q={"--media-primary-color":l.primaryColor,"--media-secondary-color":l.secondaryColor,"--media-accent-color":l.accentColor},J="",Object.entries(Q).forEach(([e,t])=>{null!=t&&(J+=`${px(e)}: ${t}; `)}),h=J?J.trim():void 0)&&h}"
    defaultsubtitles="${!l.defaultHiddenCaptions}"
    forwardseekoffset="${null!=(m=l.forwardSeekOffset)&&m}"
    backwardseekoffset="${null!=(v=l.backwardSeekOffset)&&v}"
    playbackrates="${null!=(b=l.playbackRates)&&b}"
    defaultshowremainingtime="${null!=(g=l.defaultShowRemainingTime)&&g}"
    defaultduration="${null!=(f=l.defaultDuration)&&f}"
    hideduration="${null!=(E=l.hideDuration)&&E}"
    title="${null!=(y=l.title)&&y}"
    videotitle="${null!=(_=l.videoTitle)&&_}"
    proudlydisplaymuxbadge="${null!=(T=l.proudlyDisplayMuxBadge)&&T}"
    exportparts="${ve}"
    onclose="${l.onCloseErrorDialog}"
    onfocusin="${l.onFocusInErrorDialog}"
  >
    <mux-video
      slot="media"
      inert="${null!=(A=l.noHotKeys)&&A}"
      target-live-window="${null!=(k=l.targetLiveWindow)&&k}"
      stream-type="${null!=(w=pq(l.streamType))&&w}"
      crossorigin="${null!=(S=l.crossOrigin)?S:""}"
      playsinline
      autoplay="${null!=(I=l.autoplay)&&I}"
      muted="${null!=(C=l.muted)&&C}"
      loop="${null!=(R=l.loop)&&R}"
      preload="${null!=(L=l.preload)&&L}"
      debug="${null!=(M=l.debug)&&M}"
      prefer-cmcd="${null!=(x=l.preferCmcd)&&x}"
      disable-tracking="${null!=(D=l.disableTracking)&&D}"
      disable-cookies="${null!=(P=l.disableCookies)&&P}"
      prefer-playback="${null!=(O=l.preferPlayback)&&O}"
      start-time="${null!=l.startTime&&l.startTime}"
      beacon-collection-domain="${null!=(N=l.beaconCollectionDomain)&&N}"
      player-init-time="${null!=(U=l.playerInitTime)&&U}"
      player-software-name="${null!=(H=l.playerSoftwareName)&&H}"
      player-software-version="${null!=(B=l.playerSoftwareVersion)&&B}"
      env-key="${null!=(W=l.envKey)&&W}"
      custom-domain="${null!=($=l.customDomain)&&$}"
      src="${l.src?l.src:!!l.playbackId&&iF(l)}"
      cast-src="${l.src?l.src:!!l.playbackId&&iF(l)}"
      cast-receiver="${null!=(q=l.castReceiver)&&q}"
      drm-token="${null!=(F=null==(V=l.tokens)?void 0:V.drm)&&F}"
      exportparts="video"
      disable-pseudo-ended="${null!=(K=l.disablePseudoEnded)&&K}"
      max-auto-resolution="${null!=(j=l.maxAutoResolution)&&j}"
      cap-rendition-to-player-size="${null!=(Y=l.capRenditionToPlayerSize)&&Y}"
    >
      ${l.storyboard?p7`<track label="thumbnails" default kind="metadata" src="${l.storyboard}" />`:p7``}
      <slot></slot>
    </mux-video>
    <slot name="poster" slot="poster">
      <media-poster-image
        part="poster"
        exportparts="poster, img"
        src="${!!l.poster&&l.poster}"
        placeholdersrc="${null!=(G=l.placeholder)&&G}"
      ></media-poster-image>
    </slot>
  </media-theme>
`}
`,o=this.shadowRoot,s.renderInto(o)},vk=function(){let e=e=>{var t,i;if(!(null!=e&&e.startsWith("theme-")))return;let a=e.replace(/^theme-/,"");if(vu.includes(a))return;let r=this.getAttribute(e);null!=r?null==(t=this.mediaTheme)||t.setAttribute(a,r):null==(i=this.mediaTheme)||i.removeAttribute(a)};new MutationObserver(t=>{for(let{attributeName:i}of t)e(i)}).observe(this,{attributes:!0}),this.getAttributeNames().forEach(e)},vw=function(){let e=e=>{var t;let i=null==(t=this.media)?void 0:t.error;if(!(i instanceof tW)){let{message:e,code:t}=null!=i?i:{};i=new tW(e,t)}if(!(null!=i&&i.fatal)){pj(i),i.data&&pj(`${i.name} data:`,i.data);return}let a=vi(i,!1);a.message&&pG(a),pY(i),i.data&&pY(`${i.name} data:`,i.data),uT(this,vE,vT).call(this,{isDialogOpen:!0})};this.addEventListener("error",e),this.media&&(this.media.errorTranslator=(e={})=>{var t,i,a;if(!((null==(t=this.media)?void 0:t.error)instanceof tW))return e;let r=vi(null==(i=this.media)?void 0:i.error,!1);return{player_error_code:null==(a=this.media)?void 0:a.error.code,player_error_message:r.message?String(r.message):e.player_error_message,player_error_context:r.context?String(r.context):e.player_error_context}})},vS=function(){var e,t,i,a;let r=()=>uT(this,vE,vA).call(this);null==(t=null==(e=this.media)?void 0:e.textTracks)||t.addEventListener("addtrack",r),null==(a=null==(i=this.media)?void 0:i.textTracks)||a.addEventListener("removetrack",r)},vI=function(){var e,t;if(!/Firefox/i.test(navigator.userAgent))return;let i,a=new WeakMap,r=()=>this.streamType===tF&&!this.secondaryColor&&this.offsetWidth>=800,n=(e,t,i=!1)=>{r()||Array.from(e&&e.activeCues||[]).forEach(e=>{if(!(!e.snapToLines||e.line<-5||e.line>=0&&e.line<10))if(!t||this.paused){let t=e.text.split(`
`).length,r=-3;this.streamType===tF&&(r=-2);let n=r-t;if(e.line===n&&!i)return;a.has(e)||a.set(e,e.line),e.line=n}else setTimeout(()=>{e.line=a.get(e)||"auto"},500)})},s=()=>{var e,t;n(i,null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute(ny))&&t)},o=()=>{var e,t;let a=Array.from((null==(t=null==(e=this.mediaController)?void 0:e.media)?void 0:t.textTracks)||[]).filter(e=>["subtitles","captions"].includes(e.kind)&&"showing"===e.mode)[0];a!==i&&(null==i||i.removeEventListener("cuechange",s)),null==(i=a)||i.addEventListener("cuechange",s),n(i,uE(this,vb))};o(),null==(e=this.textTracks)||e.addEventListener("change",o),null==(t=this.textTracks)||t.addEventListener("addtrack",o),this.addEventListener("userinactivechange",()=>{var e,t;let a=null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute(ny))||t;uE(this,vb)!==a&&(u_(this,vb,a),n(i,uE(this,vb)))})};var vN=e=>{throw TypeError(e)},vU=(e,t,i)=>t.has(e)||vN("Cannot "+i),vH=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends vH{});var vB,vW=class extends vH{},v$=class{constructor(e,t={}){((e,t,i)=>t.has(e)?vN("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i))(this,vB),((e,t,i,a)=>(vU(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,vB,null==t?void 0:t.detail)}get detail(){let e,t;return vU(this,e=vB,"read from private field"),t?t.call(this):e.get(this)}initCustomEvent(){}};vB=new WeakMap;var vq={document:{createElement:function(e,t){return new vW}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(vW)},CustomEvent:v$,EventTarget:vH,HTMLElement:vW,HTMLVideoElement:class extends vH{}},vV="u"<typeof window||void 0===globalThis.customElements,vF=vV?vq:globalThis;vV&&vq.document,vF.customElements.get("mux-player")||(vF.customElements.define("mux-player",vP),vF.MuxPlayerElement=vP);var vK=parseInt(r.default.version)>=19,vj={className:"class",classname:"class",htmlFor:"for",crossOrigin:"crossorigin",viewBox:"viewBox",playsInline:"playsinline",autoPlay:"autoplay",playbackRate:"playbackrate"};function vY(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}var vG=Object.prototype.hasOwnProperty,vQ=(e,t,i)=>!((e,t)=>{if(Object.is(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;if(Array.isArray(e))return!!Array.isArray(t)&&e.length===t.length&&e.some((e,i)=>t[i]===e);let i=Object.keys(e),a=Object.keys(t);if(i.length!==a.length)return!1;for(let a=0;a<i.length;a++)if(!vG.call(t,i[a])||!Object.is(e[i[a]],t[i[a]]))return!1;return!0})(t,e[i]),vz=(e,t,i)=>{e[i]=t},vZ=(e,t,i,a=vz,n=vQ)=>(0,r.useEffect)(()=>{let r=null==i?void 0:i.current;r&&n(r,t,e)&&a(r,t,e)},[null==i?void 0:i.current,t]),vX=(()=>{try{return"3.11.5"}catch{}return"UNKNOWN"})(),vJ=(e,t,i)=>(0,r.useEffect)(()=>{let a=null==t?void 0:t.current;if(a&&i)return a.addEventListener(e,i),()=>{a.removeEventListener(e,i)}},[null==t?void 0:t.current,i,e]),v0=r.default.forwardRef(({children:e,...t},i)=>r.default.createElement("mux-player",{suppressHydrationWarning:!0,...((e={})=>{let{ref:t,...i}=e;return Object.entries(i).reduce((e,[t,i])=>{let a=((e,t)=>{if(!(!vK&&"boolean"==typeof t&&!t)){let i,a;if(i=e,null!=(a=vj)&&i in a)return vj[e];if(void 0!==t)return/[A-Z]/.test(e)?e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`):e}})(t,i);if(!a)return e;let r=vK||"boolean"!=typeof i?i:"";return e[a]=r,e},{})})(t),ref:i},e)),v1="mux-player-react",v2=r.default.forwardRef((e,t)=>{var i;let a=(0,r.useRef)(null),n=function(...e){return r.useCallback(function(...e){return t=>{let i=!1,a=e.map(e=>{let a=vY(e,t);return i||"function"!=typeof a||(i=!0),a});if(i)return()=>{for(let t=0;t<a.length;t++){let i=a[t];"function"==typeof i?i():vY(e[t],null)}}}}(...e),e)}(a,t),[s]=((e,t)=>{let{onAbort:i,onCanPlay:a,onCanPlayThrough:r,onEmptied:n,onLoadStart:s,onLoadedData:o,onLoadedMetadata:l,onProgress:d,onDurationChange:u,onVolumeChange:c,onRateChange:h,onResize:m,onWaiting:v,onPlay:b,onPlaying:g,onTimeUpdate:f,onPause:E,onSeeking:y,onSeeked:_,onStalled:T,onSuspend:A,onEnded:k,onError:w,onCuePointChange:S,onChapterChange:I,metadata:C,tokens:R,paused:L,playbackId:M,playbackRates:x,currentTime:D,themeProps:P,extraSourceParams:O,castCustomData:N,_hlsConfig:U,...H}=t;return vZ("tokens",R,e),vZ("playbackId",M,e),vZ("playbackRates",x,e),vZ("metadata",C,e),vZ("extraSourceParams",O,e),vZ("_hlsConfig",U,e),vZ("themeProps",P,e),vZ("castCustomData",N,e),vZ("paused",L,e,(e,t)=>{null!=t&&(t?e.pause():e.play())},(e,t,i)=>(!e.hasAttribute("autoplay")||!!e.hasPlayed)&&vQ(e,t,i)),vZ("currentTime",D,e,(e,t)=>{null!=t&&(e.currentTime=t)}),vJ("abort",e,i),vJ("canplay",e,a),vJ("canplaythrough",e,r),vJ("emptied",e,n),vJ("loadstart",e,s),vJ("loadeddata",e,o),vJ("loadedmetadata",e,l),vJ("progress",e,d),vJ("durationchange",e,u),vJ("volumechange",e,c),vJ("ratechange",e,h),vJ("resize",e,m),vJ("waiting",e,v),vJ("play",e,b),vJ("playing",e,g),vJ("timeupdate",e,f),vJ("pause",e,E),vJ("seeking",e,y),vJ("seeked",e,_),vJ("stalled",e,T),vJ("suspend",e,A),vJ("ended",e,k),vJ("error",e,w),vJ("cuepointchange",e,S),vJ("chapterchange",e,I),[H]})(a,e),[o]=(0,r.useState)(null!=(i=e.playerInitTime)?i:iq());return r.default.createElement(v0,{ref:n,defaultHiddenCaptions:e.defaultHiddenCaptions,playerSoftwareName:v1,playerSoftwareVersion:vX,playerInitTime:o,...s})});e.s(["default",0,v2,"playerSoftwareName",0,v1,"playerSoftwareVersion",0,vX],268399),e.i(268399),e.s(["MaxResolution",0,{upTo720p:"720p",upTo1080p:"1080p",upTo1440p:"1440p",upTo2160p:"2160p"},"MediaError",0,tW,"MinResolution",0,{noLessThan480p:"480p",noLessThan540p:"540p",noLessThan720p:"720p",noLessThan1080p:"1080p",noLessThan1440p:"1440p",noLessThan2160p:"2160p"},"RenditionOrder",0,{DESCENDING:"desc"},"default",0,v2,"generatePlayerInitTime",0,iq,"playerSoftwareName",0,v1,"playerSoftwareVersion",0,vX],742033)}]);