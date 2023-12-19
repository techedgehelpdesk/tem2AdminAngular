/**
 * *Ensuring a module loaded once
 *
 * @param targetModule A target module
 * @date: 22 Feb 2021
 * @developer: Rahul Kundu
 */
export class EnsureModuleLoadedOnceGuard {
	constructor(targetModule: any) {
		if (targetModule) {
			throw new Error(
				`${targetModule.constructor.name} has already been loaded. Import this module in the AppModule only.`
			);
		}
	}
}

/**
 * *Throwing error if module already loaded
 *
 * @param targetModule Angular module module
 * @param moduleName Module name
 * @date: 22 Feb 2021
 * @developer: Rahul Kundu
 */
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(
			`${moduleName} has already been loaded. Import Core modules in the AppModule only.`
		);
	}
}
