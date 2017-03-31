import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../lib/user'
import { Request } from '../../lib/request'
import { UserDetailsPage } from './details'
import { UserPasswordResetPage } from './password/reset';
import { AboutPage } from '../about/about';
import { ProgressService } from '../../lib/ui/progresses'


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
  constructor(public navCtrl: NavController,
    public progress: ProgressService,
    navParams: NavParams,
    public userService: UserService) {
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
    Request.setUrl(this.server);
    location.reload();
  }

  logout() {
    this.progress.show('正在退出...');
    let observable = this.userService.logout();
    observable.subscribe(() => {
      this.progress.stop();
      location.reload();
    })
  }
}
