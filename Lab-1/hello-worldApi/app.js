const express = require ('express');
const cors = require ('cors');
const path = require ('path');
const fs = require ('fs');

//initialize express app
const app = express ();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


const greetingRouter = require('./routes/greetings');
app.use('/api/greetings', greetingRouter);

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Sau tất cả các routes
app.use(notFoundHandler);   // bắt lỗi 404
app.use(errorHandler);      // xử lý mọi lỗi còn lại

const dataDir =path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    //create initial data .json if it doesn't exist
    if (!fs.existsSync(path.join(dataDir, 'data.json'))) {
        fs.writeFileSync(
            path.join(dataDir, 'data.json'),
            JSON.stringify([], null, 2),
            'utf8'
        );
    }
}

app.get('/', (req, res)=> {
    res.json({
        message: "welcome to the hello world API !", 
        version: '1.0.0',
        endpoints: {
            greetings: '/api/greetings',
            methods: ['GET','POST','PUT','DELETE']
        }
    });
});

//404 handler
app.use((req, res, next)=> {
    res.status(404).json({ error: 'route not found'});
});
//start server
app.listen(PORT, () =>{ 
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
});

module.exports = app;