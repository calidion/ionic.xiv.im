import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/toPromise';

import { Request } from './request';

@Injectable()

export class UserService extends Request {
  user
  constructor(protected http: Http) {
    super(http);
  }

  // _get(url) {
  //   let options = new RequestOptions({ withCredentials: true });
  //   return this.http.get(this.url + url, options)
  //     .map((res: Response) => res.json())
  //     .catch(this.onError);
  // }
  // _post(url, data) {
  //   let options = new RequestOptions({ withCredentials: true });
  //   return this.http.post(this.url + url, data, options)
  //     .map((res: Response) => res.json())
  //     .catch(this.onError);
  // }

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
    var url = Request.url + '/auth/github';
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
}