module Types
  class TaskType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :status, Types::StatusEnum, null: false
    field :due_date, GraphQL::Types::ISO8601Date, null: false
    field :workplan_id, ID, null: false
    field :workplan, Types::WorkplanType, null: false
    field :comments, [ Types::CommentType ], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def workplan
      dataloader.with(Loaders::RecordLoader, Workplan).load(object.workplan_id)
    end

    def comments
      dataloader.with(Loaders::AssociationLoader, Task, :comments).load(object).then do |comment_records|
        comment_records.sort_by(&:created_at)
      end
    end
  end
end
