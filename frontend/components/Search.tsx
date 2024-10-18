"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { BACKEND_URL, type Profile } from "@/lib/utils";
import Card from "./Card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fetchProfiles = async (params: Record<string, string>) => {
  const url = `${BACKEND_URL}/home/search?${new URLSearchParams(params).toString()}`;
  const response = await fetch(url);
  const profiles = await response.json();
  return profiles;
};

export default function Search() {
  const [universityName, setUniversityName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [category, setCategory] = useState("");
  const [weightedAverage, setWeightedAverage] = useState([0]);
  const [isUndergraduate, setIsUndergraduate] = useState(false);
  const [isPostgraduate, setIsPostgraduate] = useState(false);
  const [load, setLoad] = useState("");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  useEffect(() => {
    fetchProfiles({}).then(({ profiles: _profiles }) => {
      setProfiles(_profiles);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles({
      name: universityName,
      desc: description,
      country,
      scope: discipline,
      category,
      minWam: `${weightedAverage[0]}`,
      degLevels: isUndergraduate ? "UG" : "" + isPostgraduate ? "PG" : "",
      load,
    }).then(({ profiles: _profiles }) => {
      console.log("here");
      setProfiles(_profiles);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Discipline"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="University Name"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            className="flex-1"
          />
          <button className="button" type="submit">
            <span>Submit</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full md:w-1/4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weighted-average">Weighted Average Mark</Label>
              <Slider
                id="weighted-average"
                min={0}
                max={100}
                step={1}
                value={weightedAverage}
                onValueChange={setWeightedAverage}
              />
              <div className="text-sm text-muted-foreground">
                Value: {weightedAverage}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Study Level</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="undergraduate"
                  checked={isUndergraduate}
                  onCheckedChange={(checked) =>
                    setIsUndergraduate(checked as boolean)
                  }
                />
                <label
                  htmlFor="undergraduate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Undergraduate
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="postgraduate"
                  checked={isPostgraduate}
                  onCheckedChange={(checked) =>
                    setIsPostgraduate(checked as boolean)
                  }
                />
                <label
                  htmlFor="postgraduate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Postgraduate
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="load">Load</Label>
              <Input
                id="load"
                placeholder="Enter load"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="High Demand..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-3/4 sticky max-h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-none">
            <div className="bg-muted rounded-lg grid overflow-visible lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
              {profiles.map((profile) => {
                return <Card key={profile.id} profile={profile} />;
              })}
              {/* <p className="text-muted-foreground"></p> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
