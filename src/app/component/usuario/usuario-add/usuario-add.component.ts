import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Router } from '@angular/router';
import { Telefone } from 'src/app/model/telefone';
import { NgbDateParserFormatter, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Profissao } from 'src/app/model/Profissao';


/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class FormatDateAdapter extends NgbDateAdapter<string> {
	
  readonly DELIMITER = '/';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
	}
}


/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class FormataData extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}


	format(date: NgbDateStruct | null): string | null {
		return date ? validarDia(date.day) + this.DELIMITER + validarDia(date.month) + this.DELIMITER + date.year : '';
	}

  toModel(date: NgbDateStruct | null): string | null {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
	}

}

function validarDia(valor) {
  if(valor.toString !== '' && parseInt(valor) <= 9) {
    return '0' + valor;
  }
  return valor;
}


@Component({
  selector: 'app-root',
  templateUrl: './usuario-add.component.html',
  styleUrls: ['./usuario-add.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: FormataData},
    {provide: NgbDateAdapter, useClass: FormatDateAdapter},
  ]
})
export class UsuarioAddComponent implements OnInit {

  constructor(private routeActive: ActivatedRoute, private userService : UsuarioService, private router : Router) { }

  usuario = new User();
  submitted = false;
  telefone = new Telefone();
  profissoes: Array<Profissao>;

  ngOnInit() {

    this.userService.getProfissaoList().subscribe(data => {
      this.profissoes = data;
    });
  
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
