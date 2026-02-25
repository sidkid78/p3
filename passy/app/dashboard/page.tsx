import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getDashboardData } from "@/lib/data"

import Orchestrator from "@/components/navigation/Orchestrator"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default async function DashboardPage() {
  const supabase = await createClient()

  let { data: { user } } = await supabase.auth.getUser()

  // Mock user for local development without active Supabase
  if (!user) {
    user = { id: 'mock-user-id', user_metadata: { name: 'Demo User' } } as any;
  }

  const data = await getDashboardData(user!.id);

  return (
    <DashboardLayout>
      <Orchestrator dashboardData={data} />
    </DashboardLayout>
  )
}
