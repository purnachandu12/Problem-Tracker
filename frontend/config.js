// Configure your backend base URL here
// Example: http://localhost:8080
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8080';

export const config = {
	apiBaseUrl: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
};

export const endpoints = {
	problems: () => `${config.apiBaseUrl}/api/problems`,
	problemById: (id) => `${config.apiBaseUrl}/api/problems/${encodeURIComponent(id)}`,
	pattern: (pattern) => `${config.apiBaseUrl}/api/pattern/${encodeURIComponent(pattern)}`,
	difficulty: (difficulty) => `${config.apiBaseUrl}/api/difficulty/${encodeURIComponent(difficulty)}`,
	title: (title) => `${config.apiBaseUrl}/api/problem/${encodeURIComponent(title)}`,
};
