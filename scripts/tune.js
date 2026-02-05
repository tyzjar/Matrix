// Описание настроечной панели
let oTune = {
	id: 'oTune',
	panes: [
		{ menu: 'Аппаратура',
		  groups: [
			{ group: 'Грузоприемное устройство',
			  platforms: {
				id_div: 'id_platform_',  
				menu_platform: 'Грузоприемная платформа №',
				name: 'Имя/комментарий',
				full_length: 'Длина платформы',
				dead_length: 'Невзвешивающий участок',
				max: 4, // максимум платформ
				platform: [], // платформы
			  },
			  f_create_groups: create_groups_platforms,
			},
			{ group: 'Весоизмерительные датчики',
			},
			{ group: 'Измерительные каналы',
			},
			{ group: 'Дискретные датчики',
			},
			{ group: 'Интерфейсы',
			},
		  ],
		},
		{ menu: 'Весы',
		  groups: [
			{ group: 'Весы',
			},
		  ],
		},
		{ menu: 'Контроллеры',
		  groups: [
			{ group: 'Контроль направления',
			},
			{ group: 'Контроль скорости',
			},
			{ group: 'Контроль типа объекта',
			},
  			{ group: 'Контроль положения',
			},
			{ group: 'Контроль останова',
			},
			{ group: 'Контроль реверса направления',
			},
			{ group: 'Контроль направления',
			},
		  ],
		},
		{ menu:	'Приложения',
		  groups: [
			{ group: 'Выключатели приложений',
			},
			{ group: 'Приложение по умолчанию',
			},
			{ group: 'Статическое взвешивание',
			},
			{ group: 'Взвешивание в движении',
			},
		  
		  ],
		},
		{ menu:	'Настройка сети',
		  groups: [
			{ group: 'Внешние клиенты',
			},
			{ group: 'WAN',
			},
		  ],
		},
		{ menu:	'Результаты',
		  groups: [
			{ group: 'Протоколы взвешивания',
			},
			{ group: 'Log-файлы',
			},
		  ],
		},
		{ menu:	'Обслуживание',
		  groups: [
			{ group: 'Весы',
			},
			{ group: 'Региональные установки',
			},
			{ group: 'Дата/время',
			},
			{ group: 'Пользователи',
			},
		  ],
		},
	],
	f_oTune: show_oTune,	// функция создания панели настройки
	f_create_tab: create_tab,
    f_create_pane: create_pane,
};


var $tabs = function (target) {
      var
        _elemTabs = (typeof target === 'string' ? document.querySelector(target) : target),
        _eventTabsShow,
        _showTab = function (tabsLinkTarget) {
          var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
          tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
          tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.tabs__link_active');
          tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.tabs__pane_show');
          // если следующая вкладка равна активной, то завершаем работу
          if (tabsLinkTarget === tabsLinkActive) {
            return;
          }
          // удаляем классы у текущих активных элементов
          if (tabsLinkActive !== null) {
            tabsLinkActive.classList.remove('tabs__link_active');
          }
          if (tabsPaneShow !== null) {
            tabsPaneShow.classList.remove('tabs__pane_show');
          }
          // добавляем классы к элементам (в завимости от выбранной вкладки)
          tabsLinkTarget.classList.add('tabs__link_active');
          tabsPaneTarget.classList.add('tabs__pane_show');
          document.dispatchEvent(_eventTabsShow);
        },
        _switchTabTo = function (tabsLinkIndex) {
          var tabsLinks = _elemTabs.querySelectorAll('.tabs__link');
          if (tabsLinks.length > 0) {
            if (tabsLinkIndex > tabsLinks.length) {
              tabsLinkIndex = tabsLinks.length;
            } else if (tabsLinkIndex < 1) {
              tabsLinkIndex = 1;
            }
            _showTab(tabsLinks[tabsLinkIndex - 1]);
          }
        };

      _eventTabsShow = new CustomEvent('tab.show', { detail: _elemTabs });

      _elemTabs.addEventListener('click', function (e) {
        var tabsLinkTarget = e.target;
        // завершаем выполнение функции, если кликнули не по ссылке
        if (!tabsLinkTarget.classList.contains('tabs__link')) {
          return;
        }
        // отменяем стандартное действие
        e.preventDefault();
        _showTab(tabsLinkTarget);
      });

      return {
        showTab: function (target) {
          _showTab(target);
        },
        switchTabTo: function (index) {
          _switchTabTo(index);
        }
      }

    };

function create_div_platform( num) {
	let div_tag = `<div id=\"${groups.platforms.id_div}` + num + '\"></div>\n';
//	content.insertAdjacentHTML( 'beforeend', div_tag);
	console.log( div_tag);
}

function create_groups_platforms( group)
{
	console.log( 'create_groups_platforms ' + group.group);
	console.log( 'platform =  ' + group.platforms.platform.length);
	if( group.platforms.platform.length > group.platforms.max)
		group.platforms.platform.length = group.platforms.max;
	for( let i=0; i < group.platforms.platform.length; ++i) {
		create_div_platform(i);
	}
}

// Parameters: num - номер табулятора
function create_pane( num) {
//	console.log( thisArg.panes.length);
	
	let groups = this.panes[num].groups;
	let content = document.getElementById( 'content-' + (num + 1));
	for( let i = 0; i < groups.length; ++i) {
		let div_tag = '<div>' + groups[i].group + '\n';
		content.insertAdjacentHTML( 'beforeend', div_tag);
		if( groups[i].hasOwnProperty( 'f_create_groups'))
			groups[i].f_create_groups( groups[i]);
		div_tag = '</div>\n';
		content.insertAdjacentHTML( 'beforeend', div_tag);
	}
}

// создадим div_tab
function create_tab(){
	console.log( this.id);

// если уже есть панели настройки, то ничего не делаем	
	if( document.getElementById( this.id))
		return;
	
	let div_exit = document.getElementById( 'tune_exit').parentElement;
	console.log( div_exit);
	console.log( 'this.panes.length: ' + this.panes.length);

	let tabs_tag = `<div class="tabs" id="${this.id}">
				<div class="tabs__nav">\n`;
	for( let i = 0; i < this.panes.length; ++i) {
		let a_tag = `<a class="tabs__link` + ((i) ? `"` : ` tabs__link_active"`) + ` href="#content-${i+1}">${this.panes[i].menu}</a>\n`;
		tabs_tag += a_tag;
	}				
	
	tabs_tag += `</div>
		<div class="tabs__content\n">`;
	
	for( let i = 0; i < this.panes.length; ++i) {
		let div_tag = `<div class="tabs__pane` + ((i) ? `"` : ` tabs__pane_show"`) + ` id="content-${i+1}">
					</div>\n`;
		tabs_tag += div_tag;
	}
	
	tabs_tag += `	</div>
			</div>
		`;

	console.log( tabs_tag);
	div_exit.insertAdjacentHTML('beforebegin', tabs_tag);


	for( let i=0; i < this.panes.length; ++i) {
		this.f_create_pane(i);
	}	

    $tabs('.tabs');

}	



function show_oTune() {
	this.f_create_tab();
	
}
/*
// Описание настроечной панели
let oTune = {
	id: 'oTune',
	panes: [
		{ menu: 'Аппаратура',
		  groups: [
			{ group: 'Грузоприемное устройство',
			  platforms: {
				id_div: 'id_platform_',  
				menu_platform: 'Грузоприемная платформа №',
				name: 'Имя/комментарий',
				full_length: 'Длина платформы',
				dead_length: 'Невзвешивающий участок',
				max: 4, // максимум платформ
				platform: [], // платформы
			  },
			  f_create_groups: create_groups_platforms,
			},
			{ group: 'Весоизмерительные датчики',
			},
			{ group: 'Измерительные каналы',
			},
			{ group: 'Дискретные датчики',
			},
			{ group: 'Интерфейсы',
			},
		  ],
		},
		{ menu: 'Весы',
		  groups: [
			{ group: 'Весы',
			},
		  ],
		},
		{ menu: 'Контроллеры',
		  groups: [
			{ group: 'Контроль направления',
			},
			{ group: 'Контроль скорости',
			},
			{ group: 'Контроль типа объекта',
			},
  			{ group: 'Контроль положения',
			},
			{ group: 'Контроль останова',
			},
			{ group: 'Контроль реверса направления',
			},
			{ group: 'Контроль направления',
			},
		  ],
		},
		{ menu:	'Приложения',
		  groups: [
			{ group: 'Выключатели приложений',
			},
			{ group: 'Приложение по умолчанию',
			},
			{ group: 'Статическое взвешивание',
			},
			{ group: 'Взвешивание в движении',
			},
		  
		  ],
		},
		{ menu:	'Настройка сети',
		  groups: [
			{ group: 'Внешние клиенты',
			},
			{ group: 'WAN',
			},
		  ],
		},
		{ menu:	'Результаты',
		  groups: [
			{ group: 'Протоколы взвешивания',
			},
			{ group: 'Log-файлы',
			},
		  ],
		},
		{ menu:	'Обслуживание',
		  groups: [
			{ group: 'Весы',
			},
			{ group: 'Региональные установки',
			},
			{ group: 'Дата/время',
			},
			{ group: 'Пользователи',
			},
		  ],
		},
	],
	f_oTune: show_oTune,	// функция создания панели настройки
	f_create_tab: create_tab,
    f_create_pane: create_pane,
};


var $tabs = function (target) {
      var
        _elemTabs = (typeof target === 'string' ? document.querySelector(target) : target),
        _eventTabsShow,
        _showTab = function (tabsLinkTarget) {
          var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
          tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
          tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.tabs__link_active');
          tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.tabs__pane_show');
          // если следующая вкладка равна активной, то завершаем работу
          if (tabsLinkTarget === tabsLinkActive) {
            return;
          }
          // удаляем классы у текущих активных элементов
          if (tabsLinkActive !== null) {
            tabsLinkActive.classList.remove('tabs__link_active');
          }
          if (tabsPaneShow !== null) {
            tabsPaneShow.classList.remove('tabs__pane_show');
          }
          // добавляем классы к элементам (в завимости от выбранной вкладки)
          tabsLinkTarget.classList.add('tabs__link_active');
          tabsPaneTarget.classList.add('tabs__pane_show');
          document.dispatchEvent(_eventTabsShow);
        },
        _switchTabTo = function (tabsLinkIndex) {
          var tabsLinks = _elemTabs.querySelectorAll('.tabs__link');
          if (tabsLinks.length > 0) {
            if (tabsLinkIndex > tabsLinks.length) {
              tabsLinkIndex = tabsLinks.length;
            } else if (tabsLinkIndex < 1) {
              tabsLinkIndex = 1;
            }
            _showTab(tabsLinks[tabsLinkIndex - 1]);
          }
        };

      _eventTabsShow = new CustomEvent('tab.show', { detail: _elemTabs });

      _elemTabs.addEventListener('click', function (e) {
        var tabsLinkTarget = e.target;
        // завершаем выполнение функции, если кликнули не по ссылке
        if (!tabsLinkTarget.classList.contains('tabs__link')) {
          return;
        }
        // отменяем стандартное действие
        e.preventDefault();
        _showTab(tabsLinkTarget);
      });

      return {
        showTab: function (target) {
          _showTab(target);
        },
        switchTabTo: function (index) {
          _switchTabTo(index);
        }
      }

    };

function create_div_platform( num) {
	let div_tag = `<div id=\"${groups.platforms.id_div}`+num+'\"></div>\n';
//	content.insertAdjacentHTML( 'beforeend', div_tag);
	console.log( div_tag);
}

function create_groups_platforms( group)
{
	console.log( 'create_groups_platforms ' + group.group);
	console.log( 'platform =  ' + group.platforms.platform.length);
	if( group.platforms.platform.length > group.platforms.max)
		group.platforms.platform.length = group.platforms.max;
	for( let i=0; i < group.platforms.platform.length; ++i) {
		create_div_platform(i);
	}
}

// Parameters: num - номер табулятора
function create_pane( num) {
//	console.log( thisArg.panes.length);
	
	let groups = this.panes[num].groups;
	let content = document.getElementById( 'content-' + (num + 1));
	for( let i = 0; i < groups.length; ++i) {
		let div_tag = '<div>' + groups[i].group + '\n';
		content.insertAdjacentHTML( 'beforeend', div_tag);
		if( groups[i].hasOwnProperty( 'f_create_groups'))
			groups[i].f_create_groups( groups[i]);
		div_tag = '</div>\n';
		content.insertAdjacentHTML( 'beforeend', div_tag);
	}
}

// создадим div_tab
function create_tab(){
	console.log( this.id);

// если уже есть панели настройки, то ничего не делаем	
	if( document.getElementById( this.id))
		return;
	
	let div_exit = document.getElementById( 'tune_exit').parentElement;
	console.log( div_exit);
	console.log( 'this.panes.length: ' + this.panes.length);

	let tabs_tag = `<div class="tabs" id="${this.id}">
				<div class="tabs__nav">\n`;
	for( let i = 0; i < this.panes.length; ++i) {
		let a_tag = `<a class="tabs__link` + ((i) ? `"` : ` tabs__link_active"`) + ` href="#content-${i+1}">${this.panes[i].menu}</a>\n`;
		tabs_tag += a_tag;
	}				
	
	tabs_tag += `</div>
		<div class="tabs__content\n">`;
	
	for( let i = 0; i < this.panes.length; ++i) {
		let div_tag = `<div class="tabs__pane` + ((i) ? `"` : ` tabs__pane_show"`) + ` id="content-${i+1}">
					</div>\n`;
		tabs_tag += div_tag;
	}
	
	tabs_tag += `	</div>
			</div>
		`;

	console.log( tabs_tag);
	div_exit.insertAdjacentHTML('beforebegin', tabs_tag);


	for( let i=0; i < this.panes.length; ++i) {
		this.f_create_pane(i);
	}	

    $tabs('.tabs');

}	


function show_oTune() {
	this.f_create_tab();
	
}
*/