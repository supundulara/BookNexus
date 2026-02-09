# Choose the base image
FROM node:18-alpine

# Set working dir inside container
WORKDIR /app

# Copy dependencies files first
COPY package*.json ./

# Install dependancies
RUN npm install

# Copy of the rest of the code
COPY . .

RUN npm run build

# Expose the application PORT
EXPOSE 5000

# Command to start the app
CMD ["npm","start"]