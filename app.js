const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
const db = require("./api/models");
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const SPResponse = require('./api/models/SP_Response')

// Connect to  mysql db 
if(process.env.NODE_ENV !== 'production') {
    db.sequelize.sync({ alter: true });
}


require('dotenv').config();

// App initialization
const app = express();
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

const server = http.createServer(app);

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Type, Accept, Content-Type, Authorization, orgid')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

// Routes
const authRoutes = require('./api/routes/authRoutes');
const stateRoutes = require('./api/routes/statesRoutes');
const kpisRoutes = require('./api/routes/kpisRoutes');
const questionnaireRoutes = require('./api/routes/surveyProtocolRoutes');
const spResponsesRoutes = require('./api/routes/spResponseRoutes');
const orgsRoutes = require('./api/routes/orgsRoutes');
const usersRoutes = require('./api/routes/usersRoutes');
const eLibraryRoutes = require('./api/routes/eLibraryRoutes');
const commentsRoutes = require('./api/routes/commentsRoutes');

/* App Routes */
app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/kpis', kpisRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/response', spResponsesRoutes);
app.use('/api/organisations', orgsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/libraries', eLibraryRoutes);
app.use('/api/comments', commentsRoutes);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

const io = socketio(server, {
    cors: {
      origin: '*',
    }
})

let users = []

io.on('connection', function(socket) {
    // const usersOnline = Object.keys(io.engine.clients);

    socket.on('new logged user', (data) => {
        const user = JSON.parse(data)
        if(!users.find(u => u.id === user.id)) {
            users.push({socketId: socket.id, ...user})
        }
        io.emit('users online', JSON.stringify(users));
    })
    
    socket.on('disconnect', function() {
        const newUserList = users.filter(user => user.socketId !== socket.id)
        users = newUserList
        io.emit('users online', JSON.stringify(newUserList));
    });
});

// Start the app
server.listen(process.env.PORT || 5000, function() {
    console.log("Server started on PORT: "+ 5000 || process.env.PORT)
})