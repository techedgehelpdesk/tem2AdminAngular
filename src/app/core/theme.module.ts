import {
	NgModule,
	Optional,
	SkipSelf,
	ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './ensureModuleLoadedOnceGuard';

// Third party packages
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


const BASE_MODULES = [CommonModule];
const THEME_PROVIDERS = [
	CookieService,
];

const PLUGINS_E = [
	ToastrModule,
];

@NgModule({
	imports: [...BASE_MODULES],
	exports: [...BASE_MODULES, ...PLUGINS_E],

})
export class ThemeModule {
	/**
	 * !Ensuring that TemplateModule is only loaded into AppModule
	 * *Looks for the module in the parent injector to see if it's already been loaded (only load once)
	 *
	 * @param module as parameter
	 */
	constructor(@Optional() @SkipSelf() parentModule: ThemeModule) {
		throwIfAlreadyLoaded(parentModule, 'ThemeModule');
	}

	static forRoot(): ModuleWithProviders<ThemeModule> {
		return {
			ngModule: ThemeModule,
			providers: [...THEME_PROVIDERS]
		};
	}
}
