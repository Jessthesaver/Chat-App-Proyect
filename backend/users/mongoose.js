import { connect } from "mongoose";

connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB Connection Successfull');
}).catch((err) => {
    console.log(err);
    console.log(err._message);
});