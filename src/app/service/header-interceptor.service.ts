import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


/* O decorator @Injectable() em Angular é utilizado para marcar uma classe como um provedor de serviços
 * que pode ser injetado como uma dependência em outros componentes, diretivas ou serviços. Esse decorator
 * informa ao Angular que a classe pode participar do sistema de injeção de dependências, permitindo que
 * instâncias da classe sejam criadas e gerenciadas pelo Angular quando necessário. */
@Injectable()
export class HeaderInterceptorService implements HttpInterceptor {

  

  /*
   * O parâmetro req é um objeto do tipo HttpRequest<any>, que representa a solicitação HTTP.
   * O parâmetro next é um objeto do tipo HttpHandler, que é responsável por encaminhar a solicitação para o próximo manipulador na cadeia de interceptores.
   * O método intercept deve retornar um objeto do tipo Observable<HttpEvent<any>>.
   * HttpEvent<any> pode representar diferentes eventos na sequência de uma solicitação HTTP, como o progresso do upload/download, resposta, etc.
   * Um Observable é um objeto que representa uma sequência de eventos ou valores futuros que podem ser observados e manipulados. Ele permite que você
   * trabalhe com operações assíncronas, como chamadas HTTP, intervalos de tempo, eventos de usuário, etc.
  */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(localStorage.getItem('token') !== null){
      const token = 'Bearer ' + localStorage.getItem('token');

      const tokenRequest = req.clone({
        headers: req.headers.set('Authorization', token)
      })

      return next.handle(tokenRequest).pipe(
        tap((event: HttpEvent<any>) => {
          if(event instanceof HttpResponse && (event.status === 200 || event.status === 201)) {
            console.info('Sucesso na operação')
          }
        })
        ,catchError(this.processaError));
    } else {
      return next.handle(req).pipe(catchError(this.processaError));
    }
  }


  constructor() { }

  processaError(error: HttpErrorResponse){ // Este tipo é geralmente utilizado em Angular para representar uma resposta de erro de uma solicitação HTTP.
    let errorMessage = 'Erro desconhecido';
    if(error.error instanceof ErrorEvent) { // Isso geralmente significa que ocorreu um erro no lado do cliente (por exemplo, um problema de rede ou algo inesperado no navegador).
      console.error(error.error);
      errorMessage = 'Error: ' + error.error.error;
    } else { // Isso indica que o erro vem do lado do servidor (uma resposta HTTP com status de erro).
      errorMessage = 'Código: ' + error.error.code + '\n Mensagem: ' + error.error.error;
    }

    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}

/* Cada módulo é uma classe decorada com o decorator @NgModule, que fornece metadados de configuração que
indicam ao Angular como compilar e executar o código contido no módulo. */
@NgModule({
  providers : [{ // Provedores de serviços que estarão disponíveis para a injeção de dependência
    provide: HTTP_INTERCEPTORS, // HTTP_INTERCEPTORS é um token de injeção de dependência fornecido pelo Angular que permite adicionar interceptores HTTP personalizados.
    useClass: HeaderInterceptorService, //  especifica a classe que será usada como o interceptor.
    multi: true // indica que você pode fornecer múltiplos interceptores HTTP, permitindo que múltiplos interceptores sejam concatenados em uma cadeia, sendo aplicados na ordem em que foram registrados.
  },
  ],
})

export class HttpInterceptorModule { // define a classe do módulo.

}