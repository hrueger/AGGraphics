import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [

  ]
})
export class ShowComponent {
  public title = "";
  public subtitle = "";
  public playAnimation = false;
  
  constructor(
    private router: Router,
    private zone: NgZone,
    public route: ActivatedRoute,
    public socketService: SocketService,
  ) {
    this.socketService.socket.emit('registerConsumer');
    this.socketService.onAnimation.subscribe(({ template, data }) => {
      if (template == "lower-third-1") {
        this.title = data.title;
        this.subtitle = data.subtitle;
        this.startAnimation();
      }
    });
  }

  startAnimation() {
    this.playAnimation = false;
    setTimeout(() => {
      this.zone.run(() => {
        this.playAnimation = true;
      });
    }, 10);
  }
}

