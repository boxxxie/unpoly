###**
@module up.network
###

up.legacy.renamedPackage('proxy', 'network')
up.legacy.renamedEvent('up:proxy:load',     'up:request:load')    # renamed in 1.0.0
up.legacy.renamedEvent('up:proxy:received', 'up:request:loaded')  # renamed in 0.50.0
up.legacy.renamedEvent('up:proxy:loaded',   'up:request:loaded')  # renamed in 1.0.0
up.legacy.renamedEvent('up:proxy:fatal',    'up:request:fatal')   # renamed in 1.0.0
up.legacy.renamedEvent('up:proxy:aborted',  'up:request:aborted') # renamed in 1.0.0
up.legacy.renamedEvent('up:proxy:slow',     'up:request:late')    # renamed in 1.0.0
up.legacy.renamedEvent('up:proxy:recover',  'up:network:recover') # renamed in 1.0.0

preloadDelayMoved = -> up.legacy.deprecated('up.proxy.config.preloadDelay', 'up.link.config.preloadDelay')
Object.defineProperty up.network.config, 'preloadDelay',
  get: ->
    preloadDelayMoved()
    return up.link.config.preloadDelay
  set: (value) ->
    preloadDelayMoved()
    up.link.config.preloadDelay = value

up.legacy.renamedProperty(up.network.config, 'maxRequests', 'concurrency')
up.legacy.renamedProperty(up.network.config, 'slowDelay', 'badResponseTime')

up.legacy.handleNetworkPreloadArgs = (args...) ->
  if u.isElementish(args[0])
    up.legacy.warn('up.proxy.preload(link) has been renamed to up.link.preload(link)')
    return up.link.preload(args...)

up.legacy.handleRequestOptions = (options) ->
  up.legacy.fixKey(options, 'data', 'params')

###**
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
###
up.ajax = (args...) ->
  up.legacy.deprecated('up.ajax()', 'up.request()')
  pickResponseText = (response) -> return response.text
  up.request(args...).then(pickResponseText)

up.proxy.clear = ->
  up.legacy.deprecated('up.proxy.clear()', 'up.cache.clear()')
  return up.cache.clear()

###**
@class up.Request
###

up.Request.prototype.navigate = ->
  up.legacy.deprecated('up.Request#navigate()', 'up.Request#loadPage()')
  @loadPage()

###**
@class up.Response
###

###**
Returns whether the server responded with a 2xx HTTP status.

@function up.Response#isSuccess
@return {boolean}
@deprecated
  Use `up.Response#ok` instead.
###
up.Response.prototype.isSuccess = ->
  up.legacy.deprecated('up.Response#isSuccess()', 'up.Response#ok')
  return @ok

###**
Returns whether the response was not [successful](/up.Response.prototype.ok).

@function up.Response#isError
@return {boolean}
@deprecated
  Use `!up.Response#ok` instead.
###
up.Response.prototype.isError = ->
  up.legacy.deprecated('up.Response#isError()', '!up.Response#ok')
  return !@ok
