import { getDashboardData } from "@/services/dashboard";
import { getCurrentManager } from "@/services/session";
import { FinanceOverview } from "./sections/FinanceOverview";
import { NeedsAttention } from "./sections/NeedsAttention";
import { OpenComplaints } from "./sections/OpenComplaints";
import { QuickActions } from "./sections/QuickActions";
import { ResidentsCollections } from "./sections/ResidentsCollections";
import { RoomsOccupancy } from "./sections/RoomsOccupancy";
import { WelcomeHeader } from "./sections/WelcomeHeader";

/**
 * Dashboard → Overview.
 * Answers: "What is happening in my property, and what do I need to do right now?"
 * Order on the page = order of importance: greeting → money & to-dos → rooms & complaints → residents.
 */
export async function OverviewTab() {
  const [data, manager] = await Promise.all([getDashboardData(), getCurrentManager()]);
  const { finance } = data;
  const staleComplaints = data.complaints.filter((c) => c.hoursOpen >= 24).length;

  return (
    <div className="space-y-6">
      <WelcomeHeader firstName={manager.firstName} />

      {/* Row 1: chart gets the most room, then to-dos, then quick actions */}
      <div className="grid grid-cols-12 gap-4 lg:gap-5 wide:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
        <div className="col-span-12 wide:col-span-1">
          <FinanceOverview finance={finance} />
        </div>
        <div className="col-span-12 md:col-span-7 wide:col-span-1">
          <NeedsAttention items={data.attention} staleComplaints={staleComplaints} />
        </div>
        <div className="col-span-12 md:col-span-5 wide:col-span-1">
          <QuickActions schedule={data.schedule} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <div className="col-span-12 wide:col-span-7">
          <RoomsOccupancy summary={data.occupancy} rooms={data.rooms} />
        </div>
        <div className="col-span-12 wide:col-span-5">
          <OpenComplaints complaints={data.complaints} />
        </div>

        <div className="col-span-12">
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
