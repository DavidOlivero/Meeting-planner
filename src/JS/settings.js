const { invoke } = window.__TAURI__.tauri

const save_contact = (add_number_input, add_name) => {
    if(add_number_input.val()) {
        if (typeof add_number_input.val() === "number") {
            add_name.css("visibility", "visible")
    
            opacity_efect("#add-name", true)
        } else {
            alert("El número de contacto proporcionado no es válido")
        }
    }
}

$(document).ready(() => {
    const theme = $("#theme")
    const WhatSapp = $("#WhatSapp")
    const user_settings = $("#user-settings")

    const theme_option = $("li:contains('Apariencia')")
    const light_button = $("#light")
    const dark_button = $("#dark")

    const WhatSapp_option = $("li:contains('WhatSapp')")
    const user_settings_option = $("li:contains('Configuraciones de usuario')")

    const add_number_input = $("#contact input")
    const edit_contact = $("#edit-contact")
    const add_name = $("#add-name")

    const contact_name = $("#contact-name")
        const contact_number = $("#contact-number")
    let position
    
    theme_option.click( function () {
        theme.show()
        WhatSapp.hide()
        user_settings.hide()
    })

    WhatSapp_option.click( function () {        
        WhatSapp.show()
        theme.hide()
        user_settings.hide()
    })

    user_settings_option.click(() => {
        user_settings.show()
        WhatSapp.hide()
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

    $("#send-user-name").click(() => {
        const user = $("#user-name")
        const tell_input = $("#tell")
        
        if (user.val() && tell_input.val()) {
            localStorage.setItem("User_name", user.val())
            user.val("")
    
            user_name = localStorage.getItem("User_name")

            localStorage.setItem("Tell", tell_input.val())
            tell_input.val("")

            tell = localStorage.getItem("Tell")
        } else if (user.val()) {
            localStorage.setItem("User_name", user)
            user.val("")
    
            user_name = localStorage.getItem("User_name")
        } else if (tell_input.val()) {
            localStorage.setItem("Tell", tell_input.val())
            tell_input.val("")

            tell = localStorage.getItem("Tell")
        }
    })

    $(".fa-plus").click(() => {
        save_contact(add_number_input, add_name)
    })

    $(document).keydown((event) => {
        if (event.keyCode === 13) {
            save_contact(add_number_input, add_name)
        }
    })

    $("#send").click(() => {
        const name_input = $("#add-name input")
        
        if (name_input.val()) {
            number.push(add_number_input.val() + "/" + name_input.val())

            add_number_input.val("")
            localStorage.setItem("Contacts", JSON.stringify(number))
            number = JSON.parse(localStorage.getItem("Contacts"))

            name_input.val("")
            add_name.css("visibility", "hidden")

            opacity_efect("#add-name", false)

            render_contacts()
        } else {
            alert("Debe agregarle un nombre al contacto")
        }
    })

    $(".close").click(function () {
        const element = $(this).parent()
        
        element.css("visibility", "hidden")
        opacity_efect(element, false)

        add_number_input.val("")
    })

    $(document).on("click", ".fa-share", function () {
        const id = $(this).parent().parent().attr("id").trim().replace(/-/g, " ")
        let tell

        number.forEach((element) => {
            if (element.includes(id)) {
                tell = element.split("/")[0]
            }
        })

        const message = encodeURIComponent(`Hola hermano soy ${user_name} el organizador de conferencias de la Congregación Central le escribo para que guarde este contacto en su celular por medio de este link y le da a enviar a ese mensaje que está allí, lo que pasa es que nosotros manejamos un programa para cistematizar la tarea de organizar las reuniones y por medio de ese contacto el programa manda los recordatorios de las conferencias a los hermanos, por eso necesita que tenga ese contacto guardado. ¡Gracias! https://wa.me/+14155238886?text=join%20nervous-shirt`)
        
        const url = `https://wa.me/${tell}?text=${message}`
        window.open(url)
    })

    $(document).on("click", ".fa-file-pen", function () {
        const id = $(this).parent().parent().attr("id")

        number.forEach((value, index) => {
            if (value.includes(id.replace(/-/g, " "))) {
                const elements = value.split("/")
                contact_number.val(elements[0])
                contact_name.val(elements[1])

                position = index
                return
            }
        })

        edit_contact.css("visibility", "visible")
        opacity_efect("#edit-contact", true)
    })

    $("#send-edit").click(() => {
        number[position] = contact_number.val() + "/" + contact_name.val()
        localStorage.setItem("Contacts", JSON.stringify(number))

        contact_name.val("")
        contact_number.val("")

        edit_contact.css("visibility", "hidden")
        opacity_efect("#edit-contact", false)

        render_contacts()
    })

    $(document).on("click", ".fa-trash-can", function () {
        confirm("Está seguro de que descea eliminar el contacto")
            .then((value) => {
                if (value) {
                    const text = $(this).closest("li").attr("id").trim().replace(/-/g, " ")
                    
                    const criterion = (element) => {
                        return element.includes(text)
                    }

                    const index = number.findIndex(criterion)
                    number.splice(index, 1)
                    localStorage.setItem("Contacts", JSON.stringify(number))

                    render_contacts()
                }
            })
    })

    render_contacts()
})