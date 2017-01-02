import { Injectable } from '@angular/core';
import { Http, Response, RequestMethod, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class UserService {
  private githubOptions = {
    client_id: '29f4e928b4d220d773d8',
    client_secret: '8694a890987ad26729edece51344ea3c1bf4ab8c'
  }
  private user
  private users
  private isLogin: boolean = false
  private url: string = 'http://forum.webfullstack.me'
  constructor(private http: Http) {

  }
  search(q) {
    let url = 'https://api.github.com/search/users?q=' + encodeURIComponent(q) + '&'
      + this.getOptions();
    return this.http.get(url)
      .toPromise()
      .then(this.onSearch.bind(this))
      .catch(this.onError);
  }

  onSearch(res) {
    var json = res.json();
    this.users = json;
    return json;
  }

  getOptions() {
    var data = [];
    for (var key in this.githubOptions) {
      data.push(key + '=' + this.githubOptions[key]);
    }
    return data.join('&');
  }

  getUser(username) {
    var url = 'https://api.github.com/users/' + encodeURIComponent(username) + '?'
      + this.getOptions();
    return this.http.get(url)
      .toPromise()
      .then(this.onUser.bind(this))
      .catch(this.onError);
  }
  onUser(res) {
    var json = res.json();
    return json;
  }
  getProfile() {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(this.url + '/user/profile', options)
      .toPromise()
      .then(this.onProfile.bind(this))
      .catch(this.onError);
  }
  onProfile(res: Response) {
    var json = res.json();
    if (json.code === 0) {
      this.user = json.data;
    }
    return json;
  }
  onError(error: Response | any) {
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
  isAuthenticated() {
    return this.isLogin;
  }
  auth() {
    var url = this.url + '/auth/github';
    var authUrl = url + '?url=' + encodeURIComponent(location.href);
    window.location.href = authUrl;
  }
  get() {
    return this.user;
  }

  addFriend(email) {
    let options = new RequestOptions({
      withCredentials: true
    });
    return this.http.post(this.url + '/friend/add', {
        email: email
      }, options)
      .toPromise()
      .catch(this.onError);
  }
}