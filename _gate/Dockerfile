
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
ENV URL_USERS=http://localhost:12121 URL_PROFILES=http://localhost:12122 URL_FILMS=http://localhost:12123 URL_FILM_INFO=http://localhost:12124 URL_MEMBERS=http://localhost:12125

# commands to each container run
CMD [ "npm", "run", "start" ]
