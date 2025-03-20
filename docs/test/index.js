(()=>{var{getOwnPropertySymbols:k,is:b,keys:A,prototype:j}=Object,{hasOwnProperty:h,valueOf:q}=j,{isView:x}=ArrayBuffer,{Node:S}=globalThis,C=(e,n,r)=>{if(e.length!==n.length)return!1;for(let t=e.length-1;t>=0;t--)if(!c(e[t],n[t],r))return!1;return!0},N=(e,n,r)=>{let t=Array.from(e.entries()),o=Array.from(n.entries());e:for(let s=t.length-1;s>=0;s--){let l=t[s];for(let a=o.length-1;a>=0;a--){let u=o[a];if(c(l[0],u[0],r)&&c(l[1],u[1],r)){o.splice(a,1);continue e}}return!1}return!0},P=(e,n,r)=>{if(e.size!==n.size)return!1;for(let[t,o]of e.entries()){let s=n.get(t);if(!c(o,s,r))return N(e,n,r);if(s===void 0&&!n.has(t))return!1}return!0},M=(e,n,r)=>{let t=Array.from(e.values()),o=Array.from(n.values());e:for(let s=t.length-1;s>=0;s--){let l=t[s];for(let a=o.length-1;a>=0;a--){let u=o[a];if(c(l,u,r)){o.splice(a,1);continue e}}return!1}return!0},G=(e,n,r)=>{if(e.size!==n.size)return!1;for(let[t]of e.entries())if(!n.has(t))return M(e,n,r);return!0},R=(e,n)=>b(e.getTime(),n.getTime()),U=(e,n)=>e.source===n.source&&e.flags===n.flags,V=(e,n)=>e.byteLength!==n.byteLength?!1:v(new Uint8Array(e),new Uint8Array(n));function v(e,n){if(e.length!==n.length)return!1;for(let r=e.length-1;r>=0;r--)if(e[r]!==n[r])return!1;return!0}var D=(e,n,r)=>c(e.valueOf(),n.valueOf(),r),m=(e,n,r)=>{let t=A(e),o=A(n);if(t.length!==o.length)return!1;for(let a=t.length-1;a>=0;a--){let u=t[a],y=e[u],d=n[u];if(!c(y,d,r)||d===void 0&&!h.call(n,u))return!1}let s=k(e),l=k(n);if(s.length!==l.length)return!1;for(let a=s.length-1;a>=0;a--){let u=s[a],y=e[u],d=n[u];if(!c(y,d,r)||d===void 0&&!h.call(n,u))return!1}return!0};function c(e,n,r){if(b(e,n))return!0;if(typeof e!="object"||typeof n!="object"||e===null||n===null)return!1;let{constructor:t}=e,{constructor:o}=n;return t&&o&&t!==o?!1:r.get(e)===n?!0:(r.set(e,n),!t||!o?(!t||t===Object)&&(!o||o===Object)?m(e,n,r):!1:t===Array?C(e,n,r):t===Map?P(e,n,r):t===Set?G(e,n,r):t===Date?R(e,n):t===RegExp?U(e,n):t===ArrayBuffer?V(e,n):x(e)?v(e,n):t===Promise||t===WeakMap||t===WeakSet||t===S?!1:e.valueOf!==q?D(e,n,r):m(e,n,r))}function T(e,n){return c(e,n,new Map)}var p=[],g=(e,n)=>p.push({title:e,callback:n,assertions:[],result:void 0,error:void 0}),B=async(e=z)=>{e("tests",p);for(let s of p){e("test",{test:s});let l=(a,u)=>{e("assert",{title:a,result:u}),s.assertions.push({title:a,result:u})};try{await s.callback(l,T),s.result=s.assertions.filter(a=>!a.result).length===0}catch(a){e("error",a),s.result=!1,s.error=a}e("testEnd",s)}let n=p.map(s=>s.result).filter(s=>s).length,r=p.length,t=r-n,o={tests:p,pass:n,fail:t,total:r};return e("testsEnd",o),o};function z(e,n){switch(e){case"tests":console.log("Tests");break;case"testsEnd":{let{pass:r,total:t}=n;console.log(r,"/",t)}break;case"test":{let{test:r}=n;console.group(r.title)}break;case"testEnd":console.groupEnd();break;case"assert":{let{title:r,result:t}=n;console[t?"log":"warn"](r,!!t)}break;case"error":console.error(n);break;default:break}}var{PNGCompressor:i}=window;console.log("PNGCompressor",i);var f=[["string","Hello, world"],["number",123],["boolean",!0],["null",null]],w=f.map(([e,n])=>n);w.push(JSON.parse(JSON.stringify(w)));var E=f.reduce((e,[n,r])=>(e[n]=r,e),{});w.push(JSON.parse(JSON.stringify(E)));f.push(["array",w]);f.push(["object",E]);g("Array buffer",async(e,n)=>{for(let[r,t]of f){let o=await i.valueToArrayBuffer(t);e(`valueToArrayBuffer() converts ${r} to array buffer`,o instanceof ArrayBuffer);let s=await i.arrayBufferToValue(o);e(`arrayBufferToValue() converts array buffer to original value (${r})`,n(s,t))}});g("Compress",async(e,n)=>{for(let[r,t]of f){let o=await i.compress(await i.valueToArrayBuffer(t));e(`compress() compresses ${r} to array buffer`,o instanceof ArrayBuffer);let s=await i.arrayBufferToValue(await i.decompress(o));e(`decompress() decompresses array buffer to original value (${r})`,n(s,t))}});g("PNG",async(e,n)=>{for(let[r,t]of f){let o=await i.encode(t);e(`encode() encodes ${r} to array buffer`,o instanceof ArrayBuffer);let s=await i.decode(o);e(`decode() decodes array buffer to original value (${r})`,n(s,t))}});var $=document.createElement("style");$.innerText=`
html, body { margin: 0 }
body { margin: 2rem; }
.success { color: green }    
.fail { color: red }      
`;document.head.appendChild($);var O=document.createElement("div");document.body.appendChild(O);B().then(e=>{let{tests:n,pass:r,fail:t,total:o}=e;O.innerHTML=`

  <h1>Tests</h1>

  <h2>Total <span class=${r===o?"success":"fail"}>${r} / ${o}</span> pass</h2>

  ${n.map(({title:s,assertions:l,error:a})=>`

    <h3>${s}</h3>

    ${l.map(({title:u,result:y})=>`
      <p class=${y?"success":"fail"}>${y?"\u2714":"\u2716"} ${u}</p>
    `).join("")}

    ${a?"<p class=fail>"+a+"</p>":""}

  `).join("")}
`});})();
//# sourceMappingURL=index.js.map
