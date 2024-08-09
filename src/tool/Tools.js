import avatar from "../icon/default_avatar.png";

export const getDateString = (timestamp) => {
	if (!timestamp) return null;

	let date = null;
	if (typeof timestamp === "object" && "seconds" in timestamp) {
		date = new Date(timestamp.seconds * 1000);
		// //console.log("Object")

	} else if (typeof timestamp === "string") {
		date = new Date(timestamp);
		// //console.log("String")
		// //console.log(date);
	}


	const now = new Date();
	const diff = now - date;
	const days = diff / (1000 * 60 * 60 * 24);
	if (days > 7) {
		return date.toLocaleDateString();
	} else if(days < 1){
		return "Today";
	}else {
		return date.toLocaleDateString("en-US", { weekday: "long" });
	}
};

export const getTimeString = (timestamp) => {
	let date = new Date(timestamp);
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
};

export const getAvatar = (url) => {
	if (url && url !== "") return url;
	else return avatar;
};
