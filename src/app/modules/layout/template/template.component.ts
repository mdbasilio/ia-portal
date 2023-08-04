import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  form: FormGroup;
  videoUrl: string = '';
  year = new Date().getFullYear();
  id_request: string = '';

  constructor(
    private fb: FormBuilder,
    private _svcEndpoint: EndpointService,
    private spinner: NgxSpinnerService,
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

      this._svcEndpoint.httpChat(body).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.id_request = resp.id;
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.spinner.hide();
        }
      });
    }
  }

  mostrarHablante() {
    console.log(this.id_request);
    this.spinner.show();
    this._svcEndpoint.httpObtenerHablante(this.id_request).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.cd.detectChanges();
        this.videoUrl = resp;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      }
    });
  }
}
