import { Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Aos from 'aos';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

import { compareValidator } from 'src/app/validations/compare-validator.directive';
import { passwordValidation } from 'src/app/validations/password-validations.directive';

import { NotificacionService } from 'src/app/services/notificacion.service';
import { User } from 'src/app/interfaces/user';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  createFormGroup(remember:boolean) {
    return new FormGroup ({
      email: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('',[Validators.required]),
      recuerdame: new FormControl(remember)
    });
  }

  createFormRecuperoEmail() {
    return new FormGroup ({
      emailRecupero: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)])
    });
  }

  createFormRecuperoPregunta() {
    return new FormGroup ({
      respuesta: new FormControl('',[Validators.required])
    });
  }

  createFormPassword() {
    return new FormGroup ({
      newPassword: new FormControl('',[Validators.required, Validators.minLength(8),passwordValidation()]),
      repitNewPassword: new FormControl('',[Validators.required, compareValidator('newPassword')]),
    });
  }

  formulariologin :FormGroup;

  formularioRecuperoEmail: FormGroup;
  formularioRecuperoPregunta: FormGroup;
  formularioPassword: FormGroup;

  public emailValido = false;
  public preguntaValida = false;

  public preguntaRecup = '';
  public respuestaRecup = '';
  public pregunta1 = '';
  public respuesta1 = '';
  public pregunta2 = '';
  public respuesta2 = '';
  public pregunta3 = '';
  public respuesta3 = '';

  public isError: Boolean = false;
  public cantidadRespuestasEquivocadas = 0;
  public numeroPregunta = 0;

  public idCliente = 0;

  constructor(private authService: AuthService, private router: Router, private data: DataService,
              private notifyService: NotificacionService, private render: Renderer2, private dialog: MatDialog) {
    const remember = (localStorage.getItem('recuerdame')!==null ? localStorage.getItem('recuerdame')==='true' : false);
    this.formulariologin = this.createFormGroup(remember);
    this.formularioRecuperoEmail = this.createFormRecuperoEmail();
    this.formularioRecuperoPregunta = this.createFormRecuperoPregunta();
    this.formularioPassword = this.createFormPassword();
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
  get emailRecupero(){
    return this.formularioRecuperoEmail.get('emailRecupero')
  }

  get respuesta(){
    return this.formularioRecuperoPregunta.get('respuesta')
  }

  get newPassword() {
    return this.formularioPassword.get('newPassword')
  }

  get repitNewPassword() {
    return this.formularioPassword.get('repitNewPassword')
  }

  onLogin() {
    if (this.formulariologin.valid) {

      const email = this.formulariologin.get('email')!.value;
      const password = this.formulariologin.get('password')!.value;
      const recuerdame = this.formulariologin.get('recuerdame')!.value;

      this.data.autenticacionCliente(email,password).subscribe({
        next: data => {

          console.log(data);

          localStorage.setItem('recuerdame',recuerdame);

          // webAPI -- IHttpActionResult
          let usuario: User = JSON.parse(data);
          localStorage.setItem('usuario',data);

          // Chamigo - API + Angular - JsonResult
          // let usuario: User = data;
          // localStorage.setItem('usuario',JSON.stringify(data));

          this.authService.userSubject.next(usuario);
          localStorage.setItem('logged','true');
          this.authService.islogged.next(true);
          sessionStorage.setItem('inicio','false');
          this.authService.isInicio.next(false);
          this.notifyService.showSuccess('El ingreso ha sido exitoso', 'Felicitaciones');
          setTimeout(()=> {
            // this.router.navigate(['/dashboard']);
            window.location.href = '/dashboard';
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
          if (error.status==401){
            this.notifyService.showWarning('No existe ningún usuario registrado con esas credenciales','Atención');
          } else {
            this.notifyService.showError(error.name + ' Contáctese con el Administrador','Ha ocurrido un Error');
            setTimeout(()=> {
              // this.router.navigate(['inicio']);
              window.location.href = 'inicio';

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

  modalRecupero(){

    this.formularioRecuperoEmail.get('emailRecupero')?.enable();
    this.formularioRecuperoPregunta.get('respuesta')?.enable;

    this.formularioRecuperoEmail = new FormGroup ({
      emailRecupero: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)])
    });
    this.formularioRecuperoPregunta = new FormGroup ({
      respuesta: new FormControl('',[Validators.required])
    });
    this.formularioPassword = new FormGroup ({
      newPassword: new FormControl('',[Validators.required, Validators.minLength(8),passwordValidation()]),
      repitNewPassword: new FormControl('',[Validators.required, compareValidator('newPassword')]),
    });
    this.emailValido = false;
    this.preguntaValida = false;
    this.cantidadRespuestasEquivocadas = 0;
  }

  onRecupero() {
    const email = this.formularioRecuperoEmail.get('emailRecupero')?.value;
    this.data.getClientesByEmail(email).subscribe({
      next: data => {
        if (data.length > 0) {
          this.idCliente = data[0].IdCliente;
          this.seleccionaPregunta(data);
          this.emailValido = true;
          this.formularioRecuperoEmail.get('emailRecupero')?.disable();
        } else {
          this.notifyService.showWarning('No existe ningún usuario registrado con ese email','Atención');
        }
      },
      error : error => {
        this.notifyService.showError(error.name + ' Contáctese con el Administrador','Ha ocurrido un Error');
        const modal = document.getElementById('ModalRecuperarContraseña');
        this.render.removeClass(modal,'show');
        const modalBackdrop = document.getElementsByClassName('modal-backdrop');
        for(var i=0; i < modalBackdrop.length; i++) {
          modalBackdrop[i].parentNode?.removeChild(modalBackdrop[i]);
        }
      }
    })

  }

  seleccionaPregunta(data: any){
    const pregunta = this.numeroPregunta;
    while (pregunta == this.numeroPregunta) {
      this.numeroPregunta = Math.floor(Math.random() * 3 + 1);
    }
    if (this.numeroPregunta==1) {
      this.preguntaRecup = data[0].Pregunta1;
      this.respuestaRecup = data[0].Respuesta1;
    } else {
      if (this.numeroPregunta==2) {
        this.preguntaRecup = data[0].Pregunta2;
        this.respuestaRecup = data[0].Respuesta2;
      } else {
        this.preguntaRecup = data[0].Pregunta3;
        this.respuestaRecup = data[0].Respuesta3;
      }
    }
    this.pregunta1 = data[0].Pregunta1;
    this.respuesta1 = data[0].Respuesta1;
    this.pregunta2 = data[0].Pregunta2;
    this.respuesta2 = data[0].Respuesta2;
    this.pregunta3 = data[0].Pregunta3;
    this.respuesta3 = data[0].Respuesta3;
    this.respuestaRecup = this.respuestaRecup.toUpperCase();
  }

  onPregunta() {
    const respuesta = this.formularioRecuperoPregunta.get('respuesta')?.value.toUpperCase();
    if (this.respuestaRecup.trim() == respuesta.trim()) {
      this.preguntaValida = true;
      this.formularioRecuperoPregunta.get('respuesta')?.disable();
    } else {
      this.cantidadRespuestasEquivocadas=this.cantidadRespuestasEquivocadas + 1;
      if (this.cantidadRespuestasEquivocadas==3){
        this.notifyService.showWarning('Tu respuesta no es correcta. Se cambiará la pregunta e intenta nuevamente!','Atención');
        const pregunta = this.numeroPregunta;
        while (pregunta == this.numeroPregunta) {
          this.numeroPregunta = Math.floor(Math.random() * 3 + 1);
        }
        if (this.numeroPregunta==1) {
          this.preguntaRecup = this.pregunta1;
          this.respuestaRecup = this.respuesta1;
        } else {
          if (this.numeroPregunta==2) {
            this.preguntaRecup = this.pregunta2;
            this.respuestaRecup = this.respuesta2;

          } else {
            this.preguntaRecup = this.pregunta3;
            this.respuestaRecup = this.respuesta3;
          }
        }
        this.respuestaRecup = this.respuestaRecup.toUpperCase();
        this.cantidadRespuestasEquivocadas=0;
      } else {
        this.notifyService.showWarning('Tu respuesta no es correcta. Intenta nuevamente!','Atención');
      }
    }
  }

  onNewPassword() {
    if (this.formularioPassword.valid) {
      const nuevaPassword = this.formularioPassword.get('newPassword')?.value;
      this.data.putPasswordCliente(this.idCliente, nuevaPassword).subscribe({
        next: data => {
          this.notifyService.showSuccess('Se ha generado la nueva contraseña con éxito', 'Felicitaciones');
        },
        error: error => {
          this.notifyService.showError(error.name + ' Contáctese con el Administrador','Ha ocurrido un Error');
        }
      })
    }
  }
}
