class CreateSocialServices < ActiveRecord::Migration[7.0]
  def change
    create_table :social_services do |t|
      t.string :name
      t.string :type

      t.timestamps
    end
  end
end
