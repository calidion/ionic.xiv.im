import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { UserService } from '../../../lib/github'
import { GitHubService } from '../../../lib/github'
import { UserService } from '../../../lib/user'
import { ProgressService } from '../../../lib/ui/progresses'
import { AlertService } from '../../../lib/ui/alerts'



/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'user-item-github',
  templateUrl: 'item.html',
  inputs: ['data']
})

export class UserItemGitHubPage {
  user
  data
  loading
  constructor(
    public progress: ProgressService,
    public alert: AlertService,
    public navCtrl: NavController,
    public userService: UserService,
    public githubService: GitHubService) {
  }
  ngOnInit() {
    console.log(this.data);
    let observable = this.githubService.getUser(this.data.login);
    let self = this;
    observable.subscribe((json) => {
      console.log(json);
      self.user = json;
    });
  }
  onUser(user) {
    this.user = user;
    console.log(user);
  }

  onAddUser(json) {
    console.log(json);
    let title = json.message ? json.message : '未知错误';
    if (json.code === 0) {
      title = '你的好友请求已经发送，请等待确认！'
    }
    if (json.code === 'FriendExists') {
      title = '用户已经是你的好友！'
    }
    this.progress.stop();
    this.alert.showAlert('通知', title);
    this.navCtrl.pop();
  }
  addUser(user) {
    console.log('add user');
    console.log(user);
    if (user.email) {
      this.progress.show('正在添加[' + user.name + ']为好友');
      var obs = this.userService.addFriend(user.email);
      obs.subscribe(this.onAddUser.bind(this));
    } else {
      this.progress.show('当前用户没有邮件信息，无法邀请');
      setTimeout((function () {
        this.progress.stop();
      }).bind(this), 1000);
    }
  }
}
