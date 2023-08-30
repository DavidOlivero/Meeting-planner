$(document).ready(() => {
    let month = []
    const table = $("tbody")

//     <tr class="month">
//     <td colspan="7">Septiembre</td>
// </tr>

// <tr class="month">
//     <td colspan="7">Octubre</td>
// </tr>

    const months = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre"
    }

    Object.values(meetings).forEach((element) => {
        const date = element[1].date.split("/")[0]
        month.push(date)
    })

    month.sort((a, b) => a - b)
    const set = new Set(month)
    const month_unrepeat = [...set]

    // Generate table
    if (month_unrepeat.length >= 2) {
        table.append(`
        <tr class="month" id="0">
            <td colspan="7">${months[month_unrepeat[month_unrepeat.length - 2]]}</td>
        </tr>
        `)
        
        table.append(`
        <tr class="month" id="1">
            <td colspan="7">${months[month_unrepeat[month_unrepeat.length - 1]]}</td>
        </tr>
        `)

        Object.values(meetings).forEach((element) => {
            data = element[1]
            date = data.date.split("/")
            
            if (date[0] === month_unrepeat[month_unrepeat.length - 2]) {
                $("#0").after(`
                <tr class="item">
                    <td>${date[1]}</td>
                    <td id="president">${data.president}</td>
                    <td>${data.name}</td>
                    <td>${data.congregation}</td>
                    <td>${data.sketch}</td>
                    <td id="reader">${data.reader}</td>
                    <td></td>
                </tr>
                `)
            } else if (date[0] === month_unrepeat[month_unrepeat.length - 1]) {
                $("#1").after(`
                <tr class="item">
                    <td>${date[1]}</td>
                    <td id="president">${data.president}</td>
                    <td>${data.name}</td>
                    <td>${data.congregation}</td>
                    <td>${data.sketch}</td>
                    <td id="reader">${data.reader}</td>
                    <td></td>
                </tr>
                `)
            }
        })
    } else {
        table.append(`
        <tr class="month" id="0">
            <td colspan="7">${months[month_unrepeat[month_unrepeat.length - 1]]}</td>
        </tr>
        `)

        Object.values(meetings).forEach((element) => {
            data = element[1]
            date = data.date.split("/")
            
            if (date[0] === month_unrepeat[month_unrepeat.length - 1]) {
                console.log(data)
                
                $("#0").after(`
                <tr class="item">
                    <td>${date[1]}</td>
                    <td id="president">${data.president}</td>
                    <td>${data.name}</td>
                    <td>${data.congregation}</td>
                    <td>${data.sketch}</td>
                    <td id="reader">${data.reader}</td>
                    <td></td>
                </tr>
                `)
            }
        })
    }
})