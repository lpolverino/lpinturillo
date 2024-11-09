import {io} from "socket.io-client"

const URL = process.env.NODE_ENV === "production" ? undefined :"ws://localhost:3000";
console.log(URL);


export const socket = io(URL)