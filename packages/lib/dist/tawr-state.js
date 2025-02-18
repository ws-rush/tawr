import { useRef as Ve, useState as le, useEffect as pe, Suspense as qe, Component as Me, use as Ae } from "react";
import { jsx as E, jsxs as je, Fragment as Ie } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Pe(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const Q = Object.assign, Le = Object.prototype.hasOwnProperty, U = (e, t) => Le.call(e, t), N = Array.isArray, T = (e) => de(e) === "[object Map]", Ke = (e) => typeof e == "function", Fe = (e) => typeof e == "string", L = (e) => typeof e == "symbol", C = (e) => e !== null && typeof e == "object", ze = Object.prototype.toString, de = (e) => ze.call(e), he = (e) => de(e).slice(8, -1), ee = (e) => Fe(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, He = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, $e = He((e) => e.charAt(0).toUpperCase() + e.slice(1)), V = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function D(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let u;
const W = /* @__PURE__ */ new WeakSet();
class ie {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, W.has(this) && (W.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ge(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, oe(this), _e(this);
    const t = u, r = _;
    u = this, _ = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && u !== this && D(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), be(this), u = t, _ = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        se(t);
      this.deps = this.depsTail = void 0, oe(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? W.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    G(this) && this.run();
  }
  get dirty() {
    return G(this);
  }
}
let ve = 0, q, M;
function ge(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = M, M = e;
    return;
  }
  e.next = q, q = e;
}
function te() {
  ve++;
}
function re() {
  if (--ve > 0)
    return;
  if (M) {
    let t = M;
    for (M = void 0; t; ) {
      const r = t.next;
      t.next = void 0, t.flags &= -9, t = r;
    }
  }
  let e;
  for (; q; ) {
    let t = q;
    for (q = void 0; t; ) {
      const r = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = r;
    }
  }
  if (e) throw e;
}
function _e(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function be(e) {
  let t, r = e.depsTail, n = r;
  for (; n; ) {
    const s = n.prevDep;
    n.version === -1 ? (n === r && (r = s), se(n), Ce(n)) : t = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = s;
  }
  e.deps = t, e.depsTail = r;
}
function G(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ye(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ye(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === j))
    return;
  e.globalVersion = j;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !G(e)) {
    e.flags &= -3;
    return;
  }
  const r = u, n = _;
  u = e, _ = !0;
  try {
    _e(e);
    const s = e.fn(e._value);
    (t.version === 0 || V(s, e._value)) && (e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    u = r, _ = n, be(e), e.flags &= -3;
  }
}
function se(e, t = !1) {
  const { dep: r, prevSub: n, nextSub: s } = e;
  if (n && (n.nextSub = s, e.prevSub = void 0), s && (s.prevSub = n, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = s), r.subs === e && (r.subs = n, !n && r.computed)) {
    r.computed.flags &= -5;
    for (let c = r.computed.deps; c; c = c.nextDep)
      se(c, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function Ce(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
function H(e, t) {
  e.effect instanceof ie && (e = e.effect.fn);
  const r = new ie(e);
  try {
    r.run();
  } catch (s) {
    throw r.stop(), s;
  }
  const n = r.run.bind(r);
  return n.effect = r, n;
}
function K(e) {
  e.effect.stop();
}
let _ = !0;
const Se = [];
function We() {
  Se.push(_), _ = !1;
}
function Ye() {
  const e = Se.pop();
  _ = e === void 0 ? !0 : e;
}
function oe(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const r = u;
    u = void 0;
    try {
      t();
    } finally {
      u = r;
    }
  }
}
let j = 0;
class Be {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ee {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!u || !_ || u === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== u)
      r = this.activeLink = new Be(u, this), u.deps ? (r.prevDep = u.depsTail, u.depsTail.nextDep = r, u.depsTail = r) : u.deps = u.depsTail = r, we(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const n = r.nextDep;
      n.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = n), r.prevDep = u.depsTail, r.nextDep = void 0, u.depsTail.nextDep = r, u.depsTail = r, u.deps === r && (u.deps = n);
    }
    return process.env.NODE_ENV !== "production" && u.onTrack && u.onTrack(
      Q(
        {
          effect: u
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, j++, this.notify(t);
  }
  notify(t) {
    te();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            Q(
              {
                effect: r.sub
              },
              t
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      re();
    }
  }
}
function we(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep)
        we(n);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const J = /* @__PURE__ */ new WeakMap(), w = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), X = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), I = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function h(e, t, r) {
  if (_ && u) {
    let n = J.get(e);
    n || J.set(e, n = /* @__PURE__ */ new Map());
    let s = n.get(r);
    s || (n.set(r, s = new Ee()), s.map = n, s.key = r), process.env.NODE_ENV !== "production" ? s.track({
      target: e,
      type: t,
      key: r
    }) : s.track();
  }
}
function y(e, t, r, n, s, c) {
  const i = J.get(e);
  if (!i) {
    j++;
    return;
  }
  const o = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: e,
      type: t,
      key: r,
      newValue: n,
      oldValue: s,
      oldTarget: c
    }) : a.trigger());
  };
  if (te(), t === "clear")
    i.forEach(o);
  else {
    const a = N(e), l = a && ee(r);
    if (a && r === "length") {
      const p = Number(n);
      i.forEach((d, g) => {
        (g === "length" || g === I || !L(g) && g >= p) && o(d);
      });
    } else
      switch ((r !== void 0 || i.has(void 0)) && o(i.get(r)), l && o(i.get(I)), t) {
        case "add":
          a ? l && o(i.get("length")) : (o(i.get(w)), T(e) && o(i.get(X)));
          break;
        case "delete":
          a || (o(i.get(w)), T(e) && o(i.get(X)));
          break;
        case "set":
          T(e) && o(i.get(w));
          break;
      }
  }
  re();
}
function m(e) {
  const t = f(e);
  return t === e ? t : (h(t, "iterate", I), x(e) ? t : t.map(v));
}
function ne(e) {
  return h(e = f(e), "iterate", I), e;
}
const Qe = {
  __proto__: null,
  [Symbol.iterator]() {
    return Y(this, Symbol.iterator, v);
  },
  concat(...e) {
    return m(this).concat(
      ...e.map((t) => N(t) ? m(t) : t)
    );
  },
  entries() {
    return Y(this, "entries", (e) => (e[1] = v(e[1]), e));
  },
  every(e, t) {
    return b(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return b(this, "filter", e, t, (r) => r.map(v), arguments);
  },
  find(e, t) {
    return b(this, "find", e, t, v, arguments);
  },
  findIndex(e, t) {
    return b(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return b(this, "findLast", e, t, v, arguments);
  },
  findLastIndex(e, t) {
    return b(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return b(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return B(this, "includes", e);
  },
  indexOf(...e) {
    return B(this, "indexOf", e);
  },
  join(e) {
    return m(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return B(this, "lastIndexOf", e);
  },
  map(e, t) {
    return b(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return O(this, "pop");
  },
  push(...e) {
    return O(this, "push", e);
  },
  reduce(e, ...t) {
    return ce(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ce(this, "reduceRight", e, t);
  },
  shift() {
    return O(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return b(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return O(this, "splice", e);
  },
  toReversed() {
    return m(this).toReversed();
  },
  toSorted(e) {
    return m(this).toSorted(e);
  },
  toSpliced(...e) {
    return m(this).toSpliced(...e);
  },
  unshift(...e) {
    return O(this, "unshift", e);
  },
  values() {
    return Y(this, "values", v);
  }
};
function Y(e, t, r) {
  const n = ne(e), s = n[t]();
  return n !== e && !x(e) && (s._next = s.next, s.next = () => {
    const c = s._next();
    return c.value && (c.value = r(c.value)), c;
  }), s;
}
const Ue = Array.prototype;
function b(e, t, r, n, s, c) {
  const i = ne(e), o = i !== e && !x(e), a = i[t];
  if (a !== Ue[t]) {
    const d = a.apply(e, c);
    return o ? v(d) : d;
  }
  let l = r;
  i !== e && (o ? l = function(d, g) {
    return r.call(this, v(d), g, e);
  } : r.length > 2 && (l = function(d, g) {
    return r.call(this, d, g, e);
  }));
  const p = a.call(i, l, n);
  return o && s ? s(p) : p;
}
function ce(e, t, r, n) {
  const s = ne(e);
  let c = r;
  return s !== e && (x(e) ? r.length > 3 && (c = function(i, o, a) {
    return r.call(this, i, o, a, e);
  }) : c = function(i, o, a) {
    return r.call(this, i, v(o), a, e);
  }), s[t](c, ...n);
}
function B(e, t, r) {
  const n = f(e);
  h(n, "iterate", I);
  const s = n[t](...r);
  return (s === -1 || s === !1) && ut(r[0]) ? (r[0] = f(r[0]), n[t](...r)) : s;
}
function O(e, t, r = []) {
  We(), te();
  const n = f(e)[t].apply(e, r);
  return re(), Ye(), n;
}
const Ge = /* @__PURE__ */ Pe("__proto__,__v_isRef,__isVue"), De = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(L)
);
function Je(e) {
  L(e) || (e = String(e));
  const t = f(this);
  return h(t, "has", e), t.hasOwnProperty(e);
}
class xe {
  constructor(t = !1, r = !1) {
    this._isReadonly = t, this._isShallow = r;
  }
  get(t, r, n) {
    if (r === "__v_skip") return t.__v_skip;
    const s = this._isReadonly, c = this._isShallow;
    if (r === "__v_isReactive")
      return !s;
    if (r === "__v_isReadonly")
      return s;
    if (r === "__v_isShallow")
      return c;
    if (r === "__v_raw")
      return n === (s ? c ? ot : Oe : c ? it : Ne).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const i = N(t);
    if (!s) {
      let a;
      if (i && (a = Qe[r]))
        return a;
      if (r === "hasOwnProperty")
        return Je;
    }
    const o = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      A(t) ? t : n
    );
    return (L(r) ? De.has(r) : Ge(r)) || (s || h(t, "get", r), c) ? o : A(o) ? i && ee(r) ? o : o.value : C(o) ? s ? Re(o) : $(o) : o;
  }
}
class Xe extends xe {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, n, s) {
    let c = t[r];
    if (!this._isShallow) {
      const a = P(c);
      if (!x(n) && !P(n) && (c = f(c), n = f(n)), !N(t) && A(c) && !A(n))
        return a ? !1 : (c.value = n, !0);
    }
    const i = N(t) && ee(r) ? Number(r) < t.length : U(t, r), o = Reflect.set(
      t,
      r,
      n,
      A(t) ? t : s
    );
    return t === f(s) && (i ? V(n, c) && y(t, "set", r, n, c) : y(t, "add", r, n)), o;
  }
  deleteProperty(t, r) {
    const n = U(t, r), s = t[r], c = Reflect.deleteProperty(t, r);
    return c && n && y(t, "delete", r, void 0, s), c;
  }
  has(t, r) {
    const n = Reflect.has(t, r);
    return (!L(r) || !De.has(r)) && h(t, "has", r), n;
  }
  ownKeys(t) {
    return h(
      t,
      "iterate",
      N(t) ? "length" : w
    ), Reflect.ownKeys(t);
  }
}
class Ze extends xe {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, r) {
    return process.env.NODE_ENV !== "production" && D(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, r) {
    return process.env.NODE_ENV !== "production" && D(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const ke = /* @__PURE__ */ new Xe(), et = /* @__PURE__ */ new Ze(), Z = (e) => e, F = (e) => Reflect.getPrototypeOf(e);
function tt(e, t, r) {
  return function(...n) {
    const s = this.__v_raw, c = f(s), i = T(c), o = e === "entries" || e === Symbol.iterator && i, a = e === "keys" && i, l = s[e](...n), p = r ? Z : t ? k : v;
    return !t && h(
      c,
      "iterate",
      a ? X : w
    ), {
      // iterator protocol
      next() {
        const { value: d, done: g } = l.next();
        return g ? { value: d, done: g } : {
          value: o ? [p(d[0]), p(d[1])] : p(d),
          done: g
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function z(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const r = t[0] ? `on key "${t[0]}" ` : "";
      D(
        `${$e(e)} operation ${r}failed: target is readonly.`,
        f(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function rt(e, t) {
  const r = {
    get(s) {
      const c = this.__v_raw, i = f(c), o = f(s);
      e || (V(s, o) && h(i, "get", s), h(i, "get", o));
      const { has: a } = F(i), l = t ? Z : e ? k : v;
      if (a.call(i, s))
        return l(c.get(s));
      if (a.call(i, o))
        return l(c.get(o));
      c !== i && c.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && h(f(s), "iterate", w), Reflect.get(s, "size", s);
    },
    has(s) {
      const c = this.__v_raw, i = f(c), o = f(s);
      return e || (V(s, o) && h(i, "has", s), h(i, "has", o)), s === o ? c.has(s) : c.has(s) || c.has(o);
    },
    forEach(s, c) {
      const i = this, o = i.__v_raw, a = f(o), l = t ? Z : e ? k : v;
      return !e && h(a, "iterate", w), o.forEach((p, d) => s.call(c, l(p), l(d), i));
    }
  };
  return Q(
    r,
    e ? {
      add: z("add"),
      set: z("set"),
      delete: z("delete"),
      clear: z("clear")
    } : {
      add(s) {
        !t && !x(s) && !P(s) && (s = f(s));
        const c = f(this);
        return F(c).has.call(c, s) || (c.add(s), y(c, "add", s, s)), this;
      },
      set(s, c) {
        !t && !x(c) && !P(c) && (c = f(c));
        const i = f(this), { has: o, get: a } = F(i);
        let l = o.call(i, s);
        l ? process.env.NODE_ENV !== "production" && ae(i, o, s) : (s = f(s), l = o.call(i, s));
        const p = a.call(i, s);
        return i.set(s, c), l ? V(c, p) && y(i, "set", s, c, p) : y(i, "add", s, c), this;
      },
      delete(s) {
        const c = f(this), { has: i, get: o } = F(c);
        let a = i.call(c, s);
        a ? process.env.NODE_ENV !== "production" && ae(c, i, s) : (s = f(s), a = i.call(c, s));
        const l = o ? o.call(c, s) : void 0, p = c.delete(s);
        return a && y(c, "delete", s, void 0, l), p;
      },
      clear() {
        const s = f(this), c = s.size !== 0, i = process.env.NODE_ENV !== "production" ? T(s) ? new Map(s) : new Set(s) : void 0, o = s.clear();
        return c && y(
          s,
          "clear",
          void 0,
          void 0,
          i
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((s) => {
    r[s] = tt(s, e, t);
  }), r;
}
function me(e, t) {
  const r = rt(e, t);
  return (n, s, c) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? n : Reflect.get(
    U(r, s) && s in n ? r : n,
    s,
    c
  );
}
const st = {
  get: /* @__PURE__ */ me(!1, !1)
}, nt = {
  get: /* @__PURE__ */ me(!0, !1)
};
function ae(e, t, r) {
  const n = f(r);
  if (n !== r && t.call(e, n)) {
    const s = he(e);
    D(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Ne = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), Oe = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ new WeakMap();
function ct(e) {
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
function at(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ct(he(e));
}
function $(e) {
  return P(e) ? e : Te(
    e,
    !1,
    ke,
    st,
    Ne
  );
}
function Re(e) {
  return Te(
    e,
    !0,
    et,
    nt,
    Oe
  );
}
function Te(e, t, r, n, s) {
  if (!C(e))
    return process.env.NODE_ENV !== "production" && D(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const c = s.get(e);
  if (c)
    return c;
  const i = at(e);
  if (i === 0)
    return e;
  const o = new Proxy(
    e,
    i === 2 ? n : r
  );
  return s.set(e, o), o;
}
function P(e) {
  return !!(e && e.__v_isReadonly);
}
function x(e) {
  return !!(e && e.__v_isShallow);
}
function ut(e) {
  return e ? !!e.__v_raw : !1;
}
function f(e) {
  const t = e && e.__v_raw;
  return t ? f(t) : e;
}
const v = (e) => C(e) ? $(e) : e, k = (e) => C(e) ? Re(e) : e;
function A(e) {
  return e ? e.__v_isRef === !0 : !1;
}
class ft {
  constructor(t, r, n) {
    this.fn = t, this.setter = r, this._value = void 0, this.dep = new Ee(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = j - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    u !== this)
      return ge(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const t = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return ye(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : process.env.NODE_ENV !== "production" && D("Write operation failed: computed value is readonly");
  }
}
function lt(e, t, r = !1) {
  let n, s;
  Ke(e) ? n = e : (n = e.get, s = e.set);
  const c = new ft(n, s, r);
  return process.env.NODE_ENV, c;
}
function ht(e) {
  const t = Ve(e);
  t.current = e;
  const [, r] = le(0), n = t.current();
  return pe(() => {
    const s = H(() => {
      const c = t.current(), i = (o) => {
        if (Array.isArray(o))
          o.forEach((a) => {
            a && typeof a == "object" && i(a);
          });
        else if (o && typeof o == "object") {
          const a = Object.entries(o);
          for (const [l, p] of a)
            o[l], p && typeof p == "object" && i(p);
        }
      };
      i(c), r((o) => o + 1);
    });
    return () => s();
  }, []), n;
}
const S = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
function vt(e) {
  const t = e.state ? e.state() : {}, r = $(t), n = {
    ...e.actions || {},
    $underive(s) {
      s.forEach((c) => {
        const i = String(c);
        if (R.has(i)) {
          const o = R.get(i);
          o.queryEff && (K(o.queryEff), o.queryEff = null), o.initialized = !1, o.queryState.value = void 0, o.queryState.error = null, o.queryState.isFetching = !1, o.queryState.isLoading = !1, S.delete(i);
        } else {
          const o = S.get(i);
          o && (K(o), S.delete(i));
        }
      });
    },
    $invalidate(s) {
      s.forEach((c) => {
        const i = String(c);
        if (R.has(i)) {
          const o = R.get(i);
          o.queryEff && (K(o.queryEff), o.queryEff = null), o.initialized = !1, o.queryState.value = void 0, o.queryState.error = null, o.queryState.isFetching = !1, o.queryState.isLoading = !1, S.delete(i);
        } else {
          const o = S.get(i);
          o && (K(o), S.delete(i));
        }
      });
    }
  };
  for (const s in n)
    r[s] = n[s].bind(r);
  if (e.getters)
    for (const s in e.getters) {
      const c = e.getters[s], i = lt(() => c(r));
      Object.defineProperty(r, s, {
        enumerable: !0,
        configurable: !0,
        get() {
          return i.value;
        }
      });
    }
  if (e.queries)
    for (const s in e.queries) {
      const c = s, i = {
        initialized: !1,
        queryEff: null,
        queryState: $({
          value: void 0,
          isLoading: !1,
          isFetching: !1,
          error: null
        })
      };
      R.set(c, i), Object.defineProperty(r, s, {
        enumerable: !0,
        configurable: !0,
        get() {
          return i.initialized || (i.queryEff = H(() => {
            i.queryState.isFetching = !0;
            const o = e.queries[s](r);
            if (!o) {
              i.queryState.error = new Error("Query not found"), i.queryState.isFetching = !1;
              return;
            }
            o.fn().then((a) => {
              i.queryState.value = a, i.queryState.error = null;
            }).catch((a) => {
              i.queryState.error = a instanceof Error ? a : new Error(String(a));
            }).finally(() => {
              i.queryState.isFetching = !1;
            });
          }), S.set(c, i.queryEff), H(() => {
            i.queryState.isLoading = i.queryState.isFetching && i.queryState.value === void 0;
          }), i.initialized = !0), i.queryState;
        }
      });
    }
  return r;
}
class ue extends Me {
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
function fe({
  resolve: e,
  children: t
}) {
  const r = e instanceof Promise ? Ae(e) : e;
  return /* @__PURE__ */ E(Ie, { children: t(r) });
}
function gt({
  resolve: e,
  fallback: t = null,
  error: r = (s) => /* @__PURE__ */ je("div", { children: [
    "Error: ",
    s.message
  ] }),
  children: n
}) {
  return t ? /* @__PURE__ */ E(ue, { fallback: r, children: /* @__PURE__ */ E(qe, { fallback: t, children: /* @__PURE__ */ E(fe, { resolve: e, children: n }) }) }) : /* @__PURE__ */ E(ue, { fallback: r, children: /* @__PURE__ */ E(fe, { resolve: e, children: n }) });
}
const _t = (e) => (t) => {
  const [, r] = le(0);
  return pe(() => {
    const n = H(() => {
      e(), r((s) => s + 1);
    });
    return () => {
      n();
    };
  }, []), /* @__PURE__ */ E(e, { ...t });
};
export {
  gt as Awaitable,
  _t as _observer,
  vt as defineStore,
  ht as useObserve
};
