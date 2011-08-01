class Populate < Thor
  require 'progressbar'
  require 'ffaker'

  Fixnum.class_eval do
    def times_with_progress_bar(label = '', &block)
      progress = ProgressBar.new(label, self)
      def progress.title_width=(width)
        @title_width = width
        @format = "%-#{@title_width}s %3d%% %s %s"
      end
      progress.title_width = 25

      self.times do |i|
        block.call(i)
        progress.inc
      end
    end
  end

  Time.class_eval do
    def self.random(start_date = 3.years.ago, end_date = Time.now)
      Time.at((end_date.to_f - start_date.to_f) * rand + start_date.to_f)
    end
  end


  desc 'all', 'Populates all db tables with random data'
  method_option :truncate, :type => :boolean, :default => false, :desc => 'Delete record before populate'
  def all
    truncate = options[:truncate]

    invoke 'todos', :truncate => truncate
  end

  desc 'todos', 'Populates the database with random todos'
  method_option :number_of_todos, :type => :numeric, :default => 100, :descc => 'Number of todos to generate'
  method_option :truncate, :type => :boolean, :default => false, :desc => 'Delete all users before populate'
  def todos
    boot_rails!

    Todo.delete_all if options[:truncate]

    n = options[:number_of_todos]
    n.times_with_progress_bar('Generating todos') do |i|
      todo = Todo.new do |t|
        t.name = Faker::Name.name
        t.estimate = [0, 1, 2, 3, 5, 8, 13].sample
        t.done = [true, false].sample
        t.created_at = Time.random
      end
      todo.save
    end
  end

  private

  def boot_rails!
    require './config/environment'
  end

end

