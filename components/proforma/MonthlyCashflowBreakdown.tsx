"use client";

import type { MonthlyCashflowRow } from "@/lib/proforma/types";
import {
  formatCAD,
  formatPhase,
  getPhaseColor,
} from "@/lib/utils/formatting";
import { cn } from "@/lib/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

type MonthlyCashflowBreakdownProps = {
  monthlyRows: MonthlyCashflowRow[];
};

export function MonthlyCashflowBreakdown({
  monthlyRows,
}: MonthlyCashflowBreakdownProps) {
  if (monthlyRows.length === 0) {
    return null;
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-md hover:bg-gray-50">
        <span className="font-medium">
          Monthly Cashflow Breakdown ({monthlyRows.length} months)
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-white z-10 border-r min-w-[140px] w-[140px] text-center">
                  Metric
                </TableHead>
                {monthlyRows.map((row) => (
                  <TableHead
                    key={row.monthIndex}
                    className="text-center min-w-[80px]"
                  >
                    M{row.monthIndex}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Phase Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center min-w-[140px] w-[140px]">
                  Phase
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-center">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 text-xs rounded-full whitespace-nowrap",
                        getPhaseColor(row.phase)
                      )}
                    >
                      {formatPhase(row.phase)}
                    </span>
                  </TableCell>
                ))}
              </TableRow>

              {/* Land Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Land
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-right text-sm">
                    {row.land > 0 ? formatCAD(row.land) : "—"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Soft Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Soft
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-right text-sm">
                    {row.soft > 0 ? formatCAD(row.soft) : "—"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Hard Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Hard
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-right text-sm">
                    {row.hard > 0 ? formatCAD(row.hard) : "—"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Interest Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Interest
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-right text-sm">
                    {row.interest > 0 ? formatCAD(row.interest) : "—"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Loan Draw Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Loan Draw
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-right text-sm">
                    {row.loanDraw > 0 ? formatCAD(row.loanDraw) : "—"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Equity Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Equity
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell
                    key={row.monthIndex}
                    className={cn(
                      "text-right text-sm font-medium",
                      row.equity < 0 && "text-red-600",
                      row.equity > 0 && "text-green-600"
                    )}
                  >
                    {formatCAD(row.equity)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Sales Revenue Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Sales Revenue
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell key={row.monthIndex} className="text-right text-sm">
                    {row.salesRevenue > 0 ? formatCAD(row.salesRevenue) : "—"}
                  </TableCell>
                ))}
              </TableRow>

              {/* Debt Balance Row */}
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10 border-r font-medium min-w-[140px] w-[140px] text-center">
                  Debt Balance
                </TableCell>
                {monthlyRows.map((row) => (
                  <TableCell
                    key={row.monthIndex}
                    className="text-right text-sm font-medium"
                  >
                    {formatCAD(row.debtOutstanding)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
