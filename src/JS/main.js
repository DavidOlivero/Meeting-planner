// import { dotenv } from "dotenv"

const { invoke } = window.__TAURI__.tauri

// dotenv.config()
// // require('dotenv').config()

async function open_meeting_info() {
  await invoke("open_meeting_info", {  })
}

async function open_settings() {
  await invoke("open_settings", { })
}

const feature = () => {
  $("#" + data.id.replace(/ /g, "-")).css("display", "none")
}

const close_contacts = (contacts) => {
  contacts.fadeOut()

  opacity_efect("#choose-contacts, .module", false)

  $(".contact").each(function () {
    $(this).attr("class", "contact off")
  })
}

$(document).ready(() => {
  const name_input = $("#name")
  const sketch_input = $("#sketch")
  const congregation_input = $("#congregation")
  const date_input = $("#date")
  const id_input = $("#id")
  const register_window = $("#register")
  const contacts = $("#choose-contacts")
  let id_for_extract_meeting_info

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
    opacity_efect("#register", true)
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
    opacity_efect("#choose-contacts, .module", true)
  })

  $("#save").click(() => {
    const name = name_input.val()
    const sketch = sketch_input.val()
    const congregation = congregation_input.val()
    const date = date_input.val()
    const id = id_input.val()

    const value = old_id === undefined

    // Comprobate if the date is currentyly
    let old_data = false
    const date_array = date.split("/")

    const date_value = new Date(date_array[2], (date_array[0] - 1), date_array[1])
    const currently_date = new Date()

    old_data = date_value < currently_date

    // Evaluate if the user wants edit or add elements
    if (name && sketch && congregation && date && id && value) {
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

  $("#date").datepicker()
  render_elements()
  update_empity()
  evaluate_by_date(feature, false)
  render_contacts()

  $(window).on('storage', (event) => {
    if (event.originalEvent.key === "Contacts") {
      number = JSON.parse(localStorage.getItem("Contacts"))
      render_contacts()
    }
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

  $("#send").click(() => {
    let contacts_for_send = []
    let contacts_name_for_send = []
    let done_message = false
    
    $(".contact").each(function () {
      const element = $(this)
      
      number.forEach((value) => {
        if (element.attr("class") === "contact on" && value.includes(element.text().trim())) {
          const info = value.split("/")
          contacts_for_send.push(info[0])
          contacts_name_for_send.push(info[1])
        }
      })
    })
    close_contacts(contacts)

    contacts_for_send.forEach(async (number, index) => {
      const url = 'https://api.twilio.com/2010-04-01/Accounts/AC783e1d81f12583c95f6c6d126ce21c85/Messages.json';
      const data = new URLSearchParams({
          To: `whatsapp:+57${number}`,
          From: 'whatsapp:+14155238886',
          Body: `Your appointment is coming up on July 21 at 3PM Hola hermano ${contacts_name_for_send[index]} espero se encuentre bien, le habla Eliú, le escribo para informarle que fue asignado para una conferencia pública el Domingo en la congregación Central de Corozal en la siguiente fecha ${meetings[id_for_extract_meeting_info][1].date}. ¡Gracias, quedo atento 😁!`
      });
  
      await fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `Basic ${btoa(`AC783e1d81f12583c95f6c6d126ce21c85:${window.TOKEN}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data
      })
      .then(() => done_message = false)
      .catch(() => done_message = true);
    })

    !done_message ? 
    alert("Ha ocurrido un error al intentar enviar el mensaje, por favor verifique que el remitente cumpla los pasos mencionados en configuración") : 
    alert("El mensaje fue enviado exitosamente")
  })
})
