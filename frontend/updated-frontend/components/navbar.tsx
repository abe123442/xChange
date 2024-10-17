"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, User } from "lucide-react";

const NavBar = () => {
  const [expandedFilter, setExpandedFilter] = useState<
    "universities" | "country" | null
  >(null);

  return (
    <nav className="flex items-center justify-between p-4 bg-background shadow-md">
      <div className="flex items-center">
        <img
          src="/placeholder.svg?height=40&width=40"
          alt="Logo"
          className="h-10 w-10"
        />
        {/* <span className="ml-2 text-xl font-bold">YourLogo</span> */}
      </div>

      {/* Search bar, idk what exactly we want here yet */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <div className="flex">
            <Button
              variant={
                expandedFilter === "universities" ? "secondary" : "outline"
              }
              className="rounded-r-none"
              onClick={() =>
                setExpandedFilter(
                  expandedFilter === "universities" ? null : "universities",
                )
              }
            >
              Universities
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant={expandedFilter === "country" ? "secondary" : "outline"}
              className="rounded-l-none border-l-0"
              onClick={() =>
                setExpandedFilter(
                  expandedFilter === "country" ? null : "country",
                )
              }
            >
              Country
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search..." />
            </div>
          </div>
          {expandedFilter && (
            <div className="absolute z-10 mt-2 p-4 bg-background border rounded-md shadow-lg w-full">
              <h3 className="font-semibold mb-2">
                {expandedFilter === "universities"
                  ? "University Filters"
                  : "Country Filters"}
              </h3>
              <div className="space-y-2">
                <Input placeholder="Degree Disciplines" />
                <select className="w-full p-2 border rounded-md">
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
                <Input
                  type="number"
                  placeholder="Weighted Average Mark"
                  min="0"
                  max="100"
                />
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth stuff goes here....?? haven't implemented login yet tho */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default NavBar;
