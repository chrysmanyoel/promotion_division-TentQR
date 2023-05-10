const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const app           = express();
const port          = 3001;
const ip            = '192.168.1.10';
// const {networkInterfaces} = require('os');
const admin         = require('./admin/admin_tenda');

app.use(cors());
app.use(bodyParser.json()); //for parsing application json
app.use(bodyParser.urlencoded({extended:true})); //for parsing application/x-www-form-urlencoded
//routing tenda
app.use('/tenda',admin);

app.get('/', (req,res) => {    
    let data = {
        data    : [],
        status  : 200,
        msg     : 'server is running'
    };

    res.status(data.status).send(data);
});

app.listen(port, ip, () => {    
    console.log(`Server is running at ${ip +':'+port}`);
})