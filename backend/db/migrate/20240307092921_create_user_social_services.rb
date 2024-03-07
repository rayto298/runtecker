class CreateUserSocialServices < ActiveRecord::Migration[7.0]
  def change
    create_table :user_social_services do |t|
      t.references :user, null: false, foreign_key: true
      t.references :social_service, null: false, foreign_key: true
      t.string :account_name

      t.timestamps
    end
  end
end
