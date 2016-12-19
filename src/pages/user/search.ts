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
    this.users = users;
    clearTimeout(this.timer);
    this.timer = null;
    if (this.q !== this.current) {
      this.search(this.q);
    }
  }

  search(q) {
    console.log('inside search');
    console.log(this.userService);
    console.log(this.userService.search);
    this.userService.search(q).then(this.onUsers.bind(this));
  }

  getItems(e) {
    this.q = e.target.value;
    console.log(e);
    console.log(e.target.value);
    if (this.timer) {
      console.log('return');
      return;
    }
    this.current = this.q;
    this.search(this.q);

  }
}
