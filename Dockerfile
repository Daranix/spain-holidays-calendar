# Runtime stage
FROM oven/bun:1-alpine AS app

WORKDIR /app

# Copy built files from the builder stage
COPY ./package*.json /app
COPY ./dist /app/dist
RUN bun install --configuration=production

# Expose port 80
EXPOSE 3000

# Command to run nginx in the foreground
CMD ["bun", "run", "start"]
