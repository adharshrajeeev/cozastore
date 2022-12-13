/*********************************************************************************
 Template Name: Diva Multipurpose eCommerce Bootstrap 5 Template
 Description: A perfect template to build beautiful and unique Fashion websites. It comes with nice and clean design.
 Version: 1.0
 **********************************************************************************/

/* ============================================
 Table of Content:
 -----------------------------------------------
 01. Preloader Loading
 02. Promotional Bar Header
 03. Top Links Show/Hide dropdown
 04. Sticky Header
 05. Search Trigger
 06. Mobile Menu
 07. Slick Slider
    07.1 Homepage Slideshow 
    07.2 Product Slider Slick
    07.3 Product Slider Slick Style2
    07.4 Product Slider Slick Style3
    07.5 Product Slider Slick Fullwidth
    07.6 Product Slider Slick Product Page
    07.7 Collection Slider Slick
    07.8 Collection Slider Slick 4 items
    07.9 Collection Slider Slick 3 items
    07.10 Logo Slider Slick
    07.11 Testimonial Slider Slick
    07.12 Testimonial Slider Slick 3 items
    07.13 Instagram Slick Slider
    07.14 Center Mode Slider Slick
 08. Tabs With Accordian Responsive
 09. Sidebar Categories Level links
 10. Price Range Slider
 11. Color Swacthes
 12. Footer links for mobiles
 13. Site Animation
 14. Show Hide Product Tag
 15. Show Hide Product Filters
 16. Timer Count Down
 17. Scroll Top
 18. Height Product Grid Image
 19. Product details slider 2
 20. Product details slider 1
 21. Product Zoom
 22. Product Page Popup
 23. Quantity Plus Minus
 24. Visitor Fake Message
 25. Product Tabs
 26. Promotion / Notification Cookie Bar 
 27. Image to background js
 28. Related Product Slider
 29. Infinite Scroll js
 30. Category Slidershow
 31. Quickview Slide Products
 32. Shop Siderbar Products
 33. Magnific Popup
 34. Product Suggestion slider
 35. Tooltip
 36. Write Review Toggle Box
 37. Nice Select
 38. Image Swacthes
 39. Background Parallax image
 ============================================*/


(function ($) {
    // Start of use strict
    'use strict';

    /*-----------------------------------------
     01. Preloader Loading
     ------------------------------------------*/
    function pre_loader() {
        $("#load").fadeOut();
        $('#pre-loader').delay(0).fadeOut('slow');
    }
    pre_loader();

    /*-----------------------------------------
     02. Promotional Bar Header
     ------------------------------------------*/
    function promotional_bar() {
        $(".closeHeader").on('click', function () {
            $(".promotion-header").slideUp();
            Cookies.set('promotion', 'true', {expires: 1});
            return false;
        });
    }
    promotional_bar();

    /*-----------------------------------------
     03. Top Links Show/Hide dropdown
     ------------------------------------------*/
    function usermenu_dropdown() {
        $(".user-menu").on("click", function () {
            $(".customer-links").slideToggle();
        });
        $(".customer-links li").on("click", function () {
            $(this).parent().slideUp();
        });
    }
    usermenu_dropdown();
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.user-menu').length) {
            $(".customer-links").slideUp();
        }
    });

    /*-----------------------------------------
     Top Links Show/Hide Max < 999 dropdown
     ------------------------------------------*/
    function userlink_dropdown() {
        $('.top-header .user-menu-links').on("click", function () {
            if ($(window).width() < 990) {
                $(this).next().slideToggle(300);
                $(this).parent().toggleClass("active");
            }
        });
    }
    userlink_dropdown();

    /*-----------------------------------------
     04. Sticky Header
     ------------------------------------------*/
    window.onscroll = function () {
        myFunction();
    };
    function myFunction() {
        if ($(window).width() > 1199) {
            if ($(window).scrollTop() > 160) {
                $('.hdr-sticky').addClass("stickyNav animated fadeInDown");
            } else {
                $('.hdr-sticky').removeClass("stickyNav fadeInDown");
            }
        }

        /* Product Sticky Bottom Cart */
        $(window).scrollTop() > 600 && $(".stickyCart").length ? (
                $("body.template-product").css("padding-bottom", "70px"),
                $(".stickyCart").slideDown()) : ($("body.template-product").css("padding-bottom", "0"),
                $(".stickyCart").slideUp());
    }

    /*-----------------------------------------
     05. Search Trigger
     ------------------------------------------*/
    function search_bar() {
        $('.search-trigger').on('click', function () {
            $('body').toggleClass("search-model");

            const search = $('.search');
            if (search.is('.search--opened')) {
                search.removeClass('search--opened');
            } else {
                search.addClass('search--opened');
                $('.search__input')[0].focus();
            }
        });
    }
    search_bar();
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.search, .search-trigger').length) {
            $('body').removeClass("search-model");
            $('.search').removeClass('search--opened');
        }
    });

    /*-----------------------------------------
     06. Mobile Menu
     ------------------------------------------*/
    var selectors = {
        body: 'body',
        sitenav: '#siteNav',
        navLinks: '#siteNav .lvl1 > a',
        menuToggle: '.js-mobile-nav-toggle',
        mobilenav: '.mobile-nav-wrapper',
        menuLinks: '#MobileNav .an',
        closemenu: '.closemobileMenu'
    };

    $(selectors.navLinks).each(function () {
        if ($(this).attr('href') == window.location.pathname)
            $(this).addClass('active');
    });

    $(selectors.menuToggle).on("click", function () {
        body: 'body',
                $(selectors.mobilenav).toggleClass("active");
        $(selectors.body).toggleClass("menuOn");
        $(selectors.menuToggle).toggleClass('mobile-nav--open mobile-nav--close');
    });

    $(selectors.closemenu).on("click", function () {
        body: 'body',
                $(selectors.mobilenav).toggleClass("active");
        $(selectors.body).toggleClass("menuOn");
        $(selectors.menuToggle).toggleClass('mobile-nav--open mobile-nav--close');
    });
    $("body").on('click', function (event) {
        var $target = $(event.target);
        if (!$target.parents().is(selectors.mobilenav) && !$target.parents().is(selectors.menuToggle) && !$target.is(selectors.menuToggle)) {
            $(selectors.mobilenav).removeClass("active");
            $(selectors.body).removeClass("menuOn");
            $(selectors.menuToggle).removeClass('mobile-nav--close').addClass('mobile-nav--open');
        }
    });
    $(selectors.menuLinks).on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('an-plus an-minus');
        $(this).parent().next().slideToggle();
    });

    /*-----------------------------------------
     07.1 Homepage Slideshow 
     ------------------------------------------*/
    function home_slideshow() {
        $('.home-slideshow').slick({
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 7000,
            lazyLoad: 'ondemand'
        });
    }
    home_slideshow();

    // Full Size Banner on the Any Screen
    $(window).resize(function () {
        var bodyheight = $(this).height() - 20;
        $(".sliderFull .bg-size").height(bodyheight);
    }).resize();

    /*-----------------------------------------
     07.2 Product Slider Slick
     ------------------------------------------*/
    function product_slider() {
        $('.productSlider').slick({
            dots: false,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]

        });
    }
    product_slider();

    /*-----------------------------------------
     07.3 Product Slider Slick Style2
     ------------------------------------------*/
    function product_slider1() {
        $('.productSlider-style1').slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    product_slider1();

    /*-----------------------------------------
     07.4 Product Slider Slick Style3
     ------------------------------------------*/
    function product_slider2() {
        $('.productSlider-style2').slick({
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    product_slider2();

    /*-----------------------------------------
     07.5 Product Slider Slick Fullwidth
     ------------------------------------------*/
    function product_slider_full() {
        $('.productSlider-fullwidth').slick({
            dots: false,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    product_slider_full();

    /*-----------------------------------------
     07.6 Product Slider Slick Product Page
     ------------------------------------------*/
    function product_slider_ppage() {
        $('.productPageSlider').slick({
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 680,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 380,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    product_slider_ppage();

    /*-----------------------------------------
     07.7 Collection Slider Slick
     ------------------------------------------*/
    function collection_slider() {
        $('.collection-grid').slick({
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    collection_slider();

    /*-----------------------------------------
     07.8 Collection Slider Slick 4 items
     ------------------------------------------*/
    function collection_slider1() {
        $('.collection-grid-4item').slick({
            dots: false,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    collection_slider1();

    /*-----------------------------------------
     07.9 Collection Slider Slick 3 items
     ------------------------------------------*/
    function collection_slider2() {
        $('.collection-grid-3item').slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    collection_slider2();

    /*-----------------------------------------
     07.10 Logo Slider Slick
     ------------------------------------------*/
    function logo_slider() {
        $('.logo-bar').slick({
            dots: false,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    logo_slider();

    /*-----------------------------------------
     07.11 Testimonial Slider Slick
     ------------------------------------------*/
    function testimonial_slider() {
        $('.quotes-slider').slick({
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true
        });
    }
    testimonial_slider();

    /*-----------------------------------------
     07.12 Testimonial Slider Slick 3 items
     ------------------------------------------*/
    function testimonial_slider_style2() {
        $('.quotes-slider-style2').slick({
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        arrows: false
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        arrows: false
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false
                    }
                }
            ]
        });
    }
    testimonial_slider_style2();

    /*-----------------------------------------
     07.13 Instagram Slick Slider
     ------------------------------------------*/
    function instagram_slider() {
        $('.instagram-slider').slick({
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    instagram_slider();

    /*-----------------------------------------
     07.14 Center Mode Slider Slick
     ------------------------------------------*/
    $('.centerMode-slider').slick({
        infinite: true,
        autoplay: false,
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    centerPadding: '0',
                    centerMode: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

    /*------------------------------------
     08. Tabs With Accordian Responsive
     -------------------------------------*/
    $(".tab_content").hide();
    $(".tab_content:first").show();

    /* if in tab mode */
    $("ul.tabs li").on('click', function () {
        $(".tab_content").hide();
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn();

        $("ul.tabs li").removeClass("active");
        $(this).addClass("active");

        $(".tab_drawer_heading").removeClass("d_active");
        $(".tab_drawer_heading[rel^='" + activeTab + "']").addClass("d_active");

        $('.productSlider, .productSlider-style1').slick('refresh');
    });

    /* if in drawer mode */
    $(".tab_drawer_heading").on('click', function () {
        $(".tab_content").hide();
        var d_activeTab = $(this).attr("rel");
        $("#" + d_activeTab).fadeIn();

        $(".tab_drawer_heading").removeClass("d_active");
        $(this).addClass("d_active");

        $("ul.tabs li").removeClass("active");
        $("ul.tabs li[rel^='" + d_activeTab + "']").addClass("active");

        $('.productSlider, .productSlider-style1').slick('refresh');
    });

    $('ul.tabs li').last().addClass("tab_last");

    /*-----------------------------------
     End Tabs With Accordian Responsive
     -------------------------------------*/

    /*-------------------------------------
     09. Sidebar Categories Level links
     -------------------------------------*/
    function categories_level() {
        $(".sidebar_categories .sub-level a").on("click", function () {
            $(this).toggleClass('active');
            $(this).next(".sublinks").slideToggle("slow");
        });
    }
    categories_level();

    $(".filter-widget .widget-title").on("click", function () {
        $(this).next().slideToggle('300');
        $(this).toggleClass("active");
    });

    /* Blog Pages Sidebar Widget +/- */
    function sidebar_dropdown() {
        $(".blog-sidebar .widget-title").on('click', function () {
            if ($(window).width() < 767) {
                $(this).next().slideToggle();
                $(this).toggleClass("active");
            }
        });
    }
    sidebar_dropdown();

    /*------------------------------------
     10. Price Range Slider
     -------------------------------------*/
    function price_slider() {
        $("#slider-range").slider({
            range: true,
            min: 12,
            max: 200,
            values: [0, 100],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
                " - $" + $("#slider-range").slider("values", 1));
    }
    price_slider();

    /*------------------------------------
     11. Color Swacthes
     -------------------------------------*/
    function color_swacthes() {
        $.each($(".swacth-list"), function () {
            var n = $(".swacth-btn");
            n.on("click", function () {
                $(this).parent().find(n).removeClass("checked");
                $(this).addClass("checked");
            });
        });
    }
    color_swacthes();

    /*------------------------------------
     12. Footer links for mobiles
     -------------------------------------*/
    function footer_dropdown() {
        $(".footer-links .h4").on('click', function () {
            if ($(window).width() < 766) {
                $(this).next().slideToggle();
                $(this).toggleClass("active");
            }
        });
    }
    footer_dropdown();

    //Resize Function 
    var resizeTimer;
    $(window).resize(function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            $(window).trigger('delayed-resize', e);
        }, 250);
    });
    $(window).on("load resize", function (e) {
        if ($(window).width() > 766) {
            $(".footer-links ul").show();
        } else {
            $(".footer-links ul").hide();
        }
    });

    /*---------------------------------
     13. Site Animation
     ----------------------------------*/
    if ($(window).width() < 771) {
        $('.wow').removeClass('wow');
    }
    var wow = new WOW(
            {
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 0, // distance to the element when triggering the animation (default is 0)
                mobile: false, // trigger animations on mobile devices (default is true)
                live: true, // act on asynchronously loaded content (default is true)
                callback: function (box) {
                    // the callback is fired every time an animation is started
                    // the argument that is passed in is the DOM node being animated
                },
                scrollContainer: null // optional scroll container selector, otherwise use window
            }
    );
    wow.init();

    /*---------------------------------
     14. Show Hide Product Tag
     ----------------------------------*/
    $(".product-tags li").eq(10).nextAll().hide();
    $('.btnview').on('click', function () {
        $(".product-tags li").not('.filter--active').show();
        $(this).hide();
    });

    /*---------------------------------
     15. Show Hide Product Filters
     ----------------------------------*/
    $('.btn-filter').on("click", function () {
        $(".filterbar").toggleClass("active");
    });
    $('.closeFilter').on("click", function () {
        $(".filterbar").removeClass("active");
    });
    // Hide Cart on document click
    $("body").on('click', function (event) {
        var $target = $(event.target);
        if (!$target.parents().is(".filterbar") && !$target.is(".btn-filter")) {
            $(".filterbar").removeClass("active");
        }
    });

    /*---------------------------------
     16. Timer Count Down
     ----------------------------------*/
    $('[data-countdown]').each(function () {
        var $this = $(this),
                finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime('<span class="ht-count days"><span class="count-inner"><span class="time-count">%-D</span> <span>Days</span></span></span> <span class="ht-count hour"><span class="count-inner"><span class="time-count">%-H</span> <span>HR</span></span></span> <span class="ht-count minutes"><span class="count-inner"><span class="time-count">%M</span> <span>Min</span></span></span> <span class="ht-count second"><span class="count-inner"><span class="time-count">%S</span> <span>Sc</span></span></span>'));
        });
    });

    /*--------------------------------
     17.Scroll Top
     ---------------------------------*/
    function scroll_top() {
        $("#site-scroll").on("click", function () {
            $("html, body").animate({scrollTop: 0}, 1000);
            return false;
        });
    }
    scroll_top();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $("#site-scroll").fadeIn();
        } else {
            $("#site-scroll").fadeOut();
        }
    });

    /*---------------------------------
     18. Height Product Grid Image
     ----------------------------------*/
    function productGridView() {
        var gridRows = [];
        var tempRow = [];
        productGridElements = $('.grid-products .item');
        productGridElements.each(function (index) {
            if ($(this).css('clear') != 'none' && index != 0) {
                gridRows.push(tempRow);
                tempRow = [];
            }
            tempRow.push(this);

            if (productGridElements.length == index + 1) {
                gridRows.push(tempRow);
            }
        });

        $.each(gridRows, function () {
            var tallestHeight = 0;
            var tallestHeight1 = 0;
            $.each(this, function () {
                $(this).find('.product-image > a').css('height', '');
                elHeight = parseInt($(this).find('.product-image').css('height'));
                if (elHeight > tallestHeight) {
                    tallestHeight = elHeight;
                }
            });

            $.each(this, function () {
                if ($(window).width() > 768) {
                    $(this).find('.product-image > a').css('height', tallestHeight);
                }
            });
        });
    }

    /*-----------------------------
     19. Product details slider 2
     ------------------------------*/
    function product_thumb() {
        $('.product-dec-slider-2').slick({
            infinite: true,
            slidesToShow: 5,
            vertical: true,
            slidesToScroll: 1,
            centerPadding: '60px'
        });
    }
    product_thumb();

    /*-----------------------------
     20. Product details slider 1
     ------------------------------*/
    function product_thumb1() {
        $('.product-dec-slider-1').slick({
            infinite: true,
            slidesToShow: 6,
            stageMargin: 5,
            slidesToScroll: 1
        });
    }
    product_thumb1();

    /*---------------------------
     21. Product Zoom
     ----------------------------*/
    function product_zoom() {
        $(".zoompro").elevateZoom({
            gallery: "gallery",
            galleryActiveClass: "active",
            zoomWindowWidth: 300,
            zoomWindowHeight: 100,
            scrollZoom: false,
            zoomType: "inner",
            cursor: "crosshair"
        });
    }
    product_zoom();

    /*---------------------------
     22. Product Page Popup
     ----------------------------*/
    function video_popup() {
        if ($('.popup-video').length) {
            $('.popup-video').magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        }
    }
    video_popup();

    function size_popup() {
        $('.sizelink').magnificPopup({
            type: 'inline',
            midClick: true,
            mainClass: 'mfp-zoom-in',
            removalDelay: 400
        });
    }
    size_popup();

    function inquiry_popup() {
        $('.emaillink').magnificPopup({
            type: 'inline',
            midClick: true,
            mainClass: 'mfp-zoom-in',
            removalDelay: 400
        });
    }
    inquiry_popup();

    function shippingInfo_popup() {
        $('.shippingInfo').magnificPopup({
            type: 'inline',
            midClick: true,
            mainClass: 'mfp-zoom-in',
            removalDelay: 400
        });
    }
    shippingInfo_popup();

    /*-----------------------------------
     23. Quantity Plus Minus
     ------------------------------------*/
    function qnt_incre() {
        $(".qtyBtn").on("click", function () {
            var qtyField = $(this).parent(".qtyField"),
                    oldValue = $(qtyField).find(".qty").val(),
                    newVal = 1;

            if ($(this).is(".plus")) {
                newVal = parseInt(oldValue) + 1;
            } else if (oldValue > 1) {
                newVal = parseInt(oldValue) - 1;
            }
            $(qtyField).find(".qty").val(newVal);
        });
    }
    qnt_incre();

    /*-----------------------------------
     24. Visitor Fake Message
     ------------------------------------*/
    var userLimit = $(".userViewMsg").attr('data-user'),
            userTime = $(".userViewMsg").attr('data-time');
    $(".uersView").text(Math.floor((Math.random() * userLimit)));
    setInterval(function () {
        $(".uersView").text(Math.floor((Math.random() * userLimit)));
    }, userTime);

    /*-----------------------------------
     25. Product Tabs
     ------------------------------------*/
    $(".tab-content").hide();
    $(".tab-content:first").show();
    /* if in tab mode */
    $(".product-tabs li").on('click', function () {
        $(".tab-content").hide();
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn();

        $(".product-tabs li").removeClass("active");
        $(this).addClass("active");

        $(this).fadeIn();
        if ($(window).width() < 767) {
            var tabposition = $(this).offset();
            $("html, body").animate({scrollTop: tabposition.top}, 700);
        }
    });

    $('.product-tabs li:first-child').addClass("active");
    $('.tab-container h3:first-child + .tab-content').show();

    /* if in drawer mode */
    $(".acor-ttl").on("click", function () {
        $(".tab-content").hide();
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn();

        $(".acor-ttl").removeClass("active");
        $(this).addClass("active");
    });

    $(".reviewLink").on('click', function (e) {
        e.preventDefault();
        $(".product-tabs li").removeClass("active");
        $(".reviewtab").addClass("active");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
        var tabposition = $("#tab2").offset();
        if ($(window).width() < 767) {
            $("html, body").animate({scrollTop: tabposition.top - 50}, 700);
        } else {
            $("html, body").animate({scrollTop: tabposition.top - 80}, 700);
        }
    });

    /*---------------------------------------
     26. Promotion / Notification Cookie Bar 
     ----------------------------------------*/
    function cookie_promo() {
        if (Cookies.get('promotion') != 'true') {
            $(".notification-bar").show();
        }
        $(".close-announcement").on('click', function () {
            $(".notification-bar").slideUp();
            Cookies.set('promotion', 'true', {expires: 1});
            return false;
        });
    }
    cookie_promo();

    /* --------------------------------------
     27. Image to background js
     ----------------------------------------*/
    $(".bg-top").parent().addClass('b-top');
    $(".bg-bottom").parent().addClass('b-bottom');
    $(".bg-center").parent().addClass('b-center');
    $(".bg-left").parent().addClass('b-left');
    $(".bg-right").parent().addClass('b-right');
    $(".bg_size_content").parent().addClass('b_size_content');
    $(".bg-img").parent().addClass('bg-size');
    $(".bg-img.blur-up").parent().addClass('');
    jQuery('.bg-img').each(function () {
        var el = $(this),
                src = el.attr('src'),
                parent = el.parent();

        parent.css({
            'background-image': 'url(' + src + ')',
            'background-size': 'cover',
            'background-position': 'center',
            'background-repeat': 'no-repeat'
        });

        el.hide();
    });
    /* --------------------------------------
     End Image to background js
     ----------------------------------------*/

    /*-----------------------------------
     28. Related Product Slider 
     ------------------------------------*/
    function related_slider() {
        $('.related-product .productSlider').slick({
            dots: false,
            infinite: true,
            item: 5,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    related_slider();

    /*------------------------------------
     29. Infinite Scroll js
     -------------------------------------*/
    function load_more_two() {
        $(".product-two-load-more .item").slice(0, 8).show();
        $(".loadMoreTwo").on('click', function (e) {
            e.preventDefault();
            $(".product-two-load-more .item:hidden").slice(0, 2).slideDown();
            if ($(".product-two-load-more .item:hidden").length == 0) {
                $(".infinitpagin-two").html('<div class="btn loadMoreTwo">no more products</div>');
            }
        });
    }
    load_more_two();

    function load_more_three() {
        $(".product-three-load-more .item").slice(0, 15).show();
        $(".loadMoreThree").on('click', function (e) {
            e.preventDefault();
            $(".product-three-load-more .item:hidden").slice(0, 3).slideDown();
            if ($(".product-three-load-more .item:hidden").length == 0) {
                $(".infinitpagin-three").html('<div class="btn loadMoreThree">no more products</div>');
            }
        });
    }
    load_more_three();

    function load_more_four() {
        $(".product-four-load-more .item").slice(0, 16).show();
        $(".loadMoreFour").on('click', function (e) {
            e.preventDefault();
            $(".product-four-load-more .item:hidden").slice(0, 4).slideDown();
            if ($(".product-four-load-more .item:hidden").length == 0) {
                $(".infinitpagin-four").html('<div class="btn loadMoreFour">no more products</div>');
            }
        });
    }
    load_more_four();

    function load_more_five() {
        $(".product-five-load-more .item").slice(0, 10).show();
        $(".loadMoreFive").on('click', function (e) {
            e.preventDefault();
            $(".product-five-load-more .item:hidden").slice(0, 5).slideDown();
            if ($(".product-five-load-more .item:hidden").length == 0) {
                $(".infinitpagin-five").html('<div class="btn loadMoreFive">no more products</div>');
            }
        });
    }
    load_more_five();

    function load_more_six() {
        $(".product-six-load-more .item").slice(0, 12).show();
        $(".loadMoreSix").on('click', function (e) {
            e.preventDefault();
            $(".product-six-load-more .item:hidden").slice(0, 6).slideDown();
            if ($(".product-six-load-more .item:hidden").length == 0) {
                $(".infinitpagin-six").html('<div class="btn loadMoreSix">no more products</div>');
            }
        });
    }
    load_more_six();

    function load_more_listview() {
        $(".product-listview-load-more .item").slice(0, 7).show();
        $(".loadMoreListview").on('click', function (e) {
            e.preventDefault();
            $(".product-listview-load-more .item:hidden").slice(0, 2).slideDown();
            if ($(".product-listview-load-more .item:hidden").length == 0) {
                $(".infinitpagin-listview").html('<div class="btn loadMoreListview">no more products</div>');
            }
        });
    }
    load_more_listview();

    function load_more_post() {
        $(".blog--grid-load-more .article").slice(0, 3).show();
        $(".loadMorepost").on('click', function (e) {
            e.preventDefault();
            $(".blog--grid-load-more .article:hidden").slice(0, 1).slideDown();
            if ($(".blog--grid-load-more .article:hidden").length == 0) {
                $(".loadmore-post").html('<div class="btn loadMorepost">No more Blog Post</div>');
            }
        });
    }
    load_more_post();
    /*-----------------------------------
     End Infinite Scroll js
     ------------------------------------*/

    /*---------------------------------
     30. Category Slidershow
     ----------------------------------*/
    function category_slideshow() {
        $('.category-slideshow').slick({
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 4000,
            lazyLoad: 'ondemand',
            adaptiveHeight: true
        });
    }
    category_slideshow();

    /*-----------------------------
     31. Quickview Slide Products 
     ------------------------------*/
    function quickview_thumbnails_products() {
        $('.quickview-thumbnails-single').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: false,
            infinite: false,
            speed: 1000,
            asNavFor: '.quickview-thumbnail-items'
        });

        $('.quickview-thumbnail-items').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: '.quickview-thumbnails-single',
            speed: 1000,
            dots: false,
            arrows: true,
            centerMode: false,
            focusOnSelect: true
        });

        $('.quick-view-popup').on('click', function (e) {
            $('.quickview-thumbnails-single').resize();
        });
    }
    quickview_thumbnails_products();

    /*---------------------------------
     32. Shop Siderbar Products
     ----------------------------------*/
    function shop_sidebar_products() {
        $('.shop-sidebar-products').slick({
            dots: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 7000,
            speed: 600,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true
        });
    }
    shop_sidebar_products();

    /*-----------------------------------
     * 33. Magnific Popup
     * ----------------------------------*/
    function quick_view_popup() {
        $('.quick-view-popup').magnificPopup({
            type: 'inline',
            mainClass: 'mfp-fade',
            preloader: false,
            midClick: true
        });
    }
    quick_view_popup();

    function addtocart_view_popup() {
        $('.open-addtocart-popup').magnificPopup({
            type: 'inline',
            mainClass: 'mfp-fade',
            preloader: false,
            midClick: true
        });
    }
    addtocart_view_popup();

    function wishlist_view_popup() {
        $('.open-wishlist-popup').magnificPopup({
            type: 'inline',
            mainClass: 'mfp-fade',
            preloader: false,
            midClick: true
        });
    }
    wishlist_view_popup();

    /*---------------------------------
     34. Product Suggestion slider
     ----------------------------------*/
    function product_suggestion_slider() {
        $('.product-suggestion').slick({
            dots: false,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 3000,
            infinite: true,
            fade: true,
            cssEase: 'linear',
            slidesToShow: 1,
            adaptiveHeight: true
        });
    }
    product_suggestion_slider();

    /*------------------------------------
     35. Tooltip
     -------------------------------------*/
    function tooltip() {
        if ($(window).width() > 991) {
            // $('[data-toggle="tooltip"]').tooltip();
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    trigger: 'hover'
                });
            });
        }
    }
    tooltip();

    /*------------------------------------
     36. Write Review Toggle Box
     -------------------------------------*/
    function write_review() {
        $(".write-review-btn").click(function (e) {
            $('.write-review-btn').toggleClass('active');
            $(".product-review-form").slideToggle();
            e.preventDefault();
        });
    }
    write_review();

    /*------------------------------------
     37. Nice Select
     -------------------------------------*/
    function nice_select() {
        $('select').niceSelect();
    }
    nice_select();

    /*------------------------------------
     38. Image Swacthes
     -------------------------------------*/
    function img_swacthes() {
        var selector = '.swatches li';
        $(selector).on('click', function () {
            $(selector).removeClass('active');
            $(this).addClass('active');
        });
    }
    img_swacthes();

    /*------------------------------------
     39. Background Parallax image
     -------------------------------------*/
    function background_parallax_img() {
        var parallax = -0.5;
        var $bg_images = $(".background-parallax");
        var offset_tops = [];
        $bg_images.each(function (i, el) {
            offset_tops.push($(el).offset().top);
        });

        $(window).scroll(function () {
            var dy = $(this).scrollTop();
            $bg_images.each(function (i, el) {
                var ot = offset_tops[i];
                $(el).css("background-position", "50% " + (dy - ot) * parallax + "px");
            });
        });
    }
    background_parallax_img();

})(jQuery);

