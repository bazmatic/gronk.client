
import axios from "axios";
import { io, Socket } from "socket.io-client";

// Extract the hostname from the command line arguments
const [port] = process.argv.slice(2);
if (!port) {
  console.log('Usage: node dist/gronk.js <port>');
  process.exit(1);
}

// Create a socket and connect to the server
const socket = io("http://gronk.io:6427", {});
const socketId = socket.id;
// if (!socketId) {
//   console.log('Failed to connect to the server');
//   process.exit(1);
// }
socket.connect();
socket.on('connect', () => {
  console.log('Connected to the server');
  socket.on(socket.id ?? "", (signal: GronkSignal<GronkHttpRequest>) => {
    console.log("Received data to forward to local server:")
    console.log(signal.data.path);
    forwardRequestToServer(Number(port), signal);
  });
  socket.emit('session.create', { subdomain: "baz1"});
});

function forwardRequestToServer(port: number, signal: GronkSignal<GronkHttpRequest>) {
  console.log("Forwarding data to local server:");
  console.log(signal.data.path);

  const headers = signal.data.headers.reduce((acc: any, header: string) => {
    const [key, value] = header.split(': ');
    acc[key] = value;
    return acc;
  }, {} as any);

  axios.request({
    method: signal.data.method,
    url: `http://localhost:${port}${signal.data.path}`,
    headers,
    data: signal.data.body
  }).then((response: any) => {
    console.log("Received response from local server:");
    console.log(response);
    const gronkResponse = new GronkHttpResponse(
      response.status,
      response.headers,
      response.data
    );
    const responseSignal: GronkSignal<GronkHttpResponse> = new GronkSignal(
      signal.signalId,
      socketId ?? "",
      gronkResponse
    );
    socket.emit("signal.response", responseSignal);
  }).catch((error: any) => {
    console.error("Failed to forward request to server:");
    console.error(error);
  });
  

}


export class GronkHttpRequest {
  constructor(
      public method: string,
      public path: string,
      public headers: string[],
      public body: string
  ) {}
}

export class GronkHttpResponse {
  constructor(
      public statusCode: number,
      public headers: string[],
      public body: string
  ) {}
}

export class GronkSignal<T> {
  constructor(
      public signalId: string,
      public sessionId: string,
      public data: T
  ) {}
}