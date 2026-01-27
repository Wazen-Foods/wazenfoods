let currentLang = localStorage.getItem("lang") || "ar";
let menuData = null;

async function loadMenu() {
  try {
    const response = await fetch("menu.json");
    menuData = await response.json();
    renderMenu();
  } catch (error) {
    console.error("خطأ بتحميل القائمة:", error);
  }
}

function renderMenu() {
  const menuContainer = document.getElementById("menu");
  const sectionsNav = document.getElementById("sections-nav");
  const langToggle = document.getElementById("lang-toggle");

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  // شعار وازن
  const logo = document.getElementById("logo");
  logo.innerHTML = ""; // إزالة أي شعار قديم
  const wazen_logo = document.createElement("img");
  wazen_logo.src = "assets/images/wazen-elements-04.png";
  wazen_logo.alt = "Wazen";
  wazen_logo.classList.add("logo");
  logo.appendChild(wazen_logo);

  langToggle.textContent = currentLang === "ar" ? "English" : "العربية";

  menuContainer.innerHTML = "";
  sectionsNav.innerHTML = "";

  menuData.sections.forEach((section, index) => {
    // زر التنقل
    const btn = document.createElement("button");
    btn.textContent = section.title[currentLang];
    btn.addEventListener("click", () => {
      document.getElementById(`section-${index}`).scrollIntoView({ behavior: "smooth" });
    });
    sectionsNav.appendChild(btn);

    // القسم
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("menu-section");
    sectionDiv.id = `section-${index}`;

    // العنوان
    const title = document.createElement("h2");
    title.textContent = section.title[currentLang];
    sectionDiv.appendChild(title);

    // الـ label
    if(section.label) {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("section-label");
      labelDiv.textContent = section.label[currentLang];
      sectionDiv.insertBefore(labelDiv, title.nextSibling);
    }


    if (section.note && section.note[currentLang]) {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("section-note");
      noteDiv.textContent = section.note[currentLang];
      sectionDiv.appendChild(noteDiv);
    }

    const scrollWrap = document.createElement("div");
    scrollWrap.classList.add("scroll-wrap");

    // رأس الأسعار
    const pricesHeader = document.createElement("div");
    pricesHeader.classList.add("prices-header");
    pricesHeader.innerHTML = `<div class="item-name">${currentLang === "ar" ? "الصنف" : "Item"}</div>`;

    const firstItem = section.items[0];
    const priceKeys = Object.keys(firstItem.prices);

    priceKeys.forEach(type => {
      let label = type;
      if(currentLang === "ar") {
        if(type === "sandwich") label = "ساندويش";
        else if(type === "meal") label = "وجبة";
        else if(type === "Wazen Meal") label = "وجبة وازن";
        else if(type === "price") label = "السعر";
        else if(type === "small") label = "صغير";
        else if(type === "large") label = "كبير";
        else if(type === "medium") label = "متوسط";
        else if(type === "litre") label = "لتر";
        else if(type === "with Ice Cream") label = "مع بوظة";
      }
      
      const divHeader = document.createElement("div");
      divHeader.classList.add("item-price-header");

      if(type === "Wazen Meal") {
        divHeader.textContent = label; // كلمة "وجبة وازن" عادية

        // النجمة الصغيرة للـ tooltip
        const tooltipStar = document.createElement("span");
        tooltipStar.textContent = "✱";
        tooltipStar.classList.add("tooltip-star");

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip-text");
        tooltip.innerHTML = currentLang === "ar" ? `
          نفس الوجبة ولكن صحية أكثر!<br>
          بدل البطاطا المقلية ببطاطا ودجز مشوية أو خضار سوتيه<br>
          بدل المشروب الغازي بعصير برتقال طبيعي<br>
          أضف سلطة سيزر للوجبة
        `: `
          The same meal, but healthier!<br>
          Swap the fries for baked potato wedges or sautéed vegetables<br>
          Replace the soft drink with fresh orange juice<br>
          Add a Caesar salad to your meal
        `;
        tooltip.style.direction = currentLang === "ar" ? "rtl" : "ltr";
        tooltip.style.textAlign = currentLang === "ar" ? "right" : "left";

        tooltipStar.appendChild(tooltip);
        divHeader.appendChild(tooltipStar);
      } else {
        divHeader.textContent = label;
      }

      pricesHeader.appendChild(divHeader);
    });

    scrollWrap.appendChild(pricesHeader);

    // الأصناف
    section.items.forEach(item => {
      const itemRow = document.createElement("div");
      itemRow.classList.add("item-row");

      // الاسم + الوصف
      const nameDiv = document.createElement("div");
      nameDiv.classList.add("item-name");
      nameDiv.innerHTML = `
        <div class="item-title">${item.name[currentLang]}</div>
        <div class="item-desc">${item.description[currentLang]}</div>
      `;
      itemRow.appendChild(nameDiv);

      // الأسعار
      priceKeys.forEach(key => {
        const p = document.createElement("div");
        p.classList.add("item-price");
        p.textContent = item.prices[key] || "-";
        itemRow.appendChild(p);
      });

      scrollWrap.appendChild(itemRow);
    });

    sectionDiv.appendChild(scrollWrap);
    menuContainer.appendChild(sectionDiv);
  });
}

// تبديل اللغة
document.getElementById("lang-toggle").addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang);
  renderMenu();
});

loadMenu();