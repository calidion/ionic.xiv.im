import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { UserPage } from '../pages/user/user';
import { UserDetailsPage } from '../pages/user/details';
import { UserSearchPage } from '../pages/user/search';
import { UserPasswordResetPage } from '../pages/user/password/reset';

import { UserService } from '../pages/user/service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    UserPage,
    TabsPage,
    UserDetailsPage,
    UserPasswordResetPage,
    UserSearchPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    UserPage,
    TabsPage,
    UserDetailsPage,
    UserPasswordResetPage,
    UserSearchPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, UserService]
})
export class AppModule { }
