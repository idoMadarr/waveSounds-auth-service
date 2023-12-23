FROM node:14.16.1

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

RUN npm run ts-build

ENV PORT=4000
ENV MONGO_URI=mongodb+srv://idoadar:239738416@cluster0.v9cyqlg.mongodb.net/auth
ENV JWT_KEY=my_secret_key
ENV REDIS_URI=redis://red-cm3e4cen7f5s73bnr0dg:6379

# WORKDIR ./src

EXPOSE 4000

VOLUME [ "/app/node_modules" ]

# CMD ["ls"]
CMD [ "npm", "start" ]
