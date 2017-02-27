import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GroupService } from '../../lib/group';
import { AlertService } from '../../lib/ui/alerts'
import { ProgressService } from '../../lib/ui/progresses'


/*
  Generated class for the GroupInvite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-group-invite',
  templateUrl: 'group-invite.html'
})
export class GroupInvitePage {
  user
  group
  email = ''
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public progressService: ProgressService,
    public alertService: AlertService,
    public groupService: GroupService
  ) {
    this.user = navParams.get('user')
    this.group = navParams.get('group')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInvitePage');
  }

  getEmail($event) {
    console.log('inside on key press');
    console.log($event)

  }
  invite() {
    console.log('inside invite')
    console.log(this.group);
    console.log(this.email);
    var sub = this.groupService.invite(this.group.id, this.email);
    this.progressService.show('正在邀请群成员...');

    sub.subscribe(json => {
      this.progressService.stop();
      if (json.code === 0) {
        console.log(json.data);
        this.alertService.timed('成功！', '邀请成功!', 500);
      } else {
        this.alertService.timed('失败！', '邀请失败，请确保网络正常! 错误原因: ' + json.message, 500);
      }
    });
  }

  onInvited() {

  }

}
