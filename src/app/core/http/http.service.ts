import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

type IRequestType = 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'PUT';
interface IRequestOptions {
	useUrlPrefix?: boolean;
	headers?: any;
	observe?: 'body' | 'events' | 'response';
	reportProgress?: boolean;
}
export function isObject(arg: any) {
	return typeof arg === 'object' && arg !== null && !(arg instanceof Array)
		? arg
		: false;
}

@Injectable()
export class HttpService {
	constructor(private _http: HttpClient) {}

	/**
	 * *Service for making backend calls
	 *
	 * @param method - request method
	 * @param url - request url
	 * @param params - request params
	 * @param options - request extra options
	 * @returns obserable
	 *
	 * @date 02 June 2021
	 * @developer Rahul Kundu
	 */
	private request(
		method: IRequestType,
		url: string,
		params?: any,
		options?: IRequestOptions
	): Observable<any> {
		let data;
		let reqUrl = url;
		let request$: Observable<any>;
		let reqOptions: any = { useUrlPrefix: true };

		if (isObject(options)) reqOptions = Object.assign(reqOptions, options);

		// Creating request headers
		if (reqOptions.headers) {
			reqOptions.headers = new HttpHeaders(reqOptions.headers);
		}

		// Assigninig params
		if (isObject(params)) {
			if (params instanceof FormData) {
				data = params;
				reqOptions.reportProgress = reqOptions.reportProgress || true;
			}
			data = params;
		}

		// Checking url prefix
		if (reqOptions.useUrlPrefix === true) {
			reqUrl = environment.host + '/' + url;
		}

		reqOptions.body = data;
		reqOptions.observe = reqOptions.observe || 'body';

		// Final Request
		request$ = this._http.request(method, reqUrl, reqOptions);

		request$.pipe(
			map((response: HttpResponse<any>) => {
				const responseObject = response.body;
				return responseObject;
			})
		);

		return request$;
	}

	/**
	 * *HTTP Post request
	 *
	 * @param url - request url
	 * @param params - request params
	 * @param options - request extra options
	 * @returns obserable
	 *
	 * @date 02 June 2021
	 * @developer Rahul Kundu
	 */
	public post(url: string, params?: any, options?: IRequestOptions) {
		return this.request('POST', url, params, options);
	}

	/**
	 * *HTTP Put request
	 *
	 * @param url - request url
	 * @param params - request params
	 * @param options - request extra options
	 * @returns obserable
	 *
	 * @date 02 June 2021
	 * @developer Rahul Kundu
	 */
	public put(url: string, params?: any, options?: IRequestOptions) {
		return this.request('PUT', url, params, options);
	}

	/**
	 * *HTTP Patch request
	 *
	 * @param url - request url
	 * @param params - request params
	 * @param options - request extra options
	 * @returns obserable
	 *
	 * @date 02 June 2021
	 * @developer Rahul Kundu
	 */
	public patch(url: string, params?: any, options?: IRequestOptions) {
		return this.request('PATCH', url, params, options);
	}

	/**
	 * *HTTP Get request
	 *
	 * @param url - request url
	 * @param options - request extra options
	 * @returns obserable
	 *
	 * @date 02 June 2021
	 * @developer Rahul Kundu
	 */
	public get(url: string, options?: IRequestOptions) {
		return this.request('GET', url, {}, options);
	}

	/**
	 * *HTTP Delete request
	 *
	 * @param url - request url
	 * @param params - request params
	 * @param options - request extra options
	 * @returns obserable
	 *
	 * @date 02 June 2021
	 * @developer Rahul Kundu
	 */
	public delete(url: string, params?: any, options?: IRequestOptions) {
		return this.request('DELETE', url, params, options);
	}
}
