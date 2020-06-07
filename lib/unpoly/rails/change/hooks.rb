module Unpoly
  module Rails
    class Change
      module Hooks

        def self.included(base)
          base.extend ClassMethods
        end

        delegate :after_action_hooks, to: :class

        def call_after_action_hooks
          after_action_hooks.each do |hook|
            instance_eval(&hook)
          end
        end

        module ClassMethods

          private

          def after_action_hooks
            @after_action_hooks ||= []
          end

          def after_action(&hook)
            after_action_hooks << hook
          end

        end
      end
    end
  end
end
