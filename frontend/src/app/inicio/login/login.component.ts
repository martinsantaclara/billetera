import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Aos from 'aos';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

import * as CryptoJS from 'crypto-js';

import { NotificacionService } from 'src/app/services/notificacion.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  createFormGroup() {
    return new FormGroup ({
      email: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('',[Validators.required]),
      recuerdame: new FormControl(true)
    });
  }

  formulariologin :FormGroup;
  public isError: Boolean = false;

  constructor(private authService: AuthService, private router: Router, private data: DataService, private notifyService: NotificacionService) {
    this.formulariologin = this.createFormGroup();
   }

  ngOnInit(): void {
    Aos.init();
  }
  get email(){
    return this.formulariologin.get('email')
  }
  get password(){
    return this.formulariologin.get('password')
  }
  get recuerdame(){
    return this.formulariologin.get('recuerdame')
  }

  onLogin() {
    if (this.formulariologin.valid) {

      const email = this.formulariologin.get('email')!.value;
      const password = this.formulariologin.get('password')!.value;

      this.data.autenticacionCliente(email,password).subscribe({
        next: data => {

          let usuario: User = JSON.parse(data);
          console.log(usuario.NombreCliente);
          localStorage.setItem('usuario',data);
          this.authService.userSubject.next(usuario);
          localStorage.setItem('logged','true');
          this.authService.islogged.next(true);
          localStorage.removeItem('inicio');
          this.authService.isInicio.next(false);
          this.notifyService.showSuccess('El ingreso ha sido exitoso', 'Felicitaciones');
          setTimeout(()=> {
            this.router.navigate(['/dashboard']);
          },5000);

          // console.log(data);

          // if (data.length!==0) {
          //   const passEncrypt = CryptoJS.AES.decrypt(data[0].Password.trim(),'Billetera Virtual Chamigo').toString(CryptoJS.enc.Utf8);
          //   if (password === passEncrypt) {
          //
          //   } else {
          //     this.notifyService.showWarning('Las credenciales ingresadas no son válidas','Atención');
          //     this.isError = true;
          //   }

          // } else {
          //   this.notifyService.showWarning('No existe ningún usuario con esas credenciales','Atención');
          //   this.isError = true;
          // }
        },
        error: error => {

          // console.log(error.status);
          if (error.status==401){
            this.notifyService.showWarning('No existe ningún usuario registrado con esas credenciales','Atención');
          } else {
            this.notifyService.showError('Contáctese con el Administrador','Ha ocurrido un Error');
            setTimeout(()=> {
              this.router.navigate(['inicio']);
            },5000);
          }
          // alert('Ha ocurrido un error ' + error.message + ' Contáctese con el Administrador. Será redirigido a la página de Inicio');
          // this.router.navigate(['inicio']);
      }
      });
    }
  }

  reingresa() {
    this.isError = false;
    this.formulariologin = new FormGroup ({
      email: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('',[Validators.required]),
      recuerdame: new FormControl(true)
    });
  }

  salir() {
    this.router.navigate(['inicio']);
  }


}
