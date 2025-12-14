"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Image from "next/image";

interface FilterBarProps {
  onFilterChange?: (filters: { location: string; lab: string; date: string; search: string }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date( Date.now() + 86400000)); // default ke besok
  const [searchTerm, setSearchTerm] = useState("");
  
  // filter akan mengubah ke tanggal real time
  useEffect(() => {
    onFilterChange?.({
      location: selectedLocation,
      lab: selectedLab,
      date: format(new Date(), "yyyy-MM-dd"),
      search: searchTerm,
    });
  }, []); // hanya jalan sekali saat mount

  const handleLocationChange = (value: string) => {
    const locationValue = value === "all" ? "" : value;
    setSelectedLocation(locationValue);
    onFilterChange?.({
      location: locationValue,
      lab: selectedLab,
      date: date ? format(date, "yyyy-MM-dd") : "",
      search: searchTerm,
    });
  };

  const handleLabChange = (value: string) => {
    setSelectedLab(value);
    onFilterChange?.({
      location: selectedLocation,
      lab: value,
      date: date ? format(date, "yyyy-MM-dd") : "",
      search: searchTerm,
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onFilterChange?.({
      location: selectedLocation,
      lab: selectedLab,
      date: newDate ? format(newDate, "yyyy-MM-dd") : "",
      search: searchTerm,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange?.({
      location: selectedLocation,
      lab: selectedLab,
      date: date ? format(date, "yyyy-MM-dd") : "",
      search: value,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-8">
      {/* Filter Group - Kiri */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {/* Filter Lokasi */}
        <Select onValueChange={handleLocationChange} value={selectedLocation || "all"}>
          <SelectTrigger className="w-full sm:w-[180px] !h-10 border-[#1E40AF] border-2 text-gray-500 rounded-xl">
            <SelectValue placeholder="Lokasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="h">Herman Yohanes</SelectItem>
            <SelectItem value="g">Grafika</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Tanggal */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-between w-full sm:w-[180px] border-2 border-[#1E40AF] rounded-xl px-3 text-gray-500 h-10 hover:bg-gray-50 transition-colors">
              {date ? format(date, "dd/MM/yyyy") : "dd/mm/yyyy"}
              <CalendarIcon className="ml-2 h-4 w-4 text-[#1E40AF]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              // disable tanggal sebelume
              disabled={(date) => {
                const today = new Date();
                today.setDate(today.getDate() + 1);
                today.setHours(0, 0, 0, 0); // set ke awal hari
                return date < today;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Search Bar - Kanan */}
      <div className="relative w-full lg:w-[320px]">
        <Image
          src="/icons/searchLogo.svg"
          alt="Search"
          width={20}
          height={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        />
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full border-[#1E40AF] border-2 text-black rounded-xl h-10 pl-10 pr-4"
        />
      </div>
    </div>
  );
}
