###**
@module up.viewport
###

up.legacy.renamedPackage 'layout', 'viewport'

up.legacy.renamedProperty(up.viewport.config, 'viewports', 'viewportSelectors')
up.legacy.renamedProperty(up.viewport.config, 'snap', 'revealSnap')

up.viewport.closest = (args...) ->
  up.legacy.deprecated('up.viewport.closest()', 'up.viewport.get()')
  return up.viewport.get(args...)
