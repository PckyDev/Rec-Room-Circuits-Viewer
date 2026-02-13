import { ui } from '/Modules/RecRoom/ui.mjs';
import { chip } from '/Modules/chip.mjs';
import { palette } from '/Pages/Editor/palette.mjs';
import { graph } from '/Pages/Editor/graph.mjs';
import { store } from '/Pages/Editor/data.mjs';


$(function () {
	const _ = {
		init: async () => {
			await ui.init.inputs();
			await _.load.mobile();
			await chip.init();
			await chip.getAll({ combineResults: true }).then(data => {
				store.editor.chipsJSON = data;
			});
			await palette.init();
			await graph.init();
		},
		load: {
			renderElement: async () => {
				_.data.renderElement = $('#render');
			},
			selectMenu: async () => {
				_.data.selectMenuElement = $('#select-menu');
				$.each(_.data.Circuits, function (chipName, chipData) {
					let option = $('<option></option>')
						.attr('value', chipName)
						.text(chipData.paletteName);
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
			},
			mobile: async () => {
				if (!store.editor.mobile.isMobile) return;

				// Load nav bar for mobile
				$.each(store.editor.mobile.nav, function (key, navItem) {
					const id = navItem.id;
					const element = $('#' + id);
					store.editor.mobile.nav[key].element = element;
					if (navItem.clickTrigger) {
						element.on('click', function () {
							$('body').trigger(navItem.clickTrigger);
						});
					}
				});
			}
		},
		render: {
			chip: async () => {
				const options = {
					log: true,
					size: 1
				}
				// chip.render(_.data.renderElement, _.data.selectedChipData, options);
				// await chip.render(_.data.renderElement, 'List Create With', options);
				await chip.render(_.data.renderElement, $('#select-menu').val(), options);
			}
		}
	}

	_.init();
});