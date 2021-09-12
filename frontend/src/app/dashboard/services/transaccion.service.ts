import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  constructor(private http: HttpClient) { }
  private apiBaseUrl = environment.apiBaseUrl;


  clientesParaTransferencia(id: number){
    return this.http.get<any>(`${this.apiBaseUrl}/transacciones/${id}`);
  }

  transaccion(IdClienteIngreso: number, IdTransaccion: number, DescripcionTransaccion: string,
              IdCuentaIngreso: number, IdMonedaIngreso: number, MontoIngreso: number,
              IdClienteEgreso: number, IdCuentaEgreso: number, IdMonedaEgreso: number, MontoEgreso: number, Egreso: boolean) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}}
      const body = JSON.stringify({IdClienteIngreso: IdClienteIngreso, IdTransaccion: IdTransaccion, DescripcionTransaccion: DescripcionTransaccion,
                                   IdCuentaIngreso: IdCuentaIngreso, IdMonedaIngreso: IdMonedaIngreso, MontoIngreso: MontoIngreso,
                                   IdClienteEgreso: IdClienteEgreso, IdCuentaEgreso: IdCuentaEgreso, IdMonedaEgreso: IdMonedaEgreso, MontoEgreso: MontoEgreso, Egreso: Egreso});
                                   console.log('transaccion service');
    return this.http.post<any>(`${this.apiBaseUrl}/transacciones/transaccion`,body, requestOptions)
  }

}
