import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from '../../services/file-upload.service';
import { ModalImagenService } from '../../services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  

  constructor( public modalImagenService: ModalImagenService,
               public fileUploadService: FileUploadService ) { }

  public imagenSubir!: File; 
  public imgTemp: any;

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
    
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

  const id = this.modalImagenService.id;
  const tipo = this.modalImagenService.tipo;
     
  this.fileUploadService
    .actualizarFoto( this.imagenSubir, tipo!, id! )
    .then( img => {
      
      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');

      this.modalImagenService.nuevaImagen.emit(img);

      this.cerrarModal();
    }).catch( err => {
      console.log(err);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    })   
}
}
