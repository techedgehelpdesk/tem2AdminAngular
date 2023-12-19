import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
// import { LoggerService } from '@core/services';
// import { AuthenticationService } from '@core/authentication';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router
} from '@angular/router';
import { AuthenticationService } from '../authentication';

@Injectable()
export class LogInGuard implements CanActivate {
	constructor(
		private _router: Router,
		private _authService: AuthenticationService
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {

        console.log('called');
        
		const isLoggedIn = this._authService.isAuthenticated();
        console.log(isLoggedIn);
        
		if (!isLoggedIn) {
			// authorised so return true
			return true;
		}

		// not logged in so redirect to login page
		console.log('Not authenticated, redirecting...');
		this._router.navigate(['/dashboard']);

		return false;
	}
}
