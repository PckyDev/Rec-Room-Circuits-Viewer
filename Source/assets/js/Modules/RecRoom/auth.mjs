////////////////////////////////////////////////////////
//    _____           _          _____                //
//   |  __ \         | |        |  __ \               //
//   | |__) |__   ___| | ___   _| |  | | _____   __   //
//   |  ___/ _ \ / __| |/ / | | | |  | |/ _ \ \ / /   //
//   | |  | (_) | (__|   <| |_| | |__| |  __/\ V /    //
//   |_|   \___/ \___|_|\_\\__, |_____/ \___| \_/     //
//                          __/ |                     //
//                         |___/                      //
////////////////////////////////////////////////////////
// Project:			Rec Room Circuits Graph Editor    //
// File:			auth.mjs						  //
// Dependency for:	editor.mjs						  //
// Description:		Handles authentication and session//
// 					management for the Rec Room       //
// 					Circuits Graph Editor.            //
////////////////////////////////////////////////////////

import { localStorage } from '../../Modules/localStorage.mjs';

const api = {
	proxy: {
		enabled: false, // For development, we use a proxy to avoid CORS issues. In production, this can be set to false and the frontend can call the API directly.
		url: 'https://cors-anywhere.com/{url}'
	},
	baseUrl: 'https://pcky.dev/api',
	loginEndpoint: '/recroom/login?username={{username}}',
	validateEndpoint: '/recroom/validate?username={{username}}',
	authenticateEndpoint: '/recroom/authenticate?token={{token}}'
}

const elements = {
	loaded: false,
	recroomLoginModal: {
		id: 'recroomLoginModal',
		element: null,
		isOpen: false,
		states: {
			0: {
				id: 'recroomLoginState0',
				element: null,
				interactiveElements: {
					recroomLoginAccountNameInput: {
						id: 'recroomLoginAccountName',
						element: null
					},
					recroomLoginVerifyBtn: {
						id: 'recroomLoginVerify',
						element: null,
						onClick: async () => {
							const accountName = elements.recroomLoginModal.states[0].interactiveElements.recroomLoginAccountNameInput.element.val().trim();
							if (!accountName) {
								console.warn('Account name is required');
								return;
							}

							// Disable the verify button to prevent multiple clicks
							elements.recroomLoginModal.states[0].interactiveElements.recroomLoginVerifyBtn.element.addClass('disabled');

							auth.login(accountName);
						}
					}
				}
			},
			1: {
				id: 'recroomLoginState1',
				element: null,
				interactiveElements: {
					recroomValidateCodeInput: {
						id: 'recroomValidateCode',
						element: null
					},
					recroomValidateVerifyBtn: {
						id: 'recroomValidateVerify',
						element: null,
						onClick: async () => {
							const accountName = elements.recroomLoginModal.states[0].interactiveElements.recroomLoginAccountNameInput.element.val().trim();
							if (!accountName) {
								console.warn('Account name is required');
								return;
							}

							// Disable the verify button to prevent multiple clicks
							elements.recroomLoginModal.states[1].interactiveElements.recroomValidateVerifyBtn.element.addClass('disabled');

							auth.validate(accountName);
						}
					}
				}
			},
			2: {
				id: 'recroomLoginState2',
				element: null,
				interactiveElements: {
					recroomLoginState2Message: {
						id: 'recroomLoginState2Message',
						element: null
					}
				}
			}
		}
	},
	
};

function loadElements() {
	if (elements.loaded) return;

	Object.keys(elements).forEach(key => {
		if (key === 'loaded') return;
		const el = elements[key];
		el.element = $('#' + el.id);
		if (el.states) {
			Object.keys(el.states).forEach(stateKey => {
				const state = el.states[stateKey];
				state.element = $('#' + state.id);
				if (state.interactiveElements) {
					Object.keys(state.interactiveElements).forEach(interactiveKey => {
						const interactive = state.interactiveElements[interactiveKey];
						interactive.element = $('#' + interactive.id);
						if (interactive.onClick) {
							interactive.element.on('click', interactive.onClick);
						}
					});
				}
			});
		}
	});

	elements.loaded = true;
}

function loadModalState(stateNumber, options) {
	switch(stateNumber) {
		case 0:
			// Initial state, show account name input and verify button

			// Reset modal states back to 0 and clear any input fields
			Object.keys(elements.recroomLoginModal.states).forEach(stateKey => {
				const state = elements.recroomLoginModal.states[stateKey];
				state.element.hide();
				if (state.interactiveElements) {
					Object.keys(state.interactiveElements).forEach(interactiveKey => {
						const interactive = state.interactiveElements[interactiveKey];
						if (interactive.element.is('input')) {
							interactive.element.val('');
						} else if (interactive.element.is('button')) {
							interactive.element.removeClass('disabled');
						}
					});
				}
			});

			// Show the first state of the modal
			elements.recroomLoginModal.states[0].element.show();

			// Set the modal as open
			elements.recroomLoginModal.isOpen = true;

			// Show the login modal using jQuery Bootstrap's modal method
			elements.recroomLoginModal.element.modal('show');

			break;
		case 1:
			// Show verification code and instructions for bio verification and a button to verify the bio

			// Set the verification code in the input field
			elements.recroomLoginModal.states[1].interactiveElements.recroomValidateCodeInput.element.val(options.code);

			// Hide the first state and show the second state
			elements.recroomLoginModal.states[0].element.hide();
			elements.recroomLoginModal.states[1].element.show();

			// Set the modal as open
			elements.recroomLoginModal.isOpen = true;

			break;
		case 2:
			// Show success message and a button to close the modal

			// Set the message in the modal
			const message = options.message || '';
			elements.recroomLoginModal.states[2].interactiveElements.recroomLoginState2Message.element.html(message);

			// Hide the previous states and show the success state
			elements.recroomLoginModal.states[0].element.hide();
			elements.recroomLoginModal.states[1].element.hide();
			elements.recroomLoginModal.states[2].element.show();

			// Set the modal as open
			elements.recroomLoginModal.isOpen = true;

			break;
		default:
			// Invalid state number
			console.error('Invalid modal state number:', stateNumber);
	}
}

export const auth = {
	isAuthenticated: false,
	username: null,
	accountId: null,
	sessionToken: null,
	init: async () => {
		// On initialization, check if there's a session token in localStorage and try to authenticate with it
		const sessionToken = localStorage.load('recroomSessionToken');
		if (sessionToken) {
			await auth.authenticate(sessionToken);
		}
	},
	start: async () => {
		loadElements();
		if (!elements.loaded) {
			console.error('Failed to load auth elements');
			return;
		}

		// Show the login modal
		loadModalState(0);
	},
	login: async (accountName) => {
		// Call the login API endpoint using fetch to get a verification code in return
		const loginUrl = api.proxy.enabled ? api.proxy.url.replace('{url}', api.baseUrl + api.loginEndpoint.replace('{{username}}', encodeURIComponent(accountName))) : api.baseUrl + api.loginEndpoint.replace('{{username}}', encodeURIComponent(accountName));
		
		// Use fetch instead of jQuery's $.get for better error handling and async/await support
		await fetch(loginUrl)
			.then(response => response.json())
			.then(data => {
				if (data.ok) {
					if (elements.recroomLoginModal.isOpen) {
						// Go to the next state in the modal
						loadModalState(1, { code: data.code });
					} else {
						return data;
					}
				} else {
					loadModalState(2, { message: 'Login failed.<br>Please try again later.' });
					// console.error('Login failed:', data);
				}
			})
			.catch(error => {
				loadModalState(2, { message: 'An error occurred while trying to log in.<br>Please try again later.' });
				// console.error('Login request failed:', error);
			});
	},
	validate: async (accountName) => {
		// Call the validate API endpoint to check if the user has completed the bio verification step
		const validateUrl = api.proxy.enabled ? api.proxy.url.replace('{url}', api.baseUrl + api.validateEndpoint.replace('{{username}}', encodeURIComponent(accountName))) : api.baseUrl + api.validateEndpoint.replace('{{username}}', encodeURIComponent(accountName));

		// Use fetch instead of jQuery's $.get for better error handling and async/await support
		await fetch(validateUrl)
			.then(response => response.json())
			.then(data => {
				if (data.ok) {
					// Validation successful
					auth.isAuthenticated = true;
					auth.username = data.profile.username;
					auth.accountId = data.profile.accountId;
					auth.sessionToken = data.sessionToken;

					// Set localStorage item with the session token to keep the user logged in for future visits
					localStorage.save('recroomSessionToken', data.sessionToken);

					// Trigger a login event with the user profile data
					$(document).trigger('authLogin', { profile: data.profile });

					if (elements.recroomLoginModal.isOpen) {
						// Go to the next state in the modal
						loadModalState(2, { message: 'Login successful!<br>You can now remove the verification code from your bio and close this window.' });
					} else {
						return data;
					}
				} else {
					// Validation failed, possibly because the user hasn't completed the bio verification step yet
					loadModalState(2, { message: 'Validation failed.<br>Please make sure you have added the verification code to your bio and try again.' });
					// console.error('Validation failed:', data);
				}
			})
			.catch(error => {
				loadModalState(2, { message: 'An error occurred while validating your account.<br>Please try again later.' });
				// console.error('Validation request failed:', error);
			});
	},
	authenticate: async (sessionToken) => {
		// Call the authenticate API endpoint to verify the session token and get user profile information
		const authenticateUrl = api.proxy.enabled ? api.proxy.url.replace('{url}', api.baseUrl + api.authenticateEndpoint.replace('{{token}}', encodeURIComponent(sessionToken))) : api.baseUrl + api.authenticateEndpoint.replace('{{token}}', encodeURIComponent(sessionToken));

		// Use fetch instead of jQuery's $.get for better error handling and async/await support
		await fetch(authenticateUrl)
			.then(response => response.json())
			.then(data => {
				if (data.ok) {
					// Authentication successful
					auth.isAuthenticated = true;
					auth.username = data.profile.username;
					auth.accountId = data.profile.accountId;
					auth.sessionToken = sessionToken;

					// Set localStorage item with the session token to keep the user logged in for future visits
					localStorage.save('recroomSessionToken', sessionToken);

					// Trigger a login event with the user profile data
					$(document).trigger('authLogin', { profile: data.profile });
				} else {
					// Authentication failed, possibly because the session token is invalid or expired
					// console.error('Authentication failed:', data);
				}
			})
			.catch(error => {
				console.error('Authentication request failed:', error);
			});
	},
	logout: async () => {
		// Clear authentication data and remove session token from localStorage
		auth.isAuthenticated = false;
		auth.username = null;
		auth.accountId = null;
		auth.sessionToken = null;
		localStorage.remove('recroomSessionToken');
		// Trigger a logout event
		$(document).trigger('authLogout');
	}
};