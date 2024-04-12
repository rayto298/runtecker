class CreateUserSimilarities < ActiveRecord::Migration[7.0]
  def change
    create_table :user_similarities do |t|
      t.integer :user_id, null: false, foreign_key: true
      t.integer :target_user_id, null: false, foreign_key: true
      t.float :similarity

      t.timestamps
    end
  end
end
