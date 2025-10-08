FROM node:20

WORKDIR /frontend

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Run the dev server
CMD ["npm", "run", "dev"]
