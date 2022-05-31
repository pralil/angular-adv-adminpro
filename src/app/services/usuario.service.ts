import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { map, Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario?: Usuario;


  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone ) { 

    // this.googleInit();            
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario!.uid || ''; 
  }  

  
  googleInit() {

    gapi.load('auth2', () => {
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

    //   this.ngZone.run( () => {
    //     this.router.navigateByUrl('/login');     

    //   })
    // });
  }

  validarToken(): Observable<boolean> {
    

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      tap( (resp: any) => {
        const { nombre, email, img, google, role, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        
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

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {

    data = {
      ...data,
      role: 'USER_ROLE'
    
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  
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
