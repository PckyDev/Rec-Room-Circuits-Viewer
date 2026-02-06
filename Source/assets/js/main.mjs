import { chip } from './Modules/chip.mjs';

$(function () {
	const _ = {
		data: {
			renderElement: null,
		},
		init: async () => {
			await _.load.circuitsv2();
			await _.load.renderElement();
			await _.load.selectMenu();
			// Example usage of chip function
			chip(_.data.renderElement, _.data.Circuits[Object.keys(_.data.Circuits)[0]]);
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
				_.data.selectMenuElement.on('change', function () {
					let selectedChipName = $(this).val();
					let selectedChipData = _.data.Circuits[selectedChipName];
					$('#render').empty();
					chip(_.data.renderElement, selectedChipData);
				});
			}
		}
	}

	_.init();
});