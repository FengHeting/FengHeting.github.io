/* ============================================================
   MicroFish Archive - 全部藏品页脚本（纯前端动态渲染）
   ------------------------------------------------------------
   fetch data/devices.json + articles/<slug>.md，
   渲染设备卡片并支持按设备大类（category）筛选。
   ============================================================ */

(function () {
  'use strict';

  var esc = window.MFA.esc;
  var parseMd = window.MFA.parseMd;

  /* 类别 ID → 中文标签（与 device.js 的类别模板一致） */
  var CATEGORY_LABELS = {
    cpu: '微处理器',
    computer: '计算机/服务器',
    board: '开发板/单板机',
    industrial: '工业控制设备',
    radio: '无线电设备',
    pager: '寻呼机',
    camera: '摄像机/影像',
    instrument: '电子仪器',
    storage: '存储介质',
    generic: '其他硬件'
  };

  var currentFilter = 'all';
  var allDevices = [];

  /* 从 URL 读取上次选择的类别（collection.html?cat=xxx） */
  (function () {
    var m = window.location.search.match(/[?&]cat=([^&]+)/);
    if (m) {
      try { currentFilter = decodeURIComponent(m[1]); } catch (e) { currentFilter = 'all'; }
    }
  })();

  function renderFilterBar() {
    var bar = document.getElementById('filter-bar');
    if (!bar) return;

    /* 统计各类别数量 */
    var counts = {};
    allDevices.forEach(function (d) {
      var cat = d.category || 'generic';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    var html = '<a class="filter-btn' + (currentFilter === 'all' ? ' filter-on' : '') +
      '" href="javascript:void(0)" data-filter="all">全部 <span class="filter-n">' +
      allDevices.length + '</span></a>';
    Object.keys(CATEGORY_LABELS).forEach(function (cat) {
      if (!counts[cat]) return; /* 无该类别设备的按钮不显示 */
      html += '<a class="filter-btn' + (currentFilter === cat ? ' filter-on' : '') +
        '" href="javascript:void(0)" data-filter="' + cat + '">' + CATEGORY_LABELS[cat] +
        ' <span class="filter-n">' + counts[cat] + '</span></a>';
    });
    bar.innerHTML = html;

    bar.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = btn.getAttribute('data-filter');
        /* 把筛选状态写入 URL（不刷新），返回本页时自动恢复 */
        if (history.replaceState) {
          var url = currentFilter === 'all'
            ? 'collection.html'
            : 'collection.html?cat=' + encodeURIComponent(currentFilter);
          history.replaceState(null, '', url);
        }
        renderFilterBar();
        renderCards();
      });
    });
  }

  function renderCards() {
    var grid = document.getElementById('device-grid');
    var countEl = document.getElementById('device-count');
    if (countEl) countEl.textContent = allDevices.length;
    if (!grid) return;

    var list = currentFilter === 'all'
      ? allDevices
      : allDevices.filter(function (d) { return d.category === currentFilter; });

    if (!list.length) {
      grid.innerHTML = '<p style="text-align:center;color:#666666;">该类别暂无藏品。</p>';
      return;
    }

    var html = '';
    list.forEach(function (d) {
      var status = d.status ? '<span class="card-status">' + esc(d.status) + '</span>' : '';
      var type = d.type ? '<div class="card-type">' + esc(d.type) + '</div>' : '';
      var catTag = d.category && CATEGORY_LABELS[d.category]
        ? '<div class="card-cat">[' + esc(CATEGORY_LABELS[d.category]) + ']</div>' : '';
      var catParam = currentFilter === 'all'
        ? ''
        : '&cat=' + encodeURIComponent(currentFilter);
      html +=
        '<a class="card" href="device.html?slug=' + encodeURIComponent(d.slug) + catParam + '" title="点击查看详情">' +
          '<img class="thumb" src="' + esc(d.thumb) + '" alt="' + esc(d.name) + '" loading="lazy">' +
          '<div class="card-name">' + esc(d.name) + '</div>' +
          '<div class="card-brand">' + esc(d.brand) + '</div>' +
          '<div class="card-model">' + esc(d.model) + '</div>' +
          type + catTag + status +
          '<span class="card-enter">[ 查看详情 &gt;&gt; ]</span>' +
        '</a>';
    });
    grid.innerHTML = html;
  }

  function main() {
    fetch('data/devices.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (slugs) {
        return Promise.all(
          slugs.map(function (slug) {
            return fetch('articles/' + encodeURIComponent(slug) + '.md', { cache: 'no-store' })
              .then(function (r) { if (!r.ok) throw new Error('文章缺失 ' + slug); return r.text(); })
              .then(function (txt) {
                var f = parseMd(txt).fields;
                var images = (f.images || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
                return {
                  slug: slug,
                  name: f.name || slug,
                  brand: f.brand || '',
                  model: f.model || '',
                  type: f.type || '',
                  category: f.category || 'generic',
                  status: f.status || '',
                  thumb: images.length ? 'assets/img/' + slug + '/thumbs/' + images[0] : ''
                };
              })
              .catch(function () {
                return { slug: slug, name: slug, brand: '', model: '', type: '', category: 'generic', status: '', thumb: '' };
              });
          })
        );
      })
      .then(function (devices) {
        allDevices = devices;
        renderFilterBar();
        renderCards();
      })
      .catch(function (err) {
        var grid = document.getElementById('device-grid');
        if (grid) {
          grid.innerHTML =
            '<div class="placeholder-note">无法读取藏品数据，请稍后再试。</div>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
