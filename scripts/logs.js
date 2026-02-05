// Описание панели протоколов
let oLogs = {
	id: 'oLogsInfo',
	oXmlHttp: 0,						// Объект для запросов к серверу
	parse_results:  0,
	f_oLogs: show_oLogs			// функция создания панели логов
};



function parse_protocols_json_logs( response) {
//	print_log( response);
	try {
		oLogs.parse_results = JSON.parse( response);
		
		
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
	return oLogs.parse_results;
}


function handleResponseLogs()
{
	print_log( "handleResponseLogs:oLogs.oXmlHttp.readyState=" + oLogs.oXmlHttp.readyState);
	if( oLogs.oXmlHttp.readyState == 4 ) {
		if( oLogs.oXmlHttp.status == 200 )  {
			print_log( oLogs.oXmlHttp.responseText);
			if( parse_protocols_json_logs(oLogs.oXmlHttp.responseText) != null) {
				let cnt_packets = oLogs.parse_results.length;
				
//				for( var i=0; i<parse_p.Packets.length; ++i) {
				let packet  = oLogs.parse_results;
				print_log( packet);
				
				let cnt = packet.logs.length;
				
				if( cnt > 0) {
					let list_files = "<ul>\n";
					for( i=0; i < cnt; ++i){
						list_files += "<li " + "onclick=showLog('" + packet.logs[i]  + "')>" + packet.logs[i] + "</li>\n";
					}
					list_files += "</ul>\n"
					
					let parent = document.getElementById( 'listLogs');
					parent.insertAdjacentHTML('afterBegin', list_files);					
				}
			}
		}
	else 
	//error_processing( oXmlHttpr.status, oXmlHttpr.statusText );
		print_log( oLogs.oXmlHttp.status  + ' ; ' + oLogs.oXmlHttp.statusText);
	}

}


function handleResponseShowLog()
{
	print_log( oLogs.oXmlHttp.readyState);
	if( oLogs.oXmlHttp.readyState == 4 ) {
		if( oLogs.oXmlHttp.status == 200 )  {
			print_log( oLogs.oXmlHttp.responseText);
			let info = `<p>\n`;
			let str = oLogs.oXmlHttp.responseText.split('\n');
			print_log( "LogStrCnt=" + str.length); 
			for( let i=0; i<str.length; ++i) {
//			while( str[i]) {
				let fields = str[i].split( ';');
				if( fields[1]) {
					info += `<a>`;
					let k = 0;
					while( fields[k]) {
						info += fields[k] + `&emsp;`;
						k++;
					}
					info += `</a><br>`;
					
				}
				else {
					info += `<a>` + str[i] + `</a><br>`;
				}
//				i++;
			}
			info += `</p>\n`;
			let parent = document.getElementById( 'infoLog');
			parent.insertAdjacentHTML('afterBegin', info);					
			
		}
	else 
	//error_processing( oXmlHttpr.status, oXmlHttpr.statusText );
		print_log( oLogs.oXmlHttp.status  + ' ; ' + oLogs.oXmlHttp.statusText);
	}

}

function showLog( log)
{
	print_log( log);
	sendRequest( oLogs.oXmlHttp, '/cgi-bin/showLog.awk', '&LOG=' + log, handleResponseShowLog);
	let info = document.getElementById('infoLog');
	if( info)
		info.innerHTML = '';
}

function show_oLogs()
{

// Уничтожим старые данные
	let list = document.getElementById('listLogs');
	if( list)
		list.innerHTML = '';

	let info = document.getElementById('infoLog');
	if( info)
		info.innerHTML = '';

	try {
		oLogs.oXmlHttp = createXmlHttp();
	}
	catch(e) {
		alert( "Результаты: Ошибка создания объекта oXmlHttp");
	}

	sendRequest( oLogs.oXmlHttp, '/cgi-bin/listLogs.sh', '', handleResponseLogs);
			
}


