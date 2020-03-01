import { Injectable } from '@angular/core';

@Injectable()
export class DecryptTokenService {

  ca = localStorage.getItem('currentUser');
  base64Url = this.ca.split('.')[1];
  decodedValue = JSON.parse(window.atob(this.base64Url));
  userId = this.decodedValue.id;
  adminId = this.decodedValue.adminId;
  offer_id = this.decodedValue.offer_id;
  tests_available = this.decodedValue.tests_available;

  get userIdExporte(): any {
    return { userId: this.userId, userAdmin: this.adminId }
  }
}
