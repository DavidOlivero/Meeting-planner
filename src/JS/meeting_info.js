const { invoke } = window.__TAURI__.tauri

render_value = true

// Delete all meetings past year and a half
const delete_old_meetings = () => {
    Object.values(meetings).forEach((element) => {
        const id = element[1].id.replace(/ /g, "_")
        const month = element[1].date.split("/")[0]
        const year = element[1].date.split("/")[2]

        const currently_month = new Date().getMonth() + 1
        const currently_year = new Date().getFullYear()

        if ((currently_year - year) === 1 && Math.abs((year - currently_year) * 12 + (month - currently_month)) >= 6) {
            delete meetings[id]
            localStorage.setItem("Meetings", JSON.stringify(meetings))
        }
    })
}


// Delete all incons trash and edit from main window meetings
const delete_icons_trash_edit = () => {
    $(".i-elements").each(function () {
        this.remove()
    })
}

const search_function = () => {
    const text = $("#search").val().toLowerCase()

        if (text) {
            let i = 0
            $(".element").each(function () {
                const element = $(this)
                const p_element = element.find(".id")
                const text = p_element.text().toLowerCase()

                if (text.includes($("#search").val().toLowerCase())) {
                    element.css("visibility", "visible")
                } else {
                    element.css("display", "none")
                    i++
                }
            })

            if (i ===  $(".element").length) {
                $("#unresult").show()
            } else {
                $("#unresult").hide()
            }
        }
}

const set_left_date = () => {
    evaluate_by_date(function (time_left) {
        const element = $("#" + data.id.replace(/ /g, "-")).find("div")

        if (time_left[0] > 0) {
            element.append(`
            <div class=left-date-info>
                <p>Restan ${time_left[0]} ${time_left[0] === 1 ? "año" : "años"} y ${(time_left[1])} ${(time_left[1]) === 1 ? "mes" : "meses"}</p>
            </div>
            `);
        } else if (time_left[0] === 0 && (time_left[1]) > 0) {
            element.append(`
            <div class=left-date-info>
                <p>Restan ${(time_left[1])} ${(time_left[1]) === 1 ? "mes" : "meses"}</p>
            </div>
            `)
        } else {
            element.append(`
            <div class=left-date-info>
                <p>Restan ${(time_left[2])} ${(time_left[2]) === 1 ? "día" : "días"}</p>
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
                <p>De hace ${Math.abs(time_left[0])} ${Math.abs(time_left[0]) === 1 ? "año" : "años"} y ${time_left[1]} ${time_left[1] === 1 ? "mes" : "meses"}</p>
            </div>
            `)
        } else if (time_left[0] === 0 && time_left[1] !== 0) {
            element.append(`
            <div class=delay-date-info>
                <p>De hace ${time_left[1]} ${time_left[1] === 1 ? "mes" : "meses"}</p>
            </div>
            `)
        } else {
            if (time_left[2] > 6) {
                const week = Math.floor(time_left[2] / 7)
                const days = time_left[2] % 2 !== 0 ? time_left[2] % 2 : ""

                element.append(`
                <div class=delay-date-info>
                    <p>De hace ${week} ${week === 1 ? "semana" : "semanas"} ${days !== "" ? "y" : ""} ${days} ${days !== "" ? days === 1 ? "día" : "días" : ""}</p>
                </div>
                `)
            } else {
                element.append(`
                <div class=delay-date-info>
                    <p>De hace ${time_left[2]} ${time_left[2] === 1 ? "día" : "días"}</p>
                </div>
                `)
            }
        }
    }, false)
}

$(document).ready(() => {
    const search_button =  $("#search-button")
    const glass = $(".fa-magnifying-glass")

    search_button.click(() => {
        search_function()
    })

    $(document).keydown((event) => {
        if (event.keyCode === 13) {
            search_function()
        }
    })

    $(".fa-circle-xmark").click(() => {
        $("#search").val("")
        $(".element").each(function () {
            $(this).css("display", "block")
            $(this).css("display", "flex")
            $("#unresult").hide()
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
            delete_old_meetings()
            render_elements()
            update_empity()
            delete_icons_trash_edit()
            set_left_date()
            set_delay_time()
        }
    })

    $(document).on("click", ".element", function () {
        const element_id = $(this).find(".id").text()
        const info = $("#info")
        const search_area = $("#search-area")
        const element_info = meetings[element_id.replace(/ /g, "_")][1]
        const all_elements = "#search-area, #info"
        search_area.css("z-index", "800")
        search_area.css("pointer-events", "none")

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

        opacity_efect(all_elements, true)

        $("#close").click(() => {
            info.fadeOut()
            
            opacity_efect(all_elements, false)

            search_area.css("pointer-events", "auto")
        })
    })

    delete_old_meetings()
    render_elements()
    update_empity()
    delete_icons_trash_edit()
    set_left_date()
    set_delay_time()
})