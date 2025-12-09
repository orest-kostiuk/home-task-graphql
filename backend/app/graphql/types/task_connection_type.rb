module Types
  class TaskConnectionType < Types::BaseObject
    field :nodes, [ Types::TaskType ], null: false
    field :total_count, Integer, null: false
    field :has_next_page, Boolean, null: false
  end
end
