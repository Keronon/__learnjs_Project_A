
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

# setting inside-port for container
EXPOSE 12123

# commands to each container run
CMD [ "npm", "run", "start" ]
