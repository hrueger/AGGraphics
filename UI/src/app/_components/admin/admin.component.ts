import { Component } from '@angular/core';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public title = "";
  public subtitle = "";

  public countdownFinishTime = (new Date(Date.now())).toString();

  constructor(private socketService: SocketService) { }

  public show() {
    this.socketService.socket.emit("show", {
      template: "lower-third-1",
      data: {
        title: this.title,
        subtitle: this.subtitle,
      },
    });
  }
  
  public showCountdown() {
    this.socketService.socket.emit("show", {
      template: "countdown",
      data: {
        countdownFinishTime: (new Date(this.countdownFinishTime)).getTime(),
      },
    });
  }
  public stopCountdown() {
    this.socketService.socket.emit("show", {
      template: "countdown",
      data: {
        countdownFinishTime: 0,
      },
    });
  }
}
