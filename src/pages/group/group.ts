import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { UserService } from '../../lib/user';


@Component({
  selector: 'page-group',
  templateUrl: 'group.html'
})
export class GroupPage {
  type
  user
  initialized
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
  ) {
    this.type = 'recent';
    this.initialized = true;
    this.user = this.userService.get();
  }

  onChange(e) {
    console.log(e);
    console.log(this.type);
    switch (this.type) {
      case 'recent':
        this.getRecent();
        break;
      default:
        this.getGroups();
    }
  }
  getRecent() {

  }
  getGroups() {

  }
}
