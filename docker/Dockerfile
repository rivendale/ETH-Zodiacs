# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:15-alpine as builder

# Set working app directory
WORKDIR /app

# Copy both package.json AND package-lock.json
COPY package*.json ./

# Install production dependencies
# RUN  npm set progress false && npm install --loglevel warn
RUN  npm set progress false && npm install --only=production --loglevel warn

COPY . .


# Buncdle app source
RUN npm run build


# nginx state for serving content
FROM nginx:1.19.0

# Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
# RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html 

# Copy nginx config
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]


# ENV NODE_ENV=production

# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 80

