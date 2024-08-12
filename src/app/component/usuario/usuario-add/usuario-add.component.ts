import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Router } from '@angular/router';
import { Telefone } from 'src/app/model/telefone';
import { NgbDateParserFormatter, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Profissao } from 'src/app/model/Profissao';
import { FormGroup } from '@angular/forms';


/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class FormatDateAdapter extends NgbDateAdapter<string> {
	
  readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
      console.log(parseInt(date[0], 10));
			return {
				year: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				day: parseInt(date[2], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
    if (!date) {
      return null;
    }
    console.log(`${date.year}-${validarDia(date.month)}-${validarDia(date.day)}`);
		// Return date in 'yyyy-MM-dd' format
    return `${date.year}-${validarDia(date.month)}-${validarDia(date.day)}`;
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

    // Return date in 'yyyy-MM-dd' format
    return `${date.year}-${validarDia(date.month)}-${validarDia(date.day)}`;
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

  yourForm: FormGroup;
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
    console.log(this.usuario);
    if(this.usuario.id != null && this.usuario.id.toString().trim() != null) {
      
      this.userService.updateUsuario(this.usuario).subscribe(data => {
        console.info("User Atualizado: " + data);
        this.handleUserUpdate(data);
      })
    } else {
      this.userService.salvarUsuario(this.usuario).subscribe(data => {
        console.info("Gravou User: " + data);
        this.handleUserUpdate(data);
      })
    }

    let id = this.routeActive.snapshot.paramMap.get('id');

    if (id != null) {
      this.userService.getStudent(id).subscribe(data => {
        this.usuario = data;
        this.updateFormWithUserData();
      })
    }

    this.submitted = true;
  }

  handleUserUpdate(data: any) {
    // Assuming `data` contains the updated user data including date information
    this.usuario = data;
    this.updateFormWithUserData();
  }
  
  // Update form control with user data
  updateFormWithUserData() {
    // Update form control with the new date value if `usuario` has a date property
    if (this.usuario && this.usuario.dataNascimento) {
      const formattedDate: NgbDateStruct = this.parseDateFromModel(this.usuario.dataNascimento);
      const dateControl = this.yourForm.get('dataNascimento');
      if (dateControl) {
        dateControl.setValue(formattedDate);
      }
    }
  }
  
  // Helper function to convert 'yyyy-MM-dd' date string to NgbDateStruct
  parseDateFromModel(dateString: string): NgbDateStruct {
    // Convert 'yyyy-MM-dd' to NgbDateStruct with 'dd/MM/yyyy' format
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return { day, month, year };
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
