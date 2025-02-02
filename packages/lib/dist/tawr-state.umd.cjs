(function(E,b){typeof exports=="object"&&typeof module<"u"?b(exports,require("react"),require("react/jsx-runtime")):typeof define=="function"&&define.amd?define(["exports","react","react/jsx-runtime"],b):(E=typeof globalThis<"u"?globalThis:E||self,b(E.TawrState={},E.react,E.jsxRuntime))})(this,function(E,b,D){"use strict";/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**//*! #__NO_SIDE_EFFECTS__ */function Ge(e){const t=Object.create(null);for(const r of e.split(","))t[r]=1;return r=>r in t}const Je=process.env.NODE_ENV!=="production"?Object.freeze({}):{};process.env.NODE_ENV!=="production"&&Object.freeze([]);const Ue=()=>{},ne=Object.assign,Qe=Object.prototype.hasOwnProperty,se=(e,t)=>Qe.call(e,t),N=Array.isArray,M=e=>G(e)==="[object Map]",Xe=e=>G(e)==="[object Set]",ie=e=>typeof e=="function",Ze=e=>typeof e=="string",$=e=>typeof e=="symbol",C=e=>e!==null&&typeof e=="object",ke=Object.prototype.toString,G=e=>ke.call(e),Se=e=>G(e).slice(8,-1),et=e=>G(e)==="[object Object]",oe=e=>Ze(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,tt=(e=>{const t=Object.create(null);return r=>t[r]||(t[r]=e(r))})(e=>e.charAt(0).toUpperCase()+e.slice(1)),V=(e,t)=>!Object.is(e,t);/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function O(e,...t){console.warn(`[Vue warn] ${e}`,...t)}let d;const ce=new WeakSet;class rt{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,ce.has(this)&&(ce.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Oe(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ve(this),me(this);const t=d,r=w;d=this,w=!0;try{return this.fn()}finally{process.env.NODE_ENV!=="production"&&d!==this&&O("Active effect was not restored correctly - this is likely a Vue internal bug."),De(this),d=t,w=r,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)le(t);this.deps=this.depsTail=void 0,Ve(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?ce.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){ue(this)&&this.run()}get dirty(){return ue(this)}}let ye=0,H,F;function Oe(e,t=!1){if(e.flags|=8,t){e.next=F,F=e;return}e.next=H,H=e}function ae(){ye++}function fe(){if(--ye>0)return;if(F){let t=F;for(F=void 0;t;){const r=t.next;t.next=void 0,t.flags&=-9,t=r}}let e;for(;H;){let t=H;for(H=void 0;t;){const r=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(s){e||(e=s)}t=r}}if(e)throw e}function me(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function De(e){let t,r=e.depsTail,s=r;for(;s;){const n=s.prevDep;s.version===-1?(s===r&&(r=n),le(s),nt(s)):t=s,s.dep.activeLink=s.prevActiveLink,s.prevActiveLink=void 0,s=n}e.deps=t,e.depsTail=r}function ue(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ne(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ne(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===z))return;e.globalVersion=z;const t=e.dep;if(e.flags|=2,t.version>0&&!e.isSSR&&e.deps&&!ue(e)){e.flags&=-3;return}const r=d,s=w;d=e,w=!0;try{me(e);const n=e.fn(e._value);(t.version===0||V(n,e._value))&&(e._value=n,t.version++)}catch(n){throw t.version++,n}finally{d=r,w=s,De(e),e.flags&=-3}}function le(e,t=!1){const{dep:r,prevSub:s,nextSub:n}=e;if(s&&(s.nextSub=n,e.prevSub=void 0),n&&(n.prevSub=s,e.nextSub=void 0),process.env.NODE_ENV!=="production"&&r.subsHead===e&&(r.subsHead=n),r.subs===e&&(r.subs=s,!s&&r.computed)){r.computed.flags&=-5;for(let i=r.computed.deps;i;i=i.nextDep)le(i,!0)}!t&&!--r.sc&&r.map&&r.map.delete(r.key)}function nt(e){const{prevDep:t,nextDep:r}=e;t&&(t.nextDep=r,e.prevDep=void 0),r&&(r.prevDep=t,e.nextDep=void 0)}let w=!0;const xe=[];function Te(){xe.push(w),w=!1}function Re(){const e=xe.pop();w=e===void 0?!0:e}function Ve(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const r=d;d=void 0;try{t()}finally{d=r}}}let z=0;class st{constructor(t,r){this.sub=t,this.dep=r,this.version=r.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class je{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,process.env.NODE_ENV!=="production"&&(this.subsHead=void 0)}track(t){if(!d||!w||d===this.computed)return;let r=this.activeLink;if(r===void 0||r.sub!==d)r=this.activeLink=new st(d,this),d.deps?(r.prevDep=d.depsTail,d.depsTail.nextDep=r,d.depsTail=r):d.deps=d.depsTail=r,Pe(r);else if(r.version===-1&&(r.version=this.version,r.nextDep)){const s=r.nextDep;s.prevDep=r.prevDep,r.prevDep&&(r.prevDep.nextDep=s),r.prevDep=d.depsTail,r.nextDep=void 0,d.depsTail.nextDep=r,d.depsTail=r,d.deps===r&&(d.deps=s)}return process.env.NODE_ENV!=="production"&&d.onTrack&&d.onTrack(ne({effect:d},t)),r}trigger(t){this.version++,z++,this.notify(t)}notify(t){ae();try{if(process.env.NODE_ENV!=="production")for(let r=this.subsHead;r;r=r.nextSub)r.sub.onTrigger&&!(r.sub.flags&8)&&r.sub.onTrigger(ne({effect:r.sub},t));for(let r=this.subs;r;r=r.prevSub)r.sub.notify()&&r.sub.dep.notify()}finally{fe()}}}function Pe(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let s=t.deps;s;s=s.nextDep)Pe(s)}const r=e.dep.subs;r!==e&&(e.prevSub=r,r&&(r.nextSub=e)),process.env.NODE_ENV!=="production"&&e.dep.subsHead===void 0&&(e.dep.subsHead=e),e.dep.subs=e}}const pe=new WeakMap,j=Symbol(process.env.NODE_ENV!=="production"?"Object iterate":""),de=Symbol(process.env.NODE_ENV!=="production"?"Map keys iterate":""),Y=Symbol(process.env.NODE_ENV!=="production"?"Array iterate":"");function _(e,t,r){if(w&&d){let s=pe.get(e);s||pe.set(e,s=new Map);let n=s.get(r);n||(s.set(r,n=new je),n.map=s,n.key=r),process.env.NODE_ENV!=="production"?n.track({target:e,type:t,key:r}):n.track()}}function x(e,t,r,s,n,i){const o=pe.get(e);if(!o){z++;return}const c=a=>{a&&(process.env.NODE_ENV!=="production"?a.trigger({target:e,type:t,key:r,newValue:s,oldValue:n,oldTarget:i}):a.trigger())};if(ae(),t==="clear")o.forEach(c);else{const a=N(e),l=a&&oe(r);if(a&&r==="length"){const v=Number(s);o.forEach((f,p)=>{(p==="length"||p===Y||!$(p)&&p>=v)&&c(f)})}else switch((r!==void 0||o.has(void 0))&&c(o.get(r)),l&&c(o.get(Y)),t){case"add":a?l&&c(o.get("length")):(c(o.get(j)),M(e)&&c(o.get(de)));break;case"delete":a||(c(o.get(j)),M(e)&&c(o.get(de)));break;case"set":M(e)&&c(o.get(j));break}}fe()}function K(e){const t=h(e);return t===e?t:(_(t,"iterate",Y),S(e)?t:t.map(g))}function he(e){return _(e=h(e),"iterate",Y),e}const it={__proto__:null,[Symbol.iterator](){return ve(this,Symbol.iterator,g)},concat(...e){return K(this).concat(...e.map(t=>N(t)?K(t):t))},entries(){return ve(this,"entries",e=>(e[1]=g(e[1]),e))},every(e,t){return m(this,"every",e,t,void 0,arguments)},filter(e,t){return m(this,"filter",e,t,r=>r.map(g),arguments)},find(e,t){return m(this,"find",e,t,g,arguments)},findIndex(e,t){return m(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return m(this,"findLast",e,t,g,arguments)},findLastIndex(e,t){return m(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return m(this,"forEach",e,t,void 0,arguments)},includes(...e){return _e(this,"includes",e)},indexOf(...e){return _e(this,"indexOf",e)},join(e){return K(this).join(e)},lastIndexOf(...e){return _e(this,"lastIndexOf",e)},map(e,t){return m(this,"map",e,t,void 0,arguments)},pop(){return B(this,"pop")},push(...e){return B(this,"push",e)},reduce(e,...t){return Ae(this,"reduce",e,t)},reduceRight(e,...t){return Ae(this,"reduceRight",e,t)},shift(){return B(this,"shift")},some(e,t){return m(this,"some",e,t,void 0,arguments)},splice(...e){return B(this,"splice",e)},toReversed(){return K(this).toReversed()},toSorted(e){return K(this).toSorted(e)},toSpliced(...e){return K(this).toSpliced(...e)},unshift(...e){return B(this,"unshift",e)},values(){return ve(this,"values",g)}};function ve(e,t,r){const s=he(e),n=s[t]();return s!==e&&!S(e)&&(n._next=n.next,n.next=()=>{const i=n._next();return i.value&&(i.value=r(i.value)),i}),n}const ot=Array.prototype;function m(e,t,r,s,n,i){const o=he(e),c=o!==e&&!S(e),a=o[t];if(a!==ot[t]){const f=a.apply(e,i);return c?g(f):f}let l=r;o!==e&&(c?l=function(f,p){return r.call(this,g(f),p,e)}:r.length>2&&(l=function(f,p){return r.call(this,f,p,e)}));const v=a.call(o,l,s);return c&&n?n(v):v}function Ae(e,t,r,s){const n=he(e);let i=r;return n!==e&&(S(e)?r.length>3&&(i=function(o,c,a){return r.call(this,o,c,a,e)}):i=function(o,c,a){return r.call(this,o,g(c),a,e)}),n[t](i,...s)}function _e(e,t,r){const s=h(e);_(s,"iterate",Y);const n=s[t](...r);return(n===-1||n===!1)&&St(r[0])?(r[0]=h(r[0]),s[t](...r)):n}function B(e,t,r=[]){Te(),ae();const s=h(e)[t].apply(e,r);return fe(),Re(),s}const ct=Ge("__proto__,__v_isRef,__isVue"),Ie=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter($));function at(e){$(e)||(e=String(e));const t=h(this);return _(t,"has",e),t.hasOwnProperty(e)}class Me{constructor(t=!1,r=!1){this._isReadonly=t,this._isShallow=r}get(t,r,s){if(r==="__v_skip")return t.__v_skip;const n=this._isReadonly,i=this._isShallow;if(r==="__v_isReactive")return!n;if(r==="__v_isReadonly")return n;if(r==="__v_isShallow")return i;if(r==="__v_raw")return s===(n?i?bt:$e:i?gt:We).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(s)?t:void 0;const o=N(t);if(!n){let a;if(o&&(a=it[r]))return a;if(r==="hasOwnProperty")return at}const c=Reflect.get(t,r,T(t)?t:s);return($(r)?Ie.has(r):ct(r))||(n||_(t,"get",r),i)?c:T(c)?o&&oe(r)?c:c.value:C(c)?n?Ce(c):be(c):c}}class ft extends Me{constructor(t=!1){super(!1,t)}set(t,r,s,n){let i=t[r];if(!this._isShallow){const a=L(i);if(!S(s)&&!L(s)&&(i=h(i),s=h(s)),!N(t)&&T(i)&&!T(s))return a?!1:(i.value=s,!0)}const o=N(t)&&oe(r)?Number(r)<t.length:se(t,r),c=Reflect.set(t,r,s,T(t)?t:n);return t===h(n)&&(o?V(s,i)&&x(t,"set",r,s,i):x(t,"add",r,s)),c}deleteProperty(t,r){const s=se(t,r),n=t[r],i=Reflect.deleteProperty(t,r);return i&&s&&x(t,"delete",r,void 0,n),i}has(t,r){const s=Reflect.has(t,r);return(!$(r)||!Ie.has(r))&&_(t,"has",r),s}ownKeys(t){return _(t,"iterate",N(t)?"length":j),Reflect.ownKeys(t)}}class ut extends Me{constructor(t=!1){super(!0,t)}set(t,r){return process.env.NODE_ENV!=="production"&&O(`Set operation on key "${String(r)}" failed: target is readonly.`,t),!0}deleteProperty(t,r){return process.env.NODE_ENV!=="production"&&O(`Delete operation on key "${String(r)}" failed: target is readonly.`,t),!0}}const lt=new ft,pt=new ut,ge=e=>e,J=e=>Reflect.getPrototypeOf(e);function dt(e,t,r){return function(...s){const n=this.__v_raw,i=h(n),o=M(i),c=e==="entries"||e===Symbol.iterator&&o,a=e==="keys"&&o,l=n[e](...s),v=r?ge:t?we:g;return!t&&_(i,"iterate",a?de:j),{next(){const{value:f,done:p}=l.next();return p?{value:f,done:p}:{value:c?[v(f[0]),v(f[1])]:v(f),done:p}},[Symbol.iterator](){return this}}}}function U(e){return function(...t){if(process.env.NODE_ENV!=="production"){const r=t[0]?`on key "${t[0]}" `:"";O(`${tt(e)} operation ${r}failed: target is readonly.`,h(this))}return e==="delete"?!1:e==="clear"?void 0:this}}function ht(e,t){const r={get(n){const i=this.__v_raw,o=h(i),c=h(n);e||(V(n,c)&&_(o,"get",n),_(o,"get",c));const{has:a}=J(o),l=t?ge:e?we:g;if(a.call(o,n))return l(i.get(n));if(a.call(o,c))return l(i.get(c));i!==o&&i.get(n)},get size(){const n=this.__v_raw;return!e&&_(h(n),"iterate",j),Reflect.get(n,"size",n)},has(n){const i=this.__v_raw,o=h(i),c=h(n);return e||(V(n,c)&&_(o,"has",n),_(o,"has",c)),n===c?i.has(n):i.has(n)||i.has(c)},forEach(n,i){const o=this,c=o.__v_raw,a=h(c),l=t?ge:e?we:g;return!e&&_(a,"iterate",j),c.forEach((v,f)=>n.call(i,l(v),l(f),o))}};return ne(r,e?{add:U("add"),set:U("set"),delete:U("delete"),clear:U("clear")}:{add(n){!t&&!S(n)&&!L(n)&&(n=h(n));const i=h(this);return J(i).has.call(i,n)||(i.add(n),x(i,"add",n,n)),this},set(n,i){!t&&!S(i)&&!L(i)&&(i=h(i));const o=h(this),{has:c,get:a}=J(o);let l=c.call(o,n);l?process.env.NODE_ENV!=="production"&&Le(o,c,n):(n=h(n),l=c.call(o,n));const v=a.call(o,n);return o.set(n,i),l?V(i,v)&&x(o,"set",n,i,v):x(o,"add",n,i),this},delete(n){const i=h(this),{has:o,get:c}=J(i);let a=o.call(i,n);a?process.env.NODE_ENV!=="production"&&Le(i,o,n):(n=h(n),a=o.call(i,n));const l=c?c.call(i,n):void 0,v=i.delete(n);return a&&x(i,"delete",n,void 0,l),v},clear(){const n=h(this),i=n.size!==0,o=process.env.NODE_ENV!=="production"?M(n)?new Map(n):new Set(n):void 0,c=n.clear();return i&&x(n,"clear",void 0,void 0,o),c}}),["keys","values","entries",Symbol.iterator].forEach(n=>{r[n]=dt(n,e,t)}),r}function Ke(e,t){const r=ht(e,t);return(s,n,i)=>n==="__v_isReactive"?!e:n==="__v_isReadonly"?e:n==="__v_raw"?s:Reflect.get(se(r,n)&&n in s?r:s,n,i)}const vt={get:Ke(!1,!1)},_t={get:Ke(!0,!1)};function Le(e,t,r){const s=h(r);if(s!==r&&t.call(e,s)){const n=Se(e);O(`Reactive ${n} contains both the raw and reactive versions of the same object${n==="Map"?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)}}const We=new WeakMap,gt=new WeakMap,$e=new WeakMap,bt=new WeakMap;function wt(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Et(e){return e.__v_skip||!Object.isExtensible(e)?0:wt(Se(e))}function be(e){return L(e)?e:He(e,!1,lt,vt,We)}function Ce(e){return He(e,!0,pt,_t,$e)}function He(e,t,r,s,n){if(!C(e))return process.env.NODE_ENV!=="production"&&O(`value cannot be made ${t?"readonly":"reactive"}: ${String(e)}`),e;if(e.__v_raw&&!(t&&e.__v_isReactive))return e;const i=n.get(e);if(i)return i;const o=Et(e);if(o===0)return e;const c=new Proxy(e,o===2?s:r);return n.set(e,c),c}function Q(e){return L(e)?Q(e.__v_raw):!!(e&&e.__v_isReactive)}function L(e){return!!(e&&e.__v_isReadonly)}function S(e){return!!(e&&e.__v_isShallow)}function St(e){return e?!!e.__v_raw:!1}function h(e){const t=e&&e.__v_raw;return t?h(t):e}const g=e=>C(e)?be(e):e,we=e=>C(e)?Ce(e):e;function T(e){return e?e.__v_isRef===!0:!1}class yt{constructor(t,r,s){this.fn=t,this.setter=r,this._value=void 0,this.dep=new je(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=z-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!r,this.isSSR=s}notify(){if(this.flags|=16,!(this.flags&8)&&d!==this)return Oe(this,!0),!0;process.env.NODE_ENV}get value(){const t=process.env.NODE_ENV!=="production"?this.dep.track({target:this,type:"get",key:"value"}):this.dep.track();return Ne(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter?this.setter(t):process.env.NODE_ENV!=="production"&&O("Write operation failed: computed value is readonly")}}function Fe(e,t,r=!1){let s,n;ie(e)?s=e:(s=e.get,n=e.set);const i=new yt(s,n,r);return process.env.NODE_ENV,i}const X={},Z=new WeakMap;let P;function Ot(e,t=!1,r=P){if(r){let s=Z.get(r);s||Z.set(r,s=[]),s.push(e)}else process.env.NODE_ENV!=="production"&&!t&&O("onWatcherCleanup() was called when there was no active watcher to associate with.")}function mt(e,t,r=Je){const{immediate:s,deep:n,once:i,scheduler:o,augmentJob:c,call:a}=r,l=u=>{(r.onWarn||O)("Invalid watch source: ",u,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")},v=u=>n?u:S(u)||n===!1||n===0?R(u,1):R(u);let f,p,A,k,ee=!1,te=!1;if(T(e)?(p=()=>e.value,ee=S(e)):Q(e)?(p=()=>v(e),ee=!0):N(e)?(te=!0,ee=e.some(u=>Q(u)||S(u)),p=()=>e.map(u=>{if(T(u))return u.value;if(Q(u))return v(u);if(ie(u))return a?a(u,2):u();process.env.NODE_ENV!=="production"&&l(u)})):ie(e)?t?p=a?()=>a(e,2):e:p=()=>{if(A){Te();try{A()}finally{Re()}}const u=P;P=f;try{return a?a(e,3,[k]):e(k)}finally{P=u}}:(p=Ue,process.env.NODE_ENV!=="production"&&l(e)),t&&n){const u=p,y=n===!0?1/0:n;p=()=>R(u(),y)}const W=()=>{f.stop()};if(i&&t){const u=t;t=(...y)=>{u(...y),W()}}let I=te?new Array(e.length).fill(X):X;const q=u=>{if(!(!(f.flags&1)||!f.dirty&&!u))if(t){const y=f.run();if(n||ee||(te?y.some((Ee,re)=>V(Ee,I[re])):V(y,I))){A&&A();const Ee=P;P=f;try{const re=[y,I===X?void 0:te&&I[0]===X?[]:I,k];a?a(t,3,re):t(...re),I=y}finally{P=Ee}}}else f.run()};return c&&c(q),f=new rt(p),f.scheduler=o?()=>o(q,!1):q,k=u=>Ot(u,!1,f),A=f.onStop=()=>{const u=Z.get(f);if(u){if(a)a(u,4);else for(const y of u)y();Z.delete(f)}},process.env.NODE_ENV!=="production"&&(f.onTrack=r.onTrack,f.onTrigger=r.onTrigger),t?s?q(!0):I=f.run():o?o(q.bind(null,!0),!0):f.run(),W.pause=f.pause.bind(f),W.resume=f.resume.bind(f),W.stop=W,W}function R(e,t=1/0,r){if(t<=0||!C(e)||e.__v_skip||(r=r||new Set,r.has(e)))return e;if(r.add(e),t--,T(e))R(e.value,t,r);else if(N(e))for(let s=0;s<e.length;s++)R(e[s],t,r);else if(Xe(e)||M(e))e.forEach(s=>{R(s,t,r)});else if(et(e)){for(const s in e)R(e[s],t,r);for(const s of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,s)&&R(e[s],t,r)}return e}function Dt(e){return e&&typeof e=="object"&&"$state"in e&&"actions"in e}function ze(e){return typeof e=="object"&&e!==null&&typeof e.value<"u"}function Nt(e,t){const r=new WeakSet,s=(n,i=[])=>typeof n!="object"||n===null||r.has(n)?n:(r.add(n),new Proxy(n,{get(o,c){if(c==="actions"||c==="$underive"||c==="$invalidate"||c==="$state")return;const a=[...i,c];t(a);const l=o[c];return ze(l)?l.value:typeof l=="function"?l.bind(o):s(l,a)},set(){return!1},deleteProperty(){return!1}}));return s(e)}function Ye(e){if(!Dt(e))throw new Error("useSnapshot requires a store created with defineStore()");const t=b.useRef(new Set),r=b.useRef(null),s=b.useRef(0),n=c=>{t.current.add(c.join("."))},i=c=>{const l=Array.from(t.current).map(v=>{const f=v.split(".");return mt(()=>{let p=e;for(const A of f){if(p==null)return;p=p[A],ze(p)&&(p=p.value)}return p},()=>{s.current++,r.current=null,c()},{flush:"sync"})});return()=>{l.forEach(v=>v())}},o=()=>(r.current!==null||(t.current=new Set,r.current=Nt(e,n)),r.current);return b.useSyncExternalStore(i,o)}function xt(e){const t=e.state(),r=be(t),s={$state:r,$underive(n){n.forEach(i=>{const o=Object.getOwnPropertyDescriptor(s,i);if(o&&typeof o.get=="function"){const c=o.get.call(s);Object.defineProperty(s,i,{configurable:!0,enumerable:!0,writable:!0,value:c})}})},$invalidate(n){n.forEach(i=>{if(e.getters&&i in e.getters){const o=e.getters[i],c=Fe(()=>o(s));Object.defineProperty(s,i,{get:()=>c.value,enumerable:!0,configurable:!0})}})}};if(Object.keys(r).forEach(n=>{Object.defineProperty(s,n,{get:()=>r[n],set:i=>{r[n]=i},enumerable:!0,configurable:!0})}),e.getters&&Object.entries(e.getters).forEach(([n,i])=>{const o=Fe(()=>i(s));Object.defineProperty(s,n,{get:()=>o.value,enumerable:!0,configurable:!0})}),e.actions){const n={};Object.entries(e.actions).forEach(([i,o])=>{n[i]=o.bind(s)}),s.actions=n}return[()=>Ye(s),s]}class Be extends b.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,r){console.error("Error caught by boundary:",t,r)}render(){return this.state.error?this.props.fallback(this.state.error):this.props.children}}function qe({resolve:e,children:t}){const r=e instanceof Promise?b.use(e):e;return D.jsx(D.Fragment,{children:t(r)})}function Tt({resolve:e,fallback:t=null,error:r=n=>D.jsxs("div",{children:["Error: ",n.message]}),children:s}){return t?D.jsx(Be,{fallback:r,children:D.jsx(b.Suspense,{fallback:t,children:D.jsx(qe,{resolve:e,children:s})})}):D.jsx(Be,{fallback:r,children:D.jsx(qe,{resolve:e,children:s})})}E.Awaitable=Tt,E.defineStore=xt,E.useSnapshot=Ye,Object.defineProperty(E,Symbol.toStringTag,{value:"Module"})});
