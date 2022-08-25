/*
  Change the format of an integer to hours and minutes (HH:MM).
*/
const formatHourMinute = (time) => {
    return ((time - (time % 60)) / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + ':' + (time % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

/*
  Return a list of practices created within the last three months.
*/
const getPracticesFilter = (practices, currentDate) => {
    let date3MontsPrior = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate())
    return practices.filter((practice) => {
        let dateToFilter = new Date(practice.date)
        return dateToFilter > date3MontsPrior
    }).sort((a, b) => {
        let dateA = new Date(a.date)
        let dateB = new Date(b.date)

        let [timeHourA, timeMinuteA] = formatHourMinute(a.time).split(":")
        let [timeHourB, timeMinuteB] = formatHourMinute(b.time).split(":")

        dateA.setHours(parseInt(timeHourA), parseInt(timeMinuteA), 0, 0)
        dateB.setHours(parseInt(timeHourB), parseInt(timeMinuteB), 0, 0)
        return dateB - dateA

    })
}

/*
  Return the duration of all practices within two dates as an integer.
*/
const getTotalDuration = (practices, start, end) => {
    let totalPractices = practices.filter((practice) => {
        let practiceDate = new Date(practice.date)
        return practiceDate >= start && practiceDate < end
    })
    let totalDuration = totalPractices.map(practice => practice.duration).reduce((a, b) => a + b, 0)
    return formatHourMinute(totalDuration)
}

/*
  Returns the average intensity of all practices within two dates.
  The duration of each practice is multiplied by its intensity.
  The sum of all practices is then divided by the total duration.
  The rounded value represents the average intensity.
  Low = 1, Medium = 2, High = 3, HIIT = 4.
*/
const getAverageIntensity = (practices, start, end) => {
    let totalPractices = practices.filter((practice) => {
        let practiceDate = new Date(practice.date)
        return practiceDate >= start && practiceDate < end
    })
    let average = 0
    if (totalPractices.length != 0) {
        let duration = totalPractices.map(practice => practice.duration).reduce((a, b) => a + b, 0)
        let practicesLow = totalPractices.filter((practice) => practice.intensity === "INTENSITY_LOW")
        let low = practicesLow.map(practice => practice.duration).reduce((a, b) => a + b, 0) * 1
        let practicesMedium = totalPractices.filter((practice) => practice.intensity === "INTENSITY_MEDIUM")
        let medium = practicesMedium.map(practice => practice.duration).reduce((a, b) => a + b, 0) * 2
        let practicesHigh = totalPractices.filter((practice) => practice.intensity === "INTENSITY_HIGH")
        let high = practicesHigh.map(practice => practice.duration).reduce((a, b) => a + b, 0) * 3
        let practicesHIIT = totalPractices.filter((practice) => practice.intensity === "INTENSITY_HIIT")
        let hiit = practicesHIIT.map(practice => practice.duration).reduce((a, b) => a + b, 0) * 4
        average = Math.round((low + medium + high + hiit) / duration)
    }
    let intensity = "INTENSITY_LOW"
    if (average === 2) {
        intensity = "INTENSITY_MEDIUM"
    } else if (average === 3) {
        intensity = "INTENSITY_HIGH"
    } else if (average === 4) {
        intensity = "INTENSITY_HIIT"
    }
    return intensity
  }

/*
  Returns the maximum and minimum dates availables for a form.
*/
const getCurrentMinDate = () => {
    let currentDate = new Date()
    let offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - (offset * 60 * 1000))
    currentDate = currentDate.toISOString().split('T')[0]

    let minDate = new Date()
    minDate.setMonth(minDate.getMonth() - 3)
    let offsetMinDate = minDate.getTimezoneOffset()
    minDate = new Date(minDate.getTime() - (offset * 60 * 1000))
    minDate = minDate.toISOString().split('T')[0]
    return [currentDate, minDate]
}

/*
    Return list of activities sorted by name
 */
const getActivitiesSorted = (activities) => {
    return activities.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
}

export default {formatHourMinute, getPracticesFilter, getTotalDuration, getAverageIntensity, getCurrentMinDate, getActivitiesSorted}
