import { Fragment, useCallback, useEffect, useState } from "react";
import Card from "../UI/Card";
import InputForm from "./InputForm";
import Loader from "../UI/Loader";
import styles from "./Weather.module.css";
import useHttpRequests from "../hooks/http-request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import cloudyBg from "../../assets/images/backgrounds/cloudy.jpg";
import rainyBg from "../../assets/images/backgrounds/rainy.jpg";
import snowyBg from "../../assets/images/backgrounds/snowy.jpg";
import sunnyBg from "../../assets/images/backgrounds/sunny.jpg";

function getDate() {
	const today = new Date();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();
	const date = today.getDate();

	const hours = today.getHours();
	const minutes = today.getMinutes();

	// Determine whether it's AM or PM
	const amOrPm = hours >= 12 ? "PM" : "AM";

	// Convert hours to 12-hour format
	const twelveHourFormat = hours % 12 || 12; // Handle midnight (0) as 12

	// Create a formatted time string
	const formattedTime = `${twelveHourFormat}:${minutes
		.toString()
		.padStart(2, "0")} ${amOrPm}`;

	const showTime = formattedTime;
	return [`${month}/${date}/${year}`, showTime];
}

const Weather = () => {
	const [data, setData] = useState({});
	const [currentDate, currentTime] = getDate();
	const { error, isLoading, sendRequest: fetchData } = useHttpRequests();

	const applyData = useCallback((fetchdata) => {
		setData({
			loc: `${fetchdata.name} ,${fetchdata.sys.country}`,
			temp: (+fetchdata.main.temp - 273.15).toFixed(2),
			feelsLike: (+fetchdata.main.feels_like - 273.15).toFixed(2),
			weatherMain: fetchdata.weather[0].main,
			weatherDesc: `, ${fetchdata.weather[0].description}`,
			humidity: fetchdata.main.humidity,
			pressure: fetchdata.main.pressure,
		});
	}, []);


	useEffect(() => {
		const city = "karachi";
		fetchData(
			{
				url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e16084441dc5eea268d39e07424985c5`,
			},
			applyData
		);
	}, [fetchData, applyData ]);

	const { loc, temp, weatherMain, weatherDesc, humidity, pressure, feelsLike } =
		data;

	const inputHandler = (cityName) => {
		console.log("inputHandler running");
		fetchData(
			{
				url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e16084441dc5eea268d39e07424985c5`,
			},
			applyData
		);
	};

	let bgPath = sunnyBg,
		iconPath = "images/icons/sun.png";
	if (weatherMain !== undefined) {
		if (
			weatherMain.toLowerCase().includes("cloud") ||
			weatherMain.toLowerCase().includes("haze")
		) {
			bgPath = cloudyBg;
			iconPath = "images/icons/cloud.png";
		} else if (
			weatherMain.toLowerCase().includes("rain") ||
			weatherMain.toLowerCase().includes("thunderstorm")
		) {
			bgPath = rainyBg;
			iconPath = "images/icons/rain.png";
		} else if (weatherMain.toLowerCase().includes("snow")) {
			bgPath = snowyBg;
			iconPath = "images/icons/snow.png";
		}
	}

	return (
		<Fragment>
			<div
				className={styles["weather-card"]}
				style={{
					backgroundImage: `url(${bgPath})`,
				}}
			>
				<Card>
					<InputForm onInput={inputHandler} />
					{error && !isLoading && (
						<p className={styles.message}>City not Found!! Try Again.</p>
					)}
					{isLoading && <Loader />}
					{!error && !isLoading && (
						<div>
							<div className={styles["time-container"]}>
								<FontAwesomeIcon
									icon={faClock}
									size="lg"
									style={{ color: "black" }}
								/>

								<span className={styles.time}>{currentTime}</span>
								<span className={styles.date}>{` - ${currentDate}`}</span>
							</div>
							<div className={styles["main-container"]}>
								<div className={styles.loc}>{loc}</div>
								<div className={styles.weatherDesc}>
									{weatherMain + weatherDesc}
								</div>
								<div className={styles["temp-container"]}>
									<img src={iconPath} alt="" className={styles.tempIcon} />
									<div className={styles.temp}>{`${temp}°C`}</div>
								</div>
							</div>
							<hr className={styles.line} />
							<div className={styles["other-details-Container"]}>
								<div className={styles.feelsLike}>
									<label htmlFor="">Feels Like</label>
									<div>{`${feelsLike}°C`}</div>
								</div>
								<div className={styles.humidity}>
									<label htmlFor="">Humidity</label>
									<div>{`${humidity}%`}</div>
								</div>

								<div className={styles.pressure}>
									<label htmlFor="">Pressure</label>
									<div>{`${pressure} mb`}</div>
								</div>
							</div>
						</div>
					)}
				</Card>
			</div>
		</Fragment>
	);
};

export default Weather;
