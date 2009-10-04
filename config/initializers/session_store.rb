# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_openmultiverse_session',
  :secret      => '06dd5ed7e66676733ea9d08435418a403e4df59296eedf0f61ee36e6d1a945c20231f7db2b746af7b0230d6abbb4f4bb0e8da4f88740f47727d66d2cdc5c0256'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
