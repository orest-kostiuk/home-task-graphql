module Mutations
  module Tasks
    class UpdateTask < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :status, Types::StatusEnum, required: false
      argument :due_date, GraphQL::Types::ISO8601Date, required: false

      field :task, Types::TaskType, null: true

      def resolve(id:, **attributes)
        task = Task.find_by(id: id)
        return { task: nil, errors: ['Task not found'] } unless task

        if task.update(attributes.compact)
          { task: task, errors: [] }
        else
          { task: nil, errors: task.errors.full_messages }
        end
      end
    end
  end
end
