import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GitHubService } from '../../lib/github'
import { ProgressService } from '../../lib/ui/progresses'


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
  constructor(public progress: ProgressService,
    public navCtrl: NavController,
    navParams: NavParams,
    public githubService: GitHubService
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
    if (this.q !== this.current) {
      this.progress.show('正在搜索[' + this.q + ']')
      this.search();
    }
  }

  startSearch() {
    this.timer = setTimeout((function () {
      this.progress.show('正在搜索[' + this.q + ']')
      this.search()
    }).bind(this), 2000);
  }

  search() {
    this.current = this.q;
    let observable = this.githubService.search(this.q);
    let self = this;
    observable.subscribe(function (json) {
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
}
