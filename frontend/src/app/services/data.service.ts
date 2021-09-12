import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiBaseUrl = environment.apiBaseUrl;

  getAlias(){
    return this.http.get('assets/txt/Palabras.txt', {responseType: 'text'});
  }

  getprovincias(){
     return this.http.get<any>(`${this.apiBaseUrl}/provincias`);
  }

  // getProvincias = async () => {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json',
  //                'Access-Control-Allow-Origin': '*' }
  // };
  //   const response = await fetch(`${this.apiBaseUrl}/provincias`,requestOptions);
  //   const data = await response.json();
  //   console.log(data);
  //   return data
  // }

  getProvinciaById = async () => {
    const idProvincia = 12;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*' }
  };
    const response = await fetch(`${this.apiBaseUrl}/provincias/${idProvincia}`,requestOptions);
    const data = await response.json();
    console.log(data);
    return data
  }

  // postProvincia = async () => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json'},
  //     body: JSON.stringify({ NombreProvincia: 'Tierra del Fuego'})
  // };
  //   const response = await fetch(`${this.apiBaseUrl}/provincias`, requestOptions)
  // }

  postProvincia(){
    const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'}}
    const body = JSON.stringify({ NombreProvincia: 'Neuquén'});
    this.http.post<any>(`${this.apiBaseUrl}/provincias`, body,requestOptions).subscribe();
  }


  putProvincia = async () => {
    // POST request using fetch with async/await
    const idProvincia = 6;
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ NombreProvincia: 'Santa Fé'})
    };
    const response = await fetch(`${this.apiBaseUrl}/provincias/${idProvincia}`, requestOptions)
  }

  deleteProvincia = async () => {
    // POST request using fetch with async/await
    const idProvincia = 10;
    const requestOptions = {
        method: 'DELETE'
    };
    const response = await fetch(`${this.apiBaseUrl}/provincias/${idProvincia}`, requestOptions)
  }

  getClientes() {
    return this.http.get<any>(`${this.apiBaseUrl}/clientes`)
  }


  getClientesById(id: number) {
    return this.http.get<any>(`${this.apiBaseUrl}/clientes/${id}`);
  }

  getClientesByEmail(email: string) {
    return this.http.get<any>(`${this.apiBaseUrl}/clientes/byEmail/?email=${email}`);
  }

  autenticacionCliente(email: string, password: string){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}}
    const body = JSON.stringify({Email: email, Password: password});
    return this.http.post<any>(`${this.apiBaseUrl}/autenticacion`, body,requestOptions);

  }

  registroCliente(nombre: string, email: string, password: string, cvu: string, alias: string, estado: string){
    const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'}}
    const body = JSON.stringify({NombreCliente: nombre, Email: email, Password: password, Cvu: cvu, Alias: alias, Estado: estado});
    return this.http.post<any>(`${this.apiBaseUrl}/registro`, body,requestOptions);
  }

  getMonedas(){
    return this.http.get<any>(`${this.apiBaseUrl}/monedas`)
  }

  getMonedaPrincipal(idCuenta: number, idMoneda: number){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}}
      const body = JSON.stringify({IdCuenta: idCuenta, IdMoneda: idMoneda});
    return this.http.post<any>(`${this.apiBaseUrl}/cuentamoneda`,body, requestOptions)
  }

  postMonedas(id: number, token:string) {
    const tokenAuth = (token!=='' ? 'Bearer ' + token : '');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'Authorization': tokenAuth}}
      const body = JSON.stringify({Id: id});
    return this.http.post<any>(`${this.apiBaseUrl}/monedas`,body, requestOptions)
  }

  getConfiguraciones(token: string) {
    const tokenAuth = (token!=='' ? 'Bearer ' + token : '');
    let httpHeader: HttpHeaders = new HttpHeaders();
    httpHeader = httpHeader.append('Content-Type', 'application/json');
    httpHeader = httpHeader.append('Authorization', tokenAuth);
    const requestOptions = {
      method: 'POST',
      headers: httpHeader}
    const body = "hola";
    return this.http.post<any>(`${this.apiBaseUrl}/configuraciones`,body,requestOptions)
    // return this.http.get<any>(`${this.apiBaseUrl}/configuraciones`)

  }

}


