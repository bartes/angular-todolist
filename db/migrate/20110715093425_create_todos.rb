class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.string :name, :null => false
      t.integer :estimate, :null => false, :default => 0
      t.boolean :done, :null => false, :default => false

      t.timestamps
    end
  end
end
