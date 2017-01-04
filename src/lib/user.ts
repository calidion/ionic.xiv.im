import { Injectable } from '@angular/core';
import { Http, Response, RequestMethod, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class UserService {
  user
  private url: string = 'http://forum.webfullstack.me'
  constructor(private http: Http) {

  }

  _get(url) {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(this.url + url, options)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }
  _post(url, data) {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.post(this.url + url, data, options)
      .map((res: Response) => res.json())
      .catch(this.onError);
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

  onError(error: Response | any) {
    console.log('error ocurred');
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  auth() {
    var url = this.url + '/auth/github';
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