# Use an official Node runtime as a parent image
FROM node:20.13.1

# Set the working directory in the container
WORKDIR /SneakyOwl_Docker/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN chmod +x ./node_modules/.bin/next

# Bundle app source inside the Docker image
COPY . .

# Build your Next.js app
RUN npm run build

# Start the Next.js app
CMD ["npm", "start"]