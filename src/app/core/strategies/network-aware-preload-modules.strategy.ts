import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NetworkAwarePreloadModulesStrategy implements PreloadingStrategy {
	/**
	 * *Checking network speed &
	 * *Preloading lazy loaded modules
	 *
	 * @param router object
	 * @param fn as obserbale
	 * @date 20 Feb 2021
	 * @developer Rahul Kundu
	 */
	preload(route: Route, fn: () => Observable<any>): Observable<any> {
		const connection = (navigator as any).connection;

		/**
		 * !if the browser doesn't support it
		 */
		if (!connection) {
			return of(null);
		}

		/**
		 * !if user has set a reduced data usage
		 */
		if (connection.saveData) {
			return of(null);
		}

		/**
		 * !if user's connection is slow
		 */
		const speed = connection.effectiveType;
		const slowConnections = ['slow-2g', '2g'];
		if (slowConnections.includes(speed)) {
			return of(null);
		}
		return fn();
	}
}
