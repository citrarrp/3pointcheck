// import mongoose from "mongoose";

// export const connectDB = async () => {
// 	try {
// 		const conn = await mongoose.connect(' ://127.0.0.1:27017/MTM');
// 		const db = mongoose.connection;
// 		db.on('error', (error) => console.error(error));
// 		db.once("open", () => console.log('connect'));
// 		console.log(`MongoDB Connected: ${conn}`);
// 	} catch (error) {
// 		console.error(`Error: ${error.message}`);
// 		process.exit(1); 
// 	}
// };