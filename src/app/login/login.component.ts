import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginServiceService, private router : Router){}

  ngOnInit() {
    if(localStorage.getItem('token') !== null &&
    localStorage.getItem('token').toString().trim() !== null) {
      this.router.navigate(['home']);
    }
  }

  usuario = {login: '', senha: ''};

  submitted = false;

  

  public login() {
    this.submitted = true;
    if (this.usuario.login && this.usuario.senha) {
      this.loginService.login(this.usuario);
    }
  }

}
