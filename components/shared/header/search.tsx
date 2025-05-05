'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { SearchIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Search({ categories }: { categories: { category: string }[] }) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col gap-2">
     
      <p className="text-xs text-yellow-600 font-medium animate-pulse">
        🔍 Utilisez la recherche pour trouver rapidement votre voiture idéale !
      </p>

      
      <form action="/search" method="GET" className="flex gap-2 items-center">
        <Select name="category">
          <SelectTrigger className="w-[60px]">
            <SelectValue placeholder="tout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tout">tout</SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          name="q"
          placeholder="Rechercher..."
          className="w-[150px] text-sm"
        />

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Date début"
          name="startDate"
          className="w-[100px] text-sm px-2 py-1 border rounded"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Date fin"
          name="endDate"
          className="w-[100px] text-sm px-2 py-1 border rounded"
        />

        <Button type="submit">
          <SearchIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
