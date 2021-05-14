const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shashi:shashi@1728@cluster0.hdmtt.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on("error", err => {
    console.log("err===>>", err)
})
db.on("connected", (err, res) => {
    console.log("connection successfully stablish:")
})


//mongodb+srv://sugarbox:sugarbox@cluster0.8fevm.mongodb.net/sugarbox_assignment?retryWrites=true&w=majority