
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'

  require 'jasmine-headless-webkit'

  Jasmine::Headless::Task.new('jasmine:headless') do |t|
    t.colors = true
    t.keep_on_error = true
  #  t.jasmine_config = 'this/is/the/path.yml'
  end
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end
