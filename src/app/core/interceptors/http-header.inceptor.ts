import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication';


@Injectable()
export class HttpAuthHeaderInterceptor implements HttpInterceptor {
	constructor(private _authService: AuthenticationService) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		/**
		 * *Adding Authorization token in header
		 *
		 * @date 10 Feb 2021
		 * @developer Rahul Kundu
		 */

		const headersConfig: any = {};

		/**
		 * If token found setting it in header
		 */
		const token: string = this._authService.getToken();

		if (token) {
			headersConfig['Authorization'] = 'Bearer ' + token;
		}

		const HTTPRequest = request.clone({ setHeaders: headersConfig });
		return next.handle(HTTPRequest);
	}
}
