/* samarHive · step 4 — Accounting (المحاسبة), managers only.
   Sales come from the Preparation sales log (Sheet «Sales»); expenses, other income, transfers and
   opening balances are entered here (Sheet «Money»). Receipt photos go to Drive › samarHive › Expenses › YYYY-MM.
   Uses the helpers of index.html (S, t, ic, esc, api, toast, ask, fail, store, hdr, routes, go, isMgr, dayKey, Demo…). */
'use strict';
(() => {
const AL = {
ar: { acct: 'المحاسبة', mgr_only: 'للمديرين فقط', sum: 'الملخص', log: 'الدفتر', net: 'صافي النتيجة', vs_prev: 'عن الشهر الماضي', sales: 'المبيعات', stock: 'مشتريات البضاعة',
  exps: 'المصاريف', other_in: 'دخل آخر', net_note: 'ما دخل ناقص ما خرج هذا الشهر. بعد خطوة المخزون نحسب تكلفة البضاعة المباعة بدقة.', balances: 'الأرصدة الآن', total: 'المجموع',
  opening: 'رصيد البداية', transfer: 'تحويل', by_cat: 'المصاريف حسب النوع', no_exp: 'لا مصاريف مسجّلة هذا الشهر.', all: 'الكل', cash: 'نقدًا',
  sale: 'بيع', today: 'اليوم', yesterday: 'أمس', empty_log: 'لا حركات في هذا الشهر.', auto_note: 'المبيعات تأتي تلقائيًا من التجهيز · المصاريف تُضاف هنا',
  new_exp: 'مصروف جديد', edit: 'تعديل الحركة', k_exp: 'مصروف', k_inc: 'دخل', k_tr: 'تحويل', amount: 'المبلغ', ouguiya: 'أوقية', type: 'النوع', paid_from: 'دُفع من', paid_to: 'دخل إلى',
  from: 'من', to: 'إلى', date: 'التاريخ', note: 'ملاحظة', note_ph: 'مثال: إعلان فيسبوك · حملة الشتاء', photo: 'صورة الإيصال', photo_view: 'عرض الصورة', photo_change: 'تغيير الصورة',
  save: 'حفظ', del: 'حذف', del_q: 'حذف هذه الحركة؟', saved: 'تم الحفظ', deleted: 'حُذفت', need_amount: 'أدخل المبلغ', same_acc: 'اختر حسابين مختلفين',
  open_t: 'رصيد البداية', open_s: 'كم كان في كل حساب يوم بدء استعمال التطبيق؟ المبيعات والمصاريف بعد هذا التاريخ تُحسب تلقائيًا.', open_date: 'تاريخ البداية',
  excel: 'Excel الشهر', h_out: 'المصاريف', h_bal: 'في الحسابات', no_rows: 'لا شيء لتنزيله', loading: 'جارٍ التحميل…', not_counted: 'لا يدخل في الربح', tr_word: 'تحويل',
  c_stock: 'مشتريات البضاعة', c_ads: 'الإعلانات', c_delivery: 'التوصيل', c_salary: 'الرواتب', c_pack: 'التغليف', c_rent: 'الإيجار', c_fees: 'رسوم بنكية', c_owner: 'سحب المالك', c_other: 'أخرى',
  c_refund: 'استرجاع', c_capital: 'إيداع رأس مال', c_misc: 'دخل آخر' },
fr: { acct: 'Compta', mgr_only: 'Gérants uniquement', sum: 'Résumé', log: 'Journal', net: 'Résultat net', vs_prev: 'vs mois dernier', sales: 'Ventes', stock: 'Achats marchandise',
  exps: 'Dépenses', other_in: 'Autres entrées', net_note: 'Entrées moins sorties du mois. Avec l’étape Stock, on calculera le coût exact des produits vendus.', balances: 'Soldes actuels', total: 'Total',
  opening: 'Solde initial', transfer: 'Virement', by_cat: 'Dépenses par type', no_exp: 'Aucune dépense ce mois-ci.', all: 'Tous', cash: 'Espèces',
  sale: 'Vente', today: 'Aujourd’hui', yesterday: 'Hier', empty_log: 'Aucun mouvement ce mois-ci.', auto_note: 'Les ventes viennent de la Préparation · les dépenses s’ajoutent ici',
  new_exp: 'Nouvelle dépense', edit: 'Modifier', k_exp: 'Dépense', k_inc: 'Entrée', k_tr: 'Virement', amount: 'Montant', ouguiya: 'MRU', type: 'Type', paid_from: 'Payé depuis', paid_to: 'Reçu sur',
  from: 'De', to: 'Vers', date: 'Date', note: 'Note', note_ph: 'Ex. : pub Facebook · campagne hiver', photo: 'Photo du reçu', photo_view: 'Voir la photo', photo_change: 'Changer la photo',
  save: 'Enregistrer', del: 'Supprimer', del_q: 'Supprimer ce mouvement ?', saved: 'Enregistré', deleted: 'Supprimé', need_amount: 'Saisissez le montant', same_acc: 'Choisissez deux comptes différents',
  open_t: 'Solde initial', open_s: 'Combien y avait-il sur chaque compte le jour du démarrage ? Ventes et dépenses après cette date sont comptées automatiquement.', open_date: 'Date de départ',
  excel: 'Excel du mois', h_out: 'Dépenses', h_bal: 'Sur les comptes', no_rows: 'Rien à télécharger', loading: 'Chargement…', not_counted: 'hors résultat', tr_word: 'Virement',
  c_stock: 'Achats marchandise', c_ads: 'Publicité', c_delivery: 'Livraison', c_salary: 'Salaires', c_pack: 'Emballage', c_rent: 'Loyer', c_fees: 'Frais bancaires', c_owner: 'Retrait gérant', c_other: 'Autre',
  c_refund: 'Remboursement', c_capital: 'Apport en capital', c_misc: 'Autre entrée' }
};
const ta = k => (AL[S.lang] || AL.ar)[k] ?? k;
Object.assign(L.ar, { acct: AL.ar.acct }); Object.assign(L.fr, { acct: AL.fr.acct });
Object.assign(P, {
  wallet: 'M3 7a2 2 0 0 1 2-2h13v4 M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z M16 14.5h.01',
  swap: 'M7 4L3 8l4 4 M3 8h14 M17 20l4-4-4-4 M21 16H7', camera: 'M4 8h3l2-3h6l2 3h3v11H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  minus: 'M5 12h14', calc: 'M5 3h14v18H5z M8 7h8 M8 12h2 M14 12h2 M8 16h2 M14 16h2'
});

const ACC = ['cash', 'bankily', 'masrvi', 'sedad'];
const accName = a => a === 'cash' ? ta('cash') : a.charAt(0).toUpperCase() + a.slice(1);
const ACC_C = { cash: '#16A34A', bankily: '#2563EB', masrvi: '#B45309', sedad: '#7C3AED' };
const EXP = ['stock', 'ads', 'delivery', 'salary', 'pack', 'rent', 'fees', 'owner', 'other'];
const INC = ['refund', 'capital', 'misc'];
const OUT_OF_RESULT = ['owner', 'capital'];   /* owner withdrawals and capital deposits move money but are not profit or loss */
const CAT_C = { stock: '#1F2937', ads: '#FFC800', delivery: '#3B82F6', salary: '#8B5CF6', pack: '#F97316', rent: '#EC4899', fees: '#64748B', owner: '#A8A196', other: '#B98500' };
const num = n => Math.round(n || 0).toLocaleString('en-US');
const ym0 = () => dayKey(new Date()).slice(0, 7);

const AC = { money: store.get('money', null), sales: store.get('acct_sales', null), month: ym0(), tab: 'sum', acc: 'all', kind: 'exp', photo: null, busy: false };

async function load() {
  if (!isMgr()) return;
  try {
    const [m, s] = await Promise.all([api('money.list'), api('sales.list', {})]);
    AC.money = m; AC.sales = s; store.set('money', m); store.set('acct_sales', s);
    if (/^#(acct|money)/.test(location.hash)) { const y = window.scrollY; render(); window.scrollTo(0, y); }
    drawHomeAcct();
  } catch (e) { if (!AC.money) fail(e); }
}

/* ---------- numbers ---------- */
const saleDay = s => s.at ? dayKey(new Date(s.at)) : '';
function monthStats(ym) {
  const sales = (AC.sales || []).filter(s => saleDay(s).slice(0, 7) === ym), mon = (AC.money || []).filter(m => m.date.slice(0, 7) === ym);
  const o = { sales: 0, n: sales.length, stock: 0, exp: 0, inc: 0, cats: {} };
  sales.forEach(s => o.sales += +s.total || 0);
  mon.forEach(m => {
    if (m.kind === 'exp') { o.cats[m.cat] = (o.cats[m.cat] || 0) + m.amount; if (OUT_OF_RESULT.indexOf(m.cat) >= 0) return; if (m.cat === 'stock') o.stock += m.amount; else o.exp += m.amount; }
    if (m.kind === 'inc' && OUT_OF_RESULT.indexOf(m.cat) < 0) o.inc += m.amount;
  });
  o.net = o.sales + o.inc - o.stock - o.exp;
  return o;
}
function balances() {
  const b = { cash: 0, bankily: 0, masrvi: 0, sedad: 0 }, money = AC.money || [];
  const open = money.filter(m => m.kind === 'open'), start = open.length ? open.map(m => m.date).sort()[0] : '';
  open.forEach(m => b[m.acc] += m.amount);
  (AC.sales || []).forEach(s => { if (saleDay(s) >= start) b[ACC.indexOf(s.pay) >= 0 ? s.pay : 'cash'] += +s.total || 0; });
  money.forEach(m => {
    if (m.date < start) return;
    if (m.kind === 'exp') b[m.acc] -= m.amount;
    if (m.kind === 'inc') b[m.acc] += m.amount;
    if (m.kind === 'tr') { b[m.acc] -= m.amount; if (b[m.to] != null) b[m.to] += m.amount; }
  });
  return { b, start };
}
const prevYm = ym => { const [y, m] = ym.split('-').map(Number); return m === 1 ? (y - 1) + '-12' : y + '-' + String(m - 1).padStart(2, '0'); };
const nextYm = ym => { const [y, m] = ym.split('-').map(Number); return m === 12 ? (y + 1) + '-01' : y + '-' + String(m + 1).padStart(2, '0'); };
const ymLabel = ym => { const [y, m] = ym.split('-').map(Number); return t('months')[m - 1] + ' ' + y; };

/* ---------- screens ---------- */
function vAcct() {
  if (!isMgr()) { setTimeout(() => go('home')); return ''; }
  const right = `<button class="ib" data-acm="-1" aria-label="‹">${ic('chev', 20, 'currentColor', 2, 'go fl')}</button><button class="ib" data-acm="1" aria-label="›"${AC.month >= ym0() ? ' disabled' : ''}>${ic('chev', 20, 'currentColor', 2, 'go')}</button>`;
  const tabs = `<div class="seg">${['sum', 'log'].map(k => `<button class="${AC.tab === k ? 'on' : ''}" data-actab="${k}">${ta(k)}</button>`).join('')}</div>`;
  const body = AC.money == null ? `<div class="card empty">${ta('loading')}</div>` : AC.tab === 'sum' ? summary() : journal();
  return hdr(ta('acct'), ymLabel(AC.month) + ' · ' + ta('mgr_only'), `<div class="row" style="gap:6px">${right}</div>`) + `<main class="main" id="acct">${tabs}${body}</main>`;
}

function summary() {
  const s = monthStats(AC.month), p = monthStats(prevYm(AC.month)), pc = p.net ? Math.round((s.net - p.net) / Math.abs(p.net) * 100) : null;
  const { b, start } = balances(), tot = ACC.reduce((a, k) => a + b[k], 0);
  const line = (l, v, sign, c) => `<div class="acl"><span><i style="background:${c}"></i>${l}</span><b dir="ltr">${sign}${num(v)}</b></div>`;
  const cats = EXP.filter(c => s.cats[c]).sort((x, y) => s.cats[y] - s.cats[x]), mx = cats.length ? s.cats[cats[0]] : 1;
  return `<div class="card list">
   <div class="kpi"><div class="grow"><small>${ta('net')} · ${ymLabel(AC.month)}</small><b dir="ltr" style="color:${s.net < 0 ? '#B42318' : 'var(--navy)'}">${s.net < 0 ? '−' : ''}${num(Math.abs(s.net))} <span>MRU</span></b>
    ${pc != null ? `<div class="kpi2"><span class="trend ${pc < 0 ? 'neg' : ''}">${ic(pc < 0 ? 'down' : 'up', 12, 'currentColor', 2.2)}<bdi dir="ltr">${Math.abs(pc)}%</bdi> ${ta('vs_prev')}</span></div>` : ''}</div>
    <span class="acico">${ic('calc', 24)}</span></div>
   <div class="acls">${line(ta('sales') + ` <small>(${s.n})</small>`, s.sales, '+', '#22C55E')}${s.inc ? line(ta('other_in'), s.inc, '+', '#86EFAC') : ''}${line(ta('stock'), s.stock, '−', '#1F2937')}${line(ta('exps'), s.exp, '−', '#F59E0B')}</div>
   <div class="muted acnote">${ta('net_note')}</div></div>

  <div class="h2 row between"><span>${ta('balances')}</span><span class="muted">${ta('total')} <b class="d" dir="ltr" style="color:var(--navy)">${num(tot)}</b></span></div>
  <div class="card" style="display:flex;flex-direction:column;gap:12px">
   <div class="acb">${ACC.map(a => `<button data-acacc="${a}"><span><i style="background:${ACC_C[a]}"></i><bdi>${accName(a)}</bdi></span><b dir="ltr" class="${b[a] < 0 ? 'neg' : ''}">${b[a] < 0 ? '−' : ''}${num(Math.abs(b[a]))}</b></button>`).join('')}</div>
   ${start ? `<div class="muted" style="font-size:12px">${ta('opening')}: <bdi dir="ltr">${start}</bdi></div>` : ''}
   <div class="row"><button class="btn o sm grow" data-acopen>${ic('wallet', 18)}${ta('opening')}</button><button class="btn o sm grow" data-acnew="tr">${ic('swap', 18)}${ta('transfer')}</button></div></div>

  <div class="h2">${ta('by_cat')}</div>
  <div class="card" style="display:flex;flex-direction:column;gap:12px">${cats.length ? cats.map(c => `<div class="acc2"><div class="row between"><span>${ta('c_' + c)}${OUT_OF_RESULT.indexOf(c) >= 0 ? ` <small class="muted">· ${ta('not_counted')}</small>` : ''}</span><b class="d" dir="ltr">${num(s.cats[c])}</b></div><span class="bar8"><i style="width:${Math.max(3, s.cats[c] / mx * 100)}%;background:${CAT_C[c]}"></i></span></div>`).join('') : `<div class="muted" style="text-align:center;padding:8px">${ta('no_exp')}</div>`}</div>`;
}

function entries() {
  const ym = AC.month, out = [];
  (AC.sales || []).forEach(s => { if (saleDay(s).slice(0, 7) === ym) out.push({ t: 'sale', d: saleDay(s), at: s.at, amt: +s.total || 0, acc: ACC.indexOf(s.pay) >= 0 ? s.pay : 'cash', s }); });
  (AC.money || []).forEach(m => { if (m.date.slice(0, 7) === ym) out.push({ t: m.kind, d: m.date, at: m.createdAt, amt: m.amount, acc: m.acc, to: m.to, m }); });
  return out.filter(e => AC.acc === 'all' || e.acc === AC.acc || e.to === AC.acc).sort((a, b) => (b.d + b.at).localeCompare(a.d + a.at));
}
function journal() {
  const list = entries(), days = {};
  list.forEach(e => (days[e.d] = days[e.d] || []).push(e));
  const td = dayKey(new Date()), yd = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); })();
  const dayName = k => { if (k === td) return ta('today'); if (k === yd) return ta('yesterday'); const d = new Date(k + 'T12:00:00'); return t('days')[d.getDay()] + ' ' + d.getDate(); };
  const sign = e => e.t === 'exp' ? -1 : e.t === 'tr' ? (AC.acc === 'all' ? 0 : e.acc === AC.acc ? -1 : 1) : 1;
  const who = id => (userById(id) || {}).name || '';
  const row = e => {
    const sg = sign(e), m = e.m;
    let title, meta, icn, cls;
    if (e.t === 'sale') { title = `${ta('sale')} · <bdi dir="ltr">${esc(e.s.no)}</bdi>${e.s.name ? ' · ' + esc(e.s.name) : ''}`; meta = `<bdi>${accName(e.acc)}</bdi>${who(e.s.soldBy) ? ' · ' + esc(who(e.s.soldBy)) : ''}`; icn = 'plus'; cls = 'in'; }
    else if (e.t === 'tr') { title = ta('tr_word') + (m.note ? ' · ' + esc(m.note) : ''); meta = `<bdi>${accName(m.acc)}</bdi> ← <bdi>${accName(m.to)}</bdi>`.replace('←', S.lang === 'ar' ? '←' : '→'); icn = 'swap'; cls = 'tr'; }
    else if (e.t === 'open') { title = ta('opening'); meta = `<bdi>${accName(m.acc)}</bdi>`; icn = 'wallet'; cls = 'tr'; }
    else { title = esc(m.note || ta('c_' + m.cat)); meta = `${ta('c_' + m.cat)} · <bdi>${accName(m.acc)}</bdi>${who(m.by) ? ' · ' + esc(who(m.by)) : ''}${m.file ? ' · ' + ic('camera', 13) : ''}`; icn = e.t === 'exp' ? 'minus' : 'plus'; cls = e.t === 'exp' ? 'out' : 'in'; }
    const tag = m && e.t !== 'open' ? `button data-acedit="${m.id}"` : e.t === 'open' ? 'button data-acopen' : 'div';
    return `<${tag} class="lrow acr"><span class="aci ${cls}">${ic(icn, 18, 'currentColor', 2.2)}</span><span class="lr-t"><b>${title}</b><small>${meta}</small></span><b class="amt ${sg < 0 ? 'neg' : sg > 0 ? 'pos' : ''}" dir="ltr">${sg < 0 ? '−' : sg > 0 ? '+' : ''}${num(e.amt)}</b></${tag.split(' ')[0]}>`;
  };
  const pills = `<div class="pills">${['all'].concat(ACC).map(a => `<button class="pill${AC.acc === a ? ' on' : ''}" data-acf="${a}">${a === 'all' ? ta('all') : `<bdi>${accName(a)}</bdi>`}</button>`).join('')}</div>`;
  const body = Object.keys(days).map(k => { const tot = days[k].reduce((a, e) => a + sign(e) * e.amt, 0); return `<div class="acday"><span>${dayName(k)}</span><b dir="ltr" class="${tot < 0 ? 'neg' : ''}">${tot > 0 ? '+' : tot < 0 ? '−' : ''}${num(Math.abs(tot))}</b></div><div class="card list">${days[k].map(row).join('')}</div>`; }).join('');
  return pills + (body || `<div class="card empty">${ta('empty_log')}</div>`) + `<div class="muted" style="text-align:center;font-size:12px">${ta('auto_note')}</div><button class="btn o" data-acxls>${ic('download', 18)}${ta('excel')}</button>`;
}

/* ---------- form: expense / income / transfer ---------- */
function vMoney(arg) {
  if (!isMgr()) { setTimeout(() => go('home')); return ''; }
  if (arg === 'open') return vOpening();
  const m = arg && arg !== 'new' && arg !== 'tr' ? (AC.money || []).find(x => x.id === arg) : null;
  if (!AC.draft || AC.draft.for !== (arg || 'new')) {
    AC.photo = null;
    AC.draft = m ? Object.assign({ for: arg }, m) : { for: arg || 'new', kind: arg === 'tr' ? 'tr' : 'exp', amount: '', cat: 'stock', acc: 'cash', to: 'bankily', date: dayKey(new Date()), note: '' };
  }
  const d = AC.draft, cats = d.kind === 'exp' ? EXP : d.kind === 'inc' ? INC : [];
  if (cats.length && cats.indexOf(d.cat) < 0) d.cat = cats[0];
  const accPills = (k, label) => `<div class="lbl2">${label}</div><div class="pills acpay">${ACC.map(a => `<button class="pill${d[k] === a ? ' on' : ''}" data-acset="${k}:${a}"><bdi>${accName(a)}</bdi></button>`).join('')}</div>`;
  return hdr(m ? ta('edit') : d.kind === 'tr' ? ta('transfer') : d.kind === 'inc' ? ta('k_inc') : ta('new_exp'), '', '', 'acct') + `<main class="main" id="money">
   ${m ? '' : `<div class="seg">${['exp', 'inc', 'tr'].map(k => `<button class="${d.kind === k ? 'on' : ''}" data-ackind="${k}">${ta('k_' + k)}</button>`).join('')}</div>`}
   <label class="card acamt"><small>${ta('amount')}</small><span><input id="ac-amt" type="text" inputmode="decimal" dir="ltr" placeholder="0" value="${d.amount ? num(d.amount).replace(/,/g, ' ') : ''}" autocomplete="off"><em>MRU</em></span></label>
   ${cats.length ? `<div class="lbl2">${ta('type')}</div><div class="accats">${cats.map(c => `<button class="${d.cat === c ? 'on' : ''}" data-acset="cat:${c}">${ta('c_' + c)}</button>`).join('')}</div>` : ''}
   ${d.kind === 'tr' ? accPills('acc', ta('from')) + accPills('to', ta('to')) : accPills('acc', d.kind === 'exp' ? ta('paid_from') : ta('paid_to'))}
   <div class="row" style="gap:8px;align-items:stretch">
    <label class="f grow">${ta('date')}<input class="inp" type="date" id="ac-date" value="${esc(d.date)}" max="${dayKey(new Date())}"></label>
   </div>
   <label class="f">${ta('note')}<input class="inp" id="ac-note" type="text" maxlength="300" value="${esc(d.note || '')}" placeholder="${ta('note_ph')}"></label>
   ${d.kind === 'tr' ? '' : `<div class="row" style="gap:8px"><label class="btn o grow acph">${ic('camera', 18)}<span>${AC.photo ? '✓ ' + ta('photo') : d.file ? ta('photo_change') : ta('photo')}</span><input type="file" accept="image/*" capture="environment" data-acphoto hidden></label>${d.file ? `<a class="btn o" href="${esc(d.file)}" target="_blank" rel="noopener">${ta('photo_view')}</a>` : ''}</div>`}
   <button class="btn big" data-acsave>${ic('check', 20, '#FFC800', 2.4)}${ta('save')}</button>
   ${m ? `<button class="xrm" data-acdel="${m.id}" style="align-self:center">${ic('trash', 16)}${ta('del')}</button>` : ''}
  </main>`;
}
function vOpening() {
  const { b } = balances(), open = (AC.money || []).filter(m => m.kind === 'open'), v = {}; open.forEach(m => v[m.acc] = m.amount);
  const date = open.length ? open[0].date : dayKey(new Date());
  return hdr(ta('open_t'), '', '', 'acct') + `<main class="main" id="money">
   <div class="muted">${ta('open_s')}</div>
   <div class="card list">${ACC.map(a => `<label class="lrow"><span class="aci" style="color:${ACC_C[a]};background:${ACC_C[a]}14">${ic('wallet', 18)}</span><span class="lr-t"><b><bdi>${accName(a)}</bdi></b></span><input class="inp acopin" data-acop="${a}" type="text" inputmode="decimal" dir="ltr" placeholder="0" value="${v[a] ? num(v[a]).replace(/,/g, ' ') : ''}"></label>`).join('')}</div>
   <label class="f">${ta('open_date')}<input class="inp" type="date" id="ac-odate" value="${date}" max="${dayKey(new Date())}"></label>
   <button class="btn big" data-acopsave>${ic('check', 20, '#FFC800', 2.4)}${ta('save')}</button></main>`;
}
const readNum = s => +String(s || '').replace(/[\s,]/g, '').replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)) || 0;
function keepDraft() {
  const d = AC.draft; if (!d) return;
  const a = document.getElementById('ac-amt'), dt = document.getElementById('ac-date'), n = document.getElementById('ac-note');
  if (a) d.amount = readNum(a.value); if (dt) d.date = dt.value || d.date; if (n) d.note = n.value;
}
async function photoB64(file) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  const k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas');
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(img.src); return c.toDataURL('image/jpeg', .72).split(',')[1];
}

/* ---------- Excel (UTF-16 TSV, opens in Excel with Arabic) ---------- */
function xls() {
  const list = entries().slice().reverse(); if (!list.length) { toast(ta('no_rows')); return; }
  const clean = v => String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' ');
  const head = ['Date', 'Type', 'Category', 'Description', 'Account', 'To account', 'In', 'Out', 'By', 'Photo'];
  const rows = list.map(e => { const m = e.m || {}, s = e.s || {};
    const type = e.t === 'sale' ? 'Sale' : e.t === 'exp' ? 'Expense' : e.t === 'inc' ? 'Income' : e.t === 'tr' ? 'Transfer' : 'Opening';
    const inn = e.t === 'sale' || e.t === 'inc' || e.t === 'open' ? e.amt : '', out = e.t === 'exp' ? e.amt : '';
    return [e.d, type, m.cat ? ta('c_' + m.cat) : '', e.t === 'sale' ? s.no + ' ' + (s.name || '') : m.note, accName(e.acc), e.to ? accName(e.to) : '', inn, out || (e.t === 'tr' ? e.amt : ''), (userById(m.by || s.soldBy) || {}).name || '', m.file || s.file || ''].map(clean).join('\t'); });
  const text = '﻿' + [head.join('\t')].concat(rows).join('\r\n'), buf = new Uint8Array(text.length * 2);
  for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); buf[i * 2] = c & 255; buf[i * 2 + 1] = c >> 8; }
  const blob = new Blob([buf], { type: 'text/csv;charset=utf-16le' }), name = 'samar-compta-' + AC.month + '.csv';
  if (window.SamarHive && window.SamarHive.saveFile) { const r = new FileReader(); r.onload = () => window.SamarHive.saveFile(String(r.result).split(',')[1], name, blob.type); r.readAsDataURL(blob); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* ---------- actions ---------- */
const inAcct = () => !!document.querySelector('#acct,#money');
document.addEventListener('change', async e => {
  if (!e.target.matches('[data-acphoto]') || !e.target.files[0]) return;
  try { AC.photo = await photoB64(e.target.files[0]); keepDraft(); render(); } catch (er) { fail(er); }
});
document.addEventListener('click', async e => {
  const el = e.target.closest('button,a,label'); if (!el || !inAcct()) return;
  const ds = el.dataset;
  if (ds.actab) { AC.tab = ds.actab; return render(); }
  if (ds.acm) { const n = ds.acm === '1' ? nextYm(AC.month) : prevYm(AC.month); if (n <= ym0()) { AC.month = n; render(); } return; }
  if (ds.acf) { AC.acc = ds.acf; return render(); }
  if (ds.acacc) { AC.acc = ds.acacc; AC.tab = 'log'; return render(); }
  if ('acopen' in ds) return go('money/open');
  if (ds.acnew) { AC.draft = null; return go('money/' + ds.acnew); }
  if (ds.acedit) { AC.draft = null; return go('money/' + ds.acedit); }
  if ('acxls' in ds) return xls();
  if (ds.ackind) { keepDraft(); AC.draft.kind = ds.ackind; return render(); }
  if (ds.acset) { keepDraft(); const [k, v] = ds.acset.split(':'); AC.draft[k] = v; return render(); }
  if ('acsave' in ds) {
    keepDraft(); const d = AC.draft;
    if (!(d.amount > 0)) { toast(ta('need_amount')); document.getElementById('ac-amt').focus(); return; }
    if (d.kind === 'tr' && d.acc === d.to) { toast(ta('same_acc')); return; }
    if (AC.busy) return; AC.busy = true; el.classList.add('busy');
    try {
      const r = await api('money.save', { entry: { id: d.id, kind: d.kind, cat: d.cat, amount: d.amount, acc: d.acc, to: d.to, date: d.date, note: d.note }, photo: AC.photo || undefined });
      AC.money = (AC.money || []).filter(x => x.id !== r.id).concat([r]); store.set('money', AC.money);
      AC.draft = null; AC.photo = null; AC.month = r.date.slice(0, 7); AC.tab = 'log'; toast('✓ ' + ta('saved')); go('acct');
    } catch (er) { fail(er); } finally { AC.busy = false; el.classList.remove('busy'); }
    return;
  }
  if (ds.acdel) {
    if (!(await ask(ta('del_q'), ta('del')))) return;
    try { await api('money.delete', { id: ds.acdel }); AC.money = AC.money.filter(x => x.id !== ds.acdel); store.set('money', AC.money); AC.draft = null; toast(ta('deleted')); go('acct'); } catch (er) { fail(er); }
    return;
  }
  if ('acopsave' in ds) {
    const values = {}; document.querySelectorAll('[data-acop]').forEach(i => values[i.dataset.acop] = readNum(i.value));
    if (AC.busy) return; AC.busy = true; el.classList.add('busy');
    try {
      const r = await api('money.opening', { values, date: document.getElementById('ac-odate').value });
      AC.money = (AC.money || []).filter(x => x.kind !== 'open').concat(r); store.set('money', AC.money); toast('✓ ' + ta('saved')); AC.tab = 'sum'; go('acct');
    } catch (er) { fail(er); } finally { AC.busy = false; el.classList.remove('busy'); }
  }
});
/* amount: group thousands while typing */
document.addEventListener('input', e => {
  if (!e.target.matches('#ac-amt,.acopin')) return;
  const n = readNum(e.target.value); e.target.value = n ? n.toLocaleString('en-US').replace(/,/g, ' ') : '';
});

/* ---------- summary on the Home page (managers) ---------- */
function homeAcct() {
  if (!isMgr() || AC.money == null) return '';
  const s = monthStats(ym0()), { b } = balances(), tot = ACC.reduce((x, k) => x + b[k], 0);
  const cell = (v, l, c, neg) => `<a href="#acct"><b dir="ltr" class="${neg ? 'neg' : ''}">${neg ? '−' : ''}${num(Math.abs(v))}</b><span><i style="background:${c}"></i>${l}</span></a>`;
  return `<div class="h2 row between"><span>${ta('acct')} · ${t('months')[+ym0().slice(5) - 1]}</span><a href="#acct" class="xhl">${ta('sum')} ${ic('chev', 16, 'currentColor', 2, 'go')}</a></div>
  <div class="card list"><div class="tri">${cell(s.net, ta('net'), s.net < 0 ? '#B42318' : '#22C55E', s.net < 0)}${cell(s.stock + s.exp, ta('h_out'), '#F59E0B')}${cell(tot, ta('h_bal'), '#2563EB', tot < 0)}</div>
  <div class="acmini">${ACC.filter(k => b[k]).map(k => `<span><i style="background:${ACC_C[k]}"></i><bdi>${accName(k)}</bdi> <b dir="ltr" class="${b[k] < 0 ? 'neg' : ''}">${b[k] < 0 ? '−' : ''}${num(Math.abs(b[k]))}</b></span>`).join('')}</div></div>`;
}
window.acctHome = () => { try { return homeAcct(); } catch (e) { return ''; } };
const drawHomeAcct = () => { const el = document.getElementById('x-acct'); if (el) el.innerHTML = window.acctHome(); };

/* ---------- route ---------- */
routes.acct = vAcct; routes.money = vMoney;
window.acctNew = () => { AC.draft = null; go('money/new'); };
const prevHook = window.onRoute;
window.onRoute = (name, arg) => {
  if (prevHook) prevHook(name, arg);
  if (name === 'acct' || name === 'home' || name === '') load();
  if (name === 'money' && AC.money == null) load();
  if (name === 'money' && arg === 'new') setTimeout(() => { const a = document.getElementById('ac-amt'); if (a && !a.value) a.focus(); }, 80);
};

/* ---------- styles ---------- */
const css = document.createElement('style');
css.textContent = `
.acmini{display:flex;flex-wrap:wrap;gap:6px 14px;padding:10px 16px 12px;border-top:1px solid var(--hair);font-size:12px;color:var(--grey)}.acmini span{display:inline-flex;align-items:center;gap:5px}.acmini i{width:7px;height:7px;border-radius:50%}.acmini b{font:600 12.5px var(--d);color:var(--navy)}.acmini:empty{display:none}
.tri a b.neg{color:#B42318}
.fl{transform:rotate(90deg)}[dir=rtl] .fl{transform:rotate(-90deg)}
.top .ib:disabled{opacity:.35}
.acico{flex:none;width:48px;height:48px;border-radius:16px;background:#FFF4CC;color:#8A6400;display:flex;align-items:center;justify-content:center;align-self:flex-start}
.acls{border-top:1px solid var(--hair);padding:6px 18px}
.acl{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:14px}.acl+.acl{border-top:1px dashed var(--hair)}
.acl span{display:flex;align-items:center;gap:8px;color:#57534E}.acl small{color:var(--grey)}.acl i{width:8px;height:8px;border-radius:50%}.acl b{font:600 15px var(--d)}
.acnote{font-size:12px;padding:0 18px 14px;line-height:1.6}
.acb{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.acb button{border:1px solid var(--line);background:#FAF8F5;border-radius:16px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;text-align:start;min-height:64px}
.acb span{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--grey)}.acb i{width:8px;height:8px;border-radius:50%}
.acb b{font:600 18px var(--d)}.neg{color:#B42318!important}.pos{color:#15803D}
.acc2{display:flex;flex-direction:column;gap:6px;font-size:13.5px}
.acday{display:flex;justify-content:space-between;font-size:13px;color:var(--grey);font-weight:600;padding:6px 6px 0}.acday b{font-family:var(--d)}
.acr{width:100%;border:0;background:none;text-align:start;font:inherit}
.aci{flex:none;width:38px;height:38px;border-radius:13px;display:flex;align-items:center;justify-content:center}
.aci.in{background:#ECFDF3;color:#15803D}.aci.out{background:#FEF3F2;color:#B42318}.aci.tr{background:#F1ECE3;color:#6B6458}
.acamt{display:flex;flex-direction:column;gap:2px;padding:14px 16px}.acamt small{font-size:13px;color:var(--grey)}
.acamt span{display:flex;align-items:baseline;gap:8px;direction:ltr}.acamt input{border:0;outline:0;background:none;font:600 38px/1.2 var(--d);width:100%;min-width:0;padding:0;color:var(--navy)}.acamt em{font-style:normal;color:var(--gold);font-size:15px}
[dir=rtl] .acamt span{justify-content:flex-end}[dir=rtl] .acamt input{text-align:right}
.lbl2{font-size:14px;font-weight:600;margin:4px 2px -2px}
.accats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.accats button{min-height:46px;border-radius:14px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:500;padding:4px 6px;line-height:1.3}
.accats button.on{background:var(--navy);border-color:var(--navy);color:var(--yel);font-weight:600}
.acpay{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}.acpay .pill{padding:0 4px;font-size:13px}
.acph{cursor:pointer}
.acopin{width:130px;height:44px;text-align:center;flex:none;font-family:var(--d)}
`;
document.head.appendChild(css);

/* ---------- demo backend ---------- */
if (typeof DEMO !== 'undefined' && DEMO) {
  const d0 = dayKey(new Date()), dm = n => { const d = new Date(); d.setDate(d.getDate() - n); return dayKey(d); };
  let dm_ = [
    { id: 'open-cash', date: dm(20), kind: 'open', cat: '', amount: 25000, acc: 'cash', to: '', note: '', file: '', by: 'u1', createdAt: '' },
    { id: 'open-bankily', date: dm(20), kind: 'open', cat: '', amount: 40000, acc: 'bankily', to: '', note: '', file: '', by: 'u1', createdAt: '' },
    { id: 'm1', date: dm(1), kind: 'exp', cat: 'stock', amount: 18000, acc: 'masrvi', to: '', note: 'دفعة للمورّد · BC-1125-01', file: '', by: 'u1', createdAt: '' },
    { id: 'm2', date: d0, kind: 'exp', cat: 'ads', amount: 2500, acc: 'bankily', to: '', note: 'إعلان تيك توك · حملة الشتاء', file: '', by: 'u1', createdAt: '' },
    { id: 'm3', date: dm(2), kind: 'exp', cat: 'delivery', amount: 1200, acc: 'cash', to: '', note: 'توصيل طلبات نواذيبو', file: '', by: 'u1', createdAt: '' },
    { id: 'm4', date: dm(3), kind: 'tr', cat: '', amount: 10000, acc: 'cash', to: 'bankily', note: '', file: '', by: 'u1', createdAt: '' }];
  Object.assign(Demo, {
    'money.list'() { return dm_.map(x => Object.assign({}, x)); },
    'money.save'({ entry }) { const r = Object.assign({}, entry, { id: entry.id || 'm' + Date.now(), date: entry.date || d0, by: 'u1', createdAt: new Date().toISOString(), file: '' }); dm_ = dm_.filter(x => x.id !== r.id).concat([r]); return r; },
    'money.delete'({ id }) { dm_ = dm_.filter(x => x.id !== id); return true; },
    'money.opening'({ values, date }) { dm_ = dm_.filter(x => x.kind !== 'open'); const out = []; ACC.forEach(a => { if (values[a]) { const r = { id: 'open-' + a, date, kind: 'open', cat: '', amount: values[a], acc: a, to: '', note: '', file: '', by: 'u1', createdAt: '' }; dm_.push(r); out.push(r); } }); return out; }
  });
}
})();
