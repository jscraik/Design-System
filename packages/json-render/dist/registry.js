function n() {
  const r = /* @__PURE__ */ new Map();
  return {
    get(e) {
      return r.get(e);
    },
    register(e, t) {
      r.set(e, t);
    },
    has(e) {
      return r.has(e);
    },
    list() {
      return Array.from(r.keys());
    }
  };
}
export {
  n as createRegistry
};
