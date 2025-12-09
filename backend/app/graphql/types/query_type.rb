module Types
  class QueryType < Types::BaseObject
    field :workplans, [ Types::WorkplanType ], null: false do
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
      argument :status, Types::StatusEnum, required: false
      argument :category, Types::CategoryEnum, required: false
    end
    field :workplans_connection, Types::WorkplanConnectionType, null: false, connection: false do
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
      argument :status, Types::StatusEnum, required: false
      argument :category, Types::CategoryEnum, required: false
    end
    field :workplan, Types::WorkplanType, null: true do
      argument :id, ID, required: true
    end

    field :tasks, [ Types::TaskType ], null: false do
      argument :workplan_id, ID, required: false
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
      argument :status, Types::StatusEnum, required: false
    end
    field :task, Types::TaskType, null: true do
      argument :id, ID, required: true
    end

    field :comments, [ Types::CommentType ], null: false do
      argument :task_id, ID, required: true
    end

    def workplans(limit: nil, offset: nil, status: nil, category: nil)
      scope = Workplan.ordered
      scope = scope.where(status: status) if status
      scope = scope.where(category: category) if category
      scope = scope.limit(limit) unless limit.nil?
      scope = scope.offset(offset) unless offset.nil?
      scope
    end

    def workplans_connection(limit: nil, offset: nil, status: nil, category: nil)
      scope = Workplan.ordered
      scope = scope.where(status: status) if status
      scope = scope.where(category: category) if category

      total = scope.count
      nodes = scope.limit(limit).offset(offset)

      {
        nodes: nodes,
        total_count: total,
        has_next_page: limit ? (total > (offset.to_i + nodes.size)) : false
      }
    end

    def workplan(id:)
      Workplan.find_by(id: id)
    end

    def tasks(workplan_id: nil, limit: nil, offset: nil, status: nil)
      scope = Task.ordered.includes(:comments, :workplan)
      scope = scope.where(workplan_id: workplan_id) if workplan_id
      scope = scope.where(status: status) if status
      scope = scope.limit(limit) unless limit.nil?
      scope = scope.offset(offset) unless offset.nil?
      scope
    end

    def task(id:)
      Task.find_by(id: id)
    end

    def comments(task_id:)
      Comment.where(task_id: task_id).ordered
    end
  end
end
