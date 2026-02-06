/**
 * nav.js — Навигация конфигуратора
 * Переключение вкладок, дерево, sub_section, клики по элементам
 */
$(document).ready(function() {

    // Переключение вкладок (верхняя панель)
    $('.tab_item').click(function() {
        $('.tab_item').removeClass('active');
        $(this).addClass('active');
        var section = $(this).data('section');
        $('.param_section').hide();
        $('#section_' + section).show();
        var $s = $('#section_' + section);
        $s.find('.tree_item').removeClass('active');
        $s.find('.tree_item').first().addClass('active');
        var firstSub = $s.find('.tree_item').first().data('sub');
        $s.find('.sub_section').removeClass('active');
        $s.find('.sub_section[data-sub="' + firstSub + '"]').addClass('active');
    });

    // Клик по пункту локального дерева
    $(document).on('click', '.tree_item', function(e) {
        e.stopPropagation();
        var $tree = $(this).closest('.section_tree');
        var $section = $(this).closest('.param_section');
        var sub = $(this).data('sub');
        if ($(this).hasClass('parent')) {
            var $ch = $(this).siblings('.tree_children');
            if ($(this).hasClass('expanded')) {
                $(this).removeClass('expanded').find('.tree_icon').text('►');
                $ch.slideUp(200);
            } else {
                $(this).addClass('expanded').find('.tree_icon').text('▼');
                $ch.slideDown(200);
            }
        }
        $tree.find('.tree_item').removeClass('active');
        $(this).addClass('active');
        if (sub) {
            $section.find('.sub_section').removeClass('active');
            $section.find('.sub_section[data-sub="' + sub + '"]').addClass('active');
        }
    });

    // Переключение платформ
    $(document).on('click', '.platforma_on, .platforma_off', function() {
        $(this).closest('.platform_list_items').find('.platforma_on').removeClass('platforma_on').addClass('platforma_off');
        $(this).removeClass('platforma_off').addClass('platforma_on');
    });

    // Переключение секций платформы
    $(document).on('click', '.section_item', function() {
        $(this).closest('.sections_list').find('.section_item').removeClass('active');
        $(this).addClass('active');
    });

    // Переключение пользователей
    $(document).on('click', '.user_item', function() {
        $(this).closest('.users_list').find('.user_item').removeClass('active');
        $(this).addClass('active');
    });
});
