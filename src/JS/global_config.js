let meetings =  JSON.parse(localStorage.getItem("Meetings")) || {}
let data
let color

$(document).ready(() => {
  let theme = localStorage.getItem("Theme")
  let theme_style = $('link[href="CSS/light.css"]')

  if (theme === "null") {
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
      element.removeAttr("style")
      element.find("p").removeAttr("style")
      element.find("div").removeAttr("style")

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
      $(this).animate({
        backgroundColor: "#0D76E5"
      }, 50)

      $(this).find(".i-elements").animate({
        backgroundColor: "#0D76E5"
      }, 50)
      $(this).find("i").fadeIn(50)

      $(this).find(".id").animate({
        backgroundColor: "#0D76E5"
      }, 50)

      $(this).find(".date").animate({
        backgroundColor: "#0D76E5"
      }, 50)

      $(this).find(".left-date-info").animate({
        backgroundColor: "#0D76E5"
      }, 50)

      $(this).find(".delay-date-info").animate({
        backgroundColor: "#0D76E5"
      }, 50)
    })

    $(document).on("mouseleave", ".element", function () {
      $(this).animate({
        backgroundColor: color
      }, 50)

      $(this).find(".i-elements").animate({
        backgroundColor: color
      }, 50)
      $(this).find("i").fadeOut(50)

      $(this).find(".id").animate({
        backgroundColor: color
      }, 50)
      
      $(this).find(".date").animate({
        backgroundColor: color
      }, 50)

      $(this).find(".left-date-info").animate({
        backgroundColor: color
      }, 50)

      $(this).find(".delay-date-info").animate({
        backgroundColor: color
      }, 50)
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
      console.log(end_date.getMonth() + 1)
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