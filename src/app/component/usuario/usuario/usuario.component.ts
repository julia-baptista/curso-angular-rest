import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  students : Array<User[]>;
  nome : String;
  p: Number;
  total: Number;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioService.getStudentList().subscribe(data => {
      this.students = data.content;
      this.total = data.totalElements;
    });
  }

  deleteUsuario(id: Number, index) {

    if(confirm('Deseja mesmo remover?')) {

      this.usuarioService.deletarUsuario(id).subscribe(data => {
        //this.usuarioService.getStudentList().subscribe(data => {
          //this.students = data;
        //});
 

        this.students.splice(index, 1); // remover da tela
      })

    }
  }

  consultarUser() {

    if(this.nome === "") {
      this.usuarioService.getStudentList().subscribe(data => {
        this.students = data.content;
        this.total = data.totalElements;
      });
    } else {
      this.usuarioService.consultarUser(this.nome).subscribe(data => {
        console.log("data: " + data.content)
        this.students = data.content;
        this.total = data.totalElements;
      })
    }

  }

  carregarPagina(pagina) {

    if(this.nome !== "") {
      this.usuarioService.consultarUserPorPage(this.nome, (pagina - 1)).subscribe(data => {
        this.students = data.content;
        this.total = data.totalElements;
      })
    } else {
      this.usuarioService.getStudentListPage(pagina -1).subscribe(data => {
        this.students = data.content;
        this.total = data.totalElements;
      });

    }


  }

}
