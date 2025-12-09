module Mutations
  module Comments
    class CreateComment < BaseMutation
      argument :body, String, required: true
      argument :task_id, ID, required: true

      field :comment, Types::CommentType, null: true

      def resolve(body:, task_id:)
        comment = Comment.new(body: body, task_id: task_id)

        if comment.save
          { comment: comment, errors: [] }
        else
          { comment: nil, errors: comment.errors.full_messages }
        end
      end
    end
  end
end
