import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';

@Injectable()
export class PreloadModulesStrategy implements PreloadingStrategy {
	/**
	 * *Preloading lazy loaded routes
	 *
	 * @param router object
	 * @param fn as obserbale
	 * @date 20 Feb 2021
	 * @developer Rahul Kundu
	 */
	preload(route: Route, fn: () => Observable<any>): Observable<any> {
		if (route.data && route.data.preload) {
			/**
			 * *Proceeds with preloading
			 */
			return fn();
		} else {
			/**
			 * *Proceeds without preloading
			 */
			return of(null);
		}
	}
}
