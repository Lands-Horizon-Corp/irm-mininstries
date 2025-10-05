"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";

interface GrowthData {
  date: string;
  dateFormatted: string;
  members?: number;
  ministers?: number;
  membersCumulative?: number;
  ministersCumulative?: number;
  isForecast?: boolean;
}

interface GrowthResponse {
  success: boolean;
  data: {
    historical: GrowthData[];
    forecast: GrowthData[];
    combined: GrowthData[];
    summary: {
      totalMembers: number;
      totalMinisters: number;
      period: string;
      forecastDays: number;
    };
  };
}

const chartConfig = {
  members: {
    label: "Members",
    color: "hsl(214 100% 50%)", // Blue
  },
  ministers: {
    label: "Ministers",
    color: "hsl(262 83% 58%)", // Violet/Purple
  },
  membersCumulative: {
    label: "Total Members",
    color: "hsl(214 100% 50%)", // Blue
  },
  ministersCumulative: {
    label: "Total Ministers",
    color: "hsl(262 83% 58%)", // Violet/Purple
  },
} as const;

// Download chart as image function
const downloadChart = async (chartId: string, filename: string) => {
  try {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      throw new Error("Chart element not found");
    }

    // Import html2canvas dynamically
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(chartElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement("a");
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    throw new Error("Error downloading chart image");
  }
};

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

interface LegendPayload {
  dataKey: string;
  color: string;
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

const CustomTooltipContent = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg border p-3 shadow-md">
      <p className="font-medium">{label}</p>
      {payload.map((entry, index) => {
        const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
        return (
          <p className="text-sm" key={index} style={{ color: entry.color }}>
            {config?.label || entry.dataKey}:{" "}
            {entry.value?.toLocaleString() || 0}
          </p>
        );
      })}
    </div>
  );
};

const CustomLegendContent = ({ payload }: CustomLegendProps) => {
  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div className="flex justify-center gap-6 pt-4">
      {payload.map((entry, index) => {
        const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
        return (
          <div className="flex items-center gap-2" key={index}>
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">
              {config?.label || entry.dataKey}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export function GrowthCharts() {
  const [data, setData] = useState<GrowthResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");

  const fetchGrowthData = async (days: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics/growth?days=${days}&type=both`
      );
      const result: GrowthResponse = await response.json();

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError("Failed to fetch growth data");
      }
    } catch {
      setError("Error loading growth analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData(period);
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="text-center">
          <div className="bg-muted mx-auto mb-4 h-8 w-64 animate-pulse rounded-lg" />
          <div className="bg-muted mx-auto h-4 w-96 animate-pulse rounded" />
        </div>

        {/* Loading Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card className="animate-pulse" key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="bg-muted h-4 w-20 rounded" />
                    <div className="bg-muted h-8 w-16 rounded" />
                  </div>
                  <div className="bg-muted h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Chart */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="bg-muted h-6 w-48 rounded" />
            <div className="bg-muted h-4 w-32 rounded" />
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-80 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <BarChart3 className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            Unable to Load Analytics
          </h3>
          <p className="text-muted-foreground mb-4">
            {error || "No data available"}
          </p>
          <Button className="min-w-24" onClick={() => fetchGrowthData(period)}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { summary, combined } = data;

  if (!summary || !combined || combined.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <BarChart3 className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">Invalid Data Structure</h3>
          <p className="text-muted-foreground mb-4">
            The data format is not as expected
          </p>
          <Button className="min-w-24" onClick={() => fetchGrowthData(period)}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <TrendingUp className="text-primary h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Ministry Growth Analytics
            </h2>
            <p className="text-muted-foreground text-sm">
              Track membership and leadership growth trends
            </p>
          </div>
        </div>

        <div className="bg-card inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
          <Activity className="text-muted-foreground h-3 w-3" />
          <span className="text-xs font-medium">Period:</span>
          <div className="bg-muted/50 flex overflow-hidden rounded border">
            {(["7", "30", "90"] as const).map((p) => (
              <Button
                className="h-7 rounded-none border-0 px-3 text-xs font-medium"
                key={p}
                size="sm"
                variant={period === p ? "default" : "ghost"}
                onClick={() => setPeriod(p)}
              >
                {p}d
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="group from-chart-1/10 via-chart-1/5 relative overflow-hidden border-0 bg-gradient-to-br to-transparent shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-chart-1 text-xs font-medium opacity-90">
                  Total Members
                </p>
                <p className="text-foreground text-xl font-bold">
                  {summary.totalMembers.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs">Church members</p>
              </div>
              <div className="bg-chart-1/20 ring-chart-1/20 rounded-lg p-1.5 ring-1">
                <User className="text-chart-1 h-4 w-4" />
              </div>
            </div>
            <div className="bg-chart-1/5 absolute -right-3 -bottom-3 h-16 w-16 rounded-full blur-lg" />
          </CardContent>
        </Card>

        <Card className="group from-chart-2/10 via-chart-2/5 relative overflow-hidden border-0 bg-gradient-to-br to-transparent shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-chart-2 text-xs font-medium opacity-90">
                  Total Ministers
                </p>
                <p className="text-foreground text-xl font-bold">
                  {summary.totalMinisters.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs">
                  Ministry leaders
                </p>
              </div>
              <div className="bg-chart-2/20 ring-chart-2/20 rounded-lg p-1.5 ring-1">
                <Users className="text-chart-2 h-4 w-4" />
              </div>
            </div>
            <div className="bg-chart-2/5 absolute -right-3 -bottom-3 h-16 w-16 rounded-full blur-lg" />
          </CardContent>
        </Card>

        <Card className="group from-chart-3/10 via-chart-3/5 relative overflow-hidden border-0 bg-gradient-to-br to-transparent shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-chart-3 text-xs font-medium opacity-90">
                  Analysis Period
                </p>
                <p className="text-foreground text-xl font-bold">{period}</p>
                <p className="text-muted-foreground text-xs">days of data</p>
              </div>
              <div className="bg-chart-3/20 ring-chart-3/20 rounded-lg p-1.5 ring-1">
                <Calendar className="text-chart-3 h-4 w-4" />
              </div>
            </div>
            <div className="bg-chart-3/5 absolute -right-3 -bottom-3 h-16 w-16 rounded-full blur-lg" />
          </CardContent>
        </Card>

        <Card className="group from-chart-4/10 via-chart-4/5 relative overflow-hidden border-0 bg-gradient-to-br to-transparent shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-chart-4 text-xs font-medium opacity-90">
                  Forecast Range
                </p>
                <p className="text-foreground text-xl font-bold">7</p>
                <p className="text-muted-foreground text-xs">days ahead</p>
              </div>
              <div className="bg-chart-4/20 ring-chart-4/20 rounded-lg p-1.5 ring-1">
                <TrendingUp className="text-chart-4 h-4 w-4" />
              </div>
            </div>
            <div className="bg-chart-4/5 absolute -right-3 -bottom-3 h-16 w-16 rounded-full blur-lg" />
          </CardContent>
        </Card>
      </div>

      <Card className="ring-border/50 border-0 shadow-xl ring-1">
        <CardHeader className="from-muted/50 to-muted/20 border-b bg-gradient-to-r py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="from-primary to-primary/80 flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg">
                <BarChart3 className="text-primary-foreground h-3 w-3" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Growth Trends Overview
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  Cumulative member and minister growth with{" "}
                  {summary.forecastDays}-day forecast projection
                </p>
              </div>
            </div>
            <Button
              className="h-7 px-2"
              size="sm"
              variant="ghost"
              onClick={() =>
                downloadChart("overview-chart", "growth-trends-overview")
              }
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2" id="overview-chart">
          <ChartContainer className="h-56 w-full" config={chartConfig}>
            <AreaChart
              data={combined}
              height={224}
              margin={{ top: 10, right: 15, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="memberGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(214 100% 50%)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="50%"
                    stopColor="hsl(214 100% 50%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(214 100% 50%)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="ministerGradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(262 83% 58%)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="50%"
                    stopColor="hsl(262 83% 58%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(262 83% 58%)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur result="coloredBlur" stdDeviation="3" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <XAxis
                axisLine={false}
                className="fill-muted-foreground text-xs"
                dataKey="dateFormatted"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                className="fill-muted-foreground text-xs"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <ChartTooltip
                content={<CustomTooltipContent />}
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeOpacity: 0.3,
                }}
              />
              <ChartLegend content={<CustomLegendContent />} />
              <Area
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                  fill: "hsl(214 100% 50%)",
                  filter: "url(#glow)",
                }}
                dataKey="membersCumulative"
                dot={false}
                fill="url(#memberGradient)"
                stackId="1"
                stroke="hsl(214 100% 50%)"
                strokeWidth={3}
                type="monotone"
              />
              <Area
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                  fill: "hsl(262 83% 58%)",
                  filter: "url(#glow)",
                }}
                dataKey="ministersCumulative"
                dot={false}
                fill="url(#ministerGradient)"
                stackId="2"
                stroke="hsl(262 83% 58%)"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="ring-border/50 border-0 shadow-lg ring-1">
          <CardHeader className="from-chart-1/5 to-chart-1/10 border-b bg-gradient-to-r py-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-chart-1/20 rounded-lg p-1">
                    <User className="text-chart-1 h-3 w-3" />
                  </div>
                  Member Growth Trend
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  Cumulative member registrations over time
                </p>
              </div>
              <Button
                className="h-6 px-2"
                size="sm"
                variant="ghost"
                onClick={() =>
                  downloadChart("member-chart", "member-growth-trend")
                }
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2" id="member-chart">
            <ChartContainer className="h-32 w-full" config={chartConfig}>
              <LineChart
                data={combined}
                height={128}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="memberLineGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="hsl(214 100% 50%)" />
                    <stop offset="100%" stopColor="hsl(214 100% 50% / 0.2)" />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={false}
                  className="fill-muted-foreground"
                  dataKey="dateFormatted"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  className="fill-muted-foreground"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <ChartTooltip content={<CustomTooltipContent />} />
                <Line
                  activeDot={{
                    r: 7,
                    strokeWidth: 3,
                    stroke: "hsl(var(--background))",
                    fill: "hsl(214 100% 50%)",
                    filter: "drop-shadow(0 0 6px hsl(214 100% 50%))",
                  }}
                  dataKey="membersCumulative"
                  dot={{
                    fill: "hsl(214 100% 50%)",
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                    r: 4,
                  }}
                  stroke="hsl(214 100% 50%)" // Blue
                  strokeWidth={4}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="ring-border/50 border-0 shadow-lg ring-1">
          <CardHeader className="from-chart-2/5 to-chart-2/10 border-b bg-gradient-to-r py-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-chart-2/20 rounded-lg p-1">
                    <Users className="text-chart-2 h-3 w-3" />
                  </div>
                  Minister Growth Trend
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  Cumulative minister registrations over time
                </p>
              </div>
              <Button
                className="h-6 px-2"
                size="sm"
                variant="ghost"
                onClick={() =>
                  downloadChart("minister-chart", "minister-growth-trend")
                }
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2" id="minister-chart">
            <ChartContainer className="h-32 w-full" config={chartConfig}>
              <LineChart
                data={combined}
                height={128}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="ministerLineGradient"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(262 83% 58%)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(262 83% 58%)"
                      stopOpacity={0.8}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={false}
                  className="fill-muted-foreground"
                  dataKey="dateFormatted"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  className="fill-muted-foreground"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <ChartTooltip content={<CustomTooltipContent />} />
                <Line
                  activeDot={{
                    r: 7,
                    strokeWidth: 3,
                    stroke: "hsl(var(--background))",
                    fill: "hsl(262 83% 58%)",
                    filter: "drop-shadow(0 0 6px hsl(262 83% 58%))",
                  }}
                  dataKey="ministersCumulative"
                  dot={{
                    fill: "hsl(262 83% 58%)",
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                    r: 4,
                  }}
                  stroke="url(#ministerLineGradient)"
                  strokeWidth={4}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
