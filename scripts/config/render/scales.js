/**
 * render/scales.js — Рендер раздела «Весы» (8.6)
 * Динамическая генерация дерева весов, обзора и параметров каждых весов.
 * Поддерживает до 4-х весов с индивидуальными настройками.
 */

function renderScales(cfg) {
    if (!cfg.scales) cfg.scales = [];
    var scales = cfg.scales;
    var CA = window.ConfigApp;

    // =============================================
    //  ДЕРЕВО (двухуровневое)
    // =============================================
    var $tree = $('#section_scales .section_tree');
    $tree.empty();

    var treeHtml = '<div class="tree_node">' +
        '<div class="tree_item parent expanded active" data-sub="scales-main">' +
            '<span class="tree_icon">\u25BC</span><span class="tree_text">\u0421\u043f\u0438\u0441\u043e\u043a \u0432\u0435\u0441\u043e\u0432</span>' +
        '</div><div class="tree_children">';

    scales.forEach(function(s) {
        treeHtml += '<div class="tree_node">' +
            '<div class="tree_item parent child" data-sub="scales-' + s.id + '-general">' +
                '<span class="tree_icon">\u25BA</span><span class="tree_text">\u0412\u0435\u0441\u044b ' + s.id + '</span>' +
            '</div>' +
            '<div class="tree_children" style="display:none">' +
                '<div class="tree_item child" data-sub="scales-' + s.id + '-range">Max \u0438 \u0446\u0435\u043d\u0430 \u0434\u0435\u043b\u0435\u043d\u0438\u044f</div>' +
                '<div class="tree_item child" data-sub="scales-' + s.id + '-calibration">\u041a\u0430\u043b\u0438\u0431\u0440\u043e\u0432\u043a\u0430</div>' +
                '<div class="tree_item child" data-sub="scales-' + s.id + '-zero">\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 \u0441 \u043d\u0443\u043b\u0435\u043c</div>' +
                '<div class="tree_item child" data-sub="scales-' + s.id + '-tare">\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 \u0441 \u0442\u0430\u0440\u043e\u0439</div>' +
                '<div class="tree_item child" data-sub="scales-' + s.id + '-filter">\u0424\u0438\u043b\u044c\u0442\u0440 \u0438 \u0441\u0442\u0430\u0431\u0438\u043b\u044c\u043d\u043e\u0441\u0442\u044c</div>' +
                '<div class="tree_item child" data-sub="scales-' + s.id + '-motion">\u0412 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438</div>' +
            '</div>' +
        '</div>';
    });
    treeHtml += '</div></div>';
    $tree.html(treeHtml);

    // =============================================
    //  PARAMS: очистка старых sub_section
    // =============================================
    var $params = $('#section_scales .section_params');
    $params.find('.sub_section').remove();

    // =============================================
    //  sub_section: scales-main (обзор)
    // =============================================
    var mainHtml = '<div class="sub_section active" data-sub="scales-main">' +
        '<div class="param_block"><div class="block_header"><label>\u0421\u043f\u0438\u0441\u043e\u043a \u0432\u0435\u0441\u043e\u0432</label></div>' +
        '<div class="platform_selector"><div class="platform_list_items">';
    scales.forEach(function(s, i) {
        var cls = (i === 0) ? 'platforma_on' : 'platforma_off';
        mainHtml += '<div class="' + cls + '" data-scales-id="' + s.id + '">\u0412\u0435\u0441\u044b ' + s.id + '</div>';
    });
    mainHtml += '</div><div class="platform_actions">' +
        '<div class="button button-add" data-action="add-scales">\u0414\u041e\u0411\u0410\u0412\u0418\u0422\u042c</div>' +
        '<div class="button button-delete" data-action="del-scales">\u0423\u0414\u0410\u041b\u0418\u0422\u042c</div>' +
        '</div></div></div></div>';
    $params.append(mainHtml);

    // =============================================
    //  sub_sections: параметры каждых весов
    // =============================================
    scales.forEach(function(s) {
        _renderScaleParams(cfg, s, $params);
    });
}

/**
 * Рендер sub_sections для конкретных весов (general + 6 подразделов)
 */
function _renderScaleParams(cfg, s, $params) {
    var CA = window.ConfigApp;
    var sid = s.id;
    var pfx = 'scales-' + sid;

    // --- general (имя, единицы, назначение ИК) ---
    var unitsVal = CA.UNITS_MAP[s.units] || '2';
    var channels = (cfg.hardware && cfg.hardware.channels) || [];
    var channelIds = s.channelIds || [];

    var gHtml = '<div class="sub_section" data-sub="' + pfx + '-general" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u041e\u0431\u0449\u0438\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b</legend><div class="param_group">' +
        '<div class="param_row"><label class="param_label_long">\u0418\u043c\u044f/\u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439:</label><input type="text" class="param_input_wide" data-field="scales.name" value="' + (s.name || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label_long">\u0415\u0434\u0438\u043d\u0438\u0446\u044b \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044f:</label><select class="param_select" data-field="scales.units">' +
        '<option value="1"' + (unitsVal === '1' ? ' selected' : '') + '>\u0433 (\u0433\u0440\u0430\u043c\u043c)</option>' +
        '<option value="2"' + (unitsVal === '2' ? ' selected' : '') + '>\u043a\u0433 (\u043a\u0438\u043b\u043e\u0433\u0440\u0430\u043c\u043c)</option>' +
        '<option value="3"' + (unitsVal === '3' ? ' selected' : '') + '>\u0442 (\u0442\u043e\u043d\u043d\u0430)</option></select></div>' +
        '</div></fieldset>';

    gHtml += '<fieldset class="param_fieldset"><legend>\u0418\u0437\u043c\u0435\u0440\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043a\u0430\u043d\u0430\u043b\u044b</legend><div class="param_group">';
    if (channels.length === 0) {
        gHtml += '<div class="param_row"><label style="color:#888">\u0418\u0437\u043c\u0435\u0440\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043a\u0430\u043d\u0430\u043b\u044b \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u044b.</label></div>';
    } else {
        channels.forEach(function(ch) {
            var checked = channelIds.indexOf(ch.id) !== -1 ? ' checked' : '';
            gHtml += '<div class="param_row">' +
                '<input type="checkbox" data-field="channel-check" data-ch-id="' + ch.id + '"' + checked + ' style="margin-right:8px;width:18px;height:18px;"/>' +
                '<label>\u2116' + ch.id + ' \u2014 ' + (ch.name || '\u0418\u041a \u2116' + ch.id) + '</label></div>';
        });
    }
    gHtml += '</div></fieldset></div>';
    $params.append(gHtml);

    // --- range ---
    var modeVal = s.mode === 'multiRange' ? '1' : '0';
    var rHtml = '<div class="sub_section" data-sub="' + pfx + '-range" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': Max \u043d\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438 \u0434\u0438\u0441\u043a\u0440\u0435\u0442\u043d\u043e\u0441\u0442\u044c</legend>' +
        '<div class="param_row"><label class="param_label">\u041a\u043e\u043b-\u0432\u043e \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d\u043e\u0432:</label><select class="param_select" data-field="scales.rangesCount">';
    for (var rc = 1; rc <= 3; rc++) {
        rHtml += '<option value="' + rc + '"' + (s.rangesCount == rc ? ' selected' : '') + '>' + rc + '</option>';
    }
    rHtml += '</select></div>' +
        '<div class="param_row"><label class="param_label">\u0420\u0435\u0436\u0438\u043c:</label><select class="param_select" style="width:250px" data-field="scales.mode">' +
        '<option value="0"' + (modeVal === '0' ? ' selected' : '') + '>\u041c\u043d\u043e\u0433\u043e\u0438\u043d\u0442\u0435\u0440\u0432\u0430\u043b\u044c\u043d\u044b\u0439</option>' +
        '<option value="1"' + (modeVal === '1' ? ' selected' : '') + '>\u041c\u043d\u043e\u0433\u043e\u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d\u043d\u044b\u0439</option></select></div>';
    (s.ranges || []).forEach(function(r) {
        rHtml += '<div class="param_row" data-range-id="' + r.id + '">' +
            '<label class="param_label">Max \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d ' + r.id + ':</label>' +
            '<input type="number" class="input_num" data-field="range.max" value="' + r.max + '"/>' +
            '<span class="param_mult">X</span><select class="param_select_small" data-field="range.multiplier">' +
            '<option value="1"' + (r.multiplier == 1 ? ' selected' : '') + '>1</option>' +
            '<option value="2"' + (r.multiplier == 2 ? ' selected' : '') + '>2</option>' +
            '<option value="5"' + (r.multiplier == 5 ? ' selected' : '') + '>5</option></select>' +
            '<span class="param_label_small">e=d</span><input type="number" class="input_num" data-field="range.e" value="' + r.e + '"/>' +
            '<span class="param_unit">\u043a\u0433</span></div>';
    });
    rHtml += '<div class="param_row"><label class="param_label">\u041f\u0435\u0440\u0435\u0433\u0440\u0443\u0437:</label>' +
        '<input type="number" class="input_num" data-field="scales.overload_d" value="' + (s.overload_d || 5) + '"/><span class="param_unit">d</span></div></fieldset></div>';
    $params.append(rHtml);

    // --- calibration ---
    var cHtml = '<div class="sub_section" data-sub="' + pfx + '-calibration" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u041a\u0430\u043b\u0438\u0431\u0440\u043e\u0432\u043a\u0430</legend>' +
        '<div class="param_row"><div class="button" style="width:220px">\u041a\u0430\u043b\u0438\u0431\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u0443\u043b\u044c</div></div>';
    (s.calibration && s.calibration.points || []).forEach(function(pt) {
        if (pt.type === 'load') {
            cHtml += '<div class="param_row"><label class="param_label">\u041c\u0430\u0441\u0441\u0430 \u0433\u0440\u0443\u0437\u0430:</label><input type="number" class="input_num" data-field="cal.mass" value="' + pt.mass + '"/><span class="param_unit">\u043a\u0433</span></div>';
        }
    });
    cHtml += '<div class="param_row"><div class="button" style="width:220px">\u041a\u0430\u043b\u0438\u0431\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u0430\u0433\u0440\u0443\u0437\u043a\u0443</div></div>' +
        '<div class="param_row"><div class="button" style="width:220px">\u041a\u043e\u0440\u0440\u0435\u043a\u0446\u0438\u044f \u043d\u0443\u043b\u044f</div></div></fieldset></div>';
    $params.append(cHtml);

    // --- zero ---
    var z = s.zero || {};
    var zPow = z.powerOn || {};
    var zBtn = z.button || {};
    var zAuto = z.auto || {};
    var zHtml = '<div class="sub_section" data-sub="' + pfx + '-zero" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 \u0441 \u043d\u0443\u043b\u0435\u043c</legend>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u041f\u0440\u0438 \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0438:</div>' +
        '<div class="param_row"><label class="param_label">\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u043d\u0443\u043b\u044f:</label><select class="param_select" data-field="zero.powerOn.mode">' +
        '<option value="current"' + (zPow.mode === 'current' ? ' selected' : '') + '>\u0422\u0435\u043a\u0443\u0449\u0438\u0439</option>' +
        '<option value="beforeOff"' + (zPow.mode === 'beforeOff' ? ' selected' : '') + '>\u0414\u043e \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f</option>' +
        '<option value="calibration"' + (zPow.mode === 'calibration' ? ' selected' : '') + '>\u041a\u0430\u043b\u0438\u0431\u0440\u043e\u0432\u043e\u0447\u043d\u044b\u0439</option></select></div>' +
        '<div class="param_row"><label class="param_label">\u0414\u0438\u0430\u043f\u0430\u0437\u043e\u043d (+/- %Max):</label><input type="number" class="input_num" data-field="zero.powerOn.range_percent" value="' + (zPow.range_percent || 10) + '"/><span class="param_unit">%</span></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u041a\u043d\u043e\u043f\u043a\u0430 "\u041d\u043e\u043b\u044c":</div>' +
        '<div class="param_row"><label class="param_label">\u0410\u043a\u0442\u0438\u0432\u043d\u0430:</label><select class="param_select" data-field="zero.button.enabled"><option value="1"' + (zBtn.enabled !== false ? ' selected' : '') + '>\u0412\u043a\u043b.</option><option value="0"' + (zBtn.enabled === false ? ' selected' : '') + '>\u0412\u044b\u043a\u043b.</option></select></div>' +
        '<div class="param_row"><label class="param_label">\u0414\u0438\u0430\u043f\u0430\u0437\u043e\u043d (+/- %Max):</label><input type="number" class="input_num" data-field="zero.button.range_percent" value="' + (zBtn.range_percent || 2) + '"/><span class="param_unit">%</span></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0441\u043b\u0435\u0436\u0435\u043d\u0438\u0435 \u0437\u0430 \u043d\u0443\u043b\u0435\u043c:</div>' +
        '<div class="param_row"><label class="param_label">\u0421\u043b\u0435\u0436\u0435\u043d\u0438\u0435 \u0437\u0430 \u043d\u0443\u043b\u0435\u043c (d):</label><input type="number" class="input_num" data-field="zero.auto.tracking_d" value="' + (zAuto.tracking_d || 0) + '" step="0.1"/><span class="param_unit">d</span></div>' +
        '<div class="param_row"><label class="param_label">\u041e\u0431\u043d\u0443\u043b\u0435\u043d\u0438\u0435 \u043a\u0430\u0436\u0434\u044b\u0435 (\u0441\u0435\u043a):</label><input type="number" class="input_num" data-field="zero.auto.period_sec" value="' + (zAuto.period_sec || 0) + '"/><span class="param_unit">\u0441\u0435\u043a</span></div></div></fieldset></div>';
    $params.append(zHtml);

    // --- tare ---
    var t = s.tare || {};
    var tAuto = t.auto || {};
    var tClr = t.autoClear || {};
    var tHtml = '<div class="sub_section" data-sub="' + pfx + '-tare" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 \u0441 \u0442\u0430\u0440\u043e\u0439</legend>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u0422\u0438\u043f\u044b \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0442\u0430\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f:</div>' +
        '<div class="param_row"><label class="param_label_long">\u041f\u043e \u043d\u0430\u0436\u0430\u0442\u0438\u044e \u043a\u043d\u043e\u043f\u043a\u0438:</label><select class="param_select" data-field="tare.byButton"><option value="1"' + (t.byButton !== false ? ' selected' : '') + '>\u0412\u043a\u043b.</option><option value="0"' + (t.byButton === false ? ' selected' : '') + '>\u0412\u044b\u043a\u043b.</option></select></div>' +
        '<div class="param_row"><label class="param_label_long">\u0412\u0432\u043e\u0434 \u0441 \u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u044b:</label><select class="param_select" data-field="tare.byKeyboard"><option value="1"' + (t.byKeyboard !== false ? ' selected' : '') + '>\u0412\u043a\u043b.</option><option value="0"' + (t.byKeyboard === false ? ' selected' : '') + '>\u0412\u044b\u043a\u043b.</option></select></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u041f\u0440\u0438 \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0438:</div>' +
        '<div class="param_row"><label class="param_label">\u0422\u0430\u0440\u0430:</label><select class="param_select" data-field="tare.powerOn"><option value="clear"' + (t.powerOn === 'clear' ? ' selected' : '') + '>\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c</option><option value="beforeOff"' + (t.powerOn === 'beforeOff' ? ' selected' : '') + '>\u0414\u043e \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f</option></select></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0442\u0430\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435:</div>' +
        '<div class="param_row"><label class="param_label">\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c:</label><select class="param_select" data-field="tare.auto.enabled"><option value="0"' + (!tAuto.enabled ? ' selected' : '') + '>\u0412\u044b\u043a\u043b.</option><option value="1"' + (tAuto.enabled ? ' selected' : '') + '>\u0412\u043a\u043b.</option></select></div>' +
        '<div class="param_row"><label class="param_label">\u041f\u043e\u0440\u043e\u0433 \u0442\u0430\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f:</label><input type="number" class="input_num" data-field="tare.auto.threshold" value="' + (tAuto.threshold || 100) + '"/><span class="param_unit">\u043a\u0433</span></div></div>' +
        '<div class="param_subgroup"><div class="subgroup_title">\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043e\u0447\u0438\u0441\u0442\u043a\u0430 \u0442\u0430\u0440\u044b:</div>' +
        '<div class="param_row"><label class="param_label">\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c:</label><select class="param_select" data-field="tare.autoClear.enabled"><option value="0"' + (!tClr.enabled ? ' selected' : '') + '>\u0412\u044b\u043a\u043b.</option><option value="1"' + (tClr.enabled ? ' selected' : '') + '>\u0412\u043a\u043b.</option></select></div>' +
        '<div class="param_row"><label class="param_label">\u041f\u043e\u0440\u043e\u0433 \u043e\u0447\u0438\u0441\u0442\u043a\u0438:</label><input type="number" class="input_num" data-field="tare.autoClear.threshold" value="' + (tClr.threshold || 50) + '"/><span class="param_unit">\u043a\u0433</span></div></div></fieldset></div>';
    $params.append(tHtml);

    // --- filter + stability ---
    var f = s.filter || {};
    var st = s.stability || {};
    var filterTypeVal = f.type === 'FIR' ? '1' : '0';
    var fHtml = '<div class="sub_section" data-sub="' + pfx + '-filter" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0444\u0438\u043b\u044c\u0442\u0440\u0430</legend>' +
        '<div class="param_row"><label class="param_label">\u0422\u0438\u043f \u0444\u0438\u043b\u044c\u0442\u0440\u0430:</label><select class="param_select" data-field="filter.type">' +
        '<option value="0"' + (filterTypeVal === '0' ? ' selected' : '') + '>IIR</option><option value="1"' + (filterTypeVal === '1' ? ' selected' : '') + '>FIR</option></select></div>' +
        '<div class="param_row"><label class="param_label">\u0427\u0430\u0441\u0442\u043e\u0442\u0430 \u0441\u0440\u0435\u0437\u0430:</label><select class="param_select" data-field="filter.cutoffFreq">' +
        '<option value="0"' + (f.cutoffFreq == 0 ? ' selected' : '') + '>\u0412\u044b\u043a\u043b.</option>' +
        '<option value="1"' + (f.cutoffFreq == 1 ? ' selected' : '') + '>18Hz</option><option value="2"' + (f.cutoffFreq == 2 ? ' selected' : '') + '>8Hz</option>' +
        '<option value="3"' + (f.cutoffFreq == 3 ? ' selected' : '') + '>4Hz</option><option value="4"' + (f.cutoffFreq == 4 ? ' selected' : '') + '>3Hz</option>' +
        '<option value="5"' + (f.cutoffFreq == 5 ? ' selected' : '') + '>2Hz</option><option value="6"' + (f.cutoffFreq == 6 ? ' selected' : '') + '>1Hz</option>' +
        '<option value="7"' + (f.cutoffFreq == 7 ? ' selected' : '') + '>0.5Hz</option><option value="8"' + (f.cutoffFreq == 8 ? ' selected' : '') + '>0.25Hz</option></select></div>' +
        '<div class="param_row"><label class="param_label">\u0423\u0441\u0440\u0435\u0434\u043d\u0435\u043d\u0438\u0435 (n):</label><input type="number" class="input_num" data-field="filter.averaging_n" value="' + (f.averaging_n || 0) + '" min="0" max="7"/></div></fieldset>' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0441\u0442\u0430\u0431\u0438\u043b\u044c\u043d\u043e\u0441\u0442\u0438</legend>' +
        '<div class="param_row"><label class="param_label">\u0420\u0430\u0437\u043c\u0430\u0445 \u043a\u043e\u043b\u0435\u0431\u0430\u043d\u0438\u0439:</label><input type="number" class="input_num" data-field="stability.range_d" value="' + (st.range_d || 1) + '" step="0.1"/><span class="param_unit">d</span></div>' +
        '<div class="param_row"><label class="param_label">\u0412\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439 \u0438\u043d\u0442\u0435\u0440\u0432\u0430\u043b:</label><input type="number" class="input_num" data-field="stability.period_sec" value="' + (st.period_sec || 0.3) + '" step="0.1"/><span class="param_unit">\u0441\u0435\u043a\u0443\u043d\u0434</span></div></fieldset></div>';
    $params.append(fHtml);

    // --- motion weighing ---
    var wMode = s.weighingMode || 'static';
    var ws = s.wheelSensors || [];
    var sensorInputs = [];
    if (cfg.hardware && cfg.hardware.discreteInputs) {
        cfg.hardware.discreteInputs.forEach(function(inp) {
            if (inp.assignment === 'sensor') {
                sensorInputs.push(inp);
            }
        });
    }

    var mHtml = '<div class="sub_section" data-sub="' + pfx + '-motion" data-scale-id="' + sid + '">' +
        '<fieldset class="param_fieldset"><legend>\u0412\u0435\u0441\u044b \u2116' + sid + ': \u0420\u0435\u0436\u0438\u043c \u0432\u0437\u0432\u0435\u0448\u0438\u0432\u0430\u043d\u0438\u044f</legend>' +
        '<div class="param_row">' +
        '<div class="button' + (wMode === 'static' ? ' button-active' : '') + '" data-field="weighingMode" data-value="static" data-scale-id="' + sid + '" style="width:180px">\u0412 \u0421\u0422\u0410\u0422\u0418\u041a\u0415</div>' +
        '<div class="button' + (wMode === 'motion' ? ' button-active' : '') + '" data-field="weighingMode" data-value="motion" data-scale-id="' + sid + '" style="width:180px">\u0412 \u0414\u0412\u0418\u0416\u0415\u041d\u0418\u0418</div>' +
        '</div></fieldset>';

    mHtml += '<fieldset class="param_fieldset"><legend>\u0414\u0430\u0442\u0447\u0438\u043a\u0438 \u043a\u043e\u043b\u0435\u0441\u0430 (\u0414\u041a)</legend>';
    mHtml += '<table class="param_table"><thead><tr>' +
        '<th>\u2116 \u0414\u041a</th><th>\u2116 \u0414\u0412\u0425</th><th>\u0421\u043c\u0435\u0449\u0435\u043d\u0438\u0435, \u043c\u043c</th><th>\u0410\u043a\u0442\u0438\u0432.\u0437\u043e\u043d\u0430, \u043c\u043c</th>' +
        '</tr></thead><tbody>';

    ws.forEach(function(wk) {
        var inputOpts = '';
        sensorInputs.forEach(function(inp) {
            inputOpts += '<option value="' + inp.id + '"' + (inp.id === wk.inputId ? ' selected' : '') + '>' + inp.id + '</option>';
        });
        mHtml += '<tr data-wk-id="' + wk.id + '">' +
            '<td>' + wk.id + '</td>' +
            '<td><select class="param_select_small" data-field="wk.inputId">' + inputOpts + '</select></td>' +
            '<td><input type="number" class="input_num" data-field="wk.offset_mm" value="' + (wk.offset_mm || 0) + '"/></td>' +
            '<td><input type="number" class="input_num" data-field="wk.activeZone_mm" value="' + (wk.activeZone_mm || 150) + '"/></td>' +
            '</tr>';
    });

    mHtml += '</tbody></table>';
    mHtml += '<div class="param_row" style="margin-top:10px">' +
        '<div class="button button-add" data-action="add-wk" data-scale-id="' + sid + '">\u0414\u041e\u0411\u0410\u0412\u0418\u0422\u042c</div>' +
        '<div class="button button-delete" data-action="del-wk" data-scale-id="' + sid + '">\u0423\u0414\u0410\u041b\u0418\u0422\u042c</div>' +
        '</div></fieldset></div>';
    $params.append(mHtml);
}
