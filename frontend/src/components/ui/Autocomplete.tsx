"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

interface AutocompleteProps<T> {
   items: { key: T; value: string }[]; // List of items with key/value shape
   onSelect: (key: T) => void; // Callback when an item is selected
   placeholder?: string; // Placeholder text for the input
   buttonClassName?: string; // Optional className for the button
   inputClassName?: string; // Optional className for the input
   contentClassName?: string; // Optional className for the popover content
}

export function Autocomplete<T>({
   items,
   onSelect,
   placeholder = "Select an item...",
   buttonClassName,
   inputClassName,
   contentClassName,
}: AutocompleteProps<T>) {
   const [open, setOpen] = React.useState(false);
   const [selectedKey, setSelectedKey] = React.useState<T | null>(null);

   const selectedItem = items.find((item) => item.key === selectedKey);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className={cn("w-[200px] justify-between", buttonClassName)}
            >
               {selectedItem ? selectedItem.value : placeholder}
               <ChevronsUpDown className="opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className={cn("w-[200px] p-0", contentClassName)}>
            <Command>
               <CommandInput
                  placeholder="Search..."
                  className={cn("h-9", inputClassName)}
               />
               <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                     {items.map((item) => (
                        <CommandItem
                           key={String(item.key)}
                           value={item.value}
                           onSelect={() => {
                              setSelectedKey(item.key);
                              onSelect(item.key);
                              setOpen(false);
                           }}
                        >
                           {item.value}
                           <Check
                              className={cn(
                                 "ml-auto",
                                 selectedKey === item.key
                                    ? "opacity-100"
                                    : "opacity-0"
                              )}
                           />
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
