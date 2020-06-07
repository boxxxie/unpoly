module Unpoly
  module Rails
    class Change
      module FieldDefinition

        def self.included(base)
          base.extend ClassMethods
        end

        delegate :fields, to: :class

        module ClassMethods
          def fields
            @fields ||= []
          end

          def field(name, type)
            field = type.new(name)

            fields << field

            define_method "#{name}_field" do
              field
            end

            define_method "#{name}_from_request_headers" do
              raw_value = request.headers[field.header_name]
              field.parse(raw_value)
            end

            # define_method "#{name}_from_response_headers" do
            #   raw_value = response.headers[field.header_name]
            #   field.parse(raw_value)
            # end

            define_method "#{name}_from_params" do
              raw_value = if up_params = params['_up']
                name = field.param_name
                up_params[name]
              end
              field.parse(raw_value)
            end

            define_method "write_#{name}_to_response_headers" do
              value = send(name)
              response.headers[field.header_name] = field.stringify(value)
            end
          end

        end
      end
    end
  end
end
