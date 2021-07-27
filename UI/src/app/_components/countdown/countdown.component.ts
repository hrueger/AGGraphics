import { Component, NgZone, OnInit } from '@angular/core';
import MicrophoneStream from 'microphone-stream';
import { fromEvent, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
require("./particles.js");
var ParticlesConfig = require('./particles.json');

declare var particlesJS: any;

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  private readonly startDate = new Date(Date.now() + 15 * 60 * 1000); // Now + 15 Minutes
  private readonly volume = 0.8; // Bar height multiplier
  private updateBar = true;

  private countdownInterval?: number;
  public countdownText = "";
  public countdownFinishTime = 0;

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.mainSetup();
  }

  public clearCanvas(canvasContext : CanvasRenderingContext2D) { // Fill canvas with black transparency
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
  }

  public async mainSetup() {
    
    particlesJS('particles-js', ParticlesConfig); // Setup particles.js

    const canvas = document.getElementById("visualiserCanvas") as HTMLCanvasElement; // Get visualiser-canvas
    if (!canvas) {
      console.log("Could not find canvas in html!");
      return;
    }

    const cvContext = canvas.getContext("2d"); // Get visualiser-canvas-context
    if (!cvContext) {
      console.log("Could not get canvas context!");
      return;
    }

    const micStream = new MicrophoneStream(); // Setup Microphone input
    micStream.setStream(await navigator.mediaDevices.getUserMedia({ video: false, audio: true }));

    const analyser = micStream.context.createAnalyser(); // Setup frequency analyser
    micStream.audioInput.connect(analyser);
    analyser.fftSize = 128;
    const dataArray = new Float32Array(analyser.frequencyBinCount);

    const setCanvasSize = () => { // Resize visualizer-canvas to full screen size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    fromEvent(window, 'resize').pipe(debounce(() => timer(100)))
        .subscribe(() => setCanvasSize());

    const updateBar = () => {
      analyser.getFloatFrequencyData(dataArray);

      this.clearCanvas(cvContext);

      dataArray.forEach((val : number, i : number) => { // draw each frequency-bar

        const lineWidth = canvas.width / dataArray.length;
        const secondaryColorWidth = lineWidth * 0.3;
        const separationWidth = lineWidth / 10;
        const lineHeight = this.volume * (Math.exp(val/35)) * canvas.height;

        cvContext.fillStyle = "#013CB0";
        cvContext.fillRect(i * lineWidth + separationWidth, canvas.height - lineHeight, lineWidth - 2*separationWidth, lineHeight);
        cvContext.fillStyle = "#2A88CE";
        cvContext.fillRect((i+1) * lineWidth - separationWidth - secondaryColorWidth, canvas.height - lineHeight, secondaryColorWidth, lineHeight);
      });
      if (this.updateBar) {
        window.requestAnimationFrame(updateBar);
      }
    };
    updateBar();

    this.countdownInterval = setInterval(() => {
      this.zone.run(() => this.setCountDownText());
    }, 1000) as any as number;
  }


  private getCountdownSecondsText(remainingMs : number) : string {
    let seconds = Math.floor(remainingMs % 60000 / 1000);
    seconds = Math.max(seconds, 0);
    return (seconds < 10) ? ("0" + seconds) : (seconds.toString());
  }
  private getCountdownMinutesText(remainingMs : number) : string {
    let minutes = Math.floor(remainingMs / 60000);
    minutes = Math.max(minutes, 0);
    return minutes.toString();
  }

  public setCountDownText() : void {
    const remainingMs = this.countdownFinishTime - Date.now();
    this.countdownText = this.getCountdownMinutesText(remainingMs) + ":" + this.getCountdownSecondsText(remainingMs);
  }
  
  // Cleanup
  public ngOnDestroy() {
    this.updateBar = false;
    clearTimeout(this.countdownInterval);
  }

}
