import { Injectable } from '@angular/core';
import { Http, Response, RequestMethod, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class ChatService {
  key = 'user'
  private url: string = 'http://forum.webfullstack.me'
  constructor(private http: Http) {

  }
  getUsers() {
    return JSON.parse(localStorage.getItem('users'));
  }
  recent() {

  }

  addUser(user) {
    var users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.key, JSON.stringify(user));
  }
}