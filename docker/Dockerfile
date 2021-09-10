
# set the base image
# n/b: for production, node is only used for building
# the static Html and javascript files
# as react creates static html and js files after build
# these are what will be served by nginx
# use alias build to be easier to refer this container elsewhere
# e.g inside nginx container

FROM node:15.11 as build-deps

# set working directory
# this is the working folder in the container
# from which the app will be running from

WORKDIR /usr/src/app

# Copy both package.json AND yarn.lock
COPY package.json yarn.lock ./

# Install production dependencies

RUN yarn

# Buncdle app source

COPY . ./

# Build Application
RUN yarn build

# set up production environment
# the base image for this is an alpine based nginx image

FROM nginx:1.21-alpine

ENV NODE_ENV=production

# copy the build folder from react to the root of nginx (www)

COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
# --------- because we are using react router ----------
# because we are using react router
# we need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# replace with custom one
COPY ./docker/nginx.conf /etc/nginx/conf.d

# --------- /because we are using react router ----------

# expose port 80 to the outer world
EXPOSE 80
# start nginx
CMD ["nginx", "-g", "daemon off;"]
