import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()

export class AlertService {
  loading
  constructor(
    public alertCtrl: AlertController
  ) {

  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: '确定'
        }
      ]
    });
    alert.present();
    return alert;
  }

  showConfirm(title, message, ok) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确定',
          handler: ok
        }
      ]
    });
    confirm.present();
  }

  timed(title, message, time) {
    var alert = this.showAlert(title, message);
    setTimeout(function () {
      alert.dismiss()
    }, time);
  }
}