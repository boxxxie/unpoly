
/***
@module up.element
 */

(function() {
  var preloadDelayMoved,
    slice = [].slice;

  up.element.first = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.deprecated('up.element.first()', 'up.element.get()');
    return (ref = up.element).get.apply(ref, args);
  };

  up.element.createFromHtml = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.deprecated('up.element.createFromHtml', 'up.element.createFromHTML');
    return (ref = up.element).createFromHTML.apply(ref, args);
  };


  /***
  @module up.event
   */

  up.legacy.renamedPackage('bus', 'event');


  /***
  @module up.feedback
   */

  up.legacy.renamedPackage('navigation', 'feedback');

  up.legacy.renamedProperty(up.feedback.config, 'navs', 'navSelectors');


  /***
  @module up.form
   */

  up.legacy.renamedProperty(up.form.config, 'fields', 'fieldSelectors');

  up.legacy.renamedProperty(up.form.config, 'submitButtons', 'submitButtonSelectors');


  /***
  @module up.fragment
   */

  up.legacy.renamedPackage('flow', 'fragment');

  up.legacy.renamedPackage('dom', 'fragment');

  up.legacy.renamedProperty(up.fragment.config, 'fallbacks', 'mainTargets');

  up.legacy.handleResponseDocOptions = function(docOptions) {
    return up.legacy.fixKey(docOptions, 'html', 'document');
  };


  /*
  Replaces elements on the current page with corresponding elements
  from a new page fetched from the server.
  
  @function up.replace
  @param {string|Element|jQuery} target
    The CSS selector to update. You can also pass a DOM element or jQuery element
    here, in which case a selector will be inferred from the element's class and ID.
  @param {string} url
    The URL to fetch from the server.
  @param {Object} [options]
    See `options` for `up.render()
  @return {Promise}
    A promise that fulfills when the page has been updated.
  @deprecated
    Use `up.render()` instead.
   */

  up.fragment.replace = function(target, url, options) {
    up.legacy.deprecated('up.replace(target, url)', 'up.navigate(target, { url })');
    return up.navigate(u.merge(options, {
      target: target,
      url: url
    }));
  };


  /***
  Updates a selector on the current page with the
  same selector from the given HTML string.
  
  \#\#\# Example
  
  Let's say your current HTML looks like this:
  
      <div class="one">old one</div>
      <div class="two">old two</div>
  
  We now replace the second `<div>`, using an HTML string
  as the source:
  
      html = '<div class="one">new one</div>' +
             '<div class="two">new two</div>';
  
      up.extract('.two', html)
  
  Unpoly looks for the selector `.two` in the strings and updates its
  contents in the current page. The current page now looks like this:
  
      <div class="one">old one</div>
      <div class="two">new two</div>
  
  Note how only `.two` has changed. The update for `.one` was
  discarded, since it didn't match the selector.
  
  @function up.extract
  @param {string|Element|jQuery} target
  @param {string} html
  @param {Object} [options]
    See options for [`up.render()`](/up.render).
  @return {Promise}
    A promise that will be fulfilled then the selector was updated.
  @stable
   */

  up.fragment.extract = function(target, document, options) {
    up.legacy.deprecated('up.extract(target, document)', 'up.navigate(target, { document })');
    return up.navigate(u.merge(options, {
      target: target,
      document: document
    }));
  };

  up.first = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.deprecated('up.first()', 'up.fragment.get()');
    return (ref = up.fragment).get.apply(ref, args);
  };

  up.legacy.handleScrollOptions = function(options) {
    if (u.isUndefined(options.scroll)) {
      if (u.isString(options.reveal)) {
        up.legacy.deprecated("Option { reveal: '" + options.reveal + "' }", "{ scroll: '" + options.reveal + "' }");
        options.scroll = options.reveal;
      } else if (options.reveal === true) {
        up.legacy.deprecated('Option { reveal: true }', "{ scroll: 'target' }");
        options.scroll = 'target';
      } else if (options.reveal === false) {
        up.legacy.deprecated('Option { reveal: false }', "{ scroll: false }");
        options.scroll = false;
      }
      if (u.isDefined(options.resetScroll)) {
        up.legacy.deprecated('Option { resetScroll: true }', "{ scroll: 'top' }");
        options.scroll = 'top';
      }
      if (u.isDefined(options.restoreScroll)) {
        up.legacy.deprecated('Option { restoreScroll: true }', "{ scroll: 'restore' }");
        return options.scroll = 'restore';
      }
    }
  };

  up.legacy.handleRenderOptions = function(options) {
    var i, len, prop, ref, results;
    if (u.isString(options.history) && options.history !== 'auto') {
      up.legacy.warn("Passing a URL as { history } option is deprecated. Pass it as { location } instead.");
      options.location = options.history;
      options.history = 'auto';
    }
    ref = ['target', 'origin'];
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      prop = ref[i];
      if (u.isJQuery(options[prop])) {
        up.legacy.warn('Passing a jQuery collection as { %s } is deprecated. Pass it as a native element instead.', prop);
        results.push(options[prop] = up.element.get(options[prop]));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /***
  @module up.history
   */

  up.legacy.renamedProperty(up.history.config, 'popTargets', 'restoreTargets');


  /***
  @module up.layer
   */

  up.legacy.handleLayerOptions = function(options) {
    up.legacy.fixKey(options, 'flavor', 'mode');
    up.legacy.fixKey(options, 'closable', 'dismissable');
    up.legacy.fixKey(options, 'closeLabel', 'dismissLabel');
    if (options.width || options.maxWidth) {
      up.legacy.warn('Layer options { width } and { maxWidth } have been removed. Use { size } or { class } instead.');
    }
    if (options.sticky) {
      up.legacy.warn('Layer option { sticky } has been removed. Give links an [up-peel=false] attribute to prevent layer dismissal on click.');
    }
    if (options.template) {
      up.legacy.warn('Layer option { template } has been removed. Use { class } or modify the layer HTML on up:layer:open.');
    }
    if (options.layer === 'page') {
      up.legacy.warn('Layer "page" has been renamed to "root"');
      return options.layer = 'root';
    }
  };

  up.legacy.handleTetherOptions = function(options) {
    var align, position, ref;
    ref = options.position.split('-'), position = ref[0], align = ref[1];
    if (align) {
      up.legacy.warn('The position value %o is deprecated. Use %o instead.', options.position, {
        position: position,
        align: align
      });
      options.position = position;
      return options.align = align;
    }
  };

  up.legacy.registerLayerCloser = function(layer) {
    return layer.registerClickCloser('up-close', (function(_this) {
      return function(value, closeOptions) {
        up.legacy.deprecated('[up-close]', '[up-dismiss]');
        return layer.dismiss(value, closeOptions);
      };
    })(this));
  };


  /***
  @module up.network
   */

  up.legacy.renamedPackage('proxy', 'network');

  up.legacy.renamedEvent('up:proxy:load', 'up:request:load');

  up.legacy.renamedEvent('up:proxy:received', 'up:request:loaded');

  up.legacy.renamedEvent('up:proxy:loaded', 'up:request:loaded');

  up.legacy.renamedEvent('up:proxy:fatal', 'up:request:fatal');

  up.legacy.renamedEvent('up:proxy:aborted', 'up:request:aborted');

  up.legacy.renamedEvent('up:proxy:slow', 'up:request:late');

  up.legacy.renamedEvent('up:proxy:recover', 'up:network:recover');

  preloadDelayMoved = function() {
    return up.legacy.deprecated('up.proxy.config.preloadDelay', 'up.link.config.preloadDelay');
  };

  Object.defineProperty(up.network.config, 'preloadDelay', {
    get: function() {
      preloadDelayMoved();
      return up.link.config.preloadDelay;
    },
    set: function(value) {
      preloadDelayMoved();
      return up.link.config.preloadDelay = value;
    }
  });

  up.legacy.renamedProperty(up.network.config, 'maxRequests', 'concurrency');

  up.legacy.renamedProperty(up.network.config, 'slowDelay', 'badResponseTime');

  up.legacy.handleNetworkPreloadArgs = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (u.isElementish(args[0])) {
      up.legacy.warn('up.proxy.preload(link) has been renamed to up.link.preload(link)');
      return (ref = up.link).preload.apply(ref, args);
    }
  };

  up.legacy.handleRequestOptions = function(options) {
    return up.legacy.fixKey(options, 'data', 'params');
  };


  /***
  Makes an AJAX request to the given URL and caches the response.
  
  The function returns a promise that fulfills with the response text.
  
  \#\#\# Example
  
      up.request('/search', { params: { query: 'sunshine' } }).then(function(text) {
        console.log('The response text is %o', text)
      }).catch(function() {
        console.error('The request failed')
      })
  
  @function up.ajax
  @param {string} [url]
    The URL for the request.
  
    Instead of passing the URL as a string argument, you can also pass it as an `{ url }` option.
  @param {Object} [options]
    See options for `up.request()`.
  @return {Promise<string>}
    A promise for the response text.
  @deprecated
    Use `up.request()` instead.
   */

  up.ajax = function() {
    var args, pickResponseText;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.deprecated('up.ajax()', 'up.request()');
    pickResponseText = function(response) {
      return response.text;
    };
    return up.request.apply(up, args).then(pickResponseText);
  };

  up.proxy.clear = function() {
    up.legacy.deprecated('up.proxy.clear()', 'up.cache.clear()');
    return up.cache.clear();
  };


  /***
  @class up.Request
   */

  up.Request.prototype.navigate = function() {
    up.legacy.deprecated('up.Request#navigate()', 'up.Request#loadPage()');
    return this.loadPage();
  };


  /***
  @class up.Response
   */


  /***
  Returns whether the server responded with a 2xx HTTP status.
  
  @function up.Response#isSuccess
  @return {boolean}
  @deprecated
    Use `up.Response#ok` instead.
   */

  up.Response.prototype.isSuccess = function() {
    up.legacy.deprecated('up.Response#isSuccess()', 'up.Response#ok');
    return this.ok;
  };


  /***
  Returns whether the response was not [successful](/up.Response.prototype.ok).
  
  @function up.Response#isError
  @return {boolean}
  @deprecated
    Use `!up.Response#ok` instead.
   */

  up.Response.prototype.isError = function() {
    up.legacy.deprecated('up.Response#isError()', '!up.Response#ok');
    return !this.ok;
  };


  /***
  @module up.radio
   */

  up.legacy.renamedProperty(up.radio.config, 'hungry', 'hungrySelectors');


  /***
  @module up.util
   */


  /***
  Returns a copy of the given object that only contains
  the given keys.
  
  @function up.util.only
  @param {Object} object
  @param {Array} keys...
  @deprecated
    Use `up.util.pick()` instead.
   */

  up.util.only = function() {
    var keys, object;
    object = arguments[0], keys = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    up.legacy.deprecated('up.util.only(object, keys...)', 'up.util.pick(object, keys)');
    return up.util.pick(object, keys);
  };


  /***
  Returns a copy of the given object that contains all except
  the given keys.
  
  @function up.util.except
  @param {Object} object
  @param {Array} keys...
  @deprecated
    Use `up.util.omit()` instead.
   */

  up.util.except = function() {
    var keys, object;
    object = arguments[0], keys = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    up.legacy.deprecated('up.util.except(object, keys...)', 'up.util.omit(object, keys)');
    return up.util.omit(object, keys);
  };

  up.util.parseUrl = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.parseUrl() has been renamed to up.util.parseURL()');
    return (ref = up.util).parseURL.apply(ref, args);
  };

  up.util.any = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.any() has been renamed to up.util.some()');
    return some.apply(null, args);
  };

  up.util.all = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.all() has been renamed to up.util.every()');
    return (ref = up.util).every.apply(ref, args);
  };

  up.util.detect = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.detect() has been renamed to up.util.find()');
    return (ref = up.util).find.apply(ref, args);
  };

  up.util.select = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.select() has been renamed to up.util.filter()');
    return (ref = up.util).filter.apply(ref, args);
  };

  up.util.setTimer = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.setTimer() has been renamed to up.util.timer()');
    return (ref = up.util).timer.apply(ref, args);
  };

  up.util.escapeHtml = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.deprecated('up.util.escapeHtml', 'up.util.escapeHTML');
    return (ref = up.util).escapeHTML.apply(ref, args);
  };

  up.util.selectorForElement = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.selectorForElement() has been renamed to up.fragment.toTarget()');
    return (ref = up.fragment).toTarget.apply(ref, args);
  };

  up.util.nextFrame = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.warn('up.util.nextFrame() has been renamed to up.util.task()');
    return (ref = up.util).task.apply(ref, args);
  };


  /***
  @module up.viewport
   */

  up.legacy.renamedPackage('layout', 'viewport');

  up.legacy.renamedProperty(up.viewport.config, 'viewports', 'viewportSelectors');

  up.legacy.renamedProperty(up.viewport.config, 'snap', 'revealSnap');

  up.viewport.closest = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    up.legacy.deprecated('up.viewport.closest()', 'up.viewport.get()');
    return (ref = up.viewport).get.apply(ref, args);
  };


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */


  /***
  @module up.network
   */

}).call(this);
(function() {
  var FLAVORS_ERROR, u;

  u = up.util;

  FLAVORS_ERROR = 'up.modal.flavors has been removed without direct replacement. You may give new layers a { class } or modify layer elements on up:layer:open.';

  up.modal = u.literal({
    visit: function(url, options) {
      if (options == null) {
        options = {};
      }
      up.legacy.deprecated('up.modal.visit(url)', 'up.layer.open({ url, mode: "modal" })');
      return up.layer.open(u.merge(options, {
        url: url,
        mode: 'modal'
      }));
    },
    follow: function(link, options) {
      if (options == null) {
        options = {};
      }
      up.legacy.deprecated('up.modal.follow(link)', 'up.follow(link, { layer: "modal" })');
      return up.follow(link, u.merge(options, {
        layer: 'modal'
      }));
    },
    extract: function(target, html, options) {
      if (options == null) {
        options = {};
      }
      up.legacy.deprecated('up.modal.extract(target, document)', 'up.layer.open({ document, mode: "modal" })');
      return up.layer.open(u.merge(options, {
        target: target,
        html: html,
        layer: 'modal'
      }));
    },
    close: function(options) {
      if (options == null) {
        options = {};
      }
      up.legacy.deprecated('up.modal.close()', 'up.layer.dismiss()');
      return up.layer.dismiss(null, options);
    },
    url: function() {
      up.legacy.deprecated('up.modal.url()', 'up.layer.location');
      return up.layer.location;
    },
    coveredUrl: function() {
      var ref;
      up.legacy.deprecated('up.modal.coveredUrl()', 'up.layer.parent.location');
      return (ref = up.layer.parent) != null ? ref.location : void 0;
    },
    get_config: function() {
      up.legacy.deprecated('up.modal.config', 'up.layer.config.modal');
      return up.layer.config.modal;
    },
    contains: function(element) {
      up.legacy.deprecated('up.modal.contains()', 'up.layer.contains()');
      return up.layer.contains(element);
    },
    isOpen: function() {
      up.legacy.deprecated('up.modal.isOpen()', 'up.layer.isOverlay()');
      return up.layer.isOverlay();
    },
    get_flavors: function() {
      throw FLAVORS_ERROR;
    },
    flavor: function() {
      throw FLAVORS_ERROR;
    }
  });

  up.legacy.renamedEvent('up:modal:open', 'up:layer:open');

  up.legacy.renamedEvent('up:modal:opened', 'up:layer:opened');

  up.legacy.renamedEvent('up:modal:close', 'up:layer:dismiss');

  up.legacy.renamedEvent('up:modal:closed', 'up:layer:dismissed');

  up.link.targetMacro('up-modal', {
    'up-layer': 'modal'
  }, function() {
    return up.legacy.deprecated('[up-modal]', '[up-layer=modal]');
  });

  up.link.targetMacro('up-drawer', {
    'up-layer': 'drawer'
  }, function() {
    return up.legacy.deprecated('[up-drawer]', '[up-layer=drawer]');
  });

}).call(this);
(function() {
  var e, u;

  u = up.util;

  e = up.element;

  up.popup = u.literal({
    attach: function(origin, options) {
      if (options == null) {
        options = {};
      }
      origin = up.fragment.get(origin);
      up.legacy.deprecated('up.popup.attach(origin, options)', "up.layer.open({ origin, layer: 'popup', ...options })");
      return up.layer.open(u.merge(options, {
        origin: origin,
        layer: 'popup'
      }));
    },
    close: function(options) {
      if (options == null) {
        options = {};
      }
      up.legacy.deprecated('up.popup.close()', 'up.layer.dismiss()');
      return up.layer.dismiss(null, options);
    },
    url: function() {
      up.legacy.deprecated('up.popup.url()', 'up.layer.location');
      return up.layer.location;
    },
    coveredUrl: function() {
      var ref;
      up.legacy.deprecated('up.popup.coveredUrl()', 'up.layer.parent.location');
      return (ref = up.layer.parent) != null ? ref.location : void 0;
    },
    get_config: function() {
      up.legacy.deprecated('up.popup.config', 'up.layer.config.popup');
      return up.layer.config.popup;
    },
    contains: function(element) {
      up.legacy.deprecated('up.popup.contains()', 'up.layer.contains()');
      return up.layer.contains(element);
    },
    isOpen: function() {
      up.legacy.deprecated('up.popup.isOpen()', 'up.layer.isOverlay()');
      return up.layer.isOverlay();
    },
    sync: function() {
      up.legacy.deprecated('up.popup.sync()', 'up.layer.sync()');
      return up.layer.sync();
    }
  });

  up.legacy.renamedEvent('up:popup:open', 'up:layer:open');

  up.legacy.renamedEvent('up:popup:opened', 'up:layer:opened');

  up.legacy.renamedEvent('up:popup:close', 'up:layer:dismiss');

  up.legacy.renamedEvent('up:popup:closed', 'up:layer:dismissed');

  up.link.targetMacro('up-popup', {
    'up-layer': 'popup'
  }, function() {
    return up.legacy.deprecated('[up-popup]', '[up-layer=popup]');
  });

}).call(this);

/***
Tooltips
========

Unpoly used to come with a basic tooltip implementation.
This feature is now deprecated.

@module up.tooltip
 */

(function() {
  up.tooltip = (function() {
    return up.macro('[up-tooltip]', function(opener) {
      up.legacy.warn('[up-tooltip] has been deprecated. A [title] was set instead.');
      return up.element.setMissingAttr(opener, 'title', opener.getAttribute('up-tooltip'));
    });
  })();

}).call(this);
(function() {


}).call(this);
