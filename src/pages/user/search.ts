import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from './service'


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
  private json
  private userService
  constructor(public navCtrl: NavController, navParams: NavParams, userService: UserService) {
    this.user = navParams.get('user') || userService.get();
    console.log(this.user);
    this.userService = userService;
  }

  ionViewDidLoad() {
    console.log('Hello UserPage Page');
  }
  onUsers(users) {
    console.log('inside on Users');
    console.log(users);
    this.json = users;
    this.users = users.data.items;
    clearTimeout(this.timer);
    this.timer = null;
    console.log('inside search again');
    console.log(this.q, this.current);
    console.log(this.users);
    if (this.q !== this.current) {
      this.startSearch();
    }
  }

  startSearch() {
    this.timer = setTimeout((function () {
      this.search()
    }).bind(this), 1000);
  }

  search() {
    console.log('inside search');
    console.log(this.userService);
    console.log(this.userService.search);
    this.current = this.q;
    this.userService.search(this.q).then(this.onUsers.bind(this));
  }

  getItems(e) {
    this.q = e.target.value.trim();
    // console.log(e);
    console.log(e.target.value);
    if (this.timer) {
      console.log('return');
      return;
    }
    this.startSearch();
  }
}
