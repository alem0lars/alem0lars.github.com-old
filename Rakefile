ROOT_PTH = Pathname.new File.dirname(__FILE__)
DEPLOY_PTH = ROOT_PTH.join('_site')
DEPLOY_PTH = ROOT_PTH.join('deploy')


namespace :vcs do
  task :sync, [:commit_msg] do |t, args|
    FileUtils.cd(ROOT_PTH) do
      sh 'git add -A', :verbose => false
      sh "git commit -m \"#{args[:commit_msg]}\"", :verbose => false
      sh 'git pull origin source', :verbose => false
      sh 'git push origin source', :verbose => false
    end
  end
end


task :build do
  FileUtils.cd(ROOT_PTH) do
    sh 'jekyll', :verbose => false
    FileUtils.cp_r(SITE_PTH.join('*'), DEPLOY_PTH)
  end
end


task :deploy => [:build] do
  FileUtils.cd(DEPLOY_PTH) do
    sh 'git add -A', :verbose => false
    sh 'git commit -m "Deploy"', :verbose => false
    sh 'git push origin source', :verbose => false
  end
end


task :server do
  FileUtils.cd(ROOT_PTH) do
    sh 'jekyll serve', :verbose => false
  end
end

