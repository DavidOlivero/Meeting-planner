const { invoke } = window.__TAURI__.tauri
let number = JSON.parse(localStorage.getItem("Contacts")) || []

const save_contact = () => {
    const add_number_input = $("#contact input")
    const add_name = $("#add-name")
    const name_input = $("#add-name input")
    
    if(add_number_input.val()) {
        add_name.css("visibility", "visible")

        $("#send").click(() => {
            console.log(name_input)
            if (name_input.val()) {
                number.push(add_number_input.val() + "/" + name_input.val())

                add_number_input.val("")
                localStorage.setItem("Contacts", JSON.stringify(number))
                number = JSON.parse(localStorage.getItem("Contacts"))

                name_input.val("")
                add_name.css("visibility", "hidden")

                render_contacts()
            } else {
                alert("Debe agregarle un nombre al contacto")
            }
        })
    }
}

const render_contacts = () => {
    const number_list = $("#number-list")
    number_list.empty()

    number.forEach(element => {
        const info = element.split("/")

        number_list.append(`<li>${info[1]} <div><i class="fa-solid fa-file-pen"></i> <i class="fa-solid fa-trash-can"></i></div></li>`)
    })

    $(document).on("mouseenter", "#number-list li", function () {
        $(this).find("i").show()
    })

    $(document).on("mouseleave", "#number-list li", function () {
        $(this).find("i").hide()
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
        confirm("Está seguro de que descea eliminar el contacto")
            .then((value) => {
                if (value) {
                    const text = $(this).closest("li").text().trim()
                    const index = number.indexOf(text)
                    number.splice(index, 1)
                    localStorage.setItem("Contacts", JSON.stringify(number))
                    render_contacts()      
                }
            })
    })

    render_contacts()
})