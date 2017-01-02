import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../service'
import { LoadingController } from 'ionic-angular';
import { Response } from '@angular/http';

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
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public userService: UserService) {
  }
  ngOnInit() {
    console.log(this.data);
    this.userService.getUser(this.data.login).then(this.onUser.bind(this));
  }
  onUser(user) {
    this.user = user;
    console.log(user);
  }
  showProgress(message) {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = this.loadingCtrl.create({
      content: message,
    });
    this.loading.present();
  }
  stopProgress() {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = null;
  }
  addUser(user) {
    if (user.email) {
      this.showProgress('正在添加【' + user.name + '好友');
      this.userService.addFriend(user.email).then(function (res: Response) {
        let data = res.json();
        if (data.code === 0) {

        }
      });

    }
  }

}
