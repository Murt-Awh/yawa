if (typeof window !== "undefined") {
  window.onload = async function () {
    // DOM Shortcuts
    const cityDOM = document.getElementById("city");
    const weatherDOM = document.getElementById("weather");
    const timeDOM = document.getElementById("time");

    // Check for localStorage and set value (if it exists)
    const localStorage = window.localStorage;
    if (localStorage.getItem("city") != null) {
      cityDOM.value = localStorage.getItem("city");
    }

    // Listen for whenever the user clicks Enter while in the textbox
    cityDOM.addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.key === "Enter") {
        // Clear & Create localStorage
        const cityValue = cityDOM.value;
        localStorage.removeItem("city");
        localStorage.setItem("city", cityValue);
        const inputArray = cityDOM.value.split("-");

        // Create a request to the Weather API
        const http = new XMLHttpRequest();
        const requestUrl = `https://api.weatherbit.io/v2.0/current?city=${inputArray[0]}&country=${inputArray[1]}&key=54dae5161aa542f985f0c7b249bd4c7b`;
        http.open("GET", requestUrl);
        http.send();
        http.onreadystatechange = () => {
          try {
            // Check if the city is invalid
            if (http.status === 204) {
              cityDOM.value = "Invalid City";
              return;
            }

            // Add weather data to the DOM
            cityDOM.remove();
            const weatherData = JSON.parse(http.responseText)["data"][0];
            weatherDOM.innerText = `${weatherData["weather"]["description"]} ${weatherData["temp"]}°`;
            timeDOM.innerText = `${weatherData["ob_time"]}`;
          } catch (err) {
            if (err instanceof SyntaxError) return; // Random SyntaxError that always happens
            console.log(err);
            return;
          }
        };
      }
    });
  };
}
