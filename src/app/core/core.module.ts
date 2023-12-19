import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EnsureModuleLoadedOnceGuard } from './ensureModuleLoadedOnceGuard';

//Interceptor import
import { HTTPInterceptorProvider } from './interceptors';


import { HttpService } from './http';

import { AuthenticationService } from './authentication';
import { AuthGuard } from './guards/authGuard';
import { LogInGuard } from './guards';
import { CommonService } from './services/common.service';

//Guard imports


const PROVIDERS = [
	DatePipe,
	HttpService,
	AuthenticationService,
	AuthGuard,
	LogInGuard,
	CommonService
];

@NgModule({
	imports: [CommonModule, RouterModule, HttpClientModule],
	exports: [RouterModule, HttpClientModule],
	providers: [...PROVIDERS, HTTPInterceptorProvider]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
	/**
	 * !Ensuring that CoreModule is only loaded into AppModule
	 * *Looks for the module in the parent injector to see if it's already been loaded (only load once)
	 *
	 * @param module as parameter
	 * @date 20 July 2021
	 * @developer Rahul Kundu
	 */
	constructor(
		@Optional() @SkipSelf() parentModule: CoreModule,
	) {
		super(parentModule);

	}
}
