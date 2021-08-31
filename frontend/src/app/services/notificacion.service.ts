import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private toastr: ToastrService) { }

  showSuccess(mensaje:string, titulo:string) {
    this.toastr.success(mensaje,titulo);
  }

  showError(mensaje:string, titulo:string) {
    this.toastr.error(mensaje,titulo);
  }

  showInfo(mensaje:string, titulo:string) {
    this.toastr.info(mensaje,titulo);
  }

  showWarning(mensaje:string, titulo:string) {
    this.toastr.warning(mensaje,titulo);
  }

}
