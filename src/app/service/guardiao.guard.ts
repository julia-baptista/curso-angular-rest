import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';


/* O decorador @Injectable com o parâmetro { providedIn: 'root' } faz com que o GuardiaoGuard
seja registrado como um provedor no nível raiz da aplicação. Isso significa que a instância
do guardião será única e disponível em toda a aplicação. */
@Injectable({
  providedIn: 'root'
})
export class GuardiaoGuard implements CanActivate {

  constructor(private userService: UsuarioService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot, // Contém informações sobre a rota que está sendo acessada.
    state: RouterStateSnapshot) /* Contém o estado do roteador no momento em que a rota é acessada.*/: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.userAutenticado();
  } 
  
}
