/* ============================================================
   MicroFish Archive - 公共前端库（浏览器端）
   提供：HTML 转义、Front Matter 解析、迷你 Markdown 渲染
   ============================================================ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 解析 Markdown + Front Matter → { fields, body } */
  function parseMd(text) {
    var fields = {};
    var body = text;
    if (text.indexOf('---') === 0) {
      var idx = text.indexOf('---', 3);
      if (idx !== -1) {
        var fm = text.slice(3, idx);
        body = text.slice(idx + 3);
        fm.split('\n').forEach(function (line) {
          var s = line.trim();
          if (!s || s.indexOf(':') === -1) return;
          var pos = s.indexOf(':');
          var key = s.slice(0, pos).trim();
          var val = s.slice(pos + 1).trim();
          if (key) fields[key] = val;
        });
      }
    }
    return { fields: fields, body: body };
  }

  /* 迷你 Markdown 渲染器 */
  function mdToHtml(text) {
    var lines = text.split('\n');
    var out = [];
    var i = 0;

    function inline(s) {
      s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border:2px solid #000;">');
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      /* 先处理 **加粗**，再处理 *斜体*（避免 lookbehind，兼容旧浏览器） */
      s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
      s = s.replace(/\*([^*\n]+)\*/g, '<i>$1</i>');
      return s;
    }

    while (i < lines.length) {
      var line = lines[i];

      if (line.trim().indexOf('```') === 0) {
        var buf = [];
        i += 1;
        while (i < lines.length && lines[i].trim().indexOf('```') !== 0) {
          buf.push(lines[i]);
          i += 1;
        }
        i += 1;
        out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
        continue;
      }

      var hm = line.match(/^(#{1,4})\s+(.*)$/);
      if (hm) {
        var lv = hm[1].length;
        out.push('<h' + lv + '>' + inline(hm[2].trim()) + '</h' + lv + '>');
        i += 1;
        continue;
      }

      if (line.trim().indexOf('>') === 0) {
        var bq = [];
        while (i < lines.length && lines[i].trim().indexOf('>') === 0) {
          bq.push(lines[i].replace(/^\s*>\s?/, ''));
          i += 1;
        }
        out.push('<blockquote>' + bq.map(inline).join('<br>') + '</blockquote>');
        continue;
      }

      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        var ordered = /^\s*\d+\.\s+/.test(line);
        var tag = ordered ? 'ol' : 'ul';
        var li = [];
        while (i < lines.length) {
          var m2 = lines[i].match(/^\s*([-*]|\d+\.)\s+(.*)$/);
          if (!m2) break;
          li.push('<li>' + inline(m2[2]) + '</li>');
          i += 1;
        }
        out.push('<' + tag + '>' + li.join('') + '</' + tag + '>');
        continue;
      }

      if (!line.trim()) { i += 1; continue; }

      var para = [];
      while (i < lines.length && lines[i].trim()) {
        para.push(lines[i].trim());
        i += 1;
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  window.MFA = { esc: esc, parseMd: parseMd, mdToHtml: mdToHtml };
})();
