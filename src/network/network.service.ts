import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket
} from '@nestjs/websockets';
import * as WebSocket from "ws";
import { Server, Socket } from 'socket.io';
import { io } from 'socket.io-client';
import { Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

const P2P_PORT = parseInt(process.env.P2P_PORT) || 5000;
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

@WebSocketGateway(P2P_PORT)
export class NetworkService implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect{

  private readonly logger:Logger = new Logger('NetworkService');

  @WebSocketServer()
  server: Server;

  private sockets: Array<any>;

  constructor(private eventEmitter: EventEmitter2) {
    this.sockets = [];
  }

  async afterInit(){
    this.logger.log(`Listening peer-to-peer connections on: ${P2P_PORT}`);
    this.connectToPeers();
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Peer disconnected: ${socket.id}`);
  }

  handleConnection(socket: Socket, ...args: any[]) {
    this.logger.log(`Peer connected: ${socket.id}`);
    this.handlePeerConnected(socket);
  }

  @OnEvent('chain.broadcast')
  handleChainBroadcast(payload: any) {
    this.logger.log(`Broadcasting chain to peers`);
    this.sockets.forEach(socket => socket.emit('chain', payload));
  }

  @OnEvent('transaction.broadcast')
  handleTransactionBroadcast(payload: any) {
    this.logger.log(`Broadcasting transaction to peers`);
    this.sockets.forEach(socket => socket.emit('transaction', payload));
  }

  connectToPeers():void {

    if(!PEERS.length){
      this.logger.warn('No peers found to connect!');
      return;
    }

    PEERS.forEach(peer => {
        const socket = io(peer);
        this.logger.log(`Connecting to peer ${peer}`);
        socket.on("connect", () => {
            this.logger.debug(`Connected to peer ${peer}`);
            this.handlePeerConnected(socket);
        });
    });

  }

  handlePeerConnected(socket:any){

    this.sockets.push(socket);

    this.eventEmitter.emit('chain.sync');

    socket.on('chain', chain => {
      this.logger.log(`The chain received from peer ${socket.id}`);
      console.log('chain', chain);
      this.eventEmitter.emit('chain.received', chain);
    });

    socket.on('transaction', transaction => {
      this.logger.log(`The transaction received from peer ${socket.id}`);
      console.log('transaction', transaction);
      this.eventEmitter.emit('transaction.received', transaction);
    });

  }

}
