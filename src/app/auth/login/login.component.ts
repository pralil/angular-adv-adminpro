import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ] ],
    password: ['', Validators.required ], 
    remember: [false]
  });  

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }
  
  
  ngOnInit(): void {
     //this.renderButton();
  }



  login() {

    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {
        if (this.loginForm.get('remember')?.value ) {
          localStorage.setItem('email', this.loginForm.get('email')?.value );
        } else {
          localStorage.removeItem('email');
        }

        // NAvegar al dashboard
        this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });


  }


  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
  }

  startApp() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '738223440398-kn2h8eo8jh51etc278m8hsom72fgv75q.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });

      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element: HTMLElement | any) {
    
    this.auth2.attachClickHandler(element, {},
        (googleUser: { getAuthResponse: () => { (): any; new(): any; id_token: any; }; }) => {
          const id_token = googleUser.getAuthResponse().id_token;
          // console.log( id_token );
          this.usuarioService.loginGoogle( id_token )
            .subscribe( resp => {
              // NAvegar al dashboard
              this.ngZone.run( () => {
                this.router.navigateByUrl('/');
              })
            });

          //TODO: Mover al dashboard

          
           
        }, (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }



}
