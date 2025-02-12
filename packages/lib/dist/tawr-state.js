import { useState as ae, useEffect as fe, Suspense as Ge, Component as Ue, use as Je } from "react";
import { jsx as j, jsxs as Qe, Fragment as Xe } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Ze(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
const ke = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const et = () => {
}, ue = Object.assign, tt = Object.prototype.hasOwnProperty, le = (e, t) => tt.call(e, t), D = Array.isArray, P = (e) => ne(e) === "[object Map]", rt = (e) => ne(e) === "[object Set]", me = (e) => typeof e == "function", nt = (e) => typeof e == "string", z = (e) => typeof e == "symbol", Y = (e) => e !== null && typeof e == "object", st = Object.prototype.toString, ne = (e) => st.call(e), Ie = (e) => ne(e).slice(8, -1), it = (e) => ne(e) === "[object Object]", be = (e) => nt(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ot = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, ct = ot((e) => e.charAt(0).toUpperCase() + e.slice(1)), V = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function N(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let p;
const ie = /* @__PURE__ */ new WeakSet();
class pe {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, ie.has(this) && (ie.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || at(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, xe(this), Pe(this);
    const t = p, r = b;
    p = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && p !== this && N(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Ke(this), p = t, b = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Se(t);
      this.deps = this.depsTail = void 0, xe(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? ie.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    he(this) && this.run();
  }
  get dirty() {
    return he(this);
  }
}
let Me = 0, $, C;
function at(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = C, C = e;
    return;
  }
  e.next = $, $ = e;
}
function we() {
  Me++;
}
function Ee() {
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
function Pe(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ke(e) {
  let t, r = e.depsTail, s = r;
  for (; s; ) {
    const n = s.prevDep;
    s.version === -1 ? (s === r && (r = n), Se(s), ut(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = n;
  }
  e.deps = t, e.depsTail = r;
}
function he(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ft(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ft(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ee))
    return;
  e.globalVersion = ee;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !he(e)) {
    e.flags &= -3;
    return;
  }
  const r = p, s = b;
  p = e, b = !0;
  try {
    Pe(e);
    const n = e.fn(e._value);
    (t.version === 0 || V(n, e._value)) && (e._value = n, t.version++);
  } catch (n) {
    throw t.version++, n;
  } finally {
    p = r, b = s, Ke(e), e.flags &= -3;
  }
}
function Se(e, t = !1) {
  const { dep: r, prevSub: s, nextSub: n } = e;
  if (s && (s.nextSub = n, e.prevSub = void 0), n && (n.prevSub = s, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = n), r.subs === e && (r.subs = s, !s && r.computed)) {
    r.computed.flags &= -5;
    for (let i = r.computed.deps; i; i = i.nextDep)
      Se(i, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function ut(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
function F(e, t) {
  e.effect instanceof pe && (e = e.effect.fn);
  const r = new pe(e);
  try {
    r.run();
  } catch (n) {
    throw r.stop(), n;
  }
  const s = r.run.bind(r);
  return s.effect = r, s;
}
function De(e) {
  e.effect.stop();
}
let b = !0;
const Le = [];
function He() {
  Le.push(b), b = !1;
}
function We() {
  const e = Le.pop();
  b = e === void 0 ? !0 : e;
}
function xe(e) {
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
class lt {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class pt {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!p || !b || p === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== p)
      r = this.activeLink = new lt(p, this), p.deps ? (r.prevDep = p.depsTail, p.depsTail.nextDep = r, p.depsTail = r) : p.deps = p.depsTail = r, Fe(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const s = r.nextDep;
      s.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = s), r.prevDep = p.depsTail, r.nextDep = void 0, p.depsTail.nextDep = r, p.depsTail = r, p.deps === r && (p.deps = s);
    }
    return process.env.NODE_ENV !== "production" && p.onTrack && p.onTrack(
      ue(
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
    we();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            ue(
              {
                effect: r.sub
              },
              t
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      Ee();
    }
  }
}
function Fe(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Fe(s);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const de = /* @__PURE__ */ new WeakMap(), A = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), ve = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), q = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function g(e, t, r) {
  if (b && p) {
    let s = de.get(e);
    s || de.set(e, s = /* @__PURE__ */ new Map());
    let n = s.get(r);
    n || (s.set(r, n = new pt()), n.map = s, n.key = r), process.env.NODE_ENV !== "production" ? n.track({
      target: e,
      type: t,
      key: r
    }) : n.track();
  }
}
function O(e, t, r, s, n, i) {
  const o = de.get(e);
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
  if (we(), t === "clear")
    o.forEach(c);
  else {
    const a = D(e), l = a && be(r);
    if (a && r === "length") {
      const v = Number(s);
      o.forEach((f, d) => {
        (d === "length" || d === q || !z(d) && d >= v) && c(f);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), l && c(o.get(q)), t) {
        case "add":
          a ? l && c(o.get("length")) : (c(o.get(A)), P(e) && c(o.get(ve)));
          break;
        case "delete":
          a || (c(o.get(A)), P(e) && c(o.get(ve)));
          break;
        case "set":
          P(e) && c(o.get(A));
          break;
      }
  }
  Ee();
}
function M(e) {
  const t = h(e);
  return t === e ? t : (g(t, "iterate", q), E(e) ? t : t.map(_));
}
function ye(e) {
  return g(e = h(e), "iterate", q), e;
}
const ht = {
  __proto__: null,
  [Symbol.iterator]() {
    return oe(this, Symbol.iterator, _);
  },
  concat(...e) {
    return M(this).concat(
      ...e.map((t) => D(t) ? M(t) : t)
    );
  },
  entries() {
    return oe(this, "entries", (e) => (e[1] = _(e[1]), e));
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
    return ce(this, "includes", e);
  },
  indexOf(...e) {
    return ce(this, "indexOf", e);
  },
  join(e) {
    return M(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return ce(this, "lastIndexOf", e);
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
    return Ne(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ne(this, "reduceRight", e, t);
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
    return M(this).toReversed();
  },
  toSorted(e) {
    return M(this).toSorted(e);
  },
  toSpliced(...e) {
    return M(this).toSpliced(...e);
  },
  unshift(...e) {
    return W(this, "unshift", e);
  },
  values() {
    return oe(this, "values", _);
  }
};
function oe(e, t, r) {
  const s = ye(e), n = s[t]();
  return s !== e && !E(e) && (n._next = n.next, n.next = () => {
    const i = n._next();
    return i.value && (i.value = r(i.value)), i;
  }), n;
}
const dt = Array.prototype;
function S(e, t, r, s, n, i) {
  const o = ye(e), c = o !== e && !E(e), a = o[t];
  if (a !== dt[t]) {
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
function Ne(e, t, r, s) {
  const n = ye(e);
  let i = r;
  return n !== e && (E(e) ? r.length > 3 && (i = function(o, c, a) {
    return r.call(this, o, c, a, e);
  }) : i = function(o, c, a) {
    return r.call(this, o, _(c), a, e);
  }), n[t](i, ...s);
}
function ce(e, t, r) {
  const s = h(e);
  g(s, "iterate", q);
  const n = s[t](...r);
  return (n === -1 || n === !1) && Rt(r[0]) ? (r[0] = h(r[0]), s[t](...r)) : n;
}
function W(e, t, r = []) {
  He(), we();
  const s = h(e)[t].apply(e, r);
  return Ee(), We(), s;
}
const vt = /* @__PURE__ */ Ze("__proto__,__v_isRef,__isVue"), $e = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(z)
);
function gt(e) {
  z(e) || (e = String(e));
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
      return s === (n ? i ? xt : Ye : i ? Dt : ze).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = D(t);
    if (!n) {
      let a;
      if (o && (a = ht[r]))
        return a;
      if (r === "hasOwnProperty")
        return gt;
    }
    const c = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      x(t) ? t : s
    );
    return (z(r) ? $e.has(r) : vt(r)) || (n || g(t, "get", r), i) ? c : x(c) ? o && be(r) ? c : c.value : Y(c) ? n ? te(c) : Oe(c) : c;
  }
}
class _t extends Ce {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    if (!this._isShallow) {
      const a = K(i);
      if (!E(s) && !K(s) && (i = h(i), s = h(s)), !D(t) && x(i) && !x(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = D(t) && be(r) ? Number(r) < t.length : le(t, r), c = Reflect.set(
      t,
      r,
      s,
      x(t) ? t : n
    );
    return t === h(n) && (o ? V(s, i) && O(t, "set", r, s, i) : O(t, "add", r, s)), c;
  }
  deleteProperty(t, r) {
    const s = le(t, r), n = t[r], i = Reflect.deleteProperty(t, r);
    return i && s && O(t, "delete", r, void 0, n), i;
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return (!z(r) || !$e.has(r)) && g(t, "has", r), s;
  }
  ownKeys(t) {
    return g(
      t,
      "iterate",
      D(t) ? "length" : A
    ), Reflect.ownKeys(t);
  }
}
class bt extends Ce {
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
const wt = /* @__PURE__ */ new _t(), Et = /* @__PURE__ */ new bt(), ge = (e) => e, Q = (e) => Reflect.getPrototypeOf(e);
function St(e, t, r) {
  return function(...s) {
    const n = this.__v_raw, i = h(n), o = P(i), c = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, l = n[e](...s), v = r ? ge : t ? _e : _;
    return !t && g(
      i,
      "iterate",
      a ? ve : A
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
function X(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const r = t[0] ? `on key "${t[0]}" ` : "";
      N(
        `${ct(e)} operation ${r}failed: target is readonly.`,
        h(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function yt(e, t) {
  const r = {
    get(n) {
      const i = this.__v_raw, o = h(i), c = h(n);
      e || (V(n, c) && g(o, "get", n), g(o, "get", c));
      const { has: a } = Q(o), l = t ? ge : e ? _e : _;
      if (a.call(o, n))
        return l(i.get(n));
      if (a.call(o, c))
        return l(i.get(c));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !e && g(h(n), "iterate", A), Reflect.get(n, "size", n);
    },
    has(n) {
      const i = this.__v_raw, o = h(i), c = h(n);
      return e || (V(n, c) && g(o, "has", n), g(o, "has", c)), n === c ? i.has(n) : i.has(n) || i.has(c);
    },
    forEach(n, i) {
      const o = this, c = o.__v_raw, a = h(c), l = t ? ge : e ? _e : _;
      return !e && g(a, "iterate", A), c.forEach((v, f) => n.call(i, l(v), l(f), o));
    }
  };
  return ue(
    r,
    e ? {
      add: X("add"),
      set: X("set"),
      delete: X("delete"),
      clear: X("clear")
    } : {
      add(n) {
        !t && !E(n) && !K(n) && (n = h(n));
        const i = h(this);
        return Q(i).has.call(i, n) || (i.add(n), O(i, "add", n, n)), this;
      },
      set(n, i) {
        !t && !E(i) && !K(i) && (i = h(i));
        const o = h(this), { has: c, get: a } = Q(o);
        let l = c.call(o, n);
        l ? process.env.NODE_ENV !== "production" && Te(o, c, n) : (n = h(n), l = c.call(o, n));
        const v = a.call(o, n);
        return o.set(n, i), l ? V(i, v) && O(o, "set", n, i, v) : O(o, "add", n, i), this;
      },
      delete(n) {
        const i = h(this), { has: o, get: c } = Q(i);
        let a = o.call(i, n);
        a ? process.env.NODE_ENV !== "production" && Te(i, o, n) : (n = h(n), a = o.call(i, n));
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
    r[n] = St(n, e, t);
  }), r;
}
function qe(e, t) {
  const r = yt(e, t);
  return (s, n, i) => n === "__v_isReactive" ? !e : n === "__v_isReadonly" ? e : n === "__v_raw" ? s : Reflect.get(
    le(r, n) && n in s ? r : s,
    n,
    i
  );
}
const Ot = {
  get: /* @__PURE__ */ qe(!1, !1)
}, mt = {
  get: /* @__PURE__ */ qe(!0, !1)
};
function Te(e, t, r) {
  const s = h(r);
  if (s !== r && t.call(e, s)) {
    const n = Ie(e);
    N(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const ze = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ new WeakMap();
function Nt(e) {
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
function Tt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Nt(Ie(e));
}
function Oe(e) {
  return K(e) ? e : Be(
    e,
    !1,
    wt,
    Ot,
    ze
  );
}
function te(e) {
  return Be(
    e,
    !0,
    Et,
    mt,
    Ye
  );
}
function Be(e, t, r, s, n) {
  if (!Y(e))
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
  const o = Tt(e);
  if (o === 0)
    return e;
  const c = new Proxy(
    e,
    o === 2 ? s : r
  );
  return n.set(e, c), c;
}
function k(e) {
  return K(e) ? k(e.__v_raw) : !!(e && e.__v_isReactive);
}
function K(e) {
  return !!(e && e.__v_isReadonly);
}
function E(e) {
  return !!(e && e.__v_isShallow);
}
function Rt(e) {
  return e ? !!e.__v_raw : !1;
}
function h(e) {
  const t = e && e.__v_raw;
  return t ? h(t) : e;
}
const _ = (e) => Y(e) ? Oe(e) : e, _e = (e) => Y(e) ? te(e) : e;
function x(e) {
  return e ? e.__v_isRef === !0 : !1;
}
const Z = {}, re = /* @__PURE__ */ new WeakMap();
let R;
function jt(e, t = !1, r = R) {
  if (r) {
    let s = re.get(r);
    s || re.set(r, s = []), s.push(e);
  } else process.env.NODE_ENV !== "production" && !t && N(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Re(e, t, r = ke) {
  const { immediate: s, deep: n, once: i, scheduler: o, augmentJob: c, call: a } = r, l = (u) => {
    (r.onWarn || N)(
      "Invalid watch source: ",
      u,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, v = (u) => n ? u : E(u) || n === !1 || n === 0 ? m(u, 1) : m(u);
  let f, d, L, B, G = !1, U = !1;
  if (x(e) ? (d = () => e.value, G = E(e)) : k(e) ? (d = () => v(e), G = !0) : D(e) ? (U = !0, G = e.some((u) => k(u) || E(u)), d = () => e.map((u) => {
    if (x(u))
      return u.value;
    if (k(u))
      return v(u);
    if (me(u))
      return a ? a(u, 2) : u();
    process.env.NODE_ENV !== "production" && l(u);
  })) : me(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (L) {
      He();
      try {
        L();
      } finally {
        We();
      }
    }
    const u = R;
    R = f;
    try {
      return a ? a(e, 3, [B]) : e(B);
    } finally {
      R = u;
    }
  } : (d = et, process.env.NODE_ENV !== "production" && l(e)), t && n) {
    const u = d, w = n === !0 ? 1 / 0 : n;
    d = () => m(u(), w);
  }
  const I = () => {
    f.stop();
  };
  if (i && t) {
    const u = t;
    t = (...w) => {
      u(...w), I();
    };
  }
  let T = U ? new Array(e.length).fill(Z) : Z;
  const H = (u) => {
    if (!(!(f.flags & 1) || !f.dirty && !u))
      if (t) {
        const w = f.run();
        if (n || G || (U ? w.some((se, J) => V(se, T[J])) : V(w, T))) {
          L && L();
          const se = R;
          R = f;
          try {
            const J = [
              w,
              // pass undefined as the old value when it's changed for the first time
              T === Z ? void 0 : U && T[0] === Z ? [] : T,
              B
            ];
            a ? a(t, 3, J) : (
              // @ts-expect-error
              t(...J)
            ), T = w;
          } finally {
            R = se;
          }
        }
      } else
        f.run();
  };
  return c && c(H), f = new pe(d), f.scheduler = o ? () => o(H, !1) : H, B = (u) => jt(u, !1, f), L = f.onStop = () => {
    const u = re.get(f);
    if (u) {
      if (a)
        a(u, 4);
      else
        for (const w of u) w();
      re.delete(f);
    }
  }, process.env.NODE_ENV !== "production" && (f.onTrack = r.onTrack, f.onTrigger = r.onTrigger), t ? s ? H(!0) : T = f.run() : o ? o(H.bind(null, !0), !0) : f.run(), I.pause = f.pause.bind(f), I.resume = f.resume.bind(f), I.stop = I, I;
}
function m(e, t = 1 / 0, r) {
  if (t <= 0 || !Y(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, x(e))
    m(e.value, t, r);
  else if (D(e))
    for (let s = 0; s < e.length; s++)
      m(e[s], t, r);
  else if (rt(e) || P(e))
    e.forEach((s) => {
      m(s, t, r);
    });
  else if (it(e)) {
    for (const s in e)
      m(e[s], t, r);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && m(e[s], t, r);
  }
  return e;
}
function It(e) {
  if (Array.isArray(e)) {
    const s = e.map(
      (i) => typeof i == "object" && i !== null ? te(i) : i
    ), [, n] = ae(0);
    return fe(() => {
      const i = s.map((o, c) => typeof e[c] != "object" || e[c] === null ? null : Re(
        () => o,
        () => {
          n((a) => a + 1);
        },
        { deep: !0 }
      ));
      return () => {
        i.forEach((o) => o == null ? void 0 : o());
      };
    }, []), s;
  }
  const t = typeof e == "object" && e !== null ? te(e) : e, [, r] = ae(0);
  return fe(() => {
    if (typeof e != "object" || e === null)
      return;
    const s = Re(
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
function je(e, t) {
  return e !== void 0 && t in e;
}
function Mt(e) {
  var n;
  const t = ((n = e.state) == null ? void 0 : n.call(e)) ?? {}, r = Oe(t), s = {
    ...e.actions,
    $underive(i) {
      i.forEach((o) => {
        y.get(o) && De(y.get(o)), y.delete(o);
      });
    },
    $invalidate(i) {
      i.forEach((o) => {
        y.get(o) && De(y.get(o));
        const c = F(() => {
          const a = e.getters, l = e.queries;
          if (a && je(a, o))
            r[o] = a[o](r);
          else if (l && je(l, o)) {
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
      const o = F(() => {
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
      const c = F(async () => {
        const a = r[i];
        a.isFetching = !0;
        const l = e.queries[i](r);
        if (!l) {
          a.error = new Error("Query not found"), a.isFetching = !1;
          return;
        }
        l.fn().then((v) => a.value = v).catch((v) => a.error = v).finally(() => {
          a.isFetching = !1;
        });
      });
      y.set(i, c), F(() => {
        r[i].isLoading = r[i].isFetching && r[i].value === void 0;
      });
    }
  return r;
}
class Ve extends Ue {
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
function Ae({
  resolve: e,
  children: t
}) {
  const r = e instanceof Promise ? Je(e) : e;
  return /* @__PURE__ */ j(Xe, { children: t(r) });
}
function Pt({
  resolve: e,
  fallback: t = null,
  error: r = (n) => /* @__PURE__ */ Qe("div", { children: [
    "Error: ",
    n.message
  ] }),
  children: s
}) {
  return t ? /* @__PURE__ */ j(Ve, { fallback: r, children: /* @__PURE__ */ j(Ge, { fallback: t, children: /* @__PURE__ */ j(Ae, { resolve: e, children: s }) }) }) : /* @__PURE__ */ j(Ve, { fallback: r, children: /* @__PURE__ */ j(Ae, { resolve: e, children: s }) });
}
const Kt = (e) => (t) => {
  const [, r] = ae(0);
  return fe(() => {
    const s = F(() => {
      e(), r((n) => n + 1);
    });
    return () => {
      s();
    };
  }, []), /* @__PURE__ */ j(e, { ...t });
};
export {
  Pt as Awaitable,
  Kt as _observer,
  Mt as defineStore,
  It as useObserve
};
