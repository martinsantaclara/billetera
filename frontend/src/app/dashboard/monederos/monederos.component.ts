import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-monederos',
  templateUrl: './monederos.component.html',
  styleUrls: ['./monederos.component.css']
})
export class MonederosComponent implements OnInit, OnDestroy {

  navigationSubscription;


  createFormGroup() {
    return new FormGroup ({
      monto: new FormControl('',[Validators.required,Validators.min(1000),Validators.max(1200)]),
      cripto: new FormControl('ETH',[Validators.required])
    });
  }

  formularioCripto :FormGroup;

  transaccion='';
  transaccion1='';
  transaccion2='';
  transaccion3='';
  unidadInicio='';
  unidadFin='';
  valorFin='0.00';
  opcion='';
  clickAceptar=false;
  monedero: string = '';
  logoCripto = '';
  nombreCripto='';
  saldoEnPesos='';
  saldoEnCripto='';
  unidadCripto='';
  cripto1='';
  cripto2='';
  cotizacion = [6515296.37,424363.77,175.43];
  indice = 0;
  maximo = 0.00;

  destinatarios: string[] = [''];
  cvus: string[] = [''];

  textoDefault = '';

  constructor(private render: Renderer2, private router: Router,
              private dialog: MatDialog, private route: ActivatedRoute) {
    this.formularioCripto = this.createFormGroup();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.inicializacion();
      }
    });

   }


   inicializacion() {
     this.monedero = this.route.snapshot.paramMap.get('op')!;
     this.transaccion1 = 'Comprar';
     this.transaccion2 = 'Vender';
     this.transaccion3 = 'Intercambiar';

     switch (this.monedero) {
      case 'pesos':
        this.logoCripto = '../../../assets/imagenes/logo_peso1.png';
        this.nombreCripto = 'Pesos';
        this.saldoEnPesos = '1200,00';
        this.transaccion1 = 'Ingresar';
        this.transaccion2 = 'Transferir';
        this.transaccion3 = '';
        this.maximo = 1200;
        this.textoDefault = 'Seleccione un CVU...';
        this.cvus = ['00005689741236987', '00005689741236988', '00005689741236989'];
        break;
      case 'bitcoin':
        this.logoCripto = '../../../assets/imagenes/logo_bitcoin.png';
        this.nombreCripto = 'Bitcoin';
        this.saldoEnPesos = '1000,00';
        this.saldoEnCripto = '0,000153';
        this.unidadCripto = 'BTC'
        this.cripto1 = 'ETH';
        this.cripto2 = 'USDC';
        this.indice = 0;
        this.maximo = 0.000153;
        break;

      case 'ethereum':
        this.logoCripto = '../../../assets/imagenes/logo_ethereum.png';
        this.nombreCripto = 'Ethereum';
        this.saldoEnPesos = '800,00';
        this.saldoEnCripto = '0,001885';
        this.unidadCripto = 'ETH';
        this.cripto1 = 'BTC';
        this.cripto2 = 'USDC';
        this.indice = 1;
        this.maximo = 0.001885;
        break;

      case 'usdc':
      this.logoCripto = '../../../assets/imagenes/logo_usdc.png';
        this.nombreCripto = 'USD Coin';
        this.saldoEnPesos = '400,00';
        this.saldoEnCripto = '2,280112';
        this.unidadCripto = 'USDC';
        this.cripto1 = 'BTC';
        this.cripto2 = 'ETH';
        this.indice = 2;
        this.maximo = 2.280112;
        break;

      default:
    }

    this.transaccion='';
    this.valorFin='0.00';
    this.formularioCripto = new FormGroup({
    monto: new FormControl('',[Validators.required])
    });

   }

  ngOnInit(): void {

  }

  transaction(opcion:string) {
    this.transaccion = opcion;

    switch (this.transaccion) {
      case 'Comprar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.min(1000),Validators.max(1200)])
        });
        break;
      case 'Vender':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(this.maximo)])
        });
        break;
      case 'Intercambiar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(this.maximo)]),
          cripto: new FormControl(this.cripto1,[Validators.required])
        });
        break;
      case 'Ingresar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.min(100),Validators.max(50000)])
        });
        break;
      case 'Transferir':
        this.textoDefault = 'Seleccione un CVU...';
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(this.maximo)]),
          beneficiario: new FormControl('Seleccione un CVU...',[Validators.required])
        });
        break;

    }
    this.valorFin = '0.00';
  }


  volver() {

    const selector = `.${this.monedero}`


    const claseSelected = document.querySelector(selector);
    this.render.removeStyle(claseSelected,'background-color');

    const contenedorSlider = document.querySelector('.contenedorSlider');
    this.render.setStyle(contenedorSlider,'visibility','visible');
    this.router.navigate(['/dashboard']);
  }

  calculoCripto(transaccion: string, monto: number) {
    if (transaccion==='Comprar') {
      let valor:number = monto/this.cotizacion[this.indice];
      this.valorFin = Number.parseFloat(valor.toString()).toFixed(6);
    } else {
      if (transaccion==='Vender'){
        let valor:number = monto * this.cotizacion[this.indice];
        this.valorFin = Number.parseFloat(valor.toString()).toFixed(2);
      }
    }
  }

  calculoIntercambio(monto: number, criptoSelect: string) {
    let indiceDestino;
    if (criptoSelect === 'BTC') {
      indiceDestino = 0;
    } else {
      if (criptoSelect === 'ETH') {
        indiceDestino = 1;
      } else {
        indiceDestino = 2;
      }
    }

    let valor:number = monto * (this.cotizacion[this.indice] / this.cotizacion[indiceDestino]);
    this.valorFin = Number.parseFloat(valor.toString()).toFixed(6);

  }

  get monto(){
    return this.formularioCripto.get('monto')
  }

  get cripto(){
    return this.formularioCripto.get('cripto')
  }

  openDialog(btn: string) {
    let mensaje: string = '';
    mensaje = '¿' + ( btn==='btnAceptar' ? 'Acepta ' : 'Cancela ') + 'la transacción?';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width:'350px', data: mensaje
    });
    dialogRef.afterClosed().subscribe(si => {
      // console.log(res);
      if (si && btn==='btnAceptar'){
        if (this.transaccion==='Comprar'){
          console.log('acepta compra');
        } else {
          if (this.transaccion==='Vender'){
            console.log('acepta venta');
          } else {
            console.log('acepta intercambio');
          }
        }
        this.transaccion='';
        this.valorFin='0.00';
        this.formularioCripto = new FormGroup({
        monto: new FormControl('',[Validators.required])
        });
      } else {
        if (si) {
          this.transaccion='';
          this.valorFin='0.00';
          this.formularioCripto = new FormGroup({
          monto: new FormControl('',[Validators.required])
        });
        }
      }
    });
  }

  radio(destino: string) {
    if (destino==='nombre') {
      this.textoDefault = 'Seleccione un Destinatario...'
      this.cvus = ['Juan Carlos Mareco', 'Oscar Alberto Di Pasquale', 'Norberto García', 'Pedro Duarte'];

    }else {
      if (destino==='email'){
        this.textoDefault = 'Seleccione un Email...'
        this.cvus = ['juancarlosmareco@yahoo.com.ar', 'oscarcitopasquale@gmail.com', 'garcianorbert@live.com.ar', 'peterduarte@gmail.com'];
      } else {
        this.textoDefault = 'Seleccione un CVU...'
        this.cvus = ['00005689741236987', '00005689741236988', '00005689741236989'];
      }
    }

    console.log(destino);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

  }

}
