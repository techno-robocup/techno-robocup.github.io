bundle config set path vendor
bundle config set bin vendor/bin
bundle config set  build.wdm -- --with-cflags=-Wno-implicit-function-declaration

bundle install

env JEKYLL_ENV=local ./vendor/bin/jekyll  s --host 0.0.0.0


