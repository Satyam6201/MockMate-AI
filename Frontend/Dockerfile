FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite application
RUN npm run build

# Install 'serve' to run the application (handles SPA routing automatically)
RUN npm install -g serve

EXPOSE 3000

# Start the server on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]