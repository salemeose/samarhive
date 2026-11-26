/* samarHive · step 2 — Preparation (تجهيز الطلبات), shared by the team.
   Same features as the old samar.mr/pages/tajhiz-1islor page, but orders, ticks, edits, receipt numbers
   and the sales log are kept in Google (Apps Script) so every phone sees the same thing.
   Uses the helpers of index.html (S, L, P, t, ic, esc, api, toast, ask, store, hdr, routes, Demo…). */
'use strict';
(() => {
const PL = {
ar: { prep: 'التجهيز', sub_n: 'طلبات مفتوحة', paste_ph: 'الصق رسالة الطلب من واتساب هنا… تُضاف تلقائياً ويفرغ المربع للطلب التالي', paste: 'لصق من الحافظة', add_order: 'إضافة الطلب',
  no_code: 'لم أجد أي رمز منتج (مثل SM261002) في الرسالة.', added: 'أُضيف', orders_w: 'طلبات', order_w: 'الطلب', ready_next: 'جاهز للطلب التالي', dup_one: 'هذا الطلب مسجّل مسبقاً', dup_many: 'مسجّلة مسبقاً',
  all_orders: 'كل الطلبات', confirmed: 'المؤكدة', pct_note: 'من قيمة الطلبات مؤكدة · بدون التوصيل', sup_all: 'طلب من المورد لكل الطلبات', sup_one: 'طلب المورد', clear_all: 'مسح كل الطلبات', clear_q: 'مسح كل الطلبات من القائمة؟ المبيعات المسجّلة تبقى.',
  order: 'طلب', products: 'منتجات', pieces: 'قطع', ok_short: '✓ مؤكد', ready: '✓ جاهز', sold: 'مباع', pasted_at: 'وقت اللصق',
  unknown: 'رمز غير معروف', unknown_s: 'يلزم التحقق من المنتج يدوياً (ربما حُذف أو تغيّر رمزه).', not_avail: 'غير متوفر — لن يُحسب', back: 'إرجاع', was: 'كان', gift: 'هدية', added_tag: '＋ مضاف', gift_tag: '🎁 هدية مجانية',
  add_product: 'إضافة منتج', free_gift: 'هدية مجانية', free_gift_on: '✓ هدية مجانية', free_default: 'هدية مجانية مع الطلبية', search_ph: 'الاسم أو الماركة أو الرمز (مثال: سيكابلاست)', none_found: 'لا يوجد منتج بهذا الاسم — جرّب كلمة أخرى أو الماركة', gift_ph: 'ما هي الهدية؟ مثال: عينة CeraVe كريم مرطب 5 مل', add_gift: 'إضافة الهدية', write_gift: 'اكتب ما هي الهدية أولاً',
  delivery: 'التوصيل (أوقية)', free_del: 'مجاني', discount: 'خصم', ouguiya: 'أوقية', total: 'الإجمالي', pay: 'الدفع', cash: 'نقدًا',
  receipt_a4: 'إيصال A4', receipt_img: 'صورة الإيصال', confirm: 'تأكيد مع الزبون', confirmed_btn: 'مؤكد', sell: 'تم البيع', sold_btn: 'مُسجّل كمبيع', sell_again_q: 'هذا الطلب مسجّل مسبقاً. تحديث البيع بالأرقام الحالية؟', update: 'تحديث',
  remove: 'إزالة هذا الطلب', remove_q: 'إزالة هذا الطلب من القائمة؟', removed: 'تمت إزالة الطلب', copied: 'نُسخ الرقم', copy: 'نسخ', saved_img: 'حُفظ الإيصال كصورة', img_fail: 'تعذّر إنشاء الصورة',
  sold_ok: 'سُجّل البيع', sold_upd: 'تم تحديث البيع', archived: 'وحُفظ الإيصال في Drive', conf_on: '✓ الطلب مؤكد', conf_off: 'أُلغي التأكيد', gift_on: '🎁 أُضيفت هدية مجانية', gift_off: 'أُزيلت الهدية', gift_added: '🎁 أُضيفت الهدية', gift_del: 'حُذفت الهدية', prod_added: '✓ أُضيف',
  sales: 'سجل المبيعات', this_month: 'هذا الشهر', all: 'الكل', sales_n: 'بيع', xls_month: 'Excel هذا الشهر', xls_all: 'Excel الكل', no_sales: 'لا توجد مبيعات في هذه الفترة', sdel_q: 'حذف هذا البيع من السجل؟ يرجع الطلب غير مباع.', sdel_ok: 'حُذف البيع من السجل', sales_note: 'المبيعات محفوظة في Google Sheets، والإيصالات في Drive › samarHive › Receipts.',
  imp: 'استيراد من صفحة التجهيز القديمة', imp_s: 'في الصفحة القديمة اضغط «Excel الكل» ثم اختر الملف هنا', imp_ok: 'تم استيراد', imp_skip: 'موجودة مسبقاً', imp_bad: 'هذا ليس ملف المبيعات من صفحة التجهيز', cat_loading: 'تحميل المنتجات…', cat_fail: 'تعذّر تحميل المنتجات من samar.mr — يظهر الرمز فقط', cat_upd: 'تحديث المنتجات', cat_ok: 'تم تحديث المنتجات', sync: 'يتم الحفظ…', packed: 'تم', empty: 'لا توجد طلبات. الصق رسالة طلب من واتساب للبدء.', bc_saved: 'حُفظ طلب المورد في Drive' },
fr: { prep: 'Préparation', sub_n: 'commandes ouvertes', paste_ph: 'Collez ici le message WhatsApp de la commande… il est ajouté et la case se vide', paste: 'Coller', add_order: 'Ajouter la commande',
  no_code: 'Aucun code produit (ex. SM261002) dans le message.', added: 'Ajouté', orders_w: 'commandes', order_w: 'la commande', ready_next: 'prêt pour la suivante', dup_one: 'Cette commande est déjà enregistrée', dup_many: 'déjà enregistrées',
  all_orders: 'Toutes', confirmed: 'Confirmées', pct_note: 'de la valeur confirmée · sans livraison', sup_all: 'Bon de commande pour tout', sup_one: 'Bon de cde', clear_all: 'Vider la liste', clear_q: 'Retirer toutes les commandes de la liste ? Les ventes restent.',
  order: 'Commande', products: 'produits', pieces: 'pièces', ok_short: '✓ confirmée', ready: '✓ prête', sold: 'vendue', pasted_at: 'heure du collage',
  unknown: 'Code inconnu', unknown_s: 'À vérifier à la main (produit supprimé ou code changé).', not_avail: 'Indisponible — non compté', back: 'Remettre', was: 'était', gift: 'Cadeau', added_tag: '＋ ajouté', gift_tag: '🎁 cadeau',
  add_product: 'Ajouter un produit', free_gift: 'Cadeau', free_gift_on: '✓ Cadeau', free_default: 'Cadeau offert avec la commande', search_ph: 'Nom, marque ou code (ex. Cicaplast)', none_found: 'Aucun produit — essayez un autre mot ou la marque', gift_ph: 'Quel cadeau ? ex. échantillon CeraVe 5 ml', add_gift: 'Ajouter le cadeau', write_gift: 'Écrivez d’abord le cadeau',
  delivery: 'Livraison (MRU)', free_del: 'Gratuite', discount: 'Remise', ouguiya: 'MRU', total: 'Total', pay: 'Paiement', cash: 'Espèces',
  receipt_a4: 'Reçu A4', receipt_img: 'Reçu image', confirm: 'Confirmer', confirmed_btn: 'Confirmée', sell: 'Vendue', sold_btn: 'Vente enregistrée', sell_again_q: 'Déjà enregistrée. Mettre à jour la vente ?', update: 'Mettre à jour',
  remove: 'Retirer cette commande', remove_q: 'Retirer cette commande de la liste ?', removed: 'Commande retirée', copied: 'Numéro copié', copy: 'Copier', saved_img: 'Reçu enregistré en image', img_fail: 'Image impossible',
  sold_ok: 'Vente enregistrée', sold_upd: 'Vente mise à jour', archived: 'et reçu gardé dans Drive', conf_on: '✓ Commande confirmée', conf_off: 'Confirmation annulée', gift_on: '🎁 Cadeau ajouté', gift_off: 'Cadeau retiré', gift_added: '🎁 Cadeau ajouté', gift_del: 'Cadeau supprimé', prod_added: '✓ Ajouté',
  sales: 'Ventes', this_month: 'Ce mois', all: 'Tout', sales_n: 'ventes', xls_month: 'Excel du mois', xls_all: 'Excel tout', no_sales: 'Aucune vente sur cette période', sdel_q: 'Supprimer cette vente ? La commande redevient non vendue.', sdel_ok: 'Vente supprimée', sales_note: 'Les ventes sont dans Google Sheets, les reçus dans Drive › samarHive › Receipts.',
  imp: 'Importer depuis l’ancienne page tajhiz', imp_s: 'Sur l’ancienne page touchez « Excel الكل » puis choisissez le fichier ici', imp_ok: 'Importées', imp_skip: 'déjà présentes', imp_bad: 'Ce n’est pas le fichier des ventes de la page tajhiz', cat_loading: 'Chargement des produits…', cat_fail: 'Produits de samar.mr indisponibles — seul le code s’affiche', cat_upd: 'Mettre à jour les produits', cat_ok: 'Produits mis à jour', sync: 'Enregistrement…', packed: 'Fait', empty: 'Aucune commande. Collez un message WhatsApp pour commencer.', bc_saved: 'Bon de commande gardé dans Drive' }
};
const tp = k => (PL[S.lang] && PL[S.lang][k]) || PL.ar[k] || k;
L.ar.prep = 'التجهيز'; L.fr.prep = 'Préparation';
Object.assign(P, {
  box: 'M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8',
  paste: 'M9 3h6v3H9z M9 4.5H6a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1h-3',
  print: 'M6 9V3h12v6 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v7H6z',
  image: 'M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M15 9h.01',
  gift: 'M20 12v9H4v-9 M2 7h20v5H2z M12 21V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  truck: 'M3 6h11v10H3z M14 10h4l3 3v3h-7z M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  x: 'M6 6l12 12 M18 6L6 18', undo: 'M9 14L4 9l5-5 M4 9h11a5 5 0 0 1 0 10h-3', chev: 'M6 9l6 6 6-6',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-4.3-4.3', phone: 'M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  coins: 'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3z M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5 M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  refresh: 'M21 12a9 9 0 0 1-15.5 6.2L3 16 M3 12a9 9 0 0 1 15.5-6.2L21 8 M21 3v5h-5 M3 21v-5h5', download: 'M12 3v12 M7 10l5 5 5-5 M5 21h14'
});
const PAYS = [['cash', () => tp('cash')], ['bankily', () => 'Bankily'], ['masrvi', () => 'Masrvi'], ['sedad', () => 'Sedad']];
const OC = ['#FFC800', '#3B82F6', '#EC4899', '#10B981', '#8B5CF6', '#F97316'], OS = ['#FFF8DB', '#EFF6FF', '#FDF2F8', '#ECFDF5', '#F5F3FF', '#FFF7ED'];
const PR = { orders: store.get('orders', []), cat: store.get('cat', null), open: null, sales: null, sm: 'month', pend: {}, timers: {}, poll: null, catBusy: false };
const isPrep = () => (location.hash.replace(/^#\/?/, '').split('/')[0] === 'prep');

/* ---------- helpers from the old page ---------- */
const mru = c => Math.round((c || 0) / 100).toLocaleString('en-US');
const CAT = () => (PR.cat && PR.cat.cat) || {};
const ptitle = (code, p) => (S.lang === 'fr' && PR.cat && PR.cat.fr && PR.cat.fr[code]) || p.t;
const img = u => (u && u.indexOf('//') === 0 ? 'https:' + u : u || '');
function normq(s) { return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[-–_.,/]+/g, ' '); }
function hashText(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function field(text, re) { const m = text.match(re); return m ? m[1].trim() : ''; }
function discCalc(sub, d) { if (!d || !(d.v > 0)) return 0; const v = d.m === 'n' ? Math.round(d.v * 100) : Math.round(sub * Math.min(d.v, 100) / 100); return Math.min(v, sub); }
function discLabel(d) { return d && d.v > 0 && d.m !== 'n' ? ' (' + d.v + '%)' : ''; }
function stamp(ms) { const d = new Date(ms), p = n => String(n).padStart(2, '0'); return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
function parse(text) {
  const o = { lines: [] };
  text.split(/\n/).forEach(ln => {
    const m = ln.match(/\b(SM\d{6}[A-Z]?|SMX\d+)\b/); if (!m) return;
    const q = ln.match(/×\s*(\d+)/) || ln.match(/\bx\s*(\d+)/i);
    o.lines.push({ code: m[1], qty: q ? parseInt(q[1], 10) : 0 });
  });
  if (o.lines.length === 1 && !o.lines[0].qty) o.lines[0].qty = parseInt(field(text, /(?:الكمية|Quantité)\s*:\s*(\d+)/), 10) || 1;
  o.lines.forEach(l => { if (!l.qty) l.qty = 1; });
  o.name = field(text, /(?:^|\n)\s*(?:الاسم(?: الكامل)?|Nom(?: complet)?)\s*:\s*(.+)/);
  o.phone = field(text, /(?:الهاتف|رقم الهاتف|Téléphone|téléphone)\s*:\s*([+\d\s]+)/);
  o.city = field(text, /(?:المدينة|Ville)\s*:\s*(.+)/);
  o.address = field(text, /(?:العنوان|Adresse|adresse)\s*:\s*(.+)/);
  o.when = field(text, /(?:التاريخ|Date)\s*:\s*([^\n]+)/);
  o.note = field(text, /(?:ملاحظة|Note)\s*:\s*(.+)/);
  const d = text.match(/(?:التوصيل|Livraison)\s*:\s*([^\n]+)/);
  o.fee = d ? (parseInt(d[1].replace(/[^\d]/g, ''), 10) || 0) : 100;
  return o;
}
function mergeSt(st, patch) {
  Object.keys(patch).forEach(k => {
    if (k === 'ticks' || k === 'q') { st[k] = st[k] || {}; Object.keys(patch[k]).forEach(j => { if (patch[k][j] === null) delete st[k][j]; else st[k][j] = patch[k][j]; }); }
    else if (patch[k] === null) delete st[k]; else st[k] = patch[k];
  });
  return st;
}
/* the order as it is now: message lines + edits + added products */
function view(ord) {
  const o = parse(ord.text), st = ord.st || {}, cat = CAT();
  o.lines.forEach((l, i) => { l.orig = l.qty; if (st.q && st.q[i] != null) l.qty = st.q[i]; });
  const base = o.lines.length;
  (st.add || []).forEach(a => o.lines.push({ code: a.c, qty: a.q, orig: a.q, added: 1, gift: a.g ? 1 : 0 }));
  let pieces = 0, sub = 0, done = 0, all = 0;
  o.lines.forEach((l, i) => { const p = cat[l.code]; pieces += l.qty; if (p) sub += (l.gift ? 0 : p.p) * l.qty; if (l.qty > 0 && p) { all += l.qty; if (st.ticks && st.ticks[i]) done += l.qty; } });
  const fee = st.fee != null ? st.fee : o.fee, dsc = discCalc(sub, st.disc);
  const when = o.when || (ord.at ? stamp(new Date(ord.at).getTime()) + ' (' + tp('pasted_at') + ')' : '');
  return { o, st, base, pieces, sub, fee, dsc, total: sub - dsc + fee * 100, done, all, when, sold: ord.status === 'sold', conf: !!st.ok || ord.status === 'sold' };
}
const saveLocal = () => store.set('orders', PR.orders);
const byId = id => PR.orders.find(o => o.id === id);

/* ---------- catalogue (read from samar.mr by the backend) ---------- */
async function loadCat(force) {
  if (PR.catBusy) return; if (PR.cat && !force && Date.now() - (PR.cat.got || 0) < 3 * 3600e3) return;
  PR.catBusy = true;
  try { const c = await api('catalog', { force: !!force }); c.got = Date.now(); PR.cat = c; store.set('cat', c); if (force) toast(tp('cat_ok')); if (isPrep()) drawList(); }
  catch (e) { if (!PR.cat) toast(tp('cat_fail')); }
  PR.catBusy = false;
}

/* ---------- screen ---------- */
function vPrep() {
  const open = PR.orders.filter(o => o.status !== 'removed').length;
  return hdr(tp('prep'), open + ' ' + tp('sub_n'), `<button class="ib" data-xcat aria-label="${tp('cat_upd')}">${ic('refresh', 20)}</button>`) +
  `<main class="main" id="prep">
   <div class="card xpaste">
    <textarea id="x-in" class="inp" style="height:92px;padding:12px 14px;font-size:15px;resize:vertical" placeholder="${tp('paste_ph')}" spellcheck="false"></textarea>
    <div class="xbt"><button class="btn c" data-xpaste>${ic('paste', 20)}${tp('paste')}</button><button class="btn" data-xgo>${ic('plus', 20)}${tp('add_order')}</button></div>
   </div>
   <div id="x-list" style="display:flex;flex-direction:column;gap:12px">${listHtml()}</div>
   <div id="x-sales">${salesHtml()}</div>
  </main>`;
}
function listHtml() {
  if (!PR.cat && !PR.catBusy) loadCat();
  const list = PR.orders.filter(o => o.status !== 'removed');
  if (!list.length) return `<div class="card empty">${PR.cat ? tp('empty') : tp('cat_loading')}</div>`;
  let all = 0, conf = 0, n = 0, cn = 0;
  const views = list.map(o => { const v = view(o); n++; all += v.sub - v.dsc; if (v.conf) { cn++; conf += v.sub - v.dsc; } return v; });
  const pct = all ? Math.round(conf / all * 100) : 0;
  const sum = `<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="row" style="gap:8px">
    <div class="grow xs" style="--c:#2563EB;--cb:#EFF6FF"><span>${ic('box', 16)} ${tp('all_orders')} <i>${n}</i></span><b dir="ltr">${mru(all)} <small>MRU</small></b></div>
    <div class="grow xs" style="--c:#16A34A;--cb:#ECFDF3"><span>${ic('check', 16)} ${tp('confirmed')} <i>${cn}</i></span><b dir="ltr">${mru(conf)} <small>MRU</small></b></div></div>
    <div class="bar8" role="img" aria-label="${pct}%"><i style="width:${pct}%;background:linear-gradient(90deg,#22C55E,#16A34A)"></i></div><div class="muted"><b>${pct}%</b> ${tp('pct_note')}</div>
    <div class="xbt"><button class="btn c sm" data-xall>${ic('truck', 18)}${list.length > 1 ? tp('sup_all') + ' (' + list.length + ')' : tp('sup_one')}</button>${isMgr() ? `<button class="btn o sm" data-xclear>${tp('clear_all')}</button>` : ''}</div></div>`;
  return sum + list.map((ord, idx) => orderHtml(ord, views[idx], idx)).reverse().join('');
}
function orderHtml(ord, v, idx) {
  const { o, st } = v, cat = CAT(), open = PR.open === ord.id, oc = OC[idx % OC.length], os = OS[idx % OS.length];
  const nProd = o.lines.filter(l => l.qty > 0).length;
  const state = v.sold ? `<span class="xst sold">💰 ${tp('sold')}</span>` : (v.all && v.done === v.all ? `<span class="xst rd">${tp('ready')}</span>` : `<span class="xst">${v.done}/${v.all}</span>`);
  let h = `<div class="xo${open ? ' open' : ''}" data-xo="${ord.id}" style="--oc:${oc};--os:${os}">
   <button class="xh" data-xh aria-expanded="${open}"><span class="xn">${idx + 1}</span><span class="xw"><span>${esc(o.name || tp('order') + ' ' + (idx + 1))}</span><small>${nProd} ${tp('products')} · ${v.pieces} ${tp('pieces')}${v.conf ? ' · <b style="color:#166534">' + tp('ok_short') + '</b>' : ''}${v.when ? ' · <bdi dir="ltr">🕒 ' + esc(v.when) + '</bdi>' : ''}${ord.no ? ' · <bdi dir="ltr">' + esc(ord.no) + '</bdi>' : ''}</small></span>${state}<span class="xchev">${ic('chev', 20)}</span></button>`;
  if (!open) return h + '</div>';
  h += '<div class="xb">';
  if (o.name || o.phone || o.city || o.address || v.when || o.note) {
    h += `<div class="xc">${o.name ? `<b>👤 ${esc(o.name)}</b>` : ''}${v.when ? `<span>🕒 <bdi dir="ltr">${esc(v.when)}</bdi></span>` : ''}${o.phone ? `<button class="xphb" data-xph="${esc(o.phone.replace(/\s+/g, ''))}">${ic('phone', 16)}<bdi dir="ltr">${esc(o.phone)}</bdi><small>${tp('copy')}</small></button>` : ''}${o.city || o.address ? `<span>📍 ${esc([o.city, o.address].filter(Boolean).join('، '))}</span>` : ''}${o.note ? `<span>📝 ${esc(o.note)}</span>` : ''}</div>`;
  }
  h += `<div class="row"><span class="d" style="font-size:14px;color:#16A34A">✓ ${v.done} / ${v.all} ${tp('pieces')}</span><div class="bar8 grow"><i style="width:${v.all ? v.done / v.all * 100 : 0}%;background:linear-gradient(90deg,#22C55E,#16A34A)"></i></div></div>`;
  o.lines.forEach((l, i) => {
    const p = cat[l.code], off = !l.qty, done = st.ticks && st.ticks[i];
    if (!p) { h += `<div class="xp bad"><div class="xi"><b>✗ ${tp('unknown')}: <bdi dir="ltr">${esc(l.code)}</bdi></b><span>${tp('unknown_s')}</span></div></div>`; return; }
    h += `<div class="xp${off ? ' off' : done ? ' done' : ''}">
     <div class="xr1"><div class="ximg" style="background-image:url('${esc(img(p.i))}')"><span class="xq">×${l.qty}</span></div>
      <div class="xi"><span class="xbr" dir="auto">${esc(p.b)}${l.added ? ` <b class="tag${l.gift ? ' g' : ''}">${l.gift ? tp('gift_tag') : tp('added_tag')}</b>` : ''}</span><span class="xt" dir="auto">${esc(ptitle(l.code, p))}</span>
       ${off ? '' : `<span class="xpr">${l.gift ? `<b style="color:#16A34A">${tp('gift')}</b>` : `<bdi dir="ltr"><b>${mru(p.p)}</b>${l.qty > 1 ? ` × ${l.qty} = <b>${mru(p.p * l.qty)}</b>` : ''} MRU</bdi>`}</span>`}
       <span class="xm"><bdi dir="ltr">${esc(l.code)}${p.sc ? ' · ' + esc(p.sc) : ''}${p.bc ? ' · ' + esc(p.bc) : ''}</bdi></span></div></div>
     <div class="xr2">${off ? `<span class="xoffn">✗ ${tp('not_avail')}</span><span class="grow"></span><button class="btn o sm" data-xback="${i}">${ic('undo', 16)}${tp('back')}</button>`
       : `<span class="xstep"><button data-xq="${i}:1" aria-label="+">+</button><b>${l.qty}</b><button data-xq="${i}:-1" aria-label="−"${l.qty <= 1 ? ' disabled' : ''}>−</button></span><button class="xoff" data-xoff="${i}" aria-label="${tp('not_avail')}">${ic('x', 16)}</button>${l.qty !== l.orig ? `<span class="muted">${tp('was')} ×${l.orig}</span>` : ''}<span class="grow"></span><button class="xtk" data-xt="${i}" aria-pressed="${!!done}">${ic('check', 20, 'currentColor', 2.6)}<span>${tp('packed')}</span></button>`}</div></div>`;
  });
  (st.free || []).forEach((fr, k) => { h += `<div class="xfree">🎁 <span class="grow" dir="auto">${esc(fr.t)}</span><button class="xoff" data-xfd="${k}" aria-label="✕">${ic('x', 16)}</button></div>`; });
  h += `<div class="xbt"><button class="btn c sm" data-xaddopen>${ic('plus', 18)}${tp('add_product')}</button><button class="btn c sm" data-xgift>${ic('gift', 18)}${st.free && st.free.length ? tp('free_gift_on') : tp('free_gift')}</button></div>
   <div class="xaddbox" hidden><input class="inp" type="search" enterkeyhint="search" data-xaddq placeholder="${tp('search_ph')}"><div class="xres"></div></div>
   <div class="xfreebox" hidden><input class="inp" type="text" data-xfreet placeholder="${tp('gift_ph')}"><button class="btn y sm" data-xfadd>${tp('add_gift')}</button></div>
   <div class="xco">
    <div class="xcl">${ic('truck', 18)}<span class="grow">${tp('delivery')}</span><input class="inp xin" type="number" inputmode="numeric" min="0" data-xfeei value="${v.fee}" dir="ltr"></div>
    <div class="pills xwrap">${[0, 100, 150, 200].map(f => `<button class="pill${v.fee === f ? ' on' : ''}" data-xfee="${f}">${f ? f : tp('free_del')}</button>`).join('')}</div>
    <div class="xcl">${ic('gift', 18)}<span class="grow">${tp('discount')}</span><span class="seg" style="padding:3px;flex:none"><button class="${!st.disc || st.disc.m !== 'n' ? 'on' : ''}" data-xdm="p" style="height:34px;padding:0 12px">%</button><button class="${st.disc && st.disc.m === 'n' ? 'on' : ''}" data-xdm="n" style="height:34px;padding:0 10px">${tp('ouguiya')}</button></span><input class="inp xin" type="number" inputmode="decimal" min="0" step="any" placeholder="0" data-xdi value="${st.disc && st.disc.v ? st.disc.v : ''}" dir="ltr"></div>
    <b class="xdv" dir="ltr">${v.dsc ? '− ' + mru(v.dsc) + ' MRU' : ''}</b>
    <div class="xcl">${ic('coins', 18)}<span class="grow">${tp('pay')}</span></div>
    <div class="xpay">${PAYS.map(([k, n]) => `<button class="pill${(st.pay || 'cash') === k ? ' on' : ''}" data-xpay="${k}">${n()}</button>`).join('')}</div>
    <div class="xtot"><span>${tp('total')}</span><b class="xtv" dir="ltr">${mru(v.total)} MRU</b></div>
   </div>
   <div class="xact">
    <button class="xa" data-xprint style="--c:#8A6400;--cb:#FFF4CC"><span class="xai">${ic('print', 22)}</span><span>${tp('receipt_a4')}</span></button>
    <button class="xa" data-xsup style="--c:#2563EB;--cb:#EFF6FF"><span class="xai">${ic('truck', 22)}</span><span>${tp('sup_one')}</span></button>
    <button class="xa" data-ximg style="--c:#7C3AED;--cb:#F5F3FF"><span class="xai">${ic('image', 22)}</span><span>${tp('receipt_img')}</span></button>
   </div>
   <div class="xdo"><button class="btn ${v.conf ? 'gs' : 'g'}" data-xconf${v.sold ? ' disabled' : ''}>${ic(v.conf ? 'check' : 'phone', 18)}${v.conf ? tp('confirmed_btn') : tp('confirm')}</button>
    <button class="btn ${v.sold ? 'o' : ''}" data-xsold>${ic(v.sold ? 'check' : 'coins', 18, v.sold ? 'currentColor' : '#FFC800')}${v.sold ? tp('sold_btn') : tp('sell')}</button></div>
   <button class="xrm" data-xrm>${ic('trash', 16)}${tp('remove')}</button></div></div>`;
  return h;
}
function drawList(keepScroll = true) {
  const el = document.getElementById('x-list'); if (!el) return;
  const y = window.scrollY; el.innerHTML = listHtml(); if (keepScroll) window.scrollTo(0, y);
  const s = document.querySelector('.top .sub'); if (s) s.textContent = PR.orders.filter(o => o.status !== 'removed').length + ' ' + tp('sub_n');
}
function drawTotals(box, ord) {
  const v = view(ord); box.querySelector('.xtv').textContent = mru(v.total) + ' MRU';
  const dv = box.querySelector('.xdv'); if (dv) dv.textContent = v.dsc ? '− ' + mru(v.dsc) + ' MRU' : '';
  box.querySelectorAll('[data-xfee]').forEach(b => b.classList.toggle('on', +b.dataset.xfee === v.fee));
}

/* ---------- saving edits (merged on the server, so two phones can work on one order) ---------- */
function upd(ord, patch, redraw = true) {
  ord.st = mergeSt(ord.st || {}, patch); saveLocal();
  PR.pend[ord.id] = mergeSt(PR.pend[ord.id] || {}, JSON.parse(JSON.stringify(patch)));
  clearTimeout(PR.timers[ord.id]); PR.timers[ord.id] = setTimeout(() => flush(ord.id), 500);
  if (redraw) drawList();
}
async function flush(id) {
  const patch = PR.pend[id]; if (!patch) return; delete PR.pend[id];
  try { const r = await api('orders.update', { id, patch }); const o = byId(id); if (o && !PR.pend[id]) { o.st = r.st; o.upAt = r.upAt; saveLocal(); } }
  catch (e) { PR.pend[id] = mergeSt(patch, PR.pend[id] || {}); fail(e); }
}
async function pullOrders() {
  try {
    const list = await api('orders.list');
    const keep = {}; PR.orders.forEach(o => { if (PR.pend[o.id]) keep[o.id] = o; });
    PR.orders = list.map(o => keep[o.id] || o); saveLocal();
    const f = document.activeElement; const typing = f && /INPUT|TEXTAREA/.test(f.tagName) && f.closest('#prep');
    if (isPrep() && !typing) drawList();
  } catch (e) { /* offline: keep what we have */ }
}

/* ---------- adding pasted orders ---------- */
async function addText(text) {
  text = String(text || '').replace(/^.*tajhiz-1islor.*$/gm, '');
  const parts = text.trim().split(/(?=🛍️|�\s*(?:طلب جديد من متجر سمر|Nouvelle commande)|(?:^|\n)\s*(?:طلب جديد من متجر سمر|Nouvelle commande))/).map(x => x.trim()).filter(x => /\b(SM\d{6}[A-Z]?|SMX\d+)\b/.test(x));
  const box = document.getElementById('x-in');
  if (!parts.length) { if (text.trim()) toast(tp('no_code')); return; }
  const items = parts.map(t => { const cm = t.match(/(?:رقم الطلب|N° commande)\s*:?\s*(\d{4}-[A-Z0-9]{4})/); return { text: t, key: hashText(t), code: cm ? cm[1] : '' }; });
  if (box) box.value = '';
  try {
    const r = await api('orders.add', { items });
    r.added.forEach(o => { if (!byId(o.id)) PR.orders.push(o); });
    if (r.added.length) PR.open = r.added[r.added.length - 1].id;
    saveLocal(); drawList();
    if (r.dup.length && !r.added.length) toast('⚠ ' + (r.dup.length > 1 ? tp('dup_many') : tp('dup_one')) + ' (' + r.dup.join('، ') + ')');
    else toast('✓ ' + tp('added') + ' ' + (r.added.length > 1 ? r.added.length + ' ' + tp('orders_w') : tp('order_w')) + (r.dup.length ? ' · ⚠ ' + r.dup.length + ' ' + tp('dup_many') : ' — ' + tp('ready_next')));
    const el = document.querySelector(`[data-xo="${PR.open}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { if (box) box.value = text; fail(e); }
}

/* ---------- sales log (managers) ---------- */
function salesHtml() {
  if (!isMgr()) return '';
  const list = PR.sales; if (!list) return '';
  const ym = new Date().toISOString().slice(0, 7);
  const mo = list.filter(x => String(x.at).slice(0, 7) === ym), sum = a => a.reduce((s, x) => s + (+x.total || 0), 0);
  const shown = PR.sm === 'month' ? mo : list;
  return `<div class="h2" style="margin-top:8px">📒 ${tp('sales')}</div><div class="card" style="display:flex;flex-direction:column;gap:12px">
   <div class="row" style="gap:8px"><div class="grow xs" style="--c:#8A6400;--cb:#FFF4CC"><span>${tp('this_month')} <i>${mo.length}</i></span><b>${Math.round(sum(mo)).toLocaleString('en-US')} <small>MRU</small></b></div><div class="grow xs" style="--c:#2563EB;--cb:#EFF6FF"><span>${tp('all')} <i>${list.length}</i></span><b>${Math.round(sum(list)).toLocaleString('en-US')} <small>MRU</small></b></div></div>
   <div class="xbt"><button class="btn y sm" data-xls="month">${ic('download', 18)}${tp('xls_month')}</button><button class="btn c sm" data-xls="all">${ic('download', 18)}${tp('xls_all')}</button></div>
   <div class="seg"><button class="${PR.sm === 'month' ? 'on' : ''}" data-xsm="month">${tp('this_month')}</button><button class="${PR.sm === 'all' ? 'on' : ''}" data-xsm="all">${tp('all')}</button></div>
   ${shown.length ? shown.slice().reverse().slice(0, 60).map(x => `<div class="row" style="border-bottom:1px solid #EFEBE4;padding-bottom:10px"><div class="grow"><div style="font-weight:600">${esc(x.name || x.no)}</div><div class="muted"><bdi dir="ltr">${esc(stamp(new Date(x.at).getTime()))} · ${esc(x.no)}</bdi> · ${x.pieces} ${tp('pieces')}${x.pay ? ' · ' + esc((PAYS.find(p => p[0] === x.pay) || [, () => x.pay])[1]()) : ''}${x.file ? ` · <a href="${esc(x.file)}" target="_blank" rel="noopener">PNG</a>` : ''}</div></div><b class="d" dir="ltr">${Math.round(+x.total).toLocaleString('en-US')} MRU</b><button class="xoff" data-xsdel="${esc(x.id)}" aria-label="✕">${ic('x', 16)}</button></div>`).join('') : `<div class="empty">${tp('no_sales')}</div>`}
   <label class="btn c sm" style="cursor:pointer">${ic('download', 18)}${tp('imp')}<input type="file" accept=".csv,.tsv,.txt,text/csv,text/plain" data-ximp hidden></label><div class="muted" style="text-align:center;margin-top:-6px">${tp('imp_s')}</div>
   <div class="muted">${tp('sales_note')}</div></div>`;
}
/* import the sales log of the old tajhiz page (its «Excel» file: UTF-16 tab-separated; also accepts a CSV re-saved by Excel / Sheets) */
function splitRows(text) {
  const first = text.split(/\r?\n/)[0], dl = first.indexOf('\t') > -1 ? '\t' : (first.split(';').length > first.split(',').length ? ';' : ',');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"' && cell === '') q = true;
    else if (ch === dl) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); if (row.some(c => c.trim())) rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  row.push(cell); if (row.some(c => c.trim())) rows.push(row);
  return rows;
}
async function importSales(file) {
  const u8 = new Uint8Array(await file.arrayBuffer());
  let text = u8[0] === 0xFF && u8[1] === 0xFE ? new TextDecoder('utf-16le').decode(u8.subarray(2)) : u8[0] === 0xFE && u8[1] === 0xFF ? new TextDecoder('utf-16be').decode(u8.subarray(2)) : new TextDecoder('utf-8').decode(u8);
  text = text.replace(/^\ufeff/, '');
  const rows = splitRows(text), head = (rows.shift() || []).map(h => h.trim().toLowerCase()), col = n => head.indexOf(n);
  if (col('receipt no.') < 0 || col('total') < 0) { toast(tp('imp_bad')); return; }
  const cat = CAT(), num = v => parseFloat(String(v || '').replace(/[^\d.-]/g, '')) || 0;
  const toIso = d => { const m = String(d || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\D+(\d{1,2}):(\d{2}))?/); return m ? new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 12), +(m[5] || 0)).toISOString() : new Date().toISOString(); };
  const sales = rows.map(r => {
    const g = n => (col(n) > -1 ? String(r[col(n)] || '').trim() : '');
    const names = g('products') ? g('products').split(' | ') : [], codes = g('codes').split(', ');
    const items = names.map((t, i) => { const m = t.match(/^(.*) ×(\d+)$/), c = (codes[i] || '').trim(), gift = /\(هدية\)/.test(t); return { c, t: m ? m[1] : t, b: (cat[c] || {}).b || '', q: m ? +m[2] : 1, p: gift || !cat[c] ? 0 : cat[c].p / 100 }; });
    return { no: g('receipt no.'), at: toIso(g('date')), when: g('order date'), name: g('customer'), phone: g('phone'), city: g('city'), address: g('address'), note: g('note'), items, pieces: num(g('pieces')), sub: num(g('products price')), disc: num(g('discount')), fee: num(g('delivery')), total: num(g('total')) };
  }).filter(x => x.no || x.total);
  if (!sales.length) { toast(tp('imp_bad')); return; }
  try { const r = await api('sales.import', { sales }); toast('✓ ' + tp('imp_ok') + ' ' + r.added + (r.skipped ? ' · ' + r.skipped + ' ' + tp('imp_skip') : '')); loadSales(); }
  catch (e) { fail(e); }
}
async function loadSales() { if (!isMgr()) return; try { PR.sales = await api('sales.list', {}); const el = document.getElementById('x-sales'); if (el) el.innerHTML = salesHtml(); } catch (e) {} }

/* ---------- files: download in a browser, save/share through the APK ---------- */
function b64(buf) { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
async function saveFile(blob, name) {
  if (window.SamarHive && window.SamarHive.saveFile) { window.SamarHive.saveFile(b64(await blob.arrayBuffer()), name, blob.type); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function printNow() { if (window.SamarHive && window.SamarHive.print) window.SamarHive.print(); else window.print(); }
function printEl() { let rc = document.getElementById('x-print'); if (!rc) { rc = document.createElement('div'); rc.id = 'x-print'; document.body.appendChild(rc); } return rc; }
function waitImgs(rc, go0) { let fired = false; const go = () => { if (!fired) { fired = true; setTimeout(go0, 50); } }; const ims = rc.querySelectorAll('img'); let left = ims.length; if (!left) return go(); ims.forEach(im => { if (im.complete) { if (!--left) go(); } else im.onload = im.onerror = () => { if (!--left) go(); }; }); }
async function receiptNo(ord) { if (ord.no) return ord.no; const r = await api('orders.number', { id: ord.id }); ord.no = r.no; saveLocal(); return r.no; }
function rows(v) { const cat = CAT(); return v.o.lines.filter(l => cat[l.code] && l.qty > 0).map(l => { const p = cat[l.code]; return { t: p.t + (l.gift ? ' — هدية' : ''), q: l.qty, u: l.gift ? 0 : p.p, s: l.gift ? 0 : p.p * l.qty, g: l.gift, c: l.code, b: p.b }; }); }
const LOGO = () => (PR.cat && PR.cat.logo) || 'icon-192.png';
const dateStr = () => { const d = new Date(); return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); };

async function printReceipt(ord) {
  const no = await receiptNo(ord), v = view(ord), o = v.o, fee = v.fee * 100, rs = rows(v), gifts = (v.st.free || []).map(f => f.t);
  const who = esc(o.name) + (o.phone ? ' · <span dir="ltr">' + esc(o.phone) + '</span>' : '') + (o.city || o.address ? '<br>' + esc([o.city, o.address].filter(Boolean).join('، ')) : '');
  const rc = printEl(); rc.className = 'rcp'; rc.dir = 'rtl';
  rc.innerHTML = `<div class="rc-hd"><img src="${esc(img(LOGO()))}" alt="SAMAR"><div>إيصال رقم <b dir="ltr">${esc(no)}</b><br><span dir="ltr">${dateStr()}</span></div></div><div>${who}</div>
   <table><tr><th>المنتج</th><th class="n">الكمية</th><th class="n">السعر</th><th class="n">المجموع</th></tr>${rs.map(r => `<tr><td dir="auto">${esc(r.t)}</td><td class="n">${r.q}</td><td class="n">${r.g ? 'هدية' : mru(r.u)}</td><td class="n">${r.g ? 'هدية' : mru(r.s)}</td></tr>`).join('')}</table>
   ${gifts.length ? '<div class="rc-g">🎁 ' + gifts.map(esc).join('<br>🎁 ') + '</div>' : ''}
   <div class="rc-r"><span>المجموع الفرعي</span><span dir="ltr">${mru(v.sub)} MRU</span></div>${v.dsc ? `<div class="rc-r"><span>خصم${discLabel(v.st.disc)}</span><span dir="ltr">− ${mru(v.dsc)} MRU</span></div>` : ''}<div class="rc-r"><span>التوصيل</span><span dir="ltr">${fee ? mru(fee) + ' MRU' : 'مجاني'}</span></div>
   <div class="rc-r rc-big"><span>الإجمالي</span><span dir="ltr">${mru(v.total)} MRU</span></div><div class="rc-end">شكراً لثقتك بسمر ✦<br>واتساب <span dir="ltr">49 21 44 79</span> · samar.mr</div>`;
  waitImgs(rc, printNow);
}
async function supplierOrder(lines) {
  const cat = CAT(), qty = {}, order = [];
  lines.forEach(l => { if (!cat[l.code] || !(l.qty > 0)) return; if (!qty[l.code]) { qty[l.code] = 0; order.push(l.code); } qty[l.code] += l.qty; });
  if (!order.length) return;
  let no; try { no = (await api('bc.next')).no; } catch (e) { return fail(e); }
  const d = new Date(), date = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(), fr = (PR.cat && PR.cat.fr) || {};
  let units = 0;
  const trs = order.map((c, i) => { const p = cat[c]; units += qty[c]; return `<tr><td>${i + 1}</td><td><b>${esc(p.sc || '—')}</b></td><td>${esc(fr[c] || p.t)}</td><td>${esc(p.bc || '—')}</td><td class="n"><b>${qty[c]}</b></td></tr>`; }).join('');
  const body = `<div class="rc-hd"><div><h2>Bon de commande</h2>N° <b>${no}</b> · ${date}</div><img src="${esc(img(LOGO()))}" alt="SAMAR"></div><p><b>Client :</b> SAMAR — samar.mr — WhatsApp +222 49 21 44 79</p>
   <table><tr><th>#</th><th>Code fournisseur</th><th>Désignation</th><th>Code-barres</th><th class="n">Qté</th></tr>${trs}</table><p class="rc-sum">${order.length} produits · ${units} unités</p><div class="rc-sign"><div>Date de livraison souhaitée :</div><div>Signature / cachet :</div></div>`;
  const rc = printEl(); rc.className = 'rcp bc'; rc.dir = 'ltr'; rc.innerHTML = body;
  waitImgs(rc, printNow);
  api('bc.archive', { no, html: '<html><head><meta charset="utf-8"><style>' + RC_CSS + '</style></head><body><div class="rcp bc">' + body.replace(/<img[^>]*>/g, '<b style="font-size:20pt">SAMAR</b>') + '</div></body></html>' }).then(() => toast(tp('bc_saved'))).catch(() => {});
}
/* receipt as a PNG (for WhatsApp, and archived in Drive when the sale is recorded) */
function receiptCanvas(ord, no, logo) {
  const v = view(ord), o = v.o, fee = v.fee * 100, rs = rows(v), gifts = (v.st.free || []).map(f => f.t), font = "'Readex Pro', sans-serif";
  const W = 1080, Pd = 64, cQ = Pd + 330, cU = Pd + 205, cT = Pd + 70;
  const c = document.createElement('canvas'); c.width = W; c.height = 5000; const x = c.getContext('2d');
  const f = (w, s) => w + ' ' + s + 'px ' + font;
  const txt = (t, px, py, fnt, color, align, dir) => { x.font = fnt; x.fillStyle = color; x.textAlign = align; x.direction = dir || 'rtl'; x.fillText(t, px, py); };
  const wrap = (t, maxW, fnt) => { x.font = fnt; const out = []; let cur = ''; String(t).split(' ').forEach(w => { const n = cur ? cur + ' ' + w : w; if (cur && x.measureText(n).width > maxW) { out.push(cur); cur = w; } else cur = n; }); if (cur) out.push(cur); return out; };
  const pill = (px, py, w, h, r) => { x.beginPath(); if (x.roundRect) x.roundRect(px, py, w, h, r); else x.rect(px, py, w, h); x.fill(); };
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, c.height); x.fillStyle = '#FFC800'; x.fillRect(0, 0, W, 14);
  let y = Pd + 10;
  if (logo) { const lh = 96, lw = (logo.naturalWidth && logo.naturalHeight) ? lh * logo.naturalWidth / logo.naturalHeight : 220; x.drawImage(logo, Pd, y, Math.min(lw, 340), lh); }
  else txt('SAMAR', Pd, y + 66, f(700, 56), '#1F2937', 'left', 'ltr');
  txt('إيصال', W - Pd, y + 40, f(700, 44), '#1F2937', 'right'); txt(no + '  ·  ' + dateStr(), W - Pd, y + 86, f(500, 28), '#6B7280', 'right', 'ltr');
  y += 128; x.fillStyle = '#1F2937'; x.fillRect(Pd, y, W - 2 * Pd, 4); y += 48;
  if (o.name) { txt(o.name, W - Pd, y, f(700, 34), '#1F2937', 'right'); y += 46; }
  if (o.phone) { txt(o.phone, W - Pd, y, f(500, 28), '#374151', 'right', 'ltr'); y += 42; }
  const place = [o.city, o.address].filter(Boolean).join('، '); if (place) { txt(place, W - Pd, y, f(400, 28), '#374151', 'right'); y += 42; }
  y += 18; x.fillStyle = '#FAF8F5'; pill(Pd, y, W - 2 * Pd, 60, 14);
  const hf = f(600, 25); txt('المنتج', W - Pd - 18, y + 39, hf, '#6B7280', 'right'); txt('الكمية', cQ, y + 39, hf, '#6B7280', 'center'); txt('السعر', cU, y + 39, hf, '#6B7280', 'center'); txt('المجموع', cT, y + 39, hf, '#6B7280', 'center');
  y += 60; const nameW = W - 2 * Pd - 420;
  rs.forEach(r => {
    const ls = wrap(r.t, nameW, f(500, 30)), top = y + 20;
    ls.forEach((ln, k) => txt(ln, W - Pd - 18, top + 30 + k * 42, f(500, 30), '#1F2937', 'right'));
    txt('×' + r.q, cQ, top + 30, f(600, 28), '#374151', 'center', 'ltr'); txt(r.g ? 'هدية' : mru(r.u), cU, top + 30, f(500, 28), '#374151', 'center', 'ltr'); txt(r.g ? 'هدية' : mru(r.s), cT, top + 30, f(700, 28), '#1F2937', 'center', 'ltr');
    y += ls.length * 42 + 30; x.fillStyle = '#EEE9E0'; x.fillRect(Pd, y, W - 2 * Pd, 2);
  });
  y += 52;
  if (gifts.length) { y -= 30; gifts.forEach(g => wrap(g, W - 2 * Pd - 40, f(500, 28)).forEach(ln => { y += 42; txt('🎁 ' + ln, W - Pd, y, f(700, 30), '#166534', 'right'); })); y += 30; x.fillStyle = '#EEE9E0'; x.fillRect(Pd, y, W - 2 * Pd, 2); y += 52; }
  txt('المجموع الفرعي', W - Pd, y, f(500, 30), '#374151', 'right'); txt(mru(v.sub) + ' MRU', Pd, y, f(600, 30), '#374151', 'left', 'ltr'); y += 52;
  if (v.dsc) { txt('خصم' + discLabel(v.st.disc), W - Pd, y, f(500, 30), '#166534', 'right'); txt('− ' + mru(v.dsc) + ' MRU', Pd, y, f(600, 30), '#166534', 'left', 'ltr'); y += 52; }
  txt('التوصيل', W - Pd, y, f(500, 30), '#374151', 'right'); txt(fee ? mru(fee) + ' MRU' : 'مجاني', Pd, y, f(600, 30), '#374151', 'left', 'ltr'); y += 34;
  x.fillStyle = '#1F2937'; pill(Pd, y, W - 2 * Pd, 88, 22);
  txt('الإجمالي', W - Pd - 28, y + 57, f(700, 38), '#fff', 'right'); txt(mru(v.total) + ' MRU', Pd + 28, y + 57, f(700, 40), '#FFC800', 'left', 'ltr');
  y += 88 + 64; txt('شكراً لثقتك بسمر ✦', W / 2, y, f(600, 30), '#1F2937', 'center'); y += 46;
  const ftw = f(400, 26); x.font = ftw; const waA = 'واتساب', waB = 'samar.mr  ·  49 21 44 79 ', wA = x.measureText(waA).width, wB = x.measureText(waB).width, sx = (W - wA - wB) / 2;
  txt(waB, sx, y, ftw, '#6B7280', 'left', 'ltr'); txt(waA, sx + wB + wA, y, ftw, '#6B7280', 'right'); y += Pd;
  const out = document.createElement('canvas'); out.width = W; out.height = y; out.getContext('2d').drawImage(c, 0, 0); return out;
}
function loadLogo() { return new Promise(res => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = () => res(null); im.src = img(LOGO()); setTimeout(() => res(null), 4000); }); }
async function receiptPng(ord, no) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready.catch(() => {});
  const toBlob = cv => new Promise(r => { try { cv.toBlob(b => r(b), 'image/png'); } catch (e) { r(null); } });
  let blob = await toBlob(receiptCanvas(ord, no, await loadLogo()));
  if (!blob) blob = await toBlob(receiptCanvas(ord, no, null)); /* logo blocked the canvas: draw without it */
  return blob;
}
async function sell(ord) {
  if (ord.status === 'sold' && !(await ask(tp('sell_again_q'), tp('update')))) return;
  const btn = document.querySelector(`[data-xo="${ord.id}"] [data-xsold]`); if (btn) btn.disabled = true;
  try {
    await (PR.pend[ord.id] ? flush(ord.id) : 0);
    const no = await receiptNo(ord), v = view(ord), o = v.o;
    const items = rows(v).map(r => ({ c: r.c, t: r.t, b: r.b, q: r.q, p: r.u / 100 })).concat((v.st.free || []).map(fr => ({ c: '', t: fr.t + ' (هدية)', b: '', q: fr.q || 1, p: 0 })));
    const sale = { when: v.when, name: o.name, phone: o.phone, city: o.city, address: o.address, note: o.note, items, pieces: items.reduce((s, x) => s + x.q, 0), sub: v.sub / 100, disc: v.dsc / 100, fee: v.fee, total: v.total / 100, pay: v.st.pay || 'cash' };
    const blob = await receiptPng(ord, no), png = blob ? b64(await blob.arrayBuffer()) : '';
    const was = ord.status === 'sold';
    const r = await api('orders.sell', { id: ord.id, sale, png });
    Object.assign(ord, r.order); saveLocal(); drawList();
    toast('✓ ' + (was ? tp('sold_upd') : tp('sold_ok') + ' — ' + Math.round(sale.total).toLocaleString('en-US') + ' MRU') + (r.file ? ' ' + tp('archived') : ''));
    loadSales();
  } catch (e) { fail(e); if (btn) btn.disabled = false; }
}
async function downloadXls(which) {
  let list = PR.sales || []; const ym = new Date().toISOString().slice(0, 7);
  if (which === 'month') list = list.filter(x => String(x.at).slice(0, 7) === ym);
  if (!list.length) { toast(tp('no_sales')); return; }
  const head = ['Date', 'Order date', 'Receipt no.', 'Customer', 'Phone', 'City', 'Address', 'Products', 'Codes', 'Pieces', 'Products price', 'Discount', 'Delivery', 'Total', 'Payment', 'Sold by', 'Note', 'Receipt file'];
  const clean = v => String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' ');
  const who = id => (userById(id) || {}).name || id;
  const lines = [head.join('\t')].concat(list.map(x => [stamp(new Date(x.at).getTime()), x.when, x.no, x.name, x.phone, x.city, x.address, (x.items || []).map(i => i.t + ' ×' + i.q).join(' | '), (x.items || []).map(i => i.c).join(', '), x.pieces, x.sub, x.disc || 0, x.fee, x.total, x.pay, who(x.soldBy), x.note, x.file].map(clean).join('\t')));
  const text = '﻿' + lines.join('\r\n'), buf = new Uint8Array(text.length * 2);
  for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); buf[i * 2] = c & 255; buf[i * 2 + 1] = c >> 8; }
  saveFile(new Blob([buf], { type: 'text/csv;charset=utf-16le' }), 'samar-sales-' + (which === 'all' ? 'all-' : '') + ym + '.csv');
}
function addSearch(q) {
  const ws = normq(q).split(/\s+/).filter(Boolean); if (!ws.length) return '';
  const cat = CAT(), res = [];
  Object.keys(cat).forEach(c => { const p = cat[c], hay = normq([c, p.b, p.t, p.sc, p.bc, PR.cat.fr && PR.cat.fr[c]].join(' ')); if (ws.every(w => hay.indexOf(w) > -1)) res.push(c); });
  if (!res.length) return `<div class="muted" style="padding:8px">${tp('none_found')}</div>`;
  return res.slice(0, 8).map(c => { const p = cat[c]; return `<button class="xra" data-xadd="${esc(c)}"><span class="ximg sm" style="background-image:url('${esc(img(p.i))}')"></span><span class="grow" style="text-align:start"><small dir="auto">${esc(p.b)}</small><span dir="auto">${esc(ptitle(c, p))}</span></span><b dir="ltr">${mru(p.p)}</b>${ic('plus', 18)}</button>`; }).join('');
}

/* ---------- events ---------- */
document.addEventListener('click', async e => {
  if (!isPrep()) return;
  const el = e.target.closest('button,a'); if (!el) return;
  const ds = el.dataset, box = el.closest('[data-xo]'), ord = box && byId(box.dataset.xo);
  if ('xgo' in ds) return addText(document.getElementById('x-in').value);
  if ('xpaste' in ds) { const tx = document.getElementById('x-in'); try { const t = await navigator.clipboard.readText(); if (t) return addText(t); } catch (er) {} tx.focus(); return; }
  if ('xcat' in ds) return loadCat(true);
  if ('xall' in ds) { let lines = []; PR.orders.filter(o => o.status !== 'removed').forEach(o => { lines = lines.concat(view(o).o.lines); }); return supplierOrder(lines); }
  if ('xclear' in ds) { if (!(await ask(tp('clear_q'), tp('clear_all')))) return; try { await api('orders.clear'); PR.orders = []; saveLocal(); drawList(); } catch (er) { fail(er); } return; }
  if (ds.xls) return downloadXls(ds.xls);
  if (ds.xsm) { PR.sm = ds.xsm; document.getElementById('x-sales').innerHTML = salesHtml(); return; }
  if (ds.xsdel) { if (!(await ask(tp('sdel_q'), tp('remove').split(' ')[0]))) return; try { await api('sales.delete', { id: ds.xsdel }); PR.sales = PR.sales.filter(s => s.id !== ds.xsdel); const o = byId(ds.xsdel); if (o) o.status = 'open'; saveLocal(); drawList(); document.getElementById('x-sales').innerHTML = salesHtml(); toast(tp('sdel_ok')); } catch (er) { fail(er); } return; }
  if (!ord) return;
  if ('xh' in ds) { PR.open = PR.open === ord.id ? null : ord.id; drawList(); const b = document.querySelector(`[data-xo="${ord.id}"]`); if (PR.open && b && b.getBoundingClientRect().top < 80) b.scrollIntoView({ block: 'start' }); return; }
  const v = view(ord);
  if (ds.xt != null) { const i = ds.xt, on = !(ord.st.ticks && ord.st.ticks[i]); if (on && navigator.vibrate) navigator.vibrate(10); return upd(ord, { ticks: { [i]: on ? true : null } }); }
  if (ds.xq) { const [i, d] = ds.xq.split(':').map(Number), l = v.o.lines[i]; const q = Math.min(99, Math.max(1, l.qty + d)); if (l.added) { const add = (ord.st.add || []).slice(); add[i - v.base] = { ...add[i - v.base], q }; return upd(ord, { add }); } return upd(ord, { q: { [i]: q === l.orig ? null : q } }); }
  if (ds.xoff != null) { const i = +ds.xoff, l = v.o.lines[i]; if (l.added) { const add = (ord.st.add || []).slice(); add.splice(i - v.base, 1); return upd(ord, { add }); } return upd(ord, { q: { [i]: 0 }, ticks: { [i]: null } }); }
  if (ds.xback != null) return upd(ord, { q: { [ds.xback]: null } });
  if ('xaddopen' in ds) { const ab = box.querySelector('.xaddbox'); ab.hidden = !ab.hidden; box.querySelector('.xfreebox').hidden = true; if (!ab.hidden) ab.querySelector('input').focus(); return; }
  if (ds.xadd) { const add = (ord.st.add || []).map(a => ({ ...a })), ex = add.find(a => a.c === ds.xadd && !a.g); if (ex) ex.q = Math.min(99, ex.q + 1); else add.push({ c: ds.xadd, q: 1, g: 0 }); upd(ord, { add }); toast(tp('prod_added') + ': ' + ptitle(ds.xadd, CAT()[ds.xadd])); return; }
  if ('xgift' in ds) { if (ord.st.free && ord.st.free.length) { upd(ord, { free: [] }); toast(tp('gift_off')); return; } const fb = box.querySelector('.xfreebox'); fb.hidden = !fb.hidden; box.querySelector('.xaddbox').hidden = true; if (!fb.hidden) { const inp = fb.querySelector('input'); inp.value = inp.value || tp('free_default'); inp.focus(); inp.select(); } return; }
  if ('xfadd' in ds) { const tx = box.querySelector('[data-xfreet]').value.trim(); if (!tx) { toast(tp('write_gift')); return; } upd(ord, { free: (ord.st.free || []).concat([{ t: tx, q: 1 }]) }); toast(tp('gift_added') + ': ' + tx); return; }
  if (ds.xfd != null) { const fr = (ord.st.free || []).slice(); fr.splice(+ds.xfd, 1); upd(ord, { free: fr }); toast(tp('gift_del')); return; }
  if (ds.xfee != null) { upd(ord, { fee: +ds.xfee }, false); box.querySelector('[data-xfeei]').value = ds.xfee; drawTotals(box, ord); return; }
  if (ds.xdm) { const val = parseFloat(box.querySelector('[data-xdi]').value) || 0; upd(ord, { disc: { m: ds.xdm, v: val } }); return; }
  if (ds.xpay) return upd(ord, { pay: ds.xpay });
  if (ds.xph) { try { await navigator.clipboard.writeText(ds.xph); toast('✓ ' + tp('copied') + ' ' + ds.xph); } catch (er) { toast(ds.xph); } return; }
  if ('xconf' in ds) { if (el.disabled) return; const on = !ord.st.ok; upd(ord, { ok: on ? true : null }); toast(on ? tp('conf_on') : tp('conf_off')); return; }
  if ('xprint' in ds) { try { await printReceipt(ord); } catch (er) { fail(er); } return; }
  if ('xsup' in ds) return supplierOrder(v.o.lines);
  if ('ximg' in ds) { try { const no = await receiptNo(ord), blob = await receiptPng(ord, no); if (!blob) return toast(tp('img_fail')); await saveFile(blob, 'samar-' + no + '.png'); toast('✓ ' + tp('saved_img')); } catch (er) { fail(er); } return; }
  if ('xsold' in ds) return sell(ord);
  if ('xrm' in ds) { if (!(await ask(tp('remove_q'), tp('remove').split(' ')[0]))) return; try { await api('orders.remove', { id: ord.id }); PR.orders = PR.orders.filter(o => o.id !== ord.id); saveLocal(); drawList(); toast(tp('removed')); } catch (er) { fail(er); } }
});
document.addEventListener('input', e => {
  if (!isPrep()) return;
  const t = e.target, box = t.closest('[data-xo]'), ord = box && byId(box.dataset.xo);
  if (t.matches('[data-xaddq]')) { box.querySelector('.xres').innerHTML = addSearch(t.value); return; }
  if (!ord) return;
  if (t.matches('[data-xfeei]')) { upd(ord, { fee: parseInt(t.value, 10) || 0 }, false); drawTotals(box, ord); }
  if (t.matches('[data-xdi]')) { const m = box.querySelector('[data-xdm].on'); upd(ord, { disc: { m: m ? m.dataset.xdm : 'p', v: parseFloat(t.value) || 0 } }, false); drawTotals(box, ord); }
});
document.addEventListener('change', e => { if (isPrep() && e.target.matches('[data-ximp]') && e.target.files[0]) { importSales(e.target.files[0]); e.target.value = ''; } });
document.addEventListener('paste', e => { if (e.target && e.target.id === 'x-in') setTimeout(() => addText(e.target.value), 0); });

/* ---------- route ---------- */
routes.prep = vPrep;
const prevHook = window.onRoute;
window.onRoute = (name, arg) => {
  if (prevHook) prevHook(name, arg);
  clearInterval(PR.poll);
  if (name !== 'prep') return;
  loadCat(); pullOrders(); loadSales();
  PR.poll = setInterval(() => { if (document.visibilityState === 'visible') pullOrders(); }, 15000);
  /* link from the order email: #prep/add=<order text in base64> */
  if (arg && arg.indexOf('add=') === 0) {
    try { let s64 = arg.slice(4).replace(/-/g, '+').replace(/_/g, '/'); while (s64.length % 4) s64 += '='; history.replaceState(null, '', location.pathname + '#prep'); addText(decodeURIComponent(escape(atob(s64)))); } catch (er) {}
  }
};

/* ---------- styles ---------- */
const RC_CSS = `.rcp{font-family:'Readex Pro',Arial,sans-serif;color:#000;font-size:11pt;line-height:1.5;padding:14mm}
.rcp table{width:100%;border-collapse:collapse;margin:10px 0}.rcp th{text-align:start;border-bottom:1px solid #000;padding:6px 4px;font-size:10pt}.rcp td{padding:6px 4px;border-bottom:1px solid #ddd;vertical-align:top}
.rcp .n{text-align:end;white-space:nowrap;direction:ltr}.rc-hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:8px}.rc-hd img{height:54px}
.rc-r{display:flex;justify-content:space-between;gap:8px}.rc-big{font-weight:700;font-size:13pt;border-top:2px solid #000;margin-top:6px;padding-top:6px}.rc-end{text-align:center;margin-top:14px;font-size:9.5pt}.rc-g{margin:6px 0;font-weight:600}
.bc h2{margin:0 0 4px;font-size:18pt}.rc-sum{margin-top:8px;font-weight:700;text-align:right}.rc-sign{display:flex;justify-content:space-between;gap:20px;margin-top:28px}.rc-sign div{flex:1;border-top:1px solid #000;padding-top:4px;font-size:9pt}`;
const css = document.createElement('style');
css.textContent = `
.xs{background:var(--cb,var(--bg));border-radius:16px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}.xs span{font-size:12.5px;color:var(--c,var(--grey));display:flex;align-items:center;gap:4px;font-weight:600}.xs i{font-style:normal}.xs b{font:500 21px var(--d);color:var(--navy)}.xs small{font-size:11px;color:var(--grey)}
.xpaste{display:flex;flex-direction:column;gap:10px;background:linear-gradient(180deg,#fff,#FFFBEB)}.xpaste textarea{border-style:dashed;border-color:#E9D9A6;background:#fff}
.xo{background:#fff;border-radius:22px;box-shadow:var(--sh);overflow:hidden;border:1px solid rgba(236,229,216,.75)}
.xo.open{box-shadow:0 2px 4px rgba(31,41,55,.05),0 16px 40px rgba(31,41,55,.13)}
.xh{width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--os);border:0;text-align:start;min-height:64px;border-bottom:3px solid var(--oc)}
.xo:not(.open) .xh{border-bottom:0;border-inline-start:5px solid var(--oc)}
.xn{flex:none;width:36px;height:36px;border-radius:18px;background:var(--oc);color:#1F2937;font:600 15px var(--d);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(31,41,55,.15)}
.xw{flex:1;min-width:0;font-weight:600;font-size:16px;display:flex;flex-direction:column}.xw small{font-weight:400;font-size:12px;color:var(--grey);line-height:1.5}
.xst{flex:none;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;background:#fff;box-shadow:0 1px 3px rgba(31,41,55,.1)}.xst.rd{background:#16A34A;color:#fff}.xst.sold{background:var(--navy);color:var(--yel)}
.xchev{flex:none;color:var(--grey);transition:transform .15s}.xo.open .xchev{transform:rotate(180deg)}
.xb{padding:12px;display:flex;flex-direction:column;gap:10px}
.xc{background:var(--bg);border-radius:16px;padding:10px 12px;font-size:14px;display:flex;flex-direction:column;gap:4px;align-items:flex-start}
.xphb{display:inline-flex;align-items:center;gap:8px;border:0;background:#fff;box-shadow:var(--sh);border-radius:12px;min-height:40px;padding:0 12px;font-weight:600}.xphb small{color:var(--goldt);font-weight:500}
.xp{display:flex;flex-direction:column;gap:8px;border-radius:18px;padding:10px;background:#fff;border:1px solid #EFE8DB;box-shadow:0 1px 2px rgba(31,41,55,.04);transition:background .15s}
.xp.done{background:#F0FDF4;border-color:#BBF7D0}.xp.off{opacity:.6;background:#FAFAF9}.xp.bad{background:var(--redbg);color:var(--red);border-color:#FECDCA}
.xr1{display:flex;gap:10px;align-items:flex-start}.xr2{display:flex;align-items:center;gap:6px;flex-wrap:wrap;border-top:1px dashed #EFE8DB;padding-top:8px}
.ximg{flex:none;width:72px;height:72px;border-radius:14px;background:#F6F3ED center/contain no-repeat;position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.04)}.ximg.sm{width:44px;height:44px;border-radius:10px}
.xq{position:absolute;bottom:-6px;inset-inline-end:-6px;background:var(--navy);color:var(--yel);font:600 13px var(--d);padding:1px 8px;border-radius:10px;box-shadow:0 3px 8px rgba(31,41,55,.3)}
.xi{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}.xbr{font-size:12px;color:var(--grey)}.xt{font-size:14.5px;font-weight:600;line-height:1.4}.xpr{font-size:13.5px;color:var(--navy)}.xm{font-size:11px;color:#9CA3AF}
.xstep{display:inline-flex;align-items:center;border-radius:22px;direction:ltr;background:var(--bg)}.xstep button{width:40px;height:40px;border:0;background:none;font-size:20px}.xstep button:disabled{opacity:.3}.xstep b{min-width:22px;text-align:center;font-family:var(--d)}
.xoff{flex:none;width:40px;height:40px;border-radius:20px;border:0;background:var(--redbg);color:var(--red);display:inline-flex;align-items:center;justify-content:center}
.xoffn{color:var(--red);font-size:13px;font-weight:600}
.xtk{flex:none;height:44px;padding:0 16px;border-radius:22px;border:2px solid #D8CFBE;background:#fff;display:inline-flex;align-items:center;gap:6px;font-weight:600;color:#9CA3AF;transition:all .15s}
.xp.done .xtk{background:#16A34A;border-color:#16A34A;color:#fff;box-shadow:0 4px 12px rgba(22,163,74,.35)}
.tag{font-size:10.5px;font-weight:600;padding:1px 7px;border-radius:8px;background:var(--bluebg);color:var(--blue)}.tag.g{background:var(--greenbg);color:var(--green)}
.xfree{display:flex;gap:8px;align-items:center;background:var(--greenbg);color:var(--green);border-radius:14px;padding:6px 6px 6px 12px;font-size:14px;font-weight:600}
.xaddbox,.xfreebox{display:flex;flex-direction:column;gap:8px}.xaddbox[hidden],.xfreebox[hidden]{display:none}
.xra{display:flex;align-items:center;gap:10px;width:100%;border:0;background:#fff;box-shadow:var(--sh);border-radius:14px;padding:6px 10px;min-height:56px}.xra small{display:block;color:var(--grey);font-size:11.5px}.xra span span{font-size:14px}
.xbt{display:flex;flex-wrap:wrap;gap:8px}.xbt>.btn{flex:1 1 auto}.xwrap{flex-wrap:wrap;overflow:visible}
.xco{background:linear-gradient(180deg,#FBF8F2,#F6F1E7);border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:10px}
.xcl{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600}.xin{width:92px;height:44px;flex:none;text-align:center}
.xdv{color:#16A34A;font-size:13px;text-align:end;margin-top:-6px}.xdv:empty{display:none}
.xpay{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.xpay .pill{padding:0 4px;font-size:13px}
.xtot{display:flex;justify-content:space-between;align-items:center;background:radial-gradient(130% 160% at 100% 0%,#33445C,#1F2937 60%);color:#fff;border-radius:16px;padding:14px 16px;font:600 17px var(--d);box-shadow:0 8px 20px rgba(17,24,39,.25)}.xtot b{color:var(--yel);font-weight:500;font-size:23px}
.xact{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.xa{border:0;background:#fff;border-radius:16px;box-shadow:var(--sh);padding:10px 4px;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12.5px;font-weight:600;min-height:84px;color:var(--navy)}
.xai{width:42px;height:42px;border-radius:14px;background:var(--cb);color:var(--c);display:flex;align-items:center;justify-content:center}
.xdo{display:grid;grid-template-columns:1fr 1fr;gap:8px}.xdo .btn{padding:0 8px;min-height:52px}
.xrm{align-self:center;border:0;background:none;color:var(--red);font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:0 12px}
#x-print{display:none}
@media print{body>*:not(#x-print){display:none!important}#x-print{display:block!important}@page{size:A4 portrait;margin:0}}
${RC_CSS}`;
document.head.appendChild(css);

/* ---------- demo backend (no Google connected) ---------- */
if (typeof DEMO !== 'undefined' && DEMO) {
  const DC = { cat: {
    SM261002: { t: 'CeraVe Crème Hydratante 340g', b: 'CeraVe', p: 290000, bc: '3337875597388', sc: 'L0001', i: '' },
    SM261003: { t: 'La Roche-Posay Cicaplast Baume B5+ 40ml', b: 'La Roche-Posay', p: 180000, bc: '3337875831390', sc: 'L0002', i: '' },
    SM261004: { t: 'Bioderma Sensibio H2O 250ml', b: 'Bioderma', p: 150000, bc: '3401345935571', sc: 'B0101', i: '' },
    SM261005: { t: 'Avène Cicalfate+ Crème 40ml', b: 'Avène', p: 170000, bc: '3282770204681', sc: 'A0042', i: '' } }, fr: {}, logo: '' };
  let dOrders = [], dSales = [], dn = 0, bn = 0;
  const now = () => new Date().toISOString();
  Object.assign(Demo, {
    catalog() { return JSON.parse(JSON.stringify(DC)); },
    'orders.list'() { return dOrders.filter(o => o.status !== 'removed').map(o => JSON.parse(JSON.stringify(o))); },
    'orders.add'({ items }) { const added = [], dup = []; items.forEach(it => { if ((it.code && dOrders.some(o => o.code === it.code)) || dOrders.some(o => o.key === it.key && o.status !== 'removed')) { dup.push(it.code || it.key); return; } const o = { id: 'o' + Date.now() + Math.random().toString(36).slice(2, 5), key: it.key, code: it.code, text: it.text, st: {}, no: '', status: 'open', at: now(), upAt: now() }; dOrders.push(o); added.push(JSON.parse(JSON.stringify(o))); }); return { added, dup }; },
    'orders.update'({ id, patch }) { const o = dOrders.find(x => x.id === id); mergeSt(o.st, patch); o.upAt = now(); return JSON.parse(JSON.stringify(o)); },
    'orders.remove'({ id }) { dOrders.find(x => x.id === id).status = 'removed'; return true; },
    'orders.clear'() { dOrders.forEach(o => o.status = 'removed'); return true; },
    'orders.number'({ id }) { const o = dOrders.find(x => x.id === id); if (!o.no) { const d = new Date(); o.no = 'S-' + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + String(++dn).padStart(2, '0'); } return { no: o.no }; },
    'orders.sell'({ id, sale }) { const o = dOrders.find(x => x.id === id); this['orders.number']({ id }); o.status = 'sold'; const s = { ...sale, id, no: o.no, at: now(), soldBy: 'u1', file: '' }; dSales = dSales.filter(x => x.id !== id).concat([s]); return { order: JSON.parse(JSON.stringify(o)), file: '' }; },
    'sales.list'() { return dSales.slice(); },
    'sales.delete'({ id }) { dSales = dSales.filter(x => x.id !== id); const o = dOrders.find(x => x.id === id); if (o && o.status === 'sold') o.status = 'open'; return true; },
    'bc.next'() { const d = new Date(); return { no: 'BC-' + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + String(++bn).padStart(2, '0') }; },
    'bc.archive'() { return { file: '' }; },
    'sales.import'({ sales }) { let added = 0, skipped = 0; sales.forEach(x => { if (dSales.some(s => s.no === x.no)) { skipped++; return; } dSales.push({ ...x, id: 'imp-' + x.no + '-' + x.at, pay: '', soldBy: 'u1', file: '' }); added++; }); return { added, skipped }; }
  });
}
})();
