import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
import { MonthRangePicker } from "@/components/ui/month-range-picker";
import { useFormContext } from "react-hook-form";

type Props = {
  index: number;
  form: any;
};

export default function CustomMonthRangePicker({ form, index }: Props) {
  const [dates, setDates] = useState<{ start: Date; end: Date }>();

  const handleMonthRangeSelect = (selectedDates: {
    start: Date;
    end: Date;
  }) => {
    console.log(selectedDates);
    setDates(selectedDates);
    form.setValue(
      `workExperiences.${index}.workStartedAt`,
      selectedDates.start
    );
    form.setValue(`workExperiences.${index}.workEndedAt`, selectedDates.end);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dates && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dates ? (
            `${format(dates.start, "yyyy.MM")} - ${format(
              dates.end,
              "yyyy.MM"
            )}`
          ) : (
            <span>Pick a month range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <MonthRangePicker
          onMonthRangeSelect={handleMonthRangeSelect}
          selectedMonthRange={dates}
        />
      </PopoverContent>
    </Popover>
  );
}
