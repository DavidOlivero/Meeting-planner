const { invoke } = window.__TAURI__.tauri

render_value = true

const delete_elements = () => {
    $(".i-elements").each(function () {        
        this.remove()
    })
}

const set_left_date = () => {
    evaluate_by_date(function (time_left) {
        const element = $("#" + data.id.replace(/ /g, "-")).find("div")

        if (time_left[0] > 0) {
            element.append(`
            <div class=left-date-info>
                <p>Restan ${time_left[0]} ${time_left[0] === 1 ? "año" : "años"} y ${Math.abs(time_left[1])} ${Math.abs(time_left[1]) === 1 ? "mes" : "meses"}</p>
            </div>
            `);
        } else if (time_left[0] === 0 && Math.abs(time_left[1]) > 0) {
            element.append(`
            <div class=left-date-info>
                <p>Restan ${Math.abs(time_left[1])} ${Math.abs(time_left[1]) === 1 ? "mes" : "meses"}</p>
            </div>
            `)
        } else {
            element.append(`
            <div class=left-date-info>
                <p>Restan ${Math.abs(time_left[2])} ${Math.abs(time_left[2]) === 1 ? "día" : "días"}</p>
            </div>
            `)
        }
    }, true)
}

const set_delay_time = () => {
    evaluate_by_date(function (time_left) {
        const element = $("#" + data.id.replace(/ /g, "-")).find("div")
        if (time_left[0] < 0) {
            element.append(`
            <div class=delay-date-info>
                <p>De hace ${time_left[0]} ${time_left[0] === 1 ? "año" : "años"} y ${Math.abs(time_left[1])} ${Math.abs(time_left[1]) === 1 ? "mes" : "meses"}</p>
            </div>
            `);
        } else if (time_left[0] === 0) {
            element.append(`
            <div class=delay-date-info>
                <p>De hace ${Math.abs(time_left[1])} ${Math.abs(time_left[1]) === 1 ? "mes" : "meses"}</p>
            </div>
            `)
        } else {
            element.append(`
            <div class=delay-date-info>
                <p>De hace ${Math.abs(time_left[2])} ${Math.abs(time_left[2]) === 1 ? "día" : "días"}</p>
            </div>
            `)
        }
    }, false)
}

$(document).ready(() => {
    const search_input = $("#search")
    const unresult = $("#unresult")
    const search_button =  $("#search-button")
    const glass = $(".fa-magnifying-glass")
    let elements

    search_button.click(() => { 
        const text = search_input.val().toLowerCase()

        if (text) {
            let i = 0
            elements.each(function () {
                const element = $(this)
                const p_element = element.find(".id")
                const text = p_element.text().toLowerCase()
                
                if (text.includes(search_input.val().toLowerCase())) {
                    element.css("visibility", "visible")
                } else {
                    element.css("display", "none")
                    i++
                }
            })
            
            if (i === elements.length) {
                unresult.show()
            } else {
                unresult.hide()
            }
        }
    })

    $(".fa-circle-xmark").click(() => {
        search_input.val("")
        elements.each(function () {
            $(this).css("display", "block")
            $(this).css("display", "flex")
            unresult.hide()
        })
    })

    search_button.hover(() => {
        search_button.css("cursor", "pointer")
        search_button.animate({
            backgroundColor: "#004c9c"
        }, 50)
        glass.animate({
            backgroundColor: "#004c9c"
        }, 50)
    }, () => {
        search_button.animate({
            backgroundColor: "#0D76E5"
        }, 50)
        glass.animate({
            backgroundColor: "##0D76E5"
        }, 50)
    })

    $(window).on("storage", (event) => {
        if (event.originalEvent.key === "Meetings") {
            meetings = JSON.parse(localStorage.getItem("Meetings"))
            render_elements()
            update_empity()
            delete_elements()
            set_left_date()
            set_delay_time()

            elements = $(".element")
        }
    })

    $(document).on("click", ".element", function () {
        const element_id = $(this).find(".id").text()
        const info = $("#info")
        const element_info = meetings[element_id.replace(/ /g, "_")][1]
        const all_elements = $("body").children().not(info);

        info.find("h3").remove()
        info.find("div").remove()
        info.append(`
        <h3>${element_id}</h3>
        <div id=name>
            <p><strong>Nombre del conferenciante</strong></p>
            <p>${element_info.name}</p>
        </div>
        <div id=sketch>
            <p><strong>Bosquejo</strong></p>
            <p>${element_info.sketch}</p>
        </div>
        <div id=congregation>
            <p><strong>Congregación</strong></p>
            <p>${element_info.congregation}</p>
        </div>
        <div id=date>
            <p><strong>Fecha</strong></p>
            <p>${element_info.date}</p>
        </div>
        `)
        info.fadeIn()

        all_elements.addClass("inactive");
        all_elements.css("pointer-events", "none")

        $("#close").click(() => {
            info.fadeOut()
            all_elements.removeClass("inactive");
            all_elements.css("pointer-events", "auto")
        })
    })

    render_elements()
    update_empity()
    delete_elements()
    set_left_date()
    set_delay_time()

    elements = $(".element")
})