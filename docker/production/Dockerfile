# Use the official Node.js 23 Alpine image as the builder
FROM node:25-alpine AS builder

# Set the working directory inside the container
WORKDIR /build

# Copy package.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js 23 Alpine image for the runner
FROM node:25-alpine AS runner

# Set environment variable to production
ENV NODE_ENV=test

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json from the builder stage
COPY --chown=node:node --from=builder /build/package.json ./

# Install production dependencies, handle bcrypt separately and install pm2
RUN npm install --ignore-scripts --omit=dev \
  && npm install pm2 -g \
  && pm2 update

# Copy the built application from the builder stage
COPY --chown=node:node --from=builder /build/dist/ .

# Change the owner of the working directory to the node user
USER node

# Expose port 5000
EXPOSE 5000

# Start the application with migration
CMD ["sh", "-c", "npm run migration:run && pm2-runtime ./src/index.js"]