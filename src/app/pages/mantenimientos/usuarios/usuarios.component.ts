import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;

  public usuarios?: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSub: Subscription | undefined;

  public desde: number = 0;

  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSub?.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSub = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        console.log(img);
        this.cargarUsuarios(); 
      });
    
  }
  
  cargarUsuarios() {
    this.cargando = true;

    this.imgSub = this.usuarioService.cargarUsuarios(this.desde)
      .subscribe( ({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
    });
    
  }


  cambiarPagina( valor: number ) {
    this.desde += valor;
    
    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }
  
  buscar( termino: string ) {

    if ( termino.length === 0 ) { 
      return this.usuarios = this.usuariosTemp;
    }


    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( (resp: any) => {

          this.usuarios = resp;
          
        });
        return true;

  }

  eliminarUsuario( usuario: Usuario ) {

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Esta seguro de borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp => {
            
            Swal.fire(
              'Borrado!',
              `El usuario ${ usuario.nombre } fue borrado correctamente` ,
              'success'
            );

            this.cargarUsuarios();

            return true;
          });
      }
    })

    return true;
  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      });
  }

  abrirModal( usuario: Usuario ) {
    console.log(usuario);
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid!, usuario.img! );
  }
}
