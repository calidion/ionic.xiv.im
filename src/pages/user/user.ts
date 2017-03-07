import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../lib/user'
import { Request } from '../../lib/request'
import { UserDetailsPage } from './details'
import { UserPasswordResetPage } from './password/reset';
import { AboutPage } from '../about/about';

/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {
  user: JSON
  server
  constructor(public navCtrl: NavController, navParams: NavParams, userService: UserService) {
    this.user = navParams.get('user')

    if (!this.user) {
      this.user = userService.get();
    }
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('Hello UserPage Page');
  }
  goToDetailsPage() {
    this.navCtrl.push(UserDetailsPage, {
      user: this.user
    });
  }
  goToPasswordPage() {
    this.navCtrl.push(UserPasswordResetPage, {
      user: this.user
    });
  }
  goToSettingsPage() {

  }

  goToAboutPage() {
    this.navCtrl.push(AboutPage);
  }
  onServerChange() {
    var ssl = false;
    switch (this.server) {
      case 'server.xiv.im':
        ssl = true;
        break;
    }
    Request.setUrl(this.server, ssl);
    location.reload();
  }
}
