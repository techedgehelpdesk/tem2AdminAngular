import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/http';
import { Subscription } from 'rxjs';
import { error } from 'console';
import { AuthenticationService } from 'src/app/core/authentication';
import { CookieService } from 'ngx-cookie-service';

interface ILogInForm {
  email:string,
  password:string,
  rememberMe:boolean
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isDisabled = false;
  public loginForm!:FormGroup;
  private submitted = false;
  private subscriptions: Subscription[] = [];
  private rememberMe = 'remember';
  constructor(
    private _fb: FormBuilder,
    private _http: HttpService,
    private _router: Router,
    private _authService:AuthenticationService,
    private _cookieService:CookieService
  ) {
    this.createLogInForm()
  }

  ngOnInit() {
  }

  private createLogInForm() {
    this.loginForm = this._fb.group({
      email: new FormControl('', [Validators.required,Validators.pattern(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]),
			password: new FormControl('', [Validators.required]),
			rememberMe: new FormControl(false)
    })
  }

  public hasFormControlError(field: string): boolean {
		const control = this.loginForm.get(field) as FormControl;
		if (
			(this.submitted && control.errors) ||
			(control.invalid && control.dirty)
		) {
			return true;
		}
		return false;
	}

  get formcontrol() {
		return this.loginForm.controls;
	}



  public loginOnSubmit(): boolean | void {
		if (!this.isDisabled) {
			const formvalue = this.loginForm.value as ILogInForm;
			this.submitted = true;
			// stop here if form is invalid
			if (this.loginForm.invalid) {
				return true;
			}
			//form is valid
			this.isDisabled = true;
			const param: ILogInForm = {
				email: formvalue.email,
				password: formvalue.password,
				rememberMe: formvalue.rememberMe,
			};
			// this._loader.useRef().start();
			this.subscriptions.push(
				this._authService.authenticate(param).subscribe({
					next: (apiResult) => {
						const authData = apiResult;
						if (formvalue.rememberMe) {
							this._cookieService.delete(this.rememberMe, '/');
							this._cookieService.set(
								this.rememberMe,
								JSON.stringify(param),
								{
									path: '/',
									expires: 365,
									sameSite: 'Lax'
								}
							);
						} else {
							this._cookieService.delete(this.rememberMe, '/');
						}
						this.isDisabled = false;
						// this._loader.useRef().complete();

						setTimeout(() => {
							authData.user_type === 'SSA'
								? this._router.navigate(['/nutrients'])
								: authData.user_type === 'SA'
								? this._router.navigate([
										'/stakeholders/students'
								  ])
								: this._router.navigate(['/foods/products']);
						}, 100);
					},
					error: (apiError) => {
						this.isDisabled = false;
            console.log(apiError);
            
						// this._toastr.error(
						// 	apiError.error.response.status.msg,
						// 	'Error',
						// 	{
						// 		timeOut: 5000,
						// 		tapToDismiss: false,
						// 		extendedTimeOut: 5000
						// 	}
						// );
						// this._loader.useRef().stop();
					}
				})
			);
		}
	}




  ngOnDestroy() {
  }



}
