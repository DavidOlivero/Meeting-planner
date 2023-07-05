let meetings =  JSON.parse(localStorage.getItem("Meetings")) || {}
let data

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
    })

    $(document).on("mouseleave", ".element", function () {
        $(this).animate({
          backgroundColor: "rgb(255, 255, 255, 0.3)"
        }, 50)

        $(this).find(".i-elements").animate({
          backgroundColor: "rgb(255, 255, 255, 0.3)"
        }, 50)
        $(this).find("i").fadeOut(50)

        $(this).find(".id").animate({
          backgroundColor: "rgb(255, 255, 255, 0.3)"
        }, 50)
        
        $(this).find(".date").animate({
          backgroundColor: "rgb(255, 255, 255, 0.3)"
        }, 50)
    })
}

const evaluate_by_date = (feature, comprobate) => {
    const full_date = new Date()
    const day = full_date.getDate()
    const month = full_date.getMonth() + 1
    const year = full_date.getFullYear()
    
    Object.values(meetings).forEach((value) => {
      data = value[1]
      const date = data.date.split("/")
      const save_day = parseInt(date[1])
      const save_month = parseInt(date[0])
      const save_year = parseInt(date[2])

      const end_date = new Date(`${save_month + 1}/${save_day}/${save_year}`)
      
      const cal_year = end_date.getFullYear() - full_date.getFullYear()

      let cal_month = (end_date.getFullYear() - full_date.getFullYear()) * 12
      cal_month -= full_date.getMonth() + 1
      cal_month += end_date.getMonth()

      const one_day = 24 * 60 * 1000
      const cal_day = Math.round(Math.abs((end_date - full_date) / one_day))
      
      const time_left = [
        cal_year,
        cal_month,
        cal_day
      ]

      const check = save_year > year || save_year === year && save_month >= month && save_day >= day  
  
      if (check === comprobate) {
        feature(time_left)
      }
    })
  }