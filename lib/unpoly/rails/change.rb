module Unpoly
  module Rails
    ##
    # This object allows the server to inspect the current request
    # for Unpoly-related concerns such as "is this a page fragment update?".
    #
    # Available through the `#up` method in all controllers, helpers and views.
    class Change
      include Memoized
      include FieldDefinition
      include Hooks

      def initialize(controller)
        @controller = controller
      end

      ##
      # Returns whether the current request is an
      # [page fragment update](https://unpoly.com/up.replace) triggered by an
      # Unpoly frontend.
      def up?
        # This will eventually just check for the X-Up-Version header.
        # Just in case a user still has an older version of Unpoly running on the frontend,
        # we also check for the X-Up-Target header.
        version.present? || target.present?
      end

      alias_method :unpoly?, :up?

      field :version, Field::String

      ##
      # Returns the version of Unpoly running in the browser that made
      # the request.
      def version
        version_from_request
      end

      field :target, Field::String

      ##
      # Returns the CSS selector for a fragment that Unpoly will update in
      # case of a successful response (200 status code).
      #
      # The Unpoly frontend will expect an HTML response containing an element
      # that matches this selector.
      #
      # Server-side code is free to optimize its successful response by only returning HTML
      # that matches this selector.
      def target
        target_from_request
      end

      ##
      # Returns whether the given CSS selector is targeted by the current fragment
      # update in case of a successful response (200 status code).
      #
      # Note that the matching logic is very simplistic and does not actually know
      # how your page layout is structured. It will return `true` if
      # the tested selector and the requested CSS selector matches exactly, or if the
      # requested selector is `body` or `html`.
      #
      # Always returns `true` if the current request is not an Unpoly fragment update.
      def target?(tested_target)
        test_target(target, tested_target)
      end

      field :fail_target, Field::String

      ##
      # Returns the CSS selector for a fragment that Unpoly will update in
      # case of an failed response. Server errors or validation failures are
      # all examples for a failed response (non-200 status code).
      #
      # The Unpoly frontend will expect an HTML response containing an element
      # that matches this selector.
      #
      # Server-side code is free to optimize its response by only returning HTML
      # that matches this selector.
      #
      def fail_target
        fail_target_from_request
      end

      ##
      # Returns whether the given CSS selector is targeted by the current fragment
      # update in case of a failed response (non-200 status code).
      #
      # Note that the matching logic is very simplistic and does not actually know
      # how your page layout is structured. It will return `true` if
      # the tested selector and the requested CSS selector matches exactly, or if the
      # requested selector is `body` or `html`.
      #
      # Always returns `true` if the current request is not an Unpoly fragment update.
      def fail_target?(tested_target)
        test_target(fail_target, tested_target)
      end

      ##
      # Returns whether the given CSS selector is targeted by the current fragment
      # update for either a success or a failed response.
      #
      # Note that the matching logic is very simplistic and does not actually know
      # how your page layout is structured. It will return `true` if
      # the tested selector and the requested CSS selector matches exactly, or if the
      # requested selector is `body` or `html`.
      #
      # Always returns `true` if the current request is not an Unpoly fragment update.
      def any_target?(tested_target)
        target?(tested_target) || fail_target?(tested_target)
      end

      ##
      # Returns whether the current form submission should be
      # [validated](https://unpoly.com/input-up-validate) (and not be saved to the database).
      def validate?
        validate.present?
      end

      ##
      # If the current form submission is a [validation](https://unpoly.com/input-up-validate),
      # this returns the name attribute of the form field that has triggered
      # the validation.
      field :validate, Field::String

      def validate
        validate_from_request
      end

      alias :validate_name :validate

      field :mode, Field::String

      ##
      # TODO: Docs
      def mode
        mode_from_request
      end

      ##
      # TODO: Docs
      field :fail_mode, Field::String

      def fail_mode
        fail_mode_from_request
      end

      ##
      # TODO: Docs
      field :context, Field::Hash

      def context
        @context ||= context_from_request.deep_dup
      end

      after_action do
        # Don't compare with context_from_params since that might contain
        # a controller-side change before an earlier redirect.
        if context != context_from_request_headers
          write_context_to_response_headers
        end
      end

      field :fail_context, Field::Hash

      ##
      # TODO: DOcs
      def fail_context
        # The protocol currently allow users to change the fail_context.
        fail_context_from_request.freeze
      end

      # response_field :response_context, Field::Hash

      field :events, Field::Array

      def events
        # Events are outgoing only. They wouldn't be passed as a request header.
        # We might however pass them as params so they can survive a redirect.
        @events ||= events_from_params
      end

      after_action do
        # TODO: Build after_action hook
        write_events_to_response_headers
      end

      ##
      # TODO: Docs
      def emit(*args)
        event_plan = args.extract_options!

        # We support two call styles:
        # up.emit('event:type', prop: value)
        # up.emit(type: 'event:type', prop: value)
        if args[0].is_a?(String)
          event_plan[:type] = args[0]
        end

        # Track the given props in an array. If the method is called a second time,
        # we can re-set the X-Up-Events header with the first and second props hash.
        events.push(event_plan)
      end

      ##
      # Forces Unpoly to use the given string as the document title when processing
      # this response.
      #
      # This is useful when you skip rendering the `<head>` in an Unpoly request.
      def title=(new_title)
        # We don't make this a field since it belongs to *this* response
        # and should not survive a redirect.
        response.headers['X-Up-Title'] = new_title
      end

      def url_with_field_values(url)
        append_params_to_url(url, fields_as_params)
      end

      # Used by RequestEchoHeaders to prevent up[...] params from showing up
      # in a history URL.
      def request_url_without_up_params
        original_url = request.original_url

        if original_url =~ /\b_up(\[|%5B)/
          uri = URI.parse(original_url)

          # This parses the query as a flat list of key/value pairs, which
          # in this case is easier to work with than a nested hash.
          params = Rack::Utils.parse_query(uri.query)

          # We only used the up[...] params to transport headers, but we don't
          # want them to appear in a history URL.
          non_up_params = params.reject { |key, _value| key.starts_with?('_up[') }

          append_params_to_url(uri.path, non_up_params)
        else
          original_url
        end
      end

      memoize def layer
        Layer.new(self, mode: mode, context: context)
      end

      memoize def fail_layer
        Layer.new(self, mode: fail_mode, context: fail_context)
      end

      private

      attr_reader :controller

      delegate :request, :params, :response, to: :controller

      def test_target(frontend_target, tested_target)
        # We must test whether the frontend has passed us a target.
        # The user may have chosen to not reveal their target for better
        # cacheability (see up.proxy.config#requestMetaKeys).
        if up? && frontend_target.present?
          if frontend_target == tested_target
            true
          elsif frontend_target == 'html'
            true
          elsif frontend_target == 'body'
            not ['head', 'title', 'meta'].include?(tested_target)
          else
            false
          end
        else
          true
        end
      end

      def fields_as_params
        pairs = fields.map { |field|
          value = send(field.name)
          [field.param_name(full: true), field.stringify(value)]
        }
        params = pairs.to_h
        params = params.select { |_key, value| value.present? }
        params
      end

      def append_params_to_url(url, params)
        if params.blank?
          url
        else
          separator = url.include?('?') ? '&' : '?'
          [url, params.to_query].join(separator)
        end
      end

    end
  end
end
