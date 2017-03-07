import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GroupService } from '../../lib/group';

/*
  Generated class for the Members page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-members',
  templateUrl: 'members.html'
})
export class MembersPage {
  user
  group
  members
  page = 1
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public groupService: GroupService
  ) {
    this.user = navParams.get('user')
    this.group = navParams.get('group')
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
    this.members = data.members.results || data.members || [];
    console.log(this.members);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
  }

}
