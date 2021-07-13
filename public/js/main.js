$(document).ready(function () {
    'use strict';
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });
    $('#menuz').click(function () {
        $('.user').toggleClass('user-toggle');
    });
    $('#user').click(function () {
        $('.user').toggleClass('user-toggle');
    });

    window.onscroll = function () { myFunction() };

    var header = document.getElementById("header-2");
    var sticky = header.offsetTop;

    function myFunction() {
        if (window.pageYOffset > sticky) {
            header.classList.add("header-active");
        } else {
            header.classList.remove("header-active");
        }
    }

    $('.control .button').click(function (e) {
        $(this).addClass('button-active').siblings().removeClass('button-active');

        let filter = $(this).attr('data-filter');

        if (filter == 'all') {

            $('.property .image').show(400);

        } else {
            $('.property .image ').not('.' + filter).hide(200);
            $('.property .image ').filter('.' + filter).show(400);
        }


    });


});
