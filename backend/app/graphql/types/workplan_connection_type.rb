module Types
  class WorkplanConnectionType < Types::BaseObject
    field :nodes, [ Types::WorkplanType ], null: false
    field :total_count, Integer, null: false
    field :has_next_page, Boolean, null: false
  end
end
