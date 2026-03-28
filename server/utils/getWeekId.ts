import { getISOWeek, getISOWeekYear } from "date-fns";

export default function getWeekId() {
  const today = new Date();
  return (
    getISOWeekYear(today) + "-W" + getISOWeek(today).toString().padStart(2, "0")
  );
}
