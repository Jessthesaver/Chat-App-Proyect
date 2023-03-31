import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB Connection Successfull');
}).catch((err) => {
    console.log('error',err._message)
});
