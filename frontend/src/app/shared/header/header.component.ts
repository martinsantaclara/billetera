import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {


  constructor(private render: Renderer2, private authService: AuthService, private router: Router) { }

  islogged = false;
  isInicio = true;
  tieneFoto = false;
  currentUser: any;


  ngOnInit(): void {
    this.authService.getIslogged.subscribe( log => this.islogged = log);
    this.authService.getIsInicio.subscribe( ini => this.isInicio = ini);
    this.authService.getUserSubject.subscribe( user => {
      this.currentUser = user;
      if(this.currentUser!==null) {
        this.tieneFoto = this.currentUser.UrlFoto!=="";
      }
    });
  }

  toggle() {
    if (!this.isInicio) {
      const toggleMenu = document.querySelector('.menuProfile');
      toggleMenu?.classList.toggle('active');
      const nombre = document.querySelector('.nombre');
      if (toggleMenu?.classList.contains('active')) {
        if (nombre?.classList.contains('show')){
          nombre?.classList.remove('show');
        }
      } else {
        nombre?.classList.add('show')
      }
    }
  }

  clickLink(id: string) {
    var navItems = document.getElementsByClassName('nav-link');
    const link = document.getElementById(id);
    const toggleMenu = document.querySelector('.menuProfile');
    for(var i=0; i < navItems.length; i++) {
      this.render.removeClass(navItems[i],'active');
    }
    if (id!=='brand' && id!=='registro' && id!=='login'){
      this.render.addClass(link,'active');
      if (id==='paneldecontrol') {
        localStorage.removeItem('inicio');
        this.authService.isInicio.next(false);
      }
    } else {
      if (id==='brand') {
        localStorage.setItem('inicio','true');
        this.authService.isInicio.next(true);
        if (toggleMenu?.classList.contains('active')) {
          this.render.removeClass(toggleMenu,'active');
        }
      }
    }
    const imagenFondo = document.getElementById('imagenFondo');
    this.render.setStyle(imagenFondo,'height','100vh');

    if (id!=='nosotros') {
      const footer = document.getElementById('footer');
      const topFooter = imagenFondo?.clientHeight! - 50;

      this.render.setStyle(footer,'visibility','visible');
       this.render.setStyle(footer,'top',`${topFooter}px`);
      // this.render.setStyle(footer,'bottom','10px');
    } else {
      const footer = document.getElementById('footer');
      this.render.setStyle(footer,'visibility','hidden');
    }

  }

  onlogout() {

    let usuario: User = {
      IdCliente:0,
      NombreCliente:'',
      Email:'',
      UrlFoto:'',
      Token:''
    };

    localStorage.removeItem('usuario');
    this.authService.userSubject.next(usuario);
    localStorage.removeItem('logged');
    this.authService.islogged.next(false);
    localStorage.removeItem('inicio');
    this.authService.isInicio.next(true);
    this.router.navigate(['']);
  }

  perfil() {
    const contenedorSlider = document.querySelector('.contenedorSlider');
    this.render.setStyle(contenedorSlider,'visibility','hidden');
    this.router.navigate(['/dashboard/perfil']);
  }

  @HostListener("window:scroll")
    onWindowScroll() {
      const navbarMenu = document.getElementById('menu');
      const imagenFondo = document.getElementById('imagenFondo');
      const footer = document.getElementById('footer');
      if (window.pageYOffset > 0) {
        this.render.addClass(navbarMenu,'scroll');

        const totallHeight = document.body.clientHeight + 50;


        // const heightImagenFondo = ;
        this.render.setStyle(imagenFondo,'height',`${totallHeight}px`);
        this.render.setStyle(footer,'visibility',`visible`);
        this.render.setStyle(footer,'top',`${document.body.clientHeight}px`)
        // this.render.setStyle(footer,'bottom','10px');
        // this.render.setStyle(imagenFondo,'height','1800px');

      } else {
        this.render.removeClass(navbarMenu,'scroll');

      }
  }
}
