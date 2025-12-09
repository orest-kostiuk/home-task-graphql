module Mutations
  module Comments
    class DeleteComment < BaseMutation
      argument :id, ID, required: true

      field :comment, Types::CommentType, null: true

      def resolve(id:)
        comment = Comment.find_by(id: id)
        return { comment: nil, errors: ['Comment not found'] } unless comment

        if comment.destroy
          { comment: comment, errors: [] }
        else
          { comment: nil, errors: comment.errors.full_messages }
        end
      end
    end
  end
end
