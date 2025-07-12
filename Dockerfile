# Use the official Ruby 3.3 image as the base
FROM ruby:3.3

# Install build tools and Node.js (needed for Jekyll assets)
RUN apt-get update -qq && \
    apt-get install -y build-essential nodejs

# Set the working directory in the container
WORKDIR /srv/jekyll

COPY ./Gemfile* /srv/jekyll

# Install the Ruby gems specified in the Gemfile
RUN bundle install

# Copy the Jekyll site source files
COPY . /srv/jekyll

# Expose port 4000 for the Jekyll server
EXPOSE 4000

# Set the default command to run the Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
