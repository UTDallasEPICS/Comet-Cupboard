# TODO
Add setup instruction

# Technologies Used
Node JS, Express JS, Typescript, Docker, Svelte

# Database
MONGODB

# First Time
Required: Docker, NodeJS 18
Recommended: VSCode, Postman, Mongo Compass, Redis Insight

## Install Node Dependencies
```
docker run --rm --mount type=bind,source=$PWD/ui,target=/app node:18 yarn --cwd /app
docker run --rm --mount type=bind,source=$PWD/api,target=/app node:18 yarn --cwd /app
```

# To Run
```
docker compose up
```
