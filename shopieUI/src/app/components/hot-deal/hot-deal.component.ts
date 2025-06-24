import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hot-deal',
  imports: [],
  templateUrl: './hot-deal.component.html',
  styleUrl: './hot-deal.component.scss'
})
export class HotDealComponent implements OnInit, OnDestroy {
  countdown = {
    days: 2,
    hours: 10,
    minutes: 34,
    seconds: 60
  };

  private interval: any;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countdown.seconds > 0) {
        this.countdown.seconds--;
      } else if (this.countdown.minutes > 0) {
        this.countdown.minutes--;
        this.countdown.seconds = 59;
      } else if (this.countdown.hours > 0) {
        this.countdown.hours--;
        this.countdown.minutes = 59;
        this.countdown.seconds = 59;
      } else if (this.countdown.days > 0) {
        this.countdown.days--;
        this.countdown.hours = 23;
        this.countdown.minutes = 59;
        this.countdown.seconds = 59;
      }
    }, 1000);
  }
}
