import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';
import { CryptosService } from 'src/app/services/cryptos.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  monederoSelected = '';
  public cryptos: any;
  public currentUser: any;

  constructor(private render: Renderer2, private router: Router, private data: DataService, private dataCrypto: CryptosService,
              private authService: AuthService) { }

  ngOnInit(): void {
    AOS.init();
    this.cryptos = this.dataCrypto.getCryptos();
    console.log(this.cryptos);

    this.authService.getUserSubject.subscribe( log => {
      this.currentUser = log;
    });
  }

  monedero(opcion:string) {
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
    this.router.navigate([`dashboard/${opcion}`]);
  }

}
