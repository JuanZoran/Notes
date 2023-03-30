/* global function */

Global.initUtils = () => {
  Global.utils = {
    html_root_dom: document.querySelector("html"),
    pageContainer_dom: document.querySelector(".page-container"),
    pageTop_dom: document.querySelector(".main-content-header"),
    firstScreen_dom: document.querySelector(".home-banner-container"),
    scrollProgressBar_dom: document.querySelector(".scroll-progress-bar"),
    pjaxProgressBar_dom: document.querySelector(".pjax-progress-bar"),
    pjaxProgressIcon_dom: document.querySelector(".pjax-progress-icon"),
    backToTopButton_dom: document.querySelector(".tool-scroll-to-top"),
    toolsList: document.querySelector(".hidden-tools-list"),
    toggleButton: document.querySelector(".toggle-tools-list"),

    innerHeight: window.innerHeight,
    pjaxProgressBarTimer: null,
    prevScrollValue: 0,
    fontSizeLevel: 0,

    isHasScrollProgressBar:
      Global.theme_config.global.scroll_progress.bar === true,
    isHasScrollPercent:
      Global.theme_config.global.scroll_progress.percentage === true,

    // Scroll Style
    updateScrollStyle() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const percent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    
      if (this.isHasScrollProgressBar) {
        const progressPercent = ((scrollTop / (scrollHeight - clientHeight)) * 100).toFixed(3);
        this.scrollProgressBar_dom.style.visibility = percent === 0 ? 'hidden' : 'visible';
        this.scrollProgressBar_dom.style.width = `${progressPercent}%`;
      }
    
      if (this.isHasScrollPercent) {
        const percentDom = this.backToTopButton_dom.querySelector('.percent');
        this.backToTopButton_dom.classList.toggle('show', percent !== 0 && percent !== undefined);
        percentDom.innerHTML = percent.toFixed(0);
      }
    
      if (Global.theme_config.navbar.auto_hide) {
        this.pageTop_dom.classList.toggle('hide', (this.prevScrollValue > clientHeight && scrollTop  > this.prevScrollValue) );
      }
      this.prevScrollValue = scrollTop;
    },

    // register window scroll event
    registerWindowScroll() {
      window.addEventListener("scroll", () => {
        // style handle when scroll
        if (this.isHasScrollPercent || this.isHasScrollProgressBar) {
          this.updateScrollStyle();
        }

        // TOC scroll handle
        if (
          Global.theme_config.articles.toc.enable &&
          Global.utils.hasOwnProperty("updateActiveTOCLink")
        ) {
          Global.utils.updateActiveTOCLink();
        }

        // navbar shrink
        navbarShrink.init();

        // auto hide tools
        var y = window.pageYOffset;
        var height = document.body.scrollHeight;
        var windowHeight = window.innerHeight;
        var toolList = document.getElementsByClassName('right-side-tools-container');
        
        for (var i = 0; i < toolList.length; i++) {
          var tools = toolList[i];
          if (y <= 0) {
            if (location.pathname !== '/') {
              //console.log(location.pathname)
            } else {
              tools.classList.add('hide');
            }
          } else if (y + windowHeight >= height - 20) {
            tools.classList.add('hide');
          } else {
            tools.classList.remove('hide');
          }
        }

        /*aplayer auto hide*/
        
        var aplayer = document.getElementById('aplayer');
        if (aplayer == null) {} else {
          if (y <= 0) {
              if (location.pathname !== '/') {
                //console.log(location.pathname)
              } else {
                aplayer.classList.add('hide');
              }
          } else if (y + windowHeight >= height - 20) {
            aplayer.classList.add('hide');
          } else {
            aplayer.classList.remove('hide');
          }
        }
      });
    },

    toggleToolsList() {
      this.toggleButton.addEventListener("click", () => {
        this.toolsList.classList.toggle("show");
      });
    },
    
    globalFontSizeAdjust() {
      const htmlRoot = this.html_root_dom;
      const fontAdjustPlus = document.querySelector('.tool-font-adjust-plus');
      const fontAdjustMinus = document.querySelector('.tool-font-adjust-minus');
    
      const fontSize = document.defaultView.getComputedStyle(document.body).fontSize;
      const fs = parseFloat(fontSize);
    
      let fontSizeLevel = 0;
      const styleStatus = Global.getStyleStatus();
      if (styleStatus) {
        fontSizeLevel = styleStatus.fontSizeLevel;
        setFontSize(fontSizeLevel);
      }
    
      function setFontSize(fontSizeLevel) {
        htmlRoot.style.fontSize = `${fs * (1 + fontSizeLevel * 0.05)}px`;
        Global.styleStatus.fontSizeLevel = fontSizeLevel;
        Global.setStyleStatus();
      }
    
      fontAdjustPlus.addEventListener('click', () => {
        switch (fontSizeLevel) {
          case 0:
            fontSizeLevel = 1;
            break;
          case 1:
            fontSizeLevel = 2;
            break;
          case 2:
            fontSizeLevel = 3;
            break;
          case 3:
            fontSizeLevel = 4;
            break;
          case 4:
            fontSizeLevel = 5;
            break;
          default:
            break;
        }
        setFontSize(fontSizeLevel);
      });
    
      fontAdjustMinus.addEventListener('click', () => {
        switch (fontSizeLevel) {
          case 1:
            fontSizeLevel = 0;
            break;
          case 2:
            fontSizeLevel = 1;
            break;
          case 3:
            fontSizeLevel = 2;
            break;
          case 4:
            fontSizeLevel = 3;
            break;
          case 5:
            fontSizeLevel = 4;
            break;
          default:
            break;
        }
        setFontSize(fontSizeLevel);
      });
    },

    // toggle content area width
    contentAreaWidthAdjust() {
      const toolExpandDom = document.querySelector(".tool-expand-width");
      const navbarContentDom = document.querySelector(".navbar-content");
      const mainContentDom = document.querySelector(".main-content");
      const iconDom = toolExpandDom.querySelector("i");

      const defaultMaxWidth =
        Global.theme_config.global.content_max_width || "1000px";
      const expandMaxWidth = "90%";
      let navbarMaxWidth = defaultMaxWidth;

      let isExpand = false;

      if (
        Global.theme_config.home_banner.enable === true &&
        window.location.pathname === "/"
      ) {
        navbarMaxWidth = parseInt(defaultMaxWidth) * 1.2 + "px";
      }

      const setPageWidth = (isExpand) => {
        Global.styleStatus.isExpandPageWidth = isExpand;
        Global.setStyleStatus();
        if (isExpand) {
          iconDom.classList.remove("fa-expand");
          iconDom.classList.add("fa-compress");
          navbarContentDom.style.maxWidth = expandMaxWidth;
          mainContentDom.style.maxWidth = expandMaxWidth;
        } else {
          iconDom.classList.remove("fa-compress");
          iconDom.classList.add("fa-expand");
          navbarContentDom.style.maxWidth = navbarMaxWidth;
          mainContentDom.style.maxWidth = defaultMaxWidth;
        }
      };

      const initPageWidth = () => {
        const styleStatus = Global.getStyleStatus();
        if (styleStatus) {
          isExpand = styleStatus.isExpandPageWidth;
          setPageWidth(isExpand);
        }
      };

      initPageWidth();

      toolExpandDom.addEventListener("click", () => {
        isExpand = !isExpand;
        setPageWidth(isExpand);
      });
    },

    // go comment anchor
    goComment() {
      this.goComment_dom = document.querySelector(".go-comment");
      if (this.goComment_dom) {
        this.goComment_dom.addEventListener("click", () => {
          document.querySelector("#comment-anchor").scrollIntoView({
            behavior: "smooth",
          });
        });
      }
    },

    // get dom element height
    getElementHeight(selectors) {
      const dom = document.querySelector(selectors);
      return dom ? dom.getBoundingClientRect().height : 0;
    },

    // init first screen height
    initFirstScreenHeight() {
      this.firstScreen_dom &&
        (this.firstScreen_dom.style.height = this.innerHeight + "px");
    },

    // init page height handle
    initPageHeightHandle() {
      if (this.firstScreen_dom) return;
      const temp_h1 = this.getElementHeight(".main-content-header");
      const temp_h2 = this.getElementHeight(".main-content-body");
      const temp_h3 = this.getElementHeight(".main-content-footer");
      const allDomHeight = temp_h1 + temp_h2 + temp_h3;
      const innerHeight = window.innerHeight;
      const pb_dom = document.querySelector(".main-content-footer");
      if (allDomHeight < innerHeight) {
        const marginTopValue = Math.floor(innerHeight - allDomHeight);
        if (marginTopValue > 0) {
          pb_dom.style.marginTop = `${marginTopValue - 2}px`;
        }
      }
    },

    // big image viewer
    imageViewer() {
      let isBigImage = false;

      const showHandle = (maskDom, isShow) => {
        document.body.style.overflow = isShow ? "hidden" : "auto";
        if (isShow) {
          maskDom.classList.add("active");
        } else {
          maskDom.classList.remove("active");
        }
      };

      const imageViewerDom = document.querySelector(".image-viewer-container");
      const targetImg = document.querySelector(".image-viewer-container img");
      imageViewerDom &&
        imageViewerDom.addEventListener("click", () => {
          isBigImage = false;
          showHandle(imageViewerDom, isBigImage);
        });

      const imgDoms = document.querySelectorAll(".markdown-body img");

      if (imgDoms.length) {
        imgDoms.forEach((img) => {
          img.addEventListener("click", () => {
            isBigImage = true;
            showHandle(imageViewerDom, isBigImage);
            targetImg.setAttribute("src", img.getAttribute("src"));
          });
        });
      } else {
        this.pageContainer_dom.removeChild(imageViewerDom);
      }
    },

    // set how long ago language
    setHowLongAgoLanguage(p1, p2) {
      return p2.replace(/%s/g, p1);
    },
    

    getHowLongAgo(timestamp) {
      const l = Global.language_ago;

      const __Y = Math.floor(timestamp / (60 * 60 * 24 * 30) / 12);
      const __M = Math.floor(timestamp / (60 * 60 * 24 * 30));
      const __W = Math.floor(timestamp / (60 * 60 * 24) / 7);
      const __d = Math.floor(timestamp / (60 * 60 * 24));
      const __h = Math.floor((timestamp / (60 * 60)) % 24);
      const __m = Math.floor((timestamp / 60) % 60);
      const __s = Math.floor(timestamp % 60);

      if (__Y > 0) {
        return this.setHowLongAgoLanguage(__Y, l.year);
      } else if (__M > 0) {
        return this.setHowLongAgoLanguage(__M, l.month);
      } else if (__W > 0) {
        return this.setHowLongAgoLanguage(__W, l.week);
      } else if (__d > 0) {
        return this.setHowLongAgoLanguage(__d, l.day);
      } else if (__h > 0) {
        return this.setHowLongAgoLanguage(__h, l.hour);
      } else if (__m > 0) {
        return this.setHowLongAgoLanguage(__m, l.minute);
      } else if (__s > 0) {
        return this.setHowLongAgoLanguage(__s, l.second);
      }
    },

    relativeTimeInHome() {
      const post = document.querySelectorAll(
        ".home-article-meta-info .home-article-date"
      );
      const df = Global.theme_config.home.article_date_format;
      if (df === "relative") {
        post &&
          post.forEach((v) => {
            const nowDate = Date.now();
            const postDate = new Date(v.dataset.date.split(" GMT")[0]).getTime();
            v.innerHTML = this.getHowLongAgo(
              Math.floor((nowDate - postDate) / 1000)
            );
          });
      } else if (df === "auto") {
        post &&
        post.forEach((v) => {
          const nowDate = Date.now();
          const postDate = new Date(v.dataset.date.split(" GMT")[0]).getTime();
          const finalDays = Math.floor(
            (nowDate - postDate) / (60 * 60 * 24 * 1000)
          );
          if (finalDays < 7) {
            v.innerHTML = this.getHowLongAgo(
              Math.floor((nowDate - postDate) / 1000)
            );
          }
        });
      }
    },

    // loading progress bar start
    pjaxProgressBarStart() {
      this.pjaxProgressBarTimer && clearInterval(this.pjaxProgressBarTimer);
      if (this.isHasScrollProgressBar) {
        this.scrollProgressBar_dom.classList.add("hide");
      }

      this.pjaxProgressBar_dom.style.width = "0";
      this.pjaxProgressIcon_dom.classList.add("show");

      let width = 1;
      const maxWidth = 99;

      this.pjaxProgressBar_dom.classList.add("show");
      this.pjaxProgressBar_dom.style.width = width + "%";

      this.pjaxProgressBarTimer = setInterval(() => {
        width += 5;
        if (width > maxWidth) width = maxWidth;
        this.pjaxProgressBar_dom.style.width = width + "%";
      }, 100);
    },

    // loading progress bar end
    pjaxProgressBarEnd() {
      this.pjaxProgressBarTimer && clearInterval(this.pjaxProgressBarTimer);
      this.pjaxProgressBar_dom.style.width = "100%";

      const temp_1 = setTimeout(() => {
        this.pjaxProgressBar_dom.classList.remove("show");
        this.pjaxProgressIcon_dom.classList.remove("show");

        if (this.isHasScrollProgressBar) {
          this.scrollProgressBar_dom.classList.remove("hide");
        }

        const temp_2 = setTimeout(() => {
          this.pjaxProgressBar_dom.style.width = "0";
          clearTimeout(temp_1), clearTimeout(temp_2);
        }, 200);
      }, 200);
    },



    /*
    calculateMaterialColors(hex) {
      // Convert hex to RGB
      hex = hex.replace(/#/g, "");
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map(function (hex) {
            return hex + hex;
          })
          .join("");
      }
      var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(
        hex
      );
      if (!result) {
        return null;
      }
      var r = parseInt(result[1], 16);
      var g = parseInt(result[2], 16);
      var b = parseInt(result[3], 16);
      (r /= 255), (g /= 255), (b /= 255);
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var h,
        s,
        l = (max + min) / 2;
      if (max == min) {
        h = s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      s = s * 100;
      s = Math.round(s);
      l = l * 100;
      l = Math.round(l);
      h = Math.round(360 * h);

      // Compute primary, secondary, and tertiary colors
      const primaryColor = `hsl(${h}, ${s}%, ${l}%)`;
      const secondaryColor = `hsl(${h}, ${s - 15}%, ${l - 15}%)`;
      const tertiaryColor = `hsl(${h}, ${s - 25}%, ${l - 25}%)`;
      document.documentElement.style.setProperty('--primary-color-temp', primaryColor);
      document.documentElement.style.setProperty('--secondary-color-temp', secondaryColor);
      document.documentElement.style.setProperty('--tertiary-color-temp', tertiaryColor);
    },*/
  };

  // init scroll
  Global.utils.registerWindowScroll();

  // toggle show tools list
  Global.utils.toggleToolsList();

  // global font adjust
  Global.utils.globalFontSizeAdjust();

  // adjust content area width
  Global.utils.contentAreaWidthAdjust();

  // go comment
  Global.utils.goComment();

  // init page height handle
  Global.utils.initPageHeightHandle();

  // init first screen height
  Global.utils.initFirstScreenHeight();

  // big image viewer handle
  Global.utils.imageViewer();

  // set how long ago in home article block
  Global.utils.relativeTimeInHome();

  // calculate material colors
  //Global.utils.calculateMaterialColors(Global.theme_config.colors.primary);
};
