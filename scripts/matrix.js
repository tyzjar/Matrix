jQuery(function() {

	let window_width = 822;
	let window_height = 522;



// конфигурация (берется с контроллера по запросу) 
let config,
	_Q={}	// Q, ChangeIO
	;

let print=1;
function print_log(msg) {
    if (print) {
		console.log (msg);
	}
}

function fnv1aHash(str) {
  const prime = 0x811C9DC5;
  let hash = prime;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// Создание объекта для запроса к серверу 
function createXmlHttp()
{
// если есть функция XMLHttpRequest	
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } 
    else if (window.ActiveXObject) {
    //Методы взаимодействия в Ajax  61
        var aversions = ['MSXML2.XMLHttp.5.0','MSXML2.XMLHttp.4.0','MSXML2.XMLHttp.3.0','VMSXML2.XMLHttp','Microsoft.XMLHttp'];
        
        for (var i = 0; i < aversions.length; i++) {
            try {
//                var oXmlHttp = new ActiveXObject(aVersions[i]);
                return (new ActiveXObject(aVersions[i]));
            } catch (oError) {
                // ничего не делать
            }
        }
        throw new Еггог('Невозможно создать объект XMLHttp.');
    }
}

function sendRequest( oXmlHttp, url, request, handleResponse) {
	if( oXmlHttp) {
		print_log( 'sendRequest: ' + url + ' : ' + request);
		oXmlHttp.open( "POST", url, true );
//		oXmlHttp.open( "GET", url, true );
		oXmlHttp.setRequestHeader( 'Content-Type', "text/html" );
//		oXmlHttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8' );
		oXmlHttp.onreadystatechange = function(){ handleResponse( oXmlHttp); };
		oXmlHttp.send( request);
	}
}

function printError(error, explicit) {
    print_log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
}



	var mqtt = { hostname: get_appropriate_ws_url(), port: 8080 };
	var topic_configuration = "matrix/configuration";
	var topic_status = "matrix/status";
	var topic_wgt = "matrix/wgt";
	var topic_cmd     = "matrix/cmd";
	var topic_cmd_response     = "matrix/cmd_response";


let	widthScreen = 800;

//Web Socket
let ws;
let flagWsOpen = 0;

// должна быть такой же как в стиле для элемента 'train'
let wTtrain = 630; 
// мой идентификатор
let myID;
// Таймер
let timerId;
// Переменная для сохранения парсера ответа
let parse_p;

// модальное окно 
let modal_train;
let modal_car;
let modal_reset_result;
let modal_x10;

// Объекты обработки
// Пакеты из MRCP
	
let A={}, 	// A, State
	B={},	// B, BeginWeight
	C={},	// C, DirectMove
	D={},	// D, TypeWagon
	E={},	// E, Speed
	F=[],	// F, CurWeight
	G={},	// G, ResultWagon
	H={},	// H, Error
	I={},	// I, Results
	K={},	// K, PositionLoco
	L={},	// L, MethodWS
	M={},	// M, NumberWE
	N={},	// N, NumberWagonS
	Q_IO={},	// Q, ChangeIO
	R={};	// R, WorkWD


    
// Возвращает случайное целое число между min (включительно) и max (не включая max)
// Использование метода Math.round() даст вам неравномерное распределение!
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function f_tune_enter()
{
	document.getElementById('p_matrix').style.width = '0px';
	document.getElementById('p_matrix').style.display = 'none';
	document.getElementById('p_tune').style.width = widthScreen + 'px';
	document.getElementById('p_tune').style.display = 'block';
	
// создание и показ панели	
	oTune.f_oTune(); 
}

function f_tune_exit()
{
	document.getElementById('p_tune').style.width = '0px';
	document.getElementById('p_tune').style.display = 'none';
	document.getElementById('p_matrix').style.width = widthScreen +'px';
	document.getElementById('p_matrix').style.display = 'block';
}

function f_result_enter()
{
	document.getElementById('p_matrix').style.width = '0px';
	document.getElementById('p_matrix').style.display = 'none';
	document.getElementById('p_results').style.width = widthScreen + 'px';
	document.getElementById('p_results').style.display = 'block';
	
	// создание и показ панели	
	oResults.f_oResults(); 
}

function f_result_exit()
{
	document.getElementById('p_results').style.width = '0px';
	document.getElementById('p_results').style.display = 'none';
	document.getElementById('p_matrix').style.width = widthScreen + 'px';
	document.getElementById('p_matrix').style.display = 'block';
}


function f_alarm_enter()
{
	document.getElementById('p_matrix').style.width = '0px';
	document.getElementById('p_matrix').style.display = 'none';
	document.getElementById('p_alarms').style.width = widthScreen + 'px';
	document.getElementById('p_alarms').style.display = 'block';
}

function f_alarm_exit()
{
	document.getElementById('p_alarms').style.width = '0px';
	document.getElementById('p_alarms').style.display = 'none';
	document.getElementById('p_matrix').style.width = widthScreen + 'px';
	document.getElementById('p_matrix').style.display = 'block';
}

function f_log_enter()
{
	document.getElementById('p_matrix').style.width = '0px';
	document.getElementById('p_matrix').style.display = 'none';
	document.getElementById('p_logs').style.width = widthScreen + 'px';
	document.getElementById('p_logs').style.display = 'block';

	// создание и показ панели	
	oLogs.f_oLogs(); 

}

function f_log_exit()
{
	document.getElementById('p_logs').style.width = '0px';
	document.getElementById('p_logs').style.display = 'none';
	document.getElementById('p_matrix').style.width = widthScreen + 'px';
	document.getElementById('p_matrix').style.display = 'block';
}

/*
function f_diag_enter()
{
	document.getElementById('p_matrix').style.width = '0px';
	document.getElementById('p_matrix').style.display = 'none';
	document.getElementById('p_diagnostics').style.width = widthScreen + 'px';
	document.getElementById('p_diagnostics').style.display = 'block';
	
// создание и показ панели	
	oDiag.f_oDiag(); 	
}
*/
/*
function f_diag_exit()
{
	document.getElementById('p_diagnostics').style.width = '0px';
	document.getElementById('p_diagnostics').style.display = 'none';
	document.getElementById('p_matrix').style.width = widthScreen + 'px';
	document.getElementById('p_matrix').style.display = 'block';
}
*/

function f_info_enter()
{
	document.getElementById('p_matrix').style.width = '0px';
	document.getElementById('p_matrix').style.display = 'none';
	document.getElementById('p_info').style.width = widthScreen + 'px';
	document.getElementById('p_info').style.display = 'block';
	
// создание и показ панели	
	oInfo.f_oInfo(config); 	
}

function f_info_exit()
{
	document.getElementById('p_info').style.width = '0px';
	document.getElementById('p_info').style.display = 'none';
	document.getElementById('p_matrix').style.width = widthScreen + 'px';
	document.getElementById('p_matrix').style.display = 'block';
}

function f_on_new_train()
{
  	modal_train.style.display = "block";
}

function f_add_train()
{
  	modal_train.style.display = "none";
    if( sendmsg( "NEW_TRAIN"))
    	writeStatus( ' Отправлена команда NEW_TRAIN');
}

function f_no_add_train()
{
  	modal_train.style.display = "none";
}

function f_on_reset_result()
{
  	modal_reset_result.style.display = "block";
/*
    if( sendmsg( "NEW_TRAIN"))
    	writeStatus( ' Отправлена команда NEW_TRAIN');
*/
}
function f_reset_result()
{
	modal_reset_result.style.display = 'none';
    if( sendmsg( "RESET_RESULT"))
    	writeStatus( ' Отправлена команда RESET_RESULT');
	document.getElementById('results_train').innerHTML = 'Результаты сброшены';    
}

function f_no_reset_result()
{
	modal_reset_result.style.display = 'none';
}

function f_on_confirmation_result()
{
// таблица с результатами
	let table = document.getElementById('table_result');
	print_log( "f_on_confirmation_result(): table = " + table);
	
	if( table) {
		let msg = 'CONFIRMATION_RESULT:{'
   		for (let r = 1, n = table.rows.length; r < n; r++) {
   			let num = table.rows[r].cells[0].innerHTML;
   			let type = table.rows[r].cells[1].children[0];
   			print_log( r + ') Num:' + num + " type: " + type.value);
   			msg = msg + type.value;
        }
        msg = msg + '}';
    	if( sendmsg( msg))
    		writeStatus( ' Отправлена команда ' + msg);
    }
}

function togle_dynamic_mode( display)
{
    document.getElementById('state').style.display=display;
    document.getElementById('label_speed').style.display=display;
    document.getElementById('speed').style.display=display;

// В динамике
	if( display == 'block') {
		hide_wagon();
		reset_wagons( 1);

		document.getElementById('new_car').style.display = 'none';
		document.getElementById('static_window').style.display = 'none';
		document.getElementById('scroll_left').style.display = 'none';
		document.getElementById('scroll_right').style.display = 'none';

		document.getElementById('label_target_weight').style.display = 'none';
		document.getElementById('input_weight').style.display = 'none';
		document.getElementById('start_process').style.display = 'none';
		document.getElementById('stop_process').style.display = 'none';

    // подрежим ПОЛУАВТОМАТ ?
		if( A.ModeWeightMove == 'S' ) {
			if( config.setting_parameters.flagDirect) {
    			document.getElementById('direct').style.cursor = 'pointer';
    		}
			if( config.setting_parameters.flagPositionLoco) {
    			document.getElementById('loco').style.cursor = 'pointer';
    		}
    		if( config.setting_parameters.flagAxis) {
    		}
			if( A.StateInMove == 'E') {
				document.getElementById('confirmation').style.display = 'block';
				document.getElementById('reset').style.display = 'block';
				document.getElementById('reset').onclick = f_on_reset_result;
			}
			else {
				document.getElementById('confirmation').style.display = 'none';
				document.getElementById('reset').style.display = 'none';
			}
			    		
		}
		else {
   			document.getElementById('direct').style.cursor = 'default';
   			document.getElementById('loco').style.cursor = 'default';
		}
		
// В состоянии взвешивания?
    	if( A.StateInMove == 'R') {
			document.getElementById('stop').textContent = 'СТОП';
			document.getElementById('stop').style.display=display;
        	document.getElementById('stop').onclick = f_on_stop;
    	}
// В состоянии остановки? 
    	else  if(A.StateInMove == 'S') { 
    // подрежим ПОЛУАВТОМАТ ?
			if( A.ModeWeightMove == 'S' ) {
	   	 		document.getElementById('stop').textContent = 'СТАРТ';
	    		document.getElementById('stop').style.display=display;
	    		document.getElementById('stop').onclick = f_on_start;
			}
			else {
	    		document.getElementById('stop').style.display='none';
			}
		}
		else  {
	    	document.getElementById('stop').style.display='none';
		}
   		document.getElementById('new_train').style.display='none';
    }
    else {
   		document.getElementById('stop').style.display='none';
   		document.getElementById('new_train').style.display='block';
       	document.getElementById('new_train').onclick = f_on_new_train;
		document.getElementById('static_window').style.display = 'block';
 	}   		
    	
    document.getElementById('revers').style.display=display;
    document.getElementById('alarm').style.display=display;
}

function getCurDateTime()
{
	var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
 	   month = '0'+month;
    }
    if(day.toString().length == 1) {
       day = '0'+day;
    }   
    if(hour.toString().length == 1) {
       hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
       minute = '0'+minute;
    }
    if(second.toString().length == 1) {
       second = '0'+second;
    }   
    var dateTime = day + '/' +month +'/' + year + ' ' + hour + ':' + minute + ':' + second;   
    return dateTime;
}

let msg_last = '';
function writeStatus( msg)
{
  let ul = document.getElementById('msg_list');
  if( msg == msg_last) {	  
  	let lastchild = ul.lastChild;
  	lastchild.innerHTML=getCurDateTime() + msg;
  }
  else {
  	let li = document.createElement("li");
  	li.appendChild(document.createTextNode(getCurDateTime() + msg));
  	ul.appendChild(li);
  }
	msg_last = msg;
}

// Нажатие на СТАРТ
function f_on_start()
{
    print_log( 'on_start');
    if( sendmsg( 'START'))
    	writeStatus( ' Отправлена команда START');
}

// Нажатие на СТОП
function f_on_stop()
{
    print_log( 'on_stop');
    if( sendmsg( 'STOP'))
    	writeStatus( ' Отправлена команда STOP');
}


// Отправка команды на переключение режимов взвешивания (В СТАТИКЕ/В ДВИЖЕНИИ)
function f_on_mode()
{
    print_log( 'on_mode');
    if( sendmsg( 'STATMTN'))
    	writeStatus( ' Отправлена команда STATMTN');
}

// Отправка команды на создание нового вагона
function f_new_car()
{
  	modal_car.style.display = "block";
//  	
//    print_log( 'new_car');
//    if( sendmsg( 'NEW_CAR'))
//    	writeStatus( ' Отправлена команда NEW_CAR');
    	
}


function f_add_car()
{
  	modal_car.style.display = "none";
    if( sendmsg( 'NEW_CAR'))
    	writeStatus( ' Отправлена команда NEW_CAR');
}

function f_no_add_car()
{
  	modal_car.style.display = "none";
}


// Нажатие на "В СТАТИКЕ"    
function f_on_mode_static()
{
    print_log('on_mode_static');
    this.parentNode.removeChild(this);

	var body = document.getElementById('body_mode');
    body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"mode_move\">В ДВИЖЕНИИ</div>');
    var mode_move = document.getElementById('mode_move');
    print_log( mode_move);
    mode_move.onclick = f_on_mode_move;
//    modeMatrix='ДВИЖЕНИЕ';
	var modeMove = "АВТОМАТ";
    body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"sub_mode_move\">' + modeMove +'</div>');
    document.getElementById('sub_mode_move').onclick = f_on_sub_mode_move;
    togle_dynamic_mode( 'block');
}   

// Нажатие на "В ДВИЖЕНИИ"    
function f_on_mode_move()
{
    print_log('on_mode_move');
    this.parentNode.removeChild(this);
    var sub_mode_move = document.getElementById('sub_mode_move');
    sub_mode_move.parentNode.removeChild(sub_mode_move);

    var body = document.getElementById('body_mode');
    body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"mode_static\">В СТАТИКЕ</div>');
    document.getElementById('mode_static').onclick = f_on_mode_static;
	
    togle_dynamic_mode( 'none');
}
    
// Нажатие на "АВТОМАТ/ПОЛУАВТОМАТ"    
function f_on_sub_mode_move()
{
    print_log( 'on_sub_mode_move');
    if( sendmsg( 'TRIGAUTO'))
    	writeStatus( ' Отправлена команда TRIGAUTO');
}
    

// Инициализация значений по умолчанию 
function setDefault() {
//	document.getElementById('num_train_val').textContent = '№ ?????';
	document.getElementById('num_train_val').textContent = '№ 12345';
//	document.getElementById('train_weight').textContent = '';
	document.getElementById('state').style.display = 'none';
	document.getElementById('stop').style.display = 'none';
	document.getElementById('wagons').style.display = 'none';
	document.getElementById('static_window').style.display = 'none';

	document.getElementById('confirmation').style.display = 'none';
	document.getElementById('reset').style.display = 'none';
	

//    document.ondblclick = null; //function() { console.log('dbl'); return false; }
    document.onselectstart = function () {return false;}    // для запрета выделения текста в текстовых элементвх

}

function hide_wagon()
{
// в случае сброса процесса взвешивания оставим текущее положение, на котором произошел сброс или остановлено взвешивание
	if( A.StateInMove == 'T' || A.StateInMove == 'S') 
		return;
		
	var left_2 = document.getElementById('img_left_2');
	var left_4 = document.getElementById('img_left_4');
	var left_6 = document.getElementById('img_left_6');
	var left_8 = document.getElementById('img_left_8');
	var right_2 = document.getElementById('img_right_2');
	var right_4 = document.getElementById('img_right_4');
	var right_6 = document.getElementById('img_right_6');
	var right_8 = document.getElementById('img_right_8');
	var loco_left_right = document.getElementById('img_loco_left_right');
	var loco_right_left = document.getElementById('img_loco_right_left');
	
	loco_left_right.style.opacity = 0;
	loco_right_left.style.opacity = 0;
	left_2.style.opacity = 0;
	right_2.style.opacity = 0;
	left_4.style.opacity = 0;
	right_4.style.opacity = 0;
	left_6.style.opacity = 0;
	right_6.style.opacity = 0;
	left_8.style.opacity = 0;
	right_8.style.opacity = 0;
}

//------- Функции MRCP, вызываемые только из обработчика пришедших пакетов

// --------------------------Состояние контроллера
function a_packet(packet)
{
	var state;

	writeStatus( ' Получено состояние контроллера');
//	document.getElementById('msg_status').textContent = 'Получено состояние контроллера.';

	A.NumberWeightSystem = packet.N;
	A.ModeWeight = packet.M;
	A.ModeWeightMove = packet.R;
	A.StateInMove = packet.S;

	if( typeof A.StateScale == 'undefined')
	    A.StateScale = [];

	A.StateScale[0] = packet.S1;
	A.StateScale[1] = packet.S2;
	A.StateScale[2] = packet.S3;
	A.StateScale[3] = packet.S4;
	A.NumberTtainMove = packet.N1;
	A.NumberTtainStatic = packet.N2;
	
	if( A.CurModeWeight == 'undefined')
		A.CurModeWeight = 0;
		
	print_log( A);

// Показать активные и неактивные элементы весов	
	a_scales_on_off();
	
// В Статике	
	if( A.ModeWeight == 'S') 
		a_mode_static();
// В Движении
	else if( A.ModeWeight == 'M')
		a_mode_move();
}

// Отображение активных и неактивных элементов весов
function a_scales_on_off()
{
	if( typeof config != 'undefined') {
		for( var j=0; j< config.weight_platforms.length; ++j) {
//			print_log( config.weight_platforms[j].name + '   ' + ('StateScale'+(j+1) + ' ' + A['StateScale'+(j+1)]));
			var classList = document.getElementById(config.weight_platforms[j].name).classList;
//			if(A['StateScale'+(j+1)] == 0) {
			if(A.StateScale[j]== 0) {
				if(	classList.contains('platforma_off'))
					continue;
				else {
					if( classList.contains( 'platforma_on') )
						classList.remove('platforma_on');
					classList.add('platforma_off')
				}
			}
//			else if( A['StateScale'+(j+1)] == 1) {
			else if( A.StateScale[j] == 1) {
				if(	classList.contains('platforma_on'))
					continue;
				else {
					if( classList.contains( 'platforma_off') )
						classList.remove('platforma_off');
					classList.add('platforma_on')
				}
				
			}
		}
	}
}


// Отображение в статике
function a_mode_static()
{
	if( typeof N.Wagons == 'undefined')
		N.Wagons = [];
		
	if( A.ModeWeight == A.CurModeWeight)
		return;
	
	A.CurModeWeight =  A.ModeWeight;
	let mode_move = document.getElementById('mode_move');
	if( mode_move)
		mode_move.parentNode.removeChild(mode_move);
	let sub_mode_move = document.getElementById('sub_mode_move');
	if( sub_mode_move)
		sub_mode_move.parentNode.removeChild(sub_mode_move);
	
	let body = document.getElementById('body_mode');
	body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"mode_static\">В СТАТИКЕ</div>');
	document.getElementById('mode_static').onclick = f_on_mode;
	document.getElementById('num_train_val').textContent = '№ ' + A.NumberTtainStatic;

	document.getElementById('direct_val').onclick = f_on_direct;
	document.getElementById('loco_pos').onclick = f_on_loco_pos;
	document.getElementById('direct').style.cursor = 'pointer';
	document.getElementById('loco').style.cursor = 'pointer';

	togle_dynamic_mode( 'none');

	document.getElementById('wagons').style.display = 'block';
	document.getElementById('new_car').style.display = 'block';
	document.getElementById('new_car').onclick = f_new_car;

	document.getElementById('scroll_left').style.display = 'block';
	document.getElementById('scroll_right').style.display = 'block';
	
	if( typeof config.dosing != 'undefined') {
		document.getElementById('label_target_weight').style.display = 'block';
		document.getElementById('input_weight').style.display = 'block';
		document.getElementById('start_process').style.display = 'block';
		document.getElementById('stop_process').style.display = 'block';
	}
	
	document.getElementById('dyn_axis').style.display = 'none';
	document.getElementById('results_train').style.display = 'none';
}

// Отображение в движении
function a_mode_move()
{
	var state,
	    modeMove;
	
// состояние при взвешивании в движении
	switch( A.StateInMove ) {
	case 'W':	state = 'ОЖИДАНИЕ'; 
	    hide_wagon();break;
	case 'R':	state = 'ВЗВЕШИВАНИЕ'; break;
	case 'S':	state = 'ОСТАНОВЛЕН'; break;
	case 'T':	state = 'СБРОШЕН'; break;
	case 'E':	state = 'РЕЗУЛЬТАТЫ'; break;
	default:	state = 'Ошибка: ' + A.StateInMove; break;
	}
	document.getElementById('state_val').textContent = state;
//	if( A.StateInMove == 'E') {
//		return;
//	}
	
	switch( A.ModeWeightMove) {
	case 'A':	modeMove = 'АВТОМАТ'; 
				document.getElementById('direct_val').onclick = 0;
				document.getElementById('loco_pos').onclick = 0;
				document.getElementById('dyn_axis').style.display = 'none';
				break;
	case 'S':	modeMove = 'ПОЛУАВТОМАТ'; 
// если в конфигурации разрешено устанавливать направление движения	
				if( config.setting_parameters.flagDirect == 1) {
					document.getElementById('direct_val').onclick = f_on_direct;
					document.getElementById('direct_auto').onclick = f_direct_auto;
					document.getElementById('direct_lr').onclick = f_direct_lr;
					document.getElementById('direct_rl').onclick = f_direct_rl;
				}
				if(config.setting_parameters.flagPositionLoco == 1) {
					document.getElementById('loco_pos').onclick = f_on_loco_pos;
					document.getElementById('loco_pos_auto').onclick = f_loco_pos_auto;
					document.getElementById('loco_pos_pull').onclick = f_loco_pos_pull;
					document.getElementById('loco_pos_push').onclick = f_loco_pos_push;
				}
				if(config.setting_parameters.flagAxis == 1) {
					document.getElementById('dyn_axis').style.display = 'block';
				}				
				break;
	default:	modeMove = 'Ошибка A.R: ' + A.ModeWeightMove; break;
	}

	if( A.ModeWeight != A.CurModeWeight) {
		A.CurModeWeight =  A.ModeWeight;
		let mode_static = document.getElementById('mode_static');
		if( mode_static)
			mode_static.parentNode.removeChild(mode_static);
		let body = document.getElementById('body_mode');
		body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"mode_move\">В ДВИЖЕНИИ</div>');
		document.getElementById('mode_move').onclick = f_on_mode;
		body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"sub_mode_move\">' + modeMove +'</div>');
		document.getElementById('sub_mode_move').onclick = f_on_sub_mode_move;
	}
	
	/*
	if( !document.getElementById('mode_move')) {
		var body = document.getElementById('body_mode');
		body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"mode_move\">В ДВИЖЕНИИ</div>');
		var mode_move = document.getElementById('mode_move');
//		mode_move.onclick = f_on_mode_move;
		mode_move.onclick = f_on_mode;
		body.insertAdjacentHTML('beforeEnd','<div class=\"ind_switch\" id=\"sub_mode_move\">' + modeMove +'</div>');
		document.getElementById('sub_mode_move').onclick = f_on_sub_mode_move;
	}
*/	
	else {
//		document.getElementById('sub_mode_move').textContect = modeMove;
		document.getElementById('sub_mode_move').innerHTML = modeMove;
	}
	
//	document.getElementById('num_train_val').textContent = '№ ' + A.NumberTtainMove;
	
	togle_dynamic_mode( 'block');
}

function f_direct_auto()
{
	print_log('f_direct_auto');
	if( sendmsg('DIRECT_AUTO'))
		writeStatus(' Отправлена команда DIRECT_AUTO');
}

function f_direct_lr()
{
	print_log("f_direct_lr");
	if( sendmsg('DIRECT_LR'))
		writeStatus(' Отправлена команда DIRECT_LR');
}
function f_direct_rl()
{
	print_log("f_direct_rl");
	if( sendmsg('DIRECT_RL'))
		writeStatus(' Отправлена команда DIRECT_RL');
}

function f_loco_pos_auto()
{
	print_log("f_loco_pos_auto");
	if( sendmsg('LOCO_AUTO'))
		writeStatus(' Отправлена команда LOCO_AUTO');
}

function f_loco_pos_pull()
{
	print_log("f_loco_pos_pull");
	if( sendmsg('LOCO_PULL'))
		writeStatus(' Отправлена команда LOCO_PULL');
}

function f_loco_pos_push()
{
	print_log("f_loco_pos_push");
	if( sendmsg('LOCO_PUSH'))
		writeStatus(' Отправлена команда LOCO_PUSH');
}

function f_on_direct()
{
	print_log( "f_on_direct");
 	document.getElementById("dropdown_content_direct").classList.toggle("show");
}

function f_on_loco_pos()
{
	print_log( "f_loco_pos");
 	document.getElementById("dropdown_content_loco_pos").classList.toggle("show");
}

function f_axis_2()
{
	print_log( "f_axis_2");
	if( N.Wagons.length) {
		if( sendmsg('AXIS_2'))
			writeStatus(' Отправлена команда AXIS_2');
	}
}

function f_axis_4()
{
	print_log( "f_axis_4");
	if( N.Wagons.length) {
		if( sendmsg('AXIS_4'))
			writeStatus(' Отправлена команда AXIS_4');
	}
}

function f_axis_6()
{
	print_log( "f_axis_6");
	if( N.Wagons.length) {
		if( sendmsg('AXIS_6'))
			writeStatus(' Отправлена команда AXIS_6');
	}
}

function f_axis_8()
{
	print_log( "f_axis_8");
	if( N.Wagons.length) {
		if( sendmsg('AXIS_8'))
			writeStatus(' Отправлена команда AXIS_8');
	}
}

function f_dyn_axis_2()
{
	print_log( "f_dyn_axis_2");
	if( sendmsg('AXIS_2')) {
		writeStatus(' Отправлена команда AXIS_2');
 		document.getElementById("dyn_cnt_axis").textContent = 'Кол-во осей: 2';
	}
}

function f_dyn_axis_4()
{
	print_log( "f_dyn_axis_4");
	if( sendmsg('AXIS_4')) {
		writeStatus(' Отправлена команда AXIS_4');
 		document.getElementById("dyn_cnt_axis").textContent = 'Кол-во осей: 4';
 	}
}

function f_dyn_axis_6()
{
	print_log( "f_dyn_axis_6");
	if( sendmsg('AXIS_6')) {
		writeStatus(' Отправлена команда AXIS_6');
 		document.getElementById("dyn_cnt_axis").textContent = 'Кол-во осей: 6';
	}	
}

function f_dyn_axis_8()
{
	print_log( "f_dyn_axis_8");
	if( sendmsg('AXIS_8')) {
		writeStatus(' Отправлена команда AXIS_8');
 		document.getElementById("dyn_cnt_axis").textContent = 'Кол-во осей: 8';
	}		
}

function f_on_dyn_cnt_axis()
{
	print_log( "f_on_dyn_cnt_axis");

// ПОЛУАВТОМАТ && СТАРТ
	if(A.ModeWeightMove == 'S' && A.StateInMove == 'S') {
 		document.getElementById("dropdown_content_dyn_cnt_axis").classList.toggle("show");
 	}
}

function f_on_cnt_axis()
{
	print_log( "f_on_cnt_axis");
	if( N.Wagons.length) {
 		document.getElementById("dropdown_content_cnt_axis").classList.toggle("show");
 	}
}

function f_on_save_car()
{
	print_log( "f_on_save_car");
	if( sendmsg('CAPT_WGT'))
		writeStatus(' Отправлена команда CAPT_WGT');
}

function f_zero()
{
	print_log( "f_zero");
	if( sendmsg('ZERO'))
		writeStatus(' Отправлена команда ZERO');
}

function f_x10()
{
	modal_x10.style.display = 'block';
	document.getElementById('input_pswd').value = '';
	document.getElementById('chk_pswd').innerHTML = ' ';
	
//	print_log( "f_x10");
//	if( sendmsg('NORMALIZE_WGT'))
//		writeStatus(' Отправлена команда NORMALIZE_WGT');
}

function f_send_x10()
{
    let input = document.getElementById('input_pswd').value; //Текстовое поле
    let hash_input = fnv1aHash( input);
    // Посмотрим на примере:
	console.log(hash_input); 
	
	if( hash_input == '910909208') {
		print_log( "f_x10");
		document.getElementById('chk_pswd').innerHTML = '';
		if( sendmsg('NORMALIZE_WGT'))
			writeStatus(' Отправлена команда NORMALIZE_WGT');
		f_close_x10();
	}
	else {
		print_log( "Неверный пароль");
		document.getElementById('chk_pswd').innerHTML = 'Неверный пароль';
	}
}

function f_close_x10()
{
	modal_x10.style.display = 'none';
}


// Закрыть раскрывающийся список, если пользователь щелкнет за его пределами, или модальные окна
window.onclick = function(event) {
  if ((event.target == modal_train) || (event.target == modal_car)  || (event.target == modal_reset_result)){
    modal_train.style.display = "none";
	return;
  }
/*  
  if (!event.target.matches("#direct_val") ) {
	if( document.getElementById("dropdown_content_direct").classList.contains('show'))
		document.getElementById("dropdown_content_direct").classList.remove('show');
  }
  if (!event.target.matches("#loco_pos") ) {
	if( document.getElementById("dropdown_content_loco_pos").classList.contains('show'))
		document.getElementById("dropdown_content_loco_pos").classList.remove('show');
  }
  if (!event.target.matches("#static_cnt_axis") ) {
	if( document.getElementById("dropdown_content_cnt_axis").classList.contains('show'))
		document.getElementById("dropdown_content_cnt_axis").classList.remove('show');
  }
  if (!event.target.matches("#dyn_cnt_axis") ) {
	if( document.getElementById("dropdown_content_dyn_cnt_axis").classList.contains('show'))
		document.getElementById("dropdown_content_dyn_cnt_axis").classList.remove('show');
  }
*/  
}


//----------------------------------------------- Начало взвешивания следующего состава В ДВИЖЕНИИ
function b_packet(packet)
{
	B.NumberTrain = packet.N;

	print_log( B);

	document.getElementById('num_train_val').textContent = '№ ' + B.NumberTrain;
	document.getElementById('train_weight').textContent = '';
	document.getElementById('state_val').textContent = 'ВЗВЕШИВАНИЕ';

// Обнулим пред.состав
    var wagons = document.getElementById( 'scroll_wagons');
	while(wagons.hasChildNodes()) {
//		print_log( wagons.firstChild);
		wagons.removeChild(wagons.firstChild);
	}
	
	document.getElementById('stop').textContent = 'СТОП';
	document.getElementById('stop').style.display='block';
    document.getElementById('stop').onclick = f_on_stop;
    
	document.getElementById('wagons').style.display='block';
	
	writeStatus( ' Начало взвешивания состава № ' + B.NumberTrain);

	document.getElementById('results_train').style.display = 'none';
}

//---------------------------------------------- Направление движения
function c_packet(packet)
{
	C.Direction = packet.D;
	print_log( C);

	if( C.Direction == 'L')
		document.getElementById('direct_val').textContent = 'ЛЕВО ->>- ПРАВО';
	else if( C.Direction == 'R')
		document.getElementById('direct_val').textContent = 'ЛЕВО -<<- ПРАВО';
	else if( C.Direction == 'N')
		document.getElementById('direct_val').textContent = 'ЛЕВО < > ПРАВО';
	else
		document.getElementById('direct_val').textContent = '??? ' + C.Direction;
}

		
//------------------------------------------------ Тип вагона
function d_packet(packet)
{
	D.TypeWagon = packet.W;
	print_log( D);

	if( A.ModeWeight == 'S')
		 document.getElementById('static_cnt_axis').textContent = '' + D.TypeWagon;
	

	var left_2 = document.getElementById('img_left_2');
	var left_4 = document.getElementById('img_left_4');
	var left_6 = document.getElementById('img_left_6');
	var left_8 = document.getElementById('img_left_8');
	var right_2 = document.getElementById('img_right_2');
	var right_4 = document.getElementById('img_right_4');
	var right_6 = document.getElementById('img_right_6');
	var right_8 = document.getElementById('img_right_8');
	var loco_left_right = document.getElementById('img_loco_left_right');
	var loco_right_left = document.getElementById('img_loco_right_left');
	switch( D.TypeWagon){
	case 'L':
		left_2.style.opacity = 0;
		right_2.style.opacity = 0;
		left_4.style.opacity = 0;
		right_4.style.opacity = 0;
		left_6.style.opacity = 0;
		right_6.style.opacity = 0;
		left_8.style.opacity = 0;
		right_8.style.opacity = 0;
		switch( C.Direction) {
		case 'L':
			loco_right_left.style.opacity = 0;
			loco_left_right.style.opacity = 1;
			break;
		case 'R':	
			loco_left_right.style.opacity = 0;
			loco_right_left.style.opacity = 1;
			break;
		default:
			loco_right_left.style.opacity = 0;
			loco_left_right.style.opacity = 1;
			break;
		}
		break;
	case '2':
		loco_right_left.style.opacity = 0;
		loco_left_right.style.opacity = 0;
		left_4.style.opacity = 0;
		right_4.style.opacity = 0;
		left_6.style.opacity = 0;
		right_6.style.opacity = 0;
		left_8.style.opacity = 0;
		right_8.style.opacity = 0;
		left_2.style.opacity = 1;
		right_2.style.opacity = 1;
		break;
	case '4':
		loco_right_left.style.opacity = 0;
		loco_left_right.style.opacity = 0;
		left_2.style.opacity = 0;
		right_2.style.opacity = 0;
		left_6.style.opacity = 0;
		right_6.style.opacity = 0;
		left_8.style.opacity = 0;
		right_8.style.opacity = 0;
		left_4.style.opacity = 1;
		right_4.style.opacity = 1;
		break;
	case '6':
		loco_right_left.style.opacity = 0;
		loco_left_right.style.opacity = 0;
		left_2.style.opacity = 0;
		right_2.style.opacity = 0;
		left_4.style.opacity = 0;
		right_4.style.opacity = 0;
		left_8.style.opacity = 0;
		right_8.style.opacity = 0;
		left_6.style.opacity = 1;
		right_6.style.opacity = 1;
		break;
	case '8':
		loco_right_left.style.opacity = 0;
		loco_left_right.style.opacity = 0;
		left_2.style.opacity = 0;
		right_2.style.opacity = 0;
		left_4.style.opacity = 0;
		right_4.style.opacity = 0;
		left_6.style.opacity = 0;
		right_6.style.opacity = 0;
		left_8.style.opacity = 1;
		right_8.style.opacity = 1;
		break;
	default:	
		print_log( D.TypeWagon);
		loco_right_left.style.opacity = 0;
		loco_left_right.style.opacity = 0;
		left_4.style.opacity = 0;
		right_4.style.opacity = 0;
		left_6.style.opacity = 0;
		right_6.style.opacity = 0;
		left_8.style.opacity = 0;
		right_8.style.opacity = 0;
		break;
	}
}


//------------------------------------------------------------ Скорость 
function e_packet(packet)
{
	E.Speed = packet.S;
	print_log( E);
	document.getElementById('speed_val').textContent = E.Speed + ' км/ч';
}

//--------------------------------------------------- Текущий вес с весов
// ???? КАК ОБРАБАТЫВАТЬ?
function f_packet( packet)
{
	var n = parseInt(packet.N);
	
	if( typeof F[n] == 'undefined')
		F[n] = {};
	F[n].NumberScale = n;
	F[n].Stability   = parseInt(packet.S0);
	F[n].Sign        = packet.S1;
	F[n].OverLimit   = packet.S2;
	F[n].S3 = packet.S3;
	F[n].S4 = packet.S4;
	F[n].S5 = packet.S5;
	F[n].S6 = packet.S6;
	F[n].S7 = packet.S7;
	F[n].Weight = parseInt(packet.W);

//	print_log( F[n]);

	var sum = 0;
	var stability = "";
	for( var i=0; i<F.length; ++i) {
		if( typeof F[i] == 'object' ) {
			if( typeof A.StateScale != 'undefined') {
				if( A.StateScale[i] == 1) {
					sum += F[i].Weight;
					if( F[i].Stability)
						stability = '~';
					}
			}
		}
	}
	if( sum > config.static_parameters.over) {
		document.getElementById('sum_cur_val').textContent = 'ПЕРЕГРУЗ';
	}
	else if( sum < config.static_parameters.under) {
		document.getElementById('sum_cur_val').textContent = 'НЕДОГРУЗ';
	}		
	else {
		document.getElementById('sum_cur_val').textContent = stability + sum + ' кг';
	}	
	
// В Статике	
//	if( A.ModeWeight == 'S') {
//		document.getElementById('static_weight').textContent = ' ' + sum;
//	}
}

// Сброс окошка с номерами вагонов
function reset_wagons( hide_wagons)
{
// в случае сброса процесса взвешивания оставим текущее положение, на котором произошел сброс или остановлено взвешивание
	if( A.StateInMove == 'T' || A.StateInMove == 'S') 
		return;
	
  const myNode = document.getElementById('scroll_wagons');
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
  if( hide_wagons)
  	document.getElementById('wagons').style.display = 'none';
  
  document.getElementById('scroll_wagons').style.left = '1px';
}


function f_scroll_right()
{
	let widthFull = document.getElementById( 'wagons').offsetWidth;
    let scrl_wagons = document.getElementById( 'scroll_wagons');

	let childs = scrl_wagons.childNodes;
	if( childs.length == 0)
		return;

	for( let i=0; i< childs.length; ++i)
		print_log( i + ":" + childs[i].offsetLeft);

	let idx = childs.length - 1;
	
		
	print_log( "SR: SO=" + scrl_wagons.offsetLeft + " idx=" + idx + " SL=" + childs[idx].offsetLeft  + " width=" + (scrl_wagons.offsetLeft + childs[idx].offsetLeft) +" widthFull=" + widthFull + " " + C.Direction);

	if( childs[idx].offsetLeft < widthFull)
		return;
	
	if( scrl_wagons.offsetLeft < 0) {
		let i;
		for( i = childs.length-2; i>=0; --i) {
			if( (scrl_wagons.offsetLeft < 0) && (scrl_wagons.offsetLeft + childs[i].offsetLeft) <= -1  ) {
 				scrl_wagons.style.left = -childs[i].offsetLeft + 'px';
 				break;
 			}
 		}
//		print_log( "SR: SO=" + scrl_wagons.style.left + " i=" + i + " " + childs[i].offsetLeft);
	}
	
}

function f_scroll_left()
{
	let widthFull = document.getElementById( 'wagons').offsetWidth;
	let scrl_wagons = document.getElementById( 'scroll_wagons');
	
	let childs = scrl_wagons.childNodes;
	if( childs.length == 0)
		return;
		
	for( let i=0; i< childs.length; ++i)
		print_log( i + ":" + childs[i].offsetLeft);
	
	let idx = childs.length - 1;

	print_log( "SL: SO=" + scrl_wagons.offsetLeft + " idx=" + idx + " SL=" + childs[idx].offsetLeft  + " width=" + (scrl_wagons.offsetLeft + childs[idx].offsetLeft) +" widthFull=" + widthFull + " " + C.Direction);
	
	if( (scrl_wagons.offsetLeft + childs[idx].offsetLeft + childs[idx].offsetWidth) >= widthFull) {
		let i;
		for( i = 1; i<childs.length; ++i) {
			if( (scrl_wagons.offsetLeft >= 0) || (scrl_wagons.offsetLeft + childs[i].offsetLeft) > 0 ) {
				scrl_wagons.style.left = -childs[i].offsetLeft + 'px';
				break;
			}
 		}
//		print_log( "SL: SO=" + scrl_wagons.style.left + " i=" + i + " " + childs[i].offsetLeft);
	}
	 
	
}

// Результаты взвешивания по вагону (ДИНАМИКА/СТАТИКА) (новый вагон)
function g_packet(packet)
{
	let	wagon;
	
	G.NumberWagon = parseInt(packet.N);
	G.Speed       = packet.S;
	G.CntAxis     = packet.C;
	G.WeightT1    = packet.T1;
	G.WeightT2    = packet.T2;
	G.WeightWagon = packet.W;
	G.WeightTrain = packet.SW;
	
	print_log( G);

// В СТАТИКЕ?	
	if( A.ModeWeight == 'S') {
// информация по тому же вагону?	
		document.getElementById('static_weight').textContent = G.WeightWagon;
		document.getElementById('train_weight').textContent = '' + (parseInt(G.WeightTrain) + parseInt(G.WeightWagon));
		document.getElementById('speed_val').textContent = G.Speed + ' км/ч';

		if( G.NumberWagon == N.CurNumberWagon) {
		
			return;
		}
		N.CurNumberWagon = G.NumberWagon;
		N.Wagons[N.CurNumberWagon] = {};
		N.Wagons[N.CurNumberWagon].Speed = G.Speed;
		N.Wagons[N.CurNumberWagon].CntAxis = G.CntAxis;
		N.Wagons[N.CurNumberWagon].WeightT1 = G.WeightT1;
		N.Wagons[N.CurNumberWagon].WeightT2 = G.WeightT2;
		N.Wagons[N.CurNumberWagon].WeightWagon = G.WeightWagon;
		N.Wagons[N.CurNumberWagon].WeightTrain = G.WeightTrain;
		
	}

	document.getElementById('train_weight').textContent = G.WeightTrain;
	document.getElementById('speed_val').textContent = G.Speed + ' км/ч';
	 
	var wagon_id = 'wagon' + G.NumberWagon;
 	
	if( document.getElementById(wagon_id))
		return ;

	if( A.ModeWeight == 'S')
		 document.getElementById('static_cnt_axis').textContent = '?';

    var scrl_wagons = document.getElementById( 'scroll_wagons');

// L->R
	let where = 'afterBegin';
	if( typeof C.Direction != 'undefined')
		if( C.Direction == 'R')
			where = 'beforeEnd';
	
	if( A.ModeWeight == 'S') {
		wagon = '<div class=\"cur_wagon\" ' + 'id=\"' + wagon_id + '\">' + G.NumberWagon + '</div>';
		if(scrl_wagons.lastChild) {
// В зависимости от направления движения
			if( where == 'beforeEnd')		
				scrl_wagons.lastChild.className = 'wagon';
			else 
				scrl_wagons.firstChild.className = 'wagon';
		}
	}
	else
		wagon = '<div class=\"wagon\" ' + 'id=\"' + wagon_id + '\">' + G.NumberWagon + '</div>';

	scrl_wagons.insertAdjacentHTML(where, wagon);
	print_log( where);
	if( where == 'beforeEnd') {
		print_log( 'ScrloffsetLeft: ' + scrl_wagons.offsetLeft + ' offsetLeft: ' + scrl_wagons.lastChild.offsetLeft + ' width: ' +  document.getElementById( 'wagons').offsetWidth);	
		if( scrl_wagons.lastChild.offsetLeft + scrl_wagons.lastChild.offsetWidth >= document.getElementById( 'wagons').offsetWidth) {
			let scrl_wagons = document.getElementById( 'scroll_wagons');
			let childs = scrl_wagons.childNodes;
			let widthFull = document.getElementById( 'wagons').offsetWidth;

			let i;
			for( let i = 1; i<childs.length; ++i) {
				if( (scrl_wagons.offsetLeft >= 0) || (scrl_wagons.offsetLeft + childs[i].offsetLeft) > 0 ) {
					scrl_wagons.style.left = -childs[i].offsetLeft + 'px';
					break;
				}
 			}
//		print_log( "SL: SO=" + scrl_wagons.style.left + " i=" + i + " " + childs[i].offsetLeft);
		
//			scrl_wagons.style.left = scrl_wagons.offsetLeft - scrl_wagons.lastChild.offsetWidth - 2 + 'px';
		}
	}

	
/*	
	let full_width = wagons.lastChild.offsetLeft + wagons.lastChild.offsetWidth;
	print_log( 'left: ' + wagons.style.left);
	let left = parseInt(wagons.style.left.replace(/px/,''));
	let width = parseInt(document.getElementById('wagons').style.width.replace(/px/,''));

	print_log( 'OFFSET: ' + wagons.lastChild.offsetLeft + ',' + wagons.lastChild.offsetWidth + ';' + left + ',' + width);
		
	if( left + full_width > width)
		wagons.style.left = left + document.getElementById(wagon_id).offsetWidth + 'px';
*/

// В СТАТИКЕ?	
	if( A.ModeWeight == 'S') {
		if( N.Wagons.length > 1) {
		switch( D.TypeWagon) {
		case '2':
			f_dyn_axis_2(); break;
		case '4':
			f_dyn_axis_4(); break;
		case '6':
			f_dyn_axis_6(); break;
		case '8':
			f_dyn_axis_8(); break;
		}
		}
	}
}

// Ошибка
// ?????? КАК ОБРАБАТЫВАТЬ ?
function h_packet(packet)
{
	H.Error = packet.E;
	writeStatus( ' Ошибка: ' + H.Error);
//	document.getElementById('msg_status').textContent = 'Ошибка = ' + H.Error;
	print_log( H);
}

// Результаты по составу
// ?????? КАК ОБРАБАТЫВАТЬ ?
function i_packet(packet)
{
	I.NumberTrain = packet.N;
	I.CntWagons = parseInt(packet.NC);
	I.DateTimeStart = packet.DTS;
	I.DateTimeEnd = packet.DTE;
	I.HiSpeed = packet.WS0;
	I.LoSpeed = packet.WS1;
	I.Accuracy = packet.WS2;
	I.WS3 = packet.WS3;
	I.WS4 = packet.WS4;
	I.WS5 = packet.WS5;
	I.WS6 = packet.WS6;
	I.WS7 = packet.WS7;
	I.WeightTrain = packet.SW;
	if( typeof I.WD == 'undefined')
		I.WD = [];
	for( var j=0; j<I.CntWagons; ++j) {
		if( typeof I.WD[j] == 'undefined')
			I.WD[j] = {};
		I.WD[j].NumberWagon = packet.WD[j].N;
		I.WD[j].CntAxis = packet.WD[j].C;
		I.WD[j].Speed = packet.WD[j].S;
		I.WD[j].WeightT1 = packet.WD[j].T1;
		I.WD[j].WeightT2 = packet.WD[j].T2;
		I.WD[j].WeightWagon = packet.WD[j].W;
	}
	print_log( I);	
	document.getElementById('train_weight').textContent = I.WeightTrain;
	
	let str;
	str = "<p>Номер состава: " + I.NumberTrain + "</p>"
	str += "<p>Масса состава,кг: " + I.WeightTrain + "</p>"
	str += "<p>Кол-во вагонов: " + I.CntWagons + "</p>"
	str += "<br>"
	document.getElementById('results_train').innerHTML = str;

	
	let table = document.createElement('table');
	table.setAttribute('id', 'table_result');
	let row = table.insertRow(); // добавим строку

	let cell1 = row.insertCell(); // добавим ячейки
	let cell2 = row.insertCell();
	let cell3 = row.insertCell();
	let cell4 = row.insertCell();

	cell1.innerHTML = 'Номер' + '&nbsp&nbsp'; // вставим текст
	cell2.innerHTML = 'Кол-во осей' + '&nbsp&nbsp';
	cell3.innerHTML = 'Скорость,км/ч' + '&nbsp&nbsp';
	cell4.innerHTML = 'Масса,кг' + '&nbsp&nbsp';
	
	for( let j=0; j<I.CntWagons; ++j) {
		let row = table.insertRow(); // добавим строку
		let cell1 = row.insertCell(); // добавим ячейки
		let cell2 = row.insertCell();
		let cell3 = row.insertCell();
		let cell4 = row.insertCell();

		cell1.innerHTML = I.WD[j].NumberWagon; // вставим текст
		if( A.ModeWeight == 'M' && A.ModeWeightMove == 'S' && config.enable_edit_results_type_car == 1 && I.PrevNumberTrain != I.NumberTrain) {
// создади здесь комбобокс
			let dropdown = document.createElement('select');

        	let opt = document.createElement('option'); 
        	opt.text = I.WD[j].CntAxis + ' осный';
        	opt.value = I.WD[j].CntAxis;
        	dropdown.options.add(opt);      

        	let opt2 = document.createElement('option'); 
        	opt2.text = 'ЛОКО';
        	opt2.value = 'L';
        	dropdown.options.add(opt2);      

//Load the dynamically created dropdown in container
	    	cell2.appendChild(dropdown);
	    }
		else
			cell2.innerHTML = I.WD[j].CntAxis;
			
		cell3.innerHTML = I.WD[j].Speed;
		cell4.innerHTML = I.WD[j].WeightWagon;

	}
	document.getElementById('results_train').appendChild(table);
	document.getElementById('results_train').style.display = 'block';
	I.PrevNumberTrain = I.NumberTrain;

}


// Reset
function j_packet()
{
	print_log( 'Reset');

//	document.getElementById('sum_train').textContent = 0;
// скрыть вагон	
/*
// если в движении, если разрешено редактирование, если еще не в режиме редактирования
	document.getElementById('speed_val').textContent = 0.0 + ' км/ч';
	if( A.ModeWeight == 'M' && config.enable_edit_results_type_car == 1 && A.StateInMove != 'E' ) 
		return;
*/		
	hide_wagon();
	reset_wagons(1);
//	document.getElementById('train_weight').textContent = '';
	
	writeStatus( ' Состояние контроллера сброшено');
	
	return true;
}

// Позиция локоматива
function k_packet( packet)
{
	K.PositionLoco = packet.P;
	print_log( K);

	var pos;
	switch( K.PositionLoco) {
	case 'U':	pos = 'НЕ ОПРЕДЕЛЕНО'; break;	
	case 'B':	pos = 'ЛОКО. ТЯНЕТ'; break;	
	case 'A':	pos = 'ЛОКО. ТОЛКАЕТ'; break;	
	case 'I':	pos = 'МЕЖДУ ВАГОНАМИ'; break;	
	default:    pos = '??? ' + K.P;
	}
//	document.getElementById('loko_pos').textContent = pos;
	document.getElementById('loco_pos').textContent = pos;
}

// Метод взвешивания в статике
function l_packet( packet)
{
	L.Method = packet.M;
	print_log( L);
}

// Номер взвешиваемого элемена
function m_packet(packet)
{
	M.NumberWeightElement = packet.X;
	print_log( M);
}

// Номер состава в стат. режиме
function n_packet(packet)
{
	N.NumberTrainStatic = parseInt(packet.SN);
// свойства НЕ ИЗ ПРОТОКОЛА	
	N.CurNumberWagon = 0;
// Вагоны (кол-во  осей, вес)
	N.Wagons = [];
	
	document.getElementById('num_train_val').textContent = '№ ' + N.NumberTrainStatic;

	reset_wagons(0);

	document.getElementById('img_left_2').style.opacity = 0;
	document.getElementById('img_left_4').style.opacity = 0;
	document.getElementById('img_left_6').style.opacity = 0;
	document.getElementById('img_left_8').style.opacity = 0;
	document.getElementById('img_right_2').style.opacity = 0;
	document.getElementById('img_right_4').style.opacity = 0;
	document.getElementById('img_right_6').style.opacity = 0;
	document.getElementById('img_right_8').style.opacity = 0;
	document.getElementById('img_loco_left_right').style.opacity = 0;
	document.getElementById('img_loco_right_left').style.opacity = 0;

	document.getElementById('static_weight').textContent = '0';
	document.getElementById('static_cnt_axis').textContent = '?';
	
	print_log( N);
}

// Начало фотографирования
function o_packet()
{
	print_log( 'BeginPhoto');
	document.getElementById('camera').style.opacity = 1;
}

// Окончание фотографирования
function p_packet()
{
	print_log( 'EndPhoto');
	document.getElementById('camera').style.opacity = 0;
}

// Изменение дискретного входа n
function q_packet(packet)
{
	if( typeof Q_IO.STATE == 'undefined')
		Q_IO.STATE = [];
	var n = parseInt(packet.IN);
	Q_IO.STATE[n] = packet.STATE;
	print_log( Q);
	
	for( let i=0; i < config.sensors.length; ++i) {
		if( config.sensors[i].number == n) {
			let id_wd = document.getElementById('id_wd_'+ i);
			id_wd.style.background =  (Q_IO.STATE[n] == 0) ? 'orange' : 'red';
			break;
		}
	}
}

// Функция разрешения/запрета весовой платформы в режиме СТАТИКА
function f_on_off_scale(event)
{
	let obj = event.target;

	print_log( "f_on_off_scale: id=" + obj.id + " Mode: " + A.ModeWeight);

// если еще не было получено состояние контроллера
	if( typeof A.StateScale == 'undefined')
		return;
		
// если не в режме СТАТИКА		
	if( A.ModeWeight != 'S')
		return;

	for( let i=0; i< config.weight_platforms.length; ++i) {
		print_log( config.weight_platforms[i].name);
		if( obj.id == config.weight_platforms[i].name) {
			if( sendmsg("ON_OFF_SCL" + i))
    			writeStatus( ' Отправлена команда ON_OFF_SCL' + i);
			break;
		}
	}
}


// Срабатывание датчика колеса n
function r_packet(packet)
{
	if( typeof R.CNT == 'undefined')
		R.CNT = [];
	var n = parseInt(packet.WD);
	R.CNT[n] = packet.CNT;
	oDiag.f_SensorCnt( n, packet.CNT); 
	print_log( R);
	writeStatus( ' Датчик колеса ' + n + ' : ' + R.CNT[n]);
}

// Показать конфигурацию весовой системы
function CONFIG_packet(packet)
{
	print_log( packet);
	if( typeof config == 'undefined') {
		config = {};
		config.weight_platforms = [];
		config.sensors = [];
		config.setting_parameters = {};
		config.static_parameters = {};
		config.info = {};
	}
	if( packet.Error != 0) {
		writeStatus( ' Ошибка конфигурации весовой системы: ' + packet.Error);
		return;
	}
	
	for( var j=0; j< packet.weight_platforms.length; ++j) {
		if( typeof config.weight_platforms[j] == 'undefined')
			config.weight_platforms[j] = {};
		config.weight_platforms[j].name = packet.weight_platforms[j].name;
		config.weight_platforms[j].id = packet.weight_platforms[j].id;
		config.weight_platforms[j].live_rail = packet.weight_platforms[j].live_rail;
		config.weight_platforms[j].dead_rail = packet.weight_platforms[j].dead_rail;
		config.weight_platforms[j].act = packet.weight_platforms[j].enable_cim;
	}
/*
// счетчики есть?	
	if( typeof packet.sensors != 'undefined') {
		for( var j=0; j< packet.sensors.length; ++j) {
			if( typeof config.sensors[j] == 'undefined')
				config.sensors[j] = {};
			config.sensors[j].id = packet.sensors[j].id;
			config.sensors[j].number = packet.sensors[j].number;
			config.sensors[j].position = packet.sensors[j].position;
			config.sensors[j].active_length = packet.sensors[j].active_length;
		}
	}
	
	config.setting_parameters.flagDirect = packet.setting_parameters.flagDirect;
	config.setting_parameters.flagPositionLoco = packet.setting_parameters.flagPositionLoco;
	config.setting_parameters.flagAxis = packet.setting_parameters.flagAxis;

	if( typeof packet.dosing != 'undefined') 
		config.dosing = {};

	if( typeof packet.static_parameters != 'undefined') {
		config.static_parameters.capacity = packet.static_parameters.capacity;
		config.static_parameters.step = packet.static_parameters.step;
		config.static_parameters.over = parseInt(config.static_parameters.capacity) + 10*config.static_parameters.step;
		config.static_parameters.under = - 10*config.static_parameters.step;
	}
*/	
	if( typeof packet.info != 'undefined') {
		config.info.name_soft = packet.info.name_soft;
		config.info.id_soft   = packet.info.id_soft;
		config.info.version_soft = packet.info.version_soft;
		config.info.number_calibration = packet.info.number_calibration;
	}
/*
	config.enable_edit_results_type_car = packet.enable_edit_results_type_car;
*/	
	writeStatus(' Получена конфигурация весового системы');

	print_log( config);

	var scales = document.getElementById( 'scales');
//  var scales = $("#scales");
    print_log (scales);
	var sum = 0.0;
// Суммарная длина весовых платформ	
	for( var i=0; i< config.weight_platforms.length; ++i)
		sum += parseFloat(config.weight_platforms[i].live_rail) + parseFloat(config.weight_platforms[i].dead_rail);
// Добавим ширину бордюров
	wTtrain -= config.weight_platforms.length * 2 + 24*(config.weight_platforms.length-1);
// Коэффициент масштабирования	
	let k = wTtrain/sum;
	let cur_pos = 0;

// отрисовка платформ		
	for( let i=0; i< config.weight_platforms.length; ++i) {
		let str_div;
//		str_div = '<div class="platforma_on" id="' + config.weight_platforms[i].name + '"' + 
//			' style="width:' + parseInt(config.weight_platforms[i].live_rail*k) + 
//               'px; float:left">ГП №' + (i+1) + 
//			   '(L=' + parseFloat(config.weight_platforms[i].live_rail)/1000 + ' м)</div>';
		str_div = '<div class="platforma_on" id="' + config.weight_platforms[i].name + '">ГП №' + (i+1) +  
			   '(L=' + parseFloat(config.weight_platforms[i].live_rail)/1000 + ' м)</div>';
			print_log( str_div);

//		$('#scales').insertAdjacentHTML('beforeEnd', str_div);
//		scales.insertAdjacentHTML('beforeEnd', str_div);
		$('#scales').append(str_div);
		if( i < (config.weight_platforms.length-1)) {
			let str = '<div class=\"equal\"><img src=\"images/add.png\" width=24px height=24px></div>';
			$('#scales').append(str);
		}



//return;		
		document.getElementById(config.weight_platforms[i].name).style.position = "relative";
		document.getElementById(config.weight_platforms[i].name).style.left =  parseInt(cur_pos*k) + "px";
		document.getElementById(config.weight_platforms[i].name).style.width =  parseInt(config.weight_platforms[i].live_rail*k) + "px";
		document.getElementById(config.weight_platforms[i].name).style.float =  "left";
		document.getElementById(config.weight_platforms[i].name).onclick = f_on_off_scale;
		cur_pos += /*config.weight_platforms[i].live_rail + */parseInt(config.weight_platforms[i].dead_rail);
		if(  i < (config.weight_platforms.length-1)) {
			cur_pos += 24;
		}
	}

	let str = '<div class=\"equal\"><img src=\"images/equal.png\" width=24px height=24px></div>';
	$('#scales').append(str);

	
	//return;
// отрисовка датчиков колеса
	for( let i=0; i< config.sensors.length; ++i) {
		let str_wd;
		str_wd = '<div class=\"wd\" id="id_wd_' + i + '\"></div>'; 
		scales.insertAdjacentHTML('beforeEnd', str_wd);
		document.getElementById('id_wd_'+ i).style.left =  3 + parseInt(config.sensors[i].position*k) + 'px';
	}
	
// отрисовка опор платформ	
	var cells=[];
	for( var i=0; i< config.weight_platforms.length; ++i) {
		var el=document.getElementById(config.weight_platforms[i].name);
		cells[i]={};
		cells[i].left = el.offsetLeft;
		cells[i].width = el.offsetWidth;
		cells[i].height = el.offsetHeight;
	}
	for( var i=0; i<cells.length; ++i) {
		var str_cell;
//		str_cell = '<div id="c1_' + i + '" style=\"position:absolute;clear:left;top:' + cells[i].height + 'px;left:' + (cells[i].left+5) + 
//			'px\"><img src=\"images/load_cell_on.png\" width=9px height=9px></div>';
		str_cell = '<div id="c1_' + i + '"><img src=\"images/load_cell_on.png\" width=9px height=9px></div>';
		scales.insertAdjacentHTML('beforeEnd', str_cell);
		document.getElementById('c1_'+ i).style.position =  "absolute";
		document.getElementById('c1_'+ i).style.clear =  "left";
		document.getElementById('c1_'+ i).style.top =  cells[i].height + 'px';
		document.getElementById('c1_'+ i).style.left =  (cells[i].left + 5) + 'px';


		
//		str_cell = '<div id="c2_' + i + '" style=\"position:absolute;clear:left;top:' + cells[i].height + 'px;left:' + (cells[i].left+cells[i].width-15) + 
//			'px\"><img src=\"images/load_cell_on.png\" width=9px height=9px></div>';
		str_cell = '<div id="c2_' + i + '"><img src=\"images/load_cell_on.png\" width=9px height=9px></div>';
		scales.insertAdjacentHTML('beforeEnd', str_cell);
		document.getElementById('c2_'+ i).style.position =  "absolute";
		document.getElementById('c2_'+ i).style.clear =  "left";
		document.getElementById('c2_'+ i).style.top =  cells[i].height + 'px';
		document.getElementById('c2_'+ i).style.left =  (cells[i].left+cells[i].width-15) + 'px';
	}
/*
	if(	config.setting_parameters.flagAxis == 1) {
		document.getElementById('dyn_cnt_axis').onclick = f_on_dyn_cnt_axis;
		document.getElementById('dyn_axis_2').onclick = f_dyn_axis_2;
		document.getElementById('dyn_axis_4').onclick = f_dyn_axis_4;
		document.getElementById('dyn_axis_6').onclick = f_dyn_axis_6;
		document.getElementById('dyn_axis_8').onclick = f_dyn_axis_8;
	}
*/	
}

// Запрос конфигурации по весам
function getWeightCfg()
{
	sendmsg("GET_CFG");
}

// Получить зарегтрированный Id клиента
function REGISTERED_packet( packet)
{
    print_log( packet);
    let _myIdReg = packet.REGISTERED.ID;
    print_log( 'myIdReg: ' +  _myIdReg);

	if( _myIdReg != myID) {
		writeStatus( ' Клиент не зарегистрирован');
		myID = 0;
		return;
	}
	writeStatus( ' Клиент зарегистрирован');

// запрос конфигурации
	getWeightCfg();
}

function parse_json( response) {
//	print_log( response);
	try {
		parse_p = JSON.parse( response);
		
	} catch (e) {
		if (e instanceof SyntaxError) {
			printError(e, true);
			print_log( 'ErrorParse: ' + response);
		} else {
			printError(e, false);
			print_log( 'ErrorParse: ' + response);
		}
		return null;
	}
	
	if( parse_p) {
//		print_log( 'Parse: packets:' + parse_p.Packets.length);
//		print_log( 'Parse: packets:' + parse_p);
		for( var i=0; i<parse_p.Packets.length; ++i) {
//			print_log( i + ') ' + parse_p.Packets[i].packet);
			switch( parse_p.Packets[i].packet) {
			case 'A':
				a_packet(parse_p.Packets[i]);
				break;
			case 'B':
				b_packet( parse_p.Packets[i]);
				break;
			case 'C':
				c_packet( parse_p.Packets[i]);
				break;
			case 'D':
				d_packet(parse_p.Packets[i]);
				break;
			case 'E':
				e_packet(parse_p.Packets[i]);
				break;
			case 'F':
				f_packet(parse_p.Packets[i]);
				break;
			case 'G':
				g_packet( parse_p.Packets[i]);
				break;
			case 'H':
				h_packet( parse_p.Packets[i]);
				break;
			case 'I':
				i_packet( parse_p.Packets[i]);
				break;
			case 'J':
				j_packet();
				break;
			case 'K':
				k_packet( parse_p.Packets[i]);
				break;
			case 'L':
				l_packet(parse_p.Packets[i]);
				break;
			case 'M':
				m_packet(parse_p.Packets[i]);
				break;
			case 'N':
				n_packet(parse_p.Packets[i]);
				break;
			case 'O':
				o_packet();
				break;
			case 'P':
				p_packet();
				break; 
			case 'Q':
				q_packet(parse_p.Packets[i]);
				break;
			case 'R':
				r_packet(parse_p.Packets[i]);
				break;
			case 'CONFIG':
				CONFIG_packet( parse_p.Packets[i]);
				break;
			case 'REGISTERED':
				REGISTERED_packet( parse_p.Packets[i]);
				break;
			default: 
				print_log( "????  " + response);
				break;
			}
		}
	}
	return parse_p;
}

// Таймерная функция получения данных
function getData()
{
	let rc=1;

// отказано в регистрации
	if( myID == 0)
		return 0;

// если еще не было получено состояние контроллера, то запросим
	if( !Object.keys(A).length) {
		writeStatus( ' Не получено состояние контроллера');
		rc = sendmsg( 'GET_STATE');
	}
	if( rc) {
//		print_log( 'Request MRCP'); 
		sendmsg( 'MRCP');
	}
	return rc;
}

// Регистрация клиента
function registerClient()
{
	let rc;
	
// Сгенерируем ID для данной версии    
    myID=getRandomInt(1, 1000000);

    print_log( 'myID: ' + myID);
    let regStr = 'REGISTER:' + myID;
    rc = sendmsg( regStr);
    return rc;
}

function get_appropriate_ws_url()
{
	var u = document.URL;

	/*
	 * We open the websocket encrypted if this page came on an
	 * https:// url itself, otherwise unencrypted
	 */

	if( u.substring(0, 4) == "file")
		return "192.168.101.11";
	
	if (u.substring(0, 5) == "https") {
		u = u.substr(8);
	} else {
		if (u.substring(0, 4) == "http")
			u = u.substr(7);
	}

	u = u.split('/');

	return u[0];
}	

	
// Открытие сокета
function new_ws(urlpath, protocol)
{
	return new WebSocket(urlpath, protocol);
}


// Посылка команды с проверкой открытого сокета
function sendmsg(msg)
{
	if( flagWsOpen) {
//    	print_log( "Send msg:" + msg);
    	ws.send( msg);
    	
    	return 1;
    }
    return 0;
}

function on_matrix_configuration( message) {

		Configuration = JSON.parse( message.payloadString);
		CONFIG_packet( Configuration);
/*	
		if( Configuration) {
			print_log( Configuration);
			addMsg( "Кофигурация получена");
			client.subscribe( topic_status);
			client.subscribe( topic_wgt);

			$("#id_stability").css("visibility", "hidden"); // visible
			$("#id_weight").text( "".padStart( 6, " "));
		}
		else 
			addMsg( "ОШИБКА: неверный пакет конфигурации");
*/			
/*		
		for( var i=0; i< parse_payload.length; ++i) {
			var dev_str = parse_payload[i].id + " канал: " 
				+ parse_payload[i].dev 
				+ ", " + parse_payload[i].tty 
				+ ", " + parse_payload[i].baud 
				+ ", " + parse_payload[i].data
				+ ", " + parse_payload[i].stop
				+ ", " + parse_payload[i].flow
				+ "," + parse_payload[i].parity;
			print_log( dev_str);
			$("#device").append($("<option>", { value: parse_payload[i].id, text: dev_str}));
		}
		if( parse_payload.length > 0) {
			$("#l_device").css("color","#222");
		}
		else {
			$("#l_device").css("color","#ddd");
		}
*/	
	}

	
	function changeUnit( unit)
	{
		$("#id_range_max span:last").text(unit);
		$("#id_range_min span:last").text(unit);
		$("#id_range_discreteness span:last").text(unit);
		$("#id_weight_unit span").text(unit);
	}

	
let currentWeightMode = ' ';
	
	function on_matrix_status( message)
	{
		var pack = JSON.parse( message.payloadString);
		print_log( "status: " + pack);

		if( pack.WeightMode != currentWeightMode) {
			currentWeightMode = pack.WeightMode;
			if( currentWeightMode == 'S') {
				
				changeUnit( Configuration.static_mode.unit);
				$("#body_mode").append('<div class=\"ind_switch\" id=\"mode_static\">В СТАТИКЕ</div>');
				$("#id_mode_type").append('<div class=\"ind_switch\" id=\"mode_static\">ОДИНОЧНОЕ<br>ВЗВЕШИВАНИЕ</div>');
				$("#static_window").css( "display", "block");
			}
		}
	}


// called when the client loses its connection
	function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			print_log("onConnectionLost: "+responseObject.errorCode);
		}
		writeStatus( ' Потеря связи!');
	}

// called when a message arrives
	function onMessageArrived(message) {
		print_log("onMessageArrived: "+ message.topic + " = "  + message.payloadString);
		
		if( message.topic == topic_configuration) {
			on_matrix_configuration( message);
			client.subscribe( topic_status);
			client.subscribe( topic_wgt);

			$("#id_stability").css("visibility", "visible"); // hidden
			$("#id_weight pre:first").text( "22360".padStart( 6, " "));
		}
		else if( message.topic == topic_status) {
			on_matrix_status( message);
		}
/*
		else if( message.topic == topic_wgt) {
			on_matrix_wgt( message);
		}
		else if( message.topic == topic_cmd_response) {
			print_log("onMessageArrived: "+ message.topic + " = "  + message.payloadString);
			
		}
*/		
	}

// called when the client connects
	function onConnect() {
		print_log("onConnect: Соединение ОК");
		writeStatus( " Соединение ОК");
//		$("#id_msg_list").append($("<li>").text( getCurDateTime() + ": Соединение ОК"));		
//		$("#id_msg_list").append($("<li>").text("Соединение ОК"));		
//		$("#id_msg_list").append($("<li>").text("Соединение ОК"));		
  // Once a connection has been made, make a subscription and send a message.
//		print_log("onConnect");
		client.subscribe(topic_configuration);
//		client.subscribe(topic_cmd_response);

//		selectedValue = -1;
//		var json = { "cmd": "channel" , "parameter": "" + selectedValue}
//		var str_json = JSON.stringify(json);
//		client.publish(topic_cmd, str_json, 1, false)
	}

	

//-----------------------------------------------------------------------------------------------
	window.resizeTo(window_width, window_height);

// Все сбросим
	setDefault();


//	document.getElementById('enter').onclick = f_tune_enter;
//	document.getElementById('tune_exit').onclick = f_tune_exit;
	document.getElementById('enter').style.cursor = 'default';

	document.getElementById('result').onclick = f_result_enter;
	document.getElementById('result_exit').onclick = f_result_exit;
//	document.getElementById('result').style.cursor = 'default';

//	document.getElementById('events').onclick = f_alarm_enter;
//	document.getElementById('alarm_exit').onclick = f_alarm_exit;
	document.getElementById('events').style.cursor = 'default';

	document.getElementById('log').onclick = f_log_enter;
	document.getElementById('log_exit').onclick = f_log_exit;
//	document.getElementById('log').style.cursor = 'default';

//	document.getElementById('diagnostics').onclick = f_diag_enter;
//	document.getElementById('diag_exit').onclick = f_diag_exit;
//	document.getElementById('diagnostics').style.cursor = 'default';

	document.getElementById('info').onclick = f_info_enter;
	document.getElementById('info_exit').onclick = f_info_exit;
/*	
	document.getElementById('direct_lr').onclick = f_direct_lr;
	document.getElementById('direct_rl').onclick = f_direct_rl;

	document.getElementById('loco_pos_auto').onclick = f_loco_pos_auto;
	document.getElementById('loco_pos_pull').onclick = f_loco_pos_pull;
	document.getElementById('loco_pos_push').onclick = f_loco_pos_push;
	
	document.getElementById('static_cnt_axis').onclick = f_on_cnt_axis;
	document.getElementById('axis_2').onclick = f_axis_2;
	document.getElementById('axis_4').onclick = f_axis_4;
	document.getElementById('axis_6').onclick = f_axis_6;
	document.getElementById('axis_8').onclick = f_axis_8;
*/	
	document.getElementById('save_car').onclick = f_on_save_car;

	document.getElementById('scroll_left').onclick = f_scroll_left;
	document.getElementById('scroll_right').onclick = f_scroll_right;
	
	document.getElementById('zero').onclick = f_zero;
	document.getElementById('x10').onclick = f_x10;

// Get the modal
	modal_train = document.getElementById('myModalAddTrain');
	document.getElementById('BtnYesTrain').onclick = f_add_train;
	document.getElementById('BtnNoTrain').onclick = f_no_add_train;

	modal_car = document.getElementById('myModalAddCar');
	document.getElementById('BtnYesCar').onclick = f_add_car;
	document.getElementById('BtnNoCar').onclick = f_no_add_car;
	
	modal_reset_result = document.getElementById('myModalResetResult');
	document.getElementById('BtnYesReset').onclick = f_reset_result;
	document.getElementById('BtnNoReset').onclick = f_no_reset_result;
	

	modal_x10 = document.getElementById('myModalX10');
	document.getElementById('BtnSendX10').onclick = f_send_x10;
	document.getElementById('BtnCloseX10').onclick = f_close_x10;

	document.getElementById('confirmation').onclick = f_on_confirmation_result;
	

	// Create a client instance
	var client = new Paho.Client(mqtt.hostname, Number(mqtt.port), "matrix-client-id");

	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

// connect the client
	print_log("attempting to connect...")
	client.connect({onSuccess:onConnect, useSSL: false, userName:"matrix", password:"1234" });	
	
/*
				changeUnit( "кг");
				$("#body_mode").append('<div class=\"ind_switch\" id=\"mode_static\">В СТАТИКЕ</div>');
				$("#id_mode_type").append('<div class=\"ind_switch\" id=\"mode_static\">ОДИНОЧНОЕ<br>ВЗВЕШИВАНИЕ</div>');
				$("#static_window").css( "display", "block");
			$("#id_stability").css("visibility", "visible"); // hidden
			$("#id_weight pre:first").text( "22360".padStart( 6, " "));
*/

	
});
/*
.insertAdjacentHTML("beforeBegin", ...) //$('...').before(...)
.insertAdjacentHTML("afterBegin", ...) //$('...').prepend(...)
.insertAdjacentHTML("beforeEnd", ...) //$('...').append(...)
.insertAdjacentHTML("afterEnd", ...) //$('...').after(...)
*/