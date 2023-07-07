const { invoke } = window.__TAURI__.tauri

async function open_meeting_info() {
  await invoke("open_meeting_info", {  })
}

const feature = () => {
  $("#" + data.id.replace(/ /g, "-")).css("display", "none")
}

$(document).ready(() => {
  const name_input = $("#name")
  const sketch_input = $("#sketch")
  const congregation_input = $("#congregation")
  const date_input = $("#date")
  const id_input = $("#id")
  const register_window = $("#register")
  const desactivated_elements = $("body").children().not(register_window)

  let old_id
  let old_date
  const show_register = (id=null) => {
    if (id === null) {
      name_input.val("")
      sketch_input.val("")
      congregation_input.val("")
      date_input.val("")
      id_input.val("")

      old_id = undefined
      old_date = undefined
    } else {
      const values = JSON.parse(localStorage.getItem("Meetings"))[id][1]
      name_input.val(values.name)
      sketch_input.val(values.sketch)
      congregation_input.val(values.congregation)
      date_input.val(values.date)
      id_input.val(values.id)

      old_id = id_input.val().replace(/ /g, "_")
      old_date = date_input.val()
    }

    register_window.fadeIn();
    desactivated_elements.addClass("inactive")
    desactivated_elements.css("pointer-events", "none")
  }

  const hide_register = () => {
    register_window.fadeOut()
    desactivated_elements.removeClass("inactive")
    desactivated_elements.css("pointer-events", "auto")
  }

  const delete_element = (id) => {
    delete meetings[id.replace(/-/g, "_")]
    localStorage.setItem("Meetings", JSON.stringify(meetings))
    render_elements()
    update_empity()
    evaluate_by_date(feature, false)
  }

  const confirm_delete = (id) => {
    confirm("Está seguro de que desea eliminar la reunión.")
      .then((confirmed) => {
        if (confirmed) {
          delete_element(id)
        }
      })
  }

  $(".fa-circle-info").click(() => {
    open_meeting_info()
  })

  $(".fa-plus").click(() => {
    show_register()
  })

  $("#cancel").click(() => {
    hide_register()
  })

  $("#save").click(() => {
    const name = name_input.val()
    const sketch = sketch_input.val()
    const congregation = congregation_input.val()
    const date = date_input.val()
    const id = id_input.val()

    const value = old_id === undefined

    if (name && sketch && congregation && date && id && value) {
      let comprobate = false
      Object.values(meetings).forEach((val) => {
        if (val[0].includes(id.replace(/ /g, "-"))) {
          comprobate = true
          return
        }
      })

      if (!comprobate) {
        const code = `<li class="element" id=${id.replace(/ /g, "-")}>
                        <div>
                          <p class="id">${id}</p>
                          <p class="date">${date}</p>
                        </div>
                        <div class="i-elements">
                          <i class="fa-solid fa-file-pen"></i>
                          <i class="fa-solid fa-trash-can"></i>
                        </div>
                      </li>`
        
        const data = {
          name: name,
          sketch: sketch,
          congregation: congregation,
          date: date,
          id: id
        }
  
  
        meetings[id.replace(/ /g, "_")] = [code, data]
  
        localStorage.setItem("Meetings", JSON.stringify(meetings))
        render_elements()
        update_empity()
        evaluate_by_date(feature, false)
        hide_register()
      } else {
        alert("El elemento ya existe, si se trata de otra persona o de " + 
        "datos distintos, considere cambiar el nombre del identificador")
      }
    } else if (!value) {
      const old_data = JSON.stringify(meetings[old_id][1])
      let new_data = {
        name: name,
        sketch: sketch,
        congregation: congregation,
        date: date,
        id: id
      }

      new_data = JSON.stringify(new_data)

      let new_meetings = JSON.stringify(meetings)
      new_meetings = new_meetings.replace(old_id, id.replace(/ /g, "_"))
      new_meetings = new_meetings.replace(old_id.replace(/_/g, "-"), id.replace(/ /g, "-"))
      new_meetings = new_meetings.replace(old_id.replace(/_/g, " "), id)
      new_meetings = new_meetings.replace(old_date, date)
      new_meetings = new_meetings.replace(old_data, new_data)

      meetings = JSON.parse(new_meetings)
      console.log(meetings)

      localStorage.setItem("Meetings", new_meetings)
      render_elements()
      update_empity()
      evaluate_by_date(feature, false)
      hide_register()
    } else {
      alert("Debes llenar todos los campos antes de continuar.")
    }
  })

  $(document).on("click", ".fa-trash-can", function () {
    const element = $(this).closest(".element")
    const id = element.find(".id").text().replace(/\n/, "").trim().replace(/ /g, "-")
    confirm_delete(id)
  })

  $(document).on("click", ".fa-file-pen", function () {
    const id = $(this).closest(".element").find(".id").text().replace(/\n/, "").trim().replace(/ /g, "_")
    show_register(id)
  })

  $("#date").datepicker()
  render_elements()
  update_empity()
  evaluate_by_date(feature, false)
})
