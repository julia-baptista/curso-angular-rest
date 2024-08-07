import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';
import { Router } from '@angular/router';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient, private router: Router) { }


  recuperar(login){

    let user = new User();
    user.login = login;


    return this.http.post(AppConstants.getBaseUrlPath + "recuperar/", user).subscribe(data => {

      alert(JSON.parse(JSON.stringify(data)).error);


    },
    error => {
      console.error("Erro ao recuperar login")
      alert('Erro ao recuperar login!')
    }
    )
  }


  login(usuario){
    return this.http.post(AppConstants.baseLogin, JSON.stringify(usuario)).subscribe(data => {

      /*Retorno Http*/
      var token = JSON.parse(JSON.stringify(data)).Authorization.split(' ')[1];
      console.log(token);

      localStorage.setItem("token", token);

      this.router.navigate(['home']);


    },
    error => {
      console.error("Erro ao fazer login")
      alert('Acesso Negado!')
    }
    )
  }
}
