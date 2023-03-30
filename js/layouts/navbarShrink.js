const navbarShrink = {
  navbarDom: document.querySelector('.navbar-container'),
  leftAsideDom: document.querySelector('.page-aside'),
  isnavbarShrink: false,
  navbarHeight: 0,

  init() {
    this.navbarHeight = this.navbarDom.getBoundingClientRect().height;
    this.navbarShrink();
    this.togglenavbarDrawerShow();
    window.addEventListener('scroll', () => {
      this.navbarShrink();
    });
  },

  navbarShrink() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (!this.isnavbarShrink && scrollTop > this.navbarHeight) {
      this.isnavbarShrink = true;
      document.body.classList.add('navbar-shrink');
        
    } else if (this.isnavbarShrink && scrollTop <= this.navbarHeight) {
      this.isnavbarShrink = false;
      document.body.classList.remove('navbar-shrink');
    }
  },

  togglenavbarDrawerShow() {
    const domList = [document.querySelector('.window-mask'), document.querySelector('.navbar-bar')];

    if (document.querySelector('.navbar-drawer')) {
      domList.push(...document.querySelectorAll('.navbar-drawer .drawer-navbar-list .drawer-navbar-item'));
    }

    domList.forEach(v => {
      v.addEventListener('click', () => {
        document.body.classList.toggle('navbar-drawer-show');
      });
    });
  }
};

navbarShrink.init();