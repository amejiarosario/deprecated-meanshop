namespace :app do
  desc 'Install PM2'
  task :install do
    on roles :app do
      within release_path do
        execute :npm, 'install', '--silent', '--no-spin'
        execute :bower, 'install', '--config.interactive=false', '--silent'
        execute :npm, :update, 'grunt-contrib-imagemin'
        execute :grunt, 'build'
      end
    end
  end

  desc 'Run the apps'
  task :run do
    on roles :app do |host|
      execute :pm2, :kill
      template_path = File.expand_path('../templates/pm2.json.erb', __FILE__)
      host_config   = ERB.new(File.new(template_path).read).result(binding)
      config_path = "/tmp/pm2.json"
      upload! StringIO.new(host_config), config_path
      execute "IP=#{host.properties.private_ip}", "pm2", "start", config_path
    end
  end

  task default: [:install, :run]
end

