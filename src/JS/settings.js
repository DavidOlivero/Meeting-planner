const { invoke } = window.__TAURI__.tauri

$(document).ready(() => {
    const light_button = $("#light")
    const dark_button = $("#dark")
    
    light_button.click(() => {
        localStorage.setItem("Theme", "light")
        location.reload()
    })

    dark_button.click(() => {
        localStorage.setItem("Theme", "dark")
        location.reload()
    })
})