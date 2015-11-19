! function() {
    ! function() {
        var root = this;
        var previousUnderscore = root._;
        var breaker = {};
        var ArrayProto = Array.prototype,
            ObjProto = Object.prototype,
            FuncProto = Function.prototype;
        var push = ArrayProto.push,
            slice = ArrayProto.slice,
            concat = ArrayProto.concat,
            toString = ObjProto.toString,
            hasOwnProperty = ObjProto.hasOwnProperty;
        var nativeForEach = ArrayProto.forEach,
            nativeMap = ArrayProto.map,
            nativeReduce = ArrayProto.reduce,
            nativeReduceRight = ArrayProto.reduceRight,
            nativeFilter = ArrayProto.filter,
            nativeEvery = ArrayProto.every,
            nativeSome = ArrayProto.some,
            nativeIndexOf = ArrayProto.indexOf,
            nativeLastIndexOf = ArrayProto.lastIndexOf,
            nativeIsArray = Array.isArray,
            nativeKeys = Object.keys,
            nativeBind = FuncProto.bind;
        var _ = function(obj) {
            if (obj instanceof _) return obj;
            if (!(this instanceof _)) return new _(obj);
            this._wrapped = obj
        };
        if (typeof exports !== "undefined") {
            if (typeof module !== "undefined" && module.exports) {
                exports = module.exports = _
            }
            exports._ = _
        } else {
            root._ = _
        }
        _.VERSION = "1.4.3";
        var each = _.each = _.forEach = function(obj, iterator, context) {
            if (obj == null) return;
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context)
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) return
                }
            } else {
                for (var key in obj) {
                    if (_.has(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) return
                    }
                }
            }
        };
        _.map = _.collect = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list)
            });
            return results
        };
        var reduceError = "Reduce of empty array with no initial value";
        _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (nativeReduce && obj.reduce === nativeReduce) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator)
            }
            each(obj, function(value, index, list) {
                if (!initial) {
                    memo = value;
                    initial = true
                } else {
                    memo = iterator.call(context, memo, value, index, list)
                }
            });
            if (!initial) throw new TypeError(reduceError);
            return memo
        };
        _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator)
            }
            var length = obj.length;
            if (length !== +length) {
                var keys = _.keys(obj);
                length = keys.length
            }
            each(obj, function(value, index, list) {
                index = keys ? keys[--length] : --length;
                if (!initial) {
                    memo = obj[index];
                    initial = true
                } else {
                    memo = iterator.call(context, memo, obj[index], index, list)
                }
            });
            if (!initial) throw new TypeError(reduceError);
            return memo
        };
        _.find = _.detect = function(obj, iterator, context) {
            var result;
            any(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) {
                    result = value;
                    return true
                }
            });
            return result
        };
        _.filter = _.select = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
            each(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) results[results.length] = value
            });
            return results
        };
        _.reject = function(obj, iterator, context) {
            return _.filter(obj, function(value, index, list) {
                return !iterator.call(context, value, index, list)
            }, context)
        };
        _.every = _.all = function(obj, iterator, context) {
            iterator || (iterator = _.identity);
            var result = true;
            if (obj == null) return result;
            if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
            each(obj, function(value, index, list) {
                if (!(result = result && iterator.call(context, value, index, list))) return breaker
            });
            return !!result
        };
        var any = _.some = _.any = function(obj, iterator, context) {
            iterator || (iterator = _.identity);
            var result = false;
            if (obj == null) return result;
            if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
            each(obj, function(value, index, list) {
                if (result || (result = iterator.call(context, value, index, list))) return breaker
            });
            return !!result
        };
        _.contains = _.include = function(obj, target) {
            if (obj == null) return false;
            if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
            return any(obj, function(value) {
                return value === target
            })
        };
        _.invoke = function(obj, method) {
            var args = slice.call(arguments, 2);
            return _.map(obj, function(value) {
                return (_.isFunction(method) ? method : value[method]).apply(value, args)
            })
        };
        _.pluck = function(obj, key) {
            return _.map(obj, function(value) {
                return value[key]
            })
        };
        _.where = function(obj, attrs) {
            if (_.isEmpty(attrs)) return [];
            return _.filter(obj, function(value) {
                for (var key in attrs) {
                    if (attrs[key] !== value[key]) return false
                }
                return true
            })
        };
        _.max = function(obj, iterator, context) {
            if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
                return Math.max.apply(Math, obj)
            }
            if (!iterator && _.isEmpty(obj)) return -Infinity;
            var result = {
                computed: -Infinity,
                value: -Infinity
            };
            each(obj, function(value, index, list) {
                var computed = iterator ? iterator.call(context, value, index, list) : value;
                computed >= result.computed && (result = {
                    value: value,
                    computed: computed
                })
            });
            return result.value
        };
        _.min = function(obj, iterator, context) {
            if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
                return Math.min.apply(Math, obj)
            }
            if (!iterator && _.isEmpty(obj)) return Infinity;
            var result = {
                computed: Infinity,
                value: Infinity
            };
            each(obj, function(value, index, list) {
                var computed = iterator ? iterator.call(context, value, index, list) : value;
                computed < result.computed && (result = {
                    value: value,
                    computed: computed
                })
            });
            return result.value
        };
        _.shuffle = function(obj) {
            var rand;
            var index = 0;
            var shuffled = [];
            each(obj, function(value) {
                rand = _.random(index++);
                shuffled[index - 1] = shuffled[rand];
                shuffled[rand] = value
            });
            return shuffled
        };
        var lookupIterator = function(value) {
            return _.isFunction(value) ? value : function(obj) {
                return obj[value]
            }
        };
        _.sortBy = function(obj, value, context) {
            var iterator = lookupIterator(value);
            return _.pluck(_.map(obj, function(value, index, list) {
                return {
                    value: value,
                    index: index,
                    criteria: iterator.call(context, value, index, list)
                }
            }).sort(function(left, right) {
                var a = left.criteria;
                var b = right.criteria;
                if (a !== b) {
                    if (a > b || a === void 0) return 1;
                    if (a < b || b === void 0) return -1
                }
                return left.index < right.index ? -1 : 1
            }), "value")
        };
        var group = function(obj, value, context, behavior) {
            var result = {};
            var iterator = lookupIterator(value || _.identity);
            each(obj, function(value, index) {
                var key = iterator.call(context, value, index, obj);
                behavior(result, key, value)
            });
            return result
        };
        _.groupBy = function(obj, value, context) {
            return group(obj, value, context, function(result, key, value) {
                (_.has(result, key) ? result[key] : result[key] = []).push(value)
            })
        };
        _.countBy = function(obj, value, context) {
            return group(obj, value, context, function(result, key) {
                if (!_.has(result, key)) result[key] = 0;
                result[key]++
            })
        };
        _.sortedIndex = function(array, obj, iterator, context) {
            iterator = iterator == null ? _.identity : lookupIterator(iterator);
            var value = iterator.call(context, obj);
            var low = 0,
                high = array.length;
            while (low < high) {
                var mid = low + high >>> 1;
                iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid
            }
            return low
        };
        _.toArray = function(obj) {
            if (!obj) return [];
            if (_.isArray(obj)) return slice.call(obj);
            if (obj.length === +obj.length) return _.map(obj, _.identity);
            return _.values(obj)
        };
        _.size = function(obj) {
            if (obj == null) return 0;
            return obj.length === +obj.length ? obj.length : _.keys(obj).length
        };
        _.first = _.head = _.take = function(array, n, guard) {
            if (array == null) return void 0;
            return n != null && !guard ? slice.call(array, 0, n) : array[0]
        };
        _.initial = function(array, n, guard) {
            return slice.call(array, 0, array.length - (n == null || guard ? 1 : n))
        };
        _.last = function(array, n, guard) {
            if (array == null) return void 0;
            if (n != null && !guard) {
                return slice.call(array, Math.max(array.length - n, 0))
            } else {
                return array[array.length - 1]
            }
        };
        _.rest = _.tail = _.drop = function(array, n, guard) {
            return slice.call(array, n == null || guard ? 1 : n)
        };
        _.compact = function(array) {
            return _.filter(array, _.identity)
        };
        var flatten = function(input, shallow, output) {
            each(input, function(value) {
                if (_.isArray(value)) {
                    shallow ? push.apply(output, value) : flatten(value, shallow, output)
                } else {
                    output.push(value)
                }
            });
            return output
        };
        _.flatten = function(array, shallow) {
            return flatten(array, shallow, [])
        };
        _.without = function(array) {
            return _.difference(array, slice.call(arguments, 1))
        };
        _.uniq = _.unique = function(array, isSorted, iterator, context) {
            if (_.isFunction(isSorted)) {
                context = iterator;
                iterator = isSorted;
                isSorted = false
            }
            var initial = iterator ? _.map(array, iterator, context) : array;
            var results = [];
            var seen = [];
            each(initial, function(value, index) {
                if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
                    seen.push(value);
                    results.push(array[index])
                }
            });
            return results
        };
        _.union = function() {
            return _.uniq(concat.apply(ArrayProto, arguments))
        };
        _.intersection = function(array) {
            var rest = slice.call(arguments, 1);
            return _.filter(_.uniq(array), function(item) {
                return _.every(rest, function(other) {
                    return _.indexOf(other, item) >= 0
                })
            })
        };
        _.difference = function(array) {
            var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
            return _.filter(array, function(value) {
                return !_.contains(rest, value)
            })
        };
        _.zip = function() {
            var args = slice.call(arguments);
            var length = _.max(_.pluck(args, "length"));
            var results = new Array(length);
            for (var i = 0; i < length; i++) {
                results[i] = _.pluck(args, "" + i)
            }
            return results
        };
        _.object = function(list, values) {
            if (list == null) return {};
            var result = {};
            for (var i = 0, l = list.length; i < l; i++) {
                if (values) {
                    result[list[i]] = values[i]
                } else {
                    result[list[i][0]] = list[i][1]
                }
            }
            return result
        };
        _.indexOf = function(array, item, isSorted) {
            if (array == null) return -1;
            var i = 0,
                l = array.length;
            if (isSorted) {
                if (typeof isSorted == "number") {
                    i = isSorted < 0 ? Math.max(0, l + isSorted) : isSorted
                } else {
                    i = _.sortedIndex(array, item);
                    return array[i] === item ? i : -1
                }
            }
            if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
            for (; i < l; i++)
                if (array[i] === item) return i;
            return -1
        };
        _.lastIndexOf = function(array, item, from) {
            if (array == null) return -1;
            var hasIndex = from != null;
            if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
                return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item)
            }
            var i = hasIndex ? from : array.length;
            while (i--)
                if (array[i] === item) return i;
            return -1
        };
        _.range = function(start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0
            }
            step = arguments[2] || 1;
            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(len);
            while (idx < len) {
                range[idx++] = start;
                start += step
            }
            return range
        };
        var ctor = function() {};
        _.bind = function(func, context) {
            var args, bound;
            if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
            if (!_.isFunction(func)) throw new TypeError;
            args = slice.call(arguments, 2);
            return bound = function() {
                if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                ctor.prototype = func.prototype;
                var self = new ctor;
                ctor.prototype = null;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self
            }
        };
        _.bindAll = function(obj) {
            var funcs = slice.call(arguments, 1);
            if (funcs.length == 0) funcs = _.functions(obj);
            each(funcs, function(f) {
                obj[f] = _.bind(obj[f], obj)
            });
            return obj
        };
        _.memoize = function(func, hasher) {
            var memo = {};
            hasher || (hasher = _.identity);
            return function() {
                var key = hasher.apply(this, arguments);
                return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments)
            }
        };
        _.delay = function(func, wait) {
            var args = slice.call(arguments, 2);
            return setTimeout(function() {
                return func.apply(null, args)
            }, wait)
        };
        _.defer = function(func) {
            return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)))
        };
        _.throttle = function(func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function() {
                previous = new Date;
                timeout = null;
                result = func.apply(context, args)
            };
            return function() {
                var now = new Date;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args)
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining)
                }
                return result
            }
        };
        _.debounce = function(func, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args)
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(context, args);
                return result
            }
        };
        _.once = function(func) {
            var ran = false,
                memo;
            return function() {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo
            }
        };
        _.wrap = function(func, wrapper) {
            return function() {
                var args = [func];
                push.apply(args, arguments);
                return wrapper.apply(this, args)
            }
        };
        _.compose = function() {
            var funcs = arguments;
            return function() {
                var args = arguments;
                for (var i = funcs.length - 1; i >= 0; i--) {
                    args = [funcs[i].apply(this, args)]
                }
                return args[0]
            }
        };
        _.after = function(times, func) {
            if (times <= 0) return func();
            return function() {
                if (--times < 1) {
                    return func.apply(this, arguments)
                }
            }
        };
        _.keys = nativeKeys || function(obj) {
                if (obj !== Object(obj)) throw new TypeError("Invalid object");
                var keys = [];
                for (var key in obj)
                    if (_.has(obj, key)) keys[keys.length] = key;
                return keys
            };
        _.values = function(obj) {
            var values = [];
            for (var key in obj)
                if (_.has(obj, key)) values.push(obj[key]);
            return values
        };
        _.pairs = function(obj) {
            var pairs = [];
            for (var key in obj)
                if (_.has(obj, key)) pairs.push([key, obj[key]]);
            return pairs
        };
        _.invert = function(obj) {
            var result = {};
            for (var key in obj)
                if (_.has(obj, key)) result[obj[key]] = key;
            return result
        };
        _.functions = _.methods = function(obj) {
            var names = [];
            for (var key in obj) {
                if (_.isFunction(obj[key])) names.push(key)
            }
            return names.sort()
        };
        _.extend = function(obj) {
            each(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop]
                    }
                }
            });
            return obj
        };
        _.pick = function(obj) {
            var copy = {};
            var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
            each(keys, function(key) {
                if (key in obj) copy[key] = obj[key]
            });
            return copy
        };
        _.omit = function(obj) {
            var copy = {};
            var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
            for (var key in obj) {
                if (!_.contains(keys, key)) copy[key] = obj[key]
            }
            return copy
        };
        _.defaults = function(obj) {
            each(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (var prop in source) {
                        if (obj[prop] == null) obj[prop] = source[prop]
                    }
                }
            });
            return obj
        };
        _.clone = function(obj) {
            if (!_.isObject(obj)) return obj;
            return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
        };
        _.tap = function(obj, interceptor) {
            interceptor(obj);
            return obj
        };
        var eq = function(a, b, aStack, bStack) {
            if (a === b) return a !== 0 || 1 / a == 1 / b;
            if (a == null || b == null) return a === b;
            if (a instanceof _) a = a._wrapped;
            if (b instanceof _) b = b._wrapped;
            var className = toString.call(a);
            if (className != toString.call(b)) return false;
            switch (className) {
                case "[object String]":
                    return a == String(b);
                case "[object Number]":
                    return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
                case "[object Date]":
                case "[object Boolean]":
                    return +a == +b;
                case "[object RegExp]":
                    return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
            }
            if (typeof a != "object" || typeof b != "object") return false;
            var length = aStack.length;
            while (length--) {
                if (aStack[length] == a) return bStack[length] == b
            }
            aStack.push(a);
            bStack.push(b);
            var size = 0,
                result = true;
            if (className == "[object Array]") {
                size = a.length;
                result = size == b.length;
                if (result) {
                    while (size--) {
                        if (!(result = eq(a[size], b[size], aStack, bStack))) break
                    }
                }
            } else {
                var aCtor = a.constructor,
                    bCtor = b.constructor;
                if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
                    return false
                }
                for (var key in a) {
                    if (_.has(a, key)) {
                        size++;
                        if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break
                    }
                }
                if (result) {
                    for (key in b) {
                        if (_.has(b, key) && !size--) break
                    }
                    result = !size
                }
            }
            aStack.pop();
            bStack.pop();
            return result
        };
        _.isEqual = function(a, b) {
            return eq(a, b, [], [])
        };
        _.isEmpty = function(obj) {
            if (obj == null) return true;
            if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
            for (var key in obj)
                if (_.has(obj, key)) return false;
            return true
        };
        _.isElement = function(obj) {
            return !!(obj && obj.nodeType === 1)
        };
        _.isArray = nativeIsArray || function(obj) {
                return toString.call(obj) == "[object Array]"
            };
        _.isObject = function(obj) {
            return obj === Object(obj)
        };
        each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(name) {
            _["is" + name] = function(obj) {
                return toString.call(obj) == "[object " + name + "]"
            }
        });
        if (!_.isArguments(arguments)) {
            _.isArguments = function(obj) {
                return !!(obj && _.has(obj, "callee"))
            }
        }
        if (typeof /./ !== "function") {
            _.isFunction = function(obj) {
                return typeof obj === "function"
            }
        }
        _.isFinite = function(obj) {
            return isFinite(obj) && !isNaN(parseFloat(obj))
        };
        _.isNaN = function(obj) {
            return _.isNumber(obj) && obj != +obj
        };
        _.isBoolean = function(obj) {
            return obj === true || obj === false || toString.call(obj) == "[object Boolean]"
        };
        _.isNull = function(obj) {
            return obj === null
        };
        _.isUndefined = function(obj) {
            return obj === void 0
        };
        _.has = function(obj, key) {
            return hasOwnProperty.call(obj, key)
        };
        _.noConflict = function() {
            root._ = previousUnderscore;
            return this
        };
        _.identity = function(value) {
            return value
        };
        _.times = function(n, iterator, context) {
            var accum = Array(n);
            for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
            return accum
        };
        _.random = function(min, max) {
            if (max == null) {
                max = min;
                min = 0
            }
            return min + (0 | Math.random() * (max - min + 1))
        };
        var entityMap = {
            escape: {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "/": "&#x2F;"
            }
        };
        entityMap.unescape = _.invert(entityMap.escape);
        var entityRegexes = {
            escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
            unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
        };
        _.each(["escape", "unescape"], function(method) {
            _[method] = function(string) {
                if (string == null) return "";
                return ("" + string).replace(entityRegexes[method], function(match) {
                    return entityMap[method][match]
                })
            }
        });
        _.result = function(object, property) {
            if (object == null) return null;
            var value = object[property];
            return _.isFunction(value) ? value.call(object) : value
        };
        _.mixin = function(obj) {
            each(_.functions(obj), function(name) {
                var func = _[name] = obj[name];
                _.prototype[name] = function() {
                    var args = [this._wrapped];
                    push.apply(args, arguments);
                    return result.call(this, func.apply(_, args))
                }
            })
        };
        var idCounter = 0;
        _.uniqueId = function(prefix) {
            var id = "" + ++idCounter;
            return prefix ? prefix + id : id
        };
        _.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var noMatch = /(.)^/;
        var escapes = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "	": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        };
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        _.template = function(text, data, settings) {
            settings = _.defaults({}, settings, _.templateSettings);
            var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g");
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset).replace(escaper, function(match) {
                    return "\\" + escapes[match]
                });
                if (escape) {
                    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"
                }
                if (interpolate) {
                    source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
                }
                if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='"
                }
                index = offset + match.length;
                return match
            });
            source += "';\n";
            if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
            source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
            try {
                var render = new Function(settings.variable || "obj", "_", source)
            } catch (e) {
                e.source = source;
                throw e
            }
            if (data) return render(data, _);
            var template = function(data) {
                return render.call(this, data, _)
            };
            template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
            return template
        };
        _.chain = function(obj) {
            return _(obj).chain()
        };
        var result = function(obj) {
            return this._chain ? _(obj).chain() : obj
        };
        _.mixin(_);
        each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
            var method = ArrayProto[name];
            _.prototype[name] = function() {
                var obj = this._wrapped;
                method.apply(obj, arguments);
                if ((name == "shift" || name == "splice") && obj.length === 0) delete obj[0];
                return result.call(this, obj)
            }
        });
        each(["concat", "join", "slice"], function(name) {
            var method = ArrayProto[name];
            _.prototype[name] = function() {
                return result.call(this, method.apply(this._wrapped, arguments))
            }
        });
        _.extend(_.prototype, {
            chain: function() {
                this._chain = true;
                return this
            },
            value: function() {
                return this._wrapped
            }
        })
    }.call(this);
    ! function() {
        var originalXdmSocket = window.XdmSocket;
        var instance = null;
        var isPhantom = navigator.userAgent.indexOf("PhantomJS") !== -1;
        var extraLogging = false;
        var errorMessages = {
            "not-compatible": "This browser does not support the required features.",
            "only-one": "There can be only one.",
            "bad-remote": "Unable to connect to remote; possibly bad configuration.",
            "bad-message": "Received a malformed message: "
        };
        var bindEvent = function(element, eventName, handler) {
            if (element.addEventListener) {
                element.addEventListener(eventName, handler, true)
            } else {
                element.attachEvent("on" + eventName, handler)
            }
        };
        var unbindEvent = function(element, eventName, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(eventName, handler, true)
            } else {
                element.detachEvent("on" + eventName, handler)
            }
        };
        var messageHandler = function(event) {
            if (extraLogging && isPhantom) {
                var text = "stdout [XdmSocket] " + (window.R && R.Services ? "api_proxy" : "api-impl") + " receive " + (instance ? "" : " NO INSTANCE! ") + event.data + "\n";
                window.alert(text)
            }
            if (!instance || event.origin !== instance._otherOrigin) {
                return
            }
            var message;
            try {
                var envelope = JSON.parse(event.data);
                message = envelope.rdioMessage
            } catch (e) {
                message = null
            }
            if (!message) {
                instance._error("bad-message", event.data);
                return
            }
            if (message.type == "xdmReady") {
                if (instance._onReady) {
                    instance._onReady()
                }
            } else {
                if (instance._onMessage) {
                    instance._onMessage(message, event.origin)
                }
            }
        };
        window.XdmSocket = function(options) {
            var match;
            this._container = null;
            this._iframe = null;
            this._localOrigin = window.location.protocol + "//" + window.location.host;
            this._onReady = options.onReady;
            this._onMessage = options.onMessage;
            this._onError = options.onError;
            if (!window.postMessage) {
                this._error("not-compatible");
                return
            }
            if (instance) {
                this._error("only-one");
                return
            }
            if (options.remote && options.container) {
                var src = options.remote + (/\?/.test(options.remote) ? "&" : "?") + "xdm_e=" + this._localOrigin;
                match = src.match(/(^\w+:\/+[^\/]+)/);
                if (!match || match.length !== 2) {
                    this._error("bad-remote");
                    return
                }
                this._otherOrigin = match[1];
                this._container = options.container;
                this._iframe = document.createElement("iframe");
                this._iframe.className = "rdio_xdm";
                this._iframe.setAttribute("src", src);
                this._iframe.style.border = "none";
                if (options.props && options.props.style) {
                    for (var key in options.props.style) {
                        this._iframe.style[key] = options.props.style[key]
                    }
                }
                this._container.appendChild(this._iframe);
                this._otherWindow = this._iframe.contentWindow;
                if (extraLogging && isPhantom) {
                    window.alert("stdout [XdmSocket] iframe created: " + src + "\n")
                }
            } else if (window.parent) {
                this._otherWindow = window.parent;
                match = window.location.search.match(/xdm_e=([^&]+)/);
                if (!match || match.length !== 2) {
                    this._error("bad-remote");
                    return
                }
                this._otherOrigin = match[1];
                this._otherOrigin = this._otherOrigin.replace(/\/$/, "");
                this.postMessage({
                    type: "xdmReady"
                });
                if (options.onReady) {
                    setTimeout(options.onReady, 1)
                }
            } else {
                this._error("bad-remote");
                return
            }
            instance = this;
            bindEvent(window, "message", messageHandler)
        };
        XdmSocket.prototype = {
            postMessage: function(message) {
                if (extraLogging && isPhantom) {
                    var text = "stdout [XdmSocket] " + (window.R && R.Services ? "api_proxy" : "api-impl") + " send " + message + "\n";
                    window.alert(text)
                }
                var envelope = {
                    rdioMessage: message
                };
                this._otherWindow.postMessage(JSON.stringify(envelope), this._otherOrigin)
            },
            destroy: function() {
                if (this._container && this._iframe) {
                    this._container.removeChild(this._iframe)
                }
                this._container = null;
                this._iframe = null;
                if (instance == this) {
                    unbindEvent(window, "message", messageHandler);
                    instance = null
                }
            },
            _error: function(code, data) {
                var message = errorMessages[code];
                if (!message) {
                    message = "An error occurred."
                }
                if (data) {
                    message += data
                }
                if (window.console && console.error) {
                    console.error("[XdmSocket] " + message)
                }
                if (this._onError) {
                    this._onError(code, message)
                }
            }
        };
        XdmSocket.noConflict = function() {
            window.XdmSocket = originalXdmSocket;
            return this
        };
        XdmSocket.whenReady = function(callback) {
            if (document.body) {
                callback()
            } else {
                bindEvent(window, "load", callback)
            }
        }
    }();
    var Backbone = {};
    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;
    Backbone.Events = {
        on: function(events, callback, context) {
            var ev;
            events = events.split(/\s+/);
            var calls = this._callbacks || (this._callbacks = {});
            while (ev = events.shift()) {
                var list = calls[ev] || (calls[ev] = {});
                var tail = list.tail || (list.tail = list.next = {});
                tail.callback = callback;
                tail.context = context;
                list.tail = tail.next = {}
            }
            return this
        },
        off: function(events, callback, context) {
            var ev, calls, node;
            if (!events) {
                delete this._callbacks
            } else if (calls = this._callbacks) {
                events = events.split(/\s+/);
                while (ev = events.shift()) {
                    node = calls[ev];
                    delete calls[ev];
                    if (!callback || !node) continue;
                    while ((node = node.next) && node.next) {
                        if (node.callback === callback && (!context || node.context === context)) continue;
                        this.on(ev, node.callback, node.context)
                    }
                }
            }
            return this
        },
        trigger: function(events) {
            var event, node, calls, tail, args, all, rest;
            if (!(calls = this._callbacks)) return this;
            all = calls["all"];
            (events = events.split(/\s+/)).push(null);
            while (event = events.shift()) {
                if (all) events.push({
                    next: all.next,
                    tail: all.tail,
                    event: event
                });
                if (!(node = calls[event])) continue;
                events.push({
                    next: node.next,
                    tail: node.tail
                })
            }
            rest = slice.call(arguments, 1);
            while (node = events.pop()) {
                tail = node.tail;
                args = node.event ? [node.event].concat(rest) : rest;
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, args)
                }
            }
            return this
        }
    };
    Backbone.Events.bind = Backbone.Events.on;
    Backbone.Events.unbind = Backbone.Events.off;
    ! function(_, XdmSocket) {
        function eachKey(obj, iterator, context) {
            if (!obj) {
                return
            }
            for (var key in obj) {
                if (_.has(obj, key)) {
                    iterator.call(context, obj[key], key, obj)
                }
            }
        }

        function deepClone(obj) {
            var result = {};
            eachKey(obj, function(v, k) {
                if (_.isObject(v)) {
                    if (v.toJSON) {
                        result[k] = v.toJSON()
                    } else {
                        result[k] = deepClone(v)
                    }
                } else {
                    result[k] = v
                }
            });
            return result
        }

        function upperCaseInitial(val) {
            return val.replace(/^([a-z])/, function($0, $1) {
                return $1.toUpperCase()
            })
        }
        var socketContainerBorderSize = 10;
        var socket, socketContainer;
        var socketContainerHiddenStyle = {
            position: "fixed",
            overflow: "hidden",
            width: "1px",
            height: "1px",
            left: "-100px",
            top: "0",
            marginLeft: "0",
            marginTop: "0",
            zIndex: 0,
            border: socketContainerBorderSize + "px solid gray",
            borderRadius: "6px"
        };

        function sendMessage(message) {
            socket.postMessage(message)
        }
        var callback_id = 1;
        var callbacks = {};

        function registerCallback(config) {
            var id = callback_id++;
            callbacks[id] = config;
            return id
        }

        function AbortProxy(id) {
            this._id = id
        }
        AbortProxy.prototype = {
            abort: function() {
                __rdio._abortRequest(this._id)
            }
        };

        function Request(config) {
            this.method = config.method;
            this.content = config.content;
            this.aborting = false;
            this.abortingForReboot = false;
            this.id = registerCallback(_.pick(config, "success", "error", "complete"))
        }
        Request.prototype = {
            send: function() {
                sendMessage({
                    type: "request",
                    method: this.method,
                    content: this.content,
                    access_token: __rdio._accessToken,
                    callback: this.id
                })
            }
        };

        function Module(name, config, parent) {
            this._configure(name, config, parent)
        }

        function isModule(value) {
            return _.isObject(value) && value._parent
        }
        Module.prototype = _.extend({
            _configure: function(name, config, parent) {
                var self = this;
                this._name = name;
                this._parent = parent || null;
                eachKey(config.constants, function(v, k) {
                    self[k] = v
                });
                _.each(config.commands, function(v, i) {
                    self[v] = function() {
                        self._command(v, _.toArray(arguments))
                    }
                });
                if (config.attributes) {
                    this.attributes = {};
                    eachKey(config.attributes, function(v, k) {
                        self._setAttribute(k, v)
                    });
                    this.get = function(key) {
                        return this.attributes[key]
                    };
                    this.set = function(keyOrMap, value) {
                        var change;
                        if (_.isObject(keyOrMap)) {
                            change = keyOrMap
                        } else {
                            change = {};
                            change[keyOrMap] = value
                        }
                        sendMessage({
                            type: "change",
                            change: change,
                            target: self._target()
                        })
                    };
                    this.toJSON = function() {
                        return deepClone(this.attributes)
                    }
                }
                eachKey(config.children, function(v, k) {
                    self[k] = Module.create(k, v, self)
                })
            },
            _infoForReboot: function(info) {
                var self = this;
                if (_.isUndefined(info)) {
                    info = {
                        attributes: {},
                        children: {},
                        callbacks: this._callbacks
                    };
                    if (this.attributes) {
                        eachKey(this.attributes, function(v, k) {
                            if (isModule(v)) {
                                info.attributes[k] = _.extend(v._infoForReboot(), {
                                    __module: true
                                })
                            } else {
                                info.attributes[k] = _.clone(v)
                            }
                        })
                    }
                    eachKey(this, function(v, k) {
                        if (k !== "_parent" && isModule(v)) {
                            info.children[k] = v._infoForReboot()
                        }
                    });
                    return info
                }
                eachKey(info.callbacks, function(v, k) {
                    while (v) {
                        if (v.callback) {
                            self.on(k, v.callback, v.context)
                        }
                        v = v.next
                    }
                });
                if (this.attributes) {
                    eachKey(info.attributes, function(v, k) {
                        if (_.isObject(v) && v.__module && isModule(self.attributes[k])) {
                            self.attributes[k]._infoForReboot(v)
                        } else if (v !== self.attributes[k]) {
                            self.trigger("change:" + k, self.attributes[k])
                        }
                    });
                    var newAttributes = _.difference(_.keys(this.attributes), _.keys(info.attributes));
                    _.each(newAttributes, function(v, i) {
                        self.trigger("change:" + v, self.attributes[v])
                    })
                }
                eachKey(info.children, function(v, k) {
                    if (_.isObject(self[k])) {
                        self[k]._infoForReboot(v)
                    }
                })
            },
            _getModule: function(chain) {
                if (!chain.length) {
                    return this
                }
                if (chain[0] in this) {
                    return this[chain[0]]._getModule(_.rest(chain))
                } else if (this.attributes && chain[0] in this.attributes) {
                    return this.attributes[chain[0]]._getModule(_.rest(chain))
                }
                return null
            },
            _target: function() {
                if (this._parent) {
                    return this._parent._target() + "." + this._name
                }
                return this._name
            },
            _setAttribute: function(key, value) {
                if (_.isObject(value) && "__module" in value) {
                    this.attributes[key] = Module.create(key, value.__module, this)
                } else {
                    this.attributes[key] = value
                }
            },
            _handleChange: function(changes) {
                var self = this;
                eachKey(changes, function(v, k) {
                    self._setAttribute(k, v);
                    self.trigger("change:" + k, self.attributes[k])
                })
            },
            _command: function(name, args) {
                if (_.isArray(args)) {
                    args = _.map(args, function(v, i) {
                        if (_.isFunction(v)) {
                            var id = registerCallback({
                                complete: v
                            });
                            return "__rdio_callback:" + id
                        }
                        return v
                    })
                }
                sendMessage({
                    type: "command",
                    command: name,
                    target: this._target(),
                    args: args
                })
            }
        }, Backbone.Events);
        Module.extend = function(subclass) {
            var constructor = function() {
                this._configure.apply(this, arguments)
            };
            constructor.prototype = _.extend({
                _super: function(method) {
                    return Module.prototype[method].apply(this, _.rest(arguments))
                }
            }, Module.prototype, subclass);
            return constructor
        };
        CollectionModule = Module.extend({
            _configure: function(name, config, parent) {
                var self = this;
                this._super("_configure", name, config, parent);
                this.models = [];
                _.each(config.models, function(v, i) {
                    var module = Module.create("" + i, v, self);
                    module.on("all", function() {
                        self._handleModuleEvent(module, _.toArray(arguments))
                    });
                    self.models.push(module)
                });
                this.length = this.models.length
            },
            _getModule: function(chain) {
                if (!chain.length) {
                    return this
                }
                var index = parseInt(chain[0], 10);
                if ("" + index === chain[0] && index >= 0 && index < this.models.length) {
                    return this.models[index]._getModule(_.rest(chain))
                }
                return null
            },
            _handleAdd: function(value) {
                var self = this;
                var module = Module.create("temp", value.module, this);
                module.on("all", function() {
                    self._handleModuleEvent(module, _.toArray(arguments))
                });
                this.models.splice(value.index, 0, module);
                _.each(this.models, function(v, i) {
                    v._name = "" + i
                });
                this.length = this.models.length;
                this.trigger("add", module, this, {
                    index: value.index
                })
            },
            _handleRemove: function(value) {
                var module = this.models[value.index];
                module.off(null, null, this);
                this.models.splice(value.index, 1);
                _.each(this.models, function(v, i) {
                    v._name = "" + i
                });
                this.length = this.models.length;
                this.trigger("remove", module, this, {
                    index: value.index
                })
            },
            _handleReset: function() {
                var self = this;
                _.each(this.models, function(v, i) {
                    v.off(null, null, self)
                });
                this.models = [];
                this.length = this.models.length;
                this.trigger("reset", this, {})
            },
            _handleModuleEvent: function(module, args) {
                args.splice(1, 0, module);
                this.trigger.apply(this, args)
            },
            at: function(index) {
                return this.models[index]
            },
            toJSON: function() {
                return _.map(this.models, function(v, i) {
                    return v.toJSON()
                })
            }
        });
        Module.create = function(name, config, parent) {
            if (config.models) {
                return new CollectionModule(name, config, parent)
            }
            return new Module(name, config, parent)
        };
        _.extend(__rdio, Module.prototype, {
            _socketReady: false,
            _ready: false,
            _accessToken: null,
            _authenticated: undefined,
            _authenticationCallback: null,
            _authenticating: false,
            _waitingForAuthenticationCheckToStart: false,
            _rebooting: false,
            _loggingOut: false,
            _logoutCallbacks: [],
            _permissions: [],
            _needsAudioPrime: false,
            _audioPrimed: false,
            _audioPriming: false,
            _afterAudioPrime: [],
            _audioPrimeShield: null,
            _requestsInFlight: {},
            _pendingRequests: [],
            _waitingForAborts: false,
            _init: function() {
                if (!this._accessToken) {
                    this._checkAuthentication()
                }
                this._startSocket()
            },
            _startSocket: function() {
                var self = this;
                var socket_options = {
                    onMessage: function(message, origin) {
                        self._dispatch(message)
                    },
                    onReady: function() {
                        self._socketReady = true;
                        if (self._accessToken) {
                            self._sendToken()
                        }
                        self._sendPendingRequests()
                    }
                };
                if (!this._config.insideRdio) {
                    if (/applewebkit/i.test(navigator.userAgent) && /(mobile|android)/i.test(navigator.userAgent)) {
                        this._needsAudioPrime = true
                    }
                    socket_options.remote = this._config.iframe;
                    socket_options.props = {
                        style: {
                            width: "100%",
                            height: "100%"
                        }
                    };
                    socketContainer = document.createElement("div");
                    _.extend(socketContainer.style, socketContainerHiddenStyle);
                    document.body.appendChild(socketContainer);
                    socket_options.container = socketContainer
                }
                socket = new XdmSocket(socket_options)
            },
            ready: function(callback) {
                if (callback) {
                    if (this._ready) {
                        _.defer(callback, true)
                    } else {
                        this.on("change:ready", callback)
                    }
                }
                return this._ready
            },
            logout: function(callback) {
                var self = this;
                if (!this._authenticated) {
                    this._error("Must be authenticated to log out");
                    if (callback) {
                        callback(false)
                    }
                    return
                }
                if (this._authenticating) {
                    this._error("Cannot log out while authenticating");
                    if (callback) {
                        callback(false)
                    }
                    return
                }
                if (callback) {
                    this._logoutCallbacks.push(callback)
                }
                if (this._loggingOut) {
                    this._error("Already logging out");
                    return
                }
                this._loggingOut = true;
                var iframe = document.createElement("iframe");
                _.extend(iframe.style, socketContainerHiddenStyle);
                iframe.onload = function() {
                    document.body.removeChild(iframe);
                    self._accessToken = null;
                    self._reboot();
                    self._authenticationCallback = function(authenticated) {
                        self._loggingOut = false;
                        _.each(self._logoutCallbacks, function(v, i) {
                            v(!authenticated)
                        });
                        self._logoutCallbacks = []
                    };
                    self._checkAuthentication()
                };
                iframe.src = this._config.logout;
                document.body.appendChild(iframe)
            },
            authenticated: function() {
                return this._authenticated
            },
            authenticate: function(callbackOrConfig) {
                var callback = null;
                var config = {};
                if (_.isFunction(callbackOrConfig)) {
                    callback = callbackOrConfig
                } else if (_.isObject(callbackOrConfig)) {
                    config = callbackOrConfig;
                    callback = config.complete
                }
                if (config.mode && config.mode != "popup" && config.mode != "redirect") {
                    this._error("Invalid authentication mode: " + config.mode);
                    return
                }
                if (this._authenticating) {
                    if (this._authenticationWindow) {
                        this._authenticationWindow.focus()
                    } else {
                        this._error("already authenticating")
                    }
                    return
                }
                var args = "login=true";
                if (config.linkshareId) {
                    args += "&linkshare_id=" + config.linkshareId
                }
                this._authenticating = true;
                this._authenticationCallback = callback;
                var mode = "popup";
                if (/(iPhone|iPad|iPod)/.test(navigator.userAgent) || config.mode == "redirect") {
                    mode = "redirect"
                }
                if (mode == "redirect") {
                    args += "&oauth2=" + encodeURIComponent(this._config.oauth2);
                    args += "&redirect_uri=" + encodeURIComponent(window.location.href);
                    window.location.href = this._helperSrc(args)
                } else {
                    this._authenticationWindow = window.open(this._helperSrc(args), "", "width=800,height=600");
                    if (!this._authenticationWindow) {
                        this._error("Can't authenticate, due to popup blocker.")
                    } else {
                        this._monitorAuthenticationWindow(true)
                    }
                }
            },
            _monitorAuthenticationWindow: function() {
                var interval = null;
                return function(monitor) {
                    var self = this;
                    if (monitor && interval === null) {
                        interval = setInterval(function() {
                            if (self._authenticationWindow.closed) {
                                if (localStorage.getItem("__rdioNewAuthFlag") == "true") {
                                    localStorage.removeItem("__rdioNewAuthFlag");
                                    self._authenticating = false;
                                    self._monitorAuthenticationWindow(false);
                                    self._checkAuthentication()
                                } else {
                                    self._authenticationDenied()
                                }
                            }
                        }, 1e3)
                    } else if (!monitor && interval !== null) {
                        clearInterval(interval);
                        interval = null;
                        this._authenticationWindow = null
                    }
                }
            }(),
            _checkAuthentication: function() {
                var self = this;
                if (this._authenticating) {
                    this._error("already authenticating");
                    return
                }
                this._authenticating = true;
                this._waitingForAuthenticationCheckToStart = true;
                var i = document.createElement("iframe");
                i.setAttribute("src", this._helperSrc());
                i.setAttribute("style", "width:1px;height:1px;position:absolute;left:-100px");
                document.body.appendChild(i);
                _.delay(function() {
                    if (self._waitingForAuthenticationCheckToStart) {
                        self._error('Authentication helper "' + self._config.helper + "\" isn't working. Perhaps it's missing or doesn't have the right JavaScript link. " + "Note that the script it uses has moved to https://www.rdio.com/media/fresh/now/api-helper.js. " + "See http://www.rdio.com/developers/docs/jsapi/overview/ for more info.")
                    }
                }, 3e3)
            },
            _authenticationCheckStarted: function() {
                this._waitingForAuthenticationCheckToStart = false
            },
            _authenticationDenied: function() {
                this._monitorAuthenticationWindow(false);
                sendMessage({
                    type: "authenticationDenied"
                })
            },
            accessToken: function(value) {
                if (_.isUndefined(value)) {
                    return this._accessToken
                }
                if (value === this._accessToken) {
                    return
                }
                this._accessToken = value;
                this.trigger("change:accessToken", this._accessToken);
                if (this._socketReady) {
                    this._sendToken()
                }
            },
            _sendToken: function() {
                sendMessage({
                    type: "newAccessToken",
                    accessToken: this._accessToken
                })
            },
            permissions: function() {
                return this._permissions
            },
            request: function(config) {
                var request = new Request(config);
                if (!this._socketReady || this._waitingForAborts) {
                    this._pendingRequests.push(request)
                } else {
                    request.send();
                    this._requestsInFlight[request.id] = request
                }
                return new AbortProxy(request.id)
            },
            getTrackableObject: function(key, callback) {
                var id = registerCallback({
                    complete: callback
                });
                sendMessage({
                    type: "getObject",
                    key: key,
                    id: id
                })
            },
            _handleGetObjectResult: function(id, index) {
                var funcs = callbacks[id];
                delete callbacks[id];
                if (!funcs || !funcs.complete) {
                    return
                }
                var obj = null;
                if (index !== -1) {
                    obj = this._apiProxyObjects.at(index);
                    if (obj) {
                        obj._refCount = (obj._refCount || 0) + 1;
                        obj.release = function() {
                            if (obj._refCount <= 0) {
                                return
                            }
                            obj._refCount--;
                            if (obj._refCount !== 0) {
                                return
                            }
                            var key = obj.attributes ? obj.attributes.key : null;
                            if (!key) {
                                return
                            }
                            sendMessage({
                                type: "releaseObject",
                                key: key
                            })
                        }
                    }
                }
                funcs.complete(obj)
            },
            _handleCallback: function(id, data) {
                var request = this._requestsInFlight[id];
                if (data && data.status == "abort" && request && request.abortingForReboot) {
                    request.aborting = false;
                    request.abortingForReboot = false;
                    this._pendingRequests.push(request)
                } else {
                    var funcs = callbacks[id];
                    if (funcs) {
                        if (data && data.status == "ok") {
                            if (_.isFunction(funcs.success)) {
                                funcs.success(data)
                            }
                        } else {
                            if (_.isFunction(funcs.error)) {
                                funcs.error(data)
                            }
                        }
                        if (_.isFunction(funcs.complete)) {
                            funcs.complete(data)
                        }
                        delete callbacks[id]
                    }
                }
                delete this._requestsInFlight[id];
                if (this._rebooting && this._waitingForAborts && !_.size(this._requestsInFlight)) {
                    this._waitingForAborts = false;
                    this._continueReboot()
                }
            },
            _abortRequest: function(id, options) {
                var self = this;
                options = options || {};
                var request = this._requestsInFlight[id];
                if (request) {
                    request.abortingForReboot = options.forReboot || false;
                    if (!request.aborting) {
                        request.aborting = true;
                        sendMessage({
                            type: "abortRequest",
                            id: id
                        })
                    }
                } else {
                    request = _.where(this._pendingRequests, {
                        id: id
                    })[0];
                    if (request) {
                        this._pendingRequests = _.without(this._pendingRequests, request);
                        _.defer(function() {
                            self._handleCallback(id, {
                                status: "abort",
                                message: "abort",
                                code: 0
                            })
                        })
                    }
                }
            },
            _sendPendingRequests: function() {
                var self = this;
                _.each(this._pendingRequests, function(v, i) {
                    v.send();
                    self._requestsInFlight[v.id] = v
                });
                this._pendingRequests = []
            },
            _audioPrime: function(k) {
                if (!this._needsAudioPrime || this._audioPrimed) {
                    k();
                    return
                }
                this._afterAudioPrime.push(k);
                if (this._audioPriming) {
                    return
                }
                this._audioPriming = true;
                this._audioPrimeShield = document.createElement("div");
                _.extend(this._audioPrimeShield.style, {
                    position: "fixed",
                    left: "0",
                    top: "0",
                    right: "0",
                    bottom: "0",
                    zIndex: 99998
                });
                document.body.appendChild(this._audioPrimeShield);
                var w = 278;
                var h = 246;
                _.extend(socketContainer.style, {
                    width: w + "px",
                    height: h + "px",
                    left: "50%",
                    top: "50%",
                    marginLeft: Math.floor(-w / 2) - socketContainerBorderSize + "px",
                    marginTop: Math.floor(-h / 2) - socketContainerBorderSize + "px",
                    zIndex: 99999
                });
                sendMessage({
                    type: "audioPrime"
                });
                this.trigger("audioPriming")
            },
            _handleAudioPrime: function(success) {
                this._audioPriming = false;
                this._audioPrimed = success;
                _.extend(socketContainer.style, socketContainerHiddenStyle);
                if (this._audioPrimeShield) {
                    document.body.removeChild(this._audioPrimeShield);
                    this._audioPrimeShield = null
                }
                if (success) {
                    _.each(this._afterAudioPrime, function(v, i) {
                        v()
                    })
                }
                this._afterAudioPrime = [];
                if (success) {
                    this.trigger("audioPrimed")
                } else {
                    this.trigger("audioPrimeCancelled")
                }
            },
            _helperSrc: function(args) {
                return this._config.helper + (/\?/.test(this._config.helper) ? "&" : "?") + "client_id=" + encodeURIComponent(this._config.client_id) + (args ? "&" + args : "")
            },
            _dispatch: function(message) {
                switch (message.type) {
                    case "change":
                    case "add":
                    case "remove":
                    case "reset":
                        this._dispatchToModule(message);
                        break;
                    case "callback":
                        this._handleCallback(message.callback, message.response);
                        break;
                    case "getObjectResult":
                        this._handleGetObjectResult(message.id, message.index);
                        break;
                    case "ready":
                        if (this._rebooting) {
                            this._rebooting = false;
                            this._updateForReboot(message.config);
                            this.trigger("rebootEnd")
                        } else {
                            this._configure("rdio", message.config);
                            this._configureSpecialCases();
                            this._ready = true;
                            this.trigger("change:ready", true)
                        }
                        break;
                    case "authenticated":
                        this._handleAuthenticated(message.authenticated, message.permissions);
                        break;
                    case "newAccessToken":
                        this.accessToken(message.accessToken);
                        break;
                    case "audioPrime":
                        this._handleAudioPrime(message.success);
                        break;
                    case "flashError":
                        this.trigger("flashError");
                        break;
                    case "cookieError":
                        this.trigger("cookieError");
                        break;
                    default:
                        this._error("unexpected message:", message);
                        break
                }
            },
            _handleAuthenticated: function(authenticated, permissions) {
                var self = this;
                var update = function() {
                    self.off("rebootEnd", update);
                    if (_.difference(permissions, self._permissions).length) {
                        self._permissions = permissions;
                        self.trigger("change:permissions", self._permissions)
                    }
                    if (authenticated !== self._authenticated) {
                        self._authenticated = authenticated;
                        self.trigger("change:authenticated", self._authenticated)
                    }
                    if (self._authenticationCallback) {
                        self._authenticationCallback(self._authenticated);
                        self._authenticationCallback = null
                    }
                };
                this._authenticating = false;
                if (!authenticated) {
                    this._warn("NOTE: The above 401 error is normal; it just means that the user is not logged in to Rdio or hasn't yet authorized this app.")
                }
                if (this._rebooting) {
                    this.on("rebootEnd", update)
                } else if (!this._ready) {
                    update()
                } else {
                    var reboot = false;
                    if (authenticated && this.currentUser.get("isAnonymous")) {
                        reboot = true
                    } else {
                        var oldSharedPlaystate = _.indexOf(this._permissions, "shared_playstate") != -1;
                        var newSharedPlaystate = _.indexOf(permissions, "shared_playstate") != -1;
                        if (oldSharedPlaystate != newSharedPlaystate && !this._config.insideRdio) {
                            reboot = true
                        }
                    }
                    if (reboot) {
                        this._reboot()
                    } else {
                        update()
                    }
                }
            },
            _dispatchToModule: function(message) {
                if (!_.isString(message.target)) {
                    this._error(message.type + ": no target");
                    return
                }
                var chain = message.target.split(".");
                chain.shift();
                var module = this._getModule(chain);
                if (module) {
                    var method = "_handle" + upperCaseInitial(message.type);
                    if (method in module) {
                        module[method](message.body)
                    } else {
                        this._error(message.type + ": " + message.target + " is not the right kind of object")
                    }
                } else {
                    this._error(message.type + ": unable to locate " + message.target)
                }
            },
            _deliverTestInfo: function(data) {
                sendMessage({
                    type: "testInfo",
                    testInfo: data
                })
            },
            _console: function(args, method) {
                if ("console" in window && method in console) {
                    if (_.isFunction(console[method])) {
                        if (_.isString(args[0])) {
                            args[0] = "[Rdio API] " + args[0]
                        } else {
                            args.unshift("[Rdio API] " + method)
                        }
                        console[method].apply(console, args)
                    } else {
                        console[method]("[Rdio API] " + args.join("; "))
                    }
                }
            },
            _log: function() {
                this._console(_.toArray(arguments), "log")
            },
            _warn: function() {
                this._console(_.toArray(arguments), "warn")
            },
            _error: function() {
                this._console(_.toArray(arguments), "error")
            },
            _configureSpecialCases: function(config) {
                var self = this;
                config = config || {};
                eachKey(this.player._model.attributes, function(v, k) {
                    if (!_.isFunction(self.player[k])) {
                        return
                    }
                    self.player[k] = function(value) {
                        if (value === undefined) {
                            return self.player._model.get(k)
                        }
                        self.player._command(k, [value])
                    }
                });
                this.player.isMaster = function() {
                    return self.player._model.get("isMaster") === self.player.MASTER_ME
                };
                if (!config.forReboot) {
                    this.player._model.bind("all", function(eventType, value) {
                        if (eventType == "change:isMaster") {
                            self.player.trigger(eventType, value === self.player.MASTER_ME)
                        } else {
                            self.player.trigger.apply(self.player, arguments)
                        }
                    })
                }
                this.player.queue.length = function() {
                    return self.player._model.get("queue").length
                };
                this.player.queue.at = function(index) {
                    return self.player._model.get("queue").at(index)
                };
                this.player.queue.toJSON = function() {
                    return self.player._model.get("queue").toJSON()
                };
                if (!config.forReboot) {
                    this.player._model.get("queue").bind("all", function(eventName) {
                        self.player.queue.trigger.apply(self.player.queue, arguments)
                    })
                }
                if (this._needsAudioPrime) {
                    this._wrapWithAudioPrime(this.player.queue, "play");
                    var names = ["next", "nextSource", "play", "previous", "togglePause"];
                    _.each(names, function(v, i) {
                        self._wrapWithAudioPrime(self.player, v)
                    });
                    names = ["position", "sourcePosition"];
                    _.each(names, function(v, i) {
                        self._wrapAccessorWithAudioPrime(self.player, v)
                    })
                }
            },
            _wrapWithAudioPrime: function(module, name) {
                var self = this;
                var func = module[name];
                module[name] = function() {
                    var funcThis = this;
                    var funcArguments = arguments;
                    self._audioPrime(function() {
                        func.apply(funcThis, funcArguments)
                    })
                }
            },
            _wrapAccessorWithAudioPrime: function(module, name) {
                var self = this;
                var func = module[name];
                module[name] = function(value) {
                    var funcThis = this;
                    if (_.isUndefined(value)) {
                        return func.apply(funcThis)
                    }
                    self._audioPrime(function() {
                        func.apply(funcThis, [value])
                    })
                }
            },
            _reboot: function() {
                var self = this;
                this._rebooting = true;
                this.trigger("rebootStart");
                if (_.size(this._requestsInFlight)) {
                    this._waitingForAborts = true;
                    _.each(this._requestsInFlight, function(v, k) {
                        if (!v.aborting) {
                            self._abortRequest(k, {
                                forReboot: true
                            })
                        }
                    });
                    setTimeout(function() {
                        if (self._waitingForAborts) {
                            self._waitingForAborts = false;
                            self._requestsInFlight = {};
                            self._continueReboot()
                        }
                    }, 1e3)
                } else {
                    this._continueReboot()
                }
            },
            _continueReboot: function() {
                if (this._audioPriming) {
                    this._handleAudioPrime(false)
                } else {
                    this._audioPrimed = false
                }
                socket.destroy();
                this._socketReady = false;
                this._startSocket()
            },
            _updateForReboot: function(config) {
                var old = this._infoForReboot();
                delete old.callbacks;
                this._configure("rdio", config);
                this._configureSpecialCases({
                    forReboot: true
                });
                this._infoForReboot(old)
            }
        });
        __rdio.router = {
            navigate: function(fragment) {
                if (/^http/i.test(fragment)) {
                    var stripper = /^https?:\/\/(www\.)?/i;
                    var strippedFragment = fragment.replace(stripper, "");
                    var strippedBaseUrl = __rdio._config.baseUrl.replace(stripper, "");
                    if (strippedFragment.indexOf(strippedBaseUrl) === 0) {
                        fragment = strippedFragment.substr(strippedBaseUrl.length - 1)
                    } else {
                        __rdio._error("R.router.navigate() is for Rdio URLs only. This URL won't work: " + fragment);
                        return
                    }
                }
                if (__rdio._config.insideRdio) {
                    sendMessage({
                        type: "navigate",
                        fragment: fragment
                    })
                } else {
                    location.href = __rdio._config.baseUrl + fragment.replace(/^\//, "")
                }
            }
        };
        _.each(__rdio._config.earlyReadies, function(v, i) {
            __rdio.ready.apply(__rdio, v)
        });
        _.each(__rdio._config.earlySubscriptions, function(v, i) {
            __rdio.on.apply(__rdio, v)
        });
        __rdio.accessToken(__rdio._config.earlyAccessToken);
        if (_.isFunction(__rdio._config.testHook)) {
            __rdio._config.testHook()
        }
        XdmSocket.whenReady(function() {
            __rdio._init()
        })
    }(_.noConflict(), XdmSocket.noConflict())
}();