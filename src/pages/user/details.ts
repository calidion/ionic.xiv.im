import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { UserService } from './service'

/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-details',
  templateUrl: 'details.html',

})

export class UserDetailsPage {
  user: JSON
  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.user = navParams.get('user');
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('Hello UserDetailsPage Page');
  }
}