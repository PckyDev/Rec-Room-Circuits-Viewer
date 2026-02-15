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
// File:			leftNav.mjs						  //
// Dependency for:	editor.mjs						  //
// Description:		All logic related to the left	  //
// 					navigation bar, which is the UI	  //
// 					element that allows users to	  //
// 					navigate through different		  //
// 					windows.						  //
////////////////////////////////////////////////////////

import { store } from "../../Pages/Editor/data.mjs";
import { palette } from "../../Pages/Editor/palette.mjs";

export const leftNav = {
	init: async () => {
		// Close all windows first except the default one
		$(".sidebar-left .window").each(function() {
			const windowId = $(this).attr("id");
			if (windowId !== store.leftNav.windows.palette.id) {
				$(this).hide();
			}
		});

		await leftNav.load.nav();
		await leftNav.load.resizeBar();
	},
	functions: {
		resize: async (newWidth) => {
            const leftNavWindow = $("#" + store.leftNav.leftNavWindowId);
            const minWidth = 240;
            const maxWidth = $(window).width() - 2;

            if (newWidth < minWidth) newWidth = minWidth;
            if (newWidth > maxWidth) newWidth = maxWidth;
            leftNavWindow.css("width", newWidth + "px");

			palette.functions.resize(newWidth);

            $("body").trigger("resize-chips");
        },
		openWindow: async (windowName) => {
			const isMobile = $(window).width() < store.editor.mobile.breakpoint;
			const isLeftNavMobileOpen = $("#" + store.leftNav.leftNavWindowId).hasClass("open"); 
			const isSameWindow = store.leftNav.currentOpenWindow === windowName;

			if (isMobile) {
				if (isSameWindow) {
					// If the same window button is clicked, toggle the nav
					if (isLeftNavMobileOpen) {
						$("#" + store.leftNav.leftNavWindowId).removeClass("open");
					} else {
						$("#" + store.leftNav.leftNavWindowId).addClass("open");
					}
					return;
				} else if (!isLeftNavMobileOpen) {
					// If a different window button is clicked and nav is not open, open the nav
					$("#" + store.leftNav.leftNavWindowId).addClass("open");
				}
			} else {
				// If it's not mobile and the same window is clicked, do nothing
				if (isSameWindow) {
					return;
				}
			}
			
			// Close all windows first
			$(".sidebar-left .window").hide();
			
			// Then open the requested window
			$("#" + windowName + "Window").show();

			// Update current open window in store
			store.leftNav.currentOpenWindow = windowName;
		}
	},
	load: {
		nav: async () => {
			// Load nav bar elements and set up click triggers
			$.each(store.leftNav.nav, function (key, navItem) {
				const id = navItem.id;
				const element = $('#' + id);
				store.leftNav.nav[key].element = element;
				if (navItem.windowToOpen) {
					element.on('click', function () {
						leftNav.functions.openWindow(navItem.windowToOpen);
					});
				}
			});
		},
		resizeBar: async () => {
            const resizeBar = $("#" + store.leftNav.leftNavResizeBarId);
            let isResizing = false;

            resizeBar.on("mousedown", function (e) {
                e.preventDefault();
                isResizing = true;
            });

            $(document).on("mousemove", function (e) {
                if (!isResizing) return;
                if (store.editor.mobile.isMobile) return; // Disable resizing on mobile for now
                const newWidth = e.clientX;
                leftNav.functions.resize(newWidth);
            });

            $(document).on("mouseup", function () {
                if (isResizing) {
                    isResizing = false;
                }
            });
        }
	}
}