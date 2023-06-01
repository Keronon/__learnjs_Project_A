
# other images
FROM node

# dir as container-root
WORKDIR /root

# cash-copied files from project to image
COPY package.json .

# instructions to compilling
RUN npm install

# other-copied files from project to image
COPY . .

# setting environment variables
ENV PG_HOST=pg AMQP_URL=amqp://rabbitmq

# commands to each container run
CMD [ "npm", "run", "start" ]
