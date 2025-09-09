FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./apps/api

# Set working directory to API
WORKDIR /app/apps/api

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
