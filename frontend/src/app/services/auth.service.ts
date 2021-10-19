import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public islogged = new BehaviorSubject<boolean>(this.checkIslogin());
  public isInicio = new BehaviorSubject<boolean>(this.checkIsInicio());
  public userSubject = new BehaviorSubject<User>(this.getUsuario());


  getUsuario() {
    if (localStorage.getItem('usuario') !== null) {
      return JSON.parse(localStorage.getItem('usuario')!);
    } else {
      return null;
    }
  }


  checkIslogin() {
    if (localStorage.getItem('logged') !== null) {
      const log = localStorage.getItem('logged');
      return ((log === 'true' ? true : false));
    } else {
      return false;
    }
  }

  checkIsInicio() {
    if (sessionStorage.getItem('inicio') !== null) {
      const ini = sessionStorage.getItem('inicio');
      return ((ini === 'true' ? true : false));
    } else {
      return true;
    }
  }

  get getIslogged() {
    return this.islogged.asObservable();
  }

  get getIsInicio() {
    return this.isInicio.asObservable();
  }

  get getUserSubject() {
    return this.userSubject.asObservable();
  }

}
