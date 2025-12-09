class CreateComments < ActiveRecord::Migration[8.0]
  def change
    create_table :comments do |t|
      t.text :body, null: false
      t.references :task, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end
  end
end
