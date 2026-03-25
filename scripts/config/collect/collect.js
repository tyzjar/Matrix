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
        var diModule = $(this).find('[data-field="addressModule"]').val() || '0';
        var diPort = $(this).find('[data-field="addressPort"]').val() || '1';
        cfg.hardware.discreteInputs.push({
            id: diId,
            name: $(this).find('[data-field="name"]').val() || '',
            address: diModule + '.' + diPort,
            scalesId: parseInt($(this).find('[data-field="scalesId"]').val()) || 1,
            assignment: $(this).find('[data-field="assignment"]').val() || 'off'
        });
    });

    $('#section_hardware .sub_section[data-sub="hardware-outputs"] fieldset').each(function() {
        var doId = parseInt($(this).find('[data-do-id]').first().data('do-id'));
        if (!doId) return;
        var doModule = $(this).find('[data-field="addressModule"]').val() || '0';
        var doPort = $(this).find('[data-field="addressPort"]').val() || '1';
        cfg.hardware.discreteOutputs.push({
            id: doId,
            name: $(this).find('[data-field="name"]').val() || '',
            address: doModule + '.' + doPort,
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
    //  Scales (поддержка нескольких весов)
    // =============================================================
    cfg.scales = [];
    var existingScales = (CA.currentConfig && CA.currentConfig.scales) || [];

    $('#section_scales .sub_section[data-scale-id]').each(function() {
        var $sub = $(this);
        var scaleId = parseInt($sub.data('scale-id'));
        var subKey = $sub.data('sub') || '';
        if (subKey.indexOf('-general') === -1) return;

        var existingScale = null;
        existingScales.forEach(function(es) { if (es.id === scaleId) existingScale = es; });

        var $assign = $sub;
        var $range = $('#section_scales .sub_section[data-sub="scales-' + scaleId + '-range"]');
        var $cal = $('#section_scales .sub_section[data-sub="scales-' + scaleId + '-calibration"]');
        var $zero = $('#section_scales .sub_section[data-sub="scales-' + scaleId + '-zero"]');
        var $tare = $('#section_scales .sub_section[data-sub="scales-' + scaleId + '-tare"]');
        var $filt = $('#section_scales .sub_section[data-sub="scales-' + scaleId + '-filter"]');
        var $mot = $('#section_scales .sub_section[data-sub="scales-' + scaleId + '-motion"]');

        var s = {
            id: scaleId,
            name: $assign.find('[data-field="scales.name"]').val() || '',
            channelIds: [],
            units: CA.UNITS_MAP_REV[$assign.find('[data-field="scales.units"]').val()] || 'kg',
            internalDiscreteness: existingScale ? existingScale.internalDiscreteness : { value: 1, multiplier: 1 },
            rangesCount: parseInt($range.find('[data-field="scales.rangesCount"]').val()) || 1,
            mode: $range.find('[data-field="scales.mode"]').val() === '1' ? 'multiRange' : 'multiInterval',
            ranges: [],
            overload_d: parseInt($range.find('[data-field="scales.overload_d"]').val()) || 5,
            calibration: { points: [] },
            zero: {
                powerOn: { mode: $zero.find('[data-field="zero.powerOn.mode"]').val() || 'current', range_percent: parseInt($zero.find('[data-field="zero.powerOn.range_percent"]').val()) || 10 },
                button: { enabled: $zero.find('[data-field="zero.button.enabled"]').val() === '1', range_percent: parseInt($zero.find('[data-field="zero.button.range_percent"]').val()) || 2 },
                auto: { tracking_d: parseFloat($zero.find('[data-field="zero.auto.tracking_d"]').val()) || 0, period_sec: parseInt($zero.find('[data-field="zero.auto.period_sec"]').val()) || 0 },
                display: existingScale && existingScale.zero ? existingScale.zero.display : { centerZero_d: 0.25, underload_d: 9 }
            },
            tare: {
                byButton: $tare.find('[data-field="tare.byButton"]').val() === '1',
                byKeyboard: $tare.find('[data-field="tare.byKeyboard"]').val() === '1',
                powerOn: $tare.find('[data-field="tare.powerOn"]').val() || 'clear',
                auto: { enabled: $tare.find('[data-field="tare.auto.enabled"]').val() === '1', threshold: parseInt($tare.find('[data-field="tare.auto.threshold"]').val()) || 100 },
                autoClear: { enabled: $tare.find('[data-field="tare.autoClear.enabled"]').val() === '1', stabilityControl: true, threshold: parseInt($tare.find('[data-field="tare.autoClear.threshold"]').val()) || 50, onZero: false, afterPrint: false }
            },
            filter: { type: $filt.find('[data-field="filter.type"]').val() === '1' ? 'FIR' : 'IIR', cutoffFreq: parseInt($filt.find('[data-field="filter.cutoffFreq"]').val()) || 4, averaging_n: parseInt($filt.find('[data-field="filter.averaging_n"]').val()) || 0 },
            stability: { range_d: parseFloat($filt.find('[data-field="stability.range_d"]').val()) || 1, period_sec: parseFloat($filt.find('[data-field="stability.period_sec"]').val()) || 0.3 }
        };

        $assign.find('[data-field="channel-check"]:checked').each(function() {
            s.channelIds.push(parseInt($(this).data('ch-id')));
        });

        var $activeMode = $mot.find('[data-field="weighingMode"].button-active');
        s.weighingMode = $activeMode.length ? ($activeMode.data('value') || 'static') : 'static';
        s.wheelSensors = [];
        $mot.find('[data-wk-id]').each(function() {
            s.wheelSensors.push({
                id: parseInt($(this).data('wk-id')),
                inputId: parseInt($(this).find('[data-field="wk.inputId"]').val()) || 1,
                offset_mm: parseInt($(this).find('[data-field="wk.offset_mm"]').val()) || 0,
                activeZone_mm: parseInt($(this).find('[data-field="wk.activeZone_mm"]').val()) || 150
            });
        });

        $range.find('[data-range-id]').each(function() {
            s.ranges.push({
                id: parseInt($(this).data('range-id')),
                max: parseInt($(this).find('[data-field="range.max"]').val()) || 0,
                multiplier: parseInt($(this).find('[data-field="range.multiplier"]').val()) || 1,
                e: parseInt($(this).find('[data-field="range.e"]').val()) || 10
            });
        });

        s.calibration.points.push({ type: 'zero', mass: 0, counts: 0 });
        var calMass = $cal.find('[data-field="cal.mass"]').val();
        if (calMass) s.calibration.points.push({ type: 'load', mass: parseInt(calMass), counts: 0 });

        cfg.scales.push(s);
    });

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
