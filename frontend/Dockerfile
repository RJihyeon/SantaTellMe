# Use the official Node.js image as the base
FROM node:20

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install preact

# Copy the rest of the application
COPY . .

# Expose the port that Next.js uses
EXPOSE 3000

# Use build args in the environment
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "start"]
