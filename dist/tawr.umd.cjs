(function(e,t){typeof exports=="object"&&typeof module<"u"?t(exports,require("valtio"),require("derive-valtio")):typeof define=="function"&&define.amd?define(["exports","valtio","derive-valtio"],t):(e=typeof globalThis<"u"?globalThis:e||self,t(e.Tawr={},e.valtio,e.deriveValtio))})(this,function(e,t,s){"use strict";const a={use:n=>{}};async function u(n){const{state:d,getters:o,actions:r}=n,f=await d(),i=t.proxy(f);return o&&s.derive(o(i),{proxy:i}),r&&Object.assign(i,r),i}Object.defineProperty(e,"useSnapshot",{enumerable:!0,get:()=>t.useSnapshot}),e.defineStore=u,e.tawr=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})});
