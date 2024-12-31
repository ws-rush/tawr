import { useState as Fe, useRef as we, useEffect as Ee, Suspense as Ye, Component as Be, use as Ge } from "react";
import { jsx as X, jsxs as Ue, Fragment as Je } from "react/jsx-runtime";
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
}, ie = Object.assign, Ze = Object.prototype.hasOwnProperty, oe = (e, t) => Ze.call(e, t), D = Array.isArray, I = (e) => ee(e) === "[object Map]", ke = (e) => ee(e) === "[object Set]", ce = (e) => typeof e == "function", et = (e) => typeof e == "string", z = (e) => typeof e == "symbol", F = (e) => e !== null && typeof e == "object", tt = Object.prototype.toString, ee = (e) => tt.call(e), De = (e) => ee(e).slice(8, -1), rt = (e) => ee(e) === "[object Object]", de = (e) => et(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, nt = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, st = nt((e) => e.charAt(0).toUpperCase() + e.slice(1)), T = (e, t) => !Object.is(e, t);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function y(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let p;
const re = /* @__PURE__ */ new WeakSet();
class it {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, re.has(this) && (re.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || xe(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Se(this), Re(this);
    const t = p, r = b;
    p = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && p !== this && y(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Te(this), p = t, b = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        _e(t);
      this.deps = this.depsTail = void 0, Se(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? re.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ae(this) && this.run();
  }
  get dirty() {
    return ae(this);
  }
}
let Ne = 0, W, $;
function xe(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = $, $ = e;
    return;
  }
  e.next = W, W = e;
}
function he() {
  Ne++;
}
function ve() {
  if (--Ne > 0)
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
function Re(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Te(e) {
  let t, r = e.depsTail, s = r;
  for (; s; ) {
    const n = s.prevDep;
    s.version === -1 ? (s === r && (r = n), _e(s), ot(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = n;
  }
  e.deps = t, e.depsTail = r;
}
function ae(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ve(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ve(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === C))
    return;
  e.globalVersion = C;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !ae(e)) {
    e.flags &= -3;
    return;
  }
  const r = p, s = b;
  p = e, b = !0;
  try {
    Re(e);
    const n = e.fn(e._value);
    (t.version === 0 || T(n, e._value)) && (e._value = n, t.version++);
  } catch (n) {
    throw t.version++, n;
  } finally {
    p = r, b = s, Te(e), e.flags &= -3;
  }
}
function _e(e, t = !1) {
  const { dep: r, prevSub: s, nextSub: n } = e;
  if (s && (s.nextSub = n, e.prevSub = void 0), n && (n.prevSub = s, e.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === e && (r.subsHead = n), r.subs === e && (r.subs = s, !s && r.computed)) {
    r.computed.flags &= -5;
    for (let i = r.computed.deps; i; i = i.nextDep)
      _e(i, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function ot(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
let b = !0;
const je = [];
function Ae() {
  je.push(b), b = !1;
}
function Ie() {
  const e = je.pop();
  b = e === void 0 ? !0 : e;
}
function Se(e) {
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
let C = 0;
class ct {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Pe {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!p || !b || p === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== p)
      r = this.activeLink = new ct(p, this), p.deps ? (r.prevDep = p.depsTail, p.depsTail.nextDep = r, p.depsTail = r) : p.deps = p.depsTail = r, Me(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const s = r.nextDep;
      s.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = s), r.prevDep = p.depsTail, r.nextDep = void 0, p.depsTail.nextDep = r, p.depsTail = r, p.deps === r && (p.deps = s);
    }
    return process.env.NODE_ENV !== "production" && p.onTrack && p.onTrack(
      ie(
        {
          effect: p
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, C++, this.notify(t);
  }
  notify(t) {
    he();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            ie(
              {
                effect: r.sub
              },
              t
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      ve();
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
const fe = /* @__PURE__ */ new WeakMap(), V = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), ue = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), H = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function _(e, t, r) {
  if (b && p) {
    let s = fe.get(e);
    s || fe.set(e, s = /* @__PURE__ */ new Map());
    let n = s.get(r);
    n || (s.set(r, n = new Pe()), n.map = s, n.key = r), process.env.NODE_ENV !== "production" ? n.track({
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
  if (he(), t === "clear")
    o.forEach(c);
  else {
    const a = D(e), l = a && de(r);
    if (a && r === "length") {
      const h = Number(s);
      o.forEach((f, v) => {
        (v === "length" || v === H || !z(v) && v >= h) && c(f);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), l && c(o.get(H)), t) {
        case "add":
          a ? l && c(o.get("length")) : (c(o.get(V)), I(e) && c(o.get(ue)));
          break;
        case "delete":
          a || (c(o.get(V)), I(e) && c(o.get(ue)));
          break;
        case "set":
          I(e) && c(o.get(V));
          break;
      }
  }
  ve();
}
function A(e) {
  const t = d(e);
  return t === e ? t : (_(t, "iterate", H), E(e) ? t : t.map(g));
}
function ge(e) {
  return _(e = d(e), "iterate", H), e;
}
const at = {
  __proto__: null,
  [Symbol.iterator]() {
    return ne(this, Symbol.iterator, g);
  },
  concat(...e) {
    return A(this).concat(
      ...e.map((t) => D(t) ? A(t) : t)
    );
  },
  entries() {
    return ne(this, "entries", (e) => (e[1] = g(e[1]), e));
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
    return se(this, "includes", e);
  },
  indexOf(...e) {
    return se(this, "indexOf", e);
  },
  join(e) {
    return A(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return se(this, "lastIndexOf", e);
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
    return ye(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ye(this, "reduceRight", e, t);
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
    return A(this).toReversed();
  },
  toSorted(e) {
    return A(this).toSorted(e);
  },
  toSpliced(...e) {
    return A(this).toSpliced(...e);
  },
  unshift(...e) {
    return L(this, "unshift", e);
  },
  values() {
    return ne(this, "values", g);
  }
};
function ne(e, t, r) {
  const s = ge(e), n = s[t]();
  return s !== e && !E(e) && (n._next = n.next, n.next = () => {
    const i = n._next();
    return i.value && (i.value = r(i.value)), i;
  }), n;
}
const ft = Array.prototype;
function S(e, t, r, s, n, i) {
  const o = ge(e), c = o !== e && !E(e), a = o[t];
  if (a !== ft[t]) {
    const f = a.apply(e, i);
    return c ? g(f) : f;
  }
  let l = r;
  o !== e && (c ? l = function(f, v) {
    return r.call(this, g(f), v, e);
  } : r.length > 2 && (l = function(f, v) {
    return r.call(this, f, v, e);
  }));
  const h = a.call(o, l, s);
  return c && n ? n(h) : h;
}
function ye(e, t, r, s) {
  const n = ge(e);
  let i = r;
  return n !== e && (E(e) ? r.length > 3 && (i = function(o, c, a) {
    return r.call(this, o, c, a, e);
  }) : i = function(o, c, a) {
    return r.call(this, o, g(c), a, e);
  }), n[t](i, ...s);
}
function se(e, t, r) {
  const s = d(e);
  _(s, "iterate", H);
  const n = s[t](...r);
  return (n === -1 || n === !1) && Ot(r[0]) ? (r[0] = d(r[0]), s[t](...r)) : n;
}
function L(e, t, r = []) {
  Ae(), he();
  const s = d(e)[t].apply(e, r);
  return ve(), Ie(), s;
}
const ut = /* @__PURE__ */ qe("__proto__,__v_isRef,__isVue"), Ke = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(z)
);
function lt(e) {
  z(e) || (e = String(e));
  const t = d(this);
  return _(t, "has", e), t.hasOwnProperty(e);
}
class Le {
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
      return s === (n ? i ? St : Ce : i ? Et : $e).get(t) || // receiver is not the reactive proxy, but has the same prototype
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
    return (z(r) ? Ke.has(r) : ut(r)) || (n || _(t, "get", r), i) ? c : N(c) ? o && de(r) ? c : c.value : F(c) ? n ? He(c) : be(c) : c;
  }
}
class pt extends Le {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    if (!this._isShallow) {
      const a = P(i);
      if (!E(s) && !P(s) && (i = d(i), s = d(s)), !D(t) && N(i) && !N(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = D(t) && de(r) ? Number(r) < t.length : oe(t, r), c = Reflect.set(
      t,
      r,
      s,
      N(t) ? t : n
    );
    return t === d(n) && (o ? T(s, i) && m(t, "set", r, s, i) : m(t, "add", r, s)), c;
  }
  deleteProperty(t, r) {
    const s = oe(t, r), n = t[r], i = Reflect.deleteProperty(t, r);
    return i && s && m(t, "delete", r, void 0, n), i;
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return (!z(r) || !Ke.has(r)) && _(t, "has", r), s;
  }
  ownKeys(t) {
    return _(
      t,
      "iterate",
      D(t) ? "length" : V
    ), Reflect.ownKeys(t);
  }
}
class dt extends Le {
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
const ht = /* @__PURE__ */ new pt(), vt = /* @__PURE__ */ new dt(), le = (e) => e, J = (e) => Reflect.getPrototypeOf(e);
function _t(e, t, r) {
  return function(...s) {
    const n = this.__v_raw, i = d(n), o = I(i), c = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, l = n[e](...s), h = r ? le : t ? pe : g;
    return !t && _(
      i,
      "iterate",
      a ? ue : V
    ), {
      // iterator protocol
      next() {
        const { value: f, done: v } = l.next();
        return v ? { value: f, done: v } : {
          value: c ? [h(f[0]), h(f[1])] : h(f),
          done: v
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
        d(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function gt(e, t) {
  const r = {
    get(n) {
      const i = this.__v_raw, o = d(i), c = d(n);
      e || (T(n, c) && _(o, "get", n), _(o, "get", c));
      const { has: a } = J(o), l = t ? le : e ? pe : g;
      if (a.call(o, n))
        return l(i.get(n));
      if (a.call(o, c))
        return l(i.get(c));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !e && _(d(n), "iterate", V), Reflect.get(n, "size", n);
    },
    has(n) {
      const i = this.__v_raw, o = d(i), c = d(n);
      return e || (T(n, c) && _(o, "has", n), _(o, "has", c)), n === c ? i.has(n) : i.has(n) || i.has(c);
    },
    forEach(n, i) {
      const o = this, c = o.__v_raw, a = d(c), l = t ? le : e ? pe : g;
      return !e && _(a, "iterate", V), c.forEach((h, f) => n.call(i, l(h), l(f), o));
    }
  };
  return ie(
    r,
    e ? {
      add: q("add"),
      set: q("set"),
      delete: q("delete"),
      clear: q("clear")
    } : {
      add(n) {
        !t && !E(n) && !P(n) && (n = d(n));
        const i = d(this);
        return J(i).has.call(i, n) || (i.add(n), m(i, "add", n, n)), this;
      },
      set(n, i) {
        !t && !E(i) && !P(i) && (i = d(i));
        const o = d(this), { has: c, get: a } = J(o);
        let l = c.call(o, n);
        l ? process.env.NODE_ENV !== "production" && me(o, c, n) : (n = d(n), l = c.call(o, n));
        const h = a.call(o, n);
        return o.set(n, i), l ? T(i, h) && m(o, "set", n, i, h) : m(o, "add", n, i), this;
      },
      delete(n) {
        const i = d(this), { has: o, get: c } = J(i);
        let a = o.call(i, n);
        a ? process.env.NODE_ENV !== "production" && me(i, o, n) : (n = d(n), a = o.call(i, n));
        const l = c ? c.call(i, n) : void 0, h = i.delete(n);
        return a && m(i, "delete", n, void 0, l), h;
      },
      clear() {
        const n = d(this), i = n.size !== 0, o = process.env.NODE_ENV !== "production" ? I(n) ? new Map(n) : new Set(n) : void 0, c = n.clear();
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
function We(e, t) {
  const r = gt(e, t);
  return (s, n, i) => n === "__v_isReactive" ? !e : n === "__v_isReadonly" ? e : n === "__v_raw" ? s : Reflect.get(
    oe(r, n) && n in s ? r : s,
    n,
    i
  );
}
const bt = {
  get: /* @__PURE__ */ We(!1, !1)
}, wt = {
  get: /* @__PURE__ */ We(!0, !1)
};
function me(e, t, r) {
  const s = d(r);
  if (s !== r && t.call(e, s)) {
    const n = De(e);
    y(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const $e = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Ce = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap();
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
  return e.__v_skip || !Object.isExtensible(e) ? 0 : yt(De(e));
}
function be(e) {
  return P(e) ? e : ze(
    e,
    !1,
    ht,
    bt,
    $e
  );
}
function He(e) {
  return ze(
    e,
    !0,
    vt,
    wt,
    Ce
  );
}
function ze(e, t, r, s, n) {
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
  return P(e) ? Z(e.__v_raw) : !!(e && e.__v_isReactive);
}
function P(e) {
  return !!(e && e.__v_isReadonly);
}
function E(e) {
  return !!(e && e.__v_isShallow);
}
function Ot(e) {
  return e ? !!e.__v_raw : !1;
}
function d(e) {
  const t = e && e.__v_raw;
  return t ? d(t) : e;
}
const g = (e) => F(e) ? be(e) : e, pe = (e) => F(e) ? He(e) : e;
function N(e) {
  return e ? e.__v_isRef === !0 : !1;
}
class Dt {
  constructor(t, r, s) {
    this.fn = t, this.setter = r, this._value = void 0, this.dep = new Pe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = C - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    p !== this)
      return xe(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const t = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return Ve(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : process.env.NODE_ENV !== "production" && y("Write operation failed: computed value is readonly");
  }
}
function Oe(e, t, r = !1) {
  let s, n;
  ce(e) ? s = e : (s = e.get, n = e.set);
  const i = new Dt(s, n, r);
  return process.env.NODE_ENV, i;
}
const Q = {}, k = /* @__PURE__ */ new WeakMap();
let R;
function Nt(e, t = !1, r = R) {
  if (r) {
    let s = k.get(r);
    s || k.set(r, s = []), s.push(e);
  } else process.env.NODE_ENV !== "production" && !t && y(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function xt(e, t, r = Qe) {
  const { immediate: s, deep: n, once: i, scheduler: o, augmentJob: c, call: a } = r, l = (u) => {
    (r.onWarn || y)(
      "Invalid watch source: ",
      u,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, h = (u) => n ? u : E(u) || n === !1 || n === 0 ? O(u, 1) : O(u);
  let f, v, M, Y, B = !1, G = !1;
  if (N(e) ? (v = () => e.value, B = E(e)) : Z(e) ? (v = () => h(e), B = !0) : D(e) ? (G = !0, B = e.some((u) => Z(u) || E(u)), v = () => e.map((u) => {
    if (N(u))
      return u.value;
    if (Z(u))
      return h(u);
    if (ce(u))
      return a ? a(u, 2) : u();
    process.env.NODE_ENV !== "production" && l(u);
  })) : ce(e) ? t ? v = a ? () => a(e, 2) : e : v = () => {
    if (M) {
      Ae();
      try {
        M();
      } finally {
        Ie();
      }
    }
    const u = R;
    R = f;
    try {
      return a ? a(e, 3, [Y]) : e(Y);
    } finally {
      R = u;
    }
  } : (v = Xe, process.env.NODE_ENV !== "production" && l(e)), t && n) {
    const u = v, w = n === !0 ? 1 / 0 : n;
    v = () => O(u(), w);
  }
  const j = () => {
    f.stop();
  };
  if (i && t) {
    const u = t;
    t = (...w) => {
      u(...w), j();
    };
  }
  let x = G ? new Array(e.length).fill(Q) : Q;
  const K = (u) => {
    if (!(!(f.flags & 1) || !f.dirty && !u))
      if (t) {
        const w = f.run();
        if (n || B || (G ? w.some((te, U) => T(te, x[U])) : T(w, x))) {
          M && M();
          const te = R;
          R = f;
          try {
            const U = [
              w,
              // pass undefined as the old value when it's changed for the first time
              x === Q ? void 0 : G && x[0] === Q ? [] : x,
              Y
            ];
            a ? a(t, 3, U) : (
              // @ts-expect-error
              t(...U)
            ), x = w;
          } finally {
            R = te;
          }
        }
      } else
        f.run();
  };
  return c && c(K), f = new it(v), f.scheduler = o ? () => o(K, !1) : K, Y = (u) => Nt(u, !1, f), M = f.onStop = () => {
    const u = k.get(f);
    if (u) {
      if (a)
        a(u, 4);
      else
        for (const w of u) w();
      k.delete(f);
    }
  }, process.env.NODE_ENV !== "production" && (f.onTrack = r.onTrack, f.onTrigger = r.onTrigger), t ? s ? K(!0) : x = f.run() : o ? o(K.bind(null, !0), !0) : f.run(), j.pause = f.pause.bind(f), j.resume = f.resume.bind(f), j.stop = j, j;
}
function O(e, t = 1 / 0, r) {
  if (t <= 0 || !F(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, N(e))
    O(e.value, t, r);
  else if (D(e))
    for (let s = 0; s < e.length; s++)
      O(e[s], t, r);
  else if (ke(e) || I(e))
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
function Tt(e) {
  return typeof e == "object" && e !== null && typeof e.value < "u";
}
function Vt(e, t) {
  const r = /* @__PURE__ */ new WeakSet(), s = (n, i = []) => typeof n != "object" || n === null || r.has(n) ? n : (r.add(n), new Proxy(n, {
    get(o, c) {
      if (c === "actions" || c === "$underive" || c === "$invalidate" || c === "$state")
        return;
      const a = [...i, c];
      t(a);
      const l = o[c];
      return Tt(l) ? l.value : typeof l == "function" ? l.bind(o) : s(l, a);
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
  const [, t] = Fe(0), r = we(/* @__PURE__ */ new Set()), s = we(!0);
  Ee(() => (s.current = !0, () => {
    s.current = !1;
  }), []);
  const n = (i) => {
    r.current.add(i.join("."));
  };
  return Ee(() => {
    const i = Array.from(r.current), o = [];
    return i.forEach((c) => {
      const a = c.split("."), l = xt(
        () => {
          let h = e;
          for (const f of a)
            h = h[f];
          return h;
        },
        () => {
          s.current && t((h) => h + 1);
        },
        // @ts-expect-error
        { flush: "sync" }
      );
      o.push(l);
    }), () => o.forEach((c) => c());
  }, [e]), r.current = /* @__PURE__ */ new Set(), Vt(e, n);
}
function Kt(e) {
  const t = e.state(), r = be(t), s = {
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
          const o = e.getters[i], c = Oe(() => o(s));
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
    const o = Oe(() => i(s));
    Object.defineProperty(s, n, {
      get: () => o.value,
      enumerable: !0,
      configurable: !0
    });
  }), e.actions) {
    const n = {};
    Object.entries(e.actions).forEach(([i, o]) => {
      n[i] = o.bind(null);
    }), s.actions = n;
  }
  return s;
}
class jt extends Be {
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
function At({
  resolve: e,
  children: t
}) {
  const r = Ge(e);
  return /* @__PURE__ */ X(Je, { children: t(r) });
}
function Lt({
  resolve: e,
  fallback: t = null,
  error: r = (n) => /* @__PURE__ */ Ue("div", { children: [
    "Error: ",
    n.message
  ] }),
  children: s
}) {
  return /* @__PURE__ */ X(jt, { fallback: r, children: /* @__PURE__ */ X(Ye, { fallback: t, children: /* @__PURE__ */ X(At, { resolve: e, children: s }) }) });
}
export {
  Lt as Awaitable,
  Kt as defineStore,
  Mt as useSnapshot
};
