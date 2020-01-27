up.error = do ->

  u = up.util

  build = (message, props = {}) ->
    if u.isArray(message)
      message = u.sprintf(message...)
    error = new Error(message)
    u.assign(error, props)
    return error

  errorInterface = (name, init = build) ->
    fn = (args...) ->
      error = init(args...)
      error.name = name
      error

    fn.is = (error) ->
      return error.name == name

    fn.async = (args...) ->
      return Promise.reject(fn(args...))

    return fn

  failed = errorInterface('up.Failed')

  # Emulate the exception that aborted fetch() would throw
  aborted = errorInterface('AbortError', ->
    build('Aborted', aborted: true)
  )

  notImplemented = errorInterface('up.NotImplemented')

  notApplicable = errorInterface('up.NotApplicable', (change, reason) ->
    build("Cannot apply change: #{change} (#{reason}")
  )

  invalidSelector = errorInterface('up.InvalidSelector', (selector) ->
    build("Cannot parse selector: #{selector}")
  )

  {
    failed,
    aborted,
    invalidSelector,
    notApplicable,
    notImplemented,
  }