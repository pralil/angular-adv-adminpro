import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];

  public imgSub: Subscription | undefined;

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSub = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        console.log(img);
        this.cargarMedicos(); 
      });
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) { 
      return this.cargarMedicos();
    }


    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( resp => {

          this.medicos = resp;
          
        });
        return true;

  }

  cargarMedicos() {
    this.cargando = true;
    
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
      });
    
  } 

  guardarCambios( medico: Medico ) {

    this.medicoService.actualizarMedico( medico )
      .subscribe( resp => {
        Swal.fire( 'Actualizado', medico.nombre, 'success' );
      });

  }

  eliminarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Esta seguro de borrar un médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.borrarMedico( medico._id! )
          .subscribe( resp => {
            
            Swal.fire(
              'Borrado!',
              `El médico ${ medico.nombre } fue borrado correctamente` ,
              'success'
            );

            this.cargarMedicos();

            return true;
          });
      }
    })
  }

  abrirModal( medico: Medico ) {
    
    this.modalImagenService.abrirModal( 'medicos', medico._id!, medico.img! );
  }

}
