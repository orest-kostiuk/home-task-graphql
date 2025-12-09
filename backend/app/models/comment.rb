class Comment < ApplicationRecord
  belongs_to :task

  validates :body, presence: true

  scope :ordered, -> { order(created_at: :asc) }
end
