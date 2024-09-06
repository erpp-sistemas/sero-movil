import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket;
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private isConnected: boolean = false;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 3000;

  constructor(
  ) {
    this.connect();
  }

  connect(): void {
    this.socket = new WebSocket('wss://erpp.center/sero-web/ws');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server: ');
      console.log(JSON.parse(event.data));
      this.messageSubject.next(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      this.isConnected = false;
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };
  }

  reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnect attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
      setTimeout(() => {
        console.log('Trying to reconnect...');
        this.connect(); // Intentar reconectar
      }, this.reconnectInterval);
    } else {
      console.log("Maximum reconnection attempts reached. Giving up")
    }
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: string): void {
    this.socket.send(message);
  }


}
