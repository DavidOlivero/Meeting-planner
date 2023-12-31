let meetings =  JSON.parse(localStorage.getItem("Meetings")) || {}
let number = JSON.parse(localStorage.getItem("Contacts")) || []
let user_name = localStorage.getItem("User_name") || ""
let tell = localStorage.getItem("Tell") || ""
let congregation = localStorage.getItem("Congregation") || ""
let color
let data

$(document).ready(() => {
  let theme = localStorage.getItem("Theme")
  let theme_style = $('link[href="CSS/light.css"]')

  if (theme === null) {
    theme = localStorage.setItem("Theme", "light")
  } else {
    theme_style.attr("href", `CSS/${theme}.css`)
    theme_style = $(`link[href="CSS/${theme}.css"]`)
  }

  $(window).on("storage", (event) => {
    if (event.originalEvent.key === "Theme") {
      theme = localStorage.getItem("Theme")
      theme_style.attr("href", `CSS/${theme}.css`)
      theme_style = $(`link[href="CSS/${theme}.css"]`)

      const element = $(".element")
      element.css("background-color", "")
      element.find("p").css("background-color", "")
      element.find("div").css("background-color", "")

      if (theme === "light") {
        color = "rgb(136, 136, 136)"
      } else {
        color = "rgb(255, 255, 255, 0.3)"
      }
    }
  })

  if (theme === "light") {
    color = "rgb(136, 136, 136)"
  } else {
    color = "rgb(255, 255, 255, 0.3)"
  }
})

const update_empity = () => {
  const empity_image = $("#empity")

  if (Object.keys(meetings).length === 0) {
    empity_image.css("display", "block")
  } else {
    empity_image.css("display", "none")
  }
}
  
const render_elements = () => {
  const meetings_list = $("#meetings-list").empty()

  Object.values(meetings).forEach((value) => {
    meetings_list.append(value[0])
  })

  $(document).on("mouseenter", ".element", function () {
    $(this).find(".i-elements i").show()
  })

  $(document).on("mouseleave", ".element", function () {
    $(this).find(".i-elements i").hide()
  })
}

const evaluate_by_date = (feature, comprobate) => {
  const full_date = new Date()
  
  Object.values(meetings).forEach((value) => {
    data = value[1]
    const date = data.date.split("/")
    const save_day = parseInt(date[1])
    const save_month = parseInt(date[0])
    const save_year = parseInt(date[2])

    const end_date = new Date(save_year, (save_month - 1), save_day)
    const cal_year = end_date.getFullYear() - full_date.getFullYear()

    let cal_month = (end_date.getFullYear() - full_date.getFullYear()) * 12 + ((end_date.getMonth() + 1) - (full_date.getMonth() + 1))
    const cal_day = Math.floor(end_date.getDate() - full_date.getDate())
    
    const time_left = [
      cal_year,
      Math.abs(cal_month),
      Math.abs(cal_day)
    ]

    const check = end_date >= full_date

    if (check === comprobate) {
      feature(time_left)
    }
  })
}

const render_contacts = () => {
  const number_list = $("#number-list")
  number_list.empty()

  number.forEach(element => {
      const info = element.split("/")

      number_list.append(`<li id="${info[1].replace(/ /g, "-")}" class="contact off">${info[1]} <div><i class="fa-solid fa-share" title="Invitar contacto a twilio"></i> <i class="fa-solid fa-file-pen" title="Editar contacto"></i> <i class="fa-solid fa-trash-can" title="Eliminar contacto"></i></div></li>`)
  })

  $(document).on("mouseenter", "#number-list li", function () {
      $(this).find("i").show()
  })

  $(document).on("mouseleave", "#number-list li", function () {
      $(this).find("i").hide()
  })
}

const opacity_efect = (except, apply) => {
  const all_elements = $("body").children().not(except)

  if (apply) {
    all_elements.addClass("inactive")
  } else {
    all_elements.removeClass("inactive")
  }
}