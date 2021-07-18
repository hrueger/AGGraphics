import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showMenu = false;
  public hideNavbar: boolean = true;
  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe((url) => {
      if (window.location.toString().includes("live")) {
        this.hideNavbar = true;
      } else {
        this.hideNavbar = false;
      }
    })
  }
}
