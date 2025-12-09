module Types
  class WorkplanType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :status, Types::StatusEnum, null: false
    field :category, Types::CategoryEnum, null: false
    field :tasks_count, Integer, null: false
    field :tasks, [ Types::TaskType ], null: false do
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
      argument :status, Types::StatusEnum, required: false
    end
    field :tasks_connection, Types::TaskConnectionType, null: false, connection: false do
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
      argument :status, Types::StatusEnum, required: false
    end
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def tasks(limit: nil, offset: nil, status: nil)
      dataloader.with(Loaders::AssociationLoader, Workplan, :tasks).load(object).then do |task_records|
        records = task_records.sort_by(&:due_date)
        records = records.select { |t| t.status == status } if status
        records = records.drop(offset) if offset
        records = records.first(limit) if limit
        records
      end
    end

    def tasks_connection(limit: nil, offset: nil, status: nil)
      dataloader.with(Loaders::AssociationLoader, Workplan, :tasks).load(object).then do |task_records|
        records = task_records.sort_by(&:due_date)
        records = records.select { |t| t.status == status } if status
        total = records.size
        records = records.drop(offset) if offset
        nodes = limit ? records.first(limit) : records

        {
          nodes: nodes,
          total_count: total,
          has_next_page: limit ? (total > (offset.to_i + nodes.size)) : false
        }
      end
    end
  end
end
