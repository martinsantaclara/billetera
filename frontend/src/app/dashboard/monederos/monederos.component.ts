import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { TransaccionService } from '../services/transaccion.service';
import { HomeComponent } from '../home/home.component';
import { Cripto } from '../interfaces/cripto';
import { mayoraceroValidation } from 'src/app/dashboard/validations/mayoracero-validation';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ClienteTransfer } from '../interfaces/cliente-transfer';


@Component({
  selector: 'app-monederos',
  templateUrl: './monederos.component.html',
  styleUrls: ['./monederos.component.css']
})
export class MonederosComponent implements OnInit, OnDestroy {

  navigationSubscription;

  createFormGroup() {
    return new FormGroup ({
      monto: new FormControl('',[Validators.required,Validators.min(1000),Validators.max(1200),mayoraceroValidation()]),
      cripto: new FormControl('ETH',[Validators.required])
    });
  }

  formularioCripto :FormGroup;

  monedaDashboard = {
    Indice:0,
    Abreviatura: '',
    Cantidad:'',
    Clase:'',
    Cotizacion:0,
    Decimales:0,
    EsCripto:true,
    IdMoneda:0,
    NombreMoneda:'',
    SimboloMoneda:'',
    TotalEnPesos:'',
    UrlLogoMoneda:''
  }

  criptos: Cripto[] = [];

  public currentUser: any;

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
  moneda = [];
  simboloMonedaPrincipal = '';
  descubierto = 0.00;

  // public criptos = [['BTC',5800125],['USDC',365187]];

  destinatarios: string[] = [''];
  selectCvu = true;
  selectAlias = false;
  selectEmail = false;
  clienteTransfer:ClienteTransfer[]=[];
  textoDefault = '';

  constructor(private render: Renderer2, private router: Router,
              private dialog: MatDialog, private route: ActivatedRoute,
              private transaccionService: TransaccionService,
              private home: HomeComponent, private notifyService: NotificacionService) {
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
     this.monedaDashboard = JSON.parse(localStorage.getItem('moneda')!);
     this.currentUser = JSON.parse(localStorage.getItem('usuario')!);
     this.logoCripto = this.monedaDashboard.UrlLogoMoneda;
     this.nombreCripto = this.monedaDashboard.NombreMoneda;
     this.saldoEnPesos = this.monedaDashboard.TotalEnPesos;
     this.saldoEnCripto = this.monedaDashboard.Cantidad;
     this.unidadCripto = this.monedaDashboard.SimboloMoneda;
     this.transaccion1 = (this.monedaDashboard.EsCripto ? 'Comprar' : 'Ingresar');
     this.transaccion2 = (this.monedaDashboard.EsCripto ? 'Vender' : 'Retirar');
     this.transaccion3 = (this.monedaDashboard.EsCripto ? 'Intercambiar' : 'Transferir');
     this.maximo = parseFloat(this.monedaDashboard.Cantidad);
     this.simboloMonedaPrincipal = this.home.simboloMonedaPrincipal;
     this.descubierto = this.home.descubierto;

     this.criptos = this.home.criptos.filter(cripto => cripto.SimboloMoneda !== this.monedaDashboard.SimboloMoneda)
                    .sort( (a, b) => {
                      if (a.SimboloMoneda > b.SimboloMoneda) {
                        return 1;
                      }
                      if (a.SimboloMoneda < b.SimboloMoneda) {
                        return -1;
                      }
                      return 0
                      });

    console.log(this.criptos);
    //  switch (this.monedero) {
    //   case 'pesos':
    //     // this.logoCripto = '../../../assets/imagenes/logo_peso1.png';
    //     this.nombreCripto = 'Pesos';
    //     this.saldoEnPesos = '1200,00';
    //     this.transaccion1 = 'Ingresar';
    //     this.transaccion2 = 'Transferir';
    //     this.transaccion3 = '';
    //     this.maximo = 1200;
    //     this.textoDefault = 'Seleccione un CVU...';
    //     this.cvus = ['00005689741236987', '00005689741236988', '00005689741236989'];
    //     break;
    //   case 'bitcoin':
    //     // this.logoCripto = '../../../assets/imagenes/logo_bitcoin.png';
    //     this.nombreCripto = 'Bitcoin';
    //     this.saldoEnPesos = '1000,00';
    //     this.saldoEnCripto = '0,000153';
    //     this.unidadCripto = 'BTC'
    //     this.cripto1 = 'ETH';
    //     this.cripto2 = 'USDC';
    //     this.indice = 0;
    //     this.maximo = 0.000153;
    //     break;

    //   case 'ethereum':
    //     // this.logoCripto = '../../../assets/imagenes/logo_ethereum.png';
    //     this.nombreCripto = 'Ethereum';
    //     this.saldoEnPesos = '800,00';
    //     this.saldoEnCripto = '0,001885';
    //     this.unidadCripto = 'ETH';
    //     this.cripto1 = 'BTC';
    //     this.cripto2 = 'USDC';
    //     this.indice = 1;
    //     this.maximo = 0.001885;
    //     break;

    //   case 'usdc':
    //   // this.logoCripto = '../../../assets/imagenes/logo_usdc.png';
    //     this.nombreCripto = 'USD Coin';
    //     this.saldoEnPesos = '400,00';
    //     this.saldoEnCripto = '2,280112';
    //     this.unidadCripto = 'USDC';
    //     this.cripto1 = 'BTC';
    //     this.cripto2 = 'ETH';
    //     this.indice = 2;
    //     this.maximo = 2.280112;
    //     break;

    //   default:
    // }

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
    const max = this.home.totalMonedaPrincipal;
    switch (this.transaccion) {
      case 'Comprar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.min(1000),Validators.max(max)])
        });
        break;
      case 'Vender':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(this.maximo),mayoraceroValidation()])
        });
        break;
      case 'Intercambiar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(this.maximo),mayoraceroValidation()]),
          cripto: new FormControl('Cripto...',[Validators.required])
        });
        break;
      case 'Ingresar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.min(100),Validators.max(50000)])
        });
        break;
      case 'Retirar':
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(max),mayoraceroValidation()])
        });
        break;
      case 'Transferir':
        this.transaccionService.clientesParaTransferencia(this.currentUser.IdCliente).subscribe({
          next: data =>{
            this.clienteTransfer = data;
          },
          error: error =>{
          }
        })
        const maxDescubierto = max + this.descubierto;
        this.formularioCripto = new FormGroup ({
          monto: new FormControl('',[Validators.required,Validators.max(maxDescubierto),mayoraceroValidation()]),
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
      let valor:number = monto/this.monedaDashboard.Cotizacion;
      this.valorFin = Number.parseFloat(valor.toString()).toFixed(this.monedaDashboard.Decimales);
    } else {
      if (transaccion==='Vender'){
        let valor:number = monto * this.monedaDashboard.Cotizacion;
        this.valorFin = Number.parseFloat(valor.toString()).toFixed(this.home.decimalesMonedaPrincipal);
      }
    }
  }

  calculoIntercambio(monto: number, criptoSelect: any) {
    let valor:number = 0;
    if (criptoSelect.Cotizacion!==undefined){
      valor = monto * (this.monedaDashboard.Cotizacion / criptoSelect.Cotizacion);
      this.valorFin = Number.parseFloat(valor.toString()).toFixed(criptoSelect.Decimales);
    } else {
      this.notifyService.showWarning('Elija a que criptomoneda desea intercambiar', 'Atención');
      this.valorFin = '0.00';
    }


    // console.log(criptoSelect.cotizacion);

    // if (criptoSelect === 'BTC') {
    //   indiceDestino = 0;
    // } else {
    //   if (criptoSelect === 'ETH') {
    //     indiceDestino = 1;
    //   } else {
    //     indiceDestino = 2;
    //   }
    // }

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

      let criptoIntercambio=true;
      let criptoSel;
      let clienteParaTransferencia;
      let transferencia=true;
      if (this.transaccion==='Intercambiar') {
        criptoSel = this.formularioCripto.get('cripto')?.value;
        criptoIntercambio = criptoSel.Cotizacion!==undefined;
      }
      if (this.transaccion==='Transferir'){
        clienteParaTransferencia = this.formularioCripto.get('beneficiario')?.value;
        if (typeof clienteParaTransferencia==='string') {
          transferencia = false;
        }
      }


      if (si && btn==='btnCancelar') {
        this.transaccion='';
        this.valorFin='0.00';
        this.formularioCripto = new FormGroup({
          monto: new FormControl('',[Validators.required])
        });
      } else if (si && criptoIntercambio && transferencia) {
        const monto = this.formularioCripto.get('monto')?.value;
        switch (this.transaccion) {
          case 'Comprar':
            this.Comprar(monto)
            break;
          case 'Vender':
            this.Vender(monto)
            break;
          case 'Intercambiar':
            {
              this.Intercambiar(monto,criptoSel)
              break;
            }
          case 'Ingresar':
            this.Ingresar(monto)
            break;
          case 'Retirar':
            this.Retirar(monto)
            break;
          case 'Transferir':
            this.Transferir(monto,clienteParaTransferencia)
            break;
        }
        this.transaccion='';
        this.valorFin='0.00';
        this.formularioCripto = new FormGroup({
        monto: new FormControl('',[Validators.required])
        });
      } else if (si && transferencia) {
        this.notifyService.showWarning('Seleccione a que criptomoneda desea intercambiar', 'Atención');
      } else if (si){
        this.notifyService.showWarning(clienteParaTransferencia, 'Atención');
      }
    });
  }

  radio(destino: string) {
    const beneficiario = this.formularioCripto.get('beneficiario');
    if (destino==='alias') {
      beneficiario?.setValue('Seleccione un Alias...');
    }else {
      if (destino==='email'){
        beneficiario?.setValue('Seleccione un Email...');
      } else {
        beneficiario?.setValue('Seleccione un CVU...');
      }
    }
    this.selectAlias = (destino==='alias');
    this.selectEmail = (destino==='email');
    this.selectCvu = (destino==='cvu');
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

  }

  Comprar(monto:number){
    const montoIngreso = monto/this.monedaDashboard.Cotizacion;
    const IdClienteIngreso = this.currentUser.IdCliente;
    const IdTransaccion = 4;
    const DescripcionTransaccion = 'Compra de ' + this.monedaDashboard.NombreMoneda.trim();
    const IdCuentaIngreso = this.currentUser.IdCuenta;
    const IdMonedaIngreso = this.monedaDashboard.IdMoneda;
    const MontoIngreso = montoIngreso;
    const IdClienteEgreso = this.currentUser.IdCliente;
    const IdCuentaEgreso = this.currentUser.IdCuenta;
    const IdMonedaEgreso = this.home.monedaPrincipal;
    const MontoEgreso = monto * (-1);
    this.transaccionService.transaccion(IdClienteIngreso,IdTransaccion,DescripcionTransaccion,IdCuentaIngreso,IdMonedaIngreso,
                                        MontoIngreso,IdClienteEgreso,IdCuentaEgreso,IdMonedaEgreso,
                                        MontoEgreso,true).subscribe({
      next: data =>{
        console.log(data);
      },
      error: error =>{
      }
    })
    this.saldoEnCripto = ((parseFloat(this.saldoEnCripto) + montoIngreso).toFixed(this.monedaDashboard.Decimales)).toString()
    this.saldoEnPesos = ((parseFloat(this.saldoEnPesos) + monto).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.monedas[this.monedaDashboard.Indice].Cantidad = this.saldoEnCripto;
    this.home.monedas[this.monedaDashboard.Indice].TotalEnPesos = this.saldoEnPesos;
    this.home.monedas[this.home.indiceMonedaPrincipal].TotalEnPesos = (this.home.totalMonedaPrincipal - monto).toFixed(this.home.decimalesMonedaPrincipal).toString();
    this.home.totalMonedaPrincipal = this.home.totalMonedaPrincipal - monto;

  }
  Vender(monto:number){
    const montoIngreso = monto * this.monedaDashboard.Cotizacion;
    const IdClienteIngreso = this.currentUser.IdCliente;
    const IdTransaccion = 5;
    const DescripcionTransaccion = 'Venta de ' + this.monedaDashboard.NombreMoneda.trim();
    const IdCuentaIngreso = this.currentUser.IdCuenta;
    const IdMonedaIngreso = this.home.monedaPrincipal;
    const MontoIngreso = montoIngreso;
    const IdClienteEgreso = this.currentUser.IdCliente;
    const IdCuentaEgreso = this.currentUser.IdCuenta;
    const IdMonedaEgreso = this.monedaDashboard.IdMoneda;
    const MontoEgreso = monto * (-1);
    this.transaccionService.transaccion(IdClienteIngreso,IdTransaccion,DescripcionTransaccion,IdCuentaIngreso,
                                        IdMonedaIngreso,MontoIngreso,IdClienteEgreso,IdCuentaEgreso,
                                        IdMonedaEgreso,MontoEgreso,true).subscribe({
      next: data =>{
        console.log(data);
      },
      error: error =>{
      }
    })
    this.saldoEnCripto = ((parseFloat(this.saldoEnCripto) - monto ).toFixed(this.monedaDashboard.Decimales)).toString()
    this.saldoEnPesos = ((parseFloat(this.saldoEnPesos) - montoIngreso).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.monedas[this.monedaDashboard.Indice].Cantidad = this.saldoEnCripto;
    this.home.monedas[this.monedaDashboard.Indice].TotalEnPesos = this.saldoEnPesos;
    this.home.monedas[this.home.indiceMonedaPrincipal].TotalEnPesos = (this.home.totalMonedaPrincipal + montoIngreso).toFixed(this.home.decimalesMonedaPrincipal).toString();
    this.home.totalMonedaPrincipal = this.home.totalMonedaPrincipal + montoIngreso;

  }
  Intercambiar(monto:number, cripto: Cripto){
    console.log(cripto);
    const montoIngreso = monto * this.monedaDashboard.Cotizacion/cripto.Cotizacion;
    const IdClienteIngreso = this.currentUser.IdCliente;
    const IdTransaccion = 6;
    const DescripcionTransaccion = 'Intercambio de ' + this.monedaDashboard.NombreMoneda.trim() + ' a ' + cripto.NombreMoneda.trim();
    const IdCuentaIngreso = this.currentUser.IdCuenta;
    const IdMonedaIngreso = cripto.IdMoneda;
    const MontoIngreso = montoIngreso;
    const IdClienteEgreso = this.currentUser.IdCliente;
    const IdCuentaEgreso = this.currentUser.IdCuenta;
    const IdMonedaEgreso = this.monedaDashboard.IdMoneda;
    const MontoEgreso = monto * (-1);
    this.transaccionService.transaccion(IdClienteIngreso,IdTransaccion,DescripcionTransaccion,IdCuentaIngreso,
                                        IdMonedaIngreso,MontoIngreso,IdClienteEgreso,IdCuentaEgreso,IdMonedaEgreso,MontoEgreso,true).subscribe({
      next: data =>{
        console.log(data);
      },
      error: error =>{
      }
    })
    this.saldoEnCripto = ((parseFloat(this.saldoEnCripto) - monto ).toFixed(this.monedaDashboard.Decimales)).toString();
    this.saldoEnPesos = ((parseFloat(this.saldoEnPesos) - (monto * this.monedaDashboard.Cotizacion)).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.monedas[this.monedaDashboard.Indice].Cantidad = this.saldoEnCripto;
    this.home.monedas[this.monedaDashboard.Indice].TotalEnPesos = this.saldoEnPesos;
    this.home.monedas[cripto.Indice].Cantidad = ((parseFloat(this.home.monedas[cripto.Indice].Cantidad) + montoIngreso ).toFixed(cripto.Decimales)).toString();
    this.home.monedas[cripto.Indice].TotalEnPesos = ((parseFloat(this.home.monedas[cripto.Indice].TotalEnPesos) + (montoIngreso * cripto.Cotizacion)).toFixed(this.home.decimalesMonedaPrincipal)).toString();
  }
  Ingresar(monto:number){
    const IdClienteIngreso = this.currentUser.IdCliente;
    const IdTransaccion = 1;
    const DescripcionTransaccion = 'Ingreso ' + this.monedaDashboard.SimboloMoneda.trim();
    const IdCuentaIngreso = this.currentUser.IdCuenta;
    const IdMonedaIngreso = this.monedaDashboard.IdMoneda;
    const MontoIngreso = monto;
    this.transaccionService.transaccion(IdClienteIngreso,IdTransaccion,DescripcionTransaccion,IdCuentaIngreso,IdMonedaIngreso,MontoIngreso,
                                        0,0,0,0,false).subscribe({
      next: data =>{
        console.log(data);
      },
      error: error =>{
      }
    })
    this.saldoEnPesos = ((parseFloat(this.saldoEnPesos) + monto).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.saldoActual = ((parseFloat(this.home.saldoActual) + monto).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.monedas[this.monedaDashboard.Indice].TotalEnPesos = this.saldoEnPesos;
    this.home.totalMonedaPrincipal = parseFloat(this.saldoEnPesos);
  }
  Retirar(monto:number){
    const IdTransaccion = 2;
    const DescripcionTransaccion = 'Retiro ' + this.monedaDashboard.SimboloMoneda.trim();
    const IdClienteEgreso = this.currentUser.IdCliente;
    const IdCuentaEgreso = this.currentUser.IdCuenta;
    const IdMonedaEgreso = this.monedaDashboard.IdMoneda;
    const MontoEgreso = monto * (-1);
    this.transaccionService.transaccion(0,IdTransaccion,DescripcionTransaccion,0,
      0,0,IdClienteEgreso,IdCuentaEgreso,IdMonedaEgreso,MontoEgreso,true).subscribe({
      next: data =>{
      console.log(data);
      },
      error: error =>{
      }
    })
    this.saldoEnPesos = ((parseFloat(this.saldoEnPesos) - monto).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.saldoActual = ((parseFloat(this.home.saldoActual) - monto).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.monedas[this.monedaDashboard.Indice].TotalEnPesos = this.saldoEnPesos;
    this.home.totalMonedaPrincipal = parseFloat(this.saldoEnPesos);
  }
  Transferir(monto:number, clienteTransferencia: ClienteTransfer){
    const IdClienteIngreso = clienteTransferencia.IdCliente;
    const IdTransaccion = 3;
    const DescripcionTransaccion = 'Transferencia de ' + this.monedaDashboard.SimboloMoneda.trim();
    const IdCuentaIngreso = clienteTransferencia.IdCuenta;
    const IdMonedaIngreso = this.monedaDashboard.IdMoneda;
    const MontoIngreso = monto;
    const IdClienteEgreso = this.currentUser.IdCliente;
    const IdCuentaEgreso = this.currentUser.IdCuenta;
    const IdMonedaEgreso = this.monedaDashboard.IdMoneda;
    const MontoEgreso = monto * (-1);
    this.transaccionService.transaccion(IdClienteIngreso,IdTransaccion,DescripcionTransaccion,IdCuentaIngreso,
                                        IdMonedaIngreso,MontoIngreso,IdClienteEgreso,IdCuentaEgreso,IdMonedaEgreso,MontoEgreso,true).subscribe({
      next: data =>{
        console.log(data);
      },
      error: error =>{
      }
    })
    this.saldoEnPesos = (parseFloat(this.saldoEnPesos) - monto).toFixed(this.monedaDashboard.Decimales).toString();
    this.home.saldoActual = ((parseFloat(this.home.saldoActual) - monto).toFixed(this.home.decimalesMonedaPrincipal)).toString();
    this.home.monedas[this.monedaDashboard.Indice].TotalEnPesos = this.saldoEnPesos;
    this.home.totalMonedaPrincipal = parseFloat(this.saldoEnPesos);
  }
}
