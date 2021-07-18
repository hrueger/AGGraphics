import { Component } from '@angular/core';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public socketService: SocketService) {}
}
