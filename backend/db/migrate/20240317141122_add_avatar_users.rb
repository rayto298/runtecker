class AddAvatarUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :avatar, :text
  end
end
