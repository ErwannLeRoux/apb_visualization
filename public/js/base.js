$(document).ready(function() {
    $links = $(".nav-item")
    let currentPage = window.location.href
    console.log($links)

    if(currentPage.startsWith("http://127.0.0.1:8080/departments")) {
        $links.each(function(index) {
            $(this).removeClass("active")
            if(index === 0) {
                $(this).addClass("active")
            }
        })

    } else if(currentPage.startsWith("http://127.0.0.1:8080/schools")) {
        $links.each(function(index) {
            $(this).removeClass("active")
            if(index === 1) {
                $(this).addClass("active")
            }
        })

    } else if(currentPage.startsWith("http://127.0.0.1:8080/formations")) {
        $links.each(function(index) {
            $(this).removeClass("active")
            if(index === 2) {
                $(this).addClass("active")
            }
        })

    }
})
