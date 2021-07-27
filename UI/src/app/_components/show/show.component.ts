import { Component, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/_services/socket.service';
import { CountdownComponent } from '../countdown/countdown.component';

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

  @ViewChild(CountdownComponent)
  public countdownComponent!: CountdownComponent;
  public countdownFinishTime = 0;
  public countdownAnimationActive = false;

  public transitionText = "";
  public transitionAnimationActive = false;

  private jingleAudio = new Audio("assets/Jingle AGM Stinger 8.wav");
  
  constructor(
    private router: Router,
    private zone: NgZone,
    public route: ActivatedRoute,
    public socketService: SocketService,
  ) {

    this.jingleAudio.volume = 0.5;

    this.socketService.socket.emit('registerConsumer');
    this.socketService.onAnimation.subscribe(({ template, data }) => {
      if (template == "lower-third-1") {
        this.title = data.title;
        this.subtitle = data.subtitle;
        this.startAnimation();
      }
      else if (template == "countdown") {
        this.countdownFinishTime = data.countdownFinishTime;
        if (data.countdownFinishTime == 0)
          this.countdownAnimationActive = false;
        else
          this.startCountdown();
      }
      else if (template == "transition") {
        this.transitionText = data.text;
        console.log("transition: ", this.transitionText);
        this.startTransition();
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

  startCountdown() {
    this.countdownAnimationActive = false;

    setTimeout(() => {
      this.zone.run(() => {
        this.countdownAnimationActive = true;
      });
    }, 10);
    setTimeout(() => {
      this.zone.run(() => {
        this.countdownComponent.countdownFinishTime = this.countdownFinishTime;
      });
    }, 50);
  }

  startTransition() {
    this.jingleAudio.pause();
    this.jingleAudio.currentTime = 0;

    this.transitionAnimationActive = false;
    setTimeout(() => {
      this.zone.run(() => {
        this.transitionAnimationActive = true;
      });
    }, 10);
    setTimeout(() => {
      this.zone.run(() => {
        this.jingleAudio.play();
      });
    }, 1000);
  }
}

