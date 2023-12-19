import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../http';
import { StatusCodes } from 'http-status-codes';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class AuthenticationService {
	constructor(
		private _http: HttpService,
		private _cookieService: CookieService
	) {}

	private credentials: string = 'refresh_token';
	private otpCredentials: string = 'user-otp-info';
	private refreshTokenCredentials: string = 'refresh_token';

	/**
	 * *Authenticates with the selected strategy
	 * *Stores user info in the storage
	 *
	 * @param data login credentials
	 * @returns observable
	 *
	 */
	public authenticate(data: any): Observable<any> {
		return this._http.post('authenticate/signIn', data).pipe(
			tap((result:any) => {
				const authData: any = result;
				if (result.status === StatusCodes.OK) {
					const storedData: string = this._cookieService.get(
						'remember'
					);
					this._cookieService.deleteAll();
					if (storedData && data.remember) {
						this._cookieService.set(
							'remember',
							storedData,
							{
								path: '/',
								expires: 365,
								sameSite: 'Lax'
							}
						);
					}
					this._cookieService.set(
						this.credentials,
						JSON.stringify(authData),
						{
							path: '/',
							expires: 365,
							sameSite: 'Lax'
						}
					);
					console.log('sett');
					
				}
				return authData;
			})
		);
	}

	/**
	 * *Handling forget password
	 *
	 * @param data email for forget password
	 * @returns observable
	 *
	 */
	public forgetPassword(email: string): Observable<any> {
		const param = { email: email };
		return this._http.post('users/forgotpass', param);
	}

	/**
	 * *Verifying OTP on forget password
	 *
	 * @param data credentials for otp verification
	 * @returns observable
	 *
	 */
	public sendOTP(data: any): Observable<any> {
		return this._http.post('users/verify-otp', data);
	}

	/**
	 * *Resetting user password
	 *
	 * @param data for reset pwd
	 * @returns observable
	 *

	 */
	public resetPassword(data: any): Observable<any> {
		const param = {
			email: data.email,
			password: data.password
		};
		return this._http.post('users/reset-password', param);
	}

	/**
	 * *Sign outs user
	 * *Removes details from the token storage
	 *
	 * @returns observable of boolean
	 */
	public logout(): void {
		this._cookieService.delete(this.credentials, '/');
	}

	/**
	 * *Getting data for OTP from cookie
	 *
	 * @returns obj of type IOTPStorage
	 */
	public getOTPinfo(): any | null {
		const storage: string = this._cookieService.get(this.otpCredentials);

		if (storage && storage !== '') {
			const parsed: any = JSON.parse(storage);
			return parsed;
		} else {
			return null;
		}
	}

	/**
	 * *Returning current user detail from storage
	 *
	 * @returns observable of current user
	 */
	public getUserInfo(): Observable<any> {
		const savedCredentials: any = this.getUser();
		return observableOf(savedCredentials);
	}

	/**
	 * *Removing current user detail from storage
	 *
	 */
	public clearUserInfo() {
		this._cookieService.delete(this.credentials);
	}

	/**
	 * *Getting current user token from storage
	 *
	 * @returns JWT Token
	 */
	public getToken(): string {
		const savedCredentials: any = this.getUser();
		return savedCredentials != null ? savedCredentials.token : '';
	}

	/**
	 * *Getting refreshed token
	 *
	 */
	getRefreshToken(): Observable<any> {
		const savedCredentials: any = this.getUser();

		return this._http.post('users/regenerate-token', {
			refreshToken: savedCredentials.refresh_token
		});
	}

	/**
	 * *Updating new tokens in cookie
	 *
	 * @param authData refresh auth result
	 */
	updateRefreshedToken(authData: any): void {
		const savedCredentials: any = this.getUser();
		const updated = {
			...savedCredentials,
			...authData
		};
		this._cookieService.set(this.credentials, JSON.stringify(updated));
	}

	/**
	 * *Getting current user's role
	 *
	 * @returns current user role
	 */
	getUserRole(): string {
		const savedCredentials: any = this.getUser();
		const userRole = this.isAuthenticated()
			? savedCredentials.user_type
			: '';
		return userRole;
	}

	/**
	 * *If user is authenticated
	 *
	 * @returns boolean if authenticated
	 */
	isAuthenticated(): boolean {
		if (this._cookieService.get(this.credentials)) {
			return true;
		}
		return false;
	}

	/**
	 * *getting user from storage
	 *
	 * @returns current user's data
	 */
	private getUser(): any {
		const user = this._cookieService.get(this.credentials) as string;
		const savedCredentials: any =
			user !== '' ? JSON.parse(user) : null;
		return savedCredentials;
	}
}
