######################################
# BUILD FOR LOCAL DEVELOPMENT
######################################

FROM node:20-alpine AS development

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /opt/market-guru-test/app

# Set NODE_ENV environment variable
ENV NODE_ENV development

# Create non-root user for Docker
RUN addgroup --system --gid 1001 postgres
RUN adduser --system --uid 1001 postgres

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=postgres:postgres package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=postgres:postgres . .

# Use the node user from the image (instead of the root user)
USER postgres

######################################
# BUILD FOR PRODUCTION
######################################

FROM node:20-alpine AS build

WORKDIR /opt/market-guru-test/app

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

# Set NODE_ENV environment variable
ENV NODE_ENV production

COPY --chown=postgres:postgres package*.json ./

# In order to run `npm run build` we need access to the Nest CLI 
# which is a dev dependency. In the previous development stage we 
# ran `npm ci` which installed all dependencies, so we can copy 
# over the node_modules directory from the development image
COPY --chown=postgres:postgres --from=development /opt/market-guru-test/app/node_modules ./node_modules

COPY --chown=postgres:postgres . .

# Run the build command which creates the production bundle
RUN npm run build

# Running `npm ci` removes the existing node_modules directory 
# and passing in --only=production ensures that only 
# the production dependencies are installed. 
# This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

USER postgres

######################################
# PRODUCTION
######################################

FROM node:20-alpine AS production

WORKDIR /opt/market-guru-test/app

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 postgres
RUN adduser --system --uid 1001 postgres

# Copy the bundled code from the build stage to the production image
COPY --chown=postgres:postgres --from=build /opt/market-guru-test/app/node_modules ./node_modules
COPY --chown=postgres:postgres --from=build /opt/market-guru-test/app/build ./build

# Set Docker as non-root user
USER postgres

# Start the server using the production build
CMD [ "npm run start:prod"]
