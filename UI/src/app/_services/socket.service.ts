import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;
  public version?: string;
  public connectedClients = 0;
  public onAnimation = new Subject<{template: string, data: any}>();

  constructor() {
    this.socket = io();
    this.socket.on("version", (version: string) => {
      this.version = version;
    });
    this.socket.on("connectedClients", (connectedClients: number) => {
      this.connectedClients = connectedClients;
    });
    this.socket.on("show", (template, data) => {
      this.onAnimation.next({template, data});
    });
  }
}
