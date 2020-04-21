import { Injectable } from '@angular/core';
import { ApiClientService, API_URI_ACCOUNT } from '../../api-client/api-client.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentMethod } from 'ngx-stripe/lib/interfaces/payment-intent';
import { CustomerAccount } from 'src/app/models/account.model';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { invoices, subscriptions } from 'stripe';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  /**
   *
   */
  accountId: number;
  /**
   *
   */
  private _account: BehaviorSubject<CustomerAccount> = new BehaviorSubject(null);
  public readonly account: Observable<CustomerAccount> = this._account.asObservable();
  /**
   *
   */
  private _paymentMethod: BehaviorSubject<PaymentMethod> = new BehaviorSubject(null);
  public readonly paymentMethod: Observable<PaymentMethod> = this._paymentMethod.asObservable();
  /**
   *
   */
  private _subscription: BehaviorSubject<subscriptions.ISubscription> = new BehaviorSubject(null);
  public readonly subscription: Observable<subscriptions.ISubscription> = this._subscription.asObservable();
  /**
   *
   */
  private _offer: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly offer: Observable<any> = this._offer.asObservable();
  /**
   *
   */
  private _invoices: BehaviorSubject<invoices.IInvoice[]> = new BehaviorSubject(null);
  public readonly invoices: Observable<invoices.IInvoice[]> = this._invoices.asObservable();
  /**
   *
   * @param httpService
   */
  constructor(
    private httpService: ApiClientService,
    private decryptTokenService: DecryptTokenService
  ) {
    this.accountId = this.decryptTokenService.decodedValue.customeraccount;
    this.loadAccount();
  }
  /**
   *
   */
  loadAccount() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}`)
      .subscribe(
        (acc) => this._account.next(acc),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadPaymentMethod() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/payments-methods`)
      .subscribe(
        (pm) => this._paymentMethod.next(pm),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadSubscription() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/subscriptions`)
      .subscribe(
        (sub) => this._subscription.next(sub),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadOffer() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/offers`)
      .subscribe(
        (off) => this._offer.next(off),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadInvoices() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/invoices`)
      .subscribe(
        (inv) => this._invoices.next(inv),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
}
