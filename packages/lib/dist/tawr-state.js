import { useRef as re, useSyncExternalStore as Fe, Suspense as Ye, Component as Be, use as Ge } from "react";
import { jsx as X, jsxs as Je, Fragment as Ue } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function qe(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
const Qe = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const Xe = () => {
}, oe = Object.assign, Ze = Object.prototype.hasOwnProperty, ce = (e, t) => Ze.call(e, t), D = Array.isArray, P = (e) => ee(e) === "[object Map]", ke = (e) => ee(e) === "[object Set]", ae = (e) => typeof e == "function", et = (e) => typeof e == "string", z = (e) => typeof e == "symbol", F = (e) => e !== null && typeof e == "object", tt = Object.prototype.toString, ee = (e) => tt.call(e), Oe = (e) => ee(e).slice(8, -1), rt = (e) => ee(e) === "[object Object]", he = (e) => et(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, nt = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, st = nt((e) => e.charAt(0).toUpperCase() + e.slice(1)), V = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function y(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let d;
const ne = /* @__PURE__ */ new WeakSet();
class it {
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ne(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ee(this), xe(this);
    const t = d, r = b;
    d = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && d !== this && y(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Re(this), d = t, b = r, this.flags &= -3;
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
let De = 0, W, $;
function Ne(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = $, $ = e;
    return;
  }
  e.next = W, W = e;
}
function ve() {
  De++;
}
function _e() {
  if (--De > 0)
    return;
  if ($) {
    let t = $;
    for ($ = void 0; t; ) {
      const r = t.next;
      t.next = void 0, t.flags &= -9, t = r;
    }
  }
  let e;
  for (; W; ) {
    let t = W;
    for (W = void 0; t; ) {
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
function xe(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Re(e) {
  let t, r = e.depsTail, s = r;
  for (; s; ) {
    const n = s.prevDep;
    s.version === -1 ? (s === r && (r = n), ge(s), ot(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = n;
  }
  e.deps = t, e.depsTail = r;
}
function ue(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Te(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Te(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === C))
    return;
  e.globalVersion = C;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !ue(e)) {
    e.flags &= -3;
    return;
  }
  const r = d, s = b;
  d = e, b = !0;
  try {
    xe(e);
    const n = e.fn(e._value);
    (t.version === 0 || V(n, e._value)) && (e._value = n, t.version++);
  } catch (n) {
    throw t.version++, n;
  } finally {
    d = r, b = s, Re(e), e.flags &= -3;
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
function ot(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
let b = !0;
const Ve = [];
function je() {
  Ve.push(b), b = !1;
}
function Ae() {
  const e = Ve.pop();
  b = e === void 0 ? !0 : e;
}
function Ee(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const r = d;
    d = void 0;
    try {
      t();
    } finally {
      d = r;
    }
  }
}
let C = 0;
class ct {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ie {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!d || !b || d === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== d)
      r = this.activeLink = new ct(d, this), d.deps ? (r.prevDep = d.depsTail, d.depsTail.nextDep = r, d.depsTail = r) : d.deps = d.depsTail = r, Pe(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const s = r.nextDep;
      s.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = s), r.prevDep = d.depsTail, r.nextDep = void 0, d.depsTail.nextDep = r, d.depsTail = r, d.deps === r && (d.deps = s);
    }
    return process.env.NODE_ENV !== "production" && d.onTrack && d.onTrack(
      oe(
        {
          effect: d
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, C++, this.notify(t);
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
function Pe(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Pe(s);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const fe = /* @__PURE__ */ new WeakMap(), j = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), le = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), H = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function _(e, t, r) {
  if (b && d) {
    let s = fe.get(e);
    s || fe.set(e, s = /* @__PURE__ */ new Map());
    let n = s.get(r);
    n || (s.set(r, n = new Ie()), n.map = s, n.key = r), process.env.NODE_ENV !== "production" ? n.track({
      target: e,
      type: t,
      key: r
    }) : n.track();
  }
}
function m(e, t, r, s, n, i) {
  const o = fe.get(e);
  if (!o) {
    C++;
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
    const a = D(e), l = a && he(r);
    if (a && r === "length") {
      const v = Number(s);
      o.forEach((u, p) => {
        (p === "length" || p === H || !z(p) && p >= v) && c(u);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), l && c(o.get(H)), t) {
        case "add":
          a ? l && c(o.get("length")) : (c(o.get(j)), P(e) && c(o.get(le)));
          break;
        case "delete":
          a || (c(o.get(j)), P(e) && c(o.get(le)));
          break;
        case "set":
          P(e) && c(o.get(j));
          break;
      }
  }
  _e();
}
function I(e) {
  const t = h(e);
  return t === e ? t : (_(t, "iterate", H), E(e) ? t : t.map(g));
}
function be(e) {
  return _(e = h(e), "iterate", H), e;
}
const at = {
  __proto__: null,
  [Symbol.iterator]() {
    return se(this, Symbol.iterator, g);
  },
  concat(...e) {
    return I(this).concat(
      ...e.map((t) => D(t) ? I(t) : t)
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
    return I(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return ie(this, "lastIndexOf", e);
  },
  map(e, t) {
    return S(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return L(this, "pop");
  },
  push(...e) {
    return L(this, "push", e);
  },
  reduce(e, ...t) {
    return Se(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Se(this, "reduceRight", e, t);
  },
  shift() {
    return L(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return S(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return L(this, "splice", e);
  },
  toReversed() {
    return I(this).toReversed();
  },
  toSorted(e) {
    return I(this).toSorted(e);
  },
  toSpliced(...e) {
    return I(this).toSpliced(...e);
  },
  unshift(...e) {
    return L(this, "unshift", e);
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
const ut = Array.prototype;
function S(e, t, r, s, n, i) {
  const o = be(e), c = o !== e && !E(e), a = o[t];
  if (a !== ut[t]) {
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
  const s = h(e);
  _(s, "iterate", H);
  const n = s[t](...r);
  return (n === -1 || n === !1) && Ot(r[0]) ? (r[0] = h(r[0]), s[t](...r)) : n;
}
function L(e, t, r = []) {
  je(), ve();
  const s = h(e)[t].apply(e, r);
  return _e(), Ae(), s;
}
const ft = /* @__PURE__ */ qe("__proto__,__v_isRef,__isVue"), Me = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(z)
);
function lt(e) {
  z(e) || (e = String(e));
  const t = h(this);
  return _(t, "has", e), t.hasOwnProperty(e);
}
class Ke {
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
      return s === (n ? i ? St : $e : i ? Et : We).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = D(t);
    if (!n) {
      let a;
      if (o && (a = at[r]))
        return a;
      if (r === "hasOwnProperty")
        return lt;
    }
    const c = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      N(t) ? t : s
    );
    return (z(r) ? Me.has(r) : ft(r)) || (n || _(t, "get", r), i) ? c : N(c) ? o && he(r) ? c : c.value : F(c) ? n ? Ce(c) : we(c) : c;
  }
}
class pt extends Ke {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    if (!this._isShallow) {
      const a = M(i);
      if (!E(s) && !M(s) && (i = h(i), s = h(s)), !D(t) && N(i) && !N(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = D(t) && he(r) ? Number(r) < t.length : ce(t, r), c = Reflect.set(
      t,
      r,
      s,
      N(t) ? t : n
    );
    return t === h(n) && (o ? V(s, i) && m(t, "set", r, s, i) : m(t, "add", r, s)), c;
  }
  deleteProperty(t, r) {
    const s = ce(t, r), n = t[r], i = Reflect.deleteProperty(t, r);
    return i && s && m(t, "delete", r, void 0, n), i;
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return (!z(r) || !Me.has(r)) && _(t, "has", r), s;
  }
  ownKeys(t) {
    return _(
      t,
      "iterate",
      D(t) ? "length" : j
    ), Reflect.ownKeys(t);
  }
}
class dt extends Ke {
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
const ht = /* @__PURE__ */ new pt(), vt = /* @__PURE__ */ new dt(), pe = (e) => e, U = (e) => Reflect.getPrototypeOf(e);
function _t(e, t, r) {
  return function(...s) {
    const n = this.__v_raw, i = h(n), o = P(i), c = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, l = n[e](...s), v = r ? pe : t ? de : g;
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
function q(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const r = t[0] ? `on key "${t[0]}" ` : "";
      y(
        `${st(e)} operation ${r}failed: target is readonly.`,
        h(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function gt(e, t) {
  const r = {
    get(n) {
      const i = this.__v_raw, o = h(i), c = h(n);
      e || (V(n, c) && _(o, "get", n), _(o, "get", c));
      const { has: a } = U(o), l = t ? pe : e ? de : g;
      if (a.call(o, n))
        return l(i.get(n));
      if (a.call(o, c))
        return l(i.get(c));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !e && _(h(n), "iterate", j), Reflect.get(n, "size", n);
    },
    has(n) {
      const i = this.__v_raw, o = h(i), c = h(n);
      return e || (V(n, c) && _(o, "has", n), _(o, "has", c)), n === c ? i.has(n) : i.has(n) || i.has(c);
    },
    forEach(n, i) {
      const o = this, c = o.__v_raw, a = h(c), l = t ? pe : e ? de : g;
      return !e && _(a, "iterate", j), c.forEach((v, u) => n.call(i, l(v), l(u), o));
    }
  };
  return oe(
    r,
    e ? {
      add: q("add"),
      set: q("set"),
      delete: q("delete"),
      clear: q("clear")
    } : {
      add(n) {
        !t && !E(n) && !M(n) && (n = h(n));
        const i = h(this);
        return U(i).has.call(i, n) || (i.add(n), m(i, "add", n, n)), this;
      },
      set(n, i) {
        !t && !E(i) && !M(i) && (i = h(i));
        const o = h(this), { has: c, get: a } = U(o);
        let l = c.call(o, n);
        l ? process.env.NODE_ENV !== "production" && ye(o, c, n) : (n = h(n), l = c.call(o, n));
        const v = a.call(o, n);
        return o.set(n, i), l ? V(i, v) && m(o, "set", n, i, v) : m(o, "add", n, i), this;
      },
      delete(n) {
        const i = h(this), { has: o, get: c } = U(i);
        let a = o.call(i, n);
        a ? process.env.NODE_ENV !== "production" && ye(i, o, n) : (n = h(n), a = o.call(i, n));
        const l = c ? c.call(i, n) : void 0, v = i.delete(n);
        return a && m(i, "delete", n, void 0, l), v;
      },
      clear() {
        const n = h(this), i = n.size !== 0, o = process.env.NODE_ENV !== "production" ? P(n) ? new Map(n) : new Set(n) : void 0, c = n.clear();
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
    r[n] = _t(n, e, t);
  }), r;
}
function Le(e, t) {
  const r = gt(e, t);
  return (s, n, i) => n === "__v_isReactive" ? !e : n === "__v_isReadonly" ? e : n === "__v_raw" ? s : Reflect.get(
    ce(r, n) && n in s ? r : s,
    n,
    i
  );
}
const bt = {
  get: /* @__PURE__ */ Le(!1, !1)
}, wt = {
  get: /* @__PURE__ */ Le(!0, !1)
};
function ye(e, t, r) {
  const s = h(r);
  if (s !== r && t.call(e, s)) {
    const n = Oe(e);
    y(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const We = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap();
function yt(e) {
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
function mt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : yt(Oe(e));
}
function we(e) {
  return M(e) ? e : He(
    e,
    !1,
    ht,
    bt,
    We
  );
}
function Ce(e) {
  return He(
    e,
    !0,
    vt,
    wt,
    $e
  );
}
function He(e, t, r, s, n) {
  if (!F(e))
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
  const o = mt(e);
  if (o === 0)
    return e;
  const c = new Proxy(
    e,
    o === 2 ? s : r
  );
  return n.set(e, c), c;
}
function Z(e) {
  return M(e) ? Z(e.__v_raw) : !!(e && e.__v_isReactive);
}
function M(e) {
  return !!(e && e.__v_isReadonly);
}
function E(e) {
  return !!(e && e.__v_isShallow);
}
function Ot(e) {
  return e ? !!e.__v_raw : !1;
}
function h(e) {
  const t = e && e.__v_raw;
  return t ? h(t) : e;
}
const g = (e) => F(e) ? we(e) : e, de = (e) => F(e) ? Ce(e) : e;
function N(e) {
  return e ? e.__v_isRef === !0 : !1;
}
class Dt {
  constructor(t, r, s) {
    this.fn = t, this.setter = r, this._value = void 0, this.dep = new Ie(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = C - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    d !== this)
      return Ne(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const t = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return Te(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : process.env.NODE_ENV !== "production" && y("Write operation failed: computed value is readonly");
  }
}
function me(e, t, r = !1) {
  let s, n;
  ae(e) ? s = e : (s = e.get, n = e.set);
  const i = new Dt(s, n, r);
  return process.env.NODE_ENV, i;
}
const Q = {}, k = /* @__PURE__ */ new WeakMap();
let T;
function Nt(e, t = !1, r = T) {
  if (r) {
    let s = k.get(r);
    s || k.set(r, s = []), s.push(e);
  } else process.env.NODE_ENV !== "production" && !t && y(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function xt(e, t, r = Qe) {
  const { immediate: s, deep: n, once: i, scheduler: o, augmentJob: c, call: a } = r, l = (f) => {
    (r.onWarn || y)(
      "Invalid watch source: ",
      f,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, v = (f) => n ? f : E(f) || n === !1 || n === 0 ? O(f, 1) : O(f);
  let u, p, x, Y, B = !1, G = !1;
  if (N(e) ? (p = () => e.value, B = E(e)) : Z(e) ? (p = () => v(e), B = !0) : D(e) ? (G = !0, B = e.some((f) => Z(f) || E(f)), p = () => e.map((f) => {
    if (N(f))
      return f.value;
    if (Z(f))
      return v(f);
    if (ae(f))
      return a ? a(f, 2) : f();
    process.env.NODE_ENV !== "production" && l(f);
  })) : ae(e) ? t ? p = a ? () => a(e, 2) : e : p = () => {
    if (x) {
      je();
      try {
        x();
      } finally {
        Ae();
      }
    }
    const f = T;
    T = u;
    try {
      return a ? a(e, 3, [Y]) : e(Y);
    } finally {
      T = f;
    }
  } : (p = Xe, process.env.NODE_ENV !== "production" && l(e)), t && n) {
    const f = p, w = n === !0 ? 1 / 0 : n;
    p = () => O(f(), w);
  }
  const A = () => {
    u.stop();
  };
  if (i && t) {
    const f = t;
    t = (...w) => {
      f(...w), A();
    };
  }
  let R = G ? new Array(e.length).fill(Q) : Q;
  const K = (f) => {
    if (!(!(u.flags & 1) || !u.dirty && !f))
      if (t) {
        const w = u.run();
        if (n || B || (G ? w.some((te, J) => V(te, R[J])) : V(w, R))) {
          x && x();
          const te = T;
          T = u;
          try {
            const J = [
              w,
              // pass undefined as the old value when it's changed for the first time
              R === Q ? void 0 : G && R[0] === Q ? [] : R,
              Y
            ];
            a ? a(t, 3, J) : (
              // @ts-expect-error
              t(...J)
            ), R = w;
          } finally {
            T = te;
          }
        }
      } else
        u.run();
  };
  return c && c(K), u = new it(p), u.scheduler = o ? () => o(K, !1) : K, Y = (f) => Nt(f, !1, u), x = u.onStop = () => {
    const f = k.get(u);
    if (f) {
      if (a)
        a(f, 4);
      else
        for (const w of f) w();
      k.delete(u);
    }
  }, process.env.NODE_ENV !== "production" && (u.onTrack = r.onTrack, u.onTrigger = r.onTrigger), t ? s ? K(!0) : R = u.run() : o ? o(K.bind(null, !0), !0) : u.run(), A.pause = u.pause.bind(u), A.resume = u.resume.bind(u), A.stop = A, A;
}
function O(e, t = 1 / 0, r) {
  if (t <= 0 || !F(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, N(e))
    O(e.value, t, r);
  else if (D(e))
    for (let s = 0; s < e.length; s++)
      O(e[s], t, r);
  else if (ke(e) || P(e))
    e.forEach((s) => {
      O(s, t, r);
    });
  else if (rt(e)) {
    for (const s in e)
      O(e[s], t, r);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && O(e[s], t, r);
  }
  return e;
}
function Rt(e) {
  return e && typeof e == "object" && "$state" in e && "actions" in e;
}
function ze(e) {
  return typeof e == "object" && e !== null && typeof e.value < "u";
}
function Tt(e, t) {
  const r = /* @__PURE__ */ new WeakSet(), s = (n, i = []) => typeof n != "object" || n === null || r.has(n) ? n : (r.add(n), new Proxy(n, {
    get(o, c) {
      if (c === "actions" || c === "$underive" || c === "$invalidate" || c === "$state")
        return;
      const a = [...i, c];
      t(a);
      const l = o[c];
      return ze(l) ? l.value : typeof l == "function" ? l.bind(o) : s(l, a);
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
  if (!Rt(e))
    throw new Error("useSnapshot requires a store created with defineStore()");
  const t = re(/* @__PURE__ */ new Set()), r = re(null), s = re(0), n = (c) => {
    t.current.add(c.join("."));
  };
  return Fe((c) => {
    const l = Array.from(t.current).map((v) => {
      const u = v.split(".");
      return xt(
        () => {
          let p = e;
          for (const x of u) {
            if (p == null) return;
            p = p[x], ze(p) && (p = p.value);
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
  }, () => (r.current !== null || (t.current = /* @__PURE__ */ new Set(), r.current = Tt(e, n)), r.current));
}
function Mt(e) {
  const t = e.state(), r = we(t), s = {
    $state: r,
    $underive: (n) => {
      n.forEach((i) => {
        const o = Object.getOwnPropertyDescriptor(s, i);
        if (o && typeof o.get == "function") {
          const c = o.get.call(s);
          Object.defineProperty(s, i, {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            value: c
          });
        }
      });
    },
    $invalidate: (n) => {
      n.forEach((i) => {
        if (s.$underive([i]), e.getters && i in e.getters) {
          const o = e.getters[i], c = me(() => o(s));
          Object.defineProperty(s, i, {
            get: () => c.value,
            enumerable: !0,
            configurable: !0
          });
        }
      });
    }
  };
  if (Object.keys(r).forEach((n) => {
    Object.defineProperty(s, n, {
      get: () => r[n],
      set: (i) => {
        r[n] = i;
      },
      enumerable: !0,
      configurable: !0
    });
  }), e.getters && Object.entries(e.getters).forEach(([n, i]) => {
    const o = me(() => i(s));
    Object.defineProperty(s, n, {
      get: () => o.value,
      enumerable: !0,
      configurable: !0
    });
  }), e.actions) {
    const n = {};
    Object.entries(e.actions).forEach(([i, o]) => {
      n[i] = o.bind(s);
    }), s.actions = n;
  }
  return s;
}
class Vt extends Be {
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
function jt({
  resolve: e,
  children: t
}) {
  const r = Ge(e);
  return /* @__PURE__ */ X(Ue, { children: t(r) });
}
function Kt({
  resolve: e,
  fallback: t = null,
  error: r = (n) => /* @__PURE__ */ Je("div", { children: [
    "Error: ",
    n.message
  ] }),
  children: s
}) {
  return /* @__PURE__ */ X(Vt, { fallback: r, children: /* @__PURE__ */ X(Ye, { fallback: t, children: /* @__PURE__ */ X(jt, { resolve: e, children: s }) }) });
}
export {
  Kt as Awaitable,
  Mt as defineStore,
  Pt as useSnapshot
};
