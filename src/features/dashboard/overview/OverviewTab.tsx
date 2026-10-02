import { getDashboardData } from "@/services/dashboard";
import { FinanceOverview } from "./sections/FinanceOverview";
import { NeedsAttention } from "./sections/NeedsAttention";
import { OpenComplaints } from "./sections/OpenComplaints";
import { RentCollectionCard } from "./sections/RentCollectionCard";
import { ResidentsCollections } from "./sections/ResidentsCollections";
import { RoomsOccupancy } from "./sections/RoomsOccupancy";
import { WelcomeHeader } from "./sections/WelcomeHeader";

/**
 * Dashboard → Overview.
 * Answers: "What is happening in my property, and what do I need to do right now?"
 * Order on the page = order of importance: greeting & health → to-dos → money → rooms → complaints → residents.
 */
export async function OverviewTab() {
  const data = await getDashboardData();
  const { finance } = data;
  const staleComplaints = data.complaints.filter((c) => c.hoursOpen >= 24).length;

  return (
    <div className="space-y-6">
      <WelcomeHeader
        firstName={data.manager.firstName}
        rentCollectedRate={finance.collectionRate}
        occupancyRate={data.occupancy.occupancyRate}
        complaintsSolvedRate={data.complaintsResolvedRate}
        revenue={finance.revenue}
        revenueChange={finance.revenueChange}
        netProfit={finance.netProfit}
        netProfitChange={finance.netProfitChange}
        overdueCount={data.residents.overdue}
        overdueAmount={finance.overdueRent}
      />

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <div className="col-span-12 md:col-span-7 wide:col-span-5">
          <NeedsAttention items={data.attention} staleComplaints={staleComplaints} />
        </div>
        <div className="col-span-12 md:order-3 wide:order-none wide:col-span-4">
          <FinanceOverview finance={finance} />
        </div>
        <div className="col-span-12 md:order-2 md:col-span-5 wide:order-none wide:col-span-3">
          <RentCollectionCard
            monthLabel={`${finance.monthLabel} rent`}
            rate={finance.collectionRate}
            change={finance.collectionChange}
            expected={finance.expectedRent}
            collected={finance.collectedRent}
            due={finance.dueRent}
            overdue={finance.overdueRent}
          />
        </div>

        <div className="col-span-12 md:order-4 wide:order-none wide:col-span-7">
          <RoomsOccupancy summary={data.occupancy} rooms={data.rooms} />
        </div>
        <div className="col-span-12 md:order-5 wide:order-none wide:col-span-5">
          <OpenComplaints complaints={data.complaints} />
        </div>

        <div className="col-span-12 md:order-6 wide:order-none">
          <ResidentsCollections
            monthLabel={finance.monthLabel}
            residents={data.residents}
            payments={data.payments}
            checkIns={data.checkIns}
            collected={finance.collectedRent}
            expected={finance.expectedRent}
            due={finance.dueRent}
            overdue={finance.overdueRent}
            collectionRate={finance.collectionRate}
          />
        </div>
      </div>
    </div>
  );
}
