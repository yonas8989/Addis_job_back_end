# Stage 1: Build the application
FROM node:22.14.0-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Create the production image
FROM node:22.14.0-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the .env file for environment variables
COPY .env ./

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["node", "./dist/index.js"]