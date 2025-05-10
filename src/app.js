const express = require("express");

// const Router = require('./routes.js');
const Router = require("./routes/index.js")
const connectDB = require('./db/connect.js');
const path = require("path");
const cors = require("cors")
require("dotenv").config();
const sokcetIo = require("socket.io");
const { initSocket } = require('./helpers/socket/socket.js');
const app = express();
const PORT = process.env.PORT || 5000;
app.locals.basedir = path.join(__dirname, 'views');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views/public")))
app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cors());

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port : ${PORT}`);
    })

    initSocket(server);
    app.use(Router)

})
