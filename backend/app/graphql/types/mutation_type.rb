module Types
  class MutationType < Types::BaseObject
    field :create_workplan, mutation: Mutations::Workplans::CreateWorkplan
    field :update_workplan, mutation: Mutations::Workplans::UpdateWorkplan
    field :delete_workplan, mutation: Mutations::Workplans::DeleteWorkplan

    field :create_task, mutation: Mutations::Tasks::CreateTask
    field :update_task, mutation: Mutations::Tasks::UpdateTask
    field :delete_task, mutation: Mutations::Tasks::DeleteTask

    field :create_comment, mutation: Mutations::Comments::CreateComment
    field :update_comment, mutation: Mutations::Comments::UpdateComment
    field :delete_comment, mutation: Mutations::Comments::DeleteComment
  end
end
