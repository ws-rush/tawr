(function(E,b){typeof exports=="object"&&typeof module<"u"?b(exports,require("react"),require("react/jsx-runtime")):typeof define=="function"&&define.amd?define(["exports","react","react/jsx-runtime"],b):(E=typeof globalThis<"u"?globalThis:E||self,b(E.TawrState={},E.react,E.jsxRuntime))})(this,function(E,b,P){"use strict";/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**//*! #__NO_SIDE_EFFECTS__ */function ze(e){const t=Object.create(null);for(const r of e.split(","))t[r]=1;return r=>r in t}const Ye=process.env.NODE_ENV!=="production"?Object.freeze({}):{};process.env.NODE_ENV!=="production"&&Object.freeze([]);const Be=()=>{},ne=Object.assign,qe=Object.prototype.hasOwnProperty,se=(e,t)=>qe.call(e,t),D=Array.isArray,I=e=>G(e)==="[object Map]",Ge=e=>G(e)==="[object Set]",ie=e=>typeof e=="function",Ue=e=>typeof e=="string",L=e=>typeof e=="symbol",$=e=>e!==null&&typeof e=="object",Je=Object.prototype.toString,G=e=>Je.call(e),Se=e=>G(e).slice(8,-1),Qe=e=>G(e)==="[object Object]",oe=e=>Ue(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Xe=(e=>{const t=Object.create(null);return r=>t[r]||(t[r]=e(r))})(e=>e.charAt(0).toUpperCase()+e.slice(1)),R=(e,t)=>!Object.is(e,t);/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function O(e,...t){console.warn(`[Vue warn] ${e}`,...t)}let l;const ce=new WeakSet;class Ze{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,ce.has(this)&&(ce.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Oe(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ve(this),me(this);const t=l,r=w;l=this,w=!0;try{return this.fn()}finally{process.env.NODE_ENV!=="production"&&l!==this&&O("Active effect was not restored correctly - this is likely a Vue internal bug."),De(this),l=t,w=r,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)le(t);this.deps=this.depsTail=void 0,Ve(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?ce.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){ue(this)&&this.run()}get dirty(){return ue(this)}}let ye=0,H,C;function Oe(e,t=!1){if(e.flags|=8,t){e.next=C,C=e;return}e.next=H,H=e}function ae(){ye++}function fe(){if(--ye>0)return;if(C){let t=C;for(C=void 0;t;){const r=t.next;t.next=void 0,t.flags&=-9,t=r}}let e;for(;H;){let t=H;for(H=void 0;t;){const r=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(s){e||(e=s)}t=r}}if(e)throw e}function me(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function De(e){let t,r=e.depsTail,s=r;for(;s;){const n=s.prevDep;s.version===-1?(s===r&&(r=n),le(s),ke(s)):t=s,s.dep.activeLink=s.prevActiveLink,s.prevActiveLink=void 0,s=n}e.deps=t,e.depsTail=r}function ue(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ne(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ne(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===F))return;e.globalVersion=F;const t=e.dep;if(e.flags|=2,t.version>0&&!e.isSSR&&e.deps&&!ue(e)){e.flags&=-3;return}const r=l,s=w;l=e,w=!0;try{me(e);const n=e.fn(e._value);(t.version===0||R(n,e._value))&&(e._value=n,t.version++)}catch(n){throw t.version++,n}finally{l=r,w=s,De(e),e.flags&=-3}}function le(e,t=!1){const{dep:r,prevSub:s,nextSub:n}=e;if(s&&(s.nextSub=n,e.prevSub=void 0),n&&(n.prevSub=s,e.nextSub=void 0),process.env.NODE_ENV!=="production"&&r.subsHead===e&&(r.subsHead=n),r.subs===e&&(r.subs=s,!s&&r.computed)){r.computed.flags&=-5;for(let i=r.computed.deps;i;i=i.nextDep)le(i,!0)}!t&&!--r.sc&&r.map&&r.map.delete(r.key)}function ke(e){const{prevDep:t,nextDep:r}=e;t&&(t.nextDep=r,e.prevDep=void 0),r&&(r.prevDep=t,e.nextDep=void 0)}let w=!0;const xe=[];function Te(){xe.push(w),w=!1}function Re(){const e=xe.pop();w=e===void 0?!0:e}function Ve(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const r=l;l=void 0;try{t()}finally{l=r}}}let F=0;class et{constructor(t,r){this.sub=t,this.dep=r,this.version=r.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class je{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,process.env.NODE_ENV!=="production"&&(this.subsHead=void 0)}track(t){if(!l||!w||l===this.computed)return;let r=this.activeLink;if(r===void 0||r.sub!==l)r=this.activeLink=new et(l,this),l.deps?(r.prevDep=l.depsTail,l.depsTail.nextDep=r,l.depsTail=r):l.deps=l.depsTail=r,Ae(r);else if(r.version===-1&&(r.version=this.version,r.nextDep)){const s=r.nextDep;s.prevDep=r.prevDep,r.prevDep&&(r.prevDep.nextDep=s),r.prevDep=l.depsTail,r.nextDep=void 0,l.depsTail.nextDep=r,l.depsTail=r,l.deps===r&&(l.deps=s)}return process.env.NODE_ENV!=="production"&&l.onTrack&&l.onTrack(ne({effect:l},t)),r}trigger(t){this.version++,F++,this.notify(t)}notify(t){ae();try{if(process.env.NODE_ENV!=="production")for(let r=this.subsHead;r;r=r.nextSub)r.sub.onTrigger&&!(r.sub.flags&8)&&r.sub.onTrigger(ne({effect:r.sub},t));for(let r=this.subs;r;r=r.prevSub)r.sub.notify()&&r.sub.dep.notify()}finally{fe()}}}function Ae(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let s=t.deps;s;s=s.nextDep)Ae(s)}const r=e.dep.subs;r!==e&&(e.prevSub=r,r&&(r.nextSub=e)),process.env.NODE_ENV!=="production"&&e.dep.subsHead===void 0&&(e.dep.subsHead=e),e.dep.subs=e}}const pe=new WeakMap,V=Symbol(process.env.NODE_ENV!=="production"?"Object iterate":""),de=Symbol(process.env.NODE_ENV!=="production"?"Map keys iterate":""),z=Symbol(process.env.NODE_ENV!=="production"?"Array iterate":"");function _(e,t,r){if(w&&l){let s=pe.get(e);s||pe.set(e,s=new Map);let n=s.get(r);n||(s.set(r,n=new je),n.map=s,n.key=r),process.env.NODE_ENV!=="production"?n.track({target:e,type:t,key:r}):n.track()}}function N(e,t,r,s,n,i){const o=pe.get(e);if(!o){F++;return}const c=a=>{a&&(process.env.NODE_ENV!=="production"?a.trigger({target:e,type:t,key:r,newValue:s,oldValue:n,oldTarget:i}):a.trigger())};if(ae(),t==="clear")o.forEach(c);else{const a=D(e),p=a&&oe(r);if(a&&r==="length"){const h=Number(s);o.forEach((f,v)=>{(v==="length"||v===z||!L(v)&&v>=h)&&c(f)})}else switch((r!==void 0||o.has(void 0))&&c(o.get(r)),p&&c(o.get(z)),t){case"add":a?p&&c(o.get("length")):(c(o.get(V)),I(e)&&c(o.get(de)));break;case"delete":a||(c(o.get(V)),I(e)&&c(o.get(de)));break;case"set":I(e)&&c(o.get(V));break}}fe()}function M(e){const t=d(e);return t===e?t:(_(t,"iterate",z),S(e)?t:t.map(g))}function he(e){return _(e=d(e),"iterate",z),e}const tt={__proto__:null,[Symbol.iterator](){return ve(this,Symbol.iterator,g)},concat(...e){return M(this).concat(...e.map(t=>D(t)?M(t):t))},entries(){return ve(this,"entries",e=>(e[1]=g(e[1]),e))},every(e,t){return m(this,"every",e,t,void 0,arguments)},filter(e,t){return m(this,"filter",e,t,r=>r.map(g),arguments)},find(e,t){return m(this,"find",e,t,g,arguments)},findIndex(e,t){return m(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return m(this,"findLast",e,t,g,arguments)},findLastIndex(e,t){return m(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return m(this,"forEach",e,t,void 0,arguments)},includes(...e){return _e(this,"includes",e)},indexOf(...e){return _e(this,"indexOf",e)},join(e){return M(this).join(e)},lastIndexOf(...e){return _e(this,"lastIndexOf",e)},map(e,t){return m(this,"map",e,t,void 0,arguments)},pop(){return Y(this,"pop")},push(...e){return Y(this,"push",e)},reduce(e,...t){return Pe(this,"reduce",e,t)},reduceRight(e,...t){return Pe(this,"reduceRight",e,t)},shift(){return Y(this,"shift")},some(e,t){return m(this,"some",e,t,void 0,arguments)},splice(...e){return Y(this,"splice",e)},toReversed(){return M(this).toReversed()},toSorted(e){return M(this).toSorted(e)},toSpliced(...e){return M(this).toSpliced(...e)},unshift(...e){return Y(this,"unshift",e)},values(){return ve(this,"values",g)}};function ve(e,t,r){const s=he(e),n=s[t]();return s!==e&&!S(e)&&(n._next=n.next,n.next=()=>{const i=n._next();return i.value&&(i.value=r(i.value)),i}),n}const rt=Array.prototype;function m(e,t,r,s,n,i){const o=he(e),c=o!==e&&!S(e),a=o[t];if(a!==rt[t]){const f=a.apply(e,i);return c?g(f):f}let p=r;o!==e&&(c?p=function(f,v){return r.call(this,g(f),v,e)}:r.length>2&&(p=function(f,v){return r.call(this,f,v,e)}));const h=a.call(o,p,s);return c&&n?n(h):h}function Pe(e,t,r,s){const n=he(e);let i=r;return n!==e&&(S(e)?r.length>3&&(i=function(o,c,a){return r.call(this,o,c,a,e)}):i=function(o,c,a){return r.call(this,o,g(c),a,e)}),n[t](i,...s)}function _e(e,t,r){const s=d(e);_(s,"iterate",z);const n=s[t](...r);return(n===-1||n===!1)&&gt(r[0])?(r[0]=d(r[0]),s[t](...r)):n}function Y(e,t,r=[]){Te(),ae();const s=d(e)[t].apply(e,r);return fe(),Re(),s}const nt=ze("__proto__,__v_isRef,__isVue"),Ie=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(L));function st(e){L(e)||(e=String(e));const t=d(this);return _(t,"has",e),t.hasOwnProperty(e)}class Me{constructor(t=!1,r=!1){this._isReadonly=t,this._isShallow=r}get(t,r,s){if(r==="__v_skip")return t.__v_skip;const n=this._isReadonly,i=this._isShallow;if(r==="__v_isReactive")return!n;if(r==="__v_isReadonly")return n;if(r==="__v_isShallow")return i;if(r==="__v_raw")return s===(n?i?ht:$e:i?dt:Le).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(s)?t:void 0;const o=D(t);if(!n){let a;if(o&&(a=tt[r]))return a;if(r==="hasOwnProperty")return st}const c=Reflect.get(t,r,x(t)?t:s);return(L(r)?Ie.has(r):nt(r))||(n||_(t,"get",r),i)?c:x(c)?o&&oe(r)?c:c.value:$(c)?n?He(c):be(c):c}}class it extends Me{constructor(t=!1){super(!1,t)}set(t,r,s,n){let i=t[r];if(!this._isShallow){const a=K(i);if(!S(s)&&!K(s)&&(i=d(i),s=d(s)),!D(t)&&x(i)&&!x(s))return a?!1:(i.value=s,!0)}const o=D(t)&&oe(r)?Number(r)<t.length:se(t,r),c=Reflect.set(t,r,s,x(t)?t:n);return t===d(n)&&(o?R(s,i)&&N(t,"set",r,s,i):N(t,"add",r,s)),c}deleteProperty(t,r){const s=se(t,r),n=t[r],i=Reflect.deleteProperty(t,r);return i&&s&&N(t,"delete",r,void 0,n),i}has(t,r){const s=Reflect.has(t,r);return(!L(r)||!Ie.has(r))&&_(t,"has",r),s}ownKeys(t){return _(t,"iterate",D(t)?"length":V),Reflect.ownKeys(t)}}class ot extends Me{constructor(t=!1){super(!0,t)}set(t,r){return process.env.NODE_ENV!=="production"&&O(`Set operation on key "${String(r)}" failed: target is readonly.`,t),!0}deleteProperty(t,r){return process.env.NODE_ENV!=="production"&&O(`Delete operation on key "${String(r)}" failed: target is readonly.`,t),!0}}const ct=new it,at=new ot,ge=e=>e,U=e=>Reflect.getPrototypeOf(e);function ft(e,t,r){return function(...s){const n=this.__v_raw,i=d(n),o=I(i),c=e==="entries"||e===Symbol.iterator&&o,a=e==="keys"&&o,p=n[e](...s),h=r?ge:t?we:g;return!t&&_(i,"iterate",a?de:V),{next(){const{value:f,done:v}=p.next();return v?{value:f,done:v}:{value:c?[h(f[0]),h(f[1])]:h(f),done:v}},[Symbol.iterator](){return this}}}}function J(e){return function(...t){if(process.env.NODE_ENV!=="production"){const r=t[0]?`on key "${t[0]}" `:"";O(`${Xe(e)} operation ${r}failed: target is readonly.`,d(this))}return e==="delete"?!1:e==="clear"?void 0:this}}function ut(e,t){const r={get(n){const i=this.__v_raw,o=d(i),c=d(n);e||(R(n,c)&&_(o,"get",n),_(o,"get",c));const{has:a}=U(o),p=t?ge:e?we:g;if(a.call(o,n))return p(i.get(n));if(a.call(o,c))return p(i.get(c));i!==o&&i.get(n)},get size(){const n=this.__v_raw;return!e&&_(d(n),"iterate",V),Reflect.get(n,"size",n)},has(n){const i=this.__v_raw,o=d(i),c=d(n);return e||(R(n,c)&&_(o,"has",n),_(o,"has",c)),n===c?i.has(n):i.has(n)||i.has(c)},forEach(n,i){const o=this,c=o.__v_raw,a=d(c),p=t?ge:e?we:g;return!e&&_(a,"iterate",V),c.forEach((h,f)=>n.call(i,p(h),p(f),o))}};return ne(r,e?{add:J("add"),set:J("set"),delete:J("delete"),clear:J("clear")}:{add(n){!t&&!S(n)&&!K(n)&&(n=d(n));const i=d(this);return U(i).has.call(i,n)||(i.add(n),N(i,"add",n,n)),this},set(n,i){!t&&!S(i)&&!K(i)&&(i=d(i));const o=d(this),{has:c,get:a}=U(o);let p=c.call(o,n);p?process.env.NODE_ENV!=="production"&&We(o,c,n):(n=d(n),p=c.call(o,n));const h=a.call(o,n);return o.set(n,i),p?R(i,h)&&N(o,"set",n,i,h):N(o,"add",n,i),this},delete(n){const i=d(this),{has:o,get:c}=U(i);let a=o.call(i,n);a?process.env.NODE_ENV!=="production"&&We(i,o,n):(n=d(n),a=o.call(i,n));const p=c?c.call(i,n):void 0,h=i.delete(n);return a&&N(i,"delete",n,void 0,p),h},clear(){const n=d(this),i=n.size!==0,o=process.env.NODE_ENV!=="production"?I(n)?new Map(n):new Set(n):void 0,c=n.clear();return i&&N(n,"clear",void 0,void 0,o),c}}),["keys","values","entries",Symbol.iterator].forEach(n=>{r[n]=ft(n,e,t)}),r}function Ke(e,t){const r=ut(e,t);return(s,n,i)=>n==="__v_isReactive"?!e:n==="__v_isReadonly"?e:n==="__v_raw"?s:Reflect.get(se(r,n)&&n in s?r:s,n,i)}const lt={get:Ke(!1,!1)},pt={get:Ke(!0,!1)};function We(e,t,r){const s=d(r);if(s!==r&&t.call(e,s)){const n=Se(e);O(`Reactive ${n} contains both the raw and reactive versions of the same object${n==="Map"?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)}}const Le=new WeakMap,dt=new WeakMap,$e=new WeakMap,ht=new WeakMap;function vt(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function _t(e){return e.__v_skip||!Object.isExtensible(e)?0:vt(Se(e))}function be(e){return K(e)?e:Ce(e,!1,ct,lt,Le)}function He(e){return Ce(e,!0,at,pt,$e)}function Ce(e,t,r,s,n){if(!$(e))return process.env.NODE_ENV!=="production"&&O(`value cannot be made ${t?"readonly":"reactive"}: ${String(e)}`),e;if(e.__v_raw&&!(t&&e.__v_isReactive))return e;const i=n.get(e);if(i)return i;const o=_t(e);if(o===0)return e;const c=new Proxy(e,o===2?s:r);return n.set(e,c),c}function Q(e){return K(e)?Q(e.__v_raw):!!(e&&e.__v_isReactive)}function K(e){return!!(e&&e.__v_isReadonly)}function S(e){return!!(e&&e.__v_isShallow)}function gt(e){return e?!!e.__v_raw:!1}function d(e){const t=e&&e.__v_raw;return t?d(t):e}const g=e=>$(e)?be(e):e,we=e=>$(e)?He(e):e;function x(e){return e?e.__v_isRef===!0:!1}class bt{constructor(t,r,s){this.fn=t,this.setter=r,this._value=void 0,this.dep=new je(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=F-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!r,this.isSSR=s}notify(){if(this.flags|=16,!(this.flags&8)&&l!==this)return Oe(this,!0),!0;process.env.NODE_ENV}get value(){const t=process.env.NODE_ENV!=="production"?this.dep.track({target:this,type:"get",key:"value"}):this.dep.track();return Ne(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter?this.setter(t):process.env.NODE_ENV!=="production"&&O("Write operation failed: computed value is readonly")}}function Fe(e,t,r=!1){let s,n;ie(e)?s=e:(s=e.get,n=e.set);const i=new bt(s,n,r);return process.env.NODE_ENV,i}const X={},Z=new WeakMap;let j;function wt(e,t=!1,r=j){if(r){let s=Z.get(r);s||Z.set(r,s=[]),s.push(e)}else process.env.NODE_ENV!=="production"&&!t&&O("onWatcherCleanup() was called when there was no active watcher to associate with.")}function Et(e,t,r=Ye){const{immediate:s,deep:n,once:i,scheduler:o,augmentJob:c,call:a}=r,p=u=>{(r.onWarn||O)("Invalid watch source: ",u,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")},h=u=>n?u:S(u)||n===!1||n===0?T(u,1):T(u);let f,v,B,k,ee=!1,te=!1;if(x(e)?(v=()=>e.value,ee=S(e)):Q(e)?(v=()=>h(e),ee=!0):D(e)?(te=!0,ee=e.some(u=>Q(u)||S(u)),v=()=>e.map(u=>{if(x(u))return u.value;if(Q(u))return h(u);if(ie(u))return a?a(u,2):u();process.env.NODE_ENV!=="production"&&p(u)})):ie(e)?t?v=a?()=>a(e,2):e:v=()=>{if(B){Te();try{B()}finally{Re()}}const u=j;j=f;try{return a?a(e,3,[k]):e(k)}finally{j=u}}:(v=Be,process.env.NODE_ENV!=="production"&&p(e)),t&&n){const u=v,y=n===!0?1/0:n;v=()=>T(u(),y)}const W=()=>{f.stop()};if(i&&t){const u=t;t=(...y)=>{u(...y),W()}}let A=te?new Array(e.length).fill(X):X;const q=u=>{if(!(!(f.flags&1)||!f.dirty&&!u))if(t){const y=f.run();if(n||ee||(te?y.some((Ee,re)=>R(Ee,A[re])):R(y,A))){B&&B();const Ee=j;j=f;try{const re=[y,A===X?void 0:te&&A[0]===X?[]:A,k];a?a(t,3,re):t(...re),A=y}finally{j=Ee}}}else f.run()};return c&&c(q),f=new Ze(v),f.scheduler=o?()=>o(q,!1):q,k=u=>wt(u,!1,f),B=f.onStop=()=>{const u=Z.get(f);if(u){if(a)a(u,4);else for(const y of u)y();Z.delete(f)}},process.env.NODE_ENV!=="production"&&(f.onTrack=r.onTrack,f.onTrigger=r.onTrigger),t?s?q(!0):A=f.run():o?o(q.bind(null,!0),!0):f.run(),W.pause=f.pause.bind(f),W.resume=f.resume.bind(f),W.stop=W,W}function T(e,t=1/0,r){if(t<=0||!$(e)||e.__v_skip||(r=r||new Set,r.has(e)))return e;if(r.add(e),t--,x(e))T(e.value,t,r);else if(D(e))for(let s=0;s<e.length;s++)T(e[s],t,r);else if(Ge(e)||I(e))e.forEach(s=>{T(s,t,r)});else if(Qe(e)){for(const s in e)T(e[s],t,r);for(const s of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,s)&&T(e[s],t,r)}return e}function St(e){return e&&typeof e=="object"&&"$state"in e&&"actions"in e}function yt(e,t){const r=new WeakSet,s=(n,i=[])=>typeof n!="object"||n===null||r.has(n)?n:(r.add(n),new Proxy(n,{get(o,c){if(c==="actions")return;const a=[...i,c];t(a);const p=o[c];return typeof p=="function"?p.bind(o):s(p,a)},set(){return!1},deleteProperty(){return!1}}));return s(e)}function Ot(e){if(!St(e))throw new Error("useSnapshot requires a store created with defineStore()");const[,t]=b.useState(0),r=b.useRef(new Set),s=b.useRef(!0);b.useEffect(()=>(s.current=!0,()=>{s.current=!1}),[]);const n=i=>{r.current.add(i.join("."))};return b.useEffect(()=>{const i=Array.from(r.current),o=[];return i.forEach(c=>{const a=c.split("."),p=Et(()=>{let h=e;for(const f of a)h=h[f];return h},()=>{s.current&&t(h=>h+1)},{flush:"sync"});o.push(p)}),()=>o.forEach(c=>c())},[e]),r.current=new Set,yt(e,n)}function mt(e){const t=e.state(),r=be(t),s={$state:r,$underive:n=>{n.forEach(i=>{const o=Object.getOwnPropertyDescriptor(s,i);if(o&&typeof o.get=="function"){const c=o.get.call(s);Object.defineProperty(s,i,{configurable:!0,enumerable:!0,writable:!0,value:c})}})},$invalidate:n=>{n.forEach(i=>{if(s.$underive([i]),e.getters&&i in e.getters){const o=e.getters[i],c=Fe(()=>o(s));Object.defineProperty(s,i,{get:()=>c.value,enumerable:!0,configurable:!0})}})}};if(Object.keys(r).forEach(n=>{Object.defineProperty(s,n,{get:()=>r[n],set:i=>{r[n]=i},enumerable:!0,configurable:!0})}),e.getters&&Object.entries(e.getters).forEach(([n,i])=>{const o=Fe(()=>i(s));Object.defineProperty(s,n,{get:()=>o.value,enumerable:!0,configurable:!0})}),e.actions){const n={};Object.entries(e.actions).forEach(([i,o])=>{n[i]=o.bind(null)}),s.actions=n}return s}class Dt extends b.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,r){console.error("Error caught by boundary:",t,r)}render(){return this.state.error?this.props.fallback(this.state.error):this.props.children}}function Nt({resolve:e,children:t}){const r=b.use(e);return P.jsx(P.Fragment,{children:t(r)})}function xt({resolve:e,fallback:t=null,error:r=n=>P.jsxs("div",{children:["Error: ",n.message]}),children:s}){return P.jsx(Dt,{fallback:r,children:P.jsx(b.Suspense,{fallback:t,children:P.jsx(Nt,{resolve:e,children:s})})})}E.Awaitable=xt,E.defineStore=mt,E.useSnapshot=Ot,Object.defineProperty(E,Symbol.toStringTag,{value:"Module"})});
