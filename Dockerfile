# Runtime stage
FROM node:20-alpine AS app

WORKDIR /app

# Copy built files from the builder stage
COPY ./package*.json /app
COPY ./dist /app/dist
RUN npm install --configuration=production

# Expose port 80
EXPOSE 3000

# Command to run nginx in the foreground
CMD ["npm", "start"]
