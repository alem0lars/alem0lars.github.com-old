require 'git'
require 'logger'


ROOT_PTH = Pathname.new File.dirname(__FILE__)
SOURCE_PTH = ROOT_PTH
DEPLOY_PTH = ROOT_PTH.join('deploy')


namespace :vcs do
  task :sync, [:commit_msg] do |t, args|
    g = Git.open(SOURCE_PTH, :log => Logger.new(STDOUT))
    g.add(:all=>true) rescue nil
    g.commit(args[:commit_msg])
    g.pull(g.remote('origin'), g.branch('source'))
    g.push(g.remote('origin'), g.branch('source'))
  end
end


task :deploy do
  g = Git.open(DEPLOY_PTH, :log => Logger.new(STDOUT))
  FileUtils.cd(DEPLOY_PTH) do
    g.add(:all => true)
    g.commit('Deploy')
  end
end


task :server do
  sh 'jekyll serve', :verbose => false
end

