class Task < ApplicationRecord
  belongs_to :workplan, counter_cache: true
  has_many :comments, dependent: :destroy

  enum :status, { not_started: 0, in_progress: 1, complete: 2 }

  validates :name, presence: true
  validates :due_date, presence: true

  scope :ordered, -> { order(due_date: :asc) }
end
