import mongoose from 'mongoose'

export const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_URL).then(() => {
        console.log('Connected to DB successfully');
    }).catch((error) => {
        console.log('Failed in connection to DB', error);
    })
}
