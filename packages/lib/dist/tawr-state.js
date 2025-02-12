import { useState as Ve, useEffect as je, Suspense as Be, Component as Ge, use as Ue } from "react";
import { jsx as V, jsxs as Je, Fragment as Qe } from "react/jsx-runtime";
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
}, ce = Object.assign, et = Object.prototype.hasOwnProperty, ae = (e, t) => et.call(e, t), m = Array.isArray, P = (e) => re(e) === "[object Map]", tt = (e) => re(e) === "[object Set]", ye = (e) => typeof e == "function", rt = (e) => typeof e == "string", q = (e) => typeof e == "symbol", z = (e) => e !== null && typeof e == "object", nt = Object.prototype.toString, re = (e) => nt.call(e), Ie = (e) => re(e).slice(8, -1), st = (e) => re(e) === "[object Object]", ve = (e) => rt(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, it = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, ot = it((e) => e.charAt(0).toUpperCase() + e.slice(1)), j = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function N(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let p;
const se = /* @__PURE__ */ new WeakSet();
class fe {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, se.has(this) && (se.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ct(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, De(this), Ae(this);
    const t = p, r = b;
    p = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && p !== this && N(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Pe(this), p = t, b = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        be(t);
      this.deps = this.depsTail = void 0, De(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? se.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
let Me = 0, $, C;
function ct(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = C, C = e;
    return;
  }
  e.next = $, $ = e;
}
function ge() {
  Me++;
}
function _e() {
  if (--Me > 0)
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
function Ae(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
  let t, r = e.depsTail, s = r;
  for (; s; ) {
    const n = s.prevDep;
    s.version === -1 ? (s === r && (r = n), be(s), ft(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = n;
  }
  e.deps = t, e.depsTail = r;
}
function ue(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (at(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function at(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ee))
    return;
  e.globalVersion = ee;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !ue(e)) {
    e.flags &= -3;
    return;
  }
  const r = p, s = b;
  p = e, b = !0;
  try {
    Ae(e);
    const n = e.fn(e._value);
    (t.version === 0 || j(n, e._value)) && (e._value = n, t.version++);
  } catch (n) {
    throw t.version++, n;
  } finally {
    p = r, b = s, Pe(e), e.flags &= -3;
  }
}
function be(e, t = !1) {
  const { dep: r, prevSub: s, nextSub: n } = e;
  if (s && (s.nextSub = n, e.prevSub = void 0), n && (n.prevSub = s, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = n), r.subs === e && (r.subs = s, !s && r.computed)) {
    r.computed.flags &= -5;
    for (let i = r.computed.deps; i; i = i.nextDep)
      be(i, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function ft(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
function Z(e, t) {
  e.effect instanceof fe && (e = e.effect.fn);
  const r = new fe(e);
  try {
    r.run();
  } catch (n) {
    throw r.stop(), n;
  }
  const s = r.run.bind(r);
  return s.effect = r, s;
}
function Oe(e) {
  e.effect.stop();
}
let b = !0;
const Le = [];
function Ke() {
  Le.push(b), b = !1;
}
function He() {
  const e = Le.pop();
  b = e === void 0 ? !0 : e;
}
function De(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const r = p;
    p = void 0;
    try {
      t();
    } finally {
      p = r;
    }
  }
}
let ee = 0;
class ut {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class lt {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!p || !b || p === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== p)
      r = this.activeLink = new ut(p, this), p.deps ? (r.prevDep = p.depsTail, p.depsTail.nextDep = r, p.depsTail = r) : p.deps = p.depsTail = r, We(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const s = r.nextDep;
      s.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = s), r.prevDep = p.depsTail, r.nextDep = void 0, p.depsTail.nextDep = r, p.depsTail = r, p.deps === r && (p.deps = s);
    }
    return process.env.NODE_ENV !== "production" && p.onTrack && p.onTrack(
      ce(
        {
          effect: p
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, ee++, this.notify(t);
  }
  notify(t) {
    ge();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            ce(
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
function We(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        We(s);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const le = /* @__PURE__ */ new WeakMap(), I = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), pe = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), F = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function g(e, t, r) {
  if (b && p) {
    let s = le.get(e);
    s || le.set(e, s = /* @__PURE__ */ new Map());
    let n = s.get(r);
    n || (s.set(r, n = new lt()), n.map = s, n.key = r), process.env.NODE_ENV !== "production" ? n.track({
      target: e,
      type: t,
      key: r
    }) : n.track();
  }
}
function O(e, t, r, s, n, i) {
  const o = le.get(e);
  if (!o) {
    ee++;
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
  if (ge(), t === "clear")
    o.forEach(c);
  else {
    const a = m(e), l = a && ve(r);
    if (a && r === "length") {
      const v = Number(s);
      o.forEach((f, d) => {
        (d === "length" || d === F || !q(d) && d >= v) && c(f);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), l && c(o.get(F)), t) {
        case "add":
          a ? l && c(o.get("length")) : (c(o.get(I)), P(e) && c(o.get(pe)));
          break;
        case "delete":
          a || (c(o.get(I)), P(e) && c(o.get(pe)));
          break;
        case "set":
          P(e) && c(o.get(I));
          break;
      }
  }
  _e();
}
function A(e) {
  const t = h(e);
  return t === e ? t : (g(t, "iterate", F), E(e) ? t : t.map(_));
}
function we(e) {
  return g(e = h(e), "iterate", F), e;
}
const pt = {
  __proto__: null,
  [Symbol.iterator]() {
    return ie(this, Symbol.iterator, _);
  },
  concat(...e) {
    return A(this).concat(
      ...e.map((t) => m(t) ? A(t) : t)
    );
  },
  entries() {
    return ie(this, "entries", (e) => (e[1] = _(e[1]), e));
  },
  every(e, t) {
    return S(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return S(this, "filter", e, t, (r) => r.map(_), arguments);
  },
  find(e, t) {
    return S(this, "find", e, t, _, arguments);
  },
  findIndex(e, t) {
    return S(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return S(this, "findLast", e, t, _, arguments);
  },
  findLastIndex(e, t) {
    return S(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return S(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return oe(this, "includes", e);
  },
  indexOf(...e) {
    return oe(this, "indexOf", e);
  },
  join(e) {
    return A(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return oe(this, "lastIndexOf", e);
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
    return me(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return me(this, "reduceRight", e, t);
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
    return ie(this, "values", _);
  }
};
function ie(e, t, r) {
  const s = we(e), n = s[t]();
  return s !== e && !E(e) && (n._next = n.next, n.next = () => {
    const i = n._next();
    return i.value && (i.value = r(i.value)), i;
  }), n;
}
const ht = Array.prototype;
function S(e, t, r, s, n, i) {
  const o = we(e), c = o !== e && !E(e), a = o[t];
  if (a !== ht[t]) {
    const f = a.apply(e, i);
    return c ? _(f) : f;
  }
  let l = r;
  o !== e && (c ? l = function(f, d) {
    return r.call(this, _(f), d, e);
  } : r.length > 2 && (l = function(f, d) {
    return r.call(this, f, d, e);
  }));
  const v = a.call(o, l, s);
  return c && n ? n(v) : v;
}
function me(e, t, r, s) {
  const n = we(e);
  let i = r;
  return n !== e && (E(e) ? r.length > 3 && (i = function(o, c, a) {
    return r.call(this, o, c, a, e);
  }) : i = function(o, c, a) {
    return r.call(this, o, _(c), a, e);
  }), n[t](i, ...s);
}
function oe(e, t, r) {
  const s = h(e);
  g(s, "iterate", F);
  const n = s[t](...r);
  return (n === -1 || n === !1) && Tt(r[0]) ? (r[0] = h(r[0]), s[t](...r)) : n;
}
function W(e, t, r = []) {
  Ke(), ge();
  const s = h(e)[t].apply(e, r);
  return _e(), He(), s;
}
const dt = /* @__PURE__ */ Xe("__proto__,__v_isRef,__isVue"), $e = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(q)
);
function vt(e) {
  q(e) || (e = String(e));
  const t = h(this);
  return g(t, "has", e), t.hasOwnProperty(e);
}
class Ce {
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
      return s === (n ? i ? mt : ze : i ? Dt : qe).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = m(t);
    if (!n) {
      let a;
      if (o && (a = pt[r]))
        return a;
      if (r === "hasOwnProperty")
        return vt;
    }
    const c = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      x(t) ? t : s
    );
    return (q(r) ? $e.has(r) : dt(r)) || (n || g(t, "get", r), i) ? c : x(c) ? o && ve(r) ? c : c.value : z(c) ? n ? Se(c) : Ee(c) : c;
  }
}
class gt extends Ce {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    if (!this._isShallow) {
      const a = L(i);
      if (!E(s) && !L(s) && (i = h(i), s = h(s)), !m(t) && x(i) && !x(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = m(t) && ve(r) ? Number(r) < t.length : ae(t, r), c = Reflect.set(
      t,
      r,
      s,
      x(t) ? t : n
    );
    return t === h(n) && (o ? j(s, i) && O(t, "set", r, s, i) : O(t, "add", r, s)), c;
  }
  deleteProperty(t, r) {
    const s = ae(t, r), n = t[r], i = Reflect.deleteProperty(t, r);
    return i && s && O(t, "delete", r, void 0, n), i;
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return (!q(r) || !$e.has(r)) && g(t, "has", r), s;
  }
  ownKeys(t) {
    return g(
      t,
      "iterate",
      m(t) ? "length" : I
    ), Reflect.ownKeys(t);
  }
}
class _t extends Ce {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, r) {
    return process.env.NODE_ENV !== "production" && N(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, r) {
    return process.env.NODE_ENV !== "production" && N(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const bt = /* @__PURE__ */ new gt(), wt = /* @__PURE__ */ new _t(), he = (e) => e, J = (e) => Reflect.getPrototypeOf(e);
function Et(e, t, r) {
  return function(...s) {
    const n = this.__v_raw, i = h(n), o = P(i), c = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, l = n[e](...s), v = r ? he : t ? de : _;
    return !t && g(
      i,
      "iterate",
      a ? pe : I
    ), {
      // iterator protocol
      next() {
        const { value: f, done: d } = l.next();
        return d ? { value: f, done: d } : {
          value: c ? [v(f[0]), v(f[1])] : v(f),
          done: d
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
      N(
        `${ot(e)} operation ${r}failed: target is readonly.`,
        h(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function St(e, t) {
  const r = {
    get(n) {
      const i = this.__v_raw, o = h(i), c = h(n);
      e || (j(n, c) && g(o, "get", n), g(o, "get", c));
      const { has: a } = J(o), l = t ? he : e ? de : _;
      if (a.call(o, n))
        return l(i.get(n));
      if (a.call(o, c))
        return l(i.get(c));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !e && g(h(n), "iterate", I), Reflect.get(n, "size", n);
    },
    has(n) {
      const i = this.__v_raw, o = h(i), c = h(n);
      return e || (j(n, c) && g(o, "has", n), g(o, "has", c)), n === c ? i.has(n) : i.has(n) || i.has(c);
    },
    forEach(n, i) {
      const o = this, c = o.__v_raw, a = h(c), l = t ? he : e ? de : _;
      return !e && g(a, "iterate", I), c.forEach((v, f) => n.call(i, l(v), l(f), o));
    }
  };
  return ce(
    r,
    e ? {
      add: Q("add"),
      set: Q("set"),
      delete: Q("delete"),
      clear: Q("clear")
    } : {
      add(n) {
        !t && !E(n) && !L(n) && (n = h(n));
        const i = h(this);
        return J(i).has.call(i, n) || (i.add(n), O(i, "add", n, n)), this;
      },
      set(n, i) {
        !t && !E(i) && !L(i) && (i = h(i));
        const o = h(this), { has: c, get: a } = J(o);
        let l = c.call(o, n);
        l ? process.env.NODE_ENV !== "production" && xe(o, c, n) : (n = h(n), l = c.call(o, n));
        const v = a.call(o, n);
        return o.set(n, i), l ? j(i, v) && O(o, "set", n, i, v) : O(o, "add", n, i), this;
      },
      delete(n) {
        const i = h(this), { has: o, get: c } = J(i);
        let a = o.call(i, n);
        a ? process.env.NODE_ENV !== "production" && xe(i, o, n) : (n = h(n), a = o.call(i, n));
        const l = c ? c.call(i, n) : void 0, v = i.delete(n);
        return a && O(i, "delete", n, void 0, l), v;
      },
      clear() {
        const n = h(this), i = n.size !== 0, o = process.env.NODE_ENV !== "production" ? P(n) ? new Map(n) : new Set(n) : void 0, c = n.clear();
        return i && O(
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
    r[n] = Et(n, e, t);
  }), r;
}
function Fe(e, t) {
  const r = St(e, t);
  return (s, n, i) => n === "__v_isReactive" ? !e : n === "__v_isReadonly" ? e : n === "__v_raw" ? s : Reflect.get(
    ae(r, n) && n in s ? r : s,
    n,
    i
  );
}
const yt = {
  get: /* @__PURE__ */ Fe(!1, !1)
}, Ot = {
  get: /* @__PURE__ */ Fe(!0, !1)
};
function xe(e, t, r) {
  const s = h(r);
  if (s !== r && t.call(e, s)) {
    const n = Ie(e);
    N(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const qe = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), ze = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ new WeakMap();
function xt(e) {
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
function Nt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : xt(Ie(e));
}
function Ee(e) {
  return L(e) ? e : Ye(
    e,
    !1,
    bt,
    yt,
    qe
  );
}
function Se(e) {
  return Ye(
    e,
    !0,
    wt,
    Ot,
    ze
  );
}
function Ye(e, t, r, s, n) {
  if (!z(e))
    return process.env.NODE_ENV !== "production" && N(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = n.get(e);
  if (i)
    return i;
  const o = Nt(e);
  if (o === 0)
    return e;
  const c = new Proxy(
    e,
    o === 2 ? s : r
  );
  return n.set(e, c), c;
}
function k(e) {
  return L(e) ? k(e.__v_raw) : !!(e && e.__v_isReactive);
}
function L(e) {
  return !!(e && e.__v_isReadonly);
}
function E(e) {
  return !!(e && e.__v_isShallow);
}
function Tt(e) {
  return e ? !!e.__v_raw : !1;
}
function h(e) {
  const t = e && e.__v_raw;
  return t ? h(t) : e;
}
const _ = (e) => z(e) ? Ee(e) : e, de = (e) => z(e) ? Se(e) : e;
function x(e) {
  return e ? e.__v_isRef === !0 : !1;
}
const X = {}, te = /* @__PURE__ */ new WeakMap();
let R;
function Rt(e, t = !1, r = R) {
  if (r) {
    let s = te.get(r);
    s || te.set(r, s = []), s.push(e);
  } else process.env.NODE_ENV !== "production" && !t && N(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Vt(e, t, r = Ze) {
  const { immediate: s, deep: n, once: i, scheduler: o, augmentJob: c, call: a } = r, l = (u) => {
    (r.onWarn || N)(
      "Invalid watch source: ",
      u,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, v = (u) => n ? u : E(u) || n === !1 || n === 0 ? D(u, 1) : D(u);
  let f, d, K, Y, B = !1, G = !1;
  if (x(e) ? (d = () => e.value, B = E(e)) : k(e) ? (d = () => v(e), B = !0) : m(e) ? (G = !0, B = e.some((u) => k(u) || E(u)), d = () => e.map((u) => {
    if (x(u))
      return u.value;
    if (k(u))
      return v(u);
    if (ye(u))
      return a ? a(u, 2) : u();
    process.env.NODE_ENV !== "production" && l(u);
  })) : ye(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (K) {
      Ke();
      try {
        K();
      } finally {
        He();
      }
    }
    const u = R;
    R = f;
    try {
      return a ? a(e, 3, [Y]) : e(Y);
    } finally {
      R = u;
    }
  } : (d = ke, process.env.NODE_ENV !== "production" && l(e)), t && n) {
    const u = d, w = n === !0 ? 1 / 0 : n;
    d = () => D(u(), w);
  }
  const M = () => {
    f.stop();
  };
  if (i && t) {
    const u = t;
    t = (...w) => {
      u(...w), M();
    };
  }
  let T = G ? new Array(e.length).fill(X) : X;
  const H = (u) => {
    if (!(!(f.flags & 1) || !f.dirty && !u))
      if (t) {
        const w = f.run();
        if (n || B || (G ? w.some((ne, U) => j(ne, T[U])) : j(w, T))) {
          K && K();
          const ne = R;
          R = f;
          try {
            const U = [
              w,
              // pass undefined as the old value when it's changed for the first time
              T === X ? void 0 : G && T[0] === X ? [] : T,
              Y
            ];
            a ? a(t, 3, U) : (
              // @ts-expect-error
              t(...U)
            ), T = w;
          } finally {
            R = ne;
          }
        }
      } else
        f.run();
  };
  return c && c(H), f = new fe(d), f.scheduler = o ? () => o(H, !1) : H, Y = (u) => Rt(u, !1, f), K = f.onStop = () => {
    const u = te.get(f);
    if (u) {
      if (a)
        a(u, 4);
      else
        for (const w of u) w();
      te.delete(f);
    }
  }, process.env.NODE_ENV !== "production" && (f.onTrack = r.onTrack, f.onTrigger = r.onTrigger), t ? s ? H(!0) : T = f.run() : o ? o(H.bind(null, !0), !0) : f.run(), M.pause = f.pause.bind(f), M.resume = f.resume.bind(f), M.stop = M, M;
}
function D(e, t = 1 / 0, r) {
  if (t <= 0 || !z(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, x(e))
    D(e.value, t, r);
  else if (m(e))
    for (let s = 0; s < e.length; s++)
      D(e[s], t, r);
  else if (tt(e) || P(e))
    e.forEach((s) => {
      D(s, t, r);
    });
  else if (st(e)) {
    for (const s in e)
      D(e[s], t, r);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && D(e[s], t, r);
  }
  return e;
}
function Mt(e) {
  const t = typeof e == "object" && e !== null ? Se(e) : e, [, r] = Ve(0);
  return je(() => {
    if (typeof e != "object" || e === null)
      return;
    const s = Vt(
      () => t,
      () => {
        r((n) => n + 1);
      },
      { deep: !0 }
    );
    return () => {
      s();
    };
  }, []), t;
}
const y = /* @__PURE__ */ new Map();
function Ne(e, t) {
  return e !== void 0 && t in e;
}
function At(e) {
  var n;
  const t = ((n = e.state) == null ? void 0 : n.call(e)) ?? {}, r = Ee(t), s = {
    ...e.actions,
    $underive(i) {
      i.forEach((o) => {
        y.get(o) && Oe(y.get(o)), y.delete(o);
      });
    },
    $invalidate(i) {
      i.forEach((o) => {
        y.get(o) && Oe(y.get(o));
        const c = Z(() => {
          const a = e.getters, l = e.queries;
          if (a && Ne(a, o))
            r[o] = a[o](r);
          else if (l && Ne(l, o)) {
            const v = l[o](r);
            if (v) {
              const f = r[o];
              f.isFetching = !0, v.fn().then((d) => f.value = d).catch((d) => f.error = d).finally(() => {
                f.isFetching = !1;
              });
            }
          }
        });
        y.set(o, c);
      });
    }
  };
  for (const i in s)
    r[i] = s[i].bind(r);
  if (e.getters)
    for (const i in e.getters) {
      const o = Z(() => {
        r[i] = e.getters[i](r);
      });
      y.set(i, o);
    }
  if (e.queries)
    for (const i in e.queries) {
      r[i] = {
        value: void 0,
        isLoading: !1,
        isFetching: !1,
        error: null
      };
      const c = Z(async () => {
        const a = r[i];
        a.isFetching = !0, a.isLoading = !0;
        const l = e.queries[i](r);
        if (!l) {
          a.error = new Error("Query not found"), a.isFetching = !1, a.isLoading = !1;
          return;
        }
        l.fn().then((v) => a.value = v).catch((v) => a.error = v).finally(() => {
          a.isFetching = !1, a.isLoading = !1;
        });
      });
      y.set(i, c);
    }
  return r;
}
class Te extends Ge {
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
function Re({
  resolve: e,
  children: t
}) {
  const r = e instanceof Promise ? Ue(e) : e;
  return /* @__PURE__ */ V(Qe, { children: t(r) });
}
function Pt({
  resolve: e,
  fallback: t = null,
  error: r = (n) => /* @__PURE__ */ Je("div", { children: [
    "Error: ",
    n.message
  ] }),
  children: s
}) {
  return t ? /* @__PURE__ */ V(Te, { fallback: r, children: /* @__PURE__ */ V(Be, { fallback: t, children: /* @__PURE__ */ V(Re, { resolve: e, children: s }) }) }) : /* @__PURE__ */ V(Te, { fallback: r, children: /* @__PURE__ */ V(Re, { resolve: e, children: s }) });
}
const Lt = (e) => (t) => {
  const [, r] = Ve(0);
  return je(() => {
    const s = Z(() => {
      e(), r((n) => n + 1);
    });
    return () => {
      s();
    };
  }, []), /* @__PURE__ */ V(e, { ...t });
};
export {
  Pt as Awaitable,
  Lt as _observer,
  At as defineStore,
  Mt as useObserve
};
