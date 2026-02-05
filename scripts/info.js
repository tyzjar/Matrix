// Описание диагностической панели
let oInfo = {
	id: 'oInfo',
	f_oInfo: show_oInfo			// функция создания панели диагностики
};

function show_oInfo(config)
{
	console.log( config);
// еще не считана конфигурация
	if( typeof config == 'undefined')
		return;
		
	if( document.getElementById( this.id))
		return;

			
	let div_info = `<div  id="${this.id}">\n`;

	div_info += `<p><strong>Наименование ПО:</strong> ` + `&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<em>` +
				config.info.name_soft + `</em></p>`;
	div_info += `<p><strong>Идентификационное наименование ПО:</strong>` + `&emsp;<em>` + config.info.id_soft + `</em></p>`;
	div_info += `<p><strong>Версия: </strong>` + `&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<em>` +
				config.info.version_soft + `</em></p><br>`

	if( config.weight_platforms.length > 0) {
		let cnt = 0;
		for( let i=0; i < config.weight_platforms.length; ++i) {
			div_info += `<p><strong>Счетчик калибровок измерительного канала № ` + (i+1) +  `:</strong><em>&nbsp;&emsp;` + config.info.number_calibration[i] + `</em></p>`;
			cnt += config.info.number_calibration[i];
		}
		if( config.weight_platforms.length > 1)
			div_info += `<p><strong>Суммарный счетчик калибровок:</strong><em>&nbsp;&emsp;` + cnt + `</em></p>`;
	}

	div_info += `</div>\n`	
	let parent = document.getElementById( 'info_exit').parentElement;
	parent.insertAdjacentHTML('beforebegin', div_info);
}


