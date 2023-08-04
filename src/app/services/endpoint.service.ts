import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, filter, interval, map, switchMap, take } from 'rxjs';
import { RequestHablante } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private url_fn: string = '';

  constructor(private http: HttpClient) {
    this.load();
  }

  public load() {
    this.http.get('assets/config.json').subscribe({
      next: (envResponse: any) => {
        this.url_fn = envResponse['url_fn'];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }


  crearVideo(data: any) {
    const url = `${this.url_fn}`;
    return this.http.post<any>(url, data);
  }
}
