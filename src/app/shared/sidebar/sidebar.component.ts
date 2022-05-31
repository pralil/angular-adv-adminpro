import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  public usuario: Usuario;
  menuItems!: any[];

  constructor( private sidebarService: SidebarService,
               private usuarioService: UsuarioService,
               private router: Router ) { 

    this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario!;
    
  }

  logout() {
    this.usuarioService.logout();
  }

}