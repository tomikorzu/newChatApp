primero que nada creamos la carpeta `backend`
luego entramos en la consola con `cd backend`
luego ponemos `npm init`, lo que creara un archivo json, se tendra que apretar enter hasta que se cree.
luego descargamos la dependencia `express`, poniendo `npm install express`.
ahi se tendra que haber cargado el package-lock.json y el node-modules.
luego ponemos `npm install express cors axios` para la apis
`npm install --save-dev nodemon` 
luego, en json. en la parte de scripts, sacamos lo de test..., y ponemos `start: "nodemon index.js"`
luego creamos la carpeta index.js
luego vamos al link `https://blog.chatengine.io/fullstack-chat/nodejs-reactjs` y copiamos esto:
`const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  return res.json({ username: username, secret: "sha256..." });
});

app.listen(3001);
`

para probar que ande todo, ponemos npm run start
y si pone `[nodemos] starting node index.js` anda bien.

luego creamos un archivo `request.rest`, e instalamos la extension de vs code, client rest.

done pondremos esto, `
POST http://localhost:3001/authenticate
Content-Type: application/json

{ "username": "tomas" }
`
y luego mandaremos send request, arrriba del codigo

luego ir al link https://chatengine.io/
iniciar sesion
crear proyecto
en project settings, API keys, copiar el id.

luego vamos a https://rest.chatengine.io, y copiamos el enlace `https://api.chatengine.io/users/`
el cual vamos a pegar en el script 

luego que terminemos con lo de backend, en la terminal hacemos cd .., y ponemos npm create vite@latest, si pide descargar algun paquete, hacelo. luego ponemos el nombre de la carpeta que queremos crear, seleccionamos el framework react, y javascript.
y ponemos cd frontend, `npm install`, para descargar todas las dependencias

luego vamos a la src folder, y vamos a main.jsx

