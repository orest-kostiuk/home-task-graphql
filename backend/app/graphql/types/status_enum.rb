module Types
  class StatusEnum < Types::BaseEnum
    value "NOT_STARTED", value: "not_started"
    value "IN_PROGRESS", value: "in_progress"
    value "COMPLETE", value: "complete"
  end
end
