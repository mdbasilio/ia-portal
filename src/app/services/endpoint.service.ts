import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, filter, interval, map, switchMap, take } from 'rxjs';
import { RequestHablante } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private url_hablante: string = '';
  private url_botsonic: string = '';
  private authorization: string = '';
  private apiKey: string = '';

  constructor(private http: HttpClient) {
    this.load();
  }

  public load() {
    this.http.get('assets/config.json').subscribe({
      next: (envResponse: any) => {
        this.url_hablante = envResponse['url_hablante'];
        this.authorization = envResponse['authorization'];
        this.url_botsonic = envResponse['url_botsonic'];
        this.apiKey = envResponse['apiKey'];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }


  httpChat<T>(data: any): Observable<T> {
    const body = {
      "question": data.text,
      "chat_history": []
    };

    const headers = new HttpHeaders({
      'key': 'token',
      'token': this.apiKey
    });
    const endpointurl_botsonic = `${this.url_botsonic}`;

    return this.http.post<T>(endpointurl_botsonic, body, { headers }).pipe(switchMap((info: any) => {
      const answer = info[0].data.answer;
      return this.httpCrearHablante<T>(answer);
    }));
  }


  get httpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.authorization
      })
    };

    return httpOptions;
  }

  httpCrearHablante<T>(text: string): Observable<T> {
    const data: RequestHablante = {
      script: {
        type: 'text',
        provider: {
          type: 'microsoft',
          voice_id: 'es-EC-LuisNeural'
        },
        subtitles: false,
        input: text
      },
      source_url: 'https://iroutestorageface.blob.core.windows.net/fotos/0725202310445778DavidDuenas.JPG',
      driver_url: 'bank://lively/driver-06/original'
    }
    const endpointurl_hablante = `${this.url_hablante}`;
    return this.http.post<T>(endpointurl_hablante, data, this.httpOptions).pipe(map((resp: any) => {
      const id = resp.id;
      return id;
    }));
  }

  httpObtenerHablante<T>(id: string): Observable<T> {
    const endpointurl_hablante = `${this.url_hablante}/${id}`;
    return interval(900).pipe(
      switchMap(() => this.http.get<any>(endpointurl_hablante, this.httpOptions)),
      filter(response => !!response.result_url),
      take(1),
      map(response => response.result_url)
    );
  }


  crearVideo(data: any) {
    const url = `http://localhost:7071/api/SpeakerFunction`;
    return this.http.post<any>(url, data);
  }
}
