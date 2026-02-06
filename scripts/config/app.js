/**
 * app.js — Точка входа конфигуратора Matrix
 * Глобальные константы, загрузка/сохранение config.json
 *
 * Порядок загрузки скриптов:
 *   1. config-data.js  — window.MATRIX_CONFIG (данные конфигурации)
 *   2. nav.js          — обработчики навигации
 *   3. render/*.js     — функции рендера
 *   4. collect.js      — сбор UI в JSON
 *   5. app.js          — ЭТО ФАЙЛ (точка входа, загружается ПОСЛЕДНИМ)
 */

// Глобальный объект приложения
window.ConfigApp = {
    currentConfig: null,
    UNITS_MAP:     { 'g': '1', 'kg': '2', 't': '3' },
    UNITS_MAP_REV: { '1': 'g', '2': 'kg', '3': 't' },
    ROLES: {
        'admin':    'Администратор',
        'operator': 'Оператор',
        'viewer':   'Только просмотр'
    }
};

$(document).ready(function() {
    var CA = window.ConfigApp;

    // Заполнение UI из JSON
    function applyConfigToUI(cfg) {
        renderGPU(cfg);
        renderHardware(cfg);
        renderScales(cfg);
        renderTerminal(cfg);
    }

    // Загрузка конфигурации
    function loadConfig() {
        // Приоритет 1: попробовать загрузить config.json через AJAX (работает на веб-сервере)
        $.getJSON('config.json')
            .done(function(data) {
                CA.currentConfig = data;
                applyConfigToUI(data);
                console.log('Конфигурация загружена из config.json (AJAX)', data);
            })
            .fail(function() {
                // Приоритет 2: использовать window.MATRIX_CONFIG из config-data.js
                if (window.MATRIX_CONFIG) {
                    var cfg = JSON.parse(JSON.stringify(window.MATRIX_CONFIG));
                    CA.currentConfig = cfg;
                    applyConfigToUI(cfg);
                    console.log('Конфигурация загружена из config-data.js (script tag)', cfg);
                } else {
                    console.error('Не удалось загрузить конфигурацию ни одним способом!');
                }
            });
    }

    // Кнопка СОХРАНИТЬ
    $('#btn_save').click(function() {
        var cfg = collectConfigFromUI();
        var jsonStr = JSON.stringify(cfg, null, 2);
        var blob = new Blob([jsonStr], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        a.click();
        URL.revokeObjectURL(url);
        console.log('Конфигурация сохранена', cfg);
    });

    // Кнопка ВЫХОД
    $('#btn_exit').click(function() {
        if (confirm('Выйти из конфигуратора? Несохраненные изменения будут потеряны.')) {
            window.location.href = 'index.html';
        }
    });

    // Автозагрузка
    loadConfig();
});
