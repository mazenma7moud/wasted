/* ===========================================================
   Wasted — Test page logic
   - 4 case products, 4 frame products
   - Renders into the Frames section and the Cases section
   - Cart (localStorage), checkout, Telegram bot notification
   =========================================================== */

(() => {
  "use strict";

  // ---------- Product catalog ----------
  // 4 product options for frames (size + framed/unframed)
  const FRAME_OPTIONS = [
    { id:"f2030-framed", label:"20×30 cm · Framed",    price:120 },
    { id:"f3040-framed", label:"30×40 cm · Framed",    price:170 },
    { id:"f2030-print",  label:"20×30 cm · Print only", price:20  },
    { id:"f3040-print",  label:"30×40 cm · Print only", price:35  }
  ];

  // 2 product options for cases (Android / iPhone)
  const CASE_OPTIONS = [
    { id:"android", label:"Android", price:150 },
    { id:"iphone",  label:"iPhone",  price:180 }
  ];

  // Exactly 4 frame products
  const FRAMES = [
    { id:"fr1", title:"She's Art",         art:"frame1.jpg",     palette:"#1a1a1a", ink:"#f3ead7" },
    { id:"fr2", title:"Football Is Life",   art:"frame2.jpg", palette:"#1f3a26", ink:"#e7c97a" },
    { id:"fr3", title:"CR7 · The GOAT",     art:"frame3.jpg",      palette:"#2a1a0a", ink:"#e7c97a" },
    { id:"fr4", title:"World Cup 2026",     art:"frame4.jpg",palette:"#1f3a26", ink:"#e7c97a" }
  ];

  // Exactly 4 case products
  const CASES = [
    { id:"cs1", title:"She's Art — Black",  art:"case1.jpg",     palette:"#0d0d0d", ink:"#f3ead7" },
    { id:"cs2", title:"Football Is Life",   art:"case2.jpg", palette:"#1f3a26", ink:"#e7c97a" },
    { id:"cs3", title:"CR7",                art:"case3.jpg",            palette:"#2a1a0a", ink:"#e7c97a" },
    { id:"cs4", title:"World Cup 2026",     art:"case4.jpg",palette:"#1f3a26", ink:"#e7c97a" }
  ];

  // ---------- State ----------
  const CART_KEY = "wasted_cart_v1";
  const state = { cart: loadCart() };

  // ---------- Utilities ----------
  const $  = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));
  const fmt = n => `${n} EGP`;
  const uid = () => Math.random().toString(36).slice(2,10);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }
  function saveCart(){
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
    renderCart();
  }

  // ---------- Render product grids ----------
  function renderCases(){
    const root = $("#casesGrid");
    root.innerHTML = CASES.map(p => productCard(p, "case")).join("");
    bindProductEvents(root, "case");
  }

  function renderFrames(){
    const root = $("#framesGrid");
    root.innerHTML = FRAMES.map(p => productCard(p, "frame")).join("");
    bindProductEvents(root, "frame");
  }

  function productCard(p, type){
    const opts = type === "frame" ? FRAME_OPTIONS : CASE_OPTIONS;
    const optsHTML = opts.map((o,i)=>`<option value="${o.id}" data-price="${o.price}" ${i===0?"selected":""}>${o.label} · ${o.price} EGP</option>`).join("");
    const artClass = type === "frame" ? "product__art--frame" : "product__art--case";
    const art = `<div class="product__art"><div class="${artClass}" style="background:${p.palette};color:${p.ink};"><img src="${escapeHTML(p.art)}" alt="${escapeHTML(p.title)}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;"></div></div>`;
    const label = type === "frame" ? "Size" : "Phone";
    return `
      <article class="product" data-pid="${p.id}" data-ptype="${type}">
        ${art}
        <div class="product__body">
          <h4 class="product__title">${escapeHTML(p.title)}</h4>
          <div class="product__opts">
            <label>${label}
              <select class="opt-select">${optsHTML}</select>
            </label>
          </div>
          <div class="product__price"><span class="price">${opts[0].price} EGP</span></div>
          <button class="btn btn--solid product__add">Add to cart</button>
        </div>
      </article>
    `;
  }

  function bindProductEvents(root, type){
    $$(".product", root).forEach(card => {
      const pid = card.dataset.pid;
      const select = $(".opt-select", card);
      const priceEl = $(".price", card);
      const addBtn  = $(".product__add", card);

      select.addEventListener("change", () => {
        const o = select.selectedOptions[0];
        priceEl.textContent = `${o.dataset.price} EGP`;
      });

      addBtn.addEventListener("click", () => {
        const o = select.selectedOptions[0];
        const base = type === "frame" ? FRAMES : CASES;
        const prod = base.find(x => x.id === pid);
        state.cart.push({
          uid: uid(),
          type,
          id: pid,
          title: prod.title,
          option: o.text,
          price: Number(o.dataset.price),
          qty: 1
        });
        saveCart();
        toast(`Added to cart · ${prod.title}`);
      });
    });
  }

  // ---------- Cart drawer ----------
  function renderCart(){
    $("#cartCount").textContent = state.cart.reduce((a,b)=>a+b.qty,0);
    const items = $("#drawerItems");
    if (state.cart.length === 0){
      items.innerHTML = `<div class="empty"><strong>Your cart is empty</strong>Pick a frame or a case to get started.</div>`;
      $("#cartbar").hidden = true;
    } else {
      items.innerHTML = state.cart.map(cartItemHTML).join("");
      $("#cartbar").hidden = false;
      bindCartItemEvents();
    }
    const total = state.cart.reduce((a,b)=>a+b.price*b.qty, 0);
    $("#drawerTotal").textContent = fmt(total);
    updateCartbarMsg(total);
  }

  function updateCartbarMsg(total){
    const msg = total >= 500
      ? "🎉 You unlocked free shipping"
      : `Add ${Math.max(0, 500-total)} EGP more to unlock free shipping`;
    $("#cartbarMsg").textContent = msg;
  }

  function cartItemHTML(it){
    const artBg = it.type === "frame" ? "#fff" : "#0d0d0d";
    const artColor = it.type === "frame" ? "#111" : "#f3ead7";
    const artHTML = `<div class="cart-item__art" style="background:${artBg};color:${artColor};font-family:'Italiana',serif;font-size:14px;line-height:1;text-align:center;">
      ${it.type === "frame" ? "🖼" : "📱"}
    </div>`;
    return `
      <div class="cart-item" data-uid="${it.uid}">
        ${artHTML}
        <div class="cart-item__body">
          <div class="cart-item__title">${escapeHTML(it.title)}</div>
          <div class="cart-item__sub">${escapeHTML(it.option)}</div>
          <div class="cart-item__row">
            <div class="qty">
              <button data-act="dec">−</button>
              <span>${it.qty}</span>
              <button data-act="inc">+</button>
            </div>
            <div><strong>${fmt(it.price*it.qty)}</strong></div>
          </div>
          <button class="cart-item__remove" data-act="rm">Remove</button>
        </div>
      </div>
    `;
  }

  function bindCartItemEvents(){
    $$(".cart-item").forEach(node => {
      const u = node.dataset.uid;
      const item = state.cart.find(x => x.uid === u);
      if (!item) return;
      $('[data-act="inc"]', node).onclick = () => { item.qty++; saveCart(); };
      $('[data-act="dec"]', node).onclick = () => {
        item.qty = Math.max(1, item.qty-1); saveCart();
      };
      $('[data-act="rm"]',  node).onclick = () => {
        state.cart = state.cart.filter(x => x.uid !== u); saveCart();
      };
    });
  }

  // ---------- Drawer / modal helpers ----------
  function openDrawer(){ $("#drawer").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
  function closeDrawer(){ $("#drawer").setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
  function openModal(id){ $("#"+id).setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
  function closeModal(id){ $("#"+id).setAttribute("aria-hidden","true"); document.body.style.overflow=""; }

  // ---------- Toast ----------
  let toastTimer = null;
  function toast(msg){
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.hidden = true, 2200);
  }

  // ---------- Checkout ----------
  function openCheckout(){
    if (state.cart.length === 0){ toast("Your cart is empty"); return; }
    const total = state.cart.reduce((a,b)=>a+b.price*b.qty, 0);
    const lines = state.cart.map(it => `
      <div class="checkout-summary__row">
        <span>${escapeHTML(it.title)} <small style="color:var(--muted)">· ${escapeHTML(it.option)} × ${it.qty}</small></span>
        <span>${fmt(it.price*it.qty)}</span>
      </div>
    `).join("");
    $("#checkoutSummary").innerHTML = `
      ${lines}
      <div class="checkout-summary__row checkout-summary__total">
        <span>Total</span><span>${fmt(total)}</span>
      </div>
    `;
    openModal("checkoutModal");
  }

  function handleCheckoutSubmit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const order = {
      id: "WST-"+Date.now().toString().slice(-7),
      customer: {
        name:    (fd.get("name")    || "").toString().trim(),
        phone:   (fd.get("phone")   || "").toString().trim(),
        email:   (fd.get("email")   || "").toString().trim(),
        address: (fd.get("address") || "").toString().trim(),
        notes:   (fd.get("notes")   || "").toString().trim()
      },
      items: state.cart.map(it => ({
        title: it.title, option: it.option, qty: it.qty, price: it.price,
        subtotal: it.price * it.qty
      })),
      total: state.cart.reduce((a,b)=>a+b.price*b.qty, 0),
      createdAt: new Date().toISOString()
    };

    if (!order.customer.name || !order.customer.phone || !order.customer.address){
      toast("Please fill in name, phone and address");
      return;
    }

    localStorage.setItem("wasted_last_order", JSON.stringify(order));

    sendOrderToTelegram(order)
      .catch(err => console.warn("Telegram notify failed:", err))
      .finally(() => finalizeOrder(order));
  }

  function finalizeOrder(order){
    state.cart = [];
    saveCart();
    closeModal("checkoutModal");
    closeDrawer();
    showSuccess(order);
  }

  function showSuccess(order){
    const t = $("#toast");
    t.textContent = `Order ${order.id} confirmed! We'll be in touch shortly.`;
    t.hidden = false;
    setTimeout(() => t.hidden = true, 4000);
  }

  // ---------- Telegram ----------
  async function sendOrderToTelegram(order){
    const cfg = window.WASTED_CONFIG || {};
    const token = cfg.telegramBotToken || "";
    const chat  = cfg.telegramChatId   || "";
    if (!token || !chat || token.startsWith("REPLACE") || chat.startsWith("REPLACE")){
      console.info("Telegram bot not configured — order kept locally only.");
      return;
    }

    const lines = order.items.map(i => `• ${i.title} (${i.option}) × ${i.qty} = ${i.subtotal} EGP`).join("\n");
    const text =
`🛒 NEW ORDER — ${order.id}
──────────────
👤 ${order.customer.name}
📞 ${order.customer.phone}
${order.customer.email ? "✉️ " + order.customer.email + "\n" : ""}📍 ${order.customer.address}
${order.customer.notes ? "📝 " + order.customer.notes + "\n" : ""}
──────────────
${lines}
──────────────
💰 TOTAL: ${order.total} EGP
🕒 ${new Date(order.createdAt).toLocaleString("en-GB")}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode:"HTML" })
    });
  }

  // ---------- Bindings ----------
  function bindEvents(){
    $("#navCart").addEventListener("click", openDrawer);
    $("#cartbarOpen").addEventListener("click", openDrawer);
    $("#drawerClose").addEventListener("click", closeDrawer);
    $("#drawerScrim").addEventListener("click", closeDrawer);

    $("#checkoutBtn").addEventListener("click", openCheckout);
    $("#checkoutClose").addEventListener("click", () => closeModal("checkoutModal"));
    $("#checkoutScrim").addEventListener("click", () => closeModal("checkoutModal"));
    $("#checkoutForm").addEventListener("submit", handleCheckoutSubmit);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape"){
        closeDrawer();
        closeModal("checkoutModal");
      }
    });

    document.addEventListener("touchmove", e => {
      const open = document.querySelector('.drawer[aria-hidden="false"], .modal[aria-hidden="false"]');
      if (open && !e.target.closest(".drawer__items, .modal__body")) e.preventDefault();
    }, { passive:false });
  }

  // ---------- Init ----------
  function init(){
    renderCases();
    renderFrames();
    renderCart();
    bindEvents();
  }
  document.addEventListener("DOMContentLoaded", init);
})();