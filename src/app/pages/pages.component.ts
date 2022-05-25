import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  public linkTheme = document.querySelector('#theme');

  constructor( private settingsService: SettingsService ) { }

  ngOnInit(): void {


  }

}

