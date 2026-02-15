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
// File:			data.mjs						  //
// Dependency for:	editor.mjs						  //
// Description:		All data related to the circuit   //
// 					graph editor. Other modules       //
// 					should import and use this module //
// 					to access and manipulate data.    //
////////////////////////////////////////////////////////

export const store = {
	editor: {
		mobile: {
			breakpoint: 576,
			isMobile: $(window).width() < 576,
		},
		renderElement: null,
		selectedChipData: null,
		chipsJSON: {}
	},
	leftNav: {
		leftNavWindowId: "sideBarLeftWindow",
		leftNavResizeBarId: "sideBarLeftResizeBar",
		currentOpenWindow: 'palette',
		windows: {
			palette: {
				id: "paletteWindow",
			},
			account: {
				id: "accountWindow",
			},
		},
		nav: {
				accountWindowOpenBtn: {
					id: 'accountWindowOpen',
					element: null,
					windowToOpen: 'account',
				},
				paletteWindowOpenBtn: {
					id: 'paletteWindowOpen',
					element: null,
					windowToOpen: 'palette',
				},
			}
	},
	palette: {
		chipsJSON: null,
        templates: {
            paletteChipTemplate: {
                id: "paletteChipTemplate",
                html: null,
                placeholders: {
                    chipPaletteName: "{{paletteName}}",
                },
            },
        },
        resizeCols: [
            {
                min: 0,
                max: 350,
                chipsPerRow: 1,
            },
            {
                min: 351,
                max: 600,
                chipsPerRow: 2,
            },
            {
                min: 601,
                max: 800,
                chipsPerRow: 3,
            },
            {
                min: 801,
                max: 1000,
                chipsPerRow: 4,
            },
            {
                min: 1001,
                max: 1200,
                chipsPerRow: 5,
            },
        ],
        paletteChipsContainerId: "paletteChipsContainer",
        chipPaletteRenderId: "chipPaletteRender",
        searchInputId: "paletteSearchInput",
        paletteWindowId: "paletteWindow",
        paletteInfoModalId: "paletteInfoModal",
        chipOpenInfoModalBtnClass: "openInfoModal",
    },
	graph: {
        elements: {
            graphCanvasViewport: {
                id: "graphCanvasViewport",
                element: null,
            },
            graphCanvas: {
                id: "graphCanvas",
                element: null,
            },
            dragSelectionBox: {
                id: "dragSelectionBox",
                element: null,
                isDragging: false,
            },
        },
        cameraState: {
            tx: 0,
            ty: 0,
            scale: 1,
            minScale: 0.15,
            maxScale: 6,
            dragging: false,
            lastX: 0,
            lastY: 0,
        },
        BASE_MAJOR: 100,
        BASE_MINOR: 25,
        rafPending: false,
        _nextNodeId: 0,
        _nodeClipboard: null,
        _pasteSerial: 0,
        _history: {
            undo: [],
            redo: [],
            max: 50,
            inBatch: false,
            batchRecorded: false,
            restoring: false,
        },
        nodes: [],
        // Example node object structure:
        // {
        //     id: 'node-0',
        //     element: jQueryElement,
        //     selected: false,
        //     object: {
        // 	       chipName: 'Absolute Value',
        //         paletteName: 'Absolute Value',
        //         nodeDescs: [
        //             {
        //                 name: 'Absolute Value',
        //                 typeParams: [ { name: 'T', type: '(float, int)'} ],
        //				   inputs: [
        //                     { name: 'Value', type: 'T', description: '' }
        //				   ],
        //				   outputs: [
        //                     { name: 'Result', type: 'T', description: '' }
        //				   ]
        //             }
        //         ]
        //     }
        // }
        connections: [],
        // Example connection object structure:
        // {
        //     id: 'connection-0',
        //     from: { nodeId: 'node-1', portId: 'port-1' },
        //     to: { nodeId: 'node-2', portId: 'port-2' },
        //     element: jQueryElement
        // }
    }
};