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

# Copy the self-signed certificate
COPY selfsigned.key /etc/ssl/private/selfsigned.key
COPY selfsigned.crt /etc/ssl/certs/selfsigned.crt

# Expose port 443 for HTTPS
EXPOSE 443
# Set environment variable to bind to 0.0.0.0
ENV HOST 0.0.0.0

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]