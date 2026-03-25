/**
 * actions.js — Обработчики кнопок ДОБАВИТЬ/УДАЛИТЬ
 * Модифицирует ConfigApp.currentConfig и перерисовывает UI
 */

// Хелпер: следующий свободный id в массиве объектов с полем id
function _nextId(arr) {
    var max = 0;
    (arr || []).forEach(function(item) { if (item.id > max) max = item.id; });
    return max + 1;
}

// Хелпер: перед действием сохраняем текущие значения UI в currentConfig
function _syncBeforeAction() {
    var CA = window.ConfigApp;
    if (CA.currentConfig) {
        CA.currentConfig = collectConfigFromUI();
    }
}

$(document).ready(function() {
    var CA = window.ConfigApp;

    // =============================================
    //  ПЛАТФОРМЫ — ДОБАВИТЬ / УДАЛИТЬ / ОБНОВИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-platform"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.gpu) cfg.gpu = { comment: '', platforms: [] };
        var newId = _nextId(cfg.gpu.platforms);
        cfg.gpu.platforms.push({
            id: newId,
            name: 'Новая платформа №' + newId,
            sections: [{ id: 1, length_mm: 3000, nonWeighing_mm: 0 }],
            nonWeighing_mm: 0
        });
        renderGPU(cfg);
    });

    $(document).on('click', '[data-action="del-platform"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.gpu || !cfg.gpu.platforms || cfg.gpu.platforms.length <= 1) {
            alert('Должна остаться хотя бы одна платформа.');
            return;
        }
        var $active = $('.platforma_on');
        var activeId = parseInt($active.data('platform-id'));
        var activeIdx = -1;
        cfg.gpu.platforms.forEach(function(p, i) {
            if (p.id === activeId) activeIdx = i;
        });
        if (activeIdx === -1) activeIdx = cfg.gpu.platforms.length - 1;
        cfg.gpu.platforms.splice(activeIdx, 1);
        renderGPU(cfg);
    });

    $(document).on('click', '[data-action="refresh-gpu"]', function() {
        _syncBeforeAction();
        renderGPU(CA.currentConfig);
    });

    // =============================================
    //  СЕКЦИИ ПЛАТФОРМЫ — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-section"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        var $sub = $(this).closest('.sub_section');
        var platformId = parseInt($sub.data('sub').replace('gpu-platform', ''));
        var platform = null;
        cfg.gpu.platforms.forEach(function(p) { if (p.id === platformId) platform = p; });
        if (!platform) return;
        var newSecId = _nextId(platform.sections);
        platform.sections.push({ id: newSecId, length_mm: 3000, nonWeighing_mm: 0 });
        renderGPU(cfg);
        // Переключиться обратно на эту платформу
        var $tree = $('#section_gpu .section_tree');
        $tree.find('.tree_item').removeClass('active');
        $tree.find('[data-sub="gpu-platform' + platformId + '"]').addClass('active');
        $('#section_gpu .sub_section').removeClass('active');
        $('#section_gpu .sub_section[data-sub="gpu-platform' + platformId + '"]').addClass('active');
    });

    $(document).on('click', '[data-action="del-section"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        var $sub = $(this).closest('.sub_section');
        var platformId = parseInt($sub.data('sub').replace('gpu-platform', ''));
        var platform = null;
        cfg.gpu.platforms.forEach(function(p) { if (p.id === platformId) platform = p; });
        if (!platform || !platform.sections || platform.sections.length <= 1) {
            alert('Должна остаться хотя бы одна секция.');
            return;
        }
        // Удалить активную секцию или последнюю
        var $active = $sub.find('.section_item.active');
        var activeSecId = $active.length ? parseInt($active.data('section-id')) : 0;
        var idx = -1;
        platform.sections.forEach(function(s, i) { if (s.id === activeSecId) idx = i; });
        if (idx === -1) idx = platform.sections.length - 1;
        platform.sections.splice(idx, 1);
        renderGPU(cfg);
        // Переключиться обратно
        var $tree = $('#section_gpu .section_tree');
        $tree.find('.tree_item').removeClass('active');
        $tree.find('[data-sub="gpu-platform' + platformId + '"]').addClass('active');
        $('#section_gpu .sub_section').removeClass('active');
        $('#section_gpu .sub_section[data-sub="gpu-platform' + platformId + '"]').addClass('active');
    });

    // =============================================
    //  ИК — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-channel"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware) cfg.hardware = { channels: [], discreteInputs: [], discreteOutputs: [], externalModules: [] };
        var newId = _nextId(cfg.hardware.channels);
        cfg.hardware.channels.push({
            id: newId, name: 'ИК №' + newId, comPort: newId, deviceType: 'LDU78.1',
            sensors: { name: '', type: 'analog', count: 4 }, connectedSections: []
        });
        renderHardware(cfg);
    });

    $(document).on('click', '[data-action="del-channel"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware.channels || cfg.hardware.channels.length === 0) return;
        cfg.hardware.channels.pop();
        renderHardware(cfg);
    });

    // =============================================
    //  ДВХ — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-di"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware) cfg.hardware = { channels: [], discreteInputs: [], discreteOutputs: [], externalModules: [] };
        var newId = _nextId(cfg.hardware.discreteInputs);
        cfg.hardware.discreteInputs.push({
            id: newId, name: 'ДВХ №' + newId, address: '0.' + newId,
            scalesId: 1, assignment: 'off', coordinate_mm: 0
        });
        renderHardware(cfg);
        // Переключиться на вкладку ДВХ
        $('#section_hardware .tree_item').removeClass('active');
        $('#section_hardware .tree_item[data-sub="hardware-inputs"]').addClass('active');
        $('#section_hardware .sub_section').removeClass('active');
        $('#section_hardware .sub_section[data-sub="hardware-inputs"]').addClass('active');
    });

    $(document).on('click', '[data-action="del-di"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware.discreteInputs || cfg.hardware.discreteInputs.length === 0) return;
        cfg.hardware.discreteInputs.pop();
        renderHardware(cfg);
        $('#section_hardware .tree_item').removeClass('active');
        $('#section_hardware .tree_item[data-sub="hardware-inputs"]').addClass('active');
        $('#section_hardware .sub_section').removeClass('active');
        $('#section_hardware .sub_section[data-sub="hardware-inputs"]').addClass('active');
    });

    // =============================================
    //  ДВЫХ — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-do"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware) cfg.hardware = { channels: [], discreteInputs: [], discreteOutputs: [], externalModules: [] };
        var newId = _nextId(cfg.hardware.discreteOutputs);
        cfg.hardware.discreteOutputs.push({
            id: newId, name: 'ДВЫХ №' + newId, address: '0.' + newId,
            scalesId: 1, assignment: 'off'
        });
        renderHardware(cfg);
        $('#section_hardware .tree_item').removeClass('active');
        $('#section_hardware .tree_item[data-sub="hardware-outputs"]').addClass('active');
        $('#section_hardware .sub_section').removeClass('active');
        $('#section_hardware .sub_section[data-sub="hardware-outputs"]').addClass('active');
    });

    $(document).on('click', '[data-action="del-do"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware.discreteOutputs || cfg.hardware.discreteOutputs.length === 0) return;
        cfg.hardware.discreteOutputs.pop();
        renderHardware(cfg);
        $('#section_hardware .tree_item').removeClass('active');
        $('#section_hardware .tree_item[data-sub="hardware-outputs"]').addClass('active');
        $('#section_hardware .sub_section').removeClass('active');
        $('#section_hardware .sub_section[data-sub="hardware-outputs"]').addClass('active');
    });

    // =============================================
    //  МОДУЛИ ДВВ — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-module"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware) cfg.hardware = { channels: [], discreteInputs: [], discreteOutputs: [], externalModules: [] };
        var newId = _nextId(cfg.hardware.externalModules);
        cfg.hardware.externalModules.push({
            id: newId, name: 'Модуль ДВВ №' + newId,
            ip: '192.168.0.' + (100 + newId), subnet: '255.255.255.0'
        });
        renderHardware(cfg);
        $('#section_hardware .tree_item').removeClass('active');
        $('#section_hardware .tree_item[data-sub="hardware-modules"]').addClass('active');
        $('#section_hardware .sub_section').removeClass('active');
        $('#section_hardware .sub_section[data-sub="hardware-modules"]').addClass('active');
    });

    $(document).on('click', '[data-action="del-module"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.hardware.externalModules || cfg.hardware.externalModules.length === 0) return;
        cfg.hardware.externalModules.pop();
        renderHardware(cfg);
        $('#section_hardware .tree_item').removeClass('active');
        $('#section_hardware .tree_item[data-sub="hardware-modules"]').addClass('active');
        $('#section_hardware .sub_section').removeClass('active');
        $('#section_hardware .sub_section[data-sub="hardware-modules"]').addClass('active');
    });

    // =============================================
    //  ВЕСЫ — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-scales"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.scales) cfg.scales = [];
        if (cfg.scales.length >= 4) {
            alert('Максимальное количество весов — 4.');
            return;
        }
        var newId = _nextId(cfg.scales);
        cfg.scales.push({
            id: newId, name: 'Весы №' + newId, channelIds: [], units: 'kg',
            internalDiscreteness: { value: 1, multiplier: 1 },
            rangesCount: 1, mode: 'multiInterval',
            ranges: [{ id: 1, max: 10000, multiplier: 1, e: 10 }],
            overload_d: 9,
            calibration: { points: [
                { type: 'zero', mass: 0, counts: 0 },
                { type: 'load', mass: 5000, counts: 0 }
            ]},
            zero: {
                powerOn: { mode: 'current', range_percent: 10 },
                button: { enabled: true, range_percent: 2 },
                auto: { tracking_d: 0.5, period_sec: 3 },
                display: { centerZero_d: 0.25, underload_d: 9 }
            },
            tare: {
                byButton: true, byKeyboard: true, powerOn: 'clear',
                auto: { enabled: false, threshold: 100 },
                autoClear: { enabled: false, stabilityControl: true, threshold: 50, onZero: false, afterPrint: false }
            },
            filter: { type: 'IIR', cutoffFreq: 3, averaging_n: 0 },
            stability: { range_d: 1, period_sec: 0.3 },
            weighingMode: 'static',
            wheelSensors: []
        });
        renderScales(cfg);
    });

    $(document).on('click', '[data-action="del-scales"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.scales || cfg.scales.length <= 1) {
            alert('Должны остаться хотя бы одни весы.');
            return;
        }
        var $active = $('#section_scales .platforma_on[data-scales-id]');
        var activeId = $active.length ? parseInt($active.data('scales-id')) : 0;
        var activeIdx = -1;
        cfg.scales.forEach(function(s, i) { if (s.id === activeId) activeIdx = i; });
        if (activeIdx === -1) activeIdx = cfg.scales.length - 1;
        cfg.scales.splice(activeIdx, 1);
        renderScales(cfg);
    });

    // =============================================
    //  ДАТЧИКИ КОЛЁС (ДК) — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-wk"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        var scaleId = parseInt($(this).data('scale-id'));
        var scale = null;
        (cfg.scales || []).forEach(function(s) { if (s.id === scaleId) scale = s; });
        if (!scale) return;
        if (!scale.wheelSensors) scale.wheelSensors = [];
        var newId = _nextId(scale.wheelSensors);
        scale.wheelSensors.push({ id: newId, inputId: 1, offset_mm: 0, activeZone_mm: 150 });
        renderScales(cfg);
        _navigateToScaleSub(scaleId, 'motion');
    });

    $(document).on('click', '[data-action="del-wk"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        var scaleId = parseInt($(this).data('scale-id'));
        var scale = null;
        (cfg.scales || []).forEach(function(s) { if (s.id === scaleId) scale = s; });
        if (!scale || !scale.wheelSensors || scale.wheelSensors.length === 0) return;
        scale.wheelSensors.pop();
        renderScales(cfg);
        _navigateToScaleSub(scaleId, 'motion');
    });

    function _navigateToScaleSub(scaleId, subName) {
        var sub = 'scales-' + scaleId + '-' + subName;
        var $tree = $('#section_scales .section_tree');
        $tree.find('.tree_item').removeClass('active');
        $tree.find('[data-sub="' + sub + '"]').addClass('active');
        $('#section_scales .sub_section').removeClass('active');
        $('#section_scales .sub_section[data-sub="' + sub + '"]').addClass('active');
    }

    // =============================================
    //  ПОЛЬЗОВАТЕЛИ — ДОБАВИТЬ / УДАЛИТЬ
    // =============================================
    $(document).on('click', '[data-action="add-user"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.terminal) cfg.terminal = {};
        if (!cfg.terminal.users) cfg.terminal.users = [];
        var newId = _nextId(cfg.terminal.users);
        cfg.terminal.users.push({
            id: newId, name: 'Пользователь ' + newId, role: 'operator', password: ''
        });
        renderTerminal(cfg);
        $('#section_terminal .tree_item').removeClass('active');
        $('#section_terminal .tree_item[data-sub="terminal-users"]').addClass('active');
        $('#section_terminal .sub_section').removeClass('active');
        $('#section_terminal .sub_section[data-sub="terminal-users"]').addClass('active');
    });

    $(document).on('click', '[data-action="del-user"]', function() {
        _syncBeforeAction();
        var cfg = CA.currentConfig;
        if (!cfg.terminal.users || cfg.terminal.users.length <= 1) {
            alert('Должен остаться хотя бы один пользователь.');
            return;
        }
        // Удалить выбранного (active)
        var activeUserId = $('#section_terminal .user_item.active').data('user-id');
        var idx = -1;
        cfg.terminal.users.forEach(function(u, i) { if (u.id === activeUserId) idx = i; });
        if (idx === -1) idx = cfg.terminal.users.length - 1;
        cfg.terminal.users.splice(idx, 1);
        renderTerminal(cfg);
        $('#section_terminal .tree_item').removeClass('active');
        $('#section_terminal .tree_item[data-sub="terminal-users"]').addClass('active');
        $('#section_terminal .sub_section').removeClass('active');
        $('#section_terminal .sub_section[data-sub="terminal-users"]').addClass('active');
    });
});
