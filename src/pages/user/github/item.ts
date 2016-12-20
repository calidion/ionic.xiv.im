import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../service'
import { UserDetailsPage } from '../details'


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
  constructor(public navCtrl: NavController, public userService: UserService) {
  }
  ngOnInit() {
    console.log(this.data);
    this.userService.getUser(this.data.login).then(this.onUser.bind(this));
  }
  onUser(user) {
    this.user = user;
    console.log(user);
  }
  addUser() {
    // this.navCtrl.push(UserAddPage, {
    //   user: this.user
    // });
  }

}
