class CreatePastNicknames < ActiveRecord::Migration[7.0]
  def change
    create_table :past_nicknames do |t|
      t.references :user, null: false, foreign_key: true
      t.string :nickname
      t.datetime :changed_at

      t.timestamps
    end
  end
end
