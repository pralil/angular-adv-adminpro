import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario?: Usuario;
  public imagenSubir!: File; 
  public imgTemp: any;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService ) { 
    this.usuario = usuarioService.usuario;            
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario?.nombre , Validators.required ],
      email: [ this.usuario?.email , [ Validators.required, Validators.email ] ],
    });
  
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( resp => {
        const { email, nombre } = this.perfilForm.value;
        this.usuario!.nombre = nombre;
        this.usuario!.email = email;

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
       
      });
  }

  cambiarimagen( event: Event ) {
     const target = event.target as HTMLInputElement;
     const file: File = (target.files as FileList)[0]; 

     this.imagenSubir = file;

     if ( !file ) { return this.imgTemp = null }

     const reader = new FileReader();
     reader.readAsDataURL( file );

     reader.onloadend = () => {
        this.imgTemp = reader.result;
     }

     return true;
     
  }

  subirImagen() {
     
    this.fileUploadService
      .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario?.uid || '' )
      .then( img => {
        this.usuario!.img = img
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })   
  }
}
