module Mutations
  module Tasks
    class CreateTask < BaseMutation
      argument :name, String, required: true
      argument :status, Types::StatusEnum, required: false
      argument :due_date, GraphQL::Types::ISO8601Date, required: true
      argument :workplan_id, ID, required: true

      field :task, Types::TaskType, null: true

      def resolve(name:, due_date:, workplan_id:, status: nil)
        task = Task.new(name: name, due_date: due_date, workplan_id: workplan_id)
        task.status = status if status

        if task.save
          { task: task, errors: [] }
        else
          { task: nil, errors: task.errors.full_messages }
        end
      end
    end
  end
end
