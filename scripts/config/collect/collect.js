/**
 * collect/collect.js — Сбор всех полей UI обратно в JSON-объект
 * Вызывается при нажатии СОХРАНИТЬ
 */
function collectConfigFromUI() {
    var CA = window.ConfigApp;
    var cfg = { version: (CA.currentConfig && CA.currentConfig.version) || '1.0' };

    // =============================================================
    //  GPU
    // =============================================================
    cfg.gpu = { comment: '', platforms: [] };
    $('#section_gpu .sub_section[data-sub^="gpu-platform"]').each(function() {
        var sub = $(this).data('sub');
        var pid = parseInt(sub.replace('gpu-platform', ''));
        var p = { id: pid, name: '', sections: [], nonWeighing_mm: 0 };
        p.name = $(this).find('[data-field="name"]').val() || '';
        p.nonWeighing_mm = parseInt($(this).find('[data-field="nonWeighing_mm"]').first().val()) || 0;
        $(this).find('.section_item').each(function() {
            var sid = parseInt($(this).data('section-id')) || 1;
            p.sections.push({
                id: sid,
                length_mm: parseInt($(this).find('[data-field="length_mm"]').val()) || 0,
                nonWeighing_mm: parseInt($(this).find('[data-field="nonWeighing_mm"]').val()) || 0
            });
        });
        cfg.gpu.platforms.push(p);
    });

    // =============================================================
    //  Hardware
    // =============================================================
    cfg.hardware = { channels: [], discreteInputs: [], discreteOutputs: [], externalModules: [] };

    $('#section_hardware .sub_section[data-sub="hardware-channels"] fieldset').each(function() {
        var chId = parseInt($(this).find('[data-ch-id]').first().data('ch-id'));
        if (!chId) return;
        cfg.hardware.channels.push({
            id: chId,
            name: $(this).find('[data-field="name"]').val() || '',
            comPort: parseInt($(this).find('[data-field="comPort"]').val()) || 1,
            deviceType: $(this).find('[data-field="deviceType"]').val() || 'LDU78.1',
            sensors: {
                name: '',
                type: $(this).find('[data-field="sensors.type"]').val() || 'analog',
                count: parseInt($(this).find('[data-field="sensors.count"]').val()) || 4
            },
            connectedSections: []
        });
    });

    $('#section_hardware .sub_section[data-sub="hardware-inputs"] fieldset').each(function() {
        var diId = parseInt($(this).find('[data-di-id]').first().data('di-id'));
        if (!diId) return;
        cfg.hardware.discreteInputs.push({
            id: diId,
            name: $(this).find('[data-field="name"]').val() || '',
            address: $(this).find('[data-field="address"]').val() || '',
            scalesId: parseInt($(this).find('[data-field="scalesId"]').val()) || 1,
            assignment: $(this).find('[data-field="assignment"]').val() || 'off',
            coordinate_mm: parseInt($(this).find('[data-field="coordinate_mm"]').val()) || 0
        });
    });

    $('#section_hardware .sub_section[data-sub="hardware-outputs"] fieldset').each(function() {
        var doId = parseInt($(this).find('[data-do-id]').first().data('do-id'));
        if (!doId) return;
        cfg.hardware.discreteOutputs.push({
            id: doId,
            name: $(this).find('[data-field="name"]').val() || '',
            address: $(this).find('[data-field="address"]').val() || '',
            scalesId: parseInt($(this).find('[data-field="scalesId"]').val()) || 1,
            assignment: $(this).find('[data-field="assignment"]').val() || 'off'
        });
    });

    $('#section_hardware .sub_section[data-sub="hardware-modules"] fieldset').each(function() {
        var mId = parseInt($(this).find('[data-mod-id]').first().data('mod-id'));
        if (!mId) return;
        cfg.hardware.externalModules.push({
            id: mId,
            name: $(this).find('[data-field="name"]').val() || '',
            ip: $(this).find('[data-field="ip"]').val() || '',
            subnet: $(this).find('[data-field="subnet"]').val() || ''
        });
    });

    // =============================================================
    //  Scales
    // =============================================================
    var $sc = $('#section_scales');
    var s = {
        id: 1,
        name: $sc.find('[data-field="scales.name"]').val() || '',
        channelIds: (CA.currentConfig && CA.currentConfig.scales && CA.currentConfig.scales[0]) ? CA.currentConfig.scales[0].channelIds : [1],
        units: CA.UNITS_MAP_REV[$sc.find('[data-field="scales.units"]').val()] || 'kg',
        internalDiscreteness: (CA.currentConfig && CA.currentConfig.scales && CA.currentConfig.scales[0]) ? CA.currentConfig.scales[0].internalDiscreteness : { value: 1, multiplier: 1 },
        rangesCount: parseInt($sc.find('[data-field="scales.rangesCount"]').val()) || 2,
        mode: $sc.find('[data-field="scales.mode"]').val() === '1' ? 'multiRange' : 'multiInterval',
        ranges: [],
        overload_d: parseInt($sc.find('[data-field="scales.overload_d"]').val()) || 5,
        calibration: { points: [] },
        zero: {
            powerOn: { mode: $sc.find('[data-field="zero.powerOn.mode"]').val() || 'current', range_percent: parseInt($sc.find('[data-field="zero.powerOn.range_percent"]').val()) || 10 },
            button: { enabled: $sc.find('[data-field="zero.button.enabled"]').val() === '1', range_percent: parseInt($sc.find('[data-field="zero.button.range_percent"]').val()) || 2 },
            auto: { tracking_d: parseFloat($sc.find('[data-field="zero.auto.tracking_d"]').val()) || 0, period_sec: parseInt($sc.find('[data-field="zero.auto.period_sec"]').val()) || 0 },
            display: (CA.currentConfig && CA.currentConfig.scales && CA.currentConfig.scales[0]) ? CA.currentConfig.scales[0].zero.display : { centerZero_d: 0.25, underload_d: 9 }
        },
        tare: {
            byButton: $sc.find('[data-field="tare.byButton"]').val() === '1',
            byKeyboard: $sc.find('[data-field="tare.byKeyboard"]').val() === '1',
            powerOn: $sc.find('[data-field="tare.powerOn"]').val() || 'clear',
            auto: { enabled: $sc.find('[data-field="tare.auto.enabled"]').val() === '1', threshold: parseInt($sc.find('[data-field="tare.auto.threshold"]').val()) || 100 },
            autoClear: { enabled: $sc.find('[data-field="tare.autoClear.enabled"]').val() === '1', stabilityControl: true, threshold: parseInt($sc.find('[data-field="tare.autoClear.threshold"]').val()) || 50, onZero: false, afterPrint: false }
        },
        filter: { type: $sc.find('[data-field="filter.type"]').val() === '1' ? 'FIR' : 'IIR', cutoffFreq: parseInt($sc.find('[data-field="filter.cutoffFreq"]').val()) || 4, averaging_n: parseInt($sc.find('[data-field="filter.averaging_n"]').val()) || 0 },
        stability: { range_d: parseFloat($sc.find('[data-field="stability.range_d"]').val()) || 1, period_sec: parseFloat($sc.find('[data-field="stability.period_sec"]').val()) || 0.3 }
    };

    // ranges
    $sc.find('[data-range-id]').each(function() {
        s.ranges.push({
            id: parseInt($(this).data('range-id')),
            max: parseInt($(this).find('[data-field="range.max"]').val()) || 0,
            multiplier: parseInt($(this).find('[data-field="range.multiplier"]').val()) || 1,
            e: parseInt($(this).find('[data-field="range.e"]').val()) || 10
        });
    });

    // calibration
    s.calibration.points.push({ type: 'zero', mass: 0, counts: 0 });
    var calMass = $sc.find('[data-field="cal.mass"]').val();
    if (calMass) s.calibration.points.push({ type: 'load', mass: parseInt(calMass), counts: 0 });
    cfg.scales = [s];

    // =============================================================
    //  Terminal
    // =============================================================
    var $tm = $('#section_terminal');
    cfg.terminal = {
        numericId: { part1: parseInt($tm.find('[data-field="terminal.numericId.part1"]').val()) || 0, part2: parseInt($tm.find('[data-field="terminal.numericId.part2"]').val()) || 0 },
        symbolicName: $tm.find('[data-field="terminal.symbolicName"]').val() || '',
        owner: $tm.find('[data-field="terminal.owner"]').val() || '',
        serialNumber: $tm.find('[data-field="terminal.serialNumber"]').val() || '',
        softwareVersion: $tm.find('[data-field="terminal.softwareVersion"]').val() || '',
        users: (CA.currentConfig && CA.currentConfig.terminal) ? CA.currentConfig.terminal.users : [],
        regional: {
            timezone: parseInt($tm.find('[data-field="regional.timezone"]').val()) || 3,
            ntpServer: $tm.find('[data-field="regional.ntpServer"]').val() || '',
            autoTime: $tm.find('[data-field="regional.autoTime"]').val() === '1',
            dateFormat: $tm.find('[data-field="regional.dateFormat"]').val() || 'YYYY-MM-DD',
            dateSeparator: $tm.find('[data-field="regional.dateSeparator"]').val() || '.',
            timeFormat: $tm.find('[data-field="regional.timeFormat"]').val() || '24:MM:SS'
        },
        datetime: {
            date: $tm.find('[data-field="datetime.date"]').val() || '',
            time: ($tm.find('[data-field="datetime.time"]').val() || '00:00') + ':00'
        }
    };

    // =============================================================
    //  Service
    // =============================================================
    cfg.service = (CA.currentConfig && CA.currentConfig.service) || { tacCounters: {} };

    return cfg;
}
