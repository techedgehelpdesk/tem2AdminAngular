import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { throwError, Observable, of, BehaviorSubject } from 'rxjs';
import {
	timeout,
	catchError,
	switchMap,
	filter,
	take,
	finalize
} from 'rxjs/operators';
import { AuthenticationService } from '../authentication';
import { environment } from 'src/environments/environment';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor(
		private _router: Router,
		private _authService: AuthenticationService
	) {}

	private isRefreshingToken = false;
	private timeOut = 300000;
	private tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		/**
		 * *Interceptor for handling error
		 *
		 * @date 19 Mar 2021
		 * @developer Rahul Kundu
		 */

		// catching error without retry
		return next.handle(request).pipe(
			timeout(this.timeOut),
			catchError((error) => this.errorHandler(error, request, next))
		);
	}

	/**
	 * *Handling error based on response codes
	 *
	 * @param http event response
	 * @date 10 Feb 2021
	 * @developer Rahul Kundu
	 */
	private errorHandler(
		error: HttpErrorResponse,
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		/**
		 * !in development mode printing errors in console
		 */
		const httpErrorCode: number = error['status'];

		// if (!environment.production) {
		// 	if (httpErrorCode === StatusCodes.UNAUTHORIZED) {
		// 		this._authService.logout();
		// 		this._router.navigate(['/']);
		// 	}
		// 	console.log('Request error ' + error);
		// } else {
		// 	if (httpErrorCode === StatusCodes.UNAUTHORIZED) {
		// 		this._authService.logout();
		// 		this._router.navigate(['/']);
		// 	}
		// }

		switch (httpErrorCode) {
			case StatusCodes.BAD_REQUEST:
				return throwError(error);
			case StatusCodes.UNAUTHORIZED:
				return this.handle401Error(request, next);
			case StatusCodes.NOT_FOUND:
				return throwError(error);
			case StatusCodes.INTERNAL_SERVER_ERROR:
				return throwError(error);
			default:
				console.log('Sorry! something went wrong. ' + error);
				return throwError(error);
		}
	}

	/**
	 * *Handling 401 error and getting refresh token
	 *
	 * @param request http request
	 * @param next next to handle
	 * @returns obserable of HttpEvent
	 *
	 * @date 04 Aug 2021
	 * @developer Rahul Kundu
	 */
	private handle401Error(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		if (!this.isRefreshingToken) {
			this.isRefreshingToken = true;
			// Reset here so that the following requests wait until the token
			// comes back from the refreshToken call.
			this.tokenSubject.next(null);
			return this._authService.getRefreshToken().pipe(
				switchMap((apiResult) => {
					const data: any = apiResult.response.data;
					this._authService.updateRefreshedToken(data);

					this.tokenSubject.next(data.token);
					return next.handle(
						this.addTokenInHeader(request, data.token)
					);
				}),
				catchError((error) => {
					// If there is an exception calling 'refreshToken', bad news so logout.
					this._authService.logout();
					this._router.navigate(['/']);
					return throwError('');
				}),
				finalize(() => {
					this.isRefreshingToken = false;
				})
			);
		} else {
			return this.tokenSubject.pipe(
				filter((token) => token !== null),
				take(1),
				switchMap((token) => {
					return next.handle(this.addTokenInHeader(request, token));
				})
			);
		}
	}

	/**
	 * *Adding new token in request header
	 *
	 * @param request http request
	 * @param next next to handle
	 * @returns obserable of HttpEvent
	 *
	 * @date 04 Aug 2021
	 * @developer Rahul Kundu
	 */
	addTokenInHeader(
		request: HttpRequest<any>,
		token: string
	): HttpRequest<any> {
		return request.clone({
			setHeaders: { Authorization: 'Bearer ' + token }
		});
	}
}
