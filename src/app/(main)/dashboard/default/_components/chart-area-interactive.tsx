"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", revenue: 1520000 },
  { date: "2024-04-02", revenue: 1480000 },
  { date: "2024-04-03", revenue: 1650000 },
  { date: "2024-04-04", revenue: 1420000 },
  { date: "2024-04-05", revenue: 1890000 },
  { date: "2024-04-06", revenue: 2100000 },
  { date: "2024-04-07", revenue: 1950000 },
  { date: "2024-04-08", revenue: 1600000 },
  { date: "2024-04-09", revenue: 1450000 },
  { date: "2024-04-10", revenue: 1750000 },
  { date: "2024-04-11", revenue: 1920000 },
  { date: "2024-04-12", revenue: 2050000 },
  { date: "2024-04-13", revenue: 1980000 },
  { date: "2024-04-14", revenue: 1650000 },
  { date: "2024-04-15", revenue: 1420000 },
  { date: "2024-04-16", revenue: 1580000 },
  { date: "2024-04-17", revenue: 1840000 },
  { date: "2024-04-18", revenue: 1760000 },
  { date: "2024-04-19", revenue: 1640000 },
  { date: "2024-04-20", revenue: 1490000 },
  { date: "2024-04-21", revenue: 1570000 },
  { date: "2024-04-22", revenue: 1620000 },
  { date: "2024-04-23", revenue: 1580000 },
  { date: "2024-04-24", revenue: 1780000 },
  { date: "2024-04-25", revenue: 1610000 },
  { date: "2024-04-26", revenue: 1350000 },
  { date: "2024-04-27", revenue: 1830000 },
  { date: "2024-04-28", revenue: 1520000 },
  { date: "2024-04-29", revenue: 1710000 },
  { date: "2024-04-30", revenue: 1850000 },
  { date: "2024-05-01", revenue: 1650000 },
  { date: "2024-05-02", revenue: 1790000 },
  { date: "2024-05-03", revenue: 1640000 },
  { date: "2024-05-04", revenue: 1880000 },
  { date: "2024-05-05", revenue: 1980000 },
  { date: "2024-05-06", revenue: 1990000 },
  { date: "2024-05-07", revenue: 1880000 },
  { date: "2024-05-08", revenue: 1490000 },
  { date: "2024-05-09", revenue: 1620000 },
  { date: "2024-05-10", revenue: 1790000 },
  { date: "2024-05-11", revenue: 1730000 },
  { date: "2024-05-12", revenue: 1590000 },
  { date: "2024-05-13", revenue: 1590000 },
  { date: "2024-05-14", revenue: 1840000 },
  { date: "2024-05-15", revenue: 1970000 },
  { date: "2024-05-16", revenue: 1730000 },
  { date: "2024-05-17", revenue: 1990000 },
  { date: "2024-05-18", revenue: 1710000 },
  { date: "2024-05-19", revenue: 1630000 },
  { date: "2024-05-20", revenue: 1570000 },
  { date: "2024-05-21", revenue: 1480000 },
  { date: "2024-05-22", revenue: 1480000 },
  { date: "2024-05-23", revenue: 1650000 },
  { date: "2024-05-24", revenue: 1790000 },
  { date: "2024-05-25", revenue: 1600000 },
  { date: "2024-05-26", revenue: 1610000 },
  { date: "2024-05-27", revenue: 1820000 },
  { date: "2024-05-28", revenue: 1630000 },
  { date: "2024-05-29", revenue: 1380000 },
  { date: "2024-05-30", revenue: 1740000 },
  { date: "2024-05-31", revenue: 1570000 },
  { date: "2024-06-01", revenue: 1570000 },
  { date: "2024-06-02", revenue: 1970000 },
  { date: "2024-06-03", revenue: 1500000 },
  { date: "2024-06-04", revenue: 1830000 },
  { date: "2024-06-05", revenue: 1480000 },
  { date: "2024-06-06", revenue: 1790000 },
  { date: "2024-06-07", revenue: 1720000 },
  { date: "2024-06-08", revenue: 1880000 },
  { date: "2024-06-09", revenue: 1830000 },
  { date: "2024-06-10", revenue: 1550000 },
  { date: "2024-06-11", revenue: 1490000 },
  { date: "2024-06-12", revenue: 1990000 },
  { date: "2024-06-13", revenue: 1480000 },
  { date: "2024-06-14", revenue: 1820000 },
  { date: "2024-06-15", revenue: 1700000 },
  { date: "2024-06-16", revenue: 1770000 },
  { date: "2024-06-17", revenue: 1970000 },
  { date: "2024-06-18", revenue: 1500000 },
  { date: "2024-06-19", revenue: 1740000 },
  { date: "2024-06-20", revenue: 1800000 },
  { date: "2024-06-21", revenue: 1560000 },
  { date: "2024-06-22", revenue: 1710000 },
  { date: "2024-06-23", revenue: 1980000 },
  { date: "2024-06-24", revenue: 1530000 },
  { date: "2024-06-25", revenue: 1540000 },
  { date: "2024-06-26", revenue: 1830000 },
  { date: "2024-06-27", revenue: 1840000 },
  { date: "2024-06-28", revenue: 1850000 },
  { date: "2024-06-29", revenue: 1950000 },
  { date: "2024-06-30", revenue: 2150000 },
];

const chartConfig = {
  visitors: {
    label: "Revenus",
  },
  revenue: {
    label: "Chiffre d'Affaires",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Total for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden *:data-[slot=toggle-group-item]:px-4!"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" stroke="var(--color-mobile)" stackId="a" />
            <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke="var(--color-desktop)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
