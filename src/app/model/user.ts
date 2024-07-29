import { Role } from "./role";
import { Telefone } from "./telefone";

export class User {

  id : Number;
  login : String;
  nome : String;
  senha: String;
  cpf : String;

  telefones: Array<Telefone>;
  roles: Array<Role>;
}
