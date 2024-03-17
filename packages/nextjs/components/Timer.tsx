import React from "react";
import { useTimer } from "react-timer-hook";

function MyTimer({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

export const Timer = ({ expiryDate }: { expiryDate: number }) => {
  const todaysTime = new Date();
  const expiryTime = new Date(expiryDate);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = expiryTime.getTime() - todaysTime.getTime();

  if (differenceInMilliseconds > 0) {
    // Convert milliseconds to days, hours, minutes, and seconds
    const daysDifference = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDifference = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const secondsDifference = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

    // Adjust todaysTime
    todaysTime.setSeconds(todaysTime.getSeconds() + secondsDifference);
    todaysTime.setMinutes(todaysTime.getMinutes() + minutesDifference);
    todaysTime.setHours(todaysTime.getHours() + hoursDifference);
    todaysTime.setDate(todaysTime.getDate() + daysDifference);

    console.log("Updated todaysTime:", todaysTime);
    return <MyTimer expiryTimestamp={todaysTime} />;
  } else {
    console.log("The difference is negative, so no adjustment is made.");
    return <div> Expired</div>;
  }
};
