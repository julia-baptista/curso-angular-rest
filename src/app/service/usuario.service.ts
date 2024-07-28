import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private router : Router) { }

  getStudentList() : Observable<any> {

    return this.http.get<any>(AppConstants.baseUrl);

  }

  getStudentListPage(pagina) : Observable<any> {

    return this.http.get<any>(AppConstants.baseUrl + 'page/' + pagina );

  }

  getStudent(id): Observable<any> {

    return this.http.get<any>(AppConstants.baseUrl + "v2/" + id);

  }

  deletarUsuario(id: Number) : Observable<any> {

    return this.http.delete(AppConstants.baseUrl + id, {responseType: 'text'}); 

  }

  consultarUser(nome: String) :  Observable<any> {

    return this.http.get<any>(AppConstants.baseUrl + "usuarioPorNome/" + nome);

  }

  salvarUsuario(user) : Observable<any> {
    return this.http.post<any>(AppConstants.baseUrl, user);
  }

  updateUsuario(user) : Observable<any> {
    return this.http.put<any>(AppConstants.baseUrl, user);
  }

  userAutenticado() {
    if(localStorage.getItem('token') != null &&
    localStorage.getItem('token').toString().trim() !== null) {
      return true;
    } else {
      return false;
    }
  } 

  removerTelefone(id): Observable<any>{
    return this.http.delete(AppConstants.baseUrl + "removerTelefone/" + id, {responseType: 'text'})
  }


  
}
