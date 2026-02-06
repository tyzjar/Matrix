/**
 * render/hardware.js — Рендер раздела «Аппаратура» (8.5)
 * Измерительные каналы, дискретные входы/выходы, внешние модули ДВВ
 */

// Хелпер: сгенерировать <option> с правильным selected
function _sel(value, current) {
    return value === current ? ' selected' : '';
}

function renderHardware(cfg) {
    if (!cfg.hardware) return;
    var hw = cfg.hardware;

    // --- channels ---
    var $ch = $('#section_hardware .sub_section[data-sub="hardware-channels"]');
    var chHtml = '<div class="param_block"><div class="block_header"><label>Измерительные каналы</label></div><div class="param_group">';
    (hw.channels || []).forEach(function(ch) {
        chHtml += '<fieldset class="param_fieldset"><legend>ИК №' + ch.id + ' — ' + (ch.name || '') + '</legend>' +
            '<div class="param_row"><label class="param_label_long">Имя/комментарий:</label><input type="text" class="param_input_wide" data-field="name" data-ch-id="' + ch.id + '" value="' + (ch.name || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Номер COM-порта:</label><input type="number" class="input_num" data-field="comPort" data-ch-id="' + ch.id + '" value="' + (ch.comPort || 1) + '" min="1"/></div>' +
            '<div class="param_row"><label class="param_label_long">Устройство обработки:</label><select class="param_select" data-field="deviceType" data-ch-id="' + ch.id + '">' +
            '<option value="LDU78.1"' + _sel('LDU78.1', ch.deviceType) + '>LDU 78.1</option>' +
            '<option value="WTX110"' + _sel('WTX110', ch.deviceType) + '>WTX 110</option></select></div>' +
            '<div class="param_row"><label class="param_label_long">Тип датчиков:</label><select class="param_select" data-field="sensors.type" data-ch-id="' + ch.id + '">' +
            '<option value="analog"' + _sel('analog', ch.sensors ? ch.sensors.type : '') + '>Аналоговый (УОАД)</option>' +
            '<option value="digital"' + _sel('digital', ch.sensors ? ch.sensors.type : '') + '>Цифровой (УОЦД)</option></select></div>' +
            '<div class="param_row"><label class="param_label_long">Количество датчиков:</label><input type="number" class="input_num" data-field="sensors.count" data-ch-id="' + ch.id + '" value="' + (ch.sensors ? ch.sensors.count : 4) + '" min="1" max="8"/></div>' +
            '</fieldset>';
    });
    chHtml += '<div class="param_row"><div class="button button-add" data-action="add-channel">ДОБАВИТЬ</div><div class="button button-delete" data-action="del-channel">УДАЛИТЬ</div></div></div></div>';
    $ch.html(chHtml);

    // --- discrete inputs ---
    var DI_OPTIONS = [
        { v: 'off', t: 'Выключен' },
        { v: 'zero', t: 'Обнуление' },
        { v: 'tare', t: 'Тарирование' },
        { v: 'clearTare', t: 'Очистить тару' },
        { v: 'print', t: 'Печать' },
        { v: 'sensor', t: 'Датчик полож.' }
    ];

    var $di = $('#section_hardware .sub_section[data-sub="hardware-inputs"]');
    var diHtml = '<div class="param_block"><div class="block_header"><label>Дискретные входы</label></div><div class="param_group">';
    (hw.discreteInputs || []).forEach(function(inp) {
        var assignOpts = '';
        DI_OPTIONS.forEach(function(o) { assignOpts += '<option value="' + o.v + '"' + _sel(o.v, inp.assignment) + '>' + o.t + '</option>'; });
        diHtml += '<fieldset class="param_fieldset"><legend>ДВХ №' + inp.id + ' — ' + (inp.name || '') + '</legend>' +
            '<div class="param_row"><label class="param_label_long">Имя:</label><input type="text" class="param_input_wide" data-field="name" data-di-id="' + inp.id + '" value="' + (inp.name || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Адрес:</label><input type="text" class="param_input" data-field="address" data-di-id="' + inp.id + '" value="' + (inp.address || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Весы №:</label><input type="number" class="input_num" data-field="scalesId" data-di-id="' + inp.id + '" value="' + (inp.scalesId || 1) + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Назначение:</label><select class="param_select" data-field="assignment" data-di-id="' + inp.id + '">' + assignOpts + '</select></div>' +
            '<div class="param_row"><label class="param_label_long">Координата, мм:</label><input type="number" class="input_num" data-field="coordinate_mm" data-di-id="' + inp.id + '" value="' + (inp.coordinate_mm || 0) + '"/></div>' +
            '</fieldset>';
    });
    if ((hw.discreteInputs || []).length === 0) {
        diHtml += '<p style="color:#888;padding:20px;">Дискретные входы не настроены.</p>';
    }
    diHtml += '<div class="param_row"><div class="button button-add" data-action="add-di">ДОБАВИТЬ</div><div class="button button-delete" data-action="del-di">УДАЛИТЬ</div></div></div></div>';
    $di.html(diHtml);

    // --- discrete outputs ---
    var DO_OPTIONS = [
        { v: 'off', t: 'Выключен' },
        { v: 'centerZero', t: 'Центр нуля' },
        { v: 'unstable', t: 'Нестабильность' },
        { v: 'underload', t: 'Недогруз' },
        { v: 'overload', t: 'Перегруз' },
        { v: 'net', t: 'Нетто' },
        { v: 'inTolerance', t: 'В допуске' },
        { v: 'feedMax', t: 'Подача МАКС' },
        { v: 'feedFine', t: 'Подача ТОЧНО' },
        { v: 'inPosition', t: 'В позиции' },
        { v: 'control', t: 'Управление' }
    ];

    var $do = $('#section_hardware .sub_section[data-sub="hardware-outputs"]');
    var doHtml = '<div class="param_block"><div class="block_header"><label>Дискретные выходы</label></div><div class="param_group">';
    (hw.discreteOutputs || []).forEach(function(out) {
        var assignOpts = '';
        DO_OPTIONS.forEach(function(o) { assignOpts += '<option value="' + o.v + '"' + _sel(o.v, out.assignment) + '>' + o.t + '</option>'; });
        doHtml += '<fieldset class="param_fieldset"><legend>ДВЫХ №' + out.id + ' — ' + (out.name || '') + '</legend>' +
            '<div class="param_row"><label class="param_label_long">Имя:</label><input type="text" class="param_input_wide" data-field="name" data-do-id="' + out.id + '" value="' + (out.name || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Адрес:</label><input type="text" class="param_input" data-field="address" data-do-id="' + out.id + '" value="' + (out.address || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Весы №:</label><input type="number" class="input_num" data-field="scalesId" data-do-id="' + out.id + '" value="' + (out.scalesId || 1) + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Назначение:</label><select class="param_select" data-field="assignment" data-do-id="' + out.id + '">' + assignOpts + '</select></div>' +
            '</fieldset>';
    });
    if ((hw.discreteOutputs || []).length === 0) {
        doHtml += '<p style="color:#888;padding:20px;">Дискретные выходы не настроены.</p>';
    }
    doHtml += '<div class="param_row"><div class="button button-add" data-action="add-do">ДОБАВИТЬ</div><div class="button button-delete" data-action="del-do">УДАЛИТЬ</div></div></div></div>';
    $do.html(doHtml);

    // --- external modules ---
    var $em = $('#section_hardware .sub_section[data-sub="hardware-modules"]');
    var emHtml = '<div class="param_block"><div class="block_header"><label>Внешние модули ДВВ</label></div><div class="param_group">';
    (hw.externalModules || []).forEach(function(m) {
        emHtml += '<fieldset class="param_fieldset"><legend>Модуль №' + m.id + ' — ' + (m.name || '') + '</legend>' +
            '<div class="param_row"><label class="param_label_long">Имя:</label><input type="text" class="param_input_wide" data-field="name" data-mod-id="' + m.id + '" value="' + (m.name || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">IP-адрес:</label><input type="text" class="param_input" data-field="ip" data-mod-id="' + m.id + '" value="' + (m.ip || '') + '"/></div>' +
            '<div class="param_row"><label class="param_label_long">Маска подсети:</label><input type="text" class="param_input" data-field="subnet" data-mod-id="' + m.id + '" value="' + (m.subnet || '') + '"/></div>' +
            '</fieldset>';
    });
    if ((hw.externalModules || []).length === 0) {
        emHtml += '<p style="color:#888;padding:20px;">Внешние модули ДВВ не настроены.</p>';
    }
    emHtml += '<div class="param_row"><div class="button button-add" data-action="add-module">ДОБАВИТЬ</div><div class="button button-delete" data-action="del-module">УДАЛИТЬ</div></div></div></div>';
    $em.html(emHtml);
}
