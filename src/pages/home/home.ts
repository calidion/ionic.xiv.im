import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UserSearchPage } from '../user/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  gotoAddPage() {
    this.navCtrl.push(UserSearchPage);
  }
}
