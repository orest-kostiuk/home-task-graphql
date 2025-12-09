module Mutations
  module Tasks
    class DeleteTask < BaseMutation
      argument :id, ID, required: true

      field :task, Types::TaskType, null: true

      def resolve(id:)
        task = Task.find_by(id: id)
        return { task: nil, errors: [ "Task not found" ] } unless task

        if task.destroy
          { task: task, errors: [] }
        else
          { task: nil, errors: task.errors.full_messages }
        end
      end
    end
  end
end
