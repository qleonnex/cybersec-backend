import mongoose from 'mongoose';

export async function mgConnect(uri) {
	mongoose.connect(uri)
		.then(() => console.log("🛢️  MongoDB is connected!"));
}