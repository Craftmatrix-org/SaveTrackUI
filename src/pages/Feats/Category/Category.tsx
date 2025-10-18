import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "@/lib/token";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CategoryItem } from "@/types/category";

// Type for each category item

export const Category = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");

  useEffect(() => {
    const GetCategory = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = getCookie("token");
      if (!token) return;

      try {
        const res = await axios.get<CategoryItem[]>(
          `${API_URL}/api/v1/Category`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    GetCategory();
  }, []);

  // Filter logic
  const filtered = categories.filter((cat) => {
    if (filter === "positive") return cat.isPositive;
    if (filter === "negative") return !cat.isPositive;
    return true;
  });

  return (
    <div className="p-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "positive" ? "default" : "outline"}
          onClick={() => setFilter("positive")}
        >
          Positive
        </Button>
        <Button
          variant={filter === "negative" ? "default" : "outline"}
          onClick={() => setFilter("negative")}
        >
          Negative
        </Button>
      </div>

      {/* Category Cards */}
      {filtered.map((cat) => (
        <Card key={cat.id} className="p-4 mb-2">
          <h3 className="font-semibold">{cat.name}</h3>
          <p>{cat.description || "No description"}</p>
          <p>
            {cat.isPositive ? (
              <span className="text-green-600 font-medium">Positive ✅</span>
            ) : (
              <span className="text-red-600 font-medium">Negative ❌</span>
            )}
          </p>
        </Card>
      ))}
    </div>
  );
};
