# Runtime stage
FROM node:22-alpine AS app

WORKDIR /app

# Change ownership of /app to node user
RUN chown -R node:node /app

# Environment to avoid npm update checks and other noise
ENV NODE_ENV=production

# Copy built files with correct ownership
COPY --chown=node:node ./package*.json /app/
COPY --chown=node:node ./dist /app/dist/

# Switch to non-root user
USER node

# Install production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
