import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './ensureModuleLoadedOnceGuard';



// Auth Admin layout imports


//Component import for layouts


const MODULES = [CommonModule, RouterModule];



@NgModule({
	imports: [...MODULES],
	exports: [],
	declarations: []
})
export class TemplateModule {
	/**
	 * !Ensuring that TemplateModule is only loaded into AppModule
	 * *Looks for the module in the parent injector to see if it's already been loaded (only load once)
	 *
	 * @param module as parameter
	 * @date 20 Mar 2021
	 * @developer Rahul Kundu
	 */
	constructor(@Optional() @SkipSelf() parentModule: TemplateModule) {
		throwIfAlreadyLoaded(parentModule, 'ThemeModule');
	}
}
