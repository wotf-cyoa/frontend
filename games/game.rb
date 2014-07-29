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
    table_sit()
  elsif action == "3"
    puts "You leave the inn. It was a smelly place anyway. Suddenly, a shadow drifts across the ground at your feet. You look up as a loud roar hammers your ear drums."
    puts "A dragon eats you."
    game_over()
  else
    puts "Invalid option."
    start()
  end
end

def bar_sit
  puts "The bartender looks you up and down, his eyes lingering on your star-speckled hat."
  puts "He grunts 'What'll it be, then?'"
  puts "1. Order a pint of ale"
  puts "2. Order a glass of water"
  action = gets.chomp

  if action == "1"
    puts "You order a pint of ale"
    overhear_conversation()
  elsif action == "2"
    puts "You order a glass of water"
    overhear_conversation()
  else
    puts "Invalid option."
    bar_sit()
  end
end

def table_sit
  puts "A smiling waitress comes to your table. Her smiles fades a bit when she sees your star-speckled hat."
  puts "She asks 'What'll you have, then?"
  puts "1. Order a pint of ale"
  puts "2. Order a glass of water"
  action = gets.chomp
  
  if action == "1"
    puts "You order a pint of ale"
    overhear_conversation()
  elsif action == "2"
    puts "You order a glass of water"
    overhear_conversation()
  else
    puts "Invalid option."
    table_sit()
  end
end

def overhear_conversation
  puts "As you sit nursing your drink, a hushed conversation from a nearby table drifts into your ears. Two grimy men are whispering about the location of a magical ruby. Your magey sense is tingling. You decide to visit your cousin, who is staying at the inn. He will know about the ruby."
  puts "You walk up the stairs. You walk into your cousins room by spelling open the door. Inside on the desk by the window, sits a glorious cookie."
  puts "1. Click the cookie."
  action = gets.chomp
  
  if action == "1"
    puts "You click the cookie."
  else
    puts "Invalid option."
    overhear_conversation()
  end
end

def game_over
  puts "Game over. Type start() to start again"
end
