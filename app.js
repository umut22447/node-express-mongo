const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

//IMPORT ROUTES
const postsRoutes = require('./routes/posts');

//Middlewares
app.use(cors());
app.use(express.json());
app.use('/posts', postsRoutes);

//ROUTES
app.get('/', (req, res) => {
    res.send('Alive');
})

//CONNECT DATABASE
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected');
    }
})

app.listen(process.env.PORT);