import { useRef as Ne, useState as le, useEffect as pe, Suspense as Re, Component as Te, use as Ve } from "react";
import { jsx as E, jsxs as Ae, Fragment as Me } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Ie(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const Y = Object.assign, je = Object.prototype.hasOwnProperty, B = (e, t) => je.call(e, t), m = Array.isArray, T = (e) => he(e) === "[object Map]", Pe = (e) => typeof e == "string", K = (e) => typeof e == "symbol", q = (e) => e !== null && typeof e == "object", Ke = Object.prototype.toString, he = (e) => Ke.call(e), de = (e) => he(e).slice(8, -1), Z = (e) => Pe(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Le = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, Fe = Le((e) => e.charAt(0).toUpperCase() + e.slice(1)), V = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function N(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let u;
const C = /* @__PURE__ */ new WeakSet();
class se {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, C.has(this) && (C.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || He(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ie(this), ge(this);
    const t = u, r = _;
    u = this, _ = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && u !== this && N(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), _e(this), u = t, _ = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        te(t);
      this.deps = this.depsTail = void 0, ie(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? C.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    U(this) && this.run();
  }
  get dirty() {
    return U(this);
  }
}
let ve = 0, A, M;
function He(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = M, M = e;
    return;
  }
  e.next = A, A = e;
}
function k() {
  ve++;
}
function ee() {
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
  for (; A; ) {
    let t = A;
    for (A = void 0; t; ) {
      const r = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (i) {
          e || (e = i);
        }
      t = r;
    }
  }
  if (e) throw e;
}
function ge(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function _e(e) {
  let t, r = e.depsTail, i = r;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === r && (r = s), te(i), qe(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = r;
}
function U(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && ($e(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function $e(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === H))
    return;
  e.globalVersion = H;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !U(e)) {
    e.flags &= -3;
    return;
  }
  const r = u, i = _;
  u = e, _ = !0;
  try {
    ge(e);
    const s = e.fn(e._value);
    (t.version === 0 || V(s, e._value)) && (e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    u = r, _ = i, _e(e), e.flags &= -3;
  }
}
function te(e, t = !1) {
  const { dep: r, prevSub: i, nextSub: s } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = s), r.subs === e && (r.subs = i, !i && r.computed)) {
    r.computed.flags &= -5;
    for (let n = r.computed.deps; n; n = n.nextDep)
      te(n, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function qe(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
function O(e, t) {
  e.effect instanceof se && (e = e.effect.fn);
  const r = new se(e);
  try {
    r.run();
  } catch (s) {
    throw r.stop(), s;
  }
  const i = r.run.bind(r);
  return i.effect = r, i;
}
function ne(e) {
  e.effect.stop();
}
let _ = !0;
const be = [];
function Ce() {
  be.push(_), _ = !1;
}
function We() {
  const e = be.pop();
  _ = e === void 0 ? !0 : e;
}
function ie(e) {
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
let H = 0;
class ze {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ye {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!u || !_ || u === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== u)
      r = this.activeLink = new ze(u, this), u.deps ? (r.prevDep = u.depsTail, u.depsTail.nextDep = r, u.depsTail = r) : u.deps = u.depsTail = r, we(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const i = r.nextDep;
      i.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = i), r.prevDep = u.depsTail, r.nextDep = void 0, u.depsTail.nextDep = r, u.depsTail = r, u.deps === r && (u.deps = i);
    }
    return process.env.NODE_ENV !== "production" && u.onTrack && u.onTrack(
      Y(
        {
          effect: u
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, H++, this.notify(t);
  }
  notify(t) {
    k();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            Y(
              {
                effect: r.sub
              },
              t
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      ee();
    }
  }
}
function we(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        we(i);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const Q = /* @__PURE__ */ new WeakMap(), S = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), G = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), j = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function d(e, t, r) {
  if (_ && u) {
    let i = Q.get(e);
    i || Q.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(r);
    s || (i.set(r, s = new Ye()), s.map = i, s.key = r), process.env.NODE_ENV !== "production" ? s.track({
      target: e,
      type: t,
      key: r
    }) : s.track();
  }
}
function w(e, t, r, i, s, n) {
  const o = Q.get(e);
  if (!o) {
    H++;
    return;
  }
  const c = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: e,
      type: t,
      key: r,
      newValue: i,
      oldValue: s,
      oldTarget: n
    }) : a.trigger());
  };
  if (k(), t === "clear")
    o.forEach(c);
  else {
    const a = m(e), f = a && Z(r);
    if (a && r === "length") {
      const p = Number(i);
      o.forEach((h, g) => {
        (g === "length" || g === j || !K(g) && g >= p) && c(h);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), f && c(o.get(j)), t) {
        case "add":
          a ? f && c(o.get("length")) : (c(o.get(S)), T(e) && c(o.get(G)));
          break;
        case "delete":
          a || (c(o.get(S)), T(e) && c(o.get(G)));
          break;
        case "set":
          T(e) && c(o.get(S));
          break;
      }
  }
  ee();
}
function D(e) {
  const t = l(e);
  return t === e ? t : (d(t, "iterate", j), x(e) ? t : t.map(v));
}
function re(e) {
  return d(e = l(e), "iterate", j), e;
}
const Be = {
  __proto__: null,
  [Symbol.iterator]() {
    return W(this, Symbol.iterator, v);
  },
  concat(...e) {
    return D(this).concat(
      ...e.map((t) => m(t) ? D(t) : t)
    );
  },
  entries() {
    return W(this, "entries", (e) => (e[1] = v(e[1]), e));
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
    return z(this, "includes", e);
  },
  indexOf(...e) {
    return z(this, "indexOf", e);
  },
  join(e) {
    return D(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return z(this, "lastIndexOf", e);
  },
  map(e, t) {
    return b(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return R(this, "pop");
  },
  push(...e) {
    return R(this, "push", e);
  },
  reduce(e, ...t) {
    return oe(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return oe(this, "reduceRight", e, t);
  },
  shift() {
    return R(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return b(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return R(this, "splice", e);
  },
  toReversed() {
    return D(this).toReversed();
  },
  toSorted(e) {
    return D(this).toSorted(e);
  },
  toSpliced(...e) {
    return D(this).toSpliced(...e);
  },
  unshift(...e) {
    return R(this, "unshift", e);
  },
  values() {
    return W(this, "values", v);
  }
};
function W(e, t, r) {
  const i = re(e), s = i[t]();
  return i !== e && !x(e) && (s._next = s.next, s.next = () => {
    const n = s._next();
    return n.value && (n.value = r(n.value)), n;
  }), s;
}
const Ue = Array.prototype;
function b(e, t, r, i, s, n) {
  const o = re(e), c = o !== e && !x(e), a = o[t];
  if (a !== Ue[t]) {
    const h = a.apply(e, n);
    return c ? v(h) : h;
  }
  let f = r;
  o !== e && (c ? f = function(h, g) {
    return r.call(this, v(h), g, e);
  } : r.length > 2 && (f = function(h, g) {
    return r.call(this, h, g, e);
  }));
  const p = a.call(o, f, i);
  return c && s ? s(p) : p;
}
function oe(e, t, r, i) {
  const s = re(e);
  let n = r;
  return s !== e && (x(e) ? r.length > 3 && (n = function(o, c, a) {
    return r.call(this, o, c, a, e);
  }) : n = function(o, c, a) {
    return r.call(this, o, v(c), a, e);
  }), s[t](n, ...i);
}
function z(e, t, r) {
  const i = l(e);
  d(i, "iterate", j);
  const s = i[t](...r);
  return (s === -1 || s === !1) && at(r[0]) ? (r[0] = l(r[0]), i[t](...r)) : s;
}
function R(e, t, r = []) {
  Ce(), k();
  const i = l(e)[t].apply(e, r);
  return ee(), We(), i;
}
const Qe = /* @__PURE__ */ Ie("__proto__,__v_isRef,__isVue"), Ee = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(K)
);
function Ge(e) {
  K(e) || (e = String(e));
  const t = l(this);
  return d(t, "has", e), t.hasOwnProperty(e);
}
class Se {
  constructor(t = !1, r = !1) {
    this._isReadonly = t, this._isShallow = r;
  }
  get(t, r, i) {
    if (r === "__v_skip") return t.__v_skip;
    const s = this._isReadonly, n = this._isShallow;
    if (r === "__v_isReactive")
      return !s;
    if (r === "__v_isReadonly")
      return s;
    if (r === "__v_isShallow")
      return n;
    if (r === "__v_raw")
      return i === (s ? n ? it : ye : n ? nt : De).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(i) ? t : void 0;
    const o = m(t);
    if (!s) {
      let a;
      if (o && (a = Be[r]))
        return a;
      if (r === "hasOwnProperty")
        return Ge;
    }
    const c = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      I(t) ? t : i
    );
    return (K(r) ? Ee.has(r) : Qe(r)) || (s || d(t, "get", r), n) ? c : I(c) ? o && Z(r) ? c : c.value : q(c) ? s ? Oe(c) : $(c) : c;
  }
}
class Je extends Se {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, i, s) {
    let n = t[r];
    if (!this._isShallow) {
      const a = P(n);
      if (!x(i) && !P(i) && (n = l(n), i = l(i)), !m(t) && I(n) && !I(i))
        return a ? !1 : (n.value = i, !0);
    }
    const o = m(t) && Z(r) ? Number(r) < t.length : B(t, r), c = Reflect.set(
      t,
      r,
      i,
      I(t) ? t : s
    );
    return t === l(s) && (o ? V(i, n) && w(t, "set", r, i, n) : w(t, "add", r, i)), c;
  }
  deleteProperty(t, r) {
    const i = B(t, r), s = t[r], n = Reflect.deleteProperty(t, r);
    return n && i && w(t, "delete", r, void 0, s), n;
  }
  has(t, r) {
    const i = Reflect.has(t, r);
    return (!K(r) || !Ee.has(r)) && d(t, "has", r), i;
  }
  ownKeys(t) {
    return d(
      t,
      "iterate",
      m(t) ? "length" : S
    ), Reflect.ownKeys(t);
  }
}
class Xe extends Se {
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
const Ze = /* @__PURE__ */ new Je(), ke = /* @__PURE__ */ new Xe(), J = (e) => e, L = (e) => Reflect.getPrototypeOf(e);
function et(e, t, r) {
  return function(...i) {
    const s = this.__v_raw, n = l(s), o = T(n), c = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, f = s[e](...i), p = r ? J : t ? X : v;
    return !t && d(
      n,
      "iterate",
      a ? G : S
    ), {
      // iterator protocol
      next() {
        const { value: h, done: g } = f.next();
        return g ? { value: h, done: g } : {
          value: c ? [p(h[0]), p(h[1])] : p(h),
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
function F(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const r = t[0] ? `on key "${t[0]}" ` : "";
      N(
        `${Fe(e)} operation ${r}failed: target is readonly.`,
        l(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function tt(e, t) {
  const r = {
    get(s) {
      const n = this.__v_raw, o = l(n), c = l(s);
      e || (V(s, c) && d(o, "get", s), d(o, "get", c));
      const { has: a } = L(o), f = t ? J : e ? X : v;
      if (a.call(o, s))
        return f(n.get(s));
      if (a.call(o, c))
        return f(n.get(c));
      n !== o && n.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && d(l(s), "iterate", S), Reflect.get(s, "size", s);
    },
    has(s) {
      const n = this.__v_raw, o = l(n), c = l(s);
      return e || (V(s, c) && d(o, "has", s), d(o, "has", c)), s === c ? n.has(s) : n.has(s) || n.has(c);
    },
    forEach(s, n) {
      const o = this, c = o.__v_raw, a = l(c), f = t ? J : e ? X : v;
      return !e && d(a, "iterate", S), c.forEach((p, h) => s.call(n, f(p), f(h), o));
    }
  };
  return Y(
    r,
    e ? {
      add: F("add"),
      set: F("set"),
      delete: F("delete"),
      clear: F("clear")
    } : {
      add(s) {
        !t && !x(s) && !P(s) && (s = l(s));
        const n = l(this);
        return L(n).has.call(n, s) || (n.add(s), w(n, "add", s, s)), this;
      },
      set(s, n) {
        !t && !x(n) && !P(n) && (n = l(n));
        const o = l(this), { has: c, get: a } = L(o);
        let f = c.call(o, s);
        f ? process.env.NODE_ENV !== "production" && ce(o, c, s) : (s = l(s), f = c.call(o, s));
        const p = a.call(o, s);
        return o.set(s, n), f ? V(n, p) && w(o, "set", s, n, p) : w(o, "add", s, n), this;
      },
      delete(s) {
        const n = l(this), { has: o, get: c } = L(n);
        let a = o.call(n, s);
        a ? process.env.NODE_ENV !== "production" && ce(n, o, s) : (s = l(s), a = o.call(n, s));
        const f = c ? c.call(n, s) : void 0, p = n.delete(s);
        return a && w(n, "delete", s, void 0, f), p;
      },
      clear() {
        const s = l(this), n = s.size !== 0, o = process.env.NODE_ENV !== "production" ? T(s) ? new Map(s) : new Set(s) : void 0, c = s.clear();
        return n && w(
          s,
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
  ].forEach((s) => {
    r[s] = et(s, e, t);
  }), r;
}
function xe(e, t) {
  const r = tt(e, t);
  return (i, s, n) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    B(r, s) && s in i ? r : i,
    s,
    n
  );
}
const rt = {
  get: /* @__PURE__ */ xe(!1, !1)
}, st = {
  get: /* @__PURE__ */ xe(!0, !1)
};
function ce(e, t, r) {
  const i = l(r);
  if (i !== r && t.call(e, i)) {
    const s = de(e);
    N(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const De = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap();
function ot(e) {
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
function ct(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ot(de(e));
}
function $(e) {
  return P(e) ? e : me(
    e,
    !1,
    Ze,
    rt,
    De
  );
}
function Oe(e) {
  return me(
    e,
    !0,
    ke,
    st,
    ye
  );
}
function me(e, t, r, i, s) {
  if (!q(e))
    return process.env.NODE_ENV !== "production" && N(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const n = s.get(e);
  if (n)
    return n;
  const o = ct(e);
  if (o === 0)
    return e;
  const c = new Proxy(
    e,
    o === 2 ? i : r
  );
  return s.set(e, c), c;
}
function P(e) {
  return !!(e && e.__v_isReadonly);
}
function x(e) {
  return !!(e && e.__v_isShallow);
}
function at(e) {
  return e ? !!e.__v_raw : !1;
}
function l(e) {
  const t = e && e.__v_raw;
  return t ? l(t) : e;
}
const v = (e) => q(e) ? $(e) : e, X = (e) => q(e) ? Oe(e) : e;
function I(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function lt(e) {
  const t = Ne(e);
  t.current = e;
  const [, r] = le(0), i = t.current();
  return pe(() => {
    const s = O(() => {
      const n = t.current(), o = (c) => {
        if (Array.isArray(c))
          c.forEach((a) => {
            a && typeof a == "object" && o(a);
          });
        else if (c && typeof c == "object") {
          const a = Object.entries(c);
          for (const [f, p] of a)
            c[f], p && typeof p == "object" && o(p);
        }
      };
      o(n), r((c) => c + 1);
    });
    return () => s();
  }, []), i;
}
const y = /* @__PURE__ */ new Map();
function ae(e, t) {
  return e !== void 0 && t in e;
}
function pt(e) {
  const t = e.state ? e.state() : {}, r = $(t), i = {
    ...e.actions || {},
    $underive(s) {
      s.forEach((n) => {
        const o = y.get(String(n));
        o && ne(o), y.delete(String(n));
      });
    },
    $invalidate(s) {
      s.forEach((n) => {
        const o = y.get(String(n));
        o && ne(o);
        const c = O(() => {
          if (e.getters && ae(e.getters, n)) {
            const a = e.getters[n];
            r[n] = a(r);
          } else if (e.queries && ae(e.queries, n)) {
            const a = e.queries[n](r);
            if (a) {
              const f = r[n];
              f.isFetching = !0, a.fn().then((p) => {
                f.value = p, f.error = null;
              }).catch((p) => {
                f.error = p;
              }).finally(() => {
                f.isFetching = !1;
              });
            }
          }
        });
        y.set(String(n), c);
      });
    }
  };
  for (const s in i)
    r[s] = i[s].bind(r);
  if (e.queries)
    for (const s in e.queries) {
      const n = $({
        value: void 0,
        isLoading: !1,
        isFetching: !1,
        error: null
      });
      r[s] = n;
      const c = O(async () => {
        n.isFetching = !0;
        const a = e.queries[s](r);
        if (!a) {
          n.error = new Error("Query not found"), n.isFetching = !1;
          return;
        }
        try {
          const f = await a.fn();
          n.value = f, n.error = null;
        } catch (f) {
          n.error = f instanceof Error ? f : new Error(String(f));
        } finally {
          n.isFetching = !1;
        }
      });
      y.set(s, c), O(() => {
        n.isLoading = n.isFetching && n.value === void 0;
      });
    }
  if (e.getters)
    for (const s in e.getters) {
      const n = e.getters[s], o = O(() => {
        r[s] = n(r);
      });
      y.set(s, o);
    }
  return r;
}
class fe extends Te {
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
function ue({
  resolve: e,
  children: t
}) {
  const r = e instanceof Promise ? Ve(e) : e;
  return /* @__PURE__ */ E(Me, { children: t(r) });
}
function ht({
  resolve: e,
  fallback: t = null,
  error: r = (s) => /* @__PURE__ */ Ae("div", { children: [
    "Error: ",
    s.message
  ] }),
  children: i
}) {
  return t ? /* @__PURE__ */ E(fe, { fallback: r, children: /* @__PURE__ */ E(Re, { fallback: t, children: /* @__PURE__ */ E(ue, { resolve: e, children: i }) }) }) : /* @__PURE__ */ E(fe, { fallback: r, children: /* @__PURE__ */ E(ue, { resolve: e, children: i }) });
}
const dt = (e) => (t) => {
  const [, r] = le(0);
  return pe(() => {
    const i = O(() => {
      e(), r((s) => s + 1);
    });
    return () => {
      i();
    };
  }, []), /* @__PURE__ */ E(e, { ...t });
};
export {
  ht as Awaitable,
  dt as _observer,
  pt as defineStore,
  lt as useObserve
};
