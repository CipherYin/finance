import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";
import { zhCN } from 'date-fns/locale';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
};

export const DatePicker = ({
  value,
  onChange,
  disabled,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, "PPP", { locale: zhCN }) : <span>选择日期</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
          locale={zhCN}
          formatters={{
            formatWeekdayName: (day) => ["日", "一", "二", "三", "四", "五", "六"][day.getDay()],
            formatCaption: (date, options) => format(date, 'yyyy年MM月', { locale: zhCN }),
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
