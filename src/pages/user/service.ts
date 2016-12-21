import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';

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
  // private url: string = 'https://forim.localtunnel.me'
  private url: string = 'http://localhost:3000'
  // private url: string = 'http://forum.webfullstack.me'
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
    for(var key in this.githubOptions) {
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
    var temp = {
      "code": 0,
      "name": "Success",
      "message": "成功！",
      "data": {
        "email": "calidion@gmail.com",
        "avatar": "https://avatars.githubusercontent.com/u/131776?v=3",
        "githubId": "131776", "githubUsername": "calidion", "githubAccessToken": "7629d0611784ea717965095ae2b58cc874456141", "active": true, "accessToken": "75148479-bc07-4180-a545-89b222ec656a", "score": "0", "id": "58519da5ae008975122a554e", "username": "calidion", "password": "f7ff9068b94aea924a554eb1b8bcd27423dac6d0", "isBlocked": false, "threads": "0", "replies": "0", "followers": "0", "followees": "0", "favoriteTags": "0", "favoriteThreads": "0", "createdAt": "2016-12-14T19:29:41.097Z", "updatedAt": "2016-12-18T19:23:42.485Z"
      }
    };
    this.user = temp.data;
    return new Promise(function (resolve) {
      resolve(temp);
    });
    // let options = new RequestOptions({ withCredentials: true });
    // return this.http.get(this.url + '/user/profile', options)
    //   .toPromise()
    //   .then(this.onProfile.bind(this))
    //   .catch(this.onError);
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
    // var url = 'http://forum.webfullstack.me/auth/github'
    var url = this.url + '/auth/github';
    var authUrl = url + '?url=' + encodeURIComponent(location.href);
    alert(authUrl);
    window.location.href = authUrl;
  }
  get() {
    return this.user;
  }
}