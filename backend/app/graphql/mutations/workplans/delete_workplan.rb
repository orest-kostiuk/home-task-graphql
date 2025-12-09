module Mutations
  module Workplans
    class DeleteWorkplan < BaseMutation
      argument :id, ID, required: true

      field :workplan, Types::WorkplanType, null: true

      def resolve(id:)
        workplan = Workplan.find_by(id: id)
        return { workplan: nil, errors: ['Workplan not found'] } unless workplan

        if workplan.destroy
          { workplan: workplan, errors: [] }
        else
          { workplan: nil, errors: workplan.errors.full_messages }
        end
      end
    end
  end
end
