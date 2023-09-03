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
    const search = $("#search").val().toLowerCase()

        if (search) {
            let i = 0
            $(".element").each(function () {
                const element = $(this)
                const id = element.find(".id").text().toLowerCase()

                if (id.includes(search)) {
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
        const element = $("#" + data.id.replace(/ /g, "-").replace(/\//g, "-").replace(/\./g, "-")).find("div")

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
        } else if(localStorage.length === 0) location.reload()
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
        <div id=president>
            <p><strong>Presidente</strong></p>
            <p>${element_info.president}</p>
        </div>
        <div id=reader>
            <p><strong>Lector</strong></p>
            <p>${element_info.reader}</p>
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

    $(".fa-filter").click(() => {
        const filter = $("#filter")
        const form = $("input[type='text'], input[type='date']").not("#search")
        form.each(function () {$(this).val("")})
        
        filter.fadeIn()
        opacity_efect("#filter", true)

        $("#done").click(() => {
            const val = $(".element")
            let info = {}

            form.each(function () {
                const element = $(this)
                const id = element.attr("id")
                info[id] = element.val()
            })

            let i = 0
            val.each(function () {
                const id_val = $(this).attr("id")
                let data

                Object.values(meetings).forEach(element => {
                    if (id_val.includes($(element[0]).attr("id"))) {
                        data = element[1]
                    }                 
                })
                
                if (info.name && !data.name.toLowerCase().includes(info.name.toLowerCase())) {
                    element.hide()
                    i++
                }
                if (info.sketch && !data.sketch.toLowerCase().includes(info.sketch.toLowerCase())) {
                    element.hide()
                    i++
                }
                if (info.congregation && !data.congregation.toLowerCase().includes(info.congregation.toLowerCase())) {
                    element.hide()
                    i++
                }
                if (info.date1 && info.date2) {
                    const date1_info = info.date1.split("-")
                    const date2_info = info.date2.split("-")
                    const date1 = new Date(date1_info[0], parseInt(date1_info[1] - 1), date1_info[2])
                    const date2 = new Date(date2_info[0], parseInt(date2_info[1] - 1), date2_info[2])

                    const date_seach = data.date.split("/")
                    const full_date = new Date(date_seach[2], parseInt(date_seach[0] - 1), date_seach[1])

                    if (full_date < date1 || full_date > date2) {
                        element.hide()
                        i++
                    }
                } else if (info.date1 && !info.date2 || !info.date1 && info.date2) {
                    alert("Si está intentando filtral por fechas, asegúrese de colocar el rango de fechas completa.")
                    return false
                }
            })

            filter.fadeOut()
            opacity_efect("#filter", false)

            if (i ===  $(".element").length) {
                $("#unresult").show()
            } else {
                $("#unresult").hide()
            }
        })

        $("#controls, close").click(() => {
            filter.fadeOut()
            opacity_efect("#filter", false)
        })
    })

    delete_old_meetings()
    render_elements()
    update_empity()
    delete_icons_trash_edit()
    set_left_date()
    set_delay_time()
})