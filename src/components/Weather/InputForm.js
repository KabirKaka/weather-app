import { useRef } from "react";
import styles from "./InputForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const InputForm = (props) => {
	const cityNameRef = useRef("");

	const formSubmitHandler = async (event) => {
		event.preventDefault();
		props.onInput(cityNameRef.current.value);
		cityNameRef.current.value = "";
	};

	return (
		<form className={styles.inputForm} onSubmit={formSubmitHandler}>
			<div className={styles["input-container"]}>
				<input
					type="text"
					name="city"
					id="cityName"
					ref={cityNameRef}
					placeholder="Enter your city"
				/>

				<button type="submit">
					<FontAwesomeIcon
						icon={faMagnifyingGlass}
						style={{ color: "white" }}
					/>
				</button>
			</div>
		</form>
	);
};

export default InputForm;
