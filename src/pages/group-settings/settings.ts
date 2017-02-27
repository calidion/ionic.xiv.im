import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../lib/user'
import { AboutPage } from '../about/about';
import { GroupInvitePage } from '../group-invite/group-invite';

/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'group-settings',
  templateUrl: 'settings.html'
})

export class GroupSettingsPage {
  user: JSON
  group
  constructor(public navCtrl: NavController, navParams: NavParams, userService: UserService) {
    this.user = navParams.get('user')
    this.group = navParams.get('group')

    if (!this.user) {
      this.user = userService.get();
    }
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('Hello UserPage Page');
  }
  goToDetailsPage() {

  }
  goToPasswordPage() {

  }
  goToSettingsPage() {

  }

  goToAboutPage() {
    this.navCtrl.push(AboutPage);
  }
  goToInviteUser() {
    this.navCtrl.push(GroupInvitePage, {
      user: this.user,
      group: this.group
    });
  }
}
