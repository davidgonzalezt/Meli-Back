const express = require('express');
const cors = require('cors');

//create server
const app = express();

app.use(cors());

//app port
const PORT = process.env.PORT || 4000;

//import routes
app.use('/api/items', require('./routes'));

//initialize the app
app.listen(PORT, ()=>{
    console.log(`El servirdor esta corriendo en el puerto ${PORT}`)
});