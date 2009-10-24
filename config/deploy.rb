set :application, "openmultiverse"
set :domain, "openmultiverse.com"
set :user, "production"

default_run_options[:pty] = true

set :scm, :git
set :repository,  "git@github.com:gbelote/OpenMultiverse.git"

##ssh_options[:forward_agent] = true
##set :deploy_via, :remote_cache

set :rake, "/var/lib/gems/1.8/bin/rake"

set :runner, nil

# If you have previously been relying upon the code to start, stop 
# and restart your mongrel application, or if you rely on the database
# migration code, please uncomment the lines you require below

# If you are deploying a rails app you probably need these:

# load 'ext/rails-database-migrations.rb'
# load 'ext/rails-shared-directories.rb'

# There are also new utility libaries shipped with the core these 
# include the following, please see individual files for more
# documentation, or run `cap -vT` with the following lines commented
# out to see what they make available.

# load 'ext/spinner.rb'              # Designed for use with script/spin
# load 'ext/passenger-mod-rails.rb'  # Restart task for use with mod_rails
# load 'ext/web-disable-enable.rb'   # Gives you web:disable and web:enable

# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the :deploy_to variable:
# set :deploy_to, "/var/www/#{application}"

# If you aren't using Subversion to manage your source code, specify
# your SCM below:
# set :scm, :subversion
# see a full list by running "gem contents capistrano | grep 'scm/'"

role :web, "openmultiverse.com"
role :app, "openmultiverse.com"
role :db, "openmultiverse.com", :primary => true

namespace :deploy do
    desc "Restarting mod_rails with restart.txt"
    task :restart, :roles => :app, :except => { :no_release => true } do
        run "touch #{current_path}/tmp/restart.txt"
    end

    [:start, :stop].each do |t|
        desc "#{t} task is a no-op with mod_rails"
        task t, :roles => :app do ; end
    end
end

namespace :deploy do
    desc "Restart apache on server"
    task :apache_restart, :roles => :app do
        sudo "/etc/init.d/apache2 restart"
    end
end

namespace :apache do
  [:stop, :start, :restart, :reload].each do |action|
    desc "#{action.to_s.capitalize} Apache"
    task action, :roles => :web do
      invoke_command "/etc/init.d/apache2 #{action.to_s}", :via => run_method
    end
  end
end

