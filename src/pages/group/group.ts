import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { UserService } from '../../lib/user';
import { GroupService } from '../../lib/group';
import { ProgressService } from '../../lib/ui/progresses'


@Component({
  selector: 'page-group',
  templateUrl: 'group.html'
})
export class GroupPage {
  type
  user
  initialized
  groups
  selected
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public progressService: ProgressService,
    public groupService: GroupService
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
    console.log('inside get friends');
    if (!this.groups) {
      var observable = this.groupService.list();
      this.progressService.show('正在获取群组信息...');
      observable.subscribe(this.onGroup.bind(this));
    }
  }
  onGroup(json) {
    console.log(json);
    if (json.code === 0) {
      this.groups = json.data;
      console.log(json.data);
    }
    this.progressService.stop();
    this.selected = true;
  }
}
