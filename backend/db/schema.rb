# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_09_144307) do
  create_table "comments", force: :cascade do |t|
    t.text "body", null: false
    t.integer "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_comments_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name", null: false
    t.integer "status", default: 0, null: false
    t.date "due_date", null: false
    t.integer "workplan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["due_date"], name: "index_tasks_on_due_date"
    t.index ["status"], name: "index_tasks_on_status"
    t.index ["workplan_id", "status"], name: "index_tasks_on_workplan_id_and_status"
    t.index ["workplan_id"], name: "index_tasks_on_workplan_id"
  end

  create_table "workplans", force: :cascade do |t|
    t.string "name", null: false
    t.integer "status", default: 0, null: false
    t.integer "category", default: 0, null: false
    t.integer "tasks_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_workplans_on_category"
    t.index ["status"], name: "index_workplans_on_status"
  end

  add_foreign_key "comments", "tasks"
  add_foreign_key "tasks", "workplans"
end
