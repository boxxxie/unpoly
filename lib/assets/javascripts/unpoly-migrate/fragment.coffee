###**
@module up.fragment
###

up.legacy.renamedPackage 'flow', 'fragment'
up.legacy.renamedPackage 'dom', 'fragment'

up.legacy.renamedProperty(up.fragment.config, 'fallbacks', 'mainTargets')

up.legacy.handleResponseDocOptions = (docOptions) ->
  up.legacy.fixKey(docOptions, 'html', 'document')

###
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
###
up.fragment.replace = (target, url, options) ->
  up.legacy.deprecated('up.replace(target, url)', 'up.navigate(target, { url })')
  return up.navigate(u.merge(options, { target, url }))

###**
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
###
up.fragment.extract = (target, document, options) ->
  up.legacy.deprecated('up.extract(target, document)', 'up.navigate(target, { document })')
  return up.navigate(u.merge(options, { target, document }))

up.first = (args...) ->
  up.legacy.deprecated('up.first()', 'up.fragment.get()')
  up.fragment.get(args...)

up.legacy.handleScrollOptions = (options) ->
  if u.isUndefined(options.scroll)
# Rewrite deprecated { reveal } option (it had multiple variants)
    if u.isString(options.reveal)
      up.legacy.deprecated("Option { reveal: '#{options.reveal}' }", "{ scroll: '#{options.reveal}' }")
      options.scroll = options.reveal
    else if options.reveal == true
      up.legacy.deprecated('Option { reveal: true }', "{ scroll: 'target' }")
      options.scroll = 'target'
    else if options.reveal == false
      up.legacy.deprecated('Option { reveal: false }', "{ scroll: false }")
      options.scroll = false

    # Rewrite deprecated { resetScroll } option
    if u.isDefined(options.resetScroll)
      up.legacy.deprecated('Option { resetScroll: true }', "{ scroll: 'top' }")
      options.scroll = 'top'

    # Rewrite deprecated { restoreScroll } option
    if u.isDefined(options.restoreScroll)
      up.legacy.deprecated('Option { restoreScroll: true }', "{ scroll: 'restore' }")
      options.scroll = 'restore'

up.legacy.handleRenderOptions = (options) ->
  if u.isString(options.history) && options.history != 'auto'
    up.legacy.warn("Passing a URL as { history } option is deprecated. Pass it as { location } instead.")
    options.location = options.history
    # Also the URL in { history } is truthy, keeping a value in there would also inherit to failOptions,
    # where it would be expanded to { failLocation }.
    options.history = 'auto'

  for prop in ['target', 'origin']
    if u.isJQuery(options[prop])
      up.legacy.warn('Passing a jQuery collection as { %s } is deprecated. Pass it as a native element instead.', prop)
      options[prop] = up.element.get(options[prop])
