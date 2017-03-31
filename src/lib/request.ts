import { Http, Response, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export class Request {
  static socket
  messageCallbacks = []
  groupMessageCallbacks = []
  observable
  protected static url: string;
  protected static urlSocketIO: string;
  _get(url) {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(Request.url + url, options)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }
  _post(url, data) {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.post(Request.url + url, data, options)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }

  constructor(protected http: Http) {
    Request.initUrl();
    Request.initSocketIO();
    this.listenEvent('message', this.messageCallbacks);
    this.listenEvent('group-message', this.groupMessageCallbacks);
    // this.observable = Observable.fromEvent(Request.socket, 'message');
    // this.observable.subscribe((json) => {
    //   for (let i = 0; this.messageCallbacks.length > i; i++) {
    //     this.messageCallbacks[i](json);
    //   }
    // });
  }

  static setUrl(host, ssl = false) {
    switch (host) {
      case 'server.xiv.im':
        localStorage.setItem('url', 'https://' + host);
        localStorage.setItem('url-socket.io', 'wss://' + host);
        break;
      case 'forum.webfullstack.me':
      default:
        localStorage.setItem('url', 'https://' + host);
        localStorage.setItem('url-socket.io', 'wss://forim-pptm.rhcloud.com:8443');
        break;
    }
    Request.initUrl();
  }

  static initUrl() {
    Request.url = localStorage.getItem('url') || 'https://server.xiv.im';
    Request.urlSocketIO = localStorage.getItem('url-socket.io') || 'wss://server.xiv.im';
  }

  static initSocketIO() {
    if (!Request.socket) {
      Request.socket = io.connect(Request.urlSocketIO);
    }
  }

  listenEvent(event, callbacks) {
    var observable = Observable.fromEvent(Request.socket, event);
    observable.subscribe((json) => {
      for (let i = 0; callbacks.length > i; i++) {
        callbacks[i](json);
      }
    });
  }

  subscribeMessage(cb) {
    this.messageCallbacks.push(cb);
    this.messageCallbacks = this.uniqueArr(this.messageCallbacks);
  }

  uniqueArr(anArr) {
    return anArr.filter(function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    });
  }

  subscribeGroupMessage(cb) {
    this.groupMessageCallbacks.push(cb);
    this.groupMessageCallbacks = this.uniqueArr(this.groupMessageCallbacks);
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
}