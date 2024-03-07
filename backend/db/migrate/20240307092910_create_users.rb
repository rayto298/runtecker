class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :name
      t.string :nickname
      t.text :profile
      t.bigint :term_id
      t.string :github_account
      t.bigint :prefecture_id
      t.datetime :created_at
      t.datetime :updated_at

      t.timestamps
    end
    add_index :users, :term_id
    add_index :users, :prefecture_id
  end
end
