(function() {
    var a = a || {};
    a.scope = {};
    a.findInternal = function(b, c, d) {
        b instanceof String && (b = String(b));
        for (var f = b.length, g = 0; g < f; g++) {
            var h = b[g];
            if (c.call(d, h, g, b)) return {
                i: g,
                v: h
            }
        }
        return {
            i: -1,
            v: void 0
        }
    };
    a.ASSUME_ES5 = !1;
    a.ASSUME_NO_NATIVE_MAP = !1;
    a.ASSUME_NO_NATIVE_SET = !1;
    a.SIMPLE_FROUND_POLYFILL = !1;
    a.defineProperty = a.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, c, d) {
        b != Array.prototype && b != Object.prototype && (b[c] = d.value)
    };
    a.getGlobal = function(b) {
        return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b
    };
    a.global = a.getGlobal(this);
    a.polyfill = function(b, c) {
        if (c) {
            var d = a.global;
            b = b.split(".");
            for (var f = 0; f < b.length - 1; f++) {
                var g = b[f];
                g in d || (d[g] = {});
                d = d[g]
            }
            b = b[b.length - 1];
            f = d[b];
            c = c(f);
            c != f && null != c && a.defineProperty(d, b, {
                configurable: !0,
                writable: !0,
                value: c
            })
        }
    };
    a.checkStringArgs = function(b, c, d) {
        if (null == b) throw new TypeError("The 'this' value for String.prototype." + d + " must not be null or undefined");
        if (c instanceof RegExp) throw new TypeError("First argument to String.prototype." + d + " must not be a regular expression");
        return b + ""
    };
    a.polyfill("Math.trunc", function(b) {
        return b ? b : function(b) {
            b = Number(b);
            if (isNaN(b) || Infinity === b || -Infinity === b || 0 === b) return b;
            var c = Math.floor(Math.abs(b));
            return 0 > b ? -c : c
        }
    }, "es6", "es3");
    a.checkEs6ConformanceViaProxy = function() {
        try {
            var b = {},
                c = Object.create(new a.global.Proxy(b, {
                    get: function(d, f, g) {
                        return d == b && "q" == f && g == c
                    }
                }));
            return !0 === c.q
        } catch (d) {
            return !1
        }
    };
    a.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
    a.ES6_CONFORMANCE = a.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && a.checkEs6ConformanceViaProxy();
    a.arrayIteratorImpl = function(b) {
        var c = 0;
        return function() {
            return c < b.length ? {
                done: !1,
                value: b[c++]
            } : {
                done: !0
            }
        }
    };
    a.arrayIterator = function(b) {
        return {
            next: a.arrayIteratorImpl(b)
        }
    };
    a.SYMBOL_PREFIX = "jscomp_symbol_";
    a.initSymbol = function() {
        a.initSymbol = function() {};
        a.global.Symbol || (a.global.Symbol = a.Symbol)
    };
    a.Symbol = function() {
        var b = 0;
        return function(c) {
            return a.SYMBOL_PREFIX + (c || "") + b++
        }
    }();
    a.initSymbolIterator = function() {
        a.initSymbol();
        var b = a.global.Symbol.iterator;
        b || (b = a.global.Symbol.iterator = a.global.Symbol("iterator"));
        "function" != typeof Array.prototype[b] && a.defineProperty(Array.prototype, b, {
            configurable: !0,
            writable: !0,
            value: function() {
                return a.iteratorPrototype(a.arrayIteratorImpl(this))
            }
        });
        a.initSymbolIterator = function() {}
    };
    a.initSymbolAsyncIterator = function() {
        a.initSymbol();
        var b = a.global.Symbol.asyncIterator;
        b || (b = a.global.Symbol.asyncIterator = a.global.Symbol("asyncIterator"));
        a.initSymbolAsyncIterator = function() {}
    };
    a.iteratorPrototype = function(b) {
        a.initSymbolIterator();
        b = {
            next: b
        };
        b[a.global.Symbol.iterator] = function() {
            return this
        };
        return b
    };
    a.makeIterator = function(b) {
        var c = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
        return c ? c.call(b) : a.arrayIterator(b)
    };
    a.owns = function(b, c) {
        return Object.prototype.hasOwnProperty.call(b, c)
    };
    a.polyfill("WeakMap", function(b) {
        function c(b) {
            this.id_ = (m += Math.random() + 1).toString();
            if (b) {
                b = a.makeIterator(b);
                for (var c; !(c = b.next()).done;) c = c.value, this.set(c[0], c[1])
            }
        }

        function d() {
            if (!b || !Object.seal) return !1;
            try {
                var c = Object.seal({}),
                    d = Object.seal({}),
                    f = new b([
                        [c, 2],
                        [d, 3]
                    ]);
                if (2 != f.get(c) || 3 != f.get(d)) return !1;
                f.delete(c);
                f.set(d, 4);
                return !f.has(c) && 4 == f.get(d)
            } catch (r) {
                return !1
            }
        }

        function f() {}

        function g(b) {
            if (!a.owns(b, l)) {
                var c = new f;
                a.defineProperty(b, l, {
                    value: c
                })
            }
        }

        function h(b) {
            var c =
                Object[b];
            c && (Object[b] = function(b) {
                if (b instanceof f) return b;
                g(b);
                return c(b)
            })
        }
        if (a.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
            if (b && a.ES6_CONFORMANCE) return b
        } else if (d()) return b;
        var l = "$jscomp_hidden_" + Math.random();
        h("freeze");
        h("preventExtensions");
        h("seal");
        var m = 0;
        c.prototype.set = function(b, c) {
            g(b);
            if (!a.owns(b, l)) throw Error("WeakMap key fail: " + b);
            b[l][this.id_] = c;
            return this
        };
        c.prototype.get = function(b) {
            return a.owns(b, l) ? b[l][this.id_] : void 0
        };
        c.prototype.has = function(b) {
            return a.owns(b,
                l) && a.owns(b[l], this.id_)
        };
        c.prototype.delete = function(b) {
            return a.owns(b, l) && a.owns(b[l], this.id_) ? delete b[l][this.id_] : !1
        };
        return c
    }, "es6", "es3");
    a.MapEntry = function() {};
    a.polyfill("Map", function(b) {
        function c() {
            var b = {};
            return b.previous = b.next = b.head = b
        }

        function d(b, c) {
            var d = b.head_;
            return a.iteratorPrototype(function() {
                if (d) {
                    for (; d.head != b.head_;) d = d.previous;
                    for (; d.next != d.head;) return d = d.next, {
                        done: !1,
                        value: c(d)
                    };
                    d = null
                }
                return {
                    done: !0,
                    value: void 0
                }
            })
        }

        function f(b, c) {
            var d = c && typeof c;
            "object" == d || "function" == d ? l.has(c) ? d = l.get(c) : (d = "" + ++m, l.set(c, d)) : d = "p_" + c;
            var f = b.data_[d];
            if (f && a.owns(b.data_, d))
                for (b = 0; b < f.length; b++) {
                    var g = f[b];
                    if (c !== c && g.key !== g.key ||
                        c === g.key) return {
                        id: d,
                        list: f,
                        index: b,
                        entry: g
                    }
                }
            return {
                id: d,
                list: f,
                index: -1,
                entry: void 0
            }
        }

        function g(b) {
            this.data_ = {};
            this.head_ = c();
            this.size = 0;
            if (b) {
                b = a.makeIterator(b);
                for (var d; !(d = b.next()).done;) d = d.value, this.set(d[0], d[1])
            }
        }

        function h() {
            if (a.ASSUME_NO_NATIVE_MAP || !b || "function" != typeof b || !b.prototype.entries || "function" != typeof Object.seal) return !1;
            try {
                var c = Object.seal({
                        x: 4
                    }),
                    d = new b(a.makeIterator([
                        [c, "s"]
                    ]));
                if ("s" != d.get(c) || 1 != d.size || d.get({
                        x: 4
                    }) || d.set({
                        x: 4
                    }, "t") != d || 2 != d.size) return !1;
                var f = d.entries(),
                    g = f.next();
                if (g.done || g.value[0] != c || "s" != g.value[1]) return !1;
                g = f.next();
                return g.done || 4 != g.value[0].x || "t" != g.value[1] || !f.next().done ? !1 : !0
            } catch (x) {
                return !1
            }
        }
        if (a.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
            if (b && a.ES6_CONFORMANCE) return b
        } else if (h()) return b;
        a.initSymbolIterator();
        var l = new WeakMap;
        g.prototype.set = function(b, c) {
            b = 0 === b ? 0 : b;
            var d = f(this, b);
            d.list || (d.list = this.data_[d.id] = []);
            d.entry ? d.entry.value = c : (d.entry = {
                next: this.head_,
                previous: this.head_.previous,
                head: this.head_,
                key: b,
                value: c
            }, d.list.push(d.entry), this.head_.previous.next = d.entry, this.head_.previous = d.entry, this.size++);
            return this
        };
        g.prototype.delete = function(b) {
            b = f(this, b);
            return b.entry && b.list ? (b.list.splice(b.index, 1), b.list.length || delete this.data_[b.id], b.entry.previous.next = b.entry.next, b.entry.next.previous = b.entry.previous, b.entry.head = null, this.size--, !0) : !1
        };
        g.prototype.clear = function() {
            this.data_ = {};
            this.head_ = this.head_.previous = c();
            this.size = 0
        };
        g.prototype.has = function(b) {
            return !!f(this, b).entry
        };
        g.prototype.get = function(b) {
            return (b = f(this, b).entry) && b.value
        };
        g.prototype.entries = function() {
            return d(this, function(b) {
                return [b.key, b.value]
            })
        };
        g.prototype.keys = function() {
            return d(this, function(b) {
                return b.key
            })
        };
        g.prototype.values = function() {
            return d(this, function(b) {
                return b.value
            })
        };
        g.prototype.forEach = function(b, c) {
            for (var d = this.entries(), f; !(f = d.next()).done;) f = f.value, b.call(c, f[1], f[0], this)
        };
        g.prototype[Symbol.iterator] = g.prototype.entries;
        var m = 0;
        return g
    }, "es6", "es3");
    a.polyfill("Set", function(b) {
        function c(b) {
            this.map_ = new Map;
            if (b) {
                b = a.makeIterator(b);
                for (var c; !(c = b.next()).done;) this.add(c.value)
            }
            this.size = this.map_.size
        }

        function d() {
            if (a.ASSUME_NO_NATIVE_SET || !b || "function" != typeof b || !b.prototype.entries || "function" != typeof Object.seal) return !1;
            try {
                var c = Object.seal({
                        x: 4
                    }),
                    d = new b(a.makeIterator([c]));
                if (!d.has(c) || 1 != d.size || d.add(c) != d || 1 != d.size || d.add({
                        x: 4
                    }) != d || 2 != d.size) return !1;
                var h = d.entries(),
                    l = h.next();
                if (l.done || l.value[0] != c || l.value[1] != c) return !1;
                l = h.next();
                return l.done || l.value[0] == c || 4 != l.value[0].x || l.value[1] != l.value[0] ? !1 : h.next().done
            } catch (m) {
                return !1
            }
        }
        if (a.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
            if (b && a.ES6_CONFORMANCE) return b
        } else if (d()) return b;
        a.initSymbolIterator();
        c.prototype.add = function(b) {
            b = 0 === b ? 0 : b;
            this.map_.set(b, b);
            this.size = this.map_.size;
            return this
        };
        c.prototype.delete = function(b) {
            b = this.map_.delete(b);
            this.size = this.map_.size;
            return b
        };
        c.prototype.clear = function() {
            this.map_.clear();
            this.size = 0
        };
        c.prototype.has = function(b) {
            return this.map_.has(b)
        };
        c.prototype.entries = function() {
            return this.map_.entries()
        };
        c.prototype.values = function() {
            return this.map_.values()
        };
        c.prototype.keys = c.prototype.values;
        c.prototype[Symbol.iterator] = c.prototype.values;
        c.prototype.forEach = function(b, c) {
            var d = this;
            this.map_.forEach(function(f) {
                return b.call(c, f, f, d)
            })
        };
        return c
    }, "es6", "es3");
    a.polyfill("Array.from", function(b) {
        return b ? b : function(b, d, f) {
            d = null != d ? d : function(b) {
                return b
            };
            var c = [],
                h = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
            if ("function" == typeof h) {
                b = h.call(b);
                for (var l = 0; !(h = b.next()).done;) c.push(d.call(f, h.value, l++))
            } else
                for (h = b.length, l = 0; l < h; l++) c.push(d.call(f, b[l], l));
            return c
        }
    }, "es6", "es3");
    a.iteratorFromArray = function(b, c) {
        a.initSymbolIterator();
        b instanceof String && (b += "");
        var d = 0,
            f = {
                next: function() {
                    if (d < b.length) {
                        var g = d++;
                        return {
                            value: c(g, b[g]),
                            done: !1
                        }
                    }
                    f.next = function() {
                        return {
                            done: !0,
                            value: void 0
                        }
                    };
                    return f.next()
                }
            };
        f[Symbol.iterator] = function() {
            return f
        };
        return f
    };
    var e = e || {};
    e.global = this;
    e.isDef = function(b) {
        return void 0 !== b
    };
    e.isString = function(b) {
        return "string" == typeof b
    };
    e.isBoolean = function(b) {
        return "boolean" == typeof b
    };
    e.isNumber = function(b) {
        return "number" == typeof b
    };
    e.exportPath_ = function(b, c, d) {
        b = b.split(".");
        d = d || e.global;
        b[0] in d || "undefined" == typeof d.execScript || d.execScript("var " + b[0]);
        for (var f; b.length && (f = b.shift());) !b.length && e.isDef(c) ? d[f] = c : d = d[f] && d[f] !== Object.prototype[f] ? d[f] : d[f] = {}
    };
    e.define = function(b, c) {
        e.exportPath_(b, c)
    };
    e.DEBUG = !1;
    e.LOCALE = "en";
    e.TRUSTED_SITE = !0;
    e.STRICT_MODE_COMPATIBLE = !1;
    e.DISALLOW_TEST_ONLY_CODE = !0;
    e.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !0;
    e.provide = function(b) {
        if (e.isInModuleLoader_()) throw Error("goog.provide cannot be used within a module.");
        e.constructNamespace_(b)
    };
    e.constructNamespace_ = function(b, c) {
        e.exportPath_(b, c)
    };
    e.getScriptNonce = function() {
        null === e.cspNonce_ && (e.cspNonce_ = e.getScriptNonce_(e.global.document) || "");
        return e.cspNonce_
    };
    e.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
    e.cspNonce_ = null;
    e.getScriptNonce_ = function(b) {
        return (b = b.querySelector && b.querySelector("script[nonce]")) && (b = b.nonce || b.getAttribute("nonce")) && e.NONCE_PATTERN_.test(b) ? b : null
    };
    e.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
    e.module = function(b) {
        if (!e.isString(b) || !b || -1 == b.search(e.VALID_MODULE_RE_)) throw Error("Invalid module identifier");
        if (!e.isInGoogModuleLoader_()) throw Error("Module " + b + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
        if (e.moduleLoaderState_.moduleName) throw Error("goog.module may only be called once per module.");
        e.moduleLoaderState_.moduleName = b
    };
    e.module.get = function(b) {
        return e.module.getInternal_(b)
    };
    e.module.getInternal_ = function() {
        return null
    };
    e.ModuleType = {
        ES6: "es6",
        GOOG: "goog"
    };
    e.moduleLoaderState_ = null;
    e.isInModuleLoader_ = function() {
        return e.isInGoogModuleLoader_() || e.isInEs6ModuleLoader_()
    };
    e.isInGoogModuleLoader_ = function() {
        return !!e.moduleLoaderState_ && e.moduleLoaderState_.type == e.ModuleType.GOOG
    };
    e.isInEs6ModuleLoader_ = function() {
        if (e.moduleLoaderState_ && e.moduleLoaderState_.type == e.ModuleType.ES6) return !0;
        var b = e.global.$jscomp;
        return b ? "function" != typeof b.getCurrentModulePath ? !1 : !!b.getCurrentModulePath() : !1
    };
    e.module.declareLegacyNamespace = function() {
        e.moduleLoaderState_.declareLegacyNamespace = !0
    };
    e.module.declareNamespace = function(b) {
        if (e.moduleLoaderState_) e.moduleLoaderState_.moduleName = b;
        else {
            var c = e.global.$jscomp;
            if (!c || "function" != typeof c.getCurrentModulePath) throw Error('Module with namespace "' + b + '" has been loaded incorrectly.');
            c = c.require(c.getCurrentModulePath());
            e.loadedModules_[b] = {
                exports: c,
                type: e.ModuleType.ES6,
                moduleId: b
            }
        }
    };
    e.setTestOnly = function(b) {
        if (e.DISALLOW_TEST_ONLY_CODE) throw b = b || "", Error("Importing test-only code into non-debug environment" + (b ? ": " + b : "."));
    };
    e.forwardDeclare = function() {};
    e.getObjectByName = function(b, c) {
        b = b.split(".");
        c = c || e.global;
        for (var d = 0; d < b.length; d++)
            if (c = c[b[d]], !e.isDefAndNotNull(c)) return null;
        return c
    };
    e.globalize = function(b, c) {
        c = c || e.global;
        for (var d in b) c[d] = b[d]
    };
    e.addDependency = function() {};
    e.ENABLE_DEBUG_LOADER = !1;
    e.logToConsole_ = function(b) {
        e.global.console && e.global.console.error(b)
    };
    e.require = function() {};
    e.basePath = "";
    e.nullFunction = function() {};
    e.abstractMethod = function() {
        throw Error("unimplemented abstract method");
    };
    e.addSingletonGetter = function(b) {
        b.instance_ = void 0;
        b.getInstance = function() {
            if (b.instance_) return b.instance_;
            e.DEBUG && (e.instantiatedSingletons_[e.instantiatedSingletons_.length] = b);
            return b.instance_ = new b
        }
    };
    e.instantiatedSingletons_ = [];
    e.LOAD_MODULE_USING_EVAL = !1;
    e.SEAL_MODULE_EXPORTS = null;
    e.loadedModules_ = {};
    e.DEPENDENCIES_ENABLED = !1;
    e.TRANSPILE = "detect";
    e.TRANSPILE_TO_LANGUAGE = "";
    e.TRANSPILER = "transpile.js";
    e.hasBadLetScoping = null;
    e.useSafari10Workaround = function() {
        if (null == e.hasBadLetScoping) {
            try {
                var b = !eval('"use strict";let x = 1; function f() { return typeof x; };f() == "number";')
            } catch (c) {
                b = !1
            }
            e.hasBadLetScoping = b
        }
        return e.hasBadLetScoping
    };
    e.workaroundSafari10EvalBug = function(b) {
        return "(function(){" + b + "\n;})();\n"
    };
    e.loadModule = function(b) {
        var c = e.moduleLoaderState_;
        try {
            e.moduleLoaderState_ = {
                moduleName: "",
                declareLegacyNamespace: !1,
                type: e.ModuleType.GOOG
            };
            if (e.isFunction(b)) var d = b.call(void 0, {});
            else if (e.isString(b)) e.useSafari10Workaround() && (b = e.workaroundSafari10EvalBug(b)), d = e.loadModuleFromSource_.call(void 0, b);
            else throw Error("Invalid module definition");
            var f = e.moduleLoaderState_.moduleName;
            if (e.isString(f) && f) e.moduleLoaderState_.declareLegacyNamespace ? e.constructNamespace_(f, d) : e.DEBUG && Object.seal &&
                "object" == typeof d && null != d && Object.seal(d), e.loadedModules_[f] = {
                    exports: d,
                    type: e.ModuleType.GOOG,
                    moduleId: e.moduleLoaderState_.moduleName
                };
            else throw Error('Invalid module name "' + f + '"');
        } finally {
            e.moduleLoaderState_ = c
        }
    };
    e.loadModuleFromSource_ = function(b) {
        eval(b);
        return {}
    };
    e.normalizePath_ = function(b) {
        b = b.split("/");
        for (var c = 0; c < b.length;) "." == b[c] ? b.splice(c, 1) : c && ".." == b[c] && b[c - 1] && ".." != b[c - 1] ? b.splice(--c, 2) : c++;
        return b.join("/")
    };
    e.loadFileSync_ = function(b) {
        if (e.global.CLOSURE_LOAD_FILE_SYNC) return e.global.CLOSURE_LOAD_FILE_SYNC(b);
        try {
            var c = new e.global.XMLHttpRequest;
            c.open("get", b, !1);
            c.send();
            return 0 == c.status || 200 == c.status ? c.responseText : null
        } catch (d) {
            return null
        }
    };
    e.transpile_ = function(b, c, d) {
        var f = e.global.$jscomp;
        f || (e.global.$jscomp = f = {});
        var g = f.transpile;
        if (!g) {
            var h = e.basePath + e.TRANSPILER,
                l = e.loadFileSync_(h);
            if (l) {
                (function() {
                    eval(l + "\n//# sourceURL=" + h)
                }).call(e.global);
                if (e.global.$gwtExport && e.global.$gwtExport.$jscomp && !e.global.$gwtExport.$jscomp.transpile) throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(e.global.$gwtExport));
                e.global.$jscomp.transpile = e.global.$gwtExport.$jscomp.transpile;
                f = e.global.$jscomp;
                g = f.transpile
            }
        }
        g || (g = f.transpile = function(b, c) {
            e.logToConsole_(c + " requires transpilation but no transpiler was found.");
            return b
        });
        return g(b, c, d)
    };
    e.typeOf = function(b) {
        var c = typeof b;
        if ("object" == c)
            if (b) {
                if (b instanceof Array) return "array";
                if (b instanceof Object) return c;
                var d = Object.prototype.toString.call(b);
                if ("[object Window]" == d) return "object";
                if ("[object Array]" == d || "number" == typeof b.length && "undefined" != typeof b.splice && "undefined" != typeof b.propertyIsEnumerable && !b.propertyIsEnumerable("splice")) return "array";
                if ("[object Function]" == d || "undefined" != typeof b.call && "undefined" != typeof b.propertyIsEnumerable && !b.propertyIsEnumerable("call")) return "function"
            } else return "null";
        else if ("function" == c && "undefined" == typeof b.call) return "object";
        return c
    };
    e.isNull = function(b) {
        return null === b
    };
    e.isDefAndNotNull = function(b) {
        return null != b
    };
    e.isArray = function(b) {
        return "array" == e.typeOf(b)
    };
    e.isArrayLike = function(b) {
        var c = e.typeOf(b);
        return "array" == c || "object" == c && "number" == typeof b.length
    };
    e.isDateLike = function(b) {
        return e.isObject(b) && "function" == typeof b.getFullYear
    };
    e.isFunction = function(b) {
        return "function" == e.typeOf(b)
    };
    e.isObject = function(b) {
        var c = typeof b;
        return "object" == c && null != b || "function" == c
    };
    e.getUid = function(b) {
        return b[e.UID_PROPERTY_] || (b[e.UID_PROPERTY_] = ++e.uidCounter_)
    };
    e.hasUid = function(b) {
        return !!b[e.UID_PROPERTY_]
    };
    e.removeUid = function(b) {
        null !== b && "removeAttribute" in b && b.removeAttribute(e.UID_PROPERTY_);
        try {
            delete b[e.UID_PROPERTY_]
        } catch (c) {}
    };
    e.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
    e.uidCounter_ = 0;
    e.getHashCode = null;
    e.removeHashCode = null;
    e.cloneObject = function(b) {
        var c = e.typeOf(b);
        if ("object" == c || "array" == c) {
            if ("function" === typeof b.clone) return b.clone();
            c = "array" == c ? [] : {};
            for (var d in b) c[d] = e.cloneObject(b[d]);
            return c
        }
        return b
    };
    e.bindNative_ = function(b, c, d) {
        return b.call.apply(b.bind, arguments)
    };
    e.bindJs_ = function(b, c, d) {
        if (!b) throw Error();
        if (2 < arguments.length) {
            var f = Array.prototype.slice.call(arguments, 2);
            return function() {
                var d = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(d, f);
                return b.apply(c, d)
            }
        }
        return function() {
            return b.apply(c, arguments)
        }
    };
    e.bind = function(b, c, d) {
        Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? e.bind = e.bindNative_ : e.bind = e.bindJs_;
        return e.bind.apply(null, arguments)
    };
    e.partial = function(b, c) {
        var d = Array.prototype.slice.call(arguments, 1);
        return function() {
            var c = d.slice();
            c.push.apply(c, arguments);
            return b.apply(this, c)
        }
    };
    e.mixin = function(b, c) {
        for (var d in c) b[d] = c[d]
    };
    e.now = e.TRUSTED_SITE && Date.now || function() {
        return +new Date
    };
    e.globalEval = function(b) {
        if (e.global.execScript) e.global.execScript(b, "JavaScript");
        else if (e.global.eval) {
            if (null == e.evalWorksForGlobals_) {
                try {
                    e.global.eval("var _evalTest_ = 1;")
                } catch (f) {}
                if ("undefined" != typeof e.global._evalTest_) {
                    try {
                        delete e.global._evalTest_
                    } catch (f) {}
                    e.evalWorksForGlobals_ = !0
                } else e.evalWorksForGlobals_ = !1
            }
            if (e.evalWorksForGlobals_) e.global.eval(b);
            else {
                var c = e.global.document,
                    d = c.createElement("SCRIPT");
                d.type = "text/javascript";
                d.defer = !1;
                d.appendChild(c.createTextNode(b));
                c.head.appendChild(d);
                c.head.removeChild(d)
            }
        } else throw Error("goog.globalEval not available");
    };
    e.evalWorksForGlobals_ = null;
    e.getCssName = function(b, c) {
        function d(b) {
            b = b.split("-");
            for (var c = [], d = 0; d < b.length; d++) c.push(f(b[d]));
            return c.join("-")
        }

        function f(b) {
            return e.cssNameMapping_[b] || b
        }
        if ("." == String(b).charAt(0)) throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + b);
        var g = e.cssNameMapping_ ? "BY_WHOLE" == e.cssNameMappingStyle_ ? f : d : function(b) {
            return b
        };
        b = c ? b + "-" + g(c) : g(b);
        return e.global.CLOSURE_CSS_NAME_MAP_FN ? e.global.CLOSURE_CSS_NAME_MAP_FN(b) : b
    };
    e.setCssNameMapping = function(b, c) {
        e.cssNameMapping_ = b;
        e.cssNameMappingStyle_ = c
    };
    e.getMsg = function(b, c) {
        c && (b = b.replace(/\{\$([^}]+)}/g, function(b, f) {
            return null != c && f in c ? c[f] : b
        }));
        return b
    };
    e.getMsgWithFallback = function(b) {
        return b
    };
    e.exportSymbol = function(b, c, d) {
        e.exportPath_(b, c, d)
    };
    e.exportProperty = function(b, c, d) {
        b[c] = d
    };
    e.inherits = function(b, c) {
        function d() {}
        d.prototype = c.prototype;
        b.superClass_ = c.prototype;
        b.prototype = new d;
        b.prototype.constructor = b;
        b.base = function(b, d, h) {
            for (var f = Array(arguments.length - 2), g = 2; g < arguments.length; g++) f[g - 2] = arguments[g];
            return c.prototype[d].apply(b, f)
        }
    };
    e.base = function(b, c, d) {
        var f = arguments.callee.caller;
        if (e.STRICT_MODE_COMPATIBLE || e.DEBUG && !f) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
        if ("undefined" !== typeof f.superClass_) {
            for (var g = Array(arguments.length - 1), h = 1; h < arguments.length; h++) g[h - 1] = arguments[h];
            return f.superClass_.constructor.apply(b, g)
        }
        if ("string" != typeof c && "symbol" != typeof c) throw Error("method names provided to goog.base must be a string or a symbol");
        g = Array(arguments.length - 2);
        for (h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
        h = !1;
        for (var l = b.constructor; l; l = l.superClass_ && l.superClass_.constructor)
            if (l.prototype[c] === f) h = !0;
            else if (h) return l.prototype[c].apply(b, g);
        if (b[c] === f) return b.constructor.prototype[c].apply(b, g);
        throw Error("goog.base called from a method of one name to a method of a different name");
    };
    e.scope = function(b) {
        if (e.isInModuleLoader_()) throw Error("goog.scope is not supported within a module.");
        b.call(e.global)
    };
    e.defineClass = function(b, c) {
        var d = c.constructor,
            f = c.statics;
        d && d != Object.prototype.constructor || (d = function() {
            throw Error("cannot instantiate an interface (no constructor defined).");
        });
        d = e.defineClass.createSealingConstructor_(d, b);
        b && e.inherits(d, b);
        delete c.constructor;
        delete c.statics;
        e.defineClass.applyProperties_(d.prototype, c);
        null != f && (f instanceof Function ? f(d) : e.defineClass.applyProperties_(d, f));
        return d
    };
    e.defineClass.SEAL_CLASS_INSTANCES = null;
    e.defineClass.createSealingConstructor_ = function(b, c) {
        function d() {
            var c = b.apply(this, arguments) || this;
            c[e.UID_PROPERTY_] = c[e.UID_PROPERTY_];
            this.constructor === d && f && Object.seal instanceof Function && Object.seal(c);
            return c
        }
        if (!e.DEBUG) return b;
        var f = !e.defineClass.isUnsealable_(c);
        return d
    };
    e.defineClass.isUnsealable_ = function(b) {
        return b && b.prototype && b.prototype[e.UNSEALABLE_CONSTRUCTOR_PROPERTY_]
    };
    e.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    e.defineClass.applyProperties_ = function(b, c) {
        for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (b[d] = c[d]);
        for (var f = 0; f < e.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; f++) d = e.defineClass.OBJECT_PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(c, d) && (b[d] = c[d])
    };
    e.tagUnsealableClass = function() {};
    e.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
    e.math = {};
    e.math.Integer = function(b, c) {
        this.bits_ = [];
        this.sign_ = c;
        for (var d = !0, f = b.length - 1; 0 <= f; f--) {
            var g = b[f] | 0;
            d && g == c || (this.bits_[f] = g, d = !1)
        }
    };
    e.math.Integer.IntCache_ = {};
    e.math.Integer.fromInt = function(b) {
        if (-128 <= b && 128 > b) {
            var c = e.math.Integer.IntCache_[b];
            if (c) return c
        }
        c = new e.math.Integer([b | 0], 0 > b ? -1 : 0); - 128 <= b && 128 > b && (e.math.Integer.IntCache_[b] = c);
        return c
    };
    e.math.Integer.fromNumber = function(b) {
        if (isNaN(b) || !isFinite(b)) return e.math.Integer.ZERO;
        if (0 > b) return e.math.Integer.fromNumber(-b).negate();
        for (var c = [], d = 1, f = 0; b >= d; f++) c[f] = b / d | 0, d *= e.math.Integer.TWO_PWR_32_DBL_;
        return new e.math.Integer(c, 0)
    };
    e.math.Integer.fromBits = function(b) {
        return new e.math.Integer(b, b[b.length - 1] & -2147483648 ? -1 : 0)
    };
    e.math.Integer.fromString = function(b, c) {
        if (0 == b.length) throw Error("number format error: empty string");
        c = c || 10;
        if (2 > c || 36 < c) throw Error("radix out of range: " + c);
        if ("-" == b.charAt(0)) return e.math.Integer.fromString(b.substring(1), c).negate();
        if (0 <= b.indexOf("-")) throw Error('number format error: interior "-" character');
        for (var d = e.math.Integer.fromNumber(Math.pow(c, 8)), f = e.math.Integer.ZERO, g = 0; g < b.length; g += 8) {
            var h = Math.min(8, b.length - g),
                l = parseInt(b.substring(g, g + h), c);
            8 > h ? (h = e.math.Integer.fromNumber(Math.pow(c,
                h)), f = f.multiply(h).add(e.math.Integer.fromNumber(l))) : (f = f.multiply(d), f = f.add(e.math.Integer.fromNumber(l)))
        }
        return f
    };
    e.math.Integer.TWO_PWR_32_DBL_ = 4294967296;
    e.math.Integer.ZERO = e.math.Integer.fromInt(0);
    e.math.Integer.ONE = e.math.Integer.fromInt(1);
    e.math.Integer.TWO_PWR_24_ = e.math.Integer.fromInt(16777216);
    e.math.Integer.prototype.toInt = function() {
        return 0 < this.bits_.length ? this.bits_[0] : this.sign_
    };
    e.math.Integer.prototype.toNumber = function() {
        if (this.isNegative()) return -this.negate().toNumber();
        for (var b = 0, c = 1, d = 0; d < this.bits_.length; d++) b += this.getBitsUnsigned(d) * c, c *= e.math.Integer.TWO_PWR_32_DBL_;
        return b
    };
    e.math.Integer.prototype.toString = function(b) {
        b = b || 10;
        if (2 > b || 36 < b) throw Error("radix out of range: " + b);
        if (this.isZero()) return "0";
        if (this.isNegative()) return "-" + this.negate().toString(b);
        for (var c = e.math.Integer.fromNumber(Math.pow(b, 6)), d = this, f = "";;) {
            var g = d.divide(c),
                h = (d.subtract(g.multiply(c)).toInt() >>> 0).toString(b);
            d = g;
            if (d.isZero()) return h + f;
            for (; 6 > h.length;) h = "0" + h;
            f = "" + h + f
        }
    };
    e.math.Integer.prototype.getBits = function(b) {
        return 0 > b ? 0 : b < this.bits_.length ? this.bits_[b] : this.sign_
    };
    e.math.Integer.prototype.getBitsUnsigned = function(b) {
        b = this.getBits(b);
        return 0 <= b ? b : e.math.Integer.TWO_PWR_32_DBL_ + b
    };
    e.math.Integer.prototype.getSign = function() {
        return this.sign_
    };
    e.math.Integer.prototype.isZero = function() {
        if (0 != this.sign_) return !1;
        for (var b = 0; b < this.bits_.length; b++)
            if (0 != this.bits_[b]) return !1;
        return !0
    };
    e.math.Integer.prototype.isNegative = function() {
        return -1 == this.sign_
    };
    e.math.Integer.prototype.isOdd = function() {
        return 0 == this.bits_.length && -1 == this.sign_ || 0 < this.bits_.length && 0 != (this.bits_[0] & 1)
    };
    e.math.Integer.prototype.equals = function(b) {
        if (this.sign_ != b.sign_) return !1;
        for (var c = Math.max(this.bits_.length, b.bits_.length), d = 0; d < c; d++)
            if (this.getBits(d) != b.getBits(d)) return !1;
        return !0
    };
    e.math.Integer.prototype.notEquals = function(b) {
        return !this.equals(b)
    };
    e.math.Integer.prototype.greaterThan = function(b) {
        return 0 < this.compare(b)
    };
    e.math.Integer.prototype.greaterThanOrEqual = function(b) {
        return 0 <= this.compare(b)
    };
    e.math.Integer.prototype.lessThan = function(b) {
        return 0 > this.compare(b)
    };
    e.math.Integer.prototype.lessThanOrEqual = function(b) {
        return 0 >= this.compare(b)
    };
    e.math.Integer.prototype.compare = function(b) {
        b = this.subtract(b);
        return b.isNegative() ? -1 : b.isZero() ? 0 : 1
    };
    e.math.Integer.prototype.shorten = function(b) {
        var c = b - 1 >> 5;
        b = (b - 1) % 32;
        for (var d = [], f = 0; f < c; f++) d[f] = this.getBits(f);
        f = 31 == b ? 4294967295 : (1 << b + 1) - 1;
        var g = this.getBits(c) & f;
        if (g & 1 << b) return d[c] = g | 4294967295 - f, new e.math.Integer(d, -1);
        d[c] = g;
        return new e.math.Integer(d, 0)
    };
    e.math.Integer.prototype.negate = function() {
        return this.not().add(e.math.Integer.ONE)
    };
    e.math.Integer.prototype.add = function(b) {
        for (var c = Math.max(this.bits_.length, b.bits_.length), d = [], f = 0, g = 0; g <= c; g++) {
            var h = this.getBits(g) >>> 16,
                l = this.getBits(g) & 65535,
                m = b.getBits(g) >>> 16,
                n = b.getBits(g) & 65535;
            l = f + l + n;
            h = (l >>> 16) + h + m;
            f = h >>> 16;
            l &= 65535;
            h &= 65535;
            d[g] = h << 16 | l
        }
        return e.math.Integer.fromBits(d)
    };
    e.math.Integer.prototype.subtract = function(b) {
        return this.add(b.negate())
    };
    e.math.Integer.prototype.multiply = function(b) {
        if (this.isZero() || b.isZero()) return e.math.Integer.ZERO;
        if (this.isNegative()) return b.isNegative() ? this.negate().multiply(b.negate()) : this.negate().multiply(b).negate();
        if (b.isNegative()) return this.multiply(b.negate()).negate();
        if (this.lessThan(e.math.Integer.TWO_PWR_24_) && b.lessThan(e.math.Integer.TWO_PWR_24_)) return e.math.Integer.fromNumber(this.toNumber() * b.toNumber());
        for (var c = this.bits_.length + b.bits_.length, d = [], f = 0; f < 2 * c; f++) d[f] = 0;
        for (f = 0; f <
            this.bits_.length; f++)
            for (var g = 0; g < b.bits_.length; g++) {
                var h = this.getBits(f) >>> 16,
                    l = this.getBits(f) & 65535,
                    m = b.getBits(g) >>> 16,
                    n = b.getBits(g) & 65535;
                d[2 * f + 2 * g] += l * n;
                e.math.Integer.carry16_(d, 2 * f + 2 * g);
                d[2 * f + 2 * g + 1] += h * n;
                e.math.Integer.carry16_(d, 2 * f + 2 * g + 1);
                d[2 * f + 2 * g + 1] += l * m;
                e.math.Integer.carry16_(d, 2 * f + 2 * g + 1);
                d[2 * f + 2 * g + 2] += h * m;
                e.math.Integer.carry16_(d, 2 * f + 2 * g + 2)
            }
        for (f = 0; f < c; f++) d[f] = d[2 * f + 1] << 16 | d[2 * f];
        for (f = c; f < 2 * c; f++) d[f] = 0;
        return new e.math.Integer(d, 0)
    };
    e.math.Integer.carry16_ = function(b, c) {
        for (;
            (b[c] & 65535) != b[c];) b[c + 1] += b[c] >>> 16, b[c] &= 65535, c++
    };
    e.math.Integer.prototype.slowDivide_ = function(b) {
        if (this.isNegative() || b.isNegative()) throw Error("slowDivide_ only works with positive integers.");
        for (var c = e.math.Integer.ONE; b.lessThanOrEqual(this);) c = c.shiftLeft(1), b = b.shiftLeft(1);
        var d = c.shiftRight(1),
            f = b.shiftRight(1);
        b = b.shiftRight(2);
        for (c = c.shiftRight(2); !b.isZero();) {
            var g = f.add(b);
            g.lessThanOrEqual(this) && (d = d.add(c), f = g);
            b = b.shiftRight(1);
            c = c.shiftRight(1)
        }
        return d
    };
    e.math.Integer.prototype.divide = function(b) {
        if (b.isZero()) throw Error("division by zero");
        if (this.isZero()) return e.math.Integer.ZERO;
        if (this.isNegative()) return b.isNegative() ? this.negate().divide(b.negate()) : this.negate().divide(b).negate();
        if (b.isNegative()) return this.divide(b.negate()).negate();
        if (30 < this.bits_.length) return this.slowDivide_(b);
        for (var c = e.math.Integer.ZERO, d = this; d.greaterThanOrEqual(b);) {
            var f = Math.max(1, Math.floor(d.toNumber() / b.toNumber())),
                g = Math.ceil(Math.log(f) / Math.LN2);
            g = 48 >= g ? 1 : Math.pow(2, g - 48);
            for (var h = e.math.Integer.fromNumber(f), l = h.multiply(b); l.isNegative() || l.greaterThan(d);) f -= g, h = e.math.Integer.fromNumber(f), l = h.multiply(b);
            h.isZero() && (h = e.math.Integer.ONE);
            c = c.add(h);
            d = d.subtract(l)
        }
        return c
    };
    e.math.Integer.prototype.modulo = function(b) {
        return this.subtract(this.divide(b).multiply(b))
    };
    e.math.Integer.prototype.not = function() {
        for (var b = this.bits_.length, c = [], d = 0; d < b; d++) c[d] = ~this.bits_[d];
        return new e.math.Integer(c, ~this.sign_)
    };
    e.math.Integer.prototype.and = function(b) {
        for (var c = Math.max(this.bits_.length, b.bits_.length), d = [], f = 0; f < c; f++) d[f] = this.getBits(f) & b.getBits(f);
        return new e.math.Integer(d, this.sign_ & b.sign_)
    };
    e.math.Integer.prototype.or = function(b) {
        for (var c = Math.max(this.bits_.length, b.bits_.length), d = [], f = 0; f < c; f++) d[f] = this.getBits(f) | b.getBits(f);
        return new e.math.Integer(d, this.sign_ | b.sign_)
    };
    e.math.Integer.prototype.xor = function(b) {
        for (var c = Math.max(this.bits_.length, b.bits_.length), d = [], f = 0; f < c; f++) d[f] = this.getBits(f) ^ b.getBits(f);
        return new e.math.Integer(d, this.sign_ ^ b.sign_)
    };
    e.math.Integer.prototype.shiftLeft = function(b) {
        var c = b >> 5;
        b %= 32;
        for (var d = this.bits_.length + c + (0 < b ? 1 : 0), f = [], g = 0; g < d; g++) f[g] = 0 < b ? this.getBits(g - c) << b | this.getBits(g - c - 1) >>> 32 - b : this.getBits(g - c);
        return new e.math.Integer(f, this.sign_)
    };
    e.math.Integer.prototype.shiftRight = function(b) {
        var c = b >> 5;
        b %= 32;
        for (var d = this.bits_.length - c, f = [], g = 0; g < d; g++) f[g] = 0 < b ? this.getBits(g + c) >>> b | this.getBits(g + c + 1) << 32 - b : this.getBits(g + c);
        return new e.math.Integer(f, this.sign_)
    };
    /*

     Copyright 2016 Google Inc. All Rights Reserved.

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
    */
    var k = {
        FixedSizeInteger: {}
    };
    k.FixedSizeInteger.castToInt32 = function(b) {
        return e.math.Integer.fromNumber(b).toInt()
    };
    e.debug = {};
    e.debug.Error = function(b) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, e.debug.Error);
        else {
            var c = Error().stack;
            c && (this.stack = c)
        }
        b && (this.message = String(b));
        this.reportErrorToServer = !0
    };
    e.inherits(e.debug.Error, Error);
    e.debug.Error.prototype.name = "CustomError";
    e.dom = {};
    e.dom.NodeType = {
        ELEMENT: 1,
        ATTRIBUTE: 2,
        TEXT: 3,
        CDATA_SECTION: 4,
        ENTITY_REFERENCE: 5,
        ENTITY: 6,
        PROCESSING_INSTRUCTION: 7,
        COMMENT: 8,
        DOCUMENT: 9,
        DOCUMENT_TYPE: 10,
        DOCUMENT_FRAGMENT: 11,
        NOTATION: 12
    };
    e.asserts = {};
    e.asserts.ENABLE_ASSERTS = !0;
    e.asserts.AssertionError = function(b, c) {
        e.debug.Error.call(this, e.asserts.subs_(b, c));
        this.messagePattern = b
    };
    e.inherits(e.asserts.AssertionError, e.debug.Error);
    e.asserts.AssertionError.prototype.name = "AssertionError";
    e.asserts.DEFAULT_ERROR_HANDLER = function(b) {
        throw b;
    };
    e.asserts.errorHandler_ = e.asserts.DEFAULT_ERROR_HANDLER;
    e.asserts.subs_ = function(b, c) {
        b = b.split("%s");
        for (var d = "", f = b.length - 1, g = 0; g < f; g++) d += b[g] + (g < c.length ? c[g] : "%s");
        return d + b[f]
    };
    e.asserts.doAssertFailure_ = function(b, c, d, f) {
        var g = "Assertion failed";
        if (d) {
            g += ": " + d;
            var h = f
        } else b && (g += ": " + b, h = c);
        b = new e.asserts.AssertionError("" + g, h || []);
        e.asserts.errorHandler_(b)
    };
    e.asserts.setErrorHandler = function(b) {
        e.asserts.ENABLE_ASSERTS && (e.asserts.errorHandler_ = b)
    };
    e.asserts.assert = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !b && e.asserts.doAssertFailure_("", null, c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.fail = function(b, c) {
        e.asserts.ENABLE_ASSERTS && e.asserts.errorHandler_(new e.asserts.AssertionError("Failure" + (b ? ": " + b : ""), Array.prototype.slice.call(arguments, 1)))
    };
    e.asserts.assertNumber = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isNumber(b) && e.asserts.doAssertFailure_("Expected number but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertString = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isString(b) && e.asserts.doAssertFailure_("Expected string but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertFunction = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isFunction(b) && e.asserts.doAssertFailure_("Expected function but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertObject = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isObject(b) && e.asserts.doAssertFailure_("Expected object but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertArray = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isArray(b) && e.asserts.doAssertFailure_("Expected array but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertBoolean = function(b, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isBoolean(b) && e.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertElement = function(b, c, d) {
        !e.asserts.ENABLE_ASSERTS || e.isObject(b) && b.nodeType == e.dom.NodeType.ELEMENT || e.asserts.doAssertFailure_("Expected Element but got %s: %s.", [e.typeOf(b), b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertInstanceof = function(b, c, d, f) {
        !e.asserts.ENABLE_ASSERTS || b instanceof c || e.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [e.asserts.getType_(c), e.asserts.getType_(b)], d, Array.prototype.slice.call(arguments, 3));
        return b
    };
    e.asserts.assertFinite = function(b, c, d) {
        !e.asserts.ENABLE_ASSERTS || "number" == typeof b && isFinite(b) || e.asserts.doAssertFailure_("Expected %s to be a finite number but it is not.", [b], c, Array.prototype.slice.call(arguments, 2));
        return b
    };
    e.asserts.assertObjectPrototypeIsIntact = function() {
        for (var b in Object.prototype) e.asserts.fail(b + " should not be enumerable in Object.prototype.")
    };
    e.asserts.getType_ = function(b) {
        return b instanceof Function ? b.displayName || b.name || "unknown type name" : b instanceof Object ? b.constructor.displayName || b.constructor.name || Object.prototype.toString.call(b) : null === b ? "null" : typeof b
    };
    e.array = {};
    e.NATIVE_ARRAY_PROTOTYPES = null;
    e.array.ASSUME_NATIVE_FUNCTIONS = !1;
    e.array.peek = function(b) {
        return b[b.length - 1]
    };
    e.array.last = null;
    e.array.indexOf = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        return Array.prototype.indexOf.call(b, c, d)
    } : function(b, c, d) {
        d = null == d ? 0 : 0 > d ? Math.max(0, b.length + d) : d;
        if (e.isString(b)) return e.isString(c) && 1 == c.length ? b.indexOf(c, d) : -1;
        for (; d < b.length; d++)
            if (d in b && b[d] === c) return d;
        return -1
    };
    e.array.lastIndexOf = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        return Array.prototype.lastIndexOf.call(b, c, null == d ? b.length - 1 : d)
    } : function(b, c, d) {
        d = null == d ? b.length - 1 : d;
        0 > d && (d = Math.max(0, b.length + d));
        if (e.isString(b)) return e.isString(c) && 1 == c.length ? b.lastIndexOf(c, d) : -1;
        for (; 0 <= d; d--)
            if (d in b && b[d] === c) return d;
        return -1
    };
    e.array.forEach = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        Array.prototype.forEach.call(b, c, d)
    } : function(b, c, d) {
        for (var f = b.length, g = e.isString(b) ? b.split("") : b, h = 0; h < f; h++) h in g && c.call(d, g[h], h, b)
    };
    e.array.forEachRight = function(b, c, d) {
        var f = b.length,
            g = e.isString(b) ? b.split("") : b;
        for (--f; 0 <= f; --f) f in g && c.call(d, g[f], f, b)
    };
    e.array.filter = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        return Array.prototype.filter.call(b, c, d)
    } : function(b, c, d) {
        for (var f = b.length, g = [], h = 0, l = e.isString(b) ? b.split("") : b, m = 0; m < f; m++)
            if (m in l) {
                var n = l[m];
                c.call(d, n, m, b) && (g[h++] = n)
            } return g
    };
    e.array.map = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        return Array.prototype.map.call(b, c, d)
    } : function(b, c, d) {
        for (var f = b.length, g = Array(f), h = e.isString(b) ? b.split("") : b, l = 0; l < f; l++) l in h && (g[l] = c.call(d, h[l], l, b));
        return g
    };
    e.array.reduce = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(b, c, d, f) {
        e.asserts.assert(null != b.length);
        f && (c = e.bind(c, f));
        return Array.prototype.reduce.call(b, c, d)
    } : function(b, c, d, f) {
        var g = d;
        e.array.forEach(b, function(d, l) {
            g = c.call(f, g, d, l, b)
        });
        return g
    };
    e.array.reduceRight = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(b, c, d, f) {
        e.asserts.assert(null != b.length);
        e.asserts.assert(null != c);
        f && (c = e.bind(c, f));
        return Array.prototype.reduceRight.call(b, c, d)
    } : function(b, c, d, f) {
        var g = d;
        e.array.forEachRight(b, function(d, l) {
            g = c.call(f, g, d, l, b)
        });
        return g
    };
    e.array.some = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        return Array.prototype.some.call(b, c, d)
    } : function(b, c, d) {
        for (var f = b.length, g = e.isString(b) ? b.split("") : b, h = 0; h < f; h++)
            if (h in g && c.call(d, g[h], h, b)) return !0;
        return !1
    };
    e.array.every = e.TRUSTED_SITE && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(b, c, d) {
        e.asserts.assert(null != b.length);
        return Array.prototype.every.call(b, c, d)
    } : function(b, c, d) {
        for (var f = b.length, g = e.isString(b) ? b.split("") : b, h = 0; h < f; h++)
            if (h in g && !c.call(d, g[h], h, b)) return !1;
        return !0
    };
    e.array.count = function(b, c, d) {
        var f = 0;
        e.array.forEach(b, function(b, h, l) {
            c.call(d, b, h, l) && ++f
        }, d);
        return f
    };
    e.array.find = function(b, c, d) {
        c = e.array.findIndex(b, c, d);
        return 0 > c ? null : e.isString(b) ? b.charAt(c) : b[c]
    };
    e.array.findIndex = function(b, c, d) {
        for (var f = b.length, g = e.isString(b) ? b.split("") : b, h = 0; h < f; h++)
            if (h in g && c.call(d, g[h], h, b)) return h;
        return -1
    };
    e.array.findRight = function(b, c, d) {
        c = e.array.findIndexRight(b, c, d);
        return 0 > c ? null : e.isString(b) ? b.charAt(c) : b[c]
    };
    e.array.findIndexRight = function(b, c, d) {
        var f = b.length,
            g = e.isString(b) ? b.split("") : b;
        for (--f; 0 <= f; f--)
            if (f in g && c.call(d, g[f], f, b)) return f;
        return -1
    };
    e.array.contains = function(b, c) {
        return 0 <= e.array.indexOf(b, c)
    };
    e.array.isEmpty = function(b) {
        return 0 == b.length
    };
    e.array.clear = function(b) {
        if (!e.isArray(b))
            for (var c = b.length - 1; 0 <= c; c--) delete b[c];
        b.length = 0
    };
    e.array.insert = function(b, c) {
        e.array.contains(b, c) || b.push(c)
    };
    e.array.insertAt = function(b, c, d) {
        e.array.splice(b, d, 0, c)
    };
    e.array.insertArrayAt = function(b, c, d) {
        e.partial(e.array.splice, b, d, 0).apply(null, c)
    };
    e.array.insertBefore = function(b, c, d) {
        var f;
        2 == arguments.length || 0 > (f = e.array.indexOf(b, d)) ? b.push(c) : e.array.insertAt(b, c, f)
    };
    e.array.remove = function(b, c) {
        c = e.array.indexOf(b, c);
        var d;
        (d = 0 <= c) && e.array.removeAt(b, c);
        return d
    };
    e.array.removeLast = function(b, c) {
        c = e.array.lastIndexOf(b, c);
        return 0 <= c ? (e.array.removeAt(b, c), !0) : !1
    };
    e.array.removeAt = function(b, c) {
        e.asserts.assert(null != b.length);
        return 1 == Array.prototype.splice.call(b, c, 1).length
    };
    e.array.removeIf = function(b, c, d) {
        c = e.array.findIndex(b, c, d);
        return 0 <= c ? (e.array.removeAt(b, c), !0) : !1
    };
    e.array.removeAllIf = function(b, c, d) {
        var f = 0;
        e.array.forEachRight(b, function(g, h) {
            c.call(d, g, h, b) && e.array.removeAt(b, h) && f++
        });
        return f
    };
    e.array.concat = function(b) {
        return Array.prototype.concat.apply([], arguments)
    };
    e.array.join = function(b) {
        return Array.prototype.concat.apply([], arguments)
    };
    e.array.toArray = function(b) {
        var c = b.length;
        if (0 < c) {
            for (var d = Array(c), f = 0; f < c; f++) d[f] = b[f];
            return d
        }
        return []
    };
    e.array.clone = null;
    e.array.extend = function(b, c) {
        for (var d = 1; d < arguments.length; d++) {
            var f = arguments[d];
            if (e.isArrayLike(f)) {
                var g = b.length || 0,
                    h = f.length || 0;
                b.length = g + h;
                for (var l = 0; l < h; l++) b[g + l] = f[l]
            } else b.push(f)
        }
    };
    e.array.splice = function(b, c, d, f) {
        e.asserts.assert(null != b.length);
        return Array.prototype.splice.apply(b, e.array.slice(arguments, 1))
    };
    e.array.slice = function(b, c, d) {
        e.asserts.assert(null != b.length);
        return 2 >= arguments.length ? Array.prototype.slice.call(b, c) : Array.prototype.slice.call(b, c, d)
    };
    e.array.removeDuplicates = function(b, c, d) {
        function f(b) {
            return e.isObject(b) ? "o" + e.getUid(b) : (typeof b).charAt(0) + b
        }
        c = c || b;
        d = d || f;
        for (var g = {}, h = 0, l = 0; l < b.length;) {
            var m = b[l++],
                n = d(m);
            Object.prototype.hasOwnProperty.call(g, n) || (g[n] = !0, c[h++] = m)
        }
        c.length = h
    };
    e.array.binarySearch = function(b, c, d) {
        return e.array.binarySearch_(b, d || e.array.defaultCompare, !1, c)
    };
    e.array.binarySelect = function(b, c, d) {
        return e.array.binarySearch_(b, c, !0, void 0, d)
    };
    e.array.binarySearch_ = function(b, c, d, f, g) {
        for (var h = 0, l = b.length, m; h < l;) {
            var n = h + l >> 1;
            var p = d ? c.call(g, b[n], n, b) : c(f, b[n]);
            0 < p ? h = n + 1 : (l = n, m = !p)
        }
        return m ? h : ~h
    };
    e.array.sort = function(b, c) {
        b.sort(c || e.array.defaultCompare)
    };
    e.array.stableSort = function(b, c) {
        for (var d = Array(b.length), f = 0; f < b.length; f++) d[f] = {
            index: f,
            value: b[f]
        };
        var g = c || e.array.defaultCompare;
        e.array.sort(d, function(b, c) {
            return g(b.value, c.value) || b.index - c.index
        });
        for (f = 0; f < b.length; f++) b[f] = d[f].value
    };
    e.array.sortByKey = function(b, c, d) {
        var f = d || e.array.defaultCompare;
        e.array.sort(b, function(b, d) {
            return f(c(b), c(d))
        })
    };
    e.array.sortObjectsByKey = function(b, c, d) {
        e.array.sortByKey(b, function(b) {
            return b[c]
        }, d)
    };
    e.array.isSorted = function(b, c, d) {
        c = c || e.array.defaultCompare;
        for (var f = 1; f < b.length; f++) {
            var g = c(b[f - 1], b[f]);
            if (0 < g || 0 == g && d) return !1
        }
        return !0
    };
    e.array.equals = function(b, c, d) {
        if (!e.isArrayLike(b) || !e.isArrayLike(c) || b.length != c.length) return !1;
        var f = b.length;
        d = d || e.array.defaultCompareEquality;
        for (var g = 0; g < f; g++)
            if (!d(b[g], c[g])) return !1;
        return !0
    };
    e.array.compare3 = function(b, c, d) {
        d = d || e.array.defaultCompare;
        for (var f = Math.min(b.length, c.length), g = 0; g < f; g++) {
            var h = d(b[g], c[g]);
            if (0 != h) return h
        }
        return e.array.defaultCompare(b.length, c.length)
    };
    e.array.defaultCompare = function(b, c) {
        return b > c ? 1 : b < c ? -1 : 0
    };
    e.array.inverseDefaultCompare = function(b, c) {
        return -e.array.defaultCompare(b, c)
    };
    e.array.defaultCompareEquality = function(b, c) {
        return b === c
    };
    e.array.binaryInsert = function(b, c, d) {
        d = e.array.binarySearch(b, c, d);
        return 0 > d ? (e.array.insertAt(b, c, -(d + 1)), !0) : !1
    };
    e.array.binaryRemove = function(b, c, d) {
        c = e.array.binarySearch(b, c, d);
        return 0 <= c ? e.array.removeAt(b, c) : !1
    };
    e.array.bucket = function(b, c, d) {
        for (var f = {}, g = 0; g < b.length; g++) {
            var h = b[g],
                l = c.call(d, h, g, b);
            e.isDef(l) && (f[l] || (f[l] = [])).push(h)
        }
        return f
    };
    e.array.toObject = function(b, c, d) {
        var f = {};
        e.array.forEach(b, function(g, h) {
            f[c.call(d, g, h, b)] = g
        });
        return f
    };
    e.array.range = function(b, c, d) {
        var f = [],
            g = 0,
            h = b;
        d = d || 1;
        void 0 !== c && (g = b, h = c);
        if (0 > d * (h - g)) return [];
        if (0 < d)
            for (b = g; b < h; b += d) f.push(b);
        else
            for (b = g; b > h; b += d) f.push(b);
        return f
    };
    e.array.repeat = function(b, c) {
        for (var d = [], f = 0; f < c; f++) d[f] = b;
        return d
    };
    e.array.flatten = function(b) {
        for (var c = [], d = 0; d < arguments.length; d++) {
            var f = arguments[d];
            if (e.isArray(f))
                for (var g = 0; g < f.length; g += 8192) {
                    var h = e.array.slice(f, g, g + 8192);
                    h = e.array.flatten.apply(null, h);
                    for (var l = 0; l < h.length; l++) c.push(h[l])
                } else c.push(f)
        }
        return c
    };
    e.array.rotate = function(b, c) {
        e.asserts.assert(null != b.length);
        b.length && (c %= b.length, 0 < c ? Array.prototype.unshift.apply(b, b.splice(-c, c)) : 0 > c && Array.prototype.push.apply(b, b.splice(0, -c)));
        return b
    };
    e.array.moveItem = function(b, c, d) {
        e.asserts.assert(0 <= c && c < b.length);
        e.asserts.assert(0 <= d && d < b.length);
        c = Array.prototype.splice.call(b, c, 1);
        Array.prototype.splice.call(b, d, 0, c[0])
    };
    e.array.zip = function(b) {
        if (!arguments.length) return [];
        for (var c = [], d = arguments[0].length, f = 1; f < arguments.length; f++) arguments[f].length < d && (d = arguments[f].length);
        for (f = 0; f < d; f++) {
            for (var g = [], h = 0; h < arguments.length; h++) g.push(arguments[h][f]);
            c.push(g)
        }
        return c
    };
    e.array.shuffle = function(b, c) {
        c = c || Math.random;
        for (var d = b.length - 1; 0 < d; d--) {
            var f = Math.floor(c() * (d + 1)),
                g = b[d];
            b[d] = b[f];
            b[f] = g
        }
    };
    e.array.copyByIndex = function(b, c) {
        var d = [];
        e.array.forEach(c, function(c) {
            d.push(b[c])
        });
        return d
    };
    e.array.concatMap = function(b, c, d) {
        return e.array.concat.apply([], e.array.map(b, c, d))
    };
    e.debug.errorcontext = {};
    e.debug.errorcontext.addErrorContext = function(b, c, d) {
        b[e.debug.errorcontext.CONTEXT_KEY_] || (b[e.debug.errorcontext.CONTEXT_KEY_] = {});
        b[e.debug.errorcontext.CONTEXT_KEY_][c] = d
    };
    e.debug.errorcontext.getErrorContext = function(b) {
        return b[e.debug.errorcontext.CONTEXT_KEY_] || {}
    };
    e.debug.errorcontext.CONTEXT_KEY_ = "__closure__error__context__984382";
    e.string = {};
    e.string.DETECT_DOUBLE_ESCAPING = !1;
    e.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
    e.string.Unicode = {
        NBSP: "\u00a0"
    };
    e.string.startsWith = function(b, c) {
        return 0 == b.lastIndexOf(c, 0)
    };
    e.string.endsWith = function(b, c) {
        var d = b.length - c.length;
        return 0 <= d && b.indexOf(c, d) == d
    };
    e.string.caseInsensitiveStartsWith = function(b, c) {
        return 0 == e.string.caseInsensitiveCompare(c, b.substr(0, c.length))
    };
    e.string.caseInsensitiveEndsWith = function(b, c) {
        return 0 == e.string.caseInsensitiveCompare(c, b.substr(b.length - c.length, c.length))
    };
    e.string.caseInsensitiveEquals = function(b, c) {
        return b.toLowerCase() == c.toLowerCase()
    };
    e.string.subs = function(b, c) {
        for (var d = b.split("%s"), f = "", g = Array.prototype.slice.call(arguments, 1); g.length && 1 < d.length;) f += d.shift() + g.shift();
        return f + d.join("%s")
    };
    e.string.collapseWhitespace = function(b) {
        return b.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
    };
    e.string.isEmptyOrWhitespace = function(b) {
        return /^[\s\xa0]*$/.test(b)
    };
    e.string.isEmptyString = function(b) {
        return 0 == b.length
    };
    e.string.isEmpty = null;
    e.string.isEmptyOrWhitespaceSafe = function(b) {
        return e.string.isEmptyOrWhitespace(e.string.makeSafe(b))
    };
    e.string.isEmptySafe = null;
    e.string.isBreakingWhitespace = function(b) {
        return !/[^\t\n\r ]/.test(b)
    };
    e.string.isAlpha = function(b) {
        return !/[^a-zA-Z]/.test(b)
    };
    e.string.isNumeric = function(b) {
        return !/[^0-9]/.test(b)
    };
    e.string.isAlphaNumeric = function(b) {
        return !/[^a-zA-Z0-9]/.test(b)
    };
    e.string.isSpace = function(b) {
        return " " == b
    };
    e.string.isUnicodeChar = function(b) {
        return 1 == b.length && " " <= b && "~" >= b || "\u0080" <= b && "\ufffd" >= b
    };
    e.string.stripNewlines = function(b) {
        return b.replace(/(\r\n|\r|\n)+/g, " ")
    };
    e.string.canonicalizeNewlines = function(b) {
        return b.replace(/(\r\n|\r|\n)/g, "\n")
    };
    e.string.normalizeWhitespace = function(b) {
        return b.replace(/\xa0|\s/g, " ")
    };
    e.string.normalizeSpaces = function(b) {
        return b.replace(/\xa0|[ \t]+/g, " ")
    };
    e.string.collapseBreakingSpaces = function(b) {
        return b.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
    };
    e.string.trim = e.TRUSTED_SITE && String.prototype.trim ? function(b) {
        return b.trim()
    } : function(b) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(b)[1]
    };
    e.string.trimLeft = function(b) {
        return b.replace(/^[\s\xa0]+/, "")
    };
    e.string.trimRight = function(b) {
        return b.replace(/[\s\xa0]+$/, "")
    };
    e.string.caseInsensitiveCompare = function(b, c) {
        b = String(b).toLowerCase();
        c = String(c).toLowerCase();
        return b < c ? -1 : b == c ? 0 : 1
    };
    e.string.numberAwareCompare_ = function(b, c, d) {
        if (b == c) return 0;
        if (!b) return -1;
        if (!c) return 1;
        for (var f = b.toLowerCase().match(d), g = c.toLowerCase().match(d), h = Math.min(f.length, g.length), l = 0; l < h; l++) {
            d = f[l];
            var m = g[l];
            if (d != m) return b = parseInt(d, 10), !isNaN(b) && (c = parseInt(m, 10), !isNaN(c) && b - c) ? b - c : d < m ? -1 : 1
        }
        return f.length != g.length ? f.length - g.length : b < c ? -1 : 1
    };
    e.string.intAwareCompare = function(b, c) {
        return e.string.numberAwareCompare_(b, c, /\d+|\D+/g)
    };
    e.string.floatAwareCompare = function(b, c) {
        return e.string.numberAwareCompare_(b, c, /\d+|\.\d+|\D+/g)
    };
    e.string.numerateCompare = null;
    e.string.urlEncode = function(b) {
        return encodeURIComponent(String(b))
    };
    e.string.urlDecode = function(b) {
        return decodeURIComponent(b.replace(/\+/g, " "))
    };
    e.string.newLineToBr = function(b, c) {
        return b.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>")
    };
    e.string.htmlEscape = function(b, c) {
        if (c) b = b.replace(e.string.AMP_RE_, "&amp;").replace(e.string.LT_RE_, "&lt;").replace(e.string.GT_RE_, "&gt;").replace(e.string.QUOT_RE_, "&quot;").replace(e.string.SINGLE_QUOTE_RE_, "&#39;").replace(e.string.NULL_RE_, "&#0;"), e.string.DETECT_DOUBLE_ESCAPING && (b = b.replace(e.string.E_RE_, "&#101;"));
        else {
            if (!e.string.ALL_RE_.test(b)) return b; - 1 != b.indexOf("&") && (b = b.replace(e.string.AMP_RE_, "&amp;")); - 1 != b.indexOf("<") && (b = b.replace(e.string.LT_RE_, "&lt;")); - 1 != b.indexOf(">") &&
                (b = b.replace(e.string.GT_RE_, "&gt;")); - 1 != b.indexOf('"') && (b = b.replace(e.string.QUOT_RE_, "&quot;")); - 1 != b.indexOf("'") && (b = b.replace(e.string.SINGLE_QUOTE_RE_, "&#39;")); - 1 != b.indexOf("\x00") && (b = b.replace(e.string.NULL_RE_, "&#0;"));
            e.string.DETECT_DOUBLE_ESCAPING && -1 != b.indexOf("e") && (b = b.replace(e.string.E_RE_, "&#101;"))
        }
        return b
    };
    e.string.AMP_RE_ = /&/g;
    e.string.LT_RE_ = /</g;
    e.string.GT_RE_ = />/g;
    e.string.QUOT_RE_ = /"/g;
    e.string.SINGLE_QUOTE_RE_ = /'/g;
    e.string.NULL_RE_ = /\x00/g;
    e.string.E_RE_ = /e/g;
    e.string.ALL_RE_ = e.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
    e.string.unescapeEntities = function(b) {
        return e.string.contains(b, "&") ? !e.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in e.global ? e.string.unescapeEntitiesUsingDom_(b) : e.string.unescapePureXmlEntities_(b) : b
    };
    e.string.unescapeEntitiesWithDocument = function(b, c) {
        return e.string.contains(b, "&") ? e.string.unescapeEntitiesUsingDom_(b, c) : b
    };
    e.string.unescapeEntitiesUsingDom_ = function(b, c) {
        var d = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"'
        };
        var f = c ? c.createElement("div") : e.global.document.createElement("div");
        return b.replace(e.string.HTML_ENTITY_PATTERN_, function(b, c) {
            var g = d[b];
            if (g) return g;
            "#" == c.charAt(0) && (c = Number("0" + c.substr(1)), isNaN(c) || (g = String.fromCharCode(c)));
            g || (f.innerHTML = b + " ", g = f.firstChild.nodeValue.slice(0, -1));
            return d[b] = g
        })
    };
    e.string.unescapePureXmlEntities_ = function(b) {
        return b.replace(/&([^;]+);/g, function(b, d) {
            switch (d) {
                case "amp":
                    return "&";
                case "lt":
                    return "<";
                case "gt":
                    return ">";
                case "quot":
                    return '"';
                default:
                    return "#" != d.charAt(0) || (d = Number("0" + d.substr(1)), isNaN(d)) ? b : String.fromCharCode(d)
            }
        })
    };
    e.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
    e.string.whitespaceEscape = function(b, c) {
        return e.string.newLineToBr(b.replace(/  /g, " &#160;"), c)
    };
    e.string.preserveSpaces = function(b) {
        return b.replace(/(^|[\n ]) /g, "$1" + e.string.Unicode.NBSP)
    };
    e.string.stripQuotes = function(b, c) {
        for (var d = c.length, f = 0; f < d; f++) {
            var g = 1 == d ? c : c.charAt(f);
            if (b.charAt(0) == g && b.charAt(b.length - 1) == g) return b.substring(1, b.length - 1)
        }
        return b
    };
    e.string.truncate = function(b, c, d) {
        d && (b = e.string.unescapeEntities(b));
        b.length > c && (b = b.substring(0, c - 3) + "...");
        d && (b = e.string.htmlEscape(b));
        return b
    };
    e.string.truncateMiddle = function(b, c, d, f) {
        d && (b = e.string.unescapeEntities(b));
        if (f && b.length > c) {
            f > c && (f = c);
            var g = b.length - f;
            b = b.substring(0, c - f) + "..." + b.substring(g)
        } else b.length > c && (f = Math.floor(c / 2), g = b.length - f, b = b.substring(0, f + c % 2) + "..." + b.substring(g));
        d && (b = e.string.htmlEscape(b));
        return b
    };
    e.string.specialEscapeChars_ = {
        "\x00": "\\0",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\x0B": "\\x0B",
        '"': '\\"',
        "\\": "\\\\",
        "<": "<"
    };
    e.string.jsEscapeCache_ = {
        "'": "\\'"
    };
    e.string.quote = function(b) {
        b = String(b);
        for (var c = ['"'], d = 0; d < b.length; d++) {
            var f = b.charAt(d),
                g = f.charCodeAt(0);
            c[d + 1] = e.string.specialEscapeChars_[f] || (31 < g && 127 > g ? f : e.string.escapeChar(f))
        }
        c.push('"');
        return c.join("")
    };
    e.string.escapeString = function(b) {
        for (var c = [], d = 0; d < b.length; d++) c[d] = e.string.escapeChar(b.charAt(d));
        return c.join("")
    };
    e.string.escapeChar = function(b) {
        if (b in e.string.jsEscapeCache_) return e.string.jsEscapeCache_[b];
        if (b in e.string.specialEscapeChars_) return e.string.jsEscapeCache_[b] = e.string.specialEscapeChars_[b];
        var c = b.charCodeAt(0);
        if (31 < c && 127 > c) var d = b;
        else {
            if (256 > c) {
                if (d = "\\x", 16 > c || 256 < c) d += "0"
            } else d = "\\u", 4096 > c && (d += "0");
            d += c.toString(16).toUpperCase()
        }
        return e.string.jsEscapeCache_[b] = d
    };
    e.string.contains = function(b, c) {
        return -1 != b.indexOf(c)
    };
    e.string.caseInsensitiveContains = function(b, c) {
        return e.string.contains(b.toLowerCase(), c.toLowerCase())
    };
    e.string.countOf = function(b, c) {
        return b && c ? b.split(c).length - 1 : 0
    };
    e.string.removeAt = function(b, c, d) {
        var f = b;
        0 <= c && c < b.length && 0 < d && (f = b.substr(0, c) + b.substr(c + d, b.length - c - d));
        return f
    };
    e.string.remove = function(b, c) {
        return b.replace(c, "")
    };
    e.string.removeAll = function(b, c) {
        c = new RegExp(e.string.regExpEscape(c), "g");
        return b.replace(c, "")
    };
    e.string.replaceAll = function(b, c, d) {
        c = new RegExp(e.string.regExpEscape(c), "g");
        return b.replace(c, d.replace(/\$/g, "$$$$"))
    };
    e.string.regExpEscape = function(b) {
        return String(b).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
    };
    e.string.repeat = String.prototype.repeat ? function(b, c) {
        return b.repeat(c)
    } : function(b, c) {
        return Array(c + 1).join(b)
    };
    e.string.padNumber = function(b, c, d) {
        b = e.isDef(d) ? b.toFixed(d) : String(b);
        d = b.indexOf("."); - 1 == d && (d = b.length);
        return e.string.repeat("0", Math.max(0, c - d)) + b
    };
    e.string.makeSafe = function(b) {
        return null == b ? "" : String(b)
    };
    e.string.buildString = function(b) {
        return Array.prototype.join.call(arguments, "")
    };
    e.string.getRandomString = function() {
        return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ e.now()).toString(36)
    };
    e.string.compareVersions = function(b, c) {
        var d = 0;
        b = e.string.trim(String(b)).split(".");
        c = e.string.trim(String(c)).split(".");
        for (var f = Math.max(b.length, c.length), g = 0; 0 == d && g < f; g++) {
            var h = b[g] || "",
                l = c[g] || "";
            do {
                h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
                l = /(\d*)(\D*)(.*)/.exec(l) || ["", "", "", ""];
                if (0 == h[0].length && 0 == l[0].length) break;
                d = 0 == h[1].length ? 0 : parseInt(h[1], 10);
                var m = 0 == l[1].length ? 0 : parseInt(l[1], 10);
                d = e.string.compareElements_(d, m) || e.string.compareElements_(0 == h[2].length, 0 == l[2].length) ||
                    e.string.compareElements_(h[2], l[2]);
                h = h[3];
                l = l[3]
            } while (0 == d)
        }
        return d
    };
    e.string.compareElements_ = function(b, c) {
        return b < c ? -1 : b > c ? 1 : 0
    };
    e.string.hashCode = function(b) {
        for (var c = 0, d = 0; d < b.length; ++d) c = 31 * c + b.charCodeAt(d) >>> 0;
        return c
    };
    e.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
    e.string.createUniqueString = function() {
        return "goog_" + e.string.uniqueStringCounter_++
    };
    e.string.toNumber = function(b) {
        var c = Number(b);
        return 0 == c && e.string.isEmptyOrWhitespace(b) ? NaN : c
    };
    e.string.isLowerCamelCase = function(b) {
        return /^[a-z]+([A-Z][a-z]*)*$/.test(b)
    };
    e.string.isUpperCamelCase = function(b) {
        return /^([A-Z][a-z]*)+$/.test(b)
    };
    e.string.toCamelCase = function(b) {
        return String(b).replace(/\-([a-z])/g, function(b, d) {
            return d.toUpperCase()
        })
    };
    e.string.toSelectorCase = function(b) {
        return String(b).replace(/([A-Z])/g, "-$1").toLowerCase()
    };
    e.string.toTitleCase = function(b, c) {
        c = e.isString(c) ? e.string.regExpEscape(c) : "\\s";
        return b.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(b, c, g) {
            return c + g.toUpperCase()
        })
    };
    e.string.capitalize = function(b) {
        return String(b.charAt(0)).toUpperCase() + String(b.substr(1)).toLowerCase()
    };
    e.string.parseInt = function(b) {
        isFinite(b) && (b = String(b));
        return e.isString(b) ? /^\s*-?0x/i.test(b) ? parseInt(b, 16) : parseInt(b, 10) : NaN
    };
    e.string.splitLimit = function(b, c, d) {
        b = b.split(c);
        for (var f = []; 0 < d && b.length;) f.push(b.shift()), d--;
        b.length && f.push(b.join(c));
        return f
    };
    e.string.lastComponent = function(b, c) {
        if (c) "string" == typeof c && (c = [c]);
        else return b;
        for (var d = -1, f = 0; f < c.length; f++)
            if ("" != c[f]) {
                var g = b.lastIndexOf(c[f]);
                g > d && (d = g)
            } return -1 == d ? b : b.slice(d + 1)
    };
    e.string.editDistance = function(b, c) {
        var d = [],
            f = [];
        if (b == c) return 0;
        if (!b.length || !c.length) return Math.max(b.length, c.length);
        for (var g = 0; g < c.length + 1; g++) d[g] = g;
        for (g = 0; g < b.length; g++) {
            f[0] = g + 1;
            for (var h = 0; h < c.length; h++) f[h + 1] = Math.min(f[h] + 1, d[h + 1] + 1, d[h] + Number(b[g] != c[h]));
            for (h = 0; h < d.length; h++) d[h] = f[h]
        }
        return f[c.length]
    };
    e.labs = {};
    e.labs.userAgent = {};
    e.labs.userAgent.util = {};
    e.labs.userAgent.util.getNativeUserAgentString_ = function() {
        var b = e.labs.userAgent.util.getNavigator_();
        return b && (b = b.userAgent) ? b : ""
    };
    e.labs.userAgent.util.getNavigator_ = function() {
        return e.global.navigator
    };
    e.labs.userAgent.util.userAgent_ = e.labs.userAgent.util.getNativeUserAgentString_();
    e.labs.userAgent.util.setUserAgent = function(b) {
        e.labs.userAgent.util.userAgent_ = b || e.labs.userAgent.util.getNativeUserAgentString_()
    };
    e.labs.userAgent.util.getUserAgent = function() {
        return e.labs.userAgent.util.userAgent_
    };
    e.labs.userAgent.util.matchUserAgent = function(b) {
        var c = e.labs.userAgent.util.getUserAgent();
        return e.string.contains(c, b)
    };
    e.labs.userAgent.util.matchUserAgentIgnoreCase = function(b) {
        var c = e.labs.userAgent.util.getUserAgent();
        return e.string.caseInsensitiveContains(c, b)
    };
    e.labs.userAgent.util.extractVersionTuples = function(b) {
        for (var c = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, d = [], f; f = c.exec(b);) d.push([f[1], f[2], f[3] || void 0]);
        return d
    };
    e.object = {};
    e.object.is = function(b, c) {
        return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c
    };
    e.object.forEach = function(b, c, d) {
        for (var f in b) c.call(d, b[f], f, b)
    };
    e.object.filter = function(b, c, d) {
        var f = {},
            g;
        for (g in b) c.call(d, b[g], g, b) && (f[g] = b[g]);
        return f
    };
    e.object.map = function(b, c, d) {
        var f = {},
            g;
        for (g in b) f[g] = c.call(d, b[g], g, b);
        return f
    };
    e.object.some = function(b, c, d) {
        for (var f in b)
            if (c.call(d, b[f], f, b)) return !0;
        return !1
    };
    e.object.every = function(b, c, d) {
        for (var f in b)
            if (!c.call(d, b[f], f, b)) return !1;
        return !0
    };
    e.object.getCount = function(b) {
        var c = 0,
            d;
        for (d in b) c++;
        return c
    };
    e.object.getAnyKey = function(b) {
        for (var c in b) return c
    };
    e.object.getAnyValue = function(b) {
        for (var c in b) return b[c]
    };
    e.object.contains = function(b, c) {
        return e.object.containsValue(b, c)
    };
    e.object.getValues = function(b) {
        var c = [],
            d = 0,
            f;
        for (f in b) c[d++] = b[f];
        return c
    };
    e.object.getKeys = function(b) {
        var c = [],
            d = 0,
            f;
        for (f in b) c[d++] = f;
        return c
    };
    e.object.getValueByKeys = function(b, c) {
        var d = e.isArrayLike(c),
            f = d ? c : arguments;
        for (d = d ? 0 : 1; d < f.length; d++) {
            if (null == b) return;
            b = b[f[d]]
        }
        return b
    };
    e.object.containsKey = function(b, c) {
        return null !== b && c in b
    };
    e.object.containsValue = function(b, c) {
        for (var d in b)
            if (b[d] == c) return !0;
        return !1
    };
    e.object.findKey = function(b, c, d) {
        for (var f in b)
            if (c.call(d, b[f], f, b)) return f
    };
    e.object.findValue = function(b, c, d) {
        return (c = e.object.findKey(b, c, d)) && b[c]
    };
    e.object.isEmpty = function(b) {
        for (var c in b) return !1;
        return !0
    };
    e.object.clear = function(b) {
        for (var c in b) delete b[c]
    };
    e.object.remove = function(b, c) {
        var d;
        (d = c in b) && delete b[c];
        return d
    };
    e.object.add = function(b, c, d) {
        if (null !== b && c in b) throw Error('The object already contains the key "' + c + '"');
        e.object.set(b, c, d)
    };
    e.object.get = function(b, c, d) {
        return null !== b && c in b ? b[c] : d
    };
    e.object.set = function(b, c, d) {
        b[c] = d
    };
    e.object.setIfUndefined = function(b, c, d) {
        return c in b ? b[c] : b[c] = d
    };
    e.object.setWithReturnValueIfNotSet = function(b, c, d) {
        if (c in b) return b[c];
        d = d();
        return b[c] = d
    };
    e.object.equals = function(b, c) {
        for (var d in b)
            if (!(d in c) || b[d] !== c[d]) return !1;
        for (d in c)
            if (!(d in b)) return !1;
        return !0
    };
    e.object.clone = function(b) {
        var c = {},
            d;
        for (d in b) c[d] = b[d];
        return c
    };
    e.object.unsafeClone = function(b) {
        var c = e.typeOf(b);
        if ("object" == c || "array" == c) {
            if (e.isFunction(b.clone)) return b.clone();
            c = "array" == c ? [] : {};
            for (var d in b) c[d] = e.object.unsafeClone(b[d]);
            return c
        }
        return b
    };
    e.object.transpose = function(b) {
        var c = {},
            d;
        for (d in b) c[b[d]] = d;
        return c
    };
    e.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    e.object.extend = function(b, c) {
        for (var d, f, g = 1; g < arguments.length; g++) {
            f = arguments[g];
            for (d in f) b[d] = f[d];
            for (var h = 0; h < e.object.PROTOTYPE_FIELDS_.length; h++) d = e.object.PROTOTYPE_FIELDS_[h], Object.prototype.hasOwnProperty.call(f, d) && (b[d] = f[d])
        }
    };
    e.object.create = function(b) {
        var c = arguments.length;
        if (1 == c && e.isArray(arguments[0])) return e.object.create.apply(null, arguments[0]);
        if (c % 2) throw Error("Uneven number of arguments");
        for (var d = {}, f = 0; f < c; f += 2) d[arguments[f]] = arguments[f + 1];
        return d
    };
    e.object.createSet = function(b) {
        var c = arguments.length;
        if (1 == c && e.isArray(arguments[0])) return e.object.createSet.apply(null, arguments[0]);
        for (var d = {}, f = 0; f < c; f++) d[arguments[f]] = !0;
        return d
    };
    e.object.createImmutableView = function(b) {
        var c = b;
        Object.isFrozen && !Object.isFrozen(b) && (c = Object.create(b), Object.freeze(c));
        return c
    };
    e.object.isImmutableView = function(b) {
        return !!Object.isFrozen && Object.isFrozen(b)
    };
    e.object.getAllPropertyNames = function(b, c, d) {
        if (!b) return [];
        if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) return e.object.getKeys(b);
        for (var f = {}; b && (b !== Object.prototype || c) && (b !== Function.prototype || d);) {
            for (var g = Object.getOwnPropertyNames(b), h = 0; h < g.length; h++) f[g[h]] = !0;
            b = Object.getPrototypeOf(b)
        }
        return e.object.getKeys(f)
    };
    e.labs.userAgent.browser = {};
    e.labs.userAgent.browser.matchOpera_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Opera")
    };
    e.labs.userAgent.browser.matchIE_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Trident") || e.labs.userAgent.util.matchUserAgent("MSIE")
    };
    e.labs.userAgent.browser.matchEdge_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Edge")
    };
    e.labs.userAgent.browser.matchFirefox_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Firefox")
    };
    e.labs.userAgent.browser.matchSafari_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Safari") && !(e.labs.userAgent.browser.matchChrome_() || e.labs.userAgent.browser.matchCoast_() || e.labs.userAgent.browser.matchOpera_() || e.labs.userAgent.browser.matchEdge_() || e.labs.userAgent.browser.isSilk() || e.labs.userAgent.util.matchUserAgent("Android"))
    };
    e.labs.userAgent.browser.matchCoast_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Coast")
    };
    e.labs.userAgent.browser.matchIosWebview_ = function() {
        return (e.labs.userAgent.util.matchUserAgent("iPad") || e.labs.userAgent.util.matchUserAgent("iPhone")) && !e.labs.userAgent.browser.matchSafari_() && !e.labs.userAgent.browser.matchChrome_() && !e.labs.userAgent.browser.matchCoast_() && e.labs.userAgent.util.matchUserAgent("AppleWebKit")
    };
    e.labs.userAgent.browser.matchChrome_ = function() {
        return (e.labs.userAgent.util.matchUserAgent("Chrome") || e.labs.userAgent.util.matchUserAgent("CriOS")) && !e.labs.userAgent.browser.matchEdge_()
    };
    e.labs.userAgent.browser.matchAndroidBrowser_ = function() {
        return e.labs.userAgent.util.matchUserAgent("Android") && !(e.labs.userAgent.browser.matchChrome_() || e.labs.userAgent.browser.matchFirefox_() || e.labs.userAgent.browser.matchOpera_() || e.labs.userAgent.browser.isSilk())
    };
    e.labs.userAgent.browser.isOpera = null;
    e.labs.userAgent.browser.isIE = null;
    e.labs.userAgent.browser.isEdge = null;
    e.labs.userAgent.browser.isFirefox = null;
    e.labs.userAgent.browser.isSafari = null;
    e.labs.userAgent.browser.isCoast = null;
    e.labs.userAgent.browser.isIosWebview = null;
    e.labs.userAgent.browser.isChrome = null;
    e.labs.userAgent.browser.isAndroidBrowser = null;
    e.labs.userAgent.browser.isSilk = function() {
        return e.labs.userAgent.util.matchUserAgent("Silk")
    };
    e.labs.userAgent.browser.getVersion = function() {
        function b(b) {
            b = e.array.find(b, f);
            return d[b] || ""
        }
        var c = e.labs.userAgent.util.getUserAgent();
        if (e.labs.userAgent.browser.matchIE_()) return e.labs.userAgent.browser.getIEVersion_(c);
        c = e.labs.userAgent.util.extractVersionTuples(c);
        var d = {};
        e.array.forEach(c, function(b) {
            d[b[0]] = b[1]
        });
        var f = e.partial(e.object.containsKey, d);
        return e.labs.userAgent.browser.matchOpera_() ? b(["Version", "Opera"]) : e.labs.userAgent.browser.matchEdge_() ? b(["Edge"]) : e.labs.userAgent.browser.matchChrome_() ?
            b(["Chrome", "CriOS"]) : (c = c[2]) && c[1] || ""
    };
    e.labs.userAgent.browser.isVersionOrHigher = function(b) {
        return 0 <= e.string.compareVersions(e.labs.userAgent.browser.getVersion(), b)
    };
    e.labs.userAgent.browser.getIEVersion_ = function(b) {
        var c = /rv: *([\d\.]*)/.exec(b);
        if (c && c[1]) return c[1];
        c = "";
        var d = /MSIE +([\d\.]+)/.exec(b);
        if (d && d[1])
            if (b = /Trident\/(\d.\d)/.exec(b), "7.0" == d[1])
                if (b && b[1]) switch (b[1]) {
                    case "4.0":
                        c = "8.0";
                        break;
                    case "5.0":
                        c = "9.0";
                        break;
                    case "6.0":
                        c = "10.0";
                        break;
                    case "7.0":
                        c = "11.0"
                } else c = "7.0";
                else c = d[1];
        return c
    };
    e.labs.userAgent.engine = {};
    e.labs.userAgent.engine.isPresto = function() {
        return e.labs.userAgent.util.matchUserAgent("Presto")
    };
    e.labs.userAgent.engine.isTrident = function() {
        return e.labs.userAgent.util.matchUserAgent("Trident") || e.labs.userAgent.util.matchUserAgent("MSIE")
    };
    e.labs.userAgent.engine.isEdge = function() {
        return e.labs.userAgent.util.matchUserAgent("Edge")
    };
    e.labs.userAgent.engine.isWebKit = function() {
        return e.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !e.labs.userAgent.engine.isEdge()
    };
    e.labs.userAgent.engine.isGecko = function() {
        return e.labs.userAgent.util.matchUserAgent("Gecko") && !e.labs.userAgent.engine.isWebKit() && !e.labs.userAgent.engine.isTrident() && !e.labs.userAgent.engine.isEdge()
    };
    e.labs.userAgent.engine.getVersion = function() {
        var b = e.labs.userAgent.util.getUserAgent();
        if (b) {
            b = e.labs.userAgent.util.extractVersionTuples(b);
            var c = e.labs.userAgent.engine.getEngineTuple_(b);
            if (c) return "Gecko" == c[0] ? e.labs.userAgent.engine.getVersionForKey_(b, "Firefox") : c[1];
            b = b[0];
            var d;
            if (b && (d = b[2]) && (d = /Trident\/([^\s;]+)/.exec(d))) return d[1]
        }
        return ""
    };
    e.labs.userAgent.engine.getEngineTuple_ = function(b) {
        if (!e.labs.userAgent.engine.isEdge()) return b[1];
        for (var c = 0; c < b.length; c++) {
            var d = b[c];
            if ("Edge" == d[0]) return d
        }
    };
    e.labs.userAgent.engine.isVersionOrHigher = function(b) {
        return 0 <= e.string.compareVersions(e.labs.userAgent.engine.getVersion(), b)
    };
    e.labs.userAgent.engine.getVersionForKey_ = function(b, c) {
        return (b = e.array.find(b, function(b) {
            return c == b[0]
        })) && b[1] || ""
    };
    e.labs.userAgent.platform = {};
    e.labs.userAgent.platform.isAndroid = function() {
        return e.labs.userAgent.util.matchUserAgent("Android")
    };
    e.labs.userAgent.platform.isIpod = function() {
        return e.labs.userAgent.util.matchUserAgent("iPod")
    };
    e.labs.userAgent.platform.isIphone = function() {
        return e.labs.userAgent.util.matchUserAgent("iPhone") && !e.labs.userAgent.util.matchUserAgent("iPod") && !e.labs.userAgent.util.matchUserAgent("iPad")
    };
    e.labs.userAgent.platform.isIpad = function() {
        return e.labs.userAgent.util.matchUserAgent("iPad")
    };
    e.labs.userAgent.platform.isIos = function() {
        return e.labs.userAgent.platform.isIphone() || e.labs.userAgent.platform.isIpad() || e.labs.userAgent.platform.isIpod()
    };
    e.labs.userAgent.platform.isMacintosh = function() {
        return e.labs.userAgent.util.matchUserAgent("Macintosh")
    };
    e.labs.userAgent.platform.isLinux = function() {
        return e.labs.userAgent.util.matchUserAgent("Linux")
    };
    e.labs.userAgent.platform.isWindows = function() {
        return e.labs.userAgent.util.matchUserAgent("Windows")
    };
    e.labs.userAgent.platform.isChromeOS = function() {
        return e.labs.userAgent.util.matchUserAgent("CrOS")
    };
    e.labs.userAgent.platform.isChromecast = function() {
        return e.labs.userAgent.util.matchUserAgent("CrKey")
    };
    e.labs.userAgent.platform.isKaiOS = function() {
        return e.labs.userAgent.util.matchUserAgentIgnoreCase("KaiOS")
    };
    e.labs.userAgent.platform.getVersion = function() {
        var b = e.labs.userAgent.util.getUserAgent(),
            c = "";
        e.labs.userAgent.platform.isWindows() ? (c = /Windows (?:NT|Phone) ([0-9.]+)/, c = (b = c.exec(b)) ? b[1] : "0.0") : e.labs.userAgent.platform.isIos() ? (c = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, c = (b = c.exec(b)) && b[1].replace(/_/g, ".")) : e.labs.userAgent.platform.isMacintosh() ? (c = /Mac OS X ([0-9_.]+)/, c = (b = c.exec(b)) ? b[1].replace(/_/g, ".") : "10") : e.labs.userAgent.platform.isAndroid() ? (c = /Android\s+([^\);]+)(\)|;)/, c = (b = c.exec(b)) &&
            b[1]) : e.labs.userAgent.platform.isChromeOS() && (c = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, c = (b = c.exec(b)) && b[1]);
        return c || ""
    };
    e.labs.userAgent.platform.isVersionOrHigher = function(b) {
        return 0 <= e.string.compareVersions(e.labs.userAgent.platform.getVersion(), b)
    };
    e.reflect = {};
    e.reflect.object = function(b, c) {
        return c
    };
    e.reflect.objectProperty = function(b) {
        return b
    };
    e.reflect.sinkValue = function(b) {
        e.reflect.sinkValue[" "](b);
        return b
    };
    e.reflect.sinkValue[" "] = e.nullFunction;
    e.reflect.canAccessProperty = function(b, c) {
        try {
            return e.reflect.sinkValue(b[c]), !0
        } catch (d) {}
        return !1
    };
    e.reflect.cache = function(b, c, d, f) {
        f = f ? f(c) : c;
        return Object.prototype.hasOwnProperty.call(b, f) ? b[f] : b[f] = d(c)
    };
    e.userAgent = {};
    e.userAgent.ASSUME_IE = !1;
    e.userAgent.ASSUME_EDGE = !1;
    e.userAgent.ASSUME_GECKO = !1;
    e.userAgent.ASSUME_WEBKIT = !1;
    e.userAgent.ASSUME_MOBILE_WEBKIT = !1;
    e.userAgent.ASSUME_OPERA = !1;
    e.userAgent.ASSUME_ANY_VERSION = !1;
    e.userAgent.BROWSER_KNOWN_ = e.userAgent.ASSUME_IE || e.userAgent.ASSUME_EDGE || e.userAgent.ASSUME_GECKO || e.userAgent.ASSUME_MOBILE_WEBKIT || e.userAgent.ASSUME_WEBKIT || e.userAgent.ASSUME_OPERA;
    e.userAgent.getUserAgentString = function() {
        return e.labs.userAgent.util.getUserAgent()
    };
    e.userAgent.getNavigatorTyped = function() {
        return e.global.navigator || null
    };
    e.userAgent.getNavigator = function() {
        return e.userAgent.getNavigatorTyped()
    };
    e.userAgent.OPERA = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_OPERA : e.labs.userAgent.browser.matchOpera_();
    e.userAgent.IE = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_IE : e.labs.userAgent.browser.matchIE_();
    e.userAgent.EDGE = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_EDGE : e.labs.userAgent.engine.isEdge();
    e.userAgent.EDGE_OR_IE = e.userAgent.EDGE || e.userAgent.IE;
    e.userAgent.GECKO = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_GECKO : e.labs.userAgent.engine.isGecko();
    e.userAgent.WEBKIT = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_WEBKIT || e.userAgent.ASSUME_MOBILE_WEBKIT : e.labs.userAgent.engine.isWebKit();
    e.userAgent.isMobile_ = function() {
        return e.userAgent.WEBKIT && e.labs.userAgent.util.matchUserAgent("Mobile")
    };
    e.userAgent.MOBILE = e.userAgent.ASSUME_MOBILE_WEBKIT || e.userAgent.isMobile_();
    e.userAgent.SAFARI = null;
    e.userAgent.determinePlatform_ = function() {
        var b = e.userAgent.getNavigatorTyped();
        return b && b.platform || ""
    };
    e.userAgent.PLATFORM = e.userAgent.determinePlatform_();
    e.userAgent.ASSUME_MAC = !1;
    e.userAgent.ASSUME_WINDOWS = !1;
    e.userAgent.ASSUME_LINUX = !1;
    e.userAgent.ASSUME_X11 = !1;
    e.userAgent.ASSUME_ANDROID = !1;
    e.userAgent.ASSUME_IPHONE = !1;
    e.userAgent.ASSUME_IPAD = !1;
    e.userAgent.ASSUME_IPOD = !1;
    e.userAgent.ASSUME_KAIOS = !1;
    e.userAgent.PLATFORM_KNOWN_ = e.userAgent.ASSUME_MAC || e.userAgent.ASSUME_WINDOWS || e.userAgent.ASSUME_LINUX || e.userAgent.ASSUME_X11 || e.userAgent.ASSUME_ANDROID || e.userAgent.ASSUME_IPHONE || e.userAgent.ASSUME_IPAD || e.userAgent.ASSUME_IPOD;
    e.userAgent.MAC = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_MAC : e.labs.userAgent.platform.isMacintosh();
    e.userAgent.WINDOWS = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_WINDOWS : e.labs.userAgent.platform.isWindows();
    e.userAgent.isLegacyLinux_ = function() {
        return e.labs.userAgent.platform.isLinux() || e.labs.userAgent.platform.isChromeOS()
    };
    e.userAgent.LINUX = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_LINUX : e.userAgent.isLegacyLinux_();
    e.userAgent.isX11_ = function() {
        var b = e.userAgent.getNavigatorTyped();
        return !!b && e.string.contains(b.appVersion || "", "X11")
    };
    e.userAgent.X11 = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_X11 : e.userAgent.isX11_();
    e.userAgent.ANDROID = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_ANDROID : e.labs.userAgent.platform.isAndroid();
    e.userAgent.IPHONE = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPHONE : e.labs.userAgent.platform.isIphone();
    e.userAgent.IPAD = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPAD : e.labs.userAgent.platform.isIpad();
    e.userAgent.IPOD = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPOD : e.labs.userAgent.platform.isIpod();
    e.userAgent.IOS = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPHONE || e.userAgent.ASSUME_IPAD || e.userAgent.ASSUME_IPOD : e.labs.userAgent.platform.isIos();
    e.userAgent.KAIOS = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_KAIOS : e.labs.userAgent.platform.isKaiOS();
    e.userAgent.determineVersion_ = function() {
        var b = "",
            c = e.userAgent.getVersionRegexResult_();
        c && (b = c ? c[1] : "");
        return e.userAgent.IE && (c = e.userAgent.getDocumentMode_(), null != c && c > parseFloat(b)) ? String(c) : b
    };
    e.userAgent.getVersionRegexResult_ = function() {
        var b = e.userAgent.getUserAgentString();
        if (e.userAgent.GECKO) return /rv:([^\);]+)(\)|;)/.exec(b);
        if (e.userAgent.EDGE) return /Edge\/([\d\.]+)/.exec(b);
        if (e.userAgent.IE) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(b);
        if (e.userAgent.WEBKIT) return /WebKit\/(\S+)/.exec(b);
        if (e.userAgent.OPERA) return /(?:Version)[ \/]?(\S+)/.exec(b)
    };
    e.userAgent.getDocumentMode_ = function() {
        var b = e.global.document;
        return b ? b.documentMode : void 0
    };
    e.userAgent.VERSION = e.userAgent.determineVersion_();
    e.userAgent.compare = function(b, c) {
        return e.string.compareVersions(b, c)
    };
    e.userAgent.isVersionOrHigherCache_ = {};
    e.userAgent.isVersionOrHigher = function(b) {
        return e.userAgent.ASSUME_ANY_VERSION || e.reflect.cache(e.userAgent.isVersionOrHigherCache_, b, function() {
            return 0 <= e.string.compareVersions(e.userAgent.VERSION, b)
        })
    };
    e.userAgent.isVersion = null;
    e.userAgent.isDocumentModeOrHigher = function(b) {
        return Number(e.userAgent.DOCUMENT_MODE) >= b
    };
    e.userAgent.isDocumentMode = null;
    var t = e.userAgent,
        u;
    var v = e.global.document,
        w = e.userAgent.getDocumentMode_();
    u = v && e.userAgent.IE ? w || ("CSS1Compat" == v.compatMode ? parseInt(e.userAgent.VERSION, 10) : 5) : void 0;
    t.DOCUMENT_MODE = u;
    e.debug.LOGGING_ENABLED = !0;
    e.debug.FORCE_SLOPPY_STACKS = !1;
    e.debug.catchErrors = function(b, c, d) {
        d = d || e.global;
        var f = d.onerror,
            g = !!c;
        e.userAgent.WEBKIT && !e.userAgent.isVersionOrHigher("535.3") && (g = !g);
        d.onerror = function(c, d, m, n, p) {
            f && f(c, d, m, n, p);
            b({
                message: c,
                fileName: d,
                line: m,
                lineNumber: m,
                col: n,
                error: p
            });
            return g
        }
    };
    e.debug.expose = function(b, c) {
        if ("undefined" == typeof b) return "undefined";
        if (null == b) return "NULL";
        var d = [],
            f;
        for (f in b)
            if (c || !e.isFunction(b[f])) {
                var g = f + " = ";
                try {
                    g += b[f]
                } catch (h) {
                    g += "*** " + h + " ***"
                }
                d.push(g)
            } return d.join("\n")
    };
    e.debug.deepExpose = function(b, c) {
        function d(b, m) {
            var l = m + "  ";
            try {
                if (e.isDef(b))
                    if (e.isNull(b)) f.push("NULL");
                    else if (e.isString(b)) f.push('"' + b.replace(/\n/g, "\n" + m) + '"');
                else if (e.isFunction(b)) f.push(String(b).replace(/\n/g, "\n" + m));
                else if (e.isObject(b)) {
                    e.hasUid(b) || g.push(b);
                    var p = e.getUid(b);
                    if (h[p]) f.push("*** reference loop detected (id=" + p + ") ***");
                    else {
                        h[p] = !0;
                        f.push("{");
                        for (var q in b)
                            if (c || !e.isFunction(b[q])) f.push("\n"), f.push(l), f.push(q + " = "), d(b[q], l);
                        f.push("\n" + m + "}");
                        delete h[p]
                    }
                } else f.push(b);
                else f.push("undefined")
            } catch (r) {
                f.push("*** " + r + " ***")
            }
        }
        var f = [],
            g = [],
            h = {};
        d(b, "");
        for (b = 0; b < g.length; b++) e.removeUid(g[b]);
        return f.join("")
    };
    e.debug.exposeArray = function(b) {
        for (var c = [], d = 0; d < b.length; d++) e.isArray(b[d]) ? c.push(e.debug.exposeArray(b[d])) : c.push(b[d]);
        return "[ " + c.join(", ") + " ]"
    };
    e.debug.normalizeErrorObject = function(b) {
        var c = e.getObjectByName("window.location.href");
        if (e.isString(b)) return {
            message: b,
            name: "Unknown error",
            lineNumber: "Not available",
            fileName: c,
            stack: "Not available"
        };
        var d = !1;
        try {
            var f = b.lineNumber || b.line || "Not available"
        } catch (h) {
            f = "Not available", d = !0
        }
        try {
            var g = b.fileName || b.filename || b.sourceURL || e.global.$googDebugFname || c
        } catch (h) {
            g = "Not available", d = !0
        }
        return !d && b.lineNumber && b.fileName && b.stack && b.message && b.name ? b : {
            message: b.message || "Not available",
            name: b.name || "UnknownError",
            lineNumber: f,
            fileName: g,
            stack: b.stack || "Not available"
        }
    };
    e.debug.enhanceError = function(b, c) {
        b instanceof Error || (b = Error(b), Error.captureStackTrace && Error.captureStackTrace(b, e.debug.enhanceError));
        b.stack || (b.stack = e.debug.getStacktrace(e.debug.enhanceError));
        if (c) {
            for (var d = 0; b["message" + d];) ++d;
            b["message" + d] = String(c)
        }
        return b
    };
    e.debug.enhanceErrorWithContext = function(b, c) {
        b = e.debug.enhanceError(b);
        if (c)
            for (var d in c) e.debug.errorcontext.addErrorContext(b, d, c[d]);
        return b
    };
    e.debug.getStacktraceSimple = function(b) {
        if (!e.debug.FORCE_SLOPPY_STACKS) {
            var c = e.debug.getNativeStackTrace_(e.debug.getStacktraceSimple);
            if (c) return c
        }
        c = [];
        for (var d = arguments.callee.caller, f = 0; d && (!b || f < b);) {
            c.push(e.debug.getFunctionName(d));
            c.push("()\n");
            try {
                d = d.caller
            } catch (g) {
                c.push("[exception trying to get caller]\n");
                break
            }
            f++;
            if (f >= e.debug.MAX_STACK_DEPTH) {
                c.push("[...long stack...]");
                break
            }
        }
        b && f >= b ? c.push("[...reached max depth limit...]") : c.push("[end]");
        return c.join("")
    };
    e.debug.MAX_STACK_DEPTH = 50;
    e.debug.getNativeStackTrace_ = function(b) {
        var c = Error();
        if (Error.captureStackTrace) return Error.captureStackTrace(c, b), String(c.stack);
        try {
            throw c;
        } catch (d) {
            c = d
        }
        return (b = c.stack) ? String(b) : null
    };
    e.debug.getStacktrace = function(b) {
        var c;
        e.debug.FORCE_SLOPPY_STACKS || (c = e.debug.getNativeStackTrace_(b || e.debug.getStacktrace));
        c || (c = e.debug.getStacktraceHelper_(b || arguments.callee.caller, []));
        return c
    };
    e.debug.getStacktraceHelper_ = function(b, c) {
        var d = [];
        if (e.array.contains(c, b)) d.push("[...circular reference...]");
        else if (b && c.length < e.debug.MAX_STACK_DEPTH) {
            d.push(e.debug.getFunctionName(b) + "(");
            for (var f = b.arguments, g = 0; f && g < f.length; g++) {
                0 < g && d.push(", ");
                var h = f[g];
                switch (typeof h) {
                    case "object":
                        h = h ? "object" : "null";
                        break;
                    case "string":
                        break;
                    case "number":
                        h = String(h);
                        break;
                    case "boolean":
                        h = h ? "true" : "false";
                        break;
                    case "function":
                        h = (h = e.debug.getFunctionName(h)) ? h : "[fn]";
                        break;
                    default:
                        h = typeof h
                }
                40 <
                    h.length && (h = h.substr(0, 40) + "...");
                d.push(h)
            }
            c.push(b);
            d.push(")\n");
            try {
                d.push(e.debug.getStacktraceHelper_(b.caller, c))
            } catch (l) {
                d.push("[exception trying to get caller]\n")
            }
        } else b ? d.push("[...long stack...]") : d.push("[end]");
        return d.join("")
    };
    e.debug.setFunctionResolver = function(b) {
        e.debug.fnNameResolver_ = b
    };
    e.debug.getFunctionName = function(b) {
        if (e.debug.fnNameCache_[b]) return e.debug.fnNameCache_[b];
        if (e.debug.fnNameResolver_) {
            var c = e.debug.fnNameResolver_(b);
            if (c) return e.debug.fnNameCache_[b] = c
        }
        b = String(b);
        e.debug.fnNameCache_[b] || (c = /function\s+([^\(]+)/m.exec(b), e.debug.fnNameCache_[b] = c ? c[1] : "[Anonymous]");
        return e.debug.fnNameCache_[b]
    };
    e.debug.makeWhitespaceVisible = function(b) {
        return b.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
    };
    e.debug.runtimeType = function(b) {
        return b instanceof Function ? b.displayName || b.name || "unknown type name" : b instanceof Object ? b.constructor.displayName || b.constructor.name || Object.prototype.toString.call(b) : null === b ? "null" : typeof b
    };
    e.debug.fnNameCache_ = {};
    e.debug.freezeInternal_ = e.DEBUG && Object.freeze || function(b) {
        return b
    };
    e.debug.freeze = function(b) {
        return e.debug.freezeInternal_(b)
    };
    e.debug.LogRecord = function(b, c, d, f, g) {
        this.reset(b, c, d, f, g)
    };
    e.debug.LogRecord.prototype.sequenceNumber_ = 0;
    e.debug.LogRecord.prototype.exception_ = null;
    e.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
    e.debug.LogRecord.nextSequenceNumber_ = 0;
    e.debug.LogRecord.prototype.reset = function(b, c, d, f, g) {
        e.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof g ? g : e.debug.LogRecord.nextSequenceNumber_++);
        this.time_ = f || e.now();
        this.level_ = b;
        this.msg_ = c;
        this.loggerName_ = d;
        delete this.exception_
    };
    e.debug.LogRecord.prototype.getLoggerName = function() {
        return this.loggerName_
    };
    e.debug.LogRecord.prototype.getException = function() {
        return this.exception_
    };
    e.debug.LogRecord.prototype.setException = function(b) {
        this.exception_ = b
    };
    e.debug.LogRecord.prototype.setLoggerName = function(b) {
        this.loggerName_ = b
    };
    e.debug.LogRecord.prototype.getLevel = function() {
        return this.level_
    };
    e.debug.LogRecord.prototype.setLevel = function(b) {
        this.level_ = b
    };
    e.debug.LogRecord.prototype.getMessage = function() {
        return this.msg_
    };
    e.debug.LogRecord.prototype.setMessage = function(b) {
        this.msg_ = b
    };
    e.debug.LogRecord.prototype.getMillis = function() {
        return this.time_
    };
    e.debug.LogRecord.prototype.setMillis = function(b) {
        this.time_ = b
    };
    e.debug.LogRecord.prototype.getSequenceNumber = function() {
        return this.sequenceNumber_
    };
    e.debug.LogBuffer = function() {
        e.asserts.assert(e.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
        this.clear()
    };
    e.debug.LogBuffer.getInstance = function() {
        e.debug.LogBuffer.instance_ || (e.debug.LogBuffer.instance_ = new e.debug.LogBuffer);
        return e.debug.LogBuffer.instance_
    };
    e.debug.LogBuffer.CAPACITY = 0;
    e.debug.LogBuffer.prototype.addRecord = function(b, c, d) {
        var f = (this.curIndex_ + 1) % e.debug.LogBuffer.CAPACITY;
        this.curIndex_ = f;
        if (this.isFull_) return f = this.buffer_[f], f.reset(b, c, d), f;
        this.isFull_ = f == e.debug.LogBuffer.CAPACITY - 1;
        return this.buffer_[f] = new e.debug.LogRecord(b, c, d)
    };
    e.debug.LogBuffer.isBufferingEnabled = function() {
        return 0 < e.debug.LogBuffer.CAPACITY
    };
    e.debug.LogBuffer.prototype.clear = function() {
        this.buffer_ = Array(e.debug.LogBuffer.CAPACITY);
        this.curIndex_ = -1;
        this.isFull_ = !1
    };
    e.debug.LogBuffer.prototype.forEachRecord = function(b) {
        var c = this.buffer_;
        if (c[0]) {
            var d = this.curIndex_,
                f = this.isFull_ ? d : -1;
            do f = (f + 1) % e.debug.LogBuffer.CAPACITY, b(c[f]); while (f != d)
        }
    };
    e.debug.Logger = function(b) {
        this.name_ = b;
        this.handlers_ = this.children_ = this.level_ = this.parent_ = null
    };
    e.debug.Logger.ROOT_LOGGER_NAME = "";
    e.debug.Logger.ENABLE_HIERARCHY = !0;
    e.debug.Logger.ENABLE_PROFILER_LOGGING = !1;
    e.debug.Logger.ENABLE_HIERARCHY || (e.debug.Logger.rootHandlers_ = []);
    e.debug.Logger.Level = function(b, c) {
        this.name = b;
        this.value = c
    };
    e.debug.Logger.Level.prototype.toString = function() {
        return this.name
    };
    e.debug.Logger.Level.OFF = new e.debug.Logger.Level("OFF", Infinity);
    e.debug.Logger.Level.SHOUT = new e.debug.Logger.Level("SHOUT", 1200);
    e.debug.Logger.Level.SEVERE = new e.debug.Logger.Level("SEVERE", 1E3);
    e.debug.Logger.Level.WARNING = new e.debug.Logger.Level("WARNING", 900);
    e.debug.Logger.Level.INFO = new e.debug.Logger.Level("INFO", 800);
    e.debug.Logger.Level.CONFIG = new e.debug.Logger.Level("CONFIG", 700);
    e.debug.Logger.Level.FINE = new e.debug.Logger.Level("FINE", 500);
    e.debug.Logger.Level.FINER = new e.debug.Logger.Level("FINER", 400);
    e.debug.Logger.Level.FINEST = new e.debug.Logger.Level("FINEST", 300);
    e.debug.Logger.Level.ALL = new e.debug.Logger.Level("ALL", 0);
    e.debug.Logger.Level.PREDEFINED_LEVELS = [e.debug.Logger.Level.OFF, e.debug.Logger.Level.SHOUT, e.debug.Logger.Level.SEVERE, e.debug.Logger.Level.WARNING, e.debug.Logger.Level.INFO, e.debug.Logger.Level.CONFIG, e.debug.Logger.Level.FINE, e.debug.Logger.Level.FINER, e.debug.Logger.Level.FINEST, e.debug.Logger.Level.ALL];
    e.debug.Logger.Level.predefinedLevelsCache_ = null;
    e.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
        e.debug.Logger.Level.predefinedLevelsCache_ = {};
        for (var b = 0, c; c = e.debug.Logger.Level.PREDEFINED_LEVELS[b]; b++) e.debug.Logger.Level.predefinedLevelsCache_[c.value] = c, e.debug.Logger.Level.predefinedLevelsCache_[c.name] = c
    };
    e.debug.Logger.Level.getPredefinedLevel = function(b) {
        e.debug.Logger.Level.predefinedLevelsCache_ || e.debug.Logger.Level.createPredefinedLevelsCache_();
        return e.debug.Logger.Level.predefinedLevelsCache_[b] || null
    };
    e.debug.Logger.Level.getPredefinedLevelByValue = function(b) {
        e.debug.Logger.Level.predefinedLevelsCache_ || e.debug.Logger.Level.createPredefinedLevelsCache_();
        if (b in e.debug.Logger.Level.predefinedLevelsCache_) return e.debug.Logger.Level.predefinedLevelsCache_[b];
        for (var c = 0; c < e.debug.Logger.Level.PREDEFINED_LEVELS.length; ++c) {
            var d = e.debug.Logger.Level.PREDEFINED_LEVELS[c];
            if (d.value <= b) return d
        }
        return null
    };
    e.debug.Logger.getLogger = function(b) {
        return e.debug.LogManager.getLogger(b)
    };
    e.debug.Logger.logToProfilers = function(b) {
        if (e.debug.Logger.ENABLE_PROFILER_LOGGING) {
            var c = e.global.msWriteProfilerMark;
            c ? c(b) : (c = e.global.console) && c.timeStamp && c.timeStamp(b)
        }
    };
    e.debug.Logger.prototype.getName = function() {
        return this.name_
    };
    e.debug.Logger.prototype.addHandler = function(b) {
        e.debug.LOGGING_ENABLED && (e.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(b)) : (e.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), e.debug.Logger.rootHandlers_.push(b)))
    };
    e.debug.Logger.prototype.removeHandler = function(b) {
        if (e.debug.LOGGING_ENABLED) {
            var c = e.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : e.debug.Logger.rootHandlers_;
            return !!c && e.array.remove(c, b)
        }
        return !1
    };
    e.debug.Logger.prototype.getParent = function() {
        return this.parent_
    };
    e.debug.Logger.prototype.getChildren = function() {
        this.children_ || (this.children_ = {});
        return this.children_
    };
    e.debug.Logger.prototype.setLevel = function(b) {
        e.debug.LOGGING_ENABLED && (e.debug.Logger.ENABLE_HIERARCHY ? this.level_ = b : (e.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), e.debug.Logger.rootLevel_ = b))
    };
    e.debug.Logger.prototype.getLevel = function() {
        return e.debug.LOGGING_ENABLED ? this.level_ : e.debug.Logger.Level.OFF
    };
    e.debug.Logger.prototype.getEffectiveLevel = function() {
        if (!e.debug.LOGGING_ENABLED) return e.debug.Logger.Level.OFF;
        if (!e.debug.Logger.ENABLE_HIERARCHY) return e.debug.Logger.rootLevel_;
        if (this.level_) return this.level_;
        if (this.parent_) return this.parent_.getEffectiveLevel();
        e.asserts.fail("Root logger has no level set.");
        return null
    };
    e.debug.Logger.prototype.isLoggable = function(b) {
        return e.debug.LOGGING_ENABLED && b.value >= this.getEffectiveLevel().value
    };
    e.debug.Logger.prototype.log = function(b, c, d) {
        e.debug.LOGGING_ENABLED && this.isLoggable(b) && (e.isFunction(c) && (c = c()), this.doLogRecord_(this.getLogRecord(b, c, d)))
    };
    e.debug.Logger.prototype.getLogRecord = function(b, c, d) {
        b = e.debug.LogBuffer.isBufferingEnabled() ? e.debug.LogBuffer.getInstance().addRecord(b, c, this.name_) : new e.debug.LogRecord(b, String(c), this.name_);
        d && b.setException(d);
        return b
    };
    e.debug.Logger.prototype.shout = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.SHOUT, b, c)
    };
    e.debug.Logger.prototype.severe = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.SEVERE, b, c)
    };
    e.debug.Logger.prototype.warning = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.WARNING, b, c)
    };
    e.debug.Logger.prototype.info = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.INFO, b, c)
    };
    e.debug.Logger.prototype.config = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.CONFIG, b, c)
    };
    e.debug.Logger.prototype.fine = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.FINE, b, c)
    };
    e.debug.Logger.prototype.finer = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.FINER, b, c)
    };
    e.debug.Logger.prototype.finest = function(b, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.FINEST, b, c)
    };
    e.debug.Logger.prototype.logRecord = function(b) {
        e.debug.LOGGING_ENABLED && this.isLoggable(b.getLevel()) && this.doLogRecord_(b)
    };
    e.debug.Logger.prototype.doLogRecord_ = function(b) {
        e.debug.Logger.ENABLE_PROFILER_LOGGING && e.debug.Logger.logToProfilers("log:" + b.getMessage());
        if (e.debug.Logger.ENABLE_HIERARCHY)
            for (var c = this; c;) c.callPublish_(b), c = c.getParent();
        else {
            c = 0;
            for (var d; d = e.debug.Logger.rootHandlers_[c++];) d(b)
        }
    };
    e.debug.Logger.prototype.callPublish_ = function(b) {
        if (this.handlers_)
            for (var c = 0, d; d = this.handlers_[c]; c++) d(b)
    };
    e.debug.Logger.prototype.setParent_ = function(b) {
        this.parent_ = b
    };
    e.debug.Logger.prototype.addChild_ = function(b, c) {
        this.getChildren()[b] = c
    };
    e.debug.LogManager = {};
    e.debug.LogManager.loggers_ = {};
    e.debug.LogManager.rootLogger_ = null;
    e.debug.LogManager.initialize = function() {
        e.debug.LogManager.rootLogger_ || (e.debug.LogManager.rootLogger_ = new e.debug.Logger(e.debug.Logger.ROOT_LOGGER_NAME), e.debug.LogManager.loggers_[e.debug.Logger.ROOT_LOGGER_NAME] = e.debug.LogManager.rootLogger_, e.debug.LogManager.rootLogger_.setLevel(e.debug.Logger.Level.CONFIG))
    };
    e.debug.LogManager.getLoggers = function() {
        return e.debug.LogManager.loggers_
    };
    e.debug.LogManager.getRoot = function() {
        e.debug.LogManager.initialize();
        return e.debug.LogManager.rootLogger_
    };
    e.debug.LogManager.getLogger = function(b) {
        e.debug.LogManager.initialize();
        return e.debug.LogManager.loggers_[b] || e.debug.LogManager.createLogger_(b)
    };
    e.debug.LogManager.createFunctionForCatchErrors = function(b) {
        return function(c) {
            (b || e.debug.LogManager.getRoot()).severe("Error: " + c.message + " (" + c.fileName + " @ Line: " + c.line + ")")
        }
    };
    e.debug.LogManager.createLogger_ = function(b) {
        var c = new e.debug.Logger(b);
        if (e.debug.Logger.ENABLE_HIERARCHY) {
            var d = b.lastIndexOf("."),
                f = b.substr(0, d);
            d = b.substr(d + 1);
            f = e.debug.LogManager.getLogger(f);
            f.addChild_(d, c);
            c.setParent_(f)
        }
        return e.debug.LogManager.loggers_[b] = c
    };
    e.debug.RelativeTimeProvider = function() {
        this.relativeTimeStart_ = e.now()
    };
    e.debug.RelativeTimeProvider.defaultInstance_ = null;
    e.debug.RelativeTimeProvider.prototype.set = function(b) {
        this.relativeTimeStart_ = b
    };
    e.debug.RelativeTimeProvider.prototype.reset = function() {
        this.set(e.now())
    };
    e.debug.RelativeTimeProvider.prototype.get = function() {
        return this.relativeTimeStart_
    };
    e.debug.RelativeTimeProvider.getDefaultInstance = function() {
        e.debug.RelativeTimeProvider.defaultInstance_ || (e.debug.RelativeTimeProvider.defaultInstance_ = new e.debug.RelativeTimeProvider);
        return e.debug.RelativeTimeProvider.defaultInstance_
    };
    e.dom.HtmlElement = function() {};
    e.dom.TagName = function(b) {
        this.tagName_ = b
    };
    e.dom.TagName.prototype.toString = function() {
        return this.tagName_
    };
    e.dom.TagName.A = new e.dom.TagName("A");
    e.dom.TagName.ABBR = new e.dom.TagName("ABBR");
    e.dom.TagName.ACRONYM = new e.dom.TagName("ACRONYM");
    e.dom.TagName.ADDRESS = new e.dom.TagName("ADDRESS");
    e.dom.TagName.APPLET = new e.dom.TagName("APPLET");
    e.dom.TagName.AREA = new e.dom.TagName("AREA");
    e.dom.TagName.ARTICLE = new e.dom.TagName("ARTICLE");
    e.dom.TagName.ASIDE = new e.dom.TagName("ASIDE");
    e.dom.TagName.AUDIO = new e.dom.TagName("AUDIO");
    e.dom.TagName.B = new e.dom.TagName("B");
    e.dom.TagName.BASE = new e.dom.TagName("BASE");
    e.dom.TagName.BASEFONT = new e.dom.TagName("BASEFONT");
    e.dom.TagName.BDI = new e.dom.TagName("BDI");
    e.dom.TagName.BDO = new e.dom.TagName("BDO");
    e.dom.TagName.BIG = new e.dom.TagName("BIG");
    e.dom.TagName.BLOCKQUOTE = new e.dom.TagName("BLOCKQUOTE");
    e.dom.TagName.BODY = new e.dom.TagName("BODY");
    e.dom.TagName.BR = new e.dom.TagName("BR");
    e.dom.TagName.BUTTON = new e.dom.TagName("BUTTON");
    e.dom.TagName.CANVAS = new e.dom.TagName("CANVAS");
    e.dom.TagName.CAPTION = new e.dom.TagName("CAPTION");
    e.dom.TagName.CENTER = new e.dom.TagName("CENTER");
    e.dom.TagName.CITE = new e.dom.TagName("CITE");
    e.dom.TagName.CODE = new e.dom.TagName("CODE");
    e.dom.TagName.COL = new e.dom.TagName("COL");
    e.dom.TagName.COLGROUP = new e.dom.TagName("COLGROUP");
    e.dom.TagName.COMMAND = new e.dom.TagName("COMMAND");
    e.dom.TagName.DATA = new e.dom.TagName("DATA");
    e.dom.TagName.DATALIST = new e.dom.TagName("DATALIST");
    e.dom.TagName.DD = new e.dom.TagName("DD");
    e.dom.TagName.DEL = new e.dom.TagName("DEL");
    e.dom.TagName.DETAILS = new e.dom.TagName("DETAILS");
    e.dom.TagName.DFN = new e.dom.TagName("DFN");
    e.dom.TagName.DIALOG = new e.dom.TagName("DIALOG");
    e.dom.TagName.DIR = new e.dom.TagName("DIR");
    e.dom.TagName.DIV = new e.dom.TagName("DIV");
    e.dom.TagName.DL = new e.dom.TagName("DL");
    e.dom.TagName.DT = new e.dom.TagName("DT");
    e.dom.TagName.EM = new e.dom.TagName("EM");
    e.dom.TagName.EMBED = new e.dom.TagName("EMBED");
    e.dom.TagName.FIELDSET = new e.dom.TagName("FIELDSET");
    e.dom.TagName.FIGCAPTION = new e.dom.TagName("FIGCAPTION");
    e.dom.TagName.FIGURE = new e.dom.TagName("FIGURE");
    e.dom.TagName.FONT = new e.dom.TagName("FONT");
    e.dom.TagName.FOOTER = new e.dom.TagName("FOOTER");
    e.dom.TagName.FORM = new e.dom.TagName("FORM");
    e.dom.TagName.FRAME = new e.dom.TagName("FRAME");
    e.dom.TagName.FRAMESET = new e.dom.TagName("FRAMESET");
    e.dom.TagName.H1 = new e.dom.TagName("H1");
    e.dom.TagName.H2 = new e.dom.TagName("H2");
    e.dom.TagName.H3 = new e.dom.TagName("H3");
    e.dom.TagName.H4 = new e.dom.TagName("H4");
    e.dom.TagName.H5 = new e.dom.TagName("H5");
    e.dom.TagName.H6 = new e.dom.TagName("H6");
    e.dom.TagName.HEAD = new e.dom.TagName("HEAD");
    e.dom.TagName.HEADER = new e.dom.TagName("HEADER");
    e.dom.TagName.HGROUP = new e.dom.TagName("HGROUP");
    e.dom.TagName.HR = new e.dom.TagName("HR");
    e.dom.TagName.HTML = new e.dom.TagName("HTML");
    e.dom.TagName.I = new e.dom.TagName("I");
    e.dom.TagName.IFRAME = new e.dom.TagName("IFRAME");
    e.dom.TagName.IMG = new e.dom.TagName("IMG");
    e.dom.TagName.INPUT = new e.dom.TagName("INPUT");
    e.dom.TagName.INS = new e.dom.TagName("INS");
    e.dom.TagName.ISINDEX = new e.dom.TagName("ISINDEX");
    e.dom.TagName.KBD = new e.dom.TagName("KBD");
    e.dom.TagName.KEYGEN = new e.dom.TagName("KEYGEN");
    e.dom.TagName.LABEL = new e.dom.TagName("LABEL");
    e.dom.TagName.LEGEND = new e.dom.TagName("LEGEND");
    e.dom.TagName.LI = new e.dom.TagName("LI");
    e.dom.TagName.LINK = new e.dom.TagName("LINK");
    e.dom.TagName.MAIN = new e.dom.TagName("MAIN");
    e.dom.TagName.MAP = new e.dom.TagName("MAP");
    e.dom.TagName.MARK = new e.dom.TagName("MARK");
    e.dom.TagName.MATH = new e.dom.TagName("MATH");
    e.dom.TagName.MENU = new e.dom.TagName("MENU");
    e.dom.TagName.MENUITEM = new e.dom.TagName("MENUITEM");
    e.dom.TagName.META = new e.dom.TagName("META");
    e.dom.TagName.METER = new e.dom.TagName("METER");
    e.dom.TagName.NAV = new e.dom.TagName("NAV");
    e.dom.TagName.NOFRAMES = new e.dom.TagName("NOFRAMES");
    e.dom.TagName.NOSCRIPT = new e.dom.TagName("NOSCRIPT");
    e.dom.TagName.OBJECT = new e.dom.TagName("OBJECT");
    e.dom.TagName.OL = new e.dom.TagName("OL");
    e.dom.TagName.OPTGROUP = new e.dom.TagName("OPTGROUP");
    e.dom.TagName.OPTION = new e.dom.TagName("OPTION");
    e.dom.TagName.OUTPUT = new e.dom.TagName("OUTPUT");
    e.dom.TagName.P = new e.dom.TagName("P");
    e.dom.TagName.PARAM = new e.dom.TagName("PARAM");
    e.dom.TagName.PICTURE = new e.dom.TagName("PICTURE");
    e.dom.TagName.PRE = new e.dom.TagName("PRE");
    e.dom.TagName.PROGRESS = new e.dom.TagName("PROGRESS");
    e.dom.TagName.Q = new e.dom.TagName("Q");
    e.dom.TagName.RP = new e.dom.TagName("RP");
    e.dom.TagName.RT = new e.dom.TagName("RT");
    e.dom.TagName.RTC = new e.dom.TagName("RTC");
    e.dom.TagName.RUBY = new e.dom.TagName("RUBY");
    e.dom.TagName.S = new e.dom.TagName("S");
    e.dom.TagName.SAMP = new e.dom.TagName("SAMP");
    e.dom.TagName.SCRIPT = new e.dom.TagName("SCRIPT");
    e.dom.TagName.SECTION = new e.dom.TagName("SECTION");
    e.dom.TagName.SELECT = new e.dom.TagName("SELECT");
    e.dom.TagName.SMALL = new e.dom.TagName("SMALL");
    e.dom.TagName.SOURCE = new e.dom.TagName("SOURCE");
    e.dom.TagName.SPAN = new e.dom.TagName("SPAN");
    e.dom.TagName.STRIKE = new e.dom.TagName("STRIKE");
    e.dom.TagName.STRONG = new e.dom.TagName("STRONG");
    e.dom.TagName.STYLE = new e.dom.TagName("STYLE");
    e.dom.TagName.SUB = new e.dom.TagName("SUB");
    e.dom.TagName.SUMMARY = new e.dom.TagName("SUMMARY");
    e.dom.TagName.SUP = new e.dom.TagName("SUP");
    e.dom.TagName.SVG = new e.dom.TagName("SVG");
    e.dom.TagName.TABLE = new e.dom.TagName("TABLE");
    e.dom.TagName.TBODY = new e.dom.TagName("TBODY");
    e.dom.TagName.TD = new e.dom.TagName("TD");
    e.dom.TagName.TEMPLATE = new e.dom.TagName("TEMPLATE");
    e.dom.TagName.TEXTAREA = new e.dom.TagName("TEXTAREA");
    e.dom.TagName.TFOOT = new e.dom.TagName("TFOOT");
    e.dom.TagName.TH = new e.dom.TagName("TH");
    e.dom.TagName.THEAD = new e.dom.TagName("THEAD");
    e.dom.TagName.TIME = new e.dom.TagName("TIME");
    e.dom.TagName.TITLE = new e.dom.TagName("TITLE");
    e.dom.TagName.TR = new e.dom.TagName("TR");
    e.dom.TagName.TRACK = new e.dom.TagName("TRACK");
    e.dom.TagName.TT = new e.dom.TagName("TT");
    e.dom.TagName.U = new e.dom.TagName("U");
    e.dom.TagName.UL = new e.dom.TagName("UL");
    e.dom.TagName.VAR = new e.dom.TagName("VAR");
    e.dom.TagName.VIDEO = new e.dom.TagName("VIDEO");
    e.dom.TagName.WBR = new e.dom.TagName("WBR");
    e.dom.tags = {};
    e.dom.tags.VOID_TAGS_ = {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        command: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    };
    e.dom.tags.isVoidTag = function(b) {
        return !0 === e.dom.tags.VOID_TAGS_[b]
    };
    e.string.TypedString = function() {};
    e.string.Const = function(b, c) {
        this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = b === e.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ && c || "";
        this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = e.string.Const.TYPE_MARKER_
    };
    e.string.Const.prototype.implementsGoogStringTypedString = !0;
    e.string.Const.prototype.getTypedStringValue = function() {
        return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_
    };
    e.string.Const.prototype.toString = function() {
        return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}"
    };
    e.string.Const.unwrap = function(b) {
        if (b instanceof e.string.Const && b.constructor === e.string.Const && b.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === e.string.Const.TYPE_MARKER_) return b.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
        e.asserts.fail("expected object of type Const, got '" + b + "'");
        return "type_error:Const"
    };
    e.string.Const.from = function(b) {
        return new e.string.Const(e.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_, b)
    };
    e.string.Const.TYPE_MARKER_ = {};
    e.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ = {};
    e.string.Const.EMPTY = e.string.Const.from("");
    e.html = {};
    e.html.SafeScript = function() {
        this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
        this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeScript.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeScript.fromConstant = function(b) {
        b = e.string.Const.unwrap(b);
        return 0 === b.length ? e.html.SafeScript.EMPTY : e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeScript.fromConstantAndArgs = function(b, c) {
        for (var d = [], f = 1; f < arguments.length; f++) d.push(e.html.SafeScript.stringify_(arguments[f]));
        return e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("(" + e.string.Const.unwrap(b) + ")(" + d.join(", ") + ");")
    };
    e.html.SafeScript.prototype.getTypedStringValue = function() {
        return this.privateDoNotAccessOrElseSafeScriptWrappedValue_
    };
    e.DEBUG && (e.html.SafeScript.prototype.toString = function() {
        return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}"
    });
    e.html.SafeScript.unwrap = function(b) {
        if (b instanceof e.html.SafeScript && b.constructor === e.html.SafeScript && b.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return b.privateDoNotAccessOrElseSafeScriptWrappedValue_;
        e.asserts.fail("expected object of type SafeScript, got '" + b + "' of type " + e.typeOf(b));
        return "type_error:SafeScript"
    };
    e.html.SafeScript.stringify_ = function(b) {
        return JSON.stringify(b).replace(/</g, "\\x3c")
    };
    e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(b) {
        return (new e.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(b)
    };
    e.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(b) {
        this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = b;
        return this
    };
    e.html.SafeScript.EMPTY = e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
    e.fs = {};
    e.fs.url = {};
    e.fs.url.createObjectUrl = function(b) {
        return e.fs.url.getUrlObject_().createObjectURL(b)
    };
    e.fs.url.revokeObjectUrl = function(b) {
        e.fs.url.getUrlObject_().revokeObjectURL(b)
    };
    e.fs.url.getUrlObject_ = function() {
        var b = e.fs.url.findUrlObject_();
        if (null != b) return b;
        throw Error("This browser doesn't seem to support blob URLs");
    };
    e.fs.url.findUrlObject_ = function() {
        return e.isDef(e.global.URL) && e.isDef(e.global.URL.createObjectURL) ? e.global.URL : e.isDef(e.global.webkitURL) && e.isDef(e.global.webkitURL.createObjectURL) ? e.global.webkitURL : e.isDef(e.global.createObjectURL) ? e.global : null
    };
    e.fs.url.browserSupportsObjectUrls = function() {
        return null != e.fs.url.findUrlObject_()
    };
    e.i18n = {};
    e.i18n.bidi = {};
    e.i18n.bidi.FORCE_RTL = !1;
    e.i18n.bidi.IS_RTL = e.i18n.bidi.FORCE_RTL || ("ar" == e.LOCALE.substring(0, 2).toLowerCase() || "fa" == e.LOCALE.substring(0, 2).toLowerCase() || "he" == e.LOCALE.substring(0, 2).toLowerCase() || "iw" == e.LOCALE.substring(0, 2).toLowerCase() || "ps" == e.LOCALE.substring(0, 2).toLowerCase() || "sd" == e.LOCALE.substring(0, 2).toLowerCase() || "ug" == e.LOCALE.substring(0, 2).toLowerCase() || "ur" == e.LOCALE.substring(0, 2).toLowerCase() || "yi" == e.LOCALE.substring(0, 2).toLowerCase()) && (2 == e.LOCALE.length || "-" == e.LOCALE.substring(2, 3) || "_" ==
        e.LOCALE.substring(2, 3)) || 3 <= e.LOCALE.length && "ckb" == e.LOCALE.substring(0, 3).toLowerCase() && (3 == e.LOCALE.length || "-" == e.LOCALE.substring(3, 4) || "_" == e.LOCALE.substring(3, 4)) || 7 <= e.LOCALE.length && "ff" == e.LOCALE.substring(0, 2).toLowerCase() && ("-" == e.LOCALE.substring(2, 3) || "_" == e.LOCALE.substring(2, 3)) && ("adlm" == e.LOCALE.substring(3, 7).toLowerCase() || "arab" == e.LOCALE.substring(3, 7).toLowerCase());
    e.i18n.bidi.Format = {
        LRE: "\u202a",
        RLE: "\u202b",
        PDF: "\u202c",
        LRM: "\u200e",
        RLM: "\u200f"
    };
    e.i18n.bidi.Dir = {
        LTR: 1,
        RTL: -1,
        NEUTRAL: 0
    };
    e.i18n.bidi.RIGHT = "right";
    e.i18n.bidi.LEFT = "left";
    e.i18n.bidi.I18N_RIGHT = e.i18n.bidi.IS_RTL ? e.i18n.bidi.LEFT : e.i18n.bidi.RIGHT;
    e.i18n.bidi.I18N_LEFT = e.i18n.bidi.IS_RTL ? e.i18n.bidi.RIGHT : e.i18n.bidi.LEFT;
    e.i18n.bidi.toDir = function(b, c) {
        return "number" == typeof b ? 0 < b ? e.i18n.bidi.Dir.LTR : 0 > b ? e.i18n.bidi.Dir.RTL : c ? null : e.i18n.bidi.Dir.NEUTRAL : null == b ? null : b ? e.i18n.bidi.Dir.RTL : e.i18n.bidi.Dir.LTR
    };
    e.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
    e.i18n.bidi.rtlChars_ = "\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc";
    e.i18n.bidi.lowSurrogate_ = "\udc00-\udfff";
    e.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
    e.i18n.bidi.stripHtmlIfNeeded_ = function(b, c) {
        return c ? b.replace(e.i18n.bidi.htmlSkipReg_, "") : b
    };
    e.i18n.bidi.rtlCharReg_ = new RegExp("[" + e.i18n.bidi.rtlChars_ + "]");
    e.i18n.bidi.ltrCharReg_ = new RegExp("[" + e.i18n.bidi.ltrChars_ + "]");
    e.i18n.bidi.hasAnyRtl = function(b, c) {
        return e.i18n.bidi.rtlCharReg_.test(e.i18n.bidi.stripHtmlIfNeeded_(b, c))
    };
    e.i18n.bidi.hasRtlChar = null;
    e.i18n.bidi.hasAnyLtr = function(b, c) {
        return e.i18n.bidi.ltrCharReg_.test(e.i18n.bidi.stripHtmlIfNeeded_(b, c))
    };
    e.i18n.bidi.ltrRe_ = new RegExp("^[" + e.i18n.bidi.ltrChars_ + "]");
    e.i18n.bidi.rtlRe_ = new RegExp("^[" + e.i18n.bidi.rtlChars_ + "]");
    e.i18n.bidi.isRtlChar = function(b) {
        return e.i18n.bidi.rtlRe_.test(b)
    };
    e.i18n.bidi.isLtrChar = function(b) {
        return e.i18n.bidi.ltrRe_.test(b)
    };
    e.i18n.bidi.isNeutralChar = function(b) {
        return !e.i18n.bidi.isLtrChar(b) && !e.i18n.bidi.isRtlChar(b)
    };
    e.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + e.i18n.bidi.rtlChars_ + "]*[" + e.i18n.bidi.ltrChars_ + "]");
    e.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + e.i18n.bidi.ltrChars_ + "]*[" + e.i18n.bidi.rtlChars_ + "]");
    e.i18n.bidi.startsWithRtl = function(b, c) {
        return e.i18n.bidi.rtlDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(b, c))
    };
    e.i18n.bidi.isRtlText = null;
    e.i18n.bidi.startsWithLtr = function(b, c) {
        return e.i18n.bidi.ltrDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(b, c))
    };
    e.i18n.bidi.isLtrText = null;
    e.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
    e.i18n.bidi.isNeutralText = function(b, c) {
        b = e.i18n.bidi.stripHtmlIfNeeded_(b, c);
        return e.i18n.bidi.isRequiredLtrRe_.test(b) || !e.i18n.bidi.hasAnyLtr(b) && !e.i18n.bidi.hasAnyRtl(b)
    };
    e.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + e.i18n.bidi.ltrChars_ + "](" + e.i18n.bidi.lowSurrogate_ + ")?[^" + e.i18n.bidi.rtlChars_ + "]*$");
    e.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + e.i18n.bidi.rtlChars_ + "](" + e.i18n.bidi.lowSurrogate_ + ")?[^" + e.i18n.bidi.ltrChars_ + "]*$");
    e.i18n.bidi.endsWithLtr = function(b, c) {
        return e.i18n.bidi.ltrExitDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(b, c))
    };
    e.i18n.bidi.isLtrExitText = null;
    e.i18n.bidi.endsWithRtl = function(b, c) {
        return e.i18n.bidi.rtlExitDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(b, c))
    };
    e.i18n.bidi.isRtlExitText = null;
    e.i18n.bidi.rtlLocalesRe_ = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
    e.i18n.bidi.isRtlLanguage = function(b) {
        return e.i18n.bidi.rtlLocalesRe_.test(b)
    };
    e.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
    e.i18n.bidi.guardBracketInText = function(b, c) {
        c = (void 0 === c ? e.i18n.bidi.hasAnyRtl(b) : c) ? e.i18n.bidi.Format.RLM : e.i18n.bidi.Format.LRM;
        return b.replace(e.i18n.bidi.bracketGuardTextRe_, c + "$&" + c)
    };
    e.i18n.bidi.enforceRtlInHtml = function(b) {
        return "<" == b.charAt(0) ? b.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + b + "</span>"
    };
    e.i18n.bidi.enforceRtlInText = function(b) {
        return e.i18n.bidi.Format.RLE + b + e.i18n.bidi.Format.PDF
    };
    e.i18n.bidi.enforceLtrInHtml = function(b) {
        return "<" == b.charAt(0) ? b.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + b + "</span>"
    };
    e.i18n.bidi.enforceLtrInText = function(b) {
        return e.i18n.bidi.Format.LRE + b + e.i18n.bidi.Format.PDF
    };
    e.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
    e.i18n.bidi.leftRe_ = /left/gi;
    e.i18n.bidi.rightRe_ = /right/gi;
    e.i18n.bidi.tempRe_ = /%%%%/g;
    e.i18n.bidi.mirrorCSS = function(b) {
        return b.replace(e.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(e.i18n.bidi.leftRe_, "%%%%").replace(e.i18n.bidi.rightRe_, e.i18n.bidi.LEFT).replace(e.i18n.bidi.tempRe_, e.i18n.bidi.RIGHT)
    };
    e.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
    e.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
    e.i18n.bidi.normalizeHebrewQuote = function(b) {
        return b.replace(e.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(e.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
    };
    e.i18n.bidi.wordSeparatorRe_ = /\s+/;
    e.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
    e.i18n.bidi.rtlDetectionThreshold_ = .4;
    e.i18n.bidi.estimateDirection = function(b, c) {
        var d = 0,
            f = 0,
            g = !1;
        b = e.i18n.bidi.stripHtmlIfNeeded_(b, c).split(e.i18n.bidi.wordSeparatorRe_);
        for (c = 0; c < b.length; c++) {
            var h = b[c];
            e.i18n.bidi.startsWithRtl(h) ? (d++, f++) : e.i18n.bidi.isRequiredLtrRe_.test(h) ? g = !0 : e.i18n.bidi.hasAnyLtr(h) ? f++ : e.i18n.bidi.hasNumeralsRe_.test(h) && (g = !0)
        }
        return 0 == f ? g ? e.i18n.bidi.Dir.LTR : e.i18n.bidi.Dir.NEUTRAL : d / f > e.i18n.bidi.rtlDetectionThreshold_ ? e.i18n.bidi.Dir.RTL : e.i18n.bidi.Dir.LTR
    };
    e.i18n.bidi.detectRtlDirectionality = function(b, c) {
        return e.i18n.bidi.estimateDirection(b, c) == e.i18n.bidi.Dir.RTL
    };
    e.i18n.bidi.setElementDirAndAlign = function(b, c) {
        b && (c = e.i18n.bidi.toDir(c)) && (b.style.textAlign = c == e.i18n.bidi.Dir.RTL ? e.i18n.bidi.RIGHT : e.i18n.bidi.LEFT, b.dir = c == e.i18n.bidi.Dir.RTL ? "rtl" : "ltr")
    };
    e.i18n.bidi.setElementDirByTextDirectionality = function(b, c) {
        switch (e.i18n.bidi.estimateDirection(c)) {
            case e.i18n.bidi.Dir.LTR:
                b.dir = "ltr";
                break;
            case e.i18n.bidi.Dir.RTL:
                b.dir = "rtl";
                break;
            default:
                b.removeAttribute("dir")
        }
    };
    e.i18n.bidi.DirectionalString = function() {};
    e.html.TrustedResourceUrl = function() {
        this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
        this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
    e.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
        return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
    };
    e.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
    e.html.TrustedResourceUrl.prototype.getDirection = function() {
        return e.i18n.bidi.Dir.LTR
    };
    e.html.TrustedResourceUrl.prototype.cloneWithParams = function(b) {
        var c = e.html.TrustedResourceUrl.unwrap(this);
        if (/#/.test(c)) throw Error("Found a hash in url (" + c + "), appending not supported.");
        var d = /\?/.test(c) ? "&" : "?",
            f;
        for (f in b)
            for (var g = e.isArray(b[f]) ? b[f] : [b[f]], h = 0; h < g.length; h++) null != g[h] && (c += d + encodeURIComponent(f) + "=" + encodeURIComponent(String(g[h])), d = "&");
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.DEBUG && (e.html.TrustedResourceUrl.prototype.toString = function() {
        return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}"
    });
    e.html.TrustedResourceUrl.unwrap = function(b) {
        if (b instanceof e.html.TrustedResourceUrl && b.constructor === e.html.TrustedResourceUrl && b.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return b.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
        e.asserts.fail("expected object of type TrustedResourceUrl, got '" + b + "' of type " + e.typeOf(b));
        return "type_error:TrustedResourceUrl"
    };
    e.html.TrustedResourceUrl.format = function(b, c) {
        var d = e.string.Const.unwrap(b);
        if (!e.html.TrustedResourceUrl.BASE_URL_.test(d)) throw Error("Invalid TrustedResourceUrl format: " + d);
        b = d.replace(e.html.TrustedResourceUrl.FORMAT_MARKER_, function(b, g) {
            if (!Object.prototype.hasOwnProperty.call(c, g)) throw Error('Found marker, "' + g + '", in format string, "' + d + '", but no valid label mapping found in args: ' + JSON.stringify(c));
            b = c[g];
            return b instanceof e.string.Const ? e.string.Const.unwrap(b) : encodeURIComponent(String(b))
        });
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
    e.html.TrustedResourceUrl.BASE_URL_ = /^(?:https:)?\/\/[0-9a-z.:[\]-]+\/|^\/[^\/\\]|^about:blank#/i;
    e.html.TrustedResourceUrl.formatWithParams = function(b, c, d) {
        return e.html.TrustedResourceUrl.format(b, c).cloneWithParams(d)
    };
    e.html.TrustedResourceUrl.fromConstant = function(b) {
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(e.string.Const.unwrap(b))
    };
    e.html.TrustedResourceUrl.fromConstants = function(b) {
        for (var c = "", d = 0; d < b.length; d++) c += e.string.Const.unwrap(b[d]);
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(b) {
        var c = new e.html.TrustedResourceUrl;
        c.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = b;
        return c
    };
    e.html.SafeUrl = function() {
        this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
        this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
    e.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeUrl.prototype.getTypedStringValue = function() {
        return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
    };
    e.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
    e.html.SafeUrl.prototype.getDirection = function() {
        return e.i18n.bidi.Dir.LTR
    };
    e.DEBUG && (e.html.SafeUrl.prototype.toString = function() {
        return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
    });
    e.html.SafeUrl.unwrap = function(b) {
        if (b instanceof e.html.SafeUrl && b.constructor === e.html.SafeUrl && b.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return b.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
        e.asserts.fail("expected object of type SafeUrl, got '" + b + "' of type " + e.typeOf(b));
        return "type_error:SafeUrl"
    };
    e.html.SafeUrl.fromConstant = function(b) {
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e.string.Const.unwrap(b))
    };
    e.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:audio\/(?:3gpp2|3gpp|aac|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-wav|wav|webm)|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|text\/csv|video\/(?:mpeg|mp4|ogg|webm|quicktime))$/i;
    e.html.SafeUrl.fromBlob = function(b) {
        b = e.html.SAFE_MIME_TYPE_PATTERN_.test(b.type) ? e.fs.url.createObjectUrl(b) : e.html.SafeUrl.INNOCUOUS_STRING;
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.DATA_URL_PATTERN_ = /^data:([^;,]*);base64,[a-z0-9+\/]+=*$/i;
    e.html.SafeUrl.fromDataUrl = function(b) {
        b = b.replace(/(%0A|%0D)/g, "");
        var c = b.match(e.html.DATA_URL_PATTERN_);
        c = c && e.html.SAFE_MIME_TYPE_PATTERN_.test(c[1]);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c ? b : e.html.SafeUrl.INNOCUOUS_STRING)
    };
    e.html.SafeUrl.fromTelUrl = function(b) {
        e.string.caseInsensitiveStartsWith(b, "tel:") || (b = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SIP_URL_PATTERN_ = /^sip[s]?:[+a-z0-9_.!$%&'*\/=^`{|}~-]+@([a-z0-9-]+\.)+[a-z0-9]{2,63}$/i;
    e.html.SafeUrl.fromSipUrl = function(b) {
        e.html.SIP_URL_PATTERN_.test(decodeURIComponent(b)) || (b = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeUrl.fromSmsUrl = function(b) {
        e.string.caseInsensitiveStartsWith(b, "sms:") && e.html.SafeUrl.isSmsUrlBodyValid_(b) || (b = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeUrl.isSmsUrlBodyValid_ = function(b) {
        var c = b.indexOf("#");
        0 < c && (b = b.substring(0, c));
        c = b.match(/[?&]body=/gi);
        if (!c) return !0;
        if (1 < c.length) return !1;
        b = b.match(/[?&]body=([^&]*)/)[1];
        if (!b) return !0;
        try {
            decodeURIComponent(b)
        } catch (d) {
            return !1
        }
        return /^(?:[a-z0-9\-_.~]|%[0-9a-f]{2})+$/i.test(b)
    };
    e.html.SafeUrl.fromTrustedResourceUrl = function(b) {
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e.html.TrustedResourceUrl.unwrap(b))
    };
    e.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
    e.html.SafeUrl.SAFE_URL_PATTERN = e.html.SAFE_URL_PATTERN_;
    e.html.SafeUrl.sanitize = function(b) {
        if (b instanceof e.html.SafeUrl) return b;
        b = "object" == typeof b && b.implementsGoogStringTypedString ? b.getTypedStringValue() : String(b);
        e.html.SAFE_URL_PATTERN_.test(b) || (b = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeUrl.sanitizeAssertUnchanged = function(b) {
        if (b instanceof e.html.SafeUrl) return b;
        b = "object" == typeof b && b.implementsGoogStringTypedString ? b.getTypedStringValue() : String(b);
        e.asserts.assert(e.html.SAFE_URL_PATTERN_.test(b)) || (b = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(b) {
        var c = new e.html.SafeUrl;
        c.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = b;
        return c
    };
    e.html.SafeUrl.ABOUT_BLANK = e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
    e.html.SafeStyle = function() {
        this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
        this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeStyle.fromConstant = function(b) {
        b = e.string.Const.unwrap(b);
        if (0 === b.length) return e.html.SafeStyle.EMPTY;
        e.html.SafeStyle.checkStyle_(b);
        e.asserts.assert(e.string.endsWith(b, ";"), "Last character of style string is not ';': " + b);
        e.asserts.assert(e.string.contains(b, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + b);
        return e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeStyle.checkStyle_ = function(b) {
        e.asserts.assert(!/[<>]/.test(b), "Forbidden characters in style string: " + b)
    };
    e.html.SafeStyle.prototype.getTypedStringValue = function() {
        return this.privateDoNotAccessOrElseSafeStyleWrappedValue_
    };
    e.DEBUG && (e.html.SafeStyle.prototype.toString = function() {
        return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}"
    });
    e.html.SafeStyle.unwrap = function(b) {
        if (b instanceof e.html.SafeStyle && b.constructor === e.html.SafeStyle && b.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return b.privateDoNotAccessOrElseSafeStyleWrappedValue_;
        e.asserts.fail("expected object of type SafeStyle, got '" + b + "' of type " + e.typeOf(b));
        return "type_error:SafeStyle"
    };
    e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(b) {
        return (new e.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(b)
    };
    e.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(b) {
        this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = b;
        return this
    };
    e.html.SafeStyle.EMPTY = e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
    e.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
    e.html.SafeStyle.create = function(b) {
        var c = "",
            d;
        for (d in b) {
            if (!/^[-_a-zA-Z0-9]+$/.test(d)) throw Error("Name allows only [-_a-zA-Z0-9], got: " + d);
            var f = b[d];
            null != f && (f = e.isArray(f) ? e.array.map(f, e.html.SafeStyle.sanitizePropertyValue_).join(" ") : e.html.SafeStyle.sanitizePropertyValue_(f), c += d + ":" + f + ";")
        }
        if (!c) return e.html.SafeStyle.EMPTY;
        e.html.SafeStyle.checkStyle_(c);
        return e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.SafeStyle.sanitizePropertyValue_ = function(b) {
        if (b instanceof e.html.SafeUrl) return 'url("' + e.html.SafeUrl.unwrap(b).replace(/</g, "%3c").replace(/[\\"]/g, "\\$&") + '")';
        b = b instanceof e.string.Const ? e.string.Const.unwrap(b) : e.html.SafeStyle.sanitizePropertyValueString_(String(b));
        e.asserts.assert(!/[{;}]/.test(b), "Value does not allow [{;}].");
        return b
    };
    e.html.SafeStyle.sanitizePropertyValueString_ = function(b) {
        var c = b.replace(e.html.SafeStyle.FUNCTIONS_RE_, "$1").replace(e.html.SafeStyle.FUNCTIONS_RE_, "$1").replace(e.html.SafeStyle.URL_RE_, "url");
        if (e.html.SafeStyle.VALUE_RE_.test(c)) {
            if (e.html.SafeStyle.COMMENT_RE_.test(b)) return e.asserts.fail("String value disallows comments, got: " + b), e.html.SafeStyle.INNOCUOUS_STRING;
            if (!e.html.SafeStyle.hasBalancedQuotes_(b)) return e.asserts.fail("String value requires balanced quotes, got: " + b), e.html.SafeStyle.INNOCUOUS_STRING;
            if (!e.html.SafeStyle.hasBalancedSquareBrackets_(b)) return e.asserts.fail("String value requires balanced square brackets and one identifier per pair of brackets, got: " + b), e.html.SafeStyle.INNOCUOUS_STRING
        } else return e.asserts.fail("String value allows only " + e.html.SafeStyle.VALUE_ALLOWED_CHARS_ + " and simple functions, got: " + b), e.html.SafeStyle.INNOCUOUS_STRING;
        return e.html.SafeStyle.sanitizeUrl_(b)
    };
    e.html.SafeStyle.hasBalancedQuotes_ = function(b) {
        for (var c = !0, d = !0, f = 0; f < b.length; f++) {
            var g = b.charAt(f);
            "'" == g && d ? c = !c : '"' == g && c && (d = !d)
        }
        return c && d
    };
    e.html.SafeStyle.hasBalancedSquareBrackets_ = function(b) {
        for (var c = !0, d = /^[-_a-zA-Z0-9]$/, f = 0; f < b.length; f++) {
            var g = b.charAt(f);
            if ("]" == g) {
                if (c) return !1;
                c = !0
            } else if ("[" == g) {
                if (!c) return !1;
                c = !1
            } else if (!c && !d.test(g)) return !1
        }
        return c
    };
    e.html.SafeStyle.VALUE_ALLOWED_CHARS_ = "[-,.\"'%_!# a-zA-Z0-9\\[\\]]";
    e.html.SafeStyle.VALUE_RE_ = new RegExp("^" + e.html.SafeStyle.VALUE_ALLOWED_CHARS_ + "+$");
    e.html.SafeStyle.URL_RE_ = /\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g;
    e.html.SafeStyle.FUNCTIONS_RE_ = /\b(hsl|hsla|rgb|rgba|matrix|calc|minmax|fit-content|repeat|(rotate|scale|translate)(X|Y|Z|3d)?)\([-+*/0-9a-z.%\[\], ]+\)/g;
    e.html.SafeStyle.COMMENT_RE_ = /\/\*/;
    e.html.SafeStyle.sanitizeUrl_ = function(b) {
        return b.replace(e.html.SafeStyle.URL_RE_, function(b, d, f, g) {
            var c = "";
            f = f.replace(/^(['"])(.*)\1$/, function(b, d, f) {
                c = d;
                return f
            });
            b = e.html.SafeUrl.sanitize(f).getTypedStringValue();
            return d + c + b + c + g
        })
    };
    e.html.SafeStyle.concat = function(b) {
        function c(b) {
            e.isArray(b) ? e.array.forEach(b, c) : d += e.html.SafeStyle.unwrap(b)
        }
        var d = "";
        e.array.forEach(arguments, c);
        return d ? e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(d) : e.html.SafeStyle.EMPTY
    };
    e.html.SafeStyleSheet = function() {
        this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
        this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeStyleSheet.createRule = function(b, c) {
        if (e.string.contains(b, "<")) throw Error("Selector does not allow '<', got: " + b);
        var d = b.replace(/('|")((?!\1)[^\r\n\f\\]|\\[\s\S])*\1/g, "");
        if (!/^[-_a-zA-Z0-9#.:* ,>+~[\]()=^$|]+$/.test(d)) throw Error("Selector allows only [-_a-zA-Z0-9#.:* ,>+~[\\]()=^$|] and strings, got: " + b);
        if (!e.html.SafeStyleSheet.hasBalancedBrackets_(d)) throw Error("() and [] in selector must be balanced, got: " + b);
        c instanceof e.html.SafeStyle || (c = e.html.SafeStyle.create(c));
        b = b + "{" + e.html.SafeStyle.unwrap(c) + "}";
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeStyleSheet.hasBalancedBrackets_ = function(b) {
        for (var c = {
                "(": ")",
                "[": "]"
            }, d = [], f = 0; f < b.length; f++) {
            var g = b[f];
            if (c[g]) d.push(c[g]);
            else if (e.object.contains(c, g) && d.pop() != g) return !1
        }
        return 0 == d.length
    };
    e.html.SafeStyleSheet.concat = function(b) {
        function c(b) {
            e.isArray(b) ? e.array.forEach(b, c) : d += e.html.SafeStyleSheet.unwrap(b)
        }
        var d = "";
        e.array.forEach(arguments, c);
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(d)
    };
    e.html.SafeStyleSheet.fromConstant = function(b) {
        b = e.string.Const.unwrap(b);
        if (0 === b.length) return e.html.SafeStyleSheet.EMPTY;
        e.asserts.assert(!e.string.contains(b, "<"), "Forbidden '<' character in style sheet string: " + b);
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b)
    };
    e.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
        return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_
    };
    e.DEBUG && (e.html.SafeStyleSheet.prototype.toString = function() {
        return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}"
    });
    e.html.SafeStyleSheet.unwrap = function(b) {
        if (b instanceof e.html.SafeStyleSheet && b.constructor === e.html.SafeStyleSheet && b.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return b.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
        e.asserts.fail("expected object of type SafeStyleSheet, got '" + b + "' of type " + e.typeOf(b));
        return "type_error:SafeStyleSheet"
    };
    e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(b) {
        return (new e.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(b)
    };
    e.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(b) {
        this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = b;
        return this
    };
    e.html.SafeStyleSheet.EMPTY = e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
    e.html.SafeHtml = function() {
        this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
        this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
        this.dir_ = null
    };
    e.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
    e.html.SafeHtml.prototype.getDirection = function() {
        return this.dir_
    };
    e.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeHtml.prototype.getTypedStringValue = function() {
        return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
    };
    e.DEBUG && (e.html.SafeHtml.prototype.toString = function() {
        return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
    });
    e.html.SafeHtml.unwrap = function(b) {
        if (b instanceof e.html.SafeHtml && b.constructor === e.html.SafeHtml && b.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return b.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
        e.asserts.fail("expected object of type SafeHtml, got '" + b + "' of type " + e.typeOf(b));
        return "type_error:SafeHtml"
    };
    e.html.SafeHtml.htmlEscape = function(b) {
        if (b instanceof e.html.SafeHtml) return b;
        var c = "object" == typeof b,
            d = null;
        c && b.implementsGoogI18nBidiDirectionalString && (d = b.getDirection());
        b = c && b.implementsGoogStringTypedString ? b.getTypedStringValue() : String(b);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e.string.htmlEscape(b), d)
    };
    e.html.SafeHtml.htmlEscapePreservingNewlines = function(b) {
        if (b instanceof e.html.SafeHtml) return b;
        b = e.html.SafeHtml.htmlEscape(b);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e.string.newLineToBr(e.html.SafeHtml.unwrap(b)), b.getDirection())
    };
    e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(b) {
        if (b instanceof e.html.SafeHtml) return b;
        b = e.html.SafeHtml.htmlEscape(b);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e.string.whitespaceEscape(e.html.SafeHtml.unwrap(b)), b.getDirection())
    };
    e.html.SafeHtml.from = e.html.SafeHtml.htmlEscape;
    e.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
    e.html.SafeHtml.URL_ATTRIBUTES_ = {
        action: !0,
        cite: !0,
        data: !0,
        formaction: !0,
        href: !0,
        manifest: !0,
        poster: !0,
        src: !0
    };
    e.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = {
        APPLET: !0,
        BASE: !0,
        EMBED: !0,
        IFRAME: !0,
        LINK: !0,
        MATH: !0,
        META: !0,
        OBJECT: !0,
        SCRIPT: !0,
        STYLE: !0,
        SVG: !0,
        TEMPLATE: !0
    };
    e.html.SafeHtml.create = function(b, c, d) {
        e.html.SafeHtml.verifyTagName(String(b));
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(b), c, d)
    };
    e.html.SafeHtml.verifyTagName = function(b) {
        if (!e.html.SafeHtml.VALID_NAMES_IN_TAG_.test(b)) throw Error("Invalid tag name <" + b + ">.");
        if (b.toUpperCase() in e.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) throw Error("Tag name <" + b + "> is not allowed for SafeHtml.");
    };
    e.html.SafeHtml.createIframe = function(b, c, d, f) {
        b && e.html.TrustedResourceUrl.unwrap(b);
        var g = {};
        g.src = b || null;
        g.srcdoc = c && e.html.SafeHtml.unwrap(c);
        b = e.html.SafeHtml.combineAttributes(g, {
            sandbox: ""
        }, d);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", b, f)
    };
    e.html.SafeHtml.createSandboxIframe = function(b, c, d, f) {
        if (!e.html.SafeHtml.canUseSandboxIframe()) throw Error("The browser does not support sandboxed iframes.");
        var g = {};
        g.src = b ? e.html.SafeUrl.unwrap(e.html.SafeUrl.sanitize(b)) : null;
        g.srcdoc = c || null;
        g.sandbox = "";
        b = e.html.SafeHtml.combineAttributes(g, {}, d);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", b, f)
    };
    e.html.SafeHtml.canUseSandboxIframe = function() {
        return e.global.HTMLIFrameElement && "sandbox" in e.global.HTMLIFrameElement.prototype
    };
    e.html.SafeHtml.createScriptSrc = function(b, c) {
        e.html.TrustedResourceUrl.unwrap(b);
        b = e.html.SafeHtml.combineAttributes({
            src: b
        }, {}, c);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", b)
    };
    e.html.SafeHtml.createScript = function(b, c) {
        for (var d in c) {
            var f = d.toLowerCase();
            if ("language" == f || "src" == f || "text" == f || "type" == f) throw Error('Cannot set "' + f + '" attribute');
        }
        d = "";
        b = e.array.concat(b);
        for (f = 0; f < b.length; f++) d += e.html.SafeScript.unwrap(b[f]);
        b = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(d, e.i18n.bidi.Dir.NEUTRAL);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", c, b)
    };
    e.html.SafeHtml.createStyle = function(b, c) {
        c = e.html.SafeHtml.combineAttributes({
            type: "text/css"
        }, {}, c);
        var d = "";
        b = e.array.concat(b);
        for (var f = 0; f < b.length; f++) d += e.html.SafeStyleSheet.unwrap(b[f]);
        b = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(d, e.i18n.bidi.Dir.NEUTRAL);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", c, b)
    };
    e.html.SafeHtml.createMetaRefresh = function(b, c) {
        b = e.html.SafeUrl.unwrap(e.html.SafeUrl.sanitize(b));
        (e.labs.userAgent.browser.matchIE_() || e.labs.userAgent.browser.matchEdge_()) && e.string.contains(b, ";") && (b = "'" + b.replace(/'/g, "%27") + "'");
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta", {
            "http-equiv": "refresh",
            content: (c || 0) + "; url=" + b
        })
    };
    e.html.SafeHtml.getAttrNameAndValue_ = function(b, c, d) {
        if (d instanceof e.string.Const) d = e.string.Const.unwrap(d);
        else if ("style" == c.toLowerCase()) d = e.html.SafeHtml.getStyleValue_(d);
        else {
            if (/^on/i.test(c)) throw Error('Attribute "' + c + '" requires goog.string.Const value, "' + d + '" given.');
            if (c.toLowerCase() in e.html.SafeHtml.URL_ATTRIBUTES_)
                if (d instanceof e.html.TrustedResourceUrl) d = e.html.TrustedResourceUrl.unwrap(d);
                else if (d instanceof e.html.SafeUrl) d = e.html.SafeUrl.unwrap(d);
            else if (e.isString(d)) d =
                e.html.SafeUrl.sanitize(d).getTypedStringValue();
            else throw Error('Attribute "' + c + '" on tag "' + b + '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + d + '" given.');
        }
        d.implementsGoogStringTypedString && (d = d.getTypedStringValue());
        e.asserts.assert(e.isString(d) || e.isNumber(d), "String or number value expected, got " + typeof d + " with value: " + d);
        return c + '="' + e.string.htmlEscape(String(d)) + '"'
    };
    e.html.SafeHtml.getStyleValue_ = function(b) {
        if (!e.isObject(b)) throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof b + " given: " + b);
        b instanceof e.html.SafeStyle || (b = e.html.SafeStyle.create(b));
        return e.html.SafeStyle.unwrap(b)
    };
    e.html.SafeHtml.createWithDir = function(b, c, d, f) {
        c = e.html.SafeHtml.create(c, d, f);
        c.dir_ = b;
        return c
    };
    e.html.SafeHtml.concat = function(b) {
        function c(b) {
            e.isArray(b) ? e.array.forEach(b, c) : (b = e.html.SafeHtml.htmlEscape(b), f += e.html.SafeHtml.unwrap(b), b = b.getDirection(), d == e.i18n.bidi.Dir.NEUTRAL ? d = b : b != e.i18n.bidi.Dir.NEUTRAL && d != b && (d = null))
        }
        var d = e.i18n.bidi.Dir.NEUTRAL,
            f = "";
        e.array.forEach(arguments, c);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(f, d)
    };
    e.html.SafeHtml.concatWithDir = function(b, c) {
        var d = e.html.SafeHtml.concat(e.array.slice(arguments, 1));
        d.dir_ = b;
        return d
    };
    e.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(b, c) {
        return (new e.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(b, c)
    };
    e.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(b, c) {
        this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = b;
        this.dir_ = c;
        return this
    };
    e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(b, c, d) {
        var f = null;
        var g = "<" + b + e.html.SafeHtml.stringifyAttributes(b, c);
        e.isDefAndNotNull(d) ? e.isArray(d) || (d = [d]) : d = [];
        e.dom.tags.isVoidTag(b.toLowerCase()) ? (e.asserts.assert(!d.length, "Void tag <" + b + "> does not allow content."), g += ">") : (f = e.html.SafeHtml.concat(d), g += ">" + e.html.SafeHtml.unwrap(f) + "</" + b + ">", f = f.getDirection());
        (b = c && c.dir) && (f = /^(ltr|rtl|auto)$/i.test(b) ? e.i18n.bidi.Dir.NEUTRAL : null);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(g,
            f)
    };
    e.html.SafeHtml.stringifyAttributes = function(b, c) {
        var d = "";
        if (c)
            for (var f in c) {
                if (!e.html.SafeHtml.VALID_NAMES_IN_TAG_.test(f)) throw Error('Invalid attribute name "' + f + '".');
                var g = c[f];
                e.isDefAndNotNull(g) && (d += " " + e.html.SafeHtml.getAttrNameAndValue_(b, f, g))
            }
        return d
    };
    e.html.SafeHtml.combineAttributes = function(b, c, d) {
        var f = {},
            g;
        for (g in b) e.asserts.assert(g.toLowerCase() == g, "Must be lower case"), f[g] = b[g];
        for (g in c) e.asserts.assert(g.toLowerCase() == g, "Must be lower case"), f[g] = c[g];
        for (g in d) {
            var h = g.toLowerCase();
            if (h in b) throw Error('Cannot override "' + h + '" attribute, got "' + g + '" with value "' + d[g] + '"');
            h in c && delete f[h];
            f[g] = d[g]
        }
        return f
    };
    e.html.SafeHtml.DOCTYPE_HTML = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", e.i18n.bidi.Dir.NEUTRAL);
    e.html.SafeHtml.EMPTY = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", e.i18n.bidi.Dir.NEUTRAL);
    e.html.SafeHtml.BR = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>", e.i18n.bidi.Dir.NEUTRAL);
    e.html.uncheckedconversions = {};
    e.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(b, c, d) {
        e.asserts.assertString(e.string.Const.unwrap(b), "must provide justification");
        e.asserts.assert(!e.string.isEmptyOrWhitespace(e.string.Const.unwrap(b)), "must provide non-empty justification");
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, d || null)
    };
    e.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(b, c) {
        e.asserts.assertString(e.string.Const.unwrap(b), "must provide justification");
        e.asserts.assert(!e.string.isEmptyOrWhitespace(e.string.Const.unwrap(b)), "must provide non-empty justification");
        return e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(b, c) {
        e.asserts.assertString(e.string.Const.unwrap(b), "must provide justification");
        e.asserts.assert(!e.string.isEmptyOrWhitespace(e.string.Const.unwrap(b)), "must provide non-empty justification");
        return e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(b, c) {
        e.asserts.assertString(e.string.Const.unwrap(b), "must provide justification");
        e.asserts.assert(!e.string.isEmptyOrWhitespace(e.string.Const.unwrap(b)), "must provide non-empty justification");
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(b, c) {
        e.asserts.assertString(e.string.Const.unwrap(b), "must provide justification");
        e.asserts.assert(!e.string.isEmptyOrWhitespace(e.string.Const.unwrap(b)), "must provide non-empty justification");
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(b, c) {
        e.asserts.assertString(e.string.Const.unwrap(b), "must provide justification");
        e.asserts.assert(!e.string.isEmptyOrWhitespace(e.string.Const.unwrap(b)), "must provide non-empty justification");
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.debug.Formatter = function(b) {
        this.prefix_ = b || "";
        this.startTimeProvider_ = e.debug.RelativeTimeProvider.getDefaultInstance()
    };
    e.debug.Formatter.prototype.appendNewline = !0;
    e.debug.Formatter.prototype.showAbsoluteTime = !0;
    e.debug.Formatter.prototype.showRelativeTime = !0;
    e.debug.Formatter.prototype.showLoggerName = !0;
    e.debug.Formatter.prototype.showExceptionText = !1;
    e.debug.Formatter.prototype.showSeverityLevel = !1;
    e.debug.Formatter.prototype.formatRecord = e.abstractMethod;
    e.debug.Formatter.prototype.formatRecordAsHtml = e.abstractMethod;
    e.debug.Formatter.prototype.setStartTimeProvider = function(b) {
        this.startTimeProvider_ = b
    };
    e.debug.Formatter.prototype.getStartTimeProvider = function() {
        return this.startTimeProvider_
    };
    e.debug.Formatter.prototype.resetRelativeTimeStart = function() {
        this.startTimeProvider_.reset()
    };
    e.debug.Formatter.getDateTimeStamp_ = function(b) {
        b = new Date(b.getMillis());
        return e.debug.Formatter.getTwoDigitString_(b.getFullYear() - 2E3) + e.debug.Formatter.getTwoDigitString_(b.getMonth() + 1) + e.debug.Formatter.getTwoDigitString_(b.getDate()) + " " + e.debug.Formatter.getTwoDigitString_(b.getHours()) + ":" + e.debug.Formatter.getTwoDigitString_(b.getMinutes()) + ":" + e.debug.Formatter.getTwoDigitString_(b.getSeconds()) + "." + e.debug.Formatter.getTwoDigitString_(Math.floor(b.getMilliseconds() / 10))
    };
    e.debug.Formatter.getTwoDigitString_ = function(b) {
        return 10 > b ? "0" + b : String(b)
    };
    e.debug.Formatter.getRelativeTime_ = function(b, c) {
        b = (b.getMillis() - c) / 1E3;
        c = b.toFixed(3);
        var d = 0;
        if (1 > b) d = 2;
        else
            for (; 100 > b;) d++, b *= 10;
        for (; 0 < d--;) c = " " + c;
        return c
    };
    e.debug.HtmlFormatter = function(b) {
        e.debug.Formatter.call(this, b)
    };
    e.inherits(e.debug.HtmlFormatter, e.debug.Formatter);
    e.debug.HtmlFormatter.exposeException = function(b, c) {
        b = e.debug.HtmlFormatter.exposeExceptionAsHtml(b, c);
        return e.html.SafeHtml.unwrap(b)
    };
    e.debug.HtmlFormatter.exposeExceptionAsHtml = function(b, c) {
        try {
            var d = e.debug.normalizeErrorObject(b),
                f = e.debug.HtmlFormatter.createViewSourceUrl_(d.fileName);
            return e.html.SafeHtml.concat(e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Message: " + d.message + "\nUrl: "), e.html.SafeHtml.create("a", {
                href: f,
                target: "_new"
            }, d.fileName), e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("\nLine: " + d.lineNumber + "\n\nBrowser stack:\n" + d.stack + "-> [end]\n\nJS stack traversal:\n" + e.debug.getStacktrace(c) +
                "-> "))
        } catch (g) {
            return e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Exception trying to expose exception! You win, we lose. " + g)
        }
    };
    e.debug.HtmlFormatter.createViewSourceUrl_ = function(b) {
        e.isDefAndNotNull(b) || (b = "");
        if (!/^https?:\/\//i.test(b)) return e.html.SafeUrl.fromConstant(e.string.Const.from("sanitizedviewsrc"));
        b = e.html.SafeUrl.sanitize(b);
        return e.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(e.string.Const.from("view-source scheme plus HTTP/HTTPS URL"), "view-source:" + e.html.SafeUrl.unwrap(b))
    };
    e.debug.HtmlFormatter.prototype.showExceptionText = !0;
    e.debug.HtmlFormatter.prototype.formatRecord = function(b) {
        return b ? this.formatRecordAsHtml(b).getTypedStringValue() : ""
    };
    e.debug.HtmlFormatter.prototype.formatRecordAsHtml = function(b) {
        if (!b) return e.html.SafeHtml.EMPTY;
        switch (b.getLevel().value) {
            case e.debug.Logger.Level.SHOUT.value:
                var c = "dbg-sh";
                break;
            case e.debug.Logger.Level.SEVERE.value:
                c = "dbg-sev";
                break;
            case e.debug.Logger.Level.WARNING.value:
                c = "dbg-w";
                break;
            case e.debug.Logger.Level.INFO.value:
                c = "dbg-i";
                break;
            default:
                c = "dbg-f"
        }
        var d = [];
        d.push(this.prefix_, " ");
        this.showAbsoluteTime && d.push("[", e.debug.Formatter.getDateTimeStamp_(b), "] ");
        this.showRelativeTime &&
            d.push("[", e.debug.Formatter.getRelativeTime_(b, this.startTimeProvider_.get()), "s] ");
        this.showLoggerName && d.push("[", b.getLoggerName(), "] ");
        this.showSeverityLevel && d.push("[", b.getLevel().name, "] ");
        d = e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(d.join(""));
        var f = e.html.SafeHtml.EMPTY;
        this.showExceptionText && b.getException() && (f = e.html.SafeHtml.concat(e.html.SafeHtml.BR, e.debug.HtmlFormatter.exposeExceptionAsHtml(b.getException())));
        b = e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(b.getMessage());
        c = e.html.SafeHtml.create("span", {
            "class": c
        }, e.html.SafeHtml.concat(b, f));
        return this.appendNewline ? e.html.SafeHtml.concat(d, c, e.html.SafeHtml.BR) : e.html.SafeHtml.concat(d, c)
    };
    e.debug.TextFormatter = function(b) {
        e.debug.Formatter.call(this, b)
    };
    e.inherits(e.debug.TextFormatter, e.debug.Formatter);
    e.debug.TextFormatter.prototype.formatRecord = function(b) {
        var c = [];
        c.push(this.prefix_, " ");
        this.showAbsoluteTime && c.push("[", e.debug.Formatter.getDateTimeStamp_(b), "] ");
        this.showRelativeTime && c.push("[", e.debug.Formatter.getRelativeTime_(b, this.startTimeProvider_.get()), "s] ");
        this.showLoggerName && c.push("[", b.getLoggerName(), "] ");
        this.showSeverityLevel && c.push("[", b.getLevel().name, "] ");
        c.push(b.getMessage());
        this.showExceptionText && (b = b.getException()) && c.push("\n", b instanceof Error ? b.message :
            b.toString());
        this.appendNewline && c.push("\n");
        return c.join("")
    };
    e.debug.TextFormatter.prototype.formatRecordAsHtml = function(b) {
        return e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(e.debug.TextFormatter.prototype.formatRecord(b))
    };
    e.functions = {};
    e.functions.constant = function(b) {
        return function() {
            return b
        }
    };
    e.functions.FALSE = e.functions.constant(!1);
    e.functions.TRUE = e.functions.constant(!0);
    e.functions.NULL = e.functions.constant(null);
    e.functions.identity = function(b) {
        return b
    };
    e.functions.error = function(b) {
        return function() {
            throw Error(b);
        }
    };
    e.functions.fail = function(b) {
        return function() {
            throw b;
        }
    };
    e.functions.lock = function(b, c) {
        c = c || 0;
        return function() {
            return b.apply(this, Array.prototype.slice.call(arguments, 0, c))
        }
    };
    e.functions.nth = function(b) {
        return function() {
            return arguments[b]
        }
    };
    e.functions.partialRight = function(b, c) {
        var d = Array.prototype.slice.call(arguments, 1);
        return function() {
            var c = Array.prototype.slice.call(arguments);
            c.push.apply(c, d);
            return b.apply(this, c)
        }
    };
    e.functions.withReturnValue = function(b, c) {
        return e.functions.sequence(b, e.functions.constant(c))
    };
    e.functions.equalTo = function(b, c) {
        return function(d) {
            return c ? b == d : b === d
        }
    };
    e.functions.compose = function(b, c) {
        var d = arguments,
            f = d.length;
        return function() {
            var b;
            f && (b = d[f - 1].apply(this, arguments));
            for (var c = f - 2; 0 <= c; c--) b = d[c].call(this, b);
            return b
        }
    };
    e.functions.sequence = function(b) {
        var c = arguments,
            d = c.length;
        return function() {
            for (var b, g = 0; g < d; g++) b = c[g].apply(this, arguments);
            return b
        }
    };
    e.functions.and = function(b) {
        var c = arguments,
            d = c.length;
        return function() {
            for (var b = 0; b < d; b++)
                if (!c[b].apply(this, arguments)) return !1;
            return !0
        }
    };
    e.functions.or = function(b) {
        var c = arguments,
            d = c.length;
        return function() {
            for (var b = 0; b < d; b++)
                if (c[b].apply(this, arguments)) return !0;
            return !1
        }
    };
    e.functions.not = function(b) {
        return function() {
            return !b.apply(this, arguments)
        }
    };
    e.functions.create = function(b, c) {
        function d() {}
        d.prototype = b.prototype;
        var f = new d;
        b.apply(f, Array.prototype.slice.call(arguments, 1));
        return f
    };
    e.functions.CACHE_RETURN_VALUE = !0;
    e.functions.cacheReturnValue = function(b) {
        var c = !1,
            d;
        return function() {
            if (!e.functions.CACHE_RETURN_VALUE) return b();
            c || (d = b(), c = !0);
            return d
        }
    };
    e.functions.once = function(b) {
        var c = b;
        return function() {
            if (c) {
                var b = c;
                c = null;
                b()
            }
        }
    };
    e.functions.debounce = function(b, c, d) {
        var f = 0;
        return function(g) {
            e.global.clearTimeout(f);
            var h = arguments;
            f = e.global.setTimeout(function() {
                b.apply(d, h)
            }, c)
        }
    };
    e.functions.throttle = function(b, c, d) {
        function f() {
            h = e.global.setTimeout(g, c);
            b.apply(d, m)
        }

        function g() {
            h = 0;
            l && (l = !1, f())
        }
        var h = 0,
            l = !1,
            m = [];
        return function(b) {
            m = arguments;
            h ? l = !0 : f()
        }
    };
    e.functions.rateLimit = function(b, c, d) {
        function f() {
            g = 0
        }
        var g = 0;
        return function(h) {
            g || (g = e.global.setTimeout(f, c), b.apply(d, arguments))
        }
    };
    e.math.randomInt = function(b) {
        return Math.floor(Math.random() * b)
    };
    e.math.uniformRandom = function(b, c) {
        return b + Math.random() * (c - b)
    };
    e.math.clamp = function(b, c, d) {
        return Math.min(Math.max(b, c), d)
    };
    e.math.modulo = function(b, c) {
        b %= c;
        return 0 > b * c ? b + c : b
    };
    e.math.lerp = function(b, c, d) {
        return b + d * (c - b)
    };
    e.math.nearlyEquals = function(b, c, d) {
        return Math.abs(b - c) <= (d || 1E-6)
    };
    e.math.standardAngle = function(b) {
        return e.math.modulo(b, 360)
    };
    e.math.standardAngleInRadians = function(b) {
        return e.math.modulo(b, 2 * Math.PI)
    };
    e.math.toRadians = function(b) {
        return b * Math.PI / 180
    };
    e.math.toDegrees = function(b) {
        return 180 * b / Math.PI
    };
    e.math.angleDx = function(b, c) {
        return c * Math.cos(e.math.toRadians(b))
    };
    e.math.angleDy = function(b, c) {
        return c * Math.sin(e.math.toRadians(b))
    };
    e.math.angle = function(b, c, d, f) {
        return e.math.standardAngle(e.math.toDegrees(Math.atan2(f - c, d - b)))
    };
    e.math.angleDifference = function(b, c) {
        b = e.math.standardAngle(c) - e.math.standardAngle(b);
        180 < b ? b -= 360 : -180 >= b && (b = 360 + b);
        return b
    };
    e.math.sign = function(b) {
        return 0 < b ? 1 : 0 > b ? -1 : b
    };
    e.math.longestCommonSubsequence = function(b, c, d, f) {
        d = d || function(b, c) {
            return b == c
        };
        f = f || function(c) {
            return b[c]
        };
        for (var g = b.length, h = c.length, l = [], m = 0; m < g + 1; m++) l[m] = [], l[m][0] = 0;
        for (var n = 0; n < h + 1; n++) l[0][n] = 0;
        for (m = 1; m <= g; m++)
            for (n = 1; n <= h; n++) d(b[m - 1], c[n - 1]) ? l[m][n] = l[m - 1][n - 1] + 1 : l[m][n] = Math.max(l[m - 1][n], l[m][n - 1]);
        var p = [];
        m = g;
        for (n = h; 0 < m && 0 < n;) d(b[m - 1], c[n - 1]) ? (p.unshift(f(m - 1, n - 1)), m--, n--) : l[m - 1][n] > l[m][n - 1] ? m-- : n--;
        return p
    };
    e.math.sum = function(b) {
        return e.array.reduce(arguments, function(b, d) {
            return b + d
        }, 0)
    };
    e.math.average = function(b) {
        return e.math.sum.apply(null, arguments) / arguments.length
    };
    e.math.sampleVariance = function(b) {
        var c = arguments.length;
        if (2 > c) return 0;
        var d = e.math.average.apply(null, arguments);
        return e.math.sum.apply(null, e.array.map(arguments, function(b) {
            return Math.pow(b - d, 2)
        })) / (c - 1)
    };
    e.math.standardDeviation = function(b) {
        return Math.sqrt(e.math.sampleVariance.apply(null, arguments))
    };
    e.math.isInt = function(b) {
        return isFinite(b) && 0 == b % 1
    };
    e.math.isFiniteNumber = function(b) {
        return isFinite(b)
    };
    e.math.isNegativeZero = function(b) {
        return 0 == b && 0 > 1 / b
    };
    e.math.log10Floor = function(b) {
        if (0 < b) {
            var c = Math.round(Math.log(b) * Math.LOG10E);
            return c - (parseFloat("1e" + c) > b ? 1 : 0)
        }
        return 0 == b ? -Infinity : NaN
    };
    e.math.safeFloor = function(b, c) {
        e.asserts.assert(!e.isDef(c) || 0 < c);
        return Math.floor(b + (c || 2E-15))
    };
    e.math.safeCeil = function(b, c) {
        e.asserts.assert(!e.isDef(c) || 0 < c);
        return Math.ceil(b - (c || 2E-15))
    };
    e.iter = {};
    e.iter.StopIteration = "StopIteration" in e.global ? e.global.StopIteration : {
        message: "StopIteration",
        stack: ""
    };
    e.iter.Iterator = function() {};
    e.iter.Iterator.prototype.next = function() {
        throw e.iter.StopIteration;
    };
    e.iter.Iterator.prototype.__iterator__ = function() {
        return this
    };
    e.iter.toIterator = function(b) {
        if (b instanceof e.iter.Iterator) return b;
        if ("function" == typeof b.__iterator__) return b.__iterator__(!1);
        if (e.isArrayLike(b)) {
            var c = 0,
                d = new e.iter.Iterator;
            d.next = function() {
                for (;;) {
                    if (c >= b.length) throw e.iter.StopIteration;
                    if (c in b) return b[c++];
                    c++
                }
            };
            return d
        }
        throw Error("Not implemented");
    };
    e.iter.forEach = function(b, c, d) {
        if (e.isArrayLike(b)) try {
            e.array.forEach(b, c, d)
        } catch (f) {
            if (f !== e.iter.StopIteration) throw f;
        } else {
            b = e.iter.toIterator(b);
            try {
                for (;;) c.call(d, b.next(), void 0, b)
            } catch (f) {
                if (f !== e.iter.StopIteration) throw f;
            }
        }
    };
    e.iter.filter = function(b, c, d) {
        var f = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        b.next = function() {
            for (;;) {
                var b = f.next();
                if (c.call(d, b, void 0, f)) return b
            }
        };
        return b
    };
    e.iter.filterFalse = function(b, c, d) {
        return e.iter.filter(b, e.functions.not(c), d)
    };
    e.iter.range = function(b, c, d) {
        var f = 0,
            g = b,
            h = d || 1;
        1 < arguments.length && (f = b, g = +c);
        if (0 == h) throw Error("Range step argument must not be zero");
        var l = new e.iter.Iterator;
        l.next = function() {
            if (0 < h && f >= g || 0 > h && f <= g) throw e.iter.StopIteration;
            var b = f;
            f += h;
            return b
        };
        return l
    };
    e.iter.join = function(b, c) {
        return e.iter.toArray(b).join(c)
    };
    e.iter.map = function(b, c, d) {
        var f = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        b.next = function() {
            var b = f.next();
            return c.call(d, b, void 0, f)
        };
        return b
    };
    e.iter.reduce = function(b, c, d, f) {
        var g = d;
        e.iter.forEach(b, function(b) {
            g = c.call(f, g, b)
        });
        return g
    };
    e.iter.some = function(b, c, d) {
        b = e.iter.toIterator(b);
        try {
            for (;;)
                if (c.call(d, b.next(), void 0, b)) return !0
        } catch (f) {
            if (f !== e.iter.StopIteration) throw f;
        }
        return !1
    };
    e.iter.every = function(b, c, d) {
        b = e.iter.toIterator(b);
        try {
            for (;;)
                if (!c.call(d, b.next(), void 0, b)) return !1
        } catch (f) {
            if (f !== e.iter.StopIteration) throw f;
        }
        return !0
    };
    e.iter.chain = function(b) {
        return e.iter.chainFromIterable(arguments)
    };
    e.iter.chainFromIterable = function(b) {
        var c = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        var d = null;
        b.next = function() {
            for (;;) {
                if (null == d) {
                    var b = c.next();
                    d = e.iter.toIterator(b)
                }
                try {
                    return d.next()
                } catch (g) {
                    if (g !== e.iter.StopIteration) throw g;
                    d = null
                }
            }
        };
        return b
    };
    e.iter.dropWhile = function(b, c, d) {
        var f = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        var g = !0;
        b.next = function() {
            for (;;) {
                var b = f.next();
                if (!g || !c.call(d, b, void 0, f)) return g = !1, b
            }
        };
        return b
    };
    e.iter.takeWhile = function(b, c, d) {
        var f = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        b.next = function() {
            var b = f.next();
            if (c.call(d, b, void 0, f)) return b;
            throw e.iter.StopIteration;
        };
        return b
    };
    e.iter.toArray = function(b) {
        if (e.isArrayLike(b)) return e.array.toArray(b);
        b = e.iter.toIterator(b);
        var c = [];
        e.iter.forEach(b, function(b) {
            c.push(b)
        });
        return c
    };
    e.iter.equals = function(b, c, d) {
        b = e.iter.zipLongest({}, b, c);
        var f = d || e.array.defaultCompareEquality;
        return e.iter.every(b, function(b) {
            return f(b[0], b[1])
        })
    };
    e.iter.nextOrValue = function(b, c) {
        try {
            return e.iter.toIterator(b).next()
        } catch (d) {
            if (d != e.iter.StopIteration) throw d;
            return c
        }
    };
    e.iter.product = function(b) {
        if (e.array.some(arguments, function(b) {
                return !b.length
            }) || !arguments.length) return new e.iter.Iterator;
        var c = new e.iter.Iterator,
            d = arguments,
            f = e.array.repeat(0, d.length);
        c.next = function() {
            if (f) {
                for (var b = e.array.map(f, function(b, c) {
                        return d[c][b]
                    }), c = f.length - 1; 0 <= c; c--) {
                    e.asserts.assert(f);
                    if (f[c] < d[c].length - 1) {
                        f[c]++;
                        break
                    }
                    if (0 == c) {
                        f = null;
                        break
                    }
                    f[c] = 0
                }
                return b
            }
            throw e.iter.StopIteration;
        };
        return c
    };
    e.iter.cycle = function(b) {
        var c = e.iter.toIterator(b),
            d = [],
            f = 0;
        b = new e.iter.Iterator;
        var g = !1;
        b.next = function() {
            var b = null;
            if (!g) try {
                return b = c.next(), d.push(b), b
            } catch (l) {
                if (l != e.iter.StopIteration || e.array.isEmpty(d)) throw l;
                g = !0
            }
            b = d[f];
            f = (f + 1) % d.length;
            return b
        };
        return b
    };
    e.iter.count = function(b, c) {
        var d = b || 0,
            f = e.isDef(c) ? c : 1;
        b = new e.iter.Iterator;
        b.next = function() {
            var b = d;
            d += f;
            return b
        };
        return b
    };
    e.iter.repeat = function(b) {
        var c = new e.iter.Iterator;
        c.next = e.functions.constant(b);
        return c
    };
    e.iter.accumulate = function(b) {
        var c = e.iter.toIterator(b),
            d = 0;
        b = new e.iter.Iterator;
        b.next = function() {
            return d += c.next()
        };
        return b
    };
    e.iter.zip = function(b) {
        var c = arguments,
            d = new e.iter.Iterator;
        if (0 < c.length) {
            var f = e.array.map(c, e.iter.toIterator);
            d.next = function() {
                return e.array.map(f, function(b) {
                    return b.next()
                })
            }
        }
        return d
    };
    e.iter.zipLongest = function(b, c) {
        var d = e.array.slice(arguments, 1),
            f = new e.iter.Iterator;
        if (0 < d.length) {
            var g = e.array.map(d, e.iter.toIterator);
            f.next = function() {
                var c = !1,
                    d = e.array.map(g, function(d) {
                        try {
                            var f = d.next();
                            c = !0
                        } catch (p) {
                            if (p !== e.iter.StopIteration) throw p;
                            f = b
                        }
                        return f
                    });
                if (!c) throw e.iter.StopIteration;
                return d
            }
        }
        return f
    };
    e.iter.compress = function(b, c) {
        var d = e.iter.toIterator(c);
        return e.iter.filter(b, function() {
            return !!d.next()
        })
    };
    e.iter.GroupByIterator_ = function(b, c) {
        this.iterator = e.iter.toIterator(b);
        this.keyFunc = c || e.functions.identity
    };
    e.inherits(e.iter.GroupByIterator_, e.iter.Iterator);
    e.iter.GroupByIterator_.prototype.next = function() {
        for (; this.currentKey == this.targetKey;) this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
        this.targetKey = this.currentKey;
        return [this.currentKey, this.groupItems_(this.targetKey)]
    };
    e.iter.GroupByIterator_.prototype.groupItems_ = function(b) {
        for (var c = []; this.currentKey == b;) {
            c.push(this.currentValue);
            try {
                this.currentValue = this.iterator.next()
            } catch (d) {
                if (d !== e.iter.StopIteration) throw d;
                break
            }
            this.currentKey = this.keyFunc(this.currentValue)
        }
        return c
    };
    e.iter.groupBy = function(b, c) {
        return new e.iter.GroupByIterator_(b, c)
    };
    e.iter.starMap = function(b, c, d) {
        var f = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        b.next = function() {
            var b = e.iter.toArray(f.next());
            return c.apply(d, e.array.concat(b, void 0, f))
        };
        return b
    };
    e.iter.tee = function(b, c) {
        function d() {
            var b = f.next();
            e.array.forEach(g, function(c) {
                c.push(b)
            })
        }
        var f = e.iter.toIterator(b);
        b = e.isNumber(c) ? c : 2;
        var g = e.array.map(e.array.range(b), function() {
            return []
        });
        return e.array.map(g, function(b) {
            var c = new e.iter.Iterator;
            c.next = function() {
                e.array.isEmpty(b) && d();
                e.asserts.assert(!e.array.isEmpty(b));
                return b.shift()
            };
            return c
        })
    };
    e.iter.enumerate = function(b, c) {
        return e.iter.zip(e.iter.count(c), b)
    };
    e.iter.limit = function(b, c) {
        e.asserts.assert(e.math.isInt(c) && 0 <= c);
        var d = e.iter.toIterator(b);
        b = new e.iter.Iterator;
        var f = c;
        b.next = function() {
            if (0 < f--) return d.next();
            throw e.iter.StopIteration;
        };
        return b
    };
    e.iter.consume = function(b, c) {
        e.asserts.assert(e.math.isInt(c) && 0 <= c);
        for (b = e.iter.toIterator(b); 0 < c--;) e.iter.nextOrValue(b, null);
        return b
    };
    e.iter.slice = function(b, c, d) {
        e.asserts.assert(e.math.isInt(c) && 0 <= c);
        b = e.iter.consume(b, c);
        e.isNumber(d) && (e.asserts.assert(e.math.isInt(d) && d >= c), b = e.iter.limit(b, d - c));
        return b
    };
    e.iter.hasDuplicates_ = function(b) {
        var c = [];
        e.array.removeDuplicates(b, c);
        return b.length != c.length
    };
    e.iter.permutations = function(b, c) {
        b = e.iter.toArray(b);
        c = e.isNumber(c) ? c : b.length;
        c = e.array.repeat(b, c);
        c = e.iter.product.apply(void 0, c);
        return e.iter.filter(c, function(b) {
            return !e.iter.hasDuplicates_(b)
        })
    };
    e.iter.combinations = function(b, c) {
        function d(b) {
            return f[b]
        }
        var f = e.iter.toArray(b);
        b = e.iter.range(f.length);
        c = e.iter.permutations(b, c);
        var g = e.iter.filter(c, function(b) {
            return e.array.isSorted(b)
        });
        c = new e.iter.Iterator;
        c.next = function() {
            return e.array.map(g.next(), d)
        };
        return c
    };
    e.iter.combinationsWithReplacement = function(b, c) {
        function d(b) {
            return f[b]
        }
        var f = e.iter.toArray(b);
        b = e.array.range(f.length);
        c = e.array.repeat(b, c);
        c = e.iter.product.apply(void 0, c);
        var g = e.iter.filter(c, function(b) {
            return e.array.isSorted(b)
        });
        c = new e.iter.Iterator;
        c.next = function() {
            return e.array.map(g.next(), d)
        };
        return c
    };
    e.log = {};
    e.log.ENABLED = null;
    e.log.ROOT_LOGGER_NAME = null;
    e.log.Logger = null;
    e.log.Level = null;
    e.log.LogRecord = null;
    e.log.getLogger = function(b, c) {
        return e.debug.LOGGING_ENABLED ? (b = e.debug.LogManager.getLogger(b), c && b && b.setLevel(c), b) : null
    };
    e.log.addHandler = function(b, c) {
        e.debug.LOGGING_ENABLED && b && b.addHandler(c)
    };
    e.log.removeHandler = function(b, c) {
        return e.debug.LOGGING_ENABLED && b ? b.removeHandler(c) : !1
    };
    e.log.log = function(b, c, d, f) {
        e.debug.LOGGING_ENABLED && b && b.log(c, d, f)
    };
    e.log.error = function(b, c, d) {
        e.debug.LOGGING_ENABLED && b && b.severe(c, d)
    };
    e.log.warning = function(b, c, d) {
        e.debug.LOGGING_ENABLED && b && b.warning(c, d)
    };
    e.log.info = function(b, c, d) {
        e.debug.LOGGING_ENABLED && b && b.info(c, d)
    };
    e.log.fine = function(b, c, d) {
        e.debug.LOGGING_ENABLED && b && b.fine(c, d)
    };
    e.structs = {};
    e.structs.CircularBuffer = function(b) {
        this.nextPtr_ = 0;
        this.maxSize_ = b || 100;
        this.buff_ = []
    };
    e.structs.CircularBuffer.prototype.add = function(b) {
        var c = this.buff_[this.nextPtr_];
        this.buff_[this.nextPtr_] = b;
        this.nextPtr_ = (this.nextPtr_ + 1) % this.maxSize_;
        return c
    };
    e.structs.CircularBuffer.prototype.get = function(b) {
        b = this.normalizeIndex_(b);
        return this.buff_[b]
    };
    e.structs.CircularBuffer.prototype.set = function(b, c) {
        b = this.normalizeIndex_(b);
        this.buff_[b] = c
    };
    e.structs.CircularBuffer.prototype.getCount = function() {
        return this.buff_.length
    };
    e.structs.CircularBuffer.prototype.isEmpty = function() {
        return 0 == this.buff_.length
    };
    e.structs.CircularBuffer.prototype.clear = function() {
        this.nextPtr_ = this.buff_.length = 0
    };
    e.structs.CircularBuffer.prototype.getValues = function() {
        return this.getNewestValues(this.getCount())
    };
    e.structs.CircularBuffer.prototype.getNewestValues = function(b) {
        var c = this.getCount(),
            d = [];
        for (b = this.getCount() - b; b < c; b++) d.push(this.get(b));
        return d
    };
    e.structs.CircularBuffer.prototype.getKeys = function() {
        for (var b = [], c = this.getCount(), d = 0; d < c; d++) b[d] = d;
        return b
    };
    e.structs.CircularBuffer.prototype.containsKey = function(b) {
        return b < this.getCount()
    };
    e.structs.CircularBuffer.prototype.containsValue = function(b) {
        for (var c = this.getCount(), d = 0; d < c; d++)
            if (this.get(d) == b) return !0;
        return !1
    };
    e.structs.CircularBuffer.prototype.getLast = function() {
        return 0 == this.getCount() ? null : this.get(this.getCount() - 1)
    };
    e.structs.CircularBuffer.prototype.normalizeIndex_ = function(b) {
        if (b >= this.buff_.length) throw Error("Out of bounds exception");
        return this.buff_.length < this.maxSize_ ? b : (this.nextPtr_ + Number(b)) % this.maxSize_
    };
    k.LogBuffer = function(b) {
        this.capacity_ = b;
        this.size_ = 0;
        this.logsPrefixCapacity_ = Math.trunc(b / 2);
        this.formattedLogsPrefix_ = [];
        this.formattedLogsSuffix_ = new e.structs.CircularBuffer(b - this.logsPrefixCapacity_);
        this.textFormatter_ = new e.debug.TextFormatter;
        this.textFormatter_.showAbsoluteTime = !1;
        this.textFormatter_.showSeverityLevel = !0
    };
    e.exportSymbol("GoogleSmartCard.LogBuffer", k.LogBuffer);
    k.LogBuffer.prototype.getCapacity = function() {
        return this.capacity_
    };
    e.exportProperty(k.LogBuffer.prototype, "getCapacity", k.LogBuffer.prototype.getCapacity);
    k.LogBuffer.prototype.attachToLogger = function(b, c) {
        b.addHandler(this.addLogRecord_.bind(this, c))
    };
    e.exportProperty(k.LogBuffer.prototype, "attachToLogger", k.LogBuffer.prototype.attachToLogger);
    k.LogBuffer.State = function(b, c, d, f) {
        this.logCount = b;
        this.formattedLogsPrefix = c;
        this.skippedLogCount = d;
        this.formattedLogsSuffix = f
    };
    e.exportProperty(k.LogBuffer, "State", k.LogBuffer.State);
    k.LogBuffer.State.prototype.getAsText = function() {
        var b = e.iter.join(this.formattedLogsPrefix, ""),
            c = e.iter.join(this.formattedLogsSuffix, "");
        this.skippedLogCount && (b += "\n... skipped " + this.skippedLogCount + " messages ...\n\n");
        return b + c
    };
    e.exportProperty(k.LogBuffer.State.prototype, "getAsText", k.LogBuffer.State.prototype.getAsText);
    k.LogBuffer.prototype.getState = function() {
        return new k.LogBuffer.State(this.size_, e.array.toArray(this.formattedLogsPrefix_), this.size_ - this.formattedLogsPrefix_.length - this.formattedLogsSuffix_.getCount(), this.formattedLogsSuffix_.getValues())
    };
    e.exportProperty(k.LogBuffer.prototype, "getState", k.LogBuffer.prototype.getState);
    k.LogBuffer.prototype.addLogRecord_ = function(b, c) {
        b = this.formatLogRecord_(this.prefixLogRecord_(c, b));
        this.formattedLogsPrefix_.length < this.logsPrefixCapacity_ ? this.formattedLogsPrefix_.push(b) : this.formattedLogsSuffix_.add(b);
        ++this.size_
    };
    k.LogBuffer.prototype.prefixLogRecord_ = function(b, c) {
        var d = [];
        d.push(this.getLogMessagePrefix_(c));
        b.getLoggerName() && d.push(b.getLoggerName());
        c = d.join(".");
        return new e.debug.LogRecord(b.getLevel(), b.getMessage(), c, b.getMillis(), b.getSequenceNumber())
    };
    k.LogBuffer.prototype.formatLogRecord_ = function(b) {
        return this.textFormatter_.formatRecord(b)
    };
    k.LogBuffer.prototype.getLogMessagePrefix_ = function(b) {
        "/_generated_background_page.html" == b && (b = "background page");
        return "<" + b + ">"
    };
    e.debug.Console = function() {
        this.publishHandler_ = e.bind(this.addLogRecord, this);
        this.formatter_ = new e.debug.TextFormatter;
        this.formatter_.showAbsoluteTime = !1;
        this.formatter_.showExceptionText = !1;
        this.isCapturing_ = this.formatter_.appendNewline = !1;
        this.logBuffer_ = "";
        this.filteredLoggers_ = {}
    };
    e.debug.Console.prototype.getFormatter = function() {
        return this.formatter_
    };
    e.debug.Console.prototype.setCapturing = function(b) {
        if (b != this.isCapturing_) {
            var c = e.debug.LogManager.getRoot();
            b ? c.addHandler(this.publishHandler_) : c.removeHandler(this.publishHandler_);
            this.isCapturing_ = b
        }
    };
    e.debug.Console.prototype.addLogRecord = function(b) {
        if (!this.filteredLoggers_[b.getLoggerName()]) {
            var c = this.formatter_.formatRecord(b),
                d = e.debug.Console.console_;
            if (d) switch (b.getLevel()) {
                case e.debug.Logger.Level.SHOUT:
                    e.debug.Console.logToConsole_(d, "info", c);
                    break;
                case e.debug.Logger.Level.SEVERE:
                    e.debug.Console.logToConsole_(d, "error", c);
                    break;
                case e.debug.Logger.Level.WARNING:
                    e.debug.Console.logToConsole_(d, "warn", c);
                    break;
                default:
                    e.debug.Console.logToConsole_(d, "log", c)
            } else this.logBuffer_ +=
                c
        }
    };
    e.debug.Console.prototype.addFilter = function(b) {
        this.filteredLoggers_[b] = !0
    };
    e.debug.Console.prototype.removeFilter = function(b) {
        delete this.filteredLoggers_[b]
    };
    e.debug.Console.instance = null;
    e.debug.Console.console_ = e.global.console;
    e.debug.Console.setConsole = function(b) {
        e.debug.Console.console_ = b
    };
    e.debug.Console.autoInstall = function() {
        e.debug.Console.instance || (e.debug.Console.instance = new e.debug.Console);
        e.global.location && -1 != e.global.location.href.indexOf("Debug=true") && e.debug.Console.instance.setCapturing(!0)
    };
    e.debug.Console.show = function() {
        alert(e.debug.Console.instance.logBuffer_)
    };
    e.debug.Console.logToConsole_ = function(b, c, d) {
        if (b[c]) b[c](d);
        else b.log(d)
    };
    k.Logging = {};
    a.scope.setupLogBuffer = function() {
        if (e.object.containsKey(window, k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME)) {
            var b = window[k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME];
            a.scope.logger.fine("Detected an existing log buffer instance, attaching it to the root logger")
        } else b = new k.LogBuffer(a.scope.LOG_BUFFER_CAPACITY), window[k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME] = b, a.scope.logger.fine("Created a new log buffer instance, attaching it to the root logger");
        b.attachToLogger(a.scope.rootLogger, document.location.pathname)
    };
    a.scope.setupRootLoggerLevel = function() {
        a.scope.rootLogger.setLevel(a.scope.ROOT_LOGGER_LEVEL)
    };
    a.scope.setupConsoleLogging = function() {
        (new e.debug.Console).setCapturing(!0)
    };
    a.scope.reloadApp = function() {
        chrome.runtime.restart();
        chrome.runtime.reload()
    };
    a.scope.throwAssertionError = function(b, c) {
        if (e.asserts.ENABLE_ASSERTS) {
            var d = Array.prototype.slice.call(arguments);
            e.asserts.fail.apply(null, d)
        } else throw Error("Assertion failure");
    };
    a.scope.LOGGER_SCOPE = "GoogleSmartCard";
    a.scope.ROOT_LOGGER_LEVEL = e.DEBUG ? e.debug.Logger.Level.FINE : e.debug.Logger.Level.INFO;
    a.scope.LOG_BUFFER_CAPACITY = e.DEBUG ? 1E4 : 1E3;
    a.scope.rootLogger = e.asserts.assert(e.log.getLogger(e.debug.Logger.ROOT_LOGGER_NAME));
    a.scope.logger = e.asserts.assert(e.log.getLogger(a.scope.LOGGER_SCOPE));
    a.scope.wasLoggingSetUp = !1;
    k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME = "googleSmartCardLogBuffer";
    k.Logging.setupLogging = function() {
        a.scope.wasLoggingSetUp || (a.scope.wasLoggingSetUp = !0, (0, a.scope.setupConsoleLogging)(), (0, a.scope.setupRootLoggerLevel)(), a.scope.logger.fine("Logging was set up with level=" + a.scope.ROOT_LOGGER_LEVEL.name + " and enabled logging to JS console"), (0, a.scope.setupLogBuffer)())
    };
    k.Logging.getLogger = function(b, c) {
        b = e.log.getLogger(b, c);
        k.Logging.check(b);
        e.asserts.assert(b);
        return b
    };
    k.Logging.getScopedLogger = function(b, c) {
        var d = a.scope.LOGGER_SCOPE;
        b && (d += "." + b);
        return k.Logging.getLogger(d, c)
    };
    k.Logging.getChildLogger = function(b, c) {
        return k.Logging.getLogger(b.getName() + "." + c)
    };
    k.Logging.setLoggerVerbosityAtMost = function(b, c) {
        var d = b.getEffectiveLevel();
        (!d || d.value < c.value) && b.setLevel(c)
    };
    k.Logging.check = function(b, c, d) {
        b || k.Logging.fail(c, Array.prototype.slice.call(arguments, 2))
    };
    k.Logging.checkWithLogger = function(b, c, d, f) {
        c || k.Logging.failWithLogger(b, d, f)
    };
    k.Logging.fail = function(b, c) {
        if (e.DEBUG)(0, a.scope.throwAssertionError)(b, c);
        else {
            var d = Array.prototype.slice.call(arguments);
            a.scope.rootLogger.severe.apply(a.scope.rootLogger, d);
            a.scope.rootLogger.info("Reloading the App due to the fatal error...");
            (0, a.scope.reloadApp)()
        }
    };
    k.Logging.failWithLogger = function(b, c, d) {
        var f = "Failure in " + b.getName();
        if (e.isDef(c)) {
            f = f + ": " + c;
            var g = Array.prototype.slice.call(arguments, 2);
            k.Logging.fail.apply(k.Logging, e.array.concat(f, g))
        } else k.Logging.fail(f)
    };
    k.Logging.getLogBuffer = function() {
        return window[k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME]
    };
    k.Logging.setupLogging();
    /*

     Copyright 2016 Google Inc.

     Redistribution and use in source and binary forms, with or without
     modification, are permitted provided that the following conditions
     are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
     3. The name of the author may not be used to endorse or promote products
        derived from this software without specific prior written permission.

     THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
     IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
     OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
     IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
     INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
     NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
     DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
     THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */
    k.PcscLiteCommon = {};
    k.PcscLiteCommon.Constants = {};
    k.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID = "khpfeaanjngmcnplbdlpegiifgpfgdco";
    e.exportSymbol("GoogleSmartCard.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID", k.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID);
    k.PcscLiteCommon.Constants.REQUESTER_TITLE = "pcsc_lite_function_call";
    e.json = {};
    e.json.USE_NATIVE_JSON = !1;
    e.json.TRY_NATIVE_JSON = !1;
    e.json.isValid = function(b) {
        return /^\s*$/.test(b) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(b.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
    };
    e.json.errorLogger_ = e.nullFunction;
    e.json.setErrorLogger = function(b) {
        e.json.errorLogger_ = b
    };
    e.json.parse = e.json.USE_NATIVE_JSON ? e.global.JSON.parse : function(b) {
        if (e.json.TRY_NATIVE_JSON) try {
            return e.global.JSON.parse(b)
        } catch (f) {
            var c = f
        }
        b = String(b);
        if (e.json.isValid(b)) try {
            var d = eval("(" + b + ")");
            c && e.json.errorLogger_("Invalid JSON: " + b, c);
            return d
        } catch (f) {}
        throw Error("Invalid JSON string: " + b);
    };
    e.json.serialize = e.json.USE_NATIVE_JSON ? e.global.JSON.stringify : function(b, c) {
        return (new e.json.Serializer(c)).serialize(b)
    };
    e.json.Serializer = function(b) {
        this.replacer_ = b
    };
    e.json.Serializer.prototype.serialize = function(b) {
        var c = [];
        this.serializeInternal(b, c);
        return c.join("")
    };
    e.json.Serializer.prototype.serializeInternal = function(b, c) {
        if (null == b) c.push("null");
        else {
            if ("object" == typeof b) {
                if (e.isArray(b)) {
                    this.serializeArray(b, c);
                    return
                }
                if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();
                else {
                    this.serializeObject_(b, c);
                    return
                }
            }
            switch (typeof b) {
                case "string":
                    this.serializeString_(b, c);
                    break;
                case "number":
                    this.serializeNumber_(b, c);
                    break;
                case "boolean":
                    c.push(String(b));
                    break;
                case "function":
                    c.push("null");
                    break;
                default:
                    throw Error("Unknown type: " +
                        typeof b);
            }
        }
    };
    e.json.Serializer.charToJsonCharCache_ = {
        '"': '\\"',
        "\\": "\\\\",
        "/": "\\/",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\x0B": "\\u000b"
    };
    e.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;
    e.json.Serializer.prototype.serializeString_ = function(b, c) {
        c.push('"', b.replace(e.json.Serializer.charsToReplace_, function(b) {
            var c = e.json.Serializer.charToJsonCharCache_[b];
            c || (c = "\\u" + (b.charCodeAt(0) | 65536).toString(16).substr(1), e.json.Serializer.charToJsonCharCache_[b] = c);
            return c
        }), '"')
    };
    e.json.Serializer.prototype.serializeNumber_ = function(b, c) {
        c.push(isFinite(b) && !isNaN(b) ? String(b) : "null")
    };
    e.json.Serializer.prototype.serializeArray = function(b, c) {
        var d = b.length;
        c.push("[");
        for (var f = "", g = 0; g < d; g++) c.push(f), f = b[g], this.serializeInternal(this.replacer_ ? this.replacer_.call(b, String(g), f) : f, c), f = ",";
        c.push("]")
    };
    e.json.Serializer.prototype.serializeObject_ = function(b, c) {
        c.push("{");
        var d = "",
            f;
        for (f in b)
            if (Object.prototype.hasOwnProperty.call(b, f)) {
                var g = b[f];
                "function" != typeof g && (c.push(d), this.serializeString_(f, c), c.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(b, f, g) : g, c), d = ",")
            } c.push("}")
    };
    e.structs.getCount = function(b) {
        return b.getCount && "function" == typeof b.getCount ? b.getCount() : e.isArrayLike(b) || e.isString(b) ? b.length : e.object.getCount(b)
    };
    e.structs.getValues = function(b) {
        if (b.getValues && "function" == typeof b.getValues) return b.getValues();
        if (e.isString(b)) return b.split("");
        if (e.isArrayLike(b)) {
            for (var c = [], d = b.length, f = 0; f < d; f++) c.push(b[f]);
            return c
        }
        return e.object.getValues(b)
    };
    e.structs.getKeys = function(b) {
        if (b.getKeys && "function" == typeof b.getKeys) return b.getKeys();
        if (!b.getValues || "function" != typeof b.getValues) {
            if (e.isArrayLike(b) || e.isString(b)) {
                var c = [];
                b = b.length;
                for (var d = 0; d < b; d++) c.push(d);
                return c
            }
            return e.object.getKeys(b)
        }
    };
    e.structs.contains = function(b, c) {
        return b.contains && "function" == typeof b.contains ? b.contains(c) : b.containsValue && "function" == typeof b.containsValue ? b.containsValue(c) : e.isArrayLike(b) || e.isString(b) ? e.array.contains(b, c) : e.object.containsValue(b, c)
    };
    e.structs.isEmpty = function(b) {
        return b.isEmpty && "function" == typeof b.isEmpty ? b.isEmpty() : e.isArrayLike(b) || e.isString(b) ? e.array.isEmpty(b) : e.object.isEmpty(b)
    };
    e.structs.clear = function(b) {
        b.clear && "function" == typeof b.clear ? b.clear() : e.isArrayLike(b) ? e.array.clear(b) : e.object.clear(b)
    };
    e.structs.forEach = function(b, c, d) {
        if (b.forEach && "function" == typeof b.forEach) b.forEach(c, d);
        else if (e.isArrayLike(b) || e.isString(b)) e.array.forEach(b, c, d);
        else
            for (var f = e.structs.getKeys(b), g = e.structs.getValues(b), h = g.length, l = 0; l < h; l++) c.call(d, g[l], f && f[l], b)
    };
    e.structs.filter = function(b, c, d) {
        if ("function" == typeof b.filter) return b.filter(c, d);
        if (e.isArrayLike(b) || e.isString(b)) return e.array.filter(b, c, d);
        var f = e.structs.getKeys(b),
            g = e.structs.getValues(b),
            h = g.length;
        if (f) {
            var l = {};
            for (var m = 0; m < h; m++) c.call(d, g[m], f[m], b) && (l[f[m]] = g[m])
        } else
            for (l = [], m = 0; m < h; m++) c.call(d, g[m], void 0, b) && l.push(g[m]);
        return l
    };
    e.structs.map = function(b, c, d) {
        if ("function" == typeof b.map) return b.map(c, d);
        if (e.isArrayLike(b) || e.isString(b)) return e.array.map(b, c, d);
        var f = e.structs.getKeys(b),
            g = e.structs.getValues(b),
            h = g.length;
        if (f) {
            var l = {};
            for (var m = 0; m < h; m++) l[f[m]] = c.call(d, g[m], f[m], b)
        } else
            for (l = [], m = 0; m < h; m++) l[m] = c.call(d, g[m], void 0, b);
        return l
    };
    e.structs.some = function(b, c, d) {
        if ("function" == typeof b.some) return b.some(c, d);
        if (e.isArrayLike(b) || e.isString(b)) return e.array.some(b, c, d);
        for (var f = e.structs.getKeys(b), g = e.structs.getValues(b), h = g.length, l = 0; l < h; l++)
            if (c.call(d, g[l], f && f[l], b)) return !0;
        return !1
    };
    e.structs.every = function(b, c, d) {
        if ("function" == typeof b.every) return b.every(c, d);
        if (e.isArrayLike(b) || e.isString(b)) return e.array.every(b, c, d);
        for (var f = e.structs.getKeys(b), g = e.structs.getValues(b), h = g.length, l = 0; l < h; l++)
            if (!c.call(d, g[l], f && f[l], b)) return !1;
        return !0
    };
    k.DebugDump = {};
    a.scope.dump = function(b) {
        return Document && b instanceof Document ? "<Document>" : Window && b instanceof Window ? "<Window>" : NodeList && b instanceof NodeList ? "<NodeList>" : HTMLCollection && b instanceof HTMLCollection ? "<HTMLCollection>" : Node && b instanceof Node ? "<Node>" : e.isDef(b) ? e.isNull(b) ? "null" : e.isNumber(b) ? (0, a.scope.dumpNumber)(b) : e.isString(b) ? (0, a.scope.dumpString)(b) : e.isArray(b) ? (0, a.scope.dumpArray)(b) : e.isFunction(b) ? (0, a.scope.dumpFunction)(b) : b instanceof ArrayBuffer ? (0, a.scope.dumpArrayBuffer)(b) : b instanceof
        Map ? (0, a.scope.dumpMap)(b) : b instanceof Set ? (0, a.scope.dumpSet)(b) : e.isObject(b) ? (0, a.scope.dumpObject)(b) : (0, a.scope.encodeJson)(b): "undefined"
    };
    a.scope.dumpObject = function(b) {
        var c = [];
        e.object.forEach(b, function(b, f) {
            c.push([f, b])
        });
        return "{" + (0, a.scope.dumpMappingItems)(c) + "}"
    };
    a.scope.dumpSet = function(b) {
        return "Set{" + (0, a.scope.dumpSequenceItems)(Array.from(b)) + "}"
    };
    a.scope.dumpMap = function(b) {
        return "Map{" + (0, a.scope.dumpMappingItems)(Array.from(b.entries())) + "}"
    };
    a.scope.dumpArrayBuffer = function(b) {
        return "ArrayBuffer[" + (0, a.scope.dumpSequenceItems)(new Uint8Array(b)) + "]"
    };
    a.scope.dumpFunction = function() {
        return "<Function>"
    };
    a.scope.dumpArray = function(b) {
        return "[" + (0, a.scope.dumpSequenceItems)(b) + "]"
    };
    a.scope.dumpString = function(b) {
        return '"' + b + '"'
    };
    a.scope.dumpNumber = function(b) {
        if (!isFinite(b)) return b.toString();
        if (!e.math.isInt(b)) return (0, a.scope.encodeJson)(b);
        var c = (0, a.scope.guessIntegerBitLength)(b);
        if (!c) return (0, a.scope.encodeJson)(b);
        0 > b && (b += Math.pow(2, c));
        b = b.toString(16).toUpperCase();
        return "0x" + e.string.repeat("0", c / 4 - b.length) + b
    };
    a.scope.dumpMappingItems = function(b) {
        b = e.array.map(b, function(b) {
            return k.DebugDump.dump(b[0]) + ": " + k.DebugDump.dump(b[1])
        });
        return e.iter.join(b, ", ")
    };
    a.scope.dumpSequenceItems = function(b) {
        b = e.iter.map(b, k.DebugDump.dump);
        return e.iter.join(b, ", ")
    };
    a.scope.guessIntegerBitLength = function(b) {
        var c = null;
        e.array.forEach([8, 32, 64], function(d) {
            var f = Math.pow(2, d); - Math.pow(2, d - 1) <= b && b < f && e.isNull(c) && (c = d)
        });
        return c
    };
    a.scope.encodeJson = function(b) {
        return e.json.serialize(b) || "null"
    };
    k.DebugDump.dump = function(b) {
        if (e.DEBUG) return (0, a.scope.dump)(b);
        try {
            return (0, a.scope.dump)(b)
        } catch (c) {
            return "<failed to dump the value>"
        }
    };
    k.DebugDump.debugDump = function(b) {
        return e.DEBUG ? k.DebugDump.dump(b) : "<stripped value>"
    };
    a.scope.FUNCTION_NAME_MESSAGE_KEY = "function_name";
    a.scope.ARGUMENTS_MESSAGE_KEY = "arguments";
    k.RemoteCallMessage = function(b, c) {
        this.functionName = b;
        this.functionArguments = c
    };
    k.RemoteCallMessage.parseRequestPayload = function(b) {
        return 2 == e.object.getCount(b) && e.object.containsKey(b, a.scope.FUNCTION_NAME_MESSAGE_KEY) && e.isString(b[a.scope.FUNCTION_NAME_MESSAGE_KEY]) && e.object.containsKey(b, a.scope.ARGUMENTS_MESSAGE_KEY) && e.isArray(b[a.scope.ARGUMENTS_MESSAGE_KEY]) ? new k.RemoteCallMessage(b[a.scope.FUNCTION_NAME_MESSAGE_KEY], b[a.scope.ARGUMENTS_MESSAGE_KEY]) : null
    };
    k.RemoteCallMessage.prototype.makeRequestPayload = function() {
        return e.object.create(a.scope.FUNCTION_NAME_MESSAGE_KEY, this.functionName, a.scope.ARGUMENTS_MESSAGE_KEY, this.functionArguments)
    };
    k.RemoteCallMessage.prototype.getDebugRepresentation = function() {
        return e.string.subs("%s(%s)", this.functionName, e.iter.join(e.iter.map(this.functionArguments, k.DebugDump.debugDump), ", "))
    };
    k.RequesterMessage = {};
    a.scope.REQUEST_MESSAGE_TYPE_SUFFIX = "::request";
    a.scope.RESPONSE_MESSAGE_TYPE_SUFFIX = "::response";
    a.scope.REQUEST_ID_MESSAGE_KEY = "request_id";
    a.scope.PAYLOAD_MESSAGE_KEY = "payload";
    a.scope.ERROR_MESSAGE_KEY = "error";
    k.RequesterMessage.getRequestMessageType = function(b) {
        return b + a.scope.REQUEST_MESSAGE_TYPE_SUFFIX
    };
    k.RequesterMessage.getResponseMessageType = function(b) {
        return b + a.scope.RESPONSE_MESSAGE_TYPE_SUFFIX
    };
    k.RequesterMessage.RequestMessageData = function(b, c) {
        this.requestId = b;
        this.payload = c
    };
    k.RequesterMessage.RequestMessageData.parseMessageData = function(b) {
        return 2 == e.object.getCount(b) && e.object.containsKey(b, a.scope.REQUEST_ID_MESSAGE_KEY) && e.isNumber(b[a.scope.REQUEST_ID_MESSAGE_KEY]) && e.object.containsKey(b, a.scope.PAYLOAD_MESSAGE_KEY) && e.isObject(b[a.scope.PAYLOAD_MESSAGE_KEY]) ? new k.RequesterMessage.RequestMessageData(b[a.scope.REQUEST_ID_MESSAGE_KEY], b[a.scope.PAYLOAD_MESSAGE_KEY]) : null
    };
    k.RequesterMessage.RequestMessageData.prototype.makeMessageData = function() {
        return e.object.create(a.scope.REQUEST_ID_MESSAGE_KEY, this.requestId, a.scope.PAYLOAD_MESSAGE_KEY, this.payload)
    };
    k.RequesterMessage.ResponseMessageData = function(b, c, d) {
        this.requestId = b;
        this.payload = c;
        this.errorMessage = d;
        k.Logging.checkWithLogger(this.logger, !e.isDef(c) || !e.isDef(d))
    };
    k.RequesterMessage.ResponseMessageData.prototype.logger = k.Logging.getScopedLogger("RequesterMessage.ResponseMessageData");
    k.RequesterMessage.ResponseMessageData.prototype.isSuccessful = function() {
        return !e.isDef(this.errorMessage)
    };
    k.RequesterMessage.ResponseMessageData.prototype.getPayload = function() {
        k.Logging.checkWithLogger(this.logger, this.isSuccessful());
        return this.payload
    };
    k.RequesterMessage.ResponseMessageData.prototype.getErrorMessage = function() {
        k.Logging.checkWithLogger(this.logger, !this.isSuccessful());
        k.Logging.checkWithLogger(this.logger, e.isString(this.errorMessage));
        e.asserts.assertString(this.errorMessage);
        return this.errorMessage
    };
    k.RequesterMessage.ResponseMessageData.parseMessageData = function(b) {
        if (2 != e.object.getCount(b) || !e.object.containsKey(b, a.scope.REQUEST_ID_MESSAGE_KEY) || !e.isNumber(b[a.scope.REQUEST_ID_MESSAGE_KEY])) return null;
        var c = b[a.scope.REQUEST_ID_MESSAGE_KEY];
        return e.object.containsKey(b, a.scope.PAYLOAD_MESSAGE_KEY) ? new k.RequesterMessage.ResponseMessageData(c, b[a.scope.PAYLOAD_MESSAGE_KEY]) : e.object.containsKey(b, a.scope.ERROR_MESSAGE_KEY) && e.isString(b[a.scope.ERROR_MESSAGE_KEY]) ? new k.RequesterMessage.ResponseMessageData(c,
            void 0, b[a.scope.ERROR_MESSAGE_KEY]) : null
    };
    k.RequesterMessage.ResponseMessageData.prototype.makeMessageData = function() {
        var b = [a.scope.REQUEST_ID_MESSAGE_KEY, this.requestId];
        this.isSuccessful() ? (b.push(a.scope.PAYLOAD_MESSAGE_KEY), b.push(this.getPayload())) : (b.push(a.scope.ERROR_MESSAGE_KEY), b.push(this.getErrorMessage()));
        return e.object.create(b)
    };
    e.disposable = {};
    e.disposable.IDisposable = function() {};
    e.disposable.IDisposable.prototype.dispose = e.abstractMethod;
    e.disposable.IDisposable.prototype.isDisposed = e.abstractMethod;
    e.Disposable = function() {
        e.Disposable.MONITORING_MODE != e.Disposable.MonitoringMode.OFF && (e.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), e.Disposable.instances_[e.getUid(this)] = this);
        this.disposed_ = this.disposed_;
        this.onDisposeCallbacks_ = this.onDisposeCallbacks_
    };
    e.Disposable.MonitoringMode = {
        OFF: 0,
        PERMANENT: 1,
        INTERACTIVE: 2
    };
    e.Disposable.MONITORING_MODE = 0;
    e.Disposable.INCLUDE_STACK_ON_CREATION = !0;
    e.Disposable.instances_ = {};
    e.Disposable.getUndisposedObjects = function() {
        var b = [],
            c;
        for (c in e.Disposable.instances_) e.Disposable.instances_.hasOwnProperty(c) && b.push(e.Disposable.instances_[Number(c)]);
        return b
    };
    e.Disposable.clearUndisposedObjects = function() {
        e.Disposable.instances_ = {}
    };
    e.Disposable.prototype.disposed_ = !1;
    e.Disposable.prototype.isDisposed = function() {
        return this.disposed_
    };
    e.Disposable.prototype.getDisposed = e.Disposable.prototype.isDisposed;
    e.Disposable.prototype.dispose = function() {
        if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), e.Disposable.MONITORING_MODE != e.Disposable.MonitoringMode.OFF)) {
            var b = e.getUid(this);
            if (e.Disposable.MONITORING_MODE == e.Disposable.MonitoringMode.PERMANENT && !e.Disposable.instances_.hasOwnProperty(b)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
            if (e.Disposable.MONITORING_MODE != e.Disposable.MonitoringMode.OFF && this.onDisposeCallbacks_ &&
                0 < this.onDisposeCallbacks_.length) throw Error(this + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");
            delete e.Disposable.instances_[b]
        }
    };
    e.Disposable.prototype.registerDisposable = function(b) {
        this.addOnDisposeCallback(e.partial(e.dispose, b))
    };
    e.Disposable.prototype.addOnDisposeCallback = function(b, c) {
        this.disposed_ ? e.isDef(c) ? b.call(c) : b() : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []), this.onDisposeCallbacks_.push(e.isDef(c) ? e.bind(b, c) : b))
    };
    e.Disposable.prototype.disposeInternal = function() {
        if (this.onDisposeCallbacks_)
            for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()()
    };
    e.Disposable.isDisposed = function(b) {
        return b && "function" == typeof b.isDisposed ? b.isDisposed() : !1
    };
    e.dispose = function(b) {
        b && "function" == typeof b.dispose && b.dispose()
    };
    e.disposeAll = function(b) {
        for (var c = 0, d = arguments.length; c < d; ++c) {
            var f = arguments[c];
            e.isArrayLike(f) ? e.disposeAll.apply(null, f) : e.dispose(f)
        }
    };
    e.Thenable = function() {};
    e.Thenable.prototype.then = function() {};
    e.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
    e.Thenable.addImplementation = function(b) {
        b.prototype.then = b.prototype.then;
        b.prototype[e.Thenable.IMPLEMENTED_BY_PROP] = !0
    };
    e.Thenable.isImplementedBy = function(b) {
        if (!b) return !1;
        try {
            return !!b[e.Thenable.IMPLEMENTED_BY_PROP]
        } catch (c) {
            return !1
        }
    };
    e.async = {};
    e.async.FreeList = function(b, c, d) {
        this.limit_ = d;
        this.create_ = b;
        this.reset_ = c;
        this.occupants_ = 0;
        this.head_ = null
    };
    e.async.FreeList.prototype.get = function() {
        if (0 < this.occupants_) {
            this.occupants_--;
            var b = this.head_;
            this.head_ = b.next;
            b.next = null
        } else b = this.create_();
        return b
    };
    e.async.FreeList.prototype.put = function(b) {
        this.reset_(b);
        this.occupants_ < this.limit_ && (this.occupants_++, b.next = this.head_, this.head_ = b)
    };
    e.async.FreeList.prototype.occupants = function() {
        return this.occupants_
    };
    e.async.WorkQueue = function() {
        this.workTail_ = this.workHead_ = null
    };
    e.async.WorkQueue.DEFAULT_MAX_UNUSED = 100;
    e.async.WorkQueue.freelist_ = new e.async.FreeList(function() {
        return new e.async.WorkItem
    }, function(b) {
        b.reset()
    }, e.async.WorkQueue.DEFAULT_MAX_UNUSED);
    e.async.WorkQueue.prototype.add = function(b, c) {
        var d = this.getUnusedItem_();
        d.set(b, c);
        this.workTail_ ? this.workTail_.next = d : (e.asserts.assert(!this.workHead_), this.workHead_ = d);
        this.workTail_ = d
    };
    e.async.WorkQueue.prototype.remove = function() {
        var b = null;
        this.workHead_ && (b = this.workHead_, this.workHead_ = this.workHead_.next, this.workHead_ || (this.workTail_ = null), b.next = null);
        return b
    };
    e.async.WorkQueue.prototype.returnUnused = function(b) {
        e.async.WorkQueue.freelist_.put(b)
    };
    e.async.WorkQueue.prototype.getUnusedItem_ = function() {
        return e.async.WorkQueue.freelist_.get()
    };
    e.async.WorkItem = function() {
        this.next = this.scope = this.fn = null
    };
    e.async.WorkItem.prototype.set = function(b, c) {
        this.fn = b;
        this.scope = c;
        this.next = null
    };
    e.async.WorkItem.prototype.reset = function() {
        this.next = this.scope = this.fn = null
    };
    e.debug.entryPointRegistry = {};
    e.debug.EntryPointMonitor = function() {};
    e.debug.entryPointRegistry.refList_ = [];
    e.debug.entryPointRegistry.monitors_ = [];
    e.debug.entryPointRegistry.monitorsMayExist_ = !1;
    e.debug.entryPointRegistry.register = function(b) {
        e.debug.entryPointRegistry.refList_[e.debug.entryPointRegistry.refList_.length] = b;
        if (e.debug.entryPointRegistry.monitorsMayExist_)
            for (var c = 0; c < e.debug.entryPointRegistry.monitors_.length; c++) b(e.bind(e.debug.entryPointRegistry.monitors_[c].wrap, e.debug.entryPointRegistry.monitors_[c]))
    };
    e.debug.entryPointRegistry.monitorAll = function(b) {
        e.debug.entryPointRegistry.monitorsMayExist_ = !0;
        for (var c = e.bind(b.wrap, b), d = 0; d < e.debug.entryPointRegistry.refList_.length; d++) e.debug.entryPointRegistry.refList_[d](c);
        e.debug.entryPointRegistry.monitors_.push(b)
    };
    e.debug.entryPointRegistry.unmonitorAllIfPossible = function(b) {
        e.asserts.assert(b == e.debug.entryPointRegistry.monitors_[e.debug.entryPointRegistry.monitors_.length - 1], "Only the most recent monitor can be unwrapped.");
        b = e.bind(b.unwrap, b);
        for (var c = 0; c < e.debug.entryPointRegistry.refList_.length; c++) e.debug.entryPointRegistry.refList_[c](b);
        e.debug.entryPointRegistry.monitors_.length--
    };
    e.async.throwException = function(b) {
        e.global.setTimeout(function() {
            throw b;
        }, 0)
    };
    e.async.nextTick = function(b, c, d) {
        var f = b;
        c && (f = e.bind(b, c));
        f = e.async.nextTick.wrapCallback_(f);
        e.isFunction(e.global.setImmediate) && (d || e.async.nextTick.useSetImmediate_()) ? e.global.setImmediate(f) : (e.async.nextTick.setImmediate_ || (e.async.nextTick.setImmediate_ = e.async.nextTick.getSetImmediateEmulator_()), e.async.nextTick.setImmediate_(f))
    };
    e.async.nextTick.useSetImmediate_ = function() {
        return e.global.Window && e.global.Window.prototype && !e.labs.userAgent.browser.matchEdge_() && e.global.Window.prototype.setImmediate == e.global.setImmediate ? !1 : !0
    };
    e.async.nextTick.getSetImmediateEmulator_ = function() {
        var b = e.global.MessageChannel;
        "undefined" === typeof b && "undefined" !== typeof window && window.postMessage && window.addEventListener && !e.labs.userAgent.engine.isPresto() && (b = function() {
            var b = document.createElement("IFRAME");
            b.style.display = "none";
            b.src = "";
            document.documentElement.appendChild(b);
            var c = b.contentWindow;
            b = c.document;
            b.open();
            b.write("");
            b.close();
            var d = "callImmediate" + Math.random(),
                f = "file:" == c.location.protocol ? "*" : c.location.protocol + "//" +
                c.location.host;
            b = e.bind(function(b) {
                if (("*" == f || b.origin == f) && b.data == d) this.port1.onmessage()
            }, this);
            c.addEventListener("message", b, !1);
            this.port1 = {};
            this.port2 = {
                postMessage: function() {
                    c.postMessage(d, f)
                }
            }
        });
        if ("undefined" !== typeof b && !e.labs.userAgent.browser.matchIE_()) {
            var c = new b,
                d = {},
                f = d;
            c.port1.onmessage = function() {
                if (e.isDef(d.next)) {
                    d = d.next;
                    var b = d.cb;
                    d.cb = null;
                    b()
                }
            };
            return function(b) {
                f.next = {
                    cb: b
                };
                f = f.next;
                c.port2.postMessage(0)
            }
        }
        return "undefined" !== typeof document && "onreadystatechange" in
            document.createElement("SCRIPT") ? function(b) {
                var c = document.createElement("SCRIPT");
                c.onreadystatechange = function() {
                    c.onreadystatechange = null;
                    c.parentNode.removeChild(c);
                    c = null;
                    b();
                    b = null
                };
                document.documentElement.appendChild(c)
            } : function(b) {
                e.global.setTimeout(b, 0)
            }
    };
    e.async.nextTick.wrapCallback_ = e.functions.identity;
    e.debug.entryPointRegistry.register(function(b) {
        e.async.nextTick.wrapCallback_ = b
    });
    e.async.run = function(b, c) {
        e.async.run.schedule_ || e.async.run.initializeRunner_();
        e.async.run.workQueueScheduled_ || (e.async.run.schedule_(), e.async.run.workQueueScheduled_ = !0);
        e.async.run.workQueue_.add(b, c)
    };
    e.async.run.initializeRunner_ = function() {
        if (e.global.Promise && e.global.Promise.resolve) {
            var b = e.global.Promise.resolve(void 0);
            e.async.run.schedule_ = function() {
                b.then(e.async.run.processWorkQueue)
            }
        } else e.async.run.schedule_ = function() {
            e.async.nextTick(e.async.run.processWorkQueue)
        }
    };
    e.async.run.forceNextTick = function(b) {
        e.async.run.schedule_ = function() {
            e.async.nextTick(e.async.run.processWorkQueue);
            b && b(e.async.run.processWorkQueue)
        }
    };
    e.async.run.workQueueScheduled_ = !1;
    e.async.run.workQueue_ = new e.async.WorkQueue;
    e.DEBUG && (e.async.run.resetQueue = function() {
        e.async.run.workQueueScheduled_ = !1;
        e.async.run.workQueue_ = new e.async.WorkQueue
    });
    e.async.run.processWorkQueue = function() {
        for (var b; b = e.async.run.workQueue_.remove();) {
            try {
                b.fn.call(b.scope)
            } catch (c) {
                e.async.throwException(c)
            }
            e.async.run.workQueue_.returnUnused(b)
        }
        e.async.run.workQueueScheduled_ = !1
    };
    e.promise = {};
    e.promise.Resolver = function() {};
    e.Promise = function(b, c) {
        this.state_ = e.Promise.State_.PENDING;
        this.result_ = void 0;
        this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
        this.executing_ = !1;
        0 < e.Promise.UNHANDLED_REJECTION_DELAY ? this.unhandledRejectionId_ = 0 : 0 == e.Promise.UNHANDLED_REJECTION_DELAY && (this.hadUnhandledRejection_ = !1);
        e.Promise.LONG_STACK_TRACES && (this.stack_ = [], this.addStackTrace_(Error("created")), this.currentStep_ = 0);
        if (b != e.nullFunction) try {
            var d = this;
            b.call(c, function(b) {
                d.resolve_(e.Promise.State_.FULFILLED,
                    b)
            }, function(b) {
                if (e.DEBUG && !(b instanceof e.Promise.CancellationError)) try {
                    if (b instanceof Error) throw b;
                    throw Error("Promise rejected.");
                } catch (g) {}
                d.resolve_(e.Promise.State_.REJECTED, b)
            })
        } catch (f) {
            this.resolve_(e.Promise.State_.REJECTED, f)
        }
    };
    e.Promise.LONG_STACK_TRACES = !1;
    e.Promise.UNHANDLED_REJECTION_DELAY = 0;
    e.Promise.State_ = {
        PENDING: 0,
        BLOCKED: 1,
        FULFILLED: 2,
        REJECTED: 3
    };
    e.Promise.CallbackEntry_ = function() {
        this.next = this.context = this.onRejected = this.onFulfilled = this.child = null;
        this.always = !1
    };
    e.Promise.CallbackEntry_.prototype.reset = function() {
        this.context = this.onRejected = this.onFulfilled = this.child = null;
        this.always = !1
    };
    e.Promise.DEFAULT_MAX_UNUSED = 100;
    e.Promise.freelist_ = new e.async.FreeList(function() {
        return new e.Promise.CallbackEntry_
    }, function(b) {
        b.reset()
    }, e.Promise.DEFAULT_MAX_UNUSED);
    e.Promise.getCallbackEntry_ = function(b, c, d) {
        var f = e.Promise.freelist_.get();
        f.onFulfilled = b;
        f.onRejected = c;
        f.context = d;
        return f
    };
    e.Promise.returnEntry_ = function(b) {
        e.Promise.freelist_.put(b)
    };
    e.Promise.resolve = function(b) {
        if (b instanceof e.Promise) return b;
        var c = new e.Promise(e.nullFunction);
        c.resolve_(e.Promise.State_.FULFILLED, b);
        return c
    };
    e.Promise.reject = function(b) {
        return new e.Promise(function(c, d) {
            d(b)
        })
    };
    e.Promise.resolveThen_ = function(b, c, d) {
        e.Promise.maybeThen_(b, c, d, null) || e.async.run(e.partial(c, b))
    };
    e.Promise.race = function(b) {
        return new e.Promise(function(c, d) {
            b.length || c(void 0);
            for (var f = 0, g; f < b.length; f++) g = b[f], e.Promise.resolveThen_(g, c, d)
        })
    };
    e.Promise.all = function(b) {
        return new e.Promise(function(c, d) {
            var f = b.length,
                g = [];
            if (f)
                for (var h = function(b, d) {
                        f--;
                        g[b] = d;
                        0 == f && c(g)
                    }, l = function(b) {
                        d(b)
                    }, m = 0, n; m < b.length; m++) n = b[m], e.Promise.resolveThen_(n, e.partial(h, m), l);
            else c(g)
        })
    };
    e.Promise.allSettled = function(b) {
        return new e.Promise(function(c) {
            var d = b.length,
                f = [];
            if (d)
                for (var g = function(b, g, h) {
                        d--;
                        f[b] = g ? {
                            fulfilled: !0,
                            value: h
                        } : {
                            fulfilled: !1,
                            reason: h
                        };
                        0 == d && c(f)
                    }, h = 0, l; h < b.length; h++) l = b[h], e.Promise.resolveThen_(l, e.partial(g, h, !0), e.partial(g, h, !1));
            else c(f)
        })
    };
    e.Promise.firstFulfilled = function(b) {
        return new e.Promise(function(c, d) {
            var f = b.length,
                g = [];
            if (f)
                for (var h = function(b) {
                        c(b)
                    }, l = function(b, c) {
                        f--;
                        g[b] = c;
                        0 == f && d(g)
                    }, m = 0, n; m < b.length; m++) n = b[m], e.Promise.resolveThen_(n, h, e.partial(l, m));
            else c(void 0)
        })
    };
    e.Promise.withResolver = function() {
        var b, c, d = new e.Promise(function(d, g) {
            b = d;
            c = g
        });
        return new e.Promise.Resolver_(d, b, c)
    };
    e.Promise.prototype.then = function(b, c, d) {
        null != b && e.asserts.assertFunction(b, "opt_onFulfilled should be a function.");
        null != c && e.asserts.assertFunction(c, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
        return this.addChildPromise_(e.isFunction(b) ? b : null, e.isFunction(c) ? c : null, d)
    };
    e.Thenable.addImplementation(e.Promise);
    e.Promise.prototype.thenVoid = function(b, c, d) {
        null != b && e.asserts.assertFunction(b, "opt_onFulfilled should be a function.");
        null != c && e.asserts.assertFunction(c, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
        this.addCallbackEntry_(e.Promise.getCallbackEntry_(b || e.nullFunction, c || null, d))
    };
    e.Promise.prototype.thenAlways = function(b, c) {
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("thenAlways"));
        b = e.Promise.getCallbackEntry_(b, b, c);
        b.always = !0;
        this.addCallbackEntry_(b);
        return this
    };
    e.Promise.prototype.thenCatch = function(b, c) {
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("thenCatch"));
        return this.addChildPromise_(null, b, c)
    };
    e.Promise.prototype.cancel = function(b) {
        this.state_ == e.Promise.State_.PENDING && e.async.run(function() {
            var c = new e.Promise.CancellationError(b);
            this.cancelInternal_(c)
        }, this)
    };
    e.Promise.prototype.cancelInternal_ = function(b) {
        this.state_ == e.Promise.State_.PENDING && (this.parent_ ? (this.parent_.cancelChild_(this, b), this.parent_ = null) : this.resolve_(e.Promise.State_.REJECTED, b))
    };
    e.Promise.prototype.cancelChild_ = function(b, c) {
        if (this.callbackEntries_) {
            for (var d = 0, f = null, g = null, h = this.callbackEntries_; h && (h.always || (d++, h.child == b && (f = h), !(f && 1 < d))); h = h.next) f || (g = h);
            f && (this.state_ == e.Promise.State_.PENDING && 1 == d ? this.cancelInternal_(c) : (g ? this.removeEntryAfter_(g) : this.popEntry_(), this.executeCallback_(f, e.Promise.State_.REJECTED, c)))
        }
    };
    e.Promise.prototype.addCallbackEntry_ = function(b) {
        this.hasEntry_() || this.state_ != e.Promise.State_.FULFILLED && this.state_ != e.Promise.State_.REJECTED || this.scheduleCallbacks_();
        this.queueEntry_(b)
    };
    e.Promise.prototype.addChildPromise_ = function(b, c, d) {
        var f = e.Promise.getCallbackEntry_(null, null, null);
        f.child = new e.Promise(function(g, h) {
            f.onFulfilled = b ? function(c) {
                try {
                    var f = b.call(d, c);
                    g(f)
                } catch (n) {
                    h(n)
                }
            } : g;
            f.onRejected = c ? function(b) {
                try {
                    var f = c.call(d, b);
                    !e.isDef(f) && b instanceof e.Promise.CancellationError ? h(b) : g(f)
                } catch (n) {
                    h(n)
                }
            } : h
        });
        f.child.parent_ = this;
        this.addCallbackEntry_(f);
        return f.child
    };
    e.Promise.prototype.unblockAndFulfill_ = function(b) {
        e.asserts.assert(this.state_ == e.Promise.State_.BLOCKED);
        this.state_ = e.Promise.State_.PENDING;
        this.resolve_(e.Promise.State_.FULFILLED, b)
    };
    e.Promise.prototype.unblockAndReject_ = function(b) {
        e.asserts.assert(this.state_ == e.Promise.State_.BLOCKED);
        this.state_ = e.Promise.State_.PENDING;
        this.resolve_(e.Promise.State_.REJECTED, b)
    };
    e.Promise.prototype.resolve_ = function(b, c) {
        this.state_ == e.Promise.State_.PENDING && (this === c && (b = e.Promise.State_.REJECTED, c = new TypeError("Promise cannot resolve to itself")), this.state_ = e.Promise.State_.BLOCKED, e.Promise.maybeThen_(c, this.unblockAndFulfill_, this.unblockAndReject_, this) || (this.result_ = c, this.state_ = b, this.parent_ = null, this.scheduleCallbacks_(), b != e.Promise.State_.REJECTED || c instanceof e.Promise.CancellationError || e.Promise.addUnhandledRejection_(this, c)))
    };
    e.Promise.maybeThen_ = function(b, c, d, f) {
        if (b instanceof e.Promise) return b.thenVoid(c, d, f), !0;
        if (e.Thenable.isImplementedBy(b)) return b.then(c, d, f), !0;
        if (e.isObject(b)) try {
            var g = b.then;
            if (e.isFunction(g)) return e.Promise.tryThen_(b, g, c, d, f), !0
        } catch (h) {
            return d.call(f, h), !0
        }
        return !1
    };
    e.Promise.tryThen_ = function(b, c, d, f, g) {
        function h(b) {
            m || (m = !0, f.call(g, b))
        }

        function l(b) {
            m || (m = !0, d.call(g, b))
        }
        var m = !1;
        try {
            c.call(b, l, h)
        } catch (n) {
            h(n)
        }
    };
    e.Promise.prototype.scheduleCallbacks_ = function() {
        this.executing_ || (this.executing_ = !0, e.async.run(this.executeCallbacks_, this))
    };
    e.Promise.prototype.hasEntry_ = function() {
        return !!this.callbackEntries_
    };
    e.Promise.prototype.queueEntry_ = function(b) {
        e.asserts.assert(null != b.onFulfilled);
        this.callbackEntriesTail_ ? this.callbackEntriesTail_.next = b : this.callbackEntries_ = b;
        this.callbackEntriesTail_ = b
    };
    e.Promise.prototype.popEntry_ = function() {
        var b = null;
        this.callbackEntries_ && (b = this.callbackEntries_, this.callbackEntries_ = b.next, b.next = null);
        this.callbackEntries_ || (this.callbackEntriesTail_ = null);
        null != b && e.asserts.assert(null != b.onFulfilled);
        return b
    };
    e.Promise.prototype.removeEntryAfter_ = function(b) {
        e.asserts.assert(this.callbackEntries_);
        e.asserts.assert(null != b);
        b.next == this.callbackEntriesTail_ && (this.callbackEntriesTail_ = b);
        b.next = b.next.next
    };
    e.Promise.prototype.executeCallbacks_ = function() {
        for (var b; b = this.popEntry_();) e.Promise.LONG_STACK_TRACES && this.currentStep_++, this.executeCallback_(b, this.state_, this.result_);
        this.executing_ = !1
    };
    e.Promise.prototype.executeCallback_ = function(b, c, d) {
        c == e.Promise.State_.REJECTED && b.onRejected && !b.always && this.removeUnhandledRejection_();
        if (b.child) b.child.parent_ = null, e.Promise.invokeCallback_(b, c, d);
        else try {
            b.always ? b.onFulfilled.call(b.context) : e.Promise.invokeCallback_(b, c, d)
        } catch (f) {
            e.Promise.handleRejection_.call(null, f)
        }
        e.Promise.returnEntry_(b)
    };
    e.Promise.invokeCallback_ = function(b, c, d) {
        c == e.Promise.State_.FULFILLED ? b.onFulfilled.call(b.context, d) : b.onRejected && b.onRejected.call(b.context, d)
    };
    e.Promise.prototype.addStackTrace_ = function(b) {
        if (e.Promise.LONG_STACK_TRACES && e.isString(b.stack)) {
            var c = b.stack.split("\n", 4)[3];
            b = b.message;
            b += Array(11 - b.length).join(" ");
            this.stack_.push(b + c)
        }
    };
    e.Promise.prototype.appendLongStack_ = function(b) {
        if (e.Promise.LONG_STACK_TRACES && b && e.isString(b.stack) && this.stack_.length) {
            for (var c = ["Promise trace:"], d = this; d; d = d.parent_) {
                for (var f = this.currentStep_; 0 <= f; f--) c.push(d.stack_[f]);
                c.push("Value: [" + (d.state_ == e.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] <" + String(d.result_) + ">")
            }
            b.stack += "\n\n" + c.join("\n")
        }
    };
    e.Promise.prototype.removeUnhandledRejection_ = function() {
        if (0 < e.Promise.UNHANDLED_REJECTION_DELAY)
            for (var b = this; b && b.unhandledRejectionId_; b = b.parent_) e.global.clearTimeout(b.unhandledRejectionId_), b.unhandledRejectionId_ = 0;
        else if (0 == e.Promise.UNHANDLED_REJECTION_DELAY)
            for (b = this; b && b.hadUnhandledRejection_; b = b.parent_) b.hadUnhandledRejection_ = !1
    };
    e.Promise.addUnhandledRejection_ = function(b, c) {
        0 < e.Promise.UNHANDLED_REJECTION_DELAY ? b.unhandledRejectionId_ = e.global.setTimeout(function() {
            b.appendLongStack_(c);
            e.Promise.handleRejection_.call(null, c)
        }, e.Promise.UNHANDLED_REJECTION_DELAY) : 0 == e.Promise.UNHANDLED_REJECTION_DELAY && (b.hadUnhandledRejection_ = !0, e.async.run(function() {
            b.hadUnhandledRejection_ && (b.appendLongStack_(c), e.Promise.handleRejection_.call(null, c))
        }))
    };
    e.Promise.handleRejection_ = e.async.throwException;
    e.Promise.setUnhandledRejectionHandler = function(b) {
        e.Promise.handleRejection_ = b
    };
    e.Promise.CancellationError = function(b) {
        e.debug.Error.call(this, b)
    };
    e.inherits(e.Promise.CancellationError, e.debug.Error);
    e.Promise.CancellationError.prototype.name = "cancel";
    e.Promise.Resolver_ = function(b, c, d) {
        this.promise = b;
        this.resolve = c;
        this.reject = d
    };
    e.messaging = {};
    e.messaging.MessageChannel = function() {};
    e.messaging.MessageChannel.prototype.connect = function() {};
    e.messaging.MessageChannel.prototype.isConnected = function() {};
    e.messaging.MessageChannel.prototype.registerService = function() {};
    e.messaging.MessageChannel.prototype.registerDefaultService = function() {};
    e.messaging.MessageChannel.prototype.send = function() {};
    e.messaging.AbstractChannel = function() {
        e.Disposable.call(this);
        this.services_ = {}
    };
    e.inherits(e.messaging.AbstractChannel, e.Disposable);
    e.messaging.AbstractChannel.prototype.logger = e.log.getLogger("goog.messaging.AbstractChannel");
    e.messaging.AbstractChannel.prototype.connect = function(b) {
        b && b()
    };
    e.messaging.AbstractChannel.prototype.isConnected = function() {
        return !0
    };
    e.messaging.AbstractChannel.prototype.registerService = function(b, c, d) {
        this.services_[b] = {
            callback: c,
            objectPayload: !!d
        }
    };
    e.messaging.AbstractChannel.prototype.registerDefaultService = function(b) {
        this.defaultService_ = b
    };
    e.messaging.AbstractChannel.prototype.send = e.abstractMethod;
    e.messaging.AbstractChannel.prototype.deliver = function(b, c) {
        var d = this.getService(b, c);
        d && (b = this.decodePayload(b, c, d.objectPayload), e.isDefAndNotNull(b) && d.callback(b))
    };
    e.messaging.AbstractChannel.prototype.getService = function(b, c) {
        var d = this.services_[b];
        if (d) return d;
        if (this.defaultService_) return b = e.partial(this.defaultService_, b), c = e.isObject(c), {
            callback: b,
            objectPayload: c
        };
        e.log.warning(this.logger, 'Unknown service name "' + b + '"');
        return null
    };
    e.messaging.AbstractChannel.prototype.decodePayload = function(b, c, d) {
        if (d && e.isString(c)) try {
            return JSON.parse(c)
        } catch (f) {
            return e.log.warning(this.logger, "Expected JSON payload for " + b + ', was "' + c + '"'), null
        } else if (!d && !e.isString(c)) return e.json.serialize(c);
        return c
    };
    e.messaging.AbstractChannel.prototype.disposeInternal = function() {
        e.messaging.AbstractChannel.superClass_.disposeInternal.call(this);
        delete this.services_;
        delete this.defaultService_
    };
    k.Requester = function(b, c) {
        e.Disposable.call(this);
        this.logger = k.Logging.getScopedLogger('Requester<"' + b + '">');
        this.name_ = b;
        this.messageChannel_ = c;
        this.requestIdGenerator_ = e.iter.count();
        this.requestIdToPromiseResolverMap_ = new Map;
        this.registerResponseMessagesService_();
        this.addChannelDisposedListener_()
    };
    e.inherits(k.Requester, e.Disposable);
    k.Requester.prototype.postRequest = function(b) {
        var c = this.requestIdGenerator_.next();
        this.logger.fine("Starting a request with identifier " + c + ", the payload is: " + k.DebugDump.debugDump(b));
        var d = e.Promise.withResolver();
        if (this.isDisposed()) return this.rejectRequest_(c, "The requester is already disposed"), d.promise;
        k.Logging.checkWithLogger(this.logger, !this.requestIdToPromiseResolverMap_.has(c));
        this.requestIdToPromiseResolverMap_.set(c, d);
        b = (new k.RequesterMessage.RequestMessageData(c, b)).makeMessageData();
        c = k.RequesterMessage.getRequestMessageType(this.name_);
        this.messageChannel_.send(c, b);
        return d.promise
    };
    k.Requester.prototype.disposeInternal = function() {
        var b = Array.from(this.requestIdToPromiseResolverMap_.keys());
        e.array.sort(b);
        e.array.forEach(b, function(b) {
            this.rejectRequest_(e.string.parseInt(b), "The requester is disposed")
        }, this);
        this.messageChannel_ = this.requestIdToPromiseResolverMap_ = null;
        this.logger.fine("Disposed");
        k.Requester.superClass_.disposeInternal.call(this)
    };
    k.Requester.prototype.registerResponseMessagesService_ = function() {
        var b = k.RequesterMessage.getResponseMessageType(this.name_);
        this.messageChannel_.registerService(b, this.responseMessageReceivedListener_.bind(this), !0)
    };
    k.Requester.prototype.addChannelDisposedListener_ = function() {
        this.messageChannel_.addOnDisposeCallback(this.channelDisposedListener_.bind(this))
    };
    k.Requester.prototype.channelDisposedListener_ = function() {
        this.isDisposed() || (this.logger.info("Message channel was disposed, disposing..."), this.dispose())
    };
    k.Requester.prototype.responseMessageReceivedListener_ = function(b) {
        k.Logging.checkWithLogger(this.logger, e.isObject(b));
        e.asserts.assertObject(b);
        if (!this.isDisposed()) {
            var c = k.RequesterMessage.ResponseMessageData.parseMessageData(b);
            e.isNull(c) && k.Logging.failWithLogger(this.logger, "Failed to parse the received response message: " + k.DebugDump.debugDump(b));
            b = c.requestId;
            this.requestIdToPromiseResolverMap_.has(b) || k.Logging.failWithLogger(this.logger, "Received a response for unknown request with identifier " +
                b);
            c.isSuccessful() ? this.resolveRequest_(b, c.getPayload()) : this.rejectRequest_(b, c.getErrorMessage())
        }
    };
    k.Requester.prototype.resolveRequest_ = function(b, c) {
        this.logger.fine("The request with identifier " + b + " succeeded with the following result: " + k.DebugDump.debugDump(c));
        this.popRequestPromiseResolver_(b).resolve(c)
    };
    k.Requester.prototype.rejectRequest_ = function(b, c) {
        this.logger.fine("The request with identifier " + b + " failed: " + c);
        this.popRequestPromiseResolver_(b).reject(Error(c))
    };
    k.Requester.prototype.popRequestPromiseResolver_ = function(b) {
        var c = this.requestIdToPromiseResolverMap_.get(b);
        k.Logging.checkWithLogger(this.logger, e.isDef(c));
        this.requestIdToPromiseResolverMap_.delete(b);
        return c
    };
    k.PcscLiteClient = {};
    k.PcscLiteClient.API = function(b) {
        e.Disposable.call(this);
        this.logger = k.Logging.getScopedLogger("PcscLiteClient.API");
        this.messageChannel_ = b;
        this.messageChannel_.addOnDisposeCallback(this.messageChannelDisposedListener_.bind(this));
        this.requester_ = new k.Requester(k.PcscLiteCommon.Constants.REQUESTER_TITLE, this.messageChannel_);
        this.logger.fine("Initialized")
    };
    e.inherits(k.PcscLiteClient.API, e.Disposable);
    e.exportSymbol("GoogleSmartCard.PcscLiteClient.API", k.PcscLiteClient.API);
    k.PcscLiteClient.API.MAX_ATR_SIZE = 33;
    e.exportProperty(k.PcscLiteClient.API, "MAX_ATR_SIZE", k.PcscLiteClient.API.MAX_ATR_SIZE);
    k.PcscLiteClient.API.SCARD_S_SUCCESS = (0, k.FixedSizeInteger.castToInt32)(0);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_S_SUCCESS", k.PcscLiteClient.API.SCARD_S_SUCCESS);
    k.PcscLiteClient.API.SCARD_F_INTERNAL_ERROR = (0, k.FixedSizeInteger.castToInt32)(2148532225);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_INTERNAL_ERROR", k.PcscLiteClient.API.SCARD_F_INTERNAL_ERROR);
    k.PcscLiteClient.API.SCARD_E_CANCELLED = (0, k.FixedSizeInteger.castToInt32)(2148532226);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CANCELLED", k.PcscLiteClient.API.SCARD_E_CANCELLED);
    k.PcscLiteClient.API.SCARD_E_INVALID_HANDLE = (0, k.FixedSizeInteger.castToInt32)(2148532227);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_HANDLE", k.PcscLiteClient.API.SCARD_E_INVALID_HANDLE);
    k.PcscLiteClient.API.SCARD_E_INVALID_PARAMETER = (0, k.FixedSizeInteger.castToInt32)(2148532228);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_PARAMETER", k.PcscLiteClient.API.SCARD_E_INVALID_PARAMETER);
    k.PcscLiteClient.API.SCARD_E_INVALID_TARGET = (0, k.FixedSizeInteger.castToInt32)(2148532229);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_TARGET", k.PcscLiteClient.API.SCARD_E_INVALID_TARGET);
    k.PcscLiteClient.API.SCARD_E_NO_MEMORY = (0, k.FixedSizeInteger.castToInt32)(2148532230);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_MEMORY", k.PcscLiteClient.API.SCARD_E_NO_MEMORY);
    k.PcscLiteClient.API.SCARD_F_WAITED_TOO_LONG = (0, k.FixedSizeInteger.castToInt32)(2148532231);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_WAITED_TOO_LONG", k.PcscLiteClient.API.SCARD_F_WAITED_TOO_LONG);
    k.PcscLiteClient.API.SCARD_E_INSUFFICIENT_BUFFER = (0, k.FixedSizeInteger.castToInt32)(2148532232);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INSUFFICIENT_BUFFER", k.PcscLiteClient.API.SCARD_E_INSUFFICIENT_BUFFER);
    k.PcscLiteClient.API.SCARD_E_UNKNOWN_READER = (0, k.FixedSizeInteger.castToInt32)(2148532233);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNKNOWN_READER", k.PcscLiteClient.API.SCARD_E_UNKNOWN_READER);
    k.PcscLiteClient.API.SCARD_E_TIMEOUT = (0, k.FixedSizeInteger.castToInt32)(2148532234);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_TIMEOUT", k.PcscLiteClient.API.SCARD_E_TIMEOUT);
    k.PcscLiteClient.API.SCARD_E_SHARING_VIOLATION = (0, k.FixedSizeInteger.castToInt32)(2148532235);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SHARING_VIOLATION", k.PcscLiteClient.API.SCARD_E_SHARING_VIOLATION);
    k.PcscLiteClient.API.SCARD_E_NO_SMARTCARD = (0, k.FixedSizeInteger.castToInt32)(2148532236);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_SMARTCARD", k.PcscLiteClient.API.SCARD_E_NO_SMARTCARD);
    k.PcscLiteClient.API.SCARD_E_UNKNOWN_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532237);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNKNOWN_CARD", k.PcscLiteClient.API.SCARD_E_UNKNOWN_CARD);
    k.PcscLiteClient.API.SCARD_E_CANT_DISPOSE = (0, k.FixedSizeInteger.castToInt32)(2148532238);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CANT_DISPOSE", k.PcscLiteClient.API.SCARD_E_CANT_DISPOSE);
    k.PcscLiteClient.API.SCARD_E_PROTO_MISMATCH = (0, k.FixedSizeInteger.castToInt32)(2148532239);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_PROTO_MISMATCH", k.PcscLiteClient.API.SCARD_E_PROTO_MISMATCH);
    k.PcscLiteClient.API.SCARD_E_NOT_READY = (0, k.FixedSizeInteger.castToInt32)(2148532240);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NOT_READY", k.PcscLiteClient.API.SCARD_E_NOT_READY);
    k.PcscLiteClient.API.SCARD_E_INVALID_VALUE = (0, k.FixedSizeInteger.castToInt32)(2148532241);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_VALUE", k.PcscLiteClient.API.SCARD_E_INVALID_VALUE);
    k.PcscLiteClient.API.SCARD_E_SYSTEM_CANCELLED = (0, k.FixedSizeInteger.castToInt32)(2148532242);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SYSTEM_CANCELLED", k.PcscLiteClient.API.SCARD_E_SYSTEM_CANCELLED);
    k.PcscLiteClient.API.SCARD_F_COMM_ERROR = (0, k.FixedSizeInteger.castToInt32)(2148532243);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_COMM_ERROR", k.PcscLiteClient.API.SCARD_F_COMM_ERROR);
    k.PcscLiteClient.API.SCARD_F_UNKNOWN_ERROR = (0, k.FixedSizeInteger.castToInt32)(2148532244);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_UNKNOWN_ERROR", k.PcscLiteClient.API.SCARD_F_UNKNOWN_ERROR);
    k.PcscLiteClient.API.SCARD_E_INVALID_ATR = (0, k.FixedSizeInteger.castToInt32)(2148532245);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_ATR", k.PcscLiteClient.API.SCARD_E_INVALID_ATR);
    k.PcscLiteClient.API.SCARD_E_NOT_TRANSACTED = (0, k.FixedSizeInteger.castToInt32)(2148532246);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NOT_TRANSACTED", k.PcscLiteClient.API.SCARD_E_NOT_TRANSACTED);
    k.PcscLiteClient.API.SCARD_E_READER_UNAVAILABLE = (0, k.FixedSizeInteger.castToInt32)(2148532247);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_READER_UNAVAILABLE", k.PcscLiteClient.API.SCARD_E_READER_UNAVAILABLE);
    k.PcscLiteClient.API.SCARD_P_SHUTDOWN = (0, k.FixedSizeInteger.castToInt32)(2148532248);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_P_SHUTDOWN", k.PcscLiteClient.API.SCARD_P_SHUTDOWN);
    k.PcscLiteClient.API.SCARD_E_PCI_TOO_SMALL = (0, k.FixedSizeInteger.castToInt32)(2148532249);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_PCI_TOO_SMALL", k.PcscLiteClient.API.SCARD_E_PCI_TOO_SMALL);
    k.PcscLiteClient.API.SCARD_E_READER_UNSUPPORTED = (0, k.FixedSizeInteger.castToInt32)(2148532250);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_READER_UNSUPPORTED", k.PcscLiteClient.API.SCARD_E_READER_UNSUPPORTED);
    k.PcscLiteClient.API.SCARD_E_DUPLICATE_READER = (0, k.FixedSizeInteger.castToInt32)(2148532251);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_DUPLICATE_READER", k.PcscLiteClient.API.SCARD_E_DUPLICATE_READER);
    k.PcscLiteClient.API.SCARD_E_CARD_UNSUPPORTED = (0, k.FixedSizeInteger.castToInt32)(2148532252);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CARD_UNSUPPORTED", k.PcscLiteClient.API.SCARD_E_CARD_UNSUPPORTED);
    k.PcscLiteClient.API.SCARD_E_NO_SERVICE = (0, k.FixedSizeInteger.castToInt32)(2148532253);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_SERVICE", k.PcscLiteClient.API.SCARD_E_NO_SERVICE);
    k.PcscLiteClient.API.SCARD_E_SERVICE_STOPPED = (0, k.FixedSizeInteger.castToInt32)(2148532254);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SERVICE_STOPPED", k.PcscLiteClient.API.SCARD_E_SERVICE_STOPPED);
    k.PcscLiteClient.API.SCARD_E_UNEXPECTED = (0, k.FixedSizeInteger.castToInt32)(2148532255);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNEXPECTED", k.PcscLiteClient.API.SCARD_E_UNEXPECTED);
    k.PcscLiteClient.API.SCARD_E_UNSUPPORTED_FEATURE = (0, k.FixedSizeInteger.castToInt32)(2148532255);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNSUPPORTED_FEATURE", k.PcscLiteClient.API.SCARD_E_UNSUPPORTED_FEATURE);
    k.PcscLiteClient.API.SCARD_E_ICC_INSTALLATION = (0, k.FixedSizeInteger.castToInt32)(2148532256);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_ICC_INSTALLATION", k.PcscLiteClient.API.SCARD_E_ICC_INSTALLATION);
    k.PcscLiteClient.API.SCARD_E_ICC_CREATEORDER = (0, k.FixedSizeInteger.castToInt32)(2148532257);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_ICC_CREATEORDER", k.PcscLiteClient.API.SCARD_E_ICC_CREATEORDER);
    k.PcscLiteClient.API.SCARD_E_DIR_NOT_FOUND = (0, k.FixedSizeInteger.castToInt32)(2148532259);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_DIR_NOT_FOUND", k.PcscLiteClient.API.SCARD_E_DIR_NOT_FOUND);
    k.PcscLiteClient.API.SCARD_E_FILE_NOT_FOUND = (0, k.FixedSizeInteger.castToInt32)(2148532260);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_FILE_NOT_FOUND", k.PcscLiteClient.API.SCARD_E_FILE_NOT_FOUND);
    k.PcscLiteClient.API.SCARD_E_NO_DIR = (0, k.FixedSizeInteger.castToInt32)(2148532261);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_DIR", k.PcscLiteClient.API.SCARD_E_NO_DIR);
    k.PcscLiteClient.API.SCARD_E_NO_FILE = (0, k.FixedSizeInteger.castToInt32)(2148532262);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_FILE", k.PcscLiteClient.API.SCARD_E_NO_FILE);
    k.PcscLiteClient.API.SCARD_E_NO_ACCESS = (0, k.FixedSizeInteger.castToInt32)(2148532263);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_ACCESS", k.PcscLiteClient.API.SCARD_E_NO_ACCESS);
    k.PcscLiteClient.API.SCARD_E_WRITE_TOO_MANY = (0, k.FixedSizeInteger.castToInt32)(2148532264);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_WRITE_TOO_MANY", k.PcscLiteClient.API.SCARD_E_WRITE_TOO_MANY);
    k.PcscLiteClient.API.SCARD_E_BAD_SEEK = (0, k.FixedSizeInteger.castToInt32)(2148532265);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_BAD_SEEK", k.PcscLiteClient.API.SCARD_E_BAD_SEEK);
    k.PcscLiteClient.API.SCARD_E_INVALID_CHV = (0, k.FixedSizeInteger.castToInt32)(2148532266);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_CHV", k.PcscLiteClient.API.SCARD_E_INVALID_CHV);
    k.PcscLiteClient.API.SCARD_E_UNKNOWN_RES_MNG = (0, k.FixedSizeInteger.castToInt32)(2148532267);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNKNOWN_RES_MNG", k.PcscLiteClient.API.SCARD_E_UNKNOWN_RES_MNG);
    k.PcscLiteClient.API.SCARD_E_NO_SUCH_CERTIFICATE = (0, k.FixedSizeInteger.castToInt32)(2148532268);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_SUCH_CERTIFICATE", k.PcscLiteClient.API.SCARD_E_NO_SUCH_CERTIFICATE);
    k.PcscLiteClient.API.SCARD_E_CERTIFICATE_UNAVAILABLE = (0, k.FixedSizeInteger.castToInt32)(2148532269);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CERTIFICATE_UNAVAILABLE", k.PcscLiteClient.API.SCARD_E_CERTIFICATE_UNAVAILABLE);
    k.PcscLiteClient.API.SCARD_E_NO_READERS_AVAILABLE = (0, k.FixedSizeInteger.castToInt32)(2148532270);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_READERS_AVAILABLE", k.PcscLiteClient.API.SCARD_E_NO_READERS_AVAILABLE);
    k.PcscLiteClient.API.SCARD_E_COMM_DATA_LOST = (0, k.FixedSizeInteger.castToInt32)(2148532271);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_COMM_DATA_LOST", k.PcscLiteClient.API.SCARD_E_COMM_DATA_LOST);
    k.PcscLiteClient.API.SCARD_E_NO_KEY_CONTAINER = (0, k.FixedSizeInteger.castToInt32)(2148532272);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_KEY_CONTAINER", k.PcscLiteClient.API.SCARD_E_NO_KEY_CONTAINER);
    k.PcscLiteClient.API.SCARD_E_SERVER_TOO_BUSY = (0, k.FixedSizeInteger.castToInt32)(2148532273);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SERVER_TOO_BUSY", k.PcscLiteClient.API.SCARD_E_SERVER_TOO_BUSY);
    k.PcscLiteClient.API.SCARD_W_UNSUPPORTED_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532325);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_UNSUPPORTED_CARD", k.PcscLiteClient.API.SCARD_W_UNSUPPORTED_CARD);
    k.PcscLiteClient.API.SCARD_W_UNRESPONSIVE_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532326);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_UNRESPONSIVE_CARD", k.PcscLiteClient.API.SCARD_W_UNRESPONSIVE_CARD);
    k.PcscLiteClient.API.SCARD_W_UNPOWERED_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532327);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_UNPOWERED_CARD", k.PcscLiteClient.API.SCARD_W_UNPOWERED_CARD);
    k.PcscLiteClient.API.SCARD_W_RESET_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532328);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_RESET_CARD", k.PcscLiteClient.API.SCARD_W_RESET_CARD);
    k.PcscLiteClient.API.SCARD_W_REMOVED_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532329);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_REMOVED_CARD", k.PcscLiteClient.API.SCARD_W_REMOVED_CARD);
    k.PcscLiteClient.API.SCARD_W_SECURITY_VIOLATION = (0, k.FixedSizeInteger.castToInt32)(2148532330);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_SECURITY_VIOLATION", k.PcscLiteClient.API.SCARD_W_SECURITY_VIOLATION);
    k.PcscLiteClient.API.SCARD_W_WRONG_CHV = (0, k.FixedSizeInteger.castToInt32)(2148532331);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_WRONG_CHV", k.PcscLiteClient.API.SCARD_W_WRONG_CHV);
    k.PcscLiteClient.API.SCARD_W_CHV_BLOCKED = (0, k.FixedSizeInteger.castToInt32)(2148532332);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_CHV_BLOCKED", k.PcscLiteClient.API.SCARD_W_CHV_BLOCKED);
    k.PcscLiteClient.API.SCARD_W_EOF = (0, k.FixedSizeInteger.castToInt32)(2148532333);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_EOF", k.PcscLiteClient.API.SCARD_W_EOF);
    k.PcscLiteClient.API.SCARD_W_CANCELLED_BY_USER = (0, k.FixedSizeInteger.castToInt32)(2148532334);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_CANCELLED_BY_USER", k.PcscLiteClient.API.SCARD_W_CANCELLED_BY_USER);
    k.PcscLiteClient.API.SCARD_W_CARD_NOT_AUTHENTICATED = (0, k.FixedSizeInteger.castToInt32)(2148532335);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_CARD_NOT_AUTHENTICATED", k.PcscLiteClient.API.SCARD_W_CARD_NOT_AUTHENTICATED);
    k.PcscLiteClient.API.SCARD_AUTOALLOCATE = (0, k.FixedSizeInteger.castToInt32)(4294967295);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_AUTOALLOCATE", k.PcscLiteClient.API.SCARD_AUTOALLOCATE);
    k.PcscLiteClient.API.SCARD_SCOPE_USER = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SCOPE_USER", k.PcscLiteClient.API.SCARD_SCOPE_USER);
    k.PcscLiteClient.API.SCARD_SCOPE_TERMINAL = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SCOPE_TERMINAL", k.PcscLiteClient.API.SCARD_SCOPE_TERMINAL);
    k.PcscLiteClient.API.SCARD_SCOPE_SYSTEM = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SCOPE_SYSTEM", k.PcscLiteClient.API.SCARD_SCOPE_SYSTEM);
    k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_UNDEFINED", k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED);
    k.PcscLiteClient.API.SCARD_PROTOCOL_UNSET = k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_UNSET", k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED);
    k.PcscLiteClient.API.SCARD_PROTOCOL_T0 = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_T0", k.PcscLiteClient.API.SCARD_PROTOCOL_T0);
    k.PcscLiteClient.API.SCARD_PROTOCOL_T1 = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_T1", k.PcscLiteClient.API.SCARD_PROTOCOL_T1);
    k.PcscLiteClient.API.SCARD_PROTOCOL_RAW = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_RAW", k.PcscLiteClient.API.SCARD_PROTOCOL_RAW);
    k.PcscLiteClient.API.SCARD_PROTOCOL_T15 = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_T15", k.PcscLiteClient.API.SCARD_PROTOCOL_T15);
    k.PcscLiteClient.API.SCARD_PROTOCOL_ANY = k.PcscLiteClient.API.SCARD_PROTOCOL_T0 | k.PcscLiteClient.API.SCARD_PROTOCOL_T1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_ANY", k.PcscLiteClient.API.SCARD_PROTOCOL_ANY);
    k.PcscLiteClient.API.SCARD_SHARE_EXCLUSIVE = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SHARE_EXCLUSIVE", k.PcscLiteClient.API.SCARD_SHARE_EXCLUSIVE);
    k.PcscLiteClient.API.SCARD_SHARE_SHARED = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SHARE_SHARED", k.PcscLiteClient.API.SCARD_SHARE_SHARED);
    k.PcscLiteClient.API.SCARD_SHARE_DIRECT = 3;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SHARE_DIRECT", k.PcscLiteClient.API.SCARD_SHARE_DIRECT);
    k.PcscLiteClient.API.SCARD_LEAVE_CARD = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_LEAVE_CARD", k.PcscLiteClient.API.SCARD_LEAVE_CARD);
    k.PcscLiteClient.API.SCARD_RESET_CARD = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_RESET_CARD", k.PcscLiteClient.API.SCARD_RESET_CARD);
    k.PcscLiteClient.API.SCARD_UNPOWER_CARD = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_UNPOWER_CARD", k.PcscLiteClient.API.SCARD_UNPOWER_CARD);
    k.PcscLiteClient.API.SCARD_EJECT_CARD = 3;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_EJECT_CARD", k.PcscLiteClient.API.SCARD_EJECT_CARD);
    k.PcscLiteClient.API.SCARD_UNKNOWN = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_UNKNOWN", k.PcscLiteClient.API.SCARD_UNKNOWN);
    k.PcscLiteClient.API.SCARD_ABSENT = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ABSENT", k.PcscLiteClient.API.SCARD_ABSENT);
    k.PcscLiteClient.API.SCARD_PRESENT = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PRESENT", k.PcscLiteClient.API.SCARD_PRESENT);
    k.PcscLiteClient.API.SCARD_SWALLOWED = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SWALLOWED", k.PcscLiteClient.API.SCARD_SWALLOWED);
    k.PcscLiteClient.API.SCARD_POWERED = 16;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_POWERED", k.PcscLiteClient.API.SCARD_POWERED);
    k.PcscLiteClient.API.SCARD_NEGOTIABLE = 32;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_NEGOTIABLE", k.PcscLiteClient.API.SCARD_NEGOTIABLE);
    k.PcscLiteClient.API.SCARD_SPECIFIC = 64;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SPECIFIC", k.PcscLiteClient.API.SCARD_SPECIFIC);
    k.PcscLiteClient.API.SCARD_STATE_UNAWARE = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNAWARE", k.PcscLiteClient.API.SCARD_STATE_UNAWARE);
    k.PcscLiteClient.API.SCARD_STATE_IGNORE = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_IGNORE", k.PcscLiteClient.API.SCARD_STATE_IGNORE);
    k.PcscLiteClient.API.SCARD_STATE_CHANGED = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_CHANGED", k.PcscLiteClient.API.SCARD_STATE_CHANGED);
    k.PcscLiteClient.API.SCARD_STATE_UNKNOWN = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNKNOWN", k.PcscLiteClient.API.SCARD_STATE_UNKNOWN);
    k.PcscLiteClient.API.SCARD_STATE_UNAVAILABLE = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNAVAILABLE", k.PcscLiteClient.API.SCARD_STATE_UNAVAILABLE);
    k.PcscLiteClient.API.SCARD_STATE_EMPTY = 16;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_EMPTY", k.PcscLiteClient.API.SCARD_STATE_EMPTY);
    k.PcscLiteClient.API.SCARD_STATE_PRESENT = 32;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_PRESENT", k.PcscLiteClient.API.SCARD_STATE_PRESENT);
    k.PcscLiteClient.API.SCARD_STATE_ATRMATCH = 64;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_ATRMATCH", k.PcscLiteClient.API.SCARD_STATE_ATRMATCH);
    k.PcscLiteClient.API.SCARD_STATE_EXCLUSIVE = 128;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_EXCLUSIVE", k.PcscLiteClient.API.SCARD_STATE_EXCLUSIVE);
    k.PcscLiteClient.API.SCARD_STATE_INUSE = 256;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_INUSE", k.PcscLiteClient.API.SCARD_STATE_INUSE);
    k.PcscLiteClient.API.SCARD_STATE_MUTE = 512;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_MUTE", k.PcscLiteClient.API.SCARD_STATE_MUTE);
    k.PcscLiteClient.API.SCARD_STATE_UNPOWERED = 1024;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNPOWERED", k.PcscLiteClient.API.SCARD_STATE_UNPOWERED);
    k.PcscLiteClient.API.INFINITE = 4294967295;
    e.exportProperty(k.PcscLiteClient.API, "INFINITE", k.PcscLiteClient.API.INFINITE);
    k.PcscLiteClient.API.PCSCLITE_MAX_READERS_CONTEXTS = 16;
    e.exportProperty(k.PcscLiteClient.API, "PCSCLITE_MAX_READERS_CONTEXTS", k.PcscLiteClient.API.PCSCLITE_MAX_READERS_CONTEXTS);
    k.PcscLiteClient.API.MAX_READERNAME = 128;
    e.exportProperty(k.PcscLiteClient.API, "MAX_READERNAME", k.PcscLiteClient.API.MAX_READERNAME);
    k.PcscLiteClient.API.SCARD_ATR_LENGTH = k.PcscLiteClient.API.MAX_ATR_SIZE;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATR_LENGTH", k.PcscLiteClient.API.MAX_ATR_SIZE);
    k.PcscLiteClient.API.MAX_BUFFER_SIZE = 264;
    e.exportProperty(k.PcscLiteClient.API, "MAX_BUFFER_SIZE", k.PcscLiteClient.API.MAX_BUFFER_SIZE);
    k.PcscLiteClient.API.MAX_BUFFER_SIZE_EXTENDED = 65548;
    e.exportProperty(k.PcscLiteClient.API, "MAX_BUFFER_SIZE_EXTENDED", k.PcscLiteClient.API.MAX_BUFFER_SIZE_EXTENDED);
    k.PcscLiteClient.API.SCARD_ATTR_VALUE = function(b, c) {
        return b << 16 | c
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VALUE", k.PcscLiteClient.API.SCARD_ATTR_VALUE);
    k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_VENDOR_INFO", k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO);
    k.PcscLiteClient.API.SCARD_CLASS_COMMUNICATIONS = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_COMMUNICATIONS", k.PcscLiteClient.API.SCARD_CLASS_COMMUNICATIONS);
    k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL = 3;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_PROTOCOL", k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL);
    k.PcscLiteClient.API.SCARD_CLASS_POWER_MGMT = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_POWER_MGMT", k.PcscLiteClient.API.SCARD_CLASS_POWER_MGMT);
    k.PcscLiteClient.API.SCARD_CLASS_SECURITY = 5;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_SECURITY", k.PcscLiteClient.API.SCARD_CLASS_SECURITY);
    k.PcscLiteClient.API.SCARD_CLASS_MECHANICAL = 6;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_MECHANICAL", k.PcscLiteClient.API.SCARD_CLASS_MECHANICAL);
    k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED = 7;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_VENDOR_DEFINED", k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED);
    k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_IFD_PROTOCOL", k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL);
    k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE = 9;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_ICC_STATE", k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE);
    k.PcscLiteClient.API.SCARD_CLASS_SYSTEM = 32767;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_SYSTEM", k.PcscLiteClient.API.SCARD_CLASS_SYSTEM);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_NAME = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 256);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_NAME", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_NAME);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_TYPE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 257);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_IFD_TYPE", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_TYPE);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_VERSION = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 258);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_IFD_VERSION", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_VERSION);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_SERIAL_NO = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 259);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_IFD_SERIAL_NO", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_SERIAL_NO);
    k.PcscLiteClient.API.SCARD_ATTR_CHANNEL_ID = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_COMMUNICATIONS, 272);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CHANNEL_ID", k.PcscLiteClient.API.SCARD_ATTR_CHANNEL_ID);
    k.PcscLiteClient.API.SCARD_ATTR_ASYNC_PROTOCOL_TYPES = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 288);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ASYNC_PROTOCOL_TYPES", k.PcscLiteClient.API.SCARD_ATTR_ASYNC_PROTOCOL_TYPES);
    k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_CLK = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 289);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEFAULT_CLK", k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_CLK);
    k.PcscLiteClient.API.SCARD_ATTR_MAX_CLK = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 290);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAX_CLK", k.PcscLiteClient.API.SCARD_ATTR_MAX_CLK);
    k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_DATA_RATE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 291);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEFAULT_DATA_RATE", k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_DATA_RATE);
    k.PcscLiteClient.API.SCARD_ATTR_MAX_DATA_RATE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 292);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAX_DATA_RATE", k.PcscLiteClient.API.SCARD_ATTR_MAX_DATA_RATE);
    k.PcscLiteClient.API.SCARD_ATTR_MAX_IFSD = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 293);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAX_IFSD", k.PcscLiteClient.API.SCARD_ATTR_MAX_IFSD);
    k.PcscLiteClient.API.SCARD_ATTR_SYNC_PROTOCOL_TYPES = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 294);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_SYNC_PROTOCOL_TYPES", k.PcscLiteClient.API.SCARD_ATTR_SYNC_PROTOCOL_TYPES);
    k.PcscLiteClient.API.SCARD_ATTR_POWER_MGMT_SUPPORT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_POWER_MGMT, 305);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_POWER_MGMT_SUPPORT", k.PcscLiteClient.API.SCARD_ATTR_POWER_MGMT_SUPPORT);
    k.PcscLiteClient.API.SCARD_ATTR_USER_TO_CARD_AUTH_DEVICE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SECURITY, 320);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_USER_TO_CARD_AUTH_DEVICE", k.PcscLiteClient.API.SCARD_ATTR_USER_TO_CARD_AUTH_DEVICE);
    k.PcscLiteClient.API.SCARD_ATTR_USER_AUTH_INPUT_DEVICE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SECURITY, 322);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_USER_AUTH_INPUT_DEVICE", k.PcscLiteClient.API.SCARD_ATTR_USER_AUTH_INPUT_DEVICE);
    k.PcscLiteClient.API.SCARD_ATTR_CHARACTERISTICS = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_MECHANICAL, 336);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CHARACTERISTICS", k.PcscLiteClient.API.SCARD_ATTR_CHARACTERISTICS);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_PROTOCOL_TYPE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 513);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_PROTOCOL_TYPE", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_PROTOCOL_TYPE);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CLK = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 514);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_CLK", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CLK);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_F = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 515);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_F", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_F);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_D = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 516);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_D", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_D);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_N = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 517);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_N", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_N);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_W = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 518);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_W", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_W);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSC = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 519);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_IFSC", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSC);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSD = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 520);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_IFSD", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSD);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_BWT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 521);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_BWT", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_BWT);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CWT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 522);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_CWT", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CWT);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_EBC_ENCODING = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 523);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_EBC_ENCODING", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_EBC_ENCODING);
    k.PcscLiteClient.API.SCARD_ATTR_EXTENDED_BWT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 524);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_EXTENDED_BWT", k.PcscLiteClient.API.SCARD_ATTR_EXTENDED_BWT);
    k.PcscLiteClient.API.SCARD_ATTR_ICC_PRESENCE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 768);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ICC_PRESENCE", k.PcscLiteClient.API.SCARD_ATTR_ICC_PRESENCE);
    k.PcscLiteClient.API.SCARD_ATTR_ICC_INTERFACE_STATUS = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 769);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ICC_INTERFACE_STATUS", k.PcscLiteClient.API.SCARD_ATTR_ICC_INTERFACE_STATUS);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IO_STATE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 770);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_IO_STATE", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IO_STATE);
    k.PcscLiteClient.API.SCARD_ATTR_ATR_STRING = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 771);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ATR_STRING", k.PcscLiteClient.API.SCARD_ATTR_ATR_STRING);
    k.PcscLiteClient.API.SCARD_ATTR_ICC_TYPE_PER_ATR = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 772);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ICC_TYPE_PER_ATR", k.PcscLiteClient.API.SCARD_ATTR_ICC_TYPE_PER_ATR);
    k.PcscLiteClient.API.SCARD_ATTR_ESC_RESET = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40960);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ESC_RESET", k.PcscLiteClient.API.SCARD_ATTR_ESC_RESET);
    k.PcscLiteClient.API.SCARD_ATTR_ESC_CANCEL = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40963);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ESC_CANCEL", k.PcscLiteClient.API.SCARD_ATTR_ESC_CANCEL);
    k.PcscLiteClient.API.SCARD_ATTR_ESC_AUTHREQUEST = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40965);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ESC_AUTHREQUEST", k.PcscLiteClient.API.SCARD_ATTR_ESC_AUTHREQUEST);
    k.PcscLiteClient.API.SCARD_ATTR_MAXINPUT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40967);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAXINPUT", k.PcscLiteClient.API.SCARD_ATTR_MAXINPUT);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_UNIT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 1);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_UNIT", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_UNIT);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_IN_USE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 2);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_IN_USE", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_IN_USE);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_A = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 3);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_FRIENDLY_NAME_A", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_A);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_A = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 4);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_SYSTEM_NAME_A", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_A);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 5);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_FRIENDLY_NAME_W", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 6);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_SYSTEM_NAME_W", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W);
    k.PcscLiteClient.API.SCARD_ATTR_SUPRESS_T1_IFS_REQUEST = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 7);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_SUPRESS_T1_IFS_REQUEST", k.PcscLiteClient.API.SCARD_ATTR_SUPRESS_T1_IFS_REQUEST);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME = k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_FRIENDLY_NAME", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME = k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_SYSTEM_NAME", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W);
    k.PcscLiteClient.API.SCARD_CTL_CODE = function(b) {
        return (0, k.FixedSizeInteger.castToInt32)(1107296256) + b
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CTL_CODE", k.PcscLiteClient.API.SCARD_CTL_CODE);
    k.PcscLiteClient.API.CM_IOCTL_GET_FEATURE_REQUEST = k.PcscLiteClient.API.SCARD_CTL_CODE(3400);
    e.exportProperty(k.PcscLiteClient.API, "CM_IOCTL_GET_FEATURE_REQUEST", k.PcscLiteClient.API.CM_IOCTL_GET_FEATURE_REQUEST);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_START = 1;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_START", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_START);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_FINISH = 2;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_FINISH", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_FINISH);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_START = 3;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_START", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_START);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_FINISH = 4;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_FINISH", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_FINISH);
    k.PcscLiteClient.API.FEATURE_GET_KEY_PRESSED = 5;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_GET_KEY_PRESSED", k.PcscLiteClient.API.FEATURE_GET_KEY_PRESSED);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT = 6;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_DIRECT", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT = 7;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_DIRECT", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT);
    k.PcscLiteClient.API.FEATURE_MCT_READER_DIRECT = 8;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MCT_READER_DIRECT", k.PcscLiteClient.API.FEATURE_MCT_READER_DIRECT);
    k.PcscLiteClient.API.FEATURE_MCT_UNIVERSAL = 9;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MCT_UNIVERSAL", k.PcscLiteClient.API.FEATURE_MCT_UNIVERSAL);
    k.PcscLiteClient.API.FEATURE_IFD_PIN_PROPERTIES = 10;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_IFD_PIN_PROPERTIES", k.PcscLiteClient.API.FEATURE_IFD_PIN_PROPERTIES);
    k.PcscLiteClient.API.FEATURE_ABORT = 11;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_ABORT", k.PcscLiteClient.API.FEATURE_ABORT);
    k.PcscLiteClient.API.FEATURE_SET_SPE_MESSAGE = 12;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_SET_SPE_MESSAGE", k.PcscLiteClient.API.FEATURE_SET_SPE_MESSAGE);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT_APP_ID = 13;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_DIRECT_APP_ID", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT_APP_ID);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT_APP_ID = 14;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_DIRECT_APP_ID", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT_APP_ID);
    k.PcscLiteClient.API.FEATURE_WRITE_DISPLAY = 15;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_WRITE_DISPLAY", k.PcscLiteClient.API.FEATURE_WRITE_DISPLAY);
    k.PcscLiteClient.API.FEATURE_GET_KEY = 16;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_GET_KEY", k.PcscLiteClient.API.FEATURE_GET_KEY);
    k.PcscLiteClient.API.FEATURE_IFD_DISPLAY_PROPERTIES = 17;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_IFD_DISPLAY_PROPERTIES", k.PcscLiteClient.API.FEATURE_IFD_DISPLAY_PROPERTIES);
    k.PcscLiteClient.API.FEATURE_GET_TLV_PROPERTIES = 18;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_GET_TLV_PROPERTIES", k.PcscLiteClient.API.FEATURE_GET_TLV_PROPERTIES);
    k.PcscLiteClient.API.FEATURE_CCID_ESC_COMMAND = 19;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_CCID_ESC_COMMAND", k.PcscLiteClient.API.FEATURE_CCID_ESC_COMMAND);
    k.PcscLiteClient.API.FEATURE_EXECUTE_PACE = 32;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_EXECUTE_PACE", k.PcscLiteClient.API.FEATURE_EXECUTE_PACE);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdLayout = 1;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wLcdLayout", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdLayout);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bEntryValidationCondition = 2;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bEntryValidationCondition", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bEntryValidationCondition);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bTimeOut2 = 3;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bTimeOut2", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bTimeOut2);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxCharacters = 4;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wLcdMaxCharacters", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxCharacters);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxLines = 5;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wLcdMaxLines", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxLines);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMinPINSize = 6;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bMinPINSize", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMinPINSize);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMaxPINSize = 7;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bMaxPINSize", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMaxPINSize);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_sFirmwareID = 8;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_sFirmwareID", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_sFirmwareID);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bPPDUSupport = 9;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bPPDUSupport", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bPPDUSupport);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_dwMaxAPDUDataSize = 10;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_dwMaxAPDUDataSize", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_dwMaxAPDUDataSize);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdVendor = 11;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wIdVendor", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdVendor);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdProduct = 12;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wIdProduct", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdProduct);
    k.PcscLiteClient.API.SCARD_IO_REQUEST = function(b) {
        this.protocol = b
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_IO_REQUEST", k.PcscLiteClient.API.SCARD_IO_REQUEST);
    k.PcscLiteClient.API.SCARD_PCI_T0 = new k.PcscLiteClient.API.SCARD_IO_REQUEST(k.PcscLiteClient.API.SCARD_PROTOCOL_T0);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PCI_T0", k.PcscLiteClient.API.SCARD_PCI_T0);
    k.PcscLiteClient.API.SCARD_PCI_T1 = new k.PcscLiteClient.API.SCARD_IO_REQUEST(k.PcscLiteClient.API.SCARD_PROTOCOL_T1);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PCI_T1", k.PcscLiteClient.API.SCARD_PCI_T1);
    k.PcscLiteClient.API.SCARD_PCI_RAW = new k.PcscLiteClient.API.SCARD_IO_REQUEST(k.PcscLiteClient.API.SCARD_PROTOCOL_RAW);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PCI_RAW", k.PcscLiteClient.API.SCARD_PCI_RAW);
    k.PcscLiteClient.API.SCARD_READERSTATE_IN = function(b, c, d) {
        this.reader_name = b;
        this.current_state = c;
        e.isDef(d) && (this.user_data = d)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_READERSTATE_IN", k.PcscLiteClient.API.SCARD_READERSTATE_IN);
    k.PcscLiteClient.API.createSCardReaderStateIn = function(b, c, d) {
        return new k.PcscLiteClient.API.SCARD_READERSTATE_IN(b, c, d)
    };
    k.PcscLiteClient.API.SCARD_READERSTATE_OUT = function(b, c, d, f, g) {
        this.reader_name = b;
        this.current_state = c;
        this.event_state = d;
        this.atr = f;
        e.isDef(g) && (this.user_data = g)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_READERSTATE_OUT", k.PcscLiteClient.API.SCARD_READERSTATE_OUT);
    k.PcscLiteClient.API.createSCardReaderStateOut = function(b, c, d, f, g) {
        return new k.PcscLiteClient.API.SCARD_READERSTATE_OUT(b, c, d, f, g)
    };
    k.PcscLiteClient.API.ResultOrErrorCode = function(b) {
        k.Logging.checkWithLogger(this.logger, 1 <= b.length);
        this.responseItems = b;
        this.errorCode = b[0];
        this.resultItems = void 0;
        this.isSuccessful() && (this.resultItems = e.array.slice(b, 1))
    };
    e.exportProperty(k.PcscLiteClient.API, "ResultOrErrorCode", k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.logger = k.Logging.getScopedLogger("PcscLiteClient.API.ResultOrErrorCode");
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.getBase = function(b, c, d, f) {
        this.isSuccessful() ? (k.Logging.checkWithLogger(this.logger, this.resultItems.length == b), c && c.apply(f, this.resultItems)) : d && d.apply(f, [this.errorCode])
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "getBase", k.PcscLiteClient.API.ResultOrErrorCode.prototype.getBase);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.isSuccessful = function() {
        return this.errorCode == k.PcscLiteClient.API.SCARD_S_SUCCESS
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "isSuccessful", k.PcscLiteClient.API.ResultOrErrorCode.prototype.isSuccessful);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.getResult = function() {
        k.Logging.checkWithLogger(this.logger, this.isSuccessful());
        k.Logging.checkWithLogger(this.logger, e.isDef(this.resultItems));
        e.asserts.assert(this.resultItems);
        return this.resultItems
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "getResult", k.PcscLiteClient.API.ResultOrErrorCode.prototype.getResult);
    k.PcscLiteClient.API.prototype.pcsc_stringify_error = function(b) {
        var c = this.logger;
        return this.postRequest_("pcsc_stringify_error", [b], function(b) {
            k.Logging.checkWithLogger(c, 1 == b.length);
            k.Logging.checkWithLogger(c, e.isString(b[0]));
            return b[0]
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "pcsc_stringify_error", k.PcscLiteClient.API.prototype.pcsc_stringify_error);
    k.PcscLiteClient.API.prototype.SCardEstablishContext = function(b, c, d) {
        e.isDef(c) || (c = null);
        e.isDef(d) || (d = null);
        return this.postRequest_("SCardEstablishContext", [b, c, d], function(b) {
            return new k.PcscLiteClient.API.SCardEstablishContextResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardEstablishContext", k.PcscLiteClient.API.prototype.SCardEstablishContext);
    k.PcscLiteClient.API.SCardEstablishContextResult = function(b) {
        k.PcscLiteClient.API.ResultOrErrorCode.call(this, b)
    };
    e.inherits(k.PcscLiteClient.API.SCardEstablishContextResult, k.PcscLiteClient.API.ResultOrErrorCode);
    e.exportProperty(k.PcscLiteClient.API, "SCardEstablishContextResult", k.PcscLiteClient.API.SCardEstablishContextResult);
    k.PcscLiteClient.API.SCardEstablishContextResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardEstablishContextResult.prototype, "get", k.PcscLiteClient.API.SCardEstablishContextResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardReleaseContext = function(b) {
        return this.postRequest_("SCardReleaseContext", [b], function(b) {
            return new k.PcscLiteClient.API.SCardReleaseContextResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardReleaseContext", k.PcscLiteClient.API.prototype.SCardReleaseContext);
    k.PcscLiteClient.API.SCardReleaseContextResult = function(b) {
        k.PcscLiteClient.API.ResultOrErrorCode.call(this, b)
    };
    e.inherits(k.PcscLiteClient.API.SCardReleaseContextResult, k.PcscLiteClient.API.ResultOrErrorCode);
    e.exportProperty(k.PcscLiteClient.API, "SCardReleaseContextResult", k.PcscLiteClient.API.SCardReleaseContextResult);
    k.PcscLiteClient.API.SCardReleaseContextResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardReleaseContextResult.prototype, "get", k.PcscLiteClient.API.SCardReleaseContextResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardConnect = function(b, c, d, f) {
        return this.postRequest_("SCardConnect", [b, c, d, f], function(b) {
            return new k.PcscLiteClient.API.SCardConnectResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardConnect", k.PcscLiteClient.API.prototype.SCardConnect);
    k.PcscLiteClient.API.SCardConnectResult = function(b) {
        k.PcscLiteClient.API.SCardConnectResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardConnectResult", k.PcscLiteClient.API.SCardConnectResult);
    e.inherits(k.PcscLiteClient.API.SCardConnectResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardConnectResult.prototype.get = function(b, c, d) {
        this.getBase(2, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardConnectResult.prototype, "get", k.PcscLiteClient.API.SCardConnectResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardReconnect = function(b, c, d, f) {
        return this.postRequest_("SCardReconnect", [b, c, d, f], function(b) {
            return new k.PcscLiteClient.API.SCardReconnectResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardReconnect", k.PcscLiteClient.API.prototype.SCardReconnect);
    k.PcscLiteClient.API.SCardReconnectResult = function(b) {
        k.PcscLiteClient.API.SCardReconnectResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardReconnectResult", k.PcscLiteClient.API.SCardReconnectResult);
    e.inherits(k.PcscLiteClient.API.SCardReconnectResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardReconnectResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardReconnectResult.prototype, "get", k.PcscLiteClient.API.SCardReconnectResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardDisconnect = function(b, c) {
        return this.postRequest_("SCardDisconnect", [b, c], function(b) {
            return new k.PcscLiteClient.API.SCardDisconnectResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardDisconnect", k.PcscLiteClient.API.prototype.SCardDisconnect);
    k.PcscLiteClient.API.SCardDisconnectResult = function(b) {
        k.PcscLiteClient.API.SCardDisconnectResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardDisconnectResult", k.PcscLiteClient.API.SCardDisconnectResult);
    e.inherits(k.PcscLiteClient.API.SCardDisconnectResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardDisconnectResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardDisconnectResult.prototype, "get", k.PcscLiteClient.API.SCardDisconnectResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardBeginTransaction = function(b) {
        return this.postRequest_("SCardBeginTransaction", [b], function(b) {
            return new k.PcscLiteClient.API.SCardBeginTransactionResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardBeginTransaction", k.PcscLiteClient.API.prototype.SCardBeginTransaction);
    k.PcscLiteClient.API.SCardBeginTransactionResult = function(b) {
        k.PcscLiteClient.API.SCardBeginTransactionResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardBeginTransactionResult", k.PcscLiteClient.API.SCardBeginTransactionResult);
    e.inherits(k.PcscLiteClient.API.SCardBeginTransactionResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardBeginTransactionResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardBeginTransactionResult.prototype, "get", k.PcscLiteClient.API.SCardBeginTransactionResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardEndTransaction = function(b, c) {
        return this.postRequest_("SCardEndTransaction", [b, c], function(b) {
            return new k.PcscLiteClient.API.SCardEndTransactionResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardEndTransaction", k.PcscLiteClient.API.prototype.SCardEndTransaction);
    k.PcscLiteClient.API.SCardEndTransactionResult = function(b) {
        k.PcscLiteClient.API.SCardEndTransactionResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardEndTransactionResult", k.PcscLiteClient.API.SCardEndTransactionResult);
    e.inherits(k.PcscLiteClient.API.SCardEndTransactionResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardEndTransactionResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardEndTransactionResult.prototype, "get", k.PcscLiteClient.API.SCardEndTransactionResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardStatus = function(b) {
        return this.postRequest_("SCardStatus", [b], function(b) {
            return new k.PcscLiteClient.API.SCardStatusResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardStatus", k.PcscLiteClient.API.prototype.SCardStatus);
    k.PcscLiteClient.API.SCardStatusResult = function(b) {
        k.PcscLiteClient.API.SCardStatusResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardStatusResult", k.PcscLiteClient.API.SCardStatusResult);
    e.inherits(k.PcscLiteClient.API.SCardStatusResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardStatusResult.prototype.get = function(b, c, d) {
        this.getBase(4, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardStatusResult.prototype, "get", k.PcscLiteClient.API.SCardStatusResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardGetStatusChange = function(b, c, d) {
        return this.postRequest_("SCardGetStatusChange", [b, c, d], function(b) {
            return new k.PcscLiteClient.API.SCardGetStatusChangeResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardGetStatusChange", k.PcscLiteClient.API.prototype.SCardGetStatusChange);
    k.PcscLiteClient.API.SCardGetStatusChangeResult = function(b) {
        k.PcscLiteClient.API.SCardGetStatusChangeResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardGetStatusChangeResult", k.PcscLiteClient.API.SCardGetStatusChangeResult);
    e.inherits(k.PcscLiteClient.API.SCardGetStatusChangeResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardGetStatusChangeResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardGetStatusChangeResult.prototype, "get", k.PcscLiteClient.API.SCardGetStatusChangeResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardControl = function(b, c, d) {
        return this.postRequest_("SCardControl", [b, c, d], function(b) {
            return new k.PcscLiteClient.API.SCardControlResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardControl", k.PcscLiteClient.API.prototype.SCardControl);
    k.PcscLiteClient.API.SCardControlResult = function(b) {
        k.PcscLiteClient.API.SCardControlResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardControlResult", k.PcscLiteClient.API.SCardControlResult);
    e.inherits(k.PcscLiteClient.API.SCardControlResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardControlResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardControlResult.prototype, "get", k.PcscLiteClient.API.SCardControlResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardGetAttrib = function(b, c) {
        return this.postRequest_("SCardGetAttrib", [b, c], function(b) {
            return new k.PcscLiteClient.API.SCardGetAttribResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardGetAttrib", k.PcscLiteClient.API.prototype.SCardGetAttrib);
    k.PcscLiteClient.API.SCardGetAttribResult = function(b) {
        k.PcscLiteClient.API.SCardGetAttribResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardGetAttribResult", k.PcscLiteClient.API.SCardGetAttribResult);
    e.inherits(k.PcscLiteClient.API.SCardGetAttribResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardGetAttribResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardGetAttribResult.prototype, "get", k.PcscLiteClient.API.SCardGetAttribResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardSetAttrib = function(b, c, d) {
        return this.postRequest_("SCardSetAttrib", [b, c, d], function(b) {
            return new k.PcscLiteClient.API.SCardSetAttribResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardSetAttrib", k.PcscLiteClient.API.prototype.SCardSetAttrib);
    k.PcscLiteClient.API.SCardSetAttribResult = function(b) {
        k.PcscLiteClient.API.SCardSetAttribResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardSetAttribResult", k.PcscLiteClient.API.SCardSetAttribResult);
    e.inherits(k.PcscLiteClient.API.SCardSetAttribResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardSetAttribResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardSetAttribResult.prototype, "get", k.PcscLiteClient.API.SCardSetAttribResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardTransmit = function(b, c, d, f) {
        return this.postRequest_("SCardTransmit", [b, c, d, f], function(b) {
            return new k.PcscLiteClient.API.SCardTransmitResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardTransmit", k.PcscLiteClient.API.prototype.SCardTransmit);
    k.PcscLiteClient.API.SCardTransmitResult = function(b) {
        k.PcscLiteClient.API.SCardTransmitResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardTransmitResult", k.PcscLiteClient.API.SCardTransmitResult);
    e.inherits(k.PcscLiteClient.API.SCardTransmitResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardTransmitResult.prototype.get = function(b, c, d) {
        this.getBase(2, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardTransmitResult.prototype, "get", k.PcscLiteClient.API.SCardTransmitResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardListReaders = function(b, c) {
        return this.postRequest_("SCardListReaders", [b, c], function(b) {
            return new k.PcscLiteClient.API.SCardListReadersResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardListReaders", k.PcscLiteClient.API.prototype.SCardListReaders);
    k.PcscLiteClient.API.SCardListReadersResult = function(b) {
        k.PcscLiteClient.API.SCardListReadersResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardListReadersResult", k.PcscLiteClient.API.SCardListReadersResult);
    e.inherits(k.PcscLiteClient.API.SCardListReadersResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardListReadersResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardListReadersResult.prototype, "get", k.PcscLiteClient.API.SCardListReadersResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardListReaderGroups = function(b) {
        return this.postRequest_("SCardListReaderGroups", [b], function(b) {
            return new k.PcscLiteClient.API.SCardListReaderGroupsResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardListReaderGroups", k.PcscLiteClient.API.prototype.SCardListReaderGroups);
    k.PcscLiteClient.API.SCardListReaderGroupsResult = function(b) {
        k.PcscLiteClient.API.SCardListReaderGroupsResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardListReaderGroupsResult", k.PcscLiteClient.API.SCardListReaderGroupsResult);
    e.inherits(k.PcscLiteClient.API.SCardListReaderGroupsResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardListReaderGroupsResult.prototype.get = function(b, c, d) {
        this.getBase(1, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardListReaderGroupsResult.prototype, "get", k.PcscLiteClient.API.SCardListReaderGroupsResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardCancel = function(b) {
        return this.postRequest_("SCardCancel", [b], function(b) {
            return new k.PcscLiteClient.API.SCardCancelResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardCancel", k.PcscLiteClient.API.prototype.SCardCancel);
    k.PcscLiteClient.API.SCardCancelResult = function(b) {
        k.PcscLiteClient.API.SCardCancelResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardCancelResult", k.PcscLiteClient.API.SCardCancelResult);
    e.inherits(k.PcscLiteClient.API.SCardCancelResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardCancelResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardCancelResult.prototype, "get", k.PcscLiteClient.API.SCardCancelResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardIsValidContext = function(b) {
        return this.postRequest_("SCardIsValidContext", [b], function(b) {
            return new k.PcscLiteClient.API.SCardIsValidContextResult(b)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardIsValidContext", k.PcscLiteClient.API.prototype.SCardIsValidContext);
    k.PcscLiteClient.API.SCardIsValidContextResult = function(b) {
        k.PcscLiteClient.API.SCardIsValidContextResult.base(this, "constructor", b)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardIsValidContextResult", k.PcscLiteClient.API.SCardIsValidContextResult);
    e.inherits(k.PcscLiteClient.API.SCardIsValidContextResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardIsValidContextResult.prototype.get = function(b, c, d) {
        this.getBase(0, b, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardIsValidContextResult.prototype, "get", k.PcscLiteClient.API.SCardIsValidContextResult.prototype.get);
    k.PcscLiteClient.API.prototype.disposeInternal = function() {
        this.requester_.dispose();
        this.messageChannel_ = this.requester_ = null;
        this.logger.fine("Disposed");
        k.PcscLiteClient.API.superClass_.disposeInternal.call(this)
    };
    k.PcscLiteClient.API.prototype.messageChannelDisposedListener_ = function() {
        this.isDisposed() || (this.logger.info("Message channel was disposed, disposing..."), this.dispose())
    };
    k.PcscLiteClient.API.prototype.postRequest_ = function(b, c, d) {
        if (this.isDisposed()) return e.Promise.reject(Error("The API instance is already disposed"));
        b = (new k.RemoteCallMessage(b, c)).makeRequestPayload();
        return this.requester_.postRequest(b).then(d)
    };
    k.Random = {};
    a.scope.RANDOM_INTEGER_BYTE_COUNT = 6;
    k.Random.randomIntegerNumber = function() {
        var b = new Uint8Array(a.scope.RANDOM_INTEGER_BYTE_COUNT);
        window.crypto.getRandomValues(b);
        var c = 0;
        e.array.forEach(b, function(b) {
            c = 256 * c + b
        });
        return c
    };
    e.events = {};
    a.scope.purify = function(b) {
        return {
            valueOf: b
        }.valueOf()
    };
    e.events.BrowserFeature = {
        HAS_W3C_BUTTON: !e.userAgent.IE || e.userAgent.isDocumentModeOrHigher(9),
        HAS_W3C_EVENT_SUPPORT: !e.userAgent.IE || e.userAgent.isDocumentModeOrHigher(9),
        SET_KEY_CODE_TO_PREVENT_DEFAULT: e.userAgent.IE && !e.userAgent.isVersionOrHigher("9"),
        HAS_NAVIGATOR_ONLINE_PROPERTY: !e.userAgent.WEBKIT || e.userAgent.isVersionOrHigher("528"),
        HAS_HTML5_NETWORK_EVENT_SUPPORT: e.userAgent.GECKO && e.userAgent.isVersionOrHigher("1.9b") || e.userAgent.IE && e.userAgent.isVersionOrHigher("8") || e.userAgent.OPERA &&
            e.userAgent.isVersionOrHigher("9.5") || e.userAgent.WEBKIT && e.userAgent.isVersionOrHigher("528"),
        HTML5_NETWORK_EVENTS_FIRE_ON_BODY: e.userAgent.GECKO && !e.userAgent.isVersionOrHigher("8") || e.userAgent.IE && !e.userAgent.isVersionOrHigher("9"),
        TOUCH_ENABLED: "ontouchstart" in e.global || !!(e.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!e.global.navigator || !e.global.navigator.maxTouchPoints && !e.global.navigator.msMaxTouchPoints),
        POINTER_EVENTS: "PointerEvent" in e.global,
        MSPOINTER_EVENTS: "MSPointerEvent" in e.global && !(!e.global.navigator || !e.global.navigator.msPointerEnabled),
        PASSIVE_EVENTS: (0, a.scope.purify)(function() {
            if (!e.global.addEventListener || !Object.defineProperty) return !1;
            var b = !1,
                c = Object.defineProperty({}, "passive", {
                    get: function() {
                        b = !0
                    }
                });
            try {
                e.global.addEventListener("test", e.nullFunction, c), e.global.removeEventListener("test", e.nullFunction, c)
            } catch (d) {}
            return b
        })
    };
    e.events.EventId = function(b) {
        this.id = b
    };
    e.events.EventId.prototype.toString = function() {
        return this.id
    };
    e.events.Event = function(b, c) {
        this.type = b instanceof e.events.EventId ? String(b) : b;
        this.currentTarget = this.target = c;
        this.defaultPrevented = this.propagationStopped_ = !1;
        this.returnValue_ = !0
    };
    e.events.Event.prototype.stopPropagation = function() {
        this.propagationStopped_ = !0
    };
    e.events.Event.prototype.preventDefault = function() {
        this.defaultPrevented = !0;
        this.returnValue_ = !1
    };
    e.events.Event.stopPropagation = function(b) {
        b.stopPropagation()
    };
    e.events.Event.preventDefault = function(b) {
        b.preventDefault()
    };
    e.events.getVendorPrefixedName_ = function(b) {
        return e.userAgent.WEBKIT ? "webkit" + b : e.userAgent.OPERA ? "o" + b.toLowerCase() : b.toLowerCase()
    };
    e.events.EventType = {
        CLICK: "click",
        RIGHTCLICK: "rightclick",
        DBLCLICK: "dblclick",
        MOUSEDOWN: "mousedown",
        MOUSEUP: "mouseup",
        MOUSEOVER: "mouseover",
        MOUSEOUT: "mouseout",
        MOUSEMOVE: "mousemove",
        MOUSEENTER: "mouseenter",
        MOUSELEAVE: "mouseleave",
        MOUSECANCEL: "mousecancel",
        SELECTIONCHANGE: "selectionchange",
        SELECTSTART: "selectstart",
        WHEEL: "wheel",
        KEYPRESS: "keypress",
        KEYDOWN: "keydown",
        KEYUP: "keyup",
        BLUR: "blur",
        FOCUS: "focus",
        DEACTIVATE: "deactivate",
        FOCUSIN: "focusin",
        FOCUSOUT: "focusout",
        CHANGE: "change",
        RESET: "reset",
        SELECT: "select",
        SUBMIT: "submit",
        INPUT: "input",
        PROPERTYCHANGE: "propertychange",
        DRAGSTART: "dragstart",
        DRAG: "drag",
        DRAGENTER: "dragenter",
        DRAGOVER: "dragover",
        DRAGLEAVE: "dragleave",
        DROP: "drop",
        DRAGEND: "dragend",
        TOUCHSTART: "touchstart",
        TOUCHMOVE: "touchmove",
        TOUCHEND: "touchend",
        TOUCHCANCEL: "touchcancel",
        BEFOREUNLOAD: "beforeunload",
        CONSOLEMESSAGE: "consolemessage",
        CONTEXTMENU: "contextmenu",
        DEVICECHANGE: "devicechange",
        DEVICEMOTION: "devicemotion",
        DEVICEORIENTATION: "deviceorientation",
        DOMCONTENTLOADED: "DOMContentLoaded",
        ERROR: "error",
        HELP: "help",
        LOAD: "load",
        LOSECAPTURE: "losecapture",
        ORIENTATIONCHANGE: "orientationchange",
        READYSTATECHANGE: "readystatechange",
        RESIZE: "resize",
        SCROLL: "scroll",
        UNLOAD: "unload",
        CANPLAY: "canplay",
        CANPLAYTHROUGH: "canplaythrough",
        DURATIONCHANGE: "durationchange",
        EMPTIED: "emptied",
        ENDED: "ended",
        LOADEDDATA: "loadeddata",
        LOADEDMETADATA: "loadedmetadata",
        PAUSE: "pause",
        PLAY: "play",
        PLAYING: "playing",
        RATECHANGE: "ratechange",
        SEEKED: "seeked",
        SEEKING: "seeking",
        STALLED: "stalled",
        SUSPEND: "suspend",
        TIMEUPDATE: "timeupdate",
        VOLUMECHANGE: "volumechange",
        WAITING: "waiting",
        SOURCEOPEN: "sourceopen",
        SOURCEENDED: "sourceended",
        SOURCECLOSED: "sourceclosed",
        ABORT: "abort",
        UPDATE: "update",
        UPDATESTART: "updatestart",
        UPDATEEND: "updateend",
        HASHCHANGE: "hashchange",
        PAGEHIDE: "pagehide",
        PAGESHOW: "pageshow",
        POPSTATE: "popstate",
        COPY: "copy",
        PASTE: "paste",
        CUT: "cut",
        BEFORECOPY: "beforecopy",
        BEFORECUT: "beforecut",
        BEFOREPASTE: "beforepaste",
        ONLINE: "online",
        OFFLINE: "offline",
        MESSAGE: "message",
        CONNECT: "connect",
        INSTALL: "install",
        ACTIVATE: "activate",
        FETCH: "fetch",
        FOREIGNFETCH: "foreignfetch",
        MESSAGEERROR: "messageerror",
        STATECHANGE: "statechange",
        UPDATEFOUND: "updatefound",
        CONTROLLERCHANGE: "controllerchange",
        ANIMATIONSTART: e.events.getVendorPrefixedName_("AnimationStart"),
        ANIMATIONEND: e.events.getVendorPrefixedName_("AnimationEnd"),
        ANIMATIONITERATION: e.events.getVendorPrefixedName_("AnimationIteration"),
        TRANSITIONEND: e.events.getVendorPrefixedName_("TransitionEnd"),
        POINTERDOWN: "pointerdown",
        POINTERUP: "pointerup",
        POINTERCANCEL: "pointercancel",
        POINTERMOVE: "pointermove",
        POINTEROVER: "pointerover",
        POINTEROUT: "pointerout",
        POINTERENTER: "pointerenter",
        POINTERLEAVE: "pointerleave",
        GOTPOINTERCAPTURE: "gotpointercapture",
        LOSTPOINTERCAPTURE: "lostpointercapture",
        MSGESTURECHANGE: "MSGestureChange",
        MSGESTUREEND: "MSGestureEnd",
        MSGESTUREHOLD: "MSGestureHold",
        MSGESTURESTART: "MSGestureStart",
        MSGESTURETAP: "MSGestureTap",
        MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
        MSINERTIASTART: "MSInertiaStart",
        MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
        MSPOINTERCANCEL: "MSPointerCancel",
        MSPOINTERDOWN: "MSPointerDown",
        MSPOINTERENTER: "MSPointerEnter",
        MSPOINTERHOVER: "MSPointerHover",
        MSPOINTERLEAVE: "MSPointerLeave",
        MSPOINTERMOVE: "MSPointerMove",
        MSPOINTEROUT: "MSPointerOut",
        MSPOINTEROVER: "MSPointerOver",
        MSPOINTERUP: "MSPointerUp",
        TEXT: "text",
        TEXTINPUT: e.userAgent.IE ? "textinput" : "textInput",
        COMPOSITIONSTART: "compositionstart",
        COMPOSITIONUPDATE: "compositionupdate",
        COMPOSITIONEND: "compositionend",
        BEFOREINPUT: "beforeinput",
        EXIT: "exit",
        LOADABORT: "loadabort",
        LOADCOMMIT: "loadcommit",
        LOADREDIRECT: "loadredirect",
        LOADSTART: "loadstart",
        LOADSTOP: "loadstop",
        RESPONSIVE: "responsive",
        SIZECHANGED: "sizechanged",
        UNRESPONSIVE: "unresponsive",
        VISIBILITYCHANGE: "visibilitychange",
        STORAGE: "storage",
        DOMSUBTREEMODIFIED: "DOMSubtreeModified",
        DOMNODEINSERTED: "DOMNodeInserted",
        DOMNODEREMOVED: "DOMNodeRemoved",
        DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
        DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
        DOMATTRMODIFIED: "DOMAttrModified",
        DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified",
        BEFOREPRINT: "beforeprint",
        AFTERPRINT: "afterprint",
        BEFOREINSTALLPROMPT: "beforeinstallprompt",
        APPINSTALLED: "appinstalled"
    };
    e.events.getPointerFallbackEventName_ = function(b, c, d) {
        return e.events.BrowserFeature.POINTER_EVENTS ? b : e.events.BrowserFeature.MSPOINTER_EVENTS ? c : d
    };
    e.events.PointerFallbackEventType = {
        POINTERDOWN: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERDOWN, e.events.EventType.MSPOINTERDOWN, e.events.EventType.MOUSEDOWN),
        POINTERUP: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERUP, e.events.EventType.MSPOINTERUP, e.events.EventType.MOUSEUP),
        POINTERCANCEL: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERCANCEL, e.events.EventType.MSPOINTERCANCEL, e.events.EventType.MOUSECANCEL),
        POINTERMOVE: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERMOVE,
            e.events.EventType.MSPOINTERMOVE, e.events.EventType.MOUSEMOVE),
        POINTEROVER: e.events.getPointerFallbackEventName_(e.events.EventType.POINTEROVER, e.events.EventType.MSPOINTEROVER, e.events.EventType.MOUSEOVER),
        POINTEROUT: e.events.getPointerFallbackEventName_(e.events.EventType.POINTEROUT, e.events.EventType.MSPOINTEROUT, e.events.EventType.MOUSEOUT),
        POINTERENTER: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERENTER, e.events.EventType.MSPOINTERENTER, e.events.EventType.MOUSEENTER),
        POINTERLEAVE: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERLEAVE,
            e.events.EventType.MSPOINTERLEAVE, e.events.EventType.MOUSELEAVE)
    };
    e.events.PointerTouchFallbackEventType = {
        POINTERDOWN: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERDOWN, e.events.EventType.MSPOINTERDOWN, e.events.EventType.TOUCHSTART),
        POINTERUP: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERUP, e.events.EventType.MSPOINTERUP, e.events.EventType.TOUCHEND),
        POINTERCANCEL: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERCANCEL, e.events.EventType.MSPOINTERCANCEL, e.events.EventType.TOUCHCANCEL),
        POINTERMOVE: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERMOVE,
            e.events.EventType.MSPOINTERMOVE, e.events.EventType.TOUCHMOVE)
    };
    e.events.PointerAsMouseEventType = {
        MOUSEDOWN: e.events.PointerFallbackEventType.POINTERDOWN,
        MOUSEUP: e.events.PointerFallbackEventType.POINTERUP,
        MOUSECANCEL: e.events.PointerFallbackEventType.POINTERCANCEL,
        MOUSEMOVE: e.events.PointerFallbackEventType.POINTERMOVE,
        MOUSEOVER: e.events.PointerFallbackEventType.POINTEROVER,
        MOUSEOUT: e.events.PointerFallbackEventType.POINTEROUT,
        MOUSEENTER: e.events.PointerFallbackEventType.POINTERENTER,
        MOUSELEAVE: e.events.PointerFallbackEventType.POINTERLEAVE
    };
    e.events.PointerAsTouchEventType = {
        TOUCHCANCEL: e.events.PointerTouchFallbackEventType.POINTERCANCEL,
        TOUCHEND: e.events.PointerTouchFallbackEventType.POINTERUP,
        TOUCHMOVE: e.events.PointerTouchFallbackEventType.POINTERMOVE,
        TOUCHSTART: e.events.PointerTouchFallbackEventType.POINTERDOWN
    };
    e.events.BrowserEvent = function(b, c) {
        e.events.Event.call(this, b ? b.type : "");
        this.relatedTarget = this.currentTarget = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
        this.key = "";
        this.charCode = this.keyCode = 0;
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.state = null;
        this.platformModifierKey = !1;
        this.pointerId = 0;
        this.pointerType = "";
        this.event_ = null;
        b && this.init(b, c)
    };
    e.inherits(e.events.BrowserEvent, e.events.Event);
    e.events.BrowserEvent.MouseButton = {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
    };
    e.events.BrowserEvent.PointerType = {
        MOUSE: "mouse",
        PEN: "pen",
        TOUCH: "touch"
    };
    e.events.BrowserEvent.IEButtonMap = e.debug.freeze([1, 4, 2]);
    e.events.BrowserEvent.IE_BUTTON_MAP = null;
    e.events.BrowserEvent.IE_POINTER_TYPE_MAP = e.debug.freeze({
        2: e.events.BrowserEvent.PointerType.TOUCH,
        3: e.events.BrowserEvent.PointerType.PEN,
        4: e.events.BrowserEvent.PointerType.MOUSE
    });
    e.events.BrowserEvent.prototype.init = function(b, c) {
        var d = this.type = b.type,
            f = b.changedTouches ? b.changedTouches[0] : null;
        this.target = b.target || b.srcElement;
        this.currentTarget = c;
        (c = b.relatedTarget) ? e.userAgent.GECKO && (e.reflect.canAccessProperty(c, "nodeName") || (c = null)): d == e.events.EventType.MOUSEOVER ? c = b.fromElement : d == e.events.EventType.MOUSEOUT && (c = b.toElement);
        this.relatedTarget = c;
        e.isNull(f) ? (this.offsetX = e.userAgent.WEBKIT || void 0 !== b.offsetX ? b.offsetX : b.layerX, this.offsetY = e.userAgent.WEBKIT ||
            void 0 !== b.offsetY ? b.offsetY : b.layerY, this.clientX = void 0 !== b.clientX ? b.clientX : b.pageX, this.clientY = void 0 !== b.clientY ? b.clientY : b.pageY, this.screenX = b.screenX || 0, this.screenY = b.screenY || 0) : (this.clientX = void 0 !== f.clientX ? f.clientX : f.pageX, this.clientY = void 0 !== f.clientY ? f.clientY : f.pageY, this.screenX = f.screenX || 0, this.screenY = f.screenY || 0);
        this.button = b.button;
        this.keyCode = b.keyCode || 0;
        this.key = b.key || "";
        this.charCode = b.charCode || ("keypress" == d ? b.keyCode : 0);
        this.ctrlKey = b.ctrlKey;
        this.altKey = b.altKey;
        this.shiftKey = b.shiftKey;
        this.metaKey = b.metaKey;
        this.platformModifierKey = e.userAgent.MAC ? b.metaKey : b.ctrlKey;
        this.pointerId = b.pointerId || 0;
        this.pointerType = e.events.BrowserEvent.getPointerType_(b);
        this.state = b.state;
        this.event_ = b;
        b.defaultPrevented && this.preventDefault()
    };
    e.events.BrowserEvent.prototype.isButton = function(b) {
        return e.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == b : "click" == this.type ? b == e.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & e.events.BrowserEvent.IEButtonMap[b])
    };
    e.events.BrowserEvent.prototype.isMouseActionButton = function() {
        return this.isButton(e.events.BrowserEvent.MouseButton.LEFT) && !(e.userAgent.WEBKIT && e.userAgent.MAC && this.ctrlKey)
    };
    e.events.BrowserEvent.prototype.stopPropagation = function() {
        e.events.BrowserEvent.superClass_.stopPropagation.call(this);
        this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
    };
    e.events.BrowserEvent.prototype.preventDefault = function() {
        e.events.BrowserEvent.superClass_.preventDefault.call(this);
        var b = this.event_;
        if (b.preventDefault) b.preventDefault();
        else if (b.returnValue = !1, e.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) try {
            if (b.ctrlKey || 112 <= b.keyCode && 123 >= b.keyCode) b.keyCode = -1
        } catch (c) {}
    };
    e.events.BrowserEvent.prototype.getBrowserEvent = function() {
        return this.event_
    };
    e.events.BrowserEvent.getPointerType_ = function(b) {
        return e.isString(b.pointerType) ? b.pointerType : e.events.BrowserEvent.IE_POINTER_TYPE_MAP[b.pointerType] || ""
    };
    e.events.Listenable = function() {};
    e.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
    e.events.Listenable.addImplementation = function(b) {
        b.prototype[e.events.Listenable.IMPLEMENTED_BY_PROP] = !0
    };
    e.events.Listenable.isImplementedBy = function(b) {
        return !(!b || !b[e.events.Listenable.IMPLEMENTED_BY_PROP])
    };
    e.events.ListenableKey = function() {};
    e.events.ListenableKey.counter_ = 0;
    e.events.ListenableKey.reserveKey = function() {
        return ++e.events.ListenableKey.counter_
    };
    e.events.Listener = function(b, c, d, f, g, h) {
        e.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
        this.listener = b;
        this.proxy = c;
        this.src = d;
        this.type = f;
        this.capture = !!g;
        this.handler = h;
        this.key = e.events.ListenableKey.reserveKey();
        this.removed = this.callOnce = !1
    };
    e.events.Listener.ENABLE_MONITORING = !1;
    e.events.Listener.prototype.markAsRemoved = function() {
        this.removed = !0;
        this.handler = this.src = this.proxy = this.listener = null
    };
    e.events.ListenerMap = function(b) {
        this.src = b;
        this.listeners = {};
        this.typeCount_ = 0
    };
    e.events.ListenerMap.prototype.getTypeCount = function() {
        return this.typeCount_
    };
    e.events.ListenerMap.prototype.getListenerCount = function() {
        var b = 0,
            c;
        for (c in this.listeners) b += this.listeners[c].length;
        return b
    };
    e.events.ListenerMap.prototype.add = function(b, c, d, f, g) {
        var h = b.toString();
        b = this.listeners[h];
        b || (b = this.listeners[h] = [], this.typeCount_++);
        var l = e.events.ListenerMap.findListenerIndex_(b, c, f, g); - 1 < l ? (c = b[l], d || (c.callOnce = !1)) : (c = new e.events.Listener(c, null, this.src, h, !!f, g), c.callOnce = d, b.push(c));
        return c
    };
    e.events.ListenerMap.prototype.remove = function(b, c, d, f) {
        b = b.toString();
        if (!(b in this.listeners)) return !1;
        var g = this.listeners[b];
        c = e.events.ListenerMap.findListenerIndex_(g, c, d, f);
        return -1 < c ? (g[c].markAsRemoved(), e.array.removeAt(g, c), 0 == g.length && (delete this.listeners[b], this.typeCount_--), !0) : !1
    };
    e.events.ListenerMap.prototype.removeByKey = function(b) {
        var c = b.type;
        if (!(c in this.listeners)) return !1;
        var d = e.array.remove(this.listeners[c], b);
        d && (b.markAsRemoved(), 0 == this.listeners[c].length && (delete this.listeners[c], this.typeCount_--));
        return d
    };
    e.events.ListenerMap.prototype.removeAll = function(b) {
        b = b && b.toString();
        var c = 0,
            d;
        for (d in this.listeners)
            if (!b || d == b) {
                for (var f = this.listeners[d], g = 0; g < f.length; g++) ++c, f[g].markAsRemoved();
                delete this.listeners[d];
                this.typeCount_--
            } return c
    };
    e.events.ListenerMap.prototype.getListeners = function(b, c) {
        b = this.listeners[b.toString()];
        var d = [];
        if (b)
            for (var f = 0; f < b.length; ++f) {
                var g = b[f];
                g.capture == c && d.push(g)
            }
        return d
    };
    e.events.ListenerMap.prototype.getListener = function(b, c, d, f) {
        b = this.listeners[b.toString()];
        var g = -1;
        b && (g = e.events.ListenerMap.findListenerIndex_(b, c, d, f));
        return -1 < g ? b[g] : null
    };
    e.events.ListenerMap.prototype.hasListener = function(b, c) {
        var d = e.isDef(b),
            f = d ? b.toString() : "",
            g = e.isDef(c);
        return e.object.some(this.listeners, function(b) {
            for (var h = 0; h < b.length; ++h)
                if (!(d && b[h].type != f || g && b[h].capture != c)) return !0;
            return !1
        })
    };
    e.events.ListenerMap.findListenerIndex_ = function(b, c, d, f) {
        for (var g = 0; g < b.length; ++g) {
            var h = b[g];
            if (!h.removed && h.listener == c && h.capture == !!d && h.handler == f) return g
        }
        return -1
    };
    e.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
    e.events.onString_ = "on";
    e.events.onStringMap_ = {};
    e.events.CaptureSimulationMode = {
        OFF_AND_FAIL: 0,
        OFF_AND_SILENT: 1,
        ON: 2
    };
    e.events.CAPTURE_SIMULATION_MODE = 2;
    e.events.listenerCountEstimate_ = 0;
    e.events.listen = function(b, c, d, f, g) {
        if (f && f.once) return e.events.listenOnce(b, c, d, f, g);
        if (e.isArray(c)) {
            for (var h = 0; h < c.length; h++) e.events.listen(b, c[h], d, f, g);
            return null
        }
        d = e.events.wrapListener(d);
        return e.events.Listenable.isImplementedBy(b) ? (f = e.isObject(f) ? !!f.capture : !!f, b.listen(c, d, f, g)) : e.events.listen_(b, c, d, !1, f, g)
    };
    e.events.listen_ = function(b, c, d, f, g, h) {
        if (!c) throw Error("Invalid event type");
        var l = e.isObject(g) ? !!g.capture : !!g;
        if (l && !e.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
            if (e.events.CAPTURE_SIMULATION_MODE == e.events.CaptureSimulationMode.OFF_AND_FAIL) return e.asserts.fail("Can not register capture listener in IE8-."), null;
            if (e.events.CAPTURE_SIMULATION_MODE == e.events.CaptureSimulationMode.OFF_AND_SILENT) return null
        }
        var m = e.events.getListenerMap_(b);
        m || (b[e.events.LISTENER_MAP_PROP_] = m = new e.events.ListenerMap(b));
        d = m.add(c, d, f, l, h);
        if (d.proxy) return d;
        f = e.events.getProxy();
        d.proxy = f;
        f.src = b;
        f.listener = d;
        if (b.addEventListener) e.events.BrowserFeature.PASSIVE_EVENTS || (g = l), void 0 === g && (g = !1), b.addEventListener(c.toString(), f, g);
        else if (b.attachEvent) b.attachEvent(e.events.getOnString_(c.toString()), f);
        else if (b.addListener && b.removeListener) e.asserts.assert("change" === c, "MediaQueryList only has a change event"), b.addListener(f);
        else throw Error("addEventListener and attachEvent are unavailable.");
        e.events.listenerCountEstimate_++;
        return d
    };
    e.events.getProxy = function() {
        var b = e.events.handleBrowserEvent_,
            c = e.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(d) {
                return b.call(c.src, c.listener, d)
            } : function(d) {
                d = b.call(c.src, c.listener, d);
                if (!d) return d
            };
        return c
    };
    e.events.listenOnce = function(b, c, d, f, g) {
        if (e.isArray(c)) {
            for (var h = 0; h < c.length; h++) e.events.listenOnce(b, c[h], d, f, g);
            return null
        }
        d = e.events.wrapListener(d);
        return e.events.Listenable.isImplementedBy(b) ? (f = e.isObject(f) ? !!f.capture : !!f, b.listenOnce(c, d, f, g)) : e.events.listen_(b, c, d, !0, f, g)
    };
    e.events.listenWithWrapper = function(b, c, d, f, g) {
        c.listen(b, d, f, g)
    };
    e.events.unlisten = function(b, c, d, f, g) {
        if (e.isArray(c)) {
            for (var h = 0; h < c.length; h++) e.events.unlisten(b, c[h], d, f, g);
            return null
        }
        f = e.isObject(f) ? !!f.capture : !!f;
        d = e.events.wrapListener(d);
        if (e.events.Listenable.isImplementedBy(b)) return b.unlisten(c, d, f, g);
        if (!b) return !1;
        if (b = e.events.getListenerMap_(b))
            if (c = b.getListener(c, d, f, g)) return e.events.unlistenByKey(c);
        return !1
    };
    e.events.unlistenByKey = function(b) {
        if (e.isNumber(b) || !b || b.removed) return !1;
        var c = b.src;
        if (e.events.Listenable.isImplementedBy(c)) return c.unlistenByKey(b);
        var d = b.type,
            f = b.proxy;
        c.removeEventListener ? c.removeEventListener(d, f, b.capture) : c.detachEvent ? c.detachEvent(e.events.getOnString_(d), f) : c.addListener && c.removeListener && c.removeListener(f);
        e.events.listenerCountEstimate_--;
        (d = e.events.getListenerMap_(c)) ? (d.removeByKey(b), 0 == d.getTypeCount() && (d.src = null, c[e.events.LISTENER_MAP_PROP_] = null)) :
        b.markAsRemoved();
        return !0
    };
    e.events.unlistenWithWrapper = function(b, c, d, f, g) {
        c.unlisten(b, d, f, g)
    };
    e.events.removeAll = function(b, c) {
        if (!b) return 0;
        if (e.events.Listenable.isImplementedBy(b)) return b.removeAllListeners(c);
        b = e.events.getListenerMap_(b);
        if (!b) return 0;
        var d = 0;
        c = c && c.toString();
        for (var f in b.listeners)
            if (!c || f == c)
                for (var g = b.listeners[f].concat(), h = 0; h < g.length; ++h) e.events.unlistenByKey(g[h]) && ++d;
        return d
    };
    e.events.getListeners = function(b, c, d) {
        return e.events.Listenable.isImplementedBy(b) ? b.getListeners(c, d) : b ? (b = e.events.getListenerMap_(b)) ? b.getListeners(c, d) : [] : []
    };
    e.events.getListener = function(b, c, d, f, g) {
        d = e.events.wrapListener(d);
        f = !!f;
        return e.events.Listenable.isImplementedBy(b) ? b.getListener(c, d, f, g) : b ? (b = e.events.getListenerMap_(b)) ? b.getListener(c, d, f, g) : null : null
    };
    e.events.hasListener = function(b, c, d) {
        if (e.events.Listenable.isImplementedBy(b)) return b.hasListener(c, d);
        b = e.events.getListenerMap_(b);
        return !!b && b.hasListener(c, d)
    };
    e.events.expose = function(b) {
        var c = [],
            d;
        for (d in b) b[d] && b[d].id ? c.push(d + " = " + b[d] + " (" + b[d].id + ")") : c.push(d + " = " + b[d]);
        return c.join("\n")
    };
    e.events.getOnString_ = function(b) {
        return b in e.events.onStringMap_ ? e.events.onStringMap_[b] : e.events.onStringMap_[b] = e.events.onString_ + b
    };
    e.events.fireListeners = function(b, c, d, f) {
        return e.events.Listenable.isImplementedBy(b) ? b.fireListeners(c, d, f) : e.events.fireListeners_(b, c, d, f)
    };
    e.events.fireListeners_ = function(b, c, d, f) {
        var g = !0;
        if (b = e.events.getListenerMap_(b))
            if (c = b.listeners[c.toString()])
                for (c = c.concat(), b = 0; b < c.length; b++) {
                    var h = c[b];
                    h && h.capture == d && !h.removed && (h = e.events.fireListener(h, f), g = g && !1 !== h)
                }
        return g
    };
    e.events.fireListener = function(b, c) {
        var d = b.listener,
            f = b.handler || b.src;
        b.callOnce && e.events.unlistenByKey(b);
        return d.call(f, c)
    };
    e.events.getTotalListenerCount = function() {
        return e.events.listenerCountEstimate_
    };
    e.events.dispatchEvent = function(b, c) {
        e.asserts.assert(e.events.Listenable.isImplementedBy(b), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
        return b.dispatchEvent(c)
    };
    e.events.protectBrowserEventEntryPoint = function(b) {
        e.events.handleBrowserEvent_ = b.protectEntryPoint(e.events.handleBrowserEvent_)
    };
    e.events.handleBrowserEvent_ = function(b, c) {
        if (b.removed) return !0;
        if (!e.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
            var d = c || e.getObjectByName("window.event");
            c = new e.events.BrowserEvent(d, this);
            var f = !0;
            if (e.events.CAPTURE_SIMULATION_MODE == e.events.CaptureSimulationMode.ON) {
                if (!e.events.isMarkedIeEvent_(d)) {
                    e.events.markIeEvent_(d);
                    d = [];
                    for (var g = c.currentTarget; g; g = g.parentNode) d.push(g);
                    b = b.type;
                    for (g = d.length - 1; !c.propagationStopped_ && 0 <= g; g--) {
                        c.currentTarget = d[g];
                        var h = e.events.fireListeners_(d[g],
                            b, !0, c);
                        f = f && h
                    }
                    for (g = 0; !c.propagationStopped_ && g < d.length; g++) c.currentTarget = d[g], h = e.events.fireListeners_(d[g], b, !1, c), f = f && h
                }
            } else f = e.events.fireListener(b, c);
            return f
        }
        return e.events.fireListener(b, new e.events.BrowserEvent(c, this))
    };
    e.events.markIeEvent_ = function(b) {
        var c = !1;
        if (0 == b.keyCode) try {
            b.keyCode = -1;
            return
        } catch (d) {
            c = !0
        }
        if (c || void 0 == b.returnValue) b.returnValue = !0
    };
    e.events.isMarkedIeEvent_ = function(b) {
        return 0 > b.keyCode || void 0 != b.returnValue
    };
    e.events.uniqueIdCounter_ = 0;
    e.events.getUniqueId = function(b) {
        return b + "_" + e.events.uniqueIdCounter_++
    };
    e.events.getListenerMap_ = function(b) {
        b = b[e.events.LISTENER_MAP_PROP_];
        return b instanceof e.events.ListenerMap ? b : null
    };
    e.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
    e.events.wrapListener = function(b) {
        e.asserts.assert(b, "Listener can not be null.");
        if (e.isFunction(b)) return b;
        e.asserts.assert(b.handleEvent, "An object listener must have handleEvent method.");
        b[e.events.LISTENER_WRAPPER_PROP_] || (b[e.events.LISTENER_WRAPPER_PROP_] = function(c) {
            return b.handleEvent(c)
        });
        return b[e.events.LISTENER_WRAPPER_PROP_]
    };
    e.debug.entryPointRegistry.register(function(b) {
        e.events.handleBrowserEvent_ = b(e.events.handleBrowserEvent_)
    });
    e.events.EventTarget = function() {
        e.Disposable.call(this);
        this.eventTargetListeners_ = new e.events.ListenerMap(this);
        this.actualEventTarget_ = this;
        this.parentEventTarget_ = null
    };
    e.inherits(e.events.EventTarget, e.Disposable);
    e.events.Listenable.addImplementation(e.events.EventTarget);
    e.events.EventTarget.MAX_ANCESTORS_ = 1E3;
    e.events.EventTarget.prototype.getParentEventTarget = function() {
        return this.parentEventTarget_
    };
    e.events.EventTarget.prototype.setParentEventTarget = function(b) {
        this.parentEventTarget_ = b
    };
    e.events.EventTarget.prototype.addEventListener = function(b, c, d, f) {
        e.events.listen(this, b, c, d, f)
    };
    e.events.EventTarget.prototype.removeEventListener = function(b, c, d, f) {
        e.events.unlisten(this, b, c, d, f)
    };
    e.events.EventTarget.prototype.dispatchEvent = function(b) {
        this.assertInitialized_();
        var c = this.getParentEventTarget();
        if (c) {
            var d = [];
            for (var f = 1; c; c = c.getParentEventTarget()) d.push(c), e.asserts.assert(++f < e.events.EventTarget.MAX_ANCESTORS_, "infinite loop")
        }
        return e.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, b, d)
    };
    e.events.EventTarget.prototype.disposeInternal = function() {
        e.events.EventTarget.superClass_.disposeInternal.call(this);
        this.removeAllListeners();
        this.parentEventTarget_ = null
    };
    e.events.EventTarget.prototype.listen = function(b, c, d, f) {
        this.assertInitialized_();
        return this.eventTargetListeners_.add(String(b), c, !1, d, f)
    };
    e.events.EventTarget.prototype.listenOnce = function(b, c, d, f) {
        return this.eventTargetListeners_.add(String(b), c, !0, d, f)
    };
    e.events.EventTarget.prototype.unlisten = function(b, c, d, f) {
        return this.eventTargetListeners_.remove(String(b), c, d, f)
    };
    e.events.EventTarget.prototype.unlistenByKey = function(b) {
        return this.eventTargetListeners_.removeByKey(b)
    };
    e.events.EventTarget.prototype.removeAllListeners = function(b) {
        return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(b) : 0
    };
    e.events.EventTarget.prototype.fireListeners = function(b, c, d) {
        b = this.eventTargetListeners_.listeners[String(b)];
        if (!b) return !0;
        b = b.concat();
        for (var f = !0, g = 0; g < b.length; ++g) {
            var h = b[g];
            if (h && !h.removed && h.capture == c) {
                var l = h.listener,
                    m = h.handler || h.src;
                h.callOnce && this.unlistenByKey(h);
                f = !1 !== l.call(m, d) && f
            }
        }
        return f && 0 != d.returnValue_
    };
    e.events.EventTarget.prototype.getListeners = function(b, c) {
        return this.eventTargetListeners_.getListeners(String(b), c)
    };
    e.events.EventTarget.prototype.getListener = function(b, c, d, f) {
        return this.eventTargetListeners_.getListener(String(b), c, d, f)
    };
    e.events.EventTarget.prototype.hasListener = function(b, c) {
        b = e.isDef(b) ? String(b) : void 0;
        return this.eventTargetListeners_.hasListener(b, c)
    };
    e.events.EventTarget.prototype.setTargetForTesting = function(b) {
        this.actualEventTarget_ = b
    };
    e.events.EventTarget.prototype.assertInitialized_ = function() {
        e.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
    };
    e.events.EventTarget.dispatchEventInternal_ = function(b, c, d) {
        var f = c.type || c;
        if (e.isString(c)) c = new e.events.Event(c, b);
        else if (c instanceof e.events.Event) c.target = c.target || b;
        else {
            var g = c;
            c = new e.events.Event(f, b);
            e.object.extend(c, g)
        }
        g = !0;
        if (d)
            for (var h = d.length - 1; !c.propagationStopped_ && 0 <= h; h--) {
                var l = c.currentTarget = d[h];
                g = l.fireListeners(f, !0, c) && g
            }
        c.propagationStopped_ || (l = c.currentTarget = b, g = l.fireListeners(f, !0, c) && g, c.propagationStopped_ || (g = l.fireListeners(f, !1, c) && g));
        if (d)
            for (h = 0; !c.propagationStopped_ &&
                h < d.length; h++) l = c.currentTarget = d[h], g = l.fireListeners(f, !1, c) && g;
        return g
    };
    e.Timer = function(b, c) {
        e.events.EventTarget.call(this);
        this.interval_ = b || 1;
        this.timerObject_ = c || e.global;
        this.boundTick_ = e.bind(this.tick_, this);
        this.last_ = e.now()
    };
    e.inherits(e.Timer, e.events.EventTarget);
    e.Timer.MAX_TIMEOUT_ = 2147483647;
    e.Timer.INVALID_TIMEOUT_ID_ = -1;
    e.Timer.prototype.enabled = !1;
    e.Timer.defaultTimerObject = null;
    e.Timer.intervalScale = .8;
    e.Timer.prototype.timer_ = null;
    e.Timer.prototype.getInterval = function() {
        return this.interval_
    };
    e.Timer.prototype.setInterval = function(b) {
        this.interval_ = b;
        this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
    };
    e.Timer.prototype.tick_ = function() {
        if (this.enabled) {
            var b = e.now() - this.last_;
            0 < b && b < this.interval_ * e.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - b) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.stop(), this.start()))
        }
    };
    e.Timer.prototype.dispatchTick = function() {
        this.dispatchEvent(e.Timer.TICK)
    };
    e.Timer.prototype.start = function() {
        this.enabled = !0;
        this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = e.now())
    };
    e.Timer.prototype.stop = function() {
        this.enabled = !1;
        this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
    };
    e.Timer.prototype.disposeInternal = function() {
        e.Timer.superClass_.disposeInternal.call(this);
        this.stop();
        delete this.timerObject_
    };
    e.Timer.TICK = "tick";
    e.Timer.callOnce = function(b, c, d) {
        if (e.isFunction(b)) d && (b = e.bind(b, d));
        else if (b && "function" == typeof b.handleEvent) b = e.bind(b.handleEvent, b);
        else throw Error("Invalid listener argument");
        return Number(c) > e.Timer.MAX_TIMEOUT_ ? e.Timer.INVALID_TIMEOUT_ID_ : e.global.setTimeout(b, c || 0)
    };
    e.Timer.clear = function(b) {
        e.global.clearTimeout(b)
    };
    e.Timer.promise = function(b, c) {
        var d = null;
        return (new e.Promise(function(f, g) {
            d = e.Timer.callOnce(function() {
                f(c)
            }, b);
            d == e.Timer.INVALID_TIMEOUT_ID_ && g(Error("Failed to schedule timer."))
        })).thenCatch(function(b) {
            e.Timer.clear(d);
            throw b;
        })
    };
    k.MessageChannelPinging = {};
    a.scope.PINGER_LOGGER_TITLE = "Pinger";
    a.scope.PING_RESPONDER_LOGGER_TITLE = "PingResponder";
    a.scope.CHANNEL_ID_MESSAGE_KEY = "channel_id";
    k.MessageChannelPinging.Pinger = function(b, c, d) {
        e.Disposable.call(this);
        this.logger = k.Logging.getChildLogger(c, a.scope.PINGER_LOGGER_TITLE);
        this.messageChannel_ = b;
        this.messageChannel_.registerService(k.MessageChannelPinging.PingResponder.SERVICE_NAME, this.serviceCallback_.bind(this), !0);
        this.onEstablished_ = e.isDef(d) ? d : null;
        this.timeoutTimerId_ = this.previousRemoteEndChannelId_ = null;
        this.scheduleTimeoutTimer_();
        e.async.nextTick(this.postPingMessageAndScheduleNext_, this)
    };
    e.inherits(k.MessageChannelPinging.Pinger, e.Disposable);
    k.MessageChannelPinging.Pinger.TIMEOUT_MILLISECONDS = e.DEBUG ? 2E4 : 6E5;
    k.MessageChannelPinging.Pinger.INTERVAL_MILLISECONDS = e.DEBUG ? 1E3 : 1E4;
    k.MessageChannelPinging.Pinger.SERVICE_NAME = "ping";
    k.MessageChannelPinging.Pinger.createMessageData = function() {
        return {}
    };
    k.MessageChannelPinging.Pinger.prototype.postPingMessage = function() {
        this.isDisposed() || (this.logger.finest("Sending a ping request..."), this.messageChannel_.send(k.MessageChannelPinging.Pinger.SERVICE_NAME, k.MessageChannelPinging.Pinger.createMessageData()))
    };
    k.MessageChannelPinging.Pinger.prototype.disposeInternal = function() {
        this.clearTimeoutTimer_();
        this.messageChannel_ = this.onEstablished_ = null;
        this.logger.fine("Disposed");
        k.MessageChannelPinging.Pinger.superClass_.disposeInternal.call(this)
    };
    k.MessageChannelPinging.Pinger.prototype.serviceCallback_ = function(b) {
        k.Logging.checkWithLogger(this.logger, e.isObject(b));
        e.asserts.assertObject(b);
        this.isDisposed() || (e.object.containsKey(b, a.scope.CHANNEL_ID_MESSAGE_KEY) ? (b = b[a.scope.CHANNEL_ID_MESSAGE_KEY], e.isNumber(b) ? e.isNull(this.previousRemoteEndChannelId_) ? (this.logger.fine("Received the first pong response (remote channel id is " + b + "). The message channel is considered established"), this.previousRemoteEndChannelId_ = b, this.onEstablished_ &&
            (this.onEstablished_(), this.onEstablished_ = null)) : this.previousRemoteEndChannelId_ == b ? (this.logger.finest("Received a pong response with the correct channel id, so the remote end considered alive"), this.clearTimeoutTimer_(), this.scheduleTimeoutTimer_()) : (this.logger.warning("Received a pong response with a channel id different from the expected one (expected " + this.previousRemoteEndChannelId_ + ", received " + b + "). Disposing..."), this.disposeChannelAndSelf_()) : (this.logger.warning("Received pong message has wrong format: channel id is not a number. Disposing..."),
            this.disposeChannelAndSelf_())) : (this.logger.warning('Received pong message has wrong format: no "' + a.scope.CHANNEL_ID_MESSAGE_KEY + '" field is present. Disposing...'), this.disposeChannelAndSelf_()))
    };
    k.MessageChannelPinging.Pinger.prototype.disposeChannelAndSelf_ = function() {
        this.logger.fine("Disposing the message channel and self");
        this.messageChannel_.dispose();
        this.dispose()
    };
    k.MessageChannelPinging.Pinger.prototype.postPingMessageAndScheduleNext_ = function() {
        this.postPingMessage();
        this.schedulePostingPingMessage_()
    };
    k.MessageChannelPinging.Pinger.prototype.schedulePostingPingMessage_ = function() {
        this.isDisposed() || e.Timer.callOnce(this.postPingMessageAndScheduleNext_, k.MessageChannelPinging.Pinger.INTERVAL_MILLISECONDS, this)
    };
    k.MessageChannelPinging.Pinger.prototype.scheduleTimeoutTimer_ = function() {
        k.Logging.checkWithLogger(this.logger, e.isNull(this.timeoutTimerId_));
        this.timeoutTimerId_ = e.Timer.callOnce(this.timeoutCallback_.bind(this), k.MessageChannelPinging.Pinger.TIMEOUT_MILLISECONDS, this)
    };
    k.MessageChannelPinging.Pinger.prototype.clearTimeoutTimer_ = function() {
        e.isNull(this.timeoutTimerId_) || (e.Timer.clear(this.timeoutTimerId_), this.timeoutTimerId_ = null)
    };
    k.MessageChannelPinging.Pinger.prototype.timeoutCallback_ = function() {
        this.isDisposed() || (this.logger.warning("No pong response received in time, the remote end is dead. Disposing..."), this.disposeChannelAndSelf_())
    };
    k.MessageChannelPinging.PingResponder = function(b, c, d) {
        e.Disposable.call(this);
        this.logger = k.Logging.getChildLogger(c, a.scope.PING_RESPONDER_LOGGER_TITLE);
        this.messageChannel_ = b;
        this.messageChannel_.registerService(k.MessageChannelPinging.Pinger.SERVICE_NAME, this.serviceCallback_.bind(this), !0);
        this.onPingReceivedListener_ = d;
        this.logger.fine("Initialized (generated channel id is " + k.MessageChannelPinging.PingResponder.CHANNEL_ID + ")")
    };
    e.inherits(k.MessageChannelPinging.PingResponder, e.Disposable);
    k.MessageChannelPinging.PingResponder.SERVICE_NAME = "pong";
    k.MessageChannelPinging.PingResponder.generateChannelId = function() {
        return k.Random.randomIntegerNumber()
    };
    k.MessageChannelPinging.PingResponder.CHANNEL_ID = k.MessageChannelPinging.PingResponder.generateChannelId();
    k.MessageChannelPinging.PingResponder.createMessageData = function(b) {
        return e.object.create(a.scope.CHANNEL_ID_MESSAGE_KEY, b)
    };
    k.MessageChannelPinging.PingResponder.prototype.serviceCallback_ = function() {
        if (!this.isDisposed() && (this.logger.finest("Received a ping request, sending pong response..."), this.messageChannel_.send(k.MessageChannelPinging.PingResponder.SERVICE_NAME, k.MessageChannelPinging.PingResponder.createMessageData(k.MessageChannelPinging.PingResponder.CHANNEL_ID)), this.onPingReceivedListener_)) this.onPingReceivedListener_()
    };
    k.MessageChannelPinging.PingResponder.prototype.disposeInternal = function() {
        this.onPingReceivedListener_ = this.messageChannel_ = null;
        this.logger.fine("Disposed");
        k.MessageChannelPinging.PingResponder.superClass_.disposeInternal.call(this)
    };
    a.scope.TYPE_MESSAGE_KEY = "type";
    a.scope.DATA_MESSAGE_KEY = "data";
    k.TypedMessage = function(b, c) {
        this.type = b;
        this.data = c
    };
    k.TypedMessage.parseTypedMessage = function(b) {
        return e.isObject(b) && 2 == e.object.getCount(b) && e.object.containsKey(b, a.scope.TYPE_MESSAGE_KEY) && e.isString(b[a.scope.TYPE_MESSAGE_KEY]) && e.object.containsKey(b, a.scope.DATA_MESSAGE_KEY) && e.isObject(b[a.scope.DATA_MESSAGE_KEY]) ? new k.TypedMessage(b[a.scope.TYPE_MESSAGE_KEY], b[a.scope.DATA_MESSAGE_KEY]) : null
    };
    k.TypedMessage.prototype.makeMessage = function() {
        return e.object.create(a.scope.TYPE_MESSAGE_KEY, this.type, a.scope.DATA_MESSAGE_KEY, this.data)
    };
    k.PortMessageChannel = function(b, c) {
        e.messaging.AbstractChannel.call(this);
        this.port_ = b;
        this.extensionId = this.getPortExtensionId_(b);
        this.logger = k.Logging.getScopedLogger('PortMessageChannel<"' + b.name + '"' + (e.isNull(this.extensionId) ? "" : ', id="' + this.extensionId + '"') + ">");
        this.boundDisconnectEventHandler_ = this.disconnectEventHandler_.bind(this);
        this.port_.onDisconnect.addListener(this.boundDisconnectEventHandler_);
        this.boundMessageEventHandler_ = this.messageEventHandler_.bind(this);
        this.port_.onMessage.addListener(this.boundMessageEventHandler_);
        this.registerDefaultService(this.defaultServiceCallback_.bind(this));
        this.pingResponder_ = new k.MessageChannelPinging.PingResponder(this, this.logger);
        this.pinger_ = new k.MessageChannelPinging.Pinger(this, this.logger, c);
        this.logger.fine("Initialized successfully")
    };
    e.inherits(k.PortMessageChannel, e.messaging.AbstractChannel);
    k.PortMessageChannel.prototype.send = function(b, c) {
        k.Logging.checkWithLogger(this.logger, e.isObject(c));
        e.asserts.assertObject(c);
        b = (new k.TypedMessage(b, c)).makeMessage();
        this.logger.finest("Posting a message: " + k.DebugDump.debugDump(b));
        this.isDisposed() && k.Logging.failWithLogger(this.logger, "Failed to post message: the channel is already disposed");
        try {
            this.port_.postMessage(b)
        } catch (d) {
            this.dispose(), k.Logging.failWithLogger(this.logger, "Failed to post message: " + d)
        }
    };
    k.PortMessageChannel.prototype.disposeInternal = function() {
        this.pinger_.dispose();
        this.pinger_ = null;
        this.pingResponder_.dispose();
        this.pingResponder_ = null;
        this.port_.onMessage.removeListener(this.boundMessageEventHandler_);
        this.boundMessageEventHandler_ = null;
        this.port_.onDisconnect.removeListener(this.boundDisconnectEventHandler_);
        this.boundDisconnectEventHandler_ = null;
        this.port_.disconnect();
        this.port_ = null;
        this.logger.fine("Disposed");
        k.PortMessageChannel.superClass_.disposeInternal.call(this)
    };
    k.PortMessageChannel.prototype.getPortExtensionId_ = function(b) {
        if (!e.object.containsKey(b, "sender")) return null;
        b = b.sender;
        if (!e.isDef(b)) return null;
        k.Logging.checkWithLogger(this.logger, e.isObject(b));
        if (!e.object.containsKey(b, "id")) return null;
        b = b.id;
        if (!e.isDef(b)) return null;
        k.Logging.checkWithLogger(this.logger, e.isString(b));
        return b
    };
    k.PortMessageChannel.prototype.disconnectEventHandler_ = function() {
        this.logger.fine("Port was disconnected, disposing...");
        this.dispose()
    };
    k.PortMessageChannel.prototype.messageEventHandler_ = function(b) {
        this.logger.finest("Received a message: " + k.DebugDump.debugDump(b));
        var c = k.TypedMessage.parseTypedMessage(b);
        c || k.Logging.failWithLogger(this.logger, "Failed to parse the received message: " + k.DebugDump.debugDump(b));
        this.deliver(c.type, c.data)
    };
    k.PortMessageChannel.prototype.defaultServiceCallback_ = function(b, c) {
        k.Logging.failWithLogger(this.logger, 'Unhandled message received: serviceName="' + b + '", payload=' + k.DebugDump.debugDump(c))
    };
    k.PcscLiteClient.Context = function(b, c) {
        e.Disposable.call(this);
        this.api = null;
        this.clientTitle = b;
        this.serverAppId_ = void 0;
        e.isDef(c) ? e.isNull(c) || (this.serverAppId_ = c) : this.serverAppId_ = k.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID;
        this.channel_ = null;
        this.onInitializedCallbacks_ = [];
        this.logger.fine("Constructed")
    };
    e.inherits(k.PcscLiteClient.Context, e.Disposable);
    e.exportSymbol("GoogleSmartCard.PcscLiteClient.Context", k.PcscLiteClient.Context);
    k.PcscLiteClient.Context.prototype.logger = k.Logging.getScopedLogger("PcscLiteClient.Context");
    e.exportProperty(k.PcscLiteClient.Context.prototype, "logger", k.PcscLiteClient.Context.prototype.logger);
    k.PcscLiteClient.Context.prototype.initialize = function(b) {
        e.isDef(b) ? (this.channel_ = b, e.async.nextTick(this.messageChannelEstablishedListener_, this)) : (this.logger.fine("Opening a connection to the server app " + (e.isDef(this.serverAppId_) ? '(extension id is "' + this.serverAppId_ + '")' : "(which is the own app)") + "..."), b = {
            name: this.clientTitle
        }, b = e.isDef(this.serverAppId_) ? chrome.runtime.connect(this.serverAppId_, b) : chrome.runtime.connect(b), this.channel_ = new k.PortMessageChannel(b, this.messageChannelEstablishedListener_.bind(this)));
        this.channel_.addOnDisposeCallback(this.messageChannelDisposedListener_.bind(this))
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "initialize", k.PcscLiteClient.Context.prototype.initialize);
    k.PcscLiteClient.Context.prototype.addOnInitializedCallback = function(b) {
        e.isNull(this.api) ? this.onInitializedCallbacks_.push(b) : b(this.api)
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "addOnInitializedCallback", k.PcscLiteClient.Context.prototype.addOnInitializedCallback);
    k.PcscLiteClient.Context.prototype.getApi = function() {
        return this.api
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "getApi", k.PcscLiteClient.Context.prototype.getApi);
    k.PcscLiteClient.Context.prototype.getClientTitle = function() {
        return this.clientTitle
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "getClientTitle", k.PcscLiteClient.Context.prototype.getClientTitle);
    k.PcscLiteClient.Context.prototype.disposeInternal = function() {
        this.api && (this.api.dispose(), this.api = null);
        this.channel_ && (this.channel_.dispose(), this.channel_ = null);
        this.logger.fine("Disposed");
        k.PcscLiteClient.Context.superClass_.disposeInternal.call(this)
    };
    k.PcscLiteClient.Context.prototype.messageChannelEstablishedListener_ = function() {
        if (!this.isDisposed() && !this.channel_.isDisposed()) {
            this.logger.fine("Message channel was established successfully");
            k.Logging.checkWithLogger(this.logger, e.isNull(this.api));
            k.Logging.checkWithLogger(this.logger, !e.isNull(this.channel_));
            e.asserts.assert(this.channel_);
            var b = new k.PcscLiteClient.API(this.channel_);
            this.api = b;
            e.array.forEach(this.onInitializedCallbacks_, function(c) {
                c(b)
            });
            this.onInitializedCallbacks_ = []
        }
    };
    k.PcscLiteClient.Context.prototype.messageChannelDisposedListener_ = function() {
        this.logger.fine("Message channel was disposed, disposing...");
        this.dispose()
    };
})();