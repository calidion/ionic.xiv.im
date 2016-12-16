import { Component } from '@angular/core';

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

  constructor(user: UserService) {
    user.getProfile().then(function (data) {
      console.log(typeof data);
      if (data['code'] !== 0) {
        user.auth();
      }
      console.log(data);
    });

  }
}
