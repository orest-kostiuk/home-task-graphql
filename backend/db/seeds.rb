require 'faker'

Comment.destroy_all
Task.destroy_all
Workplan.destroy_all

statuses = %i[not_started in_progress complete]
categories = %i[engineering sales product]

workplans = Array.new(20) do
  Workplan.create!(
    name: "#{Faker::Company.bs.titleize} Plan",
    status: statuses.sample,
    category: categories.sample
  )
end

tasks = []
workplans.each do |wp|
  rand(3..6).times do
    tasks << Task.create!(
      workplan: wp,
      name: Faker::Job.position,
      status: statuses.sample,
      due_date: Faker::Date.forward(days: rand(5..60))
    )
  end
end

tasks.sample(25).each do |task|
  rand(0..3).times do
    Comment.create!(
      task: task,
      body: Faker::Hacker.say_something_smart
    )
  end
end

puts "Seeded #{Workplan.count} workplans, #{Task.count} tasks, #{Comment.count} comments"
