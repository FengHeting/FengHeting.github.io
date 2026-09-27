/* ============================================================
   MicroFish Archive - 详情页脚本（纯前端动态渲染）
   ------------------------------------------------------------
   通过 device.html?slug=xxx 读取 articles/<slug>.md，
   并按设备类别（category）套用对应的字段模板渲染。
   ============================================================ */

(function () {
  'use strict';

  var esc = window.MFA.esc;
  var parseMd = window.MFA.parseMd;
  var mdToHtml = window.MFA.mdToHtml;

  /* ============ 类别字段模板定义 ============
     通用字段（所有类别固定一致）：
       · 基本信息：品牌 / 型号 / 类型 / 制造商 / 生产年份 / 上市年份 /
                    产地 / 序列号 / 硬件版本 / 软件/固件版本
     详细技术参数：按 category 套用对应大类的固定模板，
     每个大类都是一组具体、通用的标准参数项。
     =========================================== */
  /* ============ 各大类详细技术参数模板（全部为公共模板项，无专属概念） ============ */
  var CATEGORY_DEFS = {
    cpu: {
      label: '微处理器',
      fields: [
        ['chip', '主要芯片'],
        ['arch', '处理器架构'],
        ['instruction', '指令集'],
        ['clock', '主频'],
        ['fpu', '协处理器 / 浮点单元'],
        ['cache', '缓存'],
        ['transistor', '晶体管数量'],
        ['process', '制程'],
        ['package', '封装'],
        ['pins', '引脚数'],
        ['data_bus', '数据总线'],
        ['addr_bus', '地址总线'],
        ['max_memory', '最大寻址'],
        ['registers', '寄存器'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['temperature', '工作温度'],
        ['condition', '品相']
      ]
    },
    computer: {
      label: '计算机 / 服务器',
      fields: [
        ['chip', '主要芯片'],
        ['chipset', '芯片组'],
        ['arch', '处理器架构'],
        ['clock', '主频'],
        ['core', '核心 / 线程'],
        ['ram', '内存'],
        ['ram_type', '内存类型'],
        ['storage', '存储'],
        ['gpu', '显示核心'],
        ['os', '操作系统'],
        ['display_out', '显示输出'],
        ['audio', '音频'],
        ['network', '网络通信'],
        ['interfaces', '接口'],
        ['expansion_slot', '扩展插槽'],
        ['power_in', '电源输入'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['temperature', '工作温度'],
        ['condition', '品相']
      ]
    },
    board: {
      label: '开发板 / 单板机',
      fields: [
        ['chip', '主要芯片'],
        ['arch', '处理器架构'],
        ['clock', '主频'],
        ['ram', '内存'],
        ['storage', '存储'],
        ['os', '操作系统'],
        ['debug', '调试接口'],
        ['display_out', '显示输出'],
        ['audio', '音频'],
        ['network', '网络通信'],
        ['wireless', '无线通信'],
        ['interfaces', '接口'],
        ['gpio', 'GPIO'],
        ['expansion_pin', '扩展排针'],
        ['power_in', '电源输入'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['temperature', '工作温度'],
        ['condition', '品相']
      ]
    },
    industrial: {
      label: '工业控制设备',
      fields: [
        ['chip', '主要芯片'],
        ['arch', '处理器架构'],
        ['clock', '主频'],
        ['ram', '内存'],
        ['storage', '存储'],
        ['os', '操作系统'],
        ['display_out', '显示输出'],
        ['audio', '音频'],
        ['network', '网络通信'],
        ['wireless', '无线通信'],
        ['interfaces', '接口'],
        ['io', '数字 I/O'],
        ['power_in', '电源输入'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['temperature', '工作温度'],
        ['protection', '防护等级'],
        ['watchdog', '看门狗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['condition', '品相']
      ]
    },
    radio: {
      label: '无线电设备 / 对讲机 / 发射机',
      fields: [
        ['chip', '主要芯片'],
        ['frequency', '工作频率'],
        ['band', '频段'],
        ['mode', '工作模式'],
        ['tx_power', '发射功率'],
        ['modulation', '调制方式'],
        ['channel', '信道数'],
        ['step', '信道间隔'],
        ['impedance', '天线阻抗'],
        ['display', '显示屏'],
        ['interfaces', '接口'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['temperature', '工作温度'],
        ['condition', '品相']
      ]
    },
    pager: {
      label: '寻呼机',
      fields: [
        ['chip', '主要芯片'],
        ['frequency', '工作频率'],
        ['band', '频段'],
        ['encoding', '编码制式'],
        ['protocol', '寻呼协议'],
        ['display', '显示屏'],
        ['display_type', '显示类型'],
        ['memory', '信息存储'],
        ['alert', '提示方式'],
        ['battery', '电池'],
        ['battery_type', '电池型号'],
        ['standby', '待机时间'],
        ['voltage', '工作电压'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['condition', '品相']
      ]
    },
    camera: {
      label: '摄像机 / 影像设备',
      fields: [
        ['chip', '主要芯片'],
        ['sensor', '传感器'],
        ['sensor_size', '传感器尺寸'],
        ['lens', '镜头'],
        ['focal', '焦距'],
        ['aperture', '光圈'],
        ['zoom', '变焦'],
        ['format', '影像格式'],
        ['resolution', '分辨率'],
        ['frame_rate', '帧率'],
        ['audio', '音频'],
        ['ir', '红外夜视'],
        ['low_light', '最低照度'],
        ['shutter', '快门'],
        ['white_balance', '白平衡'],
        ['interfaces', '接口'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['condition', '品相']
      ]
    },
    instrument: {
      label: '电子仪器',
      fields: [
        ['chip', '主要芯片'],
        ['display', '显示'],
        ['display_type', '显示类型'],
        ['interfaces', '接口'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['temperature', '工作温度'],
        ['condition', '品相']
      ]
    },
    storage: {
      label: '存储介质',
      fields: [
        ['media', '介质类型'],
        ['capacity', '容量'],
        ['speed', '速度 / 时长'],
        ['condition', '品相'],
        ['dimensions', '尺寸'],
        ['weight', '重量']
      ]
    },
    generic: {
      label: '其他电子硬件',
      fields: [
        ['chip', '主要芯片'],
        ['frequency', '工作频率'],
        ['communication', '通信方式'],
        ['interfaces', '接口'],
        ['voltage', '工作电压'],
        ['power', '功耗'],
        ['dimensions', '尺寸'],
        ['weight', '重量'],
        ['temperature', '工作温度'],
        ['condition', '品相']
      ]
    }
  };

  /* 通用基本信息字段（所有类别固定一致） */
  var BASIC_FIELDS = [
    ['brand', '品牌'],
    ['model', '型号'],
    ['type', '类型'],
    ['manufacturer', '制造商'],
    ['year', '生产年份'],
    ['origin', '产地'],
    ['serial', '序列号']
  ];

  function getParam(name) {
    var m = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function renderRows(fields, defs) {
    var rows = [];
    defs.forEach(function (pair) {
      var key = pair[0], label = pair[1];
      var val = (fields[key] || '').trim();
      var state = (fields[key + '_state'] || '').trim();
      if (val) {
        /* 有值：显示值 + 状态信息（key_state 字段，如 bandwidth_state） */
        var valHtml = esc(val).replace(/\|/g, '<br>');
        var stateHtml = state ? ' <span class="param-state">[' + esc(state) + ']</span>' : '';
        rows.push('<tr><th>' + esc(label) + '</th><td>' + valHtml + stateHtml + '</td></tr>');
      } else {
        /* 无值：完整保留模板项，显示「（无）」 */
        rows.push('<tr class="row-empty"><th>' + esc(label) + '</th><td class="td-empty">（无）</td></tr>');
      }
    });
    return rows.join('\n');
  }

  function renderDetail(slug, text, allSlugs) {
    var parsed = parseMd(text);
    var f = parsed.fields;
    var body = parsed.body;

    var name = f.name || slug;
    var catId = f.category || 'generic';
    var catDef = CATEGORY_DEFS[catId] || CATEGORY_DEFS.generic;

    var subtitle = ['brand', 'model', 'type']
      .map(function (k) { return (f[k] || '').trim(); })
      .filter(Boolean)
      .join(' · ');

    /* 主图 */
    var images = (f.images || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var captions = (f.captions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var hero = document.getElementById('hero');
    if (images.length) {
      hero.innerHTML =
        '<img src="assets/img/' + encodeURIComponent(slug) + '/' + encodeURIComponent(images[0]) +
        '" alt="' + esc(name) + '">' +
        (captions[0] ? '<div class="caption">' + esc(captions[0]) + '</div>' : '');
    } else {
      hero.innerHTML = '<div style="color:#999999;padding:30px;">（暂无图片）</div>';
    }

    document.getElementById('detail-title').textContent = name;
    document.getElementById('detail-subtitle').textContent = subtitle;
    document.title = name + ' - MicroFish Archive 硬件收藏档案馆';
    var cat = getParam('cat');
    var catLink = 'collection.html' + (cat ? '?cat=' + encodeURIComponent(cat) : '');
    document.getElementById('breadcrumb').innerHTML =
      '当前位置：<a href="index.html">首页</a> &gt; <a href="' + catLink + '">全部藏品</a> &gt; ' + esc(name);

    /* 公共备注（notes 字段）：显示在基本信息前，红色；无内容不显示 */
    var notes = (f.notes || '').trim();
    var notesEl = document.getElementById('device-notes');
    if (notesEl) {
      if (notes) {
        notesEl.style.display = 'block';
        notesEl.innerHTML = '<div class="notes-box"><span class="notes-label">※ 备注：</span>' +
          esc(notes).replace(/\|/g, '<br>') + '</div>';
      } else {
        notesEl.style.display = 'none';
        notesEl.innerHTML = '';
      }
    }

    /* 字段表格：基本信息 + 详细技术参数（该大类的公共模板） */
    document.getElementById('basic-rows').innerHTML = renderRows(f, BASIC_FIELDS);
    document.getElementById('spec-rows').innerHTML = renderRows(f, catDef.fields);

    /* 正文（自由扩展的大文字区） */
    var article = document.getElementById('article');
    if (body.trim()) {
      article.innerHTML = mdToHtml(body);
    } else {
      article.innerHTML = '<div class="placeholder-note">（本文暂未撰写，敬请期待。）</div>';
    }

    /* 图库 */
    var gallery = document.getElementById('gallery');
    var gParts = [];
    for (var i = 1; i < images.length; i++) {
      gParts.push(
        '<figure>' +
        '<img src="assets/img/' + encodeURIComponent(slug) + '/thumbs/' + encodeURIComponent(images[i]) +
        '" data-full="assets/img/' + encodeURIComponent(slug) + '/full/' + encodeURIComponent(images[i]) +
        '" alt="' + esc(captions[i] || images[i]) + '" loading="lazy">' +
        '<figcaption>' + esc(captions[i] || images[i]) + '</figcaption>' +
        '</figure>'
      );
    }
    gallery.innerHTML = gParts.length
      ? '<div class="gallery">' + gParts.join('') + '</div>'
      : '<div class="placeholder-note">暂无其他照片。</div>';
    initLightbox();

    /* 上一台 / 下一台（带当前类别参数，返回时保持筛选状态） */
    var idx = allSlugs.indexOf(slug);
    var pn = document.getElementById('prevnext');
    var prev = idx > 0 ? allSlugs[idx - 1] : null;
    var next = (idx >= 0 && idx < allSlugs.length - 1) ? allSlugs[idx + 1] : null;
    var catParam2 = getParam('cat') ? '&cat=' + encodeURIComponent(getParam('cat')) : '';
    pn.innerHTML =
      (prev ? '<a href="device.html?slug=' + encodeURIComponent(prev) + catParam2 + '">◀ 上一台</a>'
            : '<span style="color:#AAAAAA;">◀ 上一台</span>') +
      (next ? '<a href="device.html?slug=' + encodeURIComponent(next) + catParam2 + '">下一台 ▶</a>'
            : '<span style="color:#AAAAAA;">下一台 ▶</span>');
  }

  function showError(title, msg) {
    document.getElementById('detail-title').textContent = title;
    document.title = title + ' - MicroFish Archive 硬件收藏档案馆';
    var article = document.getElementById('article');
    if (article) {
      article.innerHTML = '<div class="placeholder-note">' + esc(msg) + '</div>';
    }
  }

  /* 灯箱：点击图库缩略图查看原图（事件委托，点击 figure/缩略图任意处均可触发） */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var lbImg = lb.querySelector('.lb-img');
    var lbCaption = lb.querySelector('.lb-caption');
    var gallery = document.getElementById('gallery');
    if (!gallery) return;

    function open(src, cap) {
      lbImg.src = src;
      lbCaption.textContent = cap || '';
      lb.classList.add('show');
    }
    function close() { lb.classList.remove('show'); }

    gallery.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== gallery) {
        if (t.tagName === 'IMG' && t.hasAttribute('data-full')) {
          open(t.getAttribute('data-full'), t.getAttribute('alt') || '');
          return;
        }
        t = t.parentNode;
      }
    });

    lb.onclick = close;
    document.onkeydown = function (e) { if (e.key === 'Escape') close(); };
  }

  function main() {
    var slug = getParam('slug');

    if (!slug) {
      showError('未找到设备', '缺少 ?slug= 参数，无法定位设备。请从首页或全部藏品页进入。');
      return;
    }

    /* 先取全部 slug（用于上一台/下一台），再取本设备文章 */
    Promise.all([
      fetch('data/devices.json', { cache: 'no-store' }).then(function (r) { return r.json(); }),
      fetch('articles/' + encodeURIComponent(slug) + '.md', { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        })
    ]).then(function (res) {
      renderDetail(slug, res[1], res[0]);
    }).catch(function (err) {
      if (/404/.test(err.message)) {
        showError('未找到设备', '未找到该设备（链接可能有误，或该设备已被移除）。');
      } else {
        showError('加载失败', '无法读取设备数据，请稍后再试。');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
