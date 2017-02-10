import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';
import { UserService } from './user';

@Injectable()

export class BreathService extends Request {
  user
  count = 0
  counts = {}
  friends = []
  listeners = [];
  constructor(protected http: Http,
    public userSerivce: UserService) {
    super(http);
  }
  addListener(obj) {
    this.listeners.filter(ele => {
      return ele != obj;
    });
    this.listeners.push(obj);
  }

  update(id = null) {
    var url = '/message/breath';
    if (id) {
      url = url + '?' + 'id=' + id;
    }
    return this._get(url);
  }
  notify() {
    var self = this;
    this.listeners.forEach(function (item) {
      item.count = self.count;
      item.counts = self.counts;
      item.friends = self.friends;
    });
  }

  breath(cb) {
    var updates = this.update();
    updates.subscribe(json => {
      console.log(json);
      if (json.code === 0) {
        this.count = json.data;
        cb && cb(json.data);
      }
    });
  }

  breathes(cb, friends = null) {
    if (this.count) {
      if (!friends) {
        var sub = this.userSerivce.getFriends();
        sub.subscribe(json => {
          if (json.code === 0) {
            this.friends = json.data;
            this.breathFriends(cb, this.friends);
          }
        })
      } else {
        this.breathFriends(cb, friends);

      }

    }
  }
  breathFriends(cb, friends = null) {
    var breathService = this;
    function breath(i) {
      if (!friends[i]) {
        cb && cb(friends, this.counts);
        return
      }
      var friend = friends[i].friend;
      var updates = breathService.update(friend.id);
      updates.subscribe(json => {
        if (json.code === 0) {
          this.counts[friend.id] = json.data;
        }
        if (i < friends.length) {
          breath.call(this, i + 1);
        }
      });
    }
    breath.call(this, 0);
  }

}