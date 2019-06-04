import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService, KuiCoreConfig, KuiCoreConfigToken } from '@knora/core';
import { MenuItem } from '../declarations/menu-item';


const { version: appVersion } = require('../../../../package.json');

@Component({
  selector: 'app-info-menu',
  templateUrl: './info-menu.component.html',
  styleUrls: ['./info-menu.component.scss']
})
export class InfoMenuComponent implements OnInit {

  loading: boolean = true;

  appVersion: string = appVersion;
  apiVersion: string;
  akkaVersion: string;

  apiStatus: boolean;

  versions: MenuItem[] = [
    {
      label: 'Kuirl v ' + this.appVersion,
      icon: 'kuirl_icon',
      route: 'https://github.com/dhlab-basel/Kuirl/releases/tag/v' + this.appVersion
    },
    {
      label: 'Knora v ',
      icon: 'knora_icon',
      route: 'https://github.com/dhlab-basel/Knora/releases/tag/v'
    },
    {
      label: 'Akka v ',
      icon: 'akka_icon',
      route: 'https://github.com/akka/akka-http/releases/tag/v'
    }
  ];

  constructor (private _apiService: ApiService,
    @Inject(KuiCoreConfigToken) public config: KuiCoreConfig,
    private _domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    private _http: HttpClient, ) {

    // create tool icons to use them in mat-icons
    this._matIconRegistry.addSvgIcon(
      'kuirl_icon',
      this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/kuirl-icon.svg')
    );
    this._matIconRegistry.addSvgIcon(
      'knora_icon',
      this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/knora-icon.svg')
    );
    this._matIconRegistry.addSvgIcon(
      'akka_icon',
      this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/akka-icon.svg')
    );
  }

  ngOnInit() {

    console.log('simple log output');
    console.warn('simple warn output');
    console.error('simple error output');

    this._http.get<HttpResponse<any>>(this.config.api + '/v2/authentication', { observe: 'response' })
      .subscribe(
        (resp: HttpResponse<any>) => {
          // console.log('Stackoverflow', resp.headers.get('Server'));
          this.readVersion(resp.headers.get('Server'));
          this.apiStatus = true;
        },
        (error: any) => {
          this.readVersion(error.headers.get('Server'));
          console.error(error);
          // console.log('Stackoverflow', error.headers.get('Server'));
          this.apiStatus = false;
        }
      );

  }

  readVersion(v: string) {

    const versions: string[] = v.split(' ');

    this.apiVersion = versions[0].split('/')[1];
    this.akkaVersion = versions[1].split('/')[1];

    this.versions[1].label += this.apiVersion;
    this.versions[1].route += this.apiVersion;
    this.versions[2].label += this.akkaVersion;
    this.versions[2].route += this.akkaVersion;

    this.loading = false;

  }
}
