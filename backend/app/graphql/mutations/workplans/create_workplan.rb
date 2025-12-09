module Mutations
  module Workplans
    class CreateWorkplan < BaseMutation
      argument :name, String, required: true
      argument :status, Types::StatusEnum, required: false
      argument :category, Types::CategoryEnum, required: true

      field :workplan, Types::WorkplanType, null: true

      def resolve(name:, category:, status: nil)
        workplan = Workplan.new(name: name, category: category)
        workplan.status = status if status

        if workplan.save
          { workplan: workplan, errors: [] }
        else
          { workplan: nil, errors: workplan.errors.full_messages }
        end
      end
    end
  end
end
