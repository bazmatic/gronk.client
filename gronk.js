"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
// Extract the hostname from the command line arguments
const [hostname] = process.argv.slice(2);
if (!hostname) {
    console.log('Usage: node dist/gronk.js <hostname>');
    process.exit(1);
}
// Create a socket and connect to the server
const client = new net.Socket();
client.connect(6427, hostname, () => {
    console.log('Connected to server');
    // Send a message to the server
    client.write('Hello, server!');
});
// Listen for messages from the server
client.on('data', (data) => {
    console.log('Received:', data.toString());
    // Close the connection after receiving the message
    client.destroy();
});
client.on('close', () => {
    console.log('Connection closed');
});
