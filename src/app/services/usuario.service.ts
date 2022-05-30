import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { map, Observable, of } from 'rxjs';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router) { 

    // this.googleInit();            
  }

  
  googleInit() {

    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '738223440398-kn2h8eo8jh51etc278m8hsom72fgv75q.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
    });

  }              



  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    

    // this.auth2.signOut().then(() => {
    // });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token );
      }), 
      map( (resp: any) => true),
      catchError( error => of(false) ) 
    );

  }

  crearUsuario( formData: RegisterForm ) {
  
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token )
        })
      );
    
  }

  login( formData: LoginForm ) {
  
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token )
        })
      );
    
  }

  loginGoogle( token: any ) {

    return this.http.post(`${ base_url }/login/google`, { token } )
        .pipe(
          tap( (resp: any ) => {
            localStorage.setItem('token', resp.token )
          })
        );
  }
 
}
