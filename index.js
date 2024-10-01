const express = require("express");
const cors = require('cors');

const config = require('./utils/config');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const { connectToWS } = require("./utils/web-socket");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get("/", function (req, res) {
    res.send("Xioma test!!")
});

const PORT = config.port;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectToWS(server)

