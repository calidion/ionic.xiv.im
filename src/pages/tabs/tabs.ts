import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { UserPage } from '../user/user';
import { UserService } from '../user/service'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  chat: any = HomePage;
  group: any = AboutPage;
  article: any = ContactPage;
  user: any = UserPage;

  constructor(us: UserService, navController: NavController, lc: LoadingController) {
    let loading = lc.create({
      content: '正在请求用户信息...'
    });
    loading.present();
    us.getProfile().then(function (data) {
      loading.dismiss();
      console.log(typeof data);
      if (data['code'] !== 0) {
        us.auth();
      }
      console.log(data);
    });
  }
}
