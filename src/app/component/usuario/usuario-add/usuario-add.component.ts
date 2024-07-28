import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Router } from '@angular/router';
import { Telefone } from 'src/app/model/telefone';

@Component({
  selector: 'app-root',
  templateUrl: './usuario-add.component.html',
  styleUrls: ['./usuario-add.component.css']
})
export class UsuarioAddComponent implements OnInit {

  constructor(private routeActive: ActivatedRoute, private userService : UsuarioService, private router : Router) { }

  usuario = new User();
  submitted = false;
  telefone = new Telefone();

  ngOnInit() {
    69949843030
    let id = this.routeActive.snapshot.paramMap.get('id');

    if (id != null) {
      this.userService.getStudent(id).subscribe(data => {
        this.usuario = data;
      })
    }
  }

  salvarUser() {
    if(this.usuario.id != null && this.usuario.id.toString().trim() != null) {
      this.userService.updateUsuario(this.usuario).subscribe(data => {
        console.info("User Atualizado: " + data);
      })
    } else {
      this.userService.salvarUsuario(this.usuario).subscribe(data => {
        console.info("Gravou User: " + data);
      })
    }

    let id = this.routeActive.snapshot.paramMap.get('id');

    if (id != null) {
      this.userService.getStudent(id).subscribe(data => {
        this.usuario = data;
      })
    }

    this.submitted = true;
  }

  deletarTelefone(id, i) {

    if(id == null) {
      this.usuario.telefones.splice(i,1);
      return;
    }

    if(id !== null && confirm("Deseja remover?")) {
      this.userService.removerTelefone(id).subscribe(data => {
        //const index = this.usuario.telefones.findIndex(telefone => telefone.id === id) //identifica posição da lista do telefone removido
       //if(index !== -1) {
          this.usuario.telefones.splice(i, 1); // remove o telefone da lista
       // }
        
        console.info("Telefone removido = " + data);
      })
    }

  }

  addFone() {
    if(this.usuario.telefones === undefined) {
      this.usuario.telefones = new Array<Telefone>();
    }

    this.usuario.telefones.push(this.telefone);
    this.telefone = new Telefone();
  }

  novo() {
    this.usuario = new  User();
    this.telefone = new Telefone();
    this.submitted = false;
  }

  voltar() {
    this.novo();
    this.router.navigate(['userList']);

  }

}
