import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GitHubService } from '../../lib/github'
import { UserService } from '../../lib/user'
import { ProgressService } from '../../lib/ui/progresses'
import { AlertService } from '../../lib/ui/alerts'


/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-search',
  templateUrl: 'search.html',
})

export class UserSearchPage {
  user: JSON
  timer: any
  private q
  private current
  private users
  public searched: Boolean = false
  public searching
  constructor(
    public progress: ProgressService,
    public navCtrl: NavController,
    navParams: NavParams,
    public githubService: GitHubService,
    public userService: UserService,
    public alertService: AlertService
  ) {
  }

  ionViewDidLoad() {
    console.log('Hello UserPage Page');
  }
  onUsers(users) {
    this.users = users.items;
    clearTimeout(this.timer);
    this.timer = null;
    this.progress.stop();
    this.searched = true;
    this.searching = true;
    if (this.q !== this.current) {
      this.searching = '正在搜索[' + this.q + ']';
      // this.progress.show('正在搜索[' + this.q + ']')
      this.user = null;
      this.search();
    }
  }

  startSearch() {
    this.timer = setTimeout((function () {
      this.searching = '正在搜索[' + this.q + ']';
      // this.progress.show('正在搜索[' + this.q + ']')
      this.user = null;
      this.search()
    }).bind(this), 5000);
  }

  search() {
    this.current = this.q;
    let observable = this.githubService.search(this.q);
    let self = this;
    observable.subscribe(function (json) {
      self.searching = "";
      self.onUsers(json);
    })
  }

  getItems(e) {
    this.q = e.target.value.trim();
    if (this.timer) {
      console.log('return');
      return;
    }
    this.startSearch();
  }
  invite() {
    this.progress.show('正在添加[' + this.q + ']为好友');
    var obs = this.userService.addFriend(this.q);
    obs.subscribe(this.onAddUser.bind(this));
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
    this.alertService.showAlert('通知', title);
    this.navCtrl.pop();
  }
}
