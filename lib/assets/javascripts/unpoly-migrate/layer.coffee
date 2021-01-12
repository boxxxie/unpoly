###**
@module up.layer
###

up.legacy.handleLayerOptions = (options) ->
  up.legacy.fixKey(options, 'flavor', 'mode')
  up.legacy.fixKey(options, 'closable', 'dismissable')
  up.legacy.fixKey(options, 'closeLabel', 'dismissLabel')

  if options.width || options.maxWidth
    up.legacy.warn('Layer options { width } and { maxWidth } have been removed. Use { size } or { class } instead.')

  if options.sticky
    up.legacy.warn('Layer option { sticky } has been removed. Give links an [up-peel=false] attribute to prevent layer dismissal on click.')

  if options.template
    up.legacy.warn('Layer option { template } has been removed. Use { class } or modify the layer HTML on up:layer:open.')

  if options.layer == 'page'
    up.legacy.warn('Layer "page" has been renamed to "root"')
    options.layer = 'root'

up.legacy.handleTetherOptions = (options) ->
  [position, align] = options.position.split('-')

  if align
    up.legacy.warn('The position value %o is deprecated. Use %o instead.', options.position, { position, align })
    options.position = position
    options.align = align

up.legacy.registerLayerCloser = (layer) ->
  # <a up-close>Close</a> (legacy close attribute)
  layer.registerClickCloser 'up-close', (value, closeOptions) =>
    up.legacy.deprecated('[up-close]', '[up-dismiss]')
    layer.dismiss(value, closeOptions)
