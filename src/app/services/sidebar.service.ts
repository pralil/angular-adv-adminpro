import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // public menu = [];

  // cargaMenu() {
  //   this.menu = JSON.parse( localStorage.getItem('menu')!) || [];
  // }

  menu: any[] = [
  {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
         { titulo: 'Main', url: '/' },
         { titulo: 'ProgresBar', url: 'progress' },
         { titulo: 'Gráficas', url: 'grafica1' },
         { titulo: 'Promesas', url: 'promesas' },
         { titulo: 'Rxjs', url: 'rxjs' },
       ]
     },

     {
       titulo: 'Mantenimiento',
       icono: 'mdi mdi-folder-lock-open',
       submenu: [
         { titulo: 'Usuarios', url: 'usuarios' },
         { titulo: 'Hospitales', url: 'hospitales' },
         { titulo: 'Medicos', url: 'medicos' },
        
       ]
     },
   ];

  constructor() { }
}
