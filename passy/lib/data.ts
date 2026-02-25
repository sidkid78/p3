export async function getDashboardData(_userId: string) {
  // In a real app, this would be:
  // const supabase = await createClient();
  // const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();

  // Mocking the response delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    user: {
      name: "Sarah",
    },
    event: {
      daysToGo: 45,
      date: "October 15, 2024",
      progress: 65,
      guestCount: 42,
      guestLimit: 50,
      budgetSpent: 1200,
      budgetLimit: 2000,
      status: {
        venue: "Confirmed",
        catering: "Pending",
        guests: "80%",
        theme: "AI Guided"
      }
    },
    tasks: [
      { title: "Send digital invitations", dueDate: "in 2 days", category: "Invites", status: "pending" },
      { title: "Finalize catering menu", dueDate: "in 5 days", category: "Food", status: "pending" },
      { title: "Order custom decorations", dueDate: "in 1 week", category: "Decor", status: "completed" },
    ],
    guests: [
      { id: "1", name: "Emily Watson", rsvp: "confirmed", email: "emily@example.com", diet: "None" },
      { id: "2", name: "David Miller", rsvp: "pending", email: "david@example.com", diet: "Vegetarian" },
      { id: "3", name: "Jessica Alba", rsvp: "declined", email: "jess@example.com", diet: "GF" },
      { id: "4", name: "Robert Dow", rsvp: "confirmed", email: "rdj@example.com", diet: "None" },
    ],
    budgetItems: [
      { id: "1", category: "Venue", amount: 800, spent: 800, status: "paid" },
      { id: "2", category: "Catering", amount: 600, spent: 300, status: "partial" },
      { id: "3", category: "Decorations", amount: 300, spent: 100, status: "pending" },
      { id: "4", category: "Favors", amount: 200, spent: 0, status: "pending" },
    ]
  };
}
