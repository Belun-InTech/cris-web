import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/core/services';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];
  password!: string;
  loginForm: FormGroup;
  loading = false;

  constructor(
    public layoutService: LayoutService,
    private _fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.loginForm = this._fb.group({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => this.messageService.clear())
  }


  login(form: FormGroup): void {
    this.loading = true;
    this.authService.authServer(form.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']).then(() => {
          this.loginForm.reset();
        });
      },
      error: err => {
        this.loginForm.reset();
        this.messageService.add({ severity: 'error', summary: '', detail: err });
      },
      complete: () => this.loading = false
    });
  }

}
