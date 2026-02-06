/**
 * render/terminal.js — Рендер раздела «Терминал» (8.7)
 * Общие данные, пользователи, региональные установки, дата и время
 */
function renderTerminal(cfg) {
    if (!cfg.terminal) return;
    var tm = cfg.terminal;
    var reg = tm.regional || {};
    var dt = tm.datetime || {};
    var nid = tm.numericId || {};
    var CA = window.ConfigApp;

    // --- general ---
    var $gen = $('#section_terminal .sub_section[data-sub="terminal-general"]');
    $gen.html('<fieldset class="param_fieldset"><legend>Общие данные</legend>' +
        '<div class="param_row"><label class="param_label_long">Числовой ID (часть 1):</label><input type="number" class="input_num" data-field="terminal.numericId.part1" value="' + (nid.part1 || 0) + '"/>' +
        '<label style="margin-left:10px">. часть 2:</label><input type="number" class="input_num" data-field="terminal.numericId.part2" value="' + (nid.part2 || 0) + '"/></div>' +
        '<div class="param_row"><label class="param_label_long">Символьное имя:</label><input type="text" class="param_input_wide" data-field="terminal.symbolicName" value="' + (tm.symbolicName || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label_long">Владелец:</label><input type="text" class="param_input_wide" data-field="terminal.owner" value="' + (tm.owner || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label_long">Серийный номер:</label><input type="text" class="param_input_wide" data-field="terminal.serialNumber" value="' + (tm.serialNumber || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label_long">Версия ПО:</label><input type="text" class="param_input_wide" data-field="terminal.softwareVersion" value="' + (tm.softwareVersion || '') + '" readonly style="background:#f0f0f0"/></div></fieldset>');

    // --- users ---
    var $usr = $('#section_terminal .sub_section[data-sub="terminal-users"]');
    var uHtml = '<fieldset class="param_fieldset"><legend>Пользователи</legend><div class="users_list">';
    (tm.users || []).forEach(function(u, i) {
        var act = i === 0 ? ' active' : '';
        uHtml += '<div class="user_item' + act + '" data-user-id="' + u.id + '">' +
            '<span class="user_name">' + u.name + '</span>' +
            '<span class="user_role">' + (CA.ROLES[u.role] || u.role) + '</span></div>';
    });
    uHtml += '</div><div class="param_row"><div class="button">ДОБАВИТЬ</div><div class="button">ИЗМЕНИТЬ</div><div class="button button-delete">УДАЛИТЬ</div></div></fieldset>';
    $usr.html(uHtml);

    // --- regional ---
    var $reg = $('#section_terminal .sub_section[data-sub="terminal-regional"]');
    $reg.html('<fieldset class="param_fieldset"><legend>Региональные установки</legend>' +
        '<div class="param_row"><label class="param_label">Часовой пояс:</label><select class="param_select" style="width:250px" data-field="regional.timezone">' +
        '<option value="0"' + (reg.timezone == 0 ? ' selected' : '') + '>UTC+0 (Лондон)</option>' +
        '<option value="3"' + (reg.timezone == 3 ? ' selected' : '') + '>UTC+3 (Москва)</option>' +
        '<option value="5"' + (reg.timezone == 5 ? ' selected' : '') + '>UTC+5 (Екатеринбург)</option></select></div>' +
        '<div class="param_row"><label class="param_label">Формат даты:</label><select class="param_select" data-field="regional.dateFormat">' +
        '<option value="DD-MM-YY"' + (reg.dateFormat === 'DD-MM-YY' ? ' selected' : '') + '>ДД.ММ.ГГГГ</option>' +
        '<option value="YYYY-MM-DD"' + (reg.dateFormat === 'YYYY-MM-DD' ? ' selected' : '') + '>ГГГГ-ММ-ДД</option>' +
        '<option value="MM-DD-YYYY"' + (reg.dateFormat === 'MM-DD-YYYY' ? ' selected' : '') + '>ММ/ДД/ГГГГ</option></select></div>' +
        '<div class="param_row"><label class="param_label">Разделитель даты:</label><select class="param_select" data-field="regional.dateSeparator">' +
        '<option value="."' + (reg.dateSeparator === '.' ? ' selected' : '') + '>. (точка)</option>' +
        '<option value="/"' + (reg.dateSeparator === '/' ? ' selected' : '') + '>/ (косая черта)</option></select></div>' +
        '<div class="param_row"><label class="param_label">Формат времени:</label><select class="param_select" data-field="regional.timeFormat">' +
        '<option value="24:MM"' + (reg.timeFormat === '24:MM' ? ' selected' : '') + '>24:MM</option>' +
        '<option value="24:MM:SS"' + (reg.timeFormat === '24:MM:SS' ? ' selected' : '') + '>24:MM:SS</option>' +
        '<option value="12:MM"' + (reg.timeFormat === '12:MM' ? ' selected' : '') + '>12:MM</option>' +
        '<option value="12:MM:SS"' + (reg.timeFormat === '12:MM:SS' ? ' selected' : '') + '>12:MM:SS</option></select></div>' +
        '<div class="param_row"><label class="param_label">NTP-сервер:</label><input type="text" class="param_input_wide" data-field="regional.ntpServer" value="' + (reg.ntpServer || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label">Автоустановка времени:</label><select class="param_select" data-field="regional.autoTime">' +
        '<option value="0"' + (!reg.autoTime ? ' selected' : '') + '>Выкл.</option><option value="1"' + (reg.autoTime ? ' selected' : '') + '>Вкл.</option></select></div></fieldset>');

    // --- datetime ---
    var $dt = $('#section_terminal .sub_section[data-sub="terminal-datetime"]');
    $dt.html('<fieldset class="param_fieldset"><legend>Установка даты и времени</legend>' +
        '<div class="param_row"><label class="param_label">Текущая дата:</label><input type="date" class="param_input" data-field="datetime.date" value="' + (dt.date || '') + '"/></div>' +
        '<div class="param_row"><label class="param_label">Текущее время:</label><input type="time" class="param_input" data-field="datetime.time" value="' + (dt.time ? dt.time.substring(0, 5) : '') + '"/></div>' +
        '<div class="param_row"><div class="button" style="width:200px">Установить время</div><div class="button" style="width:180px">Синхронизация NTP</div></div></fieldset>');
}
