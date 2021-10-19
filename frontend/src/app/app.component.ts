import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chamigo';

  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event: any) {
  //   if (localStorage.getItem('recuerdame')!==null) {
  //     if (localStorage.getItem('recuerdame')==='false') {
  //       localStorage.removeItem('usuario');
  //       localStorage.removeItem('logged');
  //     }
  //   }
  // }

  constructor() {

    if (sessionStorage.getItem('app')===null) {
      if (localStorage.getItem('recuerdame')!==null) {
        if (localStorage.getItem('recuerdame')==='false') {
          localStorage.removeItem('usuario');
          localStorage.removeItem('logged');
        }
      }
      sessionStorage.setItem('app','ok');
    }

  }


}
