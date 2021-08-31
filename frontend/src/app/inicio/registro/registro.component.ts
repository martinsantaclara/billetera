import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms'

import { compareValidator } from 'src/app/validations/compare-validator.directive';
import { passwordValidation } from 'src/app/validations/password-validations.directive';

import Aos from 'aos';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

   emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   telefPattern: any = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

  createFormGroup() {
    return new FormGroup ({
      nombre: new FormControl('',[Validators.required, Validators.minLength(5)]),
      email: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('',[Validators.required, Validators.minLength(8),passwordValidation()]),
      repitPassword: new FormControl('',[Validators.required, compareValidator('password')]),
    });
  }

  registroForm: FormGroup;
  public isError: Boolean;

  constructor(private render: Renderer2, private data: DataService, private router: Router, private notifyService: NotificacionService ) {
    this.registroForm = this.createFormGroup();
    this.isError = false;
   }

  ngOnInit(): void {

    const elment = document.getElementById('registro-wrap');
    const obj = elment?.getBoundingClientRect();
    const height = obj?.height!;

    const elment1 = document.getElementById('pageRegistro');
    const obj1 = elment1?.getBoundingClientRect();
    const height1 = obj1?.height!;

    Aos.init();

    // const imagenCarrusel = document.getElementsByClassName('claseImagenCarrusel');
    // const carrusel = document.getElementById('carousel');
    // this.render.addClass(carrusel,'dark');
    // for (var i = 0; i < imagenCarrusel.length; i++) {
    //   this.render.setStyle(imagenCarrusel[i],'height','100vh');
    // }
  }

  onRegister() {
    if (this.registroForm.valid) {
      const nombre = this.registroForm.get('nombre')!.value;
      const email = this.registroForm.get('email')!.value;
      const password = this.registroForm.get('password')!.value;
      const cvu = this.getCvu(10);
      let alias='';
      let palabras=[];
      this.data.getAlias().subscribe({
        next: response => {
          palabras = response.split(",");
          for (let i=0; i < palabras.length ; i++){
            palabras[i] = palabras[i].trim();
          }
          alias = this.obtieneAlias(palabras,3,1000);
          console.log(alias);
          this.data.registroCliente(nombre,email,password,cvu,alias,"Habilitado").subscribe({
            next: response => {
              console.log(response);
              if (response===200) {
                this.notifyService.showSuccess('El registro ha sido exitoso', 'Felicitaciones');
                setTimeout(()=> {
                  this.router.navigate(['login']);
                },5000);
              } else if(response>0){
                if (response===1) {
                  this.notifyService.showWarning('Ya existe un usuario registrado con ese Email', 'Atención');
                } else {
                  this.notifyService.showWarning('Ha ocurrido un imprevisto. Intente nuevamente', 'Atención');
                }
                setTimeout(()=> {
                  this.limpia();
                },5000);
              } else{
                this.notifyService.showError('Contáctese con el Administrador','Ha ocurrido un Error');
                setTimeout(()=> {
                  this.salir()
                  // this.router.navigate(['inicio']);
                },5000);
              }
            },
            error: error => {
              this.notifyService.showError('Contáctese con el Administrador','Ha ocurrido un Error');
              setTimeout(()=> {
                this.salir()
                // this.router.navigate(['inicio']);
              },5000);
              // alert('Ha ocurrido un error ' + error.message + ' Contáctese con el Administrador. Será redirigido a la página de Inicio');
              // this.router.navigate(['inicio']);
            }
          });
        },
        error: error => {
          this.notifyService.showError('No se ha podido generar el Alias. Contáctese con el Administrador','Ha ocurrido un Error');
          setTimeout(()=> {
            this.salir()
            // this.router.navigate(['inicio']);
          },5000);
        }
      });
    }
  }

  getCvu(max: number) {

    let cvu = Math.floor(Math.random() * max).toString();
    while (cvu === '0') {
      cvu = Math.floor(Math.random() * max).toString();
    }
    for (let i=0; i < 21; i++){
      cvu += Math.floor(Math.random() * max).toString()
    }
    return cvu;
  }

  obtieneAlias(palabras:string[], nroPalabras: number, max: number) {
    let indice; let alias='';
    for (let i=0; i < nroPalabras; i++) {
      indice = Math.floor(Math.random() * max);
      alias += (i===0 ? "" : ".") + palabras[indice];
    }
    return alias;
  }

  limpia() {
    this.isError = false;
    this.registroForm = new FormGroup ({
      nombre: new FormControl('',[Validators.required, Validators.minLength(5)]),
      email: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('',[Validators.required, Validators.minLength(8),passwordValidation()]),
      repitPassword: new FormControl('',[Validators.required, compareValidator('password')]),
    });
  }

  salir() {
    this.router.navigate(['inicio']);
  }

  agregaError() {
    const contact = document.getElementById('registro-wrap');
    const page = document.getElementById('pageRegistro');
    const imagenFondo = document.getElementById('imagenFondo');
    const obj = contact?.getBoundingClientRect();
    let heightContact = obj?.height! + 10;

    heightContact = (heightContact > 640 ? heightContact : 640);
    this.render.setStyle(page,'height',`${heightContact}px`);
    const heightImagen = heightContact + 125;
    this.render.setStyle(imagenFondo,'height',`${heightImagen}px`);

    const topFooter = heightImagen - 50;
    const footer = document.getElementById('footer');
    // this.render.setStyle(footer,'bottom','10px');
    this.render.setStyle(footer,'top',`${topFooter}px`);

    return true;
  }

  get nombre() { return this.registroForm.get('nombre'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  get repitPassword() { return this.registroForm.get('repitPassword'); }

}
