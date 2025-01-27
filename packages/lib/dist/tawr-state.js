import { useRef as re, useSyncExternalStore as ze, Suspense as Fe, Component as Ye, use as Be } from "react";
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
}, oe = Object.assign, Ze = Object.prototype.hasOwnProperty, ce = (e, t) => Ze.call(e, t), N = Array.isArray, P = (e) => ee(e) === "[object Map]", ke = (e) => ee(e) === "[object Set]", ae = (e) => typeof e == "function", et = (e) => typeof e == "string", z = (e) => typeof e == "symbol", F = (e) => e !== null && typeof e == "object", tt = Object.prototype.toString, ee = (e) => tt.call(e), Oe = (e) => ee(e).slice(8, -1), rt = (e) => ee(e) === "[object Object]", he = (e) => et(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, nt = (e) => {
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
    const t = d, r = w;
    d = this, w = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && d !== this && y(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Re(this), d = t, w = r, this.flags &= -3;
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
let De = 0, $, C;
function Ne(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = C, C = e;
    return;
  }
  e.next = $, $ = e;
}
function ve() {
  De++;
}
function _e() {
  if (--De > 0)
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
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === H))
    return;
  e.globalVersion = H;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !ue(e)) {
    e.flags &= -3;
    return;
  }
  const r = d, s = w;
  d = e, w = !0;
  try {
    xe(e);
    const n = e.fn(e._value);
    (t.version === 0 || V(n, e._value)) && (e._value = n, t.version++);
  } catch (n) {
    throw t.version++, n;
  } finally {
    d = r, w = s, Re(e), e.flags &= -3;
  }
}
function ge(e, t = !1) {
  const { dep: r, prevSub: s, nextSub: n } = e;
  if (s && (s.nextSub = n, e.prevSub = void 0), n && (n.prevSub = s, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = n), r.subs === e && (r.subs = s, !s && r.computed)) {
    r.computed.flags &= -5;
    for (let o = r.computed.deps; o; o = o.nextDep)
      ge(o, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function ot(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
let w = !0;
const Ve = [];
function je() {
  Ve.push(w), w = !1;
}
function Ae() {
  const e = Ve.pop();
  w = e === void 0 ? !0 : e;
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
let H = 0;
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
    if (!d || !w || d === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== d)
      r = this.activeLink = new ct(d, this), d.deps ? (r.prevDep = d.depsTail, d.depsTail.nextDep = r, d.depsTail = r) : d.deps = d.depsTail = r, Me(r);
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
function Me(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Me(s);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const fe = /* @__PURE__ */ new WeakMap(), j = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), le = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), G = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function _(e, t, r) {
  if (w && d) {
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
function O(e, t, r, s, n, o) {
  const c = fe.get(e);
  if (!c) {
    H++;
    return;
  }
  const i = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: e,
      type: t,
      key: r,
      newValue: s,
      oldValue: n,
      oldTarget: o
    }) : a.trigger());
  };
  if (ve(), t === "clear")
    c.forEach(i);
  else {
    const a = N(e), f = a && he(r);
    if (a && r === "length") {
      const h = Number(s);
      c.forEach((u, l) => {
        (l === "length" || l === G || !z(l) && l >= h) && i(u);
      });
    } else
      switch ((r !== void 0 || c.has(void 0)) && i(c.get(r)), f && i(c.get(G)), t) {
        case "add":
          a ? f && i(c.get("length")) : (i(c.get(j)), P(e) && i(c.get(le)));
          break;
        case "delete":
          a || (i(c.get(j)), P(e) && i(c.get(le)));
          break;
        case "set":
          P(e) && i(c.get(j));
          break;
      }
  }
  _e();
}
function M(e) {
  const t = v(e);
  return t === e ? t : (_(t, "iterate", G), S(e) ? t : t.map(g));
}
function be(e) {
  return _(e = v(e), "iterate", G), e;
}
const at = {
  __proto__: null,
  [Symbol.iterator]() {
    return se(this, Symbol.iterator, g);
  },
  concat(...e) {
    return M(this).concat(
      ...e.map((t) => N(t) ? M(t) : t)
    );
  },
  entries() {
    return se(this, "entries", (e) => (e[1] = g(e[1]), e));
  },
  every(e, t) {
    return m(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return m(this, "filter", e, t, (r) => r.map(g), arguments);
  },
  find(e, t) {
    return m(this, "find", e, t, g, arguments);
  },
  findIndex(e, t) {
    return m(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return m(this, "findLast", e, t, g, arguments);
  },
  findLastIndex(e, t) {
    return m(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return m(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ie(this, "includes", e);
  },
  indexOf(...e) {
    return ie(this, "indexOf", e);
  },
  join(e) {
    return M(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return ie(this, "lastIndexOf", e);
  },
  map(e, t) {
    return m(this, "map", e, t, void 0, arguments);
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
    return m(this, "some", e, t, void 0, arguments);
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
    return se(this, "values", g);
  }
};
function se(e, t, r) {
  const s = be(e), n = s[t]();
  return s !== e && !S(e) && (n._next = n.next, n.next = () => {
    const o = n._next();
    return o.value && (o.value = r(o.value)), o;
  }), n;
}
const ut = Array.prototype;
function m(e, t, r, s, n, o) {
  const c = be(e), i = c !== e && !S(e), a = c[t];
  if (a !== ut[t]) {
    const u = a.apply(e, o);
    return i ? g(u) : u;
  }
  let f = r;
  c !== e && (i ? f = function(u, l) {
    return r.call(this, g(u), l, e);
  } : r.length > 2 && (f = function(u, l) {
    return r.call(this, u, l, e);
  }));
  const h = a.call(c, f, s);
  return i && n ? n(h) : h;
}
function Se(e, t, r, s) {
  const n = be(e);
  let o = r;
  return n !== e && (S(e) ? r.length > 3 && (o = function(c, i, a) {
    return r.call(this, c, i, a, e);
  }) : o = function(c, i, a) {
    return r.call(this, c, g(i), a, e);
  }), n[t](o, ...s);
}
function ie(e, t, r) {
  const s = v(e);
  _(s, "iterate", G);
  const n = s[t](...r);
  return (n === -1 || n === !1) && Ot(r[0]) ? (r[0] = v(r[0]), s[t](...r)) : n;
}
function W(e, t, r = []) {
  je(), ve();
  const s = v(e)[t].apply(e, r);
  return _e(), Ae(), s;
}
const ft = /* @__PURE__ */ qe("__proto__,__v_isRef,__isVue"), Pe = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(z)
);
function lt(e) {
  z(e) || (e = String(e));
  const t = v(this);
  return _(t, "has", e), t.hasOwnProperty(e);
}
class Ke {
  constructor(t = !1, r = !1) {
    this._isReadonly = t, this._isShallow = r;
  }
  get(t, r, s) {
    if (r === "__v_skip") return t.__v_skip;
    const n = this._isReadonly, o = this._isShallow;
    if (r === "__v_isReactive")
      return !n;
    if (r === "__v_isReadonly")
      return n;
    if (r === "__v_isShallow")
      return o;
    if (r === "__v_raw")
      return s === (n ? o ? St : $e : o ? Et : We).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const c = N(t);
    if (!n) {
      let a;
      if (c && (a = at[r]))
        return a;
      if (r === "hasOwnProperty")
        return lt;
    }
    const i = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      x(t) ? t : s
    );
    return (z(r) ? Pe.has(r) : ft(r)) || (n || _(t, "get", r), o) ? i : x(i) ? c && he(r) ? i : i.value : F(i) ? n ? Ce(i) : we(i) : i;
  }
}
class pt extends Ke {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let o = t[r];
    if (!this._isShallow) {
      const a = K(o);
      if (!S(s) && !K(s) && (o = v(o), s = v(s)), !N(t) && x(o) && !x(s))
        return a ? !1 : (o.value = s, !0);
    }
    const c = N(t) && he(r) ? Number(r) < t.length : ce(t, r), i = Reflect.set(
      t,
      r,
      s,
      x(t) ? t : n
    );
    return t === v(n) && (c ? V(s, o) && O(t, "set", r, s, o) : O(t, "add", r, s)), i;
  }
  deleteProperty(t, r) {
    const s = ce(t, r), n = t[r], o = Reflect.deleteProperty(t, r);
    return o && s && O(t, "delete", r, void 0, n), o;
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return (!z(r) || !Pe.has(r)) && _(t, "has", r), s;
  }
  ownKeys(t) {
    return _(
      t,
      "iterate",
      N(t) ? "length" : j
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
    const n = this.__v_raw, o = v(n), c = P(o), i = e === "entries" || e === Symbol.iterator && c, a = e === "keys" && c, f = n[e](...s), h = r ? pe : t ? de : g;
    return !t && _(
      o,
      "iterate",
      a ? le : j
    ), {
      // iterator protocol
      next() {
        const { value: u, done: l } = f.next();
        return l ? { value: u, done: l } : {
          value: i ? [h(u[0]), h(u[1])] : h(u),
          done: l
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
        v(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function gt(e, t) {
  const r = {
    get(n) {
      const o = this.__v_raw, c = v(o), i = v(n);
      e || (V(n, i) && _(c, "get", n), _(c, "get", i));
      const { has: a } = U(c), f = t ? pe : e ? de : g;
      if (a.call(c, n))
        return f(o.get(n));
      if (a.call(c, i))
        return f(o.get(i));
      o !== c && o.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !e && _(v(n), "iterate", j), Reflect.get(n, "size", n);
    },
    has(n) {
      const o = this.__v_raw, c = v(o), i = v(n);
      return e || (V(n, i) && _(c, "has", n), _(c, "has", i)), n === i ? o.has(n) : o.has(n) || o.has(i);
    },
    forEach(n, o) {
      const c = this, i = c.__v_raw, a = v(i), f = t ? pe : e ? de : g;
      return !e && _(a, "iterate", j), i.forEach((h, u) => n.call(o, f(h), f(u), c));
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
        !t && !S(n) && !K(n) && (n = v(n));
        const o = v(this);
        return U(o).has.call(o, n) || (o.add(n), O(o, "add", n, n)), this;
      },
      set(n, o) {
        !t && !S(o) && !K(o) && (o = v(o));
        const c = v(this), { has: i, get: a } = U(c);
        let f = i.call(c, n);
        f ? process.env.NODE_ENV !== "production" && me(c, i, n) : (n = v(n), f = i.call(c, n));
        const h = a.call(c, n);
        return c.set(n, o), f ? V(o, h) && O(c, "set", n, o, h) : O(c, "add", n, o), this;
      },
      delete(n) {
        const o = v(this), { has: c, get: i } = U(o);
        let a = c.call(o, n);
        a ? process.env.NODE_ENV !== "production" && me(o, c, n) : (n = v(n), a = c.call(o, n));
        const f = i ? i.call(o, n) : void 0, h = o.delete(n);
        return a && O(o, "delete", n, void 0, f), h;
      },
      clear() {
        const n = v(this), o = n.size !== 0, c = process.env.NODE_ENV !== "production" ? P(n) ? new Map(n) : new Set(n) : void 0, i = n.clear();
        return o && O(
          n,
          "clear",
          void 0,
          void 0,
          c
        ), i;
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
  return (s, n, o) => n === "__v_isReactive" ? !e : n === "__v_isReadonly" ? e : n === "__v_raw" ? s : Reflect.get(
    ce(r, n) && n in s ? r : s,
    n,
    o
  );
}
const bt = {
  get: /* @__PURE__ */ Le(!1, !1)
}, wt = {
  get: /* @__PURE__ */ Le(!0, !1)
};
function me(e, t, r) {
  const s = v(r);
  if (s !== r && t.call(e, s)) {
    const n = Oe(e);
    y(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const We = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap();
function mt(e) {
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
function yt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : mt(Oe(e));
}
function we(e) {
  return K(e) ? e : He(
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
  const o = n.get(e);
  if (o)
    return o;
  const c = yt(e);
  if (c === 0)
    return e;
  const i = new Proxy(
    e,
    c === 2 ? s : r
  );
  return n.set(e, i), i;
}
function Z(e) {
  return K(e) ? Z(e.__v_raw) : !!(e && e.__v_isReactive);
}
function K(e) {
  return !!(e && e.__v_isReadonly);
}
function S(e) {
  return !!(e && e.__v_isShallow);
}
function Ot(e) {
  return e ? !!e.__v_raw : !1;
}
function v(e) {
  const t = e && e.__v_raw;
  return t ? v(t) : e;
}
const g = (e) => F(e) ? we(e) : e, de = (e) => F(e) ? Ce(e) : e;
function x(e) {
  return e ? e.__v_isRef === !0 : !1;
}
class Dt {
  constructor(t, r, s) {
    this.fn = t, this.setter = r, this._value = void 0, this.dep = new Ie(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = H - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = s;
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
function ye(e, t, r = !1) {
  let s, n;
  ae(e) ? s = e : (s = e.get, n = e.set);
  const o = new Dt(s, n, r);
  return process.env.NODE_ENV, o;
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
  const { immediate: s, deep: n, once: o, scheduler: c, augmentJob: i, call: a } = r, f = (p) => {
    (r.onWarn || y)(
      "Invalid watch source: ",
      p,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, h = (p) => n ? p : S(p) || n === !1 || n === 0 ? D(p, 1) : D(p);
  let u, l, b, A, Y = !1, B = !1;
  if (x(e) ? (l = () => e.value, Y = S(e)) : Z(e) ? (l = () => h(e), Y = !0) : N(e) ? (B = !0, Y = e.some((p) => Z(p) || S(p)), l = () => e.map((p) => {
    if (x(p))
      return p.value;
    if (Z(p))
      return h(p);
    if (ae(p))
      return a ? a(p, 2) : p();
    process.env.NODE_ENV !== "production" && f(p);
  })) : ae(e) ? t ? l = a ? () => a(e, 2) : e : l = () => {
    if (b) {
      je();
      try {
        b();
      } finally {
        Ae();
      }
    }
    const p = T;
    T = u;
    try {
      return a ? a(e, 3, [A]) : e(A);
    } finally {
      T = p;
    }
  } : (l = Xe, process.env.NODE_ENV !== "production" && f(e)), t && n) {
    const p = l, E = n === !0 ? 1 / 0 : n;
    l = () => D(p(), E);
  }
  const I = () => {
    u.stop();
  };
  if (o && t) {
    const p = t;
    t = (...E) => {
      p(...E), I();
    };
  }
  let R = B ? new Array(e.length).fill(Q) : Q;
  const L = (p) => {
    if (!(!(u.flags & 1) || !u.dirty && !p))
      if (t) {
        const E = u.run();
        if (n || Y || (B ? E.some((te, J) => V(te, R[J])) : V(E, R))) {
          b && b();
          const te = T;
          T = u;
          try {
            const J = [
              E,
              // pass undefined as the old value when it's changed for the first time
              R === Q ? void 0 : B && R[0] === Q ? [] : R,
              A
            ];
            a ? a(t, 3, J) : (
              // @ts-expect-error
              t(...J)
            ), R = E;
          } finally {
            T = te;
          }
        }
      } else
        u.run();
  };
  return i && i(L), u = new it(l), u.scheduler = c ? () => c(L, !1) : L, A = (p) => Nt(p, !1, u), b = u.onStop = () => {
    const p = k.get(u);
    if (p) {
      if (a)
        a(p, 4);
      else
        for (const E of p) E();
      k.delete(u);
    }
  }, process.env.NODE_ENV !== "production" && (u.onTrack = r.onTrack, u.onTrigger = r.onTrigger), t ? s ? L(!0) : R = u.run() : c ? c(L.bind(null, !0), !0) : u.run(), I.pause = u.pause.bind(u), I.resume = u.resume.bind(u), I.stop = I, I;
}
function D(e, t = 1 / 0, r) {
  if (t <= 0 || !F(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, x(e))
    D(e.value, t, r);
  else if (N(e))
    for (let s = 0; s < e.length; s++)
      D(e[s], t, r);
  else if (ke(e) || P(e))
    e.forEach((s) => {
      D(s, t, r);
    });
  else if (rt(e)) {
    for (const s in e)
      D(e[s], t, r);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && D(e[s], t, r);
  }
  return e;
}
function Rt(e) {
  return e && typeof e == "object" && "$state" in e && "actions" in e;
}
function Ge(e) {
  return typeof e == "object" && e !== null && typeof e.value < "u";
}
function Tt(e, t) {
  const r = /* @__PURE__ */ new WeakSet(), s = (n, o = []) => typeof n != "object" || n === null || r.has(n) ? n : (r.add(n), new Proxy(n, {
    get(c, i) {
      if (i === "actions" || i === "$underive" || i === "$invalidate" || i === "$state")
        return;
      const a = [...o, i];
      t(a);
      const f = c[i];
      return Ge(f) ? f.value : typeof f == "function" ? f.bind(c) : s(f, a);
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
function Mt(e) {
  if (!Rt(e))
    throw new Error("useSnapshot requires a store created with defineStore()");
  const t = re(/* @__PURE__ */ new Set()), r = re(null), s = re(0), n = (i) => {
    t.current.add(i.join("."));
  };
  return ze((i) => {
    const f = Array.from(t.current).map((h) => {
      const u = h.split(".");
      return xt(
        () => {
          let l = e;
          for (const b of u) {
            if (l == null) return;
            l = l[b], Ge(l) && (l = l.value);
          }
          return l;
        },
        () => {
          s.current++, r.current = null, i();
        },
        // @ts-expect-error Vue's watch options type doesn't include flush
        { flush: "sync" }
      );
    });
    return () => {
      f.forEach((h) => h());
    };
  }, () => (r.current !== null || (t.current = /* @__PURE__ */ new Set(), r.current = Tt(e, n)), r.current));
}
function Pt(e) {
  const t = e.state(), r = we(t), s = /* @__PURE__ */ new Map();
  let n = null;
  const o = (i) => {
    n && (s.has(i) || s.set(i, /* @__PURE__ */ new Set()), s.get(i).add(n));
  }, c = {
    $state: r,
    $underive(i) {
      i.forEach((a) => {
        const f = Object.getOwnPropertyDescriptor(c, a);
        if (f && typeof f.get == "function") {
          const h = f.get.call(c);
          Object.defineProperty(c, a, {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            value: h
          });
        }
      });
    },
    $invalidate(i) {
      const a = /* @__PURE__ */ new Set(), f = (u) => {
        var l;
        a.has(u) || (a.add(u), (l = s.get(u)) == null || l.forEach((b) => {
          f(b);
        }));
      };
      i.forEach((u) => f(u)), Array.from(a).forEach((u) => {
        if (c.$underive([u]), e.getters && u in e.getters) {
          const l = e.getters[u], b = ye(() => {
            n = u;
            const A = l(c);
            return n = null, A;
          });
          Object.defineProperty(c, u, {
            get: () => (o(u), b.value),
            enumerable: !0,
            configurable: !0
          });
        }
      });
    }
  };
  if (Object.keys(r).forEach((i) => {
    Object.defineProperty(c, i, {
      get: () => r[i],
      set: (a) => {
        r[i] = a;
      },
      enumerable: !0,
      configurable: !0
    });
  }), e.getters && Object.entries(e.getters).forEach(([i, a]) => {
    const f = ye(() => {
      n = i;
      const h = a(c);
      return n = null, h;
    });
    Object.defineProperty(c, i, {
      get: () => (o(i), f.value),
      enumerable: !0,
      configurable: !0
    });
  }), e.actions) {
    const i = {};
    Object.entries(e.actions).forEach(([a, f]) => {
      i[a] = f.bind(c);
    }), c.actions = i;
  }
  return c;
}
class Vt extends Ye {
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
  const r = Be(e);
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
  return /* @__PURE__ */ X(Vt, { fallback: r, children: /* @__PURE__ */ X(Fe, { fallback: t, children: /* @__PURE__ */ X(jt, { resolve: e, children: s }) }) });
}
export {
  Kt as Awaitable,
  Pt as defineStore,
  Mt as useSnapshot
};
