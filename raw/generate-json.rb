require 'json'

def generate_json(filename)
  rows = []
  File.readlines(filename).each do |line|
    items = []
    line.delete!("\n")
    a = line.split(',')
    a.each do |i|
      items << {:size => (1.0/a.length), :damage => i}
    end
    row = {:size => 800, :items => items}
    rows << row
  end
  res = {:room => filename, :size => 800, :rows => rows}
  puts JSON.pretty_generate(res)
end

generate_json(ARGV[0])
