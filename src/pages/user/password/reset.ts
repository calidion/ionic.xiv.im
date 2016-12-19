import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-password-reset',
  templateUrl: 'reset.html',
})

export class UserPasswordResetPage {
  user: JSON
  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.user = navParams.get('user') ;
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('Hello UserDetailsPage Page');
  }

  reset() {
    
  }
}
