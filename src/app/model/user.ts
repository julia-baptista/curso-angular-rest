import { Profissao } from "./Profissao";
import { Role } from "./role";
import { Telefone } from "./telefone";

export class User {

  id : Number;
  login : String;
  nome : String;
  senha: String;
  cpf : String;
  dataNascimento: string;

  profissao: Profissao = new Profissao();

  salario: DoubleRange;

  telefones: Array<Telefone>;
  roles: Array<Role>;
}
