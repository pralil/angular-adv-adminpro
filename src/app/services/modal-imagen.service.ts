import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { BusquedasService } from './busquedas.service';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {
  public tipo?: 'usuarios'|'medicos'|'hospitales';
  public id?: string;
  public img?: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>(); 

  private _ocultarModal: boolean = true;

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'x'
  ) {

    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    

    //localhost:3000/api/upload/usuarios/4029554f-eda6-4f4b-bf73-ddcad175d00e.jpg
    if ( img.includes('https') ) {
      this.img = img; 
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }` 
    }

    //const url = `${ base_url }/upload/${ this.tipo }/${ this.img }`

  }
  
  cerrarModal() {
    this._ocultarModal = true;
  }


  constructor() { }
}
