import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js DNS resolution issues on Windows / local ISP with MongoDB Atlas SRV
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // In some environments, setServers might be restricted; ignore safely
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nguyenvanvinh290805_db_user:FhZeJiqgLhsGS8qZ@vinh.a5g35p9.mongodb.net/clothing_shop_modern?retryWrites=true&w=majority&appName=Vinh";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

