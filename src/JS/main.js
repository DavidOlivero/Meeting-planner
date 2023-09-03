const { invoke } = window.__TAURI__.tauri

async function open_meeting_info() {
  await invoke("open_meeting_info", {  })
}

async function open_settings() {
  await invoke("open_settings", { })
}

async function generate_pdf() {
  await invoke("open_pdffile", { })
}

const feature = () => {
  $("#" + data.id.replace(/ /g, "-")).remove()
}

const close_contacts = (contacts) => {
  contacts.fadeOut()

  opacity_efect("#choose-contacts, .module", false)

  $(".contact").each(function () {
    $(this).attr("class", "contact off")
  })
}

const send_whatsapp = (contacts_for_send, default_message, message_box) => new Promise((resolve, _rejec) => {
  let promises = [] // Array fore save all promeises created in the fetch
  
  contacts_for_send.forEach((number) => {
    let message
    const custom_message = message_box.val()

    if (custom_message) {
      message = "Your appointment is coming up on July 21 at 3PM 👉 " + custom_message + " Recuerde que mi número es este " + tell + " 👈"
    } else {
      message = "Your appointment is coming up on July 21 at 3PM 👉 " + default_message + " Recuerde que mi número es este " + tell + " 👈"
    }
    
    const url = 'https://api.twilio.com/2010-04-01/Accounts/AC783e1d81f12583c95f6c6d126ce21c85/Messages.json';
    const data = new URLSearchParams({
        To: `whatsapp:+57${number}`,
        From: 'whatsapp:+14155238886',
        Body: message,
    });

    // Saved all promises in de array
    promises.push(
      fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `Basic ${btoa(`AC783e1d81f12583c95f6c6d126ce21c85:${window.TOKEN}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data
      })
      .then(() => true)
      .catch(() => false)
    )
  })

  // Way to all promises is done
  Promise.all(promises)
    .then(results => {
      const done_message = results.every(result => result)
      resolve(done_message)
    })
    .catch(() => {
      alert("Ha ocurrido un error al tratar de enviar el mensaje asegúrese de que cuenta con conección a internet")
    })
})

$(document).ready(() => {
  const name_input = $("#name")
  const sketch_input = $("#sketch")
  const congregation_input = $("#congregation")
  const date_input = $("#date")
  const president_input = $("#president")
  const reader_input = $("#reader")
  const id_input = $("#id")
  const register_window = $("#register")
  const contacts = $("#choose-contacts")
  let id_for_extract_meeting_info

  if (user_name === "") {
    $("#get-name").css("visibility", "visible")
    opacity_efect("#get-name", true)
  }

  let old_id
  let old_date
  const show_register = (id=null) => {
    if (id === null) {
      name_input.val("")
      sketch_input.val("")
      congregation_input.val("")
      date_input.val("")
      president_input.val("")
      reader_input.val("")
      id_input.val("")

      old_id = undefined
      old_date = undefined
    } else {
      const values = JSON.parse(localStorage.getItem("Meetings"))[id][1]
      name_input.val(values.name)
      sketch_input.val(values.sketch)
      congregation_input.val(values.congregation)
      date_input.val(values.date)
      president_input.val(values.president)
      reader_input.val(values.reader)
      id_input.val(values.id)

      old_id = id_input.val().replace(/ /g, "_")
      old_date = date_input.val()
    }

    register_window.fadeIn();
    opacity_efect("#register, #ui-datepicker-div", true)
  }

  const hide_register = () => {
    register_window.fadeOut()
    opacity_efect("#register", false)
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

  $(".fa-gear").click(() => {
    open_settings()
  })

  $(".fa-plus").click(() => {
    show_register()
  })

  $("#cancel").click(() => {
    hide_register()
  })

  $(document).on("click", ".fa-whatsapp", function () {
    id_for_extract_meeting_info = $(this).closest(".element").attr("id").trim().replace(/-/g, "_")
    contacts.fadeIn()
    opacity_efect("#choose-contacts, .module, #message-form", true)
  })

  $("#send-user-name").click(() => {
    const user = $("#user-name").val()
    const phone = $("#tell").val()
    const cong = $("#cong").val()
    
    if (user && phone && cong) {
      $("#get-name").css("visibility", "hidden")
      opacity_efect("#get-name", false)
      
      localStorage.setItem("User_name", user)
      localStorage.setItem("Tell", phone)
      localStorage.setItem("Congregation", cong)
      user_name = localStorage.getItem("User_name")
      tell = localStorage.getItem("Tell")
      congregation = localStorage.getItem("Congregation")
    } else {
      alert("Debe llenar todos los campos antes de continuar")
    }
  })

  $("#save").click(() => {
    const name = name_input.val()
    const sketch = sketch_input.val()
    const congregation = congregation_input.val()
    const date = date_input.val()
    const president = president_input.val()
    const reader = reader_input.val()
    const id = id_input.val()

    const value = old_id === undefined

    // Comprobate if the date is currentyly
    let old_data = false
    const date_array = date.split("/")

    const date_value = new Date(date_array[2], (date_array[0] - 1), date_array[1])
    const currently_date = new Date()

    old_data = date_value < currently_date

    // Evaluate if the user wants edit or add elements
    if (name && sketch && congregation && date && president && reader && id && value) {
      let comprobate = false
      
      // Comprobating if the user is try add a element with a existent id
      Object.values(meetings).forEach((val) => {        
        if (val[0].includes(id.replace(/ /g, "-"))) {
          comprobate = true
          return
        }
      })

      if (!comprobate) {
        if (!old_data) {          
          const code = `<li class="element" id=${id.replace(/ /g, "-")}>
                          <div>
                            <p class="id">${id}</p>
                            <p class="date">${date}</p>
                          </div>
                          <div class="i-elements">
                            <i class="fa-brands fa-whatsapp"></i>
                            <i class="fa-solid fa-file-pen"></i>
                            <i class="fa-solid fa-trash-can"></i>
                          </div>
                        </li>`
          
          const data = {
            name: name,
            sketch: sketch,
            congregation: congregation,
            date: date,
            president: president,
            reader: reader,
            id: id
          }
    
    
          meetings[id.replace(/ /g, "_")] = [code, data]
    
          localStorage.setItem("Meetings", JSON.stringify(meetings))
          render_elements()
          update_empity()
          evaluate_by_date(feature, false)
          hide_register()
        } else {
          alert("Asergúrese que la fecha sea posterior a la actual")
        }
      } else {
        alert("El elemento ya existe, si se trata de otra persona o de " + 
        "datos distintos, considere cambiar el nombre del identificador")
      }
    } else if (!value) {
      if (!old_data) {
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
  
        localStorage.setItem("Meetings", new_meetings)
        render_elements()
        update_empity()
        evaluate_by_date(feature, false)
        hide_register()
      } else {
        alert("Asergúrese que la fecha sea posterior a la actual")
      }
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

  $(window).on('storage', (event) => {
    if (event.originalEvent.key === "Contacts") {
      number = JSON.parse(localStorage.getItem("Contacts"))
      render_contacts()
      $(".contact div").remove()
    } else if (event.originalEvent.key === "User_name" || event.originalEvent.key === "Tell" || event.originalEvent.key === "Congregation") {
      user_name = localStorage.getItem("User_name")
      tell = localStorage.getItem("Tell")
      congregation = localStorage.getItem("Congregation")
    } else if (localStorage.length === 0) location.reload()
  })

  $(document).on("click", ".contact", function () {
    const element = $(this)
    
    if (element.attr("class") === "contact off") {
      element.attr("class", "contact on")
    } else {
      element.attr("class", "contact off")
    }
  })

  $("#cancel-selection").click(() => {
    close_contacts(contacts)
  })

  let default_message
  const message_box = $("#message")
  let contacts_for_send = []
  let contacts_name_for_send = []
  const from_lecture = $("#to-lectures")
  const from_president = $("#to-president")
  $("#send").click(() => {
    let i = 0
    $(".contact").each(function () {
      const element = $(this)
      
      number.forEach((value) => {
        if (element.attr("class") === "contact on" && value.includes(element.text().trim())) {
          const info = value.split("/")
          contacts_for_send.push(info[0])
          contacts_name_for_send.push(info[1])
          i++
        }
      })
    })
    
    if (i > 0) {
      $("#message-form").fadeIn()
      opacity_efect("#message-form", true) 
    } else {
      alert("Debe seleccionar al menos un contacto si quiere enviar un mensaje")
    }

    from_lecture.click(function () {
      if ($(this).is(":checked")) {
        message_box.attr("placeholder", `Hola hermano ${meetings[id_for_extract_meeting_info][1].name} espero se encuentre bien, le habla ${user_name}, le escribo para informarle que fue asignado para una conferencia pública en la congregación ${congregation} en la siguiente fecha ${meetings[id_for_extract_meeting_info][1].date}. ¡Gracias, quedo atento 😁!`)
      }
    })

    from_president.click(function () {
      if ($(this).is(":checked")) {
        message_box.attr("placeholder", `Hola hermano ${meetings[id_for_extract_meeting_info][1].president} espero se encuentre bien, le habla ${user_name}, le escribo para informarle que fue asignado para la presidencia el día ${meetings[id_for_extract_meeting_info][1].date}. la información del conferenciante es esta: Nombre: ${meetings[id_for_extract_meeting_info][1].name}, congregación: ${meetings[id_for_extract_meeting_info][1].congregation} y el discurso es ${meetings[id_for_extract_meeting_info][1].sketch}`)
      }
    })
  })

  $(".fa-paper-plane").click(() => {
    if (from_lecture.is(":checked")) {
        default_message = `Hola hermano ${meetings[id_for_extract_meeting_info][1].name} espero se encuentre bien, le habla ${user_name}, le escribo para informarle que fue asignado para una conferencia pública en la congregación ${congregation} en la siguiente fecha ${meetings[id_for_extract_meeting_info][1].date}. ¡Gracias, quedo atento 😁!`
    } else if (from_president.is(":checked")) {
      default_message = `Hola hermano ${meetings[id_for_extract_meeting_info][1].president} espero se encuentre bien, le habla ${user_name}, le escribo para informarle que fue asignado para la presidencia el día ${meetings[id_for_extract_meeting_info][1].date}. la información del conferenciante es esta: Nombre: ${meetings[id_for_extract_meeting_info][1].name}, congregación: ${meetings[id_for_extract_meeting_info][1].congregation} y el discurso es ${meetings[id_for_extract_meeting_info][1].sketch}`
    }

    close_contacts(contacts)
    $("#message-form").fadeOut()
    opacity_efect("#message-form", false)

    send_whatsapp(contacts_for_send, default_message, message_box)
      .then((done_message) => {
        !done_message ? 
        alert(`Ha ocurrido un error al intentar enviar el mensaje, por favor verifique que el remitente cumpla los pasos mencionados en configuración o que cuente con conección a internet`) : 
        alert("El mensaje fue enviado exitosamente")
      })

    message_box.val("")
    contacts_for_send = []
  })

  $(".fa-x").click(() => {
    $("#message-form").fadeOut()
    opacity_efect("#message-form", false)
  })

  // Generate pdf
  $(".fa-file-pdf").click(() => {
    generate_pdf()
  })
  
  $("#date").datepicker()
  render_elements()
  render_contacts()
  $(".contact div").remove()

  update_empity()
  evaluate_by_date(feature, false)
})
