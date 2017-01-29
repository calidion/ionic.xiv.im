import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()

export class ProgressService {
  loading
  constructor(
    public loadingCtrl: LoadingController
  ) {

  }
  show(message, reuse = false) {    
    if (this.loading) {
      if (reuse) {
        return;
      }
      this.loading.dismiss();
    }
    this.loading = this.loadingCtrl.create({
      content: message,
    });
    this.loading.present();
  }
  stop() {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = null;
  }
  timed(title, time) {
    time = time || 2000;
    this.stop();
    this.show(title);
    setTimeout(this.stop.bind(this), time);
  }
}