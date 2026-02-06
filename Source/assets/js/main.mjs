import { chip } from './Modules/chip.mjs';

$(function () {
	const _ = {
		data: {
			renderElement: null,
			selectedChipData: null,
			options: {
				size: 1
			}
		},
		init: async () => {
			await _.load.circuitsv2();
			await _.load.renderElement();
			await _.load.selectMenu();
			_.render.chip();
		},
		load: {
			circuitsv2: async () => {
				// Get circuitsv2 json
				const res = await fetch('https://raw.githubusercontent.com/tyleo-rec/CircuitsV2Resources/refs/heads/master/misc/circuitsv2.json');
				const data = await res.json();
				_.data.circuitsv2 = data;
				// console.log('CircuitsV2 data loaded', _.data.circuitsv2);
				
				let converted = {};
				$.each(_.data.circuitsv2.Nodes, async function (index, chip) {
					if (chip.DeprecationStage !== 'Deprecated') {
						let chipName = chip.ReadonlyPaletteName.replace(/\s/gm, '');
						converted[chipName] = chip;
					}
				});
				_.data.Circuits = converted;
				// console.log('Converted CircuitsV2 data', _.data.Circuits);
			},
			renderElement: async () => {
				_.data.renderElement = $('#render');
			},
			selectMenu: async () => {
				_.data.selectMenuElement = $('#select-menu');
				$.each(_.data.Circuits, function (chipName, chipData) {
					let option = $('<option></option>')
						.attr('value', chipName)
						.text(chipData.ReadonlyPaletteName);
					_.data.selectMenuElement.append(option);
				});
				_.data.selectedChipData = _.data.Circuits[_.data.selectMenuElement.val()];
				_.data.selectMenuElement.on('change', function () {
					let selectedChipName = $(this).val();
					let selectedChipData = _.data.Circuits[selectedChipName];
					_.data.selectedChipData = selectedChipData;
					$('#render').empty();
					_.render.chip();
				});
			}
		},
		render: {
			chip: () => {
				chip(_.data.renderElement, _.data.selectedChipData, _.data.options);
			}
		}
	}

	_.init();
});