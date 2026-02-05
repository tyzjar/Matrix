// Описание панели протоколов
let oResults = {
	id: 'oResultsInfo',
	oXmlHttp: 0,						// Объект для запросов к серверу
	parse_results:  0,
	f_oResults: show_oResults			// функция создания панели протоколов
};



function parse_protocols_json( response) {
//	print_log( response);
	try {
		oResults.parse_results = JSON.parse( response);
		
		
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
	return oResults.parse_results;
}


function handleResponseResults()
{
	if( oResults.oXmlHttp.readyState == 4 ) {
		if( oResults.oXmlHttp.status == 200 )  {
			print_log( oResults.oXmlHttp.responseText);
			if( parse_protocols_json(oResults.oXmlHttp.responseText) != null) {
				let cnt_packets = oResults.parse_results.length;
				
//				for( var i=0; i<parse_p.Packets.length; ++i) {
				let packet  = oResults.parse_results;
				print_log( packet);
				
				let cnt = packet.protocols.length;
				
				if( cnt > 0) {
					let list_files = "<ul>\n";
					for( i=0; i < cnt; ++i){
						list_files += "<li " + "onclick=showProtocol('" + packet.protocols[i]  + "')>" + packet.protocols[i] + "</li>\n";
					}
					list_files += "</ul>\n"
					
					let parent = document.getElementById( 'listProtocols');
					parent.insertAdjacentHTML('afterBegin', list_files);					
				}
			}
		}
	else 
	//error_processing( oXmlHttpr.status, oXmlHttpr.statusText );
		print_log( oResults.oXmlHttp.status  + ' ; ' + oResults.oXmlHttp.statusText);
	}

}


function handleResponseShowProtocol()
{
	if( oResults.oXmlHttp.readyState == 4 ) {
		if( oResults.oXmlHttp.status == 200 )  {
			print_log( oResults.oXmlHttp.responseText);
			let info = `<p>\n`;
			let str = oResults.oXmlHttp.responseText.split('\n');
			let i = 0;
			while( str[i]) {
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
				i++;
			}
			info += `</p>\n`;
			let parent = document.getElementById( 'infoProtocol');
			parent.insertAdjacentHTML('afterBegin', info);					
			
		}
	else 
	//error_processing( oXmlHttpr.status, oXmlHttpr.statusText );
		print_log( oResults.oXmlHttp.status  + ' ; ' + oResults.oXmlHttp.statusText);
	}

}

function showProtocol( protocol)
{
	print_log( protocol);
	sendRequest( oResults.oXmlHttp, '/cgi-bin/showProtocol.awk', '&PROTOCOL=' + protocol, handleResponseShowProtocol);
	let info = document.getElementById('infoProtocol');
	if( info)
		info.innerHTML = '';
}

function show_oResults()
{

// Уничтожим старые данные
	let list = document.getElementById('listProtocols');
	if( list)
		list.innerHTML = '';

	let info = document.getElementById('infoProtocol');
	if( info)
		info.innerHTML = '';

	try {
		oResults.oXmlHttp = createXmlHttp();
	}
	catch(e) {
		alert( "Результаты: Ошибка создания объекта oXmlHttp");
	}

	sendRequest( oResults.oXmlHttp, '/cgi-bin/listProtocols.sh', '', handleResponseResults);
			
}


