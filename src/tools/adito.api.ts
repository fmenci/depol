import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Directive, EventEmitter, Injectable, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { IAuthCode } from './models/iauthcode';

@Directive()
@Injectable()
export class AditoAPIDirective {
  @Output() ev: EventEmitter<boolean> = new EventEmitter<boolean>();

  private urlz = [
    { key: 'status', url: 'api/Gate/Status' },
    { key: 'auth', url: 'api/Gate/Auth' },
    { key: 'off', url: 'api/Gate/AuthOff' },
  ];
  private statusconnected = false;
  private checkSubscribe: Subscription | undefined;
  private frmin = document.createElement('form');
  private frmout = document.createElement('form');

  constructor(
    private http: HttpClient
  ) {
    this.urlz.forEach(tm => {
      tm.url = environment.baseUrl + tm.url;
    });
  }

  public check() {
    if (this.checkSubscribe) {
      this.checkSubscribe.unsubscribe();
    }
    this.checkSubscribe = this.http.get(
      this.meurl('status'),
      { responseType: 'text' }
    ).subscribe(
      (result: string) => {
        if (result.length > 0) {
          this.setConnect(true);
        } else {
          this.setConnect(false);
        }
      }, (error: HttpErrorResponse) => this.handle401(error));
  }

  public genDevLogin(classname: string) {
    const menu = document.getElementsByClassName(classname)[0];
    if (menu) {
      this.frmin = this.formIn();
      menu.appendChild(this.frmin);
      this.frmout = this.formOut();
      menu.appendChild(this.frmout);
    } else {
      alert('could not create login menu');
    }
  }

  get isConnected(): boolean {
    return this.statusconnected;
  }

  private meurl(listname: string): string {
    const requrl = this.urlz.find(tm => tm.key === listname);
    if (requrl !== undefined) {
      return requrl.url;
    }
    return '';
  }

  private formIn(): HTMLFormElement {
    const frmin = document.createElement('form');
    const tema = document.createElement('input');
    tema.type = 'text';
    tema.name = 'email';
    tema.placeholder = 'email';
    frmin.appendChild(tema);
    const tpwd = document.createElement('input');
    tpwd.type = 'password';
    tpwd.name = 'password';
    tpwd.placeholder = 'password';
    frmin.appendChild(tpwd);
    const btnsign = document.createElement('button');
    btnsign.type = 'button';
    btnsign.classList.add('btn', 'btn-sm', 'btn-primary');
    const falink = document.createElement('i');
    falink.classList.add('fas', 'fa-link');
    btnsign.appendChild(falink);
    btnsign.addEventListener('click', () => {
      this.auth(frmin);
    });
    frmin.appendChild(btnsign);
    return frmin;
  }

  private formOut(): HTMLFormElement {
    const frmout = document.createElement('form');
    const bout = document.createElement('button');
    bout.type = 'button';
    bout.classList.add('btn', 'btn-sm', 'btn-dark');
    const faunlink = document.createElement('i');
    faunlink.classList.add('fas', 'fa-unlink');
    bout.appendChild(faunlink);
    frmout.appendChild(bout);
    bout.addEventListener('click', () => {
      this.off();
    });
    return frmout;
  }

  private auth(frmin: HTMLFormElement) {
    const emainp = frmin.elements[0] as HTMLInputElement;
    const pwdinp = frmin.elements[1] as HTMLInputElement;
    if ((emainp.value.length > 4) && (pwdinp.value.length > 4)) {
      if (this.checkSubscribe) {
        this.checkSubscribe.unsubscribe();
      }
      this.checkSubscribe = this.http.post<IAuthCode>(this.meurl('auth'),
        { email: emainp.value, password: pwdinp.value, rememberme: true },
        { responseType: 'json' }
      )
        .subscribe((result: IAuthCode) => {
          if (result?.auth === 'AuthAPIOK') {
            this.setConnect(true);
          } else {
            this.setConnect(false);
            alert(result?.auth);
          }
        }, (error: HttpErrorResponse) => this.handle401(error));
      pwdinp.value = '';
    }
  }

  private off() {
    if (this.checkSubscribe) {
      this.checkSubscribe.unsubscribe();
    }
    this.checkSubscribe = this.http.get(this.meurl('off'))
      .subscribe((result: any) => {
        this.setConnect(false);
      }, (error: HttpErrorResponse) => this.handle401(error));

  }

  private handle401(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.statusconnected = false;
      this.ev.emit(false);
      this.frmin.style.display = 'flex';
      this.frmout.style.display = 'none';
    } else {
      console.log('error status connected');
      console.error(error);
    }
    if (this.checkSubscribe !== undefined) {
      this.checkSubscribe.unsubscribe();
    }
  }

  private setConnect(reply: boolean): void {
    this.statusconnected = reply;
    this.ev.emit(reply);
    if (this.checkSubscribe !== undefined) {
      this.checkSubscribe.unsubscribe();
    }
    if (reply === true) {
      this.frmin.style.display = 'none';
      this.frmout.style.display = 'flex';
    } else {
      this.frmin.style.display = 'flex';
      this.frmout.style.display = 'none';
    }
  }

}
