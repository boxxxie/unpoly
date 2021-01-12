
/***
@module up
 */

(function() {
  window.up = {
    version: "1.0.0"
  };

}).call(this);

/***
Utility functions
=================

The `up.util` module contains functions to facilitate the work with basic JavaScript
values like lists, strings or functions.

You will recognize many functions form other utility libraries like [Lodash](https://lodash.com/).
While feature parity with Lodash is not a goal of `up.util`, you might find it sufficient
to not include another library in your asset bundle.

@module up.util
 */

(function() {
  var slice = [].slice,
    hasProp = {}.hasOwnProperty;

  up.util = (function() {

    /***
    A function that does nothing.
    
    @function up.util.noop
    @experimental
     */
    var APP_HOSTNAME, APP_PROTOCOL, ESCAPE_HTML_ENTITY_MAP, NORMALIZE_URL_DEFAULTS, SPRINTF_PLACEHOLDERS, abortableMicrotask, always, arrayToSet, assign, assignPolyfill, asyncNoop, camelToKebabCase, compact, compactObject, contains, copy, copyArrayLike, defineDelegates, defineGetter, each, eachIterator, endsWith, escapeHTML, escapeRegExp, evalOption, every, extractCallback, extractLastArg, extractOptions, filterList, findInList, findResult, flatMap, flatten, identity, intersect, isArguments, isArray, isBasicObjectProperty, isBlank, isBoolean, isCrossDomain, isDefined, isElement, isElementish, isEqual, isEqualList, isFormData, isFunction, isGiven, isHTMLCollection, isJQuery, isList, isMissing, isNodeList, isNull, isNumber, isObject, isOptions, isPresent, isPromise, isRegExp, isStandardPort, isString, isTruthy, isUndefined, iteratee, last, literal, lowerCaseFirst, map, mapObject, matchURLs, memoize, merge, mergeDefined, methodAllowsPayload, muteRejection, newDeferred, newOptions, nextUid, noop, normalizeMethod, normalizeURL, nullToUndefined, objectContains, objectValues, omit, parseArgIntoOptions, parseURL, pick, pickBy, pluckKey, prefixCamelCase, presence, queueMicrotask, queueTask, reject, rejectOnError, remove, renameKey, renameKeys, reverse, scheduleTimer, secondsSinceEpoch, sequence, setToArray, simpleEase, some, splitValues, sprintf, sprintfWithFormattedArgs, stringifyArg, sum, times, toArray, uid, uniq, uniqBy, unprefixCamelCase, unresolvablePromise, upperCaseFirst, urlWithoutHost, valuesPolyfill, wrapList, wrapValue;
    noop = (function() {});

    /***
    A function that returns a resolved promise.
    
    @function up.util.asyncNoop
    @internal
     */
    asyncNoop = function() {
      return Promise.resolve();
    };

    /***
    Ensures that the given function can only be called a single time.
    Subsequent calls will return the return value of the first call.
    
    Note that this is a simple implementation that
    doesn't distinguish between argument lists.
    
    @function up.util.memoize
    @internal
     */
    memoize = function(func) {
      var cached, cachedValue;
      cachedValue = void 0;
      cached = false;
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (cached) {
          return cachedValue;
        } else {
          cached = true;
          return cachedValue = func.apply(this, args);
        }
      };
    };

    /***
    Returns if the given port is the default port for the given protocol.
    
    @function up.util.isStandardPort
    @internal
     */
    isStandardPort = function(protocol, port) {
      port = port.toString();
      return ((port === "" || port === "80") && protocol === 'http:') || (port === "443" && protocol === 'https:');
    };
    NORMALIZE_URL_DEFAULTS = {
      host: 'cross-domain',
      stripTrailingSlash: false,
      search: true,
      hash: false
    };

    /***
    Normalizes relative paths and absolute paths to a full URL
    that can be checked for equality with other normalized URLs.
    
    By default hashes are ignored, search queries are included.
    
    @function up.util.normalizeURL
    @param {boolean} [options.host='cross-domain']
      Whether to include protocol, hostname and port in the normalized URL.
    @param {boolean} [options.hash=false]
      Whether to include an `#hash` anchor in the normalized URL
    @param {boolean} [options.search=true]
      Whether to include a `?query` string in the normalized URL
    @param {boolean} [options.stripTrailingSlash=false]
      Whether to strip a trailing slash from the pathname
    @internal
     */
    normalizeURL = function(urlOrAnchor, options) {
      var normalized, parts, pathname;
      options = newOptions(options, NORMALIZE_URL_DEFAULTS);
      parts = parseURL(urlOrAnchor);
      normalized = '';
      if (options.host === 'cross-domain') {
        options.host = isCrossDomain(parts);
      }
      if (options.host) {
        normalized += parts.protocol + "//" + parts.hostname;
        if (!isStandardPort(parts.protocol, parts.port)) {
          normalized += ":" + parts.port;
        }
      }
      pathname = parts.pathname;
      if (options.stripTrailingSlash) {
        pathname = pathname.replace(/\/$/, '');
      }
      normalized += pathname;
      if (options.search) {
        normalized += parts.search;
      }
      if (options.hash) {
        normalized += parts.hash;
      }
      return normalized;
    };
    urlWithoutHost = function(url) {
      return normalizeURL(url, {
        host: false
      });
    };
    matchURLs = function(leftURL, rightURL) {
      return normalizeURL(leftURL) === normalizeURL(rightURL);
    };
    APP_PROTOCOL = location.protocol;
    APP_HOSTNAME = location.hostname;
    isCrossDomain = function(targetURL) {
      targetURL = parseURL(targetURL);
      return APP_HOSTNAME !== targetURL.hostname || APP_PROTOCOL !== targetURL.protocol;
    };

    /***
    Parses the given URL into components such as hostname and path.
    
    If the given URL is not fully qualified, it is assumed to be relative
    to the current page.
    
    @function up.util.parseURL
    @return {Object}
      The parsed URL as an object with
      `protocol`, `hostname`, `port`, `pathname`, `search` and `hash`
      properties.
    @stable
     */
    parseURL = function(urlOrLink) {
      var link;
      if (isJQuery(urlOrLink)) {
        link = up.element.get(urlOrLink);
      } else if (urlOrLink.pathname) {
        link = urlOrLink;
      } else {
        link = document.createElement('a');
        link.href = urlOrLink;
      }
      if (!link.hostname) {
        link.href = link.href;
      }
      if (link.pathname[0] !== '/') {
        link = pick(link, ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash']);
        link.pathname = '/' + link.pathname;
      }
      return link;
    };

    /***
    @function up.util.normalizeMethod
    @internal
     */
    normalizeMethod = function(method) {
      if (method) {
        return method.toUpperCase();
      } else {
        return 'GET';
      }
    };

    /***
    @function up.util.methodAllowsPayload
    @internal
     */
    methodAllowsPayload = function(method) {
      return method !== 'GET' && method !== 'HEAD';
    };
    assignPolyfill = function() {
      var j, key, len, source, sources, target, value;
      target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        for (key in source) {
          if (!hasProp.call(source, key)) continue;
          value = source[key];
          target[key] = value;
        }
      }
      return target;
    };

    /***
    Merge the own properties of one or more `sources` into the `target` object.
    
    @function up.util.assign
    @param {Object} target
    @param {Array<Object>} sources...
    @stable
     */
    assign = Object.assign || assignPolyfill;
    valuesPolyfill = function(object) {
      var key, results, value;
      results = [];
      for (key in object) {
        value = object[key];
        results.push(value);
      }
      return results;
    };

    /***
    Returns an array of values of the given object.
    
    @function up.util.values
    @param {Object} object
    @return {Array<string>}
    @stable
     */
    objectValues = Object.values || valuesPolyfill;
    iteratee = function(block) {
      if (isString(block)) {
        return function(item) {
          return item[block];
        };
      } else {
        return block;
      }
    };

    /***
    Translate all items in an array to new array of items.
    
    @function up.util.map
    @param {Array} array
    @param {Function(element, index): any|String} block
      A function that will be called with each element and (optional) iteration index.
    
      You can also pass a property name as a String,
      which will be collected from each item in the array.
    @return {Array}
      A new array containing the result of each function call.
    @stable
     */
    map = function(array, block) {
      var index, item, j, len, results;
      if (array.length === 0) {
        return [];
      }
      block = iteratee(block);
      results = [];
      for (index = j = 0, len = array.length; j < len; index = ++j) {
        item = array[index];
        results.push(block(item, index));
      }
      return results;
    };

    /***
    @function up.util.mapObject
    @internal
     */
    mapObject = function(array, pairer) {
      var merger;
      merger = function(object, pair) {
        object[pair[0]] = pair[1];
        return object;
      };
      return map(array, pairer).reduce(merger, {});
    };

    /***
    Calls the given function for each element (and, optional, index)
    of the given array.
    
    @function up.util.each
    @param {Array} array
    @param {Function(element, index)} block
      A function that will be called with each element and (optional) iteration index.
    @stable
     */
    each = map;
    eachIterator = function(iterator, callback) {
      var entry, results;
      results = [];
      while ((entry = iterator.next()) && !entry.done) {
        results.push(callback(entry.value));
      }
      return results;
    };

    /***
    Calls the given function for the given number of times.
    
    @function up.util.times
    @param {number} count
    @param {Function()} block
    @stable
     */
    times = function(count, block) {
      var iteration, j, ref, results;
      results = [];
      for (iteration = j = 0, ref = count - 1; 0 <= ref ? j <= ref : j >= ref; iteration = 0 <= ref ? ++j : --j) {
        results.push(block(iteration));
      }
      return results;
    };

    /***
    Returns whether the given argument is `null`.
    
    @function up.util.isNull
    @param object
    @return {boolean}
    @stable
     */
    isNull = function(object) {
      return object === null;
    };

    /***
    Returns whether the given argument is `undefined`.
    
    @function up.util.isUndefined
    @param object
    @return {boolean}
    @stable
     */
    isUndefined = function(object) {
      return object === void 0;
    };

    /***
    Returns whether the given argument is not `undefined`.
    
    @function up.util.isDefined
    @param object
    @return {boolean}
    @stable
     */
    isDefined = function(object) {
      return !isUndefined(object);
    };

    /***
    Returns whether the given argument is either `undefined` or `null`.
    
    Note that empty strings or zero are *not* considered to be "missing".
    
    For the opposite of `up.util.isMissing()` see [`up.util.isGiven()`](/up.util.isGiven).
    
    @function up.util.isMissing
    @param object
    @return {boolean}
    @stable
     */
    isMissing = function(object) {
      return isUndefined(object) || isNull(object);
    };

    /***
    Returns whether the given argument is neither `undefined` nor `null`.
    
    Note that empty strings or zero *are* considered to be "given".
    
    For the opposite of `up.util.isGiven()` see [`up.util.isMissing()`](/up.util.isMissing).
    
    @function up.util.isGiven
    @param object
    @return {boolean}
    @stable
     */
    isGiven = function(object) {
      return !isMissing(object);
    };

    /***
    Return whether the given argument is considered to be blank.
    
    By default, this function returns `true` for:
    
    - `undefined`
    - `null`
    - Empty strings
    - Empty arrays
    - A plain object without own enumerable properties
    
    All other arguments return `false`.
    
    To check implement blank-ness checks for user-defined classes,
    see `up.util.isBlank.key`.
    
    @function up.util.isBlank
    @param value
      The value is to check.
    @return {boolean}
      Whether the value is blank.
    @stable
     */
    isBlank = function(value) {
      if (isMissing(value)) {
        return true;
      }
      if (isObject(value) && value[isBlank.key]) {
        return value[isBlank.key]();
      }
      if (isString(value) || isList(value)) {
        return value.length === 0;
      }
      if (isOptions(value)) {
        return Object.keys(value).length === 0;
      }
      return false;
    };

    /***
    This property contains the name of a method that user-defined classes
    may implement to hook into the `up.util.isBlank()` protocol.
    
    \#\#\# Example
    
    We have a user-defined `Account` class that we want to use with `up.util.isBlank()`:
    
    ```
    class Account {
      constructor(email) {
        this.email = email
      }
    
      [up.util.isBlank.key]() {
        return up.util.isBlank(this.email)
      }
    }
    ```
    
    Note that the protocol method is not actually named `'up.util.isBlank.key'`.
    Instead it is named after the *value* of the `up.util.isBlank.key` property.
    To do so, the code sample above is using a
    [computed property name](https://medium.com/front-end-weekly/javascript-object-creation-356e504173a8)
    in square brackets.
    
    We may now use `Account` instances with `up.util.isBlank()`:
    
    ```
    foo = new Account('foo@foo.com')
    bar = new Account('')
    
    console.log(up.util.isBlank(foo)) // prints false
    console.log(up.util.isBlank(bar)) // prints true
    ```
    
    @property up.util.isBlank.key
    @experimental
     */
    isBlank.key = 'up.util.isBlank';

    /***
    Returns the given argument if the argument is [present](/up.util.isPresent),
    otherwise returns `undefined`.
    
    @function up.util.presence
    @param value
    @param {Function(value): boolean} [tester=up.util.isPresent]
      The function that will be used to test whether the argument is present.
    @return {any|undefined}
    @stable
     */
    presence = function(value, tester) {
      if (tester == null) {
        tester = isPresent;
      }
      if (tester(value)) {
        return value;
      } else {
        return void 0;
      }
    };

    /***
    Returns whether the given argument is not [blank](/up.util.isBlank).
    
    @function up.util.isPresent
    @param object
    @return {boolean}
    @stable
     */
    isPresent = function(object) {
      return !isBlank(object);
    };

    /***
    Returns whether the given argument is a function.
    
    @function up.util.isFunction
    @param object
    @return {boolean}
    @stable
     */
    isFunction = function(object) {
      return typeof object === 'function';
    };

    /***
    Returns whether the given argument is a string.
    
    @function up.util.isString
    @param object
    @return {boolean}
    @stable
     */
    isString = function(object) {
      return typeof object === 'string' || object instanceof String;
    };

    /***
    Returns whether the given argument is a boolean value.
    
    @function up.util.isBoolean
    @param object
    @return {boolean}
    @stable
     */
    isBoolean = function(object) {
      return typeof object === 'boolean' || object instanceof Boolean;
    };

    /***
    Returns whether the given argument is a number.
    
    Note that this will check the argument's *type*.
    It will return `false` for a string like `"123"`.
    
    @function up.util.isNumber
    @param object
    @return {boolean}
    @stable
     */
    isNumber = function(object) {
      return typeof object === 'number' || object instanceof Number;
    };

    /***
    Returns whether the given argument is an options hash,
    
    Differently from [`up.util.isObject()`], this returns false for
    functions, jQuery collections, promises, `FormData` instances and arrays.
    
    @function up.util.isOptions
    @param object
    @return {boolean}
    @internal
     */
    isOptions = function(object) {
      return typeof object === 'object' && !isNull(object) && (isUndefined(object.constructor) || object.constructor === Object);
    };

    /***
    Returns whether the given argument is an object.
    
    This also returns `true` for functions, which may behave like objects in JavaScript.
    
    @function up.util.isObject
    @param object
    @return {boolean}
    @stable
     */
    isObject = function(object) {
      var typeOfResult;
      typeOfResult = typeof object;
      return (typeOfResult === 'object' && !isNull(object)) || typeOfResult === 'function';
    };

    /***
    Returns whether the given argument is a [DOM element](https://developer.mozilla.org/de/docs/Web/API/Element).
    
    @function up.util.isElement
    @param object
    @return {boolean}
    @stable
     */
    isElement = function(object) {
      return object instanceof Element;
    };

    /***
    Returns whether the given argument is a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).
    
    @function up.util.isRegExp
    @param object
    @return {boolean}
    @internal
     */
    isRegExp = function(object) {
      return object instanceof RegExp;
    };

    /***
    Returns whether the given argument is a [jQuery collection](https://learn.jquery.com/using-jquery-core/jquery-object/).
    
    @function up.util.isJQuery
    @param object
    @return {boolean}
    @stable
     */
    isJQuery = function(object) {
      return !!(object != null ? object.jquery : void 0);
    };

    /***
    @function up.util.isElementish
    @param object
    @return {boolean}
    @internal
     */
    isElementish = function(object) {
      var ref;
      return !!(object && (object.addEventListener || ((ref = object[0]) != null ? ref.addEventListener : void 0)));
    };

    /***
    Returns whether the given argument is an object with a `then` method.
    
    @function up.util.isPromise
    @param object
    @return {boolean}
    @stable
     */
    isPromise = function(object) {
      return isObject(object) && isFunction(object.then);
    };

    /***
    Returns whether the given argument is an array.
    
    @function up.util.isArray
    @param object
    @return {boolean}
    @stable
     */
    isArray = Array.isArray;

    /***
    Returns whether the given argument is a `FormData` instance.
    
    Always returns `false` in browsers that don't support `FormData`.
    
    @function up.util.isFormData
    @param object
    @return {boolean}
    @internal
     */
    isFormData = function(object) {
      return object instanceof FormData;
    };

    /***
    Converts the given [array-like value](/up.util.isList) into an array.
    
    If the given value is already an array, it is returned unchanged.
    
    @function up.util.toArray
    @param object
    @return {Array}
    @stable
     */
    toArray = function(value) {
      if (isArray(value)) {
        return value;
      } else {
        return copyArrayLike(value);
      }
    };

    /****
    Returns whether the given argument is an array-like value.
    
    Return true for `Array`, a
    [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList),
     the [arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
     or a jQuery collection.
    
    Use [`up.util.isArray()`](/up.util.isArray) to test whether a value is an actual `Array`.
    
    @function up.util.isList
    @param value
    @return {boolean}
    @experimental
     */
    isList = function(value) {
      return isArray(value) || isNodeList(value) || isArguments(value) || isJQuery(value) || isHTMLCollection(value);
    };

    /***
    Returns whether the given value is a [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList).
    
    `NodeLists` are array-like objects returned by [`document.querySelectorAll()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll).
    
    @function up.util.isNodeList
    @param value
    @return {boolean}
    @internal
     */
    isNodeList = function(value) {
      return value instanceof NodeList;
    };
    isHTMLCollection = function(value) {
      return value instanceof HTMLCollection;
    };

    /***
    Returns whether the given value is an [arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments).
    
    @function up.util.isArguments
    @param value
    @return {boolean}
    @internal
     */
    isArguments = function(value) {
      return Object.prototype.toString.call(value) === '[object Arguments]';
    };
    nullToUndefined = function(value) {
      if (isNull(value)) {
        return void 0;
      } else {
        return value;
      }
    };

    /***
    @function up.util.wrapList
    @return {Array|NodeList|jQuery}
    @internal
     */
    wrapList = function(value) {
      if (isList(value)) {
        return value;
      } else if (isMissing(value)) {
        return [];
      } else {
        return [value];
      }
    };

    /***
    Returns a shallow copy of the given value.
    
    \#\#\# Copying protocol
    
    - By default `up.util.copy()` can copy [array-like values](/up.util.isList),
      plain objects and `Date` instances.
    - Array-like objects are copied into new arrays.
    - Unsupported types of values are returned unchanged.
    - To make the copying protocol work with user-defined class,
      see `up.util.copy.key`.
    - Immutable objects, like strings or numbers, do not need to be copied.
    
    @function up.util.copy
    @param {any} object
    @return {any}
    @stable
     */
    copy = function(value) {
      if (isObject(value) && value[copy.key]) {
        value = value[copy.key]();
      } else if (isList(value)) {
        value = copyArrayLike(value);
      } else if (isOptions(value)) {
        value = assign({}, value);
      }
      return value;
    };
    copyArrayLike = function(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    };

    /***
    This property contains the name of a method that user-defined classes
    may implement to hook into the `up.util.copy()` protocol.
    
    \#\#\# Example
    
    We have a user-defined `Account` class that we want to use with `up.util.copy()`:
    
    ```
    class Account {
      constructor(email) {
        this.email = email
      }
    
      [up.util.copy.key]() {
        return new Account(this.email)
      }
    }
    ```
    
    Note that the protocol method is not actually named `'up.util.copy.key'`.
    Instead it is named after the *value* of the `up.util.copy.key` property.
    To do so, the code sample above is using a
    [computed property name](https://medium.com/front-end-weekly/javascript-object-creation-356e504173a8)
    in square brackets.
    
    We may now use `Account` instances with `up.util.copy()`:
    
    ```
    original = new User('foo@foo.com')
    
    copy = up.util.copy(original)
    console.log(copy.email) // prints 'foo@foo.com'
    
    original.email = 'bar@bar.com' // change the original
    console.log(copy.email) // still prints 'foo@foo.com'
    ```
    
    @property up.util.copy.key
    @param {string} key
    @experimental
     */
    copy.key = 'up.util.copy';
    Date.prototype[copy.key] = function() {
      return new Date(+this);
    };

    /***
    Creates a new object by merging together the properties from the given objects.
    
    @function up.util.merge
    @param {Array<Object>} sources...
    @return Object
    @stable
     */
    merge = function() {
      var sources;
      sources = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return assign.apply(null, [{}].concat(slice.call(sources)));
    };

    /***
    @function up.util.mergeDefined
    @param {Array<Object>} sources...
    @return Object
    @internal
     */
    mergeDefined = function() {
      var j, key, len, result, source, sources, value;
      sources = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      result = {};
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (source) {
          for (key in source) {
            value = source[key];
            if (isDefined(value)) {
              result[key] = value;
            }
          }
        }
      }
      return result;
    };

    /***
    Creates an options hash from the given argument and some defaults.
    
    The semantics of this function are confusing.
    We want to get rid of this in the future.
    
    @function up.util.options
    @param {Object} object
    @param {Object} [defaults]
    @return {Object}
    @internal
     */
    newOptions = function(object, defaults) {
      if (defaults) {
        return merge(defaults, object);
      } else if (object) {
        return copy(object);
      } else {
        return {};
      }
    };
    parseArgIntoOptions = function(args, argKey) {
      var options;
      options = extractOptions(args);
      if (isDefined(args[0])) {
        options = copy(options);
        options[argKey] = args[0];
      }
      return options;
    };

    /***
    Passes each element in the given [array-like value](/up.util.isList) to the given function.
    Returns the first element for which the function returns a truthy value.
    
    If no object matches, returns `undefined`.
    
    @function up.util.find
    @param {List<T>} list
    @param {Function(value): boolean} tester
    @return {T|undefined}
    @stable
     */
    findInList = function(list, tester) {
      var element, j, len, match;
      tester = iteratee(tester);
      match = void 0;
      for (j = 0, len = list.length; j < len; j++) {
        element = list[j];
        if (tester(element)) {
          match = element;
          break;
        }
      }
      return match;
    };

    /***
    Returns whether the given function returns a truthy value
    for any element in the given [array-like value](/up.util.isList).
    
    @function up.util.some
    @param {List} list
    @param {Function(value, index): boolean} tester
      A function that will be called with each element and (optional) iteration index.
    
    @return {boolean}
    @stable
     */
    some = function(list, tester) {
      return !!findResult(list, tester);
    };

    /***
    Consecutively calls the given function which each element
    in the given array. Returns the first truthy return value.
    
    Returned `undefined` iff the function does not return a truthy
    value for any element in the array.
    
    @function up.util.findResult
    @param {Array} array
    @param {Function(element): any} tester
      A function that will be called with each element and (optional) iteration index.
    
    @return {any|undefined}
    @experimental
     */
    findResult = function(array, tester) {
      var element, index, j, len, result;
      tester = iteratee(tester);
      for (index = j = 0, len = array.length; j < len; index = ++j) {
        element = array[index];
        if (result = tester(element, index)) {
          return result;
        }
      }
      return void 0;
    };

    /***
    Returns whether the given function returns a truthy value
    for all elements in the given [array-like value](/up.util.isList).
    
    @function up.util.every
    @param {List} list
    @param {Function(element, index): boolean} tester
      A function that will be called with each element and (optional) iteration index.
    
    @return {boolean}
    @experimental
     */
    every = function(list, tester) {
      var element, index, j, len, match;
      tester = iteratee(tester);
      match = true;
      for (index = j = 0, len = list.length; j < len; index = ++j) {
        element = list[index];
        if (!tester(element, index)) {
          match = false;
          break;
        }
      }
      return match;
    };

    /***
    Returns all elements from the given array that are
    neither `null` or `undefined`.
    
    @function up.util.compact
    @param {Array<T>} array
    @return {Array<T>}
    @stable
     */
    compact = function(array) {
      return filterList(array, isGiven);
    };
    compactObject = function(object) {
      return pickBy(object, isGiven);
    };

    /***
    Returns the given array without duplicates.
    
    @function up.util.uniq
    @param {Array<T>} array
    @return {Array<T>}
    @stable
     */
    uniq = function(array) {
      if (array.length < 2) {
        return array;
      }
      return setToArray(arrayToSet(array));
    };

    /***
    This function is like [`uniq`](/up.util.uniq), accept that
    the given function is invoked for each element to generate the value
    for which uniquness is computed.
    
    @function up.util.uniqBy
    @param {Array} array
    @param {Function(value): any} array
    @return {Array}
    @experimental
     */
    uniqBy = function(array, mapper) {
      var set;
      if (array.length < 2) {
        return array;
      }
      mapper = iteratee(mapper);
      set = new Set();
      return filterList(array, function(elem, index) {
        var mapped;
        mapped = mapper(elem, index);
        if (set.has(mapped)) {
          return false;
        } else {
          set.add(mapped);
          return true;
        }
      });
    };

    /***
    @function up.util.setToArray
    @internal
     */
    setToArray = function(set) {
      var array;
      array = [];
      set.forEach(function(elem) {
        return array.push(elem);
      });
      return array;
    };

    /***
    @function up.util.arrayToSet
    @internal
     */
    arrayToSet = function(array) {
      var set;
      set = new Set();
      array.forEach(function(elem) {
        return set.add(elem);
      });
      return set;
    };

    /***
    Returns all elements from the given [array-like value](/up.util.isList) that return
    a truthy value when passed to the given function.
    
    @function up.util.filter
    @param {List} list
    @param {Function(value, index): boolean} tester
    @return {Array}
    @stable
     */
    filterList = function(list, tester) {
      var matches;
      tester = iteratee(tester);
      matches = [];
      each(list, function(element, index) {
        if (tester(element, index)) {
          return matches.push(element);
        }
      });
      return matches;
    };

    /***
    Returns all elements from the given [array-like value](/up.util.isList) that do not return
    a truthy value when passed to the given function.
    
    @function up.util.reject
    @param {List} list
    @param {Function(element, index): boolean} tester
    @return {Array}
    @stable
     */
    reject = function(list, tester) {
      tester = iteratee(tester);
      return filterList(list, function(element, index) {
        return !tester(element, index);
      });
    };

    /***
    Returns the intersection of the given two arrays.
    
    Implementation is not optimized. Don't use it for large arrays.
    
    @function up.util.intersect
    @internal
     */
    intersect = function(array1, array2) {
      return filterList(array1, function(element) {
        return contains(array2, element);
      });
    };

    /***
    Waits for the given number of milliseconds, the runs the given callback.
    
    Instead of `up.util.timer(0, fn)` you can also use [`up.util.task(fn)`](/up.util.task).
    
    @function up.util.timer
    @param {number} millis
    @param {Function()} callback
    @stable
     */
    scheduleTimer = function(millis, callback) {
      return setTimeout(callback, millis);
    };

    /***
    Pushes the given function to the [JavaScript task queue](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) (also "macrotask queue").
    
    Equivalent to calling `setTimeout(fn, 0)`.
    
    Also see `up.util.microtask()`.
    
    @function up.util.task
    @param {Function()} block
    @stable
     */
    queueTask = function(block) {
      return setTimeout(block, 0);
    };

    /***
    Pushes the given function to the [JavaScript microtask queue](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).
    
    @function up.util.microtask
    @param {Function()} task
    @return {Promise}
      A promise that is resolved with the return value of `task`.
    
      If `task` throws an error, the promise is rejected with that error.
    @experimental
     */
    queueMicrotask = function(task) {
      return Promise.resolve().then(task);
    };
    abortableMicrotask = function(task) {
      var aborted;
      aborted = false;
      queueMicrotask(function() {
        if (!aborted) {
          return task();
        }
      });
      return function() {
        return aborted = true;
      };
    };

    /***
    Returns the last element of the given array.
    
    @function up.util.last
    @param {Array<T>} array
    @return {T}
     */
    last = function(array) {
      return array[array.length - 1];
    };

    /***
    Returns whether the given value contains another value.
    
    If `value` is a string, this returns whether `subValue` is a sub-string of `value`.
    
    If `value` is an array, this returns whether `subValue` is an element of `value`.
    
    @function up.util.contains
    @param {Array|string} value
    @param {Array|string} subValue
    @stable
     */
    contains = function(value, subValue) {
      return value.indexOf(subValue) >= 0;
    };

    /***
    Returns whether `object`'s entries are a superset
    of `subObject`'s entries.
    
    @function up.util.objectContains
    @param {Object} object
    @param {Object} subObject
    @internal
     */
    objectContains = function(object, subObject) {
      var reducedValue;
      reducedValue = pick(object, Object.keys(subObject));
      return isEqual(subObject, reducedValue);
    };

    /***
    Returns a copy of the given object that only contains
    the given keys.
    
    @function up.util.pick
    @param {Object} object
    @param {Array} keys
    @stable
     */
    pick = function(object, keys) {
      var filtered, j, key, len;
      filtered = {};
      for (j = 0, len = keys.length; j < len; j++) {
        key = keys[j];
        if (key in object) {
          filtered[key] = object[key];
        }
      }
      return filtered;
    };
    pickBy = function(object, tester) {
      var filtered, key, value;
      tester = iteratee(tester);
      filtered = {};
      for (key in object) {
        value = object[key];
        if (tester(value, key, object)) {
          filtered[key] = object[key];
        }
      }
      return filtered;
    };

    /***
    Returns a copy of the given object that contains all except
    the given keys.
    
    @function up.util.omit
    @param {Object} object
    @param {Array} keys
    @stable
     */
    omit = function(object, keys) {
      return pickBy(object, function(value, key) {
        return !contains(keys, key);
      });
    };

    /***
    Returns a promise that will never be resolved.
    
    @function up.util.unresolvablePromise
    @internal
     */
    unresolvablePromise = function() {
      return new Promise(noop);
    };

    /***
    Removes the given element from the given array.
    
    This changes the given array.
    
    @function up.util.remove
    @param {Array<T>} array
      The array to change.
    @param {T} element
      The element to remove.
    @return {T|undefined}
      The removed element, or `undefined` if the array didn't contain the element.
    @stable
     */
    remove = function(array, element) {
      var index;
      index = array.indexOf(element);
      if (index >= 0) {
        array.splice(index, 1);
        return element;
      }
    };

    /***
    If the given `value` is a function, calls the function with the given `args`.
    Otherwise it just returns `value`.
    
    @function up.util.evalOption
    @internal
     */
    evalOption = function() {
      var args, value;
      value = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (isFunction(value)) {
        return value.apply(null, args);
      } else {
        return value;
      }
    };
    ESCAPE_HTML_ENTITY_MAP = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;'
    };

    /***
    Escapes the given string of HTML by replacing control chars with their HTML entities.
    
    @function up.util.escapeHTML
    @param {string} string
      The text that should be escaped
    @stable
     */
    escapeHTML = function(string) {
      return string.replace(/[&<>"]/g, function(char) {
        return ESCAPE_HTML_ENTITY_MAP[char];
      });
    };

    /***
    @function up.util.escapeRegExp
    @internal
     */
    escapeRegExp = function(string) {
      return string.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    pluckKey = function(object, key) {
      var value;
      value = object[key];
      delete object[key];
      return value;
    };
    renameKey = function(object, oldKey, newKey) {
      return object[newKey] = pluckKey(object, oldKey);
    };
    extractLastArg = function(args, tester) {
      var lastArg;
      lastArg = last(args);
      if (tester(lastArg)) {
        return args.pop();
      }
    };
    extractCallback = function(args) {
      return extractLastArg(args, isFunction);
    };
    extractOptions = function(args) {
      return extractLastArg(args, isOptions) || {};
    };
    identity = function(arg) {
      return arg;
    };

    /***
    @function up.util.sequence
    @param {Array<Function()>} functions
    @return {Function()}
      A function that will call all `functions` if called.
    
    @internal
     */
    sequence = function(functions) {
      if (functions.length === 1) {
        return functions[0];
      } else {
        return function() {
          return map(functions, function(f) {
            return f();
          });
        };
      }
    };

    /***
    Flattens the given `array` a single level deep.
    
    @function up.util.flatten
    @param {Array} array
      An array which might contain other arrays
    @return {Array}
      The flattened array
    @experimental
     */
    flatten = function(array) {
      var flattened, j, len, object;
      flattened = [];
      for (j = 0, len = array.length; j < len; j++) {
        object = array[j];
        if (isList(object)) {
          flattened.push.apply(flattened, object);
        } else {
          flattened.push(object);
        }
      }
      return flattened;
    };

    /***
    Maps each element using a mapping function,
    then flattens the result into a new array.
    
    @function up.util.flatMap
    @param {Array} array
    @param {Function(element)} mapping
    @return {Array}
    @experimental
     */
    flatMap = function(array, block) {
      return flatten(map(array, block));
    };

    /***
    Returns whether the given value is truthy.
    
    @function up.util.isTruthy
    @internal
     */
    isTruthy = function(object) {
      return !!object;
    };

    /***
    Sets the given callback as both fulfillment and rejection handler for the given promise.
    
    [Unlike `promise#finally()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally#Description), `up.util.always()` may change the settlement value
    of the given promise.
    
    @function up.util.always
    @internal
     */
    always = function(promise, callback) {
      return promise.then(callback, callback);
    };

    /***
     * Registers an empty rejection handler with the given promise.
     * This prevents browsers from printing "Uncaught (in promise)" to the error
     * console when the promise is rejected.
     *
     * This is helpful for event handlers where it is clear that no rejection
     * handler will be registered:
     *
     *     up.on('submit', 'form[up-target]', (event, $form) => {
     *       promise = up.submit($form)
     *       up.util.muteRejection(promise)
     *     })
     *
     * Does nothing if passed a missing value.
     *
     * @function up.util.muteRejection
     * @param {Promise|undefined|null} promise
     * @return {Promise}
     * @internal
     */
    muteRejection = function(promise) {
      return promise != null ? promise["catch"](noop) : void 0;
    };

    /***
    @function up.util.newDeferred
    @internal
     */
    newDeferred = function() {
      var nativePromise, rejectFn, resolveFn;
      resolveFn = void 0;
      rejectFn = void 0;
      nativePromise = new Promise(function(givenResolve, givenReject) {
        resolveFn = givenResolve;
        return rejectFn = givenReject;
      });
      nativePromise.resolve = resolveFn;
      nativePromise.reject = rejectFn;
      nativePromise.promise = function() {
        return nativePromise;
      };
      return nativePromise;
    };

    /***
    Calls the given block. If the block throws an exception,
    a rejected promise is returned instead.
    
    @function up.util.rejectOnError
    @internal
     */
    rejectOnError = function(block) {
      var error;
      try {
        return block();
      } catch (error1) {
        error = error1;
        return Promise.reject(error);
      }
    };
    sum = function(list, block) {
      var entry, entryValue, j, len, totalValue;
      block = iteratee(block);
      totalValue = 0;
      for (j = 0, len = list.length; j < len; j++) {
        entry = list[j];
        entryValue = block(entry);
        if (isGiven(entryValue)) {
          totalValue += entryValue;
        }
      }
      return totalValue;
    };
    isBasicObjectProperty = function(k) {
      return Object.prototype.hasOwnProperty(k);
    };

    /***
    Returns whether the two arguments are equal by value.
    
    \#\#\# Comparison protocol
    
    - By default `up.util.isEqual()` can compare strings, numbers,
      [array-like values](/up.util.isList), plain objects and `Date` objects.
    - To make the copying protocol work with user-defined classes,
      see `up.util.isEqual.key`.
    - Objects without a defined comparison protocol are
      defined by reference (`===`).
    
    @function up.util.isEqual
    @param {any} a
    @param {any} b
    @return {boolean}
      Whether the arguments are equal by value.
    @experimental
     */
    isEqual = function(a, b) {
      var aKeys, bKeys;
      if (a != null ? a.valueOf : void 0) {
        a = a.valueOf();
      }
      if (b != null ? b.valueOf : void 0) {
        b = b.valueOf();
      }
      if (typeof a !== typeof b) {
        return false;
      } else if (isList(a) && isList(b)) {
        return isEqualList(a, b);
      } else if (isObject(a) && a[isEqual.key]) {
        return a[isEqual.key](b);
      } else if (isOptions(a) && isOptions(b)) {
        aKeys = Object.keys(a);
        bKeys = Object.keys(b);
        if (isEqualList(aKeys, bKeys)) {
          return every(aKeys, function(aKey) {
            return isEqual(a[aKey], b[aKey]);
          });
        } else {
          return false;
        }
      } else {
        return a === b;
      }
    };

    /***
    This property contains the name of a method that user-defined classes
    may implement to hook into the `up.util.isEqual()` protocol.
    
    \#\#\# Example
    
    We have a user-defined `Account` class that we want to use with `up.util.isEqual()`:
    
    ```
    class Account {
      constructor(email) {
        this.email = email
      }
    
      [up.util.isEqual.key](other) {
        return this.email === other.email;
      }
    }
    ```
    
    Note that the protocol method is not actually named `'up.util.isEqual.key'`.
    Instead it is named after the *value* of the `up.util.isEqual.key` property.
    To do so, the code sample above is using a
    [computed property name](https://medium.com/front-end-weekly/javascript-object-creation-356e504173a8)
    in square brackets.
    
    We may now use `Account` instances with `up.util.isEqual()`:
    
    ```
    one = new User('foo@foo.com')
    two = new User('foo@foo.com')
    three = new User('bar@bar.com')
    
    isEqual = up.util.isEqual(one, two)
    // isEqual is now true
    
    isEqual = up.util.isEqual(one, three)
    // isEqual is now false
    ```
    
    @property up.util.isEqual.key
    @param {string} key
    @experimental
     */
    isEqual.key = 'up.util.isEqual';
    isEqualList = function(a, b) {
      return a.length === b.length && every(a, function(elem, index) {
        return isEqual(elem, b[index]);
      });
    };
    splitValues = function(value, separator) {
      if (separator == null) {
        separator = ' ';
      }
      if (isString(value)) {
        value = value.split(separator);
        value = map(value, function(v) {
          return v.trim();
        });
        value = filterList(value, isPresent);
        return value;
      } else {
        return wrapList(value);
      }
    };
    endsWith = function(string, search) {
      if (search.length > string.length) {
        return false;
      } else {
        return string.substring(string.length - search.length) === search;
      }
    };
    simpleEase = function(x) {
      if (x < 0.5) {
        return 2 * x * x;
      } else {
        return x * (4 - x * 2) - 1;
      }
    };
    wrapValue = function() {
      var args, constructor;
      constructor = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (args[0] instanceof constructor) {
        return args[0];
      } else {
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(constructor, args, function(){});
      }
    };
    nextUid = 0;
    uid = function() {
      return nextUid++;
    };

    /***
    Returns a copy of the given list, in reversed order.
    
    @function up.util.reverse
    @param {List<T>} list
    @return {Array<T>}
    @internal
     */
    reverse = function(list) {
      return copy(list).reverse();
    };
    renameKeys = function(object, renameKeyFn) {
      var key, renamed, value;
      renamed = {};
      for (key in object) {
        value = object[key];
        renamed[renameKeyFn(key)] = value;
      }
      return renamed;
    };
    camelToKebabCase = function(str) {
      return str.replace(/[A-Z]/g, function(char) {
        return '-' + char.toLowerCase();
      });
    };
    prefixCamelCase = function(str, prefix) {
      return prefix + upperCaseFirst(str);
    };
    unprefixCamelCase = function(str, prefix) {
      var match, pattern;
      pattern = new RegExp('^' + prefix + '(.+)$');
      if (match = str.match(pattern)) {
        return lowerCaseFirst(match[1]);
      }
    };
    lowerCaseFirst = function(str) {
      return str[0].toLowerCase() + str.slice(1);
    };
    upperCaseFirst = function(str) {
      return str[0].toUpperCase() + str.slice(1);
    };
    defineGetter = function(object, prop, get) {
      return Object.defineProperty(object, prop, {
        get: get
      });
    };
    defineDelegates = function(object, props, targetProvider) {
      return wrapList(props).forEach(function(prop) {
        return Object.defineProperty(object, prop, {
          get: function() {
            var target, value;
            target = targetProvider.call(this);
            value = target[prop];
            if (isFunction(value)) {
              value = value.bind(target);
            }
            return value;
          },
          set: function(newValue) {
            var target;
            target = targetProvider.call(this);
            return target[prop] = newValue;
          }
        });
      });
    };
    literal = function(obj) {
      var key, result, unprefixedKey, value;
      result = {};
      for (key in obj) {
        value = obj[key];
        if (unprefixedKey = unprefixCamelCase(key, 'get_')) {
          defineGetter(result, unprefixedKey, value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };
    stringifyArg = function(arg) {
      var attr, closer, e, j, len, maxLength, ref, string, value;
      maxLength = 200;
      closer = '';
      if (isString(arg)) {
        string = arg.replace(/[\n\r\t ]+/g, ' ');
        string = string.replace(/^[\n\r\t ]+/, '');
        string = string.replace(/[\n\r\t ]$/, '');
      } else if (isUndefined(arg)) {
        string = 'undefined';
      } else if (isNumber(arg) || isFunction(arg)) {
        string = arg.toString();
      } else if (isArray(arg)) {
        string = "[" + (map(arg, stringifyArg).join(', ')) + "]";
        closer = ']';
      } else if (isJQuery(arg)) {
        string = "$(" + (map(arg, stringifyArg).join(', ')) + ")";
        closer = ')';
      } else if (isElement(arg)) {
        string = "<" + (arg.tagName.toLowerCase());
        ref = ['id', 'name', 'class'];
        for (j = 0, len = ref.length; j < len; j++) {
          attr = ref[j];
          if (value = arg.getAttribute(attr)) {
            string += " " + attr + "=\"" + value + "\"";
          }
        }
        string += ">";
        closer = '>';
      } else if (isRegExp(arg)) {
        string = arg.toString();
      } else {
        try {
          string = JSON.stringify(arg);
        } catch (error1) {
          e = error1;
          if (contains(e.message, 'circular')) {
            string = '(circular structure)';
          } else {
            throw e;
          }
        }
      }
      if (string.length > maxLength) {
        string = (string.substr(0, maxLength)) + " …";
        string += closer;
      }
      return string;
    };
    SPRINTF_PLACEHOLDERS = /\%[oOdisf]/g;
    secondsSinceEpoch = function() {
      return Math.floor(Date.now() * 0.001);
    };

    /***
    See https://developer.mozilla.org/en-US/docs/Web/API/Console#Using_string_substitutions
    
    @function up.util.sprintf
    @internal
     */
    sprintf = function() {
      var args, message;
      message = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return sprintfWithFormattedArgs.apply(null, [identity, message].concat(slice.call(args)));
    };

    /***
    @function up.util.sprintfWithFormattedArgs
    @internal
     */
    sprintfWithFormattedArgs = function() {
      var args, formatter, i, message;
      formatter = arguments[0], message = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      if (!message) {
        return '';
      }
      i = 0;
      return message.replace(SPRINTF_PLACEHOLDERS, function() {
        var arg;
        arg = args[i];
        arg = formatter(stringifyArg(arg));
        i += 1;
        return arg;
      });
    };
    return {
      parseURL: parseURL,
      normalizeURL: normalizeURL,
      urlWithoutHost: urlWithoutHost,
      matchURLs: matchURLs,
      normalizeMethod: normalizeMethod,
      methodAllowsPayload: methodAllowsPayload,
      assign: assign,
      assignPolyfill: assignPolyfill,
      copy: copy,
      copyArrayLike: copyArrayLike,
      merge: merge,
      mergeDefined: mergeDefined,
      options: newOptions,
      parseArgIntoOptions: parseArgIntoOptions,
      each: each,
      eachIterator: eachIterator,
      map: map,
      flatMap: flatMap,
      mapObject: mapObject,
      times: times,
      findResult: findResult,
      some: some,
      every: every,
      find: findInList,
      filter: filterList,
      reject: reject,
      intersect: intersect,
      compact: compact,
      compactObject: compactObject,
      uniq: uniq,
      uniqBy: uniqBy,
      last: last,
      isNull: isNull,
      isDefined: isDefined,
      isUndefined: isUndefined,
      isGiven: isGiven,
      isMissing: isMissing,
      isPresent: isPresent,
      isBlank: isBlank,
      presence: presence,
      isObject: isObject,
      isFunction: isFunction,
      isString: isString,
      isBoolean: isBoolean,
      isNumber: isNumber,
      isElement: isElement,
      isJQuery: isJQuery,
      isElementish: isElementish,
      isPromise: isPromise,
      isOptions: isOptions,
      isArray: isArray,
      isFormData: isFormData,
      isNodeList: isNodeList,
      isArguments: isArguments,
      isList: isList,
      isRegExp: isRegExp,
      timer: scheduleTimer,
      contains: contains,
      objectContains: objectContains,
      toArray: toArray,
      only: only,
      pick: pick,
      pickBy: pickBy,
      except: except,
      omit: omit,
      unresolvablePromise: unresolvablePromise,
      remove: remove,
      memoize: memoize,
      pluckKey: pluckKey,
      renameKey: renameKey,
      extractOptions: extractOptions,
      extractCallback: extractCallback,
      noop: noop,
      asyncNoop: asyncNoop,
      identity: identity,
      escapeHTML: escapeHTML,
      escapeRegExp: escapeRegExp,
      sequence: sequence,
      evalOption: evalOption,
      flatten: flatten,
      isTruthy: isTruthy,
      newDeferred: newDeferred,
      always: always,
      muteRejection: muteRejection,
      rejectOnError: rejectOnError,
      isBasicObjectProperty: isBasicObjectProperty,
      isCrossDomain: isCrossDomain,
      task: queueTask,
      microtask: queueMicrotask,
      abortableMicrotask: abortableMicrotask,
      isEqual: isEqual,
      splitValues: splitValues,
      endsWith: endsWith,
      sum: sum,
      wrapList: wrapList,
      wrapValue: wrapValue,
      simpleEase: simpleEase,
      values: objectValues,
      arrayToSet: arrayToSet,
      setToArray: setToArray,
      uid: uid,
      upperCaseFirst: upperCaseFirst,
      lowerCaseFirst: lowerCaseFirst,
      getter: defineGetter,
      delegate: defineDelegates,
      literal: literal,
      reverse: reverse,
      prefixCamelCase: prefixCamelCase,
      unprefixCamelCase: unprefixCamelCase,
      camelToKebabCase: camelToKebabCase,
      nullToUndefined: nullToUndefined,
      sprintf: sprintf,
      sprintfWithFormattedArgs: sprintfWithFormattedArgs,
      renameKeys: renameKeys,
      timestamp: secondsSinceEpoch
    };
  })();

}).call(this);
(function() {
  var slice = [].slice;

  up.error = (function() {
    var aborted, build, emitGlobal, errorInterface, failed, invalidSelector, notApplicable, notImplemented, u;
    u = up.util;
    build = function(message, props) {
      var error;
      if (props == null) {
        props = {};
      }
      if (u.isArray(message)) {
        message = u.sprintf.apply(u, message);
      }
      error = new Error(message);
      u.assign(error, props);
      return error;
    };
    errorInterface = function(name, init) {
      var fn;
      if (init == null) {
        init = build;
      }
      fn = function() {
        var args, error;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        error = init.apply(null, args);
        error.name = name;
        return error;
      };
      fn.is = function(error) {
        return error.name === name;
      };
      fn.async = function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return Promise.reject(fn.apply(null, args));
      };
      return fn;
    };
    failed = errorInterface('up.Failed');
    aborted = errorInterface('AbortError', function(message) {
      return build(message || 'Aborted', {
        aborted: true
      });
    });
    notImplemented = errorInterface('up.NotImplemented');
    notApplicable = errorInterface('up.NotApplicable', function(change, reason) {
      return build("Cannot apply change: " + change + " (" + reason + ")");
    });
    invalidSelector = errorInterface('up.InvalidSelector', function(selector) {
      return build("Cannot parse selector: " + selector);
    });
    emitGlobal = function(error) {
      var message;
      message = error.message;
      return up.emit(window, 'error', {
        message: message,
        error: error,
        log: false
      });
    };
    return {
      failed: failed,
      aborted: aborted,
      invalidSelector: invalidSelector,
      notApplicable: notApplicable,
      notImplemented: notImplemented,
      emitGlobal: emitGlobal
    };
  })();

}).call(this);
(function() {
  var u,
    slice = [].slice;

  u = up.util;

  up.legacy = (function() {
    var deprecated, fixEventType, fixKey, renamedEvent, renamedEvents, renamedPackage, renamedProperty, warn, warnedMessages;
    renamedProperty = function(object, oldKey, newKey) {
      var warning;
      warning = function() {
        return warn('Property { %s } has been renamed to { %s } (found in %o)', oldKey, newKey, object);
      };
      return Object.defineProperty(object, oldKey, {
        get: function() {
          warning();
          return this[newKey];
        },
        set: function(newValue) {
          warning();
          return this[newKey] = newValue;
        }
      });
    };
    fixKey = function(object, oldKey, newKey) {
      if (u.isDefined(object[oldKey])) {
        warn('Property { %s } has been renamed to { %s } (found in %o)', oldKey, newKey, object);
        return u.renameKey(object, oldKey, newKey);
      }
    };
    renamedEvents = {};
    renamedEvent = function(oldName, newName) {
      return renamedEvents[oldName] = newName;
    };
    fixEventType = function(eventType) {
      var newEventType;
      if (newEventType = renamedEvents[eventType]) {
        warn("Event " + eventType + " has been renamed to " + newEventType);
        return newEventType;
      } else {
        return eventType;
      }
    };
    renamedPackage = function(oldName, newName) {
      return Object.defineProperty(up, oldName, {
        get: function() {
          warn("up." + oldName + " has been renamed to up." + newName);
          return up[newName];
        }
      });
    };
    warnedMessages = {};
    warn = function() {
      var args, formattedMessage, message;
      message = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      formattedMessage = u.sprintf.apply(u, [message].concat(slice.call(args)));
      if (!warnedMessages[formattedMessage]) {
        warnedMessages[formattedMessage] = true;
        return up.warn.apply(up, ['DEPRECATION', message].concat(slice.call(args)));
      }
    };
    deprecated = function(deprecatedExpression, replacementExpression) {
      return warn(deprecatedExpression + " has been deprecated. Use " + replacementExpression + " instead.");
    };
    return {
      deprecated: deprecated,
      renamedPackage: renamedPackage,
      renamedProperty: renamedProperty,
      renamedEvent: renamedEvent,
      fixEventType: fixEventType,
      fixKey: fixKey,
      warn: warn
    };
  })();

}).call(this);

/***
Browser support
===============

Unpoly supports all modern browsers.

Chrome, Firefox, Edge, Safari
: Full support

Internet Explorer 11
: Full support with a `Promise` polyfill like [es6-promise](https://github.com/stefanpenner/es6-promise) (2.4 KB).

Internet Explorer 10 or lower
: Unpoly prevents itself from booting itself, leaving you with a classic server-side application.

@module up.browser
 */

(function() {
  var slice = [].slice;

  up.browser = (function() {
    var callJQuery, canAnimationFrame, canCSSTransition, canConsole, canControlScrollRestoration, canCustomElements, canDOMParser, canFormData, canFormatLog, canInputEvent, canInspectFormData, canJQuery, canPassiveEventListener, canPromise, canPushState, isIE10OrWorse, isIE11, isSupported, loadPage, popCookie, submitForm, u, whenConfirmed;
    u = up.util;

    /***
    Makes a full page request, replacing the entire JavaScript environment with a new page from the server response.
    
    @function up.browser.loadPage
    @param {string} options.url
      The URL to load.
    @param {string} [options.method='get']
      The method for the request.
    
      Methods other than GET or POST will be [wrapped](/up.protocol.config#config.methodParam) in a POST request.
    @param {Object|Array|FormData|string} [options.params]
    @external
     */
    loadPage = function(requestsAttrs) {
      return new up.Request(requestsAttrs).loadPage();
    };

    /***
    For mocking in specs.
    
    @function up.browser.submitForm
     */
    submitForm = function(form) {
      return form.submit();
    };
    isIE10OrWorse = u.memoize(function() {
      return !window.atob;
    });
    isIE11 = u.memoize(function() {
      return 'ActiveXObject' in window;
    });

    /***
    Returns whether this browser supports manipulation of the current URL
    via [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState).
    
    When `pushState`  (e.g. through [`up.follow()`](/up.follow)), it will gracefully
    fall back to a full page load.
    
    Note that Unpoly will not use `pushState` if the initial page was loaded with
    a request method other than GET.
    
    @function up.browser.canPushState
    @return {boolean}
    @stable
     */
    canPushState = function() {
      return u.isDefined(history.pushState) && up.protocol.initialRequestMethod() === 'get';
    };

    /***
    Returns whether this browser supports animation using
    [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions).
    
    When Unpoly is asked to animate history on a browser that doesn't support
    CSS transitions (e.g. through [`up.animate()`](/up.animate)), it will skip the
    animation by instantly jumping to the last frame.
    
    @function up.browser.canCSSTransition
    @return {boolean}
    @internal
     */
    canCSSTransition = u.memoize(function() {
      return 'transition' in document.documentElement.style;
    });

    /***
    Returns whether this browser supports the DOM event [`input`](https://developer.mozilla.org/de/docs/Web/Events/input).
    
    @function up.browser.canInputEvent
    @return {boolean}
    @internal
     */
    canInputEvent = u.memoize(function() {
      return 'oninput' in document.createElement('input');
    });

    /***
    Returns whether this browser supports promises.
    
    @function up.browser.canPromise
    @return {boolean}
    @internal
     */
    canPromise = u.memoize(function() {
      return !!window.Promise;
    });

    /***
    Returns whether this browser supports the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
    interface.
    
    @function up.browser.canFormData
    @return {boolean}
    @experimental
     */
    canFormData = u.memoize(function() {
      return !!window.FormData;
    });

    /***
    @function up.browser.canInspectFormData
    @return {boolean}
    @internal
     */
    canInspectFormData = u.memoize(function() {
      return canFormData() && !!FormData.prototype.entries;
    });

    /***
    Returns whether this browser supports the [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
    interface.
    
    @function up.browser.canDOMParser
    @return {boolean}
    @internal
     */
    canDOMParser = u.memoize(function() {
      return !!window.DOMParser;
    });
    canFormatLog = u.memoize(function() {
      return !isIE11();
    });

    /***
    Returns whether this browser supports the [`debugging console`](https://developer.mozilla.org/en-US/docs/Web/API/Console).
    
    @function up.browser.canConsole
    @return {boolean}
    @internal
     */
    canConsole = u.memoize(function() {
      return window.console && console.debug && console.info && console.warn && console.error && console.group && console.groupCollapsed && console.groupEnd;
    });
    canCustomElements = u.memoize(function() {
      return !!window.customElements;
    });
    canAnimationFrame = u.memoize(function() {
      return 'requestAnimationFrame' in window;
    });
    canControlScrollRestoration = u.memoize(function() {
      return 'scrollRestoration' in history;
    });
    canPassiveEventListener = u.memoize(function() {
      return !isIE11();
    });
    canJQuery = function() {
      return !!window.jQuery;
    };
    popCookie = function(name) {
      var ref, value;
      if (value = (ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? ref[1] : void 0) {
        document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
      }
      return value;
    };

    /***
    @function up,browser.whenConfirmed
    @return {Promise}
    @param {string} options.confirm
    @param {boolean} options.preload
    @internal
     */
    whenConfirmed = function(options) {
      if (!options.confirm || window.confirm(options.confirm)) {
        return Promise.resolve();
      } else {
        return up.error.aborted.async('User canceled action');
      }
    };

    /***
    Returns whether Unpoly supports the current browser.
    
    If this returns `false` Unpoly will prevent itself from [booting](/up.boot)
    and ignores all registered [event handlers](/up.on) and [compilers](/up.compiler).
    This leaves you with a classic server-side application.
    This is usually a better fallback than loading incompatible Javascript and causing
    many errors on load.
    
    @function up.browser.isSupported
    @stable
     */
    isSupported = function() {
      return !isIE10OrWorse() && canConsole() && canDOMParser() && canFormData() && canCSSTransition() && canInputEvent() && canPromise() && canAnimationFrame();
    };
    callJQuery = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      canJQuery() || up.fail("jQuery must be published as window.jQuery");
      return jQuery.apply(null, args);
    };
    return u.literal({
      loadPage: loadPage,
      submitForm: submitForm,
      canPushState: canPushState,
      canFormData: canFormData,
      canInspectFormData: canInspectFormData,
      canCustomElements: canCustomElements,
      canControlScrollRestoration: canControlScrollRestoration,
      canFormatLog: canFormatLog,
      canPassiveEventListener: canPassiveEventListener,
      canJQuery: canJQuery,
      whenConfirmed: whenConfirmed,
      isSupported: isSupported,
      popCookie: popCookie,
      jQuery: callJQuery,
      isIE11: isIE11
    });
  })();

}).call(this);

/***
DOM helpers
===========

The `up.element` module offers functions for DOM manipulation and traversal.

It complements [native `Element` methods](https://www.w3schools.com/jsref/dom_obj_all.asp) and works across all [supported browsers](/up.browser).

@module up.element
 */

(function() {
  var slice = [].slice;

  up.element = (function() {
    var CSS_LENGTH_PROPS, MATCH_FN_NAME, NONE, SINGLETON_PATTERN, SINGLETON_TAG_NAMES, affix, all, ancestor, around, attributeSelector, booleanAttr, booleanOrStringAttr, callbackAttr, closest, closestAttr, computedStyle, computedStyleNumber, concludeCSSTransition, createDocumentFromHTML, createFromHTML, createFromSelector, cssLength, elementTagName, extractFromStyleObject, first, fixedToAbsolute, getList, getOne, getRoot, hasCSSTransition, hide, idSelector, inlineStyle, insertBefore, isDetached, isInSubtree, isSingleton, isSingletonSelector, isVisible, jsonAttr, matches, metaContent, normalizeStyleValueForWrite, numberAttr, paint, remove, replace, resolveSelector, setAttrs, setInlineStyle, setMissingAttr, setMissingAttrs, setTemporaryAttrs, setTemporaryStyle, show, stringAttr, subtree, toSelector, toggle, toggleAttr, toggleClass, trueAttributeSelector, u, unwrap, upAttrs, valueToList, wrapChildren;
    u = up.util;

    /***
    Returns a null-object that mostly behaves like an `Element`.
    
    @function up.element.none()
    @internal
     */
    NONE = {
      getAttribute: function() {
        return void 0;
      }
    };
    MATCH_FN_NAME = up.browser.isIE11() ? 'msMatchesSelector' : 'matches';

    /***
    Returns the first descendant element matching the given selector.
    
    @function first
    @param {Element} [parent=document]
      The parent element whose descendants to search.
    
      If omitted, all elements in the `document` will be searched.
    @param {string} selector
      The CSS selector to match.
    @return {Element|undefined|null}
      The first element matching the selector.
    
      Returns `null` or `undefined` if no element macthes.
    @internal
     */
    first = function() {
      var args, root, selector;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      selector = args.pop();
      root = args[0] || document;
      return root.querySelector(selector);
    };

    /***
    Returns all descendant elements matching the given selector.
    
    @function up.element.all
    @param {Element} [parent=document]
      The parent element whose descendants to search.
    
      If omitted, all elements in the `document` will be searched.
    @param {string} selector
      The CSS selector to match.
    @return {NodeList<Element>|Array<Element>}
      A list of all elements matching the selector.
    
      Returns an empty list if there are no matches.
    @stable
     */
    all = function() {
      var args, root, selector;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      selector = args.pop();
      root = args[0] || document;
      return root.querySelectorAll(selector);
    };

    /***
    Returns a list of the given parent's descendants matching the given selector.
    The list will also include the parent element if it matches the selector itself.
    
    @function up.element.subtree
    @param {Element} parent
      The parent element for the search.
    @param {string} selector
      The CSS selector to match.
    @return {NodeList<Element>|Array<Element>}
      A list of all matching elements.
    @stable
     */
    subtree = function(root, selector) {
      var results;
      results = [];
      if (matches(root, selector)) {
        results.push(root);
      }
      results.push.apply(results, all(root, selector));
      return results;
    };
    isInSubtree = function(root, selectorOrElement) {
      var element;
      element = getOne(selectorOrElement);
      return root.contains(element);
    };

    /***
    Returns the first element that matches the selector by testing the element itself
    and traversing up through its ancestors in the DOM tree.
    
    @function up.element.closest
    @param {Element} element
      The element on which to start the search.
    @param {string} selector
      The CSS selector to match.
    @return {Element|null|undefined} element
      The matching element.
    
      Returns `null` or `undefined` if no element matches.
    @stable
     */
    closest = function(element, selector) {
      if (element.closest) {
        return element.closest(selector);
      } else if (matches(element, selector)) {
        return element;
      } else {
        return ancestor(element, selector);
      }
    };

    /***
    Returns whether the given element matches the given CSS selector.
    
    @function up.element.matches
    @param {Element} element
      The element to check.
    @param {string} selector
      The CSS selector to match.
    @return {boolean}
      Whether `element` matches `selector`.
    @stable
     */
    matches = function(element, selector) {
      return typeof element[MATCH_FN_NAME] === "function" ? element[MATCH_FN_NAME](selector) : void 0;
    };

    /***
    @function up.element.ancestor
    @internal
     */
    ancestor = function(element, selector) {
      var parentElement;
      if (parentElement = element.parentElement) {
        if (matches(parentElement, selector)) {
          return parentElement;
        } else {
          return ancestor(parentElement, selector);
        }
      }
    };
    around = function(element, selector) {
      return getList(closest(element, selector), subtree(element, selector));
    };

    /***
    Returns the native [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) for the given value.
    
    \#\#\# Casting rules
    
    - If given an element, returns that element.
    - If given a CSS selector string, returns the first element matching that selector.
    - If given a jQuery collection , returns the first element in the collection.
      Throws an error if the collection contains more than one element.
    - If given any other argument (`undefined`, `null`, `document`, `window`…), returns the argument unchanged.
    
    @function up.element.get
    @param {Element} [parent=document]
      The parent element whose descendants to search if `value` is a CSS selector string.
    
      If omitted, all elements in the `document` will be searched.
    @param {Element|jQuery|string} value
      The value to look up.
    @return {Element}
      The obtained `Element`.
    @stable
     */
    getOne = function() {
      var args, value;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      value = args.pop();
      if (u.isElement(value)) {
        return value;
      } else if (u.isString(value)) {
        return first.apply(null, slice.call(args).concat([value]));
      } else if (u.isList(value)) {
        if (value.length > 1) {
          up.fail('up.element.get(): Cannot cast multiple elements (%o) to a single element', value);
        }
        return value[0];
      } else {
        return value;
      }
    };

    /***
    Composes a list of elements from the given arguments.
    
    \#\#\# Casting rules
    
    - If given a string, returns the all elements matching that string.
    - If given any other argument, returns the argument [wrapped as a list](/up.util.wrapList).
    
    \#\#\# Example
    
    ```javascript
    $jquery = $('.jquery')                          // returns jQuery (2) [div.jquery, div.jquery]
    nodeList = document.querySelectorAll('.node')   // returns NodeList (2) [div.node, div.node]
    element = document.querySelector('.element')    // returns Element div.element
    selector = '.selector'                          // returns String '.selector'
    
    elements = up.element.list($jquery, nodeList, undefined, element, selector)
    // returns [div.jquery, div.jquery, div.node, div.node, div.element, div.selector]
    ```
    
    @function up.element.list
    @param {Array<jQuery|Element|Array<Element>|String|undefined|null>} ...args
    @return {Array<Element>}
    @internal
     */
    getList = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return u.flatMap(args, valueToList);
    };
    valueToList = function(value) {
      if (u.isString(value)) {
        return all(value);
      } else {
        return u.wrapList(value);
      }
    };

    /***
    Removes the given element from the DOM tree.
    
    If you don't need IE11 support you may also use the built-in
    [`Element#remove()`](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove) to the same effect.
    
    @function up.element.remove
    @param {Element} element
      The element to remove.
    @stable
     */
    remove = function(element) {
      var parent;
      if (element.remove) {
        return element.remove();
      } else if (parent = element.parentNode) {
        return parent.removeChild(element);
      }
    };

    /***
    Hides the given element.
    
    The element is hidden by setting an [inline style](https://www.codecademy.com/articles/html-inline-styles)
    of `{ display: none }`.
    
    Also see `up.element.show()`.
    
    @function up.element.hide
    @param {Element} element
    @stable
     */
    hide = function(element) {
      return element.style.display = 'none';
    };

    /***
    Shows the given element.
    
    Also see `up.element.hide()`.
    
    \#\#\# Limitations
    
    The element is shown by setting an [inline style](https://www.codecademy.com/articles/html-inline-styles)
    of `{ display: '' }`.
    
    You might have CSS rules causing the element to remain hidden after calling `up.element.show(element)`.
    Unpoly will not handle such cases in order to keep this function performant. As a workaround, you may
    manually set the `element.style.display` property. Also see discussion
    in jQuery issues [#88](https://github.com/jquery/jquery.com/issues/88),
    [#2057](https://github.com/jquery/jquery/issues/2057) and
    [this WHATWG mailing list post](http://lists.w3.org/Archives/Public/public-whatwg-archive/2014Apr/0094.html).
    
    @function up.element.show
    @stable
     */
    show = function(element) {
      return element.style.display = '';
    };

    /***
    Display or hide the given element, depending on its current visibility.
    
    @function up.element.toggle
    @param {Element} element
    @param {boolean} [newVisible]
      Pass `true` to show the element or `false` to hide it.
    
      If omitted, the element will be hidden if shown and shown if hidden.
    @stable
     */
    toggle = function(element, newVisible) {
      if (newVisible == null) {
        newVisible = !isVisible(element);
      }
      if (newVisible) {
        return show(element);
      } else {
        return hide(element);
      }
    };

    /***
    Adds or removes the given class from the given element.
    
    If you don't need IE11 support you may also use the built-in
    [`Element#classList.toggle(className)`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) to the same effect.
    
    @function up.element.toggleClass
    @param {Element} element
      The element for which to add or remove the class.
    @param {string} className
      A boolean value to determine whether the class should be added or removed.
    @param {string} state
      If omitted, the class will be added if missing and removed if present.
    @stable
     */
    toggleClass = function(element, klass, newPresent) {
      var list;
      list = element.classList;
      if (newPresent == null) {
        newPresent = !list.contains(klass);
      }
      if (newPresent) {
        return list.add(klass);
      } else {
        return list.remove(klass);
      }
    };
    toggleAttr = function(element, attr, value, newPresent) {
      if (newPresent == null) {
        newPresent = !element.hasAttribute(attr);
      }
      if (newPresent) {
        return element.setAttribute(attr, value);
      } else {
        return element.removeAttribute(attr);
      }
    };

    /***
    Sets all key/values from the given object as attributes on the given element.
    
    \#\#\# Example
    
        up.element.setAttrs(element, { title: 'Tooltip', tabindex: 1 })
    
    @function up.element.setAttrs
    @param {Element} element
      The element on which to set attributes.
    @param {Object} attributes
      An object of attributes to set.
    @stable
     */
    setAttrs = function(element, attrs) {
      var key, results1, value;
      results1 = [];
      for (key in attrs) {
        value = attrs[key];
        if (u.isGiven(value)) {
          results1.push(element.setAttribute(key, value));
        } else {
          results1.push(element.removeAttribute(key));
        }
      }
      return results1;
    };
    setTemporaryAttrs = function(element, attrs) {
      var i, key, len, oldAttrs, ref;
      oldAttrs = {};
      ref = Object.keys(attrs);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        oldAttrs[key] = element.getAttribute(key);
      }
      setAttrs(element, attrs);
      return function() {
        return setAttrs(element, oldAttrs);
      };
    };

    /***
    @function up.element.metaContent
    @internal
     */
    metaContent = function(name) {
      var ref, selector;
      selector = "meta" + attributeSelector('name', name);
      return (ref = first(selector)) != null ? ref.getAttribute('content') : void 0;
    };

    /***
    @function up.element.insertBefore
    @internal
     */
    insertBefore = function(existingElement, newElement) {
      return existingElement.insertAdjacentElement('beforebegin', newElement);
    };

    /***
    Replaces the given old element with the given new element.
    
    The old element will be removed from the DOM tree.
    
    If you don't need IE11 support you may also use the built-in
    [`Element#replaceWith()`](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith) to the same effect.
    
    @function up.element.replace
    @param {Element} oldElement
    @param {Element} newElement
    @stable
     */
    replace = function(oldElement, newElement) {
      return oldElement.parentElement.replaceChild(newElement, oldElement);
    };

    /***
    Creates an element matching the given CSS selector.
    
    The created element will not yet be attached to the DOM tree.
    Attach it with [`Element#appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
    or use `up.element.affix()` to create an attached element.
    
    \#\#\# Examples
    
    To create an element with a given tag name:
    
        element = up.element.createFromSelector('span')
        // element is <span></span>
    
    To create an element with a given class:
    
        element = up.element.createFromSelector('.klass')
        // element is <div class="klass"></div>
    
    To create an element with a given ID:
    
        element = up.element.createFromSelector('#foo')
        // element is <div id="foo"></div>
    
    To create an element with a given boolean attribute:
    
        element = up.element.createFromSelector('[attr]')
        // element is <div attr></div>
    
    To create an element with a given attribute value:
    
        element = up.element.createFromSelector('[attr="value"]')
        // element is <div attr="value"></div>
    
    You may also pass an object of attribute names/values as a second argument:
    
        element = up.element.createFromSelector('div', { attr: 'value' })
        // element is <div attr="value"></div>
    
    You may set the element's inner text by passing a `{ text }` option (HTML control characters will
    be escaped):
    
        element = up.element.createFromSelector('div', { text: 'inner text' })
        // element is <div>inner text</div>
    
    You may set the element's inner HTML by passing a `{ content }` option:
    
        element = up.element.createFromSelector('div', { content: '<span>inner text</span>' })
        // element is <div>inner text</div>
    
    You may set inline styles by passing an object of CSS properties as a second argument:
    
        element = up.element.createFromSelector('div', { style: { color: 'red' }})
        // element is <div style="color: red"></div>
    
    @function up.element.createFromSelector
    @param {string} selector
      The CSS selector from which to create an element.
    @param {Object} [attrs]
      An object of attributes to set on the created element.
    @param {Object} [attrs.text]
      The [text content](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) of the created element.
    @param {Object} [attrs.content]
      The [inner HTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) of the created element.
    @param {Object} [attrs.style]
      An object of CSS properties that will be set as the inline style
      of the created element.
    
      The given object may use kebab-case or camelCase keys.
    @return {Element}
      The created element.
    @stable
     */
    createFromSelector = function(selector, attrs) {
      var attrValues, classValue, contentValue, depthElement, depthSelector, depths, i, j, klass, len, len1, previousElement, ref, rootElement, selectorWithoutAttrValues, styleValue, tagName, textValue;
      attrValues = [];
      selectorWithoutAttrValues = selector.replace(/\[([\w-]+)(?:[\~\|\^\$\*]?=(["'])?([^\2\]]*?)\2)?\]/g, function(_match, attrName, _quote, attrValue) {
        attrValues.push(attrValue || '');
        return "[" + attrName + "]";
      });
      depths = selectorWithoutAttrValues.split(/[ >]+/);
      rootElement = void 0;
      depthElement = void 0;
      previousElement = void 0;
      for (i = 0, len = depths.length; i < len; i++) {
        depthSelector = depths[i];
        tagName = void 0;
        depthSelector = depthSelector.replace(/^[\w-]+/, function(match) {
          tagName = match;
          return '';
        });
        depthElement = document.createElement(tagName || 'div');
        rootElement || (rootElement = depthElement);
        depthSelector = depthSelector.replace(/\#([\w-]+)/, function(_match, id) {
          depthElement.id = id;
          return '';
        });
        depthSelector = depthSelector.replace(/\.([\w-]+)/g, function(_match, className) {
          depthElement.classList.add(className);
          return '';
        });
        if (attrValues.length) {
          depthSelector = depthSelector.replace(/\[([\w-]+)\]/g, function(_match, attrName) {
            depthElement.setAttribute(attrName, attrValues.shift());
            return '';
          });
        }
        if (depthSelector !== '') {
          throw up.error.invalidSelector(selector);
        }
        if (previousElement != null) {
          previousElement.appendChild(depthElement);
        }
        previousElement = depthElement;
      }
      if (attrs) {
        if (classValue = u.pluckKey(attrs, 'class')) {
          ref = u.wrapList(classValue);
          for (j = 0, len1 = ref.length; j < len1; j++) {
            klass = ref[j];
            rootElement.classList.add(klass);
          }
        }
        if (styleValue = u.pluckKey(attrs, 'style')) {
          setInlineStyle(rootElement, styleValue);
        }
        if (textValue = u.pluckKey(attrs, 'text')) {
          rootElement.textContent = textValue;
        }
        if (contentValue = u.pluckKey(attrs, 'content')) {
          rootElement.innerHTML = contentValue;
        }
        setAttrs(rootElement, attrs);
      }
      return rootElement;
    };

    /***
    Creates an element matching the given CSS selector and attaches it to the given parent element.
    
    To create a detached element from a selector,
    see `up.element.createFromSelector()`.
    
    \#\#\# Example
    
        element = up.element.affix(document.body, '.klass')
        element.parentElement // returns document.body
        element.className // returns 'klass'
    
    @function up.element.affix
    @param {Element} parent
      The parent to which to attach the created element.
    @param {string} [position='beforeend']
      The position of the new element in relation to `parent`.
      Can be one of the following values:
    
      - `'beforebegin'`: Before `parent`, as a new sibling.
      - `'afterbegin'`: Just inside `parent`, before its first child.
      - `'beforeend'`: Just inside `parent`, after its last child.
      - `'afterend'`: After `parent`, as a new sibling.
    @param {string} selector
      The CSS selector from which to create an element.
    @param {Object} attrs
      An object of attributes to set on the created element.
    @param {Object} attrs.text
      The [text content](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) of the created element.
    @param {Object} attrs.style
      An object of CSS properties that will be set as the inline style
      of the created element.
    
      The given object may use kebab-case or camelCase keys.
    @return {Element}
      The created element.
    @stable
     */
    affix = function() {
      var args, attributes, element, parent, position, selector;
      parent = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      attributes = u.extractOptions(args);
      if (args.length === 2) {
        position = args[0], selector = args[1];
      } else {
        position = 'beforeend';
        selector = args[0];
      }
      element = createFromSelector(selector, attributes);
      parent.insertAdjacentElement(position, element);
      return element;
    };

    /***
    Returns a CSS selector that matches the given element as good as possible.
    
    Alias for `up.fragment.toTarget()`.
    
    @function up.element.toSelector
    @param {string|Element|jQuery}
      The element for which to create a selector.
    @stable
     */
    toSelector = function() {
      var args, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = up.fragment).toTarget.apply(ref, args);
    };
    SINGLETON_TAG_NAMES = ['HTML', 'BODY', 'HEAD', 'TITLE'];
    SINGLETON_PATTERN = new RegExp('\\b(' + SINGLETON_TAG_NAMES.join('|') + ')\\b', 'i');

    /***
    @function up.element.isSingleton
    @internal
     */
    isSingleton = function(element) {
      return matches(element, SINGLETON_TAG_NAMES.join(','));
    };
    isSingletonSelector = function(selector) {
      return SINGLETON_PATTERN.test(selector);
    };
    elementTagName = function(element) {
      return element.tagName.toLowerCase();
    };

    /***
    @function up.element.attributeSelector
    @internal
     */
    attributeSelector = function(attribute, value) {
      value = value.replace(/"/g, '\\"');
      return "[" + attribute + "=\"" + value + "\"]";
    };
    trueAttributeSelector = function(attribute) {
      return "[" + attribute + "]:not([" + attribute + "=false])";
    };
    idSelector = function(id) {
      if (id.match(/^[a-z0-9\-_]+$/i)) {
        return "#" + id;
      } else {
        return attributeSelector('id', id);
      }
    };

    /***
    Always creates a full document with a <html> root, even if the given `html`
    is only a fragment.
    
    @function up.element.createDocumentFromHTML
    @internal
     */
    createDocumentFromHTML = function(html) {
      var parser;
      parser = new DOMParser();
      return parser.parseFromString(html, 'text/html');
    };

    /***
    Creates an element from the given HTML fragment.
    
    \#\#\# Example
    
        element = up.element.createFromHTML('<div class="foo"><span>text</span></div>')
        element.className // returns 'foo'
        element.children[0] // returns <span> element
        element.children[0].textContent // returns 'text'
    
    @function up.element.createFromHTML
    @stable
     */
    createFromHTML = function(html) {
      var mother;
      mother = document.createElement('div');
      mother.innerHTML = html;
      return mother.children[0];
    };

    /***
    @function up.element.root
    @internal
     */
    getRoot = function() {
      return document.documentElement;
    };

    /***
    Forces the browser to paint the given element now.
    
    @function up.element.paint
    @internal
     */
    paint = function(element) {
      return element.offsetHeight;
    };

    /***
    @function up.element.concludeCSSTransition
    @internal
     */
    concludeCSSTransition = function(element) {
      var undo;
      undo = setTemporaryStyle(element, {
        transition: 'none'
      });
      paint(element);
      return undo;
    };

    /***
    Returns whether the given element has a CSS transition set.
    
    @function up.element.hasCSSTransition
    @return {boolean}
    @internal
     */
    hasCSSTransition = function(elementOrStyleHash) {
      var duration, noTransition, prop, styleHash;
      if (u.isOptions(elementOrStyleHash)) {
        styleHash = elementOrStyleHash;
      } else {
        styleHash = computedStyle(elementOrStyleHash);
      }
      prop = styleHash.transitionProperty;
      duration = styleHash.transitionDuration;
      noTransition = prop === 'none' || (prop === 'all' && duration === 0);
      return !noTransition;
    };

    /***
    @function up.element.fixedToAbsolute
    @internal
     */
    fixedToAbsolute = function(element) {
      var elementRectAsFixed, offsetParentRect;
      elementRectAsFixed = element.getBoundingClientRect();
      element.style.position = 'absolute';
      offsetParentRect = element.offsetParent.getBoundingClientRect();
      return setInlineStyle(element, {
        left: elementRectAsFixed.left - computedStyleNumber(element, 'margin-left') - offsetParentRect.left,
        top: elementRectAsFixed.top - computedStyleNumber(element, 'margin-top') - offsetParentRect.top,
        right: '',
        bottom: ''
      });
    };

    /***
    On the given element, set attributes that are still missing.
    
    @function up.element.setMissingAttrs
    @internal
     */
    setMissingAttrs = function(element, attrs) {
      var key, results1, value;
      results1 = [];
      for (key in attrs) {
        value = attrs[key];
        results1.push(setMissingAttr(element, key, value));
      }
      return results1;
    };
    setMissingAttr = function(element, key, value) {
      if (u.isMissing(element.getAttribute(key))) {
        return element.setAttribute(key, value);
      }
    };

    /***
    @function up.element.unwrap
    @internal
     */
    unwrap = function(wrapper) {
      var parent, wrappedNodes;
      parent = wrapper.parentNode;
      wrappedNodes = u.toArray(wrapper.childNodes);
      u.each(wrappedNodes, function(wrappedNode) {
        return parent.insertBefore(wrappedNode, wrapper);
      });
      return parent.removeChild(wrapper);
    };
    wrapChildren = function(element, wrapperSelector) {
      var childNode, wrapper;
      if (wrapperSelector == null) {
        wrapperSelector = 'up-wrapper';
      }
      wrapper = createFromSelector(wrapperSelector);
      while (childNode = element.firstChild) {
        wrapper.appendChild(childNode);
      }
      element.appendChild(wrapper);
      return wrapper;
    };

    /***
    Returns the given `attribute` value for the given `element`.
    
    If the element does not have the given attribute, it returns `undefined`.
    This is a difference to the native `Element#getAttribute()`, which [mostly returns `null` in that case](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute#Non-existing_attributes).
    
    If the element has the attribute but without value (e.g. '<input readonly>'>), it returns an empty string.
    
    @function up.element.attr
    @stable
     */
    stringAttr = function(element, attribute) {
      return u.nullToUndefined(element.getAttribute(attribute));
    };

    /***
    Returns the value of the given attribute on the given element, cast as a boolean value.
    
    If the attribute value cannot be cast to `true` or `false`, `undefined` is returned.
    
    \#\#\# Casting rules
    
    This function deviates from the
    [HTML Standard for boolean attributes](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes)
    in order to allow `undefined` values. When an attribute is missing, Unpoly considers the value to be `undefined`
    (where the standard would assume `false`).
    
    Unpoly also allows `"true"` and `"false"` as attribute values.
    
    The table below shows return values for `up.element.booleanAttr(element, 'foo')` given different elements:
    
    | Element             | Return value |
    |---------------------|--------------|
    | `<div foo>`         | `true`       |
    | `<div foo="foo">`   | `true`       |
    | `<div foo="true">`  | `true`       |
    | `<div foo="">`      | `true`       |
    | `<div foo="false">` | `false`      |
    | `<div>`             | `undefined`  |
    | `<div foo="bar">`   | `undefined`  |
    
    @function up.element.booleanAttr
    @param {Element} element
      The element from which to retrieve the attribute value.
    @param {string} attribute
      The attribute name.
    @return {boolean|undefined}
      The cast attribute value.
    @stable
     */
    booleanAttr = function(element, attribute, pass) {
      var value;
      value = stringAttr(element, attribute);
      switch (value) {
        case 'false':
          return false;
        case 'true':
        case '':
        case attribute:
          return true;
        default:
          if (pass) {
            return value;
          }
      }
    };

    /***
    Returns the given attribute value cast as boolean.
    
    If the attribute value cannot be cast, returns the attribute value unchanged.
    
    @internal
     */
    booleanOrStringAttr = function(element, attribute) {
      return booleanAttr(element, attribute, true);
    };

    /***
    Returns the value of the given attribute on the given element, cast to a number.
    
    If the attribute value cannot be cast to a number, `undefined` is returned.
    
    @function up.element.numberAttr
    @param {Element} element
      The element from which to retrieve the attribute value.
    @param {string} attribute
      The attribute name.
    @return {number|undefined}
      The cast attribute value.
    @stable
     */
    numberAttr = function(element, attribute) {
      var value;
      if (value = element.getAttribute(attribute)) {
        value = value.replaceAll('_', '');
        if (value.match(/^[\d\.]+$/)) {
          return parseFloat(value);
        }
      }
    };

    /***
    Reads the given attribute from the element, parsed as [JSON](https://www.json.org/).
    
    Returns `undefined` if the attribute value is [blank](/up.util.isBlank).
    
    Throws a `SyntaxError` if the attribute value is an invalid JSON string.
    
    @function up.element.jsonAttr
    @param {Element} element
      The element from which to retrieve the attribute value.
    @param {string} attribute
      The attribute name.
    @return {Object|undefined}
      The cast attribute value.
    @stable
     */
    jsonAttr = function(element, attribute) {
      var json, ref;
      if (json = typeof element.getAttribute === "function" ? (ref = element.getAttribute(attribute)) != null ? ref.trim() : void 0 : void 0) {
        return JSON.parse(json);
      }
    };
    callbackAttr = function(link, attr, exposedKeys) {
      var callback, code;
      if (exposedKeys == null) {
        exposedKeys = [];
      }
      if (code = link.getAttribute(attr)) {
        callback = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Function, ['event'].concat(slice.call(exposedKeys), [code]), function(){});
        return function(event) {
          var exposedValues;
          exposedValues = u.values(u.pick(event, exposedKeys));
          return callback.call.apply(callback, [link, event].concat(slice.call(exposedValues)));
        };
      }
    };
    closestAttr = function(element, attr) {
      var ref;
      return (ref = closest(element, '[' + attr + ']')) != null ? ref.getAttribute(attr) : void 0;
    };

    /***
    Temporarily sets the inline CSS styles on the given element.
    
    Returns a function that restores the original inline styles when called.
    
    \#\#\# Example
    
        element = document.querySelector('div')
        unhide = up.element.setTemporaryStyle(element, { 'visibility': 'hidden' })
        // do things while element is invisible
        unhide()
        // element is visible again
    
    @function up.element.setTemporaryStyle
    @param {Element} element
      The element to style.
    @param {Object} styles
      An object of CSS property names and values.
    @return {Function()}
      A function that restores the original inline styles when called.
    @internal
     */
    setTemporaryStyle = function(element, newStyles, block) {
      var oldStyles;
      oldStyles = inlineStyle(element, Object.keys(newStyles));
      setInlineStyle(element, newStyles);
      return function() {
        return setInlineStyle(element, oldStyles);
      };
    };

    /***
    Receives [computed CSS styles](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)
    for the given element.
    
    \#\#\# Examples
    
    When requesting a single CSS property, its value will be returned as a string:
    
        value = up.element.style(element, 'font-size')
        // value is '16px'
    
    When requesting multiple CSS properties, the function returns an object of property names and values:
    
        value = up.element.style(element, ['font-size', 'margin-top'])
        // value is { 'font-size': '16px', 'margin-top': '10px' }
    
    @function up.element.style
    @param {Element} element
    @param {String|Array} propOrProps
      One or more CSS property names in kebab-case or camelCase.
    @return {string|object}
    @stable
     */
    computedStyle = function(element, props) {
      var style;
      style = window.getComputedStyle(element);
      return extractFromStyleObject(style, props);
    };

    /***
    Receives a [computed CSS property value](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)
    for the given element, casted as a number.
    
    The value is casted by removing the property's [unit](https://www.w3schools.com/cssref/css_units.asp) (which is usually `px` for computed properties).
    The result is then parsed as a floating point number.
    
    Returns `undefined` if the property value is missing, or if it cannot
    be parsed as a number.
    
    \#\#\# Examples
    
    When requesting a single CSS property, its value will be returned as a string:
    
        value = up.element.style(element, 'font-size')
        // value is '16px'
    
        value = up.element.styleNumber(element, 'font-size')
        // value is 16
    
    @function up.element.styleNumber
    @param {Element} element
    @param {string} prop
      A single property name in kebab-case or camelCase.
    @return {number|undefined}
    @stable
     */
    computedStyleNumber = function(element, prop) {
      var rawValue;
      rawValue = computedStyle(element, prop);
      if (u.isGiven(rawValue)) {
        return parseFloat(rawValue);
      } else {
        return void 0;
      }
    };

    /***
    Gets the given inline style(s) from the given element's `[style]` attribute.
    
    @function up.element.inlineStyle
    @param {Element} element
    @param {String|Array} propOrProps
      One or more CSS property names in kebab-case or camelCase.
    @return {string|object}
    @internal
     */
    inlineStyle = function(element, props) {
      var style;
      style = element.style;
      return extractFromStyleObject(style, props);
    };
    extractFromStyleObject = function(style, keyOrKeys) {
      if (u.isString(keyOrKeys)) {
        return style[keyOrKeys];
      } else {
        return u.pick(style, keyOrKeys);
      }
    };

    /***
    Sets the given CSS properties as inline styles on the given element.
    
    @function up.element.setStyle
    @param {Element} element
    @param {Object} props
      One or more CSS properties with kebab-case keys or camelCase keys.
    @return {string|object}
    @stable
     */
    setInlineStyle = function(element, props) {
      var key, results1, style, value;
      style = element.style;
      results1 = [];
      for (key in props) {
        value = props[key];
        value = normalizeStyleValueForWrite(key, value);
        results1.push(style[key] = value);
      }
      return results1;
    };
    normalizeStyleValueForWrite = function(key, value) {
      if (u.isMissing(value)) {
        value = '';
      } else if (CSS_LENGTH_PROPS.has(key.toLowerCase().replace(/-/, ''))) {
        value = cssLength(value);
      }
      return value;
    };
    CSS_LENGTH_PROPS = u.arrayToSet(['top', 'right', 'bottom', 'left', 'padding', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft', 'margin', 'margintop', 'marginright', 'marginbottom', 'marginleft', 'borderwidth', 'bordertopwidth', 'borderrightwidth', 'borderbottomwidth', 'borderleftwidth', 'width', 'height', 'maxwidth', 'maxheight', 'minwidth', 'minheight']);

    /***
    Converts the given value to a CSS length value, adding a `px` unit if required.
    
    @function cssLength
    @internal
     */
    cssLength = function(obj) {
      if (u.isNumber(obj) || (u.isString(obj) && /^\d+$/.test(obj))) {
        return obj.toString() + "px";
      } else {
        return obj;
      }
    };

    /***
    Resolves the given CSS selector (which might contain `&` references)
    to a full CSS selector without ampersands.
    
    If passed an `Element` or `jQuery` element, returns a CSS selector string
    for that element.
    
    @function up.element.resolveSelector
    @param {string|Element|jQuery} target
    @param {string|Element|jQuery} origin
      The element that this selector resolution is relative to.
      That element's selector will be substituted for `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @return {string}
    @internal
     */
    resolveSelector = function(target, origin) {
      var originSelector;
      if (u.isString(target)) {
        if (u.contains(target, '&')) {
          if (u.isPresent(origin)) {
            originSelector = toSelector(origin);
            target = target.replace(/\&/, originSelector);
          } else {
            up.fail("Found origin reference (%s) in selector %s, but no origin was given", '&', target);
          }
        }
      } else {
        target = toSelector(target);
      }
      return target;
    };

    /***
    Returns whether the given element is currently visible.
    
    An element is considered visible if it consumes space in the document.
    Elements with `{ visibility: hidden }` or `{ opacity: 0 }` are considered visible, since they still consume space in the layout.
    
    Elements not attached to the DOM are considered hidden.
    
    @function up.element.isVisible
    @param {Element} element
      The element to check.
    @stable
     */
    isVisible = function(element) {
      return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };
    upAttrs = function(element) {
      var attribute, attrs, i, len, name, ref, upAttributePattern;
      upAttributePattern = /^up-/;
      attrs = {};
      ref = element.attributes;
      for (i = 0, len = ref.length; i < len; i++) {
        attribute = ref[i];
        name = attribute.name;
        if (name.match(upAttributePattern)) {
          attrs[name] = attribute.value;
        }
      }
      return attrs;
    };
    isDetached = function(element) {
      return element !== document && !getRoot().contains(element);
    };
    return u.literal({
      all: all,
      subtree: subtree,
      isInSubtree: isInSubtree,
      closest: closest,
      closestAttr: closestAttr,
      matches: matches,
      ancestor: ancestor,
      around: around,
      get: getOne,
      list: getList,
      remove: remove,
      toggle: toggle,
      toggleClass: toggleClass,
      hide: hide,
      show: show,
      metaContent: metaContent,
      replace: replace,
      insertBefore: insertBefore,
      createFromSelector: createFromSelector,
      setAttrs: setAttrs,
      setTemporaryAttrs: setTemporaryAttrs,
      affix: affix,
      toSelector: toSelector,
      idSelector: idSelector,
      isSingleton: isSingleton,
      isSingletonSelector: isSingletonSelector,
      attributeSelector: attributeSelector,
      trueAttributeSelector: trueAttributeSelector,
      elementTagName: elementTagName,
      createDocumentFromHTML: createDocumentFromHTML,
      createFromHTML: createFromHTML,
      get_root: getRoot,
      paint: paint,
      concludeCSSTransition: concludeCSSTransition,
      hasCSSTransition: hasCSSTransition,
      fixedToAbsolute: fixedToAbsolute,
      setMissingAttrs: setMissingAttrs,
      setMissingAttr: setMissingAttr,
      unwrap: unwrap,
      wrapChildren: wrapChildren,
      attr: stringAttr,
      booleanAttr: booleanAttr,
      numberAttr: numberAttr,
      jsonAttr: jsonAttr,
      callbackAttr: callbackAttr,
      booleanOrStringAttr: booleanOrStringAttr,
      setTemporaryStyle: setTemporaryStyle,
      style: computedStyle,
      styleNumber: computedStyleNumber,
      inlineStyle: inlineStyle,
      setStyle: setInlineStyle,
      resolveSelector: resolveSelector,
      none: function() {
        return NONE;
      },
      isVisible: isVisible,
      upAttrs: upAttrs,
      toggleAttr: toggleAttr,
      isDetached: isDetached
    });
  })();

}).call(this);
(function() {
  var u,
    slice = [].slice;

  u = up.util;

  up.Class = (function() {
    function Class() {}

    Class.getter = function(prop, get) {
      return u.getter(this.prototype, prop, get);
    };

    Class.accessor = function(prop, descriptor) {
      return Object.defineProperty(this.prototype, prop, descriptor);
    };

    Class.delegate = function(props, targetProp) {
      return u.delegate(this.prototype, props, function() {
        return this[targetProp];
      });
    };

    Class.wrap = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return u.wrapValue.apply(u, [this].concat(slice.call(args)));
    };

    return Class;

  })();

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Record = (function(superClass) {
    extend(Record, superClass);

    Record.prototype.keys = function() {
      throw 'Return an array of keys';
    };

    Record.prototype.defaults = function(options) {
      return {};
    };

    function Record(options) {
      u.assign(this, this.defaults(options), this.attributes(options));
    }

    Record.prototype.attributes = function(source) {
      if (source == null) {
        source = this;
      }
      return u.pick(source, this.keys());
    };

    Record.prototype["" + u.copy.key] = function() {
      return this.variant();
    };

    Record.prototype.variant = function(changes) {
      if (changes == null) {
        changes = {};
      }
      return new this.constructor(u.merge(this.attributes(), changes));
    };

    Record.prototype["" + u.isEqual.key] = function(other) {
      return this.constructor === other.constructor && u.isEqual(this.attributes(), other.attributes());
    };

    return Record;

  })(up.Class);

}).call(this);
(function() {


}).call(this);
(function() {
  var e;

  e = up.element;

  up.BodyShifter = (function() {
    function BodyShifter() {
      this.unshiftFns = [];
      this.reset();
    }

    BodyShifter.prototype.reset = function() {
      this.unshiftNow();
      return this.shiftCount = 0;
    };

    BodyShifter.prototype.shift = function() {
      var anchor, body, bodyRightPadding, bodyRightShift, elementRight, elementRightShift, i, len, overflowElement, ref, results, scrollbarTookSpace, scrollbarWidth;
      this.shiftCount++;
      if (this.shiftCount > 1) {
        return;
      }
      scrollbarTookSpace = up.viewport.rootHasReducedWidthFromScrollbar();
      overflowElement = up.viewport.rootOverflowElement();
      this.changeStyle(overflowElement, {
        overflowY: 'hidden'
      });
      if (!scrollbarTookSpace) {
        return;
      }
      body = document.body;
      scrollbarWidth = up.viewport.scrollbarWidth();
      bodyRightPadding = e.styleNumber(body, 'paddingRight');
      bodyRightShift = scrollbarWidth + bodyRightPadding;
      this.changeStyle(body, {
        paddingRight: bodyRightShift
      });
      ref = up.viewport.anchoredRight();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        anchor = ref[i];
        elementRight = e.styleNumber(anchor, 'right');
        elementRightShift = scrollbarWidth + elementRight;
        results.push(this.changeStyle(anchor, {
          right: elementRightShift
        }));
      }
      return results;
    };

    BodyShifter.prototype.changeStyle = function(element, styles) {
      return this.unshiftFns.push(e.setTemporaryStyle(element, styles));
    };

    BodyShifter.prototype.unshift = function() {
      this.shiftCount--;
      if (this.shiftCount > 0) {
        return;
      }
      return this.unshiftNow();
    };

    BodyShifter.prototype.unshiftNow = function() {
      var results, unshiftFn;
      results = [];
      while (unshiftFn = this.unshiftFns.pop()) {
        results.push(unshiftFn());
      }
      return results;
    };

    return BodyShifter;

  })();

}).call(this);
(function() {
  var u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  u = up.util;


  /***
  @class up.Cache
  @internal
   */

  up.Cache = (function() {

    /***
    @constructor
    @param {number|Function(): number} [config.size]
      Maximum number of cache entries.
      Set to `undefined` to not limit the cache size.
    @param {number|Function(): number} [config.expiry]
      The number of milliseconds after which a cache entry
      will be discarded.
    @param {string} [config.logPrefix]
      A prefix for log entries printed by this cache object.
    @param {Function(entry): string} [config.key]
      A function that takes an argument and returns a string key
      for storage. If omitted, `toString()` is called on the argument.
    @param {Function(entry): boolean} [config.cachable]
      A function that takes a potential cache entry and returns whether
      this entry  can be stored in the hash. If omitted, all entries are considered
      cachable.
     */
    function Cache(config) {
      this.config = config != null ? config : {};
      this.get = bind(this.get, this);
      this.isFresh = bind(this.isFresh, this);
      this.remove = bind(this.remove, this);
      this.set = bind(this.set, this);
      this.timestamp = bind(this.timestamp, this);
      this.alias = bind(this.alias, this);
      this.makeRoomForAnotherEntry = bind(this.makeRoomForAnotherEntry, this);
      this.keys = bind(this.keys, this);
      this.log = bind(this.log, this);
      this.clear = bind(this.clear, this);
      this.isCachable = bind(this.isCachable, this);
      this.isEnabled = bind(this.isEnabled, this);
      this.normalizeStoreKey = bind(this.normalizeStoreKey, this);
      this.expiryMillis = bind(this.expiryMillis, this);
      this.maxSize = bind(this.maxSize, this);
      this.store = this.config.store || new up.store.Memory();
    }

    Cache.prototype.size = function() {
      return this.store.size();
    };

    Cache.prototype.maxSize = function() {
      return u.evalOption(this.config.size);
    };

    Cache.prototype.expiryMillis = function() {
      return u.evalOption(this.config.expiry);
    };

    Cache.prototype.normalizeStoreKey = function(key) {
      if (this.config.key) {
        return this.config.key(key);
      } else {
        return key.toString();
      }
    };

    Cache.prototype.isEnabled = function() {
      return this.maxSize() !== 0 && this.expiryMillis() !== 0;
    };

    Cache.prototype.isCachable = function(key) {
      if (this.config.cachable) {
        return this.config.cachable(key);
      } else {
        return true;
      }
    };

    Cache.prototype.clear = function() {
      return this.store.clear();
    };

    Cache.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (this.config.logPrefix) {
        args[0] = "[" + this.config.logPrefix + "] " + args[0];
        return up.puts.apply(up, ['up.Cache'].concat(slice.call(args)));
      }
    };

    Cache.prototype.keys = function() {
      return this.store.keys();
    };

    Cache.prototype.each = function(fn) {
      return u.each(this.keys(), (function(_this) {
        return function(key) {
          var entry;
          entry = _this.store.get(key);
          return fn(key, entry.value, entry.timestamp);
        };
      })(this));
    };

    Cache.prototype.makeRoomForAnotherEntry = function() {
      var oldestKey, oldestTimestamp;
      if (this.hasRoomForAnotherEntry()) {
        return;
      }
      oldestKey = void 0;
      oldestTimestamp = void 0;
      this.each(function(key, request, timestamp) {
        if (!oldestTimestamp || oldestTimestamp > timestamp) {
          oldestKey = key;
          return oldestTimestamp = timestamp;
        }
      });
      if (oldestKey) {
        return this.store.remove(oldestKey);
      }
    };

    Cache.prototype.hasRoomForAnotherEntry = function() {
      var maxSize;
      maxSize = this.maxSize();
      return !maxSize || this.size() < maxSize;
    };

    Cache.prototype.alias = function(oldKey, newKey) {
      var value;
      value = this.get(oldKey, {
        silent: true
      });
      if (u.isDefined(value)) {
        return this.set(newKey, value);
      }
    };

    Cache.prototype.timestamp = function() {
      return (new Date()).valueOf();
    };

    Cache.prototype.set = function(key, value) {
      var entry, storeKey;
      if (this.isEnabled() && this.isCachable(key)) {
        this.makeRoomForAnotherEntry();
        storeKey = this.normalizeStoreKey(key);
        entry = {
          timestamp: this.timestamp(),
          value: value
        };
        return this.store.set(storeKey, entry);
      }
    };

    Cache.prototype.remove = function(key) {
      var storeKey;
      if (this.isCachable(key)) {
        storeKey = this.normalizeStoreKey(key);
        return this.store.remove(storeKey);
      }
    };

    Cache.prototype.isFresh = function(entry) {
      var millis, timeSinceTouch;
      millis = this.expiryMillis();
      if (millis) {
        timeSinceTouch = this.timestamp() - entry.timestamp;
        return timeSinceTouch < millis;
      } else {
        return true;
      }
    };

    Cache.prototype.get = function(key, options) {
      var entry, storeKey;
      if (options == null) {
        options = {};
      }
      storeKey = this.normalizeStoreKey(key);
      if (this.isCachable(key) && (entry = this.store.get(storeKey))) {
        if (this.isFresh(entry)) {
          if (!options.silent) {
            this.log("Cache hit for '%s'", key);
          }
          return entry.value;
        } else {
          if (!options.silent) {
            this.log("Discarding stale cache entry for '%s'", key);
          }
          this.remove(key);
          return void 0;
        }
      } else {
        if (!options.silent) {
          this.log("Cache miss for '%s'", key);
        }
        return void 0;
      }
    };

    return Cache;

  })();

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Change = (function(superClass) {
    extend(Change, superClass);

    function Change(options) {
      this.options = options;
    }

    Change.prototype.onFinished = function() {
      var base;
      return typeof (base = this.options).onFinished === "function" ? base.onFinished() : void 0;
    };

    Change.prototype.notApplicable = function(reason) {
      return up.error.notApplicable(this, reason);
    };


    /***
    The `execute()` method has a somewhat weird signature:
    
    - If it is not applicable, it throws a sync error right away.
      This makes it practicable for internal calls.
    - If it IS applicable, it returns a promise (which might succeed or fail)
    
    For the purposes of our public API we never want an async function to
    throw a sync error. So we offer this `executeAsync()` methid, which never
    throws a sync error.
     */

    Change.prototype.executeAsync = function() {
      return u.rejectOnError((function(_this) {
        return function() {
          return _this.execute();
        };
      })(this));
    };

    Change.prototype.improveHistoryValue = function(existingValue, newValue) {
      if (existingValue === false || u.isString(existingValue)) {
        return existingValue;
      } else {
        return newValue;
      }
    };

    return Change;

  })(up.Class);

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.Change.Addition = (function(superClass) {
    extend(Addition, superClass);

    function Addition(options) {
      Addition.__super__.constructor.call(this, options);
      this.responseDoc = options.responseDoc;
      this.acceptLayer = options.acceptLayer;
      this.dismissLayer = options.dismissLayer;
      this.eventPlans = options.eventPlans || [];
    }

    Addition.prototype.handleLayerChangeRequests = function() {
      if (this.layer.isOverlay()) {
        this.tryAcceptLayerFromServer();
        this.abortWhenLayerClosed();
        this.layer.tryAcceptForLocation();
        this.abortWhenLayerClosed();
        this.tryDismissLayerFromServer();
        this.abortWhenLayerClosed();
        this.layer.tryDismissForLocation();
        this.abortWhenLayerClosed();
      }
      return this.layer.asCurrent((function(_this) {
        return function() {
          var eventPlan, i, len, ref, results;
          ref = _this.eventPlans;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            eventPlan = ref[i];
            up.emit(eventPlan);
            results.push(_this.abortWhenLayerClosed());
          }
          return results;
        };
      })(this));
    };

    Addition.prototype.tryAcceptLayerFromServer = function() {
      if (u.isDefined(this.acceptLayer) && this.layer.isOverlay()) {
        return this.layer.accept(this.acceptLayer);
      }
    };

    Addition.prototype.tryDismissLayerFromServer = function() {
      if (u.isDefined(this.dismissLayer) && this.layer.isOverlay()) {
        return this.layer.dismiss(this.dismissLayer);
      }
    };

    Addition.prototype.abortWhenLayerClosed = function() {
      if (this.layer.isClosed()) {
        throw up.error.aborted('Layer was closed');
      }
    };

    Addition.prototype.setSource = function(arg) {
      var newElement, oldElement, source;
      oldElement = arg.oldElement, newElement = arg.newElement, source = arg.source;
      if (source === 'keep') {
        source = oldElement && up.fragment.source(oldElement);
      }
      if (source) {
        return e.setMissingAttr(newElement, 'up-source', u.normalizeURL(source));
      }
    };

    return Addition;

  })(up.Change);

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Change.Removal = (function(superClass) {
    extend(Removal, superClass);

    function Removal() {
      return Removal.__super__.constructor.apply(this, arguments);
    }

    return Removal;

  })(up.Change);

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.Change.CloseLayer = (function(superClass) {
    extend(CloseLayer, superClass);

    function CloseLayer(options) {
      var ref;
      CloseLayer.__super__.constructor.call(this, options);
      this.verb = options.verb;
      this.layer = up.layer.get(options);
      this.origin = options.origin;
      this.value = options.value;
      this.preventable = (ref = options.preventable) != null ? ref : true;
    }

    CloseLayer.prototype.execute = function() {
      var parent, value;
      if (this.origin && u.isUndefined(value)) {
        value = e.jsonAttr(this.origin, "up-" + this.verb);
      }
      if (!this.layer.isOpen()) {
        return Promise.resolve();
      }
      up.network.abort((function(_this) {
        return function(request) {
          return request.layer === _this.layer;
        };
      })(this));
      if (this.emitCloseEvent().defaultPrevented && this.preventable) {
        throw up.error.aborted('Close event was prevented');
      }
      parent = this.layer.parent;
      this.layer.peel();
      this.layer.stack.remove(this.layer);
      parent.restoreHistory();
      this.handleFocus(parent);
      this.layer.teardownHandlers();
      this.layer.destroyElements(this.options);
      this.emitClosedEvent(parent);
      return Promise.resolve();
    };

    CloseLayer.prototype.emitCloseEvent = function() {
      return this.layer.emit(this.buildEvent("up:layer:" + this.verb), {
        callback: this.layer.callback("on" + (u.upperCaseFirst(this.verb))),
        log: "Will " + this.verb + " " + this.layer
      });
    };

    CloseLayer.prototype.emitClosedEvent = function(formerParent) {
      var verbPast, verbPastUpperCaseFirst;
      verbPast = this.verb + "ed";
      verbPastUpperCaseFirst = u.upperCaseFirst(verbPast);
      return this.layer.emit(this.buildEvent("up:layer:" + verbPast), {
        currentLayer: formerParent,
        callback: this.layer.callback("on" + verbPastUpperCaseFirst),
        ensureBubbles: true,
        log: verbPastUpperCaseFirst + " " + this.layer
      });
    };

    CloseLayer.prototype.buildEvent = function(name) {
      return up.event.build(name, {
        layer: this.layer,
        value: this.value,
        origin: this.origin
      });
    };

    CloseLayer.prototype.handleFocus = function(formerParent) {
      var ref;
      this.layer.overlayFocus.teardown();
      if ((ref = formerParent.overlayFocus) != null) {
        ref.moveToFront();
      }
      return (this.layer.origin || formerParent.element).focus({
        preventScroll: true
      });
    };

    return CloseLayer;

  })(up.Change.Removal);

}).call(this);
(function() {
  var e,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  e = up.element;

  up.Change.DestroyFragment = (function(superClass) {
    extend(DestroyFragment, superClass);

    function DestroyFragment(options) {
      this.wipe = bind(this.wipe, this);
      DestroyFragment.__super__.constructor.call(this, options);
      this.layer = up.layer.get(options) || up.layer.current;
      this.element = this.options.element;
      this.animation = this.options.animation;
      this.log = this.options.log;
    }

    DestroyFragment.prototype.execute = function() {
      up.RenderOptions.fixLegacyHistoryOption(this.options);
      this.layer.updateHistory(this.options);
      this.parent = this.element.parentNode;
      up.fragment.markAsDestroying(this.element);
      if (up.motion.willAnimate(this.element, this.animation, this.options)) {
        this.emitDestroyed();
        this.animate().then(this.wipe).then((function(_this) {
          return function() {
            return _this.onFinished();
          };
        })(this));
      } else {
        this.wipe();
        this.emitDestroyed();
        this.onFinished();
      }
      return Promise.resolve();
    };

    DestroyFragment.prototype.animate = function() {
      return up.motion.animate(this.element, this.animation, this.options);
    };

    DestroyFragment.prototype.wipe = function() {
      return this.layer.asCurrent((function(_this) {
        return function() {
          up.syntax.clean(_this.element, {
            layer: _this.layer
          });
          if (up.browser.canJQuery()) {
            return jQuery(_this.element).remove();
          } else {
            return e.remove(_this.element);
          }
        };
      })(this));
    };

    DestroyFragment.prototype.emitDestroyed = function() {
      return up.fragment.emitDestroyed(this.element, {
        parent: this.parent,
        log: this.log
      });
    };

    return DestroyFragment;

  })(up.Change.Removal);

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.Change.FromContent = (function(superClass) {
    extend(FromContent, superClass);

    function FromContent(options) {
      FromContent.__super__.constructor.call(this, options);
      up.layer.normalizeOptions(this.options);
      this.layers = up.layer.getAll(this.options);
      this.origin = this.options.origin;
      this.preview = this.options.preview;
      this.mode = this.options.mode;
      if (this.origin) {
        this.originLayer = up.layer.get(this.origin);
      }
    }

    FromContent.prototype.getPlans = function() {
      if (!this.plans) {
        this.plans = [];
        if (this.options.fragment) {
          this.options.target = this.getResponseDoc().rootSelector();
        }
        this.expandIntoPlans(this.layers, this.options.target);
        this.expandIntoPlans(this.layers, this.options.fallback);
      }
      return this.plans;
    };

    FromContent.prototype.expandIntoPlans = function(layers, targets) {
      var change, i, layer, len, props, results, target;
      results = [];
      for (i = 0, len = layers.length; i < len; i++) {
        layer = layers[i];
        results.push((function() {
          var j, len1, ref, results1;
          ref = this.expandTargets(targets, layer);
          results1 = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            target = ref[j];
            props = u.merge(this.options, {
              target: target,
              layer: layer,
              placement: this.defaultPlacement()
            });
            if (layer === 'new') {
              change = new up.Change.OpenLayer(props);
            } else {
              change = new up.Change.UpdateLayer(props);
            }
            results1.push(this.plans.push(change));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    FromContent.prototype.expandTargets = function(targets, layer) {
      return up.fragment.expandTargets(targets, {
        layer: layer,
        mode: this.mode,
        origin: this.origin
      });
    };

    FromContent.prototype.execute = function() {
      var executePlan;
      executePlan = (function(_this) {
        return function(plan) {
          return plan.execute(_this.getResponseDoc());
        };
      })(this);
      return this.seekPlan(executePlan) || this.postflightTargetNotApplicable();
    };

    FromContent.prototype.getResponseDoc = function() {
      var base, docOptions;
      if (!(this.preview || this.responseDoc)) {
        docOptions = u.pick(this.options, ['target', 'content', 'fragment', 'document', 'html']);
        if (typeof (base = up.legacy).handleResponseDocOptions === "function") {
          base.handleResponseDocOptions(docOptions);
        }
        if (this.defaultPlacement() === 'content') {
          docOptions.target = this.firstExpandedTarget(docOptions.target);
        }
        this.responseDoc = new up.ResponseDoc(docOptions);
      }
      return this.responseDoc;
    };

    FromContent.prototype.defaultPlacement = function() {
      if (!this.options.document && !this.options.fragment) {
        return 'content';
      }
    };

    FromContent.prototype.firstExpandedTarget = function(target) {
      return this.expandTargets(target || ':main', this.layers[0])[0];
    };

    FromContent.prototype.preflightProps = function(opts) {
      var getPlanProps;
      if (opts == null) {
        opts = {};
      }
      getPlanProps = function(plan) {
        return plan.preflightProps();
      };
      return this.seekPlan(getPlanProps) || opts.optional || this.preflightTargetNotApplicable();
    };

    FromContent.prototype.preflightTargetNotApplicable = function() {
      if (this.hasPlans()) {
        return up.fail("Could not find target in current page (tried selectors %o)", this.planTargets());
      } else {
        return this.failFromEmptyPlans();
      }
    };

    FromContent.prototype.postflightTargetNotApplicable = function() {
      if (this.hasPlans()) {
        return up.fail("Could not match targets in old and new content (tried selectors %o)", this.planTargets());
      } else {
        return this.failFromEmptyPlans();
      }
    };

    FromContent.prototype.hasPlans = function() {
      return this.getPlans().length;
    };

    FromContent.prototype.failFromEmptyPlans = function() {
      if (this.layers.length) {
        return up.fail('No target for change %o', this.options);
      } else {
        return up.fail('Layer %o does not exist', this.options.layer);
      }
    };

    FromContent.prototype.planTargets = function() {
      return u.uniq(u.map(this.getPlans(), 'target'));
    };

    FromContent.prototype.seekPlan = function(fn) {
      var error, i, len, plan, ref;
      ref = this.getPlans();
      for (i = 0, len = ref.length; i < len; i++) {
        plan = ref[i];
        try {
          return fn(plan);
        } catch (error1) {
          error = error1;
          up.error.notApplicable.is(error) || (function() {
            throw error;
          })();
        }
      }
    };

    return FromContent;

  })(up.Change);

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Change.FromURL = (function(superClass) {
    extend(FromURL, superClass);

    function FromURL(options) {
      this.options = options;
      FromURL.__super__.constructor.call(this, this.options);
      this.successOptions = this.options;
      this.failOptions = up.RenderOptions.deriveFailOptions(this.successOptions);
    }

    FromURL.prototype.execute = function() {
      var promise;
      if (!up.browser.canPushState() && !this.options.preload) {
        up.browser.loadPage(this.options);
        return u.unresolvablePromise();
      }
      promise = this.makeRequest();
      if (this.options.preload) {
        return promise;
      } else {
        return u.always(promise, (function(_this) {
          return function(responseOrError) {
            return _this.onRequestSettled(responseOrError);
          };
        })(this));
      }
    };

    FromURL.prototype.makeRequest = function() {
      var base, failAttrs, requestAttrs, successAttrs;
      successAttrs = this.preflightPropsForRenderOptions(this.successOptions);
      failAttrs = this.preflightPropsForRenderOptions(this.failOptions, {
        optional: true
      });
      requestAttrs = u.merge(this.successOptions, successAttrs, u.renameKeys(failAttrs, up.fragment.failKey));
      this.request = up.request(requestAttrs);
      if (typeof (base = this.options).onQueued === "function") {
        base.onQueued({
          request: this.request
        });
      }
      return this.request;
    };

    FromURL.prototype.preflightPropsForRenderOptions = function(renderOptions, requestAttributesOptions) {
      var preview;
      preview = new up.Change.FromContent(u.merge(renderOptions, {
        preview: true
      }));
      return preview.preflightProps(requestAttributesOptions);
    };

    FromURL.prototype.onRequestSettled = function(response) {
      var contentUpdated, log, rejectWithFailedResponse;
      this.response = response;
      rejectWithFailedResponse = (function(_this) {
        return function() {
          return Promise.reject(_this.response);
        };
      })(this);
      if (!(this.response instanceof up.Response)) {
        return rejectWithFailedResponse();
      } else if (this.isSuccessfulResponse()) {
        return this.updateContentFromResponse(['Loaded fragment from successful response to %s', this.request.description], this.successOptions);
      } else {
        log = ['Loaded fragment from failed response to %s (HTTP %d)', this.request.description, this.response.status];
        contentUpdated = this.updateContentFromResponse(log, this.failOptions);
        return u.always(contentUpdated, rejectWithFailedResponse);
      }
    };

    FromURL.prototype.isSuccessfulResponse = function() {
      return this.successOptions.fail === false || this.response.ok;
    };

    FromURL.prototype.buildEvent = function(type, props) {
      var defaultProps;
      defaultProps = {
        request: this.request,
        response: this.response,
        renderOptions: this.options
      };
      return up.event.build(type, u.merge(defaultProps, props));
    };

    FromURL.prototype.updateContentFromResponse = function(log, renderOptions) {
      var event;
      event = this.buildEvent('up:fragment:loaded', {
        renderOptions: renderOptions
      });
      return this.request.whenEmitted(event, {
        log: log,
        callback: this.options.onLoaded
      }).then((function(_this) {
        return function() {
          _this.augmentOptionsFromResponse(renderOptions);
          return new up.Change.FromContent(renderOptions).execute();
        };
      })(this));
    };

    FromURL.prototype.augmentOptionsFromResponse = function(renderOptions) {
      var hash, isReloadable, responseURL, serverLocation, serverTarget;
      responseURL = this.response.url;
      serverLocation = responseURL;
      if (hash = this.request.hash) {
        renderOptions.hash = hash;
        serverLocation += hash;
      }
      isReloadable = this.response.method === 'GET';
      if (isReloadable) {
        renderOptions.source = this.improveHistoryValue(renderOptions.source, responseURL);
      } else {
        renderOptions.source = this.improveHistoryValue(renderOptions.source, 'keep');
        renderOptions.history = !!renderOptions.location;
      }
      renderOptions.location = this.improveHistoryValue(renderOptions.location, serverLocation);
      renderOptions.title = this.improveHistoryValue(renderOptions.title, this.response.title);
      renderOptions.eventPlans = this.response.eventPlans;
      if (serverTarget = this.response.target) {
        renderOptions.target = serverTarget;
      }
      renderOptions.document = this.response.text;
      renderOptions.acceptLayer = this.response.acceptLayer;
      renderOptions.dismissLayer = this.response.dismissLayer;
      if (!renderOptions.document && (u.isDefined(renderOptions.acceptLayer) || u.isDefined(renderOptions.dismissLayer))) {
        renderOptions.target = ':none';
      }
      return renderOptions.context = u.merge(renderOptions.context, this.response.context);
    };

    return FromURL;

  })(up.Change);

}).call(this);
(function() {
  var u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Change.OpenLayer = (function(superClass) {
    extend(OpenLayer, superClass);

    function OpenLayer(options) {
      this.buildEvent = bind(this.buildEvent, this);
      OpenLayer.__super__.constructor.call(this, options);
      this.target = options.target;
      this.mode = options.mode;
      this.origin = options.origin;
      this.currentLayer = options.currentLayer;
      this.source = options.source;
      this.focus = options.focus;
      this.history = options.history;
    }

    OpenLayer.prototype.preflightProps = function() {
      return {
        layer: this.currentLayer,
        mode: this.mode,
        context: this.buildLayer().context,
        target: this.target
      };
    };

    OpenLayer.prototype.bestPreflightSelector = function() {
      return this.target;
    };

    OpenLayer.prototype.toString = function() {
      return "Open \"" + this.target + "\" in new layer";
    };

    OpenLayer.prototype.execute = function(responseDoc) {
      if (this.target === ':none') {
        this.content = document.createElement('up-none');
      } else {
        this.content = responseDoc.select(this.target);
      }
      if (!this.content || this.currentLayer.isClosed()) {
        throw this.notApplicable();
      }
      up.puts('up.render()', "Opening element \"" + this.target + "\" in new layer");
      this.options.title = this.improveHistoryValue(this.options.title, responseDoc.getTitle());
      this.layer = this.buildLayer();
      if (this.emitOpenEvent().defaultPrevented) {
        throw up.error.aborted('Open event was prevented');
      }
      this.currentLayer.peel();
      up.layer.stack.push(this.layer);
      this.layer.createElements(this.content);
      this.layer.setupHandlers();
      this.handleHistory();
      this.setSource({
        newElement: this.content,
        source: this.source
      });
      responseDoc.finalizeElement(this.content);
      up.hello(this.layer.element, {
        layer: this.layer,
        origin: this.origin
      });
      this.handleLayerChangeRequests();
      this.handleScroll();
      this.layer.startOpenAnimation().then((function(_this) {
        return function() {
          if (_this.layer.isOpen()) {
            _this.handleFocus();
          }
          return _this.onFinished();
        };
      })(this));
      this.emitOpenedEvent();
      this.abortWhenLayerClosed();
      return Promise.resolve(this.layer);
    };

    OpenLayer.prototype.buildLayer = function() {
      var optionsWithDefaultHistory, resolveAutoHistory;
      optionsWithDefaultHistory = u.omit(this.options, ['history']);
      resolveAutoHistory = (function(_this) {
        return function(layerOptions) {
          return layerOptions.history = _this.resolveAutoHistoryForLayer(layerOptions.history);
        };
      })(this);
      return up.layer.build(optionsWithDefaultHistory, resolveAutoHistory);
    };

    OpenLayer.prototype.resolveAutoHistoryForLayer = function(modeDefault) {
      var autoResult;
      if (this.history === 'auto') {
        if (modeDefault === 'auto') {
          if (!this.content) {
            return false;
          }
          if (!(autoResult = up.fragment.shouldAutoHistory(this.content, this.options))) {
            up.puts('up.layer.open()', "Opening layer without history as initial content doesn't match up.fragment.config.autoHistoryTargets");
          }
          return autoResult;
        } else {
          return modeDefault;
        }
      } else {
        return this.history;
      }
    };

    OpenLayer.prototype.handleHistory = function() {
      this.layer.parent.saveHistory();
      return this.layer.updateHistory(u.merge(this.options, {
        history: true
      }));
    };

    OpenLayer.prototype.handleFocus = function() {
      var fragmentFocus, ref;
      if ((ref = this.currentLayer.overlayFocus) != null) {
        ref.moveToBack();
      }
      this.layer.overlayFocus.moveToFront();
      fragmentFocus = new up.FragmentFocus({
        fragment: this.content,
        layer: this.layer,
        focus: this.focus,
        autoMeans: ['autofocus', 'layer']
      });
      return fragmentFocus.process();
    };

    OpenLayer.prototype.handleScroll = function() {
      var scrolling, scrollingOptions;
      scrollingOptions = u.merge(this.options, {
        fragment: this.content,
        layer: this.layer,
        autoMeans: ['hash', 'layer']
      });
      scrolling = new up.FragmentScrolling(scrollingOptions);
      return scrolling.process();
    };

    OpenLayer.prototype.buildEvent = function(name) {
      return up.event.build(name, {
        layer: this.layer,
        origin: this.origin,
        log: true
      });
    };

    OpenLayer.prototype.emitOpenEvent = function() {
      return up.emit(this.buildEvent('up:layer:open'), {
        currentLayer: this.layer.parent,
        log: "Opening new " + this.layer
      });
    };

    OpenLayer.prototype.emitOpenedEvent = function() {
      return this.layer.emit(this.buildEvent('up:layer:opened'), {
        callback: this.layer.callback('onOpened'),
        log: "Opened new " + this.layer
      });
    };

    return OpenLayer;

  })(up.Change.Addition);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.Change.UpdateLayer = (function(superClass) {
    extend(UpdateLayer, superClass);

    function UpdateLayer(options) {
      this.executeStep = bind(this.executeStep, this);
      UpdateLayer.__super__.constructor.call(this, options);
      this.layer = options.layer;
      this.target = options.target;
      this.origin = options.origin;
      this.placement = options.placement;
      this.context = options.context;
      this.parseSteps();
    }

    UpdateLayer.prototype.preflightProps = function() {
      this.matchPreflight();
      return {
        layer: this.layer,
        mode: this.layer.mode,
        context: u.merge(this.layer.context, this.context),
        target: this.bestPreflightSelector()
      };
    };

    UpdateLayer.prototype.bestPreflightSelector = function() {
      this.matchPreflight();
      return u.map(this.steps, 'selector').join(', ') || ':none';
    };

    UpdateLayer.prototype.toString = function() {
      return "Update \"" + this.target + "\" in " + this.layer;
    };

    UpdateLayer.prototype.execute = function(responseDoc) {
      var swapPromises;
      this.responseDoc = responseDoc;
      this.matchPostflight();
      up.puts('up.render()', "Updating \"" + this.target + "\" in " + this.layer);
      this.options.title = this.improveHistoryValue(this.options.title, this.responseDoc.getTitle());
      this.setScrollAndFocusOptions();
      if (this.options.saveScroll) {
        up.viewport.saveScroll({
          layer: this.layer
        });
      }
      if (this.options.peel) {
        this.layer.peel();
      }
      u.assign(this.layer.context, this.context);
      if ((this.options.history === 'auto') && !(this.options.history = this.shouldAutoHistory())) {
        up.puts('up.render()', "Will not auto-update history because fragment doesn't match up.fragment.config.autoHistoryTargets");
      }
      this.layer.updateHistory(u.pick(this.options, ['history', 'location', 'title']));
      this.handleLayerChangeRequests();
      swapPromises = this.steps.map(this.executeStep);
      Promise.all(swapPromises).then((function(_this) {
        return function() {
          _this.abortWhenLayerClosed();
          return _this.onFinished();
        };
      })(this));
      return Promise.resolve();
    };

    UpdateLayer.prototype.executeStep = function(step) {
      var keepPlan, morphOptions, newWrapper, oldWrapper, parent, position, promise, wrapper, wrapperStep;
      this.setSource(step);
      switch (step.placement) {
        case 'swap':
          if (keepPlan = this.findKeepPlan(step)) {
            up.fragment.emitKept(keepPlan);
            this.handleFocus(step.oldElement, step);
            return this.handleScroll(step.oldElement, step);
          } else {
            this.transferKeepableElements(step);
            parent = step.oldElement.parentNode;
            morphOptions = u.merge(step, {
              beforeStart: function() {
                return up.fragment.markAsDestroying(step.oldElement);
              },
              afterInsert: (function(_this) {
                return function() {
                  _this.responseDoc.finalizeElement(step.newElement);
                  return up.hello(step.newElement, step);
                };
              })(this),
              beforeDetach: (function(_this) {
                return function() {
                  return up.syntax.clean(step.oldElement, {
                    layer: _this.layer
                  });
                };
              })(this),
              afterDetach: function() {
                e.remove(step.oldElement);
                return up.fragment.emitDestroyed(step.oldElement, {
                  parent: parent,
                  log: false
                });
              },
              scrollNew: (function(_this) {
                return function() {
                  _this.handleFocus(step.newElement, step);
                  return _this.handleScroll(step.newElement, step);
                };
              })(this)
            });
            return up.morph(step.oldElement, step.newElement, step.transition, morphOptions);
          }
          break;
        case 'content':
          oldWrapper = e.wrapChildren(step.oldElement);
          newWrapper = e.wrapChildren(step.newElement);
          wrapperStep = u.merge(step, {
            placement: 'swap',
            oldElement: oldWrapper,
            newElement: newWrapper,
            focus: false
          });
          promise = this.executeStep(wrapperStep);
          promise = promise.then((function(_this) {
            return function() {
              e.unwrap(newWrapper);
              return _this.handleFocus(step.oldElement, step);
            };
          })(this));
          return promise;
        case 'before':
        case 'after':
          wrapper = e.wrapChildren(step.newElement);
          position = step.placement === 'before' ? 'afterbegin' : 'beforeend';
          step.oldElement.insertAdjacentElement(position, wrapper);
          this.responseDoc.finalizeElement(wrapper);
          up.hello(wrapper, step);
          this.handleFocus(wrapper, step);
          promise = this.handleScroll(wrapper, step);
          promise = promise.then(function() {
            return up.animate(wrapper, step.transition, step);
          });
          promise = promise.then(function() {
            return e.unwrap(wrapper);
          });
          return promise;
        default:
          return up.fail('Unknown placement: %o', step.placement);
      }
    };

    UpdateLayer.prototype.findKeepPlan = function(options) {
      var lookupOpts, newElement, oldElement, partner, partnerSelector, plan;
      if (!options.keep) {
        return;
      }
      oldElement = options.oldElement, newElement = options.newElement;
      if (partnerSelector = e.booleanOrStringAttr(oldElement, 'up-keep')) {
        if (partnerSelector === true) {
          partnerSelector = '&';
        }
        lookupOpts = {
          layer: this.layer,
          origin: oldElement
        };
        if (options.descendantsOnly) {
          partner = up.fragment.get(newElement, partnerSelector, lookupOpts);
        } else {
          partner = up.fragment.subtree(newElement, partnerSelector, lookupOpts)[0];
        }
        if (partner && e.matches(partner, '[up-keep]')) {
          plan = {
            oldElement: oldElement,
            newElement: partner,
            newData: up.syntax.data(partner)
          };
          if (!up.fragment.emitKeep(plan).defaultPrevented) {
            return plan;
          }
        }
      }
    };

    UpdateLayer.prototype.transferKeepableElements = function(step) {
      var j, keepPlans, keepable, keepableClone, len, plan, ref;
      keepPlans = [];
      if (step.keep) {
        ref = step.oldElement.querySelectorAll('[up-keep]');
        for (j = 0, len = ref.length; j < len; j++) {
          keepable = ref[j];
          if (plan = this.findKeepPlan(u.merge(step, {
            oldElement: keepable,
            descendantsOnly: true
          }))) {
            keepableClone = keepable.cloneNode(true);
            e.replace(keepable, keepableClone);
            e.replace(plan.newElement, keepable);
            keepPlans.push(plan);
          }
        }
      }
      return step.keepPlans = keepPlans;
    };

    UpdateLayer.prototype.parseSteps = function() {
      var expressionParts, j, len, ref, results, simpleTarget, step;
      this.steps = [];
      ref = u.splitValues(this.target, ',');
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        simpleTarget = ref[j];
        if (simpleTarget !== ':none') {
          expressionParts = simpleTarget.match(/^(.+?)(?:\:(before|after))?$/) || (function() {
            throw up.error.invalidSelector(simpleTarget);
          })();
          step = u.merge(this.options, {
            selector: expressionParts[1],
            placement: expressionParts[2] || this.placement || 'swap'
          });
          results.push(this.steps.push(step));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    UpdateLayer.prototype.matchPreflight = function() {
      var finder, j, len, ref, step;
      if (this.matchedPreflight) {
        return;
      }
      ref = this.steps;
      for (j = 0, len = ref.length; j < len; j++) {
        step = ref[j];
        finder = new up.FragmentFinder(step);
        step.oldElement || (step.oldElement = finder.find() || (function() {
          throw this.notApplicable("Could not find element \"" + this.target + "\" in current page");
        }).call(this));
      }
      this.resolveOldNesting();
      return this.matchedPreflight = true;
    };

    UpdateLayer.prototype.matchPostflight = function() {
      var j, len, ref, step;
      if (this.matchedPostflight) {
        return;
      }
      this.matchPreflight();
      ref = this.steps;
      for (j = 0, len = ref.length; j < len; j++) {
        step = ref[j];
        step.newElement = this.responseDoc.select(step.selector) || (function() {
          throw this.notApplicable("Could not find element \"" + this.target + "\" in server response");
        }).call(this);
      }
      if (this.options.hungry) {
        this.addHungrySteps();
      }
      this.resolveOldNesting();
      return this.matchedPostflight = true;
    };

    UpdateLayer.prototype.addHungrySteps = function() {
      var hungries, j, len, newElement, oldElement, results, selector, transition;
      hungries = up.fragment.all(up.radio.hungrySelector(), this.options);
      results = [];
      for (j = 0, len = hungries.length; j < len; j++) {
        oldElement = hungries[j];
        selector = up.fragment.toTarget(oldElement);
        if (newElement = this.responseDoc.select(selector)) {
          transition = e.booleanOrStringAttr(oldElement, 'transition');
          results.push(this.steps.push({
            selector: selector,
            oldElement: oldElement,
            newElement: newElement,
            transition: transition,
            placement: 'swap'
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    UpdateLayer.prototype.containedByRivalStep = function(steps, candidateStep) {
      return u.some(steps, function(rivalStep) {
        return rivalStep !== candidateStep && (rivalStep.placement === 'swap' || rivalStep.placement === 'content') && rivalStep.oldElement.contains(candidateStep.oldElement);
      });
    };

    UpdateLayer.prototype.resolveOldNesting = function() {
      var compressed;
      compressed = u.uniqBy(this.steps, 'oldElement');
      compressed = u.reject(compressed, (function(_this) {
        return function(step) {
          return _this.containedByRivalStep(compressed, step);
        };
      })(this));
      return this.steps = compressed;
    };

    UpdateLayer.prototype.setScrollAndFocusOptions = function() {
      return this.steps.forEach((function(_this) {
        return function(step, i) {
          if (i > 0) {
            step.scroll = false;
            step.focus = false;
          }
          if (step.placement === 'swap' || step.placement === 'content') {
            step.scrollBehavior = 'auto';
            return _this.focusCapsule != null ? _this.focusCapsule : _this.focusCapsule = up.FocusCapsule.preserveWithin(step.oldElement);
          }
        };
      })(this));
    };

    UpdateLayer.prototype.handleFocus = function(fragment, step) {
      var fragmentFocus;
      fragmentFocus = new up.FragmentFocus({
        focus: step.focus,
        fragment: fragment,
        layer: this.layer,
        focusCapsule: this.focusCapsule,
        autoMeans: ['keep', 'autofocus-if-enabled']
      });
      return fragmentFocus.process();
    };

    UpdateLayer.prototype.handleScroll = function(fragment, step) {
      var options, scrolling;
      options = u.merge(step, {
        fragment: fragment,
        autoMeans: ['hash', 'layer-if-main']
      });
      scrolling = new up.FragmentScrolling(options);
      return scrolling.process();
    };

    UpdateLayer.prototype.shouldAutoHistory = function() {
      return up.fragment.shouldAutoHistory(this.steps[0].oldElement, {
        layer: this.layer
      });
    };

    return UpdateLayer;

  })(up.Change.Addition);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.CompilerPass = (function() {
    function CompilerPass(root, compilers, options) {
      this.root = root;
      this.compilers = compilers;
      if (options == null) {
        options = {};
      }
      this.isInSkippedSubtree = bind(this.isInSkippedSubtree, this);
      this.skipSubtrees = options.skip;
      if (!(this.skipSubtrees.length && this.root.querySelector('[up-keep]'))) {
        this.skipSubtrees = void 0;
      }
      this.layer = options.layer || up.layer.get(this.root) || up.layer.current;
      this.errors = [];
    }

    CompilerPass.prototype.run = function() {
      up.puts('up.hello()', "Compiling fragment %o", this.root);
      this.layer.asCurrent((function(_this) {
        return function() {
          var compiler, i, len, ref, results;
          ref = _this.compilers;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            compiler = ref[i];
            results.push(_this.runCompiler(compiler));
          }
          return results;
        };
      })(this));
      if (this.errors.length) {
        throw up.error.failed('Errors while compiling', {
          errors: this.errors
        });
      }
    };

    CompilerPass.prototype.runCompiler = function(compiler) {
      var i, j, keepValue, len, len1, match, matches, results, value;
      matches = this.select(compiler.selector);
      if (!matches.length) {
        return;
      }
      if (!compiler.isDefault) {
        up.puts('up.hello()', 'Compiling "%s" on %d element(s)', compiler.selector, matches.length);
      }
      if (compiler.batch) {
        this.compileBatch(compiler, matches);
      } else {
        for (i = 0, len = matches.length; i < len; i++) {
          match = matches[i];
          this.compileOneElement(compiler, match);
        }
      }
      if (keepValue = compiler.keep) {
        value = u.isString(keepValue) ? keepValue : '';
        results = [];
        for (j = 0, len1 = matches.length; j < len1; j++) {
          match = matches[j];
          results.push(match.setAttribute('up-keep', value));
        }
        return results;
      }
    };

    CompilerPass.prototype.compileOneElement = function(compiler, element) {
      var compileArgs, data, destructorOrDestructors, elementArg, result;
      elementArg = compiler.jQuery ? up.browser.jQuery(element) : element;
      compileArgs = [elementArg];
      if (compiler.length !== 1) {
        data = up.syntax.data(element);
        compileArgs.push(data);
      }
      result = this.applyCompilerFunction(compiler, element, compileArgs);
      if (destructorOrDestructors = this.destructorPresence(result)) {
        return up.destructor(element, destructorOrDestructors);
      }
    };

    CompilerPass.prototype.compileBatch = function(compiler, elements) {
      var compileArgs, dataList, elementsArgs, result;
      elementsArgs = compiler.jQuery ? up.browser.jQuery(elements) : elements;
      compileArgs = [elementsArgs];
      if (compiler.length !== 1) {
        dataList = u.map(elements, up.syntax.data);
        compileArgs.push(dataList);
      }
      result = this.applyCompilerFunction(compiler, elements, compileArgs);
      if (this.destructorPresence(result)) {
        return up.fail('Compilers with { batch: true } cannot return destructors');
      }
    };

    CompilerPass.prototype.applyCompilerFunction = function(compiler, elementOrElements, compileArgs) {
      var error;
      try {
        return compiler.apply(elementOrElements, compileArgs);
      } catch (error1) {
        error = error1;
        this.errors.push(error);
        up.log.error('up.hello()', 'While compiling %o: %o', elementOrElements, error);
        return up.error.emitGlobal(error);
      }
    };

    CompilerPass.prototype.destructorPresence = function(result) {
      if (u.isFunction(result) || u.isArray(result) && (u.every(result, u.isFunction))) {
        return result;
      }
    };

    CompilerPass.prototype.select = function(selector) {
      var matches;
      matches = e.subtree(this.root, u.evalOption(selector));
      if (this.skipSubtrees) {
        matches = u.reject(matches, this.isInSkippedSubtree);
      }
      return matches;
    };

    CompilerPass.prototype.isInSkippedSubtree = function(element) {
      var parent;
      if (u.contains(this.skipSubtrees, element)) {
        return true;
      } else if (parent = element.parentElement) {
        return this.isInSkippedSubtree(parent);
      } else {
        return false;
      }
    };

    return CompilerPass;

  })();

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Config = (function(superClass) {
    extend(Config, superClass);

    function Config(blueprintFn) {
      this.blueprintFn = blueprintFn != null ? blueprintFn : (function() {
        return {};
      });
      this.reset();
    }

    Config.prototype.reset = function() {
      return u.assign(this, this.blueprintFn());
    };

    return Config;

  })(up.Class);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.CSSTransition = (function() {
    function CSSTransition(element, lastFrameKebab, options) {
      this.element = element;
      this.lastFrameKebab = lastFrameKebab;
      this.startMotion = bind(this.startMotion, this);
      this.resumeOldTransition = bind(this.resumeOldTransition, this);
      this.pauseOldTransition = bind(this.pauseOldTransition, this);
      this.finish = bind(this.finish, this);
      this.onTransitionEnd = bind(this.onTransitionEnd, this);
      this.listenToTransitionEnd = bind(this.listenToTransitionEnd, this);
      this.stopFallbackTimer = bind(this.stopFallbackTimer, this);
      this.startFallbackTimer = bind(this.startFallbackTimer, this);
      this.onFinishEvent = bind(this.onFinishEvent, this);
      this.listenToFinishEvent = bind(this.listenToFinishEvent, this);
      this.start = bind(this.start, this);
      this.lastFrameKeysKebab = Object.keys(this.lastFrameKebab);
      if (u.some(this.lastFrameKeysKebab, function(key) {
        return key.match(/A-Z/);
      })) {
        up.fail('Animation keys must be kebab-case');
      }
      this.finishEvent = options.finishEvent;
      this.duration = options.duration;
      this.easing = options.easing;
      this.finished = false;
    }

    CSSTransition.prototype.start = function() {
      if (this.lastFrameKeysKebab.length === 0) {
        this.finished = true;
        return Promise.resolve();
      }
      this.deferred = u.newDeferred();
      this.pauseOldTransition();
      this.startTime = new Date();
      this.startFallbackTimer();
      this.listenToFinishEvent();
      this.listenToTransitionEnd();
      this.startMotion();
      return this.deferred.promise();
    };

    CSSTransition.prototype.listenToFinishEvent = function() {
      if (this.finishEvent) {
        return this.stopListenToFinishEvent = this.element.addEventListener(this.finishEvent, this.onFinishEvent);
      }
    };

    CSSTransition.prototype.onFinishEvent = function(event) {
      event.stopPropagation();
      return this.finish();
    };

    CSSTransition.prototype.startFallbackTimer = function() {
      var timingTolerance;
      timingTolerance = 100;
      return this.fallbackTimer = u.timer(this.duration + timingTolerance, (function(_this) {
        return function() {
          return _this.finish();
        };
      })(this));
    };

    CSSTransition.prototype.stopFallbackTimer = function() {
      return clearTimeout(this.fallbackTimer);
    };

    CSSTransition.prototype.listenToTransitionEnd = function() {
      return this.stopListenToTransitionEnd = up.on(this.element, 'transitionend', this.onTransitionEnd);
    };

    CSSTransition.prototype.onTransitionEnd = function(event) {
      var completedPropertyKebab, elapsed;
      if (event.target !== this.element) {
        return;
      }
      elapsed = new Date() - this.startTime;
      if (!(elapsed > 0.25 * this.duration)) {
        return;
      }
      completedPropertyKebab = event.propertyName;
      if (!u.contains(this.lastFrameKeysKebab, completedPropertyKebab)) {
        return;
      }
      return this.finish();
    };

    CSSTransition.prototype.finish = function() {
      if (this.finished) {
        return;
      }
      this.finished = true;
      this.stopFallbackTimer();
      if (typeof this.stopListenToFinishEvent === "function") {
        this.stopListenToFinishEvent();
      }
      if (typeof this.stopListenToTransitionEnd === "function") {
        this.stopListenToTransitionEnd();
      }
      e.concludeCSSTransition(this.element);
      this.resumeOldTransition();
      return this.deferred.resolve();
    };

    CSSTransition.prototype.pauseOldTransition = function() {
      var oldTransition, oldTransitionFrameKebab, oldTransitionProperties;
      oldTransition = e.style(this.element, ['transitionProperty', 'transitionDuration', 'transitionDelay', 'transitionTimingFunction']);
      if (e.hasCSSTransition(oldTransition)) {
        if (oldTransition.transitionProperty !== 'all') {
          oldTransitionProperties = oldTransition.transitionProperty.split(/\s*,\s*/);
          oldTransitionFrameKebab = e.style(this.element, oldTransitionProperties);
          this.setOldTransitionTargetFrame = e.setTemporaryStyle(this.element, oldTransitionFrameKebab);
        }
        return this.setOldTransition = e.concludeCSSTransition(this.element);
      }
    };

    CSSTransition.prototype.resumeOldTransition = function() {
      if (typeof this.setOldTransitionTargetFrame === "function") {
        this.setOldTransitionTargetFrame();
      }
      return typeof this.setOldTransition === "function" ? this.setOldTransition() : void 0;
    };

    CSSTransition.prototype.startMotion = function() {
      e.setStyle(this.element, {
        transitionProperty: Object.keys(this.lastFrameKebab).join(', '),
        transitionDuration: this.duration + "ms",
        transitionTimingFunction: this.easing
      });
      return e.setStyle(this.element, this.lastFrameKebab);
    };

    return CSSTransition;

  })();

}).call(this);
(function() {
  var e, u;

  u = up.util;

  e = up.element;

  up.DestructorPass = (function() {
    function DestructorPass(fragment, options) {
      this.fragment = fragment;
      this.options = options;
      this.errors = [];
    }

    DestructorPass.prototype.run = function() {
      var cleanable, destructor, destructors, i, j, len, len1, ref;
      ref = this.selectCleanables();
      for (i = 0, len = ref.length; i < len; i++) {
        cleanable = ref[i];
        if (destructors = u.pluckKey(cleanable, 'upDestructors')) {
          for (j = 0, len1 = destructors.length; j < len1; j++) {
            destructor = destructors[j];
            this.applyDestructorFunction(destructor, cleanable);
          }
        }
        cleanable.classList.remove('up-can-clean');
      }
      if (this.errors.length) {
        throw up.error.failed('Errors while destroying', {
          errors: this.errors
        });
      }
    };

    DestructorPass.prototype.selectCleanables = function() {
      var selectOptions;
      selectOptions = u.merge(this.options, {
        destroying: true
      });
      return up.fragment.subtree(this.fragment, '.up-can-clean', selectOptions);
    };

    DestructorPass.prototype.applyDestructorFunction = function(destructor, element) {
      var error;
      try {
        return destructor();
      } catch (error1) {
        error = error1;
        this.errors.push(error);
        up.log.error('up.destroy()', 'While destroying %o: %o', element, error);
        return up.error.emitGlobal(error);
      }
    };

    return DestructorPass;

  })();

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  u = up.util;

  e = up.element;

  up.EventEmitter = (function(superClass) {
    extend(EventEmitter, superClass);

    function EventEmitter() {
      return EventEmitter.__super__.constructor.apply(this, arguments);
    }

    EventEmitter.prototype.keys = function() {
      return ['target', 'event', 'currentLayer', 'callback', 'log', 'ensureBubbles'];
    };

    EventEmitter.prototype.emit = function() {
      this.logEmission();
      if (this.currentLayer) {
        this.currentLayer.asCurrent((function(_this) {
          return function() {
            return _this.dispatchEvent();
          };
        })(this));
      } else {
        this.dispatchEvent();
      }
      return this.event;
    };

    EventEmitter.prototype.dispatchEvent = function() {
      this.target.dispatchEvent(this.event);
      if (this.ensureBubbles && e.isDetached(this.target)) {
        document.dispatchEvent(this.event);
      }
      return typeof this.callback === "function" ? this.callback(this.event) : void 0;
    };

    EventEmitter.prototype.whenEmitted = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var event;
          event = _this.emit();
          if (event.defaultPrevented) {
            return reject(up.error.aborted("Event " + event.type + " was prevented"));
          } else {
            return resolve();
          }
        };
      })(this));
    };

    EventEmitter.prototype.logEmission = function() {
      var message, messageArgs, ref, type;
      if (!up.log.isEnabled()) {
        return;
      }
      message = this.log;
      if (u.isArray(message)) {
        ref = message, message = ref[0], messageArgs = 2 <= ref.length ? slice.call(ref, 1) : [];
      } else {
        messageArgs = [];
      }
      type = this.event.type;
      if (u.isString(message)) {
        return up.puts.apply(up, [type, message].concat(slice.call(messageArgs)));
      } else if (message !== false) {
        return up.puts(type, "Event " + type);
      }
    };

    EventEmitter.fromEmitArgs = function(args, defaults) {
      var layer, options, ref;
      if (defaults == null) {
        defaults = {};
      }
      options = u.extractOptions(args);
      options = u.merge(defaults, options);
      if (u.isElementish(args[0])) {
        options.target = e.get(args.shift());
      } else if (args[0] instanceof up.Layer) {
        options.layer = args.shift();
      }
      if (options.layer) {
        layer = up.layer.get(options.layer);
        if (options.target == null) {
          options.target = layer.element;
        }
        if (options.currentLayer == null) {
          options.currentLayer = layer;
        }
      }
      if (options.currentLayer) {
        options.currentLayer = up.layer.get(options.currentLayer);
      }
      if (u.isString(options.target)) {
        options.target = up.fragment.get(options.target, {
          layer: options.layer
        });
      } else if (!options.target) {
        options.target = document;
      }
      if ((ref = args[0]) != null ? ref.preventDefault : void 0) {
        options.event = args[0];
        if (options.log == null) {
          options.log = args[0].log;
        }
      } else if (u.isString(args[0])) {
        options.event = up.event.build(args[0], options);
      } else {
        options.event = up.event.build(options);
      }
      return new this(options);
    };

    return EventEmitter;

  })(up.Record);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.EventListener = (function(superClass) {
    extend(EventListener, superClass);

    EventListener.prototype.keys = function() {
      return ['element', 'eventType', 'selector', 'callback', 'jQuery', 'guard', 'currentLayer', 'passive'];
    };

    function EventListener(attributes) {
      this.nativeCallback = bind(this.nativeCallback, this);
      this.unbind = bind(this.unbind, this);
      EventListener.__super__.constructor.call(this, attributes);
      this.key = this.constructor.buildKey(attributes);
      this.isDefault = up.framework.isBooting();
    }

    EventListener.prototype.bind = function() {
      var base, map, ref;
      map = ((base = this.element).upEventListeners || (base.upEventListeners = {}));
      if (map[this.key]) {
        up.fail('up.on(): The %o callback %o cannot be registered more than once', this.eventType, this.callback);
      }
      map[this.key] = this;
      return (ref = this.element).addEventListener.apply(ref, this.addListenerArgs());
    };

    EventListener.prototype.addListenerArgs = function() {
      var args;
      args = [this.eventType, this.nativeCallback];
      if (this.passive && up.browser.canPassiveEventListener()) {
        args.push({
          passive: true
        });
      }
      return args;
    };

    EventListener.prototype.unbind = function() {
      var map, ref;
      if (map = this.element.upEventListeners) {
        delete map[this.key];
      }
      return (ref = this.element).removeEventListener.apply(ref, this.addListenerArgs());
    };

    EventListener.prototype.nativeCallback = function(event) {
      var applyCallback, args, data, element, elementArg, expectedArgCount;
      element = event.target;
      if (this.selector) {
        element = e.closest(element, u.evalOption(this.selector));
      }
      if (this.guard && !this.guard(event)) {
        return;
      }
      if (element) {
        elementArg = this.jQuery ? up.browser.jQuery(element) : element;
        args = [event, elementArg];
        expectedArgCount = this.callback.length;
        if (!(expectedArgCount === 1 || expectedArgCount === 2)) {
          data = up.syntax.data(element);
          args.push(data);
        }
        applyCallback = (function(_this) {
          return function() {
            return _this.callback.apply(element, args);
          };
        })(this);
        if (this.currentLayer) {
          return this.currentLayer.asCurrent(applyCallback);
        } else {
          return applyCallback();
        }
      }
    };

    EventListener.fromElement = function(attributes) {
      var key, map;
      if (map = attributes.element.upEventListeners) {
        key = this.buildKey(attributes);
        return map[key];
      }
    };

    EventListener.buildKey = function(attributes) {
      var base;
      (base = attributes.callback).upUid || (base.upUid = u.uid());
      return [attributes.eventType, attributes.selector, attributes.callback.upUid].join('|');
    };

    EventListener.unbindNonDefault = function(element) {
      var i, len, listener, listeners, map, results;
      if (map = element.upEventListeners) {
        listeners = u.values(map);
        results = [];
        for (i = 0, len = listeners.length; i < len; i++) {
          listener = listeners[i];
          if (!listener.isDefault) {
            results.push(listener.unbind());
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    return EventListener;

  })(up.Record);

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.EventListenerGroup = (function(superClass) {
    extend(EventListenerGroup, superClass);

    function EventListenerGroup() {
      return EventListenerGroup.__super__.constructor.apply(this, arguments);
    }

    EventListenerGroup.prototype.keys = function() {
      return ['elements', 'eventTypes', 'selector', 'callback', 'jQuery', 'guard', 'currentLayer', 'passive'];
    };

    EventListenerGroup.prototype.bind = function() {
      var element, eventType, i, j, len, len1, listener, ref, ref1, unbindFns;
      unbindFns = [];
      ref = this.elements;
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        ref1 = this.eventTypes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          eventType = ref1[j];
          listener = new up.EventListener(this.listenerAttributes(element, eventType));
          listener.bind();
          unbindFns.push(listener.unbind);
        }
      }
      return u.sequence(unbindFns);
    };

    EventListenerGroup.prototype.listenerAttributes = function(element, eventType) {
      return u.merge(this.attributes(), {
        element: element,
        eventType: eventType
      });
    };

    EventListenerGroup.prototype.unbind = function() {
      var element, eventType, i, len, listener, ref, results;
      ref = this.elements;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = this.eventTypes;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            eventType = ref1[j];
            if (listener = up.EventListener.fromElement(this.listenerAttributes(element, eventType))) {
              results1.push(listener.unbind());
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };


    /*
    Constructs a new up.EventListenerGroup from arguments with many different combinations:
    
        [[elements], eventTypes, [selector], [options], callback]
    
    @function up.EventListenerGroup.fromBindArgs
    @internal
     */

    EventListenerGroup.fromBindArgs = function(args, defaults) {
      var attributes, callback, elements, eventTypes, fixType, options, selector;
      args = u.copy(args);
      callback = args.pop();
      if (args[0].addEventListener) {
        elements = [args.shift()];
      } else if (u.isJQuery(args[0]) || (u.isList(args[0]) && args[0][0].addEventListener)) {
        elements = args.shift();
      } else {
        elements = [document];
      }
      eventTypes = u.splitValues(args.shift());
      if (fixType = up.legacy.fixEventType) {
        eventTypes = u.map(eventTypes, fixType);
      }
      options = u.extractOptions(args);
      selector = args[0];
      attributes = u.merge({
        elements: elements,
        eventTypes: eventTypes,
        selector: selector,
        callback: callback
      }, options, defaults);
      return new this(attributes);
    };

    return EventListenerGroup;

  })(up.Record);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.FieldObserver = (function() {
    function FieldObserver(fieldOrFields, options, callback) {
      this.callback = callback;
      this.check = bind(this.check, this);
      this.readFieldValues = bind(this.readFieldValues, this);
      this.requestCallback = bind(this.requestCallback, this);
      this.isNewValues = bind(this.isNewValues, this);
      this.scheduleValues = bind(this.scheduleValues, this);
      this.scheduleTimer = bind(this.scheduleTimer, this);
      this.cancelTimer = bind(this.cancelTimer, this);
      this.stop = bind(this.stop, this);
      this.start = bind(this.start, this);
      this.fields = e.list(fieldOrFields);
      this.delay = options.delay;
      this.batch = options.batch;
    }

    FieldObserver.prototype.start = function() {
      this.scheduledValues = null;
      this.processedValues = this.readFieldValues();
      this.currentTimer = void 0;
      this.callbackRunning = false;
      return this.unbind = up.on(this.fields, 'input change', this.check);
    };

    FieldObserver.prototype.stop = function() {
      this.unbind();
      return this.cancelTimer();
    };

    FieldObserver.prototype.cancelTimer = function() {
      clearTimeout(this.currentTimer);
      return this.currentTimer = void 0;
    };

    FieldObserver.prototype.scheduleTimer = function() {
      this.cancelTimer();
      return this.currentTimer = u.timer(this.delay, (function(_this) {
        return function() {
          _this.currentTimer = void 0;
          return _this.requestCallback();
        };
      })(this));
    };

    FieldObserver.prototype.scheduleValues = function(values) {
      this.scheduledValues = values;
      return this.scheduleTimer();
    };

    FieldObserver.prototype.isNewValues = function(values) {
      return !u.isEqual(values, this.processedValues) && !u.isEqual(this.scheduledValues, values);
    };

    FieldObserver.prototype.requestCallback = function() {
      var callbackReturnValues, callbacksDone, diff, name, value;
      if (this.scheduledValues !== null && !this.currentTimer && !this.callbackRunning) {
        diff = this.changedValues(this.processedValues, this.scheduledValues);
        this.processedValues = this.scheduledValues;
        this.scheduledValues = null;
        this.callbackRunning = true;
        callbackReturnValues = [];
        if (this.batch) {
          callbackReturnValues.push(this.callback(diff));
        } else {
          for (name in diff) {
            value = diff[name];
            callbackReturnValues.push(this.callback(value, name));
          }
        }
        callbacksDone = Promise.allSettled(callbackReturnValues);
        return callbacksDone.then((function(_this) {
          return function() {
            _this.callbackRunning = false;
            return _this.requestCallback();
          };
        })(this));
      }
    };

    FieldObserver.prototype.changedValues = function(previous, next) {
      var changes, i, key, keys, len, nextValue, previousValue;
      changes = {};
      keys = Object.keys(previous);
      keys = keys.concat(Object.keys(next));
      keys = u.uniq(keys);
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        previousValue = previous[key];
        nextValue = next[key];
        if (!u.isEqual(previousValue, nextValue)) {
          changes[key] = nextValue;
        }
      }
      return changes;
    };

    FieldObserver.prototype.readFieldValues = function() {
      return up.Params.fromFields(this.fields).toObject();
    };

    FieldObserver.prototype.check = function() {
      var values;
      values = this.readFieldValues();
      if (this.isNewValues(values)) {
        return this.scheduleValues(values);
      }
    };

    return FieldObserver;

  })();

}).call(this);
(function() {
  var PRESERVE_KEYS, e, focusedElementWithin, transferProps, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  PRESERVE_KEYS = ['selectionStart', 'selectionEnd', 'scrollLeft', 'scrollTop', 'oldElement'];

  transferProps = function(from, to) {
    return u.assign(to, u.pick(from, PRESERVE_KEYS));
  };

  focusedElementWithin = function(scopeElement) {
    var focusedElement;
    focusedElement = document.activeElement;
    if (e.isInSubtree(scopeElement, focusedElement)) {
      return focusedElement;
    }
  };

  up.FocusCapsule = (function(superClass) {
    extend(FocusCapsule, superClass);

    function FocusCapsule() {
      return FocusCapsule.__super__.constructor.apply(this, arguments);
    }

    FocusCapsule.prototype.keys = function() {
      return ['selector'].concat(PRESERVE_KEYS);
    };

    FocusCapsule.prototype.restore = function(scope, options) {
      var rediscoveredElement;
      if (this.oldElement && focusedElementWithin(this.oldElement)) {
        return;
      }
      if (rediscoveredElement = e.get(scope, this.selector)) {
        up.focus(rediscoveredElement, options);
        transferProps(this, rediscoveredElement);
        return true;
      }
    };

    FocusCapsule.preserveWithin = function(oldElement) {
      var focusedElement, plan;
      if (focusedElement = focusedElementWithin(oldElement)) {
        plan = {
          oldElement: oldElement,
          selector: up.fragment.toTarget(focusedElement)
        };
        transferProps(focusedElement, plan);
        return new this(plan);
      }
    };

    return FocusCapsule;

  })(up.Record);

}).call(this);
(function() {
  var DESCENDANT_SELECTOR;

  DESCENDANT_SELECTOR = /^([^ >+(]+) (.+)$/;

  up.FragmentFinder = (function() {
    function FragmentFinder(options) {
      this.options = options;
      this.origin = this.options.origin;
      this.selector = this.options.selector;
      this.layer = this.options.layer;
    }

    FragmentFinder.prototype.find = function() {
      return this.findAroundOrigin() || this.findInLayer();
    };

    FragmentFinder.prototype.findAroundOrigin = function() {
      if (this.origin && up.fragment.config.matchAroundOrigin && !up.element.isDetached(this.origin)) {
        return this.findClosest() || this.findInVicinity();
      }
    };

    FragmentFinder.prototype.findClosest = function() {
      return up.fragment.closest(this.origin, this.selector, this.options);
    };

    FragmentFinder.prototype.findInVicinity = function() {
      var parent, parts;
      if ((parts = this.selector.match(DESCENDANT_SELECTOR))) {
        if (parent = up.fragment.closest(this.origin, parts[1], this.options)) {
          return up.fragment.first(parent, parts[2]);
        }
      }
    };

    FragmentFinder.prototype.findInLayer = function() {
      return up.fragment.first(this.selector, this.options);
    };

    return FragmentFinder;

  })();

}).call(this);
(function() {
  var PREVENT_SCROLL_OPTIONS, e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  PREVENT_SCROLL_OPTIONS = {
    preventScroll: true
  };

  up.FragmentFocus = (function(superClass) {
    extend(FragmentFocus, superClass);

    function FragmentFocus() {
      return FragmentFocus.__super__.constructor.apply(this, arguments);
    }

    FragmentFocus.prototype.keys = function() {
      return ['fragment', 'autoMeans', 'layer', 'origin', 'focusCapsule', 'focus'];
    };

    FragmentFocus.prototype.process = function() {
      return this.tryProcess(this.focus);
    };

    FragmentFocus.prototype.tryProcess = function(focusOpt) {
      switch (focusOpt) {
        case 'keep':
          return this.restoreFocus(this.focusCapsule);
        case 'target':
          return this.focusElement(this.fragment);
        case 'layer':
          return this.focusElement(this.layer.getFocusElement());
        case 'autofocus':
          return this.autofocus();
        case 'autofocus-if-enabled':
          return up.viewport.config.autofocus && this.autofocus();
        case 'auto':
        case true:
          return u.find(this.autoMeans, (function(_this) {
            return function(autoOpt) {
              return _this.tryProcess(autoOpt);
            };
          })(this));
        default:
          if (u.isString(focusOpt)) {
            return this.focusSelector(focusOpt);
          }
          if (u.isFunction(focusOpt)) {
            return focusOpt(this.attributes());
          }
      }
    };

    FragmentFocus.prototype.focusSelector = function(selector) {
      var lookupOpts, match;
      lookupOpts = {
        layer: this.layer,
        origin: this.origin
      };
      if ((match = up.fragment.get(this.fragment, selector, lookupOpts) || up.fragment.get(selector, lookupOpts))) {
        return this.focusElement(match);
      } else {
        up.warn('up.render()', 'Tried to focus selector "%s", but no matching element found', selector);
      }
    };

    FragmentFocus.prototype.restoreFocus = function(capsule) {
      return capsule != null ? capsule.restore(this.fragment, PREVENT_SCROLL_OPTIONS) : void 0;
    };

    FragmentFocus.prototype.autofocus = function() {
      var autofocusElement;
      if (autofocusElement = e.subtree(this.fragment, '[autofocus]')[0]) {
        up.focus(autofocusElement, PREVENT_SCROLL_OPTIONS);
        return true;
      }
    };

    FragmentFocus.prototype.focusElement = function(element) {
      up.viewport.makeFocusable(element);
      up.focus(element, PREVENT_SCROLL_OPTIONS);
      return true;
    };

    return FragmentFocus;

  })(up.Record);

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.FragmentScrolling = (function(superClass) {
    extend(FragmentScrolling, superClass);

    FragmentScrolling.prototype.keys = function() {
      return ['fragment', 'autoMeans', 'hash', 'origin', 'layer', 'mode', 'revealTop', 'revealMax', 'revealSnap', 'scrollBehavior', 'scrollSpeed', 'scroll'];
    };

    function FragmentScrolling(options) {
      var base;
      if (typeof (base = up.legacy).handleScrollOptions === "function") {
        base.handleScrollOptions(options);
      }
      FragmentScrolling.__super__.constructor.call(this, options);
    }

    FragmentScrolling.prototype.process = function() {
      return this.tryProcess(this.scroll) || Promise.resolve();
    };

    FragmentScrolling.prototype.tryProcess = function(scrollOpt) {
      switch (scrollOpt) {
        case 'top':
          return this.reset();
        case 'layer':
          return this.revealLayer();
        case 'layer-if-main':
          if (this.shouldAutoScroll()) {
            return this.revealLayer();
          } else {
            up.puts('up.render()', "Will not auto-scroll because fragment doesn't match up.fragment.config.autoScrollTargets");
            return void 0;
          }
          break;
        case 'restore':
          return this.restore();
        case 'hash':
          return this.hash && up.viewport.revealHash(this.hash, this.attributes());
        case 'target':
        case 'reveal':
          return this.revealElement(this.fragment);
        case 'auto':
        case true:
          return u.find(this.autoMeans, (function(_this) {
            return function(autoOpt) {
              return _this.tryProcess(autoOpt);
            };
          })(this));
        default:
          if (u.isString(scrollOpt)) {
            return this.revealSelector(scrollOpt);
          }
          if (u.isFunction(scrollOpt)) {
            return scrollOpt(this.attributes());
          }
      }
    };

    FragmentScrolling.prototype.revealSelector = function(selector) {
      var getFragmentOpts, match;
      getFragmentOpts = {
        layer: this.layer,
        origin: this.origin
      };
      if ((match = up.fragment.get(this.fragment, selector, getFragmentOpts) || up.fragment.get(selector, getFragmentOpts))) {
        return this.revealElement(match);
      } else {
        up.warn('up.render()', 'Tried to reveal selector "%s", but no matching element found', selector);
      }
    };

    FragmentScrolling.prototype.reset = function() {
      return up.viewport.resetScroll(u.merge(this.attributes(), {
        around: this.fragment
      }));
    };

    FragmentScrolling.prototype.shouldAutoScroll = function() {
      return up.fragment.shouldAutoScroll(this.fragment, {
        layer: this.layer,
        mode: this.mode
      });
    };

    FragmentScrolling.prototype.restore = function() {
      return up.viewport.restoreScroll(u.merge(this.attributes(), {
        around: this.fragment
      }));
    };

    FragmentScrolling.prototype.revealLayer = function() {
      return this.revealElement(this.layer.getBoxElement());
    };

    FragmentScrolling.prototype.revealElement = function(element) {
      return up.reveal(element, this.attributes());
    };

    return FragmentScrolling;

  })(up.Record);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.HTMLWrapper = (function() {
    function HTMLWrapper(tagName, options) {
      var closeTag, innerHTML, openTag;
      this.tagName = tagName;
      if (options == null) {
        options = {};
      }
      this.wrapMatch = bind(this.wrapMatch, this);
      openTag = "<" + this.tagName + "[^>]*>";
      closeTag = "<\/" + this.tagName + ">";
      innerHTML = "(.|\\s)*?";
      this.pattern = new RegExp(openTag + innerHTML + closeTag, 'ig');
      this.attrName = "up-wrapped-" + this.tagName;
    }

    HTMLWrapper.prototype.strip = function(html) {
      return html.replace(this.pattern, '');
    };

    HTMLWrapper.prototype.wrap = function(html) {
      return html.replace(this.pattern, this.wrapMatch);
    };

    HTMLWrapper.prototype.wrapMatch = function(match) {
      this.didWrap = true;
      return "<div " + this.attrName + "='" + (u.escapeHTML(match)) + "'></div>";
    };

    HTMLWrapper.prototype.unwrap = function(element) {
      var i, len, originalHTML, ref, restoredElement, results, wrappedChild;
      if (!this.didWrap) {
        return;
      }
      ref = element.querySelectorAll("[" + this.attrName + "]");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        wrappedChild = ref[i];
        originalHTML = wrappedChild.getAttribute(this.attrName);
        restoredElement = e.createFromHTML(originalHTML);
        results.push(e.replace(wrappedChild, restoredElement));
      }
      return results;
    };

    return HTMLWrapper;

  })();

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  e = up.element;

  u = up.util;


  /***
  Each layer has an `up.Layer` instance.
  
  Most functions in the `up.layer` (lowercase) package interact with the [current layer](/up.layer.current).
  E.g. `up.layer.dismiss()` is a shortcut for `up.layer.current.dismiss()`.
  
  @class up.Layer
   */

  up.Layer = (function(superClass) {
    extend(Layer, superClass);


    /***
    This layer's outmost element.
    
    \#\#\# Example
    
        let rootLayer = up.layer.root
        let overlay = await up.layer.open()
    
        rootLayer.element // returns <body>
        overlay.element   // returns <up-modal>
    
    @property up.Layer#element
    @return {Element}
    @stable
     */


    /***
    This layer's mode which governs its appearance and behavior.
    
    Available layer modes are:
    
    - `'root'`
    - `'modal'`
    - `'popup'`
    - `'drawer'`
    - `'cover'`
    
    @property up.Layer#mode
    @return {string}
    @stable
     */


    /***
    Whether fragment updates within this layer will affect browser history and window title.
    
    @property up.Layer#history
    @return {boolean}
     */


    /***
    This layer's context object.
    
    Think of *context* as [session storage](/https://makandracards.com/makandra/32865), but specific to a [layer](/up.layer)
    rather than specific to an entire browser tab.
    
    You may access the context object's properties like a regular JavaScript object.
    
    \#\#\# Example
    
        let layer = up.layer.current
        layer.context.message = 'Please select a contact'
        console.log(layer.context) // logs "{ message: 'Please select a contact' }"
    
    \#\#\# Accessing the context from the server
    
    The context is is sent as an `X-Up-Context` header along with every
    [request](/up.request) to the server. The server may also update the updating
    layer's context by including an `X-Up-Context` header in its response.
    
    @property up.Layer#context
    @return {Object}
    @stable
     */


    /***
    Whether fragment updates within this layer will affect [browser history](/up.history).
    
    If a layer does not affect history, its desendant layers cannot affect history either.
    
    @property up.Layer#history
    @return {boolean}
    @stable
     */

    Layer.prototype.keys = function() {
      return ['element', 'stack', 'history', 'mode', 'context', 'lastScrollTops'];
    };

    Layer.prototype.defaults = function() {
      return {
        context: {},
        lastScrollTops: new up.Cache({
          size: 30,
          key: up.history.normalizeURL
        })
      };
    };

    function Layer(options) {
      if (options == null) {
        options = {};
      }
      this.containsEventTarget = bind(this.containsEventTarget, this);
      this.contains = bind(this.contains, this);
      Layer.__super__.constructor.call(this, options);
      if (!this.mode) {
        throw "missing { mode } option";
      }
    }

    Layer.prototype.setupHandlers = function() {
      return up.link.convertClicks(this);
    };

    Layer.prototype.teardownHandlers = function() {};

    Layer.prototype.mainTargets = function() {
      return up.layer.mainTargets(this.mode);
    };


    /***
    Synchronizes this layer with the rest of the page.
    
    For instance, a popup overlay will re-calculate its position arounds its anchoring element.
    
    You only need to call this method after DOM changes unknown to Unpoly have brought
    overlays out of alignment with the resr of the page.
    
    @function up.Layer#sync
    @experimental
     */

    Layer.prototype.sync = function() {};


    /***
    Closes this overlay with an accepting intent, e.g. when a change was confirmed or when a value was selected.
    
    To dismiss a layer without an accepting intent, use `up.Layer#dismiss()` instead.
    
    @function up.Layer#accept
    @param {any} value
      The acceptance value that will be passed to `{ onAccepted }` callbacks.
    @param {string|Function(Element, Object)} options.animation
      The [animation](/up.animate) to use for closing this layer.
    
      Defaults to the close animation configured for this layer mode.
    @param {number} options.duration
      The duration for the close animation in milliseconds.
    @param {number} options.easing
      The [timing function]((http://www.w3.org/TR/css3-transitions/#transition-timing-function))
      that controls the acceleration of the close animation.
    @param {Function} [options.onFinished]
      A callback that will run when the elements have been removed from the DOM.
    
      If the layer has a close animation, the callback will run after the animation has finished.
    @return {Promise}
      A promise that fulfills when this layer was removed from the [layer stack](/up.layer.stack).
    
      If the layer has a close animation, the animation will play out *after* the promise fulfills.
    @stable
     */

    Layer.prototype.accept = function() {
      throw up.error.notImplemented();
    };


    /***
    Closes this overlay without an accepting intent, e.g. when a "Cancel" button was clicked.
    
    To close an overlay with an accepting intent, use `up.Layer#accept()` instead.
    
    @function up.Layer#dismiss
    @param {any} value
      The acceptance value that will be passed to `{ onDismissed }` callbacks.
    @param {Object} options
      See options for `up.Layer#accept()`.
    @return {Promise}
      A promise that fulfills when this layer was removed from the [layer stack](/up.layer.stack).
    
      If the closing is animated, the animation will play out *after* the promise fulfills.
    @stable
     */

    Layer.prototype.dismiss = function() {
      throw up.error.notImplemented();
    };


    /***
    [Dismisses](/up.Layer#dismiss) all descendant overlays,
    making this layer the [frontmost layer](/up.layer.front) in the [layer stack](/up.layer.stack).
    
    Descendant overlays will be dismissed with value `':peel'`.
    
    @param {Object} options
      See options for `up.Layer#accept()`.
    @return {Promise}
      A promise that fulfills when descendant overlays were dismissed.
    @stable
     */

    Layer.prototype.peel = function(options) {
      return this.stack.peel(this, options);
    };

    Layer.prototype.evalOption = function(option) {
      return u.evalOption(option, this);
    };


    /***
    Returns whether this layer is the [current layer](/up.layer.current).
    
    @function up.Layer#isCurrent
    @return {boolean}
    @stable
     */

    Layer.prototype.isCurrent = function() {
      return this.stack.isCurrent(this);
    };


    /***
    Returns whether this layer is the [frontmost layer](/up.layer.front).
    
    @function up.Layer#isFront
    @return {boolean}
    @stable
     */

    Layer.prototype.isFront = function() {
      return this.stack.isFront(this);
    };


    /***
    Returns whether this layer is the [root layer](/up.layer.root).
    
    @function up.Layer#isFront
    @return {boolean}
    @stable
     */

    Layer.prototype.isRoot = function() {
      return this.stack.isRoot(this);
    };


    /***
    Returns whether this layer is *not* the [root layer](/up.layer.root).
    
    @function up.Layer#isRoot
    @return {boolean}
    @stable
     */

    Layer.prototype.isOverlay = function() {
      return this.stack.isOverlay(this);
    };


    /***
    Returns whether this layer is still part of the [layer stack](/up.layer.stack).
    
    A layer is considered "closed" immediately after it has been [dismissed](/up.Layer.prototype.dismiss)
    or [accepted](/up.Layer.prototype.dismiss) If the closing is animated, a layer may be considered "closed" while
    closing animation is still playing.
    
    @function up.Layer#isOpen
    @return {boolean}
    @stable
     */

    Layer.prototype.isOpen = function() {
      return this.stack.isOpen(this);
    };


    /***
    Returns whether this layer is no longer part of the [layer stack](/up.layer.stack).
    
    A layer is considered "closed" immediately after it has been [dismissed](/up.Layer.prototype.dismiss)
    or [accepted](/up.Layer.prototype.dismiss) If the closing is animated, a layer may be considered "closed" while
    closing animation is still playing.
    
    @function up.Layer#isClosed
    @return {boolean}
    @stable
     */

    Layer.prototype.isClosed = function() {
      return this.stack.isClosed(this);
    };


    /***
    Returns this layer's parent layer.
    
    The parent layer is the layer that opened this layer. It is visually in the background of this layer.
    
    Returns `undefined` for the [root layer](/up.layer.root).
    
    @property up.Layer#parent
    @return {boolean}
    @stable
     */

    Layer.getter('parent', function() {
      return this.stack.parentOf(this);
    });


    /***
    Returns this layer's child layer.
    
    The child layer is the layer that was opened on top of this layer. It visually overlays this layer.
    
    Returns `undefined` if this layer has not opened a child layer.
    
    A layer can have at most one child layer. Opening an overlay on a layer with an exiisting child will
    first dismiss the existing child before replacing it with the new child.
    
    @property up.Layer#child
    @return {boolean}
    @stable
     */

    Layer.getter('child', function() {
      return this.stack.childOf(this);
    });


    /***
    Returns an array of this layer's ancestor layers.
    
    @property up.Layer#ancestors
    @return {boolean}
    @stable
     */

    Layer.getter('ancestors', function() {
      return this.stack.ancestorsOf(this);
    });


    /***
    Returns an array of this layer's descendant layers, with the closest descendants listed first.
    
    Descendant layers are all layers that visually overlay this layer.
    
    @property up.Layer#descendants
    @return {boolean}
    @stable
     */

    Layer.getter('descendants', function() {
      return this.stack.descendantsOf(this);
    });


    /***
    Returns the zero-based position of this layer in the [layer stack](/up.layer.stack).
    
    The [root layer](/up.layer.root) has an index of `0`, its child overlay has an index of `1`, and so on.
    
    @property up.Layer#index
    @return {boolean}
    @stable
     */

    Layer.getter('index', function() {
      return this.stack.indexOf(this);
    });

    Layer.prototype.getContentElement = function() {
      return this.contentElement || this.element;
    };

    Layer.prototype.getBoxElement = function() {
      return this.boxElement || this.element;
    };

    Layer.prototype.getFocusElement = function() {
      return this.getBoxElement();
    };

    Layer.prototype.getFirstSwappableElement = function() {
      throw up.error.notImplemented();
    };


    /***
    Returns whether the given `element` is contained by this layer.
    
    Note that this will always return `false` for elements in [descendant](/up.Layer.prototype.descendants) overlays,
    even if the descendant overlay's element is nested into the DOM tree of this layer.
    
    @function up.Layer#contains
    @param {Element} element
    @return {boolean}
    @stable
     */

    Layer.prototype.contains = function(element) {
      return e.closest(element, up.layer.anySelector()) === this.element;
    };


    /***
    Listens to a ([DOM event](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events) that originated
    on an element [contained](/up.Layer.prototype.contains) by this layer.
    
    This will ignore events emitted on elements in [descendant](/up.Layer.prototype.descendants) overlays,
    even if the descendant overlay's element is nested into the DOM tree of this layer.
    
    The arguments for this function are the same as for `up.on()`.
    
    \#\#\# Example
    
        let rootLayer = up.layer.root
        let overlay = await up.layer.open()
    
        rootLayer.on('foo', (event) => console.log('Listener called'))
    
        rootLayer.emit('foo') // logs "Listener called"
        overlay.emit('foo')   // listener is not called
    
    \#\#\# Most Unpoly events have a layer reference
    
    Whenever possible Unpoly will emit its events on associated layers instead of `document`.
    This way you can listen to events on one layer without receiving events from other layers.
    
    E.g. to listen to all [requests](/up.request) originating from a given layer:
    
        let rootLayer = up.layer.root
        let rootLink = rootLayer.affix('a[href=/foo]')
    
        let overlay = await up.layer.open()
        let overlayLink = overlay.affix('a[href=/bar]')
    
        rootLayer.on('up:request:load', (event) => console.log('Listener called'))
    
        up.follow(rootLink)    // logs "Listener called"
        up.follow(overlayLink) // listener is not called
    
    @function up.Layer#on
    @param {string} types
      A space-separated list of event types to bind to.
    @param {string} [selector]
      The selector of an element on which the event must be triggered.
    
      Omit the selector to listen to all events of the given type, regardless
      of the event target.
    @param {boolean} [options.passive=false]
      Whether to register a [passive event listener](https://developers.google.com/web/updates/2016/06/passive-event-listeners).
    
      A passive event listener may not call `event.preventDefault()`.
      This in particular may improve the frame rate when registering
      `touchstart` and `touchmove` events.
    @param {Function(event, [element], [data])} listener
      The listener function that should be called.
    
      The function takes the affected element as the second argument.
      If the element has an [`up-data`](/up-data) attribute, its value is parsed as JSON
      and passed as a third argument.
    @return {Function()}
      A function that unbinds the event listeners when called.
    @stable
     */

    Layer.prototype.on = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.buildEventListenerGroup(args).bind();
    };


    /***
    Unbinds an event listener previously bound with `up.Layer#on()`.
    
    @function up.Layer#off
    @param {Element|jQuery} [element=document]
    @param {string} events
    @param {string} [selector]
    @param {Function(event, [element], [data])} listener
      The listener function to unbind.
    
      Note that you must pass a reference to the exact same listener function
      that was passed to `up.Layer#on()` earlier.
    @stable
     */

    Layer.prototype.off = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.buildEventListenerGroup(args).unbind();
    };

    Layer.prototype.buildEventListenerGroup = function(args) {
      return up.EventListenerGroup.fromBindArgs(args, {
        guard: this.containsEventTarget,
        elements: [this.element],
        currentLayer: this
      });
    };

    Layer.prototype.containsEventTarget = function(event) {
      return this.contains(event.target);
    };

    Layer.prototype.wasHitByMouseEvent = function(event) {
      var hittableElement;
      hittableElement = document.elementFromPoint(event.clientX, event.clientY);
      return !hittableElement || this.contains(hittableElement);
    };

    Layer.prototype.buildEventEmitter = function(args) {
      return up.EventEmitter.fromEmitArgs(args, {
        layer: this
      });
    };


    /***
    [Emits](/up.emit) an event on [this layer's element](/up.Layer#element).
    
    The value of [up.layer.current](/up.layer.current) will be set to the this layer
    while event listeners are running.
    
    \#\#\# Example
    
        let rootLayer = up.layer.root
        let overlay = await up.layer.open()
    
        rootLayer.on('foo', (event) => console.log('Listener called'))
    
        rootLayer.emit('foo') // logs "Listener called"
        overlay.emit('foo')   // listener is not called
    
    @function up.Layer#emit
    @param {Element|jQuery} [target=this.element]
      The element on which the event is triggered.
    
      If omitted, the event will be emitted on the [this layer's element](/up.Layer#element).
    @param {string} eventType
      The event type, e.g. `my:event`.
    @param {Object} [props={}]
      A list of properties to become part of the event object that will be passed to listeners.
    @param {string|Array} [props.log]
      A message to print to the [log](/up.log) when the event is emitted.
    
      Pass `false` to not log this event emission.
    @param {Element|jQuery} [props.target=this.element]
      The element on which the event is triggered.
    
      Alternatively the target element may be passed as the first argument.
    @stable
     */

    Layer.prototype.emit = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.buildEventEmitter(args).emit();
    };

    Layer.prototype.whenEmitted = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.buildEventEmitter(args).whenEmitted();
    };

    Layer.prototype.isDetached = function() {
      return e.isDetached(this.element);
    };

    Layer.prototype.saveHistory = function() {
      if (!this.hasHistory()) {
        return;
      }
      this.savedTitle = document.title;
      return this.savedLocation = up.history.location;
    };

    Layer.prototype.restoreHistory = function() {
      if (this.savedLocation) {
        up.history.push(this.savedLocation);
        this.savedLocation = null;
      }
      if (this.savedTitle) {
        document.title = this.savedTitle;
        return this.savedTitle = null;
      }
    };


    /***
    Temporarily changes the [current layer](/up.layer.current) while the given
    function is running.
    
    Calls the given function and restores the original current layer when the function
    terminates.
    
    @param {Function()} fn
      The synchronous function to call.
    
      Async functions are not supported.
    @function up.Layer#asCurrent
    @experimental
     */

    Layer.prototype.asCurrent = function(fn) {
      return this.stack.asCurrent(this, fn);
    };

    Layer.prototype.updateHistory = function(options) {
      if (options.history === false) {
        return;
      }
      if (u.isString(options.title)) {
        this.title = options.title;
      }
      if (u.isString(options.location)) {
        return this.location = options.location;
      }
    };


    /***
    This layer's window title.
    
    If this layer does not [affect browser history](/up.Layer#history), this property will
    still return the string the layer would otherwise use.
    
    When this layer opens a child layer with history, the browser window will change to the child
    layer's title. When the child layer is closed, this layer's title will be restored.
    
    @property up.Layer#title
    @param {string} title
    @experimental
     */

    Layer.accessor('title', {
      get: function() {
        if (this.hasLiveHistory()) {
          return document.title;
        } else {
          return this.savedTitle;
        }
      },
      set: function(title) {
        this.savedTitle = title;
        if (this.hasLiveHistory()) {
          return document.title = title;
        }
      }
    });


    /***
    This layer's URL for the browser's address bar.
    
    If this layer does not [affect browser history](/up.Layer#history), this property will
    still return the URL the layer would otherwise use.
    
    When this layer opens a child layer with history, the browser URL will change to the child
    layer's location. When the child layer is closed, this layer's laytion will be restored.
    
    @property up.Layer#title
    @param {string} title
    @experimental
     */

    Layer.accessor('location', {
      get: function() {
        if (this.hasLiveHistory()) {
          return up.history.location;
        } else {
          return this.savedLocation;
        }
      },
      set: function(location) {
        var previousLocation;
        previousLocation = this.savedLocation;
        location = up.history.normalizeURL(location);
        if (previousLocation !== location) {
          this.savedLocation = location;
          this.emit('up:layer:location:changed', {
            location: location,
            log: false
          });
          if (this.hasLiveHistory()) {
            return up.history.push(location);
          }
        }
      }
    });

    Layer.prototype.hasHistory = function() {
      var history, parent;
      history = this.history;
      if (parent = this.parent) {
        history &= parent.hasHistory();
      }
      return history;
    };

    Layer.prototype.hasLiveHistory = function() {
      return this.hasHistory() && this.isFront() && (up.history.config.enabled || this.isRoot());
    };

    Layer.prototype.selector = function(part) {
      return this.constructor.selector(part);
    };

    Layer.selector = function(part) {
      throw up.error.notImplemented();
    };

    Layer.prototype.toString = function() {
      return this.mode + " layer";
    };

    Layer.prototype.affix = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return e.affix.apply(e, [this.getFirstSwappableElement()].concat(slice.call(args)));
    };

    return Layer;

  })(up.Record);

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  e = up.element;

  u = up.util;


  /***
  @class up.Layer
   */

  up.Layer.Overlay = (function(superClass) {
    extend(Overlay, superClass);


    /***
    The link or form element that opened this overlay.
    
    @property up.Layer#origin
    @return {Element}
    @stable
     */

    Overlay.prototype.keys = function() {
      return Overlay.__super__.keys.call(this).concat(['position', 'align', 'size', 'origin', 'class', 'backdrop', 'openAnimation', 'closeAnimation', 'openDuration', 'closeDuration', 'openEasing', 'closeEasing', 'backdropOpenAnimation', 'backdropCloseAnimation', 'buttonDismissable', 'keyDismissable', 'outsideDismissable', 'dismissLabel', 'dismissAriaLabel', 'onOpened', 'onAccept', 'onAccepted', 'onDismiss', 'onDismissed', 'acceptEvent', 'dismissEvent', 'acceptLocation', 'dismissLocation']);
    };

    Overlay.prototype.defaults = function(options) {
      return u.merge(Overlay.__super__.defaults.call(this, options), {
        buttonDismissable: options.dismissable,
        keyDismissable: options.dismissable,
        outsideDismissable: options.dismissable
      });
    };

    function Overlay(options) {
      Overlay.__super__.constructor.call(this, options);
      if (this.acceptLocation) {
        this.acceptLocation = new up.URLPattern(this.acceptLocation);
      }
      if (this.dismissLocation) {
        this.dismissLocation = new up.URLPattern(this.dismissLocation);
      }
    }

    Overlay.prototype.callback = function(name) {
      var fn;
      if (fn = this[name]) {
        return fn.bind(this);
      }
    };

    Overlay.prototype.createElement = function(parentElement) {
      var elementAttrs;
      this.nesting || (this.nesting = this.suggestVisualNesting());
      elementAttrs = u.compactObject({
        align: this.align,
        position: this.position,
        size: this.size,
        "class": this["class"],
        nesting: this.nesting
      });
      return this.element = this.affixPart(parentElement, null, elementAttrs);
    };

    Overlay.prototype.createBackdropElement = function(parentElement) {
      return this.backdropElement = this.affixPart(parentElement, 'backdrop');
    };

    Overlay.prototype.createViewportElement = function(parentElement) {
      return this.viewportElement = this.affixPart(parentElement, 'viewport', {
        'up-viewport': ''
      });
    };

    Overlay.prototype.createBoxElement = function(parentElement) {
      return this.boxElement = this.affixPart(parentElement, 'box');
    };

    Overlay.prototype.createContentElement = function(parentElement, content) {
      this.contentElement = this.affixPart(parentElement, 'content');
      return this.contentElement.appendChild(content);
    };

    Overlay.prototype.createDismissElement = function(parentElement) {
      this.dismissElement = this.affixPart(parentElement, 'dismiss', {
        'up-dismiss': '":button"',
        'aria-label': this.dismissAriaLabel
      });
      return e.affix(this.dismissElement, 'span[aria-hidden="true"]', {
        text: this.dismissLabel
      });
    };

    Overlay.prototype.affixPart = function(parentElement, part, options) {
      if (options == null) {
        options = {};
      }
      return e.affix(parentElement, this.selector(part), options);
    };

    Overlay.selector = function(part) {
      return u.compact(['up', this.mode, part]).join('-');
    };

    Overlay.prototype.suggestVisualNesting = function() {
      var parent;
      parent = this.parent;
      if (this.mode === parent.mode) {
        return 1 + parent.suggestVisualNesting();
      } else {
        return 0;
      }
    };

    Overlay.prototype.setupHandlers = function() {
      var base;
      Overlay.__super__.setupHandlers.call(this);
      this.overlayFocus = new up.OverlayFocus(this);
      if (this.buttonDismissable) {
        this.createDismissElement(this.getBoxElement());
      }
      if (this.outsideDismissable) {
        this.unbindParentClicked = this.parent.on('up:click', (function(_this) {
          return function(event, element) {
            var originClicked;
            originClicked = _this.origin && _this.origin.contains(element);
            return _this.onOutsideClicked(event, originClicked);
          };
        })(this));
        if (this.viewportElement) {
          up.on(this.viewportElement, 'up:click', (function(_this) {
            return function(event) {
              if (event.target === _this.viewportElement) {
                return _this.onOutsideClicked(event, true);
              }
            };
          })(this));
        }
      }
      if (this.keyDismissable) {
        this.unbindEscapePressed = up.event.onEscape((function(_this) {
          return function(event) {
            return _this.onEscapePressed(event);
          };
        })(this));
      }
      this.registerClickCloser('up-accept', (function(_this) {
        return function(value, closeOptions) {
          return _this.accept(value, closeOptions);
        };
      })(this));
      this.registerClickCloser('up-dismiss', (function(_this) {
        return function(value, closeOptions) {
          return _this.dismiss(value, closeOptions);
        };
      })(this));
      if (typeof (base = up.legacy).registerLayerCloser === "function") {
        base.registerLayerCloser(this);
      }
      this.registerEventCloser(this.acceptEvent, this.accept);
      return this.registerEventCloser(this.dismissEvent, this.dismiss);
    };

    Overlay.prototype.onOutsideClicked = function(event, halt) {
      if (halt) {
        up.event.halt(event);
      }
      return up.log.muteRejection(this.dismiss(':outside'));
    };

    Overlay.prototype.onEscapePressed = function(event) {
      var field;
      if (this.isFront()) {
        if (field = up.form.focusedField()) {
          return field.blur();
        } else if (this.keyDismissable) {
          up.event.halt(event);
          return up.log.muteRejection(this.dismiss(':key'));
        }
      }
    };

    Overlay.prototype.registerClickCloser = function(attribute, closeFn) {
      return this.on('up:click', "[" + attribute + "]", function(event) {
        var closeOptions, origin, parser, value;
        up.event.halt(event);
        origin = event.target;
        value = e.jsonAttr(origin, attribute);
        closeOptions = {
          origin: origin
        };
        parser = new up.OptionsParser(closeOptions, origin);
        parser.booleanOrString('animation');
        parser.string('easing');
        parser.number('duration');
        return up.log.muteRejection(closeFn(value, closeOptions));
      });
    };

    Overlay.prototype.registerEventCloser = function(eventTypes, closeFn) {
      if (!eventTypes) {
        return;
      }
      return this.on(eventTypes, (function(_this) {
        return function(event) {
          event.preventDefault();
          return closeFn.call(_this, event);
        };
      })(this));
    };

    Overlay.prototype.tryAcceptForLocation = function() {
      return this.tryCloseForLocation(this.acceptLocation, this.accept);
    };

    Overlay.prototype.tryDismissForLocation = function() {
      return this.tryCloseForLocation(this.dismissLocation, this.dismiss);
    };

    Overlay.prototype.tryCloseForLocation = function(urlPattern, closeFn) {
      var closeValue, location, resolution;
      if (urlPattern && (location = this.location) && (resolution = urlPattern.recognize(location))) {
        closeValue = u.merge(resolution, {
          location: location
        });
        return closeFn.call(this, closeValue);
      }
    };

    Overlay.prototype.teardownHandlers = function() {
      Overlay.__super__.teardownHandlers.call(this);
      if (typeof this.unbindParentClicked === "function") {
        this.unbindParentClicked();
      }
      if (typeof this.unbindEscapePressed === "function") {
        this.unbindEscapePressed();
      }
      return this.overlayFocus.teardown();
    };


    /***
    Destroys the elements that make up this overlay.
    
    @function up.Layer.prototype.destroyElements
    @param {string|Function(Element, Object)} [options.animation=this.closeAnimation]
    @param {number} [options.duration=this.closeDuration]
    @param {string} [options.easing=this.closeEasing]
    @param {Function} [options.onFinished]
      A callback that will run when the elements have been removed from the DOM.
      If the destruction is animated, the callback will run after the animation has finished.
    @return {Promise}
      A resolved promise.
    @private
     */

    Overlay.prototype.destroyElements = function(options) {
      var animation, destroyOptions, onFinished;
      animation = (function(_this) {
        return function() {
          return _this.startCloseAnimation(options);
        };
      })(this);
      onFinished = (function(_this) {
        return function() {
          _this.onElementsRemoved();
          return typeof options.onFinished === "function" ? options.onFinished() : void 0;
        };
      })(this);
      destroyOptions = u.merge(options, {
        animation: animation,
        onFinished: onFinished,
        log: false
      });
      return up.destroy(this.element, destroyOptions);
    };

    Overlay.prototype.onElementsRemoved = function() {};

    Overlay.prototype.startAnimation = function(options) {
      var backdropDone, boxDone;
      if (options == null) {
        options = {};
      }
      boxDone = up.animate(this.getBoxElement(), options.boxAnimation, options);
      if (this.backdrop && !up.motion.isNone(options.boxAnimation)) {
        backdropDone = up.animate(this.backdropElement, options.backdropAnimation, options);
      }
      return Promise.all([boxDone, backdropDone]);
    };

    Overlay.prototype.startOpenAnimation = function(options) {
      var ref;
      if (options == null) {
        options = {};
      }
      return this.startAnimation({
        boxAnimation: (ref = options.animation) != null ? ref : this.evalOption(this.openAnimation),
        backdropAnimation: 'fade-in',
        easing: options.easing || this.openEasing,
        duration: options.duration || this.openDuration
      }).then((function(_this) {
        return function() {
          return _this.wasEverVisible = true;
        };
      })(this));
    };

    Overlay.prototype.startCloseAnimation = function(options) {
      var boxAnimation, ref;
      if (options == null) {
        options = {};
      }
      boxAnimation = this.wasEverVisible && ((ref = options.animation) != null ? ref : this.evalOption(this.closeAnimation));
      return this.startAnimation({
        boxAnimation: boxAnimation,
        backdropAnimation: 'fade-out',
        easing: options.easing || this.closeEasing,
        duration: options.duration || this.closeDuration
      });
    };

    Overlay.prototype.accept = function(value, options) {
      if (value == null) {
        value = null;
      }
      if (options == null) {
        options = {};
      }
      return this.executeCloseChange('accept', value, options);
    };

    Overlay.prototype.dismiss = function(value, options) {
      if (value == null) {
        value = null;
      }
      if (options == null) {
        options = {};
      }
      return this.executeCloseChange('dismiss', value, options);
    };

    Overlay.prototype.executeCloseChange = function(verb, value, options) {
      options = u.merge(options, {
        verb: verb,
        value: value,
        layer: this
      });
      return new up.Change.CloseLayer(options).executeAsync();
    };

    Overlay.prototype.getFirstSwappableElement = function() {
      return this.getContentElement().children[0];
    };

    return Overlay;

  })(up.Layer);

}).call(this);
(function() {
  var e,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  e = up.element;

  up.Layer.OverlayWithViewport = (function(superClass) {
    extend(OverlayWithViewport, superClass);

    function OverlayWithViewport() {
      return OverlayWithViewport.__super__.constructor.apply(this, arguments);
    }

    OverlayWithViewport.bodyShifter = new up.BodyShifter();

    OverlayWithViewport.getParentElement = function() {
      return document.body;
    };


    /***
    @function up.Layer.OverlayWithViewport#openNow
    @param {Element} options.content
     */

    OverlayWithViewport.prototype.createElements = function(content) {
      this.shiftBody();
      this.createElement(this.constructor.getParentElement());
      if (this.backdrop) {
        this.createBackdropElement(this.element);
      }
      this.createViewportElement(this.element);
      this.createBoxElement(this.viewportElement);
      return this.createContentElement(this.boxElement, content);
    };

    OverlayWithViewport.prototype.onElementsRemoved = function() {
      return this.unshiftBody();
    };

    OverlayWithViewport.prototype.shiftBody = function() {
      return this.constructor.bodyShifter.shift();
    };

    OverlayWithViewport.prototype.unshiftBody = function() {
      return this.constructor.bodyShifter.unshift();
    };

    OverlayWithViewport.prototype.sync = function() {
      if (this.isDetached() && this.isOpen()) {
        return this.constructor.getParentElement().appendChild(this.element);
      }
    };

    return OverlayWithViewport;

  })(up.Layer.Overlay);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  up.Layer.Cover = (function(superClass) {
    extend(Cover, superClass);

    function Cover() {
      return Cover.__super__.constructor.apply(this, arguments);
    }

    Cover.mode = 'cover';

    return Cover;

  })(up.Layer.OverlayWithViewport);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  up.Layer.Drawer = (function(superClass) {
    extend(Drawer, superClass);

    function Drawer() {
      return Drawer.__super__.constructor.apply(this, arguments);
    }

    Drawer.mode = 'drawer';

    return Drawer;

  })(up.Layer.OverlayWithViewport);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  up.Layer.Modal = (function(superClass) {
    extend(Modal, superClass);

    function Modal() {
      return Modal.__super__.constructor.apply(this, arguments);
    }

    Modal.mode = 'modal';

    return Modal;

  })(up.Layer.OverlayWithViewport);

}).call(this);
(function() {
  var e,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  e = up.element;

  up.Layer.OverlayWithTether = (function(superClass) {
    extend(OverlayWithTether, superClass);

    function OverlayWithTether() {
      return OverlayWithTether.__super__.constructor.apply(this, arguments);
    }

    OverlayWithTether.prototype.createElements = function(content) {
      if (!this.origin) {
        up.fail('Missing { origin } option');
      }
      this.tether = new up.Tether({
        anchor: this.origin,
        align: this.align,
        position: this.position
      });
      this.createElement(this.tether.parent);
      this.createContentElement(this.element, content);
      return this.tether.start(this.element);
    };

    OverlayWithTether.prototype.onElementsRemoved = function() {
      return this.tether.stop();
    };

    OverlayWithTether.prototype.sync = function() {
      if (this.isOpen()) {
        if (this.isDetached() || this.tether.isDetached()) {
          return this.dismiss(':detached', {
            animation: false,
            preventable: false
          });
        } else {
          return this.tether.sync();
        }
      }
    };

    return OverlayWithTether;

  })(up.Layer.Overlay);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  up.Layer.Popup = (function(superClass) {
    extend(Popup, superClass);

    function Popup() {
      return Popup.__super__.constructor.apply(this, arguments);
    }

    Popup.mode = 'popup';

    return Popup;

  })(up.Layer.OverlayWithTether);

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;

  up.Layer.Root = (function(superClass) {
    extend(Root, superClass);

    Root.mode = 'root';

    function Root(options) {
      Root.__super__.constructor.call(this, options);
      this.setupHandlers();
    }

    Root.getter('element', function() {
      return e.root;
    });

    Root.prototype.getFirstSwappableElement = function() {
      return document.body;
    };

    Root.selector = function() {
      return 'html';
    };

    Root.prototype.setupHandlers = function() {
      if (!this.element.upHandlersApplied) {
        this.element.upHandlersApplied = true;
        return Root.__super__.setupHandlers.call(this);
      }
    };

    Root.prototype.sync = function() {
      return this.setupHandlers();
    };

    Root.prototype.accept = function() {
      return this.cannotClosePromise();
    };

    Root.prototype.dismiss = function() {
      return this.cannotClosePromise();
    };

    Root.prototype.cannotClosePromise = function() {
      return up.error.failed.async('Cannot close the root layer');
    };

    Root.prototype.reset = function() {
      return u.assign(this, this.defaults());
    };

    return Root;

  })(up.Layer);

}).call(this);
(function() {
  var e, u,
    slice = [].slice;

  u = up.util;

  e = up.element;

  up.LayerLookup = (function() {
    function LayerLookup() {
      var args, options, recursiveOptions, stack;
      stack = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.stack = stack;
      options = u.parseArgIntoOptions(args, 'layer');
      if (options.normalizeLayerOptions !== false) {
        up.layer.normalizeOptions(options);
      }
      this.values = u.splitValues(options.layer);
      this.origin = options.origin;
      this.currentLayer = options.currentLayer || this.stack.current;
      if (u.isString(this.currentLayer)) {
        recursiveOptions = u.merge(options, {
          currentLayer: this.stack.current,
          normalizeLayerOptions: false
        });
        this.currentLayer = new this.constructor(this.stack, this.currentLayer, recursiveOptions).first();
      }
    }

    LayerLookup.prototype.originLayer = function() {
      if (this.origin) {
        return this.forElement(this.origin);
      }
    };

    LayerLookup.prototype.first = function() {
      return this.all()[0];
    };

    LayerLookup.prototype.all = function() {
      var results;
      results = u.flatMap(this.values, (function(_this) {
        return function(value) {
          return _this.resolveValue(value);
        };
      })(this));
      results = u.compact(results);
      if (this.values.length > 1) {
        results = u.uniq(results);
      }
      return results;
    };

    LayerLookup.prototype.forElement = function(element) {
      element = e.get(element);
      return u.find(this.stack.reversed(), function(layer) {
        return layer.contains(element);
      });
    };

    LayerLookup.prototype.forIndex = function(value) {
      return this.stack[value];
    };

    LayerLookup.prototype.resolveValue = function(value) {
      if (value instanceof up.Layer) {
        return value;
      }
      if (u.isNumber(value)) {
        return this.forIndex(value);
      }
      if (/^\d+$/.test(value)) {
        return this.forIndex(Number(value));
      }
      if (u.isElementish(value)) {
        return this.forElement(value);
      }
      switch (value) {
        case 'any':
          return u.uniq([this.currentLayer].concat(slice.call(this.stack.reversed())));
        case 'current':
          return this.currentLayer;
        case 'closest':
          return this.stack.selfAndAncestorsOf(this.currentLayer);
        case 'parent':
          return this.currentLayer.parent;
        case 'ancestor':
        case 'ancestors':
          return this.currentLayer.ancestors;
        case 'child':
          return this.currentLayer.child;
        case 'descendant':
        case 'descendants':
          return this.currentLayer.descendants;
        case 'new':
          return 'new';
        case 'root':
          return this.stack.root;
        case 'overlay':
        case 'overlays':
          return u.reverse(this.stack.overlays);
        case 'front':
          return this.stack.front;
        case 'origin':
          return this.originLayer() || up.fail("Need { origin } option for { layer: 'origin' }");
        default:
          return up.fail("Unknown { layer } option: %o", value);
      }
    };

    return LayerLookup;

  })();

}).call(this);
(function() {
  var e, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  u = up.util;

  e = up.element;

  up.LayerStack = (function(superClass) {
    extend(LayerStack, superClass);

    function LayerStack() {
      LayerStack.__super__.constructor.call(this);
      this.currentOverrides = [];
      this.push(this.buildRoot());
    }

    LayerStack.prototype.buildRoot = function() {
      return up.layer.build({
        mode: 'root',
        stack: this
      });
    };

    LayerStack.prototype.remove = function(layer) {
      return u.remove(this, layer);
    };

    LayerStack.prototype.peel = function(layer, options) {
      var descendants, dismissDescendant, dismissOptions, promises;
      descendants = u.reverse(layer.descendants);
      dismissOptions = u.merge(options, {
        preventable: false
      });
      dismissDescendant = function(descendant) {
        return descendant.dismiss(':peel', dismissOptions);
      };
      promises = u.map(descendants, dismissDescendant);
      return Promise.all(promises);
    };

    LayerStack.prototype.reset = function() {
      this.peel(this.root, {
        animation: false
      });
      this.currentOverrides = [];
      return this.root.reset();
    };

    LayerStack.prototype.isOpen = function(layer) {
      return layer.index >= 0;
    };

    LayerStack.prototype.isClosed = function(layer) {
      return !this.isOpen(layer);
    };

    LayerStack.prototype.parentOf = function(layer) {
      return this[layer.index - 1];
    };

    LayerStack.prototype.childOf = function(layer) {
      return this[layer.index + 1];
    };

    LayerStack.prototype.ancestorsOf = function(layer) {
      return u.reverse(this.slice(0, layer.index));
    };

    LayerStack.prototype.selfAndAncestorsOf = function(layer) {
      return [layer].concat(slice.call(layer.ancestors));
    };

    LayerStack.prototype.descendantsOf = function(layer) {
      return this.slice(layer.index + 1);
    };

    LayerStack.prototype.isRoot = function(layer) {
      return this[0] === layer;
    };

    LayerStack.prototype.isOverlay = function(layer) {
      return !this.isRoot(layer);
    };

    LayerStack.prototype.isCurrent = function(layer) {
      return this.current === layer;
    };

    LayerStack.prototype.isFront = function(layer) {
      return this.front === layer;
    };

    LayerStack.prototype.get = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.getAll.apply(this, args)[0];
    };

    LayerStack.prototype.getAll = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(up.LayerLookup, [this].concat(slice.call(args)), function(){}).all();
    };

    LayerStack.prototype.sync = function() {
      var i, layer, len, ref, results;
      ref = this;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        layer = ref[i];
        results.push(layer.sync());
      }
      return results;
    };

    LayerStack.prototype.asCurrent = function(layer, fn) {
      try {
        this.currentOverrides.push(layer);
        return fn();
      } finally {
        this.currentOverrides.pop();
      }
    };

    LayerStack.prototype.reversed = function() {
      return u.reverse(this);
    };

    LayerStack.prototype["" + u.copy.key] = function() {
      return u.copyArrayLike(this);
    };

    u.getter(LayerStack.prototype, 'root', function() {
      return this[0];
    });

    u.getter(LayerStack.prototype, 'overlays', function() {
      return this.root.descendants;
    });

    u.getter(LayerStack.prototype, 'current', function() {
      return u.last(this.currentOverrides) || this.front;
    });

    u.getter(LayerStack.prototype, 'front', function() {
      return u.last(this);
    });

    return LayerStack;

  })(Array);

}).call(this);
(function() {
  var u;

  u = up.util;

  up.LinkFeedbackURLs = (function() {
    function LinkFeedbackURLs(link) {
      var alias, href, normalize, upHREF;
      normalize = up.feedback.normalizeURL;
      this.isSafe = up.link.isSafe(link);
      if (this.isSafe) {
        href = link.getAttribute('href');
        if (href && href !== '#') {
          this.href = normalize(href);
        }
        upHREF = link.getAttribute('up-href');
        if (upHREF) {
          this.upHREF = normalize(upHREF);
        }
        alias = link.getAttribute('up-alias');
        if (alias) {
          this.aliasPattern = new up.URLPattern(alias, normalize);
        }
      }
    }

    LinkFeedbackURLs.prototype.isCurrent = function(normalizedLocation) {
      return this.isSafe && !!((this.href && this.href === normalizedLocation) || (this.upHREF && this.upHREF === normalizedLocation) || (this.aliasPattern && this.aliasPattern.test(normalizedLocation, false)));
    };

    return LinkFeedbackURLs;

  })();

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.LinkPreloader = (function() {
    function LinkPreloader() {
      this.considerPreload = bind(this.considerPreload, this);
    }

    LinkPreloader.prototype.observeLink = function(link) {
      if (up.link.isSafe(link)) {
        this.on(link, 'mouseenter', (function(_this) {
          return function(event) {
            return _this.considerPreload(event, true);
          };
        })(this));
        this.on(link, 'mousedown touchstart', (function(_this) {
          return function(event) {
            return _this.considerPreload(event);
          };
        })(this));
        return this.on(link, 'mouseleave', (function(_this) {
          return function(event) {
            return _this.stopPreload(event);
          };
        })(this));
      }
    };

    LinkPreloader.prototype.on = function(link, eventTypes, callback) {
      return up.on(link, eventTypes, {
        passive: true
      }, callback);
    };

    LinkPreloader.prototype.considerPreload = function(event, applyDelay) {
      var link;
      link = event.target;
      if (link !== this.currentLink) {
        this.reset();
        this.currentLink = link;
        if (up.link.shouldFollowEvent(event, link)) {
          if (applyDelay) {
            return this.preloadAfterDelay(link);
          } else {
            return this.preloadNow(link);
          }
        }
      }
    };

    LinkPreloader.prototype.stopPreload = function(event) {
      if (event.target === this.currentLink) {
        return this.reset();
      }
    };

    LinkPreloader.prototype.reset = function() {
      var ref;
      if (!this.currentLink) {
        return;
      }
      clearTimeout(this.timer);
      if ((ref = this.currentRequest) != null ? ref.preload : void 0) {
        this.currentRequest.abort();
      }
      this.currentLink = void 0;
      return this.currentRequest = void 0;
    };

    LinkPreloader.prototype.preloadAfterDelay = function(link) {
      var delay, ref;
      delay = (ref = e.numberAttr(link, 'up-delay')) != null ? ref : up.link.config.preloadDelay;
      return this.timer = u.timer(delay, (function(_this) {
        return function() {
          return _this.preloadNow(link);
        };
      })(this));
    };

    LinkPreloader.prototype.preloadNow = function(link) {
      var onQueued;
      onQueued = (function(_this) {
        return function(arg) {
          var request;
          request = arg.request;
          return _this.currentRequest = request;
        };
      })(this);
      up.log.muteRejection(up.link.preload(link, {
        onQueued: onQueued
      }));
      return this.queued = true;
    };

    return LinkPreloader;

  })();

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.MotionController = (function() {
    function MotionController(name) {
      this.reset = bind(this.reset, this);
      this.whileForwardingFinishEvent = bind(this.whileForwardingFinishEvent, this);
      this.unmarkCluster = bind(this.unmarkCluster, this);
      this.markCluster = bind(this.markCluster, this);
      this.whenElementFinished = bind(this.whenElementFinished, this);
      this.emitFinishEvent = bind(this.emitFinishEvent, this);
      this.finishOneElement = bind(this.finishOneElement, this);
      this.isActive = bind(this.isActive, this);
      this.expandFinishRequest = bind(this.expandFinishRequest, this);
      this.finish = bind(this.finish, this);
      this.startFunction = bind(this.startFunction, this);
      this.activeClass = "up-" + name;
      this.dataKey = "up-" + name + "-finished";
      this.selector = "." + this.activeClass;
      this.finishEvent = "up:" + name + ":finish";
      this.finishCount = 0;
      this.clusterCount = 0;
    }


    /***
    Finishes all animations in the given elements' ancestors and
    descendants, then calls the given function.
    
    The function is expected to return a promise that is fulfilled when
    the animation ends. The function is also expected to listen to
    `this.finishEvent` and instantly skip to the last frame
    when the event is observed.
    
    The animation is tracked so it can be
    [`finished`](/up.MotionController.finish) later.
    
    @function startFunction
    @param {Element|List<Element>} cluster
      A list of elements that will be affected by the motion.
    @param {Function(): Promise} startMotion
    @param {Object} [memory.trackMotion=true]
    @return {Promise}
      A promise that fulfills when the animation ends.
     */

    MotionController.prototype.startFunction = function(cluster, startMotion, memory) {
      var mutedAnimator, ref;
      if (memory == null) {
        memory = {};
      }
      cluster = e.list(cluster);
      mutedAnimator = function() {
        return up.log.muteRejection(startMotion());
      };
      memory.trackMotion = (ref = memory.trackMotion) != null ? ref : up.motion.isEnabled();
      if (memory.trackMotion === false) {
        return u.microtask(mutedAnimator);
      } else {
        memory.trackMotion = false;
        return this.finish(cluster).then((function(_this) {
          return function() {
            var promise;
            promise = _this.whileForwardingFinishEvent(cluster, mutedAnimator);
            promise = promise.then(function() {
              return _this.unmarkCluster(cluster);
            });
            _this.markCluster(cluster, promise);
            return promise;
          };
        })(this));
      }
    };


    /***
    Finishes all animations in the given elements' ancestors and
    descendants, then calls `motion.start()`.
    
    Also listens to `this.finishEvent` on the given elements.
    When this event is observed, calls `motion.finish()`.
    
    @function startMotion
    @param {Element|List<Element>} cluster
    @param {up.Motion} motion
    @param {Object} [memory.trackMotion=true]
     */

    MotionController.prototype.startMotion = function(cluster, motion, memory) {
      var finish, promise, start, unbindFinish;
      if (memory == null) {
        memory = {};
      }
      start = function() {
        return motion.start();
      };
      finish = function() {
        return motion.finish();
      };
      unbindFinish = up.on(cluster, this.finishEvent, finish);
      promise = this.startFunction(cluster, start, memory);
      promise = promise.then(unbindFinish);
      return promise;
    };


    /***
    @function finish
    @param {List<Element>} [elements]
      If no element is given, finishes all animations in the documnet.
      If an element is given, only finishes animations in its subtree and ancestors.
    @return {Promise} A promise that fulfills when animations have finished.
     */

    MotionController.prototype.finish = function(elements) {
      var allFinished;
      this.finishCount++;
      if (this.clusterCount === 0 || !up.motion.isEnabled()) {
        return Promise.resolve();
      }
      elements = this.expandFinishRequest(elements);
      allFinished = u.map(elements, this.finishOneElement);
      return Promise.all(allFinished);
    };

    MotionController.prototype.expandFinishRequest = function(elements) {
      if (elements) {
        return u.flatMap(elements, (function(_this) {
          return function(el) {
            return e.list(e.closest(el, _this.selector), e.all(el, _this.selector));
          };
        })(this));
      } else {
        return e.all(this.selector);
      }
    };

    MotionController.prototype.isActive = function(element) {
      return element.classList.contains(this.activeClass);
    };

    MotionController.prototype.finishOneElement = function(element) {
      this.emitFinishEvent(element);
      return this.whenElementFinished(element);
    };

    MotionController.prototype.emitFinishEvent = function(element, eventAttrs) {
      if (eventAttrs == null) {
        eventAttrs = {};
      }
      eventAttrs = u.merge({
        target: element,
        log: false
      }, eventAttrs);
      return up.emit(this.finishEvent, eventAttrs);
    };

    MotionController.prototype.whenElementFinished = function(element) {
      return element[this.dataKey] || Promise.resolve();
    };

    MotionController.prototype.markCluster = function(cluster, promise) {
      var element, i, len, results;
      this.clusterCount++;
      results = [];
      for (i = 0, len = cluster.length; i < len; i++) {
        element = cluster[i];
        element.classList.add(this.activeClass);
        results.push(element[this.dataKey] = promise);
      }
      return results;
    };

    MotionController.prototype.unmarkCluster = function(cluster) {
      var element, i, len, results;
      this.clusterCount--;
      results = [];
      for (i = 0, len = cluster.length; i < len; i++) {
        element = cluster[i];
        element.classList.remove(this.activeClass);
        results.push(delete element[this.dataKey]);
      }
      return results;
    };

    MotionController.prototype.whileForwardingFinishEvent = function(cluster, fn) {
      var doForward, unbindFinish;
      if (cluster.length < 2) {
        return fn();
      }
      doForward = (function(_this) {
        return function(event) {
          if (!event.forwarded) {
            return u.each(cluster, function(element) {
              if (element !== event.target && _this.isActive(element)) {
                return _this.emitFinishEvent(element, {
                  forwarded: true
                });
              }
            });
          }
        };
      })(this);
      unbindFinish = up.on(cluster, this.finishEvent, doForward);
      return fn().then(unbindFinish);
    };

    MotionController.prototype.reset = function() {
      return this.finish().then((function(_this) {
        return function() {
          _this.finishCount = 0;
          return _this.clusterCount = 0;
        };
      })(this));
    };

    return MotionController;

  })();

}).call(this);
(function() {
  var e, u;

  u = up.util;

  e = up.element;

  up.OptionsParser = (function() {
    function OptionsParser(options, element, parserOptions) {
      this.options = options;
      this.element = element;
      this.fail = parserOptions != null ? parserOptions.fail : void 0;
    }

    OptionsParser.prototype.string = function(key, keyOptions) {
      return this.parse(e.attr, key, keyOptions);
    };

    OptionsParser.prototype.boolean = function(key, keyOptions) {
      return this.parse(e.booleanAttr, key, keyOptions);
    };

    OptionsParser.prototype.number = function(key, keyOptions) {
      return this.parse(e.numberAttr, key, keyOptions);
    };

    OptionsParser.prototype.booleanOrString = function(key, keyOptions) {
      return this.parse(e.booleanOrStringAttr, key, keyOptions);
    };

    OptionsParser.prototype.json = function(key, keyOptions) {
      return this.parse(e.jsonAttr, key, keyOptions);
    };

    OptionsParser.prototype.parse = function(attrValueFn, key, keyOptions) {
      var attrName, attrNames, failAttrNames, failKey, failKeyOptions, i, len, normalizeFn, ref, value;
      if (keyOptions == null) {
        keyOptions = {};
      }
      attrNames = u.wrapList((ref = keyOptions.attr) != null ? ref : this.attrNameForKey(key));
      value = this.options[key];
      if (this.element) {
        for (i = 0, len = attrNames.length; i < len; i++) {
          attrName = attrNames[i];
          if (value == null) {
            value = attrValueFn(this.element, attrName);
          }
        }
      }
      if (value == null) {
        value = keyOptions["default"];
      }
      if (normalizeFn = keyOptions.normalize) {
        value = normalizeFn(value);
      }
      if (u.isDefined(value)) {
        this.options[key] = value;
      }
      if ((keyOptions.fail || this.fail) && (failKey = up.fragment.failKey(key))) {
        failAttrNames = u.compact(u.map(attrNames, this.deriveFailAttrName));
        failKeyOptions = u.merge(keyOptions, {
          attr: failAttrNames,
          fail: false
        });
        return this.parse(attrValueFn, failKey, failKeyOptions);
      }
    };

    OptionsParser.prototype.deriveFailAttrName = function(attr) {
      if (attr.indexOf('up-') === 0) {
        return "up-fail-" + (attr.slice(3));
      }
    };

    OptionsParser.prototype.attrNameForKey = function(option) {
      return "up-" + (u.camelToKebabCase(option));
    };

    return OptionsParser;

  })();

}).call(this);
(function() {
  var e, u;

  e = up.element;

  u = up.util;

  up.OverlayFocus = (function() {
    function OverlayFocus(layer) {
      this.layer = layer;
      this.focusElement = this.layer.getFocusElement();
    }

    OverlayFocus.prototype.moveToFront = function() {
      if (this.enabled) {
        return;
      }
      this.enabled = true;
      this.untrapFocus = up.on('focusin', (function(_this) {
        return function(event) {
          return _this.onFocus(event);
        };
      })(this));
      this.unsetAttrs = e.setTemporaryAttrs(this.focusElement, {
        'tabindex': '0',
        'role': 'dialog',
        'aria-modal': 'true'
      });
      this.focusTrapBefore = e.affix(this.focusElement, 'beforebegin', 'up-focus-trap[tabindex=0]');
      return this.focusTrapAfter = e.affix(this.focusElement, 'afterend', 'up-focus-trap[tabindex=0]');
    };

    OverlayFocus.prototype.moveToBack = function() {
      return this.teardown();
    };

    OverlayFocus.prototype.teardown = function() {
      if (!this.enabled) {
        return;
      }
      this.enabled = false;
      this.untrapFocus();
      this.unsetAttrs();
      e.remove(this.focusTrapBefore);
      return e.remove(this.focusTrapAfter);
    };

    OverlayFocus.prototype.onFocus = function(event) {
      var target;
      target = event.target;
      if (this.processingFocusEvent) {
        return;
      }
      this.processingFocusEvent = true;
      if (target === this.focusTrapBefore) {
        this.focusEnd();
      } else if (target === this.focusTrapAfter || !this.layer.contains(target)) {
        this.focusStart();
      }
      return this.processingFocusEvent = false;
    };

    OverlayFocus.prototype.focusStart = function(focusOptions) {
      return up.focus(this.focusElement, focusOptions);
    };

    OverlayFocus.prototype.focusEnd = function() {
      return this.focusLastDescendant(this.layer.getBoxElement()) || this.focusStart();
    };

    OverlayFocus.prototype.focusLastDescendant = function(element) {
      var child, i, len, ref;
      ref = u.reverse(element.children);
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (up.viewport.tryFocus(child) || this.focusLastDescendant(child)) {
          return true;
        }
      }
    };

    return OverlayFocus;

  })();

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  e = up.element;


  /***
  The `up.Params` class offers a consistent API to read and manipulate request parameters
  independent of their type.
  
  Request parameters are used in [form submissions](/up.Params#fromForm) and
  [URLs](/up.Params#fromURL). Methods like `up.submit()` or `up.replace()` accept
  request parameters as a `{ params }` option.
  
  \#\#\# Supported parameter types
  
  The following types of parameter representation are supported:
  
  1. An object like `{ email: 'foo@bar.com' }`
  2. A query string like `'email=foo%40bar.com'`
  3. An array of `{ name, value }` objects like `[{ name: 'email', value: 'foo@bar.com' }]`
  4. A [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.
     On IE 11 and Edge, `FormData` payloads require a [polyfill for `FormData#entries()`](https://github.com/jimmywarting/FormData).
  
  @class up.Params
   */

  up.Params = (function(superClass) {
    extend(Params, superClass);


    /***
    Constructs a new `up.Params` instance.
    
    @constructor up.Params
    @param {Object|Array|string|up.Params} [params]
      An existing list of params with which to initialize the new `up.Params` object.
    
      The given params value may be of any [supported type](/up.Params).
    @return {up.Params}
    @experimental
     */

    function Params(raw) {
      this.arrayEntryToQuery = bind(this.arrayEntryToQuery, this);
      this.clear();
      this.addAll(raw);
    }


    /***
    Removes all params from this object.
    
    @function up.Params#clear
    @experimental
     */

    Params.prototype.clear = function() {
      return this.entries = [];
    };

    Params.prototype["" + u.copy.key] = function() {
      return new up.Params(this);
    };


    /***
    Returns an object representation of this `up.Params` instance.
    
    The returned value is a simple JavaScript object with properties
    that correspond to the key/values in the given `params`.
    
    \#\#\# Example
    
        var params = new up.Params('foo=bar&baz=bam')
        var object = params.toObject()
    
        // object is now: {
        //   foo: 'bar',
        //   baz: 'bam'
        // ]
    
    @function up.Params#toObject
    @return {Object}
    @experimental
     */

    Params.prototype.toObject = function() {
      var entry, i, len, name, obj, ref, value;
      obj = {};
      ref = this.entries;
      for (i = 0, len = ref.length; i < len; i++) {
        entry = ref[i];
        name = entry.name, value = entry.value;
        if (!u.isBasicObjectProperty(name)) {
          if (this.isArrayKey(name)) {
            obj[name] || (obj[name] = []);
            obj[name].push(value);
          } else {
            obj[name] = value;
          }
        }
      }
      return obj;
    };


    /***
    Returns an array representation of this `up.Params` instance.
    
    The returned value is a JavaScript array with elements that are objects with
    `{ key }` and `{ value }` properties.
    
    \#\#\# Example
    
        var params = new up.Params('foo=bar&baz=bam')
        var array = params.toArray()
    
        // array is now: [
        //   { name: 'foo', value: 'bar' },
        //   { name: 'baz', value: 'bam' }
        // ]
    
    @function up.Params#toArray
    @return {Array}
    @experimental
     */

    Params.prototype.toArray = function() {
      return this.entries;
    };


    /***
    Returns a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) representation
    of this `up.Params` instance.
    
    \#\#\# Example
    
        var params = new up.Params('foo=bar&baz=bam')
        var formData = params.toFormData()
    
        formData.get('foo') // 'bar'
        formData.get('baz') // 'bam'
    
    @function up.Params#toFormData
    @return {FormData}
    @experimental
     */

    Params.prototype.toFormData = function() {
      var entry, formData, i, len, ref;
      formData = new FormData();
      ref = this.entries;
      for (i = 0, len = ref.length; i < len; i++) {
        entry = ref[i];
        formData.append(entry.name, entry.value);
      }
      return formData;
    };


    /***
    Returns an [query string](https://en.wikipedia.org/wiki/Query_string) for this `up.Params` instance.
    
    The keys and values in the returned query string will be [percent-encoded](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding).
    Non-primitive values (like [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) will be omitted from
    the retuned query string.
    
    \#\#\# Example
    
        var params = new up.Params({ foo: 'bar', baz: 'bam' })
        var query = params.toQuery()
    
        // query is now: 'foo=bar&baz=bam'
    
    @function up.Params#toQuery
    @param {Object|FormData|string|Array|undefined} params
      the params to convert
    @return {string}
      a query string built from the given params
    @experimental
     */

    Params.prototype.toQuery = function() {
      var parts;
      parts = u.map(this.entries, this.arrayEntryToQuery);
      parts = u.compact(parts);
      return parts.join('&');
    };

    Params.prototype.arrayEntryToQuery = function(entry) {
      var query, value;
      value = entry.value;
      if (this.isBinaryValue(value)) {
        return void 0;
      }
      query = encodeURIComponent(entry.name);
      if (u.isGiven(value)) {
        query += "=";
        query += encodeURIComponent(value);
      }
      return query;
    };


    /***
    Returns whether the given value cannot be encoded into a query string.
    
    We will have `File` values in our params when we serialize a form with a file input.
    These entries will be filtered out when converting to a query string.
    
    @function up.Params#isBinaryValue
    @internal
     */

    Params.prototype.isBinaryValue = function(value) {
      return value instanceof Blob;
    };

    Params.prototype.hasBinaryValues = function() {
      var values;
      values = u.map(this.entries, 'value');
      return u.some(values, this.isBinaryValue);
    };


    /***
    Builds an URL string from the given base URL and
    this `up.Params` instance as a [query string](/up.Params.toString).
    
    The base URL may or may not already contain a query string. The
    additional query string will be joined with an `&` or `?` character accordingly.
    
    @function up.Params#toURL
    @param {string} base
      The base URL that will be prepended to this `up.Params` object as a [query string](/up.Params.toString).
    @return {string}
      The built URL.
    @experimental
     */

    Params.prototype.toURL = function(base) {
      var parts, separator;
      parts = [base, this.toQuery()];
      parts = u.filter(parts, u.isPresent);
      separator = u.contains(base, '?') ? '&' : '?';
      return parts.join(separator);
    };


    /***
    Adds a new entry with the given `name` and `value`.
    
    An `up.Params` instance can hold multiple entries with the same name.
    To overwrite all existing entries with the given `name`, use `up.Params#set()` instead.
    
    \#\#\# Example
    
        var params = new up.Params()
        params.add('foo', 'fooValue')
    
        var foo = params.get('foo')
        // foo is now 'fooValue'
    
    @function up.Params#add
    @param {string} name
      The name of the new entry.
    @param {any} value
      The value of the new entry.
    @experimental
     */

    Params.prototype.add = function(name, value) {
      return this.entries.push({
        name: name,
        value: value
      });
    };


    /***
    Adds all entries from the given list of params.
    
    The given params value may be of any [supported type](/up.Params).
    
    @function up.Params#addAll
    @param {Object|Array|string|up.Params|undefined} params
    @experimental
     */

    Params.prototype.addAll = function(raw) {
      var ref, ref1;
      if (u.isMissing(raw)) {

      } else if (raw instanceof this.constructor) {
        return (ref = this.entries).push.apply(ref, raw.entries);
      } else if (u.isArray(raw)) {
        return (ref1 = this.entries).push.apply(ref1, raw);
      } else if (u.isString(raw)) {
        return this.addAllFromQuery(raw);
      } else if (u.isFormData(raw)) {
        return this.addAllFromFormData(raw);
      } else if (u.isObject(raw)) {
        return this.addAllFromObject(raw);
      } else {
        return up.fail("Unsupport params type: %o", raw);
      }
    };

    Params.prototype.addAllFromObject = function(object) {
      var key, results, value, valueElement, valueElements;
      results = [];
      for (key in object) {
        value = object[key];
        valueElements = u.isArray(value) ? value : [value];
        results.push((function() {
          var i, len, results1;
          results1 = [];
          for (i = 0, len = valueElements.length; i < len; i++) {
            valueElement = valueElements[i];
            results1.push(this.add(key, valueElement));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Params.prototype.addAllFromQuery = function(query) {
      var i, len, name, part, ref, ref1, results, value;
      ref = query.split('&');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        part = ref[i];
        if (part) {
          ref1 = part.split('='), name = ref1[0], value = ref1[1];
          name = decodeURIComponent(name);
          if (u.isGiven(value)) {
            value = decodeURIComponent(value);
          } else {
            value = null;
          }
          results.push(this.add(name, value));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Params.prototype.addAllFromFormData = function(formData) {
      return u.eachIterator(formData.entries(), (function(_this) {
        return function(value) {
          return _this.add.apply(_this, value);
        };
      })(this));
    };


    /***
    Sets the `value` for the entry with given `name`.
    
    An `up.Params` instance can hold multiple entries with the same name.
    All existing entries with the given `name` are [deleted](/up.Params#delete) before the
    new entry is set. To add a new entry even if the `name` is taken, use `up.Params#add()`.
    
    @function up.Params#set
    @param {string} name
      The name of the entry to set.
    @param {any} value
      The new value of the entry.
    @experimental
     */

    Params.prototype.set = function(name, value) {
      this["delete"](name);
      return this.add(name, value);
    };


    /***
    Deletes all entries with the given `name`.
    
    @function up.Params#delete
    @param {string} name
    @experimental
     */

    Params.prototype["delete"] = function(name) {
      return this.entries = u.reject(this.entries, this.matchEntryFn(name));
    };

    Params.prototype.matchEntryFn = function(name) {
      return function(entry) {
        return entry.name === name;
      };
    };


    /***
    Returns the first param value with the given `name` from the given `params`.
    
    Returns `undefined` if no param value with that name is set.
    
    If the `name` denotes an array field (e.g. `foo[]`), *all* param values with the given `name`
    are returned as an array. If no param value with that array name is set, an empty
    array is returned.
    
    To always return a single value use `up.Params#getFirst()` instead.
    To always return an array of values use `up.Params#getAll()` instead.
    
    \#\#\# Example
    
        var params = new up.Params({ foo: 'fooValue', bar: 'barValue' })
        var params = new up.Params([
          { name: 'foo', value: 'fooValue' }
          { name: 'bar[]', value: 'barValue1' }
          { name: 'bar[]', value: 'barValue2' })
        ]})
    
        var foo = params.get('foo')
        // foo is now 'fooValue'
    
        var bar = params.get('bar')
        // bar is now ['barValue1', 'barValue2']
    
    @function up.Params#get
    @param {string} name
    @experimental
     */

    Params.prototype.get = function(name) {
      if (this.isArrayKey(name)) {
        return this.getAll(name);
      } else {
        return this.getFirst(name);
      }
    };


    /***
    Returns the first param value with the given `name`.
    
    Returns `undefined` if no param value with that name is set.
    
    @function up.Params#getFirst
    @param {string} name
    @return {any}
      The value of the param with the given name.
     */

    Params.prototype.getFirst = function(name) {
      var entry;
      entry = u.find(this.entries, this.matchEntryFn(name));
      return entry != null ? entry.value : void 0;
    };


    /***
    Returns an array of all param values with the given `name`.
    
    Returns an empty array if no param value with that name is set.
    
    @function up.Params#getAll
    @param {string} name
    @return {Array}
      An array of all values with the given name.
     */

    Params.prototype.getAll = function(name) {
      var entries;
      if (this.isArrayKey(name)) {
        return this.getAll(name);
      } else {
        entries = u.map(this.entries, this.matchEntryFn(name));
        return u.map(entries, 'value');
      }
    };

    Params.prototype.isArrayKey = function(key) {
      return u.endsWith(key, '[]');
    };

    Params.prototype["" + u.isBlank.key] = function() {
      return this.entries.length === 0;
    };


    /***
    Constructs a new `up.Params` instance from the given `<form>`.
    
    The returned params may be passed as `{ params }` option to
    `up.request()` or `up.replace()`.
    
    The constructed `up.Params` will include exactly those form values that would be
    included in a regular form submission. In particular:
    
    - All `<input>` types are suppported
    - Field values are usually strings, but an `<input type="file">` will produce
      [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) values.
    - An `<input type="radio">` or `<input type="checkbox">` will only be added if they are `[checked]`.
    - An `<select>` will only be added if at least one value is `[checked]`.
    - If passed a `<select multiple>` or `<input type="file" multiple>`, all selected values are added.
      If passed a `<select multiple>`, all selected values are added.
    - Fields that are `[disabled]` are ignored
    - Fields without a `[name]` attribute are ignored.
    
    \#\#\# Example
    
    Given this HTML form:
    
        <form>
          <input type="text" name="email" value="foo@bar.com">
          <input type="password" name="pass" value="secret">
        </form>
    
    This would serialize the form into an array representation:
    
        var params = up.Params.fromForm('input[name=email]')
        var email = params.get('email') // email is now 'foo@bar.com'
        var pass = params.get('pass') // pass is now 'secret'
    
    @function up.Params.fromForm
    @param {Element|jQuery|string} form
      A `<form>` element or a selector that matches a `<form>` element.
    @return {up.Params}
      A new `up.Params` instance with values from the given form.
    @experimental
     */

    Params.fromForm = function(form) {
      form = up.fragment.get(form);
      return this.fromFields(up.form.fields(form));
    };


    /***
    Constructs a new `up.Params` instance from one or more
    [HTML form field](https://www.w3schools.com/html/html_form_elements.asp).
    
    The constructed `up.Params` will include exactly those form values that would be
    included for the given fields in a regular form submission. If a given field wouldn't
    submit a value (like an unchecked `<input type="checkbox">`, nothing will be added.
    
    See `up.Params.fromForm()` for more details and examples.
    
    @function up.Params.fromFields
    @param {Element|List<Element>|jQuery} fields
    @return {up.Params}
    @experimental
     */

    Params.fromFields = function(fields) {
      var field, i, len, params, ref;
      params = new this();
      ref = u.wrapList(fields);
      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];
        params.addField(field);
      }
      return params;
    };


    /***
    Adds params from the given [HTML form field](https://www.w3schools.com/html/html_form_elements.asp).
    
    The added params will include exactly those form values that would be
    included for the given field in a regular form submission. If the given field wouldn't
      submit a value (like an unchecked `<input type="checkbox">`, nothing will be added.
    
    See `up.Params.fromForm()` for more details and examples.
    
    @function up.Params#addField
    @param {Element|jQuery} field
    @experimental
     */

    Params.prototype.addField = function(field) {
      var file, i, j, len, len1, name, option, params, ref, ref1, results, results1, tagName, type;
      params = new this.constructor();
      field = e.get(field);
      if ((name = field.name) && (!field.disabled)) {
        tagName = field.tagName;
        type = field.type;
        if (tagName === 'SELECT') {
          ref = field.querySelectorAll('option');
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            option = ref[i];
            if (option.selected) {
              results.push(this.add(name, option.value));
            } else {
              results.push(void 0);
            }
          }
          return results;
        } else if (type === 'checkbox' || type === 'radio') {
          if (field.checked) {
            return this.add(name, field.value);
          }
        } else if (type === 'file') {
          ref1 = field.files;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            file = ref1[j];
            results1.push(this.add(name, file));
          }
          return results1;
        } else {
          return this.add(name, field.value);
        }
      }
    };

    Params.prototype["" + u.isEqual.key] = function(other) {
      return other && (this.constructor === other.constructor) && u.isEqual(this.entries, other.entries);
    };


    /***
    Constructs a new `up.Params` instance from the given URL's
    [query string](https://en.wikipedia.org/wiki/Query_string).
    
    Constructs an empty `up.Params` instance if the given URL has no query string.
    
    \#\#\# Example
    
        var params = up.Params.fromURL('http://foo.com?foo=fooValue&bar=barValue')
        var foo = params.get('foo')
        // foo is now: 'fooValue'
    
    @function up.Params.fromURL
    @param {string} url
      The URL from which to extract the query string.
    @return {string|undefined}
      The given URL's query string, or `undefined` if the URL has no query component.
    @experimental
     */

    Params.fromURL = function(url) {
      var params, query, urlParts;
      params = new this();
      urlParts = u.parseURL(url);
      if (query = urlParts.search) {
        query = query.replace(/^\?/, '');
        params.addAll(query);
      }
      return params;
    };


    /***
    Returns the given URL without its [query string](https://en.wikipedia.org/wiki/Query_string).
    
    \#\#\# Example
    
        var url = up.Params.stripURL('http://foo.com?key=value')
        // url is now: 'http://foo.com'
    
    @function up.Params.stripURL
    @param {string} url
      A URL (with or without a query string).
    @return {string}
      The given URL without its query string.
    @experimental
     */

    Params.stripURL = function(url) {
      return u.normalizeURL(url, {
        search: false
      });
    };


    /***
    If passed an `up.Params` instance, it is returned unchanged.
    Otherwise constructs an `up.Params` instance from the given value.
    
    The given params value may be of any [supported type](/up.Params)
    The return value is always an `up.Params` instance.
    
    @function up.Params.wrap
    @param {Object|Array|string|up.Params|undefined} params
    @return {up.Params}
    @experimental
     */

    return Params;

  })(up.Class);

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Rect = (function(superClass) {
    extend(Rect, superClass);

    function Rect() {
      return Rect.__super__.constructor.apply(this, arguments);
    }

    Rect.prototype.keys = function() {
      return ['left', 'top', 'width', 'height'];
    };

    Rect.getter('bottom', function() {
      return this.top + this.height;
    });

    Rect.getter('right', function() {
      return this.left + this.width;
    });

    Rect.fromElement = function(element) {
      return new this(element.getBoundingClientRect());
    };

    return Rect;

  })(up.Record);

}).call(this);
(function() {
  var u;

  u = up.util;

  up.RenderOptions = (function() {
    var GLOBAL_DEFAULTS, PREFLIGHT_KEYS, PRELOAD_OVERRIDES, SHARED_KEYS, deriveFailOptions, failOverrides, navigateDefaults, preloadOverrides, preprocess;
    GLOBAL_DEFAULTS = {
      hungry: true,
      keep: true,
      source: true,
      saveScroll: true,
      fail: 'auto',
      history: false
    };
    PRELOAD_OVERRIDES = {
      solo: false,
      confirm: false,
      feedback: false
    };
    PREFLIGHT_KEYS = ['url', 'method', 'origin', 'headers', 'params', 'cache', 'solo', 'confirm', 'feedback', 'origin', 'currentLayer', 'fail'];
    SHARED_KEYS = PREFLIGHT_KEYS.concat(['keep', 'hungry', 'history', 'source', 'saveScroll', 'fallback', 'navigate']);
    navigateDefaults = function(options) {
      if (options.navigate) {
        return up.fragment.config.navigateOptions;
      }
    };
    preloadOverrides = function(options) {
      if (options.preload) {
        return PRELOAD_OVERRIDES;
      }
    };
    preprocess = function(options) {
      var base, result;
      if (typeof (base = up.legacy).handleRenderOptions === "function") {
        base.handleRenderOptions(options);
      }
      result = u.merge(GLOBAL_DEFAULTS, navigateDefaults(options), options, preloadOverrides(options));
      return result;
    };
    failOverrides = function(options) {
      var key, overrides, unprefixed, value;
      overrides = {};
      for (key in options) {
        value = options[key];
        if (unprefixed = up.fragment.successKey(key)) {
          overrides[unprefixed] = value;
        }
      }
      return overrides;
    };
    deriveFailOptions = function(preprocessedOptions) {
      var result;
      result = u.merge(u.pick(preprocessedOptions, SHARED_KEYS), failOverrides(preprocessedOptions));
      return preprocess(result);
    };
    return {
      preprocess: preprocess,
      deriveFailOptions: deriveFailOptions,
      fixLegacyHistoryOption: fixLegacyHistoryOption
    };
  })();

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  u = up.util;

  e = up.element;


  /***
  Instances of `up.Request` normalizes properties of an [`AJAX request`](/up.request)
  such as the requested URL, form parameters and HTTP method.
  
  You can queue a request using the `up.request()` method:
  
      let request = up.request('/foo')
      console.log(request.url)
  
      // A request object is also a promise for its response
      let response = await request
      console.log(response.text)
  
  @class up.Request
   */

  up.Request = (function(superClass) {
    extend(Request, superClass);


    /***
    The HTTP method for the request.
    
    @property up.Request#method
    @param {string} method
    @stable
     */


    /***
    The URL for the request.
    
    @property up.Request#url
    @param {string} url
    @stable
     */


    /***
    [Parameters](/up.Params) that should be sent as the request's payload.
    
    @property up.Request#params
    @param {Object|FormData|string|Array} params
    @stable
     */


    /***
    The CSS selector that will be sent as an `X-Up-Target` header.
    
    @property up.Request#target
    @param {string} target
    @stable
     */


    /***
    The CSS selector that will be sent as an `X-Up-Fail-Target` header.
    
    @property up.Request#failTarget
    @param {string} failTarget
    @stable
     */


    /***
    An object of additional HTTP headers.
    
    @property up.Request#headers
    @param {Object} headers
    @stable
     */


    /***
    A timeout in milliseconds.
    
    If `up.network.config.maxRequests` is set,
    the timeout will not include the time spent waiting in the queue.
    
    @property up.Request#timeout
    @param {Object|undefined} timeout
    @stable
     */


    /***
    Whether to wrap non-standard HTTP methods in a POST request.
    
    If this is set, methods other than GET and POST will be converted to a `POST` request
    and carry their original method as a `_method` parameter. This is to [prevent unexpected redirect behavior](https://makandracards.com/makandra/38347).
    
    Defaults to [`up.network.config`](/up.network.config#config.wrapMethod).
    
    @property up.Request#wrapMethod
    @param {boolean} enabled
    @stable
     */


    /***
    TODO: Docs
    
    @property up.Request#context
    @param {Object} context
    @stable
     */


    /***
    TODO: Docs
    
    @property up.Request#failContext
    @param {Object} context
    @stable
     */


    /***
    TODO: Docs
    
    @property up.Request#mode
    @param {string} mode
    @stable
     */


    /***
    TODO: Docs
    
    @property up.Request#failMode
    @param {string} mode
    @stable
     */


    /***
    TODO: Docs
    
    @property up.Request#contentType
    @param {string} contentType
    @stable
     */


    /***
    TODO: Docs
    
    @property up.Request#payload
    @param {string} payload
    @stable
     */

    Request.prototype.keys = function() {
      return ['method', 'url', 'params', 'target', 'failTarget', 'headers', 'timeout', 'preload', 'cache', 'clearCache', 'layer', 'mode', 'context', 'failLayer', 'failMode', 'failContext', 'origin', 'solo', 'queueTime', 'wrapMethod', 'contentType', 'payload'];
    };


    /***
    Creates a new `up.Request` object.
    
    This will not actually send the request over the network. For that use `up.request()`.
    
    @constructor up.Request
    @param {string} attrs.url
    @param {string} [attrs.method='get']
    @param {up.Params|string|Object|Array} [attrs.params]
    @param {string} [attrs.target]
    @param {string} [attrs.failTarget]
    @param {Object<string, string>} [attrs.headers]
    @param {number} [attrs.timeout]
    @internal
     */

    function Request(options) {
      this.isCrossDomain = bind(this.isCrossDomain, this);
      Request.__super__.constructor.call(this, options);
      this.params = new up.Params(this.params);
      this.state = 'new';
      this.headers || (this.headers = {});
      if (this.preload) {
        this.cache = true;
      }
      if (this.wrapMethod == null) {
        this.wrapMethod = up.network.config.wrapMethod;
      }
      this.layer = up.layer.get(this.layer || this.origin);
      this.failLayer = up.layer.get(this.failLayer || this.layer);
      this.context || (this.context = this.layer.context || {});
      this.failContext || (this.failContext = this.failLayer.context || {});
      this.mode || (this.mode = this.layer.mode);
      this.failMode || (this.failMode = this.failLayer.mode);
      this.normalizeForCaching();
      this.deferred = u.newDeferred();
    }

    Request.delegate(['then', 'catch', 'finally'], 'deferred');

    Request.prototype.normalizeForCaching = function() {
      this.method = u.normalizeMethod(this.method);
      this.extractHashFromURL();
      if (!this.allowsPayload()) {
        return this.transferParamsToURL();
      }
    };

    Request.prototype.evictExpensiveAttrs = function() {
      return u.task((function(_this) {
        return function() {
          _this.layer = void 0;
          _this.failLayer = void 0;
          return _this.origin = void 0;
        };
      })(this));
    };

    Request.prototype.extractHashFromURL = function() {
      var match;
      if (match = this.url.match(/^(.+)(#.+)$/)) {
        this.url = match[1];
        return this.hash = match[2];
      }
    };

    Request.prototype.transferParamsToURL = function() {
      if (!u.isBlank(this.params)) {
        this.url = this.params.toURL(this.url);
        return this.params.clear();
      }
    };

    Request.prototype.isSafe = function() {
      return up.network.isSafeMethod(this.method);
    };

    Request.prototype.allowsPayload = function() {
      return u.methodAllowsPayload(this.method);
    };

    Request.prototype.will302RedirectWithGET = function() {
      return this.isSafe() || this.method === 'POST';
    };

    Request.prototype.willQueue = function() {
      return u.always(this, (function(_this) {
        return function() {
          return _this.evictExpensiveAttrs();
        };
      })(this));
    };

    Request.prototype.load = function() {
      if (this.state !== 'new') {
        return;
      }
      this.state = 'loading';
      return this.xhr = new up.Request.XHRRenderer(this).buildAndSend({
        onload: (function(_this) {
          return function() {
            return _this.onXHRLoad();
          };
        })(this),
        onerror: (function(_this) {
          return function() {
            return _this.onXHRError();
          };
        })(this),
        ontimeout: (function(_this) {
          return function() {
            return _this.onXHRTimeout();
          };
        })(this),
        onabort: (function(_this) {
          return function() {
            return _this.onXHRAbort();
          };
        })(this)
      });
    };

    Request.prototype.loadPage = function() {
      up.network.abort();
      return new up.Request.FormRenderer(this).buildAndSubmit();
    };

    Request.prototype.onXHRLoad = function() {
      var response;
      response = this.extractResponseFromXHR();
      return this.respondWith(response);
    };

    Request.prototype.onXHRError = function() {
      var log;
      log = 'Fatal error during request';
      this.deferred.reject(up.error.failed(log));
      return this.emit('up:request:fatal', {
        log: log
      });
    };

    Request.prototype.onXHRTimeout = function() {
      return this.setAbortedState('Requested timed out');
    };

    Request.prototype.onXHRAbort = function() {
      return this.setAbortedState();
    };

    Request.prototype.abort = function() {
      if (this.setAbortedState() && this.xhr) {
        return this.xhr.abort();
      }
    };

    Request.prototype.setAbortedState = function(reason) {
      if (reason == null) {
        reason = ["Request to %s %s was aborted", this.method, this.url];
      }
      if (!(this.state === 'new' || this.state === 'loading')) {
        return;
      }
      this.state = 'aborted';
      this.emit('up:request:aborted', {
        log: reason
      });
      this.deferred.reject(up.error.aborted(reason));
      return true;
    };

    Request.prototype.respondWith = function(response) {
      var log;
      if (this.state !== 'loading') {
        return;
      }
      this.state = 'loaded';
      log = ['Server responded HTTP %d to %s %s (%d characters)', response.status, this.method, this.url, response.text.length];
      this.emit('up:request:loaded', {
        request: response.request,
        response: response,
        log: log
      });
      if (response.ok) {
        return this.deferred.resolve(response);
      } else {
        return this.deferred.reject(response);
      }
    };

    Request.prototype.csrfHeader = function() {
      return up.protocol.csrfHeader();
    };

    Request.prototype.csrfParam = function() {
      return up.protocol.csrfParam();
    };

    Request.prototype.csrfToken = function() {
      if (!this.isSafe() && !this.isCrossDomain()) {
        return up.protocol.csrfToken();
      }
    };

    Request.prototype.isCrossDomain = function() {
      return u.isCrossDomain(this.url);
    };

    Request.prototype.extractResponseFromXHR = function() {
      var methodFromResponse, responseAttrs, urlFromResponse;
      responseAttrs = {
        method: this.method,
        url: this.url,
        request: this,
        xhr: this.xhr,
        text: this.xhr.responseText,
        status: this.xhr.status,
        title: up.protocol.titleFromXHR(this.xhr),
        target: up.protocol.targetFromXHR(this.xhr),
        acceptLayer: up.protocol.acceptLayerFromXHR(this.xhr),
        dismissLayer: up.protocol.dismissLayerFromXHR(this.xhr),
        eventPlans: up.protocol.eventPlansFromXHR(this.xhr),
        context: up.protocol.contextFromXHR(this.xhr),
        clearCache: up.protocol.clearCacheFromXHR(this.xhr)
      };
      methodFromResponse = up.protocol.methodFromXHR(this.xhr);
      if (urlFromResponse = up.protocol.locationFromXHR(this.xhr)) {
        if (!methodFromResponse && !u.matchURLs(responseAttrs.url, urlFromResponse)) {
          methodFromResponse = 'GET';
        }
        responseAttrs.url = urlFromResponse;
      }
      if (methodFromResponse) {
        responseAttrs.method = methodFromResponse;
      }
      return new up.Response(responseAttrs);
    };

    Request.prototype.isCachable = function() {
      return this.isSafe() && !this.params.hasBinaryValues();
    };

    Request.prototype.cacheKey = function() {
      return JSON.stringify([this.method, this.url, this.params.toQuery(), this.metaProps()]);
    };

    Request.prototype.metaProps = function() {
      var i, key, len, props, ref, value;
      props = {};
      ref = u.evalOption(up.network.config.requestMetaKeys, this);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        value = this[key];
        if (u.isGiven(value)) {
          props[key] = value;
        }
      }
      return props;
    };

    Request.prototype.buildEventEmitter = function(args) {
      return up.EventEmitter.fromEmitArgs(args, {
        request: this,
        layer: this.layer
      });
    };

    Request.prototype.emit = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.buildEventEmitter(args).emit();
    };

    Request.prototype.whenEmitted = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.buildEventEmitter(args).whenEmitted();
    };

    Request.getter('description', function() {
      return this.method + ' ' + this.url;
    });


    /***
    Returns whether the given URL pattern matches this request's URL.
    
    \#\#\# Example
    
    ````javascript
    let request = up.request({ url: '/foo/123' })
    request.testURL('/foo/*') // returns true
    request.testURL('/bar/*') // returns false
    ```
    
    @property up.Request#testURL
    @param {string} pattern
    @return {boolean}
    @experimental
     */

    Request.prototype.testURL = function(pattern) {
      return new up.URLPattern(pattern).test(this.url);
    };

    return Request;

  })(up.Record);

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Request.Cache = (function(superClass) {
    extend(Cache, superClass);

    function Cache() {
      return Cache.__super__.constructor.apply(this, arguments);
    }

    Cache.prototype.maxSize = function() {
      return up.network.config.cacheSize;
    };

    Cache.prototype.expiryMillis = function() {
      return up.network.config.cacheExpiry;
    };

    Cache.prototype.normalizeStoreKey = function(request) {
      return up.Request.wrap(request).cacheKey();
    };

    Cache.prototype.isCachable = function(request) {
      return up.Request.wrap(request).isCachable();
    };

    Cache.prototype.clear = function(pattern) {
      if (pattern && pattern !== '*' && pattern !== true) {
        pattern = new up.URLPattern(pattern);
        return this.each((function(_this) {
          return function(key, request) {
            if (pattern.test(request.url)) {
              return _this.store.remove(key);
            }
          };
        })(this));
      } else {
        return Cache.__super__.clear.call(this);
      }
    };

    return Cache;

  })(up.Cache);

}).call(this);
(function() {
  var HTML_FORM_METHODS, e, u;

  u = up.util;

  e = up.element;

  HTML_FORM_METHODS = ['GET', 'POST'];

  up.Request.FormRenderer = (function() {
    function FormRenderer(request) {
      this.request = request;
    }

    FormRenderer.prototype.buildAndSubmit = function() {
      var action, contentType, csrfParam, csrfToken, method, paramsFromQuery;
      this.params = u.copy(this.request.params);
      action = this.request.url;
      method = this.request.method;
      paramsFromQuery = up.Params.fromURL(action);
      this.params.addAll(paramsFromQuery);
      action = up.Params.stripURL(action);
      if (!u.contains(HTML_FORM_METHODS, method)) {
        method = up.protocol.wrapMethod(method, this.params);
      }
      this.form = e.affix(document.body, 'form.up-request-loader', {
        method: method,
        action: action
      });
      if (contentType = this.request.contentType) {
        this.form.setAttribute('enctype', contentType);
      }
      if ((csrfParam = this.request.csrfParam()) && (csrfToken = this.request.csrfToken())) {
        this.params.add(csrfParam, csrfToken);
      }
      u.each(this.params.toArray(), this.addField.bind(this));
      return up.browser.submitForm(this.form);
    };

    FormRenderer.prototype.addField = function(attrs) {
      return e.affix(this.form, 'input[type=hidden]', attrs);
    };

    return FormRenderer;

  })();

}).call(this);
(function() {
  var u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.Request.Queue = (function(superClass) {
    extend(Queue, superClass);

    function Queue(options) {
      var ref, ref1;
      if (options == null) {
        options = {};
      }
      this.checkSlow = bind(this.checkSlow, this);
      this.concurrency = (ref = options.concurrency) != null ? ref : function() {
        return up.network.config.concurrency;
      };
      this.badResponseTime = (ref1 = options.badResponseTime) != null ? ref1 : function() {
        return up.network.config.badResponseTime;
      };
      this.reset();
    }

    Queue.prototype.reset = function() {
      this.queuedRequests = [];
      this.currentRequests = [];
      clearTimeout(this.checkSlowTimout);
      return this.emittedSlow = false;
    };

    Queue.getter('allRequests', function() {
      return this.currentRequests.concat(this.queuedRequests);
    });

    Queue.prototype.asap = function(request) {
      request.willQueue();
      u.always(request, (function(_this) {
        return function(responseOrError) {
          return _this.onRequestSettled(request, responseOrError);
        };
      })(this));
      request.queueTime = new Date();
      this.setSlowTimer();
      if (this.hasConcurrencyLeft()) {
        return this.sendRequestNow(request);
      } else {
        return this.queueRequest(request);
      }
    };

    Queue.prototype.promoteToForeground = function(request) {
      if (request.preload) {
        request.preload = false;
        return this.setSlowTimer();
      }
    };

    Queue.prototype.setSlowTimer = function() {
      var badResponseTime;
      badResponseTime = u.evalOption(this.badResponseTime);
      return this.checkSlowTimout = setTimeout(this.checkSlow, badResponseTime);
    };

    Queue.prototype.hasConcurrencyLeft = function() {
      var maxConcurrency;
      maxConcurrency = u.evalOption(this.concurrency);
      return maxConcurrency === -1 || this.currentRequests.length < maxConcurrency;
    };

    Queue.prototype.isBusy = function() {
      return this.currentRequests.length > 0;
    };

    Queue.prototype.queueRequest = function(request) {
      return this.queuedRequests.push(request);
    };

    Queue.prototype.pluckNextRequest = function() {
      var request;
      request = u.find(this.queuedRequests, function(request) {
        return !request.preload;
      });
      request || (request = this.queuedRequests[0]);
      return u.remove(this.queuedRequests, request);
    };

    Queue.prototype.sendRequestNow = function(request) {
      if (request.preload && !up.network.shouldPreload(request)) {
        return request.abort('Preloading is disabled');
      } else if (request.emit('up:request:load', {
        log: ['Loading %s %s', request.method, request.url]
      }).defaultPrevented) {
        return request.abort('Prevented by event listener');
      } else {
        request.normalizeForCaching();
        this.currentRequests.push(request);
        return request.load();
      }
    };

    Queue.prototype.onRequestSettled = function(request, responseOrError) {
      u.remove(this.currentRequests, request);
      if ((responseOrError instanceof up.Response) && responseOrError.ok) {
        up.network.registerAliasForRedirect(request, responseOrError);
      }
      this.checkSlow();
      return u.microtask((function(_this) {
        return function() {
          return _this.poke();
        };
      })(this));
    };

    Queue.prototype.poke = function() {
      var request;
      if (this.hasConcurrencyLeft() && (request = this.pluckNextRequest())) {
        return this.sendRequestNow(request);
      }
    };

    Queue.prototype.abort = function(conditions) {
      var i, len, list, matches, ref;
      if (conditions == null) {
        conditions = true;
      }
      ref = [this.currentRequests, this.queuedRequests];
      for (i = 0, len = ref.length; i < len; i++) {
        list = ref[i];
        matches = u.filter(list, (function(_this) {
          return function(request) {
            return _this.requestMatches(request, conditions);
          };
        })(this));
        matches.forEach(function(match) {
          match.abort();
          return u.remove(list, match);
        });
        return;
      }
    };

    Queue.prototype.abortExcept = function(excusedRequest, additionalConditions) {
      if (additionalConditions == null) {
        additionalConditions = true;
      }
      return this.abort(function(queuedRequest) {
        return queuedRequest !== excusedRequest && u.evalOption(additionalConditions, queuedRequest);
      });
    };

    Queue.prototype.requestMatches = function(request, conditions) {
      return request === conditions || u.evalOption(conditions, request);
    };

    Queue.prototype.checkSlow = function() {
      var currentSlow;
      currentSlow = this.isSlow();
      if (this.emittedSlow !== currentSlow) {
        this.emittedSlow = currentSlow;
        if (currentSlow) {
          return up.emit('up:request:late', {
            log: 'Server is slow to respond'
          });
        } else {
          return up.emit('up:network:recover', {
            log: 'Slow requests were loaded'
          });
        }
      }
    };

    Queue.prototype.isSlow = function() {
      var allForegroundRequests, delay, now, timerTolerance;
      now = new Date();
      delay = u.evalOption(this.badResponseTime);
      allForegroundRequests = u.reject(this.allRequests, 'preload');
      timerTolerance = 1;
      return u.some(allForegroundRequests, function(request) {
        return (now - request.queueTime) >= (delay - timerTolerance);
      });
    };

    return Queue;

  })(up.Class);

}).call(this);
(function() {
  var CONTENT_TYPE_FORM_DATA, CONTENT_TYPE_URL_ENCODED, u;

  CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';

  CONTENT_TYPE_FORM_DATA = 'multipart/form-data';

  u = up.util;

  up.Request.XHRRenderer = (function() {
    function XHRRenderer(request) {
      this.request = request;
    }

    XHRRenderer.prototype.buildAndSend = function(handlers) {
      var contentType, csrfHeader, csrfToken, header, key, ref, ref1, value;
      this.xhr = new XMLHttpRequest();
      this.params = u.copy(this.request.params);
      this.xhr.timeout = this.request.timeout;
      this.xhr.open(this.getMethod(), this.request.url);
      ref = this.request.metaProps();
      for (key in ref) {
        value = ref[key];
        header = up.protocol.headerize(key);
        this.addHeader(header, value);
      }
      ref1 = this.request.headers;
      for (header in ref1) {
        value = ref1[header];
        this.addHeader(header, value);
      }
      if ((csrfHeader = this.request.csrfHeader()) && (csrfToken = this.request.csrfToken())) {
        this.addHeader(csrfHeader, csrfToken);
      }
      this.addHeader(up.protocol.headerize('version'), up.version);
      if (contentType = this.getContentType()) {
        this.addHeader('Content-Type', contentType);
      }
      u.assign(this.xhr, handlers);
      this.xhr.send(this.getPayload());
      return this.xhr;
    };

    XHRRenderer.prototype.getMethod = function() {
      if (!this.method) {
        this.method = this.request.method;
        if (this.request.wrapMethod && !this.request.will302RedirectWithGET()) {
          this.method = up.protocol.wrapMethod(this.method, this.params);
        }
      }
      return this.method;
    };

    XHRRenderer.prototype.getContentType = function() {
      this.finalizePayload();
      return this.contentType;
    };

    XHRRenderer.prototype.getPayload = function() {
      this.finalizePayload();
      return this.payload;
    };

    XHRRenderer.prototype.addHeader = function(header, value) {
      if (u.isOptions(value) || u.isArray(value)) {
        value = JSON.stringify(value);
      }
      return this.xhr.setRequestHeader(header, value);
    };

    XHRRenderer.prototype.finalizePayload = function() {
      if (this.payloadFinalized) {
        return;
      }
      this.payloadFinalized = true;
      this.payload = this.request.payload;
      this.contentType = this.request.contentType;
      if (!this.payload && this.request.allowsPayload()) {
        if (!this.contentType) {
          this.contentType = this.params.hasBinaryValues() ? CONTENT_TYPE_FORM_DATA : CONTENT_TYPE_URL_ENCODED;
        }
        if (this.contentType === CONTENT_TYPE_FORM_DATA) {
          this.contentType = null;
          return this.payload = this.params.toFormData();
        } else {
          return this.payload = this.params.toQuery().replace(/%20/g, '+');
        }
      }
    };

    return XHRRenderer;

  })();

}).call(this);
(function() {
  var u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;


  /***
  Instances of `up.Response` describe the server response to an [`AJAX request`](/up.request).
  
  \#\#\# Example
  
      up.request('/foo').then(function(response) {
        console.log(response.status) // 200
        console.log(response.text)   // "<html><body>..."
      })
  
  @class up.Response
   */

  up.Response = (function(superClass) {
    extend(Response, superClass);

    function Response() {
      return Response.__super__.constructor.apply(this, arguments);
    }


    /***
    The HTTP method used for the request that produced this response.
    
    This is usually the HTTP method used by the initial request, but if the server
    redirected multiple requests may have been involved. In this case this property reflects
    the method used by the last request.
    
    If the response's URL changed from the request's URL,
    Unpoly will assume a redirect and set the method to `GET`.
    Also see the `X-Up-Method` header.
    
    @property up.Response#method
    @param {string} method
    @stable
     */


    /***
    The URL used for the response.
    
    This is usually the requested URL, or the final URL after the server redirected.
    
    On Internet Explorer 11 this property is only set when the server sends an `X-Up-Location` header.
    
    @property up.Response#url
    @param {string} url
    @stable
     */


    /***
    The response body as a `string`.
    
    @property up.Response#text
    @param {string} text
    @stable
     */


    /***
    The response's
    [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
    as a `number`.
    
    A successful response will usually have a `200` or `201' status code.
    
    @property up.Response#status
    @param {number} status
    @stable
     */


    /***
    The original [request](/up.Request) that triggered this response.
    
    @property up.Response#request
    @param {up.Request} request
    @experimental
     */


    /***
    The [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
    object that was used to create this response.
    
    @property up.Response#xhr
    @param {XMLHttpRequest} xhr
    @experimental
     */


    /***
    A [document title pushed by the server](/X-Up-Title).
    
    If the server pushed no title via HTTP header, this will be `undefined`.
    
    @property up.Response#title
    @param {string} [title]
    @experimental
     */


    /***
    A [render target pushed by the server](/X-Up-Target).
    
    If the server pushed no title via HTTP header, this will be `undefined`.
    
    @property up.Response#target
    @param {string} [target]
    @experimental
     */

    Response.prototype.keys = function() {
      return ['method', 'url', 'text', 'status', 'request', 'xhr', 'target', 'title', 'acceptLayer', 'dismissLayer', 'eventPlans', 'context', 'clearCache', 'headers'];
    };

    Response.prototype.defaults = function() {
      return {
        headers: {}
      };
    };


    /***
    Returns whether the server responded with a 2xx HTTP status.
    
    @property up.Response#ok
    @param {boolean} ok
    @stable
     */

    Response.getter('ok', function() {
      return this.status && (this.status >= 200 && this.status <= 299);
    });


    /***
    Returns the HTTP header value with the given name.
    
    The search for the header name is case-insensitive.
    
    Returns `undefined` if the given header name was not included in the response.
    
    @function up.Response#getHeader
    @param {string} name
    @return {string|undefined} value
    @experimental
     */

    Response.prototype.getHeader = function(name) {
      var ref;
      return this.headers[name] || ((ref = this.xhr) != null ? ref.getResponseHeader(name) : void 0);
    };


    /***
    The response's [content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type).
    
    @property up.Response#contentType
    @param {string} contentType
    @experimental
     */

    Response.getter('contentType', function() {
      return this.getHeader('Content-Type');
    });


    /***
    The response body parsed as a JSON string.
    
    The parsed JSON object is cached with the response object,
    so multiple accesses will call `JSON.parse()` only once.
    
    \#\#\# Example
    
        response = await up.request('/profile.json')
        console.log("User name is " + response.json.name)
    
    @property up.Response#json
    @param {Object} json
    @stable
     */

    Response.getter('json', function() {
      return this.parsedJSON || (this.parsedJSON = JSON.parse(this.text));
    });

    return Response;

  })(up.Record);

}).call(this);
(function() {
  var e, u;

  u = up.util;

  e = up.element;

  up.ResponseDoc = (function() {
    function ResponseDoc(options) {
      this.noscriptWrapper = new up.HTMLWrapper('noscript');
      this.scriptStripper = new up.HTMLWrapper('script');
      this.root = this.parseDocument(options) || this.parseFragment(options) || this.parseContent(options);
    }

    ResponseDoc.prototype.parseDocument = function(options) {
      return this.parse(options.document, e.createDocumentFromHTML);
    };

    ResponseDoc.prototype.parseContent = function(options) {
      var content, matchingElement, target;
      content = options.content || '';
      target = options.target || up.fail("must pass a { target } when passing { content }");
      matchingElement = e.createFromSelector(target);
      if (u.isString(content)) {
        content = this.wrapHTML(content);
        matchingElement.innerHTML = content;
      } else {
        matchingElement.appendChild(content);
      }
      return matchingElement;
    };

    ResponseDoc.prototype.parseFragment = function(options) {
      return this.parse(options.fragment);
    };

    ResponseDoc.prototype.parse = function(value, parseFn) {
      if (parseFn == null) {
        parseFn = e.createFromHTML;
      }
      if (u.isString(value)) {
        value = this.wrapHTML(value);
        value = parseFn(value);
      }
      return value;
    };

    ResponseDoc.prototype.rootSelector = function() {
      return up.fragment.toTarget(this.root);
    };

    ResponseDoc.prototype.wrapHTML = function(html) {
      html = this.noscriptWrapper.wrap(html);
      html = this.scriptStripper.strip(html);
      return html;
    };

    ResponseDoc.prototype.getTitle = function() {
      var ref;
      if (!this.titleParsed) {
        this.title = (ref = this.root.querySelector("head title")) != null ? ref.textContent : void 0;
        this.titleParsed = true;
      }
      return this.title;
    };

    ResponseDoc.prototype.select = function(selector) {
      return up.fragment.subtree(this.root, selector, {
        layer: 'any'
      })[0];
    };

    ResponseDoc.prototype.finalizeElement = function(element) {
      return this.noscriptWrapper.unwrap(element);
    };

    return ResponseDoc;

  })();

}).call(this);
(function() {
  var e, u;

  e = up.element;

  u = up.util;

  up.RevealMotion = (function() {
    function RevealMotion(element, options) {
      var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, viewportConfig;
      this.element = element;
      this.options = options != null ? options : {};
      viewportConfig = up.viewport.config;
      this.viewport = e.get(this.options.viewport) || up.viewport.get(this.element);
      this.obstructionsLayer = up.layer.get(this.viewport);
      this.snap = (ref = (ref1 = this.options.snap) != null ? ref1 : this.options.revealSnap) != null ? ref : viewportConfig.revealSnap;
      this.padding = (ref2 = (ref3 = this.options.padding) != null ? ref3 : this.options.revealPadding) != null ? ref2 : viewportConfig.revealPadding;
      this.top = (ref4 = (ref5 = this.options.top) != null ? ref5 : this.options.revealTop) != null ? ref4 : viewportConfig.revealTop;
      this.max = u.evalOption((ref6 = (ref7 = this.options.max) != null ? ref7 : this.options.revealMax) != null ? ref6 : viewportConfig.revealMax);
      this.topObstructions = viewportConfig.fixedTop;
      this.bottomObstructions = viewportConfig.fixedBottom;
    }

    RevealMotion.prototype.start = function() {
      var diff, elementRect, newScrollTop, originalScrollTop, viewportRect;
      viewportRect = this.getViewportRect(this.viewport);
      elementRect = up.Rect.fromElement(this.element);
      if (this.max) {
        elementRect.height = Math.min(elementRect.height, this.max);
      }
      this.addPadding(elementRect);
      this.substractObstructions(viewportRect);
      if (viewportRect.height <= 0) {
        return up.error.failed.async('Viewport has no visible area');
      }
      originalScrollTop = this.viewport.scrollTop;
      newScrollTop = originalScrollTop;
      if (this.top || elementRect.height > viewportRect.height) {
        diff = elementRect.top - viewportRect.top;
        newScrollTop += diff;
      } else if (elementRect.top < viewportRect.top) {
        newScrollTop -= viewportRect.top - elementRect.top;
      } else if (elementRect.bottom > viewportRect.bottom) {
        newScrollTop += elementRect.bottom - viewportRect.bottom;
      } else {

      }
      if (u.isNumber(this.snap) && newScrollTop < this.snap && elementRect.top < (0.5 * viewportRect.height)) {
        newScrollTop = 0;
      }
      if (newScrollTop !== originalScrollTop) {
        return this.scrollTo(newScrollTop);
      } else {
        return Promise.resolve();
      }
    };

    RevealMotion.prototype.scrollTo = function(newScrollTop) {
      this.scrollMotion = new up.ScrollMotion(this.viewport, newScrollTop, this.options);
      return this.scrollMotion.start();
    };

    RevealMotion.prototype.getViewportRect = function() {
      if (up.viewport.isRoot(this.viewport)) {
        return new up.Rect({
          left: 0,
          top: 0,
          width: up.viewport.rootWidth(),
          height: up.viewport.rootHeight()
        });
      } else {
        return up.Rect.fromElement(this.viewport);
      }
    };

    RevealMotion.prototype.addPadding = function(elementRect) {
      elementRect.top -= this.padding;
      return elementRect.height += 2 * this.padding;
    };

    RevealMotion.prototype.selectObstructions = function(selectors) {
      return up.fragment.all(selectors.join(','), {
        layer: this.obstructionsLayer
      });
    };

    RevealMotion.prototype.substractObstructions = function(viewportRect) {
      var diff, i, j, len, len1, obstruction, obstructionRect, ref, ref1, results;
      ref = this.selectObstructions(this.topObstructions);
      for (i = 0, len = ref.length; i < len; i++) {
        obstruction = ref[i];
        obstructionRect = up.Rect.fromElement(obstruction);
        diff = obstructionRect.bottom - viewportRect.top;
        if (diff > 0) {
          viewportRect.top += diff;
          viewportRect.height -= diff;
        }
      }
      ref1 = this.selectObstructions(this.bottomObstructions);
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        obstruction = ref1[j];
        obstructionRect = up.Rect.fromElement(obstruction);
        diff = viewportRect.bottom - obstructionRect.top;
        if (diff > 0) {
          results.push(viewportRect.height -= diff);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    RevealMotion.prototype.finish = function() {
      var ref;
      return (ref = this.scrollMotion) != null ? ref.finish() : void 0;
    };

    return RevealMotion;

  })();

}).call(this);
(function() {
  var u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  up.ScrollMotion = (function() {
    var SPEED_CALIBRATION;

    SPEED_CALIBRATION = 0.065;

    function ScrollMotion(scrollable, targetTop, options) {
      var ref, ref1, ref2, ref3;
      this.scrollable = scrollable;
      this.targetTop = targetTop;
      if (options == null) {
        options = {};
      }
      this.finish = bind(this.finish, this);
      this.abort = bind(this.abort, this);
      this.animationFrame = bind(this.animationFrame, this);
      this.start = bind(this.start, this);
      this.behavior = (ref = (ref1 = options.behavior) != null ? ref1 : options.scrollBehavior) != null ? ref : 'auto';
      this.speed = ((ref2 = (ref3 = options.speed) != null ? ref3 : options.scrollSpeed) != null ? ref2 : up.viewport.config.scrollSpeed) * SPEED_CALIBRATION;
    }

    ScrollMotion.prototype.start = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
          if (_this.behavior === 'smooth' && up.motion.isEnabled()) {
            return _this.startAnimation();
          } else {
            return _this.finish();
          }
        };
      })(this));
    };

    ScrollMotion.prototype.startAnimation = function() {
      this.startTime = Date.now();
      this.startTop = this.scrollable.scrollTop;
      this.topDiff = this.targetTop - this.startTop;
      this.duration = Math.sqrt(Math.abs(this.topDiff)) / this.speed;
      return requestAnimationFrame(this.animationFrame);
    };

    ScrollMotion.prototype.animationFrame = function() {
      var currentTime, timeElapsed, timeFraction;
      if (this.settled) {
        return;
      }
      if (this.frameTop && Math.abs(this.frameTop - this.scrollable.scrollTop) > 1.5) {
        this.abort('Animation aborted due to user intervention');
      }
      currentTime = Date.now();
      timeElapsed = currentTime - this.startTime;
      timeFraction = Math.min(timeElapsed / this.duration, 1);
      this.frameTop = this.startTop + (u.simpleEase(timeFraction) * this.topDiff);
      if (Math.abs(this.targetTop - this.frameTop) < 0.3) {
        return this.finish();
      } else {
        this.scrollable.scrollTop = this.frameTop;
        return requestAnimationFrame(this.animationFrame);
      }
    };

    ScrollMotion.prototype.abort = function(reason) {
      this.settled = true;
      return this.reject(up.error.aborted(reason));
    };

    ScrollMotion.prototype.finish = function() {
      this.settled = true;
      this.scrollable.scrollTop = this.targetTop;
      return this.resolve();
    };

    return ScrollMotion;

  })();

}).call(this);
(function() {
  var e, u;

  e = up.element;

  u = up.util;

  up.Selector = (function() {
    function Selector(selector, filters) {
      this.selector = selector;
      this.filters = filters != null ? filters : [];
    }

    Selector.prototype.matches = function(element) {
      return e.matches(element, this.selector) && this.passesFilter(element);
    };

    Selector.prototype.closest = function(element) {
      var parentElement;
      if (this.matches(element)) {
        return element;
      } else if ((parentElement = element.parentElement)) {
        return this.closest(parentElement);
      }
    };

    Selector.prototype.passesFilter = function(element) {
      return u.every(this.filters, function(filter) {
        return filter(element);
      });
    };

    Selector.prototype.descendants = function(root) {
      var results;
      results = e.all(root, this.selector);
      return u.filter(results, (function(_this) {
        return function(element) {
          return _this.passesFilter(element);
        };
      })(this));
    };

    Selector.prototype.subtree = function(root) {
      var results;
      results = [];
      if (this.matches(root)) {
        results.push(root);
      }
      results.push.apply(results, this.descendants(root));
      return results;
    };

    return Selector;

  })();

}).call(this);
(function() {
  var u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  up.store || (up.store = {});

  u = up.util;

  up.store.Memory = (function() {
    function Memory() {
      this.values = bind(this.values, this);
      this.size = bind(this.size, this);
      this.keys = bind(this.keys, this);
      this.remove = bind(this.remove, this);
      this.set = bind(this.set, this);
      this.get = bind(this.get, this);
      this.clear = bind(this.clear, this);
      this.clear();
    }

    Memory.prototype.clear = function() {
      return this.data = {};
    };

    Memory.prototype.get = function(key) {
      return this.data[key];
    };

    Memory.prototype.set = function(key, value) {
      return this.data[key] = value;
    };

    Memory.prototype.remove = function(key) {
      return delete this.data[key];
    };

    Memory.prototype.keys = function() {
      return Object.keys(this.data);
    };

    Memory.prototype.size = function() {
      return this.keys().length;
    };

    Memory.prototype.values = function() {
      return u.values(this.data);
    };

    return Memory;

  })();

}).call(this);
(function() {
  var u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = up.util;

  up.store.Session = (function(superClass) {
    extend(Session, superClass);

    function Session(rootKey) {
      this.saveToSessionStorage = bind(this.saveToSessionStorage, this);
      this.loadFromSessionStorage = bind(this.loadFromSessionStorage, this);
      this.remove = bind(this.remove, this);
      this.set = bind(this.set, this);
      this.clear = bind(this.clear, this);
      this.rootKey = rootKey;
      this.loadFromSessionStorage();
    }

    Session.prototype.clear = function() {
      Session.__super__.clear.call(this);
      return this.saveToSessionStorage();
    };

    Session.prototype.set = function(key, value) {
      Session.__super__.set.call(this, key, value);
      return this.saveToSessionStorage();
    };

    Session.prototype.remove = function(key) {
      Session.__super__.remove.call(this, key);
      return this.saveToSessionStorage();
    };

    Session.prototype.loadFromSessionStorage = function() {
      var raw;
      try {
        if (raw = typeof sessionStorage !== "undefined" && sessionStorage !== null ? sessionStorage.getItem(this.rootKey) : void 0) {
          this.data = JSON.parse(raw);
        }
      } catch (error) {

      }
      return this.data || (this.data = {});
    };

    Session.prototype.saveToSessionStorage = function() {
      var json;
      json = JSON.stringify(this.data);
      try {
        return typeof sessionStorage !== "undefined" && sessionStorage !== null ? sessionStorage.setItem(this.rootKey, json) : void 0;
      } catch (error) {

      }
    };

    return Session;

  })(up.store.Memory);

}).call(this);
(function() {
  var e, u,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  u = up.util;

  e = up.element;

  up.Tether = (function() {
    function Tether(options) {
      this.sync = bind(this.sync, this);
      this.scheduleSync = bind(this.scheduleSync, this);
      var base;
      if (typeof (base = up.legacy).handleTetherOptions === "function") {
        base.handleTetherOptions(options);
      }
      this.anchor = options.anchor;
      this.align = options.align;
      this.position = options.position;
      this.alignAxis = this.position === 'top' || this.position === 'bottom' ? 'horizontal' : 'vertical';
      this.viewport = up.viewport.get(this.anchor);
      this.parent = this.viewport === e.root ? document.body : this.viewport;
      this.syncOnScroll = !this.viewport.contains(this.anchor.offsetParent);
    }

    Tether.prototype.start = function(element) {
      this.element = element;
      this.element.style.position = 'absolute';
      this.setOffset(0, 0);
      this.sync();
      return this.changeEventSubscription('on');
    };

    Tether.prototype.stop = function() {
      return this.changeEventSubscription('off');
    };

    Tether.prototype.changeEventSubscription = function(fn) {
      up[fn](window, 'resize', this.scheduleSync);
      if (this.syncOnScroll) {
        return up[fn](this.viewport, 'scroll', this.scheduleSync);
      }
    };

    Tether.prototype.scheduleSync = function() {
      clearTimeout(this.syncTimer);
      return this.syncTimer = u.task(this.sync);
    };

    Tether.prototype.isDetached = function() {
      return e.isDetached(this.parent) || e.isDetached(this.anchor);
    };

    Tether.prototype.sync = function() {
      var anchorBox, elementBox, left, top;
      elementBox = this.element.getBoundingClientRect();
      anchorBox = this.anchor.getBoundingClientRect();
      left = void 0;
      top = void 0;
      switch (this.alignAxis) {
        case 'horizontal':
          top = (function() {
            switch (this.position) {
              case 'top':
                return anchorBox.top - elementBox.height;
              case 'bottom':
                return anchorBox.top + anchorBox.height;
            }
          }).call(this);
          left = (function() {
            switch (this.align) {
              case 'left':
                return anchorBox.left;
              case 'center':
                return anchorBox.left + 0.5 * (anchorBox.width - elementBox.width);
              case 'right':
                return anchorBox.left + anchorBox.width - elementBox.width;
            }
          }).call(this);
          break;
        case 'vertical':
          top = (function() {
            switch (this.align) {
              case 'top':
                return anchorBox.top;
              case 'center':
                return anchorBox.top + 0.5 * (anchorBox.height - elementBox.height);
              case 'bottom':
                return anchorBox.top + anchorBox.height - elementBox.height;
            }
          }).call(this);
          left = (function() {
            switch (this.position) {
              case 'left':
                return anchorBox.left - elementBox.width;
              case 'right':
                return anchorBox.left + anchorBox.width;
            }
          }).call(this);
      }
      if (u.isDefined(left) || u.isDefined(top)) {
        return this.moveTo(left, top);
      } else {
        return up.fail('Invalid tether constraints: %o', this.describeConstraints());
      }
    };

    Tether.prototype.describeConstraints = function() {
      return {
        position: this.position,
        align: this.align
      };
    };

    Tether.prototype.moveTo = function(targetLeft, targetTop) {
      var elementBox;
      elementBox = this.element.getBoundingClientRect();
      return this.setOffset(targetLeft - elementBox.left + this.offsetLeft, targetTop - elementBox.top + this.offsetTop);
    };

    Tether.prototype.setOffset = function(left, top) {
      this.offsetLeft = left;
      this.offsetTop = top;
      return e.setStyle(this.element, {
        left: left,
        top: top
      });
    };

    return Tether;

  })();

}).call(this);
(function() {
  var u;

  u = up.util;

  up.URLPattern = (function() {
    function URLPattern(fullPattern, normalizeURL) {
      var negativeList, positiveList;
      this.normalizeURL = normalizeURL != null ? normalizeURL : u.normalizeURL;
      this.groups = [];
      positiveList = [];
      negativeList = [];
      u.splitValues(fullPattern).forEach(function(pattern) {
        if (pattern[0] === '-') {
          return negativeList.push(pattern.substring(1));
        } else {
          return positiveList.push(pattern);
        }
      });
      this.positiveRegexp = this.buildRegexp(positiveList, true);
      this.negativeRegexp = this.buildRegexp(negativeList, false);
    }

    URLPattern.prototype.buildRegexp = function(list, capture) {
      var reCode;
      if (!list.length) {
        return;
      }
      reCode = list.map(this.normalizeURL).map(u.escapeRegExp).join('|');
      reCode = reCode.replace(/\\\*/g, '.*?');
      reCode = reCode.replace(/(\:|\\\$)([a-z][\w-]*)/ig, (function(_this) {
        return function(match, type, name) {
          if (type === '\\$') {
            if (capture) {
              _this.groups.push({
                name: name,
                cast: Number
              });
            }
            return '(\\d+)';
          } else {
            if (capture) {
              _this.groups.push({
                name: name,
                cast: String
              });
            }
            return '([^/?#]+)';
          }
        };
      })(this));
      return new RegExp('^' + reCode + '$');
    };

    URLPattern.prototype.test = function(url, doNormalize) {
      if (doNormalize == null) {
        doNormalize = true;
      }
      if (doNormalize) {
        url = this.normalizeURL(url);
      }
      return this.positiveRegexp.test(url) && !this.isExcluded(url);
    };

    URLPattern.prototype.recognize = function(url, doNormalize) {
      var match, resolution;
      if (doNormalize == null) {
        doNormalize = true;
      }
      if (doNormalize) {
        url = this.normalizeURL(url);
      }
      if ((match = this.positiveRegexp.exec(url)) && !this.isExcluded(url)) {
        resolution = {};
        this.groups.forEach((function(_this) {
          return function(group, groupIndex) {
            var value;
            if (value = match[groupIndex + 1]) {
              return resolution[group.name] = group.cast(value);
            }
          };
        })(this));
        return resolution;
      }
    };

    URLPattern.prototype.isExcluded = function(url) {
      var ref;
      return (ref = this.negativeRegexp) != null ? ref.test(url) : void 0;
    };

    return URLPattern;

  })();

}).call(this);

/***
@module up.framework
 */

(function() {
  up.framework = (function() {
    var boot, emitReset, isBooting, u;
    u = up.util;
    isBooting = true;

    /***
    Resets Unpoly to the state when it was booted.
    All custom event handlers, animations, etc. that have been registered
    will be discarded.
    
    Emits event [`up:framework:reset`](/up:framework:reset).
    
    @function up.framework.reset
    @internal
     */
    emitReset = function() {
      return up.emit('up:framework:reset', {
        log: false
      });
    };

    /***
    This event is [emitted](/up.emit) when Unpoly is [reset](/up.framework.reset) during unit tests.
    
    @event up:framework:reset
    @internal
     */

    /***
    Boots the Unpoly framework.
    
    **This is called automatically** by including the Unpoly JavaScript files.
    
    Unpoly will not boot if the current browser is [not supported](/up.browser.isSupported).
    This leaves you with a classic server-side application on legacy browsers.
    
    @function up.boot
    @internal
     */
    boot = function() {
      if (up.browser.isSupported()) {
        up.emit('up:framework:boot', {
          log: false
        });
        up.emit('up:framework:booted', {
          log: false
        });
        isBooting = false;
        return up.event.onReady(function() {
          return u.task(function() {
            up.emit('up:app:boot', {
              log: 'Booting user application'
            });
            return up.emit('up:app:booted', {
              log: 'User application booted'
            });
          });
        });
      } else {
        return typeof console.log === "function" ? console.log("Unpoly doesn't support this browser. Framework was not booted.") : void 0;
      }
    };
    return {
      reset: emitReset,
      boot: boot,
      isBooting: function() {
        return isBooting;
      }
    };
  })();

}).call(this);

/***
Events
======

Most Unpoly interactions emit DOM events that are prefixed with `up:`.

    document.addEventListener('up:modal:opened', (event) => {
      console.log('A new modal has just opened!')
    })

Events often have both present and past forms. For example,
`up:modal:open` is emitted before a modal starts to open.
`up:modal:opened` is emitted when the modal has finished its
opening animation.

\#\#\# Preventing events

You can prevent most present form events by calling `preventDefault()`:

    document.addEventListener('up:modal:open', (event) => {
      if (event.url == '/evil') {
        // Prevent the modal from opening
        event.preventDefault()
      }
    })


\#\#\# A better way to bind event listeners

Instead of using [`Element#addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener),
you may find it convenient to use [`up.on()`](/up.on) instead:

    up.on('click', 'button', function(event, button, data) {
      // button is the clicked element
      // data is the parsed [`up-data`](/up-data) attribute
    })

There are some advantages to using `up.on()`:

  - You may pass a selector for [event delegation](https://davidwalsh.name/event-delegate).
  - The event target is automatically passed as a second argument.
  - You may register a listener to multiple events by passing a space-separated list of event name (e.g. `"click mousedown"`).
  - You may register a listener to multiple elements in a single `up.on()` call, by passing a [list](/up.util.isList) of elements.
  - You may use an [`[up-data]`](/up-data) attribute to [attach structured data](/up.on#attaching-structured-data)
    to observed elements. If an `[up-data]` attribute is set, its value will automatically be
    parsed as JSON and passed as a third argument.
  - Event listeners on [unsupported browsers](/up.browser.isSupported) are silently discarded,
    leaving you with an application without JavaScript. This is typically preferable to
    a soup of randomly broken JavaScript in ancient browsers.

@module up.event
 */

(function() {
  var slice = [].slice;

  up.event = (function() {
    var $bind, bind, bindNow, build, buildEmitter, e, emit, escapePressed, executeEmitAttr, fork, halt, isUnmodified, keyModifiers, nobodyPrevents, onEscape, onReady, reset, u, unbind, whenEmitted;
    u = up.util;
    e = up.element;
    reset = function() {
      var element, i, len, ref, results;
      ref = [window, document, e.root, document.body];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        results.push(up.EventListener.unbindNonDefault(element));
      }
      return results;
    };

    /***
    Listens to a [DOM event](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events)
    on `document` or a given element.
    
    `up.on()` has some quality of life improvements over
    [`Element#addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener):
    
    - You may pass a selector for [event delegation](https://davidwalsh.name/event-delegate).
    - The event target is automatically passed as a second argument.
    - You may register a listener to multiple events by passing a space-separated list of event name (e.g. `"click mousedown"`)
    - You may register a listener to multiple elements in a single `up.on()` call, by passing a [list](/up.util.isList) of elements.
    - You use an [`[up-data]`](/up-data) attribute to [attach structured data](/up.on#attaching-structured-data)
      to observed elements. If an `[up-data]` attribute is set, its value will automatically be
      parsed as JSON and passed as a third argument.
    - Event listeners on [unsupported browsers](/up.browser.isSupported) are silently discarded,
      leaving you with an application without JavaScript. This is typically preferable to
      a soup of randomly broken JavaScript in ancient browsers.
    
    \#\#\# Examples
    
    The code below will call the listener when a `<a>` is clicked
    anywhere in the `document`:
    
        up.on('click', 'a', function(event, element) {
          console.log("Click on a link %o", element)
        })
    
    You may also bind the listener to a given element instead of `document`:
    
        var form = document.querySelector('form')
        up.on(form, 'click', function(event, form) {
          console.log("Click within %o", form)
        })
    
    You may also pass both an element and a selector
    for [event delegation](https://davidwalsh.name/event-delegate):
    
        var form = document.querySelector('form')
        up.on(form, 'click', 'a', function(event, link) {
          console.log("Click on a link %o within %o", link, form)
        })
    
    \#\#\# Attaching structured data
    
    In case you want to attach structured data to the event you're observing,
    you can serialize the data to JSON and put it into an `[up-data]` attribute:
    
        <span class='person' up-data='{ "age": 18, "name": "Bob" }'>Bob</span>
        <span class='person' up-data='{ "age": 22, "name": "Jim" }'>Jim</span>
    
    The JSON will be parsed and handed to your event handler as a third argument:
    
        up.on('click', '.person', function(event, element, data) {
          console.log("This is %o who is %o years old", data.name, data.age)
        })
    
    \#\#\# Unbinding an event listener
    
    `up.on()` returns a function that unbinds the event listeners when called:
    
        // Define the listener
        var listener =  function(event) { ... }
    
        // Binding the listener returns an unbind function
        var unbind = up.on('click', listener)
    
        // Unbind the listener
        unbind()
    
    There is also a function [`up.off()`](/up.off) which you can use for the same purpose:
    
        // Define the listener
        var listener =  function(event) { ... }
    
        // Bind the listener
        up.on('click', listener)
    
        // Unbind the listener
        up.off('click', listener)
    
    @function up.on
    @param {Element|jQuery} [element=document]
      The element on which to register the event listener.
    
      If no element is given, the listener is registered on the `document`.
    @param {string} types
      A space-separated list of event types to bind to.
    @param {string} [selector]
      The selector of an element on which the event must be triggered.
    
      Omit the selector to listen to all events of the given type, regardless
      of the event target.
    @param {boolean} [options.passive=false]
      Whether to register a [passive event listener](https://developers.google.com/web/updates/2016/06/passive-event-listeners).
    
      A passive event listener may not call `event.preventDefault()`.
      This in particular may improve the frame rate when registering
      `touchstart` and `touchmove` events.
    @param {Function(event, [element], [data])} listener
      The listener function that should be called.
    
      The function takes the affected element as a second argument.
      If the element has an [`up-data`](/up-data) attribute, its value is parsed as JSON
      and passed as a third argument.
    @return {Function()}
      A function that unbinds the event listeners when called.
    @stable
     */
    bind = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return bindNow(args);
    };

    /***
    Listens to an event on `document` or a given element.
    The event handler is called with the event target as a
    [jQuery collection](https://learn.jquery.com/using-jquery-core/jquery-object/).
    
    If you're not using jQuery, use `up.on()` instead, which calls
    event handlers with a native element.
    
    \#\#\# Example
    
    ```
    up.$on('click', 'a', function(event, $link) {
      console.log("Click on a link with destination %s", $element.attr('href'))
    })
    ```
    
    @function up.$on
    @param {Element|jQuery} [element=document]
      The element on which to register the event listener.
    
      If no element is given, the listener is registered on the `document`.
    @param {string} events
      A space-separated list of event names to bind to.
    @param {string} [selector]
      The selector of an element on which the event must be triggered.
      Omit the selector to listen to all events with that name, regardless
      of the event target.
    @param {boolean} [options.passive=false]
      Whether to register a [passive event listener](https://developers.google.com/web/updates/2016/06/passive-event-listeners).
    
      A passive event listener may not call `event.preventDefault()`.
      This in particular may improve the frame rate when registering
      `touchstart` and `touchmove` events.
    @param {Function(event, [element], [data])} listener
      The listener function that should be called.
    
      The function takes the affected element as the first argument).
      If the element has an [`up-data`](/up-data) attribute, its value is parsed as JSON
      and passed as a second argument.
    @return {Function()}
      A function that unbinds the event listeners when called.
    @stable
     */
    $bind = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return bindNow(args, {
        jQuery: true
      });
    };
    bindNow = function(args, options) {
      if (!up.browser.isSupported()) {
        return (function() {});
      }
      return up.EventListenerGroup.fromBindArgs(args, options).bind();
    };

    /***
    Unbinds an event listener previously bound with `up.on()`.
    
    \#\#\# Example
    
    Let's say you are listing to clicks on `.button` elements:
    
        var listener = function() { ... }
        up.on('click', '.button', listener)
    
    You can stop listening to these events like this:
    
        up.off('click', '.button', listener)
    
    @function up.off
    @param {Element|jQuery} [element=document]
    @param {string} events
    @param {string} [selector]
    @param {Function(event, [element], [data])} listener
      The listener function to unbind.
    
      Note that you must pass a reference to the exact same listener function
      that was passed to `up.on()` earlier.
    @stable
     */
    unbind = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return up.EventListenerGroup.fromBindArgs(args).unbind();
    };
    buildEmitter = function(args) {
      return up.EventEmitter.fromEmitArgs(args);
    };

    /***
    Emits a event with the given name and properties.
    
    The event will be triggered as an event on `document` or on the given element.
    
    Other code can subscribe to events with that name using
    [`Element#addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
    or [`up.on()`](/up.on).
    
    \#\#\# Example
    
        up.on('my:event', function(event) {
          console.log(event.foo)
        })
    
        up.emit('my:event', { foo: 'bar' })
        // Prints "bar" to the console
    
    @function up.emit
    @param {Element|jQuery} [target=document]
      The element on which the event is triggered.
    
      If omitted, the event will be emitted on the `document`.
    @param {string} eventType
      The event type, e.g. `my:event`.
    @param {Object} [props={}]
      A list of properties to become part of the event object that will be passed to listeners.
    @param {up.Layer|string|number} [props.layer]
      The [layer](/up.layer) on which to emit this event.
    
      If this property is set, the event will be emitted on the [layer's outmost element](/up.Layer#element).
      Also [up.layer.current](/up.layer.current) will be set to the given layer while event listeners
      are running.
    @param {string|Array} [props.log]
      A message to print to the [log](/up.log) when the event is emitted.
    
      Pass `false` to not log this event emission.
    @param {Element|jQuery} [props.target=document]
      The element on which the event is triggered.
    
      Alternatively the target element may be passed as the first argument.
    @stable
     */
    emit = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return buildEmitter(args).emit();
    };

    /***
    Builds an event with the given type and properties.
    
    The returned event is not [emitted](/up.emit).
    
    \#\#\# Example
    
        let event = up.event.build('my:event', { foo: 'bar' })
        console.log(event.type)              // logs "my:event"
        console.log(event.foo)               // logs "bar"
        console.log(event.defaultPrevented)  // logs "false"
        up.emit(event)                       // emits the event
    
    @function up.event.build
    @param {string} [type]
      The event type.
    
      May also be passed as a property `{ type }`.
    @param {Object} [props={}]
      An object with event properties.
    @param {string} [props.type]
      The event type.
    
      May also be passed as a first string argument.
    @return {Event}
    @experimental
     */
    build = function() {
      var args, event, originalPreventDefault, props, type;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      props = u.extractOptions(args);
      type = args[0] || props.type || up.fail('Expected event type to be passed as string argument or { type } property');
      event = document.createEvent('Event');
      event.initEvent(type, true, true);
      u.assign(event, u.omit(props, ['type', 'target']));
      if (up.browser.isIE11()) {
        originalPreventDefault = event.preventDefault;
        event.preventDefault = function() {
          originalPreventDefault.call(event);
          return u.getter(event, 'defaultPrevented', function() {
            return true;
          });
        };
      }
      return event;
    };

    /***
    [Emits an event](/up.emit) and returns whether no listener
    has prevented the default action.
    
    @function up.event.nobodyPrevents
    @param {string} eventType
    @param {Object} eventProps
    @param {string|Array} [eventProps.log]
    @return {boolean}
      whether no listener has prevented the default action
    @experimental
     */
    nobodyPrevents = function() {
      var args, event;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      event = emit.apply(null, args);
      return !event.defaultPrevented;
    };

    /***
    [Emits](/up.emit) the given event and returns a promise
    that will be fulfilled if no listener has prevented the default action.
    
    If any listener prevented the default listener
    the returned promise will never be resolved.
    
    @function up.event.whenEmitted
    @param {string} eventType
    @param {Object} eventProps
    @param {string|Array} [eventProps.message]
    @return {Promise}
    @internal
     */
    whenEmitted = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return buildEmitter(args).whenEmitted();
    };

    /***
    Registers an event listener to be called when the user
    presses the `Escape` key.
    
    @function up.event.onEscape
    @param {Function(event)} listener
      The listener function to register.
    @return {Function()}
      A function that unbinds the event listeners when called.
    @experimental
     */
    onEscape = function(listener) {
      return bind('keydown', function(event) {
        if (escapePressed(event)) {
          return listener(event);
        }
      });
    };

    /***
    Returns whether the given keyboard event involved the ESC key.
    
    @function up.util.escapePressed
    @internal
     */
    escapePressed = function(event) {
      var key;
      key = event.key;
      return key === 'Escape' || key === 'Esc';
    };

    /***
    Prevents the event from bubbling up the DOM.
    Also prevents other event handlers bound on the same element.
    Also prevents the event's default action.
    
    \#\#\# Example
    
        up.on('click', 'link.disabled', function(event) {
          up.event.halt(event)
        })
    
    @function up.event.halt
    @param {Event} event
    @stable
     */
    halt = function(event) {
      event.stopImmediatePropagation();
      return event.preventDefault();
    };
    onReady = function(callback) {
      if (document.readyState !== 'loading') {
        return callback();
      } else {
        return document.addEventListener('DOMContentLoaded', callback);
      }
    };
    keyModifiers = ['metaKey', 'shiftKey', 'ctrlKey', 'altKey'];

    /***
    @function up.event.isUnmodified
    @internal
     */
    isUnmodified = function(event) {
      return (u.isUndefined(event.button) || event.button === 0) && !u.some(keyModifiers, function(modifier) {
        return event[modifier];
      });
    };
    fork = function(originalEvent, newType, copyKeys) {
      var newEvent;
      if (copyKeys == null) {
        copyKeys = [];
      }
      newEvent = up.event.build(newType, u.pick(originalEvent, copyKeys));
      newEvent.originalEvent = originalEvent;
      ['stopPropagation', 'stopImmediatePropagation', 'preventDefault'].forEach(function(key) {
        var originalMethod;
        originalMethod = newEvent[key];
        return newEvent[key] = function() {
          originalEvent[key]();
          return originalMethod.call(newEvent);
        };
      });
      return newEvent;
    };

    /***
    Emits the given event when this link is clicked.
    
    When the emitted event's default' is prevented, the original `click` event's default is also prevented.
    
    You may use this attribute to emit events when clicking on areas that are no hyperlinks,
    by setting it on an `<a>` element without a `[href]` attribute.
    
    \#\#\# Example
    
        <a href='/users/5" up-emit='user:select' up-emit-props='{ "id": 5, "firstName": "Alice" }'>Alice</a>
    
        <script>
          up.on('a', 'user:select', function(event) {
            console.log(event.firstName) // logs "Alice"
            event.preventDefault()       // will prevent the link from being followed
          })
        </script>
    
    @selector a[up-emit]
    @param {string} up-emit
      The type of the event to be emitted.
    @param {string} up-emit-props
      The event properties, serialized as JSON.
     */
    executeEmitAttr = function(event, element) {
      var eventProps, eventType, forkedEvent;
      if (!isUnmodified(event)) {
        return;
      }
      eventType = e.attr(element, 'up-emit');
      eventProps = e.jsonAttr(element, 'up-emit-props');
      forkedEvent = fork(event, eventType);
      u.assign(forkedEvent, eventProps);
      return up.emit(element, forkedEvent);
    };
    bind('up:click', 'a[up-emit]', executeEmitAttr);
    bind('up:framework:reset', reset);
    return {
      on: bind,
      $on: $bind,
      off: unbind,
      build: build,
      emit: emit,
      nobodyPrevents: nobodyPrevents,
      whenEmitted: whenEmitted,
      onEscape: onEscape,
      halt: halt,
      onReady: onReady,
      isUnmodified: isUnmodified,
      fork: fork,
      keyModifiers: keyModifiers
    };
  })();

  up.on = up.event.on;

  up.$on = up.event.$on;

  up.off = up.event.off;

  up.$off = up.event.off;

  up.emit = up.event.emit;

}).call(this);

/***
Server protocol
===============

You rarely need to change server-side code to use Unpoly. You don't need
to provide a JSON API, or add extra routes for AJAX requests. The server simply renders
a series of full HTML pages, like it would without Unpoly.

There is an **optional** protocol your server may use to exchange additional information
when Unpoly is [updating fragments](/up.link). The protocol mostly works by adding
additional HTTP headers (like `X-Up-Target`) to requests and responses.

While the protocol can help you optimize performance and handle some edge cases,
implementing it is **entirely optional**. For instance, `unpoly.com` itself is a static site
that uses Unpoly on the frontend and doesn't even have an active server component.

## Existing implementations

You should be able to implement the protocol in a very short time.

There are existing implementations for various web frameworks:

- [Ruby on Rails](/install/rails)
- [Roda](https://github.com/adam12/roda-unpoly)
- [Rack](https://github.com/adam12/rack-unpoly) (Sinatra, Padrino, Hanami, Cuba, ...)
- [Phoenix](https://elixirforum.com/t/unpoly-a-framework-like-turbolinks/3614/15) (Elixir)
- [PHP](https://github.com/adam12/rack-unpoly) (Symfony, Laravel, Stack)

@module up.protocol
 */

(function() {
  up.protocol = (function() {
    var acceptLayerFromXHR, clearCacheFromXHR, config, contextFromXHR, csrfHeader, csrfParam, csrfToken, dismissLayerFromXHR, e, eventPlansFromXHR, extractHeader, headerize, initialRequestMethod, locationFromXHR, methodFromXHR, reset, targetFromXHR, titleFromXHR, u, wrapMethod;
    u = up.util;
    e = up.element;
    headerize = function(camel) {
      var header;
      header = camel.replace(/(^.|[A-Z])/g, function(char) {
        return '-' + char.toUpperCase();
      });
      return 'X-Up' + header;
    };
    extractHeader = function(xhr, shortHeader, parseFn) {
      var value;
      if (parseFn == null) {
        parseFn = u.identity;
      }
      if (value = xhr.getResponseHeader(headerize(shortHeader))) {
        return parseFn(value);
      }
    };

    /***
    This request header contains the current Unpoly version to mark this request as a fragment update.
    
    Server-side code may check for the presence of an `X-Up-Version` header to
    distinguish [fragment updates](/up.link) from full page loads.
    
    The `X-Up-Version` header is guaranteed to be set for all [requests made through Unpoly](/up.request).
    
    \#\#\# Example
    
    ```http
    X-Up-Version: 1.0.0
    ```
    
    @header X-Up-Version
    @stable
     */

    /***
    This request header contains the CSS selector targeted for a successful fragment update.
    
    Server-side code is free to optimize its response by only rendering HTML
    that matches the selector. For example, you might prefer to not render an
    expensive sidebar if the sidebar is not targeted.
    
    Unpoly will usually update a different selector in case the request fails.
    This selector is sent as a second header, `X-Up-Fail-Target`.
    
    The user may choose to not send this header by configuring
    `up.network.config.requestMetaKeys`.
    
    \#\#\# Example
    
    ```http
    X-Up-Target: .menu
    X-Up-Fail-Target: body
    ```
    
    \#\#\# Changing the render target from the server
    
    The server may change the render target context by including a CSS selector as an `X-Up-Target` header
    in its response.
    
    ```http
    Content-Type: text/html
    X-Up-Target: .selector-from-server
    
    <div class="selector-from-server">
      ...
    </div>
    ```
    
    The frontend will use the server-provided target for both successful (HTTP status `200 OK`)
    and failed (status `4xx` or `5xx`) responses.
    
    The server may also set a target of `:none` to have the frontend render nothing.
    In this case no response body is required:
    
    ```http
    Content-Type: text/html
    X-Up-Target: :none
    ```
    
    @header X-Up-Target
    @stable
     */

    /***
    This request header contains the CSS selector targeted for a failed fragment update.
    
    A fragment update is considered *failed* if the server responds with a status code other than 2xx,
    but still renders HTML.
    
    Server-side code is free to optimize its response to a failed request by only rendering HTML
    that matches the provided selector. For example, you might prefer to not render an
    expensive sidebar if the sidebar is not targeted.
    
    The user may choose to not send this header by configuring
    `up.network.config.requestMetaKeys`.
    
    \#\#\# Example
    
    ```http
    X-Up-Target: .menu
    X-Up-Fail-Target: body
    ```
    
    \#\#\# Signaling failed form submissions
    
    When [submitting a form via AJAX](/form-up-target)
    Unpoly needs to know whether the form submission has failed (to update the form with
    validation errors) or succeeded (to update the `[up-target]` selector).
    
    For Unpoly to be able to detect a failed form submission, the response must be
    return a non-2xx HTTP status code. We recommend to use either
    400 (bad request) or 422 (unprocessable entity).
    
    To do so in [Ruby on Rails](http://rubyonrails.org/), pass a [`:status` option to `render`](http://guides.rubyonrails.org/layouts_and_rendering.html#the-status-option):
    
    ```ruby
    class UsersController < ApplicationController
    
      def create
        user_params = params[:user].permit(:email, :password)
        @user = User.new(user_params)
        if @user.save?
          sign_in @user
        else
          render 'form', status: :bad_request
        end
      end
    
    end
    ```
    
    @header X-Up-Fail-Target
    @stable
     */

    /***
    This request header contains the targeted layer's [mode](/up.layer.mode).
    
    Server-side code is free to render different HTML for different modes.
    For example, you might prefer to not render a site navigation for overlays.
    
    The user may choose to not send this header by configuring
    `up.network.config.requestMetaKeys`.
    
    \#\#\# Example
    
    ```http
    X-Up-Mode: drawer
    ```
    
    @header X-Up-Mode
    @stable
     */

    /***
    This request header contains the [mode](/up.layer.mode) of the layer
    targeted for a failed fragment update.
    
    A fragment update is considered *failed* if the server responds with a
    status code other than 2xx, but still renders HTML.
    
    Server-side code is free to render different HTML for different modes.
    For example, you might prefer to not render a site navigation for overlays.
    
    The user may choose to not send this header by configuring
    `up.network.config.requestMetaKeys`.
    
    \#\#\# Example
    
    ```http
    X-Up-Mode: drawer
    X-Up-Fail-Mode: root
    ```
    
    @header X-Up-Fail-Mode
    @stable
     */
    clearCacheFromXHR = function(xhr) {
      var parseValue;
      parseValue = function(value) {
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
          default:
            return value;
        }
      };
      return extractHeader(xhr, 'clearCache', parseValue);
    };

    /***
    The server may send this optional response header with the value `clear` to [clear the cache](/up.cache.clear).
    
    \#\#\# Example
    
    ```http
    X-Up-Cache: clear
    ```
    
    @header X-Up-Cache
    @param value
      The string `"clear"`.
     */

    /***
    This request header contains a timestamp of an existing fragment that is being [reloaded](/up.reload).
    
    The timestamp must be explicitely set by the user as an `[up-time]` attribute on the fragment.
    It should indicate the time when the fragment's underlying data was last changed.
    
    Its value is the number of seconds elapsed since the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time).
    
    If no timestamp is known, Unpoly will send a value of zero (`X-Up-Reload-From-Time: 0`).
    
    \#\#\# Example
    
    You may timestamp your fragments with an `[up-time]` attribute to indicate when the underlying data
    was last changed. For instance, when the last message in a list was received from December 24th, 1:51:46 PM UTC:
    
    ```html
    <div class="messages" up-time="1608730818">
      ...
    </div>
    ```
    
    When reloading the `.messages` fragment, Unpoly will echo that timestamp in an `X-Up-Reload-From-Time` header:
    
    ```http
    X-Up-Reload-From-Time: 1608730818
    ```
    
    \#\# Cheap polling responses
    
    A use case for the `X-Up-Reload-From-Time` header is to avoid rendering unchanged content
    while [polling](/up-poll).
    
    The server can compare the time from the request with the time of the last data update.
    If no more recent data is available, the server can [render nothing](/X-Up-Target):
    
    ```ruby
    class MessagesController < ApplicationController
    
      def index
        if up.reload_from_time == current_user.last_message_at
          up.render_nothing
        else
          @messages = current_user.messages.order(time: :desc).to_a
          render 'index'
        end
      end
    
    end
    ```
    
    Only rendering when needed saves <b>CPU time</b> on your server, which spends most of its response time rendering HTML.
    
    This also reduces the <b>bandwidth cost</b> for a request/response exchange to **~1 KB**.
    
    @header X-Up-Reload-From-Time
    @stable
     */
    contextFromXHR = function(xhr) {
      return extractHeader(xhr, 'context', JSON.parse);
    };

    /***
    This request header contains the targeted layer's [context](/up.layer.context), serialized as JSON.
    
    The user may choose to not send this header by configuring
    `up.network.config.requestMetaKeys`.
    
    \#\#\# Example
    
    ```http
    X-Up-Context: { "lives": 3 }
    ```
    
    \#\#\# Updating context from the server
    
    The server may update the layer context by sending a `X-Up-Context` response header with
    changed key/value pairs:
    
    ```http
    Content-Type: text/html
    X-Up-Context: { "lives": 2 }
    
    <html>
      ...
    </html>
    ```
    
    Upon seeing the response header, Unpoly will assign the server-provided context object to
    the layer's context object, adding or replacing keys as needed.
    
    Client-side context keys not mentioned in the response will remain unchanged.
    There is no explicit protocol to *remove* keys from the context, but the server may send a key
    with a `null` value to effectively remove a key.
    
    The frontend will use the server-provided context upates for both successful (HTTP status `200 OK`)
    and failed (status `4xx` or `5xx`) responses.  If no `X-Up-Context` response header is set,
    the updating layer's context will not be changed.
    
    It is recommended that the server only places changed key/value pairs into the `X-Up-Context`
    response header, and not echo the entire context object. Otherwise any client-side changes made while
    the request was in flight will get overridden by the server-provided context.
    
    @header X-Up-Context
    @stable
     */

    /***
    This request header contains the [context](/up.layer.context) of the layer
    targeted for a failed fragment update, serialized as JSON.
    
    A fragment update is considered *failed* if the server responds with a
    status code other than 2xx, but still renders HTML.
    
    Server-side code is free to render different HTML for different contexts.
    For example, you might prefer to not render a site navigation for overlays.
    
    The user may choose to not send this header by configuring
    `up.network.config.requestMetaKeys`.
    
    \#\#\# Example
    
    ```http
    X-Up-Fail-Context: { "context": "Choose a company contact" }
    ```
    
    @header X-Up-Fail-Context
    @stable
     */

    /***
    @function up.protocol.methodFromXHR
    @internal
     */
    methodFromXHR = function(xhr) {
      return extractHeader(xhr, 'method', u.normalizeMethod);
    };

    /***
    The server may set this optional response header to change the browser location after a fragment update.
    
    Without this header Unpoly will set the browser location to the response URL, which is usually sufficient.
    
    When setting `X-Up-Location` it is recommended to also set `X-Up-Method`. If no `X-Up-Method` header is given
    and the response's URL changed from the request's URL, Unpoly will assume a redirect and set the
    method to `GET`.
    
    \#\#\# Internet Explorer 11
    
    There is an edge case on Internet Explorer 11, where Unpoly cannot detect the final URL after a redirect.
    You can fix this edge case by delivering `X-Up-Location` and `X-Up-Method` headers with the *last* response
    in a series of redirects.
    
    The **simplest implementation** is to set these headers for every request.
    
    \#\#\# Example
    
    ```http
    X-Up-Location: /current-url
    X-Up-Method: GET
    ```
    
    @header X-Up-Location
    @stable
     */

    /***
    The server may set this optional response header to change the HTTP method after a fragment update.
    
    Without this header Unpoly will assume a `GET` method if the response's URL changed from the request's URL,
    
    \#\#\# Example
    
    ```http
    X-Up-Location: /current-url
    X-Up-Method: GET
    ```
    
    @header X-Up-Method
    @stable
     */

    /***
    The server may set this optional response header to change the document title after a fragment update.
    
    Without this header Unpoly will extract the `<title>` from the server response.
    
    This header is useful when you [optimize your response](X-Up-Target) to not render
    the application layout unless targeted. Since your optimized response
    no longer includes a `<title>`, you can instead use this HTTP header to pass the document title.
    
    \#\#\# Example
    
    ```http
    X-Up-Title: Playlist browser
    ```
    
    @header X-Up-Title
    @stable
     */

    /***
    This request header contains the `[name]` of a [form field being validated](/input-up-validate).
    
    When seeing this header, the server is expected to validate (but not save)
    the form submission and render a new copy of the form with validation errors.
    See the documentation for [`input[up-validate]`](/input-up-validate) for more information
    on how server-side validation works in Unpoly.
    
    \#\#\# Example
    
    Assume we have an auto-validating form field:
    
    ```html
    <fieldset>
      <input name="email" up-validate>
    </fieldset>
    ```
    
    When the input is changed, Unpoly will submit the form with an additional header:
    
    ```html
    X-Up-Validate: email
    ```
    
    @header X-Up-Validate
    @stable
     */
    eventPlansFromXHR = function(xhr) {
      return extractHeader(xhr, 'events', JSON.parse);
    };

    /***
    The server may set this response header to [emit events](/up.emit) with the
    requested [fragment update](a-up-target).
    
    The header value is a [JSON](https://en.wikipedia.org/wiki/JSON) array.
    Each element in the array is a JSON object representing an event to be emitted
    on the `document`.
    
    The object property `{ "type" }` defines the event's [type](https://developer.mozilla.org/en-US/docs/Web/API/Event/type). Other properties become properties of the emitted
    event object.
    
    \#\#\# Example
    
    ```http
    Content-Type: text/html
    X-Up-Events: [{ "type": "user:created", "id": 5012 }, { "type": "signup:completed" }]
    ...
    
    <html>
      ...
    </html>
    ```
    
    \#\#\# Emitting an event on a layer
    
    Instead of emitting an event on the `document`, the server may also choose to
    [emit the event on the layer being updated](/up.layer.emit). To do so, add a property
    `{ "layer": "current" }` to the JSON object of an event:
    
    ```http
    Content-Type: text/html
    X-Up-Events: [{ "type": "user:created", "name:" "foobar", "layer": "current" }]
    ...
    
    <html>
      ...
    </html>
    ```
    
    @header X-Up-Events
    @stable
     */
    acceptLayerFromXHR = function(xhr) {
      return extractHeader(xhr, 'acceptLayer', JSON.parse);
    };

    /***
    The server may set this response header to [accept](/up.layer.accept) the targeted overlay
    in response to a fragment update.
    
    Upon seeing the header, Unpoly will cancel the fragment update and accept the layer instead.
    If the root layer is targeted, the header is ignored and the fragment is updated with
    the response's HTML content.
    
    The header value is the acceptance value serialized as a JSON object.
    To accept an overlay without value, set the header value to `null`.
    
    \#\#\# Example
    
    The response below will accept the targeted overlay with the value `{user_id: 1012 }`:
    
    ```http
    Content-Type: text/html
    X-Up-Accept-Layer: {"user_id": 1012}
    
    <html>
      ...
    </html>
    ```
    
    \#\#\# Rendering content
    
    The response may contain `text/html` content. If the root layer is targeted,
    the `X-Up-Accept-Layer` header is ignored and the fragment is updated with
    the response's HTML content.
    
    If you know that an overlay will be closed don't want to render HTML,
    have the server change the render target to `:none`:
    
    ```http
    Content-Type: text/html
    X-Up-Accept-Layer: {"user_id": 1012}
    X-Up-Target: :none
    ```
    
    @header X-Up-Accept-Layer
    @stable
     */
    dismissLayerFromXHR = function(xhr) {
      return extractHeader(xhr, 'dismissLayer', JSON.parse);
    };

    /***
    The server may set this response header to [dismiss](/up.layer.dismiss) the targeted overlay
    in response to a fragment update.
    
    Upon seeing the header, Unpoly will cancel the fragment update and dismiss the layer instead.
    If the root layer is targeted, the header is ignored and the fragment is updated with
    the response's HTML content.
    
    The header value is the dismissal value serialized as a JSON object.
    To accept an overlay without value, set the header value to `null`.
    
    \#\#\# Example
    
    The response below will dismiss the targeted overlay without a dismissal value:
    
    ```http
    HTTP/1.1 200 OK
    Content-Type: text/html
    X-Up-Dismiss-Layer: null
    
    <html>
      ...
    </html>
    ```
    
    \#\#\# Rendering content
    
    The response may contain `text/html` content. If the root layer is targeted,
    the `X-Up-Accept-Layer` header is ignored and the fragment is updated with
    the response's HTML content.
    
    If you know that an overlay will be closed don't want to render HTML,
    have the server change the render target to `:none`:
    
    ```http
    HTTP/1.1 200 OK
    Content-Type: text/html
    X-Up-Accept-Layer: {"user_id": 1012}
    X-Up-Target: :none
    ```
    
    @header X-Up-Dismiss-Layer
    @stable
     */

    /***
    Server-side companion libraries like unpoly-rails set this cookie so we
    have a way to detect the request method of the initial page load.
    There is no JavaScript API for this.
    
    @function up.protocol.initialRequestMethod
    @internal
     */
    initialRequestMethod = u.memoize(function() {
      var methodFromServer;
      methodFromServer = up.browser.popCookie('_up_method');
      return (methodFromServer || 'get').toLowerCase();
    });

    /***
    The server may set this optional cookie to echo the HTTP method of the initial request.
    
    If the initial page was loaded with a non-`GET` HTTP method, Unpoly prefers to make a full
    page load when you try to update a fragment. Once the next page was loaded with a `GET` method,
    Unpoly will again update fragments.
    
    This fixes two edge cases you might or might not care about:
    
    1. Unpoly replaces the initial page state so it can later restore it when the user
       goes back to that initial URL. However, if the initial request was a POST,
       Unpoly will wrongly assume that it can restore the state by reloading with GET.
    2. Some browsers have a bug where the initial request method is used for all
       subsequently pushed states. That means if the user reloads the page on a later
       GET state, the browser will wrongly attempt a POST request.
       This issue affects Safari 9-12 (last tested in 2019-03).
       Modern Firefoxes, Chromes and IE10+ don't have this behavior.
    
    In order to allow Unpoly to detect the HTTP method of the initial page load,
    the server must set a cookie:
    
    ```http
    Set-Cookie: _up_method=POST
    ```
    
    When Unpoly boots it will look for this cookie and configure itself accordingly.
    The cookie is then deleted in order to not affect following requests.
    
    The **simplest implementation** is to set this cookie for every request that is neither
    `GET` nor an [Unpoly request](/X-Up-Version). For all other requests
    an existing `_up_method` cookie should be deleted.
    
    @cookie _up_method
    @stable
     */

    /***
    @function up.protocol.locationFromXHR
    @internal
     */
    locationFromXHR = function(xhr) {
      return extractHeader(xhr, 'location') || xhr.responseURL;
    };

    /***
    @function up.protocol.titleFromXHR
    @internal
     */
    titleFromXHR = function(xhr) {
      return extractHeader(xhr, 'title');
    };

    /***
    @function up.protocol.targetFromXHR
    @internal
     */
    targetFromXHR = function(xhr) {
      return extractHeader(xhr, 'target');
    };
    up.on('up:framework:booted', initialRequestMethod);

    /***
    Configures strings used in the optional [server protocol](/up.protocol).
    
    @property up.protocol.config
    @param {string} [config.csrfHeader='X-CSRF-Token']
      The name of the HTTP header that will include the
      [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Synchronizer_token_pattern)
      for AJAX requests.
    @param {string|Function(): string} [config.csrfParam]
      The `name` of the hidden `<input>` used for sending a
      [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Synchronizer_token_pattern) when
      submitting a default, non-AJAX form. For AJAX request the token is sent as an
      [HTTP header](/up.protocol.config#config.csrfHeader instead.
    
      The parameter name can be configured as a string or as function that returns the parameter name.
      If no name is set, no token will be sent.
    
      Defaults to the `content` attribute of a `<meta>` tag named `csrf-param`:
    
          <meta name="csrf-param" content="authenticity_token" />
    @param {string|Function(): string} [config.csrfToken]
      The [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Synchronizer_token_pattern)
      to send for unsafe requests. The token will be sent as either a HTTP header (for AJAX requests)
      or hidden form `<input>` (for default, non-AJAX form submissions).
    
      The token can either be configured as a string or as function that returns the token.
      If no token is set, no token will be sent.
    
      Defaults to the `content` attribute of a `<meta>` tag named `csrf-token`:
    
          <meta name='csrf-token' content='secret12345'>
    @param {string} [config.methodParam='_method']
      The name of request parameter containing the original request method when Unpoly needs to wrap
      the method.
    
      Methods must be wrapped when making a [full page request](/up.browser.loadPage) with a methods other
      than GET or POST. In this case Unpoly will make a POST request with the original request method
      in a form parameter named `_method`:
    
      ```http
      POST /test HTTP/1.1
      Host: example.com
      Content-Type: application/x-www-form-urlencoded
      Content-Length: 11
    
      _method=PUT
      ```
    @stable
     */
    config = new up.Config(function() {
      return {
        methodParam: '_method',
        csrfParam: function() {
          return e.metaContent('csrf-param');
        },
        csrfToken: function() {
          return e.metaContent('csrf-token');
        },
        csrfHeader: 'X-CSRF-Token'
      };
    });
    csrfHeader = function() {
      return u.evalOption(config.csrfHeader);
    };
    csrfParam = function() {
      return u.evalOption(config.csrfParam);
    };
    csrfToken = function() {
      return u.evalOption(config.csrfToken);
    };

    /***
    @internal
     */
    wrapMethod = function(method, params) {
      params.add(config.methodParam, method);
      return 'POST';
    };
    reset = function() {
      return config.reset();
    };
    up.on('up:framework:reset', reset);
    return {
      config: config,
      reset: reset,
      locationFromXHR: locationFromXHR,
      titleFromXHR: titleFromXHR,
      targetFromXHR: targetFromXHR,
      methodFromXHR: methodFromXHR,
      acceptLayerFromXHR: acceptLayerFromXHR,
      contextFromXHR: contextFromXHR,
      dismissLayerFromXHR: dismissLayerFromXHR,
      eventPlansFromXHR: eventPlansFromXHR,
      clearCacheFromXHR: clearCacheFromXHR,
      csrfHeader: csrfHeader,
      csrfParam: csrfParam,
      csrfToken: csrfToken,
      initialRequestMethod: initialRequestMethod,
      headerize: headerize,
      wrapMethod: wrapMethod
    };
  })();

}).call(this);

/***
Logging
=======

Unpoly can print debugging information to the developer console, e.g.:

- Which [events](/up.event) are called
- When we're [making requests to the network](/up.request)
- Which [compilers](/up.syntax) are applied to which elements

You can activate logging by calling [`up.log.enable()`](/up.log.enable).

@module up.log
 */

(function() {
  var slice = [].slice;

  up.log = (function() {
    var config, disable, enable, fail, muteRejection, printBanner, printToError, printToStandard, printToStream, printToWarn, reset, sessionStore, setEnabled, u;
    u = up.util;
    sessionStore = new up.store.Session('up.log');

    /***
    Configures the logging output on the developer console.
    
    @property up.log.config
    @param {boolean} [options.enabled=false]
      Whether Unpoly will print debugging information to the developer console.
    
      Debugging information includes which elements are being [compiled](/up.syntax)
      and which [events](/up.event) are being emitted.
      Note that errors will always be printed, regardless of this setting.
    @internal
     */
    config = new up.Config(function() {
      return {
        enabled: sessionStore.get('enabled')
      };
    });
    reset = function() {
      return config.reset();
    };

    /***
    Prints a logging message to the browser console.
    
    @function up.puts
    @param {string} message
    @param {Array} ...args
    @internal
     */
    printToStandard = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (config.enabled) {
        return printToStream.apply(null, ['log'].concat(slice.call(args)));
      }
    };

    /***
    @function up.warn
    @internal
     */
    printToWarn = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return printToStream.apply(null, ['warn'].concat(slice.call(args)));
    };

    /***
    @function up.log.error
    @internal
     */
    printToError = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return printToStream.apply(null, ['error'].concat(slice.call(args)));
    };
    printToStream = function() {
      var args, message, stream, trace;
      stream = arguments[0], trace = arguments[1], message = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      if (message) {
        if (up.browser.canFormatLog()) {
          args.unshift('');
          args.unshift('color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block');
          message = "%c" + trace + "%c " + message;
        } else {
          message = "[" + trace + "] " + message;
        }
        return console[stream].apply(console, [message].concat(slice.call(args)));
      }
    };
    printBanner = function() {
      var logInfo, logo;
      logo = " __ _____  ___  ___  / /_ __\n" + ("/ // / _ \\/ _ \\/ _ \\/ / // /  " + up.version + "\n") + "\\___/_//_/ .__/\\___/_/\\_. / \n" + "        / /            / /\n\n";
      if (config.enabled) {
        logInfo = "Call `up.log.disable()` to disable logging for this session.";
      } else {
        logInfo = "Call `up.log.enable()` to enable logging for this session.";
      }
      if (up.browser.canFormatLog()) {
        return console.log('%c' + logo + '%c' + logInfo, 'font-family: monospace', '');
      } else {
        return console.log(logo + logInfo);
      }
    };
    up.on('up:framework:booted', printBanner);
    up.on('up:framework:reset', reset);
    setEnabled = function(value) {
      sessionStore.set('enabled', value);
      return config.enabled = value;
    };

    /***
    Makes future Unpoly events print vast amounts of debugging information to the developer console.
    
    Debugging information includes which elements are being [compiled](/up.syntax)
    and which [events](/up.event) are being emitted.
    
    Errors will always be printed, regardless of this setting.
    
    @function up.log.enable
    @stable
     */
    enable = function() {
      return setEnabled(true);
    };

    /***
    Prevents future Unpoly events from printing vast amounts of debugging information to the developer console.
    
    Errors will still be printed, even with logging disabled.
    
    @function up.log.disable
    @stable
     */
    disable = function() {
      return setEnabled(false);
    };

    /***
    Throws a [JavaScript error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    with the given message.
    
    The message will also be printed to the [error log](/up.log.error). Also a notification will be shown at the bottom of the screen.
    
    The message may contain [substitution marks](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
    
    \#\#\# Examples
    
        up.fail('Division by zero')
        up.fail('Unexpected result %o', result)
    
    @function up.fail
    @param {string} message
      A message with details about the error.
    
      The message can contain [substitution marks](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions)
      like `%s` or `%o`.
    @param {Array<string>} vars...
      A list of variables to replace any substitution marks in the error message.
    @experimental
     */
    fail = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      printToError.apply(null, ['error'].concat(slice.call(args)));
      throw up.error.failed(args);
    };

    /***
     * Registers an empty rejection handler with the given promise.
     * This prevents browsers from printing "Uncaught (in promise)" to the error
     * console when the promise is rejected.
     *
     * This is helpful for event handlers where it is clear that no rejection
     * handler will be registered:
     *
     *     up.on('submit', 'form[up-target]', (event, $form) => {
     *       promise = up.submit($form)
     *       up.util.muteRejection(promise)
     *     })
     *
     * Does nothing if passed a missing value.
     *
     * Does nothing if the log is [enabled](/up.log.enable).
     *
     * @function up.log.muteRejection
     * @param {Promise|undefined|null} promise
     * @return {Promise}
     * @internal
     */
    muteRejection = function(promise) {
      if (config.enabled) {
        return promise;
      } else {
        return u.muteRejection(promise);
      }
    };
    return {
      puts: printToStandard,
      error: printToError,
      warn: printToWarn,
      config: config,
      enable: enable,
      disable: disable,
      fail: fail,
      muteRejection: muteRejection,
      isEnabled: function() {
        return config.enabled;
      }
    };
  })();

  up.puts = up.log.puts;

  up.warn = up.log.warn;

  up.fail = up.log.fail;

}).call(this);

/***
Custom JavaScript
=================

Every app needs a way to pair JavaScript snippets with certain HTML elements,
in order to integrate libraries or implement custom behavior.

Unpoly lets you organize your JavaScript snippets using [compilers](/up.compiler).

For instance, to activate the [Masonry](http://masonry.desandro.com/) library for every element
with a `grid` class, use this compiler:

    up.compiler('.grid', function(element) {
      new Masonry(element, { itemSelector: '.grid--item' })
    })

The compiler function will be called on matching elements when the page loads
or when a matching fragment is [inserted via AJAX](/up.link) later.

@module up.syntax
 */

(function() {
  var slice = [].slice;

  up.syntax = (function() {
    var SYSTEM_MACRO_PRIORITIES, buildCompiler, clean, compile, compilers, detectSystemMacroPriority, e, insertCompiler, macros, parseCompilerArgs, readData, registerCompiler, registerDestructor, registerJQueryCompiler, registerJQueryMacro, registerMacro, reset, u;
    u = up.util;
    e = up.element;
    SYSTEM_MACRO_PRIORITIES = {
      '[up-back]': -100,
      '[up-content]': -200,
      '[up-drawer]': -200,
      '[up-modal]': -200,
      '[up-cover]': -200,
      '[up-popup]': -200,
      '[up-tooltip]': -200,
      '[up-dash]': -200,
      '[up-expand]': -300,
      '[data-method]': -400,
      '[data-confirm]': -400
    };
    compilers = [];
    macros = [];

    /***
    Registers a function to be called when an element with
    the given selector is inserted into the DOM.
    
    Use compilers to activate your custom Javascript behavior on matching
    elements.
    
    You should migrate your [`DOMContentLoaded`](https://api.jquery.com/ready/)
    callbacks to compilers. This will make sure they run both at page load and
    when [a new fragment is inserted later](/a-up-target).
    It will also organize your JavaScript snippets by selector of affected elements.
    
    
    \#\#\# Example
    
    This jQuery compiler will insert the current time into a
    `<div class='current-time'></div>`:
    
        up.compiler('.current-time', function(element) {
          var now = new Date()
          element.textContent = now.toString()
        })
    
    The compiler function will be called once for each matching element when
    the page loads, or when a matching fragment is [inserted](/up.replace) later.
    
    
    \#\#\# Integrating JavaScript libraries
    
    `up.compiler()` is a great way to integrate JavaScript libraries.
    Let's say your JavaScript plugin wants you to call `lightboxify()`
    on links that should open a lightbox. You decide to
    do this for all links with an `lightbox` class:
    
        <a href="river.png" class="lightbox">River</a>
        <a href="ocean.png" class="lightbox">Ocean</a>
    
    This JavaScript will do exactly that:
    
        up.compiler('a.lightbox', function(element) {
          lightboxify(element)
        })
    
    \#\#\# Cleaning up after yourself
    
    If your compiler returns a function, Unpoly will use this as a *destructor* to
    clean up if the element leaves the DOM. Note that in Unpoly the same DOM and JavaScript environment
    will persist through many page loads, so it's important to not create
    [memory leaks](https://makandracards.com/makandra/31325-how-to-create-memory-leaks-in-jquery).
    
    You should clean up after yourself whenever your compilers have global
    side effects, like a [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)
    or [event handlers bound to the document root](/up.on).
    
    Here is a version of `.current-time` that updates
    the time every second, and cleans up once it's done. Note how it returns
    a function that calls `clearInterval`:
    
        up.compiler('.current-time', function(element) {
    
          function update() {
            var now = new Date()
            element.textContent = now.toString()
          }
    
          setInterval(update, 1000)
    
          return function() {
            clearInterval(update)
          };
    
        })
    
    If we didn't clean up after ourselves, we would have many ticking intervals
    operating on detached DOM elements after we have created and removed a couple
    of `<clock>` elements.
    
    
    \#\#\# Attaching structured data
    
    In case you want to attach structured data to the event you're observing,
    you can serialize the data to JSON and put it into an `[up-data]` attribute.
    For instance, a container for a [Google Map](https://developers.google.com/maps/documentation/javascript/tutorial)
    might attach the location and names of its marker pins:
    
        <div class='google-map' up-data='[
          { "lat": 48.36, "lng": 10.99, "title": "Friedberg" },
          { "lat": 48.75, "lng": 11.45, "title": "Ingolstadt" }
        ]'></div>
    
    The JSON will be parsed and handed to your compiler as a second argument:
    
        up.compiler('.google-map', function(element, pins) {
          var map = new google.maps.Map(element)
    
          pins.forEach(function(pin) {
            var position = new google.maps.LatLng(pin.lat, pin.lng)
            new google.maps.Marker({
              position: position,
              map: map,
              title: pin.title
            })
          })
        })
    
    
    @function up.compiler
    @param {string} selector
      The selector to match.
    @param {number} [options.priority=0]
      The priority of this compiler.
      Compilers with a higher priority are run first.
      Two compilers with the same priority are run in the order they were registered.
    @param {boolean} [options.batch=false]
      If set to `true` and a fragment insertion contains multiple
      elements matching the selector, `compiler` is only called once
      with a jQuery collection containing all matching elements. 
    @param {boolean} [options.keep=false]
      If set to `true` compiled fragment will be [persisted](/up-keep) during
      [page updates](/a-up-target).
    
      This has the same effect as setting an `up-keep` attribute on the element.
    @param {Function(element, data)} compiler
      The function to call when a matching element is inserted.
    
      The function takes the new element as the first argument.
      If the element has an [`up-data`](/up-data) attribute, its value is parsed as JSON
      and passed as a second argument.
    
      The function may return a destructor function that cleans the compiled
      object before it is removed from the DOM. The destructor is supposed to
      [clear global state](/up.compiler#cleaning-up-after-yourself)
      such as timeouts and event handlers bound to the document.
      The destructor is *not* expected to remove the element from the DOM, which
      is already handled by [`up.destroy()`](/up.destroy).
    @stable
     */
    registerCompiler = function() {
      var args, compiler;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      compiler = buildCompiler(args);
      return insertCompiler(compilers, compiler);
    };

    /***
    Registers a function to be called when an element with
    the given selector is inserted into the DOM. The function is called
    with each matching element as a
    [jQuery object](https://learn.jquery.com/using-jquery-core/jquery-object/).
    
    If you're not using jQuery, use `up.compiler()` instead, which calls
    the compiler function with a native element.
    
    \#\#\# Example
    
    This jQuery compiler will insert the current time into a
    `<div class='current-time'></div>`:
    
        up.$compiler('.current-time', function($element) {
          var now = new Date()
          $element.text(now.toString())
        })
    
    @function up.$compiler
    @param {string} selector
      The selector to match.
    @param {Object} [options]
      See [`options` argument for `up.compiler()`](/up.compiler#parameters).
    @param {Function($element, data)} compiler
      The function to call when a matching element is inserted.
    
      See [`compiler` argument for `up.compiler()`](/up.compiler#parameters).
      @stable
     */
    registerJQueryCompiler = function() {
      var args, compiler;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      compiler = registerCompiler.apply(null, args);
      compiler.jQuery = true;
      return compiler;
    };

    /***
    Registers a [compiler](/up.compiler) that is run before all other compilers.
    
    Use `up.macro()` to register a compiler that sets multiple Unpoly attributes.
    
    \#\#\# Example
    
    You will sometimes find yourself setting the same combination of UJS attributes again and again:
    
        <a href="/page1" up-target=".content" up-transition="cross-fade" up-duration="300">Page 1</a>
        <a href="/page2" up-target=".content" up-transition="cross-fade" up-duration="300">Page 2</a>
        <a href="/page3" up-target=".content" up-transition="cross-fade" up-duration="300">Page 3</a>
    
    We would much rather define a new `[content-link]` attribute that let's us
    write the same links like this:
    
        <a href="/page1" content-link>Page 1</a>
        <a href="/page2" content-link>Page 2</a>
        <a href="/page3" content-link>Page 3</a>
    
    We can define the `[content-link]` attribute by registering a macro that
    sets the `[up-target]`, `[up-transition]` and `[up-duration]` attributes for us:
    
        up.macro('[content-link]', function(link) {
          link.setAttribute('up-target', '.content')
          link.setAttribute('up-transition', 'cross-fade')
          link.setAttribute('up-duration', '300')
        })
    
    Examples for built-in macros are [`a[up-dash]`](/a-up-dash) and [`[up-expand]`](/up-expand).
    
    @function up.macro
    @param {string} selector
      The selector to match.
    @param {Object} options
      See options for [`up.compiler()`](/up.compiler).
    @param {Function(element, data)} macro
      The function to call when a matching element is inserted.
    
      See [`up.compiler()`](/up.compiler#parameters) for details.
    @stable
     */
    registerMacro = function() {
      var args, macro;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      macro = buildCompiler(args);
      if (up.framework.isBooting()) {
        macro.priority = detectSystemMacroPriority(macro.selector) || up.fail('Unregistered priority for system macro %o', macro.selector);
      }
      return insertCompiler(macros, macro);
    };

    /***
    Registers a [compiler](/up.compiler) that is run before all other compilers.
    The compiler function is called with each matching element as a
    [jQuery object](https://learn.jquery.com/using-jquery-core/jquery-object/).
    
    If you're not using jQuery, use `up.macro()` instead, which calls
    the macro function with a native element.
    
    \#\#\# Example
    
        up.$macro('[content-link]', function($link) {
          $link.attr(
            'up-target': '.content',
            'up-transition': 'cross-fade',
            'up-duration':'300'
          )
        })
    
    @function up.$macro
    @param {string} selector
      The selector to match.
    @param {Object} options
      See [`options` argument for `up.compiler()`](/up.compiler#parameters).
    @param {Function(element, data)} macro
      The function to call when a matching element is inserted.
    
      See [`compiler` argument for `up.compiler()`](/up.compiler#parameters).
    @stable
     */
    registerJQueryMacro = function() {
      var args, macro;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      macro = registerMacro.apply(null, args);
      macro.jQuery = true;
      return macro;
    };
    detectSystemMacroPriority = function(macroSelector) {
      var priority, substr;
      macroSelector = u.evalOption(macroSelector);
      for (substr in SYSTEM_MACRO_PRIORITIES) {
        priority = SYSTEM_MACRO_PRIORITIES[substr];
        if (macroSelector.indexOf(substr) >= 0) {
          return priority;
        }
      }
    };
    parseCompilerArgs = function(args) {
      var callback, options, selector;
      selector = args.shift();
      callback = args.pop();
      options = u.extractOptions(args);
      return [selector, options, callback];
    };
    buildCompiler = function(args) {
      var callback, options, ref, selector;
      ref = parseCompilerArgs(args), selector = ref[0], options = ref[1], callback = ref[2];
      options = u.options(options, {
        selector: selector,
        isDefault: up.framework.isBooting(),
        priority: 0,
        batch: false,
        keep: false,
        jQuery: false
      });
      return u.assign(callback, options);
    };
    insertCompiler = function(queue, newCompiler) {
      var existingCompiler, index;
      index = 0;
      while ((existingCompiler = queue[index]) && (existingCompiler.priority >= newCompiler.priority)) {
        index += 1;
      }
      queue.splice(index, 0, newCompiler);
      return newCompiler;
    };

    /***
    Applies all compilers on the given element and its descendants.
    Unlike [`up.hello()`](/up.hello), this doesn't emit any events.
    
    @function up.syntax.compile
    @param {Array<Element>} [options.skip]
      A list of elements whose subtrees should not be compiled.
    @internal
     */
    compile = function(fragment, options) {
      var orderedCompilers, pass;
      orderedCompilers = macros.concat(compilers);
      pass = new up.CompilerPass(fragment, orderedCompilers, options);
      return pass.run();
    };

    /***
    Registers a function to be called when the given element
    is [destroyed](/up.destroy).
    
    The preferred way to register a destructor function is to `return`
    it from a [compiler function](/up.compiler).
    
    @function up.destructor
    @param {Element} element
    @param {Function|Array<Function>} destructor
      One or more destructor functions
    @internal
     */
    registerDestructor = function(element, destructor) {
      var destructors;
      if (!(destructors = element.upDestructors)) {
        destructors = [];
        element.upDestructors = destructors;
        element.classList.add('up-can-clean');
      }
      if (u.isArray(destructor)) {
        return destructors.push.apply(destructors, destructor);
      } else {
        return destructors.push(destructor);
      }
    };

    /***
    Runs any destructor on the given fragment and its descendants in the same layer.
    Unlike [`up.destroy()`](/up.destroy), this does not emit any events
    and does not remove the element from the DOM.
    
    @function up.syntax.clean
    @param {Element} fragment
    @param {up.Layer} options.layer
    @internal
     */
    clean = function(fragment, options) {
      var pass;
      if (options == null) {
        options = {};
      }
      pass = new up.DestructorPass(fragment, options);
      return pass.run();
    };

    /***
    Checks if the given element has an [`up-data`](/up-data) attribute.
    If yes, parses the attribute value as JSON and returns the parsed object.
    
    Returns `undefined` if the element has no `up-data` attribute.
    
    \#\#\# Example
    
    You have an element with JSON data serialized into an `up-data` attribute:
    
        <span class='person' up-data='{ "age": 18, "name": "Bob" }'>Bob</span>
    
    Calling `up.syntax.data()` will deserialize the JSON string into a JavaScript object:
    
        up.syntax.data('.person') // returns { age: 18, name: 'Bob' }
    
    @function up.data
    @param {string|Element|jQuery} element
      The element for which to return data.
    @return
      The JSON-decoded value of the `up-data` attribute.
    
      Returns `undefined` if the element has no (or an empty) `up-data` attribute.
    @stable
     */

    /***
    If an element with an `up-data` attribute enters the DOM,
    Unpoly will parse the JSON and pass the resulting object to any matching
    [`up.compiler()`](/up.compiler) handlers.
    
    For instance, a container for a [Google Map](https://developers.google.com/maps/documentation/javascript/tutorial)
    might attach the location and names of its marker pins:
    
        <div class='google-map' up-data='[
          { "lat": 48.36, "lng": 10.99, "title": "Friedberg" },
          { "lat": 48.75, "lng": 11.45, "title": "Ingolstadt" }
        ]'></div>
    
    The JSON will be parsed and handed to your compiler as a second argument:
    
        up.compiler('.google-map', function(element, pins) {
          var map = new google.maps.Map(element)
          pins.forEach(function(pin) {
            var position = new google.maps.LatLng(pin.lat, pin.lng)
            new google.maps.Marker({
              position: position,
              map: map,
              title: pin.title
            })
          })
        })
    
    Similarly, when an event is triggered on an element annotated with
    [`up-data`], the parsed object will be passed to any matching
    [`up.on()`](/up.on) handlers.
    
        up.on('click', '.google-map', function(event, element, pins) {
          console.log("There are %d pins on the clicked map", pins.length)
        })
    
    @selector [up-data]
    @param {string} up-data
      A serialized JSON string
    @stable
     */
    readData = function(element) {
      element = up.fragment.get(element);
      return e.jsonAttr(element, 'up-data') || {};
    };

    /***
    Resets the list of registered compiler directives to the
    moment when the framework was booted.
    
    @internal
     */
    reset = function() {
      compilers = u.filter(compilers, 'isDefault');
      return macros = u.filter(macros, 'isDefault');
    };
    up.on('up:framework:reset', reset);
    return {
      compiler: registerCompiler,
      macro: registerMacro,
      $compiler: registerJQueryCompiler,
      $macro: registerJQueryMacro,
      destructor: registerDestructor,
      compile: compile,
      clean: clean,
      data: readData
    };
  })();

  up.compiler = up.syntax.compiler;

  up.$compiler = up.syntax.$compiler;

  up.destructor = up.syntax.destructor;

  up.macro = up.syntax.macro;

  up.$macro = up.syntax.$macro;

  up.data = up.syntax.data;

}).call(this);

/***
History
========

In an Unpoly app, every page has an URL.

[Fragment updates](/up.link) automatically update the URL.

@module up.history
 */

(function() {
  var slice = [].slice;

  up.history = (function() {
    var buildState, config, currentLocation, e, emit, isCurrentLocation, manipulate, nextPreviousURL, normalizeURL, observeNewURL, pop, previousURL, push, replace, reset, restoreStateOnPop, u;
    u = up.util;
    e = up.element;

    /***
    Configures behavior when the user goes back or forward in browser history.
    
    @property up.history.config
    @param {Array} [config.restoreTargets=[]]
      A list of possible CSS selectors to [replace](/up.render) when the user goes back in history.
    
      If this array is empty, the [root layer's default targets](/up.layer.config.root) will be replaced.
    @param {boolean} [config.enabled=true]
      Defines whether [fragment updates](/up.render) will update the browser's current URL.
    
      If set to `false` Unpoly will never change the browser URL.
    @param {boolean} [config.restoreScroll=true]
      Whether to restore the known scroll positions
      when the user goes back or forward in history.
    @stable
     */
    config = new up.Config(function() {
      return {
        enabled: true,
        restoreTargets: ['body']
      };
    });
    previousURL = void 0;
    nextPreviousURL = void 0;
    reset = function() {
      config.reset();
      previousURL = void 0;
      return nextPreviousURL = void 0;
    };
    normalizeURL = function(url, normalizeOptions) {
      if (normalizeOptions == null) {
        normalizeOptions = {};
      }
      normalizeOptions.hash = true;
      return u.normalizeURL(url, normalizeOptions);
    };

    /***
    Returns a normalized URL for the current history entry.
    
    @property up.history.location
    @experimental
     */
    currentLocation = function(normalizeOptions) {
      return normalizeURL(location.href, normalizeOptions);
    };
    isCurrentLocation = function(url) {
      var normalizeOptions;
      normalizeOptions = {
        stripTrailingSlash: true
      };
      return normalizeURL(url, normalizeOptions) === currentLocation(normalizeOptions);
    };

    /***
    Remembers the given URL so we can use previousURL on pop.
    
    @function observeNewURL
    @internal
     */
    observeNewURL = function(url) {
      if (nextPreviousURL) {
        previousURL = nextPreviousURL;
        nextPreviousURL = void 0;
      }
      return nextPreviousURL = url;
    };

    /***
    Replaces the current history entry and updates the
    browser's location bar with the given URL.
    
    When the user navigates to the replaced history entry at a later time,
    Unpoly will [`replace`](/up.replace) the document body with
    the body from that URL.
    
    Note that functions like [`up.replace()`](/up.replace) or
    [`up.submit()`](/up.submit) will automatically update the
    browser's location bar for you.
    
    @function up.history.replace
    @param {string} url
    @internal
     */
    replace = function(url, options) {
      var doLog, ref;
      if (options == null) {
        options = {};
      }
      doLog = (ref = options.log) != null ? ref : true;
      if (manipulate('replaceState', url)) {
        return emit('up:history:replaced', {
          url: url,
          log: doLog && ("Replaced state for " + (u.urlWithoutHost(url)))
        });
      } else {
        return emit('up:history:muted', {
          url: url,
          log: doLog && ("Did not replace state with " + (u.urlWithoutHost(url)) + " (history is disabled)")
        });
      }
    };

    /***
    This event is [emitted](/up.emit) after a new history entry has been replaced.
    
    Also see `up:history:pushed` and `up:history:restored`.
    
    @event up:history:replaced
    @param {string} event.url
      The URL for the history entry that has been added.
    @stable
     */

    /***
    Adds a new history entry and updates the browser's
    address bar with the given URL.
    
    When the user navigates to the added history entry at a later time,
    Unpoly will [`replace`](/up.replace) the document body with
    the body from that URL.
    
    Note that functions like [`up.replace()`](/up.replace) or
    [`up.submit()`](/up.submit) will automatically update the
    browser's location bar for you.
    
    Emits events [`up:history:push`](/up:history:push) and [`up:history:pushed`](/up:history:pushed).
    
    @function up.history.push
    @param {string} url
      The URL for the history entry to be added.
    @experimental
     */
    push = function(url, options) {
      if (options == null) {
        options = {};
      }
      url = normalizeURL(url);
      if (options.force || !isCurrentLocation(url)) {
        if (manipulate('pushState', url)) {
          return up.emit('up:history:pushed', {
            url: url,
            log: "Advanced to location " + (u.urlWithoutHost(url))
          });
        } else {
          return up.emit('up:history:muted', {
            url: url,
            log: "Did not advance to " + (u.urlWithoutHost(url)) + " (history is disabled)"
          });
        }
      }
    };

    /***
    This event is [emitted](/up.emit) after a new history entry has been added.
    
    Also see `up:history:replaced` and `up:history:restored`.
    
    @event up:history:pushed
    @param {string} event.url
      The URL for the history entry that has been added.
    @stable
     */
    manipulate = function(method, url) {
      var state;
      if (up.browser.canPushState() && config.enabled) {
        state = buildState();
        window.history[method](state, '', url);
        observeNewURL(currentLocation());
        return state;
      } else {
        return false;
      }
    };
    buildState = function() {
      return {
        up: {}
      };
    };
    restoreStateOnPop = function(state) {
      var replaced, url;
      if (state != null ? state.up : void 0) {
        url = currentLocation();
        replaced = up.render({
          url: url,
          history: true,
          location: false,
          layer: 'root',
          target: config.restoreTargets,
          fallback: true,
          cache: true,
          peel: true,
          keep: false,
          scroll: 'restore',
          saveScroll: false
        });
        return replaced.then(function() {
          url = currentLocation();
          return emit('up:history:restored', {
            url: url,
            log: "Restored location " + url
          });
        });
      } else {
        return up.puts('pop', 'Ignoring a state not pushed by Unpoly (%o)', state);
      }
    };
    pop = function(event) {
      var state;
      observeNewURL(currentLocation());
      up.viewport.saveScroll({
        location: previousURL
      });
      state = event.state;
      return restoreStateOnPop(state);
    };
    emit = function() {
      var args, historyLayer;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      historyLayer = u.find(up.layer.stack.reversed(), 'history');
      return historyLayer.emit.apply(historyLayer, args);
    };

    /***
    This event is [emitted](/up.emit) after a history entry has been restored.
    
    History entries are restored when the user uses the *Back* or *Forward* button.
    
    Also see `up:history:pushed` and `up:history:replaced`.
    
    @event up:history:restored
    @param {string} event.url
      The URL for the history entry that has been restored.
    @stable
     */
    up.on('up:app:boot', function() {
      var register;
      if (up.browser.canPushState()) {
        register = function() {
          if (up.browser.canControlScrollRestoration()) {
            window.history.scrollRestoration = 'manual';
          }
          window.addEventListener('popstate', pop);
          return replace(currentLocation(), {
            log: false
          });
        };
        if (typeof jasmine !== "undefined" && jasmine !== null) {
          return register();
        } else {
          return setTimeout(register, 100);
        }
      }
    });

    /***
    Changes the link's destination so it points to the previous URL.
    
    Note that this will *not* call `location.back()`, but will set
    the link's `up-href` attribute to the actual, previous URL.
    
    If no previous URL is known, the link will not be changed.
    
    \#\#\# Example
    
    This link ...
    
        <a href="/default" up-back>
          Go back
        </a>
    
    ... will be transformed to:
    
        <a href="/default" up-href="/previous-page" up-restore-scroll up-follow>
          Go back
        </a>
    
    @selector a[up-back]
    @stable
     */
    up.macro('a[up-back], [up-href][up-back]', function(link) {
      if (previousURL) {
        e.setMissingAttrs(link, {
          'up-href': previousURL,
          'up-restore-scroll': ''
        });
        link.removeAttribute('up-back');
        return up.link.makeFollowable(link);
      }
    });
    up.on('up:framework:reset', reset);
    return u.literal({
      config: config,
      push: push,
      replace: replace,
      get_location: currentLocation,
      isLocation: isCurrentLocation,
      normalizeURL: normalizeURL
    });
  })();

}).call(this);

/***
Fragment update API
===================
  
The `up.fragment` module exposes a high-level Javascript API to [update](/up.replace) or
[destroy](/up.destroy) page fragments.

Fragments are [compiled](/up.compiler) elements that can be updated from a server URL.
They also exist on a layer (page, modal, popup).

Most of Unpoly's functionality (like [fragment links](/up.link) or [modals](/up.modal))
is built from `up.fragment` functions. You may use them to extend Unpoly from your
[custom Javascript](/up.syntax).

@module up.fragment
 */

(function() {
  var slice = [].slice;

  up.fragment = (function() {
    var CSS_HAS_SUFFIX_PATTERN, closest, config, destroy, e, emitFragmentDestroyed, emitFragmentInserted, emitFragmentKeep, emitFragmentKept, emitFromKeepPlan, expandTargets, failKey, getAll, getFirst, getOne, getSubtree, hello, isDestroying, isGoodClassForTarget, isNotDestroying, makeChangeNow, markFragmentAsDestroying, matches, navigate, parseSelector, parseTargetAndOptions, reload, render, reset, resolveOriginReference, shouldAutoHistory, shouldAutoScroll, sourceOf, successKey, timeOf, toTarget, u, visit;
    u = up.util;
    e = up.element;

    /***
    Configures defaults for fragment updates.
    
    @function up.fragment.config
    @param {Array<string>} config.mainTargets
    @param {Array<string|RegExp>} config.badTargetClasses
      A list of class names that should be ignored when
      [deriving a target selector from a fragment](/up.fragment.toTarget).
    
      The class names may also be passed as a regular expression.
    @param {Object} config.navigateOptions
      An object of default options to apply when [navigating](/up.navigate).
    @param {Array<string>} config.autoHistoryTargets
      An array of CSS selectors for which the browser history is updated with `{ history: 'auto' }`.
    @param {Array<string>} config.autoScrollTargets
      An array of CSS selectors for which the scroll position is [reset](/up.viewport.resetScroll) with `{ scroll: 'auto' }`.
    @param {boolean} config.matchAroundOrigin
      Whether to match an existing fragment around the triggered link.
    
      If set to `false` Unpoly will replace the first fragment
      matching the given target selector in the link's [layer](/up.layer).
    @stable
     */
    config = new up.Config(function() {
      return {
        badTargetClasses: [/^up-/],
        navigateOptions: {
          focus: 'auto',
          scroll: 'auto',
          solo: true,
          feedback: true,
          fallback: true,
          history: 'auto',
          peel: true,
          cache: true
        },
        autoHistoryTargets: [':main'],
        autoScrollTargets: [':main'],
        matchAroundOrigin: true
      };
    });
    Object.defineProperty(config, 'mainTargets', {
      get: function() {
        return up.layer.config.any.mainTargets;
      },
      set: function(value) {
        return up.layer.config.any.mainTargets = value;
      }
    });
    reset = function() {
      return config.reset();
    };

    /***
    Returns the URL the given element was retrieved from.
    
    If the given element was never directly updated, but part of a larger fragment update,
    the closest known source of an ancestor element is returned.
    
    @function up.fragment.source
    @param {Element|string} element
      The element or CSS selector for which to look up the source URL.
    @return {string|undefined}
    @experimental
     */
    sourceOf = function(element, options) {
      if (options == null) {
        options = {};
      }
      element = getOne(element, options);
      return e.closestAttr(element, 'up-source');
    };

    /***
    Returns a timestamp for the  the given element was retrieved from.
    
    @function up.fragment.time
    @param {Element} element
    @return {string}
    @internal
     */
    timeOf = function(element) {
      return e.closestAttr(element, 'up-time') || '0';
    };

    /***
    Sets this element's source URL for [reloading](/up.reload) and [polling](/up-poll)
    
    When an element is reloaded, Unpoly will make a request from the URL
    that originally brought the element into the DOM. You may use `[up-source]` to
    use another URL instead.
    
    \#\#\# Example
    
    Assume an application layout with an unread message counter.
    You use `[up-poll]` to refresh the counter every 30 seconds.
    
    By default this would make a request to the URL that originally brought the
    counter element into the DOM. To save the server from rendering a lot of
    unused HTML, you may poll from a different URL like so:
    
        <div class="unread-count" up-poll up-source="/unread-count">
          2 new messages
        </div>
    
    @selector [up-source]
    @param {String} up-source
      The URL from which to reload this element.
    @stable
     */

    /***
    Replaces elements on the current page with corresponding elements
    from a new page fetched from the server.
    
    The current and new elements must both match the given CSS selector.
    
    The unobtrusive variant of this is the [`a[up-target]`](/a-up-target) selector.
    
    \#\#\# Example
    
    Let's say your current HTML looks like this:
    
        <div class="one">old one</div>
        <div class="two">old two</div>
    
    We now replace the second `<div>`:
    
        up.replace('.two', '/new')
    
    The server renders a response for `/new`:
    
        <div class="one">new one</div>
        <div class="two">new two</div>
    
    Unpoly looks for the selector `.two` in the response and [implants](/up.extract) it into
    the current page. The current page now looks like this:
    
        <div class="one">old one</div>
        <div class="two">new two</div>
    
    Note how only `.two` has changed. The update for `.one` was
    discarded, since it didn't match the selector.
    
    \#\#\# Appending or prepending instead of replacing
    
    By default Unpoly will replace the given selector with the same
    selector from a freshly fetched page. Instead of replacing you
    can *append* the loaded content to the existing content by using the
    `:after` pseudo selector. In the same fashion, you can use `:before`
    to indicate that you would like the *prepend* the loaded content.
    
    A practical example would be a paginated list of items:
    
        <ul class="tasks">
          <li>Wash car</li>
          <li>Purchase supplies</li>
          <li>Fix tent</li>
        </ul>
    
    In order to append more items from a URL, replace into
    the `.tasks:after` selector:
    
        up.replace('.tasks:after', '/page/2')
    
    \#\#\# Setting the window title from the server
    
    If the `replace` call changes history, the document title will be set
    to the contents of a `<title>` tag in the response.
    
    The server can also change the document title by setting
    an `X-Up-Title` header in the response.
    
    \#\#\# Optimizing response rendering
    
    The server is free to optimize Unpoly requests by only rendering the HTML fragment
    that is being updated. The request's `X-Up-Target` header will contain
    the CSS selector for the updating fragment.
    
    If you are using the `unpoly-rails` gem you can also access the selector via
    `up.target` in all controllers, views and helpers.
    
    \#\#\# Events
    
    Unpoly will emit [`up:fragment:destroyed`](/up:fragment:destroyed) on the element
    that was replaced and [`up:fragment:inserted`](/up:fragment:inserted) on the new
    element that replaces it.
    
    @function up.render
    @param {string|Element|jQuery} [options.target]
      The CSS selector to update. You can also pass a DOM element or jQuery element
      here, in which case a selector will be inferred from the element's class and ID.
    @param {string} [options.url]
      The URL to fetch from the server.
    @param {string} [options.fragment]
      TODO: Docs
    @param {string} [options.document]
      TODO: Docs
    @param {string} [options.fail='auto']
      You may pass different render options for successful and failed server responses.
    
      A common use case for this is [form submissions](/up.form), where a successful response
      should display a follow-up screen but a failed response should re-render the form
      or display errors.
    
      To pass an option for a failed server response, prefix the option with `fail`:
    
          up.render({
            url: '/action',
            method: 'post',
            target: '.content',
            failTarget: 'form',
            scroll: 'auto',
            failScroll: 'form .errors'
          })
    
      Options that are used before the request is made (like `{ url, method, confirm }`) do not
      have a `fail`-prefixed variant. Some options (like `{ history, fallback }`) are used for both
      successful and failed responses, but may be overriden with a fail-prefixed variant (e.g. `{ history: true, failHistory: false }`. Options related to layers, scrolling or focus are never shared.
    
      The `{ fail }` option changes how Unpoly determines whether a server response was successful.
      By default (`{ fail: 'auto' }`) any HTTP 2xx status code will be considered successful,
      and any other status code will be considered failed.
    
      You may also pass `{ fail: false }` to always consider the response to be successful, even
      with a HTTP 4xx or 5xx status code.
    
      When the updated fragment content is not requested from a `{ url }`, but rather passed as an
      option (`{ content, fragment, document }`), the update is always considered successful, regardless
      of the `{ fail }` option.
    @param {string} [options.fallback]
      The selector to update when the original target was not found in the page.
    @param {string} [options.title]
      The document title after the replacement.
    
      If the call pushes an history entry and this option is missing, the title is extracted from the response's `<title>` tag.
      You can also pass `false` to explicitly prevent the title from being updated.
    @param {string} [options.method='get']
      The HTTP method to use for the request.
    @param {Object|FormData|string|Array} [options.params]
      [Parameters](/up.Params) that should be sent as the request's payload.
    @param {string} [options.transition='none']
    @param {string|boolean} [options.history=true]
      If a string is given, it is used as the URL the browser's location bar and history.
      If omitted or true, the `url` argument will be used.
      If set to `false`, the history will remain unchanged.
    @param {boolean|string} [options.reveal=false]
      Whether to [reveal](/up.reveal) the new fragment.
    
      You can also pass a CSS selector for the element to reveal.
    @param {number} [options.revealPadding]
    
    @param {boolean} [options.restoreScroll=false]
      If set to true, Unpoly will try to restore the scroll position
      of all the the updated element's viewport. The position
      will be reset to the last known top position before a previous
      history change for the current URL.
    @param {boolean} [options.cache]
      Whether to use a [cached response](/up.network) if available.
    @param {Object} [options.headers={}]
      An object of additional header key/value pairs to send along
      with the request.
    @param {Element|jQuery} [options.origin]
      The element that triggered the replacement.
    
      The element's selector will be substituted for the `&` shorthand in the target selector ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [options.layer='auto']
      TODO: Docs for all layer-related options. However, opts for new layers we will document on up.layer.open().
    @param {boolean} [options.keep=true]
      Whether this replacement will preserve [`[up-keep]`](/up-keep) elements.
    @param {boolean} [options.hungry=true]
      Whether this replacement will update [`[up-hungry]`](/up-hungry) elements.
    
    @return {Promise}
      A promise that fulfills when the page has been updated.
    
      If the update is animated, the promise will be resolved *before* the existing element was
      removed from the DOM tree. The old element will be marked with the `.up-destroying` class
      and removed once the animation finishes. To run code after the old element was removed,
      pass an `{ onFinished }` callback.
    @stable
     */
    render = function() {
      var args, guardEvent, options, promise;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      options = parseTargetAndOptions(args);
      options = up.RenderOptions.preprocess(options);
      promise = up.browser.whenConfirmed(options);
      if (guardEvent = u.pluckKey(options, 'guardEvent')) {
        guardEvent.renderOptions = options;
        promise = promise.then(function() {
          return up.event.whenEmitted(guardEvent, {
            target: options.origin
          });
        });
      }
      promise = promise.then(function() {
        return up.feedback.aroundForOptions(options, (function() {
          return makeChangeNow(options);
        }));
      });
      return promise;
    };
    navigate = function() {
      var args, options;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      options = parseTargetAndOptions(args);
      return render(u.merge(options, {
        navigate: true
      }));
    };
    makeChangeNow = function(options) {
      if (options.url) {
        return new up.Change.FromURL(options).executeAsync();
      } else {
        up.network.mimicLocalRequest(options);
        return new up.Change.FromContent(options).executeAsync();
      }
    };

    /***
    This event is [emitted](/up.emit) when the server responds with the HTML, before
    the HTML is used to [change a fragment](/up.render).
    
    Event listeners may call `event.preventDefault()` on an `up:fragment:loaded` event
    to prevent any changes to the DOM and browser history. This is useful to detect
    an entirely different page layout (like a maintenance page or fatal server error)
    which should be open with a full page load:
    
        up.on('up:fragment:loaded', (event) => {
          let isMaintenancePage = event.response.getHeader('X-Maintenance')
    
          if (isMaintenancePage) {
            // Prevent the fragment update and don't update browser history
            event.preventDefault()
    
            // Make a full page load for the same request.
            event.request.loadPage()
          }
        })
    
    Instead of preventing the update, listeners may also access the `event.renderOptions` object
    to mutate options to the `up.render()` call that will process the server response.
    
    @param event.preventDefault()
      Event listeners may call this method to prevent the fragment change.
    @param {up.Request} event.request
      The original request to the server.
    @param {up.Response} event.response
      The server response.
    @param {Object} event.renderOptions
      Options for the `up.render()` call that will process the server response.
    @event up:fragment:loaded
     */

    /***
    Elements with an `up-keep` attribute will be persisted during
    [fragment updates](/a-up-target).
    
    For example:
    
        <audio up-keep src="song.mp3"></audio>
    
    The element you're keeping should have an umambiguous class name, ID or `up-id`
    attribute so Unpoly can find its new position within the page update.
    
    Emits events [`up:fragment:keep`](/up:fragment:keep) and [`up:fragment:kept`](/up:fragment:kept).
    
    \#\#\# Controlling if an element will be kept
    
    Unpoly will **only** keep an existing element if:
    
    - The existing element has an `up-keep` attribute
    - The response contains an element matching the CSS selector of the existing element
    - The matching element *also* has an `up-keep` attribute
    - The [`up:fragment:keep`](/up:fragment:keep) event that is [emitted](/up.emit) on the existing element
      is not prevented by a event listener.
    
    Let's say we want only keep an `<audio>` element as long as it plays
    the same song (as identified by the tag's `src` attribute).
    
    On the client we can achieve this by listening to an `up:keep:fragment` event
    and preventing it if the `src` attribute of the old and new element differ:
    
        up.compiler('audio', function(element) {
          element.addEventListener('up:fragment:keep', function(event) {
            if element.getAttribute('src') !== event.newElement.getAttribute('src') {
              event.preventDefault()
            }
          })
        })
    
    If we don't want to solve this on the client, we can achieve the same effect
    on the server. By setting the value of the `up-keep` attribute we can
    define the CSS selector used for matching elements.
    
        <audio up-keep="audio[src='song.mp3']" src="song.mp3"></audio>
    
    Now, if a response no longer contains an `<audio src="song.mp3">` tag, the existing
    element will be destroyed and replaced by a fragment from the response.
    
    @selector [up-keep]
    @param {string} up-on-keep
      Code to run before an existing element is kept during a page update.
    
      The code may use the variables `event` (see `up:fragment:keep`),
      `this` (the old fragment), `newFragment` and `newData`.
    @stable
     */

    /***
    This event is [emitted](/up.emit) before an existing element is [kept](/up-keep) during
    a page update.
    
    Event listeners can call `event.preventDefault()` on an `up:fragment:keep` event
    to prevent the element from being persisted. If the event is prevented, the element
    will be replaced by a fragment from the response.
    
    @event up:fragment:keep
    @param event.preventDefault()
      Event listeners may call this method to prevent the element from being preserved.
    @param {Element} event.target
      The fragment that will be kept.
    @param {Element} event.newFragment
      The discarded element.
    @param {Object} event.newData
      The value of the [`up-data`](/up-data) attribute of the discarded element,
      parsed as a JSON object.
    @stable
     */

    /***
    This event is [emitted](/up.emit) when an existing element has been [kept](/up-keep)
    during a page update.
    
    Event listeners can inspect the discarded update through `event.newElement`
    and `event.newData` and then modify the preserved element when necessary.
    
    @event up:fragment:kept
    @param {Element} event.target
      The fragment that has been kept.
    @param {Element} event.newFragment
      The discarded fragment.
    @param {Object} event.newData
      The value of the [`up-data`](/up-data) attribute of the discarded fragment,
      parsed as a JSON object.
    @stable
     */

    /***
    Compiles a page fragment that has been inserted into the DOM
    by external code.
    
    **As long as you manipulate the DOM using Unpoly, you will never
    need to call this method.** You only need to use `up.hello()` if the
    DOM is manipulated without Unpoly' involvement, e.g. by setting
    the `innerHTML` property or calling jQuery methods like
    `html`, `insertAfter` or `appendTo`:
    
        element = document.createElement('div')
        element.innerHTML = '... HTML that needs to be activated ...'
        up.hello(element)
    
    This function emits the [`up:fragment:inserted`](/up:fragment:inserted)
    event.
    
    @function up.hello
    @param {Element|jQuery} target
    @param {Element|jQuery} [options.origin]
    @return {Element}
      The compiled element
    @stable
     */
    hello = function(element, options) {
      var keepPlans, skip;
      if (options == null) {
        options = {};
      }
      element = getOne(element);
      keepPlans = options.keepPlans || [];
      skip = keepPlans.map(function(plan) {
        emitFragmentKept(plan);
        return plan.oldElement;
      });
      up.syntax.compile(element, {
        skip: skip,
        layer: options.layer
      });
      emitFragmentInserted(element, options);
      return element;
    };

    /***
    When any page fragment has been [inserted or updated](/up.replace),
    this event is [emitted](/up.emit) on the fragment.
    
    If you're looking to run code when a new fragment matches
    a selector, use `up.compiler()` instead.
    
    \#\#\# Example
    
        up.on('up:fragment:inserted', function(event, fragment) {
          console.log("Looks like we have a new %o!", fragment)
        })
    
    @event up:fragment:inserted
    @param {Element} event.target
      The fragment that has been inserted or updated.
    @stable
     */
    emitFragmentInserted = function(element, options) {
      return up.emit(element, 'up:fragment:inserted', {
        log: ['Inserted fragment %o', element],
        origin: options.origin
      });
    };
    emitFragmentKeep = function(keepPlan) {
      var callback, log;
      log = ['Keeping fragment %o', keepPlan.oldElement];
      callback = e.callbackAttr(keepPlan.oldElement, 'up-on-keep', ['newFragment', 'newData']);
      return emitFromKeepPlan(keepPlan, 'up:fragment:keep', {
        log: log,
        callback: callback
      });
    };
    emitFragmentKept = function(keepPlan) {
      var log;
      log = ['Kept fragment %o', keepPlan.oldElement];
      return emitFromKeepPlan(keepPlan, 'up:fragment:kept', {
        log: log
      });
    };
    emitFromKeepPlan = function(keepPlan, eventType, emitDetails) {
      var event, keepable;
      keepable = keepPlan.oldElement;
      event = up.event.build(eventType, {
        newFragment: keepPlan.newElement,
        newData: keepPlan.newData
      });
      return up.emit(keepable, event, emitDetails);
    };
    emitFragmentDestroyed = function(fragment, options) {
      var log, parent, ref;
      log = (ref = options.log) != null ? ref : ['Destroyed fragment %o', fragment];
      parent = options.parent || document;
      return up.emit(parent, 'up:fragment:destroyed', {
        fragment: fragment,
        parent: parent,
        log: log
      });
    };
    isDestroying = function(element) {
      return !!e.closest(element, '.up-destroying');
    };
    isNotDestroying = function(element) {
      return !isDestroying(element);
    };

    /***
    Returns the first fragment matching the given selector.
    
    This function differs from `document.querySelector()` and `up.element.get()`:
    
    - This function only selects elements in the [current layer](/up.layer.current).
      Pass a `{ layer }`option to match elements in other layers.
    - This function ignores elements that are being [destroyed](/up.destroy) or that are being
      removed by a [transition](/up.morph).
    - This function prefers to match elements in the vicinity of a given `{ origin }` element (optional).
    - This function supports non-standard CSS selectors like `:main` and `:has()`.
    
    If no element matches these conditions, `undefined` is returned.
    
    \#\#\# Example: Matching a selector in a layer
    
    To select the first element with the selector `.foo` on the [current layer](/up.layer.current):
    
        let foo = up.fragment.get('.foo')
    
    You may also pass a `{ layer }` option to match elements within another layer:
    
        let foo = up.fragment.get('.foo', { layer: 'any' })
    
    \#\#\# Example: Matching the descendant of an element
    
    To only select in the descendants of an element, pass a root element as the first argument:
    
        let container = up.fragment.get('.container')
        let fooInContainer = up.fragment.get(container, '.foo')
    
    \#\#\# Example: Matching around an origin element
    
    When processing a user interaction, it is often helpful to match elements around the link
    that's being clicked or the form field that's being changed. In this case you may pass
    the triggering element as `{ origin }` element.
    
    Assume the following HTML:
    
    ```html
    <div class="element"></div>
    <div class="element">
      <a href="..."></a>
    </div>
    ```
    
    When processing an event for the `<a href"...">` you can pass the link element
    as `{ origin }` to match the closest element in the link's ancestry:
    
    ```javascript
    let link = event.target
    up.fragment.get('.element') // returns the first .element
    up.fragment.get('.element', { origin: link }) // returns the second .element
    ```
    
    When the link's does not have an ancestor matching `.element`,
    Unpoly will search the entire layer for `.element`.
    
    \#\#\# Example: Matching an origin sibling
    
    When processing a user interaction, it is often helpful to match elements
    within the same container as the the link that's being clicked or the form field that's
    being changed.
    
    Assume the following HTML:
    
    ```html
    <div class="element" id="one">
      <div class="inner"></div>
    </div>
    <div class="element" id="two">
      <a href="..."></a>
      <div class="inner"></div>
    </div>
    ```
    
    When processing an event for the `<a href"...">` you can pass the link element
    as `{ origin }` to match within the link's container:
    
    ```javascript
    let link = event.target
    up.fragment.get('.element .inner') // returns the first .inner
    up.fragment.get('.element .inner', { origin: link }) // returns the second .inner
    ```
    
    Note that when the link's `.element` container does not have a child `.inner`,
    Unpoly will search the entire layer for `.element .inner`.
    
    \#\#\# Similar features
    
    - The [`.up-destroying`](/up-destroying) class is assigned to elements during their removal animation.
    - The [`up.element.get()`](/up.element.get) function simply returns the first element matching a selector
      without further filtering.
    
    @function up.fragment.get
    @param {Element|jQuery} [root=document]
      The root element for the search. Only the root's children will be matched.
    
      May be omitted to search through all elements in the `document`.
    @param {string} selector
      The selector to match.
    @param {string} [options.layer='current']
      The layer in which to select elements.
    
      See `up.layer.get()` for a list of supported layer values.
    
      If a root element was passed as first argument, this option is ignored and the
      root element's layer is searched.
    @param {string|Element|jQuery} [options.origin]
      An second element or selector that can be referenced as `&` in the first selector.
    @return {Element|undefined}
      The first matching element, or `undefined` if no such element matched.
    @stable
     */
    getOne = function() {
      var args, finder, options, root, selector;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      options = u.extractOptions(args);
      selector = args.pop();
      root = args[0];
      if (u.isElementish(selector)) {
        return e.get(selector);
      }
      if (root) {
        return getFirst(root, selector, options);
      }
      finder = new up.FragmentFinder({
        selector: selector,
        origin: options.origin,
        layer: options.layer
      });
      return finder.find();
    };
    getFirst = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return getAll.apply(null, args)[0];
    };
    CSS_HAS_SUFFIX_PATTERN = /\:has\(([^\)]+)\)$/;

    /***
    Returns all elements matching the given selector, but
    ignores elements that are being [destroyed](/up.destroy) or that are being
    removed by a [transition](/up.morph).
    
    By default this function only selects elements in the [current layer](/up.layer.current).
    Pass a `{ layer }`option to match elements in other layers. See `up.layer.get()` for a list
    of supported layer values.
    
    Returns an empty list if no element matches these conditions.
    
    \#\#\# Example
    
    To select all elements with the selector `.foo` on the [current layer](/up.layer.current):
    
        let foos = up.fragment.all('.foo')
    
    You may also pass a `{ layer }` option to match elements within another layer:
    
        let foos = up.fragment.all('.foo', { layer: 'any' })
    
    To select in the descendants of an element, pass a root element as the first argument:
    
        var container = up.fragment.get('.container')
        var foosInContainer = up.fragment.all(container, '.foo')
    
    \#\#\# Similar features
    
    - The [`.up-destroying`](/up-destroying) class is assigned to elements during their removal animation.
    - The [`up.element.all()`](/up.element.get) function simply returns the all elements matching a selector
      without further filtering.
    
    @function up.fragment.get
    @param {Element|jQuery} [root=document]
      The root element for the search. Only the root's children will be matched.
    
      May be omitted to search through all elements in the `document`.
    @param {string} selector
      The selector to match.
    @param {string} [options.layer='current']
      The layer in which to select elements.
    
      See `up.layer.get()` for a list of supported layer values.
    
      If a root element was passed as first argument, this option is ignored and the
      root element's layer is searched.
    @param {string|Element|jQuery} [options.origin]
      An second element or selector that can be referenced as `&` in the first selector:
    
          var input = document.querySelector('input.email')
          up.fragment.get('fieldset:has(&)', { origin: input }) // returns the <fieldset> containing input
    @return {Element|undefined}
      The first matching element, or `undefined` if no such element matched.
    @stable
     */
    getAll = function() {
      var args, options, root, selector;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      options = u.extractOptions(args);
      selector = args.pop();
      root = args[0];
      selector = parseSelector(selector, root, options);
      return selector.descendants(root || document);
    };

    /***
    Your [target selectors](/a-up-target) may use this pseudo-selector
    to replace an element with an descendant matching the given selector.
    
    \#\#\# Example
    
    `up.render('div:has(span)', { url: '...' })`  replaces the first `<div>` elements with at least one `<span>` among its descendants:
    
    ```html
    <div>
      <span>Will be replaced</span>
    </div>
    <div>
      Will NOT be replaced
    </div>
    ```
    
    \#\#\# Compatibility
    
    `:has()` is supported by target selectors like `a[up-target]` and `up.render({ target })`.
    
    As a [level 4 CSS selector](https://drafts.csswg.org/selectors-4/#relational),
    `:has()` [has yet to be implemented](https://caniuse.com/#feat=css-has)
    in native browser functions like [`document.querySelectorAll()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll).
    
    You can also use [`:has()` in jQuery](https://api.jquery.com/has-selector/).
    
    @selector :has()
    @stable
     */

    /***
    Returns a list of the given parent's descendants matching the given selector.
    The list will also include the parent element if it matches the selector itself.
    
    @function up.fragment.subtree
    @param {Element} parent
      The parent element for the search.
    @param {string} selector
      The CSS selector to match.
    @param {up.Layer|string|Element}
      options.layer
    @return {NodeList<Element>|Array<Element>}
      A list of all matching elements.
    @experimental
     */
    getSubtree = function(element, selector, options) {
      if (options == null) {
        options = {};
      }
      selector = parseSelector(selector, element, options);
      return selector.subtree(element);
    };

    /***
    Returns the first element that matches the selector by testing the element itself
    and traversing up through ancestors in element's layers.
    
    `up.fragment.closest()` will only match elements in the same [layer](/up.layer) as
    the given element. To match ancestors regardless of layers, use `up.element.closest()`.
    
    @function up.fragment.closest
    @param {Element} element
      The element on which to start the search.
    @param {string} selector
      The CSS selector to match.
    @return {Element|null|undefined} element
      The matching element.
    
      Returns `null` or `undefined` if no element matches in the same layer.
    @experimental
     */
    closest = function(element, selector, options) {
      element = e.get(element);
      selector = parseSelector(selector, element, options);
      return selector.closest(element);
    };

    /***
    Destroys the given element or selector.
    
    All [`up.compiler()`](/up.compiler) destructors, if any, are called.
    The element is then removed from the DOM.
    
    Emits events [`up:fragment:destroyed`](/up:fragment:destroyed).
    
    \#\#\# Animating the removal
    
    You may animate the element's removal by passing an option like `{ animate: 'fade-out' }`.
    Unpoly ships with a number of [predefined animations](/up.animate#named-animations) and
    you may so define [custom animations](/up.animation).
    
    If the element's removal is animated, the element will remain in the DOM until after the animation
    has completed. While the animation is running the element will be given the `.up-destroying` class.
    The element will also be given the `[aria-hidden]` attribute to remove it from
    the accessibility tree.
    
    Elements that are about to be destroyed (but still animating) are ignored by all
    functions for fragment lookup:
    
    - `up.fragment.all()`
    - `up.fragment.first()`
    - `up.fragment.closest()`
    
    @function up.destroy
    @param {string|Element|jQuery} target
    @param {string} [options.location]
      A URL that will be pushed as a new history entry when the element was destroyed.
    @param {string} [options.title]
      The document title to set after the element was destroyed.
    @param {string|Function(element, options): Promise} [options.animation='none']
      The animation to use before the element is removed from the DOM.
    @param {number} [options.duration]
      The duration of the animation. See [`up.animate()`](/up.animate).
    @param {number} [options.delay]
      The delay before the animation starts. See [`up.animate()`](/up.animate).
    @param {string} [options.easing]
      The timing function that controls the animation's acceleration. [`up.animate()`](/up.animate).
    @param {Function} [options.onFinished]
      A callback that is run when any animations are finished and the element was removed from the DOM.
    @return {Promise}
      A promise that fulfills when the element has been destroyed.
    
      If the destruction is animated, the promise will be resolved *before* the element was
      removed from the DOM tree. The element will be marked with the `.up-destroying` class
      and removed once the animation finishes. To run code after the element was removed,
      pass an `{ onFinished }` callback.
    @stable
     */
    destroy = function() {
      var args, options;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      options = parseTargetAndOptions(args);
      if (options.element = getOne(options.target, options)) {
        return new up.Change.DestroyFragment(options).executeAsync();
      } else {
        return Promise.resolve();
      }
    };
    parseTargetAndOptions = function(args) {
      var options;
      options = u.parseArgIntoOptions(args, 'target');
      if (u.isElement(options.target)) {
        options.origin || (options.origin = options.target);
      }
      return options;
    };

    /***
    Elements are assigned the `.up-destroying` class before they are [destroyed](/up.destroy)
    or while they are being removed by a [transition](/up.morph).
    
    If the removal is [animated](/up.destroy#animating-the-removal),
    the class is assigned before the animation starts.
    
    Elements that are about to be destroyed (but still animating) are ignored by all
    functions for fragment lookup:
    
    - `up.fragment.all()`
    - `up.fragment.first()`
    - `up.fragment.closest()`
    
    @selector .up-destroying
    @stable
     */
    markFragmentAsDestroying = function(element) {
      element.classList.add('up-destroying');
      return element.setAttribute('aria-hidden', 'true');
    };

    /***
    This event is [emitted](/up.emit) after a page fragment was [destroyed](/up.destroy) and removed from the DOM.
    
    If the destruction is animated, this event is emitted after the animation has ended.
    
    The event is emitted on the parent element of the fragment that was removed.
    
    @event up:fragment:destroyed
    @param {Element} event.fragment
      The detached element that has been removed from the DOM.
    @param {Element} event.parent
      The former parent element of the fragment that has now been detached from the DOM.
    @param {Element} event.target
      The former parent element of the fragment that has now been detached from the DOM.
    @stable
     */

    /***
    Replaces the given element with a fresh copy fetched from the server.
    
    By default, reloading is not considered a [user navigation](/up.navigate) and e.g. will not update
    the browser location. You may change this with `{ navigate: true }`.
    
    \#\#\# Example
    
        up.on('new-mail', function() { up.reload('.inbox') })
    
    \#\#\# Controlling the URL that is reloaded
    
    Unpoly remembers [the URL from which a fragment was loaded](/up.fragment.source),
    so you don't usually need to pass a URL when reloading.
    
    To reload from another URL, pass a `{ url }` option or set an `[up-source]` attribute
    on the element or its ancestors.
    
    @function up.reload
    @param {string|Element|jQuery} [target]
      The element that should be reloaded.
    
      If omitted, an element matching a selector in `up.fragment.config.mainTargets`
      will be reloaded.
    @param {Object} [options]
      See options for `up.render()`.
    @param {string} [options.url]
      The URL from which to reload the fragment.
      This defaults to the URL from which the fragment was originally loaded.
    @param {string} [options.navigate=false]
      Whether the reloading constitutes a [user navigation](/up.navigate).
    @stable
     */
    reload = function() {
      var args, element, options;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      options = parseTargetAndOptions(args);
      element = getOne(options.target, options);
      if (options.url == null) {
        options.url = sourceOf(element);
      }
      options.headers || (options.headers = {});
      options.headers[up.protocol.headerize('reloadFromTime')] = timeOf(element);
      return render(options);
    };

    /***
    Fetches this given URL with JavaScript and [replaces](/up.replace) the
    [current layer](/up.layer.current)'s [main element](/up.fragment.config.mainSelectors)
    with a matching fragment from the server response.
    
    \#\#\# Example
    
    This would replace the current page with the response for `/users`:
    
        up.visit('/users')
    
    @function up.visit
    @param {string} url
      The URL to visit.
    @param {Object} [options]
      See options for `up.render()`
    @param {up.Layer|string|number} [options.layer='current']
    @stable
     */
    visit = function(url, options) {
      return navigate(u.merge({
        url: url
      }, options));
    };
    successKey = function(key) {
      return u.unprefixCamelCase(key, 'fail');
    };
    failKey = function(key) {
      if (!key.match(/^fail[A-Z]/)) {
        return u.prefixCamelCase(key, 'fail');
      }
    };

    /***
    Returns a CSS selector that matches the given element as good as possible.
    
    To build the selector, the following element properties are used in decreasing
    order of priority:
    
    - The element's `[up-id]` attribute
    - The element's `[id]` attribute
    - The element's `[name]` attribute
    - The element's `[class]` names, ignoring `up.fragment.config.badTargetClasses`.
    - The element's tag name
    
    \#\#\# Example
    
        element = document.createElement('span')
        element.className = 'klass'
        selector = up.fragment.toTarget(element) // returns '.klass'
    
    @function up.element.toTarget
    @param {string|Element|jQuery}
      The element for which to create a selector.
    @stable
     */
    toTarget = function(element) {
      var goodClass, id, name, upId;
      if (u.isString(element)) {
        return element;
      }
      element = e.get(element);
      if (e.isSingleton(element)) {
        return e.elementTagName(element);
      } else if (upId = element.getAttribute("up-id")) {
        return e.attributeSelector('up-id', upId);
      } else if (id = element.getAttribute("id")) {
        return e.idSelector(id);
      } else if (name = element.getAttribute("name")) {
        return e.elementTagName(element) + e.attributeSelector('name', name);
      } else if (goodClass = u.find(element.classList, isGoodClassForTarget)) {
        return "." + goodClass;
      } else {
        return e.elementTagName(element);
      }
    };

    /***
    Sets an unique identifier for this element.
    
    This identifier is used by `up.fragment.toSelector()`
    to create a CSS selector that matches this element precisely.
    
    If the element already has other attributes that make a good identifier,
    like a good `[id]` or `[class]` attribute, it is not necessary to
    also set `[up-id]`.
    
    \#\#\# Example
    
    Take this element:
    
        <a href="/">Homepage</a>
    
    Unpoly cannot generate a good CSS selector for this element:
    
        up.fragment.toTarget(element)
        // returns 'a'
    
    We can improve this by assigning an `[up-id]`:
    
        <a href="/" up-id="link-to-home">Open user 4</a>
    
    The attribute value is used to create a better selector:
    
        up.fragment.toTarget(element)
        // returns '[up-id="link-to-home"]'
    
    @selector [up-id]
    @param {string} up-id
      A string that uniquely identifies this element.
    @stable
     */
    isGoodClassForTarget = function(klass) {
      var matchesPattern;
      matchesPattern = function(pattern) {
        if (u.isRegExp(pattern)) {
          return pattern.test(klass);
        } else {
          return pattern === klass;
        }
      };
      return !u.some(config.badTargetClasses, matchesPattern);
    };
    resolveOriginReference = function(target, options) {
      var origin;
      if (options == null) {
        options = {};
      }
      origin = options.origin;
      return target.replace('&', function(match) {
        if (origin) {
          return toTarget(origin);
        } else {
          return up.fail("Missing origin for origin reference (%s) (found in %os)", match, target);
        }
      });
    };

    /***
    @internal
     */
    expandTargets = function(targets, options) {
      var expanded, layer, mode, target;
      if (options == null) {
        options = {};
      }
      layer = options.layer;
      if (!(layer === 'new' || (layer instanceof up.Layer))) {
        up.fail('Must pass an up.Layer as { layer } option, but got %o', layer);
      }
      targets = u.copy(u.wrapList(targets));
      expanded = [];
      while (targets.length) {
        target = targets.shift();
        if (target === ':main' || target === true) {
          mode = layer === 'new' ? options.mode : layer.mode;
          targets.unshift.apply(targets, up.layer.mainTargets(mode));
        } else if (target === ':layer') {
          if (layer !== 'new') {
            targets.unshift(layer.getFirstSwappableElement());
          }
        } else if (u.isElementish(target)) {
          expanded.push(toTarget(target));
        } else if (u.isString(target)) {
          expanded.push(resolveOriginReference(target, options));
        } else {

        }
      }
      return u.uniq(expanded);
    };
    parseSelector = function(selector, element, options) {
      var expandedTargets, filters, layers;
      if (options == null) {
        options = {};
      }
      filters = [];
      if (!options.destroying) {
        filters.push(isNotDestroying);
      }
      options.layer || (options.layer = element);
      layers = up.layer.getAll(options);
      if (options.layer !== 'any' && !(element && e.isDetached(element))) {
        filters.push(function(match) {
          return u.some(layers, function(layer) {
            return layer.contains(match);
          });
        });
      }
      expandedTargets = up.fragment.expandTargets(selector, u.merge(options, {
        layer: layers[0]
      }));
      selector = expandedTargets.join(',') || 'match-none';
      selector = selector.replace(CSS_HAS_SUFFIX_PATTERN, function(match, descendantSelector) {
        filters.push(function(element) {
          return element.querySelector(descendantSelector);
        });
        return '';
      });
      return new up.Selector(selector, filters);
    };

    /***
    Your [target selectors](/a-up-target) may use this pseudo-selector
    to replace the layer's [main element](/up.fragment.config.mainTargets).
    
    \#\#\# Example
    
    ```js
    up.render(':main', { url: '/page2' })
    ```
    
    @selector :main
    @experimental
     */

    /***
    Your [target selectors](/a-up-target) may use this pseudo-selector
    to replace the layer's topmost swappable element.
    
    The topmost swappable element is the first child of the layer's container element.
    For the [root layer](/up.layer.root) it is the `<body>` element. For an overlay
    it is the target with which the overlay was opened with.
    
    In canonical usage the topmost swappable element is often a [main element](/up.fragment.config.mainTargets).
    
    \#\#\# Example
    
    The following will replace the `<body>` element in the root layer,
    and the topmost swappable element in an overlay:
    
    ```js
    up.render(':layer', { url: '/page2' })
    ```
    
    @selector :layer
    @experimental
     */

    /***
    @function up.fragment.matches
    @param {Element} fragment
    @param {string|Array<string>} selectorOrSelectors
    @param {string|up.Layer} options.layer
      The layer for which to match.
    
      Pseudo-selectors like :main may expand to different selectors
      in different layers.
    @param {string|up.Layer} options.mode
      Required if `{ layer: 'new' }` is passed.
    @return {boolean}
     */
    matches = function(element, selector, options) {
      if (options == null) {
        options = {};
      }
      element = e.get(element);
      selector = parseSelector(selector, element, options);
      return selector.matches(element);
    };
    shouldAutoScroll = function(fragment, options) {
      var result;
      result = matches(fragment, config.autoScrollTargets, options);
      return result;
    };
    shouldAutoHistory = function(fragment, options) {
      var result;
      result = matches(fragment, config.autoHistoryTargets, options);
      return result;
    };
    up.on('up:app:boot', function() {
      var body;
      body = document.body;
      body.setAttribute('up-source', up.history.location);
      return hello(body);
    });
    up.on('up:framework:reset', reset);
    return u.literal({
      config: config,
      reload: reload,
      destroy: destroy,
      render: render,
      navigate: navigate,
      first: getFirst,
      get: getOne,
      all: getAll,
      subtree: getSubtree,
      closest: closest,
      source: sourceOf,
      hello: hello,
      visit: visit,
      markAsDestroying: markFragmentAsDestroying,
      emitInserted: emitFragmentInserted,
      emitDestroyed: emitFragmentDestroyed,
      emitKeep: emitFragmentKeep,
      emitKept: emitFragmentKept,
      successKey: successKey,
      failKey: failKey,
      expandTargets: expandTargets,
      toTarget: toTarget,
      matches: matches,
      shouldAutoScroll: shouldAutoScroll,
      shouldAutoHistory: shouldAutoHistory
    });
  })();

  up.replace = up.fragment.replace;

  up.extract = up.fragment.extract;

  up.reload = up.fragment.reload;

  up.destroy = up.fragment.destroy;

  up.render = up.fragment.render;

  up.navigate = up.fragment.navigate;

  up.hello = up.fragment.hello;

  up.visit = up.fragment.visit;

}).call(this);

/***
Scrolling viewports
===================

The `up.viewport` module controls the scroll position of scrollable containers ("viewports").

The default viewport for any web application is the main document. An application may
define additional viewports by giving the CSS property `{ overflow-y: scroll }` to any `<div>`.


\#\#\# Revealing new content

When following a [link to a fragment](/a-up-target) Unpoly will automatically
scroll the document's viewport to [reveal](/up.viewport) the updated content.

You should [make Unpoly aware](/up.viewport.config#config.fixedTop) of fixed elements in your
layout, such as navigation bars or headers. Unpoly will respect these sticky
elements when [revealing updated fragments](/up.reveal).

You should also [tell Unpoly](/up.viewport.config#config.viewportSelectors) when your application has more than one viewport,
so Unpoly can pick the right viewport to scroll for each fragment update.


\#\#\# Bootstrap integration

When using Bootstrap integration (`unpoly-bootstrap3.js` and `unpoly-bootstrap3.css`)
Unpoly will automatically be aware of sticky Bootstrap components such as
[fixed navbar](https://getbootstrap.com/examples/navbar-fixed-top/).

@module up.viewport
 */

(function() {
  var slice = [].slice;

  up.viewport = (function() {
    var absolutize, allSelector, anchoredRight, autofocus, closest, config, doFocus, e, f, finishScrolling, firstHashTarget, fixedElements, getAll, getAround, getRoot, getScrollTops, getSubtree, isRoot, makeFocusable, parseOptions, pureHash, reset, resetScroll, restoreScroll, reveal, revealHash, rootHasReducedWidthFromScrollbar, rootHeight, rootOverflowElement, rootSelector, rootWidth, saveScroll, scroll, scrollTopKey, scrollTops, scrollbarWidth, scrollingController, setScrollTops, tryFocus, u, wasChosenAsOverflowingElement;
    u = up.util;
    e = up.element;
    f = up.fragment;

    /***
    Configures the application layout.
    
    @property up.viewport.config
    @param {Array} [config.viewportSelectors]
      An array of CSS selectors that find viewports
      (containers that scroll their contents).
    @param {Array} [config.fixedTop]
      An array of CSS selectors that find elements fixed to the
      top edge of the screen (using `position: fixed`).
      See [`[up-fixed="top"]`](/up-fixed-top) for details.
    @param {Array} [config.fixedBottom]
      An array of CSS selectors that find elements fixed to the
      bottom edge of the screen (using `position: fixed`).
      See [`[up-fixed="bottom"]`](/up-fixed-bottom) for details.
    @param {Array} [config.anchoredRight]
      An array of CSS selectors that find elements anchored to the
      right edge of the screen (using `right:0` with `position: fixed` or `position: absolute`).
      See [`[up-anchored="right"]`](/up-anchored-right) for details.
    @param {number} [config.revealSnap]
      When [revealing](/up.reveal) elements, Unpoly will scroll an viewport
      to the top when the revealed element is closer to the viewport's top edge
      than `config.revealSnap`.
    
      Set to `0` to disable snapping.
    @param {number} [config.revealPadding]
      The desired padding between a [revealed](/up.reveal) element and the
      closest [viewport](/up.viewport) edge (in pixels).
    @param {number} [config.revealMax]
      A number indicating how many top pixel rows of a high element to [reveal](/up.reveal).
    
      Defaults to 50% of the available window height.
    
      You may set this to `false` to always reveal as much of the element as the viewport allows.
    
      You may also pass a function that receives an argument `{ viewportRect, elementRect }` and returns
      a maximum height in pixel. Each given rectangle has properties `{ top, right, buttom, left, width, height }`.
    @param {number} [config.revealTop=false]
      Whether to always scroll a [revealing](/up.reveal) element to the top.
    
      By default Unpoly will scroll as little as possible to make the element visible.
    @param {number} [config.scrollSpeed=1]
      The speed of the scrolling motion when [scrolling](/up.scroll) with `{ behavior: 'smooth' }`.
    
      The default value (`1`) roughly corresponds to the speed of Chrome's
      [native smooth scrolling](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior).
    @stable
     */
    config = new up.Config(function() {
      return {
        duration: 0,
        viewportSelectors: ['[up-viewport]', '[up-fixed]'],
        fixedTop: ['[up-fixed~=top]'],
        fixedBottom: ['[up-fixed~=bottom]'],
        anchoredRight: ['[up-anchored~=right]', '[up-fixed~=top]', '[up-fixed~=bottom]', '[up-fixed~=right]'],
        revealSnap: 200,
        revealPadding: 0,
        revealTop: false,
        revealMax: function() {
          return 0.5 * window.innerHeight;
        },
        scrollSpeed: 1,
        autofocus: true
      };
    });
    scrollingController = new up.MotionController('scrolling');
    reset = function() {
      config.reset();
      return scrollingController.reset();
    };

    /***
    Scrolls the given viewport to the given Y-position.
    
    A "viewport" is an element that has scrollbars, e.g. `<body>` or
    a container with `overflow-x: scroll`.
    
    \#\#\# Example
    
    This will scroll a `<div class="main">...</div>` to a Y-position of 100 pixels:
    
        up.scroll('.main', 100)
    
    \#\#\# Animating the scrolling motion
    
    The scrolling can (optionally) be animated.
    
        up.scroll('.main', 100, { behavior: 'smooth' })
    
    If the given viewport is already in a scroll animation when `up.scroll()`
    is called a second time, the previous animation will instantly jump to the
    last frame before the next animation is started.
    
    @function up.scroll
    @param {string|Element|jQuery} viewport
      The container element to scroll.
    @param {number} scrollPos
      The absolute number of pixels to set the scroll position to.
    @param {string}[options.behavior='auto']
      When set to `'auto'`, this will immediately scroll to the new position.
    
      When set to `'smooth'`, this will scroll smoothly to the new position.
    @param {number}[options.speed]
      The speed of the scrolling motion when scrolling with `{ behavior: 'smooth' }`.
    
      Defaults to `up.viewport.config.scrollSpeed`.
    @return {Promise}
      A promise that will be fulfilled when the scrolling ends.
    @experimental
     */
    scroll = function(viewport, scrollTop, options) {
      var motion;
      if (options == null) {
        options = {};
      }
      viewport = f.get(viewport, options);
      motion = new up.ScrollMotion(viewport, scrollTop, options);
      return scrollingController.startMotion(viewport, motion, options);
    };

    /***
    Finishes scrolling animations in the given element, its ancestors or its descendants.
    
    @function up.viewport.finishScrolling
    @param {string|Element|jQuery}
    @return {Promise}
    @internal
     */
    finishScrolling = function(element) {
      var viewport;
      if (!up.motion.isEnabled()) {
        return Promise.resolve();
      }
      viewport = closest(element);
      return scrollingController.finish(viewport);
    };

    /***
    @function up.viewport.anchoredRight
    @internal
     */
    anchoredRight = function() {
      var selector;
      selector = config.anchoredRight.join(',');
      return f.all(selector, {
        layer: 'root'
      });
    };

    /***
    Scroll's the given element's viewport so the first rows of the
    element are visible for the user.
    
    By default Unpoly will always reveal an element before
    updating it with JavaScript functions like [`up.replace()`](/up.replace)
    or UJS behavior like [`[up-target]`](/a-up-target).
    
    \#\#\# How Unpoly finds the viewport
    
    The viewport (the container that is going to be scrolled)
    is the closest parent of the element that is either:
    
    - the currently open [modal](/up.modal)
    - an element with the attribute `[up-viewport]`
    - the `<body>` element
    - an element matching the selector you have configured using `up.viewport.config.viewportSelectors.push('my-custom-selector')`
    
    \#\#\# Fixed elements obstruction the viewport
    
    Many applications have a navigation bar fixed to the top or bottom,
    obstructing the view on an element.
    
    You can make `up.reveal()` aware of these fixed elements
    so it can scroll the viewport far enough so the revealed element is fully visible.
    To make `up.reveal()` aware fixed elements you can either:
    
    - give the element an attribute [`up-fixed="top"`](/up-fixed-top) or [`up-fixed="bottom"`](up-fixed-bottom)
    - [configure default options](/up.viewport.config) for `fixedTop` or `fixedBottom`
    
    @function up.reveal
    @param {string|Element|jQuery} element
      The element to reveal.
    @param {number} [options.speed=1]
      The speed of the scrolling motion when scrolling with `{ behavior: 'smooth' }`.
    
      The default value (`1`) roughly corresponds to the speed of Chrome's
      [native smooth scrolling](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior).
    
      Defaults to `up.viewport.config.scrollSpeed`.
    @param {string} [options.snap]
      When the the revealed element would be closer to the viewport's top edge
      than this value, Unpoly will scroll the viewport to the top.
    
      Set to `0` to disable snapping.
    
      Defaults to `up.viewport.config.scrollSnap`.
    @param {string|Element|jQuery} [options.viewport]
      The scrolling element to scroll.
    
      Defaults to the [given element's viewport](/up.viewport.closest).
    @param {boolean} [options.top]
      Whether to scroll the viewport so that the first element row aligns
      with the top edge of the viewport.
    
      Defaults to `up.viewport.config.revealTop`.
    @param {string}[options.behavior='auto']
      When set to `'auto'`, this will immediately scroll to the new position.
    
      When set to `'smooth'`, this will scroll smoothly to the new position.
    @param {number}[options.speed]
      The speed of the scrolling motion when scrolling with `{ behavior: 'smooth' }`.
    
      Defaults to `up.viewport.config.scrollSpeed`.
    @param {number} [options.padding]
      The desired padding between the revealed element and the
      closest [viewport](/up.viewport) edge (in pixels).
    
      Defaults to `up.viewport.config.revealPadding`.
    @param {number|boolean} [options.snap]
      Whether to snap to the top of the viewport if the new scroll position
      after revealing the element is close to the top edge.
    
      Defaults to `up.viewport.config.revealSnap`.
    @param {boolean} [options.peel=true]
      Whether to close overlays obscuring the layer of `element`.
    @return {Promise}
      A promise that fulfills when the element is revealed.
    
      When the scrolling is animated with `{ behavior: 'smooth' }`, the promise
      fulfills when the animation is finished.
    
      When the scrolling is not animated, the promise will fulfill
      in the next [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).
    @stable
     */
    reveal = function(element, options) {
      var motion;
      options = u.options(options, {
        peel: true
      });
      element = f.get(element, options);
      if (!(options.layer = up.layer.get(element))) {
        return up.failed.async('Cannot reveal a detached element');
      }
      if (options.peel) {
        options.layer.peel();
      }
      motion = new up.RevealMotion(element, options);
      return scrollingController.startMotion(element, motion, options);
    };
    doFocus = function(element, options) {
      var oldScrollTop, viewport;
      if (options == null) {
        options = {};
      }
      if (options.preventScroll) {
        viewport = closest(element);
        oldScrollTop = viewport.scrollTop;
        element.focus();
        return viewport.scrollTop = oldScrollTop;
      } else {
        return element.focus();
      }
    };
    tryFocus = function(element, options) {
      doFocus(element, options);
      return element === document.activeElement;
    };
    autofocus = function(element, options) {
      var autofocusElement;
      if (autofocusElement = e.subtree(element, '[autofocus]')[0]) {
        doDocus(autofocusElement, options);
        return true;
      }
    };
    makeFocusable = function(element) {
      return e.setMissingAttr(element, 'tabindex', '-1');
    };

    /***
    [Reveals](/up.reveal) an element matching the given `#hash` anchor.
    
    Other than the default behavior found in browsers, `up.revealHash` works with
    [multiple viewports](/up-viewport) and honors [fixed elements](/up-fixed-top) obstructing the user's
    view of the viewport.
    
    When the page loads initially, this function is automatically called with the hash from
    the current URL.
    
    If no element matches the given `#hash` anchor, a resolved promise is returned.
    
    \#\#\# Example
    
        up.revealHash('#chapter2')
    
    @function up.viewport.revealHash
    @param {string} hash
    
    @return {Promise}
      A promise that fulfills when scroll position has changed to match the location hash.
    @experimental
     */
    revealHash = function(hash, options) {
      var match;
      if (hash && (match = firstHashTarget(hash, options))) {
        return up.reveal(match, {
          top: true
        });
      } else {
        up.warn('up.viewort.revealHash', 'Tried to reveal URL hash #%o, but no matching element found', hash);
        return Promise.resolve();
      }
    };
    allSelector = function() {
      return [rootSelector()].concat(slice.call(config.viewportSelectors)).join(',');
    };

    /***
    Returns the scrolling container for the given element.
    
    Returns the [document's scrolling element](/up.viewport.root)
    if no closer viewport exists.
    
    @function up.viewport.closest
    @param {string|Element|jQuery} target
    @return {Element}
    @experimental
     */
    closest = function(target, options) {
      var element;
      if (options == null) {
        options = {};
      }
      element = f.get(target, options);
      return e.closest(element, allSelector());
    };

    /***
    Returns a jQuery collection of all the viewports contained within the
    given selector or element.
    
    @function up.viewport.subtree
    @param {string|Element|jQuery} target
    @return List<Element>
    @internal
     */
    getSubtree = function(element, options) {
      if (options == null) {
        options = {};
      }
      element = f.get(element, options);
      return e.subtree(element, allSelector());
    };
    getAround = function(element, options) {
      if (options == null) {
        options = {};
      }
      element = f.get(element, options);
      return e.around(element, allSelector());
    };

    /***
    Returns a list of all the viewports on the current layer.
    
    @function up.viewport.all
    @internal
     */
    getAll = function(options) {
      if (options == null) {
        options = {};
      }
      return f.all(allSelector(), options);
    };
    rootSelector = function() {
      var element;
      if (element = document.scrollingElement) {
        return element.tagName;
      } else {
        return 'html';
      }
    };

    /***
    Return the [scrolling element](https://developer.mozilla.org/en-US/docs/Web/API/document/scrollingElement)
    for the browser's main content area.
    
    @function up.viewport.root
    @return {Element}
    @experimental
     */
    getRoot = function() {
      return document.querySelector(rootSelector());
    };
    rootWidth = function() {
      return e.root.clientWidth;
    };
    rootHeight = function() {
      return e.root.clientHeight;
    };
    isRoot = function(element) {
      return e.matches(element, rootSelector());
    };

    /***
    Returns whether the root viewport is currently showing a vertical scrollbar.
    
    Note that this returns `false` if the root viewport scrolls vertically but the browser
    shows no visible scroll bar at rest, e.g. on mobile devices that only overlay a scroll
    indicator while scrolling.
    
    @function up.viewport.rootHasReducedWidthFromScrollbar
    @internal
     */
    rootHasReducedWidthFromScrollbar = function() {
      return window.innerWidth > document.documentElement.offsetWidth;
    };

    /***
    Returns the element that controls the `overflow-y` behavior for the
    [document viewport](/up.viewport.root()).
    
    @function up.viewport.rootOverflowElement
    @internal
     */
    rootOverflowElement = function() {
      var body, element, html;
      body = document.body;
      html = document.documentElement;
      element = u.find([html, body], wasChosenAsOverflowingElement);
      return element || getRoot();
    };

    /***
    Returns whether the given element was chosen as the overflowing
    element by the developer.
    
    We have no control whether developers set the property on <body> or
    <html>. The developer also won't know what is going to be the
    [scrolling element](/up.viewport.root) on the user's browser.
    
    @function wasChosenAsOverflowingElement
    @internal
     */
    wasChosenAsOverflowingElement = function(element) {
      var overflowY;
      overflowY = e.style(element, 'overflow-y');
      return overflowY === 'auto' || overflowY === 'scroll';
    };

    /***
    Returns the width of a scrollbar.
    
    This only runs once per page load.
    
    @function up.viewport.scrollbarWidth
    @internal
     */
    scrollbarWidth = u.memoize(function() {
      var outer, outerStyle, width;
      outerStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100px',
        height: '100px',
        overflowY: 'scroll'
      };
      outer = up.element.affix(document.body, '[up-viewport]', {
        style: outerStyle
      });
      width = outer.offsetWidth - outer.clientWidth;
      up.element.remove(outer);
      return width;
    });
    scrollTopKey = function(viewport) {
      return up.fragment.toTarget(viewport);
    };

    /***
    Returns a hash with scroll positions.
    
    Each key in the hash is a viewport selector. The corresponding
    value is the viewport's top scroll position:
    
        up.viewport.scrollTops()
        => { '.main': 0, '.sidebar': 73 }
    
    @function up.viewport.scrollTops
    @return Object<string, number>
    @internal
     */
    scrollTops = function(options) {
      if (options == null) {
        options = {};
      }
      return u.mapObject(getAll(options), function(viewport) {
        return [scrollTopKey(viewport), viewport.scrollTop];
      });
    };

    /***
    @function up.viewport.fixedElements
    @internal
     */
    fixedElements = function(root) {
      var queryParts;
      if (root == null) {
        root = document;
      }
      queryParts = ['[up-fixed]'].concat(config.fixedTop).concat(config.fixedBottom);
      return root.querySelectorAll(queryParts.join(','));
    };

    /***
    Saves the top scroll positions of all viewports in the current layer.
    
    The scroll positions will be associated with the current URL.
    They can later be restored by calling [`up.viewport.restoreScroll()`](/up.viewport.restoreScroll)
    at the same URL, or by following a link with an [`[up-restore-scroll]`](/a-up-follow#up-restore-scroll)
    attribute.
    
    Unpoly automatically saves scroll positions before a [fragment update](/up.replace)
    you will rarely need to call this function yourself.
    
    \#\#\# Examples
    
    Should you need to save the current scroll positions outside of a [fragment update](/up.replace),
    you may call:
    
        up.viewport.saveScroll()
    
    Instead of saving the current scroll positions for the current URL, you may also pass another
    url or vertical scroll positionsfor each viewport:
    
        up.viewport.saveScroll({
          url: '/inbox',
          tops: {
            'body': 0,
            '.sidebar', 100,
            '.main', 320
          }
        })
    
    @function up.viewport.saveScroll
    @param {string} [options.location]
      The URL for which to save scroll positions.
      If omitted, the current browser location is used.
    @param {string} [options.layer]
      The layer for which to save scroll positions.
      If omitted, positions for the current layer will be saved.
    @param {Object<string, number>} [options.tops]
      An object mapping viewport selectors to vertical scroll positions in pixels.
    @experimental
     */
    saveScroll = function() {
      var args, options, ref, ref1, tops, url, viewports;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = parseOptions(args), viewports = ref[0], options = ref[1];
      if (url = options.location || options.layer.location) {
        tops = (ref1 = options.tops) != null ? ref1 : getScrollTops(viewports);
        return options.layer.lastScrollTops.set(url, tops);
      }
    };
    getScrollTops = function(viewports) {
      return u.mapObject(viewports, function(viewport) {
        return [scrollTopKey(viewport), viewport.scrollTop];
      });
    };

    /***
    Restores [previously saved](/up.viewport.saveScroll) scroll positions of viewports
    viewports configured in `up.viewport.config.viewportSelectors`.
    
    Unpoly automatically restores scroll positions when the user presses the back button.
    You can disable this behavior by setting [`up.history.config.restoreScroll = false`](/up.history.config).
    
    @function up.viewport.restoreScroll
    @param {Element} [viewport]
    @param {up.Layer|string} [options.layer]
      The layer on which to restore scroll positions.
    @return {Promise}
      A promise that will be fulfilled once scroll positions have been restored.
    @experimental
     */
    restoreScroll = function() {
      var args, options, ref, scrollTopsForURL, url, viewports;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = parseOptions(args), viewports = ref[0], options = ref[1];
      url = options.layer.location;
      scrollTopsForURL = options.layer.lastScrollTops.get(url) || {};
      up.puts('up.viewport.restoreScroll()', 'Restoring scroll positions for URL %s to %o', u.urlWithoutHost(url), scrollTopsForURL);
      return setScrollTops(viewports, scrollTopsForURL);
    };
    parseOptions = function(args) {
      var options, viewports;
      options = u.copy(u.extractOptions(args));
      options.layer = up.layer.get(options);
      if (args[0]) {
        viewports = [closest(args[0], options)];
      } else if (options.around) {
        viewports = getAround(options.around, options);
      } else {
        viewports = getAll(options);
      }
      return [viewports, options];
    };
    resetScroll = function() {
      var args, options, ref, viewports;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = parseOptions(args), viewports = ref[0], options = ref[1];
      return setScrollTops(viewports, {});
    };
    setScrollTops = function(viewports, tops) {
      var allScrollPromises;
      allScrollPromises = u.map(viewports, function(viewport) {
        var key, scrollTop;
        key = scrollTopKey(viewport);
        scrollTop = tops[key] || 0;
        return scroll(viewport, scrollTop, {
          duration: 0
        });
      });
      return Promise.all(allScrollPromises);
    };

    /***
    @internal
     */
    absolutize = function(element, options) {
      var bounds, boundsRect, moveBounds, newElementRect, originalRect, viewport, viewportRect;
      if (options == null) {
        options = {};
      }
      viewport = closest(element);
      viewportRect = viewport.getBoundingClientRect();
      originalRect = element.getBoundingClientRect();
      boundsRect = new up.Rect({
        left: originalRect.left - viewportRect.left,
        top: originalRect.top - viewportRect.top,
        width: originalRect.width,
        height: originalRect.height
      });
      if (typeof options.afterMeasure === "function") {
        options.afterMeasure();
      }
      e.setStyle(element, {
        position: element.style.position === 'static' ? 'static' : 'relative',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
        width: '100%',
        height: '100%'
      });
      bounds = e.createFromSelector('up-bounds');
      e.insertBefore(element, bounds);
      bounds.appendChild(element);
      moveBounds = function(diffX, diffY) {
        boundsRect.left += diffX;
        boundsRect.top += diffY;
        return e.setStyle(bounds, boundsRect);
      };
      moveBounds(0, 0);
      newElementRect = element.getBoundingClientRect();
      moveBounds(originalRect.left - newElementRect.left, originalRect.top - newElementRect.top);
      u.each(fixedElements(element), e.fixedToAbsolute);
      return {
        bounds: bounds,
        moveBounds: moveBounds
      };
    };

    /***
    Marks this element as a scrolling container ("viewport").
    
    Apply this attribute if your app uses a custom panel layout with fixed positioning
    instead of scrolling `<body>`. As an alternative you can also push a selector
    matching your custom viewport to the `up.viewport.config.viewportSelectors` array.
    
    [`up.reveal()`](/up.reveal) will always try to scroll the viewport closest
    to the element that is being revealed. By default this is the `<body>` element.
    
    \#\#\# Example
    
    Here is an example for a layout for an e-mail client, showing a list of e-mails
    on the left side and the e-mail text on the right side:
    
        .side {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: 100px;
          overflow-y: scroll;
        }
    
        .main {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 100px;
          right: 0;
          overflow-y: scroll;
        }
    
    This would be the HTML (notice the `up-viewport` attribute):
    
        <div class=".side" up-viewport>
          <a href="/emails/5001" up-target=".main">Re: Your invoice</a>
          <a href="/emails/2023" up-target=".main">Quote for services</a>
          <a href="/emails/9002" up-target=".main">Fwd: Room reservation</a>
        </div>
    
        <div class="main" up-viewport>
          <h1>Re: Your Invoice</h1>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            Stet clita kasd gubergren, no sea takimata sanctus est.
          </p>
        </div>
    
    @selector [up-viewport]
    @stable
     */

    /***
    Marks this element as being fixed to the top edge of the screen
    using `position: fixed`.
    
    When [following a fragment link](/a-up-target), the viewport is scrolled
    so the targeted element becomes visible. By using this attribute you can make
    Unpoly aware of fixed elements that are obstructing the viewport contents.
    Unpoly will then scroll the viewport far enough that the revealed element is fully visible.
    
    Instead of using this attribute,
    you can also configure a selector in `up.viewport.config.fixedTop`.
    
    \#\#\# Example
    
        <div class="top-nav" up-fixed="top">...</div>
    
    @selector [up-fixed=top]
    @stable
     */

    /***
    Marks this element as being fixed to the bottom edge of the screen
    using `position: fixed`.
    
    When [following a fragment link](/a-up-target), the viewport is scrolled
    so the targeted element becomes visible. By using this attribute you can make
    Unpoly aware of fixed elements that are obstructing the viewport contents.
    Unpoly will then scroll the viewport far enough that the revealed element is fully visible.
    
    Instead of using this attribute,
    you can also configure a selector in `up.viewport.config.fixedBottom`.
    
    \#\#\# Example
    
        <div class="bottom-nav" up-fixed="bottom">...</div>
    
    @selector [up-fixed=bottom]
    @stable
     */

    /***
    Marks this element as being anchored to the right edge of the screen,
    typically fixed navigation bars.
    
    Since [modal dialogs](/up.modal) hide the document scroll bar,
    elements anchored to the right appear to jump when the dialog opens or
    closes. Applying this attribute to anchored elements will make Unpoly
    aware of the issue and adjust the `right` property accordingly.
    
    You should give this attribute to layout elements
    with a CSS of `right: 0` with `position: fixed` or `position:absolute`.
    
    Instead of giving this attribute to any affected element,
    you can also configure a selector in `up.viewport.config.anchoredRight`.
    
    \#\#\# Example
    
    Here is the CSS for a navigation bar that is anchored to the top edge of the screen:
    
        .top-nav {
           position: fixed;
           top: 0;
           left: 0;
           right: 0;
         }
    
    By adding an `up-anchored="right"` attribute to the element, we can prevent the
    `right` edge from jumping when a [modal dialog](/up.modal) opens or closes:
    
        <div class="top-nav" up-anchored="right">...</div>
    
    @selector [up-anchored=right]
    @stable
     */

    /***
    @function up.viewport.firstHashTarget
    @internal
     */
    firstHashTarget = function(hash, options) {
      var selector;
      if (options == null) {
        options = {};
      }
      if (hash = pureHash(hash)) {
        selector = [e.attributeSelector('id', hash), 'a' + e.attributeSelector('name', hash)].join(',');
        return f.get(selector, options);
      }
    };

    /***
    Returns `'foo'` if the hash is `'#foo'`.
    
    Returns undefined if the hash is `'#'`, `''` or `undefined`.
    
    @function pureHash
    @internal
     */
    pureHash = function(value) {
      if (value && value[0] === '#') {
        value = value.substr(1);
      }
      return u.presence(value);
    };
    up.on('up:app:booted', function() {
      var hash;
      if (hash = location.hash) {
        return revealHash(hash);
      }
    });
    up.on('up:framework:reset', reset);
    return u.literal({
      reveal: reveal,
      revealHash: revealHash,
      firstHashTarget: firstHashTarget,
      scroll: scroll,
      config: config,
      get: closest,
      subtree: getSubtree,
      around: getAround,
      all: getAll,
      rootSelector: rootSelector,
      get_root: getRoot,
      rootWidth: rootWidth,
      rootHeight: rootHeight,
      rootHasReducedWidthFromScrollbar: rootHasReducedWidthFromScrollbar,
      rootOverflowElement: rootOverflowElement,
      isRoot: isRoot,
      scrollbarWidth: scrollbarWidth,
      scrollTops: scrollTops,
      saveScroll: saveScroll,
      restoreScroll: restoreScroll,
      resetScroll: resetScroll,
      anchoredRight: anchoredRight,
      fixedElements: fixedElements,
      absolutize: absolutize,
      focus: doFocus,
      tryFocus: tryFocus,
      autofocus: autofocus,
      makeFocusable: makeFocusable
    });
  })();

  up.focus = up.viewport.focus;

  up.scroll = up.viewport.scroll;

  up.reveal = up.viewport.reveal;

  up.revealHash = up.viewport.revealHash;

}).call(this);

/***
Animation
=========
  
Whenever you [update a page fragment](/up.link) you can animate the change.

Let's say you are using an [`up-target`](/a-up-target) link to update an element
with content from the server. You can add an attribute [`up-transition`](/a-up-target#up-transition)
to smoothly fade out the old element while fading in the new element:

    <a href="/users" up-target=".list" up-transition="cross-fade">Show users</a>

\#\#\# Transitions vs. animations

When we morph between an old and a new element, we call it a *transition*.
In contrast, when we animate a new element without simultaneously removing an
old element, we call it an *animation*.

An example for an animation is opening a new dialog. We can animate the appearance
of the dialog by adding an [`[up-animation]`](/a-up-modal#up-animation) attribute to the opening link:

    <a href="/users" up-modal=".list" up-animation="move-from-top">Show users</a>

\#\#\# Which animations are available?

Unpoly ships with a number of [predefined transitions](/up.morph#named-transitions)
and [predefined animations](/up.animate#named-animations).

You can define custom animations using [`up.transition()`](/up.transition) and
[`up.animation()`](/up.animation).

@module up.motion
 */

(function() {
  up.motion = (function() {
    var animCount, animate, animateNow, applyConfig, composeTransitionFn, config, defaultNamedAnimations, defaultNamedTransitions, e, findAnimationFn, findNamedAnimation, findTransitionFn, finish, isEnabled, isNone, morph, motionController, namedAnimations, namedTransitions, registerAnimation, registerTransition, reset, skipAnimate, snapshot, swapElementsDirectly, translateCSS, u, willAnimate;
    u = up.util;
    e = up.element;
    namedAnimations = {};
    defaultNamedAnimations = {};
    namedTransitions = {};
    defaultNamedTransitions = {};
    motionController = new up.MotionController('motion');

    /***
    Sets default options for animations and transitions.
    
    @property up.motion.config
    @param {number} [config.duration=200]
      The default duration for all animations and transitions (in milliseconds).
    @param {string} [config.easing='ease']
      The default timing function that controls the acceleration of animations and transitions.
    
      See [W3C documentation](http://www.w3.org/TR/css3-transitions/#transition-timing-function)
      for a list of pre-defined timing functions.
    @param {boolean} [config.enabled=true]
      Whether animation is enabled.
    
      Set this to `false` to disable animation globally.
      This can be useful in full-stack integration tests like a Selenium test suite.
    
      Regardless of this setting, all animations will be skipped on browsers
      that do not support [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions).
    @stable
     */
    config = new up.Config(function() {
      return {
        duration: 175,
        easing: 'ease',
        enabled: !matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    });
    reset = function() {
      motionController.reset();
      namedAnimations = u.copy(defaultNamedAnimations);
      namedTransitions = u.copy(defaultNamedTransitions);
      return config.reset();
    };

    /***
    Returns whether Unpoly will perform animations.
    
    Set [`up.motion.config.enabled = false`](/up.motion.config#config.enabled) in order to disable animations globally.
    
    @function up.motion.isEnabled
    @return {boolean}
    @stable
     */
    isEnabled = function() {
      return config.enabled;
    };

    /***
    Applies the given animation to the given element.
    
    \#\#\# Example
    
        up.animate('.warning', 'fade-in')
    
    You can pass additional options:
    
        up.animate('.warning', 'fade-in', {
          delay: 1000,
          duration: 250,
          easing: 'linear'
        })
    
    \#\#\# Named animations
    
    The following animations are pre-defined:
    
    | `fade-in`          | Changes the element's opacity from 0% to 100% |
    | `fade-out`         | Changes the element's opacity from 100% to 0% |
    | `move-to-top`      | Moves the element upwards until it exits the screen at the top edge |
    | `move-from-top`    | Moves the element downwards from beyond the top edge of the screen until it reaches its current position |
    | `move-to-bottom`   | Moves the element downwards until it exits the screen at the bottom edge |
    | `move-from-bottom` | Moves the element upwards from beyond the bottom edge of the screen until it reaches its current position |
    | `move-to-left`     | Moves the element leftwards until it exists the screen at the left edge  |
    | `move-from-left`   | Moves the element rightwards from beyond the left edge of the screen until it reaches its current position |
    | `move-to-right`    | Moves the element rightwards until it exists the screen at the right edge  |
    | `move-from-right`  | Moves the element leftwards from beyond the right  edge of the screen until it reaches its current position |
    | `none`             | An animation that has no visible effect. Sounds useless at first, but can save you a lot of `if` statements. |
    
    You can define additional named animations using [`up.animation()`](/up.animation).
    
    \#\#\# Animating CSS properties directly
    
    By passing an object instead of an animation name, you can animate
    the CSS properties of the given element:
    
        var warning = document.querySelector('.warning')
        warning.style.opacity = 0
        up.animate(warning, { opacity: 1 })
    
    CSS properties must be given in `kebab-case`, not `camelCase`.
    
    \#\#\# Multiple animations on the same element
    
    Unpoly doesn't allow more than one concurrent animation on the same element.
    
    If you attempt to animate an element that is already being animated,
    the previous animation will instantly jump to its last frame before
    the new animation begins.
    
    @function up.animate
    @param {Element|jQuery|string} element
      The element to animate.
    @param {string|Function(element, options): Promise|Object} animation
      Can either be:
    
      - The animation's name
      - A function performing the animation
      - An object of CSS attributes describing the last frame of the animation (using kebeb-case property names)
    @param {number} [options.duration=300]
      The duration of the animation, in milliseconds.
    @param {string} [options.easing='ease']
      The timing function that controls the animation's acceleration.
    
      See [W3C documentation](http://www.w3.org/TR/css3-transitions/#transition-timing-function)
      for a list of pre-defined timing functions.
    @return {Promise}
      A promise for the animation's end.
    @stable
     */
    animate = function(element, animation, options) {
      var animationFn, runNow, willRun;
      element = up.fragment.get(element);
      options = u.options(options);
      applyConfig(options);
      animationFn = findAnimationFn(animation);
      willRun = willAnimate(element, animation, options);
      if (willRun) {
        runNow = function() {
          return animationFn(element, options);
        };
        return motionController.startFunction(element, runNow, options);
      } else {
        return skipAnimate(element, animation);
      }
    };
    willAnimate = function(element, animationOrTransition, options) {
      return isEnabled() && !isNone(animationOrTransition) && options.duration > 0 && !e.isSingleton(element);
    };
    skipAnimate = function(element, animation) {
      if (u.isOptions(animation)) {
        e.setStyle(element, animation);
      }
      return Promise.resolve();
    };
    animCount = 0;

    /***
    Animates the given element's CSS properties using CSS transitions.
    
    Does not track the animation, nor does it finishes existing animations
    (use `up.motion.animate()` for that). It does, however, listen to the motionController's
    finish event.
    
    @function animateNow
    @param {Element|jQuery|string} element
      The element to animate.
    @param {Object} lastFrame
      The CSS properties that should be transitioned to.
    @param {number} [options.duration=300]
      The duration of the animation, in milliseconds.
    @param {string} [options.easing='ease']
      The timing function that controls the animation's acceleration.
      See [W3C documentation](http://www.w3.org/TR/css3-transitions/#transition-timing-function)
      for a list of pre-defined timing functions.
    @return {Promise}
      A promise that fulfills when the animation ends.
    @internal
     */
    animateNow = function(element, lastFrame, options) {
      var cssTransition;
      options = u.merge(options, {
        finishEvent: motionController.finishEvent
      });
      cssTransition = new up.CSSTransition(element, lastFrame, options);
      return cssTransition.start();
    };
    applyConfig = function(options) {
      options.easing || (options.easing = config.easing);
      return options.duration || (options.duration = config.duration);
    };
    findNamedAnimation = function(name) {
      return namedAnimations[name] || up.fail("Unknown animation %o", name);
    };

    /***
    Completes [animations](/up.animate) and [transitions](/up.morph).
    
    If called without arguments, all animations on the screen are completed.
    If given an element (or selector), animations on that element and its children
    are completed.
    
    Animations are completed by jumping to the last animation frame instantly.
    Promises returned by animation and transition functions instantly settle.
    
    Emits the `up:motion:finish` event that is already handled by `up.animate()`.
    
    Does nothing if there are no animation to complete.
    
    @function up.motion.finish
    @param {Element|jQuery|string} [element]
      The element around which to finish all animations.
    @return {Promise}
      A promise that fulfills when animations and transitions have finished.
    @stable
     */
    finish = function(element) {
      return motionController.finish(element);
    };

    /***
    This event is emitted on an [animating](/up.animating) element by `up.motion.finish()` to
    request the animation to instantly finish and skip to the last frame.
    
    Promises returned by now-finished animation functions are expected to settle.
    
    Animations started by `up.animate()` already handle this event.
    
    @event up:motion:finish
    @param {Element} event.target
      The animating element.
    @stable
     */

    /***
    Performs an animated transition between the `source` and `target` elements.
    
    Transitions are implement by performing two animations in parallel,
    causing `source` to disappear and the `target` to appear.
    
    - `target` is [inserted before](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore) `source`
    - `source` is removed from the [document flow](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning) with `position: absolute`.
       It will be positioned over its original place in the flow that is now occupied by `target`.
    - Both `source` and `target` are animated in parallel
    - `source` is removed from the DOM
    
    \#\#\# Named transitions
    
    The following transitions are pre-defined:
    
    | `cross-fade` | Fades out the first element. Simultaneously fades in the second element. |
    | `move-up`    | Moves the first element upwards until it exits the screen at the top edge. Simultaneously moves the second element upwards from beyond the bottom edge of the screen until it reaches its current position. |
    | `move-down`  | Moves the first element downwards until it exits the screen at the bottom edge. Simultaneously moves the second element downwards from beyond the top edge of the screen until it reaches its current position. |
    | `move-left`  | Moves the first element leftwards until it exists the screen at the left edge. Simultaneously moves the second element leftwards from beyond the right  edge of the screen until it reaches its current position. |
    | `move-right` | Moves the first element rightwards until it exists the screen at the right edge. Simultaneously moves the second element rightwards from beyond the left edge of the screen until it reaches its current position. |
    | `none`       | A transition that has no visible effect. Sounds useless at first, but can save you a lot of `if` statements. |
    
    You can define additional named transitions using [`up.transition()`](/up.transition).
    
    You can also compose a transition from two [named animations](/named-animations).
    separated by a slash character (`/`):
    
    - `move-to-bottom/fade-in`
    - `move-to-left/move-from-top`
    
    \#\#\# Implementation details
    
    During a transition both the old and new element occupy
    the same position on the screen.
    
    Since the CSS layout flow will usually not allow two elements to
    overlay the same space, Unpoly:
    
    - The old and new elements are cloned
    - The old element is removed from the layout flow using `display: hidden`
    - The new element is hidden, but still leaves space in the layout flow by setting `visibility: hidden`
    - The clones are [absolutely positioned](https://developer.mozilla.org/en-US/docs/Web/CSS/position#Absolute_positioning)
      over the original elements.
    - The transition is applied to the cloned elements.
      At no point will the hidden, original elements be animated.
    - When the transition has finished, the clones are removed from the DOM and the new element is shown.
      The old element remains hidden in the DOM.
    
    @function up.morph
    @param {Element|jQuery|string} source
    @param {Element|jQuery|string} target
    @param {Function(oldElement, newElement)|string} transition
    @param {number} [options.duration=300]
      The duration of the animation, in milliseconds.
    @param {string} [options.easing='ease']
      The timing function that controls the transition's acceleration.
    
      See [W3C documentation](http://www.w3.org/TR/css3-transitions/#transition-timing-function)
      for a list of pre-defined timing functions.
    @param {boolean} [options.reveal=false]
      Whether to reveal the new element by scrolling its parent viewport.
    @return {Promise}
      A promise that fulfills when the transition ends.
    @stable
     */
    morph = function(oldElement, newElement, transitionObject, options) {
      var afterDetach, afterInsert, beforeDetach, beforeStart, oldRemote, promise, scrollNew, scrollTopBeforeReveal, trackable, transitionFn, viewport, willMorph;
      options = u.options(options);
      applyConfig(options);
      oldElement = up.fragment.get(oldElement);
      newElement = up.fragment.get(newElement);
      transitionFn = findTransitionFn(transitionObject);
      willMorph = willAnimate(oldElement, transitionFn, options);
      beforeStart = u.pluckKey(options, 'beforeStart') || u.noop;
      afterInsert = u.pluckKey(options, 'afterInsert') || u.noop;
      beforeDetach = u.pluckKey(options, 'beforeDetach') || u.noop;
      afterDetach = u.pluckKey(options, 'afterDetach') || u.noop;
      scrollNew = u.pluckKey(options, 'scrollNew') || u.asyncNoop;
      beforeStart();
      if (willMorph) {
        if (motionController.isActive(oldElement) && options.trackMotion === false) {
          return transitionFn(oldElement, newElement, options);
        }
        up.puts('up.morph()', 'Morphing %o to %o with transition %O', oldElement, newElement, transitionObject);
        viewport = up.viewport.get(oldElement);
        scrollTopBeforeReveal = viewport.scrollTop;
        oldRemote = up.viewport.absolutize(oldElement, {
          afterMeasure: function() {
            e.insertBefore(oldElement, newElement);
            return afterInsert();
          }
        });
        trackable = function() {
          var promise;
          promise = scrollNew();
          promise = promise.then(function() {
            var scrollTopAfterReveal;
            scrollTopAfterReveal = viewport.scrollTop;
            oldRemote.moveBounds(0, scrollTopAfterReveal - scrollTopBeforeReveal);
            return transitionFn(oldElement, newElement, options);
          });
          promise = promise.then(function() {
            beforeDetach();
            e.remove(oldRemote.bounds);
            return afterDetach();
          });
          return promise;
        };
        return motionController.startFunction([oldElement, newElement], trackable, options);
      } else {
        beforeDetach();
        swapElementsDirectly(oldElement, newElement);
        afterInsert();
        afterDetach();
        promise = scrollNew();
        return promise;
      }
    };
    findTransitionFn = function(object) {
      var namedTransition;
      if (isNone(object)) {
        return void 0;
      } else if (u.isFunction(object)) {
        return object;
      } else if (u.isArray(object)) {
        return composeTransitionFn.apply(null, object);
      } else if (u.isString(object)) {
        if (object.indexOf('/') >= 0) {
          return composeTransitionFn.apply(null, object.split('/'));
        } else if (namedTransition = namedTransitions[object]) {
          return findTransitionFn(namedTransition);
        }
      } else {
        return up.fail("Unknown transition %o", object);
      }
    };
    composeTransitionFn = function(oldAnimation, newAnimation) {
      var newAnimationFn, oldAnimationFn;
      if (isNone(oldAnimation) && isNone(oldAnimation)) {
        return void 0;
      } else {
        oldAnimationFn = findAnimationFn(oldAnimation) || u.asyncNoop;
        newAnimationFn = findAnimationFn(newAnimation) || u.asyncNoop;
        return function(oldElement, newElement, options) {
          return Promise.all([oldAnimationFn(oldElement, options), newAnimationFn(newElement, options)]);
        };
      }
    };
    findAnimationFn = function(object) {
      if (isNone(object)) {
        return void 0;
      } else if (u.isFunction(object)) {
        return object;
      } else if (u.isString(object)) {
        return findNamedAnimation(object);
      } else if (u.isOptions(object)) {
        return function(element, options) {
          return animateNow(element, object, options);
        };
      } else {
        return up.fail('Unknown animation %o', object);
      }
    };
    swapElementsDirectly = function(oldElement, newElement) {
      return e.replace(oldElement, newElement);
    };

    /***
    Defines a named transition that [morphs](/up.element) from one element to another.
    
    \#\#\# Example
    
    Here is the definition of the pre-defined `cross-fade` animation:
    
        up.transition('cross-fade', (oldElement, newElement, options) ->
          Promise.all([
            up.animate(oldElement, 'fade-out', options),
            up.animate(newElement, 'fade-in', options)
          ])
        )
    
    It is recommended that your transitions use [`up.animate()`](/up.animate),
    passing along the `options` that were passed to you.
    
    If you choose to *not* use `up.animate()` and roll your own
    logic instead, your code must honor the following contract:
    
    1. It must honor the options `{ duration, easing }` if given.
    2. It must *not* remove any of the given elements from the DOM.
    3. It returns a promise that is fulfilled when the transition has ended.
    4. If during the animation an event `up:motion:finish` is emitted on
       either element, the transition instantly jumps to the last frame
       and resolves the returned promise.
    
    Calling [`up.animate()`](/up.animate) with an object argument
    will take care of all these points.
    
    @function up.transition
    @param {string} name
    @param {Function(oldElement, newElement, options): Promise|Array} transition
    @stable
     */
    registerTransition = function(name, transition) {
      return namedTransitions[name] = findTransitionFn(transition);
    };

    /***
    Defines a named animation.
    
    Here is the definition of the pre-defined `fade-in` animation:
    
        up.animation('fade-in', function(element, options) {
          element.style.opacity = 0
          up.animate(element, { opacity: 1 }, options)
        })
    
    It is recommended that your definitions always end by calling
    calling [`up.animate()`](/up.animate) with an object argument, passing along
    the `options` that were passed to you.
    
    If you choose to *not* use `up.animate()` and roll your own
    animation code instead, your code must honor the following contract:
    
    1. It must honor the options `{ duration, easing }` if given
    2. It must *not* remove any of the given elements from the DOM.
    3. It returns a promise that is fulfilled when the transition has ended
    4. If during the animation an event `up:motion:finish` is emitted on
       the given element, the transition instantly jumps to the last frame
       and resolves the returned promise.
    
    Calling [`up.animate()`](/up.animate) with an object argument
    will take care of all these points.
    
    @function up.animation
    @param {string} name
    @param {Function(element, options): Promise} animation
    @stable
     */
    registerAnimation = function(name, animation) {
      return namedAnimations[name] = findAnimationFn(animation);
    };
    snapshot = function() {
      defaultNamedAnimations = u.copy(namedAnimations);
      return defaultNamedTransitions = u.copy(namedTransitions);
    };

    /***
    Returns whether the given animation option will cause the animation
    to be skipped.
    
    @function up.motion.isNone
    @internal
     */
    isNone = function(animationOrTransition) {
      return !animationOrTransition || animationOrTransition === 'none';
    };
    registerAnimation('fade-in', function(element, options) {
      e.setStyle(element, {
        opacity: 0
      });
      return animateNow(element, {
        opacity: 1
      }, options);
    });
    registerAnimation('fade-out', function(element, options) {
      e.setStyle(element, {
        opacity: 1
      });
      return animateNow(element, {
        opacity: 0
      }, options);
    });
    translateCSS = function(x, y) {
      return {
        transform: "translate(" + x + "px, " + y + "px)"
      };
    };
    registerAnimation('move-to-top', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = box.top + box.height;
      return animateNow(element, translateCSS(0, -travelDistance), options);
    });
    registerAnimation('move-from-top', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = box.top + box.height;
      e.setStyle(element, translateCSS(0, -travelDistance));
      return animateNow(element, translateCSS(0, 0), options);
    });
    registerAnimation('move-to-bottom', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = e.root.clientHeight - box.top;
      return animateNow(element, translateCSS(0, travelDistance), options);
    });
    registerAnimation('move-from-bottom', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = up.viewport.rootHeight() - box.top;
      e.setStyle(element, translateCSS(0, travelDistance));
      return animateNow(element, translateCSS(0, 0), options);
    });
    registerAnimation('move-to-left', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = box.left + box.width;
      return animateNow(element, translateCSS(-travelDistance, 0), options);
    });
    registerAnimation('move-from-left', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = box.left + box.width;
      e.setStyle(element, translateCSS(-travelDistance, 0));
      return animateNow(element, translateCSS(0, 0), options);
    });
    registerAnimation('move-to-right', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = up.viewport.rootWidth() - box.left;
      return animateNow(element, translateCSS(travelDistance, 0), options);
    });
    registerAnimation('move-from-right', function(element, options) {
      var box, travelDistance;
      e.setStyle(element, translateCSS(0, 0));
      box = element.getBoundingClientRect();
      travelDistance = up.viewport.rootWidth() - box.left;
      e.setStyle(element, translateCSS(travelDistance, 0));
      return animateNow(element, translateCSS(0, 0), options);
    });
    registerAnimation('roll-down', function(element, options) {
      var deferred, previousHeightStr, styleMemo;
      previousHeightStr = e.style(element, 'height');
      styleMemo = e.setTemporaryStyle(element, {
        height: '0px',
        overflow: 'hidden'
      });
      deferred = animate(element, {
        height: previousHeightStr
      }, options);
      deferred.then(styleMemo);
      return deferred;
    });
    registerTransition('move-left', ['move-to-left', 'move-from-right']);
    registerTransition('move-right', ['move-to-right', 'move-from-left']);
    registerTransition('move-up', ['move-to-top', 'move-from-bottom']);
    registerTransition('move-down', ['move-to-bottom', 'move-from-top']);
    registerTransition('cross-fade', ['fade-out', 'fade-in']);
    up.on('up:framework:booted', snapshot);
    up.on('up:framework:reset', reset);
    return {
      morph: morph,
      animate: animate,
      finish: finish,
      finishCount: function() {
        return motionController.finishCount;
      },
      transition: registerTransition,
      animation: registerAnimation,
      config: config,
      isEnabled: isEnabled,
      isNone: isNone,
      willAnimate: willAnimate
    };
  })();

  up.transition = up.motion.transition;

  up.animation = up.motion.animation;

  up.morph = up.motion.morph;

  up.animate = up.motion.animate;

}).call(this);
(function() {
  var u,
    slice = [].slice;

  u = up.util;


  /***
  AJAX acceleration
  =================
  
  Unpoly comes with a number of tricks to shorten the latency between browser and server.
  
  \#\#\# Server responses are cached by default
  
  Unpoly caches server responses for a few minutes,
  making requests to these URLs return instantly.
  All Unpoly functions and selectors go through this cache, unless
  you explicitly pass a `{ cache: false }` option or set an `up-cache="false"` attribute.
  
  The cache holds up to 50 responses for 5 minutes. You can configure the cache size and expiry using
  [`up.network.config`](/up.network.config), or clear the cache manually using [`up.cache.clear()`](/up.cache.clear).
  
  Also the entire cache is cleared with every non-`GET` request (like `POST` or `PUT`).
  
  If you need to make cache-aware requests from your [custom JavaScript](/up.syntax),
  use [`up.request()`](/up.request).
  
  \#\#\# Preloading links
  
  Unpoly also lets you speed up reaction times by [preloading
  links](/a-up-preload) when the user hovers over the click area (or puts the mouse/finger
  down). This way the response will already be cached when
  the user releases the mouse/finger.
  
  \#\#\# Spinners
  
  You can listen to the [`up:request:late`](/up:request:late) event to implement a spinner
  that appears during a long-running request.
  
  \#\#\# More acceleration
  
  Other Unpoly modules contain even more tricks to outsmart network latency:
  
  - [Instantaneous feedback for links that are currently loading](/a.up-active)
  - [Follow links on `mousedown` instead of `click`](/a-up-instant)
  
  @module up.request
   */

  up.network = (function() {

    /***
    @property up.network.config
    @param {number} [config.preloadDelay=75]
      The number of milliseconds to wait before [`[up-preload]`](/a-up-preload)
      starts preloading.
    @param {number} [config.cacheSize=50]
      The maximum number of responses to cache.
      If the size is exceeded, the oldest items will be dropped from the cache.
    @param {number} [config.cacheExpiry=300000]
      The number of milliseconds until a cache entry expires.
      Defaults to 5 minutes.
    @param {number} [config.badResponseTime=300]
      How long the proxy waits until emitting the [`up:request:late` event](/up:request:late).
      Use this to prevent flickering of spinners.
    @param {number} [config.concurrency=4]
      The maximum number of concurrent active requests.
    
      Additional requests are queued. [Preload](/up.network.preload) requests are
      always queued behind non-preload requests.
    
      You might find it useful to set the request concurrency `1` in full-stack
      integration tests (e.g. Selenium) to prevent race conditions.
    
      Note that your browser might [impose its own request limit](http://www.browserscope.org/?category=network)
      regardless of what you configure here.
    @param {boolean} [config.wrapMethod]
      Whether to wrap non-standard HTTP methods in a POST request.
    
      If this is set, methods other than GET and POST will be converted to a `POST` request
      and carry their original method as a `_method` parameter. This is to [prevent unexpected redirect behavior](https://makandracards.com/makandra/38347).
    
      If you disable method wrapping, make sure that your server always redirects with
      with a 303 status code (rather than 302).
    @param {boolean|string} [config.preloadEnabled='auto']
      Whether Unpoly will load [preload requests](/up.network.preload).
    
      With the default setting (`"auto"`) Unpoly will load preload requests
      unless `up.network.shouldReduceRequests()` detects a poor connection.
    
      If set to `true`, Unpoly will always load preload requests.
    
      If set to `false`, Unpoly will automatically [abort](/up.network.abort) all preload requests.
    @param {number} [config.badDownlink=0.6]
      The connection's minimum effective bandwidth estimate required
      to [enable preloading](/up.network.config#config.preloadEnabled).
    
      The value is given in megabits per second.
    
      This setting is only honored if `up.network.config.preloadEnabled` is set to `'auto'` (the default).
    @param {number} [config.badRTT=0.6]
      The connection's maximum effective round-trip time required
      to [enable preloading](/up.network.config#config.preloadEnabled).
    
      The value is given in milliseconds.
    
      This setting is only honored if `up.network.config.preloadEnabled` is set to `'auto'` (the default).
    @param {Array<string>|Function(up.Request): Array<string>} [config.requestMetaKeys]
      An array of request property names
      that are sent to the server as [HTTP headers](/up.protocol).
    
      The server may return an optimized response based on these properties,
      e.g. by omitting a navigation bar that is not targeted.
    
      \#\#\# Cacheability considerations
    
      Two requests with different `requestMetaKeys` are considered cache misses when [caching](/up.request) and
      [preloading](/up.link.preload). To **improve cacheability**, you may set
      `up.network.config.requestMetaKeys` to a shorter list of property keys.
    
      \#\#\# Available fields
    
      The default configuration is `['target', 'failTarget', 'mode', 'failMode', 'context', 'failContext']`.
      This means the following properties are sent to the server:
    
      | Request property         | Request header      |
      |--------------------------|---------------------|
      | `up.Request#target`      | `X-Up-Target`       |
      | `up.Request#failTarget`  | `X-Up-Fail-Target`  |
      | `up.Request#context`     | `X-Up-Context`      |
      | `up.Request#failContext` | `X-Up-Fail-Context` |
      | `up.Request#mode`        | `X-Up-Mode`         |
      | `up.Request#failMode`    | `X-Up-Fail-Mode`    |
    
      \#\#\# Per-route configuration
    
      You may also configure a function that accepts an [`up.Request`](/up.Request) and returns
      an array of request property names that are sent to the server.
    
      With this you may send different request properties for different URLs:
    
      ```javascript
      up.network.config.requestMetaKeys = function(request) {
        if (request.url == '/search') {
          // The server optimizes responses on the /search route.
          return ['target', 'failTarget']
        } else {
          // The server doesn't optimize any other route,
          // so configure maximum cacheability.
          return []
        }
      }
    
    @stable
     */
    var abortRequests, cache, config, handleCaching, isBusy, isIdle, isSafeMethod, makeRequest, mimicLocalRequest, parseRequestOptions, preload, queue, queueRequest, registerAliasForRedirect, reset, shouldPreload, shouldReduceRequests, useCachedRequest;
    config = new up.Config(function() {
      return {
        badResponseTime: 800,
        cacheSize: 70,
        cacheExpiry: 1000 * 60 * 5,
        concurrency: 4,
        wrapMethod: true,
        preloadEnabled: 'auto',
        badDownlink: 0.6,
        badRTT: 750,
        requestMetaKeys: ['target', 'failTarget', 'mode', 'failMode', 'context', 'failContext'],
        clearCache: function(arg) {
          var request;
          request = arg.request;
          return !request.isSafe();
        }
      };
    });
    queue = new up.Request.Queue();
    cache = new up.Request.Cache();

    /***
    Returns an earlier request [matching](/up.network.config.requestMetaKeys) the given request options.
    
    Returns `undefined` if the given request is not currently cached.
    
    Note that `up.request()` will only write to the cache with `{ cache: true }`.
    
    \#\#\# Example
    
    ```
    let request = up.cache.get({ url: '/foo' })
    
    if (request) {
      let response = await request
      console.log("Response is %o", response)
    } else {
      console.log("The path /foo has not been requested before!")
    }
    ```
    
    @function up.cache.get
    @param {Object} requestOptions
      The request options to match against the cache.
    
      See `options` for `up.request()` for documentation.
    
      The user may configure `up.network.config.requestMetaKeys` to define
      which request options are relevant for cache matching.
    @return {up.Request|undefined}
      The cached request.
    @experimental
     */

    /***
    Removes all [cache](/up.cache.get) entries.
    
    Unpoly also automatically clears the cache whenever it processes
    a request with an [unsafe](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.1.1)
    HTTP method like `POST`.
    
    The server may also clear the cache by sending an [`X-Up-Cache: clear`](/X-Up-Cache) header.
    
    @function up.cache.clear
    @stable
     */

    /***
    Makes the cache assume that `newRequest` has the same response as the
    already cached `oldRequest`.
    
    Unpoly uses this internally when the user redirects from `/old` to `/new`.
    In that case, both `/old` and `/new` will cache the same response from `/new`.
    
    @function up.cache.alias
    @param {Object} oldRequest
      The earlier [request options](/up.request).
    @param {Object} newRequest
      The new [request options](/up.request).
    @experimental
     */

    /***
    Manually stores a request in the cache.
    
    Future calls to `up.request()` will try to re-use this request before
    making a new request.
    
    @function up.cache.set
    @param {string} request.url
    @param {string} [request.method='GET']
    @param {string} [request.target='body']
    @param {up.Request} request
      The request to cache. The cache is also a promise for the response.
    @internal
     */

    /***
    Manually removes the given request from the cache.
    
    You can also [configure](/up.network.config) when
    cache entries expire automatically.
    
    @function up.cache.remove
    @param {Object} requestOptions
      The request options for which to remove cached requests.
    
      See `options` for `up.request()` for documentation.
    @experimental
     */
    reset = function() {
      abortRequests();
      queue.reset();
      config.reset();
      return cache.clear();
    };

    /***
    Makes an AJAX request to the given URL.
    
    Returns an `up.Request` object which contains information about the request.
    The request object is also a promise for its `up.Response`.
    
    \#\#\# Example
    
        let request = up.request('/search', { params: { query: 'sunshine' } })
        console.log('We made a request to', request.url)
    
        let response = await request
        console.log('The response text is', response.text)
    
    \#\#\# Error handling
    
    The returned promise will fulfill with an `up.Response` when the server
    responds with an HTTP status of 2xx (like `200`).
    
    When the server responds with an error code (like `422` or `500`), the promise
    will *reject* with `up.Response`.
    
    When the request fails from a fatal error (like a timeout or loss of connectivity),
    the promise will reject with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object.
    
    Here is an example for a complete control flow that also handles errors:
    
        try {
          let response = await up.request('/search', { params: { query: 'sunshine' } })
          console.log('Successful response with text:', response.text)
        } catch (e) {
          if (e instanceof up.Response) {
            console.log('Server responded with HTTP status %s and text %s', e.status, e.text)
          } else {
            console.log('Fatal error during request:', e.message)
          }
        }
    
    
    \#\#\# Caching
    
    When an `{ cache: true }` option is given, responses are cached.
    
    If requesting a URL with a non-`GET` method, the response will
    not be cached and the entire cache will be cleared.
    
    You can configure caching with the [`up.network.config`](/up.network.config) property.
    
    \#\#\# Events
    
    Multiple events may be emitted throughout the lifecycle of a request:
    
    - If a network connection is attempted,
      an `up:request:load` event is emitted.
    - When a response is received,
      an `up:request:loaded` event is emitted.
    - When the request fails from a fatal error like a timeout or loss of network connectivity,
      an `up:request:fatal` event is emitted.
    - When a request is [aborted](/up.network.abort),
      an `up:request:aborted` event is emitted.
    
    @function up.request
    @param {string} [url]
      The URL for the request.
    
      Instead of passing the URL as a string argument, you can also pass it as an `{ url }` option.
    @param {string} [options.url]
      You can omit the first string argument and pass the URL as
      a `request` property instead.
    @param {string} [options.method='GET']
      The HTTP method for the options.
    @param {boolean} [options.cache=false]
      Whether to use a cached response for [safe](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.1.1)
      requests, if available. If set to `false` a network connection will always be attempted.
    @param {Object} [options.headers={}]
      An object of additional HTTP headers.
    @param {Object|FormData|string|Array} [options.params={}]
      [Parameters](/up.Params) that should be sent as the request's payload.
    @param {string} [options.timeout]
      A timeout in milliseconds.
    
      If `up.network.config.maxRequests` is set, the timeout
      will not include the time spent waiting in the queue.
    @param {string} [options.target='body']
      The CSS selector that will be sent as an `X-Up-Target` header.
    @param {string} [options.failTarget='body']
      The CSS selector that will be sent as an `X-Up-Fail-Target` header.
    @param {Element} [options.origin]
      The DOM element that caused this request to be sent, e.g. a hyperlink or form element.
    @param {Element} [options.contentType]
      The format in which to encode the request params.
    
      Allowed values are `application/x-www-form-urlencoded` and `multipart/form-data`.
      Only `multipart/form-data` can transport binary data.
    
      If this option is omitted Unpoly will prefer `application/x-www-form-urlencoded`,
      unless request params contains binary data.
    @return {up.Request}
      An object with information about the request.
    
      The request object is also a promise for its `up.Response`.
    @stable
     */
    makeRequest = function() {
      var args, request, solo;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      request = new up.Request(parseRequestOptions(args));
      request = useCachedRequest(request) || queueRequest(request);
      if (solo = request.solo) {
        queue.abortExcept(request, solo);
      }
      return request;
    };
    mimicLocalRequest = function(options) {
      var clearCache, solo;
      if (solo = options.solo) {
        abortRequests(solo);
      }
      if (clearCache = options.clearCache) {
        return cache.clear(clearCache);
      }
    };
    preload = function() {
      var args, base, options;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (typeof (base = up.legacy).handleNetworkPreloadArgs === "function") {
        base.handleNetworkPreloadArgs.apply(base, args);
      }
      options = parseRequestOptions(args);
      options.preload = true;
      return makeRequest(options);
    };
    parseRequestOptions = function(args) {
      var base, options;
      options = u.extractOptions(args);
      options.url || (options.url = args[0]);
      if (typeof (base = up.legacy).handleRequestOptions === "function") {
        base.handleRequestOptions(options);
      }
      return options;
    };
    useCachedRequest = function(request) {
      var cachedRequest;
      if (request.cache && (cachedRequest = cache.get(request))) {
        up.puts('up.request()', 'Re-using previous request to %s %s', request.method, request.url);
        if (!request.preload) {
          queue.promoteToForeground(cachedRequest);
        }
        return cachedRequest;
      }
    };
    queueRequest = function(request) {
      if (request.preload && !request.isSafe()) {
        up.fail('Will not preload a %o request (%o)', request.method, request);
      }
      handleCaching(request);
      queue.asap(request);
      return request;
    };
    handleCaching = function(request) {
      if (request.cache) {
        cache.set(request, request);
      }
      return u.always(request, function(response) {
        var clearCache, ref, ref1;
        if (clearCache = (ref = (ref1 = response.clearCache) != null ? ref1 : request.clearCache) != null ? ref : config.clearCache({
          request: request,
          response: response
        })) {
          cache.clear(clearCache);
          if (request.cache) {
            cache.set(request, request);
          }
        }
        if (!response.ok) {
          return cache.remove(request);
        }
      });
    };

    /***
    Returns whether Unpoly is not currently waiting for a [request](/up.request) to finish.
    
    @function up.network.isIdle
    @return {boolean}
    @stable
     */
    isIdle = function() {
      return !isBusy();
    };

    /***
    Returns whether Unpoly is currently waiting for a [request](/up.request) to finish.
    
    @function up.network.isBusy
    @return {boolean}
    @stable
     */
    isBusy = function() {
      return queue.isBusy();
    };

    /***
    Returns whether optional requests should be avoided where possible.
    
    We assume the user wants to avoid requests if either of following applies:
    
    - The user has enabled data saving in their browser ("Lite Mode" in Chrome for Android).
    - The connection's effective round-trip time is longer than `up.network.config.badRTT`.
    - The connection's effective bandwidth estimate is less than `up.network.config.badDownlink`.
    
    By default Unpoly will disable [preloading](/up-preload) or [polling](/up-poll) if requests
    should be avoided.
    
    @function up.network.shouldReduceRequests
    @return {boolean}
      Whether requests should be avoided where possible.
    @experimental
     */
    shouldReduceRequests = function() {
      var netInfo;
      if (netInfo = navigator.connection) {
        return netInfo.saveData || (netInfo.rtt && netInfo.rtt > config.badRTT) || (netInfo.downlink && netInfo.downlink < config.badDownlink);
      }
    };
    shouldPreload = function(request) {
      var setting;
      setting = u.evalOption(config.preloadEnabled, request);
      if (setting === 'auto') {
        return !shouldReduceRequests() && up.browser.canPushState();
      }
      return setting;
    };

    /***
    Aborts pending [requests](/up.request).
    
    The event `up:request:aborted` will be emitted.
    
    The promise returned by `up.request()` will be rejected with an exception named `AbortError`:
    
        try {
          let response = await up.request('/path')
          console.log(response.text)
        } catch (err) {
          if (err.name == 'AbortError') {
            console.log('Request was aborted')
          }
        }
    
    \#\#\# Examples
    
    Without arguments, this will abort all pending requests:
    
        up.network.abort()
    
    To abort a given `up.Request` object, pass it as the first argument:
    
        let request = up.request('/path')
        up.network.abort(request)
    
    To abort all requests matching a condition, pass a function that takes a request
    and returns a boolean value. Unpoly will abort all request for which the given
    function returns `true`. E.g. to abort all requests with a HTTP method as `GET`:
    
        up.network.abort((request) => request.method == 'GET')
    
    @function up.network.abort
    @param {up.Request|boolean|Function(up.Request): boolean} [matcher=true]
      If this argument is omitted, all pending requests are aborted.
    @stable
     */
    abortRequests = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return queue.abort.apply(queue, args);
    };

    /***
    This event is [emitted](/up.emit) when an [AJAX request](/up.request)
    was [aborted](/up.network.abort()).
    
    The event is emitted on the layer that caused the request.
    
    @event up:request:aborted
    @param {up.Request} event.request
      The aborted request.
    @param {up.Layer} [event.layer]
      The [layer](/up.layer) that caused the request.
    @param event.preventDefault()
    @experimental
     */

    /***
    This event is [emitted](/up.emit) when [AJAX requests](/up.request)
    are taking long to finish.
    
    By default Unpoly will wait 800 ms for an AJAX request to finish
    before emitting `up:request:late`. You can configure this time like this:
    
        up.network.config.badResponseTime = 400;
    
    Once all responses have been received, an [`up:network:recover`](/up:network:recover)
    will be emitted.
    
    Note that if additional requests are made while Unpoly is already busy
    waiting, **no** additional `up:request:late` events will be triggered.
    
    \#\#\# Spinners
    
    You can [listen](/up.on) to the `up:request:late`
    and [`up:network:recover`](/up:network:recover) events to implement a spinner
    that appears during a long-running request,
    and disappears once the response has been received:
    
        <div class="spinner">Please wait!</div>
    
    Here is the JavaScript to make it alive:
    
        up.compiler('.spinner', function(element) {
          show = () => { up.element.show(element) }
          hide = () => { up.element.hide(element) }
    
          hide()
    
          return [
            up.on('up:request:late', show),
            up.on('up:network:recover', hide)
          ]
        })
    
    The `up:request:late` event will be emitted after a delay
    to prevent the spinner from flickering on and off.
    You can change (or remove) this delay like this:
    
        up.network.config.badResponseTime = 400;
    
    @event up:request:late
    @stable
     */

    /***
    This event is [emitted](/up.emit) when [AJAX requests](/up.request)
    have [taken long to finish](/up:request:late), but have finished now.
    
    See [`up:request:late`](/up:request:late) for more documentation on
    how to use this event for implementing a spinner that shows during
    long-running requests.
    
    @event up:network:recover
    @stable
     */

    /***
    This event is [emitted](/up.emit) before an [AJAX request](/up.request)
    is sent over the network.
    
    The event is emitted on the layer that caused the request.
    
    @event up:request:load
    @param {up.Request} event.request
      The request to be sent.
    @param {up.Layer} [event.layer]
      The [layer](/up.layer) that caused the request.
    @param event.preventDefault()
      Event listeners may call this method to prevent the request from being sent.
    @stable
     */
    registerAliasForRedirect = function(request, response) {
      var newRequest;
      if (request.cache && response.url && request.url !== response.url) {
        newRequest = request.variant({
          method: response.method,
          url: response.url
        });
        return cache.alias(request, newRequest);
      }
    };

    /***
    This event is [emitted](/up.emit) when the response to an [AJAX request](/up.request)
    has been received.
    
    Note that this event will also be emitted when the server signals an
    error with an HTTP status like `500`. Only if the request
    encounters a fatal error (like a loss of network connectivity),
    [`up:request:fatal`](/up:request:fatal) is emitted instead.
    
    The event is emitted on the layer that caused the request.
    
    @event up:request:loaded
    @param {up.Request} event.request
      The request.
    @param {up.Response} event.response
      The response that was received from the server.
    @param {up.Layer} [event.layer]
      The [layer](/up.layer) that caused the request.
    @stable
     */

    /***
    This event is [emitted](/up.emit) when an [AJAX request](/up.request)
    encounters fatal error like a timeout or loss of network connectivity.
    
    Note that this event will *not* be emitted when the server produces an
    error message with an HTTP status like `500`. When the server can produce
    any response, [`up:request:loaded`](/up:request:loaded) is emitted instead.
    
    The event is emitted on the layer that caused the request.
    
    @event up:request:fatal
    @param {up.Request} event.request
      The request.
    @param {up.Layer} [event.layer]
      The [layer](/up.layer) that caused the request.
    @stable
     */

    /***
    @internal
     */
    isSafeMethod = function(method) {
      return u.contains(['GET', 'OPTIONS', 'HEAD'], method);
    };
    up.on('up:framework:reset', reset);
    return {
      ajax: ajax,
      request: makeRequest,
      preload: preload,
      cache: cache,
      isIdle: isIdle,
      isBusy: isBusy,
      isSafeMethod: isSafeMethod,
      config: config,
      abort: abortRequests,
      registerAliasForRedirect: registerAliasForRedirect,
      queue: queue,
      shouldPreload: shouldPreload,
      shouldReduceRequests: shouldReduceRequests,
      mimicLocalRequest: mimicLocalRequest
    };
  })();

  up.request = up.network.request;

  up.ajax = up.network.ajax;

  up.cache = up.network.cache;

}).call(this);
(function() {
  var e, u,
    slice = [].slice;

  u = up.util;

  e = up.element;


  /***
  Layers
  ======
  
  TODO
  
  @module up.layer
   */

  up.layer = (function() {
    var LAYER_CLASSES, OVERLAY_CLASSES, OVERLAY_MODES, anySelector, api, ask, build, closeCallbackAttr, config, handlers, isOverlayMode, mainTargets, modeConfigs, normalizeOptions, open, openCallbackAttr, reset, stack;
    OVERLAY_CLASSES = [up.Layer.Modal, up.Layer.Popup, up.Layer.Drawer, up.Layer.Cover];
    OVERLAY_MODES = u.map(OVERLAY_CLASSES, 'mode');
    LAYER_CLASSES = [up.Layer.Root].concat(OVERLAY_CLASSES);
    config = new up.Config(function() {
      var Class, i, len, newConfig;
      newConfig = {
        mode: 'modal',
        any: {
          mainTargets: ["[up-main='']", 'main', ':layer']
        },
        root: {
          mainTargets: ['[up-main~=root]'],
          history: true
        },
        overlay: {
          mainTargets: ['[up-main~=overlay]'],
          openAnimation: 'fade-in',
          closeAnimation: 'fade-out',
          dismissLabel: '×',
          dismissAriaLabel: 'Dismiss dialog',
          dismissable: true,
          history: 'auto'
        },
        cover: {
          mainTargets: ['[up-main~=cover]']
        },
        drawer: {
          mainTargets: ['[up-main~=drawer]'],
          backdrop: true,
          position: 'left',
          size: 'medium',
          openAnimation: function(layer) {
            switch (layer.position) {
              case 'left':
                return 'move-from-left';
              case 'right':
                return 'move-from-right';
            }
          },
          closeAnimation: function(layer) {
            switch (layer.position) {
              case 'left':
                return 'move-to-left';
              case 'right':
                return 'move-to-right';
            }
          }
        },
        modal: {
          mainTargets: ['[up-main~=modal]'],
          backdrop: true,
          size: 'medium'
        },
        popup: {
          mainTargets: ['[up-main~=popup]'],
          position: 'bottom',
          size: 'medium',
          align: 'left'
        }
      };
      for (i = 0, len = LAYER_CLASSES.length; i < len; i++) {
        Class = LAYER_CLASSES[i];
        newConfig[Class.mode].Class = Class;
      }
      return newConfig;
    });
    stack = null;
    handlers = [];
    isOverlayMode = function(mode) {
      return u.contains(OVERLAY_MODES, mode);
    };
    mainTargets = function(mode) {
      return u.flatMap(modeConfigs(mode), 'mainTargets');
    };

    /***
    Returns an array of config objects that apply to the given mode name.
    
    The config objects are in descending order of specificity.
     */
    modeConfigs = function(mode) {
      if (mode === 'root') {
        return [config.root, config.any];
      } else {
        return [config[mode], config.overlay, config.any];
      }
    };
    normalizeOptions = function(options) {
      var base;
      if (typeof (base = up.legacy).handleLayerOptions === "function") {
        base.handleLayerOptions(options);
      }
      if (u.isGiven(options.layer)) {
        if (options.layer === 'swap') {
          if (up.layer.isRoot()) {
            options.layer = 'root';
          } else {
            options.layer = 'new';
            options.currentLayer = 'parent';
          }
        }
        if (options.layer === 'new') {
          options.mode || (options.mode = config.mode);
        } else if (isOverlayMode(options.layer)) {
          options.mode = options.layer;
          options.layer = 'new';
        }
      } else {
        if (options.mode) {
          options.layer = 'new';
        } else if (u.isElementish(options.target)) {
          options.layer = stack.get(options.target, {
            normalizeLayerOptions: false
          });
        } else if (options.origin) {
          options.layer = 'origin';
        } else {
          options.layer = 'current';
        }
      }
      options.context || (options.context = {});
      return options.currentLayer = stack.get('current', u.merge(options, {
        normalizeLayerOptions: false
      }));
    };
    build = function(options, transformOptions) {
      var Class, configs, mode;
      console.log("up.layer.build(%o, %o)", u.copy(options), transformOptions);
      mode = options.mode;
      Class = config[mode].Class;
      configs = u.reverse(modeConfigs(mode));
      options = u.mergeDefined.apply(u, slice.call(configs).concat([{
        mode: mode,
        stack: stack
      }], [options]));
      if (typeof transformOptions === "function") {
        transformOptions(options);
      }
      return new Class(options);
    };
    openCallbackAttr = function(link, attr) {
      return e.callbackAttr(link, attr, ['layer']);
    };
    closeCallbackAttr = function(link, attr) {
      return e.callbackAttr(link, attr, ['layer', 'value']);
    };
    reset = function() {
      config.reset();
      stack.reset();
      return handlers = u.filter(handlers, 'isDefault');
    };
    open = function(options) {
      options = u.options(options, {
        layer: 'new',
        navigate: true
      });
      return up.render(options);
    };

    /***
    This event is emitted after a layer's [location property](/up.Layer#location)
    has changed value.
    
    This event is also emitted when a layer [without history](/up.Layer#history)
    has reached a new location.
    
    @param {string} event.location
      The new location URL.
    @event up:layer:location:changed
    @experimental
     */
    ask = function(options) {
      return new Promise(function(resolve, reject) {
        options = u.merge(options, {
          onAccepted: function(event) {
            return resolve(event.value);
          },
          onDismissed: function(event) {
            return reject(event.value);
          }
        });
        return open(options);
      });
    };
    anySelector = function() {
      return u.map(LAYER_CLASSES, function(Class) {
        return Class.selector();
      }).join(',');
    };
    up.on('up:fragment:destroyed', function(event) {
      return stack.sync();
    });
    up.on('up:framework:boot', function() {
      return stack = new up.LayerStack();
    });
    up.on('up:framework:reset', reset);
    api = u.literal({
      config: config,
      mainTargets: mainTargets,
      open: open,
      build: build,
      ask: ask,
      normalizeOptions: normalizeOptions,
      openCallbackAttr: openCallbackAttr,
      closeCallbackAttr: closeCallbackAttr,
      anySelector: anySelector,
      get_stack: function() {
        return stack;
      }
    });

    /***
    Returns the current layer in the [layer stack](/up.layer.stack).
    
    The *current* layer is usually the [frontmost layer](/up.layer.front).
    There are however some cases where the current layer is a layer in the background:
    
    - When an element in a background layer is compiled.
    - When an Unpoly event like `up:request:loaded` is triggered from a background layer.
    - When the event listener was bound to a background layer using `up.Layer#on()`.
    
    To temporarily change the current layer from your own code, use `up.Layer#asCurrent()`.
    
    @property up.layer.current
    @param {up.Layer} layer
    @stable
     */
    u.delegate(api, ['get', 'getAll', 'root', 'overlays', 'current', 'front', 'sync'], function() {
      return stack;
    });
    u.delegate(api, ['accept', 'dismiss', 'isRoot', 'isOverlay', 'on', 'off', 'emit', 'parent', 'child', 'ancestor', 'descendants', 'history', 'location', 'title', 'mode', 'context', 'element', 'contains', 'size', 'origin', 'affix'], function() {
      return stack.current;
    });
    return api;
  })();

  u.getter(up, 'context', function() {
    return up.layer.context;
  });

}).call(this);

/***
Linking to fragments
====================

The `up.link` module lets you build links that update fragments instead of entire pages.

\#\#\# Motivation

In a traditional web application, the entire page is destroyed and re-created when the
user follows a link:

![Traditional page flow](/images/tutorial/fragment_flow_vanilla.svg){:width="620" class="picture has_border is_sepia has_padding"}

This makes for an unfriendly experience:

- State changes caused by AJAX updates get lost during the page transition.
- Unsaved form changes get lost during the page transition.
- The JavaScript VM is reset during the page transition.
- If the page layout is composed from multiple scrollable containers
  (e.g. a pane view), the scroll positions get lost during the page transition.
- The user sees a "flash" as the browser loads and renders the new page,
  even if large portions of the old and new page are the same (navigation, layout, etc.).

Unpoly fixes this by letting you annotate links with an [`up-target`](/a-up-target)
attribute. The value of this attribute is a CSS selector that indicates which page
fragment to update. The server **still renders full HTML pages**, but we only use
the targeted fragments and discard the rest:

![Unpoly page flow](/images/tutorial/fragment_flow_unpoly.svg){:width="620" class="picture has_border is_sepia has_padding"}

With this model, following links feels smooth. All transient DOM changes outside the updated fragment are preserved.
Pages also load much faster since the DOM, CSS and Javascript environments do not need to be
destroyed and recreated for every request.


\#\#\# Example

Let's say we are rendering three pages with a tabbed navigation to switch between screens:

Your HTML could look like this:

```
<nav>
  <a href="/pages/a">A</a>
  <a href="/pages/b">B</a>
  <a href="/pages/b">C</a>
</nav>

<article>
  Page A
</article>
```

Since we only want to update the `<article>` tag, we annotate the links
with an `up-target` attribute:

```
<nav>
  <a href="/pages/a" up-target="article">A</a>
  <a href="/pages/b" up-target="article">B</a>
  <a href="/pages/b" up-target="article">C</a>
</nav>
```

Note that instead of `article` you can use any other CSS selector like `#main .article`.

With these [`up-target`](/a-up-target) annotations Unpoly only updates the targeted part of the screen.
The JavaScript environment will persist and the user will not see a white flash while the
new page is loading.

@module up.link
 */

(function() {
  var slice = [].slice;

  up.link = (function() {
    var ATTRIBUTES_SUGGESTING_FOLLOW, LINKS_WITH_LOCAL_HTML, LINKS_WITH_REMOTE_HTML, combineFollowableSelectors, config, convertClicks, didUserDragAway, e, follow, followMethod, followOptions, forkEventAsUpClick, fullClickableSelector, fullFollowSelector, fullInstantSelector, fullPreloadSelector, isFollowable, isInstant, isSafe, lastMousedownTarget, linkPreloader, makeClickable, makeFollowable, preload, preloadDelayTimer, preloadIssue, reset, shouldFollowEvent, targetMacro, u, waitingLink;
    u = up.util;
    e = up.element;
    preloadDelayTimer = void 0;
    waitingLink = void 0;
    linkPreloader = new up.LinkPreloader();
    lastMousedownTarget = null;
    LINKS_WITH_LOCAL_HTML = ['a[up-content]', 'a[up-fragment]', 'a[up-document]'];
    LINKS_WITH_REMOTE_HTML = ['a[href]', '[up-href]'];
    ATTRIBUTES_SUGGESTING_FOLLOW = [e.trueAttributeSelector('up-follow'), '[up-target]', '[up-layer]', '[up-mode]', '[up-transition]'];
    combineFollowableSelectors = function(elementSelectors, attributeSelectors) {
      if (attributeSelectors == null) {
        attributeSelectors = ATTRIBUTES_SUGGESTING_FOLLOW;
      }
      return u.flatMap(elementSelectors, function(elementSelector) {
        return attributeSelectors.map(function(attributeSelector) {
          return elementSelector + attributeSelector;
        });
      });
    };
    config = new up.Config(function() {
      return {
        preloadDelay: 90,
        followSelectors: combineFollowableSelectors(LINKS_WITH_REMOTE_HTML).concat(LINKS_WITH_LOCAL_HTML),
        instantSelectors: [e.trueAttributeSelector('up-instant')],
        preloadSelectors: combineFollowableSelectors(LINKS_WITH_REMOTE_HTML, [e.trueAttributeSelector('up-preload')]),
        clickableSelectors: LINKS_WITH_LOCAL_HTML.concat(['[up-emit]', '[up-accept]', '[up-dismiss]', '[up-clickable]'])
      };
    });
    fullFollowSelector = function() {
      return config.followSelectors.join(',');
    };
    fullPreloadSelector = function() {
      return config.preloadSelectors.join(',');
    };
    fullInstantSelector = function() {
      return config.instantSelectors.join(',');
    };
    fullClickableSelector = function() {
      return config.clickableSelectors.join(',');
    };
    isInstant = function(linkOrDescendant) {
      return !!e.closest(linkOrDescendant, fullInstantSelector());
    };

    /***
    @property up.link.config
    @param {number} [config.preloadDelay=75]
      The number of milliseconds to wait before [`[up-preload]`](/a-up-preload)
      starts preloading.
     */
    reset = function() {
      lastMousedownTarget = null;
      config.reset();
      return linkPreloader.reset();
    };

    /***
    Fetches the given link's `[href]` with JavaScript and [replaces](/up.replace) the
    [current layer](/up.layer.current) with HTML from the response.
    
    By default the layer's [main element](/up.fragment.config.mainTargets)
    will be replaced. Attributes like `a[up-target]`
    or `a[up-modal]` will be honored.
    
    Emits the event `up:link:follow`.
    
    \#\#\# Examples
    
    Assume we have a link with an `a[up-target]` attribute:
    
        <a href="/users" up-target=".main">Users</a>
    
    Calling `up.follow()` with this link will replace the page's `.main` fragment
    as if the user had clicked on the link:
    
        var link = document.querySelector('a')
        up.follow(link)
    
    @function up.follow
    @param {Element|jQuery|string} link
      An element or selector which is either an `<a>` tag or any element with an `[up-href]` attribute.
    @param {string} [options.target]
      The selector to replace.
    
      Defaults to the link's `[up-target]`, `[up-modal]` or `[up-popup]` attribute.
      If no target is given, the `<body>` element will be replaced.
    @param {string} [options.url]
      The URL to navigate to.
    
      Defaults to the link's `[up-href]` or `[href]` attribute.
    @param {boolean|string} [options.reveal=true]
      Whether to [reveal](/up.reveal) the target fragment after it was replaced.
    
      You can also pass a CSS selector for the element to reveal.
    @param {boolean|string} [options.failReveal=true]
      Whether to [reveal](/up.reveal) the target fragment when the server responds with an error.
    
      You can also pass a CSS selector for the element to reveal.
    @return {Promise}
      A promise that will be fulfilled when the link destination
      has been loaded and rendered.
    @stable
     */
    follow = function(link, options) {
      return up.render(followOptions(link, options));
    };

    /***
    Parses the `render()` options that would be used to
    [`follow`](/up.follow) the given link, but does not render.
    
    @param {Element|jQuery|string} link
      A reference or selector for the link to follow.
    @param {Object} [options]
      Additional options for the form submissions.
    
      Will override any attribute values set on the given form element.
    
      See `up.follow()` for detailled documentation of individual option properties.
    @function up.link.followOptions
    @return {Object}
    @stable
     */
    followOptions = function(link, options) {
      var base, parser;
      link = up.fragment.get(link);
      options = u.options(options);
      parser = new up.OptionsParser(options, link, {
        fail: true
      });
      parser.string('url', {
        attr: ['up-href', 'href']
      });
      if (options.url === '#') {
        options.url = void 0;
      }
      options.method = followMethod(link, options);
      parser.json('headers');
      parser.json('params');
      parser.booleanOrString('cache');
      parser.booleanOrString('clearCache');
      parser.boolean('solo');
      parser.boolean('feedback');
      parser.boolean('fail');
      if ((base = parser.options).origin == null) {
        base.origin = link;
      }
      parser.boolean('navigate', {
        "default": true
      });
      parser.string('confirm');
      parser.string('target');
      parser.booleanOrString('fallback');
      parser.parse((function(link, attrName) {
        return e.callbackAttr(link, attrName, ['request', 'response', 'renderOptions']);
      }), 'onLoaded');
      parser.string('content');
      parser.string('fragment');
      parser.string('document');
      parser.string('contentType', {
        attr: ['enctype', 'up-content-type']
      });
      parser.boolean('peel');
      parser.string('layer');
      parser.json('context');
      parser.string('flavor');
      parser.string('mode');
      parser.string('align');
      parser.string('position');
      parser.string('class');
      parser.string('size');
      parser.boolean('closable');
      parser.boolean('dismissable');
      parser.boolean('buttonDismissable');
      parser.boolean('keyDismissable');
      parser.boolean('outsideDismissable');
      parser.parse(up.layer.openCallbackAttr, 'onOpened');
      parser.parse(up.layer.closeCallbackAttr, 'onAccept');
      parser.parse(up.layer.closeCallbackAttr, 'onAccepted');
      parser.parse(up.layer.closeCallbackAttr, 'onDismiss');
      parser.parse(up.layer.closeCallbackAttr, 'onDismissed');
      parser.string('acceptEvent');
      parser.string('dismissEvent');
      parser.string('acceptLocation');
      parser.string('dismissLocation');
      parser.booleanOrString('focus');
      parser.boolean('saveScroll');
      parser.booleanOrString('scroll');
      parser.booleanOrString('reveal');
      parser.boolean('resetScroll');
      parser.boolean('restoreScroll');
      parser.boolean('revealTop');
      parser.number('revealMax');
      parser.number('revealPadding');
      parser.number('revealSnap');
      parser.string('scrollBehavior');
      parser.booleanOrString('history');
      parser.booleanOrString('location');
      parser.booleanOrString('title');
      parser.booleanOrString('animation');
      parser.booleanOrString('transition');
      parser.string('easing');
      parser.number('duration');
      options.guardEvent || (options.guardEvent = up.event.build('up:link:follow', {
        log: 'Following link'
      }));
      return options;
    };

    /***
    This event is [emitted](/up.emit) when a link is [followed](/up.follow) through Unpoly.
    
    The event is emitted on the `<a>` element that is being followed.
    
    @event up:link:follow
    @param {Element} event.target
      The link element that will be followed.
    @param event.preventDefault()
      Event listeners may call this method to prevent the link from being followed.
    @stable
     */

    /***
    Preloads the given link.
    
    When the link is clicked later, the response will already be [cached](/up.cache),
    making the interaction feel instant.
    
    @function up.link.preload
    @param {string|Element|jQuery} link
      The element or selector whose destination should be preloaded.
    @param {Object} options
      See options for `up.follow()`.
    @return {Promise}
      A promise that will be fulfilled when the request was loaded and cached
    @stable
     */
    preload = function(link, options) {
      var guardEvent, issue;
      link = up.fragment.get(link);
      if (issue = preloadIssue(link)) {
        return up.error.failed.async(preloadIssue);
      }
      guardEvent = up.event.build('up:link:preload', {
        log: ['Preloading link %o', link]
      });
      return follow(link, u.merge(options, {
        preload: true
      }, {
        guardEvent: guardEvent
      }));
    };
    preloadIssue = function(link) {
      if (!isSafe(link)) {
        return "Won't preload unsafe link";
      }
      if (!e.matches(link, '[href], [up-href]')) {
        return "Won't preload link without a URL";
      }
    };

    /***
    This event is [emitted](/up.emit) before a link is [preloaded](/up.preload).
    
    @event up:link:preload
    @param {Element} event.target
      The link element that will be preloaded.
    @param event.preventDefault()
      Event listeners may call this method to prevent the link from being preloaded.
    @stable
     */

    /***
    Returns the HTTP method that should be used when following the given link.
    
    Looks at the link's `up-method` or `data-method` attribute.
    Defaults to `"get"`.
    
    @function up.link.followMethod
    @param link
    @param options.method {string}
    @internal
     */
    followMethod = function(link, options) {
      if (options == null) {
        options = {};
      }
      return u.normalizeMethod(options.method || link.getAttribute('up-method') || link.getAttribute('data-method'));
    };

    /***
    Returns whether the given link will be [followed](/up.follow) by Unpoly
    instead of making a full page load.
    
    By default Unpoly will follow links and elements with an `[up-href]` attribute if the element has
    one of the following attributes:
    
    - `[up-follow]`
    - `[up-target]`
    - `[up-layer]`
    - `[up-mode]`
    - `[up-transition]`
    - `[up-content]`
    - `[up-fragment]`
    - `[up-document]`
    
    To make additional elements followable, see `up.link.config.followSelectors`.
    
    @function up.link.isFollowable
    @param {Element|jQuery|string} link
      The link to check.
    @stable
     */
    isFollowable = function(link) {
      link = up.fragment.get(link);
      return e.matches(link, fullFollowSelector());
    };

    /***
    Makes sure that the given link will be [followed](/up.follow)
    by Unpoly instead of making a full page load.
    
    If the link is not already [followable](/up.link.isFollowable), the link
    will receive an `a[up-follow]` attribute.
    
    @function up.link.makeFollowable
    @param {Element|jQuery|string} link
      The element or selector for the link to make followable.
    @stable
     */
    makeFollowable = function(link) {
      if (!isFollowable(link)) {
        return link.setAttribute('up-follow', '');
      }
    };
    makeClickable = function(link) {
      if (e.matches(link, 'a[href], button')) {
        return;
      }
      e.setMissingAttrs(link, {
        tabindex: '0',
        role: 'link'
      });
      return link.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Space') {
          return forkEventAsUpClick(event);
        }
      });
    };
    up.macro(fullClickableSelector, makeClickable);
    shouldFollowEvent = function(event, link) {
      var betterTarget, betterTargetSelector;
      if (!up.event.isUnmodified(event)) {
        return false;
      }
      betterTargetSelector = "a, [up-href], " + (up.form.fieldSelector());
      betterTarget = e.closest(event.target, betterTargetSelector);
      return !betterTarget || betterTarget === link;
    };

    /***
    Provide an `up:click` event that improves on standard click
    in several ways:
    
    - It is emitted on mousedown for [up-instant] elements
    - It is not emitted if the element has disappeared (or was overshadowed)
      between mousedown and click. This can happen if mousedown creates a layer
      over the element, or if a mousedown handler removes a handler.
    
    Stopping an up:click event will also stop the underlying event.
    
    Also see docs for `up:click`.
    
    @function up.link.convertClicks
    @param {up.Layer} layer
    @internal
     */
    convertClicks = function(layer) {
      layer.on('click', function(event, element) {
        if (isInstant(element) && lastMousedownTarget) {
          up.event.halt(event);
        } else if (layer.wasHitByMouseEvent(event) && !didUserDragAway(event)) {
          forkEventAsUpClick(event);
        }
        return lastMousedownTarget = null;
      });
      return layer.on('mousedown', function(event, element) {
        lastMousedownTarget = element;
        if (isInstant(element)) {
          return forkEventAsUpClick(event);
        }
      });
    };
    didUserDragAway = function(clickEvent) {
      return lastMousedownTarget && lastMousedownTarget !== clickEvent.target;
    };
    forkEventAsUpClick = function(originalEvent) {
      var newEvent;
      newEvent = up.event.fork(originalEvent, 'up:click', ['clientX', 'clientY', 'button'].concat(slice.call(up.event.keyModifiers)));
      return up.emit(originalEvent.target, newEvent, {
        log: false
      });
    };

    /***
    A `click` event that honors the [`[up-instant]`](/a-up-instant) attribute.
    
    This event is generally emitted when an element is clicked. However, for elements
    with an [`[up-instant]`](/a-up-instant) attribute this event is emitted on `mousedown` instead.
    
    This is useful to listen to links being activated, without needing to know whether
    a link is `[up-instant]`.
    
    \#\#\# Example
    
    Assume we have two links, one of which is `[up-instant]`:
    
        <a href="/one">Link 1</a>
        <a href="/two" up-instant>Link 2</a>
    
    The following event listener will be called when *either* link is activated:
    
        document.addEventListener('up:click', function(event) {
          ...
        })
    
    \#\#\# Cancelation is forwarded
    
    If the user cancels an `up:click` event, the underlying `click` or `mousedown` will also be canceled.
    The following cancelation methods will be forwarded:
    
    - `event.stopPropagation()`
    - `event.stopImmediatePropagation()`
    - `event.preventDefault()
    
    \#\#\# Accessibility
    
    If the user activates an element using their keyboard, the `up:click` event will be emitted
    on `click`, even if the element has an `[up-instant]` attribute.
    
    @event up:click
    @param {Element} event.target
      The clicked element.
    @param {Event} event.originalEvent
      The underlying `click` or `mousedown` event.
    @stable
     */

    /***
    Returns whether the given link has a [safe](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.1.1)
    HTTP method like `GET`.
    
    @function up.link.isSafe
    @return {boolean}
    @stable
     */
    isSafe = function(selectorOrLink, options) {
      var method;
      method = followMethod(selectorOrLink, options);
      return up.network.isSafeMethod(method);
    };
    targetMacro = function(queryAttr, fixedResultAttrs, callback) {
      return up.macro("[" + queryAttr + "]", function(link) {
        var optionalTarget, resultAttrs;
        resultAttrs = u.copy(fixedResultAttrs);
        if (optionalTarget = link.getAttribute(queryAttr)) {
          resultAttrs['up-target'] = optionalTarget;
        } else {
          resultAttrs['up-follow'] = '';
        }
        e.setMissingAttrs(link, resultAttrs);
        link.removeAttribute(queryAttr);
        return typeof callback === "function" ? callback() : void 0;
      });
    };

    /***
    [Follows](/up.follow) this link with JavaScript and replaces a CSS selector
    on the current page with a corresponding element from the response.
    
    \#\#\# Example
    
    This will update the fragment `<div class="main">` with the same element
    fetched from `/posts/5`:
    
        <a href="/posts/5" up-target=".main">Read post</a>
    
    \#\#\# Updating multiple fragments
    
    You can update multiple fragments from a single request by separating
    separators with a comma (like in CSS).
    
    For instance, if opening a post should
    also update a bubble showing the number of unread posts, you might
    do this:
    
        <a href="/posts/5" up-target=".main, .unread-count">Read post</a>
    
    \#\#\# Matching in the link's vicinity
    
    It is often helpful to match elements within the same container as the the
    link that's being followed.
    
    Let's say we have two links that replace `.card`:
    
    ```html
    <div class="card">
      Card #1 preview
      <a href="/cards/1" up-target=".card">Show full card #1</a>
    </div>
    
    <div class="card">
      Card #2 preview
      <a href="/cards/2" up-target=".card">Show full card #2</a>
    </div>
    ```
    
    When clicking on *"Show full card #2"*, Unpoly will replace the second card.
    The server should only render a single `.card` element.
    
    This also works with descendant selectors:
    
    ```html
    <div class="card">
      <a href="/cards/1/links" up-target=".card .card-links">Show card #2 links</a>
      <div class="card-links"></div>
    </div>
    
    <div class="card">
      <a href="/cards/2/links" up-target=".card .card-links">Show card #2 links</a>
      <div class="card-links"></div>
    </div>
    ```
    
    When clicking on *"Show full card #2"*, Unpoly will replace the second card.
    The server should only render a single `.card` element.
    
    \#\#\# Appending or prepending content
    
    By default Unpoly will replace the given selector with the same
    selector from the server response. Instead of replacing you
    can *append* the loaded content to the existing content by using the
    `:after` pseudo selector. In the same fashion, you can use `:before`
    to indicate that you would like the *prepend* the loaded content.
    
    A practical example would be a paginated list of items. Below the list is
    a button to load the next page. You can append to the existing list
    by using `:after` in the `up-target` selector like this:
    
        <ul class="tasks">
          <li>Wash car</li>
          <li>Purchase supplies</li>
          <li>Fix tent</li>
        </ul>
    
        <a href="/page/2" class="next-page" up-target=".tasks:after, .next-page">
          Load more tasks
        </a>
    
    \#\#\# Replacing an element's inner HTML
    
    If you would like to preserve the target element, but replace all of its child content,
    use the `:content` pseudo selector:
    
        <a href="/cards/5" up-target=".card:content">Show card #5</a>
    
    \#\#\# Following elements that are no links
    
    You can also use `[up-target]` to turn an arbitrary element into a link.
    In this case, put the link's destination into the `[up-href]` attribute:
    
        <button up-target=".main" up-href="/foo/bar">Go</button>
    
    Note that using any element other than `<a>` will prevent users from
    opening the destination in a new tab.
    
    @selector a[up-target]
    @param {string} up-target
      The CSS selector to replace
    
      Inside the CSS selector you may refer to this link as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-method='get']
      The HTTP method to use for the request.
    @param {string} [up-transition='none']
      The [transition](/up.motion) to use for morphing between the old and new elements.
    @param [up-fail-target='body']
      The CSS selector to replace if the server responds with an error.
    
      Inside the CSS selector you may refer to this link as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-fail-transition='none']
      The [transition](/up.motion) to use for morphing between the old and new elements
      when the server responds with an error.
    @param {string} [up-fallback]
      The selector to update when the original target was not found in the page.
    @param {string} [up-href]
      The destination URL to follow.
      If omitted, the the link's `href` attribute will be used.
    @param {string} [up-confirm]
      A message that will be displayed in a cancelable confirmation dialog
      before the link is followed.
    @param {string} [up-reveal='true']
      Whether to reveal the target element after it was replaced.
    
      You can also pass a CSS selector for the element to reveal.
      Inside the CSS selector you may refer to this link as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-fail-reveal='true']
      Whether to reveal the target element when the server responds with an error.
    
      You can also pass a CSS selector for the element to reveal.
      Inside the CSS selector you may refer to this link as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-restore-scroll='false']
      Whether to restore previously known scroll position of all viewports
      within the target selector.
    @param {string} [up-cache]
      Whether to force the use of a cached response (`true`)
      or never use the cache (`false`)
      or make an educated guess (default).
    @param {string} [up-layer='auto']
      The name of the layer that ought to be updated. Valid values are
      `'auto'`, `'page'`, `'modal'` and `'popup'`.
    
      If set to `'auto'` (default), Unpoly will try to find a match in the link's layer.
      If no match was found in that layer,
      Unpoly will search in other layers, starting from the topmost layer.
    @param {string} [up-fail-layer='auto']
      The name of the layer that ought to be updated if the server sends a
      non-200 status code.
    @param [up-history]
      Whether to push an entry to the browser history when following the link.
    
      Set this to `'false'` to prevent the URL bar from being updated.
      Set this to a URL string to update the history with the given URL.
    @stable
     */

    /***
    Fetches this link's `[href]` with JavaScript and [replaces](/up.replace) the
    current `<body>` element with the response's `<body>` element.
    
    To only update a fragment instead of the entire `<body>`, see `a[up-target]`.
    
    \#\#\# Example
    
        <a href="/users" up-follow>User list</a>
    
    \#\#\# Turn any element into a link
    
    You can also use `[up-follow]` to turn an arbitrary element into a link.
    In this case, put the link's destination into the `up-href` attribute:
    
        <span up-follow up-href="/foo/bar">Go</span>
    
    Note that using any element other than `<a>` will prevent users from
    opening the destination in a new tab.
    
    @selector a[up-follow]
    
    @param {string} [up-method='get']
      The HTTP method to use for the request.
    @param [up-fail-target='body']
      The selector to replace if the server responds with an error.
    @param {string} [up-fallback]
      The selector to update when the original target was not found in the page.
    @param {string} [up-transition='none']
      The [transition](/up.motion) to use for morphing between the old and new elements.
    @param {string} [up-fail-transition='none']
      The [transition](/up.motion) to use for morphing between the old and new elements
      when the server responds with an error.
    @param [up-href]
      The destination URL to follow.
      If omitted, the the link's `href` attribute will be used.
    @param {string} [up-confirm]
      A message that will be displayed in a cancelable confirmation dialog
      before the link is followed.
    @param {string} [up-history]
      Whether to push an entry to the browser history when following the link.
    
      Set this to `'false'` to prevent the URL bar from being updated.
      Set this to a URL string to update the history with the given URL.
    @param [up-restore-scroll='false']
      Whether to restore the scroll position of all viewports
      within the response.
    @stable
     */
    up.on('up:click', fullFollowSelector, function(event, link) {
      if (shouldFollowEvent(event, link)) {
        up.event.halt(event);
        return up.log.muteRejection(follow(link));
      }
    });

    /***
    By adding an `up-instant` attribute to a link, the destination will be
    fetched on `mousedown` instead of `click` (`mouseup`).
    
        <a href="/users" up-follow up-instant>User list</a>
    
    This will save precious milliseconds that otherwise spent
    on waiting for the user to release the mouse button. Since an
    AJAX request will be triggered right way, the interaction will
    appear faster.
    
    Note that using `[up-instant]` will prevent a user from canceling a
    click by moving the mouse away from the link. However, for
    navigation actions this isn't needed. E.g. popular operation
    systems switch tabs on `mousedown` instead of `click`.
    
    `[up-instant]` will also work for links that open [overlays](/up.layer).
    
    \#\#\# Accessibility
    
    If the user activates an element using their keyboard, the `up:click` event will be emitted
    on `click`, even if the element has an `[up-instant]` attribute.
    
    @selector a[up-instant]
    @stable
     */

    /***
    [Follows](/up.follow) this link *as fast as possible*.
    
    This is done by:
    
    - [Following the link through AJAX](/a-up-target) instead of a full page load
    - [Preloading the link's destination URL](/a-up-preload)
    - [Triggering the link on `mousedown`](/a-up-instant) instead of on `click`
    
    \#\#\# Example
    
    Use `[up-dash]` like this:
    
        <a href="/users" up-dash=".main">User list</a>
    
    This is shorthand for:
    
        <a href="/users" up-target=".main" up-instant up-preload>User list</a>
    
    @selector a[up-dash]
    @param {string} [up-dash='body']
      The CSS selector to replace
    
      Inside the CSS selector you may refer to this link as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @stable
     */
    targetMacro('up-dash', {
      'up-preload': '',
      'up-instant': ''
    });

    /***
    Add an `[up-expand]` attribute to any element to enlarge the click area of a
    descendant link.
    
    `[up-expand]` honors all the Unppoly attributes in expanded links, like
    `a[up-target]`, `a[up-instant]` or `a[up-preload]`.
    It also expands links that open [modals](/up.modal) or [popups](/up.popup).
    
    \#\#\# Example
    
        <div class="notification" up-expand>
          Record was saved!
          <a href="/records">Close</a>
        </div>
    
    In the example above, clicking anywhere within `.notification` element
    would [follow](/up.follow) the *Close* link.
    
    \#\#\# Elements with multiple contained links
    
    If a container contains more than one link, you can set the value of the
    `up-expand` attribute to a CSS selector to define which link should be expanded:
    
        <div class="notification" up-expand=".close">
          Record was saved!
          <a class="details" href="/records/5">Details</a>
          <a class="close" href="/records">Close</a>
        </div>
    
    \#\#\# Limitations
    
    `[up-expand]` has some limitations for advanced browser users:
    
    - Users won't be able to right-click the expanded area to open a context menu
    - Users won't be able to `CTRL`+click the expanded area to open a new tab
    
    To overcome these limitations, consider nesting the entire clickable area in an actual `<a>` tag.
    [It's OK to put block elements inside an anchor tag](https://makandracards.com/makandra/43549-it-s-ok-to-put-block-elements-inside-an-a-tag).
    
    @selector [up-expand]
    @param {string} [up-expand]
      A CSS selector that defines which containing link should be expanded.
    
      If omitted, the first link in this element will be expanded.
    @stable
     */
    up.macro('[up-expand]', function(area) {
      var areaAttrs, childLink, selector;
      selector = area.getAttribute('up-expand') || 'a, [up-href]';
      if (childLink = e.get(area, selector)) {
        areaAttrs = e.upAttrs(childLink);
        areaAttrs['up-href'] || (areaAttrs['up-href'] = childLink.getAttribute('href'));
        e.setMissingAttrs(area, areaAttrs);
        return makeFollowable(area);
      }
    });

    /***
    Links with an `up-preload` attribute will silently fetch their target
    when the user hovers over the click area, or when the user puts her
    mouse/finger down (before releasing).
    
    When the link is clicked later, the response will already be cached,
    making the interaction feel instant.
    
    @selector a[up-preload]
    @param [up-delay]
      The number of milliseconds to wait between hovering
      and preloading. Increasing this will lower the load in your server,
      but will also make the interaction feel less instant.
    
      Defaults to `up.link.config.preloadDelay`.
    @stable
     */
    up.compiler(fullPreloadSelector, function(link) {
      return linkPreloader.observeLink(link);
    });
    up.on('up:framework:reset', reset);
    return {
      follow: follow,
      followOptions: followOptions,
      preload: preload,
      makeFollowable: makeFollowable,
      makeClickable: makeClickable,
      isSafe: isSafe,
      isFollowable: isFollowable,
      shouldFollowEvent: shouldFollowEvent,
      followMethod: followMethod,
      targetMacro: targetMacro,
      convertClicks: convertClicks,
      config: config,
      combineFollowableSelectors: combineFollowableSelectors
    };
  })();

  up.follow = up.link.follow;

}).call(this);

/***
Forms
=====
  
Unpoly comes with functionality to [submit](/form-up-target) and [validate](/input-up-validate)
forms without leaving the current page. This means you can replace page fragments,
open dialogs with sub-forms, etc. all without losing form state.

@module up.form
 */

(function() {
  var slice = [].slice;

  up.form = (function() {
    var abortScheduledValidate, autosubmit, config, e, fieldSelector, findFields, findSwitcherForTarget, findValidateTarget, findValidateTargetFromConfig, focusedField, fullSubmitSelector, getContainer, observe, observeCallbackFromElement, reset, submit, submitButtonSelector, submitOptions, submittingButton, switchTarget, switchTargets, switcherValues, u, validate;
    u = up.util;
    e = up.element;

    /***
    Sets default options for form submission and validation.
    
    @property up.form.config
    @param {number} [config.observeDelay=0]
      The number of miliseconds to wait before [`up.observe()`](/up.observe) runs the callback
      after the input value changes. Use this to limit how often the callback
      will be invoked for a fast typist.
    @param {Array<string>} [config.submitSelectors=['form[up-target]', 'form[up-follow]']]
      An array of CSS selectors matching forms that will be [submitted by Unpoly](/up.submit).
    @param {Array<string>} [config.validateTargets=['[up-fieldset]:has(&)', 'fieldset:has(&)', 'label:has(&)', 'form:has(&)']]
      An array of CSS selectors that are searched around a form field
      that wants to [validate](/up.validate). The first matching selector
      will be updated with the validation messages from the server.
    
      By default this looks for a `<fieldset>`, `<label>` or `<form>`
      around the validating input field.
    @param {string} [config.fieldSelectors]
      An array of CSS selectors that represent form fields, such as `input` or `select`.
    @param {string} [config.submitButtonSelectors]
      An array of CSS selectors that represent submit buttons, such as `input[type=submit]`.
    @stable
     */
    config = new up.Config(function() {
      return {
        validateTargets: ['[up-fieldset]:has(&)', 'fieldset:has(&)', 'label:has(&)', 'form:has(&)'],
        fieldSelectors: ['select', 'input:not([type=submit]):not([type=image])', 'button[type]:not([type=submit])', 'textarea'],
        submitSelectors: up.link.combineFollowableSelectors(['form']),
        submitButtonSelectors: ['input[type=submit]', 'input[type=image]', 'button[type=submit]', 'button:not([type])'],
        observeDelay: 0
      };
    });
    fullSubmitSelector = function() {
      return config.submitSelectors.join(',');
    };
    abortScheduledValidate = null;
    reset = function() {
      return config.reset();
    };

    /***
    @function up.form.fieldSelector
    @internal
     */
    fieldSelector = function(suffix) {
      if (suffix == null) {
        suffix = '';
      }
      return config.fieldSelectors.map(function(field) {
        return field + suffix;
      }).join(',');
    };

    /***
    Returns a list of form fields within the given element.
    
    You can configure what Unpoly considers a form field by adding CSS selectors to the
    `up.form.config.fieldSelectors` array.
    
    If the given element is itself a form field, a list of that given element is returned.
    
    @function up.form.fields
    @param {Element|jQuery} root
      The element to scan for contained form fields.
    
      If the element is itself a form field, a list of that element is returned.
    @return {NodeList<Element>|Array<Element>}
    @experimental
     */
    findFields = function(root) {
      var fields, outsideFieldSelector, outsideFields;
      root = e.get(root);
      fields = e.subtree(root, fieldSelector());
      if (e.matches(root, 'form[id]')) {
        outsideFieldSelector = fieldSelector(e.attributeSelector('form', root.getAttribute('id')));
        outsideFields = e.all(outsideFieldSelector);
        fields.push.apply(fields, outsideFields);
        fields = u.uniq(fields);
      }
      return fields;
    };

    /***
    @function up.form.submittingButton
    @param {Element} form
    @internal
     */
    submittingButton = function(form) {
      var focusedElement, selector;
      selector = submitButtonSelector();
      focusedElement = document.activeElement;
      if (focusedElement && e.matches(focusedElement, selector) && form.contains(focusedElement)) {
        return focusedElement;
      } else {
        return e.get(form, selector);
      }
    };

    /***
    @function up.form.submitButtonSelector
    @internal
     */
    submitButtonSelector = function() {
      return config.submitButtonSelectors.join(',');
    };

    /***
    Submits a form via AJAX and updates a page fragment with the response.
    
        up.submit('form.new-user', { target: '.main' })
    
    Instead of loading a new page, the form is submitted via AJAX.
    The response is parsed for a CSS selector and the matching elements will
    replace corresponding elements on the current page.
    
    The unobtrusive variant of this is the [`form[up-target]`](/form-up-target) selector.
    See the documentation for [`form[up-target]`](/form-up-target) for more
    information on how AJAX form submissions work in Unpoly.
    
    Emits the event [`up:form:submit`](/up:form:submit).
    
    @function up.submit
    @param {Element|jQuery|string} form
      A reference or selector for the form to submit.
      If the argument points to an element that is not a form,
      Unpoly will search its ancestors for the closest form.
    @param {string} [options.url]
      The URL where to submit the form.
      Defaults to the form's `action` attribute, or to the current URL of the browser window.
    @param {string} [options.method='post']
      The HTTP method used for the form submission.
      Defaults to the form's `up-method`, `data-method` or `method` attribute, or to `'post'`
      if none of these attributes are given.
    @param {string} [options.target]
      The CSS selector to update when the form submission succeeds (server responds with status 200).
      Defaults to the form's `up-target` attribute.
    
      Inside the CSS selector you may refer to the form as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [options.failTarget]
      The CSS selector to update when the form submission fails (server responds with non-200 status).
      Defaults to the form's `up-fail-target` attribute, or to an auto-generated
      selector that matches the form itself.
    
      Inside the CSS selector you may refer to the form as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [options.fallback]
      The selector to update when the original target was not found in the page.
      Defaults to the form's `up-fallback` attribute.
    @param {boolean|string} [options.history=true]
      Successful form submissions will add a history entry and change the browser's
      location bar if the form either uses the `GET` method or the response redirected
      to another page (this requires the `unpoly-rails` gem).
      If you want to prevent history changes in any case, set this to `false`.
      If you pass a string, it is used as the URL for the browser history.
    @param {string} [options.transition='none']
      The transition to use when a successful form submission updates the `options.target` selector.
      Defaults to the form's `up-transition` attribute, or to `'none'`.
    @param {string} [options.failTransition='none']
      The transition to use when a failed form submission updates the `options.failTarget` selector.
      Defaults to the form's `up-fail-transition` attribute, or to `options.transition`, or to `'none'`.
    @param {number} [options.duration]
      The duration of the transition. See [`up.morph()`](/up.morph).
    @param {number} [options.delay]
      The delay before the transition starts. See [`up.morph()`](/up.morph).
    @param {string} [options.easing]
      The timing function that controls the transition's acceleration. [`up.morph()`](/up.morph).
    @param {Element|string} [options.reveal=true]
      Whether to reveal the target fragment after it was replaced.
    
      You can also pass a CSS selector for the element to reveal.
    @param {boolean|string} [options.failReveal=true]
      Whether to [reveal](/up.reveal) the target fragment when the server responds with an error.
    
      You can also pass a CSS selector for the element to reveal.
    @param {boolean} [options.restoreScroll]
      If set to `true`, this will attempt to [`restore scroll positions`](/up.restoreScroll)
      previously seen on the destination URL.
    @param {boolean} [options.cache]
      Whether to force the use of a cached response (`true`)
      or never use the cache (`false`)
      or make an educated guess (`undefined`).
    
      By default only responses to `GET` requests are cached
      for a few minutes.
    @param {Object} [options.headers={}]
      An object of additional header key/value pairs to send along
      with the request.
    @param {string} [options.layer='auto']
      The name of the layer that ought to be updated. Valid values are
      `'auto'`, `'page'`, `'modal'` and `'popup'`.
    
      If set to `'auto'` (default), Unpoly will try to find a match in the form's layer.
    @param {string} [options.failLayer='auto']
      The name of the layer that ought to be updated if the server sends a non-200 status code.
    @param {Object|FormData|string|Array|up.Params} [options.params]
      Extra form [parameters](/up.Params) that will be submitted in addition to
      the parameters from the form.
    @return {Promise}
      A promise for a successful form submission.
    @stable
     */
    submit = function(form, options) {
      return up.render(submitOptions(form, options));
    };

    /***
    Parses the `render()` options that would be used to
    [`submit`](/up.submit) the given form, but does not render.
    
    @param {Element|jQuery|string} form
      A reference or selector for the form to submit.
    @param {Object} [options]
      Additional options for the form submissions.
    
      Will override any attribute values set on the given form element.
    
      See `up.submit()` for detailled documentation of individual option properties.
    @function up.form.submitOptions
    @return {Object}
    @stable
     */
    submitOptions = function(form, options) {
      var params, parser, submitButton;
      options = u.options(options);
      form = up.fragment.get(form);
      form = e.closest(form, 'form');
      parser = new up.OptionsParser(options, form);
      params = up.Params.fromForm(form);
      if (submitButton = submittingButton(form)) {
        params.addField(submitButton);
        options.method || (options.method = submitButton.getAttribute('formmethod'));
        options.url || (options.url = submitButton.getAttribute('formaction'));
      }
      params.addAll(options.params);
      options.params = params;
      parser.string('url', {
        attr: ['up-action', 'action'],
        "default": up.fragment.source(form)
      });
      parser.string('method', {
        attr: ['up-method', 'data-method', 'method'],
        "default": 'POST',
        normalize: u.normalizeMethod
      });
      if (options.method === 'GET') {
        options.url = up.Params.stripURL(options.url);
      }
      parser.string('failTarget', {
        "default": up.fragment.toTarget(form)
      });
      options.guardEvent || (options.guardEvent = up.event.build('up:form:submit', {
        log: 'Submitting form'
      }));
      u.assign(options, up.link.followOptions(form, options));
      return options;
    };

    /***
    This event is [emitted](/up.emit) when a form is [submitted](/up.submit) through Unpoly.
    
    The event is emitted on the`<form>` element.
    
    @event up:form:submit
    @param {Element} event.target
      The `<form>` element that will be submitted.
    @param event.preventDefault()
      Event listeners may call this method to prevent the form from being submitted.
    @stable
     */
    up.on('up:click', submitButtonSelector, function(event, button) {
      return button.focus();
    });

    /***
    Observes form fields and runs a callback when a value changes.
    
    This is useful for observing text fields while the user is typing.
    
    The unobtrusive variant of this is the [`[up-observe]`](/up-observe) attribute.
    
    \#\#\# Example
    
    The following would print to the console whenever an input field changes:
    
        up.observe('input.query', function(value) {
          console.log('Query is now %o', value)
        })
    
    Instead of a single form field, you can also pass multiple fields,
    a `<form>` or any container that contains form fields.
    The callback will be run if any of the given fields change:
    
        up.observe('form', function(value, name) {
          console.log('The value of %o is now %o', name, value)
        })
    
    You may also pass the `{ batch: true }` option to receive all
    changes since the last callback in a single object:
    
        up.observe('form', { batch: true }, function(diff) {
          console.log('Observed one or more changes: %o', diff)
        })
    
    @function up.observe
    @param {string|Element|Array<Element>|jQuery} elements
      The form fields that will be observed.
    
      You can pass one or more fields, a `<form>` or any container that contains form fields.
      The callback will be run if any of the given fields change.
    @param {boolean} [options.batch=false]
      If set to `true`, the `onChange` callback will receive multiple
      detected changes in a single diff object as its argument.
    @param {number} [options.delay=up.form.config.observeDelay]
      The number of miliseconds to wait before executing the callback
      after the input value changes. Use this to limit how often the callback
      will be invoked for a fast typist.
    @param {Function(value, name): string} onChange
      The callback to run when the field's value changes.
    
      If given as a function, it receives two arguments (`value`, `name`).
      `value` is a string with the new attribute value and `string` is the name
      of the form field that changed. If given as a string, it will be evaled as
      JavaScript code in a context where (`value`, `name`) are set.
    
      A long-running callback function may return a promise that settles when
      the callback completes. In this case the callback will not be called again while
      it is already running.
    @return {Function()}
      A destructor function that removes the observe watch when called.
    @stable
     */
    observe = function() {
      var args, callback, elements, fields, observer, options, ref, ref1, ref2, ref3;
      elements = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      elements = e.list(elements);
      fields = u.flatMap(elements, findFields);
      callback = (ref = (ref1 = u.extractCallback(args)) != null ? ref1 : observeCallbackFromElement(elements[0])) != null ? ref : up.fail('up.observe: No change callback given');
      options = u.extractOptions(args);
      options.delay = (ref2 = (ref3 = options.delay) != null ? ref3 : e.numberAttr(elements[0], 'up-delay')) != null ? ref2 : config.observeDelay;
      observer = new up.FieldObserver(fields, options, callback);
      observer.start();
      return observer.stop;
    };
    observeCallbackFromElement = function(element) {
      var rawCallback;
      if (rawCallback = element.getAttribute('up-observe')) {
        return new Function('value', 'name', rawCallback);
      }
    };

    /***
    [Observes](/up.observe) a field or form and submits the form when a value changes.
    
    Both the form and the changed field will be assigned a CSS class [`form-up-active`](/form-up-active)
    while the autosubmitted form is processing.
    
    The unobtrusive variant of this is the [`up-autosubmit`](/form-up-autosubmit) attribute.
    
    @function up.autosubmit
    @param {string|Element|jQuery} target
      The field or form to observe.
    @param {Object} [options]
      See options for [`up.observe()`](/up.observe)
    @return {Function()}
      A destructor function that removes the observe watch when called.
    @stable
     */
    autosubmit = function(target, options) {
      return observe(target, options, function() {
        return submit(target);
      });
    };
    findValidateTarget = function(element, options) {
      var container, givenTarget;
      container = getContainer(element);
      if (u.isElementish(options.target)) {
        return up.fragment.toTarget(options.target);
      } else if (givenTarget = options.target || element.getAttribute('up-validate') || container.getAttribute('up-validate')) {
        return givenTarget;
      } else if (e.matches(element, 'form')) {
        return up.fragment.toTarget(element);
      } else {
        return findValidateTargetFromConfig(element, options) || up.fail('Could not find validation target for %o (tried defaults %o)', element, config.validateTargets);
      }
    };
    findValidateTargetFromConfig = function(element, options) {
      var layer;
      layer = up.layer.get(element);
      return u.findResult(config.validateTargets, function(defaultTarget) {
        if (up.fragment.get(defaultTarget, u.merge(options, {
          layer: layer
        }))) {
          return defaultTarget;
        }
      });
    };

    /***
    Performs a server-side validation of a form field.
    
    `up.validate()` submits the given field's form with an additional `X-Up-Validate`
    HTTP header. Upon seeing this header, the server is expected to validate (but not save)
    the form submission and render a new copy of the form with validation errors.
    
    The unobtrusive variant of this is the [`input[up-validate]`](/input-up-validate) selector.
    See the documentation for [`input[up-validate]`](/input-up-validate) for more information
    on how server-side validation works in Unpoly.
    
    \#\#\# Example
    
        up.validate('input[name=email]', { target: '.email-errors' })
    
    @function up.validate
    @param {string|Element|jQuery} field
      The form field to validate.
    @param {string|Element|jQuery} [options.target]
      The element that will be [updated](/up.render) with the validation results.
    @return {Promise}
      A promise that fulfills when the server-side
      validation is received and the form was updated.
    @stable
     */
    validate = function(field, options) {
      field = up.fragment.get(field);
      options = u.options(options);
      options.navigate = false;
      options.origin = field;
      options.history = false;
      options.target = findValidateTarget(field, options);
      options.fail = false;
      options.headers || (options.headers = {});
      options.headers[up.protocol.headerize('validate')] = field.getAttribute('name') || ':unknown';
      options.guardEvent = up.event.build('up:form:validate', {
        log: 'Validating form'
      });
      return submit(field, options);
    };
    switcherValues = function(field) {
      var checkedButton, form, groupName, meta, value, values;
      value = void 0;
      meta = void 0;
      if (e.matches(field, 'input[type=checkbox]')) {
        if (field.checked) {
          value = field.value;
          meta = ':checked';
        } else {
          meta = ':unchecked';
        }
      } else if (e.matches(field, 'input[type=radio]')) {
        form = getContainer(field);
        groupName = field.getAttribute('name');
        checkedButton = form.querySelector("input[type=radio]" + (e.attributeSelector('name', groupName)) + ":checked");
        if (checkedButton) {
          meta = ':checked';
          value = checkedButton.value;
        } else {
          meta = ':unchecked';
        }
      } else {
        value = field.value;
      }
      values = [];
      if (u.isPresent(value)) {
        values.push(value);
        values.push(':present');
      } else {
        values.push(':blank');
      }
      if (u.isPresent(meta)) {
        values.push(meta);
      }
      return values;
    };

    /***
    Shows or hides a target selector depending on the value.
    
    See [`input[up-switch]`](/input-up-switch) for more documentation and examples.
    
    This function does not currently have a very useful API outside
    of our use for `up-switch`'s UJS behavior, that's why it's currently
    still marked `@internal`.
    
    @function up.form.switchTargets
    @param {Element} switcher
    @param {string} [options.target]
      The target selectors to switch.
      Defaults to an `[up-switch]` attribute on the given field.
    @internal
     */
    switchTargets = function(switcher, options) {
      var fieldValues, form, ref, targetSelector;
      if (options == null) {
        options = {};
      }
      targetSelector = (ref = options.target) != null ? ref : switcher.getAttribute('up-switch');
      form = getContainer(switcher);
      targetSelector || up.fail("No switch target given for %o", switcher);
      fieldValues = switcherValues(switcher);
      return u.each(e.all(form, targetSelector), function(target) {
        return switchTarget(target, fieldValues);
      });
    };

    /***
    @internal
     */
    switchTarget = function(target, fieldValues) {
      var hideValues, show, showValues;
      fieldValues || (fieldValues = switcherValues(findSwitcherForTarget(target)));
      if (hideValues = target.getAttribute('up-hide-for')) {
        hideValues = u.splitValues(hideValues);
        show = u.intersect(fieldValues, hideValues).length === 0;
      } else {
        if (showValues = target.getAttribute('up-show-for')) {
          showValues = u.splitValues(showValues);
        } else {
          showValues = [':present', ':checked'];
        }
        show = u.intersect(fieldValues, showValues).length > 0;
      }
      e.toggle(target, show);
      return target.classList.add('up-switched');
    };

    /***
    @internal
     */
    findSwitcherForTarget = function(target) {
      var form, switcher, switchers;
      form = getContainer(target);
      switchers = e.all(form, '[up-switch]');
      switcher = u.find(switchers, function(switcher) {
        var targetSelector;
        targetSelector = switcher.getAttribute('up-switch');
        return e.matches(target, targetSelector);
      });
      return switcher || up.fail('Could not find [up-switch] field for %o', target);
    };
    getContainer = function(element) {
      return element.form || e.closest(element, "form, " + (up.layer.anySelector()));
    };
    focusedField = function() {
      var element;
      if ((element = document.activeElement) && e.matches(element, fieldSelector())) {
        return element;
      }
    };

    /***
    Forms with an `up-target` attribute are [submitted via AJAX](/up.submit)
    instead of triggering a full page reload.
    
        <form method="post" action="/users" up-target=".main">
          ...
        </form>
    
    The server response is searched for the selector given in `up-target`.
    The selector content is then [replaced](/up.replace) in the current page.
    
    The programmatic variant of this is the [`up.submit()`](/up.submit) function.
    
    \#\#\# Failed submission
    
    When the server was unable to save the form due to invalid params,
    it will usually re-render an updated copy of the form with
    validation messages.
    
    For Unpoly to be able to detect a failed form submission,
    the form must be re-rendered with a non-200 HTTP status code.
    We recommend to use either 400 (bad request) or
    422 (unprocessable entity).
    
    In Ruby on Rails, you can pass a
    [`:status` option to `render`](http://guides.rubyonrails.org/layouts_and_rendering.html#the-status-option)
    for this:
    
        class UsersController < ApplicationController
    
          def create
            user_params = params[:user].permit(:email, :password)
            @user = User.new(user_params)
            if @user.save?
              sign_in @user
            else
              render 'form', status: :bad_request
            end
          end
    
        end
    
    Note that you can also use
    [`input[up-validate]`](/input-up-validate) to perform server-side
    validations while the user is completing fields.
    
    \#\#\# Redirects
    
    Unpoly requires an additional response header to detect redirects,
    which are otherwise undetectable for an AJAX client.
    
    After the form's action performs a redirect, the next response should echo
    the new request's URL as a response header `X-Up-Location`.
    
    If you are using Unpoly via the `unpoly-rails` gem, these headers
    are set automatically for every request.
    
    \#\#\# Giving feedback while the form is processing
    
    The `<form>` element will be assigned a CSS class [`up-active`](/form.up-active) while
    the submission is loading.
    
    You can also [implement a spinner](/up.network/#spinners)
    by [listening](/up.on) to the [`up:request:late`](/up:request:late)
    and [`up:network:recover`](/up:network:recover) events.
    
    @selector form[up-target]
    @param {string} up-target
      The CSS selector to [replace](/up.replace) if the form submission is successful (200 status code).
    
      Inside the CSS selector you may refer to this form as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-fail-target]
      The CSS selector to [replace](/up.replace) if the form submission is not successful (non-200 status code).
    
      Inside the CSS selector you may refer to this form as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    
      If omitted, Unpoly will replace the `<form>` tag itself, assuming that the server has echoed the form with validation errors.
    @param [up-fallback]
      The selector to replace if the server responds with an error.
    @param {string} [up-transition]
      The animation to use when the form is replaced after a successful submission.
    @param {string} [up-fail-transition]
      The animation to use when the form is replaced after a failed submission.
    @param [up-history]
      Whether to push a browser history entry after a successful form submission.
    
      By default the form's target URL is used. If the form redirects to another URL,
      the redirect target will be used.
    
      Set this to `'false'` to prevent the URL bar from being updated.
      Set this to a URL string to update the history with the given URL.
    @param {string} [up-method]
      The HTTP method to be used to submit the form (`get`, `post`, `put`, `delete`, `patch`).
      Alternately you can use an attribute `data-method`
      ([Rails UJS](https://github.com/rails/jquery-ujs/wiki/Unobtrusive-scripting-support-for-jQuery))
      or `method` (vanilla HTML) for the same purpose.
    @param {string} [up-layer='auto']
      The name of the layer that ought to be updated. Valid values are
      `'auto'`, `'page'`, `'modal'` and `'popup'`.
    
      If set to `'auto'` (default), Unpoly will try to find a match in the form's layer.
      If no match was found in that layer,
      Unpoly will search in other layers, starting from the topmost layer.
    @param {string} [up-fail-layer='auto']
      The name of the layer that ought to be updated if the server sends a
      non-200 status code.
    @param {string} [up-reveal='true']
      Whether to reveal the target element after it was replaced.
    
      You can also pass a CSS selector for the element to reveal.
      Inside the CSS selector you may refer to the form as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-fail-reveal='true']
      Whether to reveal the target element when the server responds with an error.
    
      You can also pass a CSS selector for the element to reveal. You may use this, for example,
      to reveal the first validation error message:
    
          <form up-target=".content" up-fail-reveal=".error">
            ...
          </form>
    
      Inside the CSS selector you may refer to the form as `&` ([like in Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector)).
    @param {string} [up-restore-scroll='false']
      Whether to restore previously known scroll position of all viewports
      within the target selector.
    @param {string} [up-cache]
      Whether to force the use of a cached response (`true`)
      or never use the cache (`false`)
      or make an educated guess (`undefined`).
    
      By default only responses to `GET` requests are cached for a few minutes.
    @stable
     */
    up.on('submit', fullSubmitSelector, function(event, form) {
      if (typeof abortScheduledValidate === "function") {
        abortScheduledValidate();
      }
      up.event.halt(event);
      return up.log.muteRejection(submit(form));
    });

    /***
    When a form field with this attribute is changed, the form is validated on the server
    and is updated with validation messages.
    
    To validate the form, Unpoly will submit the form with an additional `X-Up-Validate` HTTP header.
    When seeing this header, the server is expected to validate (but not save)
    the form submission and render a new copy of the form with validation errors.
    
    The programmatic variant of this is the [`up.validate()`](/up.validate) function.
    
    \#\#\# Example
    
    Let's look at a standard registration form that asks for an e-mail and password:
    
        <form action="/users">
    
          <label>
            E-mail: <input type="text" name="email" />
          </label>
    
          <label>
            Password: <input type="password" name="password" />
          </label>
    
          <button type="submit">Register</button>
    
        </form>
    
    When the user changes the `email` field, we want to validate that
    the e-mail address is valid and still available. Also we want to
    change the `password` field for the minimum required password length.
    We can do this by giving both fields an `up-validate` attribute:
    
        <form action="/users">
    
          <label>
            E-mail: <input type="text" name="email" up-validate />
          </label>
    
          <label>
            Password: <input type="password" name="password" up-validate />
          </label>
    
          <button type="submit">Register</button>
    
        </form>
    
    Whenever a field with `up-validate` changes, the form is POSTed to
    `/users` with an additional `X-Up-Validate` HTTP header.
    When seeing this header, the server is expected to validate (but not save)
    the form submission and render a new copy of the form with validation errors.
    
    In Ruby on Rails the processing action should behave like this:
    
        class UsersController < ApplicationController
    
           * This action handles POST /users
          def create
            user_params = params[:user].permit(:email, :password)
            @user = User.new(user_params)
            if request.headers['X-Up-Validate']
              @user.valid?  # run validations, but don't save to the database
              render 'form' # render form with error messages
            elsif @user.save?
              sign_in @user
            else
              render 'form', status: :bad_request
            end
          end
    
        end
    
    Note that if you're using the `unpoly-rails` gem you can simply say `up.validate?`
    instead of manually checking for `request.headers['X-Up-Validate']`.
    
    The server now renders an updated copy of the form with eventual validation errors:
    
        <form action="/users">
    
          <label class="has-error">
            E-mail: <input type="text" name="email" value="foo@bar.com" />
            Has already been taken!
          </label>
    
          <button type="submit">Register</button>
    
        </form>
    
    The `<label>` around the e-mail field is now updated to have the `has-error`
    class and display the validation message.
    
    \#\#\# How validation results are displayed
    
    Although the server will usually respond to a validation with a complete,
    fresh copy of the form, Unpoly will by default not update the entire form.
    This is done in order to preserve volatile state such as the scroll position
    of `<textarea>` elements.
    
    By default Unpoly looks for a `<fieldset>`, `<label>` or `<form>`
    around the validating input field, or any element with an
    `up-fieldset` attribute.
    With the Bootstrap bindings, Unpoly will also look
    for a container with the `form-group` class.
    
    You can change this default behavior by setting `up.form.config.validateTargets`:
    
        // Always update the entire form containing the current field ("&")
        up.form.config.validateTargets = ['form &']
    
    You can also individually override what to update by setting the `up-validate`
    attribute to a CSS selector:
    
        <input type="text" name="email" up-validate=".email-errors">
        <span class="email-errors"></span>
    
    \#\#\# Updating dependent fields
    
    The `[up-validate]` behavior is also a great way to partially update a form
    when one fields depends on the value of another field.
    
    Let's say you have a form with one `<select>` to pick a department (sales, engineering, ...)
    and another `<select>` to pick an employeee from the selected department:
    
        <form action="/contracts">
          <select name="department">...</select> <!-- options for all departments -->
          <select name="employeed">...</select> <!-- options for employees of selected department -->
        </form>
    
    The list of employees needs to be updated as the appartment changes:
    
        <form action="/contracts">
          <select name="department" up-validate="[name=employee]">...</select>
          <select name="employee">...</select>
        </form>
    
    In order to update the `department` field in addition to the `employee` field, you could say
    `up-validate="&, [name=employee]"`, or simply `up-validate="form"` to update the entire form.
    
    @selector input[up-validate]
    @param {string} up-validate
      The CSS selector to update with the server response.
    
      This defaults to a fieldset or form group around the validating field.
    @stable
     */

    /***
    Performs [server-side validation](/input-up-validate) when any fieldset within this form changes.
    
    You can configure what Unpoly considers a fieldset by adding CSS selectors to the
    `up.form.config.validateTargets` array.
    
    @selector form[up-validate]
    @param {string} up-validate
      The CSS selector to update with the server response.
    
      This defaults to a fieldset or form group around the changing field.
    @stable
     */
    up.on('change', '[up-validate]', function(event) {
      var field;
      field = findFields(event.target)[0];
      return abortScheduledValidate = u.abortableMicrotask(function() {
        return up.log.muteRejection(validate(field));
      });
    });

    /***
    Show or hide elements when a `<select>` or `<input>` has a given value.
    
    \#\#\# Example: Select options
    
    The controlling form field gets an `up-switch` attribute with a selector for the elements to show or hide:
    
        <select name="advancedness" up-switch=".target">
          <option value="basic">Basic parts</option>
          <option value="advanced">Advanced parts</option>
          <option value="very-advanced">Very advanced parts</option>
        </select>
    
    The target elements can use [`[up-show-for]`](/up-show-for) and [`[up-hide-for]`](/up-hide-for)
    attributes to indicate for which values they should be shown or hidden:
    
        <div class="target" up-show-for="basic">
          only shown for advancedness = basic
        </div>
    
        <div class="target" up-hide-for="basic">
          hidden for advancedness = basic
        </div>
    
        <div class="target" up-show-for="advanced very-advanced">
          shown for advancedness = advanced or very-advanced
        </div>
    
    \#\#\# Example: Text field
    
    The controlling `<input>` gets an `up-switch` attribute with a selector for the elements to show or hide:
    
        <input type="text" name="user" up-switch=".target">
    
        <div class="target" up-show-for="alice">
          only shown for user alice
        </div>
    
    You can also use the pseudo-values `:blank` to match an empty input value,
    or `:present` to match a non-empty input value:
    
        <input type="text" name="user" up-switch=".target">
    
        <div class="target" up-show-for=":blank">
          please enter a username
        </div>
    
    \#\#\# Example: Checkbox
    
    For checkboxes you can match against the pseudo-values `:checked` or `:unchecked`:
    
        <input type="checkbox" name="flag" up-switch=".target">
    
        <div class="target" up-show-for=":checked">
          only shown when checkbox is checked
        </div>
    
        <div class="target" up-show-for=":cunhecked">
          only shown when checkbox is unchecked
        </div>
    
    Of course you can also match against the `value` property of the checkbox element:
    
        <input type="checkbox" name="flag" value="active" up-switch=".target">
    
        <div class="target" up-show-for="active">
          only shown when checkbox is checked
        </div>
    
    @selector input[up-switch]
    @param {string} up-switch
      A CSS selector for elements whose visibility depends on this field's value.
    @stable
     */

    /***
    Only shows this element if an input field with [`[up-switch]`](/input-up-switch) has one of the given values.
    
    See [`input[up-switch]`](/input-up-switch) for more documentation and examples.
    
    @selector [up-show-for]
    @param {string} [up-show-for]
      A space-separated list of input values for which this element should be shown.
    @stable
     */

    /***
    Hides this element if an input field with [`[up-switch]`](/input-up-switch) has one of the given values.
    
    See [`input[up-switch]`](/input-up-switch) for more documentation and examples.
    
    @selector [up-hide-for]
    @param {string} [up-hide-for]
      A space-separated list of input values for which this element should be hidden.
    @stable
     */
    up.compiler('[up-switch]', function(switcher) {
      return switchTargets(switcher);
    });
    up.on('change', '[up-switch]', function(event, switcher) {
      return switchTargets(switcher);
    });
    up.compiler('[up-show-for]:not(.up-switched), [up-hide-for]:not(.up-switched)', function(element) {
      return switchTarget(element);
    });

    /***
    Observes this field and runs a callback when a value changes.
    
    This is useful for observing text fields while the user is typing.
    If you want to submit the form after a change see [`input[up-autosubmit]`](/input-up-autosubmit).
    
    The programmatic variant of this is the [`up.observe()`](/up.observe) function.
    
    \#\#\# Example
    
    The following would run a global `showSuggestions(value)` function
    whenever the `<input>` changes:
    
        <input name="query" up-observe="showSuggestions(value)">
    
    \#\#\# Callback context
    
    The script given to `[up-observe]` runs with the following context:
    
    | Name     | Type      | Description                           |
    | -------- | --------- | ------------------------------------- |
    | `value`  | `string`  | The current value of the field        |
    | `this`   | `Element` | The form field                        |
    | `$field` | `jQuery`  | The form field as a jQuery collection |
    
    \#\#\# Observing radio buttons
    
    Multiple radio buttons with the same `[name]` (a radio button group)
    produce a single value for the form.
    
    To observe radio buttons group, use the `[up-observe]` attribute on an
    element that contains all radio button elements with a given name:
    
        <div up-observe="formatSelected(value)">
          <input type="radio" name="format" value="html"> HTML format
          <input type="radio" name="format" value="pdf"> PDF format
          <input type="radio" name="format" value="txt"> Text format
        </div>
    
    @selector input[up-observe]
    @param {string} up-observe
      The code to run when the field's value changes.
    @param {string} up-delay
      The number of miliseconds to wait after a change before the code is run.
    @stable
     */

    /***
    Observes this form and runs a callback when any field changes.
    
    This is useful for observing text fields while the user is typing.
    If you want to submit the form after a change see [`input[up-autosubmit]`](/input-up-autosubmit).
    
    The programmatic variant of this is the [`up.observe()`](/up.observe) function.
    
    \#\#\# Example
    
    The would call a function `somethingChanged(value)`
    when any `<input>` within the `<form>` changes:
    
        <form up-observe="somethingChanged(value)">
          <input name="foo">
          <input name="bar">
        </form>
    
    \#\#\# Callback context
    
    The script given to `[up-observe]` runs with the following context:
    
    | Name     | Type      | Description                           |
    | -------- | --------- | ------------------------------------- |
    | `value`  | `string`  | The current value of the field        |
    | `this`   | `Element` | The form field                        |
    | `$field` | `jQuery`  | The form field as a jQuery collection |
    
    @selector form[up-observe]
    @param {string} up-observe
      The code to run when any field's value changes.
    @param {string} up-delay
      The number of miliseconds to wait after a change before the code is run.
    @stable
     */
    up.compiler('[up-observe]', function(formOrField) {
      return observe(formOrField);
    });

    /***
    Submits this field's form when this field changes its values.
    
    Both the form and the changed field will be assigned a CSS class [`up-active`](/form-up-active)
    while the autosubmitted form is loading.
    
    The programmatic variant of this is the [`up.autosubmit()`](/up.autosubmit) function.
    
    \#\#\# Example
    
    The following would automatically submit the form when the query is changed:
    
        <form method="GET" action="/search">
          <input type="search" name="query" up-autosubmit>
          <input type="checkbox" name="archive"> Include archive
        </form>
    
    \#\#\# Auto-submitting radio buttons
    
    Multiple radio buttons with the same `[name]` (a radio button group)
    produce a single value for the form.
    
    To auto-submit radio buttons group, use the `[up-submit]` attribute on an
    element that contains all radio button elements with a given name:
    
        <div up-autosubmit>
          <input type="radio" name="format" value="html"> HTML format
          <input type="radio" name="format" value="pdf"> PDF format
          <input type="radio" name="format" value="txt"> Text format
        </div>
    
    @selector input[up-autosubmit]
    @param {string} up-delay
      The number of miliseconds to wait after a change before the form is submitted.
    @stable
     */

    /***
    Submits the form when *any* field changes.
    
    Both the form and the field will be assigned a CSS class [`up-active`](/form-up-active)
    while the autosubmitted form is loading.
    
    The programmatic variant of this is the [`up.autosubmit()`](/up.autosubmit) function.
    
    \#\#\# Example
    
    This will submit the form when either query or checkbox was changed:
    
        <form method="GET" action="/search" up-autosubmit>
          <input type="search" name="query">
          <input type="checkbox" name="archive"> Include archive
        </form>
    
    @selector form[up-autosubmit]
    @param {string} up-delay
      The number of miliseconds to wait after a change before the form is submitted.
    @stable
     */
    up.compiler('[up-autosubmit]', function(formOrField) {
      return autosubmit(formOrField);
    });
    up.on('up:framework:reset', reset);
    return {
      config: config,
      submit: submit,
      submitOptions: submitOptions,
      observe: observe,
      validate: validate,
      autosubmit: autosubmit,
      fieldSelector: fieldSelector,
      fields: findFields,
      focusedField: focusedField
    };
  })();

  up.submit = up.form.submit;

  up.observe = up.form.observe;

  up.autosubmit = up.form.autosubmit;

  up.validate = up.form.validate;

}).call(this);

/***
Navigation feedback
===================

The `up.feedback` module adds useful CSS classes to links while they are loading,
or when they point to the current URL. By styling these classes you may
provide instant feedback to user interactions. This improves the perceived speed of your interface.


\#\#\# Example

Let's say we have an `<nav>` element with two links, pointing to `/foo` and `/bar` respectively:

    <nav>
      <a href="/foo" up-follow>Foo</a>
      <a href="/bar" up-follow>Bar</a>
    </nav>

By giving the navigation bar the `[up-nav]` attribute, links pointing to the current browser address are highlighted
as we navigate through the site.

If the current URL is `/foo`, the first link is automatically marked with an [`.up-current`](/a.up-current) class:

    <nav up-nav>
      <a href="/foo" up-follow class="up-current">Foo</a>
      <a href="/bar" up-follow>Bar</a>
    </nav>

When the user clicks on the `/bar` link, the link will receive the [`up-active`](/a.up-active) class while it is waiting
for the server to respond:

    <nav up-nav>
      <a href="/foo" up-follow class="up-current">Foo</a>
      <a href="/bar" up-follow class="up-active">Bar</a>
    </div>

Once the response is received the URL will change to `/bar` and the `up-active` class is removed:

    <nav up-nav>
      <a href="/foo" up-follow>Foo</a>
      <a href="/bar" up-follow class="up-current">Bar</a>
    </nav>


@module up.feedback
 */

(function() {
  up.feedback = (function() {
    var CLASS_ACTIVE, SELECTOR_LINK, around, aroundForOptions, config, e, findActivatableArea, linkURLs, navSelector, normalizeURL, onHistoryChanged, reset, start, stop, u, updateFragment, updateLayerIfLocationChanged, updateLinks, updateLinksWithinNavs;
    u = up.util;
    e = up.element;

    /***
    Sets default options for this module.
    
    @property up.feedback.config
    @param {Array<string>} [config.currentClasses]
      An array of classes to set on [links that point the current location](/a.up-current).
    @param {Array<string>} [config.navSelectors]
      An array of CSS selectors that match [navigation components](/up-nav).
    @stable
     */
    config = new up.Config(function() {
      return {
        currentClasses: ['up-current'],
        navSelectors: ['[up-nav]']
      };
    });
    reset = function() {
      return config.reset();
    };
    CLASS_ACTIVE = 'up-active';
    SELECTOR_LINK = 'a, [up-href]';
    navSelector = function() {
      return config.navSelectors.join(',');
    };
    normalizeURL = function(url) {
      if (url) {
        return u.normalizeURL(url, {
          stripTrailingSlash: true
        });
      }
    };
    linkURLs = function(link) {
      return link.upFeedbackURLs || (link.upFeedbackURLs = new up.LinkFeedbackURLs(link));
    };
    updateFragment = function(fragment, options) {
      var links;
      if (e.closest(fragment, navSelector())) {
        links = e.subtree(fragment, SELECTOR_LINK);
        return updateLinks(links, options);
      } else {
        return updateLinksWithinNavs(fragment, options);
      }
    };
    updateLinksWithinNavs = function(fragment, options) {
      var links, navs;
      navs = e.subtree(fragment, navSelector());
      links = u.flatMap(navs, function(nav) {
        return e.subtree(nav, SELECTOR_LINK);
      });
      return updateLinks(links, options);
    };
    updateLinks = function(links, options) {
      var layer, layerLocation;
      if (options == null) {
        options = {};
      }
      if (!links.length) {
        return;
      }
      layer = options.layer || up.layer.get(links[0]);
      if (layerLocation = layer.feedbackLocation) {
        return u.each(links, function(link) {
          var currentClass, i, isCurrent, len, ref;
          isCurrent = linkURLs(link).isCurrent(layerLocation);
          ref = config.currentClasses;
          for (i = 0, len = ref.length; i < len; i++) {
            currentClass = ref[i];
            e.toggleClass(link, currentClass, isCurrent);
          }
          return e.toggleAttr(link, 'aria-current', 'page', isCurrent);
        });
      }
    };

    /***
    @function findActivatableArea
    @param {string|Element|jQuery} element
    @internal
     */
    findActivatableArea = function(element) {
      return e.ancestor(element, SELECTOR_LINK) || element;
    };

    /***
    Marks the given element as currently loading, by assigning the CSS class [`up-active`](/a.up-active).
    
    This happens automatically when following links or submitting forms through the Unpoly API.
    Use this function if you make custom network calls from your own JavaScript code.
    
    If the given element is a link within an [expanded click area](/up-expand),
    the class will be assigned to the expanded area.
    
    \#\#\# Example
    
        var button = document.querySelector('button')
    
        button.addEventListener('click', () => {
          up.feedback.start(button)
          up.request(...).then(() => {
            up.feedback.stop(button)
          })
        })
    
    @function up.feedback.start
    @param {Element} element
      The element to mark as active
    @internal
     */
    start = function(element) {
      return findActivatableArea(element).classList.add(CLASS_ACTIVE);
    };

    /***
    Links that are currently [loading through Unpoly](/form-up-target)
    are assigned the `up-active` class automatically.
    Style `.up-active` in your CSS to improve the perceived responsiveness
    of your user interface.
    
    The `up-active` class will be removed when the link is done loading.
    
    \#\#\# Example
    
    We have a link:
    
        <a href="/foo" up-follow>Foo</a>
    
    The user clicks on the link. While the request is loading,
    the link has the `up-active` class:
    
        <a href="/foo" up-follow class="up-active">Foo</a>
    
    Once the link destination has loaded and rendered, the `up-active` class
    is removed and the [`up-current`](/a.up-current) class is added:
    
        <a href="/foo" up-follow class="up-current">Foo</a>
    
    @selector a.up-active
    @stable
     */

    /***
    Forms that are currently [loading through Unpoly](/a-up-target)
    are assigned the `up-active` class automatically.
    Style `.up-active` in your CSS to improve the perceived responsiveness
    of your user interface.
    
    The `up-active` class will be removed as soon as the response to the
    form submission has been received.
    
    \#\#\# Example
    
    We have a form:
    
        <form up-target=".foo">
          <button type="submit">Submit</button>
        </form>
    
    The user clicks on the submit button. While the form is being submitted
    and waiting for the server to respond, the form has the `up-active` class:
    
        <form up-target=".foo" class="up-active">
          <button type="submit">Submit</button>
        </form>
    
    Once the link destination has loaded and rendered, the `up-active` class
    is removed.
    
    @selector form.up-active
    @stable
     */

    /***
    Marks the given element as no longer loading, by removing the CSS class [`up-active`](/a.up-active).
    
    This happens automatically when network requests initiated by the Unpoly API have completed.
    Use this function if you make custom network calls from your own JavaScript code.
    
    @function up.feedback.stop
    @param {Element} element
      The link or form that has finished loading.
    @internal
     */
    stop = function(element) {
      return findActivatableArea(element).classList.remove(CLASS_ACTIVE);
    };
    around = function(element, fn) {
      start(element);
      return u.always(fn(), function() {
        return stop(element);
      });
    };
    aroundForOptions = function(options, fn) {
      var element, feedbackOpt;
      if (feedbackOpt = options.feedback) {
        if (u.isBoolean(feedbackOpt)) {
          element = options.origin;
        } else {
          element = feedbackOpt;
        }
      }
      if (element) {
        element = up.fragment.get(element);
        return around(element, fn);
      } else {
        return fn();
      }
    };

    /***
    Marks this element as a navigation component, such as a menu or navigation bar.
    
    When a link within an `[up-nav]` element points to the current location, it is assigned the [`.up-current`](/a.up-current) class. When the browser navigates to another location, the class is removed automatically.
    
    You may also assign `[up-nav]` to an individual link instead of an navigational container.
    
    If you don't want to manually add this attribute to every navigational element, you can configure selectors to automatically match your navigation components in `up.feedback.config.navs`.
    
    
    \#\#\# Example
    
    Let's take a simple menu with two links. The menu has been marked with the `[up-nav]` attribute:
    
        <div up-nav>
          <a href="/foo">Foo</a>
          <a href="/bar">Bar</a>
        </div>
    
    If the browser location changes to `/foo`, the first link is marked as `.up-current`:
    
        <div up-nav>
          <a href="/foo" class="up-current">Foo</a>
          <a href="/bar">Bar</a>
        </div>
    
    If the browser location changes to `/bar`, the first link automatically loses its `.up-current` class. Now the second link is marked as `.up-current`:
    
        <div up-nav>
          <a href="/foo">Foo</a>
          <a href="/bar" class="up-current">Bar</a>
        </div>
    
    
    \#\#\# What is considered to be "current"?
    
    The current location is considered to be either:
    
    - the URL displayed in the browser window's location bar
    - the source URL of a [modal dialog](/up.modal)
    - the URL of the page behind a [modal dialog](/up.modal)
    - the source URL of a [popup overlay](/up.popup)
    - the URL of the content behind a [popup overlay](/up.popup)
    
    A link matches the current location (and is marked as `.up-current`) if it matches either:
    
    - the link's `[href]` attribute
    - the link's `[up-href]` attribute
    - the URL pattern in the link's [`[up-alias]`](/a-up-alias) attribute
    
    @selector [up-nav]
    @stable
     */

    /***
    Links within `[up-nav]` may use the `[up-alias]` attribute to pass an URL pattern for which they
    should also be highlighted as [`.up-current`](a.up-current).
    
    \#\#\# Examples
    
    The link below will be highlighted with `.up-current` at both `/profile` and `/profile/edit` locations:
    
        <nav up-nav>
          <a href="/profile" up-alias="/profile/edit">Profile</a>
        </nav>
    
    To pass more than one alternative URLs, separate them by a space character:
    
        <nav up-nav>
          <a href="/profile" up-alias="/profile/new /profile/edit">Profile</a>
        </nav>
    
    Often you would like to mark a link as `.up-current` whenever the current URL matches a prefix or suffix.
    To do so, include an asterisk (`*`) in the `[up-alias]` attribute. For instance, the first link in the
    below will be highlighted for both `/users` and `/users/123`:
    
        <nav up-nav>
          <a href="/users" up-alias="/users/*">Users</a>
          <a href="/reports" up-alias="/reports/*">Reports</a>
        </div>
    
    You may pass multiple patterns separated by a space character:
    
        <nav up-nav>
          <a href="/users" up-alias="/users/* /profile/*">Users</a>
        </nav>
    
    @selector a[up-alias]
    @param {string} up-alias
      A space-separated list of alternative URLs or URL patterns.
    @stable
     */

    /***
    When a link within an `[up-nav]` element points to the current location, it is assigned the `.up-current` class.
    
    See [`[up-nav]`](/up-nav) for more documentation and examples.
    
    @selector a.up-current
    @stable
     */
    updateLayerIfLocationChanged = function(layer) {
      var currentLocation, processedLocation;
      processedLocation = layer.feedbackLocation;
      currentLocation = normalizeURL(layer.location);
      if (!processedLocation || processedLocation !== currentLocation) {
        layer.feedbackLocation = currentLocation;
        return updateLinksWithinNavs(layer.element, {
          layer: layer
        });
      }
    };
    onHistoryChanged = function() {
      var frontLayer;
      frontLayer = up.layer.front;
      if (frontLayer.hasLiveHistory()) {
        return updateLayerIfLocationChanged(frontLayer);
      }
    };
    up.on('up:history:pushed up:history:replaced up:history:restored', function(event) {
      return onHistoryChanged();
    });
    up.on('up:fragment:inserted', function(event, newFragment) {
      return updateFragment(newFragment, event);
    });
    up.on('up:layer:location:changed', function(event) {
      return updateLayerIfLocationChanged(event.layer);
    });
    up.on('up:framework:reset', reset);
    return {
      config: config,
      start: start,
      stop: stop,
      around: around,
      aroundForOptions: aroundForOptions,
      normalizeURL: normalizeURL
    };
  })();

}).call(this);

/***
Passive updates
===============

This work-in-progress package will contain functionality to
passively receive updates from the server.

@module up.radio
 */

(function() {
  up.radio = (function() {
    var config, e, hungrySelector, reset, shouldPoll, startPolling, stopPolling, u;
    u = up.util;
    e = up.element;

    /***
    Configures defaults for passive updates.
    
    @property up.radio.config
    @param {Array<string>} [config.hungrySelectors]
      An array of CSS selectors that is replaced whenever a matching element is found in a response.
      These elements are replaced even when they were not targeted directly.
    
      By default this contains the [`[up-hungry]`](/up-hungry) attribute.
    @param {number} [config.pollInterval=30000]
      The default [polling](/up-poll] interval in milliseconds.
    @param {boolean|string} [config.pollEnabled='auto']
      Whether Unpoly will follow instructions to poll fragments, like the `[up-poll]` attribute.
    
      When set to `'auto'` Unpoly will poll if one of the following applies:
    
      - The browser tab is in the foreground
      - The fragment's layer is the [frontmost layer](/up.layer.front).
      - We should not [avoid optional requests](/up.network.shouldReduceRequests)
    
      When set to `true`, Unpoly will always allow polling.
    
      When set to `false`, Unpoly will never allow polling.
    @stable
     */
    config = new up.Config(function() {
      return {
        hungrySelectors: ['[up-hungry]'],
        pollInterval: 30000,
        pollEnabled: 'auto'
      };
    });
    reset = function() {
      return config.reset();
    };

    /***
    @function up.radio.hungrySelector
    @internal
     */
    hungrySelector = function() {
      return config.hungrySelectors.join(',');
    };

    /***
    Elements with an `[up-hungry]` attribute are [updated](/up.replace) whenever there is a
    matching element found in a successful response. The element is replaced even
    when it isn't [targeted](/a-up-target) directly.
    
    Use cases for this are unread message counters or notification flashes.
    Such elements often live in the layout, outside of the content area that is
    being replaced.
    
    @selector [up-hungry]
    @param [up-transition]
      The transition to use when this element is updated.
    @stable
     */

    /***
    Starts [polling](/up-poll) the given element.
    
    @function up.radio.startPolling
    @param {Element|jQuery|string} fragment
      The fragment to reload periodically.
    @param {number} options.interval
      The reload interval in milliseconds.
    
      Defaults to `up.radio.config.pollInterval`.
    @stable
     */
    startPolling = function(fragment, options) {
      var destructor, doReload, doSchedule, interval, lastRequest, ref, ref1, stopped;
      if (options == null) {
        options = {};
      }
      interval = (ref = (ref1 = options.interval) != null ? ref1 : e.numberAttr(fragment, 'up-interval')) != null ? ref : config.pollInterval;
      stopped = false;
      lastRequest = null;
      options.onQueued = function(arg) {
        var request;
        request = arg.request;
        return lastRequest = request;
      };
      doReload = function() {
        if (stopped) {
          return;
        }
        if (shouldPoll(fragment)) {
          console.log("SHOULD POLL!");
          return u.always(up.reload(fragment, options), doSchedule);
        } else {
          return doSchedule(Math.min(10 * 1000, interval));
        }
      };
      doSchedule = function(delay) {
        if (delay == null) {
          delay = interval;
        }
        if (stopped) {
          return;
        }
        return setTimeout(doReload, delay);
      };
      destructor = function() {
        stopped = true;
        return lastRequest != null ? lastRequest.abort() : void 0;
      };
      up.on(fragment, 'up:poll:stop', destructor);
      doSchedule();
      return destructor;
    };

    /***
    Stops [polling](/up-poll) the given element.
    
    @function up.radio.stopPolling
    @param {Element|jQuery|string} fragment
      The fragment to stop reloading.
    @stable
     */
    stopPolling = function(element) {
      return up.emit(element, 'up:poll:stop');
    };
    shouldPoll = function(fragment) {
      var ref, setting;
      setting = u.evalOption(config.pollEnabled, fragment);
      if (setting === 'auto') {
        return !document.hidden && !up.network.shouldReduceRequests() && ((ref = up.layer.get(fragment)) != null ? typeof ref.isFront === "function" ? ref.isFront() : void 0 : void 0);
      }
      return setting;
    };

    /***
    Elements with an `[up-poll]` attribute are [reloaded](/up.reload) from the server periodically.
    
    \#\#\# Example
    
    Assume an application layout with an unread message counter.
    You can use `[up-poll]` to refresh the counter every 30 seconds:
    
        <div class="unread-count" up-poll>
          2 new messages
        </div>
    
    \#\#\# Controlling the reload interval
    
    You may set an optional `[up-interval]` attribute to set the reload interval in milliseconds:
    
        <div class="unread-count" up-poll up-interval="10000">
          2 new messages
        </div>
    
    If the value is omitted, a global default is used. You may configure the default like this:
    
        up.radio.config.pollInterval = 10000
    
    \#\#\# Controlling the source URL
    
    The element will be reloaded from the URL from which it was originally loaded.
    
    To reload from another URL, set an `[up-source]` attribute on the polling element:
    
        <div class="unread-count" up-poll up-source="/unread-count">
          2 new messages
        </div>
    
    @selector [up-poll]
    @param [up-interval]
      The reload interval in milliseconds.
    
      Defaults to `up.radio.config.pollInterval`.
    @stable
     */
    up.compiler('[up-poll]', startPolling);
    up.on('up:framework:reset', reset);
    return {
      config: config,
      hungrySelector: hungrySelector,
      startPolling: startPolling,
      stopPolling: stopPolling
    };
  })();

}).call(this);

/***
Play nice with Rails UJS
========================
 */

(function() {
  up.rails = (function() {
    var e, isRails, u;
    u = up.util;
    e = up.element;
    isRails = function() {
      var ref;
      return window._rails_loaded || window.Rails || ((ref = window.jQuery) != null ? ref.rails : void 0);
    };
    return u.each(['method', 'confirm'], function(feature) {
      var dataAttribute, upAttribute;
      dataAttribute = "data-" + feature;
      upAttribute = "up-" + feature;
      return up.macro("[" + dataAttribute + "]", function(element) {
        if (isRails() && up.link.isFollowable(element)) {
          e.setMissingAttr(element, upAttribute, element.getAttribute(dataAttribute));
          return element.removeAttribute(dataAttribute);
        }
      });
    });
  })();

}).call(this);
(function() {
  up.framework.boot();

}).call(this);
