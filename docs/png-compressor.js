"use strict";var PNGCompressor=(()=>{var d=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var P=Object.prototype.hasOwnProperty;var C=(e,r)=>{for(var t in r)d(e,t,{get:r[t],enumerable:!0})},U=(e,r,t,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of x(r))!P.call(e,n)&&n!==t&&d(e,n,{get:()=>r[n],enumerable:!(o=b(r,n))||o.enumerable});return e};var R=e=>U(d({},"__esModule",{value:!0}),e);var L={};C(L,{decode:()=>z,decodeBinary:()=>T,encode:()=>I,encodeBinary:()=>O,encodeBlob:()=>j});async function w(e){return await(await l(e)).arrayBuffer()}async function l(e){let r=new Uint8Array(e);return new Promise((t,o)=>{let n=document.createElement("canvas"),s=n.getContext("2d"),a=Math.ceil(Math.sqrt(r.length/3+1)),p=n.width=a,y=n.height=a,c=s?.getImageData(0,0,p,y);S(r,c.data),s?.putImageData(c,0,0),n.toBlob(i=>{i?t(i):o(new Error("Canvas failed to create blob"))},"image/png")})}function S(e,r){for(let t=0,o=e.length;t<3;t++)r[t]=o/Math.pow(256,t)%256|0;r[3]=255;for(let t=4,o=0,n=r.length;t<n;t+=4,o+=3)r[t]=e[o]||0,r[t+1]=e[o+1]||0,r[t+2]=e[o+2]||0,r[t+3]=255;return r}async function g(e){let r=new Blob([e]);return new Promise((t,o)=>{let n=new Image;n.onload=function(){let s=document.createElement("canvas"),a=s.getContext("2d"),p=s.width=n.width,y=s.height=n.height;a.drawImage(n,0,0);let c=a.getImageData(0,0,p,y).data,i=v(c);URL.revokeObjectURL(n.src),t(i)},n.onerror=o,n.src=URL.createObjectURL(r)})}function v(e){let r=0;for(let o=0;o<3;o++)r+=e[o]*Math.pow(256,o);let t=new Uint8Array(r);e:for(let o=4,n=0,s=e.length;n<s;o+=4,n+=3)for(let a=0;a<3;a++){if(n+a>=r)break e;t[n+a]=e[o+a]}return t.buffer}var{CompressionStream:D,DecompressionStream:F,Response:f}=globalThis,u="gzip";async function m(e,r=u){let t=new D(r),o=new f(e).body?.pipeThrough(t);return await new f(o).arrayBuffer()}async function B(e,r=u){let t=new F(r),o=new f(e).body?.pipeThrough(t);return new f(o)}async function A(e,r=u){return(await B(e,r)).arrayBuffer()}async function h(e,r=u){return(await B(e,r)).text()}async function I(e){return await w(await m(JSON.stringify(e)))}async function z(e){return JSON.parse(await h(await g(e)))}async function O(e){return await w(await m(e))}async function T(e){return await A(await g(e))}async function j(e){return await l(await m(JSON.stringify(e)))}return R(L);})();
//# sourceMappingURL=png-compressor.js.map