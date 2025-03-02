# Use the official node image as a base
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve the built app
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000", "--host", "0.0.0.0"]