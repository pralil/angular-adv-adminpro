import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, retry } from 'rxjs';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital; 
  public medicoSeleccionado!: Medico; 


  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .subscribe( ({ id }) => this.cargarMedico( id ));


    this.medicoForm = this.fb.group({
      nombre: [ '', Validators.required ],
      hospital: [ '', Validators.required ]
      
    })

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe( hospitalId => {

        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
        

      })


  } 
  
  cargarMedico( id: string ) {

    if ( id === 'nuevo') {
      return; 
    }

    this.medicoService.cargarMedicoPorId( id )
      .pipe(
        delay(100)
      )
      .subscribe( medico => {

        if ( !medico ) {
          return this.router.navigateByUrl('/dashboard/medicos');
        }

        const {nombre, hospital:{_id}} = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue( { nombre, hospital:_id } );
        return true;
      })
  }

  guardarMedico() {

    const { nombre } = this.medicoForm.value; 

    if ( this.medicoSeleccionado ){
      //Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          Swal.fire('Médico Actualizado', `Se actualizo médico: ${ nombre }  exitosamente`, 'success' );
        })

    } else {
      // Crear
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe( (resp: any) => {
          Swal.fire('Médico Guardado', `Se ha creado médico: ${ nombre }  exitosamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
        })

    }

  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe( (resp: Hospital[]) => {
        this.hospitales =  resp;  
      })
  }




}
