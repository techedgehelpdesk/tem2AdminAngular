import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthHeaderInterceptor } from './http-header.inceptor';
import { HttpErrorInterceptor } from './http-error-handler.interceptor';
import { HttpSuccessInterceptor } from './http-success-handler.interceptor';

export const HTTPInterceptorProvider = [
	{
		provide: HTTP_INTERCEPTORS,
		useClass: HttpAuthHeaderInterceptor,
		multi: true
	},
	{
		provide: HTTP_INTERCEPTORS,
		useClass: HttpSuccessInterceptor,
		multi: true
	},
	{
		provide: HTTP_INTERCEPTORS,
		useClass: HttpErrorInterceptor,
		multi: true
	}
];
