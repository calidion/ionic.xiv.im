import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class UserService {
  private user: JSON
  private isLogin: boolean = false
  private url: string = 'https://forim.localtunnel.me'
  // private url: string = 'http://forum.webfullstack.me'
  constructor(private http: Http) {

  }
  getProfile() {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(this.url + '/user/profile', options)
      .toPromise()
      .then(this.onProfile.bind(this))
      .catch(this.onError);
  }
  onProfile(res: Response): JSON {
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
    // var url = 'http://forum.webfullstack.me/auth/github'
    var url = this.url + '/auth/github';
    var authUrl = url + '?url=' + encodeURIComponent(location.href);
    alert(authUrl);
    window.location.href = authUrl;
  }
}

export class User {
  constructor(
    public id: Date,
    public author: string,
    public text: string
  ) { }
}