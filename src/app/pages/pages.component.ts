import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from 'src/app/services/sidebar.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  public linkTheme = document.querySelector('#theme');

  constructor( private settingsService: SettingsService,
               private sidebarService: SidebarService ) { }

  ngOnInit(): void {
    //customInitFunctions();

    // this.sidebarService.cargaMenu();
  }

}

