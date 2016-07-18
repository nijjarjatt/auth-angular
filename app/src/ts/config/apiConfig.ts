export interface IApiConfig{
	apiUrl: string
}

export class ApiConfig implements IApiConfig{
	apiUrl: string;

	constructor() {
		this.apiUrl = 'http://localhost:3000/api/';
	}

	static factory(): IApiConfig{
		return new ApiConfig();
	}
}