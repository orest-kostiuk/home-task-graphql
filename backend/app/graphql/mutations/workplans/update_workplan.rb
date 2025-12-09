module Mutations
  module Workplans
    class UpdateWorkplan < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :status, Types::StatusEnum, required: false
      argument :category, Types::CategoryEnum, required: false

      field :workplan, Types::WorkplanType, null: true

      def resolve(id:, **attributes)
        workplan = Workplan.find_by(id: id)
        return { workplan: nil, errors: [ "Workplan not found" ] } unless workplan

        if workplan.update(attributes.compact)
          { workplan: workplan, errors: [] }
        else
          { workplan: nil, errors: workplan.errors.full_messages }
        end
      end
    end
  end
end
