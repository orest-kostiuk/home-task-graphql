class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.integer :status, default: 0, null: false
      t.date :due_date, null: false
      t.references :workplan, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end

    add_index :tasks, :status
    add_index :tasks, :due_date
    add_index :tasks, [:workplan_id, :status]
  end
end
