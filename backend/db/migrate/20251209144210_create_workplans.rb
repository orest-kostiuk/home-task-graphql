class CreateWorkplans < ActiveRecord::Migration[8.0]
  def change
    create_table :workplans do |t|
      t.string :name, null: false
      t.integer :status, default: 0, null: false
      t.integer :category, default: 0, null: false
      t.integer :tasks_count, default: 0, null: false

      t.timestamps
    end

    add_index :workplans, :status
    add_index :workplans, :category
  end
end
