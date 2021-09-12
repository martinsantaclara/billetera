import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';
import { CryptosService } from 'src/app/services/cryptos.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cripto } from 'src/app/dashboard/interfaces/cripto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private monederoSelected = '';

  public currencies: any;

  public monedas: any;
  public monedaPrincipal = 0;
  public decimalesMonedaPrincipal = 0;
  public simboloMonedaPrincipal = '';
  public totalMonedaPrincipal = 0;
  public indiceMonedaPrincipal=0;
  public currentUser: any;

  public pesosBitcoin = 0;
  public pesosEthereum = 0;
  public pesosUSDCoin = 0;

  public saldoActual = '';

  public criptos: Cripto[]=[];

  constructor(private render: Renderer2, private router: Router, private data: DataService, private dataCrypto: CryptosService,
    private authService: AuthService, private spinner: NgxSpinnerService) {

      // this.data.getMonedas().subscribe({
      //   next: data => {
      //     this.currencies = data;

      //   },
      //   error: error => {

      //   }
      // })


     }

  ngOnInit(): void {
    AOS.init();
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('usuario')!);
    const token = (this.currentUser!==null ? this.currentUser.Token : '');
    this.data.getConfiguraciones(token).subscribe({
      next: data =>{
        this.monedaPrincipal = data[0].MonedaPrincipal;
        this.simboloMonedaPrincipal = data[0].SimboloMonedaPrincipal;
        this.decimalesMonedaPrincipal = data[0].DecimalesMonedaPrincipal;
        this.callMonedas();
      },
      error: error =>{
      }
    })
  }

  public hideSpinner() {
    this.spinner.hide();
  }


  callMonedas() {
    // this.data.getMonedaPrincipal(this.currentUser.IdCuenta,this.monedaPrincipal).subscribe({
    //   next: response => {
    //     console.log(response);
    //   },
    //   error: error => {

    //   }
    // })
    const token = (this.currentUser!==null ? this.currentUser.Token : '');
    this.data.postMonedas(this.currentUser.IdCuenta, token).subscribe({
      next: response =>{
        let calculoSaldo=0;
        let cantMonedas = response.length;
        this.monedas = response.map((moneda:any,index:number) => {
          let propiedades = {
            "Indice": index,
            "IdMoneda": moneda.IdMoneda,
            "NombreMoneda": moneda.NombreMoneda,
            "SimboloMoneda": moneda.SimboloMoneda,
            "UrlLogoMoneda": moneda.UrlLogoMoneda,
            "Abreviatura":moneda.Abreviatura,
            "EsCripto": moneda.Criptomoneda,
            "Clase": 'panelcripto ' + moneda.Abreviatura,
            "Cotizacion": 1,
            "Cantidad": moneda.TotalCuentaMoneda.toFixed(moneda.Decimales),
            "Decimales": moneda.Decimales,
            "TotalEnPesos":moneda.TotalCuentaMoneda.toFixed(this.decimalesMonedaPrincipal)
          };
          if (moneda.IdMoneda===this.monedaPrincipal) {
            this.totalMonedaPrincipal = moneda.TotalCuentaMoneda;
            this.indiceMonedaPrincipal = index;
          }
          cantMonedas -= 1
          this.dataCrypto.getCrypto(moneda.Abreviatura.trim())
          .then((crypto)=>{

            const pesosCrypto = (moneda.Criptomoneda ? crypto[moneda.Abreviatura.trim()].ars : 1);
            propiedades['Cotizacion'] = pesosCrypto;
            calculoSaldo += pesosCrypto * (moneda.TotalCuentaMoneda).toFixed(moneda.Decimales);
            propiedades['TotalEnPesos'] = (pesosCrypto * moneda.TotalCuentaMoneda.toFixed(moneda.Decimales)).toFixed(this.decimalesMonedaPrincipal);
            this.saldoActual =  calculoSaldo.toFixed(this.decimalesMonedaPrincipal);

            if (moneda.Criptomoneda) {
              this.criptos.push({"IdMoneda": moneda.IdMoneda, "SimboloMoneda":moneda.SimboloMoneda,"Cotizacion":pesosCrypto,
                                 "Indice":index, "Decimales":moneda.Decimales});
            }
            if (cantMonedas===0) {
              setTimeout(() => {
                this.hideSpinner();
              }, 3000);
            }

          })

          return propiedades;

         });
      },
      error: error =>{
      }
     })
  }

  monedero(i:number, opcion:string) {
    // const panelesCripto = document.querySelectorAll('.panelcripto');
    // panelesCripto.forEach(panel => {
    //   this.render.setStyle(panel,'background-color','rgba(0,0,0,.1)');
    // });
    if (this.monederoSelected!=='') {
      const claseSelected = document.querySelector(this.monederoSelected);
      this.render.removeStyle(claseSelected,'background-color');
    }
    const selector = `.${opcion}`
    const monedero = document.querySelector(selector);
    this.render.setStyle(monedero,'background-color', 'rgba(214, 103, 17,.8)');

    this.monederoSelected = selector;

    // const calltoaction = document.querySelector('.call-to-action');
    // this.render.setStyle(calltoaction,'display','none');
    const contenedorSlider = document.querySelector('.contenedorSlider');
    this.render.setStyle(contenedorSlider,'visibility','hidden');

    localStorage.setItem('moneda',JSON.stringify(this.monedas[i]));

    this.router.navigate([`dashboard/${opcion}`]);
  }

}
