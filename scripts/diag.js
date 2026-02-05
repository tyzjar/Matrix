// Описание диагностической панели
let oDiag = {
	id: 'oDiag',
	f_oDiag: show_oDiag,		// функция создания панели диагностики
	f_SensorDownCnt: showSensorDownCnt	// показать кол-во срабатываний датчика
};

function show_oDiag()
{
// еще не считана конфигурация
	if( typeof config == 'undefined')
		return;
		
	if( document.getElementById( this.id))
		return;
	let div_diag = `<div  id="${this.id}">\n`;

// Датчики колеса
	if( config.sensors.length > 0) {
		div_diag += `<p>`;
		for( let i=0; i < config.sensors.length; ++i) {
			div_diag += `WD`+i+`   `;
		}
		div_diag += `<\p>`;
		div_diag += `<p>`;
		for( let i=0; i < config.sensors.length; ++i) {
			div_diag += `<div id='d_wd_`+i+`'>`;
			if( typeof Q.STATE == 'undefined')
				div_diag += `000`;
			else
				div_diag += `` + Q.STATE[i];
			div_diag += `</div>`;
		}
		div_diag += `<\p>`;
		
	}
	div_diag += `</div>\n`	
	let parent = document.getElementById( 'diag_exit').parentElement;
	parent.insertAdjacentHTML('beforebegin', div_diag);
}

function showSensorDownCnt(n,cnt)
{
	let sensor = 'd_wd_' + n;
	let elem = document.getElementById( sensor);
	if( typeof elem != 	'undefined')
		elem.textContent  = cnt;
}

