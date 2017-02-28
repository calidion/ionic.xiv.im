import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.user = navParams.get('user')
    // this.group = navParams.get('group')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
  }

}
