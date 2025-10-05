import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { gte, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { members } from "@/modules/member/member-schema";
import { ministers } from "@/modules/ministry/ministry-schema";

// Define types for the data structures
type GrowthDataEntry = {
  date: string;
  count: number;
};

type ChartDataEntry = {
  date: string;
  dateFormatted: string;
  members?: number;
  ministers?: number;
  membersCumulative?: number;
  ministersCumulative?: number;
  isForecast?: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const type = searchParams.get("type") || "both"; // 'members', 'ministers', or 'both'

    // Calculate the date threshold (N days ago)
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    // Get member growth data
    let memberGrowthData: GrowthDataEntry[] = [];
    if (type === "members" || type === "both") {
      const memberGrowth = await db
        .select({
          date: sql<string>`DATE(${members.createdAt})`.as("date"),
          count: sql<number>`COUNT(*)::int`.as("count"),
        })
        .from(members)
        .where(gte(members.createdAt, dateThreshold))
        .groupBy(sql`DATE(${members.createdAt})`)
        .orderBy(sql`DATE(${members.createdAt})`);

      memberGrowthData = memberGrowth;
    }

    // Get minister growth data
    let ministerGrowthData: GrowthDataEntry[] = [];
    if (type === "ministers" || type === "both") {
      const ministerGrowth = await db
        .select({
          date: sql<string>`DATE(${ministers.createdAt})`.as("date"),
          count: sql<number>`COUNT(*)::int`.as("count"),
        })
        .from(ministers)
        .where(gte(ministers.createdAt, dateThreshold))
        .groupBy(sql`DATE(${ministers.createdAt})`)
        .orderBy(sql`DATE(${ministers.createdAt})`);

      ministerGrowthData = ministerGrowth;
    }

    // Generate date range for the last N days
    const dateRange = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dateRange.push(date.toISOString().split("T")[0]);
    }

    // Create a complete dataset with zeros for missing dates
    const completeData: ChartDataEntry[] = dateRange.map((date) => {
      const memberEntry = memberGrowthData.find((entry) => entry.date === date);
      const ministerEntry = ministerGrowthData.find(
        (entry) => entry.date === date
      );

      const data: ChartDataEntry = {
        date,
        dateFormatted: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };

      if (type === "members" || type === "both") {
        data.members = memberEntry ? memberEntry.count : 0;
      }

      if (type === "ministers" || type === "both") {
        data.ministers = ministerEntry ? ministerEntry.count : 0;
      }

      return data;
    });

    // Calculate cumulative growth
    let memberCumulative = 0;
    let ministerCumulative = 0;

    const cumulativeData = completeData.map((day) => {
      if (day.members !== undefined) {
        memberCumulative += day.members;
        day.membersCumulative = memberCumulative;
      }

      if (day.ministers !== undefined) {
        ministerCumulative += day.ministers;
        day.ministersCumulative = ministerCumulative;
      }

      return day;
    });

    // Generate simple forecast for next 7 days (basic trend projection)
    const forecastData: ChartDataEntry[] = [];
    const recentData = cumulativeData.slice(-7); // Last 7 days

    // Calculate average daily growth
    const memberAvgGrowth =
      type === "members" || type === "both"
        ? recentData.reduce((sum, day) => sum + (day.members || 0), 0) /
          recentData.length
        : 0;

    const ministerAvgGrowth =
      type === "ministers" || type === "both"
        ? recentData.reduce((sum, day) => sum + (day.ministers || 0), 0) /
          recentData.length
        : 0;

    // Generate forecast for next 7 days
    for (let i = 1; i <= 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(forecastDate.getDate() + i);
      const dateStr = forecastDate.toISOString().split("T")[0];

      const forecast: ChartDataEntry = {
        date: dateStr,
        dateFormatted: forecastDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        isForecast: true,
      };

      if (type === "members" || type === "both") {
        forecast.members = Math.round(
          memberAvgGrowth * (0.8 + Math.random() * 0.4)
        ); // Add some variance
        forecast.membersCumulative = memberCumulative + forecast.members;
        memberCumulative += forecast.members;
      }

      if (type === "ministers" || type === "both") {
        forecast.ministers = Math.round(
          ministerAvgGrowth * (0.8 + Math.random() * 0.4)
        );
        forecast.ministersCumulative = ministerCumulative + forecast.ministers;
        ministerCumulative += forecast.ministers;
      }

      forecastData.push(forecast);
    }

    // Get total counts for summary
    const [memberTotal] = await db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(members);

    const [ministerTotal] = await db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(ministers);

    return NextResponse.json({
      success: true,
      data: {
        historical: cumulativeData,
        forecast: forecastData,
        combined: [...cumulativeData, ...forecastData],
        summary: {
          totalMembers: memberTotal.count,
          totalMinisters: ministerTotal.count,
          period: `Last ${days} days`,
          forecastDays: 7,
        },
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch growth analytics",
      },
      { status: 500 }
    );
  }
}
