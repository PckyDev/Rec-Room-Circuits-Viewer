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
// File:			account.mjs						  //
// Dependency for:	editor.mjs						  //
// Description:		All logic related to the account, //
//					which is the UI element that	  //
// 					allows users to manage things	  //
// 					related to their account.	 	  //
////////////////////////////////////////////////////////

import { auth } from '../../Modules/RecRoom/auth.mjs';

const data = {
	states: {
		0: {
			id: 'accountWindowNotLoggedIn',
			element: null,
			interactiveElements: {
				loginBtn: {
					id: 'accountLoginBtn',
					element: null,
					onClick: async () => {
						await auth.start();
					}
				}
			}
		},
		1: {
			id: 'accountWindowLoggedIn',
			element: null,
			interactiveElements: {
				logoutBtn: {
					id: 'accountLogoutBtn',
					element: null,
					onClick: async () => {
						await auth.logout();
					}
				},
				username: {
					id: 'accountUsername',
					element: null,
				},
				image: {
					id: 'accountImage',
					element: null,
				}
			}
		}
	},
	recnet: {
		imageBaseUrl: 'https://img.rec.net/',
	}
};

export const account = {
	init: async () => {
		await account.load.elements();
		await account.load.state(0);

		// Listen for authentication events to update the account window state
		$(document).on('authLogin', (event, eventData) => {
			account.load.state(1);

			// Set the username in the account window
			data.states[1].interactiveElements.username.element.text(eventData.profile.username);

			// Set the profile image in the account window by fetching the image from the RecNet API
			const imageUrl = data.recnet.imageBaseUrl + eventData.profile.profileImage;
			data.states[1].interactiveElements.image.element.css('background-image', `url(${imageUrl})`);
		});
		$(document).on('authLogout', (event, eventData) => {
			account.load.state(0);
		});
	},
	load: {
		elements: async () => {
			// Load all necessary jQuery elements for the account window here and store them in the data structure
			$.each(data.states, (stateKey, state) => {
				state.element = $('#' + state.id);
				$.each(state.interactiveElements, (elementKey, element) => {
					element.element = $('#' + element.id);
					if (element.onClick) {
						element.element.on('click', element.onClick);
					}
				});
			});
		},
		state: async (stateNumber) => {
			// Hide all states
			$.each(data.states, (stateKey, state) => {
				state.element.hide();
			});
			// Show the specified state
			if (data.states[stateNumber]) {
				data.states[stateNumber].element.show();
			}
		}
	}
};