# Imatge base
FROM node:20

# Crear directori de treball dins del contenidor
WORKDIR /app

# Copiar els fitxers de configuració
COPY package*.json ./

# Instal·lar les dependències
RUN npm install

# Copiar el codi de l'aplicació
COPY . .

# Exposar el port que fa servir l'app
EXPOSE 3000

# Comanda per iniciar l'app
CMD ["npm", "start"]
