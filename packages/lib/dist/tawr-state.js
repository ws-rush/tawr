import { useRef as re, useSyncExternalStore as Be, Suspense as Ge, Component as Je, use as Ue } from "react";
import { jsx as I, jsxs as qe, Fragment as Qe } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Xe(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
const Ze = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const ke = () => {
}, oe = Object.assign, et = Object.prototype.hasOwnProperty, ce = (e, t) => et.call(e, t), D = Array.isArray, M = (e) => ee(e) === "[object Map]", tt = (e) => ee(e) === "[object Set]", ae = (e) => typeof e == "function", rt = (e) => typeof e == "string", F = (e) => typeof e == "symbol", Y = (e) => e !== null && typeof e == "object", nt = Object.prototype.toString, ee = (e) => nt.call(e), Ne = (e) => ee(e).slice(8, -1), st = (e) => ee(e) === "[object Object]", de = (e) => rt(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, it = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, ot = it((e) => e.charAt(0).toUpperCase() + e.slice(1)), V = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function y(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let h;
const ne = /* @__PURE__ */ new WeakSet();
class ct {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, ne.has(this) && (ne.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Re(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ee(this), Te(this);
    const t = h, r = b;
    h = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && h !== this && y(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Ve(this), h = t, b = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ge(t);
      this.deps = this.depsTail = void 0, Ee(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? ne.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ue(this) && this.run();
  }
  get dirty() {
    return ue(this);
  }
}
let xe = 0, $, C;
function Re(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = C, C = e;
    return;
  }
  e.next = $, $ = e;
}
function ve() {
  xe++;
}
function _e() {
  if (--xe > 0)
    return;
  if (C) {
    let t = C;
    for (C = void 0; t; ) {
      const r = t.next;
      t.next = void 0, t.flags &= -9, t = r;
    }
  }
  let e;
  for (; $; ) {
    let t = $;
    for ($ = void 0; t; ) {
      const r = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = r;
    }
  }
  if (e) throw e;
}
function Te(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ve(e) {
  let t, r = e.depsTail, s = r;
  for (; s; ) {
    const n = s.prevDep;
    s.version === -1 ? (s === r && (r = n), ge(s), at(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = n;
  }
  e.deps = t, e.depsTail = r;
}
function ue(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (je(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function je(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === H))
    return;
  e.globalVersion = H;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !ue(e)) {
    e.flags &= -3;
    return;
  }
  const r = h, s = b;
  h = e, b = !0;
  try {
    Te(e);
    const n = e.fn(e._value);
    (t.version === 0 || V(n, e._value)) && (e._value = n, t.version++);
  } catch (n) {
    throw t.version++, n;
  } finally {
    h = r, b = s, Ve(e), e.flags &= -3;
  }
}
function ge(e, t = !1) {
  const { dep: r, prevSub: s, nextSub: n } = e;
  if (s && (s.nextSub = n, e.prevSub = void 0), n && (n.prevSub = s, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = n), r.subs === e && (r.subs = s, !s && r.computed)) {
    r.computed.flags &= -5;
    for (let i = r.computed.deps; i; i = i.nextDep)
      ge(i, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function at(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
let b = !0;
const Pe = [];
function Ae() {
  Pe.push(b), b = !1;
}
function Ie() {
  const e = Pe.pop();
  b = e === void 0 ? !0 : e;
}
function Ee(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const r = h;
    h = void 0;
    try {
      t();
    } finally {
      h = r;
    }
  }
}
let H = 0;
class ut {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Me {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!h || !b || h === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== h)
      r = this.activeLink = new ut(h, this), h.deps ? (r.prevDep = h.depsTail, h.depsTail.nextDep = r, h.depsTail = r) : h.deps = h.depsTail = r, Ke(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const s = r.nextDep;
      s.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = s), r.prevDep = h.depsTail, r.nextDep = void 0, h.depsTail.nextDep = r, h.depsTail = r, h.deps === r && (h.deps = s);
    }
    return process.env.NODE_ENV !== "production" && h.onTrack && h.onTrack(
      oe(
        {
          effect: h
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, H++, this.notify(t);
  }
  notify(t) {
    ve();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            oe(
              {
                effect: r.sub
              },
              t
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      _e();
    }
  }
}
function Ke(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ke(s);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const fe = /* @__PURE__ */ new WeakMap(), j = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), le = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), z = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function _(e, t, r) {
  if (b && h) {
    let s = fe.get(e);
    s || fe.set(e, s = /* @__PURE__ */ new Map());
    let n = s.get(r);
    n || (s.set(r, n = new Me()), n.map = s, n.key = r), process.env.NODE_ENV !== "production" ? n.track({
      target: e,
      type: t,
      key: r
    }) : n.track();
  }
}
function m(e, t, r, s, n, i) {
  const o = fe.get(e);
  if (!o) {
    H++;
    return;
  }
  const c = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: e,
      type: t,
      key: r,
      newValue: s,
      oldValue: n,
      oldTarget: i
    }) : a.trigger());
  };
  if (ve(), t === "clear")
    o.forEach(c);
  else {
    const a = D(e), l = a && de(r);
    if (a && r === "length") {
      const v = Number(s);
      o.forEach((u, p) => {
        (p === "length" || p === z || !F(p) && p >= v) && c(u);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), l && c(o.get(z)), t) {
        case "add":
          a ? l && c(o.get("length")) : (c(o.get(j)), M(e) && c(o.get(le)));
          break;
        case "delete":
          a || (c(o.get(j)), M(e) && c(o.get(le)));
          break;
        case "set":
          M(e) && c(o.get(j));
          break;
      }
  }
  _e();
}
function A(e) {
  const t = d(e);
  return t === e ? t : (_(t, "iterate", z), E(e) ? t : t.map(g));
}
function be(e) {
  return _(e = d(e), "iterate", z), e;
}
const ft = {
  __proto__: null,
  [Symbol.iterator]() {
    return se(this, Symbol.iterator, g);
  },
  concat(...e) {
    return A(this).concat(
      ...e.map((t) => D(t) ? A(t) : t)
    );
  },
  entries() {
    return se(this, "entries", (e) => (e[1] = g(e[1]), e));
  },
  every(e, t) {
    return S(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return S(this, "filter", e, t, (r) => r.map(g), arguments);
  },
  find(e, t) {
    return S(this, "find", e, t, g, arguments);
  },
  findIndex(e, t) {
    return S(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return S(this, "findLast", e, t, g, arguments);
  },
  findLastIndex(e, t) {
    return S(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return S(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ie(this, "includes", e);
  },
  indexOf(...e) {
    return ie(this, "indexOf", e);
  },
  join(e) {
    return A(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return ie(this, "lastIndexOf", e);
  },
  map(e, t) {
    return S(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return W(this, "pop");
  },
  push(...e) {
    return W(this, "push", e);
  },
  reduce(e, ...t) {
    return Se(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Se(this, "reduceRight", e, t);
  },
  shift() {
    return W(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return S(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return W(this, "splice", e);
  },
  toReversed() {
    return A(this).toReversed();
  },
  toSorted(e) {
    return A(this).toSorted(e);
  },
  toSpliced(...e) {
    return A(this).toSpliced(...e);
  },
  unshift(...e) {
    return W(this, "unshift", e);
  },
  values() {
    return se(this, "values", g);
  }
};
function se(e, t, r) {
  const s = be(e), n = s[t]();
  return s !== e && !E(e) && (n._next = n.next, n.next = () => {
    const i = n._next();
    return i.value && (i.value = r(i.value)), i;
  }), n;
}
const lt = Array.prototype;
function S(e, t, r, s, n, i) {
  const o = be(e), c = o !== e && !E(e), a = o[t];
  if (a !== lt[t]) {
    const u = a.apply(e, i);
    return c ? g(u) : u;
  }
  let l = r;
  o !== e && (c ? l = function(u, p) {
    return r.call(this, g(u), p, e);
  } : r.length > 2 && (l = function(u, p) {
    return r.call(this, u, p, e);
  }));
  const v = a.call(o, l, s);
  return c && n ? n(v) : v;
}
function Se(e, t, r, s) {
  const n = be(e);
  let i = r;
  return n !== e && (E(e) ? r.length > 3 && (i = function(o, c, a) {
    return r.call(this, o, c, a, e);
  }) : i = function(o, c, a) {
    return r.call(this, o, g(c), a, e);
  }), n[t](i, ...s);
}
function ie(e, t, r) {
  const s = d(e);
  _(s, "iterate", z);
  const n = s[t](...r);
  return (n === -1 || n === !1) && Nt(r[0]) ? (r[0] = d(r[0]), s[t](...r)) : n;
}
function W(e, t, r = []) {
  Ae(), ve();
  const s = d(e)[t].apply(e, r);
  return _e(), Ie(), s;
}
const pt = /* @__PURE__ */ Xe("__proto__,__v_isRef,__isVue"), Le = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(F)
);
function ht(e) {
  F(e) || (e = String(e));
  const t = d(this);
  return _(t, "has", e), t.hasOwnProperty(e);
}
class We {
  constructor(t = !1, r = !1) {
    this._isReadonly = t, this._isShallow = r;
  }
  get(t, r, s) {
    if (r === "__v_skip") return t.__v_skip;
    const n = this._isReadonly, i = this._isShallow;
    if (r === "__v_isReactive")
      return !n;
    if (r === "__v_isReadonly")
      return n;
    if (r === "__v_isShallow")
      return i;
    if (r === "__v_raw")
      return s === (n ? i ? mt : He : i ? yt : Ce).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = D(t);
    if (!n) {
      let a;
      if (o && (a = ft[r]))
        return a;
      if (r === "hasOwnProperty")
        return ht;
    }
    const c = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      N(t) ? t : s
    );
    return (F(r) ? Le.has(r) : pt(r)) || (n || _(t, "get", r), i) ? c : N(c) ? o && de(r) ? c : c.value : Y(c) ? n ? ze(c) : we(c) : c;
  }
}
class dt extends We {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    if (!this._isShallow) {
      const a = K(i);
      if (!E(s) && !K(s) && (i = d(i), s = d(s)), !D(t) && N(i) && !N(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = D(t) && de(r) ? Number(r) < t.length : ce(t, r), c = Reflect.set(
      t,
      r,
      s,
      N(t) ? t : n
    );
    return t === d(n) && (o ? V(s, i) && m(t, "set", r, s, i) : m(t, "add", r, s)), c;
  }
  deleteProperty(t, r) {
    const s = ce(t, r), n = t[r], i = Reflect.deleteProperty(t, r);
    return i && s && m(t, "delete", r, void 0, n), i;
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return (!F(r) || !Le.has(r)) && _(t, "has", r), s;
  }
  ownKeys(t) {
    return _(
      t,
      "iterate",
      D(t) ? "length" : j
    ), Reflect.ownKeys(t);
  }
}
class vt extends We {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, r) {
    return process.env.NODE_ENV !== "production" && y(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, r) {
    return process.env.NODE_ENV !== "production" && y(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const _t = /* @__PURE__ */ new dt(), gt = /* @__PURE__ */ new vt(), pe = (e) => e, q = (e) => Reflect.getPrototypeOf(e);
function bt(e, t, r) {
  return function(...s) {
    const n = this.__v_raw, i = d(n), o = M(i), c = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, l = n[e](...s), v = r ? pe : t ? he : g;
    return !t && _(
      i,
      "iterate",
      a ? le : j
    ), {
      // iterator protocol
      next() {
        const { value: u, done: p } = l.next();
        return p ? { value: u, done: p } : {
          value: c ? [v(u[0]), v(u[1])] : v(u),
          done: p
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Q(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const r = t[0] ? `on key "${t[0]}" ` : "";
      y(
        `${ot(e)} operation ${r}failed: target is readonly.`,
        d(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function wt(e, t) {
  const r = {
    get(n) {
      const i = this.__v_raw, o = d(i), c = d(n);
      e || (V(n, c) && _(o, "get", n), _(o, "get", c));
      const { has: a } = q(o), l = t ? pe : e ? he : g;
      if (a.call(o, n))
        return l(i.get(n));
      if (a.call(o, c))
        return l(i.get(c));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !e && _(d(n), "iterate", j), Reflect.get(n, "size", n);
    },
    has(n) {
      const i = this.__v_raw, o = d(i), c = d(n);
      return e || (V(n, c) && _(o, "has", n), _(o, "has", c)), n === c ? i.has(n) : i.has(n) || i.has(c);
    },
    forEach(n, i) {
      const o = this, c = o.__v_raw, a = d(c), l = t ? pe : e ? he : g;
      return !e && _(a, "iterate", j), c.forEach((v, u) => n.call(i, l(v), l(u), o));
    }
  };
  return oe(
    r,
    e ? {
      add: Q("add"),
      set: Q("set"),
      delete: Q("delete"),
      clear: Q("clear")
    } : {
      add(n) {
        !t && !E(n) && !K(n) && (n = d(n));
        const i = d(this);
        return q(i).has.call(i, n) || (i.add(n), m(i, "add", n, n)), this;
      },
      set(n, i) {
        !t && !E(i) && !K(i) && (i = d(i));
        const o = d(this), { has: c, get: a } = q(o);
        let l = c.call(o, n);
        l ? process.env.NODE_ENV !== "production" && ye(o, c, n) : (n = d(n), l = c.call(o, n));
        const v = a.call(o, n);
        return o.set(n, i), l ? V(i, v) && m(o, "set", n, i, v) : m(o, "add", n, i), this;
      },
      delete(n) {
        const i = d(this), { has: o, get: c } = q(i);
        let a = o.call(i, n);
        a ? process.env.NODE_ENV !== "production" && ye(i, o, n) : (n = d(n), a = o.call(i, n));
        const l = c ? c.call(i, n) : void 0, v = i.delete(n);
        return a && m(i, "delete", n, void 0, l), v;
      },
      clear() {
        const n = d(this), i = n.size !== 0, o = process.env.NODE_ENV !== "production" ? M(n) ? new Map(n) : new Set(n) : void 0, c = n.clear();
        return i && m(
          n,
          "clear",
          void 0,
          void 0,
          o
        ), c;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((n) => {
    r[n] = bt(n, e, t);
  }), r;
}
function $e(e, t) {
  const r = wt(e, t);
  return (s, n, i) => n === "__v_isReactive" ? !e : n === "__v_isReadonly" ? e : n === "__v_raw" ? s : Reflect.get(
    ce(r, n) && n in s ? r : s,
    n,
    i
  );
}
const Et = {
  get: /* @__PURE__ */ $e(!1, !1)
}, St = {
  get: /* @__PURE__ */ $e(!0, !1)
};
function ye(e, t, r) {
  const s = d(r);
  if (s !== r && t.call(e, s)) {
    const n = Ne(e);
    y(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Ce = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ new WeakMap();
function Ot(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Dt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ot(Ne(e));
}
function we(e) {
  return K(e) ? e : Fe(
    e,
    !1,
    _t,
    Et,
    Ce
  );
}
function ze(e) {
  return Fe(
    e,
    !0,
    gt,
    St,
    He
  );
}
function Fe(e, t, r, s, n) {
  if (!Y(e))
    return process.env.NODE_ENV !== "production" && y(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = n.get(e);
  if (i)
    return i;
  const o = Dt(e);
  if (o === 0)
    return e;
  const c = new Proxy(
    e,
    o === 2 ? s : r
  );
  return n.set(e, c), c;
}
function Z(e) {
  return K(e) ? Z(e.__v_raw) : !!(e && e.__v_isReactive);
}
function K(e) {
  return !!(e && e.__v_isReadonly);
}
function E(e) {
  return !!(e && e.__v_isShallow);
}
function Nt(e) {
  return e ? !!e.__v_raw : !1;
}
function d(e) {
  const t = e && e.__v_raw;
  return t ? d(t) : e;
}
const g = (e) => Y(e) ? we(e) : e, he = (e) => Y(e) ? ze(e) : e;
function N(e) {
  return e ? e.__v_isRef === !0 : !1;
}
class xt {
  constructor(t, r, s) {
    this.fn = t, this.setter = r, this._value = void 0, this.dep = new Me(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = H - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    h !== this)
      return Re(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const t = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return je(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : process.env.NODE_ENV !== "production" && y("Write operation failed: computed value is readonly");
  }
}
function me(e, t, r = !1) {
  let s, n;
  ae(e) ? s = e : (s = e.get, n = e.set);
  const i = new xt(s, n, r);
  return process.env.NODE_ENV, i;
}
const X = {}, k = /* @__PURE__ */ new WeakMap();
let T;
function Rt(e, t = !1, r = T) {
  if (r) {
    let s = k.get(r);
    s || k.set(r, s = []), s.push(e);
  } else process.env.NODE_ENV !== "production" && !t && y(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Tt(e, t, r = Ze) {
  const { immediate: s, deep: n, once: i, scheduler: o, augmentJob: c, call: a } = r, l = (f) => {
    (r.onWarn || y)(
      "Invalid watch source: ",
      f,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, v = (f) => n ? f : E(f) || n === !1 || n === 0 ? O(f, 1) : O(f);
  let u, p, x, B, G = !1, J = !1;
  if (N(e) ? (p = () => e.value, G = E(e)) : Z(e) ? (p = () => v(e), G = !0) : D(e) ? (J = !0, G = e.some((f) => Z(f) || E(f)), p = () => e.map((f) => {
    if (N(f))
      return f.value;
    if (Z(f))
      return v(f);
    if (ae(f))
      return a ? a(f, 2) : f();
    process.env.NODE_ENV !== "production" && l(f);
  })) : ae(e) ? t ? p = a ? () => a(e, 2) : e : p = () => {
    if (x) {
      Ae();
      try {
        x();
      } finally {
        Ie();
      }
    }
    const f = T;
    T = u;
    try {
      return a ? a(e, 3, [B]) : e(B);
    } finally {
      T = f;
    }
  } : (p = ke, process.env.NODE_ENV !== "production" && l(e)), t && n) {
    const f = p, w = n === !0 ? 1 / 0 : n;
    p = () => O(f(), w);
  }
  const P = () => {
    u.stop();
  };
  if (i && t) {
    const f = t;
    t = (...w) => {
      f(...w), P();
    };
  }
  let R = J ? new Array(e.length).fill(X) : X;
  const L = (f) => {
    if (!(!(u.flags & 1) || !u.dirty && !f))
      if (t) {
        const w = u.run();
        if (n || G || (J ? w.some((te, U) => V(te, R[U])) : V(w, R))) {
          x && x();
          const te = T;
          T = u;
          try {
            const U = [
              w,
              // pass undefined as the old value when it's changed for the first time
              R === X ? void 0 : J && R[0] === X ? [] : R,
              B
            ];
            a ? a(t, 3, U) : (
              // @ts-expect-error
              t(...U)
            ), R = w;
          } finally {
            T = te;
          }
        }
      } else
        u.run();
  };
  return c && c(L), u = new ct(p), u.scheduler = o ? () => o(L, !1) : L, B = (f) => Rt(f, !1, u), x = u.onStop = () => {
    const f = k.get(u);
    if (f) {
      if (a)
        a(f, 4);
      else
        for (const w of f) w();
      k.delete(u);
    }
  }, process.env.NODE_ENV !== "production" && (u.onTrack = r.onTrack, u.onTrigger = r.onTrigger), t ? s ? L(!0) : R = u.run() : o ? o(L.bind(null, !0), !0) : u.run(), P.pause = u.pause.bind(u), P.resume = u.resume.bind(u), P.stop = P, P;
}
function O(e, t = 1 / 0, r) {
  if (t <= 0 || !Y(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, N(e))
    O(e.value, t, r);
  else if (D(e))
    for (let s = 0; s < e.length; s++)
      O(e[s], t, r);
  else if (tt(e) || M(e))
    e.forEach((s) => {
      O(s, t, r);
    });
  else if (st(e)) {
    for (const s in e)
      O(e[s], t, r);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && O(e[s], t, r);
  }
  return e;
}
function Vt(e) {
  return e && typeof e == "object" && "$state" in e && "actions" in e;
}
function Ye(e) {
  return typeof e == "object" && e !== null && typeof e.value < "u";
}
function jt(e, t) {
  const r = /* @__PURE__ */ new WeakSet(), s = (n, i = []) => typeof n != "object" || n === null || r.has(n) ? n : (r.add(n), new Proxy(n, {
    get(o, c) {
      if (c === "actions" || c === "$underive" || c === "$invalidate" || c === "$state")
        return;
      const a = [...i, c];
      t(a);
      const l = o[c];
      return Ye(l) ? l.value : typeof l == "function" ? l.bind(o) : s(l, a);
    },
    set() {
      return !1;
    },
    deleteProperty() {
      return !1;
    }
  }));
  return s(e);
}
function Pt(e) {
  if (!Vt(e))
    throw new Error("useSnapshot requires a store created with defineStore()");
  const t = re(/* @__PURE__ */ new Set()), r = re(null), s = re(0), n = (c) => {
    t.current.add(c.join("."));
  };
  return Be((c) => {
    const l = Array.from(t.current).map((v) => {
      const u = v.split(".");
      return Tt(
        () => {
          let p = e;
          for (const x of u) {
            if (p == null) return;
            p = p[x], Ye(p) && (p = p.value);
          }
          return p;
        },
        () => {
          s.current++, r.current = null, c();
        },
        // @ts-expect-error Vue's watch options type doesn't include flush
        { flush: "sync" }
      );
    });
    return () => {
      l.forEach((v) => v());
    };
  }, () => (r.current !== null || (t.current = /* @__PURE__ */ new Set(), r.current = jt(e, n)), r.current));
}
function Mt(e) {
  var n;
  const t = ((n = e.state) == null ? void 0 : n.call(e)) ?? {}, r = we(t), s = {
    $state: r,
    $underive(i) {
      i.forEach((o) => {
        const c = Object.getOwnPropertyDescriptor(s, o);
        if (c && typeof c.get == "function") {
          const a = c.get.call(s);
          Object.defineProperty(s, o, {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            value: a
          });
        }
      });
    },
    $invalidate(i) {
      i.forEach((o) => {
        if (e.getters && o in e.getters) {
          const c = e.getters[o], a = me(() => c(s));
          Object.defineProperty(s, o, {
            get: () => a.value,
            enumerable: !0,
            configurable: !0
          });
        }
      });
    }
  };
  if (Object.keys(r).forEach((i) => {
    Object.defineProperty(s, i, {
      get: () => r[i],
      set: (o) => {
        r[i] = o;
      },
      enumerable: !0,
      configurable: !0
    });
  }), e.getters && Object.entries(e.getters).forEach(([i, o]) => {
    const c = me(() => o(s));
    Object.defineProperty(s, i, {
      get: () => c.value,
      enumerable: !0,
      configurable: !0
    });
  }), e.actions) {
    const i = {};
    Object.entries(e.actions).forEach(([o, c]) => {
      i[o] = c.bind(s);
    }), s.actions = i;
  }
  return [() => Pt(s), s];
}
class Oe extends Je {
  constructor(t) {
    super(t), this.state = { error: null };
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  componentDidCatch(t, r) {
    console.error("Error caught by boundary:", t, r);
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}
function De({
  resolve: e,
  children: t
}) {
  const r = e instanceof Promise ? Ue(e) : e;
  return /* @__PURE__ */ I(Qe, { children: t(r) });
}
function Kt({
  resolve: e,
  fallback: t = null,
  error: r = (n) => /* @__PURE__ */ qe("div", { children: [
    "Error: ",
    n.message
  ] }),
  children: s
}) {
  return t ? /* @__PURE__ */ I(Oe, { fallback: r, children: /* @__PURE__ */ I(Ge, { fallback: t, children: /* @__PURE__ */ I(De, { resolve: e, children: s }) }) }) : /* @__PURE__ */ I(Oe, { fallback: r, children: /* @__PURE__ */ I(De, { resolve: e, children: s }) });
}
export {
  Kt as Awaitable,
  Mt as defineStore,
  Pt as useSnapshot
};
