const mongoose = require("mongoose");
const dns = require("dns");

// Force IPv4 DNS resolution (fixes IPv6 connectivity issues with MongoDB Atlas)
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4
      tlsAllowInvalidCertificates: true, // Bypass SSL certificate verification issues
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;