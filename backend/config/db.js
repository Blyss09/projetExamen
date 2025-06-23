import mongoose from "mongoose"; 


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);  
        console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1); // 1 = erreur, 0 = succès
    }
};