class RenameTypeColumnToSocialServices < ActiveRecord::Migration[7.0]
  def change
    rename_column :social_services, :type, :service_type
  end
end
