type Expense = {
  id: string; // a string data type to hold a UUID
  week_id: string; // acts as a foreign key to link each expense to its respective week.
  date: string;
  name: string;
  amount: number;
  description?: string;
};

type Week = {
  id: string; // A string containing the ISOweek of the current week
  budget: number;
};
