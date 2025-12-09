class Workplan < ApplicationRecord
  has_many :tasks, dependent: :destroy

  # Integer enums for DB efficiency
  enum :status, { not_started: 0, in_progress: 1, complete: 2 }
  enum :category, { engineering: 0, sales: 1, product: 2 }

  validates :name, presence: true

  scope :ordered, -> { order(created_at: :desc) }
end
