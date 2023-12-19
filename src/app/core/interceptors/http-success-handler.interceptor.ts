import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpResponse,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication';


@Injectable()
export class HttpSuccessInterceptor implements HttpInterceptor {
	constructor(private _authService: AuthenticationService) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		/**
		 * *Intercepting success requests
		 *
		 * @date 10 Feb 2021
		 * @developer Rahul Kundu
		 */
		return next.handle(request).pipe(
			map((response: HttpEvent<any>) => {
				if (response instanceof HttpResponse) {
					const statusCode: number = response['status'];
					const responseObject = response.body;
					responseObject.status = statusCode;
				}

				return response;
			})
		);
	}
}
