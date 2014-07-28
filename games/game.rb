def start
  puts "Welcome to my inn! Grab a seat friend."
  puts "1. Take a seat at the bar"
  puts "2. Take a seat away from the crowd"
  puts "3. Leave the inn"
  action = gets.chomp

  if action == "1"
    puts "You sit down at the bar."
    bar_sit()
  elsif action == "2"
    puts "You sit down at an empty corner table."
  elsif action == "3"
    puts "You leave the inn. It smelled anyway."
  else
    puts "Invalid option."
    start()
  end
end

def bar_sit
  puts "The bartender looks you up and down."
  puts "He grunts 'What'll it be, then?"
  puts "1. Order a pint of ale"
  puts "2. Order a glass of water"
  action = gets.chomp

  if action == "1"
    puts "You order a pint of ale"
  elsif action == "2"
    puts "You order a glass of water"
  else
    puts "Invalid option."
    bar_sit()
  end
end
