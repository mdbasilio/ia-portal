import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  form: FormGroup;
  videoUrl: string = '';
  id_request: string = '';
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private _svcEndpoint: EndpointService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      event.preventDefault();
      this.crearHablante();
    }
  }

  crearHablante() {
    if (this.form.valid) {
      this.spinner.show();
      this.id_request = '';
      this.videoUrl = '';
      
      const body = this.form.value;

      this._svcEndpoint.crearVideo(body).subscribe({
        next: (resp: any) => {
          this.cd.detectChanges();
          this.videoUrl = resp;
          this.spinner.hide();
        },
        error: (error: any) => {
          console.error(error);
          this.spinner.hide();
        }
      })
      /* this._svcEndpoint.httpChat(body).subscribe({
        next: (resp: any) => {
          console.log(resp);
          let id: string = resp;
          this._svcEndpoint.httpObtenerHablante(id).subscribe({
            next: (resp: any) => {
              console.log(resp);
              this.cd.detectChanges();
              this.videoUrl = resp;
              //this.loadAndPlayVideo(this.videoUrl);
              this.spinner.hide();
            },
            error: (error) => {
              console.error(error);
              this.spinner.hide();
            }
          });
        },
        error: (err) => {
          console.log(err);
          this.spinner.hide();
        }
      }); */
    }
  }

  /* loadAndPlayVideo(url: string) {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    if (!videoPlayer.src) {
      this.renderer.setAttribute(videoPlayer, 'src', url);
      videoPlayer.load(); 
      videoPlayer.play(); 
    } else {
      videoPlayer.play();
    }
  } */
}
