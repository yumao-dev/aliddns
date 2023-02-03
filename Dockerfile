
FROM node:12-alpine AS build
WORKDIR /app
COPY ./package*.json .
# COPY ./.npmrc .
RUN npm install
COPY . .
# RUN tsc
RUN npx tsc -p ./tsconfig.json

# This file is a template, and might need editing before it works on your project.
FROM node:12-alpine 

LABEL MAINTAINER "yumao"

ENV PORT=3000 \
    NODE_ENV=production
EXPOSE 3000

WORKDIR /usr/src/app
COPY ./package*.json .
# COPY ./.npmrc .
# COPY ./public ./public
RUN npm install --production
COPY --from=build /app/dist .

#CMD [ "npm", "start" ]
# ENTRYPOINT ["node"]
# CMD ["app.js"]
CMD [ "node", "app.js"]
