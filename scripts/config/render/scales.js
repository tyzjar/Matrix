/**
 * render/scales.js — Рендер раздела «Весы» (8.6)
 * Назначение ИК, Max/цена деления, калибровка, нуль, тара, фильтр, стабильность
 */
function renderScales(cfg) {
    if (!cfg.scales || !cfg.scales[0]) return;
    var s = cfg.scales[0];
    var CA = window.ConfigApp;

    // --- assign ---
    var $assign = $('#section_scales .sub_section[data-sub="scales-assign"]');
    var unitsVal = CA.UNITS_MAP[s.units] || '2';
    $assign.html('<fieldset class="param_fieldset"><legend>Назначение измерительных каналов</legend><div class="param_group">' +
        '<div class="param_row"><label class="param_label_long">Имя/комментарий:</label><input type="text" class="param_input_wide" data-field="scales.name" value="' + (s.name || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label_long">Единицы измерения:</label><select class="param_select" data-field="scales.units">' +
        '<option value="1"' + (unitsVal === '1' ? ' selected' : '') + '>г (грамм)</option>' +
        '<option value="2"' + (unitsVal === '2' ? ' selected' : '') + '>кг (килограмм)</option>' +
        '<option value="3"' + (unitsVal === '3' ? ' selected' : '') + '>т (тонна)</option></select></div>' +
        '</div></fieldset>');

    // --- range ---
    var modeVal = s.mode === 'multiRange' ? '1' : '0';
    var $range = $('#section_scales .sub_section[data-sub="scales-range"]');
    var rHtml = '<fieldset class="param_fieldset"><legend>Max нагрузка и дискретность</legend>' +
        '<div class="param_row"><label class="param_label">Кол-во диапазонов:</label><select class="param_select" data-field="scales.rangesCount">';
    for (var rc = 1; rc <= 3; rc++) {
        rHtml += '<option value="' + rc + '"' + (s.rangesCount == rc ? ' selected' : '') + '>' + rc + '</option>';
    }
    rHtml += '</select></div>' +
        '<div class="param_row"><label class="param_label">Режим:</label><select class="param_select" style="width:250px" data-field="scales.mode">' +
        '<option value="0"' + (modeVal === '0' ? ' selected' : '') + '>Многоинтервальный</option>' +
        '<option value="1"' + (modeVal === '1' ? ' selected' : '') + '>Многодиапазонный</option></select></div>';
    (s.ranges || []).forEach(function(r) {
        rHtml += '<div class="param_row" data-range-id="' + r.id + '">' +
            '<label class="param_label">Max диапазон ' + r.id + ':</label>' +
            '<input type="number" class="input_num" data-field="range.max" value="' + r.max + '"/>' +
            '<span class="param_mult">X</span><select class="param_select_small" data-field="range.multiplier">' +
            '<option value="1"' + (r.multiplier == 1 ? ' selected' : '') + '>1</option>' +
            '<option value="2"' + (r.multiplier == 2 ? ' selected' : '') + '>2</option>' +
            '<option value="5"' + (r.multiplier == 5 ? ' selected' : '') + '>5</option></select>' +
            '<span class="param_label_small">e=d</span><input type="number" class="input_num" data-field="range.e" value="' + r.e + '"/>' +
            '<span class="param_unit">кг</span></div>';
    });
    rHtml += '<div class="param_row"><label class="param_label">Перегруз:</label>' +
        '<input type="number" class="input_num" data-field="scales.overload_d" value="' + (s.overload_d || 5) + '"/><span class="param_unit">d</span></div></fieldset>';
    $range.html(rHtml);

    // --- calibration ---
    var $cal = $('#section_scales .sub_section[data-sub="scales-calibration"]');
    var cHtml = '<fieldset class="param_fieldset"><legend>Калибровка</legend>' +
        '<div class="param_row"><div class="button" style="width:220px">Калибровать нуль</div></div>';
    (s.calibration && s.calibration.points || []).forEach(function(pt) {
        if (pt.type === 'load') {
            cHtml += '<div class="param_row"><label class="param_label">Масса груза:</label><input type="number" class="input_num" data-field="cal.mass" value="' + pt.mass + '"/><span class="param_unit">кг</span></div>';
        }
    });
    cHtml += '<div class="param_row"><div class="button" style="width:220px">Калибровать нагрузку</div></div>' +
        '<div class="param_row"><div class="button" style="width:220px">Коррекция нуля</div></div></fieldset>';
    $cal.html(cHtml);

    // --- zero ---
    var z = s.zero || {};
    var zPow = z.powerOn || {};
    var zBtn = z.button || {};
    var zAuto = z.auto || {};
    var $zero = $('#section_scales .sub_section[data-sub="scales-zero"]');
    $zero.html('<fieldset class="param_fieldset"><legend>Операции с нулем</legend>' +
        '<div class="param_subgroup"><div class="subgroup_title">При включении:</div>' +
        '<div class="param_row"><label class="param_label">Установка нуля:</label><select class="param_select" data-field="zero.powerOn.mode">' +
        '<option value="current"' + (zPow.mode === 'current' ? ' selected' : '') + '>Текущий</option>' +
        '<option value="beforeOff"' + (zPow.mode === 'beforeOff' ? ' selected' : '') + '>До отключения</option>' +
        '<option value="calibration"' + (zPow.mode === 'calibration' ? ' selected' : '') + '>Калибровочный</option></select></div>' +
        '<div class="param_row"><label class="param_label">Диапазон (+/- %Max):</label><input type="number" class="input_num" data-field="zero.powerOn.range_percent" value="' + (zPow.range_percent || 10) + '"/><span class="param_unit">%</span></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">Кнопка "Ноль":</div>' +
        '<div class="param_row"><label class="param_label">Активна:</label><select class="param_select" data-field="zero.button.enabled"><option value="1"' + (zBtn.enabled !== false ? ' selected' : '') + '>Вкл.</option><option value="0"' + (zBtn.enabled === false ? ' selected' : '') + '>Выкл.</option></select></div>' +
        '<div class="param_row"><label class="param_label">Диапазон (+/- %Max):</label><input type="number" class="input_num" data-field="zero.button.range_percent" value="' + (zBtn.range_percent || 2) + '"/><span class="param_unit">%</span></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">Автоматическое слежение за нулем:</div>' +
        '<div class="param_row"><label class="param_label">Слежение за нулем (d):</label><input type="number" class="input_num" data-field="zero.auto.tracking_d" value="' + (zAuto.tracking_d || 0) + '" step="0.1"/><span class="param_unit">d</span></div>' +
        '<div class="param_row"><label class="param_label">Обнуление каждые (сек):</label><input type="number" class="input_num" data-field="zero.auto.period_sec" value="' + (zAuto.period_sec || 0) + '"/><span class="param_unit">сек</span></div></div></fieldset>');

    // --- tare ---
    var t = s.tare || {};
    var tAuto = t.auto || {};
    var tClr = t.autoClear || {};
    var $tare = $('#section_scales .sub_section[data-sub="scales-tare"]');
    $tare.html('<fieldset class="param_fieldset"><legend>Операции с тарой</legend>' +
        '<div class="param_subgroup"><div class="subgroup_title">Типы операций тарирования:</div>' +
        '<div class="param_row"><label class="param_label_long">По нажатию кнопки:</label><select class="param_select" data-field="tare.byButton"><option value="1"' + (t.byButton !== false ? ' selected' : '') + '>Вкл.</option><option value="0"' + (t.byButton === false ? ' selected' : '') + '>Выкл.</option></select></div>' +
        '<div class="param_row"><label class="param_label_long">Ввод с клавиатуры:</label><select class="param_select" data-field="tare.byKeyboard"><option value="1"' + (t.byKeyboard !== false ? ' selected' : '') + '>Вкл.</option><option value="0"' + (t.byKeyboard === false ? ' selected' : '') + '>Выкл.</option></select></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">При включении:</div>' +
        '<div class="param_row"><label class="param_label">Тара:</label><select class="param_select" data-field="tare.powerOn"><option value="clear"' + (t.powerOn === 'clear' ? ' selected' : '') + '>Очистить</option><option value="beforeOff"' + (t.powerOn === 'beforeOff' ? ' selected' : '') + '>До отключения</option></select></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">Автоматическое тарирование:</div>' +
        '<div class="param_row"><label class="param_label">Включить:</label><select class="param_select" data-field="tare.auto.enabled"><option value="0"' + (!tAuto.enabled ? ' selected' : '') + '>Выкл.</option><option value="1"' + (tAuto.enabled ? ' selected' : '') + '>Вкл.</option></select></div>' +
        '<div class="param_row"><label class="param_label">Порог тарирования:</label><input type="number" class="input_num" data-field="tare.auto.threshold" value="' + (tAuto.threshold || 100) + '"/><span class="param_unit">кг</span></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">Автоматическая очистка тары:</div>' +
        '<div class="param_row"><label class="param_label">Включить:</label><select class="param_select" data-field="tare.autoClear.enabled"><option value="0"' + (!tClr.enabled ? ' selected' : '') + '>Выкл.</option><option value="1"' + (tClr.enabled ? ' selected' : '') + '>Вкл.</option></select></div>' +
        '<div class="param_row"><label class="param_label">Порог очистки:</label><input type="number" class="input_num" data-field="tare.autoClear.threshold" value="' + (tClr.threshold || 50) + '"/><span class="param_unit">кг</span></div></div></fieldset>');

    // --- filter + stability ---
    var f = s.filter || {};
    var st = s.stability || {};
    var filterTypeVal = f.type === 'FIR' ? '1' : '0';
    var $filt = $('#section_scales .sub_section[data-sub="scales-filter"]');
    $filt.html('<fieldset class="param_fieldset"><legend>Параметры фильтра</legend>' +
        '<div class="param_row"><label class="param_label">Тип фильтра:</label><select class="param_select" data-field="filter.type">' +
        '<option value="0"' + (filterTypeVal === '0' ? ' selected' : '') + '>IIR</option><option value="1"' + (filterTypeVal === '1' ? ' selected' : '') + '>FIR</option></select></div>' +
        '<div class="param_row"><label class="param_label">Частота среза:</label><select class="param_select" data-field="filter.cutoffFreq">' +
        '<option value="0"' + (f.cutoffFreq == 0 ? ' selected' : '') + '>Выкл.</option>' +
        '<option value="1"' + (f.cutoffFreq == 1 ? ' selected' : '') + '>18Hz</option><option value="2"' + (f.cutoffFreq == 2 ? ' selected' : '') + '>8Hz</option>' +
        '<option value="3"' + (f.cutoffFreq == 3 ? ' selected' : '') + '>4Hz</option><option value="4"' + (f.cutoffFreq == 4 ? ' selected' : '') + '>3Hz</option>' +
        '<option value="5"' + (f.cutoffFreq == 5 ? ' selected' : '') + '>2Hz</option><option value="6"' + (f.cutoffFreq == 6 ? ' selected' : '') + '>1Hz</option>' +
        '<option value="7"' + (f.cutoffFreq == 7 ? ' selected' : '') + '>0.5Hz</option><option value="8"' + (f.cutoffFreq == 8 ? ' selected' : '') + '>0.25Hz</option></select></div>' +
        '<div class="param_row"><label class="param_label">Усреднение (n):</label><input type="number" class="input_num" data-field="filter.averaging_n" value="' + (f.averaging_n || 0) + '" min="0" max="7"/></div></fieldset>' +
        '<fieldset class="param_fieldset"><legend>Параметры стабильности</legend>' +
        '<div class="param_row"><label class="param_label">Размах колебаний:</label><input type="number" class="input_num" data-field="stability.range_d" value="' + (st.range_d || 1) + '" step="0.1"/><span class="param_unit">d</span></div>' +
        '<div class="param_row"><label class="param_label">Временной интервал:</label><input type="number" class="input_num" data-field="stability.period_sec" value="' + (st.period_sec || 0.3) + '" step="0.1"/><span class="param_unit">секунд</span></div></fieldset>');
}
