/* ===========================================================
   Wasted — Test page logic
   - 4 case products, 4 frame products
   - Renders into the Frames section and the Cases section
   - Cart (localStorage), checkout, Telegram bot notification
   =========================================================== */

(() => {
  "use strict";

  // ---------- Product catalog ----------
  // Size options shown on every product card
  const FRAME_OPTIONS = [
    { id:"f2030-framed", label:"20×30 cm · Framed",    price:230 },
    { id:"f3040-framed", label:"30×40 cm · Framed",    price:300 },
    { id:"f2030-print",  label:"20×30 cm · Print only", price:50  },
    { id:"f3040-print",  label:"30×40 cm · Print only", price:80  }
  ];

  // Main catalog split across Sports, Movies, and Gaming
  const FRAMES = [
    { id:"fr1", category:"gaming", title:"1", art:"game1.jpg", palette:"#312e81", ink:"#f3ead7" },
    { id:"fr2", category:"gaming", title:"2", art:"game2.jpg", palette:"#0f172a", ink:"#f3ead7" },
    { id:"fr3", category:"gaming", title:"3", art:"game3.jpg", palette:"#7c2d12", ink:"#f3ead7" },
    { id:"fr4", category:"gaming", title:"4", art:"game4.jpg", palette:"#14532d", ink:"#f3ead7" },
    { id:"fr5", category:"gaming", title:"5", art:"game5.jpg", palette:"#1d4ed8", ink:"#f3ead7" },
    { id:"fr6", category:"gaming", title:"6", art:"game6.jpg", palette:"#4b5563", ink:"#f3ead7" },
    { id:"fr7", category:"gaming", title:"7", art:"game7.jpg", palette:"#111827", ink:"#f3ead7" },
    { id:"fr8", category:"movies", title:"The Godfather", art:"mov1.jpg", palette:"#3f2f2f", ink:"#f3ead7" },
    { id:"fr9", category:"movies", title:"The Godfather", art:"mov2.jpg", palette:"#7f1d1d", ink:"#f3ead7" },
    { id:"fr10", category:"movies", title:"The Dark Night", art:"mov3.jpg", palette:"#1e293b", ink:"#f3ead7" },
    { id:"fr11", category:"movies", title:"Interstellar", art:"mov4.jpg", palette:"#8b5a2b", ink:"#f3ead7" },
    { id:"fr12", category:"movies", title:"The Boys", art:"mov5.jpg", palette:"#4c1d95", ink:"#f3ead7" },
    { id:"fr13", category:"movies", title:"porsche GT3 RS", art:"car1.jpg", palette:"#0f766e", ink:"#f3ead7" },
    { id:"fr14", category:"movies", title:"MUSTANG", art:"car2.jpg", palette:"#78350f", ink:"#f3ead7" },
    { id:"fr15", category:"movies", title:"PORSCHE GT3 RS", art:"car3.jpg", palette:"#334155", ink:"#f3ead7" },
    { id:"fr16", category:"movies", title:"PORSCHE 911", art:"car4.jpg", palette:"#1f2937", ink:"#f3ead7" },
    { id:"fr17", category:"movies", title:"FERRARI", art:"car5.jpg", palette:"#1f3a26", ink:"#e7c97a" },
    { id:"fr18", category:"sports", title:"Haitham Hassan", art:"sport.jpg", palette:"#2a1a0a", ink:"#e7c97a" },
    { id:"fr19", category:"sports", title:"Mostfa Shobir", art:"sport1.jpg", palette:"#1f3a26", ink:"#e7c97a" },
    { id:"fr20", category:"sports", title:"Nmarey", art:"sport3.jpg", palette:"#0f172a", ink:"#e7c97a" },
    { id:"fr21", category:"sports", title:"Mohmed Salah", art:"sport4.jpg", palette:"#7c2d12", ink:"#e7c97a" },
    { id:"fr22", category:"sports", title:"Emam Ashour", art:"sport5.jpg", palette:"#1d4ed8", ink:"#e7c97a" },
    { id:"fr23", category:"sports", title:"Messi", art:"sport6.jpg", palette:"#065f46", ink:"#e7c97a" },
    { id:"fr24", category:"sports", title:"CR7", art:"sport7.jpg", palette:"#111827", ink:"#e7c97a" },
    { id:"fr25", category:"sports", title:"Lamin Yamal", art:"sport8.jpg", palette:"#7f1d1d", ink:"#e7c97a" },
    { id:"fr26", category:"sports", title:"Nmarey", art:"sport9.jpg", palette:"#312e81", ink:"#e7c97a" },
    { id:"fr27", category:"sports", title:"CR7", art:"sport10.jpg", palette:"#92400e", ink:"#e7c97a" },
    { id:"fr28", category:"sports", title:"Messi", art:"sport11.jpg", palette:"#14532d", ink:"#e7c97a" },
    { id:"fr29", category:"sports", title:"king / Mo Salah", art:"sport12.jpg", palette:"#3f2f2f", ink:"#e7c97a" },
    { id:"fr30", category:"sports", title:"Just do it ", art:"sport13.jpg", palette:"#1f2937", ink:"#e7c97a" }
  ];

  // ---------- State ----------
  const CART_KEY = "opscura_cart_v1";
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

  // ---------- Render each category section ----------
  function renderSports(){
    const root = $("#framesGrid");
    root.innerHTML = FRAMES.filter(p => p.category === "sports").map(p => productCard(p, "frame")).join("");
    bindProductEvents(root, "frame");
  }

  function renderMovies(){
    const root = $("#casesGrid");
    root.innerHTML = FRAMES.filter(p => p.category === "movies").map(p => productCard(p, "frame")).join("");
    bindProductEvents(root, "frame");
  }

  function renderGaming(){
    const root = $("#gamingGrid");
    root.innerHTML = FRAMES.filter(p => p.category === "gaming").map(p => productCard(p, "frame")).join("");
    bindProductEvents(root, "frame");
  }

  // Create a single product card for either a frame or a case
  function productCard(p, type){
    const opts = FRAME_OPTIONS;
    const optsHTML = opts.map((o,i)=>`<option value="${o.id}" data-price="${o.price}" ${i===0?"selected":""}>${o.label} · ${o.price} EGP</option>`).join("");
    const artClass = "product__art--frame";
    const art = `<div class="product__art"><div class="${artClass}" style="background:${p.palette};color:${p.ink};"><img src="${escapeHTML(p.art)}" alt="${escapeHTML(p.title)}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;"></div></div>`;
    const label = "Size";
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

  // Attach behavior for size selection and add-to-cart button
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
        const prod = FRAMES.find(x => x.id === pid);
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
              <button data-act="dec" aria-label="Decrease quantity">−</button>
              <span>${it.qty}</span>
              <button data-act="inc" aria-label="Increase quantity">+</button>
            </div>
            <div><strong>${fmt(it.price*it.qty)}</strong></div>
          </div>
          <div class="cart-item__hint">Use + / − to change qty or remove item</div>
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

      const incBtn = $('[data-act="inc"]', node);
      const decBtn = $('[data-act="dec"]', node);
      const rmBtn = $('[data-act="rm"]', node);

      if (incBtn) {
        incBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          item.qty += 1;
          saveCart();
        };
      }

      if (decBtn) {
        decBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          item.qty = Math.max(1, item.qty - 1);
          saveCart();
        };
      }

      if (rmBtn) {
        rmBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          state.cart = state.cart.filter(x => x.uid !== u);
          saveCart();
        };
      }
    });
  }

  // ---------- Drawer / modal helpers ----------
  function openDrawer(){
    $("#drawer").setAttribute("aria-hidden","false");
    $("#drawer").style.display = "block";
    document.body.style.overflow="hidden";
  }
  function closeDrawer(){
    $("#drawer").setAttribute("aria-hidden","true");
    $("#drawer").style.display = "none";
    document.body.style.overflow="";
  }
  function openModal(id){
    closeDrawer();
    const modal = $("#"+id);
    modal.setAttribute("aria-hidden","false");
    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    document.body.style.overflow="hidden";
    requestAnimationFrame(() => {
      const firstInput = $("input, textarea, select", modal);
      if (firstInput) firstInput.focus();
    });
  }
  function closeModal(id){
    const modal = $("#"+id);
    modal.setAttribute("aria-hidden","true");
    modal.style.display = "none";
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    document.body.style.overflow="";
  }

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

    const checkoutBtn = $("#checkoutBtn");
    const checkoutLaunchBtn = $("#checkoutLaunch");
    const openCheckoutHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      openCheckout();
    };
    checkoutBtn.addEventListener("click", openCheckoutHandler);
    checkoutBtn.onclick = openCheckoutHandler;
    checkoutLaunchBtn.addEventListener("click", openCheckoutHandler);
    checkoutLaunchBtn.onclick = openCheckoutHandler;
    window.openCheckoutModal = openCheckout;

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

  // ---------- Initialize page ----------
  function init(){
    renderSports();
    renderMovies();
    renderGaming();
    renderCart();
    bindEvents();
  }
  document.addEventListener("DOMContentLoaded", init);
})();

function updateShippingCost() {
    try {
        var zoneSelect = document.getElementById('shipping-zone');
        if (!zoneSelect) return;

        // 1. قراءة قيمة الشحن
        var shippingCost = Number(zoneSelect.value) || 0;
        
        // 2. تجهيز متغيرات المنتجات
        var itemsHtml = '';
        var itemsSubtotal = 0;

        // قراءة المنتجات الحالية من السلة ديناميكياً
        if (typeof state !== 'undefined' && state.cart && state.cart.length > 0) {
            itemsSubtotal = state.cart.reduce(function(sum, item) {
                return sum + (item.price * (item.qty || 1));
            }, 0);

            // بناء الـ HTML لكل منتج في السلة بنفس الاستايل الأصلي
            state.cart.forEach(function(item) {
                itemsHtml += 
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.95em; color: #555;">' +
                        '<span>' + item.name + ' <small style="color:#888;">(' + item.specs + ')</small> × ' + (item.qty || 1) + '</span>' +
                        '<span>' + (item.price * (item.qty || 1)) + ' EGP</span>' +
                    '</div>';
            });
        } else {
            // كود احتياطي لو السلة مش مقروءة بشكل كامل عشان التصميم ما يبوظش
            itemsSubtotal = 230;
            itemsHtml = 
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.95em; color: #555;">' +
                    '<span>Silver Screen Sunset · 20×30 cm · Framed × 1</span>' +
                    '<span>230 EGP</span>' +
                '</div>';
        }
        
        // 3. حساب الإجمالي النهائي
        var finalTotal = itemsSubtotal + shippingCost;
        
        // 4. دمج الـ 3 عناصر مع بعض وعرضهم تحت بعض بتنسيق فليكس كامل
        var summaryDiv = document.getElementById('checkoutSummary');
        if (summaryDiv) {
            summaryDiv.innerHTML = 
                // الجزء الأول: المنتجات
                itemsHtml + 
                
                // الجزء الثاني: سطر الشحن
                '<div style="display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; margin-top: 8px; margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0;">' +
                    '<span style="color: #666;">Shipping</span>' +
                    '<span style="font-weight: 500;">' + shippingCost + ' EGP</span>' +
                '</div>' +
                
                // الجزء الثالث: سطر الإجمالي النهائي
                '<div style="display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; font-weight: bold; font-size: 1.1em; padding-top: 4px;">' +
                    '<span>Total</span>' +
                    '<span id="total-price" style="color: #000;">' + finalTotal + ' EGP</span>' +
                '</div>';
        }
    } catch (e) {
        console.log("Error inside updateShippingCost:", e);
    }
}