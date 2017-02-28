import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../lib/user'
import { AboutPage } from '../about/about';
import { GroupInvitePage } from '../group-invite/group-invite';
import { MembersPage } from '../members/members';
import { GroupService } from '../../lib/group';


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
  page = 1
  members
  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    userService: UserService,
    public groupService: GroupService
  ) {
    this.user = navParams.get('user')
    this.group = navParams.get('group')

    if (!this.user) {
      this.user = userService.get();
    }
    console.log(this.user);
    var members = this.groupService.members(this.group, this.page++);
    members.subscribe(json => {
      if (json.code === 0) {
        this.onMembers(json.data);
      }
    });
  }
  onMembers(data) {
    console.log('get members');
    console.log(data);
    this.members = data.members.results;
    console.log(this.members);
  }

  ionViewDidLoad() {
    console.log('Hello UserPage Page');
  }

  goToMembers() {
    this.navCtrl.push(MembersPage, {
      user: this.user,
      group: this.group
    });
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
