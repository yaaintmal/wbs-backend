const authServiceUrl = import.meta.env.VITE_APP_AUTH_SERVER_URL;
const originalFetch = window.fetch;

if (!authServiceUrl) {
	console.error('No auth service set');
}

window.fetch = async (url, options, ...rest) => {
	let res = await originalFetch(
		url,
		{
			...options,
			// this can cause errors if fetching to 3rd-party APIs with different CORS policies
			credentials: 'include'
		},
		...rest
	);
	const authHeader = res.headers.get('www-authenticate');

	if (authHeader?.includes('token_expired')) {
		console.log('ATTEMPT REFRESH');
		const refreshRes = await originalFetch(`${authServiceUrl}/refresh`, {
			method: 'POST',
			credentials: 'include'
		});

		if (!refreshRes.ok) throw new Error('Login required');

		res = await originalFetch(
			url,
			{
				...options,
				// this can cause errors if fetching to 3rd-party APIs with different CORS policies
				credentials: 'include'
			},
			...rest
		);
	}
	return res;
};

export { authServiceUrl };
