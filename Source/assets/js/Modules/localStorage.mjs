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
// File:			localStorage.mjs				  //
// Dependency for:	editor.mjs						  //
// Description:		Handles local storage operations  //
// 					for saving and loading user		  //
// 					settings and data.				  //
////////////////////////////////////////////////////////

export const localStorage = {
	save: (key, value) => {
		try {
			const serializedValue = JSON.stringify(value);
			window.localStorage.setItem(key, serializedValue);
		} catch (error) {
			console.error('Error saving to localStorage:', error);
		}
	},
	load: (key) => {
		try {
			const serializedValue = window.localStorage.getItem(key);
			if (serializedValue === null) {
				return null;
			}
			return JSON.parse(serializedValue);
		} catch (error) {
			console.error('Error loading from localStorage:', error);
			return null;
		}
	},
	remove: (key) => {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error('Error removing from localStorage:', error);
		}
	},
	clear: () => {
		try {
			window.localStorage.clear();
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
	},
	exists: (key) => {
		try {
			return window.localStorage.getItem(key) !== null;
		} catch (error) {
			console.error('Error checking localStorage key existence:', error);
			return false;
		}
	},
	keys: () => {
		try {
			return Object.keys(window.localStorage);
		} catch (error) {
			console.error('Error getting localStorage keys:', error);
			return [];
		}
	},
	size: () => {
		try {
			return window.localStorage.length;
		} catch (error) {
			console.error('Error getting localStorage size:', error);
			return 0;
		}
	}
}