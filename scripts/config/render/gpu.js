/**
 * render/gpu.js — Рендер раздела «Конструкция ГПУ» (8.4)
 * Динамическая генерация платформ, секций, дерева и визуализации
 */
function renderGPU(cfg) {
    if (!cfg.gpu) return;
    var platforms = cfg.gpu.platforms || [];

    // --- дерево ---
    var $tree = $('#section_gpu .section_tree');
    $tree.empty();
    var treeHtml = '<div class="tree_node">' +
        '<div class="tree_item parent expanded active" data-sub="gpu-main">' +
            '<span class="tree_icon">▼</span><span class="tree_text">Список платформ</span>' +
        '</div><div class="tree_children">';
    platforms.forEach(function(p) {
        treeHtml += '<div class="tree_item child" data-sub="gpu-platform' + p.id + '">Платформа ' + p.id + '</div>';
    });
    treeHtml += '</div></div>';
    $tree.html(treeHtml);

    // --- sub_section: gpu-main ---
    var $params = $('#section_gpu .section_params');
    $params.find('.sub_section').remove();

    var mainHtml = '<div class="sub_section active" data-sub="gpu-main">' +
        '<div class="param_block"><div class="block_header"><label>Список грузоприемных платформ</label></div>' +
        '<div class="platform_selector"><div class="platform_list_items">';
    platforms.forEach(function(p, i) {
        var cls = (i === 0) ? 'platforma_on' : 'platforma_off';
        mainHtml += '<div class="' + cls + '">Платформа ' + p.id + '</div>';
    });
    mainHtml += '</div><div class="platform_actions">' +
        '<div class="button button-add">ДОБАВИТЬ</div>' +
        '<div class="button button-delete">УДАЛИТЬ</div>' +
        '<div class="button">ОБНОВИТЬ</div></div></div></div>';

    // визуализация
    mainHtml += '<div class="gpu_visual_block"><div class="visual_header">Схематичное изображение ГПУ:</div><div class="visual_canvas">';
    platforms.forEach(function(p, pi) {
        (p.sections || []).forEach(function(sec, si) {
            if (pi > 0 || si > 0) {
                var gapW = sec.nonWeighing_mm > 0 ? Math.max(4, Math.round(sec.nonWeighing_mm / 100)) : 4;
                mainHtml += '<div class="visual_gap" style="width:' + gapW + '%;"></div>';
            }
            var platW = Math.max(10, Math.round(sec.length_mm / 200));
            mainHtml += '<div class="visual_platform" style="width:' + platW + '%;"><div class="platform_label">П' + p.id + '.С' + sec.id + '=' + (sec.length_mm / 1000).toFixed(1) + 'м</div></div>';
        });
    });
    mainHtml += '</div></div></div>';
    $params.append(mainHtml);

    // --- sub_section для каждой платформы ---
    platforms.forEach(function(p) {
        var sections = p.sections || [];
        var h = '<div class="sub_section" data-sub="gpu-platform' + p.id + '">' +
            '<div class="param_block"><div class="block_header"><label>Параметры платформы №' + p.id + '</label></div>' +
            '<div class="param_group">' +
            '<div class="param_row"><label class="param_label_long">Имя/комментарий:</label>' +
            '<input type="text" class="param_input_wide" data-field="name" value="' + (p.name || '') + '" placeholder="Введите комментарий"/></div>' +
            '<div class="param_row"><label class="param_label_long">Невзвешивающий участок, мм:</label>' +
            '<input type="number" class="input_num" data-field="nonWeighing_mm" value="' + (p.nonWeighing_mm || 0) + '" min="0"/></div>' +
            '<div class="sections_list"><div class="sections_header">Секции платформы (количество: ' + sections.length + '):</div>';
        sections.forEach(function(sec, si) {
            var act = si === 0 ? ' active' : '';
            h += '<div class="section_item' + act + '" data-section-id="' + sec.id + '">' +
                '<span class="section_num">Секция №' + sec.id + '</span>' +
                '<label>Длина, мм:</label><input type="number" class="input_num" data-field="length_mm" value="' + sec.length_mm + '" min="0"/>' +
                '<label>Невзвеш, мм:</label><input type="number" class="input_num" data-field="nonWeighing_mm" value="' + sec.nonWeighing_mm + '" min="0"/></div>';
        });
        h += '<div class="section_actions"><div class="button button-small">ДОБАВИТЬ</div><div class="button button-small">УДАЛИТЬ</div></div>' +
            '</div></div></div></div>';
        $params.append(h);
    });
}
