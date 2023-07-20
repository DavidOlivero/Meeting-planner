const { invoke } = window.__TAURI__.tauri
let number = JSON.parse(localStorage.getItem("Contacts")) || []

const save_contact = () => {
    const add_number_input = $("#contact input")
    
    if(add_number_input.val()) {
        number.push(add_number_input.val())
        add_number_input.val("")
        localStorage.setItem("Contacts", JSON.stringify(number))
        number = JSON.parse(localStorage.getItem("Contacts"))

        render_contacts()
    }
}

const render_contacts = () => {
    const number_list = $("#number-list")
    number_list.empty()

    number.forEach(element => {
        number_list.append(`<li>${element} <i class="fa-solid fa-trash-can"></i></li>`)
    })

    $(document).on("mouseenter", "#number-list li", function () {
        $(this).find(".fa-trash-can").show()
    })

    $(document).on("mouseleave", "#number-list li", function () {
        $(this).find(".fa-trash-can").hide()
    })
}

$(document).ready(() => {
    const theme = $("#theme")
    const WhatSapp = $("#WhatSapp")

    const theme_option = $("li:contains('Apariencia')")
    const light_button = $("#light")
    const dark_button = $("#dark")

    const WhatSapp_option = $("li:contains('WhatSapp')")
    
    theme_option.click( function () {
        theme.show()
        WhatSapp.hide()
    })

    WhatSapp_option.click( function () {        
        WhatSapp.show()
        theme.hide()
    })
    
    light_button.click(() => {
        localStorage.setItem("Theme", "light")
        location.reload()
    })

    dark_button.click(() => {
        localStorage.setItem("Theme", "dark")
        location.reload()
    })

    $(".fa-plus").click(() => {
        save_contact()
    })

    $(document).keydown((event) => {
        if (event.keyCode === 13) {
            save_contact()
        }
    })

    $(document).on("click", ".fa-trash-can", function () {
        const text = $(this).closest("li").text().trim()
        const index = number.indexOf(text)
        number.splice(index, 1)
        localStorage.setItem("Contacts", JSON.stringify(number))
        render_contacts()
    })

    render_contacts()
})