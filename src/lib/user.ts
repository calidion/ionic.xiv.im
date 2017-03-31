import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';

@Injectable()

export class UserService extends Request {
  user
  constructor(protected http: Http) {
    super(http);
  }

  profile() {
    return this._get('/user/profile');
  }

  get() {
    return this.user;
  }

  set(user) {
    this.user = user;
  }

  auth() {
    var url = Request.url + '/oauth/github/login';
    var authUrl = url + '?url=' + encodeURIComponent(location.href);
    window.location.href = authUrl;
  }

  addFriend(email) {
    return this._post('/friend/add', { email: email });
  }
  getFriends() {
    return this._get('/friend/list');
  }
  removeFriend(id) {
    return this._post('/friend/remove', { id: id });
  }
  logout() {
    return this._get('/user/logout');
  }
}