const { invoke } = window.__TAURI__.tauri

$(document).ready(() => {
    const theme = $("#theme")
    const WhatSapp = $("#WhatSapp")

    const theme_option = $("li:contains('Apariencia')")
    const light_button = $("#light")
    const dark_button = $("#dark")

    const WhatSapp_option = $("li:contains('WhatSapp')")
    const add_number_input = $("#add-contact input")
    
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
})